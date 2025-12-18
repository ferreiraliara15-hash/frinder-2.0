
import React, { useState, useEffect } from 'react';
import { UserProfile, Swipe } from '../types';
import { db } from '../db';

interface SwipeViewProps {
  currentUser: UserProfile;
  onMatch: (user: UserProfile) => void;
}

const SwipeView: React.FC<SwipeViewProps> = ({ currentUser, onMatch }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filters, setFilters] = useState({ ageMin: 18, ageMax: 99 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const users = db.getUsers();
    const swipes = db.getSwipes().filter(s => s.fromId === currentUser.id);
    const swipedIds = swipes.map(s => s.toId);
    
    // Filter available public profiles
    let filtered = users.filter(u => 
      u.id !== currentUser.id && 
      !swipedIds.includes(u.id) &&
      u.age >= filters.ageMin &&
      u.age <= filters.ageMax
    );

    // Simple Recommendation Algorithm: Score based on common interests
    filtered = filtered.sort((a, b) => {
      const commonA = a.interests.filter(i => currentUser.interests.includes(i)).length;
      const commonB = b.interests.filter(i => currentUser.interests.includes(i)).length;
      return commonB - commonA; // Higher score first
    });

    setProfiles(filtered);
    setCurrentIndex(0);
  }, [currentUser, filters]);

  const handleSwipe = (type: 'like' | 'pass') => {
    if (currentIndex >= profiles.length) return;

    const target = profiles[currentIndex];
    const isMatch = db.saveSwipe({
      fromId: currentUser.id,
      toId: target.id,
      type,
      timestamp: Date.now()
    });

    if (type === 'like' && isMatch) {
      onMatch(target);
    }

    setCurrentIndex(prev => prev + 1);
  };

  if (profiles.length === 0 && currentIndex === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
        <div className="text-8xl animate-pulse">✨</div>
        <h2 className="text-2xl font-black text-zinc-100">Ainda não há contas criadas...</h2>
        <p className="text-zinc-500 leading-relaxed">
          Seja a primeira pessoa a brilhar aqui e chame suas amigas para o Frinder!
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-purple-500/20 active:scale-95 transition-transform"
        >
          Recarregar Perfis
        </button>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <div className="text-6xl animate-bounce">😴</div>
        <h2 className="text-xl font-bold text-zinc-100">Você viu todo mundo!</h2>
        <p className="text-zinc-500">Tente expandir seus filtros de idade para encontrar mais amigos.</p>
        <button 
          onClick={() => {
            setFilters({ ageMin: 18, ageMax: 99 });
            setCurrentIndex(0);
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-full font-bold shadow-lg"
        >
          Limpar Filtros
        </button>
      </div>
    );
  }

  const profile = profiles[currentIndex];

  return (
    <div className="relative h-[calc(100vh-120px)] w-full p-4 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-2 px-2">
        <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Descoberta Pública</h2>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors ${isFilterOpen ? 'bg-pink-500 text-white border-pink-500' : 'bg-zinc-900 text-zinc-400 border-zinc-800'}`}
        >
          {isFilterOpen ? 'Fechar Filtros' : 'Filtros ⚙️'}
        </button>
      </div>

      {isFilterOpen && (
        <div className="bg-zinc-900 p-4 rounded-xl shadow-md border border-zinc-800 mb-4 animate-in slide-in-from-top-2">
          <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3">Preferências de Idade</h3>
          <div className="flex items-center gap-4">
            <input 
              type="number" 
              placeholder="Min"
              className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2 text-sm text-zinc-100 outline-none"
              value={filters.ageMin}
              onChange={e => setFilters({...filters, ageMin: parseInt(e.target.value) || 18})}
            />
            <span className="text-zinc-600">até</span>
            <input 
              type="number" 
              placeholder="Max"
              className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2 text-sm text-zinc-100 outline-none"
              value={filters.ageMax}
              onChange={e => setFilters({...filters, ageMax: parseInt(e.target.value) || 99})}
            />
          </div>
        </div>
      )}

      <div className="flex-1 w-full rounded-2xl shadow-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex flex-col swipe-card relative group">
        <div className="relative flex-1">
          <img 
            src={profile.photos[0] || 'https://picsum.photos/400/600'} 
            className="w-full h-full object-cover"
            alt={profile.name}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/100 via-black/50 to-transparent p-6 text-white">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{profile.name}, {profile.age}</h2>
              {profile.isPro && (
                <span className="bg-purple-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">Membro PRO</span>
              )}
            </div>
            <p className="text-sm opacity-80">{profile.city}</p>
            <p className="mt-2 text-sm line-clamp-2 opacity-90">{profile.bio}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.interests.map(i => {
                const isCommon = currentUser.interests.includes(i);
                return (
                  <span key={i} className={`px-2 py-0.5 rounded-full text-xs font-medium border ${isCommon ? 'bg-pink-500/20 border-pink-500/50 text-pink-300' : 'bg-white/10 border-white/5 text-zinc-300'}`}>
                    {isCommon && '✨ '}{i}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="flex justify-evenly py-6 bg-zinc-900 border-t border-zinc-800">
          <button 
            onClick={() => handleSwipe('pass')}
            className="w-16 h-16 rounded-full border-4 border-zinc-800 bg-zinc-950 flex items-center justify-center text-red-500 text-2xl shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            ✕
          </button>
          <button 
            onClick={() => handleSwipe('like')}
            className="w-16 h-16 rounded-full border-4 border-zinc-800 bg-zinc-950 flex items-center justify-center text-pink-500 text-2xl shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            💜
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwipeView;
