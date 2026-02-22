import { Link } from 'react-router-dom';
import { Mail, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-brandBlack text-white pt-24 pb-12 overflow-hidden relative">

            {/* Background Accent */}
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brandPurple/10 rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight group">
                            <div className="relative">
                                <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:rotate-12 transition-transform">
                                    <rect x="20" y="20" width="60" height="60" rx="12" fill="#A855F7" />
                                    <circle cx="50" cy="50" r="15" fill="#FACC15" />
                                    <rect x="45" y="45" width="10" height="25" rx="2" fill="#18181B" transform="rotate(-45 45 45)" />
                                    <path d="M30 70C30 70 40 60 50 60C60 60 70 70 70 70" stroke="white" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </div>
                            studylite.ai
                        </Link>
                        <p className="text-white/60 leading-relaxed max-w-xs font-medium">
                            Your intelligent companion for collaborative learning. Transform notes into insights, quizzes, and mastery with ease.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Twitter, href: 'https://twitter.com/studyliteai', label: 'Twitter' },
                                { icon: Github, href: 'https://github.com/studyliteai', label: 'GitHub' },
                                { icon: Linkedin, href: 'https://linkedin.com/company/studyliteai', label: 'LinkedIn' },
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brandPurple hover:border-brandPurple transition-all group"
                                >
                                    <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Platform Column */}
                    <div>
                        <h4 className="font-bold text-lg mb-8">Platform</h4>
                        <ul className="space-y-4 text-white/50 font-medium">
                            <li><Link to="/study" className="hover:text-brandPurple transition-colors">Study Workspace</Link></li>
                            <li><Link to="/history" className="hover:text-brandPurple transition-colors">Past Sessions</Link></li>
                            <li><Link to="/features" className="hover:text-brandPurple transition-colors">AI Magic</Link></li>
                            <li><Link to="/dashboard" className="hover:text-brandPurple transition-colors">Analytics</Link></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="font-bold text-lg mb-8">Company</h4>
                        <ul className="space-y-4 text-white/50 font-medium">
                            <li><Link to="/about" className="hover:text-brandPurple transition-colors">Our Story</Link></li>
                            <li><Link to="/pricing" className="hover:text-brandPurple transition-colors">Pricing</Link></li>
                            <li><Link to="/blog" className="hover:text-brandPurple transition-colors">Journal</Link></li>
                            <li><Link to="/help" className="hover:text-brandPurple transition-colors">Support</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-lg mb-2">Weekly Study Tidbits</h4>
                        <p className="text-white/50 text-sm font-medium">Join 5,000+ students getting AI study tips.</p>
                        <div className="flex flex-col gap-3">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-brandPurple transition-all text-sm"
                                />
                            </div>
                            <button className="bg-brandPurple text-white py-3 rounded-xl font-bold text-sm hover:brightness-110 transition-all uppercase tracking-widest">
                                Subscribe Now
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <p className="text-white/40 text-sm italic font-medium">
                            Built with ❤️ for students.
                        </p>
                        <div className="flex gap-6">
                            <Link to="/terms" className="text-white/40 text-xs hover:text-white transition-colors">Terms of Service</Link>
                            <Link to="/privacy" className="text-white/40 text-xs hover:text-white transition-colors">Privacy Policy</Link>
                        </div>
                    </div>
                    <p className="text-white/40 text-sm font-medium">
                        © 2026 studylite.ai. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
