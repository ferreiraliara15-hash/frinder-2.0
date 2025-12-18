
import React, { useState, useEffect } from 'react';
import { AppView, UserProfile, Match } from './types';
import { db } from './db';
import Login from './components/Login';
import SwipeView from './components/SwipeView';
import MatchesView from './components/MatchesView';
import ChatView from './components/ChatView';
import ProfileEdit from './components/ProfileEdit';
import MeetsView from './components/MeetsView';
import Tutorial from './components/Tutorial';
import LiaAI from './components/LiaAI';
import Navbar from './components/Navbar';
import MatchModal from './components/MatchModal';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(db.getCurrentUser());
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [recentMatch, setRecentMatch] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (currentUser) {
      if (!db.hasSeenTutorial()) {
        setCurrentView(AppView.TUTORIAL);
      } else {
        setCurrentView(AppView.SWIPE);
      }
    } else {
      setCurrentView(AppView.LOGIN);
    }
  }, [currentUser]);

  const handleLogout = () => {
    db.setCurrentUser(null);
    setCurrentUser(null);
  };

  const onMatch = (matchedUser: UserProfile) => {
    setRecentMatch(matchedUser);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col max-w-md mx-auto relative shadow-2xl shadow-purple-500/10 overflow-hidden text-zinc-100">
      {currentView !== AppView.LOGIN && currentView !== AppView.REGISTER && currentView !== AppView.TUTORIAL && (
        <Navbar currentView={currentView} setView={setCurrentView} onLogout={handleLogout} />
      )}

      <main className="flex-1 overflow-y-auto pb-16">
        {currentView === AppView.LOGIN && (
          <Login onLoginSuccess={(u) => setCurrentUser(u)} />
        )}

        {currentView === AppView.TUTORIAL && (
          <Tutorial onComplete={() => {
            db.setTutorialSeen();
            setCurrentView(AppView.SWIPE);
          }} />
        )}

        {currentView === AppView.SWIPE && currentUser && (
          <SwipeView currentUser={currentUser} onMatch={onMatch} />
        )}

        {currentView === AppView.MATCHES && currentUser && (
          <MatchesView 
            currentUser={currentUser} 
            onSelectMatch={(m) => {
              setActiveMatch(m);
              setCurrentView(AppView.CHAT);
            }} 
          />
        )}

        {currentView === AppView.CHAT && currentUser && activeMatch && (
          <ChatView match={activeMatch} currentUser={currentUser} onBack={() => setCurrentView(AppView.MATCHES)} />
        )}

        {currentView === AppView.MEETS && currentUser && (
          <MeetsView currentUser={currentUser} />
        )}

        {currentView === AppView.PROFILE && currentUser && (
          <ProfileEdit currentUser={currentUser} onUpdate={(u) => {
            db.saveUser(u);
            setCurrentUser(u);
          }} />
        )}

        {currentView === AppView.LIA_AI && (
          <LiaAI />
        )}
      </main>

      {recentMatch && (
        <MatchModal 
          user={recentMatch} 
          onClose={() => setRecentMatch(null)} 
          onChat={() => {
            const matches = db.getMatches();
            const m = matches.find(mat => mat.userIds.includes(recentMatch.id) && mat.userIds.includes(currentUser!.id));
            if (m) {
              setActiveMatch(m);
              setRecentMatch(null);
              setCurrentView(AppView.CHAT);
            }
          }}
        />
      )}
    </div>
  );
};

export default App;
