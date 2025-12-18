
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { db } from '../db';

interface SubscriptionModalProps {
  currentUser: UserProfile;
  onClose: () => void;
  onSuccess: (updatedUser: UserProfile) => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ currentUser, onClose, onSuccess }) => {
  const [step, setStep] = useState<'info' | 'pix' | 'success'>('info');
  const [isCopied, setIsCopied] = useState(false);

  const pixKey = "liaraferreira2007@gmail.com";
  const pixPayload = `00020126430014br.gov.bcb.pix0121${pixKey}520400005303986540529.905802BR5914LIARA FERREIRA6009SAO PAULO62070503***6304D167`;

  const copyPix = () => {
    navigator.clipboard.writeText(pixPayload);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const confirmPayment = () => {
    const updated = db.upgradeToPro(currentUser.id);
    if (updated) {
      setStep('success');
      setTimeout(() => {
        onSuccess(updated);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-zinc-900 rounded-3xl overflow-hidden max-w-sm w-full relative shadow-2xl border border-zinc-800">
        {step !== 'success' && (
          <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 text-xl font-bold z-10 transition-colors">✕</button>
        )}
        
        {step === 'info' && (
          <div className="p-8 text-center space-y-6">
            <div className="text-5xl animate-bounce">👑</div>
            <h2 className="text-2xl font-black text-zinc-100">Assine o PRO</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-900/20 p-3 rounded-xl border border-purple-800/50 text-left">
                  <span className="text-lg mb-1 block">✨</span>
                  <p className="text-[10px] font-bold text-purple-400 uppercase">Meets Ilimitados</p>
                </div>
                <div className="bg-pink-900/20 p-3 rounded-xl border border-pink-800/50 text-left">
                  <span className="text-lg mb-1 block">🔥</span>
                  <p className="text-[10px] font-bold text-pink-400 uppercase">Swipes Infinitos</p>
                </div>
                <div className="bg-blue-900/20 p-3 rounded-xl border border-blue-800/50 text-left">
                  <span className="text-lg mb-1 block">👁️</span>
                  <p className="text-[10px] font-bold text-blue-400 uppercase">Ver quem curtiu</p>
                </div>
                <div className="bg-yellow-900/20 p-3 rounded-xl border border-yellow-800/50 text-left">
                  <span className="text-lg mb-1 block">🚀</span>
                  <p className="text-[10px] font-bold text-yellow-400 uppercase">Boost Prioritário</p>
                </div>
              </div>
            </div>
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <p className="text-xs text-zinc-600 line-through">R$ 59,90</p>
              <p className="text-lg text-zinc-100 font-black">R$ 29,90 <span className="text-xs font-normal text-zinc-500">/mês</span></p>
            </div>
            <button 
              onClick={() => setStep('pix')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-600/20 hover:scale-[1.02] transition-transform"
            >
              Pagar via PIX 💳
            </button>
          </div>
        )}

        {step === 'pix' && (
          <div className="p-8 text-center space-y-6">
            <h2 className="text-xl font-black text-zinc-100">Pagamento PIX</h2>
            <div className="bg-zinc-950 p-4 rounded-xl flex items-center justify-center border border-zinc-800">
              <div className="w-48 h-48 bg-white border-4 border-zinc-900 p-2 relative flex items-center justify-center overflow-hidden rounded-lg">
                 <div className="grid grid-cols-8 grid-rows-8 gap-1 w-full h-full opacity-20">
                   {Array.from({length: 64}).map((_, i) => (
                     <div key={i} className={`bg-black ${Math.random() > 0.4 ? 'opacity-100' : 'opacity-10'}`} />
                   ))}
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-2 border border-zinc-300 rounded shadow-md">
                      <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-6 h-6 grayscale" />
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-zinc-500 font-medium text-left px-1">Copie o código PIX:</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={pixPayload} 
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-[10px] font-mono truncate text-zinc-400"
                />
                <button 
                  onClick={copyPix}
                  className="bg-purple-600 text-white px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap shadow-lg shadow-purple-600/20"
                >
                  {isCopied ? 'Pronto!' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <button 
                onClick={confirmPayment}
                className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/20 hover:bg-green-700 transition-colors"
              >
                Já paguei! Confirmar
              </button>
              <button 
                onClick={() => setStep('info')}
                className="w-full text-zinc-600 text-xs font-bold py-1 hover:text-zinc-400 transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 text-center space-y-6 animate-in zoom-in-95">
            <div className="w-24 h-24 bg-green-950/30 border border-green-900/30 rounded-full flex items-center justify-center text-5xl mx-auto shadow-inner">👑</div>
            <h2 className="text-3xl font-black text-zinc-100">Parabéns!</h2>
            <p className="text-sm text-zinc-400">
              Você agora é um membro <span className="font-bold text-purple-500 uppercase">FRINDER PRO</span>. 
              Acesso ilimitado concedido!
            </p>
            <div className="text-green-500 font-bold flex items-center justify-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              Ativando benefícios...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionModal;
