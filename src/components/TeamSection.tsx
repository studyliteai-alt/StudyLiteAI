import { Users, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';
import { Section } from './Section';

const team = [
    {
        name: "Danjuma Tahir",
        role: "Lead AI Engineer",
        philosophy: "AI should be a student's collaborator, not a replacement for thinking.",
        avatar: "DT",
        color: "bg-brandPurple",
        socials: { twitter: "#", linkedin: "#", github: "#" }
    },
    {
        name: "Zayd Tahir",
        role: "Head of Product",
        philosophy: "Complexity is the enemy of learning. We build for absolute clarity.",
        avatar: "ZT",
        color: "bg-brandYellow",
        socials: { twitter: "#", linkedin: "#", github: "#" }
    },
    {
        name: "Dr. Elena Moss",
        role: "Curriculum Specialist",
        philosophy: "Bridging the gap between cognitive science and generative AI.",
        avatar: "EM",
        color: "bg-brandGreen",
        socials: { twitter: "#", linkedin: "#" }
    },
    {
        name: "Samuel Okafor",
        role: "Fullstack Architect",
        philosophy: "Performance is a feature. Learning tools must be instant.",
        avatar: "SO",
        color: "bg-blue-500",
        socials: { github: "#", linkedin: "#" }
    }
];

export const TeamSection = () => {
    return (
        <Section className="py-32 bg-cream/30">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <div className="flex flex-col items-center mb-20">
                    <div className="flex items-center gap-2 text-brandPurple font-black uppercase tracking-[0.3em] text-xs mb-6">
                        <Users size={16} />
                        The Brains Behind StudyLite
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black italic max-w-4xl leading-tight">
                        Built by educators & engineers who love to learn.
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, i) => (
                        <div key={i} className="group relative">
                            {/* Card Background Shadow */}
                            <div className="absolute inset-0 bg-brandBlack rounded-[32px] translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-300"></div>

                            <div className="relative bg-white border-4 border-brandBlack p-8 rounded-[32px] flex flex-col items-center h-full transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
                                <div className={`w-28 h-28 rounded-3xl ${member.color} border-4 border-brandBlack flex items-center justify-center text-3xl text-white font-black mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-6 transition-transform`}>
                                    {member.avatar}
                                </div>

                                <h3 className="text-xl font-black uppercase tracking-tight mb-1">{member.name}</h3>
                                <p className="text-brandPurple font-black uppercase text-[10px] tracking-[0.2em] mb-6">{member.role}</p>

                                <p className="text-xs font-medium text-brandBlack/60 italic leading-relaxed mb-8 flex-1">
                                    "{member.philosophy}"
                                </p>

                                <div className="flex gap-4 pt-6 border-t border-brandBlack/5 w-full justify-center">
                                    {member.socials.github && <a href={member.socials.github} className="p-2 hover:bg-brandBlack hover:text-white rounded-lg transition-colors border-2 border-transparent hover:border-brandBlack"><Github size={18} /></a>}
                                    {member.socials.linkedin && <a href={member.socials.linkedin} className="p-2 hover:bg-brandBlack hover:text-white rounded-lg transition-colors border-2 border-transparent hover:border-brandBlack"><Linkedin size={18} /></a>}
                                    {member.socials.twitter && <a href={member.socials.twitter} className="p-2 hover:bg-brandBlack hover:text-white rounded-lg transition-colors border-2 border-transparent hover:border-brandBlack"><Twitter size={18} /></a>}
                                </div>

                                <button className="absolute top-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
                                    <ExternalLink size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};
