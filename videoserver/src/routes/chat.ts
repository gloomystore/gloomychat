import express from 'express';
const router = express.Router();
import { Server } from "socket.io";
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

io.on('connect', function(socket) {
  console.log('웹소켓 사용');
  console.log(socket.id);

  // 채팅방 만들기
  socket.on('joinroom', function(data) {
    console.log(data);
    socket.join('room1');
  });

  // 채팅방1에서만 채팅
  socket.on('room1-send', function(data) {
    console.log(data);
    io.to('room1').emit('broadcast', data);
  });

  // 특정 이벤트 리스너 이름으로 프론트로부터 데이터 받기
  socket.on('user-send', function(data) {
    console.log(data);

    // 전체방송
    io.emit('broadcast', data);

    // 특정 id에게만 방송
    // io.to(socket.id).emit('broadcast', data);
  });
});

export default router;