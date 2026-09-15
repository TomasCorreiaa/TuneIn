import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import DevThemeTester from '../DevThemeTester';

describe('DevThemeTester Component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('deve renderizar o botão da barra dev em ambiente de teste/dev', () => {
    render(<DevThemeTester />);
    const button = screen.getByRole('button', { name: /Testar Temas/i });
    expect(button).toBeInTheDocument();
  });

  it('deve abrir a lista de temas ao clicar no botão', () => {
    render(<DevThemeTester />);
    const button = screen.getByRole('button', { name: /Testar Temas/i });
    fireEvent.click(button);

    expect(screen.getByText(/Simulador de Temas/i)).toBeInTheDocument();
    expect(screen.getByText('Halloween')).toBeInTheDocument();
    expect(screen.getByText('Natal')).toBeInTheDocument();
    expect(screen.getByText('Ano Novo')).toBeInTheDocument();
  });

  it('deve aplicar o tema selecionado no documentElement e salvar no localStorage', () => {
    render(<DevThemeTester />);
    fireEvent.click(screen.getByRole('button', { name: /Testar Temas/i }));

    const halloweenBtn = screen.getByRole('button', { name: /Halloween/i });
    fireEvent.click(halloweenBtn);

    expect(document.documentElement.getAttribute('data-theme')).toBe('halloween');
    expect(localStorage.getItem('tunein_dev_seasonal_theme')).toBe('halloween');
  });

  it('deve remover o override ao selecionar Auto', () => {
    localStorage.setItem('tunein_dev_seasonal_theme', 'christmas');
    render(<DevThemeTester />);
    fireEvent.click(screen.getByRole('button', { name: /Testar Temas/i }));

    const autoBtn = screen.getByRole('button', { name: /Auto/i });
    fireEvent.click(autoBtn);

    expect(localStorage.getItem('tunein_dev_seasonal_theme')).toBeNull();
  });
});
