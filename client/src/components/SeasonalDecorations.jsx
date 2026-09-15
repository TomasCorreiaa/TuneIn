import React, { useState, useEffect, useMemo } from 'react';
import { getActiveSeasonalTheme } from '../utils/seasonalTheme';

/**
 * Componente de Decorações e Micro-Animações Vivas Sazonais para o TuneIn.
 * Renderiza exclusivamente as decorações e partículas ambientais de fundo (z-0).
 */
export default function SeasonalDecorations({ forcedTheme }) {
  const [detectedTheme, setDetectedTheme] = useState(() => getActiveSeasonalTheme());

  useEffect(() => {
    if (forcedTheme) return;

    const handleThemeChange = (e) => {
      setDetectedTheme(e.detail || getActiveSeasonalTheme());
    };

    window.addEventListener('seasonalThemeChange', handleThemeChange);
    return () => window.removeEventListener('seasonalThemeChange', handleThemeChange);
  }, [forcedTheme]);

  const activeTheme = forcedTheme || detectedTheme;

  if (activeTheme === 'default' || !activeTheme) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {activeTheme === 'halloween' && <HalloweenWorld />}
      {activeTheme === 'newyear' && <NewYearWorld />}
      {activeTheme === 'christmas' && <ChristmasWorld />}
      {activeTheme === 'easter' && <EasterWorld />}
      {activeTheme === 'spring' && <SpringWorld />}
      {activeTheme === 'summer' && <SummerWorld />}
      {activeTheme === 'autumn' && <AutumnWorld />}
      {activeTheme === 'winter' && <WinterWorld />}
    </div>
  );
}

/* =========================================================================
   HALLOWEEN: 10 Morcegos Cruzados, 2 Fantasmas, 2 Abóboras, 2 Aranhas e Névoa
   ========================================================================= */
