import '@testing-library/jest-dom';
import { vi } from 'vitest';
import i18n from '../i18n';

// Forçar idioma previsível em Português de Portugal nos testes
i18n.changeLanguage('pt-PT');

// Mock de elementos de áudio HTML5 no jsdom
window.HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
window.HTMLMediaElement.prototype.pause = vi.fn(() => {});
window.HTMLMediaElement.prototype.load = vi.fn(() => {});

// Mock de alert e confirm
window.alert = vi.fn(() => {});
window.confirm = vi.fn(() => true);

// Mock de clipboard com spy
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

// Mock de scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn(() => {});
