import React from 'react';
import { Sidebar } from './Sidebar.tsx';
import { TopBar } from './TopBar.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { db } from '../../services/firebase.ts';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Trophy, Medal, Flame, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn.ts';

export const Leaderboard: React.FC = () => {
    const { user: currentUser } = useAuth();
    const { lowDataMode } = useTheme();
    const [leaderboard, setLeaderboard] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (!currentUser) return;
        const q = query(
            collection(db, 'users'),
            orderBy('xp', 'desc'),
            limit(10)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const ranked = results.map((data: any, index: number) => ({
                id: data.id,
                ...data,
                rank: index + 1,
                isCurrentUser: data.id === currentUser.uid
            }));
            setLeaderboard(ranked);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching leaderboard:", error);
            setLeaderboard([]);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    return (
        <div className='flex bg-[#FDFBF7] overflow-hidden font-inter text-[#1C1C1C] relative neo-dashboard-layout'>
            {!lowDataMode && (
                <>
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#1c1c1c 2px, transparent 2px), linear-gradient(90deg, #1c1c1c 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
                    <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#FBC343]/20 rounded-full blur-3xl pointer-events-none z-0"></div>
                </>
            )}
            
            <Sidebar />
            
            <div className='flex flex-col grow relative z-10'>
                <TopBar />
                
                <main className='grow p-8 md:p-12 overflow-y-auto relative pb-32'>
                    <div className='max-w-5xl mx-auto'>
                        
                        <div className="flex items-end justify-between mb-16">
                            <div>
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
                                    animate={{ scale: 1, opacity: 1, rotate: -2 }}
                                    className='inline-flex bg-[#FBC343] border-[3px] border-[#1C1C1C] px-4 py-1.5 rounded-full mb-6 shadow-[4px_4px_0px_#1C1C1C]'
                                >
                                    <span className='font-black uppercase tracking-widest text-xs text-[#1C1C1C] flex items-center gap-2'>
                                        <Trophy size={14} strokeWidth={3} className='text-[#1C1C1C]' /> Global Rankings
                                    </span>
                                </motion.div>
                                <h1 className='text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#1C1C1C] leading-[0.9] drop-shadow-[4px_4px_0px_white]'>
                                    Hall of<br/>Fame
                                </h1>
                            </div>
                        </div>

                        <div className="bg-white border-[3px] border-[#1C1C1C] rounded-4xl shadow-[8px_8px_0px_#1C1C1C] overflow-hidden rotate-1">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 p-6 border-b-[3px] border-[#1C1C1C] bg-[#A5D5D5] font-black uppercase tracking-widest text-xs">
                                <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                                <div className="col-span-6 md:col-span-6">Student</div>
                                <div className="col-span-4 md:col-span-3 text-right">XP</div>
                                <div className="hidden md:block md:col-span-2 text-right">Streak</div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y-[3px] divide-[#1C1C1C]">
                                {loading ? (
                                    <div className="p-20 text-center font-black uppercase tracking-widest text-[#1C1C1C]/40 animate-pulse">
                                        Fetching Neural Rankings...
                                    </div>
                                ) : leaderboard.length > 0 ? leaderboard.map((student) => (
                                    <motion.div 
                                        key={student.id}
                                        whileHover={{ backgroundColor: '#FDFBF7' }}
                                        className={cn(
                                            "grid grid-cols-12 gap-4 p-6 items-center transition-colors group",
                                            student.isCurrentUser ? "bg-[#FBC343]/20" : ""
                                        )}
                                    >
                                        {/* Rank */}
                                        <div className="col-span-2 md:col-span-1 flex justify-center">
                                            {student.rank === 1 ? (
                                                <div className="w-10 h-10 bg-[#FBC343] rounded-full border-[3px] border-[#1C1C1C] flex items-center justify-center shadow-[2px_2px_0px_white] rotate-6 group-hover:rotate-12 transition-transform">
                                                    <Crown size={20} strokeWidth={3} className="text-[#1C1C1C]" />
                                                </div>
                                            ) : student.rank === 2 ? (
                                                <div className="w-10 h-10 bg-[#E5E7EB] rounded-full border-[3px] border-[#1C1C1C] flex items-center justify-center shadow-[2px_2px_0px_white] -rotate-6 group-hover:-rotate-12 transition-transform">
                                                    <Medal size={20} className="text-[#1C1C1C]" />
                                                </div>
                                            ) : student.rank === 3 ? (
                                                <div className="w-10 h-10 bg-[#F4C5C5] rounded-full border-[3px] border-[#1C1C1C] flex items-center justify-center shadow-[2px_2px_0px_white] rotate-3 group-hover:rotate-12 transition-transform">
                                                    <Medal size={20} className="text-[#1C1C1C]" />
                                                </div>
                                            ) : (
                                                <span className="font-black text-xl text-[#1C1C1C]/40">{student.rank}</span>
                                            )}
                                        </div>

                                        {/* Name */}
                                        <div className="col-span-6 md:col-span-6 flex items-center gap-4">
                                            <span className="font-black text-lg tracking-tighter uppercase text-[#1C1C1C] truncate">
                                                {student.name}
                                                {student.isCurrentUser && <span className="ml-3 text-[10px] bg-[#1C1C1C] text-[#FBC343] px-2 py-1 rounded-full uppercase tracking-widest border border-transparent align-middle">You</span>}
                                            </span>
                                        </div>

                                        {/* Points -> XP */}
                                        <div className="col-span-4 md:col-span-3 text-right">
                                            <span className="font-black text-lg tracking-tighter uppercase text-[#1C1C1C] bg-[#A5D5D5] px-2.5 py-1 rounded-lg border-[3px] border-[#1C1C1C] shadow-[2px_2px_0px_white] -rotate-2 inline-block">
                                                {(student.xp || 0).toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Streak */}
                                        <div className="hidden md:flex md:col-span-2 justify-end">
                                            <div className="flex items-center gap-2 bg-[#FBC343] px-3 py-1 rounded-lg border-[3px] border-[#1C1C1C] shadow-[2px_2px_0px_white] rotate-2">
                                                <Flame size={16} strokeWidth={3} className="text-[#1C1C1C] fill-[#1C1C1C]" />
                                                <span className="font-black uppercase tracking-widest text-[#1C1C1C]">{student.streak || 0}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
                                        <Trophy size={48} className="text-[#1C1C1C]/20" />
                                        <p className="font-black uppercase tracking-widest text-[#1C1C1C]/40">No heroes ranked yet. Be the first!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};
