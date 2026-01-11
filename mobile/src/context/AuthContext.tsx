import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    onAuthStateChanged,
    signOut as firebaseSignOut,
    signInWithCredential,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import { GoogleSignin } from '../services/safeGoogleSignin';
import { userService } from '../services/userService';
import { Alert, Platform } from 'react-native';

type AuthContextType = {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
    loginWithEmail: async () => { },
    signupWithEmail: async () => { },
    loginWithGoogle: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Configure Google Sign-In (Safe wrap for Expo Go)
        GoogleSignin.configure({
            webClientId: '642242894936-lf7tqq0qje95jjva0rkofcecp1iedj7p.apps.googleusercontent.com', // From google-services.json
        });

        const unsubscribe = onAuthStateChanged(auth, async (usr) => {
            if (usr) {
                // Sync user to backend whenever auth state is restored/changed to logged in
                await userService.syncUser(usr);
            }
            setUser(usr);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const loginWithEmail = async (email: string, pass: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        await userService.syncUser(userCredential.user);
    };

    const signupWithEmail = async (email: string, pass: string, name: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: name });
            // Reload user to get updated profile
            await auth.currentUser.reload();
            // Sync the updated user
            if (auth.currentUser) await userService.syncUser(auth.currentUser);
        }
    };

    const loginWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            const idToken = response.data?.idToken;

            if (!idToken) throw new Error("No ID Token found");

            const credential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(auth, credential);
            await userService.syncUser(userCredential.user);
        } catch (error: any) {
            console.error("Google Sign-In Error:", error);
            if (error.message?.includes('RNGoogleSignin') || error.code === 'Invariant Violation') {
                Alert.alert('Development Build Required', 'Google Sign-In requires a custom development client. Please use a Dev Build or run on an emulator with Google Play Services.');
            } else {
                throw error;
            }
        }
    };

    const logout = async () => {
        try {
            await GoogleSignin.signOut(); // Sign out from Google as well
        } catch (e) {
            // Ignore if not signed in with Google or module missing
        }
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            logout,
            loginWithEmail,
            signupWithEmail,
            loginWithGoogle
        }}>
            {children}
        </AuthContext.Provider>
    );
};
