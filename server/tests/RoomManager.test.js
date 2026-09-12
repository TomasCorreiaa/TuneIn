const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { RoomManager, cleanString, cleanForDisplay, levenshtein } = require('../RoomManager');

describe('RoomManager - Funções Auxiliares', () => {
  it('cleanString deve remover parênteses, colchetes, acentuação e pontuação', () => {
    assert.equal(cleanString('Song Title (feat. Artist) [Remix]'), 'song title');
    assert.equal(cleanString('Árvore de Natal & Canção!'), 'arvore de natal cancao');
    assert.equal(cleanString('Song Title - Remastered 2020'), 'song title');
    assert.equal(cleanString('Song - Radio Edit'), 'song');
    assert.equal(cleanString(''), '');
    assert.equal(cleanString(null), '');
  });

  it('cleanForDisplay deve remover parênteses e múltiplos espaços mantendo o texto limpo', () => {
    assert.equal(cleanForDisplay('Song (Deluxe Version)'), 'Song');
    assert.equal(cleanForDisplay('Artist  [Live at Wembley]  '), 'Artist');
    assert.equal(cleanForDisplay('Thunderstruck - Remastered 2020'), 'Thunderstruck');
    assert.equal(cleanForDisplay('Song - Radio Edit'), 'Song');
    assert.equal(cleanForDisplay(''), '');
    assert.equal(cleanForDisplay(null), '');
  });

  it('levenshtein deve calcular a distância de edição corretamente', () => {
    assert.equal(levenshtein('queen', 'queen'), 0);
    assert.equal(levenshtein('quen', 'queen'), 1);
    assert.equal(levenshtein('quenn', 'queen'), 1);
    assert.equal(levenshtein('quxxn', 'queen'), 2);
    assert.equal(levenshtein('', 'abc'), 3);
    assert.equal(levenshtein('abc', ''), 3);
  });
});

describe('RoomManager - Gestão de Salas e Jogadores', () => {
  let manager;

  beforeEach(() => {
    manager = new RoomManager();
  });

  it('createRoom deve criar uma sala com valores padrão e código único', () => {
    const roomId = manager.createRoom('host-123');
    assert.equal(typeof roomId, 'string');
    assert.equal(roomId.length, 6);

    const room = manager.getRoom(roomId);
    assert.ok(room);
    assert.equal(room.id, roomId);
    assert.equal(room.hostId, 'host-123');
    assert.equal(room.state, 'lobby');
    assert.equal(room.autoNextRound, true);
    assert.equal(room.roundDuration, 30);
    assert.equal(room.revealLetters, true);
    assert.equal(room.showPlaceholders, true);
    assert.deepEqual(room.players, []);
  });

  it('joinRoom deve adicionar jogadores sem duplicar o mesmo id', () => {
    const roomId = manager.createRoom('host-123');
    
    const added1 = manager.joinRoom(roomId, { id: 'p1', nickname: 'Alice', avatar: 'avatar1.png' });
    const added2 = manager.joinRoom(roomId, { id: 'p2', nickname: 'Bob', avatar: 'avatar2.png' });
    const addedDup = manager.joinRoom(roomId, { id: 'p1', nickname: 'Alice Dup', avatar: 'avatar1.png' });

    assert.equal(added1, true);
    assert.equal(added2, true);
    assert.equal(addedDup, true);

    const room = manager.getRoom(roomId);
    assert.equal(room.players.length, 2);
    assert.equal(room.players[0].nickname, 'Alice');
    assert.equal(room.players[0].ready, false);
    assert.equal(room.players[0].score, 0);
  });

  it('joinRoom deve falhar se a sala não existir', () => {
    const res = manager.joinRoom('NOPE99', { id: 'p1', nickname: 'Ghost' });
    assert.equal(res, false);
  });

  it('leaveRoom deve remover o jogador e transferir o host se o anfitrião sair', () => {
    const roomId = manager.createRoom('host-123');
    manager.joinRoom(roomId, { id: 'host-123', nickname: 'Host' });
    manager.joinRoom(roomId, { id: 'player-2', nickname: 'NextHost' });

    manager.leaveRoom(roomId, 'host-123');
    const room = manager.getRoom(roomId);
    assert.equal(room.players.length, 1);
    assert.equal(room.hostId, 'player-2');

    // Ao sair o último jogador, a sala é apagada
    manager.leaveRoom(roomId, 'player-2');
    assert.equal(manager.getRoom(roomId), undefined);
  });

  it('kickPlayer deve permitir que o anfitrião expulse outro jogador', () => {
    const roomId = manager.createRoom('host-123');
    manager.joinRoom(roomId, { id: 'host-123', nickname: 'Host' });
    manager.joinRoom(roomId, { id: 'player-2', nickname: 'Troll' });

    // Jogador normal a tentar expulsar
    const failKick = manager.kickPlayer(roomId, 'player-2', 'host-123');
    assert.equal(failKick, false);

    // Host a tentar expulsar-se a si próprio
    const failSelf = manager.kickPlayer(roomId, 'host-123', 'host-123');
    assert.equal(failSelf, false);

    // Host a expulsar outro jogador com sucesso
    const okKick = manager.kickPlayer(roomId, 'host-123', 'player-2');
    assert.equal(okKick, true);
    assert.equal(manager.getRoom(roomId).players.length, 1);
  });

  it('updateSettings deve permitir que apenas o host altere definições', () => {
    const roomId = manager.createRoom('host-123');
    
    // Tentativa por não host
    const failUpdate = manager.updateSettings(roomId, 'someone-else', { roundDuration: 45 });
    assert.equal(failUpdate, false);

    // Host atualiza
    const okUpdate = manager.updateSettings(roomId, 'host-123', {
      roundDuration: 20,
      autoNextRound: false,
      revealLetters: false,
      showPlaceholders: false
    });
    assert.equal(okUpdate, true);

    const room = manager.getRoom(roomId);
    assert.equal(room.roundDuration, 20);
    assert.equal(room.autoNextRound, false);
    assert.equal(room.revealLetters, false);
    assert.equal(room.showPlaceholders, false);
  });
});

