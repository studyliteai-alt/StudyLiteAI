import { X, Bell, HelpCircle, MessageCircle, ExternalLink, Book, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
    id: string;
    icon: React.ReactNode;
    title: string;
    body: string;
    time: string;
    read: boolean;
}

interface RightSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    view: 'notifications' | 'help';
    notifications: Notification[];
}

export const RightSidebar = ({ isOpen, onClose, view, notifications }: RightSidebarProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
                    />

                    {/* Sidebar Panel */}
                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-[70] border-l border-[var(--border)] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
                                    {view === 'notifications' ? <Bell size={20} /> : <HelpCircle size={20} />}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                                        {view === 'notifications' ? 'Notifications' : 'Need Help?'}
                                    </h2>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                        {view === 'notifications' ? 'Stay Updated' : 'Support & Resources'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                            {view === 'notifications' ? (
                                <div className="space-y-3">
                                    {notifications.length > 0 ? (
                                        notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                className={`p-4 rounded-2xl border transition-all cursor-pointer group
                                                    ${n.read
                                                        ? 'bg-white border-[var(--border)] hover:border-slate-300'
                                                        : 'bg-[var(--accent-soft)]/30 border-[var(--accent-soft)] hover:border-[var(--accent)]'}`}
                                            >
                                                <div className="flex gap-4">
                                                    <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[var(--accent-glow)]">
                                                        {n.icon}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-bold text-slate-900 leading-tight group-hover:text-[var(--accent)] transition-colors">
                                                            {n.title}
                                                        </p>
                                                        <p className="text-[12px] text-slate-500 leading-relaxed italic">
                                                            {n.body}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1">
                                                            {n.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                <Bell size={32} />
                                            </div>
                                            <p className="text-sm font-medium text-slate-400">All caught up!</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Quick Support */}
                                    <div className="space-y-4">
                                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Quick Support</h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[
                                                { icon: MessageCircle, label: 'Chat with Support', desc: 'Average response: 5 mins', color: 'text-emerald-500' },
                                                { icon: Book, label: 'Knowledge Base', desc: 'Tutorials and user guides', color: 'text-blue-500' },
                                                { icon: Shield, label: 'Privacy & Safety', desc: 'Manage your neural data', color: 'text-amber-500' }
                                            ].map((item, i) => (
                                                <button key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all group">
                                                    <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${item.color} group-hover:bg-white transition-colors`}>
                                                        <item.icon size={20} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-sm font-bold text-slate-900">{item.label}</p>
                                                        <p className="text-[11px] font-medium text-slate-500">{item.desc}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* FAQs */}
                                    <div className="space-y-4">
                                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Popular Questions</h3>
                                        <div className="space-y-2">
                                            {[
                                                'How do I improve my study streak?',
                                                'Can I export my AI notes?',
                                                'How does adaptive learning work?'
                                            ].map((q, i) => (
                                                <button key={i} className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all text-left">
                                                    <span className="text-xs font-bold text-slate-700">{q}</span>
                                                    <ExternalLink size={14} className="text-slate-400" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Premium CTA */}
                                    <div className="p-6 rounded-3xl bg-[#0F172A] text-white relative overflow-hidden group">
                                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--accent)] opacity-20 blur-3xl rounded-full" />
                                        <div className="relative z-10 space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Zap size={14} className="text-[var(--accent)]" fill="currentColor" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Priority Support</span>
                                            </div>
                                            <p className="text-sm font-bold leading-tight italic">Unlock 24/7 priority access to human tutors.</p>
                                            <button className="w-full py-3 bg-white text-[#0F172A] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                                                Go Pro
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};
