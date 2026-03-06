import { Plus, MessageSquare, History, TrendingUp, Gamepad2, BookOpen, Clock, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { studyService, Project } from '../../services/studyService';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { quizService, studySessionService } from '../../services/quizService';

export const WorkspaceView = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [realtimeProjects, setRealtimeProjects] = useState<Project[]>([]);
    const [liveStats, setLiveStats] = useState({
        studyTime: '0h',
        quizzes: '0',
        avgScore: '0%',
        documents: '0'
    });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // 1. Projects
                const projects = await studyService.getProjects();
                setRealtimeProjects(projects);

                // 2. Quiz Stats
                const qStats = await quizService.getStats();

                // 3. Study Time
                const totalSeconds = await studySessionService.getTotalStudyTime();
                const hours = (totalSeconds / 3600).toFixed(1);

                setLiveStats({
                    studyTime: `${hours}h`,
                    quizzes: qStats.totalQuizzes.toString(),
                    avgScore: `${qStats.avgScore}%`,
                    documents: projects.length.toString()
                });
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            }
        };

        fetchAllData();

        const subscription = studyService.subscribeToProjects((payload) => {
            if (payload.eventType === 'INSERT') {
                setRealtimeProjects(prev => [payload.new as Project, ...prev]);
            } else if (payload.eventType === 'DELETE') {
                setRealtimeProjects(prev => prev.filter(p => p.id !== payload.old.id));
            } else if (payload.eventType === 'UPDATE') {
                setRealtimeProjects(prev => prev.map(p => p.id === payload.new.id ? payload.new as Project : p));
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const stats = [
        { label: 'Study Time', value: liveStats.studyTime, sub: 'Total logging', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Quizzes', value: liveStats.quizzes, sub: `avg ${liveStats.avgScore} score`, icon: Gamepad2, color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'Documents', value: liveStats.documents, sub: 'In vault', icon: FileText, color: 'text-brandYellow', bg: 'bg-yellow-50' },
    ];

    const hubItems = [
        { name: 'AI Chat', desc: 'Tutor & Summary', icon: MessageSquare, path: '/dashboard/chat', color: 'bg-indigo-600', text: 'text-white' },
        { name: 'History', desc: 'Past Documents', icon: History, path: '/dashboard/history', color: 'bg-white', text: 'text-black' },
        { name: 'Performance', desc: 'Score & Analytics', icon: TrendingUp, path: '/dashboard/performance', color: 'bg-white', text: 'text-black' },
        { name: 'Quiz Mode', desc: 'Timed Challenges', icon: Gamepad2, path: '/dashboard/quiz', color: 'bg-brandPurple', text: 'text-white' },
    ];

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top Row: Welcome & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#1A1A1A] rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-black/10">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter italic">Welcome Back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Scholar'}!</h1>
                            <p className="text-white/50 text-xs font-bold uppercase tracking-[0.2em] mt-2 mb-8">You have 5 documents ready for review.</p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => showToast('New Scan', 'Opening camera...', 'info')}
                                className="bg-brandPurple text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-indigo-500/20"
                            >
                                <Plus size={16} /> New Study Doc
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                                View Vault
                            </button>
                        </div>
                    </div>
                    {/* Decorative Blob */}
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-brandPurple/20 rounded-full blur-[80px] group-hover:bg-brandPurple/30 transition-colors"></div>
                </div>

                <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
                    {stats.map((s, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-all cursor-default group">
                            <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <s.icon size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">{s.label}</h4>
                                    <span className="text-[9px] font-bold text-gray-300">{s.sub}</span>
                                </div>
                                <p className="text-lg font-black italic text-[#1A1A1A]">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4-Quadrant Hub Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {hubItems.map((item, i) => (
                    <Link
                        key={i}
                        to={item.path}
                        className={`group ${item.color} ${item.text} p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center justify-center aspect-square md:aspect-auto md:h-48`}
                    >
                        <div className={`w-14 h-14 rounded-2xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform ${item.color === 'bg-white' ? 'bg-gray-50' : 'bg-white/10'}`}>
                            <item.icon size={28} />
                        </div>
                        <h3 className="text-xl font-black italic tracking-tight">{item.name}</h3>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${item.text === 'text-white' ? 'opacity-60' : 'text-gray-400'}`}>{item.desc}</p>
                    </Link>
                ))}
            </div>

            {/* Recent Documents Table/List */}
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black italic tracking-tight">Recent from Vault</h2>
                    <button className="text-[10px] font-black uppercase tracking-widest text-brandPurple hover:underline">See All</button>
                </div>

                <div className="space-y-4">
                    {realtimeProjects.length > 0 ? (
                        realtimeProjects.slice(0, 3).map((p) => (
                            <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center border border-gray-200">
                                        <BookOpen className="w-6 h-6 text-brandPurple" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm italic group-hover:text-brandPurple transition-colors">{p.name}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{p.file_type || 'PDF Document'} • {new Date(p.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="hidden sm:flex flex-col items-end px-4">
                                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="w-full h-full bg-brandYellow"></div>
                                        </div>
                                        <span className="text-[9px] font-black text-gray-400 mt-1 uppercase tracking-widest">Mastery 100%</span>
                                    </div>
                                    <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-all">
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-xs font-black text-gray-300 uppercase tracking-widest italic">No documents in vault yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
