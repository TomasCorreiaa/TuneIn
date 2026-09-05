import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { Play, Users, Music, User, Plus, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Home() {
  const { roomId: urlRoomId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { t } = useTranslation();
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState(urlRoomId || '');
  const [avatar, setAvatar] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setAvatar(`https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}`);
  }, []);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!nickname.trim() || !socket) return;
    setIsCreating(true);

    socket.emit('createRoom', { nickname, avatar }, (response) => {
      if (response.success) {
        navigate(`/room/${response.roomId}`, { state: { initialRoom: response.room } });
      }
      setIsCreating(false);
    });
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!nickname.trim() || !roomCode.trim() || !socket) return;

    navigate(`/room/${roomCode}?nickname=${encodeURIComponent(nickname)}&avatar=${encodeURIComponent(avatar)}`);
  };

  return (
    <div className="w-full max-w-4xl p-6 relative">
      <div className="absolute top-0 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="text-center mb-12">
        <div className="inline-block relative">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-orange via-accent-pink to-accent-purple mb-4 animate-gradient-x">
            TuneIn
          </h1>
          <Music className="absolute -top-6 -right-8 text-accent-pink animate-bounce" size={48} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {t('home_title')}
        </h2>
      </div>

      <div className="glass-panel p-8 space-y-8">
        <div className="flex flex-col items-center">
          <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full bg-surface border-2 border-accent-purple mb-4" />
          <button
            type="button"
            onClick={() => setAvatar(`https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}`)}
            className="text-xs text-accent-pink hover:text-accent-purple transition-colors"
          >
            {t('change_avatar')}
          </button>
        </div>

        <div>
          <label className="block text-gray-300 font-bold mb-2 flex items-center space-x-2">
            <User size={18} className="text-accent-orange" />
            <span>{t('nickname_label')}</span>
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange transition-all"
            placeholder={t('nickname_placeholder')}
            maxLength={15}
          />
        </div>

        <div className="pt-4 space-y-4">
          {urlRoomId ? (
            <button
              onClick={handleJoinRoom}
              disabled={!nickname.trim()}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-accent-purple to-accent-pink hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 neon-glow"
            >
              <Users size={20} />
              <span>{t('join_room')} {urlRoomId.toUpperCase()}</span>
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
                <div className="flex-grow border-t border-gray-700"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">{t('or')}</span>
                <div className="flex-grow border-t border-gray-700"></div>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="flex-grow bg-background border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all font-mono"
                  placeholder={t('enter_code')}
                  maxLength={6}
                />
                <button
                  onClick={handleJoinRoom}
                  disabled={!nickname.trim() || roomCode.length < 6}
                  className="flex items-center justify-center bg-surface border border-accent-purple hover:bg-accent-purple/20 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
                >
                  <Users size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
