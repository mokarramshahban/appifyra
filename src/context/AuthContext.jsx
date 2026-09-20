import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth not configured. Default to logged out state.");
      setLoading(false);
      return;
    }
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      });
      return unsubscribe;
    } catch (err) {
      console.warn("Firebase Auth Error:", err);
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    if (!auth || !googleProvider) {
      alert("Auth is disabled because Firebase is not configured.");
      return null;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setCurrentUser(result.user);
      return result.user;
    } catch (error) {
      console.error('Firebase Google Sign-In Error:', error);
      alert(`Google Sign-In Error: ${error.message || 'Could not complete authentication.'}`);
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) return setCurrentUser(null);
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Sign Out Error:', e);
    }
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loginWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
