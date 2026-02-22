import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Download, Share2, BookOpen, Clock, Target } from 'lucide-react';
import { AppLayout } from '../../components/AppLayout';

export const SingleSession = () => {
    const { id } = useParams();

    return (
        <AppLayout>
            <div className="max-w-5xl mx-auto">
                <Link to="/history" className="inline-flex items-center gap-2 text-brandBlack/40 font-bold hover:text-brandPurple transition-colors mb-8">
                    <ChevronLeft size={20} />
                    Back to History
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Quantum Mechanics Basics</h1>
                        <p className="text-brandBlack/40 font-medium whitespace-nowrap">Session ID: #{id} • Generated on Feb 20, 2026</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border-2 border-brandBlack/5 px-6 py-3 rounded-xl font-bold text-sm hover:border-brandPurple/20 transition-all shadow-sm">
                            <Share2 size={18} />
                            Share
                        </button>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-brandBlack text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brandPurple transition-all shadow-xl shadow-brandPurple/10">
                            <Download size={18} />
                            Export PDF
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left: Stats */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border-2 border-brandBlack/5 shadow-sm">
                            <Target className="text-brandPurple mb-4" size={24} />
                            <p className="text-xs font-bold text-brandBlack/40 uppercase tracking-widest mb-1">Knowledge Coverage</p>
                            <p className="text-2xl font-bold">95%</p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border-2 border-brandBlack/5 shadow-sm">
                            <BookOpen className="text-brandGreen mb-4" size={24} />
                            <p className="text-xs font-bold text-brandBlack/40 uppercase tracking-widest mb-1">Words Processed</p>
                            <p className="text-2xl font-bold">12,402</p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border-2 border-brandBlack/5 shadow-sm">
                            <Clock className="text-brandYellow mb-4" size={24} />
                            <p className="text-xs font-bold text-brandBlack/40 uppercase tracking-widest mb-1">Processing Time</p>
                            <p className="text-2xl font-bold">14s</p>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white rounded-[40px] border-2 border-brandBlack shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] p-8 md:p-12">
                            <h2 className="text-2xl font-bold mb-8 italic">Simple Summary</h2>
                            <div className="space-y-6 text-lg font-medium leading-[1.8] text-brandBlack/70">
                                <p>
                                    Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles.
                                </p>
                                <p>
                                    It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science.
                                </p>
                                <div className="p-8 bg-brandYellow/10 rounded-[32px] border-2 border-brandBlack my-12 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                                    <h4 className="text-brandPurple font-bold uppercase tracking-widest text-xs mb-4">Key Points</h4>
                                    <ul className="list-disc ml-6 space-y-4 text-brandBlack italic font-bold">
                                        <li>Wave-particle duality of subatomic matter.</li>
                                        <li>Quantization of energy levels in atomic systems.</li>
                                        <li>The uncertainty principle and probabilistic outcomes.</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-brandGreen/10 rounded-[32px] border-2 border-brandBlack my-12 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                                    <h4 className="text-brandPurple font-bold uppercase tracking-widest text-xs mb-4">Mini Quiz</h4>
                                    <p className="text-brandBlack font-bold mb-4 italic">Quick retention check: What is one scale where classical mechanics is insufficient?</p>
                                    <button className="bg-brandBlack text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-brandPurple transition-all">Start Full Quiz</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};
