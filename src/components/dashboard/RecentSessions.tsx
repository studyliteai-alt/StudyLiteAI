import { motion } from 'framer-motion';
import { Zap, Search, BookOpen, Clock, FileText } from 'lucide-react';
import { Session } from './types';

interface RecentSessionsProps {
    sessions: Session[];
    onStartSession: () => void;
    itemVariants: any;
}

export const RecentSessions = ({ sessions, onStartSession, itemVariants }: RecentSessionsProps) => {
    return (
        <section>
            <div className="flex justify-between items-center mb-8">
                <h2 className="section-title">
                    <Zap className="text-dash-primary" />
                    Recent Study Sessions
                </h2>
                <div className="flex gap-4">
                    <div className="search-container !w-64 border-2 border-black rounded-xl flex items-center bg-white px-3">
                        <Search size={18} className="text-zinc-400" />
                        <input type="text" placeholder="Search sessions..." className="search-input px-2 py-2 outline-none border-none w-full" />
                    </div>
                </div>
            </div>

            <div className="sessions-grid">
                {sessions.map((session) => (
                    <motion.div
                        key={session.id}
                        variants={itemVariants}
                        className="session-card"
                        whileHover={{ y: -5 }}
                    >
                        <div className="flex justify-between items-start">
                            <span className={`session-badge bg-${session.color}`}>{session.category}</span>
                            <motion.button whileHover={{ scale: 1.2 }}>
                                <BookOpen size={20} />
                            </motion.button>
                        </div>

                        <h3 className="session-title">{session.title}</h3>

                        <div className="session-meta">
                            <div className="session-meta-item">
                                <Clock size={16} />
                                <span>{session.date}</span>
                            </div>
                            <div className="session-meta-item">
                                <FileText size={16} />
                                <span>{session.items} items</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase">
                                <span>Mastery</span>
                                <span>{session.mastery}%</span>
                            </div>
                            <div className="progress-container">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${session.mastery}%` }}
                                    className="progress-fill"
                                />
                            </div>
                        </div>

                        <div className="session-footer">
                            <button className="action-btn outline">Quizzes</button>
                            <button className="action-btn primary" onClick={onStartSession}>Continue</button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
