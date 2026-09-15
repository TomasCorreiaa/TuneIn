import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function QrCodeModal({ isOpen, onClose, roomId }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const joinUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/${roomId}` 
    : `/${roomId}`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="glass-panel w-full max-w-sm p-6 relative flex flex-col items-center text-center border border-theme-border bg-surface/95 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-theme-secondary hover:text-theme-text transition-colors p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
          aria-label={t('close')}
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-pink mb-1">
          {t('qr_code')}
        </h3>
        
        <p className="text-xs text-theme-secondary mb-4 px-2">
          {t('scan_to_join')}
        </p>

        {/* QR Code Container with high contrast white background for phone cameras */}
        <div className="bg-white p-4 rounded-2xl shadow-lg mb-4 flex items-center justify-center">
          <QRCodeSVG 
            value={joinUrl} 
            size={200}
            level="M"
            marginSize={1}
          />
        </div>

        <div className="w-full flex items-center justify-between bg-background/80 px-4 py-2 rounded-lg border border-theme-border mb-4">
          <div className="text-left">
            <span className="text-xs text-theme-muted block uppercase font-medium">{t('room')}</span>
            <span className="font-mono font-bold tracking-widest text-accent-orange text-lg">{roomId}</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 bg-surface hover:bg-black/5 dark:hover:bg-gray-700 text-xs px-3 py-2 rounded-md border border-theme-border transition-all text-theme-text"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-400" />
                <span className="text-green-400 font-bold">{t('copied')}</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>{t('copy_link')}</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-surface hover:bg-black/5 dark:hover:bg-gray-700 text-theme-text font-medium py-2 rounded-lg transition-colors border border-theme-border text-sm"
        >
          {t('close')}
        </button>
      </div>
    </div>
  );
}
