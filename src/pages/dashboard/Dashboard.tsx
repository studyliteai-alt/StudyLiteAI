import { Zap, BookOpen, Trophy, PlusCircle, Loader2, Target, Info, Sparkles } from 'lucide-react';
import { MagneticButton } from '../../components/MagneticButton';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { getRecentSessions, StudySession } from '../../services/studyService';

export const Dashboard = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<StudySession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getRecentSessions(user.uid).then(data => {
                setSessions(data);
                setLoading(false);
            });
        }
    }, [user]);

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto">
                <div className="bg-brandPurple/5 border-2 border-brandPurple/10 rounded-[40px] p-6 md:p-10 mb-12 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-brandYellow text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Exam Ready</span>
                                <h1 className="text-4xl font-bold">Welcome back, {user?.displayName?.split(' ')[0] || 'Scholar'} 👋</h1>
                            </div>
                            <p className="text-brandBlack/40 font-medium max-w-lg">Your knowledge mastery is at <span className="text-brandPurple font-bold">72%</span>. Let's close those gaps today.</p>
                        </div>
                        <Link to="/study" className="w-full md:w-auto">
                            <MagneticButton className="w-full md:w-auto bg-brandBlack text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brandPurple transition-all shadow-xl shadow-brandPurple/10 group">
                                <PlusCircle size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                                Start New Session
                            </MagneticButton>
                        </Link>
                    </div>
                    <Sparkles className="absolute right-10 top-1/2 -translate-y-1/2 text-brandPurple/10 w-32 h-32" />
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Study Sessions', value: sessions.length || '0', icon: BookOpen, sub: 'Total sessions completed', color: 'text-brandPurple', bg: 'bg-brandPurple/10' },
                        { label: 'Avg Accuracy', value: '84%', icon: Trophy, sub: 'Your average quiz score', color: 'text-brandGreen', bg: 'bg-brandGreen/10' },
                        { label: 'Daily Streak', value: '5 Days', icon: Zap, sub: 'Login streak maintained', color: 'text-brandYellow', bg: 'bg-brandYellow/10' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border-2 border-brandBlack shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:shadow-[10px_10px_0px_0px_rgba(26,26,26,1)] hover:-translate-y-1 transition-all">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 border-2 border-brandBlack/5`}>
                                <stat.icon size={24} />
                            </div>
                            <p className="text-xs font-bold text-brandBlack/40 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-black mb-1 leading-none">{stat.value}</p>
                            <p className="text-[10px] font-bold text-brandBlack/30 italic uppercase tracking-tighter">{stat.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[40px] border-2 border-brandBlack/5 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-2xl font-bold">Recent Learning Artifacts</h3>
                                    <p className="text-sm font-medium text-brandBlack/30 italic">Synced with your knowledge base.</p>
                                </div>
                                <Link to="/history" className="bg-slate-50 border-2 border-brandBlack px-5 py-2 rounded-xl text-xs font-bold hover:bg-brandPurple hover:text-white transition-all">
                                    Full History
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <div className="relative">
                                            <Loader2 className="animate-spin text-brandPurple" size={48} />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-brandPurple rounded-full animate-ping"></div>
                                            </div>
                                        </div>
                                        <p className="text-sm font-black text-brandBlack/40 uppercase tracking-widest italic">Decrypting your brain...</p>
                                    </div>
                                ) : sessions.length > 0 ? (
                                    sessions.map((item, i) => (
                                        <Link to={`/session/${item.id}`} key={i} className="flex items-center justify-between p-6 bg-[#F8F9FA] rounded-[24px] border-2 border-brandBlack/5 hover:border-brandPurple hover:bg-white hover:shadow-xl transition-all group">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-white border-2 border-brandBlack/10 rounded-2xl flex items-center justify-center group-hover:border-brandPurple group-hover:scale-110 transition-all">
                                                    <BookOpen size={24} className="text-brandPurple" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg leading-tight mb-1">{item.topic}</h4>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-black text-brandBlack/40 uppercase tracking-widest">{new Date(item.createdAt).toLocaleDateString()}</span>
                                                        <span className="w-1 h-1 bg-brandBlack/20 rounded-full"></span>
                                                        <span className="text-[10px] font-black text-brandPurple uppercase tracking-widest leading-none bg-brandPurple/5 px-2 py-0.5 rounded-md italic">AI Summarized</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${item.status === 'Mastered' ? 'bg-brandGreen text-white' : 'bg-brandYellow/10 text-brandYellow border border-brandYellow/20'}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-brandBlack/10">
                                        <Info className="mx-auto mb-4 text-brandBlack/20" size={40} />
                                        <p className="text-brandBlack/40 font-bold mb-6">Your brain is currently an empty canvas.</p>
                                        <Link to="/study" className="text-brandPurple font-black hover:underline uppercase tracking-widest text-sm italic">
                                            Initialize first session →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Panels */}
                    <div className="space-y-8">
                        {/* Daily Goal Tracker */}
                        <div className="bg-brandBlack text-white rounded-[40px] p-8 shadow-xl border-2 border-brandPurple group overflow-hidden relative">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Target size={22} className="text-brandYellow" /> Daily Goal
                            </h3>
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Progress: 1/2 sessions</p>
                                    <p className="text-sm font-bold text-brandYellow">50%</p>
                                </div>
                                <div className="h-4 w-full bg-white/10 rounded-full border border-white/20 overflow-hidden relative">
                                    <div className="h-full bg-brandPurple transition-all duration-1000 shadow-[0_0_20px_rgba(168,85,247,0.5)]" style={{ width: '50%' }}></div>
                                </div>
                            </div>
                            <p className="text-xs font-medium text-white/40 italic leading-relaxed">Summarize one more chapter to maintain your learning velocity.</p>
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brandYellow/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                        </div>

                        {/* Knowledge Snapshot Panel */}
                        <div className="bg-white rounded-[40px] border-2 border-brandBlack p-8 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]">
                            <h3 className="text-xl font-bold mb-8">Performance</h3>
                            <div className="space-y-6">
                                {[
                                    { label: "Quizzes", val: 42, color: "bg-brandPurple", icon: Trophy },
                                    { label: "Accuracy", val: 86, color: "bg-brandGreen", icon: Target },
                                    { label: "Topics", val: 12, color: "bg-brandYellow", icon: BookOpen }
                                ].map((stat, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className={`w-10 h-10 ${stat.color}/10 ${stat.color.replace('bg-', 'text-')} rounded-xl flex items-center justify-center border border-current/10 shrink-0`}>
                                            <stat.icon size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-[10px] font-bold text-brandBlack/40 uppercase tracking-widest leading-none">{stat.label}</p>
                                                <p className="text-xs font-black">{stat.val}{stat.label === 'Accuracy' ? '%' : ''}</p>
                                            </div>
                                            <div className="h-1.5 w-full bg-[#F1F3F5] rounded-full overflow-hidden">
                                                <div className={`h-full ${stat.color}`} style={{ width: `${stat.label === 'Accuracy' ? stat.val : (stat.val / 50) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link to="/analytics" className="w-full mt-8 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white border-2 border-brandBlack text-xs font-black uppercase tracking-widest hover:bg-brandPurple hover:text-white hover:border-brandPurple transition-all">
                                Open Analytics Center
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};
