import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar.tsx';
import { TopBar } from './TopBar.tsx';
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { Calendar, CheckCircle2, ChevronRight, Clock, Search, Trash2, Brain, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { cn } from '../../utils/cn.ts';

const HistoryPage: React.FC = () => {
    const { user } = useAuth();
    const { lowDataMode } = useTheme();
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'sessions'), 
            where('userId', '==', user.uid),
            orderBy('timestamp', 'desc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSessions(results);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching history:", error);
            setSessions([
              { id: '1', title: 'Microservices Fundamentals', notes: 'Distributed systems notes...', timestamp: '2026-03-18T10:00:00Z', summaryCount: 3, quizTaken: true, score: 85 },
              { id: '2', title: 'React State Management', notes: 'React Hooks mastery...', timestamp: '2026-03-17T14:30:00Z', summaryCount: 5, quizTaken: false, score: 0 },
              { id: '3', title: 'PostgreSQL Advanced Indexing', notes: 'Database designs...', timestamp: '2026-03-15T09:15:00Z', summaryCount: 2, quizTaken: true, score: 92 },
            ]);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    const handleDeleteSession = async (id: string) => {
        if (!window.confirm("Are you sure you want to purge this neural record? This cannot be undone.")) return;
        
        try {
            await deleteDoc(doc(db, 'sessions', id));
            setSessions(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error("Error deleting session:", error);
        }
    };

    const filteredSessions = sessions.filter(s => 
        (s.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0, scale: 0.98 },
        visible: { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            transition: { type: 'spring' as const, stiffness: 200, damping: 20 }
        }
    };

    return (
        <div className='flex bg-[#FDFBF7] overflow-hidden font-inter text-[#1C1C1C] relative neo-dashboard-layout'>
            {!lowDataMode && (
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#1c1c1c 2px, transparent 2px), linear-gradient(90deg, #1c1c1c 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
            )}
            <Sidebar />
            
            <div className='flex flex-col grow overflow-hidden relative z-10'>
                <TopBar />
                
                <main className='grow p-6 md:p-12 overflow-y-auto relative pb-32'>
                    <div className='max-w-6xl mx-auto'>
                        <header className='mb-12'>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 bg-[#A5D5D5] border-[3px] border-[#1C1C1C] rounded-4xl shadow-[8px_8px_0px_#1C1C1C] -rotate-1 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                                
                                <div className="relative z-10 w-full md:w-auto text-center md:text-left">
                                    <motion.h1 
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className='text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1C1C1C] drop-shadow-[2px_2px_0px_white]'
                                    >
                                        Memory<br className="hidden md:block"/>Bank
                                    </motion.h1>
                                    <motion.p 
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className='font-bold uppercase tracking-widest text-[#1C1C1C]/70 text-xs md:text-sm mt-4'
                                    >
                                        Neural records of your academic evolution.
                                    </motion.p>
                                </div>

                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className='relative w-full max-w-lg z-10 rotate-0 md:rotate-2 mt-4 md:mt-0'
                                >
                                    <Search className='absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-[#1C1C1C]' size={24} strokeWidth={3} />
                                    <input 
                                        type="text" 
                                        placeholder="SEARCH ARCHIVES..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className='w-full bg-[#FDFBF7] border-[3px] border-[#1C1C1C] rounded-full py-4 md:py-6 pl-14 md:pl-16 pr-6 text-sm md:text-lg font-black tracking-widest uppercase placeholder:text-[#1C1C1C]/40 focus:outline-none focus:shadow-[8px_8px_0px_#FBC343] transition-all shadow-[8px_8px_0px_#1C1C1C] text-[#1C1C1C]'
                                    />
                                </motion.div>
                            </div>
                        </header>

                        {loading ? (
                            <div className='flex flex-col gap-6'>
                                {[1,2,3].map(i => (
                                    <div key={i} className='bg-white border-[3px] border-[#1C1C1C] h-32 rounded-4xl animate-pulse shadow-[8px_8px_0px_#1C1C1C] opacity-50 block' style={{ transform: `rotate(${i % 2 === 0 ? '1deg' : '-1deg'})` }}></div>
                                ))}
                            </div>
                        ) : (
                            <motion.div 
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className='flex flex-col gap-6 mb-12'
                            >
                                <AnimatePresence mode='popLayout'>
                                    {filteredSessions.map((session, i) => (
                                        <motion.div 
                                            key={session.id} 
                                            variants={itemVariants} 
                                            layout
                                            exit={{ opacity: 0, scale: 0.9 }}
                                        >
                                            <div className={cn(
                                                "p-5 md:p-8 group bg-white border-[3px] border-[#1C1C1C] rounded-4xl relative overflow-hidden transition-all hover:shadow-[12px_12px_0px_#1C1C1C] hover:-translate-y-1 shadow-[8px_8px_0px_#1C1C1C]",
                                                i % 3 === 0 ? '-rotate-1 hover:-rotate-2 hover:border-[#A5D5D5]' : i % 3 === 1 ? 'rotate-1 hover:rotate-2 hover:border-[#FBC343]' : 'rotate-0 hover:-rotate-1 hover:border-[#F4C5C5]'
                                            )}>
                                                <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8'>
                                                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8 grow'>
                                                        <div className={cn(
                                                            'w-16 h-16 md:w-20 md:h-20 flex items-center justify-center font-black rounded-3xl border-[3px] border-[#1C1C1C] shrink-0 text-3xl shadow-[4px_4px_0px_#1C1C1C] rotate-3 group-hover:rotate-12 transition-transform',
                                                            i % 3 === 0 ? 'bg-[#A5D5D5]' : i % 3 === 1 ? 'bg-[#FBC343]' : 'bg-[#F4C5C5]'
                                                        )}>
                                                            <Brain size={32} strokeWidth={2.5} className="text-[#1C1C1C]" />
                                                        </div>
                                                        <div className="grow w-full md:w-auto">
                                                            <div className='flex flex-wrap items-center gap-3 md:gap-4 mb-3'>
                                                                <h3 className='text-2xl md:text-3xl font-black uppercase tracking-tighter text-[#1C1C1C] drop-shadow-[2px_2px_0px_white] block'>
                                                                    {session.title || (session.notes.substring(0, 30) + '...')}
                                                                </h3>
                                                                {session.quizTaken && (
                                                                    <div className='bg-[#1C1C1C] text-[#FBC343] px-3 py-1 border-[3px] border-[#1C1C1C] shadow-[4px_4px_0px_#FBC343] rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 -rotate-2'>
                                                                        <Activity size={14} className="animate-pulse" strokeWidth={3} />
                                                                        {session.score || 85}% Mastered
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className='flex flex-wrap gap-6 text-sm font-bold tracking-widest text-[#1C1C1C]/60 uppercase'>
                                                               <span className='flex items-center gap-2'><Calendar size={18} strokeWidth={3} className="text-[#1C1C1C]" /> {new Date(session.timestamp).toLocaleDateString()}</span>
                                                               <span className='flex items-center gap-2'><Clock size={18} strokeWidth={3} className="text-[#1C1C1C]" /> {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                               <span className='flex items-center gap-2'><CheckCircle2 size={18} strokeWidth={3} className="text-[#A5D5D5]"/> {session.summaryCount || 3} Synapses</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className='flex flex-row sm:flex-row items-center justify-between sm:justify-end gap-4 mt-2 lg:mt-0 w-full lg:w-auto'>
                                                        <button 
                                                            onClick={() => handleDeleteSession(session.id)}
                                                            className='w-12 h-12 md:w-14 md:h-14 shrink-0 bg-white border-[3px] border-[#1C1C1C] flex items-center justify-center text-[#1C1C1C] hover:text-white hover:bg-black rounded-xl shadow-[4px_4px_0px_#1C1C1C] hover:translate-y-1 hover:shadow-[0px_0px_0px_#1C1C1C] transition-all rotate-3 group/del cursor-pointer'
                                                            title="Purge Record"
                                                        >
                                                            <Trash2 size={20} strokeWidth={2.5} className="group-hover/del:rotate-12 transition-transform" />
                                                        </button>
                                                        <button className='w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 justify-center bg-[#1C1C1C] text-white border-[3px] border-[#1C1C1C] text-xs md:text-sm font-black uppercase tracking-widest rounded-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:bg-white hover:text-[#1C1C1C] shadow-[4px_4px_0px_#1C1C1C] md:shadow-[6px_6px_0px_#1C1C1C] transition-all flex items-center gap-2 group/btn -rotate-1'>
                                                            Access Core <ChevronRight size={18} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                
                                {filteredSessions.length === 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className='flex flex-col items-center justify-center p-12 md:p-20 text-center bg-[#FBC343] border-[3px] border-[#1C1C1C] rounded-4xl shadow-[8px_8px_0px_#1C1C1C] rotate-1'
                                    >
                                        <div className='w-20 h-20 md:w-24 md:h-24 bg-[#1C1C1C] text-white border-[3px] border-[#1C1C1C] rounded-full flex items-center justify-center mb-6 shadow-[8px_8px_0px_white] -rotate-6 animate-pulse'>
                                            <Search size={32} strokeWidth={3} />
                                        </div>
                                        <h3 className='text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#1C1C1C] mb-4'>Void Detected</h3>
                                        <p className='text-xs md:text-sm font-bold tracking-widest uppercase text-[#1C1C1C]/70 mb-8 max-w-md'>No neural records match this query signature.</p>
                                        <button className='px-6 py-4 md:px-10 md:py-5 bg-white border-[3px] border-[#1C1C1C] text-[#1C1C1C] font-black uppercase tracking-widest rounded-full hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_#1C1C1C] transition-all text-sm md:text-lg'>
                                            Initiate New Link
                                        </button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HistoryPage;
