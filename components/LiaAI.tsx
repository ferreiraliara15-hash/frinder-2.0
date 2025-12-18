
import React, { useState } from 'react';
import { askLiaAI } from '../geminiService';

const LiaAI: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'lia', text: string }[]>([
    { role: 'lia', text: "Oiê! Sou a Lia, sua assistente do Frinder. Precisa de dicas para quebrar o gelo ou dúvidas sobre o app? Pode perguntar! 💖" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const response = await askLiaAI(userMsg);
    setMessages(prev => [...prev, { role: 'lia', text: response }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-zinc-950">
      <header className="p-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center shadow-lg">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl mr-3 border border-white/20">🤖</div>
        <div>
          <h2 className="font-bold">Lia AI</h2>
          <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Assistente Divertida</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${
              m.role === 'user' 
              ? 'bg-purple-600 text-white rounded-br-none shadow-md shadow-purple-600/10' 
              : 'bg-zinc-900 text-zinc-100 rounded-bl-none border border-zinc-800'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900/50 p-4 rounded-2xl text-xs text-zinc-500 italic animate-pulse border border-zinc-800">
              Lia está digitando algo incrível... ✨
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex gap-2">
        <input
          className="flex-1 bg-zinc-800 border-zinc-700 border rounded-xl px-4 py-3 text-sm text-zinc-100 focus:ring-2 focus:ring-purple-500 outline-none placeholder:text-zinc-600"
          placeholder="Me dê uma dica de amizade..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-purple-600 text-white px-4 rounded-xl font-bold disabled:opacity-50 shadow-lg shadow-purple-600/10 transition-all active:scale-95"
        >
          {loading ? '...' : 'Ir'}
        </button>
      </div>
    </div>
  );
};

export default LiaAI;
