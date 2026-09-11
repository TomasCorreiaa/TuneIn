import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SettingsModal from '../SettingsModal';

describe('SettingsModal Component', () => {
  const mockSocket = {
    emit: vi.fn(),
  };

  const room = {
    id: 'ROOM_MODAL_TEST',
    hostId: 'host-1',
    autoNextRound: true,
    roundDuration: 30,
    revealLetters: true,
    showPlaceholders: true,
  };

  it('não deve renderizar nada quando isOpen for false', () => {
    const { container } = render(
      <SettingsModal 
        isOpen={false} 
        onClose={() => {}} 
        room={room} 
        socket={mockSocket} 
        isHost={true} 
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar as opções de configuração quando aberto', () => {
    render(
      <SettingsModal 
        isOpen={true} 
        onClose={() => {}} 
        room={room} 
        socket={mockSocket} 
        isHost={true} 
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByLabelText(/Avanço Automático|Auto Next Round/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tempo por Ronda|Round Duration/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Placeholder/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Revelar letras|Reveal letters/i)).toBeInTheDocument();
  });

  it('deve emitir eventos socket quando o anfitrião altera as definições', () => {
    render(
      <SettingsModal 
        isOpen={true} 
        onClose={() => {}} 
        room={room} 
        socket={mockSocket} 
        isHost={true} 
      />
    );

    // Mudar round duration
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '20' } });
    expect(mockSocket.emit).toHaveBeenCalledWith('updateSettings', {
      roomId: 'ROOM_MODAL_TEST',
      settings: { roundDuration: 20 },
    });

    // Mudar auto next round
    const autoNextCheckbox = screen.getByLabelText(/Avanço Automático|Auto Next Round/i);
    fireEvent.click(autoNextCheckbox);
    expect(mockSocket.emit).toHaveBeenCalledWith('updateSettings', {
      roomId: 'ROOM_MODAL_TEST',
      settings: { autoNextRound: false },
    });
  });

  it('deve desativar os controlos quando não for o anfitrião', () => {
    render(
      <SettingsModal 
        isOpen={true} 
        onClose={() => {}} 
        room={room} 
        socket={mockSocket} 
        isHost={false} 
      />
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.getByLabelText(/Avanço Automático|Auto Next Round/i)).toBeDisabled();
    expect(screen.getByText(/Apenas o Host|Only the Host/i)).toBeInTheDocument();
  });

  it('deve chamar onClose ao clicar no botão de fechar', () => {
    const handleClose = vi.fn();
    render(
      <SettingsModal 
        isOpen={true} 
        onClose={handleClose} 
        room={room} 
        socket={mockSocket} 
        isHost={true} 
      />
    );

    const closeBtn = screen.getByLabelText(/Fechar|Close/i);
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
