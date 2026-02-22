import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Eye, Target, MessageCircle, Play, Loader2 } from 'lucide-react';
import { MagneticButton } from '../../components/MagneticButton';
import { AppLayout } from '../../components/AppLayout';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { saveSession } from '../../services/studyService';

export const StudyWorkspace = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isLowData, toggleLowData } = useTheme();
    const [isExamMode, setIsExamMode] = useState(false);
    const [content, setContent] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleTransform = async () => {
        if (!content.trim() || !user) return;

        setIsProcessing(true);
        try {
            // Simulated AI extraction logic
            const topic = content.split('\n')[0].substring(0, 30) || "New Session";
            await saveSession({
                userId: user.uid,
                topic,
                content,
                summary: "This is an AI-generated summary of your notes...",
                keyPoints: ["Point 1", "Point 2", "Point 3"],
                status: 'Reviewing'
            });
            navigate('/history');
        } catch (error) {
            console.error(error);
            alert("Failed to save session");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleExplainSimpler = () => {
        alert("AI is re-simplifying the content for you...");
    };

    return (
        <AppLayout>
            <div className="max-w-[1600px] mx-auto h-full flex flex-col lg:flex-row gap-8">
                {/* Input Side */}
                <div className="flex-1 space-y-6 flex flex-col min-h-[600px]">
                    <div className="bg-white border-2 border-brandBlack/5 rounded-[40px] p-8 shadow-sm h-full flex flex-col">
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <Sparkles className="text-brandPurple" size={28} /> Paste Your Notes
                        </h2>

                        <textarea
                            className="flex-1 w-full p-8 rounded-3xl bg-[#F8F9FA] border-2 border-brandBlack shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.05)] focus:border-brandPurple outline-none transition-all font-medium min-h-[400px] text-lg leading-relaxed"
                            placeholder="Paste your class notes or textbook content here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <div className="mt-8 p-6 bg-brandPurple/5 rounded-3xl border-2 border-brandBlack shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-6">
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div
                                    onClick={toggleLowData}
                                    className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${isLowData ? 'bg-brandPurple text-white border-brandBlack' : 'bg-white border-brandBlack/10 hover:border-brandPurple/20'}`}
                                >
                                    <div className="flex items-center gap-3 mb-1">
                                        <Zap size={18} className={isLowData ? 'text-brandYellow' : 'text-brandPurple'} />
                                        <span className="font-bold text-sm uppercase tracking-wider">Low Data Mode</span>
                                    </div>
                                    <p className="text-[10px] font-medium opacity-60">Uses less internet data.</p>
                                </div>

                                <div className="flex-1">
                                    <label className=" text-[10px] font-bold text-brandBlack/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Target size={14} /> Exam Mode
                                    </label>
                                    <select
                                        className="w-full p-3 rounded-xl border-2 border-brandBlack bg-white font-bold text-sm outline-none focus:border-brandPurple"
                                        value={isExamMode ? 'WAEC' : 'General'}
                                        onChange={(e) => setIsExamMode(e.target.value !== 'General')}
                                    >
                                        <option value="General">General Study</option>
                                        <option value="WAEC">WAEC</option>
                                        <option value="JAMB">JAMB</option>
                                        <option value="University">University</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <MagneticButton
                            onClick={handleTransform}
                            disabled={isProcessing || !content.trim()}
                            className="w-full mt-8 bg-brandBlack text-white py-5 rounded-2xl font-bold text-xl hover:bg-brandPurple transition-all shadow-[6px_6px_0px_0px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin" /> Generating...
                                </span>
                            ) : "Generate Summary"}
                        </MagneticButton>
                    </div>
                </div>

                {/* Output Side */}
                <div className="flex-1 space-y-6 flex flex-col min-h-[600px]">
                    <div className="bg-white border-2 border-brandBlack/5 rounded-[40px] p-8 shadow-sm h-full flex flex-col relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8 z-10">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <Eye className="text-brandGreen" size={28} /> Study Kit
                            </h2>
                            <div className="flex gap-2">
                                <span className="px-4 py-1.5 bg-brandGreen/10 text-brandGreen rounded-full text-[10px] font-bold uppercase tracking-widest">Awaiting Input</span>
                            </div>
                        </div>

                        <div className="flex-1 border-4 border-dashed border-[#F1F3F5] rounded-[32px] flex flex-col items-center justify-center text-center p-12 z-10">
                            <div className="w-20 h-20 bg-brandPurple/5 rounded-full flex items-center justify-center mb-8">
                                <Sparkles size={40} className="text-brandPurple/40" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Magic is one click away.</h3>
                            <p className="text-brandBlack/40 font-medium max-w-xs leading-relaxed mb-12">
                                Enter your text or upload a file and watch our AI synthesize your knowledge into a master study kit.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                                <button
                                    onClick={handleExplainSimpler}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-brandBlack rounded-xl font-bold text-sm hover:bg-brandPurple/5 transition-all"
                                >
                                    <MessageCircle size={18} /> Explain Simpler
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-brandYellow border-2 border-brandBlack rounded-xl font-bold text-sm hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all">
                                    <Play size={18} /> Start Quiz
                                </button>
                            </div>
                        </div>

                        {/* Low Data Decorative Overlay - Hidden in low-data mode via CSS */}
                        {!isLowData && (
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brandPurple/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};
