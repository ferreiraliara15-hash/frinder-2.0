
import React, { useState } from 'react';

const Tutorial: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const steps = [
    {
      title: "Bem-vindo ao Frinder!",
      desc: "Aqui, as amizades começam com um swipe. Nada de encontros amorosos, apenas boas conexões!",
      icon: "👋"
    },
    {
      title: "Swipe para a Direita",
      desc: "Viu alguém legal? Swipe para a direita para pedir amizade. Se a pessoa aceitar, é Match!",
      icon: "💜"
    },
    {
      title: "Marque Meets",
      desc: "Vá além do digital! Use nossa função 'Meets' para marcar cafés, estudos ou passeios reais.",
      icon: "📍"
    }
  ];

  const [current, setCurrent] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-zinc-950 via-purple-900 to-zinc-950 text-white text-center animate-in fade-in">
      <div className="text-8xl mb-8 animate-bounce drop-shadow-2xl">{steps[current].icon}</div>
      <h2 className="text-3xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">{steps[current].title}</h2>
      <p className="text-lg opacity-80 mb-12 leading-relaxed max-w-[280px]">{steps[current].desc}</p>
      
      <div className="flex gap-2 mb-12">
        {steps.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-pink-500 w-6' : 'bg-white/20'}`} />
        ))}
      </div>

      <button 
        onClick={() => current < steps.length - 1 ? setCurrent(current + 1) : onComplete()}
        className="bg-white text-purple-950 font-black px-12 py-4 rounded-2xl shadow-2xl shadow-purple-500/20 hover:scale-105 transition-transform active:scale-95"
      >
        {current < steps.length - 1 ? "Próximo" : "Começar Agora!"}
      </button>
    </div>
  );
};

export default Tutorial;
