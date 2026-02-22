import { Link, useNavigate } from 'react-router-dom';
import { logIn } from '../../services/auth';
import { useState } from 'react';
import { Mail, Lock, ArrowLeft, Brain, Zap, Clock, Eye, EyeOff } from 'lucide-react';

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await logIn(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        }
    };

    return (
        <div className="min-h-screen flex pt-10 bg-cream font-sans selection:bg-brandPurple/20 text-brandBlack overflow-x-hidden">
            {/* Back to Home Button */}
            <Link to="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 text-brandBlack/40 hover:text-brandBlack transition-colors font-bold text-xs group">
                <div className="w-7 h-7 rounded-full border border-brandBlack/5 flex items-center justify-center group-hover:bg-white transition-all">
                    <ArrowLeft size={14} />
                </div>
                Back to Home
            </Link>

            {/* Left Section: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center max-lg:px-6 lg:p-12 relative z-10">
                <div className="max-w-[340px] w-full animate-reveal py-4">
                    {/* Brand Header */}
                    <div className="mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                            <div className="relative">
                                <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:rotate-[15deg] transition-transform duration-500">
                                    <rect x="20" y="20" width="60" height="60" rx="16" fill="#A855F7" />
                                    <circle cx="50" cy="50" r="18" fill="#FACC15" />
                                    <rect x="45" y="45" width="10" height="25" rx="2" fill="#18181B" transform="rotate(-45 45 45)" />
                                    <path d="M30 70C30 70 40 60 50 60C60 60 70 70 70 70" stroke="white" strokeWidth="5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span className="text-xl font-black italic tracking-tighter">studylite.ai</span>
                        </Link>
                        <h1 className="text-3xl font-black mb-1.5 tracking-tight leading-tight">Welcome back</h1>
                        <div className="flex items-center gap-2 text-brandBlack/40 font-bold text-[12px]">
                            <span>New here?</span>
                            <Link to="/signup" className="text-brandPurple hover:underline">Create account</Link>
                        </div>
                    </div>

                    {/* OAuth Section */}
                    <div className="flex gap-3 mb-8">
                        <button className="flex-1 flex items-center justify-center gap-2.5 py-3 px-4 bg-white border border-brandBlack/5 rounded-xl font-black text-xs hover:border-brandPurple/30 transition-all transform active:scale-95 group shadow-sm">
                            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span>Google</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2.5 py-3 px-4 bg-white border border-brandBlack/5 rounded-xl font-black text-xs hover:border-brandPurple/30 transition-all transform active:scale-95 group shadow-sm">
                            <svg width="18" height="18" viewBox="0 0 256 315" xmlns="http://www.w3.org/2000/svg">
                                <path d="M213.803 167.03c.442 47.83 41.739 64.29 42.102 64.484-.343.935-6.592 22.599-21.711 44.645-13.084 19.071-26.635 38.081-48.177 38.48-21.144.399-28.006-12.554-52.179-12.554-24.136 0-31.782 12.155-52.179 12.917-20.767.765-36.435-20.675-49.619-39.677C5.071 241.657-14.896 173.811 11.026 128.847c12.884-22.383 35.843-36.547 60.709-36.908 19.026-.362 36.96 12.822 48.625 12.822 11.666 0 33.328-15.86 56.41-13.486 9.682.404 36.883 3.903 54.346 29.441-1.402.87-32.355 18.824-37.313 46.314M164.062 60.67c10.334-12.583 17.291-30.012 15.397-47.37-14.931.597-33.012 9.941-43.725 22.414-9.61 11.137-18.006 28.983-15.728 46.012 16.657 1.295 33.722-8.473 44.056-21.056" fill="#000000" />
                            </svg>
                            <span>Apple</span>
                        </button>
                    </div>

                    <form className="space-y-4" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-50 border-2 border-red-100 p-3 rounded-xl flex items-center gap-3 animate-wiggle">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                <p className="text-red-600 text-[12px] font-bold">{error}</p>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brandBlack/30 ml-2">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brandBlack/20 group-focus-within:text-brandPurple transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white border-2 border-brandBlack/5 focus:border-brandPurple/30 rounded-xl py-3 pl-11 pr-4 outline-none transition-all font-bold text-brandBlack placeholder:text-brandBlack/10 text-sm shadow-sm"
                                    placeholder="hello@studylite.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brandBlack/30">Password</label>
                                <Link to="/forgot-password" title="Forgot" className="text-[10px] font-black text-brandPurple hover:underline">Forgot?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brandBlack/20 group-focus-within:text-brandPurple transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full bg-white border-2 border-brandBlack/5 focus:border-brandPurple/30 rounded-xl py-3 pl-11 pr-12 outline-none transition-all font-bold text-brandBlack placeholder:text-brandBlack/10 text-sm shadow-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brandBlack/20 hover:text-brandPurple transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-brandBlack text-white py-4 rounded-xl font-black text-base hover:bg-brandPurple transition-all transform active:scale-[0.98] shadow-lg shadow-brandBlack/5 hover:shadow-brandPurple/20 flex items-center justify-center gap-2 group mt-2">
                            Sign in
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Section: Value-Driven Experience */}
            <div className="hidden lg:flex w-1/2 b relative items-center justify-center overflow-hidden border-l border-brandBlack/5">
                {/* Stage Base */}
                <div className="absolute bottom-[20%] w-[85%] h-[400px] bg-brandPurple rounded-[48px] transform rotate-[-8deg] origin-bottom-right shadow-2xl skew-x-[-12deg] -right-16">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                </div>

                {/* Concentrated Value Card */}
                <div className="relative z-20 animate-float">
                    <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[40px] border-2 border-white shadow-2xl max-w-sm transform rotate-[2deg]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-brandYellow rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                                <Brain className="text-brandBlack" size={24} />
                            </div>
                            <div className="w-12 h-12 bg-brandPurple rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
                                <Zap className="text-white" size={24} />
                            </div>
                        </div>

                        <h2 className="text-3xl font-black leading-tight mb-4 tracking-tight">
                            Study smarter, <br />
                            <span className="text-brandPurple">not harder.</span>
                        </h2>

                        <p className="text-brandBlack/60 font-medium leading-relaxed mb-8">
                            Join 50,000+ students mastering subjects in minutes with our elite AI engine.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-brandPurple/5 p-4 rounded-3xl border border-brandPurple/10">
                                <div className="text-brandPurple font-black text-2xl mb-1">98%</div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-brandBlack/40">Success Rate</div>
                            </div>
                            <div className="bg-brandYellow/5 p-4 rounded-3xl border border-brandYellow/10">
                                <div className="text-brandBlack font-black text-2xl mb-1">2.4x</div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-brandBlack/40">Faster Learning</div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Decorative Elements around the card */}
                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-brandPink/20 rounded-full blur-xl animate-pulse" />
                    <div className="absolute -bottom-8 -left-8 flex items-center gap-2 bg-brandBlack text-white py-3 px-6 rounded-2xl shadow-xl transform -rotate-3 border-2 border-white/20">
                        <Clock size={18} className="text-brandYellow" />
                        <span className="font-black text-xs">Save 10+ hours / week</span>
                    </div>
                </div>

                {/* Abstract Background Elements */}
                <div className="absolute top-[15%] right-[15%] w-24 h-24 bg-white/40 rounded-[32px] rotate-12 animate-float-reverse border border-white/60 blur-sm" />
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_50%,rgba(168,85,247,0.1)_0%,transparent_50%)]" />
            </div>
        </div>
    );
};
