
import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';

interface ProfileEditProps {
  currentUser: UserProfile;
  onUpdate: (user: UserProfile) => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ currentUser, onUpdate }) => {
  const [profile, setProfile] = useState(currentUser);
  const [newInterest, setNewInterest] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addInterest = () => {
    if (newInterest && !profile.interests.includes(newInterest)) {
      setProfile({ ...profile, interests: [...profile.interests, newInterest] });
      setNewInterest('');
    }
  };

  const removeInterest = (val: string) => {
    setProfile({ ...profile, interests: profile.interests.filter(i => i !== val) });
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updatedPhotos = [...profile.photos];
        updatedPhotos[0] = base64String;
        setProfile({ ...profile, photos: updatedPhotos });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-100">Seu Perfil</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded-lg text-sm font-bold border border-zinc-700 hover:bg-zinc-700 transition-colors"
          >
            Ver como os outros me veem 👁️
          </button>
          <button 
            onClick={() => onUpdate(profile)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-green-600/20 hover:bg-green-700 transition-colors"
          >
            Salvar
          </button>
        </div>
      </header>

      <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
        <div className="relative">
          <img 
            src={profile.photos[0] || 'https://picsum.photos/400/600'} 
            className="w-full h-72 object-cover rounded-3xl shadow-xl border-4 border-zinc-900 transition-opacity group-hover:opacity-90" 
            alt="Profile"
          />
          {profile.isPro && (
             <span className="absolute top-4 left-4 bg-purple-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg text-white">PRO</span>
          )}
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-3xl">
          <div className="text-center">
            <span className="text-white font-bold block text-lg">Trocar Foto 📸</span>
            <span className="text-white/70 text-[10px] uppercase font-bold tracking-widest">Clique para selecionar</span>
          </div>
        </div>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
        />
      </div>

      <div className="space-y-4 bg-zinc-900 p-6 rounded-3xl shadow-sm border border-zinc-800">
        <div>
          <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Informações Básicas (Públicas)</label>
          <div className="space-y-3">
            <input 
              type="text" 
              className="w-full bg-zinc-800 border-zinc-700 border rounded-xl p-3 text-sm text-zinc-100 focus:ring-2 focus:ring-pink-500 outline-none placeholder:text-zinc-600"
              placeholder="Nome"
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="number" 
                className="w-full bg-zinc-800 border-zinc-700 border rounded-xl p-3 text-sm text-zinc-100 focus:ring-2 focus:ring-pink-500 outline-none placeholder:text-zinc-600"
                placeholder="Idade"
                value={profile.age}
                onChange={e => setProfile({...profile, age: parseInt(e.target.value) || 0})}
              />
              <input 
                type="text" 
                className="w-full bg-zinc-800 border-zinc-700 border rounded-xl p-3 text-sm text-zinc-100 focus:ring-2 focus:ring-pink-500 outline-none placeholder:text-zinc-600"
                placeholder="Cidade"
                value={profile.city}
                onChange={e => setProfile({...profile, city: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Sua Bio Pública</label>
          <textarea 
            className="w-full bg-zinc-800 border-zinc-700 border rounded-xl p-3 text-sm text-zinc-100 focus:ring-2 focus:ring-pink-500 h-28 resize-none outline-none placeholder:text-zinc-600"
            placeholder="Conte algo sobre você..."
            value={profile.bio}
            onChange={e => setProfile({...profile, bio: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Interesses Públicos</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.interests.map(i => (
              <span key={i} className="bg-pink-900/30 text-pink-400 border border-pink-900/50 px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                {i} 
                <button onClick={() => removeInterest(i)} className="ml-2 text-pink-600 hover:text-pink-300">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ex: Cinema, Viagem..."
              className="flex-1 bg-zinc-800 border-zinc-700 border rounded-xl p-3 text-xs text-zinc-100 focus:ring-2 focus:ring-pink-500 outline-none placeholder:text-zinc-600"
              value={newInterest}
              onChange={e => setNewInterest(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addInterest()}
            />
            <button 
              onClick={addInterest}
              className="bg-pink-600 text-white px-5 rounded-xl text-xs font-bold shadow-md shadow-pink-600/10 active:scale-95 transition-transform"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      
      <div className="text-center p-4">
        <p className="text-[10px] text-zinc-500 italic">
          O Frinder é totalmente gratuito. Siga <a href="https://www.instagram.com/liaralixx/" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-pink-300">@liaralixx</a> no Instagram para novidades!
        </p>
      </div>

      {/* Preview Modal: "Ver como os outros me veem" */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm flex flex-col items-center">
            <div className="mb-4 text-center">
              <span className="bg-pink-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Modo Visualização</span>
              <p className="text-zinc-400 text-[10px] mt-2 italic">É assim que seu perfil público aparece para os outros usuários!</p>
            </div>
            
            <div className="w-full rounded-2xl shadow-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex flex-col aspect-[3/4.5] pointer-events-none">
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
                      <span className="bg-purple-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">PRO</span>
                    )}
                  </div>
                  <p className="text-sm opacity-80">{profile.city}</p>
                  <p className="mt-2 text-sm line-clamp-2 opacity-90">{profile.bio}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profile.interests.map(i => (
                      <span key={i} className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full text-xs">#{i}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-evenly py-6 bg-zinc-900 border-t border-zinc-800 opacity-50">
                <button className="w-16 h-16 rounded-full border-4 border-zinc-800 bg-zinc-950 flex items-center justify-center text-red-500 text-2xl shadow-lg">✕</button>
                <button className="w-16 h-16 rounded-full border-4 border-zinc-800 bg-zinc-950 flex items-center justify-center text-pink-500 text-2xl shadow-lg">💜</button>
              </div>
            </div>

            <button 
              onClick={() => setIsPreviewOpen(false)}
              className="mt-8 bg-zinc-100 text-zinc-900 font-black px-8 py-3 rounded-2xl shadow-xl active:scale-95 transition-transform"
            >
              Voltar ao Editor
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEdit;
