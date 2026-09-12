const VERSION_SUFFIX_REGEX = /\s+-\s+(?:.*(?:remaster|radio|edit|live|version|mix|bonus|deluxe|acoustic|mono|stereo|anniversary|instrumental|feat|ft|extended|clean|explicit).*)$/i;

function cleanString(str) {
  if (!str) return '';
  // Remove content inside parenthesis or brackets
  let cleaned = str.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '');
  // Remove trailing version/remaster suffixes after hyphen
  cleaned = cleaned.replace(VERSION_SUFFIX_REGEX, '');
  // Remove accents/diacritics and lowercase
  cleaned = cleaned.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  // Replace hyphens and slashes with space, remove other special characters
  cleaned = cleaned.replace(/[-/]/g, ' ');
  cleaned = cleaned.replace(/[^a-z0-9\s]/g, "");
  // Collapse whitespace
  return cleaned.replace(/\s+/g, ' ').trim();
}

function cleanForDisplay(str) {
  if (!str) return '';
  // Remove content inside parenthesis or brackets
  let cleaned = str.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '');
  // Remove trailing version/remaster suffixes after hyphen
  cleaned = cleaned.replace(VERSION_SUFFIX_REGEX, '');
  // Remove extra spaces and trim
  return cleaned.replace(/\s{2,}/g, ' ').trim();
}

