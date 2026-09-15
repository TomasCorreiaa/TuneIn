/**
 * Serviço de Avatares Sazonais e Festivos do TuneIn.
 * Fornece avatares SVG vetoriais temáticos para Halloween e Natal,
 * e utiliza a coleção clássica de robôs fora de época.
 */

import { getActiveSeasonalTheme } from './seasonalTheme';

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
 * Retorna um avatar aleatório respeitando a temática sazonal ativa:
 * - Em época de Halloween: sorteia entre os avatares de Halloween.
 * - Em época de Natal: sorteia entre os avatares de Natal.
 * - Fora de época ou em temas normais: gera robô do DiceBear (bottts).
 * 
 * @param {string} [theme] Tema opcional; se omitido, deteta automaticamente o tema ativo.
 * @param {string} [currentAvatarUrl] URL do avatar atual para evitar repetições consecutivas.
 * @returns {string} URL do avatar.
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

  // Padrão fora de época: coleção bottts do DiceBear
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Verifica se um avatar é de um tema sazonal.
 * @param {string} avatarUrl 
 * @returns {boolean}
 */
export function isSeasonalAvatar(avatarUrl) {
  return typeof avatarUrl === 'string' && (
    avatarUrl.startsWith('/avatars/') || 
    avatarUrl.startsWith('data:image/svg+xml')
  );
}
