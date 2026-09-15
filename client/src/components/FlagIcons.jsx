import React from 'react';

export function FlagPT({ className = 'w-5 h-3.5' }) {
  return (
    <svg className={`inline-block rounded-xs shadow-xs overflow-hidden flex-shrink-0 border border-black/15 dark:border-white/20 ${className}`} viewBox="0 0 600 400" aria-hidden="true">
      <rect width="240" height="400" fill="#046A38" />
      <rect x="240" width="360" height="400" fill="#DA291C" />
      <circle cx="240" cy="200" r="75" fill="#FFC400" stroke="#000" strokeWidth="5" />
      <circle cx="240" cy="200" r="48" fill="none" stroke="#000" strokeWidth="5" />
      <path d="M 212,165 L 268,165 L 268,208 C 268,240 212,240 212,208 Z" fill="#FFFFFF" stroke="#DA291C" strokeWidth="6" />
      <circle cx="240" cy="198" r="8" fill="#002B7F" />
    </svg>
  );
}

export function FlagUS({ className = 'w-5 h-3.5' }) {
  return (
    <svg className={`inline-block rounded-xs shadow-xs overflow-hidden flex-shrink-0 border border-black/15 dark:border-white/20 ${className}`} viewBox="0 0 741 390" aria-hidden="true">
      <rect width="741" height="390" fill="#B22234" />
      <path d="M0,30H741M0,90H741M0,150H741M0,210H741M0,270H741M0,330H741" stroke="#FFF" strokeWidth="30" />
      <rect width="296" height="210" fill="#3C3B6E" />
      <g fill="#FFF">
        <circle cx="40" cy="35" r="9" />
        <circle cx="100" cy="35" r="9" />
        <circle cx="160" cy="35" r="9" />
        <circle cx="220" cy="35" r="9" />
        <circle cx="70" cy="70" r="9" />
        <circle cx="130" cy="70" r="9" />
        <circle cx="190" cy="70" r="9" />
        <circle cx="250" cy="70" r="9" />
        <circle cx="40" cy="105" r="9" />
        <circle cx="100" cy="105" r="9" />
        <circle cx="160" cy="105" r="9" />
        <circle cx="220" cy="105" r="9" />
        <circle cx="70" cy="140" r="9" />
        <circle cx="130" cy="140" r="9" />
        <circle cx="190" cy="140" r="9" />
        <circle cx="250" cy="140" r="9" />
        <circle cx="40" cy="175" r="9" />
        <circle cx="100" cy="175" r="9" />
        <circle cx="160" cy="175" r="9" />
        <circle cx="220" cy="175" r="9" />
      </g>
    </svg>
  );
}

export function FlagES({ className = 'w-5 h-3.5' }) {
  return (
    <svg className={`inline-block rounded-xs shadow-xs overflow-hidden flex-shrink-0 border border-black/15 dark:border-white/20 ${className}`} viewBox="0 0 750 500" aria-hidden="true">
      <rect width="750" height="500" fill="#C60B1E" />
      <rect y="125" width="750" height="250" fill="#FFC400" />
      <g transform="translate(180, 195) scale(0.65)">
        <rect x="0" y="0" width="70" height="90" rx="30" fill="#C60B1E" stroke="#B8860B" strokeWidth="4" />
        <path d="M 15,20 L 55,20 L 55,60 C 55,78 15,78 15,60 Z" fill="#FFF" />
        <circle cx="35" cy="45" r="10" fill="#002B7F" />
      </g>
    </svg>
  );
}

export function FlagFR({ className = 'w-5 h-3.5' }) {
  return (
    <svg className={`inline-block rounded-xs shadow-xs overflow-hidden flex-shrink-0 border border-black/15 dark:border-white/20 ${className}`} viewBox="0 0 900 600" aria-hidden="true">
      <rect width="300" height="600" fill="#002654" />
      <rect x="300" width="300" height="600" fill="#FFFFFF" />
      <rect x="600" width="300" height="600" fill="#CE1126" />
    </svg>
  );
}

export default function Flag({ code, className = 'w-5 h-3.5' }) {
  switch (code) {
    case 'pt-PT':
    case 'PT':
      return <FlagPT className={className} />;
    case 'en-US':
    case 'EN':
      return <FlagUS className={className} />;
    case 'es-ES':
    case 'ES':
      return <FlagES className={className} />;
    case 'fr-FR':
    case 'FR':
      return <FlagFR className={className} />;
    default:
      return null;
  }
}
