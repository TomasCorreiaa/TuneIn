import { describe, it, expect } from 'vitest';
import { getSeasonalAvatarList, getRandomAvatar, isSeasonalAvatar, HALLOWEEN_AVATARS, CHRISTMAS_AVATARS } from '../avatarService';

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

  it('getRandomAvatar deve retornar robô DiceBear quando theme="default"', () => {
    const avatar = getRandomAvatar('default');
    expect(avatar).toContain('https://api.dicebear.com/7.x/bottts/svg?seed=');
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
    const list = getSeasonalAvatarList('halloween');
    const current = list[0].url;
    const next = getRandomAvatar('halloween', current);
    expect(next).not.toBe(current);
  });
});
