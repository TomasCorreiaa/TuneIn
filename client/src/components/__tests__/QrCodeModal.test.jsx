import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import QrCodeModal from '../QrCodeModal';

describe('QrCodeModal Component', () => {
  it('não deve renderizar nada quando isOpen for false', () => {
    const { container } = render(
      <QrCodeModal isOpen={false} onClose={() => {}} roomId="ABC123" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar o código da sala e o SVG do QR code quando isOpen for true', () => {
    render(
      <QrCodeModal isOpen={true} onClose={() => {}} roomId="TEST99" />
    );

    expect(screen.getByText('TEST99')).toBeInTheDocument();
    // Deve conter elemento svg do qrcode
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('deve chamar onClose ao clicar no botão de fechar', () => {
    const handleClose = vi.fn();
    render(
      <QrCodeModal isOpen={true} onClose={handleClose} roomId="TEST99" />
    );

    const closeButtons = screen.getAllByRole('button');
    // Clicar no primeiro botão de fechar (X)
    fireEvent.click(closeButtons[0]);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('deve copiar o link ao clicar em copiar', () => {
    const writeTextMock = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <QrCodeModal isOpen={true} onClose={() => {}} roomId="TEST99" />
    );

    const copyBtn = screen.getByText('Copiar Link');
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('/TEST99'));
  });
});
