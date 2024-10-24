// /frontend/src/hooks/useAuth.ts

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  role: string | null;
}

const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const fetchedRole = await fetchUserRole(currentUser.uid);
        setRole(fetchedRole);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserRole = async (uid: string): Promise<string> => {
    // Placeholder: In a real app, fetch the role from Firestore or user claims.
    return uid === 'admin-user-id' ? 'admin' : 'user';
  };

  return { user, loading, role };
};

export default useAuth;
