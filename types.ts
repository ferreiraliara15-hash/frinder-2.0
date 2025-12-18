
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  photos: string[];
  bio: string;
  interests: string[];
  hobbies: string[];
  profession?: string;
  instagram?: string;
  email: string;
  swipeCount?: number;
  lastSwipeReset?: number;
  // Added isPro property to track if the user has a PRO subscription
  isPro: boolean;
}

export interface Match {
  id: string;
  userIds: [string, string];
  timestamp: number;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  timestamp: number;
  isRead: boolean;
}

export interface Meet {
  id: string;
  hostId: string;
  guestId: string;
  date: string;
  time: string;
  location: string;
  activity: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: number;
}

export interface Swipe {
  fromId: string;
  toId: string;
  type: 'like' | 'pass';
  timestamp: number;
}

export enum AppView {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  TUTORIAL = 'TUTORIAL',
  SWIPE = 'SWIPE',
  MATCHES = 'MATCHES',
  CHAT = 'CHAT',
  MEETS = 'MEETS',
  PROFILE = 'PROFILE',
  LIA_AI = 'LIA_AI'
}