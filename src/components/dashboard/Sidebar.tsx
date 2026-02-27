import { LogOut, LayoutGrid, MessageSquare, Trophy, Settings, X, Zap } from 'lucide-react';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import type { DashboardTab } from '../../pages/Dashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../Logo';

interface SidebarProps {
    activeTab: DashboardTab;
    onTabChange: (tab: DashboardTab) => void;
    isOpen?: boolean;
    onClose?: () => void;
}

const NAV_ITEMS: { id: DashboardTab; icon: React.ElementType; label: string }[] = [
    { id: 'study', icon: MessageSquare, label: 'AI Tutor' },
    { id: 'workspace', icon: LayoutGrid, label: 'Workspace' },
    { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
    { id: 'settings', icon: Settings, label: 'Settings' },
];

export const Sidebar = ({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) => {
    const { logout, profile } = useAuth();

    const handleTabChange = (tab: DashboardTab) => {
        onTabChange(tab);
        if (onClose) onClose();
    };

    return (
        <>
            {/* ── Desktop Sidebar ──────────────────────────────── */}
            <aside
                aria-label="Main navigation"
                className="hidden md:flex w-60 h-screen flex-col py-8
                           bg-[var(--sidebar-bg)] text-[var(--text-primary)] select-none shrink-0 relative z-50 border-r border-[var(--border)] shadow-sm"
            >
                {/* ── Brand Logo */}
                <div className="px-5 mb-8 relative">
                    <div className="flex items-center gap-2.5 group cursor-default">
                        <Logo size={28} className="text-[var(--accent)]" />
                        <div className="flex flex-col">
                            <span className="text-lg font-bold tracking-tight leading-none text-[var(--text-primary)]">StudyLite</span>
                            <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-widest mt-0.5 opacity-80">Intelligence</span>
                        </div>
                    </div>
                </div>

                {/* ── Navigation Links */}
                <nav className="flex-1 px-4 space-y-1" aria-label="Dashboard sections">
                    {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
                        const active = activeTab === id;
                        return (
                            <button
                                key={id}
                                onClick={() => onTabChange(id)}
                                aria-current={active ? 'page' : undefined}
                                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg transition-all duration-200 group relative
                                    ${active
                                        ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                                        : 'text-[var(--text-secondary)] hover:bg-slate-50 hover:text-[var(--text-primary)]'}`}
                            >
                                <Icon
                                    size={16}
                                    strokeWidth={active ? 2.5 : 2}
                                    className="transition-colors duration-200"
                                />
                                <span className="text-[13px] tracking-tight">
                                    {label}
                                </span>
                                {active && (
                                    <div className="absolute left-0 w-0.5 h-4 bg-[var(--accent)] rounded-r-full" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* ── Upgrade CTA (Only for non-pro) */}
                {profile?.subscriptionStatus !== 'pro' && (
                    <div className="px-3 mb-5">
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="relative p-4 rounded-xl overflow-hidden group cursor-default"
                        >
                            {/* Premium Background Layer */}
                            <div className="absolute inset-0 bg-[#0F172A] border border-white/5" />

                            {/* Animated Gradient Glow */}
                            <motion.div
                                animate={{
                                    opacity: [0.2, 0.4, 0.2],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-12 -right-12 w-28 h-28 bg-[var(--accent)] blur-[35px] rounded-full pointer-events-none"
                            />

                            <div className="relative z-10 space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                                        <Zap size={14} className="text-white" fill="currentColor" />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/90">Premium</span>
                                </div>

                                <div className="space-y-0.5">
                                    <h4 className="text-[13px] font-bold leading-tight text-white tracking-tight">Expand Your Mind</h4>
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                        Unlock unlimited AI tutorship and real-time analytics.
                                    </p>
                                </div>

                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => window.location.href = '/checkout?plan=pro'}
                                    className="w-full py-2 bg-white text-[#0F172A] text-[10px] font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-lg shadow-black/20"
                                >
                                    Upgrade to Pro
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* ── Bottom: Logout */}
                <div className="mt-auto px-4 pt-6 border-t border-[var(--border)]">
                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all group"
                    >
                        <LogOut size={16} />
                        <span className="text-[13px] font-medium tracking-tight">Sign out</span>
                    </button>
                </div>
            </aside>

            {/* ── Mobile Side Drawer ──────────────────────────────── */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="md:hidden fixed inset-0 bg-slate-900/20 z-[70] backdrop-blur-sm"
                            onClick={onClose}
                        />
                        <motion.nav
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="md:hidden fixed top-0 left-0 bottom-0 w-[280px] z-[80] bg-[var(--surface)] flex flex-col py-8 border-r border-[var(--border)] shadow-2xl"
                        >
                            <div className="px-6 mb-8 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Logo size={32} className="text-[var(--accent)]" />
                                    <div className="flex flex-col">
                                        <span className="text-xl font-bold tracking-tight leading-none text-[var(--text-primary)]">StudyLite</span>
                                        <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest mt-0.5 opacity-80">Intelligence</span>
                                    </div>
                                </div>
                                <button onClick={onClose} className="text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <ul className="flex-1 px-3 space-y-1">
                                {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
                                    const active = activeTab === id;
                                    return (
                                        <li key={id}>
                                            <button
                                                onClick={() => handleTabChange(id)}
                                                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 relative
                                                    ${active
                                                        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                                                        : 'text-[var(--text-secondary)] hover:bg-slate-50'}`}
                                            >
                                                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                                                {label}
                                                {active && (
                                                    <div className="absolute left-0 w-1 h-5 bg-[var(--accent)] rounded-r-full" />
                                                )}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="px-3 pt-6 border-t border-[var(--border)]">
                                <button
                                    onClick={() => logout()}
                                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-all"
                                >
                                    <LogOut size={18} />
                                    Sign out
                                </button>
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

