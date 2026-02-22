import { Section } from '../../components/Section';
import { HelpCircle, MessageCircle, FileText, Search } from 'lucide-react';

export const HelpCenter = () => {
    const categories = [
        { title: 'Getting Started', icon: HelpCircle, items: ['Creating an account', 'First study session', 'Uploading notes'] },
        { title: 'Study Features', icon: FileText, items: ['AI Summarizer', 'Quiz Generator', 'Study History'] },
        { title: 'Account & Billing', icon: MessageCircle, items: ['Managing subscription', 'Resetting password', 'Security settings'] },
    ];

    return (
        <div className="min-h-screen bg-cream">
            <Section className="max-w-7xl mx-auto py-32 px-6 text-center">
                <div className="max-w-3xl mx-auto mb-16 animate-reveal">
                    <span className="text-brandPurple font-bold uppercase tracking-widest text-xs">Support</span>
                    <h1 className="text-5xl md:text-7xl font-bold mt-6 mb-8">How can we help?</h1>
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brandBlack/40" />
                        <input
                            type="text"
                            placeholder="Search for articles..."
                            className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-brandBlack/10 focus:border-brandPurple outline-none transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {categories.map((cat, i) => (
                        <div key={i} className="bg-white border-2 border-brandBlack/5 p-10 rounded-[40px] hover:border-brandPurple/20 transition-all shadow-sm">
                            <div className="w-12 h-12 bg-brandPurple/10 rounded-xl flex items-center justify-center mb-6">
                                <cat.icon className="w-6 h-6 text-brandPurple" />
                            </div>
                            <h3 className="text-2xl font-bold mb-6">{cat.title}</h3>
                            <ul className="space-y-4">
                                {cat.items.map((item, j) => (
                                    <li key={j}>
                                        <button className="text-brandBlack/60 hover:text-brandPurple font-medium transition-colors">
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-32 p-12 bg-brandBlack text-white rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-left">
                        <h2 className="text-3xl font-bold mb-2">Still need help?</h2>
                        <p className="text-white/60 font-medium">Our support team is online and ready to assist you.</p>
                    </div>
                    <button className="bg-brandPurple text-white px-10 py-4 rounded-2xl font-bold hover:bg-white hover:text-brandPurple transition-all">
                        Contact Support
                    </button>
                </div>
            </Section>
        </div>
    );
};
