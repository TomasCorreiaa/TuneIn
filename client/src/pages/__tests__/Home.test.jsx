import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Home from '../Home';
import * as SocketContextModule from '../../context/SocketContext';

describe('Home Page', () => {
  const mockSocket = {
    emit: vi.fn(),
  };

  vi.spyOn(SocketContextModule, 'useSocket').mockReturnValue(mockSocket);

  it('deve renderizar o título e campos de entrada', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('TuneIn')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/JogadorMusical|PlayerMusical/i)).toBeInTheDocument();
  });

  it('deve manter o botão de criar sala desativado se o nickname estiver vazio', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const createBtn = screen.getByRole('button', { name: /Criar Sala|Create Room/i });
    expect(createBtn).toBeDisabled();

    // Inserir nickname
    const input = screen.getByPlaceholderText(/JogadorMusical|PlayerMusical/i);
    fireEvent.change(input, { target: { value: 'Alice' } });

    expect(createBtn).not.toBeDisabled();
  });

  it('deve emitir createRoom com o nickname e avatar ao clicar em criar sala', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/JogadorMusical|PlayerMusical/i);
    fireEvent.change(input, { target: { value: 'Alice' } });

    const createBtn = screen.getByRole('button', { name: /Criar Sala|Create Room/i });
    fireEvent.click(createBtn);

    expect(mockSocket.emit).toHaveBeenCalledWith(
      'createRoom',
      expect.objectContaining({ nickname: 'Alice' }),
      expect.any(Function)
    );
  });
});
