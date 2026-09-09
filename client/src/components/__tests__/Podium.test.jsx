import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Podium from '../Podium';

describe('Podium Component', () => {
  const mockSocket = {
    id: 'host-1',
    emit: vi.fn(),
  };

  const players = [
    { id: 'host-1', nickname: 'Campeao', score: 300, avatar: 'avatar1.png' },
    { id: 'p2', nickname: 'Segundo', score: 200, avatar: 'avatar2.png' },
    { id: 'p3', nickname: 'Terceiro', score: 100, avatar: 'avatar3.png' },
    { id: 'p4', nickname: 'Quarto', score: 50, avatar: 'avatar4.png' },
  ];

  const room = {
    id: 'ROOM_PODIUM',
    hostId: 'host-1',
    players,
  };

  it('deve renderizar o Top 3 com as pontuações e avatares respetivos', () => {
    render(<Podium room={room} socket={mockSocket} />);

    expect(screen.getByText('Campeao')).toBeInTheDocument();
    expect(screen.getByText('300 pts')).toBeInTheDocument();

    expect(screen.getByText('Segundo')).toBeInTheDocument();
    expect(screen.getByText('200 pts')).toBeInTheDocument();

    expect(screen.getByText('Terceiro')).toBeInTheDocument();
    expect(screen.getByText('100 pts')).toBeInTheDocument();
  });

  it('deve renderizar a secção de restantes jogadores para quem ficou abaixo do 3º lugar', () => {
    render(<Podium room={room} socket={mockSocket} />);

    expect(screen.getByText('Quarto')).toBeInTheDocument();
    expect(screen.getByText('50 pts')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('deve permitir que o anfitrião clique no botão para voltar ao lobby', () => {
    render(<Podium room={room} socket={mockSocket} />);

    const returnBtn = screen.getByRole('button');
    expect(returnBtn).toBeInTheDocument();

    fireEvent.click(returnBtn);
    expect(mockSocket.emit).toHaveBeenCalledWith('returnToLobby', { roomId: 'ROOM_PODIUM' });
  });

  it('deve exibir mensagem de espera para jogadores que não são anfitriões', () => {
    const guestSocket = {
      id: 'p2',
      emit: vi.fn(),
    };

    render(<Podium room={room} socket={guestSocket} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
