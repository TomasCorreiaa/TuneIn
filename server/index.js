const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const roomManager = require('./RoomManager');

const app = express();
app.use(cors({
  origin: ['https://tunein.curredev.com', 'http://localhost:5173', 'http://localhost:3000']
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://tunein.curredev.com', 'http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

// Gestão centralizada de timers por sala
const roundTimeouts = new Map();
const transitionTimeouts = new Map();

const clearRoomTimers = (roomId) => {
  if (roundTimeouts.has(roomId)) {
    clearTimeout(roundTimeouts.get(roomId));
    roundTimeouts.delete(roomId);
  }
  if (transitionTimeouts.has(roomId)) {
    clearTimeout(transitionTimeouts.get(roomId));
    transitionTimeouts.delete(roomId);
  }
};

const triggerEndRound = (roomId) => {
  if (roundTimeouts.has(roomId)) {
    clearTimeout(roundTimeouts.get(roomId));
    roundTimeouts.delete(roomId);
  }

  const room = roomManager.getRoom(roomId);
  if (!room || room.state !== 'arena') return;

  const ended = roomManager.endGame(roomId);
  if (!ended) return;

  const endRoom = roomManager.getRoom(roomId);
  if (!endRoom) return;
  
  io.to(roomId).emit('gameEnded', endRoom);

  if (endRoom.autoNextRound && endRoom.currentRound < endRoom.tracksToPlay.length - 1) {
    const timeout = setTimeout(() => {
      transitionTimeouts.delete(roomId);
      const isPlaying = roomManager.nextRound(roomId);
      const newRoom = roomManager.getRoom(roomId);
      if (newRoom) {
        io.to(roomId).emit('roomUpdated', newRoom);
        if (isPlaying) {
          startRoundTimer(roomId, newRoom.roundDuration);
        }
      }
    }, 5000);
    transitionTimeouts.set(roomId, timeout);
  }
};

const startRoundTimer = (roomId, durationSeconds) => {
  clearRoomTimers(roomId);
  
  const timeout = setTimeout(() => {
    triggerEndRound(roomId);
  }, durationSeconds * 1000);
  
  roundTimeouts.set(roomId, timeout);
};

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

  socket.on('skipRound', ({ roomId }) => {
    const room = roomManager.getRoom(roomId);
    if (room && room.hostId === socket.id && room.state === 'arena') {
      triggerEndRound(roomId);
    }
  });

  socket.on('setReady', ({ roomId, trackUrl }) => {
    roomManager.setPlayerReady(roomId, socket.id, trackUrl);
    const room = roomManager.getRoom(roomId);
    io.to(roomId).emit('roomUpdated', room);

    if (roomManager.allPlayersReady(roomId)) {
      if (roomManager.startGame(roomId)) {
        clearRoomTimers(roomId);
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
    clearRoomTimers(roomId);
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
    clearRoomTimers(roomId);
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
        } else {
          clearRoomTimers(roomId);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
