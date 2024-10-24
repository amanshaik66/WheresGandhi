// /frontend/src/hooks/AuthContext.tsx

import { createContext, useContext, FC, ReactNode } from 'react';
import useAuth from './useAuth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: string | null;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom Hook to access the AuthContext
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider Component to wrap around the App
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth(); // Use the custom hook
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
