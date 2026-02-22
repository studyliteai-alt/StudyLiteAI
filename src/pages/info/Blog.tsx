import { Section } from '../../components/Section';
import { Calendar, ArrowRight } from 'lucide-react';

export const Blog = () => {
    const posts = [
        {
            title: 'How we built StudyLite AI in 48 hours',
            excerpt: 'The story behind our hackathon project and the challenges we overcame.',
            date: 'Feb 20, 2026',
            author: 'Team Studylite',
            category: 'Hackathon Story',
            color: 'bg-brandPurple/10'
        },
        {
            title: '5 AI Tips for Exam Season',
            excerpt: 'Master your subjects faster with these smart study prompts and workflows.',
            date: 'Feb 18, 2026',
            author: 'Sarah Chen',
            category: 'Study Tips',
            color: 'bg-brandYellow/10'
        },
        {
            title: 'Designing for Low Internet Access',
            excerpt: 'Why we prioritized performance and offline-first capabilities for global students.',
            date: 'Feb 15, 2026',
            author: 'Alex Rivera',
            category: 'Engineering',
            color: 'bg-brandGreen/10'
        }
    ];

    return (
        <div className="min-h-screen bg-cream">
            <Section className="max-w-7xl mx-auto py-32 px-6">
                <div className="max-w-3xl mb-24 animate-reveal">
                    <span className="text-brandPurple font-bold uppercase tracking-widest text-xs">Stories & Insights</span>
                    <h1 className="text-5xl md:text-8xl font-bold mt-6 mb-8 italic">The Blog.</h1>
                    <p className="text-xl text-brandBlack/60 font-medium leading-relaxed">
                        Follow our journey as we build tools to empower students worldwide.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, i) => (
                        <div key={i} className="group cursor-pointer bg-white border-2 border-brandBlack/5 p-8 rounded-[40px] hover:border-brandPurple/20 transition-all hover:shadow-xl flex flex-col h-full">
                            <div className={`w-full aspect-video rounded-[24px] mb-8 ${post.color} flex items-center justify-center p-8`}>
                                <div className="text-brandBlack/20 group-hover:scale-110 transition-transform duration-500">
                                    <FileText size={64} />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mb-4 text-xs font-bold uppercase tracking-widest text-brandPurple">
                                <span>{post.category}</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 group-hover:text-brandPurple transition-colors">{post.title}</h3>
                            <p className="text-brandBlack/60 font-medium mb-8 flex-1">{post.excerpt}</p>

                            <div className="flex items-center justify-between pt-6 border-t border-brandBlack/5">
                                <div className="flex items-center gap-2 text-brandBlack/40 text-sm font-medium">
                                    <Calendar className="w-4 h-4" />
                                    <span>{post.date}</span>
                                </div>
                                <ArrowRight className="w-5 h-5 text-brandPurple group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
};

const FileText = ({ size, className }: { size: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
);
