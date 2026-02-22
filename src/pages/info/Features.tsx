import { Section } from '../../components/Section';
import { Cpu, GraduationCap, Users, Globe } from 'lucide-react';

export const Features = () => {
    const features = [
        { title: 'AI Summaries', desc: 'Simplified explanations for faster learning.', icon: Cpu, color: 'bg-brandPurple' },
        { title: 'Key Points', desc: 'Important concepts extracted instantly.', icon: GraduationCap, color: 'bg-brandYellow' },
        { title: 'Smart Quizzes', desc: 'Test your knowledge quickly.', icon: Users, color: 'bg-brandGreen' },
        { title: 'Low Data Mode', desc: 'Designed for slow internet connections.', icon: Globe, color: 'bg-brandPurple' },
        { title: 'Study History', desc: 'Review past sessions anytime.', icon: Cpu, color: 'bg-brandPink' },
    ];

    return (
        <div className="min-h-screen bg-cream">
            <Section className="max-w-7xl mx-auto py-32 px-6">
                <div className="max-w-3xl mb-24">
                    <span className="text-brandPurple font-bold uppercase tracking-widest text-xs">Capabilities</span>
                    <h1 className="text-5xl md:text-7xl font-bold mt-6 mb-8 leading-tight">Master anything with AI superpowers.</h1>
                    <p className="text-xl text-brandBlack/60 font-medium leading-relaxed">
                        We've built the most advanced study stack for students who want to save thousands of hours and achieve better results.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                    {features.map((f, i) => (
                        <div key={i} className="group bg-white border-2 border-brandBlack/5 p-12 rounded-[48px] shadow-sm hover:border-brandPurple/20 transition-all hover:shadow-xl">
                            <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-black/5`}>
                                <f.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold mb-6">{f.title}</h3>
                            <p className="text-lg text-brandBlack/60 font-medium leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-brandBlack text-white rounded-[56px] p-12 md:p-24 overflow-hidden relative">
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to start your first session?</h2>
                        <p className="text-xl text-white/60 font-medium mb-12">Join thousands of students across the globe who are studying smarter, not harder.</p>
                        <button className="bg-brandPurple text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-brandPurple transition-all">
                            Get Started Free
                        </button>
                    </div>
                </div>
            </Section>
        </div>
    );
};
