import { Section } from './Section';
import { motion } from 'framer-motion';
import { Target, Users, Zap } from 'lucide-react';

export const AboutSection = () => {
    return (
        <Section id="about" className="bg-cream py-32 border-t-2 border-brandBlack/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    {/* Left: Narrative Content */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-brandPurple font-bold uppercase tracking-widest text-xs">Our Mission</span>
                            <h2 className="text-4xl md:text-6xl font-black mt-6 mb-10 italic leading-tight">
                                Making quality education <span className="text-brandPurple">accessible</span> for everyone.
                            </h2>
                            <div className="space-y-6 text-lg md:text-xl font-medium leading-relaxed text-brandBlack/70 mb-12">
                                <p>
                                    StudyLite AI was born from a simple realization: the gap between messy classroom notes and exam success is too wide.
                                </p>
                                <p>
                                    We're building tools that don't just process information—they create <span className="text-brandBlack font-bold">understanding</span>. Especially for students in regions where every byte of data counts.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                {[
                                    { label: 'Learners', val: '250k+', icon: Users, color: 'text-brandPurple' },
                                    { label: 'Savings', val: '1.2M hrs', icon: Zap, color: 'text-brandYellow' },
                                    { label: 'Accuracy', val: '98.4%', icon: Target, color: 'text-brandGreen' },
                                ].map((stat, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <stat.icon size={16} className={stat.color} />
                                            <span className="text-xs font-bold uppercase tracking-widest text-brandBlack/40">{stat.label}</span>
                                        </div>
                                        <p className="text-2xl md:text-3xl font-black italic">{stat.val}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Trust Visual Card */}
                    <div className="lg:col-span-5 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            className="bg-white border-4 border-brandBlack p-10 rounded-[48px] shadow-[24px_24px_0px_0px_rgba(168,85,247,0.1)] relative z-10"
                        >
                            <div className="mb-8 p-4 bg-brandPurple/5 rounded-3xl border-2 border-brandBlack/5 w-fit">
                                <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 50C20 33.4315 33.4315 20 50 20C66.5685 20 80 33.4315 80 50V80H20V50Z" fill="#A855F7" />
                                    <circle cx="50" cy="50" r="10" fill="white" />
                                </svg>
                            </div>
                            <blockquote className="text-2xl font-bold italic leading-relaxed mb-8">
                                "We wanted to build something that feels like magic but works like a powerhouse for every student."
                            </blockquote>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-brandYellow border-2 border-brandBlack rounded-full flex items-center justify-center font-black">ST</div>
                                <div>
                                    <p className="font-black uppercase text-sm tracking-wider">The Founders</p>
                                    <p className="text-xs font-bold text-brandPurple">StudyLite.ai Team</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Interactive blobs */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brandYellow/20 rounded-full blur-3xl -z-0"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brandPurple/10 rounded-full blur-3xl -z-0"></div>
                    </div>
                </div>
            </div>
        </Section>
    );
};
