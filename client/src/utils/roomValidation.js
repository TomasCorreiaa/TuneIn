/**
 * Utilitário de validação de códigos de sala do TuneIn.
 * As salas no TuneIn são geradas exclusivamente com 6 caracteres alfanuméricos maiúsculos (A-Z, 0-9).
 */

export const ROOM_CODE_REGEX = /^[A-Za-z0-9]{6}$/;

/**
 * Valida se um código de sala segue o formato válido (6 caracteres alfanuméricos).
 * @param {string} code 
 * @returns {boolean}
 */
export function isValidRoomCode(code) {
  if (!code || typeof code !== 'string') return false;
  return ROOM_CODE_REGEX.test(code.trim());
}

/**
 * Sanitiza e normaliza um código de sala para maiúsculas e sem espaços.
 * @param {string} code 
 * @returns {string}
 */
export function normalizeRoomCode(code) {
  if (!code || typeof code !== 'string') return '';
  return code.trim().toUpperCase().slice(0, 6);
}
