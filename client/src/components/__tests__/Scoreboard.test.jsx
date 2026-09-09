import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Scoreboard from '../Scoreboard';

describe('Scoreboard Component', () => {
  const mockSocket = {
    id: 'player-1',
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  };

  const baseRoom = {
    id: 'ROOM1',
    hostId: 'player-1',
    currentRound: 0,
    tracksToPlay: [
      { ownerId: 'player-1', track: { title: 'Song 1', artist: 'Artist 1' } },
      { ownerId: 'player-2', track: { title: 'Song 2', artist: 'Artist 2' } },
    ],
    track: {
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      artworkUrl: 'https://example.com/artwork-100x100bb.jpg',
      trackViewUrl: 'https://music.apple.com/song-1',
    },
    trackOwner: 'player-1',
    autoNextRound: true,
    players: [
      { id: 'player-1', nickname: 'Alice', score: 120, avatar: 'avatar1.png', guessedTitle: true, guessedArtist: true },
      { id: 'player-2', nickname: 'Bob', score: 80, avatar: 'avatar2.png', guessedTitle: false, guessedArtist: true },
    ],
  };

  it('deve renderizar os detalhes da faixa revelada e imagem de alta resolução', () => {
    render(<Scoreboard room={baseRoom} socket={mockSocket} />);

    expect(screen.getByText('Bohemian Rhapsody')).toBeInTheDocument();
    expect(screen.getByText('Queen')).toBeInTheDocument();

    const img = screen.getByAltText('Album Art');
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('500x500bb.jpg');

    // Link do Apple Music
    const appleLink = screen.getByRole('link');
    expect(appleLink).toHaveAttribute('href', 'https://music.apple.com/song-1');
  });

  it('deve renderizar o placar e contagem quando não for a última rodada', () => {
    render(<Scoreboard room={baseRoom} socket={mockSocket} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();

    // Contagem automática inicializada
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('deve renderizar botão para avançar rodada se autoNextRound for false e for o host', () => {
    const manualRoom = {
      ...baseRoom,
      autoNextRound: false,
    };

    render(<Scoreboard room={manualRoom} socket={mockSocket} />);

    const nextBtn = screen.getByRole('button');
    expect(nextBtn).toBeInTheDocument();

    fireEvent.click(nextBtn);
    expect(mockSocket.emit).toHaveBeenCalledWith('nextRound', { roomId: 'ROOM1' });
  });

  it('deve renderizar o Podium se for a última rodada', () => {
    const lastRoundRoom = {
      ...baseRoom,
      currentRound: 1, // 1 === 2 - 1
    };

    render(<Scoreboard room={lastRoundRoom} socket={mockSocket} />);

    // Deve conter elementos do Podium (ex: 1º e 2º lugar com os scores)
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    // Botão de voltar ao lobby deve estar visível para o host
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
