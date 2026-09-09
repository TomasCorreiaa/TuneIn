const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { RoomManager } = require('../RoomManager');

describe('Server - Gestão de Temporizadores e Prevenção de Transição Inválida', () => {
  it('Temporizador atrasado não deve forçar estado results se a sala já estiver em lobby', async () => {
    const manager = new RoomManager();
    const roomId = manager.createRoom('host');
    manager.joinRoom(roomId, { id: 'host', nickname: 'Host' });
    manager.joinRoom(roomId, { id: 'p2', nickname: 'Guest' });

    manager.setPlayerReady(roomId, 'host', { title: 'Song 1', artist: 'Artist 1' });
    manager.setPlayerReady(roomId, 'p2', { title: 'Song 2', artist: 'Artist 2' });
    manager.startGame(roomId);

    assert.equal(manager.getRoom(roomId).state, 'arena');

    // Suponhamos que o jogo termina e os jogadores voltam ao lobby
    manager.endGame(roomId);
    manager.resetForNextRound(roomId);
    assert.equal(manager.getRoom(roomId).state, 'lobby');

    // Se um timer órfão ou atrasado tentar executar endGame:
    const result = manager.endGame(roomId);
    assert.equal(result, false);
    // O estado da sala deve permanecer estritamente em lobby
    assert.equal(manager.getRoom(roomId).state, 'lobby');
  });

  it('Limpeza centralizada de temporizadores com Map previne memory leaks e chamadas pendentes', () => {
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

    let executed = false;
    const t1 = setTimeout(() => { executed = true; }, 100);
    const t2 = setTimeout(() => { executed = true; }, 100);

    roundTimeouts.set('ROOM1', t1);
    transitionTimeouts.set('ROOM1', t2);

    assert.equal(roundTimeouts.has('ROOM1'), true);
    assert.equal(transitionTimeouts.has('ROOM1'), true);

    clearRoomTimers('ROOM1');

    assert.equal(roundTimeouts.has('ROOM1'), false);
    assert.equal(transitionTimeouts.has('ROOM1'), false);

    // Aguardar o tempo que levaria a disparar
    return new Promise((resolve) => {
      setTimeout(() => {
        assert.equal(executed, false, 'O temporizador cancelado não deveria ter sido executado');
        resolve();
      }, 150);
    });
  });
});
