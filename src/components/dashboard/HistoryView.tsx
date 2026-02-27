import { useState, useEffect } from 'react';
import {
    BookOpen,
    Clock,
    ChevronRight,
    XCircle,
    Search,
    History,
    Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { studySessionService, type StudySession } from '../../services/studySession';

const SUBJECT_STYLES: Record<string, string> = {
    'Biology': 'text-[#6D5BBA] bg-[#F3EFFF] border-[#D9CEFF]',
    'Chemistry': 'text-[#006699] bg-[#E6F7FF] border-[#B3E0FF]',
    'Physics': 'text-[#A0522D] bg-[#FFF0E6] border-[#FFD9B3]',
    'Economics': 'text-[#9A7D0A] bg-[#FFF9E6] border-[#F5E6AB]',
    'Other': 'text-slate-500 bg-slate-50 border-slate-200',
};

const groupByDate = (sessions: StudySession[]) => {
    const groups: Record<string, StudySession[]> = { 'Today': [], 'Yesterday': [], 'Archive': [] };
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    sessions.forEach(s => {
        const raw = (s as any).createdAt ?? (s as any).timestamp;
        const d = raw ? new Date(raw).toDateString() : null;
        if (!d) groups['Archive'].push(s);
        else if (d === today) groups['Today'].push(s);
        else if (d === yesterday) groups['Yesterday'].push(s);
        else groups['Archive'].push(s);
    });
    return groups;
};

export const HistoryView = ({ onStartSession }: { onStartSession?: () => void }) => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<StudySession[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        studySessionService.getUserSessions(user.uid)
            .then(setSessions)
            .catch(() => setHasError(true))
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) return (
        <div className="space-y-12 animate-fade-in max-w-6xl mx-auto">
            <div className="h-12 w-64 skeleton rounded-2xl" />
            <div className="space-y-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 skeleton rounded-[32px]" />)}
            </div>
        </div>
    );

    if (hasError) return (
        <div className="flex flex-col items-center justify-center p-20 text-center gap-8 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
                <XCircle size={40} />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Archive Sync Error</h3>
                <p className="text-sm text-slate-400 font-medium">We couldn't synchronize your academic history.</p>
            </div>
            <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-[#FF7B54] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg shadow-[#FF7B54]/20 hover:scale-105 active:scale-95 transition-all"
            >
                Retry Sync
            </button>
        </div>
    );

    const filtered = search
        ? sessions.filter(s => s.title.toLowerCase().includes(search.toLowerCase()))
        : sessions;

    const groups = groupByDate(filtered);
    const groupOrder = (['Today', 'Yesterday', 'Archive'] as const).filter(g => groups[g].length > 0);

    return (
        <div className="space-y-10 animate-fade-in pb-20 max-w-6xl mx-auto px-4 pt-6">
            {/* ── Search Bar ─────────────────────────── */}
            <div className="relative group w-full max-w-md ml-auto">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--accent)] transition-colors" />
                <input
                    type="search"
                    aria-label="Search sessions"
                    placeholder="Search sessions..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[var(--surface)] border border-[var(--border)]
                               rounded-xl text-[10px] uppercase font-bold tracking-widest outline-none
                               focus:border-[var(--accent)] transition-all shadow-sm"
                />
            </div>

            {/* ── Timeline ─────────────────────────── */}
            <div className="relative space-y-16">
                {/* Left thread */}
                <div
                    aria-hidden
                    className="absolute left-[23px] top-6 bottom-6 w-[1px] hidden md:block bg-slate-200"
                />

                {groupOrder.map(group => (
                    <section key={group} className="space-y-6 relative">
                        {/* Group header */}
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center border border-slate-800 shadow-sm">
                                <History size={20} className="text-white" />
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">{group}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {groups[group].length} sessions record
                                </p>
                            </div>
                        </div>

                        {/* Sessions */}
                        <div className="space-y-4 md:pl-16">
                            {groups[group].map((s, idx) => {
                                const styleKey = s.category in SUBJECT_STYLES ? s.category : 'Other';
                                const ts = (s as any).createdAt ?? (s as any).timestamp;
                                return (
                                    <article
                                        key={s.id || idx}
                                        className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex items-center justify-between group cursor-pointer
                                                   hover:border-[var(--accent)] transition-all shadow-sm"
                                    >
                                        <div className="flex items-center gap-6 flex-1 min-w-0">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 shrink-0 ${SUBJECT_STYLES[styleKey]}`}>
                                                <BookOpen size={20} strokeWidth={2.5} />
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-2">
                                                <p className="text-base font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">
                                                    {s.title}
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-wider border ${SUBJECT_STYLES[styleKey]}`}>
                                                        {s.category}
                                                    </span>
                                                    {ts && (
                                                        <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                            <Clock size={10} className="opacity-60" />
                                                            {new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Mastery bar */}
                                                <div className="max-w-xs space-y-1.5 pt-1">
                                                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[var(--accent)] rounded-full transition-all duration-1000"
                                                            style={{ width: `${s.mastery}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 shrink-0 pl-6">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-2xl font-bold text-[var(--text-primary)] leading-none">{s.mastery}<span className="text-xs text-[var(--accent)] ml-0.5">%</span></p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Mastery</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center
                                                            text-slate-300 group-hover:text-[var(--accent)] group-hover:bg-[var(--accent-soft)] transition-all">
                                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                ))}

                {/* Empty state */}
                {filtered.length === 0 && (
                    <div className="py-20 text-center space-y-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-slate-300 border border-slate-100">
                            <History size={32} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-bold text-[var(--text-primary)] tracking-tight">Timeline is empty</p>
                            <p className="text-xs text-slate-400 font-medium">Your study sessions will appear here.</p>
                        </div>
                        <button
                            onClick={() => onStartSession?.()}
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl
                                       bg-[var(--accent)] text-white text-[10px] font-bold uppercase tracking-widest shadow-sm
                                       hover:brightness-110 active:scale-95 transition-all"
                        >
                            <Plus size={14} strokeWidth={3} /> Start Session
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