function HalloweenWorld() {
  // 30 partículas de névoa / faíscas espectrais flutuantes
  const embers = useMemo(() => {
    const colors = ['#a855f7', '#f97316', '#22c55e', '#c084fc', '#fb923c'];
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.3 + (i % 3) * 2) % 96}%`,
      bottom: `${(i * 4.2) % 65}%`,
      duration: `${3.5 + (i % 4) * 1.2}s`,
      delay: `${(i % 6) * 0.5}s`,
      color: colors[i % colors.length],
      size: `${4 + (i % 3) * 3}px`,
    }));
  }, []);

  return (
    <>
      {/* 1. Morcegos com Bater de Asas 3D em Direções Cruzadas (10 Morcegos) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Esquerda para a Direita */}
        <AnimatedFlappingBat top="10vh" duration="7.5s" delay="0s" scale={0.7} />
        <AnimatedFlappingBat top="24vh" duration="10s" delay="2s" scale={0.9} />
        <AnimatedFlappingBat top="44vh" duration="8.5s" delay="4s" scale={0.65} />
        <AnimatedFlappingBat top="64vh" duration="11s" delay="6s" scale={0.8} />
        <AnimatedFlappingBat top="80vh" duration="9s" delay="8s" scale={0.7} />

        {/* Direita para a Esquerda (Cruzando) */}
        <AnimatedFlappingBat top="16vh" duration="8s" delay="1s" scale={0.75} reverse />
        <AnimatedFlappingBat top="34vh" duration="9.5s" delay="3s" scale={0.85} reverse />
        <AnimatedFlappingBat top="52vh" duration="7s" delay="5s" scale={0.6} reverse />
        <AnimatedFlappingBat top="72vh" duration="10.5s" delay="7s" scale={0.7} reverse />
        <AnimatedFlappingBat top="88vh" duration="8.5s" delay="9s" scale={0.8} reverse />
      </div>

      {/* 2. Fantasma Principal Translúcido no Canto Inferior Esquerdo */}
      <div
        className="absolute left-3 sm:left-10 bottom-20 sm:bottom-28 text-white/70"
        style={{ animation: 'ghostDrift 8s ease-in-out infinite' }}
      >
        <svg width="60" height="75" viewBox="0 0 100 120" fill="none" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
          <path
            d="M50 10 C25 10 15 35 15 65 C15 95 25 105 35 95 C45 85 55 105 65 95 C75 85 85 105 85 65 C85 35 75 10 50 10 Z"
            fill="currentColor"
            opacity="0.75"
          />
          <circle cx="38" cy="45" r="5" fill="#0f172a" />
          <circle cx="62" cy="45" r="5" fill="#0f172a" />
          <ellipse cx="50" cy="62" rx="6" ry="9" fill="#0f172a" />
          <circle cx="30" cy="54" r="4" fill="#a855f7" opacity="0.4" />
          <circle cx="70" cy="54" r="4" fill="#a855f7" opacity="0.4" />
        </svg>
      </div>

      {/* 3. Segundo Fantasma no Canto Médio Direito */}
      <div
        className="absolute right-4 sm:right-12 top-28 sm:top-36 text-white/60 hidden sm:block"
        style={{ animation: 'ghostDriftRight 9s ease-in-out infinite' }}
      >
        <svg width="45" height="55" viewBox="0 0 100 120" fill="none" className="drop-shadow-[0_0_12px_rgba(168,85,247,0.3)]">
          <path
            d="M50 10 C25 10 15 35 15 65 C15 95 25 105 35 95 C45 85 55 105 65 95 C75 85 85 105 85 65 C85 35 75 10 50 10 Z"
            fill="currentColor"
            opacity="0.65"
          />
          <circle cx="38" cy="45" r="4" fill="#0f172a" />
          <circle cx="62" cy="45" r="4" fill="#0f172a" />
          <ellipse cx="50" cy="62" rx="5" ry="7" fill="#0f172a" />
        </svg>
      </div>

      {/* 4. Abóbora Principal Jack-o'-Lantern Iluminada (Canto Inferior Direito) */}
      <div
        className="absolute right-3 sm:right-8 bottom-3 sm:bottom-6 z-20"
        style={{ animation: 'candleFlicker 3s ease-in-out infinite' }}
      >
        <svg width="70" height="60" viewBox="0 0 120 100" fill="none">
          <path d="M58 20 Q54 5 70 8 Q65 18 63 20 Z" fill="#22c55e" />
          <ellipse cx="60" cy="60" rx="55" ry="38" fill="#ea580c" stroke="#c2410c" strokeWidth="3" />
          <ellipse cx="60" cy="60" rx="38" ry="38" fill="#f97316" />
          <ellipse cx="60" cy="60" rx="18" ry="38" fill="#fb923c" />
          <polygon points="35,45 48,55 35,55" fill="#fef08a" />
          <polygon points="85,45 72,55 85,55" fill="#fef08a" />
          <polygon points="60,54 55,62 65,62" fill="#fef08a" />
          <path
            d="M32 70 Q60 92 88 70 Q78 78 72 72 Q66 82 60 72 Q54 82 48 72 Q42 78 32 70 Z"
            fill="#fef08a"
          />
        </svg>
      </div>

      {/* 5. Pequena Abóbora Companheira no Canto Inferior Esquerdo */}
      <div
        className="absolute left-16 sm:left-28 bottom-2 sm:bottom-4 hidden sm:block z-20 opacity-90"
        style={{ animation: 'candleFlicker 3.5s ease-in-out infinite', animationDelay: '1.2s' }}
      >
        <svg width="45" height="40" viewBox="0 0 120 100" fill="none">
          <path d="M58 20 Q54 5 70 8 Q65 18 63 20 Z" fill="#22c55e" />
          <ellipse cx="60" cy="60" rx="55" ry="38" fill="#c2410c" />
          <ellipse cx="60" cy="60" rx="38" ry="38" fill="#ea580c" />
          <polygon points="38,45 48,55 38,55" fill="#fef08a" />
          <polygon points="82,45 72,55 82,55" fill="#fef08a" />
          <path d="M38 72 Q60 90 82 72 Z" fill="#fef08a" />
        </svg>
      </div>

      {/* 6. Teias nos Cantos Superiores com Aranhas */}
      {/* Canto Superior Direito */}
      <div className="absolute right-0 top-0 text-white/30 hidden sm:block">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="100" y1="0" x2="0" y2="100" />
          <line x1="100" y1="0" x2="30" y2="100" />
          <line x1="100" y1="0" x2="0" y2="30" />
          <path d="M100 25 Q75 25 75 0" />
          <path d="M100 55 Q55 55 55 0" />
          <path d="M100 85 Q25 85 25 0" />
        </svg>
        <div
          className="absolute right-12 top-0 flex flex-col items-center"
          style={{ animation: 'spiderDrop 5s ease-in-out infinite' }}
        >
          <div className="w-[1px] h-12 bg-white/40" />
          <span className="text-sm -mt-1 leading-none text-purple-400">🕷️</span>
        </div>
      </div>

      {/* Canto Superior Esquerdo */}
      <div className="absolute left-0 top-0 text-white/30 hidden sm:block">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transform: 'scaleX(-1)' }}>
          <line x1="100" y1="0" x2="0" y2="100" />
          <line x1="100" y1="0" x2="30" y2="100" />
          <line x1="100" y1="0" x2="0" y2="30" />
          <path d="M100 25 Q75 25 75 0" />
          <path d="M100 55 Q55 55 55 0" />
          <path d="M100 85 Q25 85 25 0" />
        </svg>
        <div
          className="absolute left-10 top-0 flex flex-col items-center"
          style={{ animation: 'spiderDrop 6.5s ease-in-out infinite', animationDelay: '2.5s' }}
        >
          <div className="w-[1px] h-10 bg-white/40" />
          <span className="text-sm -mt-1 leading-none text-purple-400">🕷️</span>
        </div>
      </div>

      {/* 7. Névoa e Faíscas Espectrais Flutuantes */}
      <div className="absolute inset-0 overflow-hidden">
        {embers.map((em) => (
          <div
            key={em.id}
            className="seasonal-particle absolute rounded-full"
            style={{
              left: em.left,
              bottom: em.bottom,
              width: em.size,
              height: em.size,
              backgroundColor: em.color,
              boxShadow: `0 0 8px ${em.color}`,
              animation: `spookyEmberRise ${em.duration} ease-out infinite`,
              animationDelay: em.delay,
            }}
          />
        ))}
      </div>
    </>
  );
}

function AnimatedFlappingBat({ top, duration, delay, scale, reverse = false }) {
  return (
    <div
      className="seasonal-particle absolute"
      style={{
        top,
        animation: `${reverse ? 'seasonalBatFlyReverse' : 'seasonalBatFly'} ${duration} ease-in-out infinite`,
        animationDelay: delay,
        transform: `scale(${scale})`,
      }}
    >
      <div className="flex items-center text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
        {/* Asa Esquerda Flapping */}
        <div style={{ transformOrigin: 'right center', animation: 'batWingLeft 0.35s ease-in-out infinite' }}>
          <svg width="22" height="18" viewBox="0 0 30 25" fill="currentColor">
            <path d="M30 18 C20 18 10 10 0 12 C5 22 18 24 30 18 Z" />
          </svg>
        </div>
        {/* Cabeça e Corpo do Morcego */}
        <div className="w-3 h-4 bg-purple-500 rounded-full relative -mx-1 z-10">
          <div className="absolute -top-1 left-0 w-1 h-1.5 bg-purple-400 rounded-t" />
          <div className="absolute -top-1 right-0 w-1 h-1.5 bg-purple-400 rounded-t" />
        </div>
        {/* Asa Direita Flapping */}
        <div style={{ transformOrigin: 'left center', animation: 'batWingRight 0.35s ease-in-out infinite' }}>
          <svg width="22" height="18" viewBox="0 0 30 25" fill="currentColor">
            <path d="M0 18 C10 18 20 10 30 12 C25 22 12 24 0 18 Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   ANO NOVO: 12 Fogos de Artifício, 70 Confetis 3D e Borbulhas de Champanhe
   ========================================================================= */
function NewYearWorld() {
  const fireworks = useMemo(() => {
    return [
      { id: 1, top: '12%', left: '6%', delay: '0s', color: '#facc15', size: 105 },
      { id: 2, top: '14%', right: '6%', delay: '1.2s', color: '#c084fc', size: 115 },
      { id: 3, top: '38%', left: '4%', delay: '2.2s', color: '#38bdf8', size: 95 },
      { id: 4, top: '42%', right: '4%', delay: '3.4s', color: '#f472b6', size: 110 },
      { id: 5, top: '65%', left: '6%', delay: '4.5s', color: '#4ade80', size: 100 },
      { id: 6, top: '70%', right: '6%', delay: '0.8s', color: '#fbbf24', size: 120 },
      { id: 7, top: '22%', left: '14%', delay: '2.8s', color: '#fb7185', size: 90 },
      { id: 8, top: '25%', right: '14%', delay: '4.0s', color: '#e2e8f0', size: 100 },
      { id: 9, top: '85%', left: '12%', delay: '5.2s', color: '#fef08a', size: 105 },
      { id: 10, top: '52%', left: '10%', delay: '1.8s', color: '#a855f7', size: 95 },
      { id: 11, top: '56%', right: '10%', delay: '3.0s', color: '#38bdf8', size: 105 },
      { id: 12, top: '85%', right: '12%', delay: '4.8s', color: '#f59e0b', size: 100 },
    ];
  }, []);

  const confettiPieces = useMemo(() => {
    const colors = ['#f59e0b', '#fbbf24', '#c084fc', '#38bdf8', '#f43f5e', '#ffffff', '#4ade80', '#e879f9'];
    return Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      left: `${(i * 1.45) % 99}%`,
      duration: `${3.8 + (i % 6) * 0.9}s`,
      delay: `${(i % 12) * 0.45}s`,
      color: colors[i % colors.length],
      width: i % 3 === 0 ? '7px' : i % 3 === 1 ? '11px' : '9px',
      height: i % 3 === 0 ? '12px' : i % 3 === 1 ? '7px' : '15px',
    }));
  }, []);

  const bubbles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      const isRight = i % 2 === 1;
      const left = isRight ? `${80 + (i * 2.3) % 18}%` : `${2 + (i * 2.3) % 18}%`;
      return {
        id: i,
        left,
        bottom: `${(i * 3.5) % 35}%`,
        duration: `${2.5 + (i % 4) * 0.8}s`,
        delay: `${(i % 5) * 0.5}s`,
        size: `${6 + (i % 3) * 4}px`,
      };
    });
  }, []);

  return (
    <>
      {/* 1. Fogos de Artifício Circulares */}
      {fireworks.map((fw) => (
        <div
          key={fw.id}
          className="absolute"
          style={{
            top: fw.top,
            left: fw.left,
            right: fw.right,
            width: fw.size,
            height: fw.size,
            animation: `fireworkBurst 2.5s ease-out infinite`,
            animationDelay: fw.delay,
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {Array.from({ length: 14 }).map((_, rayIdx) => {
              const angle = (rayIdx * (360 / 14) * Math.PI) / 180;
              const x2 = 50 + 44 * Math.cos(angle);
              const y2 = 50 + 44 * Math.sin(angle);
              return (
                <line
                  key={rayIdx}
                  x1="50"
                  y1="50"
                  x2={x2}
                  y2={y2}
                  stroke={fw.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="4 6"
                  opacity="0.85"
                />
              );
            })}
            <circle cx="50" cy="50" r="4" fill="#ffffff" />
          </svg>
        </div>
      ))}

      {/* 2. Chuva Intensa de Confetis 3D */}
      <div className="absolute inset-0 overflow-hidden">
        {confettiPieces.map((c) => (
          <div
            key={c.id}
            className="seasonal-particle absolute rounded-sm"
            style={{
              left: c.left,
              top: '-25px',
              width: c.width,
              height: c.height,
              backgroundColor: c.color,
              boxShadow: `0 0 6px ${c.color}`,
              animation: `confettiTumble ${c.duration} linear infinite`,
              animationDelay: c.delay,
            }}
          />
        ))}
      </div>

      {/* 3. Borbulhas Douradas e Faíscas de Champanhe a Subir */}
      <div className="absolute inset-0 overflow-hidden">
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="seasonal-particle absolute rounded-full bg-yellow-300 text-yellow-200 flex items-center justify-center"
            style={{
              left: b.left,
              bottom: b.bottom,
              width: b.size,
              height: b.size,
              boxShadow: '0 0 8px rgba(253, 224, 71, 0.8)',
              animation: `sparkleFloat ${b.duration} ease-out infinite`,
              animationDelay: b.delay,
            }}
          >
            ✨
          </div>
        ))}
      </div>
    </>
  );
}

/* =========================================================================
   NATAL: Cordão Superior com Centro Desimpedido + 76 Flocos em Tripla Camada
   ========================================================================= */
function ChristmasWorld() {
  // Cordão de lâmpadas dividido em Asa Esquerda e Asa Direita, deixando o centro 100% desimpedido
  const leftLights = useMemo(() => {
    const bulbColors = ['#ef4444', '#22c55e', '#eab308', '#3b82f6', '#ec4899'];
    return Array.from({ length: 18 }).map((_, i) => ({
      id: `l-${i}`,
      color: bulbColors[i % bulbColors.length],
      delay: `${(i % 4) * 0.35}s`,
    }));
  }, []);

  const rightLights = useMemo(() => {
    const bulbColors = ['#eab308', '#3b82f6', '#ec4899', '#ef4444', '#22c55e'];
    return Array.from({ length: 18 }).map((_, i) => ({
      id: `r-${i}`,
      color: bulbColors[i % bulbColors.length],
      delay: `${((i + 2) % 4) * 0.35}s`,
    }));
  }, []);

  return (
    <>
      {/* 1. Cordão de Luzes de Natal (Pisca-Pisca) com Vão Central Livre para a Mensagem */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start px-2 sm:px-4 overflow-hidden z-20">
        {/* Asa Esquerda de Luzes */}
        <div className="flex justify-around flex-1 max-w-[34%]">
          {leftLights.map((l) => (
            <div key={l.id} className="flex flex-col items-center">
              <div className="w-[1px] h-2 bg-gray-500/70" />
              <div
                className="w-2.5 h-3.5 rounded-full"
                style={{
                  backgroundColor: l.color,
                  color: l.color,
                  animation: `fairyLightTwinkle 1.4s ease-in-out infinite`,
                  animationDelay: l.delay,
                }}
              />
            </div>
          ))}
        </div>

        {/* Fio de ligação superior sutil no centro (sem lâmpadas penduradas no banner) */}
        <div className="flex-1 max-w-[32%] h-[1px] bg-gradient-to-r from-gray-500/60 via-gray-600/30 to-gray-500/60 mt-0.5" />

        {/* Asa Direita de Luzes */}
        <div className="flex justify-around flex-1 max-w-[34%]">
          {rightLights.map((l) => (
            <div key={l.id} className="flex flex-col items-center">
              <div className="w-[1px] h-2 bg-gray-500/70" />
              <div
                className="w-2.5 h-3.5 rounded-full"
                style={{
                  backgroundColor: l.color,
                  color: l.color,
                  animation: `fairyLightTwinkle 1.4s ease-in-out infinite`,
                  animationDelay: l.delay,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Queda Densa de Neve em Tripla Camada (76 Flocos) */}
      <SnowfallParticles count={76} />
    </>
  );
}

/* =========================================================================
   PÁSCOA, PRIMAVERA, VERÃO, OUTONO, INVERNO (ALTA DENSIDADE)
   ========================================================================= */
function EasterWorld() {
  return (
    <>
      <EasterPastelBlossoms count={42} />
      {/* Orelhas de coelho animadas na borda inferior */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 animate-seasonal-badge opacity-90 hidden sm:block">
        <svg width="90" height="55" viewBox="0 0 100 60" fill="none">
          <ellipse cx="35" cy="30" rx="14" ry="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          <ellipse cx="35" cy="32" rx="7" ry="18" fill="#f472b6" opacity="0.6" />
          <ellipse cx="65" cy="30" rx="14" ry="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          <ellipse cx="65" cy="32" rx="7" ry="18" fill="#f472b6" opacity="0.6" />
        </svg>
      </div>
    </>
  );
}

function SpringWorld() {
  return <SakuraPetals count={55} />;
}

function SummerWorld() {
  return (
    <>
      <SummerFireflies count={50} />
      {/* Pranchas de surf verticais nas extremidades */}
      <TropicalSurfboardLeft />
      <TropicalSurfboardRight />
    </>
  );
}

function AutumnWorld() {
  return <AutumnLeaves count={52} />;
}

function WinterWorld() {
  return (
    <>
      <WinterIceCrystals count={52} />
      {/* Bonecos de neve acolhedores nos cantos inferiores */}
      <ClassicSnowmanLeft />
      <CuteBeanieSnowmanRight />
    </>
  );
}

/* --- Subcomponentes de Partículas de Alta Densidade --- */

function SnowfallParticles({ count = 76 }) {
  const snowflakes = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // 3 camadas de profundidade: micro-fundo, médio, e primeiro plano
      const isForeground = i % 5 === 0;
      const isMidground = i % 5 === 1 || i % 5 === 2;
      const size = isForeground ? 20 + (i % 3) * 4 : isMidground ? 13 + (i % 4) * 2 : 9 + (i % 3) * 2;
      const opacity = isForeground ? 0.85 : isMidground ? 0.6 : 0.35;
      const duration = isForeground ? 6.5 + (i % 3) * 1.5 : isMidground ? 5 + (i % 4) * 1.2 : 3.8 + (i % 3) * 1;

      return {
        id: i,
        left: `${(i * 1.33) % 98}%`,
        duration: `${duration}s`,
        delay: `${(i % 12) * 0.55}s`,
        size: `${size}px`,
        opacity,
      };
    });
  }, [count]);

  return (
    <div className="absolute inset-0">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="seasonal-particle absolute text-white"
          style={{
            left: flake.left,
            top: '-25px',
            fontSize: flake.size,
            opacity: flake.opacity,
            animation: `seasonalSnowfall ${flake.duration} linear infinite`,
            animationDelay: flake.delay,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}

function SakuraPetals({ count = 55 }) {
  const petals = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i * 1.8) % 98}%`,
      duration: `${4.5 + (i % 6) * 1.1}s`,
      delay: `${(i % 9) * 0.5}s`,
      size: `${11 + (i % 4) * 4}px`,
      opacity: 0.45 + (i % 5) * 0.12,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0">
      {petals.map((p) => (
        <div
          key={p.id}
          className="seasonal-particle absolute text-pink-300"
          style={{
            left: p.left,
            top: '-25px',
            fontSize: p.size,
            opacity: p.opacity,
            animation: `seasonalPetalDrift ${p.duration} linear infinite`,
            animationDelay: p.delay,
          }}
        >
          🌸
        </div>
      ))}
    </div>
  );
}

