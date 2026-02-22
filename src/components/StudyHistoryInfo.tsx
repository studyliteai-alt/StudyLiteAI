import { History, Brain, Archive } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Section } from './Section';

export const StudyHistoryInfo = () => {
    return (
        <Section className="py-32 bg-cream text-brandBlack overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="flex items-center gap-3 text-brandPurple font-bold uppercase tracking-widest text-sm mb-6">
                            <History size={20} />
                            Study History
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                            Your <span className="text-brandPurple">Permanent</span> Knowledge Base.
                        </h2>
                        <p className="text-xl text-brandBlack/60 mb-12 leading-relaxed">
                            What is Study History? It's more than just a list of files. It's your personal vault of generated intelligence.
                            Every summary, every quiz, and every key concept is archived, indexed, and ready for your next exam.
                        </p>

                        <div className="space-y-8">
                            {[
                                {
                                    title: "Never lose a thought",
                                    desc: "Every note you processed months ago is just a click away.",
                                    icon: Archive
                                },
                                {
                                    title: "Spaced Repetition Ready",
                                    desc: "Revisit old quizzes to reinforce your memory over time.",
                                    icon: Brain
                                }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 items-start">
                                    <div className="w-12 h-12 bg-white border-2 border-brandBlack rounded-xl flex items-center justify-center flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                                        <p className="text-brandBlack/60 font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-white border-2 border-brandBlack p-8 rounded-[40px] shadow-[16px_16px_0px_0px_rgba(26,26,26,1)] relative z-10">
                            <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-brandBlack/5">
                                <h3 className="text-xl font-bold">Recent Study Artifacts</h3>
                                <span className="px-3 py-1 bg-brandYellow border-2 border-brandBlack rounded-full text-xs font-bold uppercase">Live Flow</span>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { name: "Advanced Thermodynamics", date: "2 mins ago", score: "88%" },
                                    { name: "Organic Chemistry 101", date: "1 hour ago", score: "94%" },
                                    { name: "Economic History", date: "Yesterday", score: "72%" }
                                ].map((item, i) => (
                                    <Link to="/history" key={i} className="flex items-center justify-between p-4 bg-cream/50 rounded-2xl border-2 border-brandBlack/5 hover:border-brandPurple/20 transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-brandPurple/10 rounded-full flex items-center justify-center">
                                                <History size={18} className="text-brandPurple" />
                                            </div>
                                            <div>
                                                <p className="font-bold">{item.name}</p>
                                                <p className="text-xs text-brandBlack/40">{item.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-brandBlack/40">SC</p>
                                            <p className="font-bold text-brandPurple">{item.score}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brandYellow/20 rounded-full blur-3xl -z-0"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brandPurple/20 rounded-full blur-3xl -z-0"></div>
                    </div>
                </div>
            </div>
        </Section>
    );
};
