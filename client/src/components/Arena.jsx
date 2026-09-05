import React, { useState, useEffect, useRef } from 'react';
import { Send, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Arena({ room, socket }) {
  const [timeLeft, setTimeLeft] = useState(room.roundDuration || 30);
  const [guessInput, setGuessInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const { t } = useTranslation();

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('tunein_volume');
    return saved ? parseFloat(saved) : 0.5;
  });

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    localStorage.setItem('tunein_volume', volume.toString());
  }, [volume]);

  const me = room.players.find(p => p.id === socket.id);
  const isOwner = room.trackOwner === me?.id;
  
  useEffect(() => {
    // Populate initial messages if any
    setMessages(room.messages || []);
  }, [room.messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Escutar novos chats
    const handleChat = (newMessages) => {
      setMessages(prev => [...prev, ...newMessages]);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };
    socket.on('chatMessages', handleChat);
    return () => socket.off('chatMessages', handleChat);
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guessInput.trim() || isOwner) return;

    const text = guessInput.trim();
    setGuessInput('');

    socket.emit('submitChatGuess', { roomId: room.id, text }, (response) => {
      if (response.close) {
        // Se esteve perto, adiciona só localmente para o utilizador
        setMessages(prev => [...prev, { type: 'system', text: `A tua tentativa "${text}" está muito perto!`, correct: false }]);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* ProgressBar/Timer */}
      <div className="w-full h-2 bg-gray-800">
        <div 
          className="h-full bg-gradient-to-r from-accent-orange to-accent-pink transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / (room.roundDuration || 30)) * 100}%` }}
        ></div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row p-6 gap-6 h-full overflow-hidden">
        
        {/* Lado Esquerdo: Player Info */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <div className="mb-6 relative flex items-center justify-center w-64 h-64 rounded-full border-4 border-accent-purple neon-glow">
            <div className="absolute inset-0 bg-accent-purple/20 rounded-full animate-ping"></div>
            <div className="z-10 text-center">
              <span className="text-6xl font-bold font-mono">{timeLeft}</span>
              <p className="text-sm text-gray-400 mt-2">{t('playing')}</p>
            </div>
          </div>

          <h3 className="text-xl mb-2 font-bold text-center">{t('try_guess')}</h3>
          <p className="text-gray-400 text-center mb-4">{t('guess_hint')}</p>
          
          <div className="flex gap-4 mb-6">
            <div className={`px-4 py-2 rounded border ${me?.guessedTitle ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-surface border-gray-700 text-gray-400'}`}>
              {t('title')} {me?.guessedTitle ? '✓' : '?'}
            </div>
            <div className={`px-4 py-2 rounded border ${me?.guessedArtist ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-surface border-gray-700 text-gray-400'}`}>
              {t('artist')} {me?.guessedArtist ? '✓' : '?'}
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-surface px-4 py-3 rounded-lg border border-gray-700 w-full max-w-[250px]">
            <Volume2 size={20} className="text-gray-400 flex-shrink-0" />
            <input 
              type="range" 
              min="0" max="1" step="0.05" 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-accent-pink"
              title="Volume da Música"
            />
          </div>
        </div>

        {/* Lado Direito: Chat de Adivinhação */}
        <div className="w-full md:w-1/2 flex flex-col bg-surface border border-gray-700 rounded-xl overflow-hidden">
          <div className="bg-background p-3 font-bold border-b border-gray-700">{t('guess_chat')}</div>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`p-2 rounded-lg ${
                msg.type === 'system' ? (msg.correct ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-bold')
                : 'bg-background border border-gray-700 text-gray-300'
              }`}>
                {msg.type === 'chat' && <span className="font-bold text-accent-orange">{msg.sender}: </span>}
                <span>{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-3 bg-background border-t border-gray-700 flex gap-2">
            <input
              type="text"
              value={guessInput}
              onChange={(e) => setGuessInput(e.target.value)}
              disabled={isOwner || (me?.guessedTitle && me?.guessedArtist)}
              placeholder={isOwner ? t('you_picked_this') : (me?.guessedTitle && me?.guessedArtist ? t('already_guessed_all') : t('type_guess'))}
              className="flex-grow bg-surface border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent-pink disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={isOwner || !guessInput.trim() || (me?.guessedTitle && me?.guessedArtist)}
              className="bg-accent-pink hover:bg-pink-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </div>

        {/* Audio nativo para a preview da música (Invisível, auto-play) */}
        {room.track && room.track.previewUrl && (
          <audio ref={audioRef} src={room.track.previewUrl} autoPlay className="hidden" />
        )}
      </div>
    </div>
  );
}
