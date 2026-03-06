import { useEffect, useState } from 'react';
import {
    Trophy,
    Zap,
    Target,
    TrendingUp,
    BrainCircuit,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { quizService, studySessionService } from '../../services/quizService';
import { studyService } from '../../services/studyService';

export const PerformanceView = () => {
    const [stats, setStats] = useState({
        studyHours: '0h',
        quizzesTaken: '0',
        avgScore: '0%',
        efficiency: '0%',
        documents: 0
    });

    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const qStats = await quizService.getStats();
                const totalSeconds = await studySessionService.getTotalStudyTime();
                const projects = await studyService.getProjects();
                const quizHistory = await quizService.getQuizHistory();

                setStats({
                    studyHours: `${(totalSeconds / 3600).toFixed(1)}h`,
                    quizzesTaken: qStats.totalQuizzes.toString(),
                    avgScore: `${qStats.avgScore}%`,
                    efficiency: qStats.totalQuizzes > 0 ? 'Optimal' : '-',
                    documents: projects.length
                });

                setHistory(quizHistory.slice(0, 5));
            } catch (err) {
                console.error('Error fetching performance stats:', err);
            }
        };
        fetchStats();
    }, []);

    const mainStats = [
        { label: 'Avg Retention', val: stats.avgScore, icon: BrainCircuit, color: 'bg-indigo-50', text: 'text-indigo-600' },
        { label: 'Study Hours', val: stats.studyHours, icon: Clock, color: 'bg-amber-50', text: 'text-amber-600' },
        { label: 'Quizzes Taken', val: stats.quizzesTaken, icon: Target, color: 'bg-rose-50', text: 'text-rose-600' },
        { label: 'Vault Items', val: stats.documents, icon: TrendingUp, color: 'bg-emerald-50', text: 'text-emerald-600' }
    ];

    return (
        <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter text-[#1A1A1A]">Performance</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time statistics & cognitive insights</p>
                </div>
                <div className="bg-white p-2 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-1">
                    <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-[20px]">
                        <Trophy className="w-5 h-5 text-brandYellow" />
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Status</p>
                            <p className="text-sm font-black text-[#1A1A1A] uppercase">Active Scholar</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3">
                        <Zap className="w-5 h-5 text-brandPurple" />
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Mastery</p>
                            <p className="text-sm font-black text-[#1A1A1A] uppercase">{stats.avgScore}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainStats.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm group hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
                        <div className={`w-14 h-14 ${stat.color} ${stat.text} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <stat.icon size={28} />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                        <p className="text-3xl font-black text-[#1A1A1A] italic tracking-tight">{stat.val}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Recent Mastery Breakdown */}
                <div className="lg:col-span-3 bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black italic text-[#1A1A1A] flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-brandPurple" />
                            Retention Velocity
                        </h3>
                        <span className="text-[9px] font-black uppercase tracking-widest text-brandPurple">Last 5 Quizzes</span>
                    </div>

                    <div className="space-y-8">
                        {history.length > 0 ? (
                            history.map((quiz, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-sm text-[#1A1A1A] italic">{quiz.topic}</p>
                                        <p className="font-black text-xs text-brandPurple tracking-tight">{Math.round((quiz.score / quiz.total_questions) * 100)}%</p>
                                    </div>
                                    <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-brandPurple rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${(quiz.score / quiz.total_questions) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-300 italic text-sm">
                                Complete your first quiz to see performance analytics.
                            </div>
                        )}
                    </div>
                </div>

                {/* Achievement Tracker */}
                <div className="lg:col-span-2 bg-[#1A1A1A] rounded-[40px] p-10 shadow-2xl shadow-black/20 text-white relative overflow-hidden group">
                    <h3 className="text-xl font-black italic mb-10 text-white flex items-center gap-3 relative z-10">
                        <Target className="w-6 h-6 text-brandYellow" />
                        Milestones
                    </h3>

                    <div className="space-y-4 relative z-10">
                        {[
                            { title: 'Upload Doc', progress: stats.documents > 0 ? '100%' : '0%', done: stats.documents > 0 },
                            { title: 'First Quiz', progress: history.length > 0 ? '100%' : '0%', done: history.length > 0 },
                            { title: 'Study 1 Hour', progress: parseFloat(stats.studyHours) >= 1 ? '100%' : `${(parseFloat(stats.studyHours) * 100).toFixed(0)}%`, done: parseFloat(stats.studyHours) >= 1 },
                            { title: 'Take 10 Quizzes', progress: `${Math.min(100, (parseInt(stats.quizzesTaken) / 10) * 100).toFixed(0)}%`, done: parseInt(stats.quizzesTaken) >= 10 }
                        ].map((m, i) => (
                            <div key={i} className={`p-5 rounded-[24px] border transition-all duration-300 ${m.done ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-40'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.done ? 'bg-brandYellow text-black' : 'bg-white/5 text-white/20'}`}>
                                            {m.done ? <CheckCircle2 size={24} /> : <div className="w-5 h-5 rounded-full border-2 border-white/20" />}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-tight italic">{m.title}</h4>
                                            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5">{m.progress} PROGRESS</p>
                                        </div>
                                    </div>
                                    {!m.done && <div className="w-1.5 h-1.5 bg-brandYellow rounded-full animate-pulse"></div>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Decorative blobs */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brandPurple/20 rounded-full blur-3xl group-hover:bg-brandPurple/30 transition-colors"></div>
                </div>
            </div>
        </div>
    );
};
