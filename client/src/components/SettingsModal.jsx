import React from 'react';
import { X, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SettingsModal({ isOpen, onClose, room, socket, isHost }) {
  const { t } = useTranslation();

  if (!isOpen || !room) return null;

  const handleAutoNextRoundChange = (e) => {
    if (!isHost || !socket) return;
    socket.emit('updateSettings', { roomId: room.id, settings: { autoNextRound: e.target.checked } });
  };

  const handleRoundDurationChange = (e) => {
    if (!isHost || !socket) return;
    socket.emit('updateSettings', { roomId: room.id, settings: { roundDuration: parseInt(e.target.value, 10) } });
  };

  const handleRevealLettersChange = (e) => {
    if (!isHost || !socket) return;
    socket.emit('updateSettings', { roomId: room.id, settings: { revealLetters: e.target.checked } });
  };

  const handleShowPlaceholdersChange = (e) => {
    if (!isHost || !socket) return;
    socket.emit('updateSettings', { roomId: room.id, settings: { showPlaceholders: e.target.checked } });
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="glass-panel w-full max-w-md p-6 relative flex flex-col border border-theme-border bg-surface/95 shadow-2xl rounded-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-theme-secondary hover:text-theme-text transition-colors p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
          aria-label={t('close')}
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-accent-purple/20 text-accent-purple border border-accent-purple/30">
            <Settings size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-theme-text">
              {t('room_settings')}
            </h3>
            <p className="text-xs text-theme-secondary">
              {t('settings_host_hint', 'Ajusta as regras da sala para todos os jogadores.')}
            </p>
          </div>
        </div>

        <div className="space-y-4 bg-background/60 p-4 rounded-xl border border-theme-border mb-6">
          {/* Avanço Automático */}
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="modalAutoNextRound" className="text-sm font-medium text-theme-text cursor-pointer select-none">
              {t('auto_next_round')}
            </label>
            <input 
              type="checkbox" 
              id="modalAutoNextRound"
              checked={room.autoNextRound !== false}
              onChange={handleAutoNextRoundChange}
              disabled={!isHost}
              className="w-5 h-5 accent-accent-pink rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="border-t border-theme-border"></div>

          {/* Duração da Ronda */}
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="modalRoundDuration" className="text-sm font-medium text-theme-text cursor-pointer select-none">
              {t('round_duration')}
            </label>
            <select 
              id="modalRoundDuration"
              value={room.roundDuration || 30}
              onChange={handleRoundDurationChange}
              disabled={!isHost}
              className="bg-surface border border-theme-border rounded-lg px-3 py-1.5 text-sm font-medium text-theme-text focus:outline-none focus:border-accent-pink disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value={5}>5 {t('seconds')}</option>
              <option value={10}>10 {t('seconds')}</option>
              <option value={20}>20 {t('seconds')}</option>
              <option value={30}>30 {t('seconds')}</option>
            </select>
          </div>

          <div className="border-t border-theme-border"></div>

          {/* Placeholders */}
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="modalShowPlaceholders" className="text-sm font-medium text-theme-text cursor-pointer select-none">
              {t('show_placeholders')}
            </label>
            <input 
              type="checkbox" 
              id="modalShowPlaceholders"
              checked={room.showPlaceholders !== false}
              onChange={handleShowPlaceholdersChange}
              disabled={!isHost}
              className="w-5 h-5 accent-accent-pink rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="border-t border-theme-border"></div>

          {/* Revelar Letras */}
          <div className="flex items-center justify-between gap-4">
            <label 
              htmlFor="modalRevealLetters" 
              className={`text-sm font-medium cursor-pointer select-none ${room.showPlaceholders === false ? 'text-theme-muted' : 'text-theme-text'}`}
            >
              {t('reveal_letters')}
            </label>
            <input 
              type="checkbox" 
              id="modalRevealLetters"
              checked={room.revealLetters !== false && room.showPlaceholders !== false}
              onChange={handleRevealLettersChange}
              disabled={!isHost || room.showPlaceholders === false}
              className="w-5 h-5 accent-accent-pink rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        {!isHost && (
          <div className="text-xs text-yellow-400/90 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-2.5 mb-4 text-center">
            {t('only_host_settings')}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-surface hover:bg-black/5 dark:hover:bg-gray-700 text-theme-text font-medium py-2.5 rounded-lg transition-colors border border-theme-border text-sm"
        >
          {t('close')}
        </button>
      </div>
    </div>
  );
}
