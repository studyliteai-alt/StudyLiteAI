import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { signUp, signInWithGoogle } = useAuth();
    const location = useLocation();

    // Preserve the redirect state
    const from = location.state?.from;

    const handleGoogleSignUp = async () => {
        setGoogleLoading(true);
        setError(null);
        try {
            const { error } = await signInWithGoogle();
            if (error) {
                setError(error.message);
                setGoogleLoading(false);
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
            setGoogleLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            if (error.message.includes('already registered')) {
                setError('An account with this email already exists. Try logging in or using Google instead!');
            } else {
                setError(error.message);
            }
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12 bg-cream">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white border-2 border-brandBlack p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h1 className="text-3xl font-black mb-4">Check your email</h1>
                        <p className="text-brandBlack/60 font-medium mb-8">
                            We've sent a confirmation link to <span className="font-bold text-brandBlack">{email}</span>. Please click the link to activate your account.
                        </p>
                        <Link
                            to="/login"
                            className="w-full block bg-brandBlack text-white py-4 rounded-xl font-black text-lg border-2 border-brandBlack shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12 bg-cream">
            <div className="w-full max-w-md">
                <div className="bg-white border-2 border-brandBlack p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-black mb-2">Join StudyLite</h1>
                        <p className="text-brandBlack/60 font-medium">Start your AI-powered learning journey</p>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border-2 border-red-500 p-4 rounded-xl text-red-600 text-sm font-bold">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold block ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brandBlack/40" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-cream border-2 border-brandBlack rounded-xl py-3 pl-12 pr-4 font-bold focus:outline-none focus:ring-2 focus:ring-brandPurple/20 transition-all"
                                    placeholder="John Doe"
                                    required
                                    autoComplete="name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold block ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brandBlack/40" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-cream border-2 border-brandBlack rounded-xl py-3 pl-12 pr-4 font-bold focus:outline-none focus:ring-2 focus:ring-brandPurple/20 transition-all"
                                    placeholder="name@example.com"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold block ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brandBlack/40" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-cream border-2 border-brandBlack rounded-xl py-3 pl-12 pr-4 font-bold focus:outline-none focus:ring-2 focus:ring-brandPurple/20 transition-all"
                                    placeholder="••••••••"
                                    required
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brandPurple text-white py-4 rounded-xl font-black text-lg border-2 border-brandBlack shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t-2 border-brandBlack/5"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase font-black">
                                <span className="bg-white px-4 text-brandBlack/40">Or continue with</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleSignUp}
                            disabled={loading || googleLoading}
                            className="mt-6 w-full bg-white text-brandBlack py-4 rounded-xl font-black text-lg border-2 border-brandBlack shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {googleLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Sign up with Google
                                </>
                            )}
                        </button>
                        <p className="text-center text-[10px] font-bold text-brandBlack/40 uppercase tracking-widest mt-4">
                            You may need to confirm your email
                        </p>
                    </div>

                    <p className="mt-8 text-center font-bold text-brandBlack/60">
                        Already have an account?{' '}
                        <Link to="/login" state={{ from }} className="text-brandPurple hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
