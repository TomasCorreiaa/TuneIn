import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, Circle, Search, Play, Pause, Volume2, XCircle, Settings, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SettingsModal from './SettingsModal';

export default function Lobby({ room, socket, onOpenSettings }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isInternalSettingsOpen, setIsInternalSettingsOpen] = useState(false);
  const { t } = useTranslation();
  
  // Audio state
  const [playingPreview, setPlayingPreview] = useState(null); // url
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('tunein_volume');
    return saved ? parseFloat(saved) : 0.5;
  });
  const audioRef = useRef(new Audio());

  const me = room.players.find(p => p.id === socket.id);
  const isReady = me?.ready;
  const isHost = room.hostId === socket.id;

  const readyCount = room.players.filter(p => p.ready).length;
  const allReady = room.players.length >= 2 && room.players.every(p => p.ready);
  const canStartTimer = isHost && readyCount >= 2 && !allReady && (room.countdown === null || room.countdown === undefined);

  const handleOpenSettings = onOpenSettings || (() => setIsInternalSettingsOpen(true));

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      audioRef.current.pause();
      audioRef.current.src = '';
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('tunein_volume', volume.toString());
    audioRef.current.volume = volume;
  }, [volume]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&limit=15&entity=song`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error("Erro ao pesquisar música:", err);
    }
    setIsSearching(false);
  };

  const togglePreview = (url) => {
    if (playingPreview === url) {
      audioRef.current.pause();
      setPlayingPreview(null);
    } else {
      audioRef.current.src = url;
      audioRef.current.play();
      setPlayingPreview(url);
    }
  };

  const handleSelectTrack = (track) => {
    setSelectedTrack(track);
    // Para a música se for escolhida
    if (playingPreview) {
      audioRef.current.pause();
      setPlayingPreview(null);
    }
  };

  const handleReady = () => {
    if (selectedTrack) {
      socket.emit('setReady', { 
        roomId: room.id, 
        trackUrl: {
          title: selectedTrack.trackName,
          artist: selectedTrack.artistName,
          artworkUrl: selectedTrack.artworkUrl100,
          previewUrl: selectedTrack.previewUrl,
          trackViewUrl: selectedTrack.trackViewUrl
        } 
      });
    }
  };
  
  const handleKick = (playerId) => {
    if (window.confirm("Queres mesmo expulsar este jogador?")) {
      socket.emit('kickPlayer', { roomId: room.id, targetId: playerId });
    }
  };

  return (
    <div className="flex flex-col h-full p-3 sm:p-6 overflow-hidden">
      {/* Header do Lobby */}
      <div className="text-center mb-3 sm:mb-5 flex-shrink-0">
        <h2 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">{t('lobby_title')}</h2>
        <p className="text-xs sm:text-sm text-gray-400">{t('lobby_subtitle')}</p>
      </div>

      {/* Banner de Contagem Regressiva para Início de Jogo */}
      {room.countdown !== null && room.countdown !== undefined && (
        <div className="mb-3 bg-gradient-to-r from-accent-orange/20 to-accent-pink/20 border border-accent-pink/50 rounded-xl p-3 flex items-center justify-between animate-pulse flex-shrink-0">
          <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent-pink text-white font-mono text-sm font-bold flex-shrink-0">
              {room.countdown}
            </span>
            <span>{t('game_starting_in', { seconds: room.countdown })}</span>
          </div>
          {isHost && (
            <button
              onClick={() => socket.emit('cancelCountdown', { roomId: room.id })}
              className="bg-surface/80 hover:bg-surface text-gray-300 hover:text-white text-xs px-2.5 py-1 rounded border border-gray-600 transition-colors flex-shrink-0"
            >
              {t('cancel_timer')}
            </button>
          )}
        </div>
      )}

      <div className="flex-grow flex flex-col md:flex-row gap-3 sm:gap-6 md:gap-8 min-h-0 overflow-hidden">
        {/* Coluna Esquerda: Lista de Jogadores e Acesso a Definições */}
        <div className="w-full md:w-1/3 flex flex-col flex-shrink-0 md:h-full min-h-0">
          <div className="bg-background/50 rounded-xl p-3 sm:p-4 border border-gray-700 flex flex-col max-h-28 sm:max-h-36 md:max-h-none md:flex-grow overflow-hidden">
            <div className="flex items-center justify-between mb-2 sm:mb-4 flex-shrink-0">
              <h3 className="font-bold text-accent-orange text-sm sm:text-base">
                {t('players_in_room', { count: room.players.length })}
              </h3>
              <button
                onClick={handleOpenSettings}
                className="p-1.5 rounded-lg bg-surface hover:bg-surface/80 text-gray-300 hover:text-accent-purple border border-gray-700 hover:border-accent-purple/50 transition-colors flex items-center justify-center"
                title={t('room_settings')}
                aria-label={t('room_settings')}
              >
                <Settings size={16} />
              </button>
            </div>

            <div className="space-y-2 sm:space-y-3 overflow-y-auto flex-grow pr-1">
              {room.players.map(player => (
                <div key={player.id} className="flex items-center justify-between p-2 rounded-lg bg-surface">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <img src={player.avatar} alt={player.nickname} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 flex-shrink-0" />
                    <span className="font-medium flex items-center gap-1.5 truncate max-w-[110px] sm:max-w-[140px] text-xs sm:text-sm">
                      <span className="truncate">{player.nickname}</span>
                      {room.hostId === player.id && <span className="text-[10px] sm:text-xs text-yellow-500 font-bold flex-shrink-0">{t('host')}</span>}
                      {player.gamesWon > 0 && (
                        <span className="text-yellow-400 flex items-center text-[10px] sm:text-xs ml-1 flex-shrink-0" title={`${player.gamesWon}`}>
                          <Crown size={12} className="mr-0.5" />
                          {player.gamesWon}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {player.ready ? 
                      <CheckCircle2 className="text-green-500" size={18} /> : 
                      <Circle className="text-gray-500 animate-pulse" size={18} />
                    }
                    {isHost && player.id !== socket.id && (
                      <button onClick={() => handleKick(player.id)} className="text-red-500 hover:text-red-400 p-0.5" title={t('kick')}>
                        <XCircle size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {canStartTimer && !isReady && (
            <button
              onClick={() => socket.emit('startCountdown', { roomId: room.id })}
              className="mt-2.5 w-full bg-gradient-to-r from-accent-orange to-accent-pink hover:opacity-90 text-white font-bold py-2 px-3 rounded-lg text-xs sm:text-sm neon-glow transition-all flex items-center justify-center gap-2 flex-shrink-0"
            >
              <Play size={14} fill="currentColor" />
              {t('start_game_timer')}
            </button>
          )}
        </div>

        {/* Coluna Direita: Seleção de Música com Botão Fixo no Fundo */}
        <div className="w-full md:w-2/3 flex flex-col flex-1 min-h-0 md:h-full overflow-hidden">
          {!isReady ? (
            <div className="flex flex-col h-full min-h-0">
              {/* Barra de Pesquisa */}
              <form onSubmit={handleSearch} className="mb-2 sm:mb-3 flex space-x-2 flex-shrink-0">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="flex-grow bg-background border border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-accent-pink focus:ring-1 focus:ring-accent-pink transition-all"
                />
                <button 
                  type="submit"
                  disabled={isSearching}
                  className="bg-surface border border-accent-pink hover:bg-accent-pink/20 text-white font-bold py-2 sm:py-2.5 px-4 sm:px-5 rounded-lg transition-all disabled:opacity-50 flex-shrink-0"
                >
                  <Search size={18} />
                </button>
              </form>
              
              {/* Controlo de Volume Global */}
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3 bg-surface p-2 sm:p-2.5 rounded-lg border border-gray-700 flex-shrink-0">
                <Volume2 size={18} className="text-gray-400 flex-shrink-0" />
                <input 
                  type="range" 
                  min="0" max="1" step="0.05" 
                  value={volume} 
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-accent-pink cursor-pointer"
                />
              </div>

              {/* Lista de Resultados com scroll interno */}
              <div className="flex-1 min-h-0 overflow-y-auto space-y-2 mb-2 pr-1 sm:pr-2">
                {isSearching ? (
                  <div className="text-center text-gray-400 mt-6 sm:mt-10 animate-pulse text-sm">{t('searching')}</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(track => (
                    <div 
                      key={track.trackId} 
                      className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer
                        ${selectedTrack?.trackId === track.trackId ? 'bg-accent-pink/20 border-accent-pink' : 'bg-background border-gray-700 hover:border-gray-500'}
                      `}
                      onClick={() => handleSelectTrack(track)}
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <img src={track.artworkUrl100} alt={track.trackName} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                        <div className="truncate">
                          <p className="font-bold truncate text-white text-xs sm:text-sm">{track.trackName}</p>
                          <p className="text-[11px] sm:text-xs text-gray-400 truncate">{track.artistName}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePreview(track.previewUrl);
                        }}
                        className={`p-2 rounded-full border transition-all flex-shrink-0 ml-2
                          ${playingPreview === track.previewUrl ? 'bg-accent-orange border-accent-orange text-white' : 'bg-surface border-gray-600 hover:border-accent-orange text-gray-300'}
                        `}
                      >
                        {playingPreview === track.previewUrl ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 mt-6 sm:mt-10 text-xs sm:text-sm px-4">
                    {t('search_hint')}
                  </div>
                )}
              </div>
              
              {/* Secção Inferior com Botão Sempre Visível */}
              <div className="flex-shrink-0 pt-2 border-t border-gray-800/80">
                {room.players.length < 2 && (
                  <div className="text-yellow-500 text-xs font-bold text-center mb-2 p-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded">
                    {t('need_more_players')}
                  </div>
                )}
                
                <button
                  onClick={handleReady}
                  disabled={!selectedTrack || room.players.length < 2}
                  className="w-full bg-gradient-to-r from-accent-pink to-accent-purple hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 sm:py-3.5 px-4 rounded-lg neon-glow transition-all disabled:opacity-50 text-sm sm:text-base truncate"
                >
                  {selectedTrack ? t('im_ready', { track: selectedTrack.trackName }) : t('pick_a_song')}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 m-auto">
              <div className="inline-block p-4 rounded-full bg-green-500/20 border border-green-500 mb-2 sm:mb-4">
                <CheckCircle2 className="text-green-500 w-12 h-12 sm:w-16 sm:h-16" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">{t('music_confirmed')}</h3>
              <p className="text-xs sm:text-sm text-gray-400">{t('waiting_for_others')}</p>
              {canStartTimer && (
                <button
                  onClick={() => socket.emit('startCountdown', { roomId: room.id })}
                  className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-accent-orange to-accent-pink hover:opacity-90 text-white font-bold py-2.5 px-5 rounded-lg text-sm neon-glow transition-all"
                >
                  <Play size={16} fill="currentColor" />
                  {t('start_game_timer')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal interno de suporte para uso isolado */}
      {!onOpenSettings && (
        <SettingsModal
          isOpen={isInternalSettingsOpen}
          onClose={() => setIsInternalSettingsOpen(false)}
          room={room}
          socket={socket}
          isHost={isHost}
        />
      )}
    </div>
  );
}
