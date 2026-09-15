import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SeasonalBanner from '../SeasonalBanner';
import '../../i18n';

describe('SeasonalBanner Component', () => {
  it('não deve renderizar nada se o tema for default', () => {
    const { container } = render(<SeasonalBanner forcedTheme="default" />);
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar saudação e emojis de Halloween', () => {
    render(<SeasonalBanner forcedTheme="halloween" />);
    expect(screen.getByText(/Halloween/i)).toBeInTheDocument();
    expect(screen.getByText('🎃')).toBeInTheDocument();
    expect(screen.getByText('🦇')).toBeInTheDocument();
  });

  it('deve renderizar saudação e emojis de Natal', () => {
    render(<SeasonalBanner forcedTheme="christmas" />);
    expect(screen.getByText(/Natal|Christmas/i)).toBeInTheDocument();
    expect(screen.getByText('🎄')).toBeInTheDocument();
    expect(screen.getByText('❄️')).toBeInTheDocument();
  });

  it('deve renderizar saudação e emojis de Ano Novo com ano dinâmico', () => {
    render(<SeasonalBanner forcedTheme="newyear" />);
    expect(screen.getByText(/Ano Novo|New Year/i)).toBeInTheDocument();
    expect(screen.getByText('🥂')).toBeInTheDocument();
  });

  it('deve renderizar saudação e emojis de Páscoa', () => {
    render(<SeasonalBanner forcedTheme="easter" />);
    expect(screen.getByText(/Páscoa|Easter/i)).toBeInTheDocument();
    expect(screen.getByText('🐣')).toBeInTheDocument();
  });

  it('deve renderizar saudação e emojis de Primavera', () => {
    render(<SeasonalBanner forcedTheme="spring" />);
    expect(screen.getByText(/Primavera|Spring/i)).toBeInTheDocument();
    expect(screen.getByText('🌸')).toBeInTheDocument();
  });

  it('deve renderizar saudação e emojis de Verão', () => {
    render(<SeasonalBanner forcedTheme="summer" />);
    expect(screen.getByText(/Verão|Summer/i)).toBeInTheDocument();
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });

  it('deve renderizar saudação e emojis de Outono', () => {
    render(<SeasonalBanner forcedTheme="autumn" />);
    expect(screen.getByText(/Outono|Autumn/i)).toBeInTheDocument();
    expect(screen.getByText('🍂')).toBeInTheDocument();
  });

  it('deve renderizar saudação e emojis de Inverno', () => {
    render(<SeasonalBanner forcedTheme="winter" />);
    expect(screen.getByText(/Inverno|Winter/i)).toBeInTheDocument();
    expect(screen.getByText('❄️')).toBeInTheDocument();
  });

  it('deve aplicar className personalizada', () => {
    render(<SeasonalBanner forcedTheme="winter" className="custom-test-class" />);
    const banner = screen.getByTestId('seasonal-banner');
    expect(banner).toHaveClass('custom-test-class');
  });
});
