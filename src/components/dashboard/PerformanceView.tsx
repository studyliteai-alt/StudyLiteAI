import { motion } from 'framer-motion';
import { TrendingUp, Award, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Stat } from './types';

interface PerformanceViewProps {
    stats: Stat[];
    itemVariants: any;
}

export const PerformanceView = ({ stats, itemVariants }: PerformanceViewProps) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="space-y-12 animate-fadeIn"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black">Performance Analytics</h2>
                    <p className="text-dash-text-muted font-medium">Data-driven insights into your study habits and exam readiness.</p>
                </div>
                <div className="bg-white border-2 border-black rounded-xl p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_#000]">
                    <div className="w-10 h-10 bg-green-100 border-2 border-green-500 rounded-lg flex items-center justify-center text-green-600">
                        <Award size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-zinc-400 border-none">Exam Readiness</p>
                        <p className="text-lg font-black leading-none">82%</p>
                    </div>
                </div>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} variants={itemVariants} className="bg-white border-2 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_#000]">
                        <p className="text-xs font-black uppercase tracking-wider text-dash-text-muted mb-2">{stat.label}</p>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-4xl font-black text-${stat.color}`}>{stat.value}</span>
                            <span className="text-xs font-bold text-green-500 flex items-center gap-0.5">
                                <TrendingUp size={12} /> +5%
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Mastery Chart Placeholder */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white border-2 border-black rounded-[32px] p-8 shadow-[12px_12px_0px_0px_#000]">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <TrendingUp className="text-dash-primary" />
                            Mastery Over Time
                        </h3>
                        <div className="flex gap-2">
                            {['Week', 'Month', 'Year'].map(t => (
                                <button key={t} className={`px-4 py-1 text-xs font-bold rounded-full border-2 border-black ${t === 'Month' ? 'bg-black text-white' : 'hover:bg-zinc-50'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4 pt-4 px-4">
                        {[45, 60, 55, 75, 70, 85, 82].map((val, i) => (
                            <div key={i} className="flex-grow flex flex-col items-center gap-3">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${val}%` }}
                                    className={`w-full max-w-[40px] rounded-t-xl border-t-2 border-x-2 border-black ${i === 6 ? 'bg-dash-primary' : 'bg-zinc-100'}`}
                                />
                                <span className="text-[10px] font-black text-zinc-400">Day {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Gap Analysis */}
                <motion.div variants={itemVariants} className="bg-zinc-900 text-white border-2 border-black rounded-[32px] p-8 shadow-[12px_12px_0px_0px_rgba(168,85,247,0.5)]">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <AlertCircle className="text-dash-secondary" />
                        Knowledge Gaps
                    </h3>
                    <p className="text-zinc-400 text-sm font-medium mb-8">
                        Our AI detected these topics need more focus based on your recent quiz scores.
                    </p>

                    <div className="space-y-4">
                        {[
                            { topic: "Organic Reactions", gap: "Critical", color: "#FB7185" },
                            { topic: "Thermodynamics Laws", gap: "Review", color: "#FACC15" },
                            { topic: "Calculus Limits", gap: "Slight", color: "#60A5FA" }
                        ].map((item, i) => (
                            <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                                <div>
                                    <p className="font-bold">{item.topic}</p>
                                    <p className="text-[10px] uppercase font-black" style={{ color: item.color }}>{item.gap} Gap</p>
                                </div>
                                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
                                    <CheckCircle2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button className="action-btn primary w-full mt-8 py-3">Boost These Topics</button>
                </motion.div>
            </div>
        </motion.div>
    );
};
