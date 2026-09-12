import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Lobby from '../Lobby';

describe('Lobby Component', () => {
  const mockSocket = {
    id: 'host-id',
    emit: vi.fn(),
  };

  const room = {
    id: 'ROOM_LOBBY',
    hostId: 'host-id',
    autoNextRound: true,
    roundDuration: 30,
    revealLetters: true,
    showPlaceholders: true,
    players: [
      { id: 'host-id', nickname: 'Alice', avatar: 'avatar1.png', ready: false, gamesWon: 2 },
      { id: 'guest-id', nickname: 'Bob', avatar: 'avatar2.png', ready: true, gamesWon: 0 },
    ],
  };

  it('deve listar os jogadores e seus estados de prontidão', () => {
    render(<Lobby room={room} socket={mockSocket} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // gamesWon
  });

  it('deve permitir que o anfitrião altere as configurações da sala', () => {
    render(<Lobby room={room} socket={mockSocket} />);

    // Abrir o modal de configurações através da roda dentada
    const settingsBtn = screen.getByRole('button', { name: /Definições da Sala|Room Settings/i });
    fireEvent.click(settingsBtn);

    // Mudar a duração da rodada
    const selectDuration = screen.getByRole('combobox');
    fireEvent.change(selectDuration, { target: { value: '20' } });

    expect(mockSocket.emit).toHaveBeenCalledWith('updateSettings', {
      roomId: 'ROOM_LOBBY',
      settings: { roundDuration: 20 },
    });

    // Mudar checkbox de autoNextRound
    const checkbox = screen.getByLabelText(/Avanço Automático/i);
    fireEvent.click(checkbox);

    expect(mockSocket.emit).toHaveBeenCalledWith('updateSettings', {
      roomId: 'ROOM_LOBBY',
      settings: { autoNextRound: false },
    });
  });

  it('deve permitir ao anfitrião expulsar outro participante', () => {
    render(<Lobby room={room} socket={mockSocket} />);

    const kickBtn = screen.getByTitle(/Expulsar|Kick/i);
    fireEvent.click(kickBtn);

    expect(mockSocket.emit).toHaveBeenCalledWith('kickPlayer', {
      roomId: 'ROOM_LOBBY',
      targetId: 'guest-id',
    });
  });

  it('deve manter o botão desativado até ser selecionada uma música', () => {
    render(<Lobby room={room} socket={mockSocket} />);

    const readyBtn = screen.getByRole('button', { name: /Escolhe uma música|Pick a song/i });
    expect(readyBtn).toBeDisabled();
  });

  it('deve exibir botão para o host iniciar contagem se pelo menos 2 jogadores tiverem escolhido música', () => {
    const roomWithReady = {
      ...room,
      players: [
        { id: 'host-id', nickname: 'Alice', avatar: 'a1.png', ready: true },
        { id: 'guest-id', nickname: 'Bob', avatar: 'a2.png', ready: true },
        { id: 'guest-2', nickname: 'Charlie', avatar: 'a3.png', ready: false },
      ],
    };

    render(<Lobby room={roomWithReady} socket={mockSocket} />);

    const startTimerBtn = screen.getByRole('button', { name: /Começar Jogo \(30s\)|Start Game \(30s\)/i });
    expect(startTimerBtn).toBeInTheDocument();

    fireEvent.click(startTimerBtn);
    expect(mockSocket.emit).toHaveBeenCalledWith('startCountdown', { roomId: 'ROOM_LOBBY' });
  });

  it('deve exibir o banner de contagem regressiva quando countdown estiver ativo', () => {
    const countdownRoom = {
      ...room,
      countdown: 25,
    };

    render(<Lobby room={countdownRoom} socket={mockSocket} />);

    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText(/O jogo começa em 25s|Game starts in 25s/i)).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: /Cancelar|Cancel/i });
    expect(cancelBtn).toBeInTheDocument();

    fireEvent.click(cancelBtn);
    expect(mockSocket.emit).toHaveBeenCalledWith('cancelCountdown', { roomId: 'ROOM_LOBBY' });
  });
});
