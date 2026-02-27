import { useState, useEffect } from 'react';
import {
    User,
    Bell,
    Shield,
    LogOut,
    Camera,
    Check,
    AlertCircle,
    Clock,
    Globe,
    AlertTriangle,
    Zap,
    CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { settingsService } from '../../services/settings';
import { updateUserProfile } from '../../services/auth';

interface SettingsViewProps { }

export const SettingsView = ({ }: SettingsViewProps) => {
    const { logout, profile, user } = useAuth();
    const { theme, setTheme } = useTheme();
    const [displayName, setDisplayName] = useState(profile?.displayName || '');
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [reminders, setReminders] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            if (user) {
                const s = await settingsService.getSettings(user.uid);
                if (s) {
                    setReminders(s.notifications);
                }
            }
        };
        loadSettings();
    }, [user]);

    const isPro = profile?.subscriptionStatus === 'pro';

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Update profile
            if (displayName !== profile?.displayName) {
                await updateUserProfile(user.uid, { displayName });
            }

            // Update settings
            await settingsService.saveSettings(user.uid, {
                notifications: reminders,
                theme: theme as any
            });

            setMessage({ text: 'Neural settings synchronized successfully', type: 'success' });
        } catch (err) {
            setMessage({ text: 'Sync failed. Please check connection.', type: 'error' });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="space-y-12 animate-fade-in pb-20 max-w-5xl mx-auto px-4 pt-6">
            {/* ── Success/Error Feedback ───────────── */}
            {message && (
                <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border animate-slide-up
                    ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-600'}`}>
                    {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                    <span className="text-[10px] font-bold uppercase tracking-widest">{message.text}</span>
                </div>
            )}

            <div className="space-y-16">
                {/* ── Identity Section ────────────────── */}
                <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm space-y-8">
                    <div className="flex items-center gap-8">
                        <div className="relative">
                            <div className="w-20 h-20 bg-slate-100 rounded-2xl border border-[var(--border)] flex items-center justify-center text-slate-300 overflow-hidden">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={32} />
                                )}
                            </div>
                            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-[var(--border)] rounded-lg flex items-center justify-center text-slate-500 shadow-sm hover:bg-slate-50 transition-all">
                                <Camera size={14} />
                            </button>
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Profile Settings</h2>
                            <p className="text-sm text-slate-500 font-medium">Manage your personal identity and account details.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-[var(--border)] rounded-xl text-sm outline-none focus:border-[var(--accent)] transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-4 py-2.5 bg-slate-100 border border-[var(--border)] rounded-xl text-sm text-slate-500 outline-none cursor-not-allowed"
                            />
                        </div>
                    </div>
                </section>

                {/* ── Preferences Section ────────────── */}
                <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm space-y-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-[var(--text-primary)]">
                            <Bell size={18} className="text-amber-500" />
                            <h3 className="text-lg font-bold tracking-tight">Main Preferences</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-[var(--border)] bg-slate-50/50 flex items-center justify-between group hover:border-[var(--accent)] transition-all">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold">Email Notifications</p>
                                    <p className="text-[11px] text-slate-400 font-medium">Daily study reminders</p>
                                </div>
                                <button
                                    onClick={() => setReminders(!reminders)}
                                    className={`w-10 h-5 rounded-full transition-all relative ${reminders ? 'bg-[var(--accent)]' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${reminders ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>
                            <div className="p-4 rounded-xl border border-[var(--border)] bg-slate-50/50 flex items-center justify-between group hover:border-[var(--accent)] transition-all">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold">Dark Mode</p>
                                    <p className="text-[11px] text-slate-400 font-medium">Reduce eye strain</p>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className={`w-10 h-5 rounded-full transition-all relative ${theme === 'dark' ? 'bg-[var(--accent)]' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${theme === 'dark' ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-[var(--border)]">
                        <div className="flex items-center gap-3 text-[var(--text-primary)]">
                            <Clock size={18} className="text-blue-500" />
                            <h3 className="text-lg font-bold tracking-tight">Notification Channels</h3>
                        </div>
                        <div className="space-y-3">
                            {[
                                { id: 'reminders', label: 'Study Reminders', icon: Clock, desc: 'Receive alerts for your scheduled study sessions' },
                                { id: 'performance', label: 'Performance Analytics', icon: Shield, desc: 'Weekly reports on your learning progress' },
                                { id: 'marketing', label: 'Product Updates', icon: Globe, desc: 'Stay informed about new neural features' }
                            ].map((pref) => (
                                <div key={pref.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 border border-[var(--border)] hover:border-[var(--accent)] transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-white border border-[var(--border)] flex items-center justify-center text-slate-400">
                                            <pref.icon size={16} />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold">{pref.label}</p>
                                            <p className="text-[11px] text-slate-400 font-medium">{pref.desc}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setReminders(!reminders)}
                                        className={`w-10 h-5 rounded-full transition-all relative ${reminders ? 'bg-[var(--accent)]' : 'bg-slate-200'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${reminders ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Security Section ────────────────── */}
                <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 text-[var(--text-primary)]">
                        <Shield size={18} className="text-rose-500" />
                        <h3 className="text-lg font-bold tracking-tight">Security</h3>
                    </div>
                    <div className="p-6 rounded-xl border border-amber-100 bg-amber-50 space-y-3">
                        <div className="flex items-center gap-2 text-amber-600">
                            <AlertTriangle size={14} />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Account Security</p>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                            Resetting your password will log you out of all currently active sessions.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-8 py-3 bg-[var(--accent)] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Synchronizing...' : 'Save All Changes'}
                        </button>
                        <button
                            onClick={() => { }}
                            className="px-8 py-3 bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--text-primary)] text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all"
                        >
                            Update Password
                        </button>
                    </div>
                </section>

                {/* ── Billing Section ─────────────────── */}
                <section className="space-y-8">
                    <div className="flex items-center gap-3 text-[var(--text-primary)]">
                        <CreditCard size={18} className="text-indigo-500" />
                        <h3 className="text-lg font-bold tracking-tight">Billing & Subscription</h3>
                    </div>

                    {isPro ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#0F172A] text-white rounded-[2rem] p-10 shadow-2xl relative overflow-hidden group border border-white/5"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-[var(--accent)] group-hover:scale-110 transition-transform duration-1000">
                                <Zap size={180} />
                            </div>
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[var(--accent)]/10 blur-[80px] rounded-full" />

                            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
                                <div className="space-y-8 flex-1">
                                    <div className="space-y-3">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent)] rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-[var(--accent)]/20">
                                            <Zap size={10} fill="currentColor" />
                                            Professional
                                        </div>
                                        <h3 className="text-4xl font-black tracking-tighter italic">StudyLite Pro</h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Renewal Date</p>
                                            <p className="text-lg font-bold">Mar 26, 2026</p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Monthly Rate</p>
                                            <p className="text-lg font-bold">$12.00</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 shrink-0">
                                    <button className="w-full md:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all backdrop-blur-md">
                                        Manage Subscription
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-[var(--border)] rounded-[2rem] p-10 shadow-sm relative overflow-hidden group"
                        >
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                                <div className="space-y-6 flex-1">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-[var(--border)] flex items-center justify-center text-slate-300">
                                            <CreditCard size={32} />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Free Member</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Standard Intelligence Access</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-md">
                                        You're currently using the basic model. Upgrade to unlock <span className="text-[var(--accent)] font-bold">O1 Reasonning</span> and unlimited neural sessions.
                                    </p>
                                </div>

                                <div className="shrink-0">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => window.location.href = '/checkout?plan=pro'}
                                        className="px-10 py-4 bg-[var(--accent)] text-white text-[11px] font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-[var(--accent)]/30 hover:brightness-110 transition-all"
                                    >
                                        Explore Pro Features
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </section>

                {/* ── Logout ──────────────────────────── */}
                <div className="pt-8 border-t border-[var(--border)]">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
                    >
                        <LogOut size={16} /> Sign out of StudyLite
                    </button>
                </div>
            </div>
        </div>
    );
};