function AutumnLeaves({ count = 52 }) {
  const leaves = useMemo(() => {
    const leafIcons = ['🍂', '🍁'];
    const colors = ['#f59e0b', '#ea580c', '#dc2626', '#b45309', '#d97706'];
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      icon: leafIcons[i % 2],
      color: colors[i % colors.length],
      left: `${(i * 1.9) % 97}%`,
      duration: `${5.5 + (i % 5) * 1.3}s`,
      delay: `${(i % 8) * 0.6}s`,
      size: `${13 + (i % 4) * 4}px`,
      opacity: 0.55 + (i % 4) * 0.12,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="seasonal-particle absolute"
          style={{
            left: leaf.left,
            top: '-25px',
            fontSize: leaf.size,
            color: leaf.color,
            opacity: leaf.opacity,
            animation: `seasonalLeafFall ${leaf.duration} linear infinite`,
            animationDelay: leaf.delay,
          }}
        >
          {leaf.icon}
        </div>
      ))}
    </div>
  );
}

// Função determinística de pseudo-aleatoriedade para espalhar partículas organicamente (sem diagonais)
function getScatterCoord(index, prime1, prime2, min, max) {
  const hash = Math.sin(index * prime1 + prime2) * 10000;
  const normalized = hash - Math.floor(hash);
  return Math.round(min + normalized * (max - min));
}

