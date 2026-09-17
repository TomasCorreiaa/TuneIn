import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import Lobby from '../components/Lobby';
import Arena from '../components/Arena';
import Scoreboard from '../components/Scoreboard';
import Podium from '../components/Podium';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';
import SeasonalBanner from '../components/SeasonalBanner';
import QrCodeModal from '../components/QrCodeModal';
import SettingsModal from '../components/SettingsModal';
import { Copy, QrCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSessionToken } from '../utils/session';
import { getRandomAvatar, isSeasonalAvatar, isMusicAvatar, getSeasonalAvatarList } from '../utils/avatarService';
import Footer from '../components/Footer';

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket();
  const [searchParams] = useSearchParams();
  const [room, setRoom] = useState(location.state?.initialRoom || null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!socket) return;

    const queryNickname = searchParams.get('nickname');
    const queryAvatar = searchParams.get('avatar');
    const querySessionToken = searchParams.get('sessionToken');

    const storedNickname = typeof window !== 'undefined' ? localStorage.getItem('tunein_nickname') : '';
    const storedAvatar = typeof window !== 'undefined' ? localStorage.getItem('tunein_avatar') : '';
    const sessionToken = querySessionToken || getSessionToken();

    const nickname = queryNickname || storedNickname;
    let avatar = queryAvatar || storedAvatar;
    const isSeasonalActive = getSeasonalAvatarList().length > 0;
    if (!avatar || isMusicAvatar(avatar) || (!isSeasonalActive && isSeasonalAvatar(avatar))) {
      avatar = getRandomAvatar();
    }

    // Se a sala ainda não estiver carregada (ex.: F5 ou navegação direta)
    if (!room) {
      if (!nickname) {
        navigate(`/${roomId}`);
        return;
      }

      socket.emit('joinRoom', { roomId, playerData: { nickname, avatar, sessionToken } }, (response) => {
        if (!response.success) {
          setError(response.error);
        } else {
          setRoom(response.room);
          if (queryNickname || queryAvatar || querySessionToken) {
            navigate(`/room/${roomId}`, { replace: true });
          }
        }
      });
    } else if (queryNickname && queryAvatar) {
      socket.emit('joinRoom', { roomId, playerData: { nickname, avatar, sessionToken } }, (response) => {
        if (!response.success) {
          setError(response.error);
        } else {
          setRoom(response.room);
          navigate(`/room/${roomId}`, { replace: true });
        }
      });
    }

    const handleRoomUpdated = (updatedRoom) => {
      setRoom(updatedRoom);
    };

    const handleGameStarted = (updatedRoom) => {
      setRoom(updatedRoom);
    };
    
    const handleGameEnded = (updatedRoom) => {
      setRoom(updatedRoom);
    };
    
    const handleKicked = () => {
      navigate('/');
      alert('Foste expulso da sala pelo dono.');
    };

    socket.on('roomUpdated', handleRoomUpdated);
    socket.on('gameStarted', handleGameStarted);
    socket.on('gameEnded', handleGameEnded);
    socket.on('kicked', handleKicked);

    return () => {
      socket.off('roomUpdated', handleRoomUpdated);
      socket.off('gameStarted', handleGameStarted);
      socket.off('gameEnded', handleGameEnded);
      socket.off('kicked', handleKicked);
    };
  }, [socket, roomId, searchParams, navigate]);

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/${roomId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-accent-pink mb-4">{t('error')}</h2>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 bg-surface px-4 py-2 rounded"
        >
          {t('back')}
        </button>
      </div>
    );
  }

  if (!room) {
    return <div className="text-accent-purple animate-pulse">{t('loading_room')}</div>;
  }

  return (
    <div className="w-full max-w-4xl h-[92dvh] sm:h-[90vh] flex flex-col pt-2 sm:pt-6 relative z-10">
      <div className="flex justify-between items-center mb-3 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-pink cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>TuneIn</h1>
        
        {/* Banner Festivo centrado na barra de topo (oculto em mobile para desimpedir a interface) */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <SeasonalBanner className="animate-festive-banner" />
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 z-50 flex-shrink-0">
          {/* Grupo de Preferências (Tema, Tema Sazonal, Idioma) */}
          <div className="flex items-center bg-surface rounded-lg border border-theme-border shadow-sm divide-x divide-theme-border/60">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          
          {/* Grupo Unificado de Partilha da Sala (QR Code + Copiar Código) */}
          <div className="flex items-center bg-surface rounded-lg border border-theme-border shadow-sm divide-x divide-theme-border/60">
            <button 
              onClick={() => setIsQrOpen(true)}
              className="p-2 sm:p-2.5 hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center transition-colors text-theme-secondary hover:text-accent-pink focus:outline-none"
              title={t('open_qr')}
              aria-label={t('qr_code')}
            >
              <QrCode size={18} />
            </button>

            <button 
              onClick={handleCopyUrl}
              className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3.5 py-2 sm:py-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative focus:outline-none"
              title="Copiar link da sala"
            >
              <span className="text-sm text-theme-secondary hidden sm:inline">{t('room')}</span>
              <span className="font-mono font-bold tracking-widest text-accent-orange text-sm sm:text-base">{roomId}</span>
              <Copy size={16} className="text-theme-secondary ml-1" />
              {copied && (
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-accent-pink text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-md">
                  {t('copied')}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow glass-panel overflow-hidden relative flex flex-col z-10 shadow-2xl">
        {room.state === 'lobby' && <Lobby room={room} socket={socket} onOpenSettings={() => setIsSettingsOpen(true)} />}
        {room.state === 'arena' && <Arena room={room} socket={socket} />}
        {room.state === 'results' && <Scoreboard room={room} socket={socket} />}
        {room.state === 'podium' && <Podium room={room} socket={socket} />}
      </div>

      <Footer compact className="mt-2 flex-shrink-0" />

      <QrCodeModal 
        isOpen={isQrOpen} 
        onClose={() => setIsQrOpen(false)} 
        roomId={roomId} 
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        room={room} 
        socket={socket} 
        isHost={room.hostId === socket?.id}
      />
    </div>
  );
}
