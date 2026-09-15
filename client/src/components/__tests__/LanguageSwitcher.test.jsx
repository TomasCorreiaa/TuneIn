import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LanguageSwitcher from '../LanguageSwitcher';

describe('LanguageSwitcher Component', () => {
  it('deve renderizar o idioma atual e permitir abrir o dropdown', () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Clicar para abrir
    fireEvent.click(button);

    // Deve mostrar as opções de idiomas no dropdown
    const dropdown = screen.getByTestId('language-dropdown');
    expect(within(dropdown).getByText('EN')).toBeInTheDocument();
    expect(within(dropdown).getByText('PT')).toBeInTheDocument();
    expect(within(dropdown).getByText('ES')).toBeInTheDocument();
    expect(within(dropdown).getByText('FR')).toBeInTheDocument();
  });

  it('deve permitir trocar o idioma ao clicar numa opção', () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const dropdown = screen.getByTestId('language-dropdown');
    const ptOption = within(dropdown).getByText('PT');
    fireEvent.click(ptOption);

    // Deve salvar no localStorage
    expect(localStorage.getItem('tunein_language')).toBe('pt-PT');
  });
});
