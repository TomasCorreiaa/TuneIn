import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import Lobby from '../components/Lobby';
import Arena from '../components/Arena';
import Scoreboard from '../components/Scoreboard';
import Podium from '../components/Podium';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket();
  const [searchParams] = useSearchParams();
  const [room, setRoom] = useState(location.state?.initialRoom || null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!socket) return;

    // Se viemos por URL direto com parâmetros
    const nickname = searchParams.get('nickname');
    const avatar = searchParams.get('avatar');

    if (nickname && avatar) {
      socket.emit('joinRoom', { roomId, playerData: { nickname, avatar } }, (response) => {
        if (!response.success) {
          setError(response.error);
        } else {
          setRoom(response.room);
          // Limpar URL
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
    <div className="w-full max-w-4xl h-[90vh] flex flex-col pt-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-pink cursor-pointer" onClick={() => navigate('/')}>TuneIn</h1>
        
        <div className="flex items-center space-x-4 z-50">
          <LanguageSwitcher />
          
          <button 
            onClick={handleCopyUrl}
            className="bg-surface hover:bg-surface/80 px-4 py-2 rounded-lg border border-gray-700 flex items-center space-x-2 transition-colors relative"
            title="Copiar link da sala"
          >
            <span className="text-sm text-gray-400">{t('room')}</span>
            <span className="font-mono font-bold tracking-widest text-accent-orange">{roomId}</span>
            <Copy size={16} className="text-gray-400 ml-2" />
            {copied && (
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-accent-pink text-white text-xs px-2 py-1 rounded">
                {t('copied')}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-grow glass-panel overflow-hidden relative flex flex-col">
        {room.state === 'lobby' && <Lobby room={room} socket={socket} />}
        {room.state === 'arena' && <Arena room={room} socket={socket} />}
        {room.state === 'results' && <Scoreboard room={room} socket={socket} />}
        {room.state === 'podium' && <Podium room={room} socket={socket} />}
      </div>
    </div>
  );
}
