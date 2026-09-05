const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const roomManager = require('./RoomManager');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', (playerData, callback) => {
    const roomId = roomManager.createRoom(socket.id);
    const success = roomManager.joinRoom(roomId, { ...playerData, id: socket.id });
    if (success) {
      socket.join(roomId);
      callback({ success: true, roomId, room: roomManager.getRoom(roomId) });
    } else {
      callback({ success: false, error: 'Failed to create room' });
    }
  });

  socket.on('joinRoom', ({ roomId, playerData }, callback) => {
    const success = roomManager.joinRoom(roomId, { ...playerData, id: socket.id });
    if (success) {
      socket.join(roomId);
      const room = roomManager.getRoom(roomId);
      io.to(roomId).emit('roomUpdated', room);
      callback({ success: true, room });
    } else {
      callback({ success: false, error: 'Room not found' });
    }
  });

  socket.on('updateSettings', ({ roomId, settings }) => {
    const success = roomManager.updateSettings(roomId, socket.id, settings);
    if (success) {
      io.to(roomId).emit('roomUpdated', roomManager.getRoom(roomId));
    }
  });

  const startRoundTimer = (roomId, durationSeconds) => {
    setTimeout(() => {
      roomManager.endGame(roomId);
      const endRoom = roomManager.getRoom(roomId);
      if (!endRoom) return;
      
      io.to(roomId).emit('gameEnded', endRoom);

      if (endRoom.autoNextRound && endRoom.currentRound < endRoom.tracksToPlay.length - 1) {
        setTimeout(() => {
          const isPlaying = roomManager.nextRound(roomId);
          const newRoom = roomManager.getRoom(roomId);
          if (newRoom) {
            io.to(roomId).emit('roomUpdated', newRoom);
            if (isPlaying) {
              startRoundTimer(roomId, newRoom.roundDuration);
            }
          }
        }, 5000);
      }
    }, durationSeconds * 1000);
  };

  socket.on('setReady', ({ roomId, trackUrl }) => {
    roomManager.setPlayerReady(roomId, socket.id, trackUrl);
    const room = roomManager.getRoom(roomId);
    io.to(roomId).emit('roomUpdated', room);

    if (roomManager.allPlayersReady(roomId)) {
      if (roomManager.startGame(roomId)) {
        const updatedRoom = roomManager.getRoom(roomId);
        io.to(roomId).emit('gameStarted', updatedRoom);
        
        startRoundTimer(roomId, updatedRoom.roundDuration);
      }
    }
  });

  socket.on('submitChatGuess', ({ roomId, text }, callback) => {
    const result = roomManager.handleChatGuess(roomId, socket.id, text);
    if (!result) return;

    if (result.closeToPlayer) {
      // Respond to the user that they are close
      callback({ close: true });
    } else {
      // Broadcast events/chats
      callback({ close: false });
      if (result.broadcast.length > 0) {
        io.to(roomId).emit('chatMessages', result.broadcast);
      }
      io.to(roomId).emit('roomUpdated', roomManager.getRoom(roomId));
    }
  });
  
  socket.on('kickPlayer', ({ roomId, targetId }) => {
    const success = roomManager.kickPlayer(roomId, socket.id, targetId);
    if (success) {
      io.to(targetId).emit('kicked');
      
      const updatedRoom = roomManager.getRoom(roomId);
      io.to(roomId).emit('roomUpdated', updatedRoom);
    }
  });

  socket.on('nextRound', ({ roomId }) => {
    const isPlaying = roomManager.nextRound(roomId);
    const updatedRoom = roomManager.getRoom(roomId);
    if (updatedRoom) {
      io.to(roomId).emit('roomUpdated', updatedRoom);
      if (isPlaying) {
        startRoundTimer(roomId, updatedRoom.roundDuration);
      }
    }
  });

  socket.on('returnToLobby', ({ roomId }) => {
    roomManager.resetForNextRound(roomId);
    io.to(roomId).emit('roomUpdated', roomManager.getRoom(roomId));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Find all rooms this user is in (could optimize this)
    for (const [roomId, room] of roomManager.rooms.entries()) {
      if (room.players.some(p => p.id === socket.id)) {
        roomManager.leaveRoom(roomId, socket.id);
        const updatedRoom = roomManager.getRoom(roomId);
        if (updatedRoom) {
          io.to(roomId).emit('roomUpdated', updatedRoom);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
