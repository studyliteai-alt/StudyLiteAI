import { Upload, Cpu, GraduationCap } from 'lucide-react';
import { Section } from './Section';

export const HowItWorks = () => {
    const steps = [
        {
            icon: Upload,
            title: "Paste Your Notes",
            description: "Copy your class notes or textbook content into the study workspace.",
            color: "brandYellow"
        },
        {
            icon: Cpu,
            title: "AI Simplifies Everything",
            description: "StudyLite AI creates: Easy summaries, Key points, and Exam-focused quizzes.",
            color: "brandPurple"
        },
        {
            icon: GraduationCap,
            title: "Study Faster",
            description: "Review your summaries and test yourself with quizzes to improve memory.",
            color: "brandGreen"
        }
    ];

    return (
        <Section id="how-it-works" className="py-32 bg-brandBlack text-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 italic">How It Works</h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg">
                        Turn your chaotic notes into a structured, permanent knowledge base in three simple steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {steps.map((step, i) => (
                        <div key={i} className="relative p-8 rounded-3xl border border-white/10 hover:border-brandPurple/50 transition-all group">
                            <div className="absolute -top-6 -left-6 w-12 h-12 bg-white text-brandBlack rounded-full flex items-center justify-center font-bold text-xl border-4 border-brandBlack">
                                {i + 1}
                            </div>
                            <div className={`w-16 h-16 rounded-2xl bg-${step.color} flex items-center justify-center mb-8 border-2 border-white`}>
                                <step.icon className="w-8 h-8 text-brandBlack" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                            <p className="text-white/60 leading-relaxed font-medium">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};