function EasterPastelBlossoms({ count = 42 }) {
  const items = useMemo(() => {
    const icons = ['✨', '🌸', '🥚', '🦋'];
    return Array.from({ length: count }).map((_, i) => {
      const left = getScatterCoord(i, 37.19, 13.43, 3, 94);
      const top = getScatterCoord(i, 83.61, 41.77, 4, 88);
      return {
        id: i,
        icon: icons[i % 4],
        left: `${left}%`,
        top: `${top}%`,
        duration: `${2.6 + (i % 4) * 0.7}s`,
        delay: `${(i % 7) * 0.45}s`,
        size: `${12 + (i % 3) * 4}px`,
        opacity: 0.55 + (i % 4) * 0.12,
      };
    });
  }, [count]);

  return (
    <div className="absolute inset-0">
      {items.map((item) => (
        <div
          key={item.id}
          className="seasonal-particle absolute"
          style={{
            left: item.left,
            top: item.top,
            fontSize: item.size,
            opacity: item.opacity,
            animation: `seasonalSparkle ${item.duration} ease-in-out infinite`,
            animationDelay: item.delay,
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
}

function SummerFireflies({ count = 50 }) {
  const fireflies = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const left = getScatterCoord(i, 43.17, 19.83, 3, 95);
      const top = getScatterCoord(i, 79.43, 53.21, 3, 92);
      return {
        id: i,
        left: `${left}%`,
        top: `${top}%`,
        duration: `${2.0 + (i % 5) * 0.6}s`,
        delay: `${(i % 8) * 0.35}s`,
        size: `${7 + (i % 3) * 4}px`,
      };
    });
  }, [count]);

  return (
    <div className="absolute inset-0">
      {fireflies.map((ff) => (
        <div
          key={ff.id}
          className="seasonal-particle absolute text-yellow-300/80 drop-shadow-[0_0_6px_rgba(253,224,71,0.9)]"
          style={{
            left: ff.left,
            top: ff.top,
            fontSize: ff.size,
            animation: `seasonalSparkle ${ff.duration} ease-in-out infinite`,
            animationDelay: ff.delay,
          }}
        >
          •
        </div>
      ))}
    </div>
  );
}

function WinterIceCrystals({ count = 52 }) {
  const crystals = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const left = getScatterCoord(i, 29.17, 11.23, 2, 96);
      return {
        id: i,
        left: `${left}%`,
        duration: `${4.8 + (i % 6) * 1.2}s`,
        delay: `${(i % 8) * 0.55}s`,
        size: `${10 + (i % 4) * 4}px`,
        opacity: 0.45 + (i % 4) * 0.12,
      };
    });
  }, [count]);

  return (
    <div className="absolute inset-0">
      {crystals.map((c) => (
        <div
          key={c.id}
          className="seasonal-particle absolute text-sky-200"
          style={{
            left: c.left,
            top: '-25px',
            fontSize: c.size,
            opacity: c.opacity,
            animation: `seasonalSnowfall ${c.duration} linear infinite`,
            animationDelay: c.delay,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}

/* =========================================================================
   ELEMENTOS DE VERÃO: PRANCHAS DE SURF VERTICAIS (CANTO ESQUERDO E DIREITO)
   ========================================================================= */
function TropicalSurfboardLeft() {
  return (
    <div
      className="absolute left-3 sm:left-8 bottom-2 sm:bottom-4 z-10 opacity-90 hidden sm:block"
      style={{ animation: 'surfboardSwayLeft 6s ease-in-out infinite' }}
      data-testid="surfboard"
    >
      <svg width="46" height="140" viewBox="0 0 50 160" fill="none">
        <defs>
          <linearGradient id="surfGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <path
          d="M25 5 C38 35 45 90 42 145 C40 155 32 158 25 158 C18 158 10 155 8 145 C5 90 12 35 25 5 Z"
          fill="url(#surfGradLeft)"
          stroke="#0891b2"
          strokeWidth="2"
        />
        <line x1="25" y1="8" x2="25" y2="155" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.75" />
        <path d="M12 70 Q25 65 38 70" stroke="#ffffff" strokeWidth="3" opacity="0.8" />
        <path d="M14 85 Q25 80 36 85" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
        <path d="M23 158 L25 163 L27 158 Z" fill="#0e7490" />
      </svg>
    </div>
  );
}

function TropicalSurfboardRight() {
  return (
    <div
      className="absolute right-4 sm:right-9 bottom-3 sm:bottom-5 z-10 opacity-90 hidden sm:block"
      style={{ animation: 'surfboardSwayRight 7s ease-in-out infinite' }}
      data-testid="surfboard"
    >
      <svg width="42" height="130" viewBox="0 0 50 150" fill="none">
        <defs>
          <linearGradient id="surfGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
        </defs>
        <path
          d="M25 5 C38 35 44 85 41 138 C39 146 32 148 25 148 C18 148 11 146 9 138 C6 85 12 35 25 5 Z"
          fill="url(#surfGradRight)"
          stroke="#e11d48"
          strokeWidth="2"
        />
        <line x1="25" y1="7" x2="25" y2="146" stroke="#ffffff" strokeWidth="1.5" opacity="0.7" />
        <path d="M13 60 C18 55 22 65 27 60 C32 55 35 62 37 60" stroke="#ffffff" strokeWidth="2.5" fill="none" opacity="0.85" />
        <path d="M15 72 C20 67 24 77 29 72 C33 67 35 74 36 72" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.65" />
        <circle cx="25" cy="35" r="4" fill="#ffffff" opacity="0.9" />
      </svg>
    </div>
  );
}

/* =========================================================================
   ELEMENTOS DE INVERNO: BONECOS DE NEVE ACOLHEDORES (ESQUERDO E DIREITO)
   ========================================================================= */
function ClassicSnowmanLeft() {
  return (
    <div
      className="absolute left-3 sm:left-8 bottom-2 sm:bottom-4 z-10 opacity-95 hidden sm:block"
      style={{ animation: 'snowmanWobble 4s ease-in-out infinite' }}
      data-testid="snowman"
    >
      <svg width="68" height="95" viewBox="0 0 80 110" fill="none">
        <ellipse cx="40" cy="104" rx="30" ry="6" fill="#0f172a" opacity="0.25" />
        <circle cx="40" cy="82" r="24" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="40" cy="54" r="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="40" cy="48" r="2" fill="#1e293b" />
        <circle cx="40" cy="56" r="2" fill="#1e293b" />
        <circle cx="40" cy="64" r="2" fill="#1e293b" />
        <line x1="22" y1="52" x2="6" y2="40" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="44" x2="8" y2="48" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="58" y1="52" x2="74" y2="42" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
        <line x1="68" y1="46" x2="72" y2="50" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="40" cy="28" r="13" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="35" cy="25" r="1.8" fill="#0f172a" />
        <circle cx="45" cy="25" r="1.8" fill="#0f172a" />
        <polygon points="40,28 40,31 52,30" fill="#ea580c" />
        <circle cx="34" cy="33" r="1" fill="#0f172a" />
        <circle cx="37" cy="35" r="1" fill="#0f172a" />
        <circle cx="40" cy="36" r="1" fill="#0f172a" />
        <circle cx="43" cy="35" r="1" fill="#0f172a" />
        <circle cx="46" cy="33" r="1" fill="#0f172a" />
        <rect x="28" y="38" width="24" height="6" rx="3" fill="#dc2626" />
        <path d="M44 42 L42 62 L48 62 L48 42 Z" fill="#dc2626" />
        <line x1="42" y1="48" x2="48" y2="48" stroke="#16a34a" strokeWidth="2" />
        <line x1="42" y1="54" x2="48" y2="54" stroke="#16a34a" strokeWidth="2" />
        <rect x="25" y="16" width="30" height="3" rx="1.5" fill="#1e293b" />
        <rect x="30" y="5" width="20" height="12" rx="2" fill="#0f172a" />
        <rect x="30" y="14" width="20" height="2.5" fill="#dc2626" />
      </svg>
    </div>
  );
}

function CuteBeanieSnowmanRight() {
  return (
    <div
      className="absolute right-4 sm:right-9 bottom-3 sm:bottom-5 z-10 opacity-95 hidden sm:block"
      style={{ animation: 'snowmanWobbleSmall 4.5s ease-in-out infinite' }}
      data-testid="snowman"
    >
      <svg width="55" height="78" viewBox="0 0 70 95" fill="none">
        <ellipse cx="35" cy="90" rx="25" ry="5" fill="#0f172a" opacity="0.22" />
        <circle cx="35" cy="70" r="20" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="35" cy="46" r="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="35" cy="43" r="1.5" fill="#0f172a" />
        <circle cx="35" cy="49" r="1.5" fill="#0f172a" />
        <circle cx="35" cy="25" r="11" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="28" cy="27" r="2.5" fill="#f472b6" opacity="0.5" />
        <circle cx="42" cy="27" r="2.5" fill="#f472b6" opacity="0.5" />
        <circle cx="31" cy="23" r="1.5" fill="#0f172a" />
        <circle cx="39" cy="23" r="1.5" fill="#0f172a" />
        <polygon points="35,25 35,27 44,26" fill="#ea580c" />
        <rect x="25" y="33" width="20" height="5" rx="2.5" fill="#06b6d4" />
        <path d="M38 36 L36 50 L41 50 L41 36 Z" fill="#06b6d4" />
        <path d="M26 18 Q35 7 44 18 Z" fill="#0284c7" />
        <rect x="25" y="16" width="20" height="3" rx="1.5" fill="#38bdf8" />
        <circle cx="35" cy="7" r="3.5" fill="#f8fafc" />
      </svg>
    </div>
  );
}
