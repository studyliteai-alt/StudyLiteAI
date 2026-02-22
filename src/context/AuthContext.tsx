import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuth, getUserProfile, UserProfile } from '../services/auth';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    role: 'user' | 'admin' | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToAuth(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userProfile = await getUserProfile(currentUser.uid);
                setProfile(userProfile);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        // Safety timeout: If Firebase doesn't respond in 5 seconds, stop loading
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 5000);

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            role: profile?.role || null,
            loading
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
