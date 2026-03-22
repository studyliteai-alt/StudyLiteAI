import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../services/firebase.ts';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      setLoading(true);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 relative overflow-hidden font-inter text-[#1C1C1C]" style={{ zoom: 0.85 }}>
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#1C1C1C 2px, transparent 2px), linear-gradient(90deg, #1C1C1C 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FBC343]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#A5D5D5]/20 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-2 font-black uppercase tracking-widest text-sm hover:text-[#FBC343] transition-colors"><ArrowLeft size={16} strokeWidth={3} /> Back to Home</button>

        <div className="bg-white border-[3px] border-[#1C1C1C] rounded-2xl p-8 md:p-10 shadow-[12px_12px_0px_0px_#1C1C1C] relative">
          {/* <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#FBC343] border-[3px] border-[#1C1C1C] rounded-full flex items-center justify-center rotate-12 shadow-[4px_4px_0px_0px_#1C1C1C]">
            <Sparkles size={24} className="text-[#1C1C1C]" />
          </div> */}

          <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">Welcome<br />Back</h2>
          <p className="font-bold opacity-70 mb-8 text-sm">Let's continue crushing your goals.</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-widest absolute -top-2 left-4 bg-white px-1 text-[#1C1C1C] z-10">Email</label>
              <input
                type="email"
                placeholder="student@studylite.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#FDFBF7] border-[3px] border-[#1C1C1C] rounded-xl py-4 px-5 outline-none font-bold text-sm focus:bg-white focus:shadow-[4px_4px_0px_0px_#A5D5D5] transition-all placeholder:font-bold placeholder:text-[#1C1C1C]/30 relative z-0"
              />
            </div>

            <div className="relative">
              <label className="text-[10px] font-black uppercase tracking-widest absolute -top-2 left-4 bg-white px-1 text-[#1C1C1C] z-10">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#FDFBF7] border-[3px] border-[#1C1C1C] rounded-xl py-4 px-5 outline-none font-bold text-sm focus:bg-white focus:shadow-[4px_4px_0px_0px_#F4C5C5] transition-all placeholder:opacity-40 relative z-0"
              />
            </div>

            {error && (
              <div className="bg-[#F4C5C5] border-2 border-[#1C1C1C] text-[#1C1C1C] px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-wide">
                ! {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="mt-2 w-full bg-[#1C1C1C] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:-translate-y-1 border-[3px] border-transparent transition-all shadow-[4px_4px_0px_0px_#1C1C1C] hover:shadow-[8px_8px_0px_0px_#FBC343] disabled:opacity-70 disabled:hover:transform-none disabled:hover:shadow-[4px_4px_0px_0px_#1C1C1C]">
              {loading ? 'Logging in...' : 'Enter Dashboard'}
            </button>

            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-[3px] bg-[#1C1C1C] opacity-10"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1C] opacity-40">OR</span>
              <div className="flex-1 h-[3px] bg-[#1C1C1C] opacity-10"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white text-[#1C1C1C] py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:-translate-y-1 border-[3px] border-[#1C1C1C] transition-all shadow-[4px_4px_0px_0px_#1C1C1C] hover:shadow-[8px_8px_0px_0px_#A5D5D5] disabled:opacity-70 disabled:hover:transform-none disabled:hover:shadow-[4px_4px_0px_0px_#1C1C1C] flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center justify-between text-xs font-black uppercase mt-4">
              <Link to="/forgot" className="opacity-50 hover:opacity-100 hover:text-[#A5D5D5] transition-colors">Forgot Password?</Link>
              <Link to="/signup" className="text-[#FBC343] hover:text-[#1C1C1C] hover:underline decoration-2 underline-offset-4 transition-all">Create Account →</Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
export default Login;
