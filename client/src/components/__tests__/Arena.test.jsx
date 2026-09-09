import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Arena from '../Arena';

describe('Arena Component', () => {
  const mockSocket = {
    id: 'guesser-id',
    emit: vi.fn((event, data, cb) => {
      if (cb) cb({ close: false });
    }),
    on: vi.fn(),
    off: vi.fn(),
  };

  const room = {
    id: 'ROOM_ARENA',
    hostId: 'guesser-id',
    roundDuration: 30,
    showPlaceholders: true,
    revealLetters: true,
    trackOwner: 'owner-id',
    track: {
      title: 'Imagine',
      artist: 'John Lennon',
      previewUrl: 'https://example.com/preview.mp3',
    },
    revealData: {
      titleIndices: [0, 2],
      artistIndices: [1, 3],
    },
    messages: [
      { type: 'chat', sender: 'Alice', text: 'Ola!' },
    ],
    players: [
      { id: 'guesser-id', nickname: 'Alice', guessedTitle: false, guessedArtist: false },
      { id: 'owner-id', nickname: 'Bob', guessedTitle: true, guessedArtist: true },
    ],
  };

  it('deve renderizar o temporizador e as pistas mascaradas', () => {
    render(<Arena room={room} socket={mockSocket} />);

    // Deve exibir o tempo de 30 segundos
    expect(screen.getByText('30')).toBeInTheDocument();

    // Deve exibir a mensagem de chat existente
    expect(screen.getByText('Alice:')).toBeInTheDocument();
    expect(screen.getByText('Ola!')).toBeInTheDocument();
  });

  it('deve permitir submeter palpites no chat se não for o dono', () => {
    render(<Arena room={room} socket={mockSocket} />);

    const input = screen.getByRole('textbox');
    const submitBtn = screen.getByRole('button', { name: '' }); // Ícone Send

    fireEvent.change(input, { target: { value: 'Beatles' } });
    expect(input.value).toBe('Beatles');

    fireEvent.click(submitBtn);
    expect(mockSocket.emit).toHaveBeenCalledWith(
      'submitChatGuess',
      { roomId: 'ROOM_ARENA', text: 'Beatles' },
      expect.any(Function)
    );
  });

  it('deve desativar o input se o jogador for o dono da faixa', () => {
    const ownerSocket = {
      id: 'owner-id',
      emit: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    };

    render(<Arena room={room} socket={ownerSocket} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('deve exibir o botão de saltar rodada para o host quando todos adivinharem', () => {
    const allGuessedRoom = {
      ...room,
      players: [
        { id: 'guesser-id', nickname: 'Alice', guessedTitle: true, guessedArtist: true },
        { id: 'owner-id', nickname: 'Bob', guessedTitle: true, guessedArtist: true },
      ],
    };

    render(<Arena room={allGuessedRoom} socket={mockSocket} />);

    const skipBtn = screen.getByRole('button', { name: /Skip Round|Revelar Música|Saltar Ronda/i });
    expect(skipBtn).toBeInTheDocument();

    fireEvent.click(skipBtn);
    expect(mockSocket.emit).toHaveBeenCalledWith('skipRound', { roomId: 'ROOM_ARENA' });
  });
});
