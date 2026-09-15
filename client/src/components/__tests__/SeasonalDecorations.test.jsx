import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SeasonalDecorations from '../SeasonalDecorations';

describe('SeasonalDecorations Component', () => {
  it('não deve renderizar nada se o tema for default', () => {
    const { container } = render(<SeasonalDecorations forcedTheme="default" />);
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar decorações ambientais de Halloween', () => {
    render(<SeasonalDecorations forcedTheme="halloween" />);
    expect(screen.getAllByText('🕷️').length).toBeGreaterThan(0);
  });

  it('deve renderizar neve no Natal', () => {
    render(<SeasonalDecorations forcedTheme="christmas" />);
    expect(screen.getAllByText(/❄/).length).toBeGreaterThan(0);
  });

  it('deve renderizar faíscas no Ano Novo', () => {
    render(<SeasonalDecorations forcedTheme="newyear" />);
    expect(screen.getAllByText(/✨/).length).toBeGreaterThan(0);
  });

  it('deve renderizar elementos de Páscoa', () => {
    render(<SeasonalDecorations forcedTheme="easter" />);
    expect(screen.getAllByText(/🥚|🌸|✨/).length).toBeGreaterThan(0);
  });

  it('deve renderizar pétalas na Primavera', () => {
    render(<SeasonalDecorations forcedTheme="spring" />);
    expect(screen.getAllByText('🌸').length).toBeGreaterThan(0);
  });

  it('deve renderizar pirilampos e pranchas de surf no Verão', () => {
    render(<SeasonalDecorations forcedTheme="summer" />);
    expect(screen.getAllByTestId('surfboard').length).toBeGreaterThan(0);
  });

  it('deve renderizar folhas no Outono', () => {
    render(<SeasonalDecorations forcedTheme="autumn" />);
    expect(screen.getAllByText(/🍂|🍁/).length).toBeGreaterThan(0);
  });

  it('deve renderizar cristais e bonecos de neve no Inverno', () => {
    render(<SeasonalDecorations forcedTheme="winter" />);
    expect(screen.getAllByText(/❄/).length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('snowman').length).toBeGreaterThan(0);
  });
});
