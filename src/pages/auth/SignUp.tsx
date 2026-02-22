import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../../services/auth';
import { useState } from 'react';

export const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await signUp(email, password, name);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream px-6">
            <div className="max-w-md w-full bg-white rounded-3xl border-2 border-brandBlack p-8 shadow-xl">
                <h2 className="text-3xl font-bold mb-2 text-center text-brandBlack">Create Your Account</h2>
                <p className="text-sm text-center text-brandBlack/60 mb-8 font-medium">
                    Start studying smarter in less than 30 seconds.
                </p>

                <div className="space-y-3 mb-8">
                    <button className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-brandBlack rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign up with Google
                    </button>
                    <button className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-brandBlack text-white rounded-xl font-bold text-sm hover:bg-brandPurple transition-all">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 1024 1024">
                            <path d="M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-6.7-131.9 40.1-163.7 40.1-32.1 0-85.3-39.5-141.1-39.5-74.1 1.1-144.1 43.4-182.3 109.2-74.1 128.8-19.1 319.7 54.1 426.1 35.8 51.7 78.1 102.7 128 101.1 45.4-1.5 64.1-30.8 120.3-30.8 56.2 0 71.1 30.8 120.3 30.8 50.9-.8 88.5-47.3 123.5-100.8 40.1-57.7 56.6-113.8 57.5-116.8-.4-.4-100.2-39.2-100.2-179.1zM616.6 235.3c30-37 50.2-88.5 44.6-139.8-43.8 1.7-96.9 29-128.3 64.9-28.1 32.1-52.8 84.3-46.1 134.4 48.7 3.8 98.2-22.5 129.8-59.5z" />
                        </svg>
                        Sign up with Apple
                    </button>
                </div>

                <div className="relative flex items-center justify-center mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-brandBlack/10"></div>
                    </div>
                    <span className="relative bg-white px-4 text-xs font-bold text-brandBlack/40 uppercase">Or sign up with email</span>
                </div>

                <form className="space-y-6" onSubmit={handleSignUp}>
                    {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
                    <div>
                        <label className="block text-sm font-bold mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-brandBlack/10 focus:border-brandPurple outline-none transition-all"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-brandBlack/10 focus:border-brandPurple outline-none transition-all"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-brandBlack/10 focus:border-brandPurple outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Confirm Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-brandBlack/10 focus:border-brandPurple outline-none transition-all"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-brandBlack text-white py-4 rounded-xl font-bold hover:bg-brandPurple transition-all">
                        Create Account
                    </button>
                </form>
                <p className="mt-8 text-center text-sm text-brandBlack/60">
                    Already have an account? <Link to="/login" className="text-brandPurple font-bold hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};
