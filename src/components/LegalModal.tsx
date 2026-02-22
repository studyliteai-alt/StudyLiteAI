import React, { useEffect, useState } from 'react';
import { X, Shield, FileText, HelpCircle, BookOpen, Cookie } from 'lucide-react';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'privacy' | 'terms' | 'cookie' | 'about' | 'help' | 'blog' | null;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsMounted(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isMounted && !isOpen) return null;

    const getContent = () => {
        switch (type) {
            case 'privacy':
                return {
                    icon: Shield,
                    title: "Privacy Policy",
                    subtitle: "Last updated: Feb 22, 2026",
                    content: (
                        <div className="space-y-8">
                            <section>
                                <h4 className="text-lg font-bold mb-3">1. Data Collection</h4>
                                <p className="text-brandBlack/60 leading-relaxed">We collect your email and study materials to provide AI-powered summaries. Your data is encrypted and never sold to third parties.</p>
                            </section>
                            <section>
                                <h4 className="text-lg font-bold mb-3">2. AI Training</h4>
                                <p className="text-brandBlack/60 leading-relaxed">We may use anonymized metadata to improve our AI models. Your personal content remains private to your account.</p>
                            </section>
                            <section>
                                <h4 className="text-lg font-bold mb-3">3. Security</h4>
                                <p className="text-brandBlack/60 leading-relaxed">We use enterprise-grade SSL encryption and secure Firestore instances to host your collaborative study sessions.</p>
                            </section>
                        </div>
                    )
                };
            case 'terms':
                return {
                    icon: FileText,
                    title: "Terms of Service",
                    subtitle: "Last updated: Feb 22, 2026",
                    content: (
                        <div className="space-y-8">
                            <section>
                                <h4 className="text-lg font-bold mb-3">1. Usage Rights</h4>
                                <p className="text-brandBlack/60 leading-relaxed">StudyLite AI grants you a personal, non-transferable license to use our AI engine for educational purposes.</p>
                            </section>
                            <section>
                                <h4 className="text-lg font-bold mb-3">2. AI Accuracy</h4>
                                <p className="text-brandBlack/60 leading-relaxed">While our models are elite, we cannot guarantee 100% accuracy. Always verify critical facts against your original source material.</p>
                            </section>
                            <section>
                                <h4 className="text-lg font-bold mb-3">3. Account Integrity</h4>
                                <p className="text-brandBlack/60 leading-relaxed">Users are responsible for all activity on their accounts. Sharing accounts to bypass usage limits is strictly prohibited.</p>
                            </section>
                        </div>
                    )
                };
            case 'help':
                return {
                    icon: HelpCircle,
                    title: "Help Center",
                    subtitle: "How can we assist you?",
                    content: (
                        <div className="space-y-8">
                            <section>
                                <h4 className="text-lg font-bold mb-3">Frequently Asked</h4>
                                <ul className="space-y-4">
                                    <li className="p-4 bg-brandPurple/5 rounded-2xl border border-brandPurple/10">
                                        <div className="font-bold mb-1">How do I upload notes?</div>
                                        <div className="text-sm text-brandBlack/60">Simply paste your text or upload a PDF in the Study Workspace.</div>
                                    </li>
                                    <li className="p-4 bg-brandYellow/5 rounded-2xl border border-brandYellow/10">
                                        <div className="font-bold mb-1">Is there a free trial?</div>
                                        <div className="text-sm text-brandBlack/60">Yes! Every student gets 5 free AI-powered study sessions per month.</div>
                                    </li>
                                </ul>
                            </section>
                            <section>
                                <h4 className="text-lg font-bold mb-3">Contact Support</h4>
                                <p className="text-brandBlack/60">Need more help? Email us at <span className="text-brandPurple font-bold italic">support@studylite.ai</span></p>
                            </section>
                        </div>
                    )
                };
            case 'about':
                return {
                    icon: BookOpen,
                    title: "Our Story",
                    subtitle: "Built by students, for students",
                    content: (
                        <div className="space-y-8">
                            <p className="text-lg font-medium italic">"We were drowning in notes, so we built the liferaft."</p>
                            <p className="text-brandBlack/60 leading-relaxed">StudyLite AI started in a dorm room with a simple goal: making hard subjects easier. Today, we help thousands of students master their curricula using cutting-edge AI that understands context, not just keywords.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-cream rounded-2xl">
                                    <div className="text-3xl font-black text-brandPurple">50k+</div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-brandBlack/40">Active Students</div>
                                </div>
                                <div className="p-4 bg-cream rounded-2xl">
                                    <div className="text-3xl font-black text-brandYellow">1M+</div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-brandBlack/40">Notes Simplified</div>
                                </div>
                            </div>
                        </div>
                    )
                };
            case 'cookie':
                return {
                    icon: Cookie,
                    title: "Cookie Policy",
                    subtitle: "Keeping your experience fresh",
                    content: (
                        <div className="space-y-8 text-brandBlack/60 leading-relaxed">
                            <p>We use essential cookies to keep you signed in and remember your workspace preferences. We also use analytics cookies (Google Analytics) to understand how students interact with our platform.</p>
                            <p>By using StudyLite, you agree to our use of these small but helpful data files.</p>
                        </div>
                    )
                };
            default:
                return null;
        }
    };

    const data = getContent();
    if (!data) return null;

    const Icon = data.icon;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-brandBlack/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden transition-all duration-500 transform ${isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
                    }`}
            >
                {/* Header Backdrop Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brandPurple/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                {/* Header */}
                <div className="relative p-8 md:p-12 pb-6 flex justify-between items-start border-b border-brandBlack/5">
                    <div className="flex gap-6">
                        <div className="w-16 h-16 bg-brandBlack text-white rounded-3xl flex items-center justify-center shadow-lg transform -rotate-6">
                            <Icon size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-1.5">{data.title}</h2>
                            <p className="text-sm font-bold text-brandBlack/30 italic">{data.subtitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-brandBlack/5 rounded-xl transition-colors text-brandBlack/20 hover:text-brandBlack"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-8 md:p-12 pt-8 max-h-[60vh] overflow-y-auto scrollbar-hide font-sans">
                    {data.content}
                </div>

                {/* Footer */}
                <div className="p-8 md:p-10 pt-6 bg-cream/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs font-bold text-brandBlack/40">© 2026 studylite.ai. All rights reserved.</p>
                    <button
                        onClick={onClose}
                        className="w-full md:w-auto bg-brandBlack text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-brandPurple transition-all transform active:scale-95"
                    >
                        Got it, thanks!
                    </button>
                </div>
            </div>
        </div>
    );
};
