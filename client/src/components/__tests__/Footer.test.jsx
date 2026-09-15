import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../Footer';
import '../../i18n';

describe('Footer Component', () => {
  it('deve renderizar o texto de copyright com o ano atual', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const currentYear = new Date().getFullYear().toString();
    const copyrightEl = screen.getByTestId('footer-copyright');
    expect(copyrightEl).toBeInTheDocument();
    expect(copyrightEl).toHaveTextContent(currentYear);
    expect(copyrightEl).toHaveTextContent('TuneIn');
  });

  it('deve renderizar a ligação para a política de privacidade', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const privacyLink = screen.getByTestId('footer-privacy');
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink.getAttribute('href')).toBe('/privacy');
  });

  it('deve renderizar a ligação para os termos de serviço', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const termsLink = screen.getByTestId('footer-terms');
    expect(termsLink).toBeInTheDocument();
    expect(termsLink.getAttribute('href')).toBe('/terms');
  });

  it('deve renderizar o botão/link para envio de email para curredev@gmail.com', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const emailLink = screen.getByTestId('footer-email');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.getAttribute('href')).toContain('mailto:curredev@gmail.com');
  });

  it('deve aplicar classes compactas quando a prop compact for verdadeira', () => {
    render(
      <MemoryRouter>
        <Footer compact />
      </MemoryRouter>
    );

    const footer = screen.getByTestId('footer');
    expect(footer.className).toContain('py-1.5');
  });
});
