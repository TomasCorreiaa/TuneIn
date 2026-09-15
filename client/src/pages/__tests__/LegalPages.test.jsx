import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Terms from '../Terms';
import Privacy from '../Privacy';
import '../../i18n';

describe('Legal Pages', () => {
  describe('Terms Page', () => {
    it('deve renderizar a página de Termos e Condições com botão de voltar e rodapé', () => {
      render(
        <MemoryRouter>
          <Terms />
        </MemoryRouter>
      );

      const backLink = screen.getByTestId('back-to-home-link');
      expect(backLink).toBeInTheDocument();
      expect(backLink.getAttribute('href')).toBe('/');

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();

      const mailLinks = screen.getAllByRole('link', { name: /curredev@gmail.com|email us!/i });
      expect(mailLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Privacy Page', () => {
    it('deve renderizar a página de Política de Privacidade com secções e rodapé', () => {
      render(
        <MemoryRouter>
          <Privacy />
        </MemoryRouter>
      );

      const backLink = screen.getByTestId('back-to-home-link');
      expect(backLink).toBeInTheDocument();
      expect(backLink.getAttribute('href')).toBe('/');

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();

      const mailLinks = screen.getAllByRole('link', { name: /curredev@gmail.com|email us!/i });
      expect(mailLinks.length).toBeGreaterThan(0);
    });
  });
});
