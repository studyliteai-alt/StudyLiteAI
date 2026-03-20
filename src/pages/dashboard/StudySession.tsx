import React, { useState } from 'react';
import { Sidebar } from './Sidebar.tsx';
import { TopBar } from './TopBar.tsx';
import { aiService, type AISessionResponse } from '../../services/ai.ts';
import { BookOpen, HelpCircle, List, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../services/firebase.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { cn } from '../../utils/cn.ts';

const StudySession: React.FC = () => {
  const { user } = useAuth();
  const { lowDataMode } = useTheme();
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AISessionResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'keyPoints' | 'quiz'>('summary');

  const handleProcessNotes = async () => {
    if (!notes.trim()) return;
    
    setIsLoading(true);
    try {
      const aiResponse = await aiService.processNotes(notes);
      setResult(aiResponse);
      
      // Save to Firebase
      if (user) {
        const sessionTitle = notes.trim().split('\n')[0].substring(0, 50) || 'Study Session';
        
        await addDoc(collection(db, 'sessions'), {
          userId: user.uid,
          title: sessionTitle,
          notes: notes,
          summary: aiResponse.summary,
          keyPoints: aiResponse.keyPoints,
          mcqs: aiResponse.mcqs,
          shortAnswers: aiResponse.shortAnswers,
          timestamp: new Date().toISOString()
        });

        // Award XP for new session
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          xp: increment(50),
          sessionsCount: increment(1)
        });
      }
    } catch (error) {
      console.error('Error processing notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className='flex bg-[#FDFBF7] overflow-hidden font-inter text-[#1C1C1C] relative neo-dashboard-layout'>
        {/* Background Grid */}
        {!lowDataMode && (
          <>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#1c1c1c 2px, transparent 2px), linear-gradient(90deg, #1c1c1c 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#F4C5C5]/20 rounded-full blur-3xl pointer-events-none z-0"></div>
          </>
        )}

      <Sidebar />
      <div className='flex flex-col grow relative z-10'>
        <TopBar />
        
        <main className='grow p-8 md:p-12 overflow-y-auto relative'>
          <div className='max-w-4xl mx-auto'>
            <header className='mb-12'>
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className='text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-[#1C1C1C]'
              >
                New Session
              </motion.h1>
              <motion.p 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className='font-bold uppercase tracking-widest text-[#1C1C1C]/60 text-sm'
              >
                Convert messy lecture notes into structured revision material.
              </motion.p>
            </header>

            {!result ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className='p-6 md:p-10 bg-[#A5D5D5] border-[3px] border-[#1C1C1C] rounded-4xl shadow-[8px_8px_0px_#1C1C1C] rotate-1'>
                  <div className='flex justify-between items-center mb-6'>
                    <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 rounded-full border-[2px] border-[#1C1C1C] bg-[#FBC343] animate-pulse shadow-[2px_2px_0px_#1C1C1C]'></div>
                        <span className='text-xs font-black uppercase tracking-widest text-[#1C1C1C]'>Editor Active</span>
                    </div>
                    <div className='bg-white px-4 py-1.5 border-[3px] border-[#1C1C1C] rounded-full flex items-center gap-2 shadow-[4px_4px_0px_#1C1C1C]'>
                        <Sparkles size={16} strokeWidth={3} className='text-[#1C1C1C]' />
                        <span className='text-[10px] font-black uppercase tracking-widest text-[#1C1C1C]'>AI Enhanced</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mb-8 rotate-1">
                      <label className="font-black uppercase tracking-widest text-xs text-[#1C1C1C] pl-2 drop-shadow-[2px_2px_0px_white]">Pasted Notes</label>
                      <textarea 
                        placeholder="Enter or paste your study materials here (lecture notes, article text, etc.)..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className='min-h-[250px] md:min-h-[350px] w-full bg-white border-[3px] border-[#1C1C1C] rounded-3xl p-5 md:p-6 text-base md:text-lg font-bold tracking-tight text-[#1C1C1C] resize-y focus:outline-none focus:shadow-[8px_8px_0px_#FBC343] transition-shadow shadow-[8px_8px_0px_#1C1C1C]'
                      />
                  </div>

                  <div className='flex flex-col sm:flex-row gap-4 sm:gap-6'>
                    <button 
                      onClick={handleProcessNotes} 
                      disabled={isLoading || !notes.trim()}
                      className={cn(
                          'rotate-1 bg-[#1C1C1C] text-white border-[3px] border-[#1C1C1C] font-black uppercase tracking-widest py-4 px-8 md:px-10 text-base md:text-lg rounded-full flex items-center justify-center gap-3 transition-all',
                          isLoading || !notes.trim() ? 'opacity-50 cursor-not-allowed border-transparent shadow-none' : 'hover:translate-x-1 hover:translate-y-1 shadow-[6px_6px_0px_#F4C5C5] hover:shadow-[2px_2px_0px_#F4C5C5] active:shadow-none active:translate-x-2 active:translate-y-2'
                      )}
                    >
                      {isLoading ? (
                        <div className='flex items-center gap-3'>
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                <Sparkles size={24} strokeWidth={3} />
                            </motion.div>
                            Processing...
                        </div>
                      ) : <><Send size={24} strokeWidth={3} /> Process Notes</>}
                    </button>
                    <button 
                        onClick={() => setNotes('')} 
                        className='-rotate-1 bg-white border-[3px] border-[#1C1C1C] text-[#1C1C1C] font-black uppercase tracking-widest py-4 px-8 md:px-10 text-base md:text-lg rounded-full shadow-[6px_6px_0px_#1C1C1C] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_#1C1C1C] hover:bg-[#FBC343] transition-all'
                    >
                        Clear All
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='pb-32'>
                {/* Result Controls */}
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className='flex flex-wrap gap-4 mb-12'
                >
                  <button onClick={() => setResult(null)} className='bg-white font-black text-xs uppercase px-6 py-3 border-[3px] border-[#1C1C1C] rounded-full shadow-[4px_4px_0px_#1C1C1C] hover:translate-y-1 hover:shadow-[0px_0px_0px_#1C1C1C] transition-all'>New Session</button>
                  <button className='bg-[#1C1C1C] text-white font-black text-xs uppercase px-6 py-3 border-[3px] border-[#1C1C1C] shadow-[4px_4px_0px_#FBC343] rounded-full hover:translate-y-1 hover:shadow-[0px_0px_0px_#FBC343] transition-all'>Export PDF</button>
                  <button className='bg-[#F4C5C5] font-black text-[#1C1C1C] text-xs uppercase px-6 py-3 border-[3px] border-[#1C1C1C] shadow-[4px_4px_0px_#1C1C1C] rounded-full hover:translate-y-1 hover:shadow-[0px_0px_0px_#1C1C1C] transition-all'>Save Session</button>
                </motion.div>

                {/* Tabs */}
                <div className='flex flex-col sm:flex-row border-[3px] border-[#1C1C1C] mb-12 shadow-[8px_8px_0px_#1C1C1C] rounded-[2rem] overflow-hidden bg-white'>
                  {[
                    { id: 'summary', label: 'Detailed Summary', icon: BookOpen },
                    { id: 'keyPoints', label: 'Key Components', icon: List },
                    { id: 'quiz', label: 'Practice Quiz', icon: HelpCircle }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-3 p-4 md:p-6 font-black uppercase sm:border-r-[3px] border-b-[3px] sm:border-b-0 last:border-r-0 last:border-b-0 border-[#1C1C1C] transition-all text-sm md:text-base',
                        activeTab === tab.id ? 'bg-[#FBC343] text-[#1C1C1C] shadow-[inset_0px_4px_10px_rgba(0,0,0,0.1)]' : 'bg-white hover:bg-[#E5E5E5] text-[#1C1C1C]'
                      )}
                    >
                      <tab.icon size={24} strokeWidth={3} />
                      <span className='tracking-tighter'>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Content Area */}
                <AnimatePresence mode='wait'>
                    <motion.div 
                        key={activeTab}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {activeTab === 'summary' && (
                            <div className='flex flex-col gap-8'>
                                {result.summary.map((paragraph, i) => (
                                    <motion.div key={i} variants={itemVariants}>
                                        <div className='p-8 border-[3px] border-[#1C1C1C] bg-white rounded-3xl shadow-[8px_8px_0px_#1C1C1C] hover:shadow-[4px_4px_0px_#1C1C1C] hover:translate-x-1 hover:translate-y-1 transition-all rotate-1'>
                                            <div className='flex gap-6 items-start'>
                                                <div className='w-12 h-12 bg-[#A5D5D5] text-[#1C1C1C] flex items-center justify-center font-black rounded-xl border-[3px] border-[#1C1C1C] shrink-0 -rotate-3 text-xl shadow-[4px_4px_0px_#1C1C1C]'>
                                                    {i + 1}
                                                </div>
                                                <p className='text-xl font-bold leading-[1.8] text-[#1C1C1C]'>{paragraph}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'keyPoints' && (
                            <div className='grid md:grid-cols-2 gap-8'>
                                {result.keyPoints.map((point, i) => (
                                    <motion.div key={i} variants={itemVariants}>
                                        <div className={cn('p-8 border-[3px] border-[#1C1C1C] h-full shadow-[8px_8px_0px_#1C1C1C] transition-all rounded-4xl', i % 2 === 0 ? 'bg-[#1C1C1C] text-white -rotate-1' : 'bg-[#F4C5C5] text-[#1C1C1C] rotate-1')}>
                                            <div className='flex items-start gap-5'>
                                                <CheckCircle2 size={32} strokeWidth={3} className={i % 2 === 0 ? 'text-[#FBC343]' : 'text-[#1C1C1C]'} />
                                                <p className='text-xl font-black uppercase leading-tight tracking-tight'>{point}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'quiz' && (
                            <motion.div variants={itemVariants} className='flex flex-col gap-10 overflow-hidden pb-10'>
                                <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                                    <h3 className='text-3xl md:text-5xl font-black uppercase text-[#1C1C1C] tracking-tighter rounded-full border-[3px] border-[#1C1C1C] px-6 md:px-8 py-2 md:py-3 bg-[#A5D5D5] shadow-[6px_6px_0px_#1C1C1C] -rotate-1'>Exam Challenge</h3>
                                    <div className='bg-[#1C1C1C] text-white border-[3px] border-[#1C1C1C] px-5 md:px-6 py-2 md:py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-[6px_6px_0px_#FBC343] rotate-2'>
                                        {result.mcqs.length} Questions
                                    </div>
                                </div>
                                <QuizComponent mcqs={result.mcqs} />
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Internal Quiz Component
const QuizComponent: React.FC<{ mcqs: any[] }> = ({ mcqs }) => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleSubmit = () => {
        let currentScore = 0;
        mcqs.forEach((q, i) => {
            if (answers[i] === q.answer) currentScore++;
        });
        setScore(currentScore);
        setSubmitted(true);
    };

    return (
        <div className='flex flex-col gap-16'>
            {mcqs.map((q, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className='flex flex-col gap-6 md:gap-8 p-6 md:p-10 bg-white border-[3px] border-[#1C1C1C] shadow-[8px_8px_0px_#1C1C1C] rounded-4xl'
                >
                    <div className='flex items-center gap-4 md:gap-6'>
                        <span className='w-12 h-12 md:w-16 md:h-16 bg-[#FBC343] text-[#1C1C1C] flex items-center justify-center font-black rounded-2xl md:rounded-[2rem] border-[3px] border-[#1C1C1C] rotate-3 shrink-0 text-2xl md:text-3xl shadow-[4px_4px_0px_#1C1C1C]'>{i + 1}</span>
                        <h4 className='text-xl md:text-3xl font-black tracking-tighter text-[#1C1C1C]'>{q.question}</h4>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                        {q.options.map((option: string) => {
                            const isSelected = answers[i] === option;
                            const isCorrect = submitted && option === q.answer;
                            const isWrong = submitted && isSelected && option !== q.answer;
                            
                            return (
                                <button 
                                    key={option}
                                    disabled={submitted}
                                    onClick={() => setAnswers({...answers, [i]: option})}
                                    className={cn(
                                        'py-4 md:py-6 font-bold transition-all text-left px-6 md:px-8 border-[3px] border-[#1C1C1C] rounded-2xl text-base md:text-xl hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1C1C1C] text-[#1C1C1C]',
                                        isSelected && !submitted ? 'bg-[#1C1C1C] text-white shadow-none translate-x-1 translate-y-1' : 'bg-white shadow-[6px_6px_0px_#1C1C1C]',
                                        isCorrect ? 'bg-[#A5D5D5] text-[#1C1C1C] shadow-[0px_0px_0px_transparent] translate-x-1 translate-y-1 border-[3px]' : '',
                                        isWrong ? 'bg-[#F4C5C5] text-[#1C1C1C] shadow-none translate-x-1 translate-y-1 border-dashed' : ''
                                    )}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            ))}

            {!submitted ? (
                <div className='sticky bottom-10 flex justify-center'>
                    <button 
                        onClick={handleSubmit} 
                        disabled={Object.keys(answers).length < mcqs.length}
                        className={cn(
                            'border-[3px] border-[#1C1C1C] font-black uppercase text-xl md:text-2xl py-4 md:py-6 px-10 md:px-16 rounded-full transition-all tracking-wider',
                            Object.keys(answers).length < mcqs.length ? 'bg-[#E5E5E5] text-[#1C1C1C]/40 opacity-50 cursor-not-allowed shadow-none' : 'bg-[#1C1C1C] text-[#FBC343] shadow-[8px_8px_0px_#FBC343] hover:shadow-none hover:translate-x-2 hover:translate-y-2'
                        )}
                    >
                        Finish & Grade
                    </button>
                </div>
            ) : (
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className='bg-[#1C1C1C] text-white p-8 md:p-16 rounded-[3rem] md:rounded-[4rem] flex flex-col items-center gap-6 md:gap-8 border-[3px] border-[#FBC343] shadow-[12px_12px_0px_#1C1C1C] relative overflow-hidden -rotate-1 mt-10'
                >
                    <div className='absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-[#A5D5D5] -translate-x-12 md:-translate-x-16 -translate-y-12 md:-translate-y-16 animate-pulse border-[3px] border-[#1C1C1C] rounded-full shadow-[4px_4px_0px_#FBC343]'></div>
                    <div className='absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 bg-[#F4C5C5] -rotate-12 -translate-x-4 md:-translate-x-8 translate-y-4 md:translate-y-8 border-[3px] border-[#1C1C1C] rounded-2xl'></div>
                    
                    <motion.div 
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 10 }}
                        transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
                        className='bg-[#FBC343] border-[3px] border-[#1C1C1C] text-[#1C1C1C] px-5 py-2 rounded-full text-[10px] md:text-sm font-black uppercase tracking-widest shadow-[4px_4px_0px_#1C1C1C]'
                    >
                        Quiz Complete!
                    </motion.div>
                    
                    <div className='text-3xl md:text-4xl font-black uppercase tracking-tighter drop-shadow-[2px_2px_0px_#F4C5C5] text-center'>Your Readiness Score:</div>
                    <div className='text-7xl md:text-[10rem] font-black text-[#A5D5D5] leading-none drop-shadow-[8px_8px_0px_#1C1C1C]'>{Math.round((score / mcqs.length) * 100)}%</div>
                    <p className='text-base md:text-xl font-bold uppercase tracking-widest text-[#FDFBF7]/80 text-center max-w-md'>
                        {score === mcqs.length ? "Perfect Score! You're ready for the exam! 🔥" : "Great effort! A bit more review and you'll be a pro."}
                    </p>
                    
                    <div className='flex flex-col sm:flex-row gap-4 md:gap-6 mt-4 md:mt-8 w-full sm:w-auto'>
                        <button onClick={() => { setSubmitted(false); setAnswers({}); }} className='bg-white text-[#1C1C1C] border-[3px] border-[#1C1C1C] font-black uppercase rounded-full px-8 md:px-10 py-4 md:py-5 shadow-[6px_6px_0px_#F4C5C5] hover:-translate-y-1 hover:shadow-[10px_10px_0px_#F4C5C5] transition-all rotate-1'>
                            Retry Quiz
                        </button>
                        <button className='bg-[#A5D5D5] text-[#1C1C1C] hover:bg-[#FBC343] border-[3px] border-[#1C1C1C] font-black uppercase rounded-full px-8 md:px-10 py-4 md:py-5 shadow-[6px_6px_0px_#1C1C1C] hover:-translate-y-1 transition-all -rotate-1'>
                            Export Results
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default StudySession;
