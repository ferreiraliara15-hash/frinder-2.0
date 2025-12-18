
import { UserProfile, Match, Message, Meet, Swipe } from './types';

const STORAGE_KEYS = {
  USERS: 'frinder_users',
  MATCHES: 'frinder_matches',
  MESSAGES: 'frinder_messages',
  MEETS: 'frinder_meets',
  SWIPES: 'frinder_swipes',
  CURRENT_USER: 'frinder_current_user',
  TUTORIAL_SEEN: 'frinder_tutorial_seen'
};

const INITIAL_USERS: UserProfile[] = [
  {
    id: '1',
    name: 'Alice Silva',
    age: 24,
    city: 'São Paulo',
    photos: ['https://picsum.photos/seed/alice/400/600', 'https://picsum.photos/seed/alice2/400/600'],
    bio: 'Adoro café e trilhas. Vamos estudar juntos?',
    interests: ['Café', 'Estudos', 'Trilha'],
    hobbies: ['Fotografia', 'Leitura'],
    email: 'alice@test.com',
    swipeCount: 0,
    lastSwipeReset: Date.now(),
    // Added isPro to initial data
    isPro: false
  },
  {
    id: '2',
    name: 'Bruno Rocha',
    age: 27,
    city: 'Rio de Janeiro',
    photos: ['https://picsum.photos/seed/bruno/400/600'],
    bio: 'Novo na cidade, procurando amizades para sair e conversar.',
    interests: ['Praia', 'Culinária', 'Samba'],
    hobbies: ['Surfe', 'Cozinhar'],
    email: 'bruno@test.com',
    swipeCount: 0,
    lastSwipeReset: Date.now(),
    // Added isPro to initial data
    isPro: false
  },
  {
    id: '3',
    name: 'Carla Nunes',
    age: 22,
    city: 'Curitiba',
    photos: ['https://picsum.photos/seed/carla/400/600'],
    bio: 'Estudante de Design. Amo museus e artes.',
    interests: ['Design', 'Arte', 'Museus'],
    hobbies: ['Desenho', 'Pintura'],
    email: 'carla@test.com',
    swipeCount: 0,
    lastSwipeReset: Date.now(),
    // Added isPro to initial data
    isPro: false
  }
];

export const db = {
  getUsers: (): UserProfile[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  },

  saveUser: (user: UserProfile) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) users[index] = user;
    else users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    const current = db.getCurrentUser();
    if (current && current.id === user.id) {
      db.setCurrentUser(user);
    }
  },

  getUserByEmail: (email: string): UserProfile | undefined => {
    return db.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  getUsersByEmail: (email: string): UserProfile[] => {
    return db.getUsers().filter(u => u.email.toLowerCase() === email.toLowerCase());
  },

  getSwipes: (): Swipe[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SWIPES) || '[]');
  },

  getWhoLikedMe: (userId: string): UserProfile[] => {
    const allSwipes = db.getSwipes();
    const allMatches = db.getMatches();
    const users = db.getUsers();

    const peopleWhoLikedMeIds = allSwipes
      .filter(s => s.toId === userId && s.type === 'like')
      .map(s => s.fromId);

    const matchedWithIds = allMatches
      .filter(m => m.userIds.includes(userId))
      .map(m => m.userIds.find(id => id !== userId)!);

    return users.filter(u => peopleWhoLikedMeIds.includes(u.id) && !matchedWithIds.includes(u.id));
  },

  canSwipe: (_user: UserProfile): boolean => {
    return true; // Sem limites agora
  },

  saveSwipe: (swipe: Swipe) => {
    const swipes = db.getSwipes();
    swipes.push({ ...swipe, timestamp: Date.now() });
    localStorage.setItem(STORAGE_KEYS.SWIPES, JSON.stringify(swipes));

    if (swipe.type === 'like') {
      const otherSwipes = swipes.filter(s => s.fromId === swipe.toId && s.toId === swipe.fromId && s.type === 'like');
      if (otherSwipes.length > 0) {
        db.createMatch(swipe.fromId, swipe.toId);
        return true; 
      }
    }
    return false;
  },

  createMatch: (u1: string, u2: string) => {
    const matches = db.getMatches();
    const newMatch: Match = {
      id: Math.random().toString(36).substr(2, 9),
      userIds: [u1, u2],
      timestamp: Date.now()
    };
    matches.push(newMatch);
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  },

  getMatches: (): Match[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MATCHES) || '[]');
  },

  getMessages: (matchId: string): Message[] => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
    return all.filter((m: Message) => m.matchId === matchId);
  },

  sendMessage: (msg: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
    const newMsg: Message = {
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      isRead: false
    };
    all.push(newMsg);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));
    return newMsg;
  },

  getMeets: (): Meet[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MEETS) || '[]');
  },

  saveMeet: (meet: Meet) => {
    const meets = db.getMeets();
    meets.push(meet);
    localStorage.setItem(STORAGE_KEYS.MEETS, JSON.stringify(meets));
  },

  setCurrentUser: (user: UserProfile | null) => {
    if (user) localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser: (): UserProfile | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  // Added upgradeToPro method to update a user's subscription status to PRO
  upgradeToPro: (userId: string): UserProfile | undefined => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index > -1) {
      users[index].isPro = true;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      
      const current = db.getCurrentUser();
      if (current && current.id === userId) {
        db.setCurrentUser(users[index]);
      }
      return users[index];
    }
    return undefined;
  },

  hasSeenTutorial: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.TUTORIAL_SEEN) === 'true';
  },

  setTutorialSeen: () => {
    localStorage.setItem(STORAGE_KEYS.TUTORIAL_SEEN, 'true');
  }
};