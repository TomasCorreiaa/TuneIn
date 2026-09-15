import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import ThemeToggle from '../ThemeToggle';
import '../../i18n';

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light');
    document.documentElement.removeAttribute('data-theme');
  });

  it('deve renderizar o botão de alternância de tema claro/escuro', () => {
    render(<ThemeToggle />);
    const button = screen.getByTestId('theme-toggle-btn');
    expect(button).toBeInTheDocument();
  });

  it('deve alternar para modo claro ao clicar e salvar no localStorage', () => {
    render(<ThemeToggle />);
    const button = screen.getByTestId('theme-toggle-btn');

    // Inicialmente modo escuro
    expect(document.documentElement.classList.contains('light')).toBe(false);

    // Clicar para ativar light mode
    fireEvent.click(button);

    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(localStorage.getItem('tunein_theme')).toBe('light');

    // Clicar novamente para voltar ao dark mode
    fireEvent.click(button);

    expect(document.documentElement.classList.contains('light')).toBe(false);
    expect(localStorage.getItem('tunein_theme')).toBe('dark');
  });

  it('deve inicializar com o tema salvo no localStorage', () => {
    localStorage.setItem('tunein_theme', 'light');
    render(<ThemeToggle />);

    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('não deve renderizar o botão de desativar tema quando o tema é default', () => {
    render(<ThemeToggle />);
    expect(screen.queryByTestId('toggle-seasonal-theme-btn')).toBeNull();
  });

  it('deve exibir opção de desativar tema personalizado ao lado quando houver tema aplicado', () => {
    // Simular tema sazonal ativo
    localStorage.setItem('tunein_dev_seasonal_theme', 'halloween');
    render(<ThemeToggle />);

    const seasonalBtn = screen.getByTestId('toggle-seasonal-theme-btn');
    expect(seasonalBtn).toBeInTheDocument();

    // Clicar para desativar tema sazonal
    fireEvent.click(seasonalBtn);
    expect(localStorage.getItem('tunein_seasonal_disabled')).toBe('true');

    // Clicar novamente para reativar
    fireEvent.click(seasonalBtn);
    expect(localStorage.getItem('tunein_seasonal_disabled')).toBeNull();
  });
});
