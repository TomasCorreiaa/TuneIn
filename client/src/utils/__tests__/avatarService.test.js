import { describe, it, expect } from 'vitest';
import { 
  getSeasonalAvatarList, 
  getRandomAvatar, 
  getBotttsNeutralAvatar,
  isSeasonalAvatar, 
  isDiceBearAvatar,
  isMusicAvatar,
  HALLOWEEN_AVATARS, 
  CHRISTMAS_AVATARS,
  MUSIC_AVATARS 
} from '../avatarService';

describe('avatarService utility', () => {
  it('deve retornar lista de 8 avatares para Halloween com URLs válidos', () => {
    const list = getSeasonalAvatarList('halloween');
    expect(list.length).toBe(8);
    expect(list).toEqual(HALLOWEEN_AVATARS);
    expect(list[0].id).toBe('hw_pumpkin');
    expect(list[0].url).toBe('/avatars/halloween/hw_pumpkin.svg');
  });

  it('deve retornar lista de 8 avatares para Natal com URLs válidos', () => {
    const list = getSeasonalAvatarList('christmas');
    expect(list.length).toBe(8);
    expect(list).toEqual(CHRISTMAS_AVATARS);
    expect(list[0].id).toBe('xm_santa');
    expect(list[0].url).toBe('/avatars/christmas/xm_santa.svg');
  });

  it('deve manter a coleção legada de 10 avatares musicais', () => {
    expect(MUSIC_AVATARS.length).toBe(10);
    MUSIC_AVATARS.forEach(avatar => {
      expect(avatar.url).toMatch(/^\/avatars\/music\/music_.*\.svg$/);
      expect(isMusicAvatar(avatar.url)).toBe(true);
    });
  });

  it('deve retornar lista vazia para temas sem coleção sazonal exclusiva', () => {
    expect(getSeasonalAvatarList('default')).toEqual([]);
    expect(getSeasonalAvatarList('summer')).toEqual([]);
  });

  it('getRandomAvatar deve sortear um avatar de Halloween quando theme="halloween"', () => {
    const avatar = getRandomAvatar('halloween');
    expect(avatar).toContain('/avatars/halloween/');
    expect(isSeasonalAvatar(avatar)).toBe(true);
  });

  it('getRandomAvatar deve sortear um avatar de Natal quando theme="christmas"', () => {
    const avatar = getRandomAvatar('christmas');
    expect(avatar).toContain('/avatars/christmas/');
    expect(isSeasonalAvatar(avatar)).toBe(true);
  });

  it('getRandomAvatar deve retornar um avatar Bottts Neutral via DiceBear quando theme="default"', () => {
    const avatar = getRandomAvatar('default');
    expect(avatar).toMatch(/^data:image\/svg\+xml/);
    expect(isDiceBearAvatar(avatar)).toBe(true);
    expect(isSeasonalAvatar(avatar)).toBe(false);
  });

  it('getBotttsNeutralAvatar deve gerar avatares determinísticos para a mesma semente', () => {
    const av1 = getBotttsNeutralAvatar('tunein-seed-123');
    const av2 = getBotttsNeutralAvatar('tunein-seed-123');
    const avDiff = getBotttsNeutralAvatar('tunein-diff-456');

    expect(av1).toBe(av2);
    expect(av1).not.toBe(avDiff);
    expect(isDiceBearAvatar(av1)).toBe(true);
  });

  it('getRandomAvatar deve detetar o tema a partir do data-theme no DOM se theme não for passado', () => {
    document.documentElement.setAttribute('data-theme', 'halloween');
    const avatar = getRandomAvatar();
    expect(avatar).toContain('/avatars/halloween/');
    expect(isSeasonalAvatar(avatar)).toBe(true);
    document.documentElement.removeAttribute('data-theme');
  });

  it('getRandomAvatar deve evitar repetir o avatar atual se for chamado com currentAvatarUrl', () => {
    const current = getRandomAvatar('default');
    const next = getRandomAvatar('default', current);
    expect(next).not.toBe(current);
    expect(isDiceBearAvatar(next)).toBe(true);
  });
});
