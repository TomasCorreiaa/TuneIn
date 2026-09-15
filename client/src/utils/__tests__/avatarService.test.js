import { describe, it, expect } from 'vitest';
import { 
  getSeasonalAvatarList, 
  getRandomAvatar, 
  isSeasonalAvatar, 
  isMusicAvatar,
  HALLOWEEN_AVATARS, 
  CHRISTMAS_AVATARS,
  MUSIC_AVATARS 
} from '../avatarService';

describe('avatarService utility', () => {
  it('deve retornar lista de 8 avatares para Halloween com URLs válidos', () => {
    const list = getSeasonalAvatarList('halloween');
    expect(list.length).toBe(8);
    expect(list[0].id).toBe('hw_pumpkin');
    expect(list[0].url).toBe('/avatars/halloween/hw_pumpkin.svg');
  });

  it('deve retornar lista de 8 avatares para Natal com URLs válidos', () => {
    const list = getSeasonalAvatarList('christmas');
    expect(list.length).toBe(8);
    expect(list[0].id).toBe('xm_santa');
    expect(list[0].url).toBe('/avatars/christmas/xm_santa.svg');
  });

  it('deve conter 10 avatares musicais na coleção padrão do TuneIn', () => {
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

  it('getRandomAvatar deve retornar um avatar musical com auscultadores quando theme="default"', () => {
    const avatar = getRandomAvatar('default');
    expect(avatar).toContain('/avatars/music/');
    expect(isMusicAvatar(avatar)).toBe(true);
    expect(isSeasonalAvatar(avatar)).toBe(false);
  });

  it('getRandomAvatar deve detetar o tema a partir do data-theme no DOM se theme não for passado', () => {
    document.documentElement.setAttribute('data-theme', 'halloween');
    const avatar = getRandomAvatar();
    expect(avatar).toContain('/avatars/halloween/');
    expect(isSeasonalAvatar(avatar)).toBe(true);
    document.documentElement.removeAttribute('data-theme');
  });

  it('getRandomAvatar deve evitar repetir o avatar atual se houver outras opções', () => {
    const current = MUSIC_AVATARS[0].url;
    const next = getRandomAvatar('default', current);
    expect(next).not.toBe(current);
  });
});