function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
      }
    }
  }
  return matrix[b.length][a.length];
}

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    do {
      code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.rooms.has(code));
    return code;
  }

  createRoom(hostId) {
    const roomId = this.generateRoomCode();
    this.rooms.set(roomId, {
      id: roomId,
      hostId,
      players: [],
      countdown: null,
      state: 'lobby',
      track: null,
      trackOwner: null,
      roundStartTime: null,
      messages: [], // For chat history
      autoNextRound: true,
      roundDuration: 30,
      revealLetters: true,
      showPlaceholders: true,
      currentRound: 0,
      tracksToPlay: []
    });
    return roomId;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  joinRoom(roomId, player) {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    
    let existingPlayer = null;
    if (player.sessionToken) {
      existingPlayer = room.players.find(p => p.sessionToken === player.sessionToken);
    }
    if (!existingPlayer) {
      existingPlayer = room.players.find(p => p.id === player.id);
    }

    if (existingPlayer) {
      const oldId = existingPlayer.id;
      existingPlayer.id = player.id;
      existingPlayer.connected = true;
      if (player.sessionToken && !existingPlayer.sessionToken) {
        existingPlayer.sessionToken = player.sessionToken;
      }

      if (room.hostId === oldId) {
        room.hostId = player.id;
      }
      if (room.trackOwner === oldId) {
        room.trackOwner = player.id;
      }
      if (room.tracksToPlay) {
        room.tracksToPlay.forEach(t => {
          if (t.ownerId === oldId) t.ownerId = player.id;
        });
      }
      return true;
    }

    room.players.push({
      ...player,
      connected: true,
      ready: false,
      score: 0,
      gamesWon: 0,
      guessedTitle: false,
      guessedArtist: false,
      trackChoice: null
    });
    return true;
  }

  markPlayerDisconnected(roomId, playerId) {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    const player = room.players.find(p => p.id === playerId);
    if (player) {
      player.connected = false;
      return player;
    }
    return null;
  }

  leaveRoom(roomId, playerId) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    
    room.players = room.players.filter(p => p.id !== playerId);
    if (room.players.length === 0) {
      this.rooms.delete(roomId);
    } else if (room.hostId === playerId) {
      room.hostId = room.players[0].id;
    }
  }
  
  kickPlayer(roomId, hostId, targetId) {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    if (room.hostId === hostId && hostId !== targetId) {
      room.players = room.players.filter(p => p.id !== targetId);
      return true;
    }
    return false;
  }

  setPlayerReady(roomId, playerId, trackUrl) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    
    const player = room.players.find(p => p.id === playerId);
    if (player) {
      player.ready = true;
      player.trackChoice = trackUrl;
    }
  }

  allPlayersReady(roomId) {
    const room = this.rooms.get(roomId);
    if (!room || room.players.length < 2) return false;
    return room.players.every(p => p.ready);
  }

  canStartCountdown(roomId) {
    const room = this.rooms.get(roomId);
    if (!room || room.state !== 'lobby') return false;
    const readyCount = room.players.filter(p => p.ready).length;
    return readyCount >= 2 && !this.allPlayersReady(roomId);
  }

  updateSettings(roomId, hostId, settings) {
    const room = this.rooms.get(roomId);
    if (!room || room.hostId !== hostId) return false;
    
    if (settings.autoNextRound !== undefined) room.autoNextRound = settings.autoNextRound;
    if (settings.roundDuration !== undefined) room.roundDuration = settings.roundDuration;
    if (settings.revealLetters !== undefined) room.revealLetters = settings.revealLetters;
    if (settings.showPlaceholders !== undefined) room.showPlaceholders = settings.showPlaceholders;
    
    return true;
  }

  startGame(roomId) {
    const room = this.rooms.get(roomId);
    if (!room || room.state !== 'lobby') return false;
    
    const playersWithTracks = room.players.filter(p => p.trackChoice);
    if (playersWithTracks.length === 0) return false;
    
    const shuffledTracks = [...playersWithTracks].sort(() => Math.random() - 0.5);
    room.tracksToPlay = shuffledTracks.map(p => ({ ownerId: p.id, track: p.trackChoice }));
    room.currentRound = 0;
    
    this.setupRound(roomId);
    
    return true;
  }

  setupRound(roomId) {
    const room = this.rooms.get(roomId);
    if (!room || !room.tracksToPlay || room.tracksToPlay.length === 0) return;

    const roundData = room.tracksToPlay[room.currentRound];
    room.trackOwner = roundData.ownerId;
    room.track = {
      ...roundData.track,
      title: cleanForDisplay(roundData.track.title),
      artist: cleanForDisplay(roundData.track.artist)
    };
    room.state = 'arena';
    room.roundStartTime = Date.now();
    room.messages = [];

    const getAlphaIndices = (str) => {
      const indices = [];
      const normalizedStr = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      for (let i = 0; i < normalizedStr.length; i++) {
        if (/[a-zA-Z0-9]/.test(normalizedStr[i])) {
          indices.push(i);
        }
      }
      return indices;
    };

    const generateRevealIndices = (str) => {
      if (!str) return [];
      const alphaIndices = getAlphaIndices(str);
      const numToReveal = Math.floor(alphaIndices.length / 2);
      for (let i = alphaIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [alphaIndices[i], alphaIndices[j]] = [alphaIndices[j], alphaIndices[i]];
      }
      return alphaIndices.slice(0, numToReveal);
    };

    room.revealData = {
      titleIndices: generateRevealIndices(room.track.title),
      artistIndices: generateRevealIndices(room.track.artist)
    };
    
    room.players.forEach(p => {
      p.guessedTitle = false;
      p.guessedArtist = false;
      if (p.id === room.trackOwner) {
        p.guessedTitle = true;
        p.guessedArtist = true;
      }
    });
  }

  nextRound(roomId) {
    const room = this.rooms.get(roomId);
    if (!room || room.state !== 'results') return false;
    
    room.currentRound++;
    if (room.currentRound < room.tracksToPlay.length) {
      this.setupRound(roomId);
      return true; // Continuar jogo
    } else {
      room.state = 'podium';
      return false; // Fim do jogo
    }
  }

  handleChatGuess(roomId, playerId, text) {
    const room = this.rooms.get(roomId);
    if (!room || room.state !== 'arena') return null;
    
    const player = room.players.find(p => p.id === playerId);
    if (!player || player.id === room.trackOwner) return null; // Owner can't play

    const timeElapsed = (Date.now() - room.roundStartTime) / 1000;
    const timeLeft = Math.max(0, room.roundDuration - timeElapsed);
    
    const cleanGuess = cleanString(text);
    const cleanTitle = cleanString(room.track.title);
    const cleanArtist = cleanString(room.track.artist);

    const stripSpaces = (s) => (s || '').replace(/\s+/g, '');
    const strippedGuess = stripSpaces(cleanGuess);
    const strippedTitle = stripSpaces(cleanTitle);

    let isClose = false;
    const events = []; // Events to emit back

    // Check Artist
    if (!player.guessedArtist) {
      const artistParts = (room.track.artist || '')
        .split(/\s+(?:feat\.?|ft\.?|featuring|&|with|x|vs\.?)\s+|,/i)
        .map(p => cleanString(p))
        .filter(p => p.length > 0);

      const artistCandidates = Array.from(new Set([cleanArtist, ...artistParts]));
      let guessedArtist = false;

      for (const candidate of artistCandidates) {
        const strippedCandidate = stripSpaces(candidate);
        const dist = levenshtein(cleanGuess, candidate);

        if (dist === 0 || (strippedGuess.length > 2 && strippedGuess === strippedCandidate)) {
          guessedArtist = true;
          break;
        } else if (dist <= 2 && candidate.length > 3) {
          isClose = true;
        }
      }

      if (guessedArtist) {
        player.guessedArtist = true;
        const points = 50 + Math.floor((timeLeft / room.roundDuration) * 25);
        player.score += points;
        
        events.push({
          type: 'system',
          key: 'player_guessed_artist',
          params: { nickname: player.nickname, points },
          text: `${player.nickname} acertou o Artista! (+${points} pts)`,
          correct: true
        });

        // Bónus para quem escolheu a música
        const owner = room.players.find(p => p.id === room.trackOwner);
        if (owner) {
          const ownerPoints = 25;
          owner.score += ownerPoints;
          events.push({
            type: 'system',
            key: 'owner_bonus_artist',
            params: { nickname: owner.nickname, points: ownerPoints },
            text: `${owner.nickname} recebeu +${ownerPoints} pts pela sua escolha de artista!`,
            correct: true
          });
        }
      }
    }

    // Check Title
    if (!player.guessedTitle) {
      const dist = levenshtein(cleanGuess, cleanTitle);
      const guessedTitle = dist === 0 || (strippedGuess.length > 2 && strippedGuess === strippedTitle);

      if (guessedTitle) {
        player.guessedTitle = true;
        const points = 100 + Math.floor((timeLeft / room.roundDuration) * 50);
        player.score += points;
        
        events.push({
          type: 'system',
          key: 'player_guessed_title',
          params: { nickname: player.nickname, points },
          text: `${player.nickname} acertou o Título! (+${points} pts)`,
          correct: true
        });

        // Bónus para quem escolheu a música
        const owner = room.players.find(p => p.id === room.trackOwner);
        if (owner) {
          const ownerPoints = 50;
          owner.score += ownerPoints;
          events.push({
            type: 'system',
            key: 'owner_bonus_title',
            params: { nickname: owner.nickname, points: ownerPoints },
            text: `${owner.nickname} recebeu +${ownerPoints} pts pela sua escolha de música!`,
            correct: true
          });
        }
      } else if (dist <= 2 && cleanTitle.length > 3) {
        isClose = true;
      }
    }

    if (events.length > 0) {
      // User guessed something correct, do not broadcast the text they typed
      room.messages.push(...events);
      return { broadcast: events, closeToPlayer: false };
    }

    if (isClose) {
      // Only notify this player it was close
      return { broadcast: [], closeToPlayer: true };
    }

    // Normal wrong guess, broadcast as chat
    const chatMsg = {
      type: 'chat',
      sender: player.nickname,
      text: text
    };
    room.messages.push(chatMsg);
    
    return { broadcast: [chatMsg], closeToPlayer: false };
  }

  endGame(roomId) {
    const room = this.rooms.get(roomId);
    if (!room || room.state !== 'arena') return false;
    room.state = 'results';
    return true;
  }

  resetForNextRound(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    
    if (room.state === 'results' || room.state === 'podium') {
      const highestScore = Math.max(...room.players.map(p => p.score));
      if (highestScore > 0) {
        room.players.forEach(p => {
          if (p.score === highestScore) {
            p.gamesWon = (p.gamesWon || 0) + 1;
          }
        });
      }
    }
    
    room.state = 'lobby';
    room.countdown = null;
    room.track = null;
    room.trackOwner = null;
    room.roundStartTime = null;
    room.messages = [];
    room.currentRound = 0;
    room.tracksToPlay = [];
    room.players.forEach(p => {
      p.ready = false;
      p.guessedTitle = false;
      p.guessedArtist = false;
      p.trackChoice = null;
      p.score = 0; // Reset score for new game
    });
  }
}

const defaultInstance = new RoomManager();
defaultInstance.RoomManager = RoomManager;
defaultInstance.cleanString = cleanString;
defaultInstance.cleanForDisplay = cleanForDisplay;
defaultInstance.levenshtein = levenshtein;

module.exports = defaultInstance;
