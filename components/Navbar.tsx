
import React from 'react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onLogout }) => {
  const tabs = [
    { view: AppView.SWIPE, icon: '🔥', label: 'Swipe' },
    { view: AppView.MATCHES, icon: '💬', label: 'Mensagens' },
    { view: AppView.MEETS, icon: '📍', label: 'Encontros' },
    { view: AppView.LIA_AI, icon: '🤖', label: 'Lia AI' },
    { view: AppView.PROFILE, icon: '👤', label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 flex justify-around items-center py-2 z-40 max-w-md mx-auto">
      {tabs.map((tab) => (
        <button
          key={tab.view}
          onClick={() => setView(tab.view)}
          className={`flex flex-col items-center px-2 py-1 transition-colors ${
            currentView === tab.view ? 'text-pink-500' : 'text-zinc-500'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-[10px] font-medium uppercase tracking-tighter">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navbar;
