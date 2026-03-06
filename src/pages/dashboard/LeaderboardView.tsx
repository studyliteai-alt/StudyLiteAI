import { Trophy, Medal, Crown, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const LeaderboardView = () => {
    const leaderboardData = [
        { name: 'Saira Goodman', score: 2840, streak: 12, trend: 'up', avatar: 'Saira' },
        { name: 'Tony Ware', score: 2720, streak: 8, trend: 'down', avatar: 'Tony' },
        { name: 'Conner Garcia', score: 2600, streak: 15, trend: 'up', avatar: 'Conner' },
        { name: 'Zayd Tahir', score: 2450, streak: 12, trend: 'same', avatar: 'Zayd' },
        { name: 'Elena Gilbert', score: 2310, streak: 4, trend: 'up', avatar: 'Elena' },
        { name: 'Marcus Wright', score: 2100, streak: 3, trend: 'down', avatar: 'Marcus' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic">Leaderboard</h1>
                    <p className="text-brandBlack/60 font-bold uppercase tracking-widest text-xs mt-1">Study smarter. Rank higher.</p>
                </div>
                <div className="hidden sm:flex items-center gap-3 bg-white border-2 border-brandBlack p-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Trophy className="w-6 h-6 text-brandYellow" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Your Rank</p>
                        <p className="font-black italic">#4 Globally</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border-4 border-brandBlack rounded-[32px] overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <table className="w-full">
                    <thead className="bg-brandBlack text-white">
                        <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Rank</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Scholar</th>
                            <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest">Score</th>
                            <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest">Streak</th>
                            <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest">Trend</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-brandBlack/5">
                        {leaderboardData.map((user, i) => (
                            <tr key={i} className={`hover:bg-cream/50 transition-colors ${user.name === 'Zayd Tahir' ? 'bg-brandPurple/5' : ''}`}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg font-black italic">
                                        {i === 0 ? <Crown className="w-6 h-6 text-brandYellow" /> :
                                            i === 1 ? <Medal className="w-6 h-6 text-slate-400" /> :
                                                i === 2 ? <Medal className="w-6 h-6 text-amber-700" /> :
                                                    `#${i + 1}`}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full border-2 border-brandBlack overflow-hidden bg-cream shadow-sm">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`} alt="avatar" />
                                        </div>
                                        <span className="font-black italic text-sm">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center font-black tabular-nums">{user.score} XP</td>
                                <td className="px-6 py-4 text-center font-black italic text-brandPurple">{user.streak}d</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end">
                                        {user.trend === 'up' ? <TrendingUp className="w-4 h-4 text-green-500" /> :
                                            user.trend === 'down' ? <TrendingDown className="w-4 h-4 text-red-500" /> :
                                                <Minus className="w-4 h-4 text-gray-300" />}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-brandYellow border-2 border-brandBlack p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="font-black uppercase italic mb-2">Weekly Prize</h3>
                    <p className="font-bold text-xs opacity-60">Top 3 scholars unlock a free month of Premium + exclusive badge.</p>
                </div>
                <div className="bg-brandPurple text-white border-2 border-brandBlack p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="font-black uppercase italic mb-2">Goal: 3000 XP</h3>
                    <div className="w-full bg-white/20 h-2 rounded-full mt-3">
                        <div className="w-[82%] bg-white h-full rounded-full"></div>
                    </div>
                </div>
                <div className="bg-white border-2 border-brandBlack p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="font-black uppercase italic mb-2">Social Challenge</h3>
                    <p className="font-bold text-xs opacity-60">Invite a friend to a study duel and earn 500 bonus XP.</p>
                </div>
            </div>
        </div>
    );
};
