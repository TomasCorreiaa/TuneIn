import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LanguageSwitcher from '../LanguageSwitcher';

describe('LanguageSwitcher Component', () => {
  it('deve renderizar o idioma atual e permitir abrir o dropdown', () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Clicar para abrir
    fireEvent.click(button);

    // Deve mostrar as opções de idiomas
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('PT')).toBeInTheDocument();
    expect(screen.getByText('ES')).toBeInTheDocument();
  });

  it('deve permitir trocar o idioma ao clicar numa opção', () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const ptOption = screen.getByText('PT');
    fireEvent.click(ptOption);

    // Deve salvar no localStorage
    expect(localStorage.getItem('tunein_language')).toBe('pt-PT');
  });
});
