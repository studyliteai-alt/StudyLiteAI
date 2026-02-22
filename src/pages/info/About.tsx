import { Section } from '../../components/Section';

export const About = () => {
    return (
        <div className="min-h-screen bg-cream">
            <Section className="max-w-5xl mx-auto py-32 px-6">
                <div className="mb-24">
                    <span className="text-brandPurple font-bold uppercase tracking-widest text-xs">Our Story</span>
                    <h1 className="text-5xl md:text-8xl font-bold mt-6 mb-12 italic leading-tight">We're on a mission to build the future of learning.</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div className="space-y-8 text-xl font-medium leading-relaxed text-brandBlack/70">
                        <p>
                            StudyLite AI was created to help students learn faster and understand their notes more easily.
                        </p>
                        <p>
                            Many students struggle with confusing study materials and limited access to quality learning tools.
                        </p>
                        <p>
                            StudyLite AI uses artificial intelligence to simplify learning and make education more accessible.
                        </p>
                        <p className="text-brandBlack font-bold">
                            Our mission is to support students everywhere, especially in regions with limited internet access.
                        </p>
                    </div>
                    <div>
                        <div className="p-12 bg-white border-2 border-brandBlack/5 rounded-[48px] shadow-xl shadow-brandPurple/5 rotate-1">
                            <p className="text-2xl font-bold italic leading-relaxed mb-6">
                                "We wanted to build something that feels like magic but works like a powerhouse."
                            </p>
                            <p className="font-bold text-brandPurple">— The Founders</p>
                        </div>
                    </div>
                </div>

                <div className="mt-40 pt-40 border-t border-brandBlack/5 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: 'Founded', val: '2026', icon: '🚀', color: 'bg-brandPurple/10' },
                        { label: 'Active Learners', val: '250k+', icon: '🧠', color: 'bg-brandGreen/10' },
                        { label: 'Hours Saved', val: '1.2M', icon: '⚡', color: 'bg-brandYellow/10' },
                    ].map((stat, i) => (
                        <div key={i} className={`p-8 rounded-[32px] border-2 border-brandBlack shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] transition-all ${stat.color}`}>
                            <div className="text-4xl mb-4">{stat.icon}</div>
                            <p className="text-xs font-bold text-brandBlack/40 uppercase tracking-widest mb-2">{stat.label}</p>
                            <p className="text-5xl font-bold italic">{stat.val}</p>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
};
