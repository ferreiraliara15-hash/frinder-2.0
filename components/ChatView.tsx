
import React, { useState, useEffect, useRef } from 'react';
import { Match, Message, UserProfile } from '../types';
import { db } from '../db';

interface ChatViewProps {
  match: Match;
  currentUser: UserProfile;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ match, currentUser, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const otherUserId = match.userIds.find(id => id !== currentUser.id);
  const otherUser = db.getUsers().find(u => u.id === otherUserId);

  useEffect(() => {
    const loadMessages = () => {
      setMessages(db.getMessages(match.id));
    };
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [match.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    db.sendMessage({
      matchId: match.id,
      senderId: currentUser.id,
      text: inputText
    });
    setMessages(db.getMessages(match.id));
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-zinc-950">
      <header className="flex items-center p-4 border-b border-zinc-900 bg-zinc-950 sticky top-0 z-10">
        <button onClick={onBack} className="mr-4 text-zinc-500 hover:text-zinc-100 transition-colors">←</button>
        <img src={otherUser?.photos[0]} className="w-10 h-10 rounded-full object-cover mr-3 border border-zinc-800" />
        <div className="flex-1">
          <h3 className="font-bold text-sm text-zinc-100">{otherUser?.name}</h3>
          <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/50">
        {messages.map((m) => {
          const isMine = m.senderId === currentUser.id;
          return (
            <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                isMine 
                ? 'bg-pink-600 text-white rounded-br-none shadow-md shadow-pink-600/10' 
                : 'bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-bl-none shadow-sm'
              }`}>
                {m.text}
                <div className={`text-[8px] mt-1 ${isMine ? 'text-pink-200' : 'text-zinc-500'}`}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Diga um oi amigável..."
          className="flex-1 bg-zinc-800 border-zinc-700 border rounded-full px-4 py-2 text-sm text-zinc-100 focus:ring-2 focus:ring-pink-500 outline-none placeholder:text-zinc-600"
        />
        <button 
          onClick={handleSend}
          className="bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-pink-600 transition-colors"
        >
          🚀
        </button>
      </div>
    </div>
  );
};

export default ChatView;
