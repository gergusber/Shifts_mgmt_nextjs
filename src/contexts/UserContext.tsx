'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Persist user selection to localStorage
  useEffect(() => {
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId && !currentUser) {
      // We'll fetch the user data when we have the hook available
      // For now, we'll set it when the user switches
    }
  }, [currentUser]);

  const handleSetCurrentUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('currentUserId', user.id);
    } else {
      localStorage.removeItem('currentUserId');
    }
  };

  return (
    <UserContext.Provider
      value={{ currentUser, setCurrentUser: handleSetCurrentUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
