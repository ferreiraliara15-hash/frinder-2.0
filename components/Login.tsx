
import React, { useState } from 'react';
import { db } from '../db';
import { UserProfile } from '../types';

interface LoginProps {
  onLoginSuccess: (user: UserProfile) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      const existing = db.getUserByEmail(email);
      if (existing) {
        setError('Conta já existe! Tente entrar direto.');
        setIsRegistering(false);
        return;
      }
      const newUser: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        name: name || 'Novo Usuário',
        age: 18,
        city: 'Cidade Exemplo',
        photos: ['https://picsum.photos/400/600'],
        bio: 'Olá! Sou novo no Frinder e quero fazer amizades.',
        interests: ['Conversar'],
        hobbies: [],
        email: email,
        isPro: false
      };
      db.saveUser(newUser);
      db.setCurrentUser(newUser);
      onLoginSuccess(newUser);
    } else {
      const user = db.getUserByEmail(email);
      if (user) {
        db.setCurrentUser(user);
        onLoginSuccess(user);
      } else {
        setError('Conta não encontrada. Deseja criar uma?');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-zinc-950">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-2">
            FRINDER
          </h1>
          <p className="text-zinc-500 font-medium">Amizades começam com um swipe</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-950/30 text-red-400 p-3 rounded-lg text-xs font-bold border border-red-900/50 animate-pulse text-center">
              {error}
            </div>
          )}

          {isRegistering && (
            <div className="animate-in slide-in-from-top-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Nome</label>
              <input 
                type="text" required
                className="w-full bg-zinc-900 border-zinc-800 rounded-xl p-4 text-sm text-zinc-100 focus:ring-2 focus:ring-pink-500 outline-none placeholder:text-zinc-600 border"
                placeholder="Seu nome completo"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">E-mail</label>
            <input 
              type="email" required
              className="w-full bg-zinc-900 border-zinc-800 rounded-xl p-4 text-sm text-zinc-100 focus:ring-2 focus:ring-pink-500 outline-none placeholder:text-zinc-600 border"
              placeholder="seu@email.com"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                const user = db.getUserByEmail(e.target.value);
                if (user && !isRegistering) {
                  setError('✨ Conta detectada! Clique em Entrar.');
                } else if (!user) {
                  setError('');
                }
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Senha</label>
            <input 
              type="password" required
              className="w-full bg-zinc-900 border-zinc-800 rounded-xl p-4 text-sm text-zinc-100 focus:ring-2 focus:ring-pink-500 outline-none placeholder:text-zinc-600 border"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-pink-500/20 hover:scale-[1.02] transition-transform active:scale-95"
          >
            {isRegistering ? 'Criar Minha Conta' : 'Entrar Agora'}
          </button>
        </form>

        <div className="text-center space-y-4 pt-4">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-pink-500 font-bold text-sm block w-full mt-6 hover:underline"
          >
            {isRegistering ? 'Já tenho conta? Entrar' : 'Não tem conta? Cadastre-se no Frinder'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
