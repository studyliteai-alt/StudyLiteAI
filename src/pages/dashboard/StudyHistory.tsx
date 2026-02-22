import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { getUserSessions, StudySession } from '../../services/studyService';
import { Loader2 } from 'lucide-react';

export const StudyHistory = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<StudySession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getUserSessions(user.uid).then(data => {
                setSessions(data);
                setLoading(false);
            });
        }
    }, [user]);

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-1">Study History</h1>
                <p className="text-brandBlack/40 font-medium mb-12 italic">Review your past study sessions.</p>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-brandPurple" size={48} />
                        <p className="text-lg font-bold text-brandBlack/40 uppercase tracking-widest">Recalling your knowledge...</p>
                    </div>
                ) : sessions.length > 0 ? (
                    <div className="grid gap-6">
                        {sessions.map((item, i) => (
                            <div key={item.id} className="bg-white border-2 border-brandBlack/5 p-8 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-xl hover:border-brandPurple/20 transition-all group">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-brandPurple/5 rounded-2xl flex items-center justify-center text-brandPurple font-bold">
                                        #{i + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-2xl group-hover:text-brandPurple transition-colors">{item.topic}</h3>
                                        <p className="text-sm font-bold text-brandBlack/40">{new Date(item.createdAt).toLocaleDateString()} • Status: <span className="text-brandPurple">{item.status}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${item.status === 'Mastered' ? 'bg-green-100 text-green-600' : 'bg-brandYellow/10 text-[#854D0E]'}`}>
                                        {item.status}
                                    </span>
                                    <Link to={`/session/${item.id}`} className="flex-1 md:flex-none text-center bg-brandBlack text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-brandPurple transition-all">
                                        View Session
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border-2 border-brandBlack/5 p-20 rounded-[40px] text-center">
                        <h3 className="text-2xl font-bold mb-4">No history yet.</h3>
                        <p className="text-brandBlack/40 font-medium mb-8">Start your first AI study session to build your personal knowledge vault.</p>
                        <Link to="/study">
                            <button className="bg-brandPurple text-white px-8 py-4 rounded-xl font-bold hover:bg-brandBlack transition-all shadow-lg shadow-brandPurple/20">
                                Start Session
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};
