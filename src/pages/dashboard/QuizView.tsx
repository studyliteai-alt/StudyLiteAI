import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar.tsx';
import { TopBar } from './TopBar.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Clock, Settings2, Target, Flame, CheckCircle2, XCircle, Share2, Copy } from 'lucide-react';
import { aiService } from '../../services/ai.ts';
import { db } from '../../services/firebase.ts';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { cn } from '../../utils/cn.ts';

type QuizState = 'setup' | 'playing' | 'results';

const QuizView: React.FC = () => {
    const { user } = useAuth();
    const { lowDataMode } = useTheme();
    const [topic, setTopic] = useState('');
    const [timeLimit, setTimeLimit] = useState(10);
    const [difficulty, setDifficulty] = useState('Medium');
    const [numQuestions, setNumQuestions] = useState(5);
    const [quizState, setQuizState] = useState<QuizState>('setup');
    
    // Quiz Progress
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (quizState === 'playing' && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (quizState === 'playing' && timeLeft === 0) {
            finishQuiz();
        }
        return () => clearTimeout(timer);
    }, [timeLeft, quizState]);

    const handleStart = async () => {
        if (!topic.trim()) return;
        setIsGenerating(true);
        try {
            const prompt = `Generate a ${difficulty} difficulty multiple choice quiz about "${topic}" with ${numQuestions} questions. Make it highly professional.`;
            const data = await aiService.processNotes(prompt);
            // Assuming aiService can return mcqs from a generic prompt if structured well,
            // or we'd ideally have a dedicated generateQuiz endpoint. Using processNotes for now
            // as it returns an mcqs array.
            
            if (data.mcqs && data.mcqs.length > 0) {
                // Limit to requested number if AI returned more
                setQuestions(data.mcqs.slice(0, numQuestions));
                setTimeLeft(timeLimit * 60);
                setQuizState('playing');
                setCurrentQ(0);
                setAnswers(new Array(data.mcqs.slice(0, numQuestions).length).fill(''));
            } else {
                 // Fallback mock data if AI fails to parse format
                 setQuestions([
                     { question: `What is the core concept of ${topic}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], answer: 'Option A' },
                     { question: 'Which of the following is true?', options: ['True 1', 'False 2', 'False 3', 'False 4'], answer: 'True 1' }
                 ]);
                 setTimeLeft(timeLimit * 60);
                 setQuizState('playing');
                 setCurrentQ(0);
                 setAnswers(new Array(2).fill(''));
            }
        } catch (error) {
            console.error("Failed to generate quiz", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAnswer = (option: string) => {
        const newAnswers = [...answers];
        newAnswers[currentQ] = option;
        setAnswers(newAnswers);
        
        if (currentQ < questions.length - 1) {
            setTimeout(() => setCurrentQ(prev => prev + 1), 300);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = async () => {
        setQuizState('results');
        
        let correct = 0;
        questions.forEach((q, i) => {
            if (answers[i] === q.answer) correct++;
        });

        // Save result
        if (user) {
            await addDoc(collection(db, 'quizzes'), {
                userId: user.uid,
                topic,
                score: correct,
                total: questions.length,
                difficulty,
                timestamp: new Date().toISOString()
            });
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach((q, i) => {
            if (answers[i] === q.answer) correct++;
        });
        return { correct, percentage: Math.round((correct / questions.length) * 100) };
    };

    return (
        <div className='flex bg-[#FDFBF7] overflow-hidden font-inter text-[#1C1C1C] relative neo-dashboard-layout'>
            {!lowDataMode && (
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#1c1c1c 2px, transparent 2px), linear-gradient(90deg, #1c1c1c 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
            )}
            
            <Sidebar />
            
            <div className='flex flex-col grow relative z-10'>
                <TopBar />
                <main className='grow overflow-y-auto'>
                    <AnimatePresence mode="wait">
                        
                        {/* SETUP STATE */}
                        {quizState === 'setup' && (
                            <motion.div 
                                key="setup"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="p-6 md:p-12 max-w-5xl mx-auto w-full"
                            >
                                <header className='mb-8 md:mb-12'>
                                    <h1 className='text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-[#1C1C1C] flex items-center gap-3 md:gap-4'>
                                        <div className='w-12 h-12 md:w-16 md:h-16 bg-[#1C1C1C] text-[#FBC343] rounded-2xl flex items-center justify-center border-[3px] border-[#1C1C1C] shadow-[4px_4px_0px_#FBC343] rotate-3 shrink-0'>
                                            <Target size={32} strokeWidth={2.5}/>
                                        </div>
                                        Practice Quiz
                                    </h1>
                                    <p className='font-bold uppercase tracking-widest text-[#1C1C1C]/60 text-xs md:text-sm'>Configure your assessment parameters.</p>
                                </header>

                                <div className="bg-white border-[3px] border-[#1C1C1C] rounded-4xl shadow-[8px_8px_0px_#1C1C1C] p-6 md:p-10 relative overflow-hidden">
                                     {/* Custom Theme blobs */}
                                     <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#FBC343]/20 blur-3xl rounded-full"></div>
                                     <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#A5D5D5]/20 blur-3xl rounded-full"></div>
                                     
                                     <div className="relative z-10 flex flex-col gap-10">
                                         {/* Topic */}
                                         <div>
                                            <label className="font-black uppercase tracking-widest text-base md:text-lg mb-4 block flex items-center gap-2 md:gap-3">
                                                <div className="w-6 h-6 md:w-8 md:h-8 bg-[#A5D5D5] border-[3px] border-[#1C1C1C] rounded-lg"></div> Topic Concept
                                            </label>
                                            <input 
                                                value={topic}
                                                onChange={(e) => setTopic(e.target.value)}
                                                placeholder="e.g. Constitutional Law..."
                                                className="w-full bg-[#FDFBF7] border-[3px] border-[#1C1C1C] p-5 md:p-6 rounded-2xl font-bold text-base md:text-xl uppercase tracking-wider placeholder:text-[#1C1C1C]/30 focus:outline-none focus:shadow-[8px_8px_0px_#FBC343] transition-all shadow-[inset_4px_4px_0px_rgba(0,0,0,0.05)] text-[#1C1C1C]"
                                            />
                                         </div>

                                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {/* Time Limit */}
                                            <div>
                                                <label className="font-black uppercase tracking-widest text-sm mb-3 block text-[#1C1C1C]/70">Time Limit (Minutes)</label>
                                                <div className="flex bg-[#FDFBF7] border-[3px] border-[#1C1C1C] rounded-2xl overflow-hidden shadow-[4px_4px_0px_#1C1C1C]">
                                                    {[5, 10, 20].map(val => (
                                                        <button 
                                                            key={val}
                                                            onClick={() => setTimeLimit(val)}
                                                            className={cn(
                                                                "flex-1 py-4 font-black text-xl transition-all border-r-[3px] border-[#1C1C1C] last:border-r-0",
                                                                timeLimit === val ? "bg-[#1C1C1C] text-[#FBC343]" : "hover:bg-[#E5E5E5]"
                                                            )}
                                                        >
                                                            {val}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Difficulty */}
                                            <div>
                                                <label className="font-black uppercase tracking-widest text-sm mb-3 block text-[#1C1C1C]/70">Difficulty</label>
                                                <div className="relative border-[3px] border-[#1C1C1C] rounded-2xl bg-[#FDFBF7] shadow-[4px_4px_0px_#1C1C1C]">
                                                    <select 
                                                        value={difficulty}
                                                        onChange={(e) => setDifficulty(e.target.value)}
                                                        className="w-full appearance-none bg-transparent p-4 font-black uppercase text-xl outline-none cursor-pointer"
                                                    >
                                                        <option>Easy</option>
                                                        <option>Medium</option>
                                                        <option>Hard</option>
                                                    </select>
                                                    <Settings2 className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" size={24} strokeWidth={3} />
                                                </div>
                                            </div>

                                            {/* Questions */}
                                            <div>
                                                <label className="font-black uppercase tracking-widest text-sm mb-3 block text-[#1C1C1C]/70">Questions</label>
                                                <div className="flex bg-[#FDFBF7] border-[3px] border-[#1C1C1C] rounded-2xl overflow-hidden shadow-[4px_4px_0px_#1C1C1C]">
                                                    {[5, 10, 15].map(val => (
                                                        <button 
                                                            key={val}
                                                            onClick={() => setNumQuestions(val)}
                                                            className={cn(
                                                                "flex-1 py-4 font-black text-xl transition-all border-r-[3px] border-[#1C1C1C] last:border-r-0",
                                                                numQuestions === val ? "bg-[#1C1C1C] text-[#A5D5D5]" : "hover:bg-[#E5E5E5]"
                                                            )}
                                                        >
                                                            {val}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                         </div>

                                         <div className="pt-8 border-t-[3px] border-[#1C1C1C] border-dashed flex justify-center md:justify-end">
                                             <button 
                                                onClick={handleStart}
                                                disabled={isGenerating || !topic.trim()}
                                                className={cn(
                                                    "w-full md:w-auto border-[3px] border-[#1C1C1C] font-black uppercase tracking-widest text-xl md:text-2xl py-4 md:py-6 px-10 md:px-16 rounded-full flex items-center justify-center gap-3 md:gap-4 transition-all -rotate-1",
                                                    isGenerating || !topic.trim() ? "bg-[#E5E5E5] text-[#1C1C1C]/40 opacity-50 cursor-not-allowed shadow-none" 
                                                    : "bg-[#FBC343] text-[#1C1C1C] shadow-[8px_8px_0px_#1C1C1C] hover:-translate-y-1 hover:shadow-[12px_12px_0px_#1C1C1C] hover:-rotate-0"
                                                )}
                                             >
                                                {isGenerating ? (
                                                    <span className="animate-pulse">Generating Matrix...</span>
                                                ) : (
                                                    <><PlayCircle size={32} strokeWidth={3} fill="#1C1C1C" className="text-[#FBC343]"/> Launch Quiz</>
                                                )}
                                             </button>
                                         </div>
                                     </div>
                                </div>
                            </motion.div>
                        )}

                        {/* PLAYING STATE */}
                        {quizState === 'playing' && questions.length > 0 && (
                            <motion.div 
                                key="playing"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="h-full flex flex-col md:flex-row"
                            >
                                {/* Left Side: Status & Question */}
                                <div className="w-full md:w-[45%] bg-[#1C1C1C] p-8 md:p-12 text-white flex flex-col relative z-20 shadow-[12px_0_20px_rgba(0,0,0,0.5)] border-r-[3px] border-[#1C1C1C]">
                                    <div className="flex justify-between items-center mb-10 md:mb-16">
                                        <div className="bg-white/10 px-3 md:px-4 py-1.5 md:py-2 rounded-xl font-black uppercase tracking-widest border-[3px] border-[#FBC343] text-[10px] md:text-sm text-[#FBC343] -rotate-2">
                                            Q {currentQ + 1} / {questions.length}
                                        </div>
                                        <div className="flex items-center gap-2 md:gap-3 bg-[#F4C5C5] text-[#1C1C1C] px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-black uppercase tracking-widest border-[3px] border-[#1C1C1C] shadow-[4px_4px_0px_#A5D5D5] rotate-2">
                                            <Clock size={20} strokeWidth={3} className={timeLeft < 60 ? 'animate-pulse text-red-600' : ''} />
                                            <span className="text-sm md:text-base">{formatTime(timeLeft)}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grow flex items-center py-6">
                                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight drop-shadow-[4px_4px_0px_rgba(255,255,255,0.1)]">
                                            {questions[currentQ].question}
                                        </h2>
                                    </div>

                                    {/* Progress Bar (Brutalist style) */}
                                    <div className="h-4 w-full bg-[#1C1C1C] border-[3px] border-white/50 rounded-full overflow-hidden mt-8 shadow-[inset_4px_4px_0px_rgba(0,0,0,0.5)]">
                                        <div 
                                            className="h-full bg-[#FBC343] transition-all duration-500 ease-out"
                                            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Right Side: Answers */}
                                <div className="w-full md:w-[55%] bg-[#A5D5D5] p-6 md:p-12 flex flex-col justify-center relative overflow-hidden">
                                     {/* Background decoration */}
                                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] pointer-events-none opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #1C1C1C 0, #1C1C1C 4px, transparent 4px, transparent 12px)' }}></div>

                                    <div className="flex flex-col gap-4 md:gap-6 relative z-10">
                                        {questions[currentQ].options.map((opt: string, idx: number) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswer(opt)}
                                                className={cn(
                                                    "w-full text-left p-5 md:p-8 bg-white border-[3px] border-[#1C1C1C] rounded-4xl shadow-[6px_6px_0px_#1C1C1C] md:shadow-[8px_8px_0px_#1C1C1C] font-black text-lg md:text-2xl tracking-tight hover:-translate-y-1 hover:shadow-[10px_10px_0px_#1C1C1C] transition-all flex items-center gap-4 md:gap-6 group",
                                                    answers[currentQ] === opt ? "bg-[#FBC343] -translate-x-2 translate-y-2 shadow-none" : ""
                                                )}
                                                style={{ transform: answers[currentQ] !== opt ? `rotate(${idx % 2 === 0 ? '-1deg' : '1deg'})` : '' }}
                                            >
                                                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1C1C1C] text-white flex items-center justify-center rounded-xl border-[3px] border-[#1C1C1C] shrink-0 font-black text-lg md:text-xl group-hover:rotate-12 transition-transform shadow-[4px_4px_0px_#F4C5C5]">
                                                    {['A', 'B', 'C', 'D'][idx]}
                                                </div>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* RESULTS STATE */}
                        {quizState === 'results' && (
                            <motion.div 
                                key="results"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-12 max-w-5xl mx-auto w-full"
                            >
                                {(() => {
                                    const { correct, percentage } = calculateScore();
                                    const isSuccess = percentage >= 70;
                                    
                                    return (
                                        <div className="flex flex-col gap-12">
                                            {/* Top Banner */}
                                            <div className={cn(
                                                "p-8 md:p-16 border-[3px] border-[#1C1C1C] rounded-4xl shadow-[8px_8px_0px_#1C1C1C] rotate-1 relative overflow-hidden flex flex-col items-center gap-8 md:gap-12 justify-between",
                                                isSuccess ? "bg-[#FBC343] text-[#1C1C1C]" : "bg-[#F4C5C5] text-[#1C1C1C]"
                                            )}>
                                                {/* Decoration */}
                                                <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none hidden md:block">
                                                    {isSuccess ? <Flame size={200} /> : <Target size={200} />}
                                                </div>

                                                <div className="relative z-10 text-center md:text-left">
                                                    <div className="inline-block bg-[#1C1C1C] text-white px-5 py-2 rounded-full font-black uppercase tracking-widest text-xs border-[3px] border-[#1C1C1C] mb-6 shadow-[4px_4px_0px_white] -rotate-2">
                                                        Assessment Complete
                                                    </div>
                                                    <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter drop-shadow-[4px_4px_0px_white] leading-none mb-4">
                                                        {isSuccess ? "Excellent" : "Need Review"}
                                                    </h1>
                                                    <p className="font-bold uppercase tracking-widest text-base md:text-lg opacity-80">
                                                        Topic: {topic}
                                                    </p>
                                                </div>

                                                <div className="relative z-10 flex flex-col items-center justify-center w-48 h-48 md:w-64 md:h-64 bg-white border-[3px] border-[#1C1C1C] rounded-full shadow-[inset_8px_8px_0px_rgba(0,0,0,0.1),8px_8px_0px_#1C1C1C] -rotate-6 shrink-0">
                                                    <span className="text-5xl md:text-7xl font-black uppercase tracking-tighter drop-shadow-[2px_2px_0px_#FBC343]">{percentage}%</span>
                                                    <span className="font-bold uppercase tracking-widest opacity-50 mt-2 text-xs md:text-sm">{correct} / {questions.length} Correct</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col sm:flex-row justify-between gap-6 p-6 md:p-8 bg-white border-[3px] border-[#1C1C1C] rounded-3xl shadow-[8px_8px_0px_#1C1C1C] -rotate-1 items-center">
                                                <div className="flex gap-4 w-full sm:w-auto">
                                                    <button 
                                                        onClick={() => setQuizState('setup')}
                                                        className="w-full sm:w-auto px-8 py-3.5 bg-[#1C1C1C] text-white font-black uppercase tracking-widest rounded-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:bg-[#A5D5D5] hover:text-[#1C1C1C] shadow-[4px_4px_0px_#1C1C1C] border-[3px] border-[#1C1C1C] transition-all rotate-1 flex items-center justify-center gap-2 text-sm md:text-base"
                                                    >
                                                        Run Another Set
                                                    </button>
                                                </div>
                                                <div className="flex gap-3 w-full sm:w-auto">
                                                    <button className="flex-1 sm:flex-none px-5 py-3.5 bg-[#FDFBF7] text-[#1C1C1C] font-black uppercase rounded-xl border-[3px] border-[#1C1C1C] shadow-[4px_4px_0px_#1C1C1C] hover:translate-y-1 hover:shadow-none flex items-center justify-center gap-2 text-xs md:text-sm">
                                                        <Share2 size={18} /> Share
                                                    </button>
                                                    <button className="flex-1 sm:flex-none px-5 py-3.5 bg-[#1C1C1C] text-[#FBC343] font-black uppercase rounded-xl border-[3px] border-[#1C1C1C] shadow-[4px_4px_0px_#A5D5D5] hover:translate-y-1 hover:shadow-none flex items-center justify-center gap-2 text-xs md:text-sm">
                                                        <Copy size={18} /> Copy Link
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Answer Review */}
                                            <div className="mt-8">
                                                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3 md:gap-4 text-[#1C1C1C]">
                                                    <CheckCircle2 size={32} strokeWidth={3} className="text-[#A5D5D5]" />
                                                    Answer Review Matrix
                                                </h3>
                                                <div className="flex flex-col gap-6">
                                                    {questions.map((q, i) => {
                                                        const isCorrect = answers[i] === q.answer;
                                                        return (
                                                            <div key={i} className={cn(
                                                                "p-8 border-[3px] border-[#1C1C1C] rounded-4xl shadow-[8px_8px_0px_#1C1C1C] transition-all",
                                                                isCorrect ? "bg-white" : "bg-[#F4C5C5]"
                                                            )}>
                                                                <div className="flex gap-6">
                                                                    <div className={cn(
                                                                        "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-black rounded-xl border-[3px] border-[#1C1C1C] shrink-0 text-white shadow-[4px_4px_0px_#1C1C1C] rotate-3 text-lg md:text-xl",
                                                                        isCorrect ? "bg-[#A5D5D5] text-[#1C1C1C]" : "bg-[#1C1C1C]"
                                                                    )}>
                                                                        {i + 1}
                                                                    </div>
                                                                    <div className="grow">
                                                                        <h4 className="text-xl md:text-2xl font-black tracking-tight mb-4 min-h-[40px] uppercase leading-tight">{q.question}</h4>
                                                                        
                                                                        <div className="flex flex-col gap-3">
                                                                            <div className="flex items-center gap-3 p-4 bg-[#F2FCEE]/80 border-[3px] border-[#1C1C1C] rounded-xl relative overflow-hidden text-emerald-900 border-dashed hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_#1C1C1C]">
                                                                                <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500 border-r-[3px] border-[#1C1C1C]"></div>
                                                                                <CheckCircle2 size={24} strokeWidth={3} className="text-emerald-500 shrink-0 ml-4" />
                                                                                <div className="grow font-bold uppercase tracking-widest text-sm">
                                                                                    Correct: <span className="font-black ml-2 text-base text-black">{q.answer}</span>
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            {!isCorrect && answers[i] && (
                                                                                <div className="flex items-center gap-3 p-4 bg-white/50 border-[3px] border-[#1C1C1C] rounded-xl relative overflow-hidden text-[#1C1C1C] mt-2 shadow-[2px_2px_0px_#1C1C1C]">
                                                                                     <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-500 border-r-[3px] border-[#1C1C1C]"></div>
                                                                                    <XCircle size={24} strokeWidth={3} className="text-red-500 shrink-0 ml-4" />
                                                                                    <div className="grow font-bold uppercase tracking-widest text-sm text-[#1C1C1C]/60">
                                                                                        You selected: <span className="font-bold line-through ml-2">{answers[i]}</span>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default QuizView;
