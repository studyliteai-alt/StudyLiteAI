import React from 'react';
import {
    Zap,
    Target,
    Brain,
    Award,
    Clock,
    AlertCircle,
    Search
} from 'lucide-react';
import { quizService, type QuizResult } from '../../services/quiz';
import { useAuth } from '../../context/AuthContext';

export const PerformanceView = () => {
    const { user } = useAuth();
    const [quizzes, setQuizzes] = React.useState<QuizResult[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [filter, setFilter] = React.useState('');

    React.useEffect(() => {
        if (!user) return;
        quizService.getUserQuizzes(user.uid)
            .then(setQuizzes)
            .catch(() => setError('Metrics sync failed'))
            .finally(() => setLoading(false));
    }, [user]);

    const stats = React.useMemo(() => {
        if (!quizzes.length) return null;
        const totalScore = quizzes.reduce((acc, q) => acc + q.score, 0);
        const avgScore = Math.round(totalScore / quizzes.length);
        const bestScore = Math.max(...quizzes.map(q => q.score));
        // Concept Mastery: how many quizzes scored ≥ 80% (real proxy for mastery)
        const mastered = quizzes.filter(q => q.score >= 80).length;
        const conceptMastery = Math.round((mastered / quizzes.length) * 100);
        return { avgScore, bestScore, count: quizzes.length, conceptMastery };
    }, [quizzes]);

    const filteredQuizzes = React.useMemo(
        () => filter.trim()
            ? quizzes.filter(q => q.title.toLowerCase().includes(filter.toLowerCase()))
            : quizzes,
        [quizzes, filter]
    );

    if (loading) return (
        <div className="space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-8 h-96 skeleton rounded-[32px]" />
                <div className="md:col-span-4 space-y-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-20 skeleton rounded-2xl" />)}
                </div>
            </div>
        </div>
    );

    const metrics = [
        { label: 'Precision', value: `${stats?.avgScore || 0}%`, icon: Target, color: 'text-[var(--accent)]', bg: 'bg-[var(--accent)]/8' },
        { label: 'Peak Performance', value: `${stats?.bestScore || 0}%`, icon: Award, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
        { label: 'Total Challenges', value: stats?.count || 0, icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
        { label: 'Concept Mastery', value: `${stats?.conceptMastery ?? 0}%`, icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' }
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-20 max-w-7xl mx-auto px-4 pt-6">
            {/* Status Bar */}
            <div className="flex items-center justify-between gap-4">
                {error ? (
                    <div role="alert" className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold uppercase tracking-widest">
                        <AlertCircle size={14} />
                        Sync failed
                    </div>
                ) : <div />}

                <div className="flex items-center gap-2.5 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm">
                    <div className="relative">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 block" />
                    </div>
                    <Clock size={12} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Data Live
                    </span>
                </div>
            </div>

            {/* ── Bento Grid ────────────────────────── */}
            <section aria-label="Performance analytics" className="grid grid-cols-1 md:grid-cols-12 gap-8">

                {/* Accuracy Ring Card */}
                <div className="md:col-span-8 bg-[var(--surface)] border border-[var(--border)] rounded-[32px] p-10 flex flex-col items-center justify-center text-center shadow-sm group">
                    <div className="relative w-56 h-56 mb-8" aria-label={`Global precision: ${stats?.avgScore || 0}%`}>
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
                            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="4" />
                            <circle
                                cx="50" cy="50" r="45" fill="none"
                                stroke="var(--accent)" strokeWidth="6" strokeLinecap="round"
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * (stats?.avgScore || 0)) / 100}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-6xl font-bold tracking-tighter text-[var(--text-primary)] leading-none">
                                {stats?.avgScore || 0}
                                <span className="text-2xl text-[var(--accent)] ml-0.5">%</span>
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-4">
                                Average Precision
                            </span>
                        </div>
                    </div>

                    <div className="max-w-md space-y-4">
                        <p className="text-sm font-medium text-slate-500 leading-relaxed">
                            {quizzes.length >= 2
                                ? (() => {
                                    const half = Math.ceil(quizzes.length / 2);
                                    const older = quizzes.slice(0, half);
                                    const newer = quizzes.slice(half);
                                    const oldAvg = Math.round(older.reduce((a, q) => a + q.score, 0) / older.length);
                                    const newAvg = Math.round(newer.reduce((a, q) => a + q.score, 0) / newer.length);
                                    const diff = newAvg - oldAvg;
                                    const sign = diff >= 0 ? '+' : '';
                                    const color = diff >= 0 ? 'text-emerald-600' : 'text-rose-600';
                                    return (
                                        <>
                                            Performance trend: <span className={`font-bold ${color}`}>{sign}{diff}%</span> improvement.
                                        </>
                                    );
                                })()
                                : 'Complete more assessments to generate trend data.'
                            }
                        </p>
                    </div>
                </div>

                {/* Metric Pills */}
                <div className="md:col-span-4 flex flex-col gap-4">
                    {metrics.map((m, i) => (
                        <article key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex items-center justify-between group hover:border-[var(--accent)] transition-all shadow-sm">
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 border border-[var(--border)]`}>
                                    <m.icon size={22} className={m.color} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                        {m.label}
                                    </p>
                                    <p className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                                        {m.value}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* ── Assessment Archive ─────────────────── */}
            <section aria-label="Assessment history" className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Assessment Archive</h3>
                    <div className="relative w-full max-w-xs group">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--accent)] transition-colors" />
                        <input
                            type="search"
                            aria-label="Filter assessments"
                            placeholder="Filter assessment..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-[var(--surface)] border border-[var(--border)]
                                       rounded-xl text-[10px] uppercase font-bold tracking-widest outline-none
                                       focus:border-[var(--accent)] transition-all"
                        />
                    </div>
                </div>

                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-[var(--border)]">
                                    {['Title', 'Score', 'Units', 'Status'].map((h, idx) => (
                                        <th
                                            key={h}
                                            scope="col"
                                            className={`px-8 py-5 text-[9px] font-bold uppercase tracking-widest text-slate-400
                                                        ${idx === 3 ? 'text-right' : ''}`}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {quizzes.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                                No metadata recorded
                                            </p>
                                        </td>
                                    </tr>
                                ) : filteredQuizzes.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-10 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            No results found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredQuizzes.map((q, i) => (
                                        <tr
                                            key={q.id || i}
                                            className="group hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                                                    {q.title}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
                                                        <div
                                                            className="h-full bg-[var(--accent)] rounded-full transition-all duration-1000"
                                                            style={{ width: `${q.score}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-600">{q.score}%</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">
                                                    {(q as any).totalQuestions ?? '—'} Qs
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest
                                                    ${q.score >= 80
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                        : 'bg-amber-50 text-amber-600 border border-amber-100'}`}
                                                >
                                                    {q.score >= 80 ? 'Mastered' : 'Reviewed'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};
