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

    socket.on('join_room', (data) => {
      // ...
    });

    socket.on('msgSend', async (data) => {
      console.log(data);
      const { db } = await connectToDatabase();
      const dbGloomyChat = db.collection('chats');
      const result = await dbGloomyChat.updateOne(
        { parentId: data.parentId }, // 쿼리 조건: parentId 필드를 사용하여 문서 찾기
        {
          $push: { // 기존 'chat' 필드에 데이터 추가
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
      console.log('//////////')
      console.log(data)
      console.log('//////////')
      const { uuid } = data;

      if (users[uuid]) {
        const currentRoomLength = users[uuid].length;
        if (currentRoomLength === 53) {
          socket.to(socket.id).emit("room_full");
          return;
        }

        users[uuid] = [...users[uuid], { id: socket.id }];
      } else {
        users[uuid] = [{ id: socket.id }];
      }
      socketRoom[socket.id] = uuid;

      socket.join(uuid);

      const others = users[uuid].filter((user) => user.id !== socket.id);
      if (others.length) {
        ioServer.sockets.to(socket.id).emit("all_users", others);
      }

      socket.join(uuid);
      ioServer.to(uuid).emit('broadcast', data);
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

    console.log(socket.id, "connection video");
    socket.on("join_room", (data) => {
      if (users[data.room]) {
        const currentRoomLength = users[data.room].length;
        if (currentRoomLength === 10) {
          socket.to(socket.id).emit("room_full");
          return;
        }

        users[data.room] = [...users[data.room], { id: socket.id }];
      } else {
        users[data.room] = [{ id: socket.id }];
      }
      socketRoom[socket.id] = data.room;

      socket.join(data.room);

      const others = users[data.room].filter((user) => user.id !== socket.id);
      if (others.length) {
        ioServer.sockets.to(socket.id).emit("all_users", others);
      }
    });

    socket.on("offer", (sdp, roomName) => {
      socket.to(roomName).emit("getOffer", sdp);
    });

    socket.on("answer", (sdp, roomName) => {
      socket.to(roomName).emit("getAnswer", sdp);
    });

    socket.on("candidate", (candidate, roomName) => {
      socket.to(roomName).emit("getCandidate", candidate);
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
    });
  });
};

export default addSocket;