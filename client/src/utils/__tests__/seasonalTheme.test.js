import { describe, it, expect, beforeEach } from 'vitest';
import { getActiveSeasonalTheme, applySeasonalTheme, initSeasonalTheme, getEasterSunday } from '../seasonalTheme';

describe('seasonalTheme utility', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  describe('Cálculo da Páscoa', () => {
    it('deve calcular corretamente o Domingo de Páscoa para vários anos', () => {
      // 2025: 20 de Abril
      expect(getEasterSunday(2025)).toEqual({ month: 4, day: 20 });
      // 2026: 5 de Abril
      expect(getEasterSunday(2026)).toEqual({ month: 4, day: 5 });
      // 2027: 28 de Março
      expect(getEasterSunday(2027)).toEqual({ month: 3, day: 28 });
    });
  });

  describe('Deteção de Eventos e Estações', () => {
    it('deve detetar Halloween entre 28 Out e 02 Nov', () => {
      expect(getActiveSeasonalTheme(new Date(2026, 9, 28))).toBe('halloween'); // 28 Out
      expect(getActiveSeasonalTheme(new Date(2026, 9, 31))).toBe('halloween'); // 31 Out
      expect(getActiveSeasonalTheme(new Date(2026, 10, 2))).toBe('halloween'); // 02 Nov
      expect(getActiveSeasonalTheme(new Date(2026, 10, 3))).toBe('default');   // 03 Nov
    });

    it('deve detetar Natal entre 24 e 26 Dez', () => {
      expect(getActiveSeasonalTheme(new Date(2026, 11, 24))).toBe('christmas'); // 24 Dez
      expect(getActiveSeasonalTheme(new Date(2026, 11, 25))).toBe('christmas'); // 25 Dez
      expect(getActiveSeasonalTheme(new Date(2026, 11, 26))).toBe('christmas'); // 26 Dez
    });

    it('deve detetar Inverno nos 4 dias de início (21 a 23 Dez antes do Natal)', () => {
      expect(getActiveSeasonalTheme(new Date(2026, 11, 21))).toBe('winter'); // 21 Dez
      expect(getActiveSeasonalTheme(new Date(2026, 11, 22))).toBe('winter'); // 22 Dez
      expect(getActiveSeasonalTheme(new Date(2026, 11, 23))).toBe('winter'); // 23 Dez
    });

    it('deve detetar Ano Novo entre 31 Dez e 02 Jan', () => {
      expect(getActiveSeasonalTheme(new Date(2026, 11, 31))).toBe('newyear'); // 31 Dez
      expect(getActiveSeasonalTheme(new Date(2027, 0, 1))).toBe('newyear');   // 01 Jan
      expect(getActiveSeasonalTheme(new Date(2027, 0, 2))).toBe('newyear');   // 02 Jan
      expect(getActiveSeasonalTheme(new Date(2027, 0, 3))).toBe('default');   // 03 Jan
    });

    it('deve detetar Primavera nos 4 dias do início (20 a 23 Mar)', () => {
      expect(getActiveSeasonalTheme(new Date(2026, 2, 20))).toBe('spring');  // 20 Mar
      expect(getActiveSeasonalTheme(new Date(2026, 2, 23))).toBe('spring');  // 23 Mar
      expect(getActiveSeasonalTheme(new Date(2026, 2, 24))).toBe('default'); // 24 Mar
    });

    it('deve detetar Verão nos 4 dias do início (21 a 24 Jun)', () => {
      expect(getActiveSeasonalTheme(new Date(2026, 5, 21))).toBe('summer');  // 21 Jun
      expect(getActiveSeasonalTheme(new Date(2026, 5, 24))).toBe('summer');  // 24 Jun
      expect(getActiveSeasonalTheme(new Date(2026, 5, 25))).toBe('default'); // 25 Jun
    });

    it('deve detetar Outono nos 4 dias do início (22 a 25 Set)', () => {
      expect(getActiveSeasonalTheme(new Date(2026, 8, 22))).toBe('autumn');  // 22 Set
      expect(getActiveSeasonalTheme(new Date(2026, 8, 25))).toBe('autumn');  // 25 Set
      expect(getActiveSeasonalTheme(new Date(2026, 8, 26))).toBe('default'); // 26 Set
    });

    it('deve detetar Páscoa nos 4 dias (Quinta-feira Santa a Domingo de Páscoa)', () => {
      // Em 2026: Domingo é 5 de Abril. Quinta-feira Santa é 2 de Abril.
      expect(getActiveSeasonalTheme(new Date(2026, 3, 2))).toBe('easter'); // 2 Abr
      expect(getActiveSeasonalTheme(new Date(2026, 3, 5))).toBe('easter'); // 5 Abr
      expect(getActiveSeasonalTheme(new Date(2026, 3, 6))).toBe('default'); // 6 Abr (Segunda-feira de Páscoa)
    });

    it('deve retornar default em dias comuns fora das janelas', () => {
      expect(getActiveSeasonalTheme(new Date(2026, 4, 15))).toBe('default'); // 15 Maio
      expect(getActiveSeasonalTheme(new Date(2026, 7, 10))).toBe('default'); // 10 Agosto
    });
  });

  describe('Aplicação e Inicialização do atributo data-theme', () => {
    it('deve aplicar o atributo data-theme no html para temas sazonais', () => {
      applySeasonalTheme('halloween');
      expect(document.documentElement.getAttribute('data-theme')).toBe('halloween');

      applySeasonalTheme('default');
      expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    });

    it('initSeasonalTheme deve aplicar o tema baseado na data fornecida', () => {
      const tema = initSeasonalTheme(new Date(2026, 9, 31));
      expect(tema).toBe('halloween');
      expect(document.documentElement.getAttribute('data-theme')).toBe('halloween');
    });

    it('deve respeitar a opção do utilizador de desativar o tema sazonal', () => {
      import('../seasonalTheme').then(({ setSeasonalThemeDisabled, isSeasonalThemeDisabled }) => {
        // Inicialmente habilitado
        expect(isSeasonalThemeDisabled()).toBe(false);
        expect(getActiveSeasonalTheme(new Date(2026, 9, 31))).toBe('halloween');

        // Desativar manualmente
        setSeasonalThemeDisabled(true);
        expect(isSeasonalThemeDisabled()).toBe(true);
        expect(getActiveSeasonalTheme(new Date(2026, 9, 31))).toBe('default');

        // Reativar
        setSeasonalThemeDisabled(false);
        expect(isSeasonalThemeDisabled()).toBe(false);
        expect(getActiveSeasonalTheme(new Date(2026, 9, 31))).toBe('halloween');
      });
    });

    it('deve converter corretamente uma data para o fuso horário de Los Angeles', async () => {
      const { getLosAngelesDateParts } = await import('../seasonalTheme');
      // 2026-11-01 02:00:00 UTC corresponde a 2026-10-31 19:00:00 em Los Angeles (PDT, UTC-7)
      const utcDate = new Date(Date.UTC(2026, 10, 1, 2, 0, 0));
      const la = getLosAngelesDateParts(utcDate);
      expect(la).toEqual({ year: 2026, month: 10, day: 31 });
    });
  });
});
