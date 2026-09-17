/**
 * Serviço de Avatares Sazonais e Festivos do TuneIn.
 * Fornece avatares SVG vetoriais temáticos para Halloween e Natal,
 * e utiliza a coleção clássica de robôs fora de época.
 */

import { Style, Avatar } from '@dicebear/core';
import botttsNeutral from '@dicebear/styles/bottts-neutral.json';
import { getActiveSeasonalTheme } from './seasonalTheme';

const botttsNeutralStyle = new Style(botttsNeutral);

// -------------------------------------------------------------
// COLEÇÃO DE HALLOWEEN
// -------------------------------------------------------------
export const HALLOWEEN_AVATARS = [
  { id: 'hw_pumpkin', name: 'Jack-o\'-Lantern', url: '/avatars/halloween/hw_pumpkin.svg' },
  { id: 'hw_ghost', name: 'Fantasminha', url: '/avatars/halloween/hw_ghost.svg' },
  { id: 'hw_vampire', name: 'Vampiro', url: '/avatars/halloween/hw_vampire.svg' },
  { id: 'hw_witch', name: 'Bruxinha', url: '/avatars/halloween/hw_witch.svg' },
  { id: 'hw_frankenstein', name: 'Frankenstein', url: '/avatars/halloween/hw_frankenstein.svg' },
  { id: 'hw_cat', name: 'Gato Preto', url: '/avatars/halloween/hw_cat.svg' },
  { id: 'hw_bat', name: 'Morceguinho', url: '/avatars/halloween/hw_bat.svg' },
  { id: 'hw_skull', name: 'Calavera', url: '/avatars/halloween/hw_skull.svg' },
];

// -------------------------------------------------------------
// COLEÇÃO DE NATAL
// -------------------------------------------------------------
export const CHRISTMAS_AVATARS = [
  { id: 'xm_santa', name: 'Pai Natal', url: '/avatars/christmas/xm_santa.svg' },
  { id: 'xm_rudolph', name: 'Rena Rodolfo', url: '/avatars/christmas/xm_rudolph.svg' },
  { id: 'xm_snowman', name: 'Boneco de Neve', url: '/avatars/christmas/xm_snowman.svg' },
  { id: 'xm_elf', name: 'Elfo do Natal', url: '/avatars/christmas/xm_elf.svg' },
  { id: 'xm_gingerbread', name: 'Biscoito de Gengibre', url: '/avatars/christmas/xm_gingerbread.svg' },
  { id: 'xm_penguin', name: 'Pinguim Festivo', url: '/avatars/christmas/xm_penguin.svg' },
  { id: 'xm_polar_bear', name: 'Urso Polar', url: '/avatars/christmas/xm_polar_bear.svg' },
  { id: 'xm_gift', name: 'Prenda Encantada', url: '/avatars/christmas/xm_gift.svg' },
];

// -------------------------------------------------------------
// COLEÇÃO DE MÚSICA (PADRÃO TUNEIN)
// -------------------------------------------------------------
export const MUSIC_AVATARS = [
  { id: 'music_dj_bear', name: 'Urso DJ', url: '/avatars/music/music_dj_bear.svg' },
  { id: 'music_rock_fox', name: 'Raposa Rocker', url: '/avatars/music/music_rock_fox.svg' },
  { id: 'music_hiphop_panda', name: 'Panda Beat', url: '/avatars/music/music_hiphop_panda.svg' },
  { id: 'music_jazz_cat', name: 'Gato Jazz', url: '/avatars/music/music_jazz_cat.svg' },
  { id: 'music_pop_bunny', name: 'Coelho Pop', url: '/avatars/music/music_pop_bunny.svg' },
  { id: 'music_synth_frog', name: 'Sapo Synth', url: '/avatars/music/music_synth_frog.svg' },
  { id: 'music_groovy_lion', name: 'Leão Groovy', url: '/avatars/music/music_groovy_lion.svg' },
  { id: 'music_monkey_beats', name: 'Macaco Beats', url: '/avatars/music/music_monkey_beats.svg' },
  { id: 'music_funk_dog', name: 'Cão Funk', url: '/avatars/music/music_funk_dog.svg' },
  { id: 'music_lofi_koala', name: 'Koala Lo-Fi', url: '/avatars/music/music_lofi_koala.svg' },
];

