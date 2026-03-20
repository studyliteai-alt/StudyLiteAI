import React from 'react';
import { Sidebar } from './Sidebar.tsx';
import { TopBar } from './TopBar.tsx';
import { BrainCircuit, PlayCircle, History as HistoryIcon, FileText, Settings, Trophy, Flame, Target, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase.ts';

const Home: React.FC = () => {
    const { user } = useAuth();
    const { lowDataMode } = useTheme();
    const [stats, setStats] = React.useState({
        streak: 0,
        avgScore: 0,
        xp: 0
    });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchUserStats = async () => {
            if (!user) return;
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setStats({
                        streak: data.streak || 0,
                        avgScore: data.avgScore || 0,
                        xp: data.xp || 0
                    });
                }
            } catch (error) {
                console.error("Error fetching user stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserStats();
    }, [user]);

    return (
        <div className='flex flex-col md:flex-row bg-[#FDFBF7] overflow-hidden font-inter text-[#1C1C1C] relative neo-dashboard-layout'>

            {/* Background Grid */}
            {!lowDataMode && (
                <>
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#1c1c1c 2px, transparent 2px), linear-gradient(90deg, #1c1c1c 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FBC343]/10 rounded-full blur-3xl pointer-events-none z-0"></div>
                </>
            )}

            <Sidebar />
            <div className='flex flex-col grow overflow-hidden relative z-10'>
                <TopBar />

                <main className='grow p-8 md:p-12 overflow-y-auto relative pb-32'>
                    <div className='w-full'>

                        {/* Header Sequence */}
                        <div className='flex flex-col mb-10'>
                            <h1 className='text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#1C1C1C] drop-shadow-[2px_2px_0px_white] mb-6'>
                                Welcome back, <br className="block md:hidden" /> <span className="text-[#FBC343]">{user?.displayName || 'Student'}</span>!
                            </h1>

                            {/* Performance Stats - Full Width */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='grid grid-cols-1 md:grid-cols-3 gap-6'
                            >
                                <div className='bg-white border-[3px] border-[#1C1C1C] p-6 md:p-8 rounded-3xl shadow-[4px_4px_0px_#1C1C1C] md:shadow-[8px_8px_0px_#1C1C1C] flex items-center justify-between group hover:-translate-y-1 hover:shadow-[12px_12px_0px_#1C1C1C] transition-all cursor-default'>
                                    <div>
                                        <div className='font-black text-3xl md:text-4xl leading-none'>
                                            {loading ? '...' : stats.streak}
                                        </div>
                                        <div className='text-xs font-black uppercase tracking-widest text-[#1C1C1C]/60 mt-2'>Day Streak</div>
                                    </div>
                                    <div className='w-16 h-16 bg-[#FBC343] rounded-2xl border-[3px] border-[#1C1C1C] flex items-center justify-center shrink-0 -rotate-6 group-hover:rotate-6 transition-transform'>
                                        <Flame size={32} className="text-[#1C1C1C] fill-[#1C1C1C]" strokeWidth={2} />
                                    </div>
                                </div>

                                <div className='bg-white border-[3px] border-[#1C1C1C] p-6 md:p-8 rounded-3xl shadow-[4px_4px_0px_#1C1C1C] md:shadow-[8px_8px_0px_#1C1C1C] flex items-center justify-between group hover:-translate-y-1 hover:shadow-[12px_12px_0px_#1C1C1C] transition-all cursor-default'>
                                    <div>
                                        <div className='font-black text-3xl md:text-4xl leading-none'>
                                            {loading ? '...' : `${stats.avgScore}%`}
                                        </div>
                                        <div className='text-xs font-black uppercase tracking-widest text-[#1C1C1C]/60 mt-2'>Avg Score</div>
                                    </div>
                                    <div className='w-16 h-16 bg-[#A5D5D5] rounded-2xl border-[3px] border-[#1C1C1C] flex items-center justify-center shrink-0 rotate-6 group-hover:-rotate-6 transition-transform'>
                                        <Target size={32} className="text-[#1C1C1C]" strokeWidth={2.5} />
                                    </div>
                                </div>

                                <div className='bg-white border-[3px] border-[#1C1C1C] p-6 md:p-8 rounded-3xl shadow-[4px_4px_0px_#1C1C1C] md:shadow-[8px_8px_0px_#1C1C1C] flex items-center justify-between group hover:-translate-y-1 hover:shadow-[12px_12px_0px_#1C1C1C] transition-all cursor-default'>
                                    <div>
                                        <div className='font-black text-3xl md:text-4xl leading-none'>
                                            {loading ? '...' : stats.xp.toLocaleString()}
                                        </div>
                                        <div className='text-xs font-black uppercase tracking-widest text-[#1C1C1C]/60 mt-2'>XP Earned</div>
                                    </div>
                                    <div className='w-16 h-16 bg-[#F4C5C5] rounded-2xl border-[3px] border-[#1C1C1C] flex items-center justify-center shrink-0 -rotate-3 group-hover:rotate-12 transition-transform'>
                                        <Zap size={32} className="text-[#1C1C1C]" strokeWidth={2.5} />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Main Bento Grid - 6 Items */}
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>

                            {/* 1. Study Session */}
                            <Link to="/session" className='block'>
                                <motion.div whileHover={{ y: -8, scale: 1.02 }} className='h-full bg-[#A5D5D5] border-[3px] border-[#1C1C1C] rounded-4xl p-8 flex flex-col justify-between shadow-[8px_8px_0px_#1C1C1C] hover:shadow-[12px_12px_0px_#1C1C1C] transition-all group rotate-1'>
                                    <div className='mb-8 flex justify-between items-start'>
                                        <div className='w-16 h-16 bg-white text-[#1C1C1C] flex items-center justify-center font-black rounded-2xl border-[3px] border-[#1C1C1C] -rotate-3 group-hover:rotate-12 transition-transform shadow-[4px_4px_0px_#1C1C1C]'>
                                            <FileText size={32} strokeWidth={2.5} />
                                        </div>
                                        <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity -rotate-45" size={24} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h2 className='text-2xl font-black uppercase tracking-tighter mb-2 leading-none'>Study<br />Session</h2>
                                        <p className='text-[#1C1C1C]/80 font-bold text-xs mt-3 leading-relaxed'>Upload PDFs, generate summaries, and extract key points.</p>
                                    </div>
                                </motion.div>
                            </Link>

                            {/* 2. Practice Quiz */}
                            <Link to="/quiz" className='block'>
                                <motion.div whileHover={{ y: -8, scale: 1.02 }} className='h-full bg-[#FBC343] border-[3px] border-[#1C1C1C] rounded-4xl p-8 flex flex-col justify-between shadow-[8px_8px_0px_#1C1C1C] hover:shadow-[12px_12px_0px_#1C1C1C] transition-all group -rotate-1'>
                                    <div className='mb-8 flex justify-between items-start'>
                                        <div className='w-16 h-16 bg-white text-[#1C1C1C] flex items-center justify-center font-black rounded-2xl border-[3px] border-[#1C1C1C] rotate-6 group-hover:-rotate-12 transition-transform shadow-[4px_4px_0px_#1C1C1C]'>
                                            <PlayCircle size={32} strokeWidth={2.5} />
                                        </div>
                                        <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity -rotate-45" size={24} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h2 className='text-2xl font-black uppercase tracking-tighter mb-2 leading-none'>Practice<br />Quiz</h2>
                                        <p className='text-[#1C1C1C]/80 font-bold text-xs mt-3 leading-relaxed'>Test your knowledge with AI-generated dynamic assessments.</p>
                                    </div>
                                </motion.div>
                            </Link>

                            {/* 3. AI Tutor */}
                            <Link to="/chat" className='block'>
                                <motion.div whileHover={{ y: -8, scale: 1.02 }} className='h-full bg-[#8FB8D9] border-[3px] border-[#1C1C1C] rounded-4xl p-8 flex flex-col justify-between shadow-[8px_8px_0px_#1C1C1C] hover:shadow-[12px_12px_0px_#1C1C1C] transition-all group rotate-2'>
                                    <div className='mb-8 flex justify-between items-start'>
                                        <div className='w-16 h-16 bg-white text-[#1C1C1C] flex items-center justify-center font-black rounded-2xl border-[3px] border-[#1C1C1C] -rotate-6 group-hover:rotate-12 transition-transform shadow-[4px_4px_0px_#1C1C1C]'>
                                            <BrainCircuit size={32} strokeWidth={2.5} />
                                        </div>
                                        <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity -rotate-45" size={24} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h2 className='text-2xl font-black uppercase tracking-tighter mb-2 leading-none'>AI<br />Tutor</h2>
                                        <p className='text-[#1C1C1C]/80 font-bold text-xs mt-3 leading-relaxed'>Chat directly with your notes and ask complex questions.</p>
                                    </div>
                                </motion.div>
                            </Link>

                            {/* 4. Memory Bank */}
                            <Link to="/history" className='block'>
                                <motion.div whileHover={{ y: -8, scale: 1.02 }} className='h-full bg-[#FDFBF7] border-[3px] border-[#1C1C1C] rounded-4xl p-8 flex flex-col justify-between shadow-[8px_8px_0px_#1C1C1C] hover:shadow-[12px_12px_0px_#1C1C1C] transition-all group -rotate-2'>
                                    <div className='mb-8 flex justify-between items-start'>
                                        <div className='w-16 h-16 bg-[#1C1C1C] text-white flex items-center justify-center font-black rounded-2xl border-[3px] border-[#1C1C1C] rotate-3 group-hover:-rotate-12 transition-transform shadow-[4px_4px_0px_#A5D5D5]'>
                                            <HistoryIcon size={32} strokeWidth={2.5} />
                                        </div>
                                        <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity -rotate-45" size={24} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h2 className='text-2xl font-black uppercase tracking-tighter mb-2 leading-none'>Memory<br />Bank</h2>
                                        <p className='text-[#1C1C1C]/70 font-bold text-xs mt-3 leading-relaxed'>Review your past study sessions and track your mastery.</p>
                                    </div>
                                </motion.div>
                            </Link>

                            {/* 5. Leaderboard */}
                            <Link to="/leaderboard" className='block'>
                                <motion.div whileHover={{ y: -8, scale: 1.02 }} className='h-full bg-[#F4C5C5] border-[3px] border-[#1C1C1C] rounded-4xl p-8 flex flex-col justify-between shadow-[8px_8px_0px_#1C1C1C] hover:shadow-[12px_12px_0px_#1C1C1C] transition-all group rotate-1'>
                                    <div className='mb-8 flex justify-between items-start'>
                                        <div className='w-16 h-16 bg-white text-[#1C1C1C] flex items-center justify-center font-black rounded-2xl border-[3px] border-[#1C1C1C] -rotate-6 group-hover:rotate-12 transition-transform shadow-[4px_4px_0px_#1C1C1C]'>
                                            <Trophy size={32} strokeWidth={2.5} />
                                        </div>
                                        <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity -rotate-45" size={24} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h2 className='text-2xl font-black uppercase tracking-tighter mb-2 leading-none'>Leader<br />board</h2>
                                        <p className='text-[#1C1C1C]/80 font-bold text-xs mt-3 leading-relaxed'>See how you rank globally and compete with peers.</p>
                                    </div>
                                </motion.div>
                            </Link>

                            {/* 6. Settings */}
                            <Link to="/settings" className='block'>
                                <motion.div whileHover={{ y: -8, scale: 1.02 }} className='h-full bg-white border-[3px] border-[#1C1C1C] rounded-4xl p-8 flex flex-col justify-between shadow-[8px_8px_0px_#1C1C1C] hover:shadow-[12px_12px_0px_#1C1C1C] transition-all group -rotate-1'>
                                    <div className='mb-8 flex justify-between items-start'>
                                        <div className='w-16 h-16 bg-[#1C1C1C] text-[#FBC343] flex items-center justify-center font-black rounded-2xl border-[3px] border-[#1C1C1C] rotate-6 group-hover:-rotate-12 transition-transform shadow-[4px_4px_0px_#FBC343]'>
                                            <Settings size={32} strokeWidth={2.5} />
                                        </div>
                                        <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity -rotate-45" size={24} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h2 className='text-2xl font-black uppercase tracking-tighter mb-2 leading-none'>User<br />Settings</h2>
                                        <p className='text-[#1C1C1C]/80 font-bold text-xs mt-3 leading-relaxed'>Manage preferences, data mode, and account details.</p>
                                    </div>
                                </motion.div>
                            </Link>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Home;
