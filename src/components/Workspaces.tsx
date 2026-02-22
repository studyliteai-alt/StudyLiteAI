import { Section } from './Section';
import { MagneticButton } from './MagneticButton';

export const Workspaces = () => {
    return (
        <Section className="bg-white py-32">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <div>
                    <span className="text-brandPurple font-bold uppercase tracking-widest text-xs">#Calendar</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 leading-tight">
                        Organize your clients or brands in workspaces
                    </h2>
                    <p className="text-base md:text-lg text-brandBlack/60 mb-10 leading-relaxed">
                        Best data organization. Choose a client or brand and get everything related to it in one place.
                    </p>
                    <MagneticButton className="border-2 border-brandBlack px-8 py-3 rounded-full font-bold hover:bg-brandBlack hover:text-white transition-all transform hover:scale-110 active:scale-95">
                        How Workspaces work
                    </MagneticButton>
                </div>
                <div className="relative p-12 bg-[#A855F7]/10 rounded-[40px] border-2 border-brandPurple/20 group animate-morph">
                    <div className="bg-white rounded-2xl border-2 border-brandBlack shadow-xl overflow-hidden transform group-hover:-rotate-1 transition-transform">
                        <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Workspace: Client 2</div>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="h-10 bg-slate-100 rounded-lg w-full flex items-center px-4">
                                <div className="w-4 h-4 bg-slate-300 rounded-full mr-3"></div>
                                <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-12 bg-brandPurple text-white rounded-xl flex items-center px-6 font-bold text-sm">
                                    Social Calendar
                                </div>
                                <div className="h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center px-6 text-slate-400 text-sm font-medium">
                                    Analytics & Reports
                                </div>
                                <div className="h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center px-6 text-slate-400 text-sm font-medium">
                                    Team Chat
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Playful Character Overlay */}
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brandYellow rounded-full border-4 border-brandBlack flex items-center justify-center overflow-hidden">
                        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="40" fill="white" />
                            <path d="M40 45C40 45 45 40 50 40C55 40 60 45 60 45M40 45V65C40 65 45 70 50 70C55 70 60 65 60 65V45" stroke="#18181B" strokeWidth="3" />
                            <circle cx="45" cy="52" r="3" fill="#18181B" />
                            <circle cx="55" cy="52" r="3" fill="#18181B" />
                        </svg>
                    </div>
                </div>
            </div>
        </Section>
    );
};
