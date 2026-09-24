import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { Users, Music, User, Plus, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';
import SeasonalBanner from '../components/SeasonalBanner';
import { getSessionToken } from '../utils/session';
import { getRandomAvatar, isSeasonalAvatar, isMusicAvatar, getSeasonalAvatarList } from '../utils/avatarService';
import { isValidRoomCode, normalizeRoomCode } from '../utils/roomValidation';
import Footer from '../components/Footer';

export default function Home() {
  const { roomId: urlRoomId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { t } = useTranslation();
  const [nickname, setNickname] = useState(() => localStorage.getItem('tunein_nickname') || '');
  
  const cleanUrlRoomId = urlRoomId && isValidRoomCode(urlRoomId) ? normalizeRoomCode(urlRoomId) : null;
  const [roomCode, setRoomCode] = useState(cleanUrlRoomId || '');
  const [isCheckingRoom, setIsCheckingRoom] = useState(false);
  const [roomError, setRoomError] = useState('');
  const [roomExists, setRoomExists] = useState(cleanUrlRoomId ? null : false);
  const [avatar, setAvatar] = useState(() => {
    const saved = localStorage.getItem('tunein_avatar');
    const isSeasonalActive = getSeasonalAvatarList().length > 0;
    if (saved && !saved.includes('dicebear.com/7.x/bottts') && !isMusicAvatar(saved)) {
      if (!isSeasonalActive && isSeasonalAvatar(saved)) {
        const generated = getRandomAvatar();
        localStorage.setItem('tunein_avatar', generated);
        return generated;
      }
      return saved;
    }
    const generated = getRandomAvatar();
    localStorage.setItem('tunein_avatar', generated);
    return generated;
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const handleThemeChange = (e) => {
      const newTheme = e.detail;
      if (newTheme === 'halloween' || newTheme === 'christmas') {
        const nextAvatar = getRandomAvatar(newTheme);
        setAvatar(nextAvatar);
        localStorage.setItem('tunein_avatar', nextAvatar);
      } else {
        const nextAvatar = getRandomAvatar('default');
        setAvatar(nextAvatar);
        localStorage.setItem('tunein_avatar', nextAvatar);
      }
    };
    window.addEventListener('seasonalThemeChange', handleThemeChange);
    return () => window.removeEventListener('seasonalThemeChange', handleThemeChange);
  }, []);

  useEffect(() => {
    if (!urlRoomId) return;

    // Se o código da URL não for válido (ex.: /blacker com 7 letras ou caracteres inválidos), limpa a rota para /
    if (!isValidRoomCode(urlRoomId)) {
      navigate('/', { replace: true });
      return;
    }

    if (!socket) return;

    setIsCheckingRoom(true);
    let isCancelled = false;

    // Timeout de salvaguarda para não bloquear caso o servidor demore a responder
    const timer = setTimeout(() => {
      if (!isCancelled) {
        setIsCheckingRoom(false);
      }
    }, 3500);

    socket.emit('checkRoom', { roomId: cleanUrlRoomId }, (res) => {
      clearTimeout(timer);
      if (isCancelled) return;
      setIsCheckingRoom(false);
      if (res && res.exists) {
        setRoomExists(true);
        setRoomError('');
      } else {
        setRoomExists(false);
        setRoomError(t('room_not_found'));
      }
    });

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [socket, urlRoomId, cleanUrlRoomId, navigate, t]);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!nickname.trim() || !socket) return;
    setIsCreating(true);

    const cleanNick = nickname.trim();
    localStorage.setItem('tunein_nickname', cleanNick);
    localStorage.setItem('tunein_avatar', avatar);
    const sessionToken = getSessionToken();

    socket.emit('createRoom', { nickname: cleanNick, avatar, sessionToken }, (response) => {
      if (response.success) {
        navigate(`/room/${response.roomId}`, { state: { initialRoom: response.room } });
      }
      setIsCreating(false);
    });
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    const targetRoom = cleanUrlRoomId || roomCode.trim();
    if (!nickname.trim() || !targetRoom || !socket) return;

    const cleanNick = nickname.trim();
    localStorage.setItem('tunein_nickname', cleanNick);
    localStorage.setItem('tunein_avatar', avatar);
    const sessionToken = getSessionToken();

    navigate(`/room/${targetRoom}?nickname=${encodeURIComponent(cleanNick)}&avatar=${encodeURIComponent(avatar)}&sessionToken=${encodeURIComponent(sessionToken)}`);
  };

  return (
    <div className="w-full max-w-4xl p-4 sm:p-6 relative z-10">
      <div className="w-full flex justify-end items-center gap-2 -mt-4 sm:-mt-6 mb-6 sm:mb-8 z-50">
        <div className="flex items-center bg-surface rounded-lg border border-theme-border shadow-sm divide-x divide-theme-border/60">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>

      <div className="text-center mb-8 sm:mb-12 flex flex-col items-center">
        <SeasonalBanner className="mb-2 sm:mb-3 animate-festive-banner" />
        <div className="inline-block relative">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-orange via-accent-pink to-accent-purple mb-3 sm:mb-4 animate-gradient-x">
            TuneIn
          </h1>
          <Music className="absolute -top-3 -right-6 sm:-top-5 sm:-right-8 text-accent-pink animate-bounce w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12" />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-theme-text mb-4">
          {t('home_title')}
        </h2>
      </div>

      <div className="glass-panel p-5 sm:p-8 space-y-6 sm:space-y-8 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center">
          <img src={avatar || undefined} alt="Avatar" className="w-24 h-24 rounded-full bg-surface border-2 border-accent-purple mb-4" />
          <button
            type="button"
            onClick={() => {
              const newAvatar = getRandomAvatar(undefined, avatar);
              setAvatar(newAvatar);
              localStorage.setItem('tunein_avatar', newAvatar);
            }}
            className="text-xs text-accent-purple hover:underline"
          >
            {t('change_avatar')}
          </button>
        </div>

        <div>
          <label className="block text-theme-secondary font-bold mb-2 flex items-center space-x-2">
            <User size={18} className="text-accent-orange" />
            <span>{t('nickname_label')}</span>
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full bg-background border border-theme-border rounded-lg px-4 py-3 text-theme-text focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange transition-all"
            placeholder={t('nickname_placeholder')}
            maxLength={15}
          />
        </div>

        {roomError && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center flex items-center justify-center gap-2 animate-fade-in">
            <span>⚠️ {roomError}</span>
          </div>
        )}

        <div className="pt-2 space-y-4">
          {cleanUrlRoomId && roomExists !== false ? (
            <button
              onClick={handleJoinRoom}
              disabled={!nickname.trim() || isCheckingRoom}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-accent-purple to-accent-pink hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 neon-glow"
            >
              {isCheckingRoom ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>{t('loading_room')}</span>
                </>
              ) : (
                <>
                  <Users size={20} />
                  <span>{t('join_room')} {cleanUrlRoomId}</span>
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={handleCreateRoom}
                disabled={!nickname.trim() || isCreating}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-accent-orange via-accent-pink to-accent-purple hover:opacity-90 text-white font-bold py-4 px-6 rounded-lg transition-all disabled:opacity-50 neon-glow"
              >
                {isCreating ? <Loader2 className="animate-spin" /> : <Plus size={24} />}
                <span className="text-lg">{t('create_room')}</span>
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-theme-border"></div>
                <span className="flex-shrink-0 mx-4 text-theme-muted text-sm">{t('or')}</span>
                <div className="flex-grow border-t border-theme-border"></div>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="min-w-0 flex-1 bg-background border border-theme-border rounded-lg px-3 sm:px-4 py-3 text-theme-text focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all font-mono text-center sm:text-left text-sm sm:text-base tracking-wider placeholder:tracking-normal placeholder:text-xs sm:placeholder:text-sm"
                  placeholder={t('enter_code')}
                  maxLength={6}
                />
                <button
                  onClick={handleJoinRoom}
                  disabled={!nickname.trim() || roomCode.length < 6}
                  className="flex-shrink-0 flex items-center justify-center bg-surface border border-accent-purple hover:bg-accent-purple/20 text-theme-text font-bold py-3 px-4 sm:px-6 rounded-lg transition-all disabled:opacity-50"
                  title={t('join_room')}
                  aria-label={t('join_room')}
                >
                  <Users size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer className="mt-4 sm:mt-6" />
    </div>
  );
}
