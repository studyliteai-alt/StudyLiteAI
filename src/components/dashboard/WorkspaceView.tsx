import React from 'react';
import { Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { QuizResult } from '../../services/quiz';
import { StudySession } from '../../services/studySession';
import { UserProfile } from '../../services/auth';
import type { DashboardTab } from '../../pages/Dashboard';

interface WorkspaceViewProps {
    firstName: string;
    profile: UserProfile | null;
    sessions: StudySession[];
    quizzes: QuizResult[];
    loading: boolean;
    onTabChange: (tab: DashboardTab) => void;
    isPro: boolean;
    promptsUsed: number;
    promptLimit: number;
    usagePercent: number;
    isLowData?: boolean;
}

export const WorkspaceView = ({
    sessions,
    quizzes,
    loading,
    onTabChange,
}: WorkspaceViewProps) => {

    const courseSessions = sessions.slice(0, 3);

    const nextLessons = React.useMemo(() => {
        const revisit = quizzes.filter(q => q.score < 80).slice(0, 5);
        return revisit.map((q, i) => ({
            id: String(i + 1).padStart(2, '0'),
            title: q.title,
            course: sessions[i % sessions.length]?.category || 'Study Session',
            duration: '22 min', // Mock duration as seen in image
            teacher: 'ConnerGarcia', // Mock teacher as seen in image
        }));
    }, [quizzes, sessions]);

    const [activeFilter, setActiveFilter] = React.useState(0);
    const categories = ['All courses', 'Marketing', 'Computer Science', 'Psychology'];

    return (
        <div className="space-y-10 animate-fade-in pb-12 pt-4 px-5">
            {/* ── My Courses Section ────────────────────────── */}
            <section aria-label="My courses">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {categories.map((cat, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveFilter(i)}
                                className={`px-5 py-2 rounded-lg text-sm font-semibold border transition-all whitespace-nowrap
                                    ${activeFilter === i
                                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                                        : 'bg-white text-slate-500 border-[var(--border)] hover:border-slate-300'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-[280px] rounded-2xl bg-slate-100 animate-pulse" />
                        ))
                    ) : (
                        <>
                            {courseSessions.map((session, i) => (
                                <div
                                    key={session.id || i}
                                    className="bg-[var(--surface)] rounded-xl p-5 flex flex-col min-h-[240px] border border-[var(--border)] shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-2.5 py-1 rounded-md bg-[var(--accent-soft)] text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                                            {session.category || 'Study Session'}
                                        </span>
                                        <Bookmark size={16} className="text-slate-300 group-hover:text-[var(--accent)] transition-colors" />
                                    </div>

                                    <h3 className="text-base font-bold text-[var(--text-primary)] leading-snug mb-5 line-clamp-2">
                                        {session.title}
                                    </h3>

                                    <div className="mt-auto space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                <span>PROGRESS</span>
                                                <span>{session.mastery ?? 30}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-[var(--border)]">
                                                <div
                                                    className="h-full bg-[var(--accent)] rounded-full transition-all duration-1000"
                                                    style={{ width: `${session.mastery ?? 30}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex -space-x-1.5">
                                                {[1, 2, 3].map(avatar => (
                                                    <div key={avatar} className="w-8 h-8 rounded-lg border border-[var(--surface)] overflow-hidden bg-slate-100">
                                                        <img
                                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatar + i * 10}`}
                                                            alt="Peer"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => onTabChange('study')}
                                                className="px-5 py-1.5 rounded-lg bg-[var(--accent)] text-[11px] font-bold hover:brightness-105 active:scale-95 transition-all text-white"
                                            >
                                                Continue
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </section>

            {/* ── My Next Lessons & Recommended Section ──── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lessons Section */}
                <section className="lg:col-span-2 bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)] shadow-sm" aria-label="Lessons to revisit">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">Upcoming Lessons</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-4 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <span className="col-span-2">Lesson</span>
                            <span>Instructor</span>
                            <span className="text-right">Time</span>
                        </div>

                        <div className="space-y-2">
                            {nextLessons.length > 0 ? (
                                nextLessons.map((lesson, i) => (
                                    <div key={i} className="grid grid-cols-4 items-center p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all group cursor-pointer">
                                        <div className="col-span-2 flex items-center gap-4">
                                            <span className="text-xs font-bold text-slate-300 w-5">{lesson.id}</span>
                                            <div>
                                                <p className="text-sm font-bold text-[var(--text-primary)] leading-tight">{lesson.title}</p>
                                                <p className="text-[11px] font-medium text-slate-400 mt-0.5">{lesson.course}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-slate-100 overflow-hidden border border-[var(--border)]">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lesson.teacher}`} alt={lesson.teacher} />
                                            </div>
                                            <span className="text-[11px] font-semibold text-[var(--text-secondary)]">{lesson.teacher}</span>
                                        </div>
                                        <span className="text-xs font-bold text-[var(--text-primary)] text-right">{lesson.duration}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center text-slate-400 text-sm font-medium">No lessons scheduled</div>
                            )}
                        </div>
                    </div>
                </section>

                {/* AI Capacity / Premium CTA Card */}
                <section aria-label="Neural Capacity" className="h-full">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5 }}
                        className="h-full rounded-3xl p-8 bg-[#0F172A] text-white flex flex-col border border-white/5 shadow-2xl relative overflow-hidden group"
                    >
                        {/* Background Glow */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--accent)] opacity-10 blur-[80px] rounded-full pointer-events-none group-hover:opacity-20 transition-opacity" />

                        <div className="relative z-10 flex-1 space-y-8">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Neural Capacity</p>
                                </div>
                                <h3 className="text-2xl font-black tracking-tight leading-none italic">Intelligence <br /> Usage</h3>
                            </div>

                            {/* Usage Stats */}
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/30">
                                        <span>Daily Prompts</span>
                                        <span className="text-white">80% Reached</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '80%' }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-[var(--accent)] to-indigo-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                                        />
                                    </div>
                                </div>

                                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                    You're nearing the free tier limit. Upgrade to <span className="text-white font-bold">Pro</span> for unlimited high-reasoning sessions.
                                </p>
                            </div>

                            {/* Peer Activity */}
                            <div className="space-y-3">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Active Scholars Online</p>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4, 5].map(avatar => (
                                        <div key={avatar} className="w-8 h-8 rounded-xl border-2 border-[#0F172A] overflow-hidden bg-slate-800 shadow-xl">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=rec-${avatar}`} alt="Peer" />
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-xl border-2 border-[#0F172A] bg-[var(--accent)] flex items-center justify-center text-[9px] font-bold shadow-xl">
                                        +12
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 relative z-10">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => window.location.href = '/checkout?plan=pro'}
                                className="w-full py-4 rounded-2xl bg-white text-[#0F172A] font-black text-xs uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-slate-50 transition-all"
                            >
                                Upgrade to Pro
                            </motion.button>
                        </div>
                    </motion.div>
                </section>
            </div>
        </div>
    );
};
