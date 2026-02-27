import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header className="sticky top-0 z-50 bg-cream backdrop-blur-md border-b border-brandBlack/5">
            <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between" aria-label="Main navigation">
                <div className="flex items-center gap-12">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <svg aria-hidden="true" width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="20" y="20" width="60" height="60" rx="12" fill="#A855F7" />
                            <circle cx="50" cy="50" r="15" fill="#FACC15" />
                            <rect x="45" y="45" width="10" height="25" rx="2" fill="#18181B" transform="rotate(-45 45 45)" />
                            <path d="M30 70C30 70 40 60 50 60C60 60 70 70 70 70" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                        studylite.ai
                    </Link>
                    <div className="hidden lg:flex items-center gap-8">
                        <a href="#features" className="text-xs lg:text-sm font-medium hover:text-brandPurple transition-colors">Features</a>
                        <a href="#pricing" className="text-xs lg:text-sm font-medium hover:text-brandPurple transition-colors">Pricing</a>
                        <a href="#testimonials" className="text-xs lg:text-sm font-medium hover:text-brandPurple transition-colors">Testimonials</a>
                        <a href="#team" className="text-xs lg:text-sm font-medium hover:text-brandPurple transition-colors">Team</a>
                        <a href="#about" className="text-xs lg:text-sm font-medium hover:text-brandPurple transition-colors">About</a>
                    </div>
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-6">
                    {user ? (
                        <Link
                            to="/dashboard"
                            className="bg-brandBlack text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-brandPurple transition-all transform active:scale-95 flex items-center gap-2"
                        >
                            <LayoutDashboard size={16} />
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium hover:text-brandPurple transition-colors">Log in</Link>
                            <Link to="/signup" className="bg-brandBlack text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-brandPurple transition-all transform active:scale-95">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden p-2 text-brandBlack hover:bg-brandBlack/5 rounded-lg transition-colors"
                    onClick={toggleMenu}
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isOpen}
                    aria-controls="mobile-menu"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                id="mobile-menu"
                className={`
                    lg:hidden fixed inset-x-0 top-20 bg-cream/95 backdrop-blur-2xl border-b border-brandBlack/10 transition-all duration-300 ease-in-out z-40
                    ${isOpen ? 'opacity-100 translate-y-0 shadow-2xl' : 'opacity-0 -translate-y-4 pointer-events-none'}
                `}
            >
                <div className="px-6 py-10 flex flex-col gap-8 max-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="flex flex-col gap-6">
                        <a href="#features" onClick={toggleMenu} className="text-2xl font-black uppercase italic tracking-tighter hover:text-brandPurple transition-colors">Features</a>
                        <a href="#pricing" onClick={toggleMenu} className="text-2xl font-black uppercase italic tracking-tighter hover:text-brandPurple transition-colors">Pricing</a>
                        <a href="#testimonials" onClick={toggleMenu} className="text-2xl font-black uppercase italic tracking-tighter hover:text-brandPurple transition-colors">Testimonials</a>
                        <a href="#team" onClick={toggleMenu} className="text-2xl font-black uppercase italic tracking-tighter hover:text-brandPurple transition-colors">Team</a>
                        <a href="#about" onClick={toggleMenu} className="text-2xl font-black uppercase italic tracking-tighter hover:text-brandPurple transition-colors">About</a>
                    </div>
                    <div className="pt-6 border-t border-brandBlack/5 flex flex-col gap-4">
                        {user ? (
                            <Link
                                to="/dashboard"
                                onClick={toggleMenu}
                                className="bg-brandBlack text-white px-6 py-4 rounded-xl text-center font-bold hover:bg-brandPurple transition-all flex items-center justify-center gap-2"
                            >
                                <LayoutDashboard size={20} />
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" onClick={toggleMenu} className="text-lg font-bold hover:text-brandPurple transition-colors">Log in</Link>
                                <Link to="/signup" onClick={toggleMenu} className="bg-brandBlack text-white px-6 py-4 rounded-xl text-center font-bold hover:bg-brandPurple transition-all">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
