
import React from 'react';
import { UserProfile } from '../types';

interface MatchModalProps {
  user: UserProfile;
  onClose: () => void;
  onChat: () => void;
}

const MatchModal: React.FC<MatchModalProps> = ({ user, onClose, onChat }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="bg-zinc-900 rounded-3xl overflow-hidden max-w-sm w-full relative p-8 text-center space-y-6 border border-zinc-800 shadow-2xl shadow-purple-500/10">
        <div className="text-4xl">💜✨</div>
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
          Deu Match!
        </h2>
        <p className="text-zinc-400 text-sm">
          Você e {user.name} agora são amigos no Frinder. Que tal puxar conversa?
        </p>
        
        <div className="flex justify-center -space-x-4">
          <div className="w-24 h-24 rounded-full border-4 border-zinc-900 overflow-hidden shadow-xl z-10 rotate-[-5deg] bg-zinc-800">
            <img src="https://picsum.photos/seed/current/200/200" className="w-full h-full object-cover" />
          </div>
          <div className="w-24 h-24 rounded-full border-4 border-zinc-900 overflow-hidden shadow-xl rotate-[5deg] bg-zinc-800">
            <img src={user.photos[0]} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <button 
            onClick={onChat}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-pink-600/20 hover:scale-105 transition-transform"
          >
            Enviar Mensagem
          </button>
          <button 
            onClick={onClose}
            className="w-full text-zinc-500 font-bold py-2 text-sm hover:text-zinc-300 transition-colors"
          >
            Continuar Swipando
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;
