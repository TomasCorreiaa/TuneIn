import React, { useEffect, useState } from 'react';
import { Trophy, ArrowRight } from 'lucide-react';
import Podium from './Podium';
import { useTranslation } from 'react-i18next';

export default function Scoreboard({ room, socket }) {
  const me = room.players.find(p => p.id === socket.id);
  const isHost = room.hostId === socket.id;
  const owner = room.players.find(p => p.id === room.trackOwner);

  const isLastRound = room.currentRound === room.tracksToPlay.length - 1;
  const [countdown, setCountdown] = useState(room.autoNextRound && !isLastRound ? 5 : null);
  const { t } = useTranslation();

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleNextRound = () => {
    socket.emit('nextRound', { roomId: room.id });
  };

  // Sort players by score
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);

  // Garantir imagem de alta resolução se a API trouxer a pequena de 100x100
  const artwork = room.track?.artworkUrl?.replace('100x100bb', '500x500bb') || room.track?.artworkUrl;

  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-accent-orange mb-2">{t('round_end_title')}</h2>
        <p className="text-gray-400">{t('this_was_the_song')}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Track Reveal */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="relative group">
            {artwork ? (
              <img
                src={artwork}
                alt="Album Art"
                className="w-64 h-64 object-cover rounded-2xl shadow-2xl border-4 border-accent-purple mb-4"
              />
            ) : (
              <div className="w-64 h-64 bg-surface rounded-2xl border-4 border-accent-purple mb-4 animate-pulse flex items-center justify-center">
                {t('loading_cover')}
              </div>
            )}

            {/* Absolute badge for owner */}
            <div className="absolute -bottom-4 -right-4 bg-accent-pink px-4 py-2 rounded-full shadow-lg font-bold flex items-center space-x-2 border-2 border-background">
              <img src={owner?.avatar} alt={owner?.nickname} className="w-6 h-6 rounded-full bg-black/50" />
              <span>{t('choice_of', { name: owner?.nickname })}</span>
            </div>
          </div>

          <div className="text-center mt-6">
            <h3 className="text-xl font-bold">{room.track?.title}</h3>
            <p className="text-gray-400">{room.track?.artist}</p>
          </div>
        </div>

        {/* Right Side: Podium (if last round) OR Leaderboard */}
        <div className="w-full md:w-1/2 flex flex-col">
          {isLastRound ? (
            <Podium room={room} socket={socket} />
          ) : (
            <>
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="text-yellow-500" />
                <h3 className="text-2xl font-bold">{t('leaderboard')}</h3>
              </div>

              <div className="space-y-3 bg-surface p-4 rounded-xl border border-gray-700 flex-grow">
                {sortedPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${player.id === me.id ? 'bg-background border border-accent-purple' : 'bg-background/50'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-bold
                        ${index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-300 text-black' :
                            index === 2 ? 'bg-amber-700 text-white' : 'bg-gray-800 text-gray-400'}
                      `}>
                        {index + 1}
                      </div>
                      <img src={player.avatar} alt={player.nickname} className="w-10 h-10 rounded-full bg-black/50" />
                      <div>
                        <span className="font-bold">{player.nickname}</span>
                        {(player.guessedTitle || player.guessedArtist) && player.id !== room.trackOwner && (
                          <p className="text-xs text-green-400">
                            {player.guessedTitle && player.guessedArtist ? t('guessed_all') :
                              player.guessedTitle ? t('guessed_title') : t('guessed_artist')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="font-mono text-xl text-accent-orange font-bold">
                      {player.score}
                    </div>
                  </div>
                ))}
              </div>

              {room.autoNextRound ? (
                <div className="mt-6 p-4 rounded-lg bg-surface border border-gray-700 text-center">
                  <p className="text-gray-300">{t('next_round_starts_in')}</p>
                  <div className="text-4xl font-bold text-accent-pink">{countdown}</div>
                </div>
              ) : isHost ? (
                <button
                  onClick={handleNextRound}
                  className="mt-6 w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-accent-purple to-accent-pink hover:opacity-90 text-white font-bold py-4 rounded-lg neon-glow transition-all"
                >
                  <span>{t('next_round')}</span>
                  <ArrowRight size={20} />
                </button>
              ) : (
                <p className="text-center text-gray-400 mt-6 italic">
                  {t('waiting_for_host_next')}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