describe('RoomManager - Ciclo de Vida do Jogo', () => {
  let manager;
  let roomId;

  beforeEach(() => {
    manager = new RoomManager();
    roomId = manager.createRoom('p1');
    manager.joinRoom(roomId, { id: 'p1', nickname: 'Alice' });
    manager.joinRoom(roomId, { id: 'p2', nickname: 'Bob' });
  });

  it('setPlayerReady e allPlayersReady devem validar o estado dos jogadores', () => {
    assert.equal(manager.allPlayersReady(roomId), false);

    manager.setPlayerReady(roomId, 'p1', { title: 'Bohemian Rhapsody', artist: 'Queen' });
    assert.equal(manager.allPlayersReady(roomId), false);

    manager.setPlayerReady(roomId, 'p2', { title: 'Imagine', artist: 'John Lennon' });
    assert.equal(manager.allPlayersReady(roomId), true);
  });

  it('startGame deve falhar se a sala não estiver em lobby', () => {
    manager.setPlayerReady(roomId, 'p1', { title: 'Bohemian Rhapsody', artist: 'Queen' });
    manager.setPlayerReady(roomId, 'p2', { title: 'Imagine', artist: 'John Lennon' });

    const started = manager.startGame(roomId);
    assert.equal(started, true);

    const room = manager.getRoom(roomId);
    assert.equal(room.state, 'arena');

    // Tentativa de reiniciar enquanto está em arena deve falhar
    const startAgain = manager.startGame(roomId);
    assert.equal(startAgain, false);
  });

  it('startGame deve baralhar faixas e iniciar a primeira rodada', () => {
    manager.setPlayerReady(roomId, 'p1', { title: 'Song 1', artist: 'Artist 1' });
    manager.setPlayerReady(roomId, 'p2', { title: 'Song 2', artist: 'Artist 2' });

    manager.startGame(roomId);
    const room = manager.getRoom(roomId);

    assert.equal(room.tracksToPlay.length, 2);
    assert.equal(room.currentRound, 0);
    assert.ok(room.track);
    assert.ok(room.trackOwner);
    assert.equal(room.state, 'arena');
    assert.ok(room.revealData);

    // O dono da música deve começar com título e artista como já adivinhados
    const owner = room.players.find(p => p.id === room.trackOwner);
    const guesser = room.players.find(p => p.id !== room.trackOwner);
    assert.equal(owner.guessedTitle, true);
    assert.equal(owner.guessedArtist, true);
    assert.equal(guesser.guessedTitle, false);
    assert.equal(guesser.guessedArtist, false);
  });

  it('handleChatGuess deve pontuar acertador e notificar proximidade', () => {
    manager.setPlayerReady(roomId, 'p1', { title: 'Yellow Submarine', artist: 'The Beatles' });
    manager.setPlayerReady(roomId, 'p2', { title: 'Thriller', artist: 'Michael Jackson' });
    manager.startGame(roomId);

    const room = manager.getRoom(roomId);
    const guesser = room.players.find(p => p.id !== room.trackOwner);
    const owner = room.players.find(p => p.id === room.trackOwner);

    // Dono não pode jogar
    const ownerGuess = manager.handleChatGuess(roomId, owner.id, 'Yellow Submarine');
    assert.equal(ownerGuess, null);

    // Tentativa próxima do artista (distância Levenshtein <= 2)
    const targetArtist = room.track.artist;
    const closeArtist = targetArtist.slice(0, -1);
    const closeRes = manager.handleChatGuess(roomId, guesser.id, closeArtist);
    assert.equal(closeRes.closeToPlayer, true);
    assert.deepEqual(closeRes.broadcast, []);

    // Acertar o artista
    const correctArtistRes = manager.handleChatGuess(roomId, guesser.id, targetArtist);
    assert.equal(correctArtistRes.closeToPlayer, false);
    // Deve emitir mensagem de acerto do adivinhador e mensagem de bónus do dono da faixa
    assert.equal(correctArtistRes.broadcast.length, 2);
    assert.equal(guesser.guessedArtist, true);
    assert.ok(guesser.score > 0);
    assert.equal(owner.score, 25); // Dono recebe 25 pts pelo artista

    // Acertar o título
    const targetTitle = room.track.title;
    const correctTitleRes = manager.handleChatGuess(roomId, guesser.id, targetTitle);
    assert.equal(correctTitleRes.closeToPlayer, false);
    assert.equal(guesser.guessedTitle, true);
    assert.equal(owner.score, 75); // 25 + 50 pts pelo título

    // Palpite normal após acertar tudo é tratado como chat
    const chatRes = manager.handleChatGuess(roomId, guesser.id, 'bom jogo!');
    assert.equal(chatRes.closeToPlayer, false);
    assert.equal(chatRes.broadcast[0].type, 'chat');
    assert.equal(chatRes.broadcast[0].text, 'bom jogo!');
  });

  it('endGame e nextRound devem transitar de estado com segurança', () => {
    manager.setPlayerReady(roomId, 'p1', { title: 'Track A', artist: 'Artist A' });
    manager.setPlayerReady(roomId, 'p2', { title: 'Track B', artist: 'Artist B' });
    manager.startGame(roomId);

    // endGame só aceita estado arena
    assert.equal(manager.endGame(roomId), true);
    const room = manager.getRoom(roomId);
    assert.equal(room.state, 'results');

    // Chamar endGame novamente em estado results deve retornar false
    assert.equal(manager.endGame(roomId), false);

    // Avançar para a 2ª rodada
    const hasNext = manager.nextRound(roomId);
    assert.equal(hasNext, true);
    assert.equal(room.currentRound, 1);
    assert.equal(room.state, 'arena');

    // Terminar 2ª rodada
    manager.endGame(roomId);
    assert.equal(room.state, 'results');

    // nextRound na última rodada deve levar ao podium
    const hasNext2 = manager.nextRound(roomId);
    assert.equal(hasNext2, false);
    assert.equal(room.state, 'podium');
  });

  it('resetForNextRound deve atribuir vitórias e limpar a sala para o lobby', () => {
    manager.setPlayerReady(roomId, 'p1', { title: 'Track A', artist: 'Artist A' });
    manager.setPlayerReady(roomId, 'p2', { title: 'Track B', artist: 'Artist B' });
    manager.startGame(roomId);

    // Atribuir pontos a p1
    const room = manager.getRoom(roomId);
    room.players[0].score = 150;
    room.players[1].score = 50;

    manager.endGame(roomId);
    manager.nextRound(roomId); // round 1
    manager.endGame(roomId);
    manager.nextRound(roomId); // podium
    assert.equal(room.state, 'podium');

    manager.resetForNextRound(roomId);
    assert.equal(room.state, 'lobby');
    assert.equal(room.players[0].gamesWon, 1);
    assert.equal(room.players[1].gamesWon, 0);
    assert.equal(room.players[0].score, 0);
    assert.equal(room.players[1].score, 0);
    assert.equal(room.players[0].ready, false);
    assert.equal(room.tracksToPlay.length, 0);
    assert.equal(room.currentRound, 0);
    assert.equal(room.track, null);
  });

  it('joinRoom com sessionToken deve reconectar jogador preservando pontuação e atualizando socket', () => {
    const roomId = manager.createRoom('socket-host');
    manager.joinRoom(roomId, { id: 'socket-p1', sessionToken: 'token-abc', nickname: 'Alice' });
    manager.joinRoom(roomId, { id: 'socket-p2', sessionToken: 'token-xyz', nickname: 'Bob' });

    const room = manager.getRoom(roomId);
    room.players[0].score = 250;

    // Simular que o socket-p1 caiu e voltou com socket-p1-new
    manager.markPlayerDisconnected(roomId, 'socket-p1');
    assert.equal(room.players[0].connected, false);

    const reconnected = manager.joinRoom(roomId, { id: 'socket-p1-new', sessionToken: 'token-abc' });
    assert.equal(reconnected, true);
    assert.equal(room.players.length, 2);
    assert.equal(room.players[0].id, 'socket-p1-new');
    assert.equal(room.players[0].connected, true);
    assert.equal(room.players[0].score, 250);
  });

  it('handleChatGuess deve aceitar palpites sem carateres especiais, hífens ou apóstrofos e aceitar artistas convidados', () => {
    const roomId = manager.createRoom('host');
    manager.joinRoom(roomId, { id: 'host', nickname: 'Host' });
    manager.joinRoom(roomId, { id: 'p2', nickname: 'Player' });

    manager.setPlayerReady(roomId, 'host', { 
      title: "Spider-Man: Can't Stop!", 
      artist: 'The Weeknd feat. Daft Punk' 
    });
    manager.setPlayerReady(roomId, 'p2', { title: 'Track 2', artist: 'Artist 2' });
    manager.startGame(roomId);

    // Garantir que a faixa ativa é a do host
    const room = manager.getRoom(roomId);
    room.track = {
      title: "Spider-Man: Can't Stop!",
      artist: "The Weeknd feat. Daft Punk"
    };
    room.trackOwner = 'host';

    // Palpite do título sem hífens, sem dois pontos, sem apóstrofo
    const guess1 = manager.handleChatGuess(roomId, 'p2', 'spiderman cant stop');
    assert.ok(guess1);
    assert.equal(room.players[1].guessedTitle, true);

    // Palpite do artista adivinhando o artista convidado 'Daft Punk'
    const guess2 = manager.handleChatGuess(roomId, 'p2', 'daft punk');
    assert.ok(guess2);
    assert.equal(room.players[1].guessedArtist, true);
  });

  it('canStartCountdown deve retornar true apenas se pelo menos 2 jogadores estiverem prontos mas nem todos', () => {
    const cRoomId = manager.createRoom('host');
    manager.joinRoom(cRoomId, { id: 'host', nickname: 'Host' });
    manager.joinRoom(cRoomId, { id: 'p2', nickname: 'P2' });
    manager.joinRoom(cRoomId, { id: 'p3', nickname: 'P3' });

    assert.equal(manager.canStartCountdown(cRoomId), false);

    // 1 jogador pronto
    manager.setPlayerReady(cRoomId, 'host', { title: 'T1', artist: 'A1' });
    assert.equal(manager.canStartCountdown(cRoomId), false);

    // 2 jogadores prontos de 3
    manager.setPlayerReady(cRoomId, 'p2', { title: 'T2', artist: 'A2' });
    assert.equal(manager.canStartCountdown(cRoomId), true);

    // 3 jogadores prontos de 3 (todos prontos -> canStartCountdown deve ser false)
    manager.setPlayerReady(cRoomId, 'p3', { title: 'T3', artist: 'A3' });
    assert.equal(manager.canStartCountdown(cRoomId), false);
  });

  it('setupRound deve incluir dígitos nos índices elegíveis para revelação progressiva', () => {
    const numRoomId = manager.createRoom('host');
    manager.joinRoom(numRoomId, { id: 'host', nickname: 'Host' });
    manager.joinRoom(numRoomId, { id: 'p2', nickname: 'P2' });

    manager.setPlayerReady(numRoomId, 'host', { title: '1999', artist: 'Prince' });
    manager.setPlayerReady(numRoomId, 'p2', { title: '24K Magic', artist: 'Bruno Mars' });
    manager.startGame(numRoomId);

    const room = manager.getRoom(numRoomId);
    assert.ok(room.revealData);
    // Para '1999', deve gerar índices elegíveis para os 4 dígitos
    const activeTrack = room.track;
    if (activeTrack.title === '1999') {
      assert.ok(room.revealData.titleIndices.length > 0);
    }
  });
});
