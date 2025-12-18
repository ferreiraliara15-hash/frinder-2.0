
import React, { useState } from 'react';
import { UserProfile, Meet } from '../types';
import { db } from '../db';

interface MeetsViewProps {
  currentUser: UserProfile;
}

const MeetsView: React.FC<MeetsViewProps> = ({ currentUser }) => {
  const [meets, setMeets] = useState<Meet[]>(db.getMeets().filter(m => m.hostId === currentUser.id || m.guestId === currentUser.id));
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    guestId: '',
    date: '',
    time: '',
    location: '',
    activity: 'Café'
  });

  const matches = db.getMatches().filter(m => m.userIds.includes(currentUser.id));
  const friends = matches.map(m => {
    const otherId = m.userIds.find(id => id !== currentUser.id)!;
    return db.getUsers().find(u => u.id === otherId)!;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMeet: Meet = {
      id: Math.random().toString(36).substr(2, 9),
      hostId: currentUser.id,
      guestId: formData.guestId,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      activity: formData.activity,
      status: 'pending',
      timestamp: Date.now()
    };
    db.saveMeet(newMeet);
    setMeets([...db.getMeets().filter(m => m.hostId === currentUser.id || m.guestId === currentUser.id)]);
    setIsCreating(false);
  };

  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-100">Meets 📍</h1>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-colors"
        >
          Novo Meet
        </button>
      </header>

      {isCreating && (
        <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl border border-purple-900/30 animate-in slide-in-from-top-4">
          <h2 className="text-lg font-bold mb-4 text-zinc-100">Convidar Amigo</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Amigo</label>
              <select 
                required
                className="w-full bg-zinc-800 border-zinc-700 border rounded-lg p-3 text-sm text-zinc-100 outline-none"
                value={formData.guestId}
                onChange={e => setFormData({...formData, guestId: e.target.value})}
              >
                <option value="" className="bg-zinc-900">Selecione um match...</option>
                {friends.map(f => <option key={f.id} value={f.id} className="bg-zinc-900">{f.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Data</label>
                <input 
                  type="date" required 
                  className="w-full bg-zinc-800 border-zinc-700 border rounded-lg p-3 text-sm text-zinc-100 outline-none"
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Hora</label>
                <input 
                  type="time" required 
                  className="w-full bg-zinc-800 border-zinc-700 border rounded-lg p-3 text-sm text-zinc-100 outline-none"
                  onChange={e => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Local</label>
              <input 
                type="text" placeholder="Ex: Starbucks da Paulista" required 
                className="w-full bg-zinc-800 border-zinc-700 border rounded-lg p-3 text-sm text-zinc-100 outline-none"
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button 
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-lg shadow-lg"
              >
                Enviar Convite
              </button>
              <button 
                type="button"
                onClick={() => setIsCreating(false)}
                className="bg-zinc-800 text-zinc-400 px-4 rounded-lg font-bold border border-zinc-700"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {meets.length === 0 ? (
          <div className="text-center py-10 text-zinc-600 italic">
            Nenhum encontro marcado ainda. Que tal convidar alguém para um café?
          </div>
        ) : (
          meets.map(meet => {
            const isHost = meet.hostId === currentUser.id;
            const otherId = isHost ? meet.guestId : meet.hostId;
            const friend = db.getUsers().find(u => u.id === otherId);

            return (
              <div key={meet.id} className="bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-800 flex items-start group hover:border-zinc-700 transition-colors">
                <div className="bg-purple-900/30 text-purple-400 p-3 rounded-lg mr-4 group-hover:bg-purple-900/50 transition-colors">
                  📍
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-zinc-100">{meet.activity} com {friend?.name}</h3>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      meet.status === 'pending' ? 'bg-yellow-950/30 text-yellow-500 border border-yellow-900/30' : 'bg-green-950/30 text-green-500 border border-green-900/30'
                    }`}>
                      {meet.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-1">{meet.location}</p>
                  <p className="text-xs text-zinc-600 mt-1">{meet.date} às {meet.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 rounded-xl border bg-zinc-900/50 border-zinc-800 text-zinc-400">
        <h4 className="text-sm font-bold mb-1">Aproveite!</h4>
        <p className="text-[10px] opacity-80 leading-tight">
          No Frinder todos os recursos são liberados para você encontrar os melhores amigos.
        </p>
      </div>
    </div>
  );
};

export default MeetsView;
