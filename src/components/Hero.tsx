import { Link } from 'react-router-dom';
import { MagneticButton } from './MagneticButton';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard } from 'lucide-react';

export const Hero = () => {
    const { user } = useAuth();
    return (
        <section className="relative pt-20 pb-32 bg-cream overflow-hidden">
            {/* Decorative SVG Illustrations */}
            <div className="absolute top-20 left-10 max-lg:top-4 max-lg:left-2 animate-float opacity-80 lg:block">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="60" r="50" fill="#F472B6" fillOpacity="0.2" />
                    <path d="M40 45C40 45 45 40 60 40C75 40 80 45 80 45V75C80 75 75 80 60 80C45 80 40 75 40 75V45Z" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="50" cy="55" r="3" fill="#18181B" />
                    <circle cx="70" cy="55" r="3" fill="#18181B" />
                    <path d="M55 65C55 65 60 68 65 65" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
                    <path d="M20 20L35 35" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="100" cy="30" r="5" fill="#FACC15" />
                </svg>
            </div>
            <div className="absolute top-20 right-10 max-lg:top-20 max-lg:right-1 animate-float-delayed opacity-80 lg:block">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M60 10L110 96H10L60 10Z" fill="#A855F7" fillOpacity="0.1" stroke="#A855F7" strokeWidth="2" />
                    <circle cx="60" cy="60" r="25" stroke="#18181B" strokeWidth="3" />
                    <path d="M50 55C50 55 55 50 60 50C65 50 70 55 70 55" stroke="#18181B" strokeWidth="2" />
                    <line x1="45" y1="70" x2="75" y2="70" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
                </svg>
            </div>
            <div className="absolute bottom-40 left-20 max-lg:bottom-30 max-lg:left-1 animate-float-reverse opacity-80 md:block">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="20" width="60" height="60" rx="30" fill="#22C55E" fillOpacity="0.2" stroke="#22C55E" strokeWidth="2" />
                    <path d="M40 45L50 55L60 45" stroke="#18181B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className="absolute bottom-40 right-20 max-lg:bottom-20 max-lg:right-1 animate-float-delayed-reverse opacity-80 md:block">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="20" width="60" height="60" rx="10" fill="#FACC15" fillOpacity="0.2" stroke="#FACC15" strokeWidth="2" transform="rotate(15 50 50)" />
                    <circle cx="45" cy="45" r="4" fill="#18181B" />
                    <circle cx="65" cy="45" r="4" fill="#18181B" />
                    <path d="M45 60C45 60 55 65 65 60" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>

            <div className="max-w-4xl mx-auto px-6 text-center animate-reveal">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
                    Turn Confusing Notes Into <br />
                    <span className="relative inline-block">
                        <span className="relative z-10 px-4 py-1 text-brandBlack">Exam-Ready</span>
                        <span className="absolute inset-0 bg-brandYellow rounded-lg -rotate-1 -z-0 animate-wiggle border-2 border-brandBlack"></span>
                    </span> <br />
                    Summaries
                </h1>
                <p className="text-base md:text-lg text-brandBlack/60 max-w-xl mx-auto mb-10 leading-relaxed font-medium delay-200">
                    Study smarter with AI that simplifies your notes, highlights key points, and creates quizzes — even on slow internet.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {user ? (
                        <Link to="/dashboard">
                            <MagneticButton className="bg-brandBlack text-white px-8 py-4 rounded-full font-bold hover:bg-brandPurple transition-all transform hover:-translate-y-1 flex items-center gap-2">
                                <LayoutDashboard size={20} />
                                Go to Dashboard
                            </MagneticButton>
                        </Link>
                    ) : (
                        <Link to="/signup">
                            <MagneticButton className="bg-brandBlack text-white px-8 py-4 rounded-full font-bold hover:bg-brandPurple transition-all transform hover:-translate-y-1">
                                Start Studying Free
                            </MagneticButton>
                        </Link>
                    )}
                    <a href="#how-it-works">
                        <MagneticButton className="bg-white border-2 border-brandBlack px-8 py-4 rounded-full font-bold hover:bg-brandBlack hover:text-white transition-all transform hover:-translate-y-1">
                            See How It Works
                        </MagneticButton>
                    </a>
                </div>
            </div>
        </section>
    );
};
