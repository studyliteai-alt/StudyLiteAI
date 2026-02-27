import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuth, subscribeToProfile, UserProfile } from '../services/auth';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    role: 'user' | 'admin' | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let profileUnsubscribe: (() => void) | null = null;

        const authUnsubscribe = subscribeToAuth((currentUser) => {
            setUser(currentUser);

            if (profileUnsubscribe) {
                profileUnsubscribe();
                profileUnsubscribe = null;
            }

            if (currentUser) {
                profileUnsubscribe = subscribeToProfile(currentUser.uid, (updatedProfile) => {
                    if (updatedProfile) {
                        setProfile(updatedProfile);
                    } else {
                        // No profile doc yet — create a lightweight fallback
                        // so the dashboard renders immediately while Firestore catches up
                        setProfile({
                            uid: currentUser.uid,
                            email: currentUser.email || '',
                            displayName: currentUser.displayName || 'Student',
                            handle: 'Free Member',
                            avatarSeed: currentUser.uid,
                            role: 'user',
                            createdAt: new Date().toISOString(),
                            points: 0,
                            streak: 0,
                            promptsUsed: 0,
                            quizzesUsed: 0,
                            subscriptionStatus: 'free',
                            lastActiveDate: new Date().toISOString(),
                        });
                    }
                    setLoading(false);
                });
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        // Safety timeout: if Firebase doesn't respond in 3s, stop loading
        // Reduced from 8s — real auth responses arrive in <1s on good connections
        const timeout = setTimeout(() => setLoading(false), 3000);

        return () => {
            authUnsubscribe();
            if (profileUnsubscribe) profileUnsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const value: AuthContextType = {
        user,
        profile,
        role: profile?.role || null,
        loading,
        logout: async () => {
            const { logOut } = await import('../services/auth');
            await logOut();
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div
                    aria-live="polite"
                    aria-label="Loading application"
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--color-cream, #FDFBF7)',
                    }}
                >
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        border: '3px solid rgba(0,0,0,0.08)',
                        borderTopColor: '#A855F7',
                        animation: 'spin 0.65s linear infinite',
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};

// Exported separately from AuthProvider to satisfy Vite Fast Refresh requirements
// (Fast Refresh requires that files exporting components only export components)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
