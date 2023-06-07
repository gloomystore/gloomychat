const addSocket = (io, server, connectToDatabase) => {
  let users = {}; // 어떤 방에 어떤 유저가 들어있는지
  let socketRoom = {}; // socket.id 기준으로 어떤 방에 들어있는지
  const ioServer = io(server, {
    cors: {
      origin: ['http://local.gloomy-store.com:3020', 'https://local.gloomy-store.com:3020', 'http://local.gloomy-store.com', 'http://chat.gloomy-store.com', 'https://chat.gloomy-store.com', 'http://chat.gloomy-store.com:3020', 'http://localhost:3020', 'https://localhost:3020','http://192.168.0.144:3020','https://192.168.0.144:3020'],
      methods: ['GET', 'POST']
    },
  });

  ioServer.on('connection', (socket) => {
    console.log(socket.id, "connection");

    socket.on('msgSend', async (data) => {
      console.log(data);
      const { db } = await connectToDatabase();
      const dbGloomyChat = db.collection('chats');
      const result = await dbGloomyChat.updateOne(
        { parentId: data.parentId },
        {
          $push: {
            chat: {
              email: data.email,
              msg: data.msg,
              time: data.time
            }
          }
        }
      );
      if (result.modifiedCount > 0) {
        const result = await dbGloomyChat.findOne({ parentId: data.parentId });
        ioServer.to(data.parentId).emit('broadcast', result);
      }
    });

    socket.on('joinroom', async (data) => {
      console.log('//////////');
      console.log(data);
      console.log('//////////');
      const { uuid } = data;

      if (users[uuid]) {
        const currentRoomLength = users[uuid].length;
        if (currentRoomLength === 53) {
          socket.emit("room_full");
          return;
        }
      } else {
        users[uuid] = [];
      }

      users[uuid].push({ id: socket.id });
      socketRoom[socket.id] = uuid;

      socket.join(uuid);

      const others = users[uuid].filter((user) => user.id !== socket.id);
      if (others.length) {
        socket.emit("all_users", others);
      }

      ioServer.to(uuid).emit('broadcast', users);
    });

    socket.on('leaveroom', (data) => {
      const { uuid } = data;
      const roomID = socketRoom[socket.id];

      if (users[roomID]) {
        users[roomID] = users[roomID].filter((user) => user.id !== socket.id);
        if (users[roomID].length === 0) {
          delete users[roomID];
          return;
        }
      }
      delete socketRoom[socket.id];
      socket.leave(uuid);
    });

    socket.on('disconnect', () => {
      console.log('웹소켓 연결 종료');
      const roomID = socketRoom[socket.id];
      if (users[roomID]) {
        users[roomID] = users[roomID].filter((user) => user.id !== socket.id);
        if (users[roomID].length === 0) {
          delete users[roomID];
          return;
        }
      }
      delete socketRoom[socket.id];
      //나간거 알려주기
      ioServer.emit('broadcast', users);
    });
  });
};

export default addSocket;