import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, Circle, Search, Play, Pause, Volume2, XCircle, Settings, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Lobby({ room, socket }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
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
      setSearchResults(data.results);
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
          previewUrl: selectedTrack.previewUrl
        } 
      });
    }
  };
  
  const handleKick = (playerId) => {
    if (window.confirm("Queres mesmo expulsar este jogador?")) {
      socket.emit('kickPlayer', { roomId: room.id, targetId: playerId });
    }
  };

  const handleAutoNextRoundChange = (e) => {
    socket.emit('updateSettings', { roomId: room.id, settings: { autoNextRound: e.target.checked } });
  };

  const handleRoundDurationChange = (e) => {
    socket.emit('updateSettings', { roomId: room.id, settings: { roundDuration: parseInt(e.target.value) } });
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">{t('lobby_title')}</h2>
        <p className="text-gray-400">{t('lobby_subtitle')}</p>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-8 overflow-hidden">
        {/* Players List & Settings */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 h-full overflow-hidden">
          {/* Players List */}
          <div className="bg-background/50 rounded-xl p-4 border border-gray-700 flex flex-col flex-grow overflow-y-auto">
            <h3 className="font-bold mb-4 text-accent-orange flex-shrink-0">{t('players_in_room', { count: room.players.length })}</h3>
            <div className="space-y-3 flex-grow">
              {room.players.map(player => (
                <div key={player.id} className="flex items-center justify-between p-2 rounded-lg bg-surface">
                  <div className="flex items-center space-x-3">
                    <img src={player.avatar} alt={player.nickname} className="w-10 h-10 rounded-full bg-black/50" />
                    <span className="font-medium flex items-center gap-2 truncate max-w-[120px]">
                      {player.nickname}
                      {room.hostId === player.id && <span className="text-xs text-yellow-500">{t('host')}</span>}
                      {player.gamesWon > 0 && (
                        <span className="text-yellow-400 flex items-center text-xs ml-1" title={`${player.gamesWon}`}>
                          <Crown size={14} className="mr-1" />
                          {player.gamesWon}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {player.ready ? 
                      <CheckCircle2 className="text-green-500" size={20} /> : 
                      <Circle className="text-gray-500 animate-pulse" size={20} />
                    }
                    {isHost && player.id !== socket.id && (
                      <button onClick={() => handleKick(player.id)} className="text-red-500 hover:text-red-400" title={t('kick')}>
                        <XCircle size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-background/50 rounded-xl p-4 border border-gray-700 flex flex-col flex-shrink-0">
            <h3 className="font-bold mb-3 flex items-center gap-2 text-accent-purple"><Settings size={18} /> {t('room_settings')}</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="autoNextRound" className="text-sm font-medium">{t('auto_next_round')}</label>
                <input 
                  type="checkbox" 
                  id="autoNextRound"
                  checked={room.autoNextRound || false}
                  onChange={handleAutoNextRoundChange}
                  disabled={!isHost}
                  className="w-5 h-5 accent-accent-pink"
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="roundDuration" className="text-sm font-medium">{t('round_duration')}</label>
                <select 
                  id="roundDuration"
                  value={room.roundDuration || 30}
                  onChange={handleRoundDurationChange}
                  disabled={!isHost}
                  className="bg-surface border border-gray-600 rounded p-1 text-sm focus:outline-none focus:border-accent-pink disabled:opacity-50"
                >
                  <option value={5}>5 {t('seconds')}</option>
                  <option value={10}>10 {t('seconds')}</option>
                  <option value={20}>20 {t('seconds')}</option>
                  <option value={30}>30 {t('seconds')}</option>
                </select>
              </div>
            </div>
            {!isHost && <p className="text-xs text-gray-500 mt-3 text-center">{t('only_host_settings')}</p>}
          </div>
        </div>

        {/* Music Selection */}
        <div className="w-full md:w-2/3 flex flex-col h-full overflow-hidden">
          {!isReady ? (
            <div className="flex flex-col h-full">
              <form onSubmit={handleSearch} className="mb-4 flex space-x-2">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="flex-grow bg-background border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-pink focus:ring-1 focus:ring-accent-pink transition-all"
                />
                <button 
                  type="submit"
                  disabled={isSearching}
                  className="bg-surface border border-accent-pink hover:bg-accent-pink/20 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
                >
                  <Search size={20} />
                </button>
              </form>
              
              {/* Controlo de Volume Global */}
              <div className="flex items-center space-x-3 mb-4 bg-surface p-3 rounded-lg border border-gray-700">
                <Volume2 size={20} className="text-gray-400" />
                <input 
                  type="range" 
                  min="0" max="1" step="0.05" 
                  value={volume} 
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-accent-pink"
                />
              </div>

              {/* Resultados */}
              <div className="flex-grow overflow-y-auto space-y-2 mb-4 pr-2">
                {isSearching ? (
                  <div className="text-center text-gray-400 mt-10 animate-pulse">{t('searching')}</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(track => (
                    <div 
                      key={track.trackId} 
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer
                        ${selectedTrack?.trackId === track.trackId ? 'bg-accent-pink/20 border-accent-pink' : 'bg-background border-gray-700 hover:border-gray-500'}
                      `}
                      onClick={() => handleSelectTrack(track)}
                    >
                      <div className="flex items-center space-x-4 overflow-hidden">
                        <img src={track.artworkUrl100} alt={track.trackName} className="w-12 h-12 rounded object-cover" />
                        <div className="truncate">
                          <p className="font-bold truncate text-white">{track.trackName}</p>
                          <p className="text-sm text-gray-400 truncate">{track.artistName}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePreview(track.previewUrl);
                        }}
                        className={`p-2 rounded-full border transition-all
                          ${playingPreview === track.previewUrl ? 'bg-accent-orange border-accent-orange text-white' : 'bg-surface border-gray-600 hover:border-accent-orange text-gray-300'}
                        `}
                      >
                        {playingPreview === track.previewUrl ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 mt-10">
                    {t('search_hint')}
                  </div>
                )}
              </div>
              
              {room.players.length < 2 && (
                <div className="text-yellow-500 text-sm font-bold text-center mt-2 mb-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                  {t('need_more_players')}
                </div>
              )}
              
              <button
                onClick={handleReady}
                disabled={!selectedTrack || room.players.length < 2}
                className="w-full flex-shrink-0 bg-gradient-to-r from-accent-pink to-accent-purple hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 rounded-lg neon-glow transition-all disabled:opacity-50"
              >
                {selectedTrack ? t('im_ready', { track: selectedTrack.trackName }) : t('pick_a_song')}
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4 m-auto">
              <div className="inline-block p-4 rounded-full bg-green-500/20 border border-green-500 mb-4">
                <CheckCircle2 className="text-green-500 w-16 h-16" />
              </div>
              <h3 className="text-2xl font-bold">{t('music_confirmed')}</h3>
              <p className="text-gray-400">{t('waiting_for_others')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
