import { Section } from './Section';
import { Sparkles, Target, Brain, Zap, History } from 'lucide-react';

const features = [
    {
        icon: Sparkles,
        title: "AI Summaries",
        description: "Clear and simple explanations designed for exam preparation. StudyLite handles the heavy lifting so you can focus on mastering the concepts.",
        color: "bg-brandPurple",
        textColor: "text-white"
    },
    {
        icon: Target,
        title: "Key Insights",
        description: "Important concepts highlighted instantly. We strip away the fluff and give you exactly what you need to pass your tests.",
        color: "bg-brandGreen",
        textColor: "text-brandBlack"
    },
    {
        icon: Brain,
        title: "Smart Quizzes",
        description: "Mini quizzes to test your understanding. Immediate feedback loops help you identify gaps in your knowledge and improve memory.",
        color: "bg-brandYellow",
        textColor: "text-brandBlack"
    },
    {
        icon: Zap,
        title: "Low Data Mode",
        description: "Optimized for students on the move. Even with slow internet, your summaries load instantly so you never miss a study session.",
        color: "bg-brandPink",
        textColor: "text-white"
    },
    {
        icon: History,
        title: "Knowledge Vault",
        description: "Save your summaries and review anytime. Build your permanent, searchable knowledge base that stays with you through your entire degree.",
        color: "bg-white",
        textColor: "text-brandBlack"
    }
];

export const FeaturesSection = () => {

    return (
        <Section id="features" className="bg-brandBlack py-32 md:py-10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-8 md:px-12">
                <div className="text-center mb-32">
                    <div className="inline-block px-4 py-1.5 rounded-full border-2 border-brandPurple bg-brandPurple/10 mb-6 backdrop-blur-sm">
                        <span className="text-xs font-black uppercase tracking-widest text-brandPurple">The Toolkit</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase mb-8 tracking-tighter italic leading-[0.85] text-white">
                        The Ultimate <br />
                        <span className="text-brandPurple underline decoration-brandYellow underline-offset-8">Study Stack</span>
                    </h2>
                    <p className="text-xl md:text-2xl font-bold leading-relaxed text-white/60 max-w-2xl mx-auto">
                        A power-packed suite of AI tools designed to turn hours of reading into minutes of high-impact learning.
                    </p>
                </div>

                {/* Uniform Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map((feature, i) => {
                        return (
                            <div
                                key={i}
                                className={`group relative p-10 rounded-[40px] border-4 border-brandBlack flex flex-col transition-all duration-500 hover:-translate-y-2 hover:translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ${feature.color} overflow-hidden min-h-[400px]`}
                            >
                                {/* Icon Background Decor */}
                                <div className="absolute -top-4 -right-4 p-8 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="mb-auto flex justify-between items-start">
                                        <div className="p-4 bg-white border-4 border-brandBlack rounded-[24px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-6 transition-transform">
                                            <feature.icon className="w-8 h-8 md:w-10 md:h-10 text-brandBlack" />
                                        </div>
                                        <div className="px-3 py-1 rounded-full border-2 border-brandBlack bg-white transform rotate-3">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-brandBlack">Tool 0{i + 1}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <h3 className={`text-3xl lg:text-5xl font-black uppercase mb-3 tracking-tighter italic ${feature.textColor} leading-none transition-all`}>
                                            {feature.title}
                                        </h3>
                                        <p className={`text-base lg:text-lg font-bold leading-snug ${feature.textColor} opacity-80 max-w-md`}>
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </Section>
    );
};
