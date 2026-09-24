import { describe, it, expect } from 'vitest';
import { isValidRoomCode, normalizeRoomCode } from '../roomValidation';

describe('roomValidation utility', () => {
  it('deve aceitar códigos alfanuméricos válidos de 6 caracteres', () => {
    expect(isValidRoomCode('ABC123')).toBe(true);
    expect(isValidRoomCode('XYZ999')).toBe(true);
    expect(isValidRoomCode('abcdef')).toBe(true);
    expect(isValidRoomCode('123456')).toBe(true);
  });

  it('deve rejeitar códigos com tamanho diferente de 6 caracteres', () => {
    expect(isValidRoomCode('blacker')).toBe(false); // 7 caracteres
    expect(isValidRoomCode('abc')).toBe(false);     // 3 caracteres
    expect(isValidRoomCode('')).toBe(false);
    expect(isValidRoomCode(null)).toBe(false);
    expect(isValidRoomCode(undefined)).toBe(false);
  });

  it('deve rejeitar códigos com caracteres especiais, espaços ou símbolos', () => {
    expect(isValidRoomCode('ABC-12')).toBe(false);
    expect(isValidRoomCode('ABC 12')).toBe(false);
    expect(isValidRoomCode('ABC!23')).toBe(false);
  });

  it('normalizeRoomCode deve converter para maiúsculas e aparar espaços', () => {
    expect(normalizeRoomCode('  abc123  ')).toBe('ABC123');
    expect(normalizeRoomCode('blacker999')).toBe('BLACKE');
    expect(normalizeRoomCode(null)).toBe('');
  });
});
