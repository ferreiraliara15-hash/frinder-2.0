
import React, { useState } from 'react';
import { UserProfile, Match } from '../types';
import { db } from '../db';

interface MatchesViewProps {
  currentUser: UserProfile;
  onSelectMatch: (match: Match) => void;
}

const MatchesView: React.FC<MatchesViewProps> = ({ currentUser, onSelectMatch }) => {
  const [activeTab, setActiveTab] = useState<'matches' | 'likedMe'>('matches');
  
  const matches = db.getMatches().filter(m => m.userIds.includes(currentUser.id));
  const whoLikedMe = db.getWhoLikedMe(currentUser.id);
  const users = db.getUsers();

  return (
    <div className="p-4 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-100">Conexões</h1>
      </header>

      <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
        <button 
          onClick={() => setActiveTab('matches')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'matches' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500'}`}
        >
          Mensagens ({matches.length})
        </button>
        <button 
          onClick={() => setActiveTab('likedMe')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${activeTab === 'likedMe' ? 'bg-zinc-800 text-pink-500 shadow-sm' : 'text-zinc-500'}`}
        >
          Quem me curtiu ({whoLikedMe.length})
        </button>
      </div>

      {activeTab === 'matches' ? (
        <div className="space-y-3">
          {matches.length === 0 ? (
            <div className="text-center py-20 text-zinc-600">
              <p className="text-lg">Nenhuma amizade ainda? ✨</p>
              <p className="text-sm">Vá para o Swipe e comece a dizer 'oi'!</p>
            </div>
          ) : (
            matches.map(match => {
              const otherId = match.userIds.find(id => id !== currentUser.id);
              const friend = users.find(u => u.id === otherId);
              if (!friend) return null;

              return (
                <button
                  key={match.id}
                  onClick={() => onSelectMatch(match)}
                  className="flex items-center p-3 bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 hover:bg-zinc-800 transition-colors text-left w-full"
                >
                  <img 
                    src={friend.photos[0]} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-pink-500" 
                    alt={friend.name} 
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-zinc-100 text-sm">{friend.name}</h3>
                    <p className="text-[10px] text-zinc-500 truncate">Clique para conversar...</p>
                  </div>
                  <span className="text-[10px] text-zinc-600">
                    {new Date(match.timestamp).toLocaleDateString()}
                  </span>
                </button>
              );
            })
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {whoLikedMe.length === 0 ? (
            <div className="col-span-2 text-center py-20 text-zinc-600 italic">
              Ninguém te curtiu ainda. Tente swipar mais! 🚀
            </div>
          ) : (
            whoLikedMe.map(user => (
              <div key={user.id} className="relative group rounded-xl overflow-hidden shadow-md aspect-[3/4] border border-zinc-800">
                <img src={user.photos[0]} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/100 via-zinc-950/20 to-transparent flex flex-col justify-end p-3">
                  <p className="text-white text-xs font-bold">{user.name}, {user.age}</p>
                  <button 
                    onClick={() => {
                      db.saveSwipe({ fromId: currentUser.id, toId: user.id, type: 'like', timestamp: Date.now() });
                      window.location.reload(); 
                    }}
                    className="mt-2 bg-pink-500 text-white text-[10px] font-bold py-1 rounded-lg shadow-lg"
                  >
                    Curtir de volta 💜
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MatchesView;
