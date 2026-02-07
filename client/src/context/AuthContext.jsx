// contexts/AuthContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

// Create context
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authInitialized, setAuthInitialized] = useState(false);
    const [error, setError] = useState(null);

    // Initialize auth
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                setUser(user);
                setAuthInitialized(true);
            },
            (error) => {
                setError(error.message);
                setAuthInitialized(true);
            }
        );

        return () => unsubscribe();
    }, []);

    // Auth methods
    const signIn = async (email, password) => {
        setError(null);
        try {
            return await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setError(error.message);
        }
    };

    const signUp = async (email, password) => {
        setError(null);
        try {
            return await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setError(error.message);
        }
    };

    const signInWithGoogle = async () => {
        try {
            return await signInWithPopup(auth, googleProvider);
        } catch (error) {
            setError(error.message);
        }
    };

    const signOut = async () => {
        setError(null);
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                authInitialized,
                error,
                signIn,
                signUp,
                signOut,
                signInWithGoogle,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
