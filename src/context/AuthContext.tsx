import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useToast } from './ToastContext';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (credentials: any) => Promise<{ error: any }>;
    signUp: (credentials: any) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<{ error: any }>;
    updateProfile: (data: { full_name?: string; avatar_url?: string; is_premium?: boolean }) => Promise<{ error: any }>;
    uploadAvatar: (file: File) => Promise<{ publicUrl: string | null; error: any }>;
    deleteAccount: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const checkUrlErrors = () => {
            const hash = window.location.hash;
            const params = new URLSearchParams(window.location.search);
            let error = params.get('error');
            let errorDescription = params.get('error_description');

            if (!error && hash.includes('error=')) {
                const hashParams = new URLSearchParams(hash.substring(1));
                error = hashParams.get('error');
                errorDescription = hashParams.get('error_description');
            }

            if (error || errorDescription) {
                console.error('Auth Error from URL:', error, errorDescription);
                let displayMessage = errorDescription || 'There was a problem signing you in. Please try again.';
                if (displayMessage.includes('registration is disabled')) {
                    displayMessage = 'Account not found. Please sign up to create a new account.';
                } else if (displayMessage.includes('OAuth-link error')) {
                    displayMessage = 'This Google account is already linked to another email. Try logging in with your email instead.';
                } else if (displayMessage.toLowerCase().includes('email not confirmed')) {
                    displayMessage = 'Please confirm your email address before logging in.';
                }
                showToast('Authentication Error', decodeURIComponent(displayMessage.replace(/\+/g, ' ')), 'error');
                window.history.replaceState(null, '', window.location.pathname);
            }
        };

        checkUrlErrors();

        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [showToast]);

    const signIn = async (credentials: any) => {
        const { error } = await supabase.auth.signInWithPassword(credentials);
        return { error };
    };

    const signUp = async (credentials: any) => {
        const { error } = await supabase.auth.signUp(credentials);
        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const signInWithGoogle = async () => {
        console.log('Initiating Google Auth Sign-in...');
        console.log('Redirect URI target:', `${window.location.origin}/dashboard`);

        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'select_account',
                    },
                }
            });

            if (error) {
                console.error('Supabase OAuth Error:', error.message);
                return { error };
            }

            console.log('OAuth Initiation Success:', data);
            return { error: null };
        } catch (err: any) {
            console.error('Unexpected Auth Error:', err);
            return { error: err };
        }
    };

    const updateProfile = async (data: { full_name?: string; avatar_url?: string; is_premium?: boolean }) => {
        const updateData: any = {};
        if (data.full_name) updateData.full_name = data.full_name;
        if (data.avatar_url) updateData.avatar_url = data.avatar_url;
        if (data.is_premium !== undefined) updateData.is_premium = data.is_premium;

        const { data: updatedUser, error } = await supabase.auth.updateUser({
            data: updateData
        });

        if (!error && updatedUser.user) {
            setUser(updatedUser.user);
        }
        return { error };
    };

    const uploadAvatar = async (file: File) => {
        if (!user) return { publicUrl: null, error: 'Not authenticated' };

        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/avatar.${fileExt}`;

            // 1. Upload the file
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // 2. Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // 3. Update profile metadata
            await updateProfile({ avatar_url: publicUrl });

            return { publicUrl, error: null };
        } catch (error: any) {
            return { publicUrl: null, error };
        }
    };

    const deleteAccount = async () => {
        if (!user) return { error: 'Not authenticated' };

        try {
            // 1. Wipe user data from all related tables
            // Note: In a production app, this should ideally be handled by a Postgres Trigger or Function
            // but we'll do it here for explicit control.

            const { error: quizError } = await supabase.from('quizzes').delete().eq('user_id', user.id);
            if (quizError) throw quizError;

            const { error: sessionError } = await supabase.from('study_sessions').delete().eq('user_id', user.id);
            if (sessionError) throw sessionError;

            const { error: projectError } = await supabase.from('projects').delete().eq('user_id', user.id);
            if (projectError) throw projectError;

            // 2. Sign Out
            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError) throw signOutError;

            return { error: null };
        } catch (error: any) {
            console.error('Error deleting account:', error);
            return { error };
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, signInWithGoogle, updateProfile, uploadAvatar, deleteAccount }}>
            {children}
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
