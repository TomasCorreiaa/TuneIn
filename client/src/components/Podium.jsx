import React from 'react';
import { Trophy, Home, Medal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Podium({ room, socket }) {
  const isHost = room.hostId === socket.id;
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
  const { t } = useTranslation();

  const top3 = sortedPlayers.slice(0, 3);
  const others = sortedPlayers.slice(3);

  const handleReturnToLobby = () => {
    socket.emit('returnToLobby', { roomId: room.id });
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-yellow-500 mb-2 flex items-center justify-center gap-2">
          <Trophy size={32} /> {t('final_podium')} <Trophy size={32} />
        </h2>
        <p className="text-gray-400 text-sm">{t('game_ended_podium')}</p>
      </div>

      {/* Podium Top 3 */}
      <div className="flex justify-center items-end gap-2 sm:gap-4 mb-8 h-56 flex-shrink-0">
        {/* 2nd Place */}
        {top3[1] && (
          <div className="flex flex-col items-center">
            <div className="text-lg font-bold text-gray-300 mb-1">{top3[1].nickname}</div>
            <img src={top3[1].avatar} alt="2nd" className="w-12 h-12 rounded-full border-2 border-gray-400 mb-2 bg-black" />
            <div className="w-20 bg-gray-400 h-24 rounded-t-lg flex flex-col items-center justify-start pt-2 text-black font-bold">
              <span className="text-2xl">2</span>
              <span className="mt-1 text-sm">{top3[1].score} {t('pts')}</span>
            </div>
          </div>
        )}
        
        {/* 1st Place */}
        {top3[0] && (
          <div className="flex flex-col items-center">
            <Trophy className="text-yellow-400 mb-1 animate-bounce" size={24} />
            <div className="text-xl font-bold text-yellow-400 mb-1">{top3[0].nickname}</div>
            <img src={top3[0].avatar} alt="1st" className="w-16 h-16 rounded-full border-4 border-yellow-400 mb-2 bg-black shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
            <div className="w-24 bg-yellow-400 h-32 rounded-t-lg flex flex-col items-center justify-start pt-2 text-black font-bold shadow-[0_0_15px_rgba(250,204,21,0.3)]">
              <span className="text-3xl">1</span>
              <span className="mt-1 text-sm">{top3[0].score} {t('pts')}</span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <div className="flex flex-col items-center">
            <div className="text-base font-bold text-amber-600 mb-1">{top3[2].nickname}</div>
            <img src={top3[2].avatar} alt="3rd" className="w-10 h-10 rounded-full border-2 border-amber-700 mb-2 bg-black" />
            <div className="w-20 bg-amber-700 h-16 rounded-t-lg flex flex-col items-center justify-start pt-2 text-white font-bold">
              <span className="text-xl">3</span>
              <span className="mt-1 text-sm">{top3[2].score} {t('pts')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Others */}
      {others.length > 0 && (
        <div className="w-full mb-6 bg-surface rounded-xl p-3 border border-gray-700 flex-shrink-0">
          <h3 className="font-bold text-gray-400 mb-2 flex items-center gap-2 text-sm">
            <Medal size={16} /> {t('remaining_players')}
          </h3>
          <div className="space-y-2">
            {others.map((player, index) => (
              <div key={player.id} className="flex items-center justify-between p-2 bg-background rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-bold w-4">{index + 4}</span>
                  <img src={player.avatar} alt={player.nickname} className="w-6 h-6 rounded-full bg-black/50" />
                  <span className="font-medium text-gray-300 truncate max-w-[80px]">{player.nickname}</span>
                </div>
                <span className="font-bold text-accent-orange">{player.score} {t('pts')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isHost ? (
        <div className="flex justify-center mt-auto flex-shrink-0">
          <button
            onClick={handleReturnToLobby}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-accent-purple to-accent-pink hover:opacity-90 text-white font-bold py-4 rounded-lg neon-glow transition-all"
          >
            <Home size={20} />
            <span>{t('back_to_lobby')}</span>
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-auto italic text-sm">{t('waiting_for_host_end')}</p>
      )}
    </div>
  );
}
