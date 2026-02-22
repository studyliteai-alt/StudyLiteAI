import { TrendingUp, Award, Clock, Target, CheckCircle2, AlertCircle, ChevronRight, BarChart3 } from 'lucide-react';
import { AppLayout } from '../../components/AppLayout';

const masteryLevels = [
    { subject: 'Computer Science', level: 85, color: 'bg-brandPurple' },
    { subject: 'Mathematics', level: 62, color: 'bg-brandGreen' },
    { subject: 'Economics', level: 45, color: 'bg-brandYellow' },
    { subject: 'Biology', level: 92, color: 'bg-blue-500' },
];

const performanceMetrics = [
    { label: 'Avg Accuracy', value: '88%', sub: '+4% vs last week', icon: Target, trend: 'up' },
    { label: 'Time Saved', value: '14h', sub: 'Summarization speed', icon: Clock, trend: 'up' },
    { label: 'Quiz Streak', value: '7', sub: 'Consistent learning', icon: Award, trend: 'up' },
];

export const Analytics = () => {
    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto pb-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">Learning Analytics</h1>
                    <p className="text-brandBlack/40 font-medium">Deep insights into your academic progress and AI mastery.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {performanceMetrics.map((metric, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border-2 border-brandBlack shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-brandBlack/5">
                                    <metric.icon size={20} className="text-brandBlack" />
                                </div>
                                <p className="text-xs font-bold text-brandBlack/40 uppercase tracking-widest">{metric.label}</p>
                            </div>
                            <p className="text-3xl font-bold mb-1">{metric.value}</p>
                            <p className={`text-[10px] font-bold ${metric.trend === 'up' ? 'text-brandGreen' : 'text-red-500'}`}>
                                {metric.sub}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Mastery Breakdown */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[40px] border-2 border-brandBlack p-8 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <TrendingUp className="text-brandPurple" size={24} /> Subject Mastery
                                </h3>
                                <div className="flex gap-2">
                                    <button className="px-4 py-1.5 bg-slate-50 border-2 border-brandBlack rounded-lg text-xs font-bold">Week</button>
                                    <button className="px-4 py-1.5 border-2 border-brandBlack/5 rounded-lg text-xs font-bold text-brandBlack/40">Month</button>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {masteryLevels.map((item, i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <div className="flex justify-between items-end mb-3">
                                            <div>
                                                <p className="text-sm font-bold mb-0.5">{item.subject}</p>
                                                <p className="text-[10px] font-medium text-brandBlack/40 italic">Last synchronized: Yesterday</p>
                                            </div>
                                            <p className="text-sm font-black">{item.level}%</p>
                                        </div>
                                        <div className="h-4 w-full bg-[#F1F3F5] rounded-full border-2 border-brandBlack overflow-hidden relative">
                                            <div
                                                className={`h-full ${item.color} transition-all duration-1000 ease-out`}
                                                style={{ width: `${item.level}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/10 [background:linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress-stripe_2s_linear_infinite]"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Wins */}
                        <div className="bg-brandPurple text-white rounded-[40px] p-8 shadow-xl relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                                    <Award size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">New Milestone!</h3>
                                    <p className="text-white/60 text-sm font-medium">You've completed 10 high-accuracy quizzes this week. Your "Knowledge Retention" is at an all-time high.</p>
                                </div>
                                <button className="bg-white text-brandBlack px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brandYellow transition-all md:ml-auto">
                                    Claim Badge
                                </button>
                            </div>
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                        </div>
                    </div>

                    {/* Knowledge Insights */}
                    <div className="space-y-8">
                        <div className="bg-brandBlack text-white rounded-[40px] p-8 shadow-[8px_8px_0px_0px_rgba(168,85,247,0.2)]">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <BarChart3 className="text-brandYellow" size={24} /> AI Insights
                            </h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 bg-brandGreen/20 rounded-lg flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={16} className="text-brandGreen" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold mb-1">Concept Strength</p>
                                        <p className="text-[10px] text-white/40 leading-relaxed font-medium">Your understanding of "Operating Systems" is solid. Move to "Database Systems".</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 bg-brandYellow/20 rounded-lg flex items-center justify-center shrink-0">
                                        <AlertCircle size={16} className="text-brandYellow" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold mb-1">Focus Area</p>
                                        <p className="text-[10px] text-white/40 leading-relaxed font-medium">Quiz scores in "Microeconomics" suggest a review of "Elasticity" concepts.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/10 uppercase tracking-[0.2em] text-[10px] font-black text-brandPurple text-center">
                                Powered by Studylite AI
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] border-2 border-brandBlack p-8 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] group cursor-pointer hover:-translate-y-1 transition-all">
                            <h3 className="text-lg font-bold mb-4">Mastery Comparison</h3>
                            <p className="text-brandBlack/40 text-xs font-medium mb-6">How your progress compares to local exam benchmarks (JAMB/WAEC).</p>
                            <div className="flex items-center justify-between group-hover:text-brandPurple transition-colors">
                                <span className="text-xs font-bold">View Benchmark Reports</span>
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};
