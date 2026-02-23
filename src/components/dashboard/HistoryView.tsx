import { motion } from 'framer-motion';
import { Search, Filter, Clock, FileText, ChevronRight, BookOpen } from 'lucide-react';
import { Session } from './types';

interface HistoryViewProps {
    sessions: Session[];
    itemVariants: any;
}

export const HistoryView = ({ sessions, itemVariants }: HistoryViewProps) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="space-y-8 animate-fadeIn"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black">Study History</h2>
                    <p className="text-dash-text-muted font-medium">Browse and review all your past learning materials.</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="search-container flex-grow md:w-80 border-2 border-black rounded-xl flex items-center bg-white px-3">
                        <Search size={18} className="text-zinc-400" />
                        <input type="text" placeholder="Search topics, dates..." className="search-input px-2 py-2 outline-none border-none w-full" />
                    </div>
                    <button className="action-btn outline p-2 px-3 flex items-center gap-2">
                        <Filter size={18} />
                        <span className="hidden sm:inline">Filter</span>
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {sessions.map((session) => (
                    <motion.div
                        key={session.id}
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                        className="bg-white border-2 border-black rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="flex items-center gap-6 flex-grow">
                            <div className={`w-14 h-14 rounded-2xl bg-${session.color} border-2 border-black flex items-center justify-center text-white shadow-[3px_3px_0px_0px_#000]`}>
                                <BookOpen size={24} />
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-black uppercase tracking-widest text-dash-primary">{session.category}</span>
                                    <span className="text-zinc-300">•</span>
                                    <span className="text-xs font-bold text-dash-text-muted flex items-center gap-1">
                                        <Clock size={12} /> {session.date}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold">{session.title}</h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-sm font-medium text-dash-text-muted flex items-center gap-1">
                                        <FileText size={14} /> {session.items} quiz questions
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <div className="w-24 h-2 bg-zinc-100 rounded-full overflow-hidden border border-black/5">
                                            <div className="h-full bg-dash-primary" style={{ width: `${session.mastery}%` }} />
                                        </div>
                                        <span className="text-xs font-black">{session.mastery}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button className="action-btn outline flex-grow md:flex-grow-0 py-2">Review Notes</button>
                            <button className="action-btn primary flex-grow md:flex-grow-0 py-2">Retake Quiz</button>
                            <motion.button whileHover={{ x: 3 }} className="p-2 text-dash-text-muted">
                                <ChevronRight size={24} />
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center pt-8">
                <div className="flex gap-2">
                    {[1, 2, 3].map(n => (
                        <button key={n} className={`w-10 h-10 rounded-xl border-2 border-black font-bold transition-all ${n === 1 ? 'bg-dash-primary text-white shadow-[3px_3px_0px_0px_#000]' : 'bg-white hover:bg-zinc-50'}`}>
                            {n}
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
