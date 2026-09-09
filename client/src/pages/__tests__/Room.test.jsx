import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Room from '../Room';
import * as SocketContextModule from '../../context/SocketContext';

describe('Room Page', () => {
  const mockSocket = {
    id: 'player-1',
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  };

  vi.spyOn(SocketContextModule, 'useSocket').mockReturnValue(mockSocket);

  const createInitialRoom = (state) => ({
    id: 'ABC123',
    hostId: 'player-1',
    state,
    roundDuration: 30,
    currentRound: 0,
    tracksToPlay: [],
    players: [
      { id: 'player-1', nickname: 'Alice', ready: false, score: 0 },
    ],
  });

  it('deve renderizar o Lobby quando room.state for "lobby"', () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: '/room/ABC123', state: { initialRoom: createInitialRoom('lobby') } }]}
      >
        <Routes>
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('deve permitir copiar o link da sala', () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: '/room/ABC123', state: { initialRoom: createInitialRoom('lobby') } }]}
      >
        <Routes>
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </MemoryRouter>
    );

    const copyBtn = screen.getByTitle(/Copiar link da sala/i);
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
