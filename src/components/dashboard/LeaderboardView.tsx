import React from 'react';
import { Trophy, Crown } from 'lucide-react';

interface LeaderboardUser {
    id: string;
    displayName: string;
    points: number;
}

const MOCK_LEADERBOARD: LeaderboardUser[] = [
    { id: '1', displayName: 'Neural Architect', points: 12500 },
    { id: '2', displayName: 'Logic Weaver', points: 11200 },
    { id: '3', displayName: 'Binary Sage', points: 9800 },
    { id: '4', displayName: 'Data Phantom', points: 8400 },
    { id: '5', displayName: 'Syntax Ghost', points: 7200 },
    { id: '6', displayName: 'Cloud Drifter', points: 6100 },
    { id: '7', displayName: 'Pixel Pilot', points: 5400 },
    { id: '8', displayName: 'Abstract Mind', points: 4300 },
];

export const LeaderboardView = () => {
    const [loading] = React.useState(false);

    const topThree = MOCK_LEADERBOARD.slice(0, 3);
    const theRest = MOCK_LEADERBOARD.slice(3);

    if (loading) return (
        <div className="space-y-8 animate-fade-in">
            <div className="h-80 skeleton rounded-[40px]" />
            {[1, 2, 3].map(i => <div key={i} className="h-20 skeleton rounded-2xl" />)}
        </div>
    );

    return (
        <div className="space-y-16 animate-fade-in pb-20 max-w-6xl mx-auto pt-6">
            {/* ── The Podium ───────────────────────── */}
            {topThree.length > 0 && (
                <section aria-label="Top 3 performers" className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pt-8">
                    {/* Rank 2 */}
                    {topThree[1] && (
                        <div className="order-2 md:order-1 flex flex-col items-center p-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm transition-all hover:shadow-md">
                            <div className="relative mb-6">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[1].id}`} alt={topThree[1].displayName} />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-100 border border-[var(--border)] rounded-full flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">02</div>
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-lg font-bold text-[var(--text-primary)] tracking-tight">{topThree[1].displayName}</p>
                                <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest">{topThree[1].points.toLocaleString()} XP</p>
                            </div>
                        </div>
                    )}

                    {/* Rank 1 */}
                    {topThree[0] && (
                        <div className="order-1 md:order-2 flex flex-col items-center p-10 bg-slate-50 border-2 border-[var(--accent)] rounded-2xl shadow-md transition-all hover:shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Crown size={120} />
                            </div>
                            <div className="relative mb-6">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-sm bg-white">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[0].id}`} alt={topThree[0].displayName} />
                                </div>
                                <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-[var(--accent)] border-2 border-white rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md">01</div>
                            </div>
                            <div className="text-center space-y-2 relative z-10">
                                <p className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{topThree[0].displayName}</p>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--accent)] rounded-full shadow-sm">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">{topThree[0].points.toLocaleString()} XP</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rank 3 */}
                    {topThree[2] && (
                        <div className="order-3 flex flex-col items-center p-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm transition-all hover:shadow-md">
                            <div className="relative mb-6">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[2].id}`} alt={topThree[2].displayName} />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-100 border border-[var(--border)] rounded-full flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">03</div>
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-lg font-bold text-[var(--text-primary)] tracking-tight">{topThree[2].displayName}</p>
                                <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest">{topThree[2].points.toLocaleString()} XP</p>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* ── Rankings List ─────────────────────── */}
            <section aria-label="Ranking table" className="px-4">
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-slate-50">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Rankings</h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{MOCK_LEADERBOARD.length} Members Online</span>
                    </div>

                    <div className="divide-y divide-[var(--border)]">
                        {theRest.length === 0 ? (
                            <div className="py-16 text-center">
                                <p className="text-xs text-slate-400 font-medium">All members are currently listed</p>
                            </div>
                        ) : (
                            theRest.map((user, idx) => {
                                const userRank = idx + 4;
                                return (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-5 group hover:bg-slate-50 transition-all"
                                    >
                                        <div className="flex items-center gap-6">
                                            <span className="w-6 text-sm font-bold text-slate-300 group-hover:text-[var(--accent)]">
                                                {userRank.toString().padStart(2, '0')}
                                            </span>
                                            <div className="w-12 h-12 rounded-xl border border-[var(--border)] bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-lg overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt={user.displayName} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-base font-bold text-[var(--text-primary)] tracking-tight">{user.displayName}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Level {Math.floor(user.points / 1000) + 1}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-lg font-bold text-[var(--text-primary)] tracking-tight">{user.points.toLocaleString()}</p>
                                                <p className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-wider">XP</p>
                                            </div>
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all
                                                            ${userRank === 4 ? 'bg-[var(--accent-soft)] border-[var(--accent)]/20 text-[var(--accent)]' : 'bg-slate-50 border-[var(--border)] text-slate-300'}`}>
                                                <Trophy size={16} fill={userRank === 4 ? "currentColor" : "none"} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};
