const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const roomManager = require('./RoomManager');

const defaultOrigins = ['https://tunein.curredev.com', 'http://localhost:5173', 'http://localhost:3000'];
const envOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(s => s.trim()).filter(Boolean)
  : [];
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

const app = express();
app.use(cors({
  origin: allowedOrigins
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

// Gestão centralizada de timers por sala
const roundTimeouts = new Map();
const transitionTimeouts = new Map();
const disconnectTimeouts = new Map();
const countdownIntervals = new Map();

const clearPlayerDisconnectTimeout = (roomId, identifier) => {
  const key = `${roomId}_${identifier}`;
  if (disconnectTimeouts.has(key)) {
    clearTimeout(disconnectTimeouts.get(key));
    disconnectTimeouts.delete(key);
  }
};

const clearCountdown = (roomId) => {
  if (countdownIntervals.has(roomId)) {
    clearInterval(countdownIntervals.get(roomId));
    countdownIntervals.delete(roomId);
  }
  const room = roomManager.getRoom(roomId);
  if (room && room.countdown !== null) {
    room.countdown = null;
  }
};

const clearRoomTimers = (roomId) => {
  if (roundTimeouts.has(roomId)) {
    clearTimeout(roundTimeouts.get(roomId));
    roundTimeouts.delete(roomId);
  }
  if (transitionTimeouts.has(roomId)) {
    clearTimeout(transitionTimeouts.get(roomId));
    transitionTimeouts.delete(roomId);
  }
  if (countdownIntervals.has(roomId)) {
    clearInterval(countdownIntervals.get(roomId));
    countdownIntervals.delete(roomId);
  }
  for (const [key, timeout] of disconnectTimeouts.entries()) {
    if (key.startsWith(`${roomId}_`)) {
      clearTimeout(timeout);
      disconnectTimeouts.delete(key);
    }
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

const sanitizePlayerData = (data) => {
  if (!data || typeof data !== 'object') return null;
  const nickname = typeof data.nickname === 'string' ? data.nickname.trim().slice(0, 15) : '';
  const avatar = typeof data.avatar === 'string' ? data.avatar.slice(0, 20000) : '';
  const sessionToken = typeof data.sessionToken === 'string' ? data.sessionToken.trim().slice(0, 100) : null;
  if (!nickname) return null;
  return { nickname, avatar, sessionToken };
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', (playerData, callback) => {
    if (typeof callback !== 'function') return;
    const sanitized = sanitizePlayerData(playerData);
    if (!sanitized) {
      return callback({ success: false, error: 'Nickname is required (max 15 characters)' });
    }

    const roomId = roomManager.createRoom(socket.id);
    const success = roomManager.joinRoom(roomId, { ...sanitized, id: socket.id });
    if (success) {
      socket.join(roomId);
      callback({ success: true, roomId, room: roomManager.getRoom(roomId) });
    } else {
      callback({ success: false, error: 'Failed to create room' });
    }
  });

  socket.on('joinRoom', ({ roomId, playerData }, callback) => {
    if (typeof callback !== 'function') return;
    if (!roomId || typeof roomId !== 'string') {
      return callback({ success: false, error: 'Invalid room code' });
    }
    const cleanRoomId = roomId.trim().toUpperCase().slice(0, 10);
    const sanitized = sanitizePlayerData(playerData);
    if (!sanitized) {
      return callback({ success: false, error: 'Nickname is required (max 15 characters)' });
    }

    if (sanitized.sessionToken) {
      clearPlayerDisconnectTimeout(cleanRoomId, sanitized.sessionToken);
    }
    clearPlayerDisconnectTimeout(cleanRoomId, socket.id);

    const success = roomManager.joinRoom(cleanRoomId, { ...sanitized, id: socket.id });
    if (success) {
      socket.join(cleanRoomId);
      const room = roomManager.getRoom(cleanRoomId);
      io.to(cleanRoomId).emit('roomUpdated', room);
      callback({ success: true, room });
    } else {
      callback({ success: false, error: 'Room not found' });
    }
  });

  socket.on('updateSettings', ({ roomId, settings }) => {
    if (!roomId || typeof roomId !== 'string' || !settings || typeof settings !== 'object') return;
    const cleanRoomId = roomId.trim().toUpperCase();
    const cleanSettings = {};
    if (typeof settings.autoNextRound === 'boolean') cleanSettings.autoNextRound = settings.autoNextRound;
    if (typeof settings.revealLetters === 'boolean') cleanSettings.revealLetters = settings.revealLetters;
    if (typeof settings.showPlaceholders === 'boolean') cleanSettings.showPlaceholders = settings.showPlaceholders;
    if (typeof settings.roundDuration === 'number' && Number.isFinite(settings.roundDuration)) {
      cleanSettings.roundDuration = Math.max(5, Math.min(60, Math.round(settings.roundDuration)));
    }

    const success = roomManager.updateSettings(cleanRoomId, socket.id, cleanSettings);
    if (success) {
      io.to(cleanRoomId).emit('roomUpdated', roomManager.getRoom(cleanRoomId));
    }
  });

  socket.on('skipRound', ({ roomId }) => {
    if (!roomId || typeof roomId !== 'string') return;
    const cleanRoomId = roomId.trim().toUpperCase();
    const room = roomManager.getRoom(cleanRoomId);
    if (room && room.hostId === socket.id && room.state === 'arena') {
      triggerEndRound(cleanRoomId);
    }
  });

  socket.on('setReady', ({ roomId, trackUrl }) => {
    if (!roomId || typeof roomId !== 'string' || !trackUrl || typeof trackUrl !== 'object') return;
    const cleanRoomId = roomId.trim().toUpperCase();
    const cleanTrack = {
      title: typeof trackUrl.title === 'string' ? trackUrl.title.slice(0, 200) : '',
      artist: typeof trackUrl.artist === 'string' ? trackUrl.artist.slice(0, 200) : '',
      artworkUrl: typeof trackUrl.artworkUrl === 'string' ? trackUrl.artworkUrl.slice(0, 500) : '',
      previewUrl: typeof trackUrl.previewUrl === 'string' ? trackUrl.previewUrl.slice(0, 500) : '',
      trackViewUrl: typeof trackUrl.trackViewUrl === 'string' ? trackUrl.trackViewUrl.slice(0, 500) : ''
    };

    roomManager.setPlayerReady(cleanRoomId, socket.id, cleanTrack);
    const room = roomManager.getRoom(cleanRoomId);
    if (!room) return;
    io.to(cleanRoomId).emit('roomUpdated', room);

    if (roomManager.allPlayersReady(cleanRoomId)) {
      clearCountdown(cleanRoomId);
      if (roomManager.startGame(cleanRoomId)) {
        clearRoomTimers(cleanRoomId);
        const updatedRoom = roomManager.getRoom(cleanRoomId);
        io.to(cleanRoomId).emit('gameStarted', updatedRoom);
        startRoundTimer(cleanRoomId, updatedRoom.roundDuration);
      }
    }
  });

  socket.on('startCountdown', ({ roomId }) => {
    if (!roomId || typeof roomId !== 'string') return;
    const cleanRoomId = roomId.trim().toUpperCase();
    const room = roomManager.getRoom(cleanRoomId);
    if (!room || room.hostId !== socket.id || !roomManager.canStartCountdown(cleanRoomId)) return;

    clearCountdown(cleanRoomId);
    room.countdown = 30;
    io.to(cleanRoomId).emit('roomUpdated', room);

    const interval = setInterval(() => {
      const currentRoom = roomManager.getRoom(cleanRoomId);
      if (!currentRoom || currentRoom.state !== 'lobby') {
        clearCountdown(cleanRoomId);
        return;
      }

      const readyCount = currentRoom.players.filter(p => p.ready).length;
      if (readyCount < 2) {
        clearCountdown(cleanRoomId);
        io.to(cleanRoomId).emit('roomUpdated', currentRoom);
        return;
      }

      if (roomManager.allPlayersReady(cleanRoomId)) {
        clearCountdown(cleanRoomId);
        if (roomManager.startGame(cleanRoomId)) {
          clearRoomTimers(cleanRoomId);
          const updatedRoom = roomManager.getRoom(cleanRoomId);
          io.to(cleanRoomId).emit('gameStarted', updatedRoom);
          startRoundTimer(cleanRoomId, updatedRoom.roundDuration);
        }
        return;
      }

      currentRoom.countdown -= 1;
      if (currentRoom.countdown <= 0) {
        clearCountdown(cleanRoomId);
        if (roomManager.startGame(cleanRoomId)) {
          clearRoomTimers(cleanRoomId);
          const updatedRoom = roomManager.getRoom(cleanRoomId);
          io.to(cleanRoomId).emit('gameStarted', updatedRoom);
          startRoundTimer(cleanRoomId, updatedRoom.roundDuration);
        }
      } else {
        io.to(cleanRoomId).emit('roomUpdated', currentRoom);
      }
    }, 1000);

    countdownIntervals.set(cleanRoomId, interval);
  });

  socket.on('cancelCountdown', ({ roomId }) => {
    if (!roomId || typeof roomId !== 'string') return;
    const cleanRoomId = roomId.trim().toUpperCase();
    const room = roomManager.getRoom(cleanRoomId);
    if (!room || room.hostId !== socket.id) return;

    clearCountdown(cleanRoomId);
    io.to(cleanRoomId).emit('roomUpdated', room);
  });

  socket.on('submitChatGuess', ({ roomId, text }, callback) => {
    if (!roomId || typeof roomId !== 'string' || typeof text !== 'string') return;
    const cleanText = text.trim().slice(0, 100);
    if (!cleanText) return;
    const cleanRoomId = roomId.trim().toUpperCase();

    const result = roomManager.handleChatGuess(cleanRoomId, socket.id, cleanText);
    if (!result) return;

    if (result.closeToPlayer) {
      if (typeof callback === 'function') callback({ close: true });
    } else {
      if (typeof callback === 'function') callback({ close: false });
      if (result.broadcast.length > 0) {
        io.to(cleanRoomId).emit('chatMessages', result.broadcast);
      }
      io.to(cleanRoomId).emit('roomUpdated', roomManager.getRoom(cleanRoomId));
    }
  });
  
  socket.on('kickPlayer', ({ roomId, targetId }) => {
    if (!roomId || typeof roomId !== 'string') return;
    const cleanRoomId = roomId.trim().toUpperCase();
    const success = roomManager.kickPlayer(cleanRoomId, socket.id, targetId);
    if (success) {
      io.to(targetId).emit('kicked');
      const updatedRoom = roomManager.getRoom(cleanRoomId);
      if (updatedRoom && updatedRoom.countdown !== null && updatedRoom.players.filter(p => p.ready).length < 2) {
        clearCountdown(cleanRoomId);
      }
      io.to(cleanRoomId).emit('roomUpdated', updatedRoom);
    }
  });

  socket.on('nextRound', ({ roomId }) => {
    if (!roomId || typeof roomId !== 'string') return;
    const cleanRoomId = roomId.trim().toUpperCase();
    clearRoomTimers(cleanRoomId);
    const isPlaying = roomManager.nextRound(cleanRoomId);
    const updatedRoom = roomManager.getRoom(cleanRoomId);
    if (updatedRoom) {
      io.to(cleanRoomId).emit('roomUpdated', updatedRoom);
      if (isPlaying) {
        startRoundTimer(cleanRoomId, updatedRoom.roundDuration);
      }
    }
  });

  socket.on('returnToLobby', ({ roomId }) => {
    if (!roomId || typeof roomId !== 'string') return;
    const cleanRoomId = roomId.trim().toUpperCase();
    clearRoomTimers(cleanRoomId);
    roomManager.resetForNextRound(cleanRoomId);
    io.to(cleanRoomId).emit('roomUpdated', roomManager.getRoom(cleanRoomId));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const [roomId, room] of roomManager.rooms.entries()) {
      const player = room.players.find(p => p.id === socket.id);
      if (player) {
        roomManager.markPlayerDisconnected(roomId, socket.id);
        io.to(roomId).emit('roomUpdated', roomManager.getRoom(roomId));

        // 1-minute disconnect grace period for reconnection
        const identifier = player.sessionToken || socket.id;
        const timeoutKey = `${roomId}_${identifier}`;
        clearPlayerDisconnectTimeout(roomId, identifier);

        const timeout = setTimeout(() => {
          disconnectTimeouts.delete(timeoutKey);
          const currentRoom = roomManager.getRoom(roomId);
          if (currentRoom) {
            const p = currentRoom.players.find(p => (player.sessionToken && p.sessionToken === player.sessionToken) || p.id === player.id);
            if (p && p.connected === false) {
              roomManager.leaveRoom(roomId, p.id);
              const updatedRoom = roomManager.getRoom(roomId);
              if (updatedRoom) {
                io.to(roomId).emit('roomUpdated', updatedRoom);
              } else {
                clearRoomTimers(roomId);
              }
            }
          }
        }, 60000);

        disconnectTimeouts.set(timeoutKey, timeout);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
