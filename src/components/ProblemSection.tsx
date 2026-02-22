import { Section } from './Section';
import { AlertCircle, BrainCircuit, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProblemSection = () => {
    const problems = [
        {
            icon: AlertCircle,
            title: "Information Overload",
            desc: "300-page textbooks and endless lectures makes it impossible to find what's actually important.",
            color: "bg-red-500/10 text-red-600 border-red-200"
        },
        {
            icon: BrainCircuit,
            title: "Rapid Forgetting",
            desc: "The 'Forgetting Curve' is real. Students forget 70% of new information within 24 hours.",
            color: "bg-brandPurple/10 text-brandPurple border-brandPurple/20"
        },
        {
            icon: Clock,
            title: "Revision Stress",
            desc: "Panic-cramming before exams leads to burnout and poor grades. You need a better workflow.",
            color: "bg-brandYellow/10 text-brandYellow border-brandYellow/20"
        }
    ];

    return (
        <Section className="bg-white py-32 border-y-2 border-brandBlack/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-brandPurple font-bold uppercase tracking-widest text-xs"
                    >
                        The Problem
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold mt-4 leading-tight italic"
                    >
                        Traditional studying is <span className="text-red-500">broken.</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {problems.map((problem, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className={`p-10 rounded-[32px] border-4 border-brandBlack bg-white shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all`}
                        >
                            <div className={`w-16 h-16 ${problem.color} border-2 border-brandBlack rounded-2xl flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)]`}>
                                <problem.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-black uppercase mb-4">{problem.title}</h3>
                            <p className="text-brandBlack/60 font-medium leading-relaxed">
                                {problem.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
};
