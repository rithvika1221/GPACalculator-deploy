'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for your user state
type UserType = {
  // Include the properties of your user object
  id: string;
  name: string;
  email: string;
  // ... other user properties
};

type UserContextType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
