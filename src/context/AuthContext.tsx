import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../lib/firebase";

export interface AdminUser {
  uid: string;
  email: string | null;
}

interface AuthContextType {
  user: AdminUser | null;
  currentUser: AdminUser | null;
  loading: boolean;
  isFirebaseReady: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check if Firebase auth is initialized
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser: User | null) => {
        if (fbUser) {
          if (fbUser.emailVerified) {
            setUser({ uid: fbUser.uid, email: fbUser.email });
          } else {
            void firebaseSignOut(auth);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (!isFirebaseConfigured || !auth) {
        throw new Error("Firebase authentication is not configured.");
      }
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      await cred.user.reload();
      if (!cred.user.emailVerified) {
        await firebaseSignOut(auth);
        throw new Error("Please verify your email using the link we sent before signing in.");
      }
      setUser({ uid: cred.user.uid, email: cred.user.email });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (!isFirebaseConfigured || !auth) {
        throw new Error("Firebase authentication is not configured.");
      }
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await sendEmailVerification(cred.user);
      await firebaseSignOut(auth);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        await firebaseSignOut(auth);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        loading,
        isFirebaseReady: isFirebaseConfigured,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