/**
 * Retorna a lista de avatares temáticos disponíveis para a época indicada.
 * Se não for uma época especial com coleção própria, retorna [].
 * @param {string} [theme]
 * @returns {Array<{ id: string, name: string, url: string }>}
 */
export function getSeasonalAvatarList(theme) {
  let currentTheme = theme;
  if (!currentTheme && typeof document !== 'undefined' && document.documentElement) {
    const domTheme = document.documentElement.getAttribute('data-theme');
    if (domTheme) {
      currentTheme = domTheme;
    }
  }
  if (!currentTheme) {
    currentTheme = getActiveSeasonalTheme();
  }
  
  if (currentTheme === 'halloween') {
    return HALLOWEEN_AVATARS;
  }

  if (currentTheme === 'christmas') {
    return CHRISTMAS_AVATARS;
  }

  return [];
}

/**
 * Gera um avatar DiceBear do tipo Bottts Neutral em formato Data URI SVG.
 * @param {string} [seed] Semente única para determinismo; se omitida, gera uma aleatória.
 * @param {object} [options] Opções adicionais de customização do avatar DiceBear.
 * @returns {string} Data URI do avatar SVG.
 */
export function getBotttsNeutralAvatar(seed, options = {}) {
  const avatarSeed = seed || Math.random().toString(36).substring(2, 12);
  const avatar = new Avatar(botttsNeutralStyle, {
    seed: avatarSeed,
    ...options,
  });
  return avatar.toDataUri();
}

/**
 * Retorna um avatar aleatório respeitando a temática sazonal ativa:
 * - Em época de Halloween: sorteia entre os avatares de Halloween.
 * - Em época de Natal: sorteia entre os avatares de Natal.
 * - Fora de época ou em temas padrão: gera um avatar de robô Bottts Neutral via DiceBear.
 * 
 * @param {string} [theme] Tema opcional; se omitido, deteta automaticamente o tema ativo.
 * @param {string} [currentAvatarUrl] URL/URI do avatar atual para evitar repetições consecutivas.
 * @returns {string} URL ou Data URI do avatar.
 */
export function getRandomAvatar(theme, currentAvatarUrl) {
  let currentTheme = theme;
  if (!currentTheme && typeof document !== 'undefined' && document.documentElement) {
    const domTheme = document.documentElement.getAttribute('data-theme');
    if (domTheme) {
      currentTheme = domTheme;
    }
  }
  if (!currentTheme) {
    currentTheme = getActiveSeasonalTheme();
  }

  const seasonalList = getSeasonalAvatarList(currentTheme);
  if (seasonalList.length > 0) {
    const pool = currentAvatarUrl 
      ? seasonalList.filter(a => a.url !== currentAvatarUrl)
      : seasonalList;
    const finalPool = pool.length > 0 ? pool : seasonalList;
    const randomIndex = Math.floor(Math.random() * finalPool.length);
    return finalPool[randomIndex].url;
  }

  // Quando não está nenhum evento / tema aplicado, gera um avatar Bottts Neutral via DiceBear
  let newAvatar = getBotttsNeutralAvatar();
  if (currentAvatarUrl && newAvatar === currentAvatarUrl) {
    newAvatar = getBotttsNeutralAvatar();
  }
  return newAvatar;
}

/**
 * Verifica se um avatar é de um tema sazonal (Halloween ou Natal).
 * @param {string} avatarUrl 
 * @returns {boolean}
 */
export function isSeasonalAvatar(avatarUrl) {
  return typeof avatarUrl === 'string' && (
    avatarUrl.startsWith('/avatars/halloween/') || 
    avatarUrl.startsWith('/avatars/christmas/')
  );
}

/**
 * Verifica se um avatar foi gerado pela API do DiceBear (Data URI SVG ou URL DiceBear).
 * @param {string} avatarUrl 
 * @returns {boolean}
 */
export function isDiceBearAvatar(avatarUrl) {
  return typeof avatarUrl === 'string' && (
    avatarUrl.startsWith('data:image/svg+xml') ||
    avatarUrl.includes('dicebear')
  );
}

/**
 * Verifica se um avatar pertence à coleção legada de mascotes musicais do TuneIn.
 * @param {string} avatarUrl 
 * @returns {boolean}
 */
export function isMusicAvatar(avatarUrl) {
  return typeof avatarUrl === 'string' && avatarUrl.startsWith('/avatars/music/');
}
