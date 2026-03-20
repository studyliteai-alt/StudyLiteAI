import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './Sidebar.tsx';
import { TopBar } from './TopBar.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.tsx';
import { cn } from '../../utils/cn.ts';

const ChatView: React.FC = () => {
    const { lowDataMode } = useTheme();
    const [messages, setMessages] = useState([
        { id: 1, role: 'ai', content: "Hello! I'm your StudyLite AI assistant. How can I help you study today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        // Add user message
        const newUserMsg = { id: Date.now(), role: 'user', content: input };
        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = {
                id: Date.now() + 1,
                role: 'ai',
                content: `Let's dive into ${newUserMsg.content}. I can break this topic down into smaller chunks, create flashcards, or quiz you on the core concepts. What works best for you?`
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className='flex bg-[#FDFBF7] overflow-hidden font-inter text-[#1C1C1C] relative neo-dashboard-layout h-screen'>
            {/* Background Grid */}
            {!lowDataMode && (
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#1c1c1c 2px, transparent 2px), linear-gradient(90deg, #1c1c1c 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
            )}

            <Sidebar />

            <div className='flex flex-col grow overflow-hidden relative z-10'>
                <TopBar />

                <main className='grow flex flex-col relative overflow-hidden'>
                    {/* Chat Messages Area - Harmonized Max Width */}
                    <div className="grow overflow-y-auto scrollbar-hide">
                        <div className="max-w-6xl mx-auto w-full px-4 py-6 md:px-10 md:py-10 space-y-8">
                            <AnimatePresence initial={false}>
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex items-start gap-3 md:gap-6",
                                            msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                        )}
                                    >
                                        {/* Avatar Sticker - Slightly smaller on mobile */}
                                        <div className={cn(
                                            "w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl border-[3px] border-[#1C1C1C] flex items-center justify-center shrink-0 shadow-[4px_4px_0px_#1C1C1C] transition-transform hover:scale-110",
                                            msg.role === 'user' ? "bg-white rotate-6" : "bg-[#FBC343] -rotate-6"
                                        )}>
                                            {msg.role === 'user' ? <User size={20} strokeWidth={3} /> : <Bot size={20} strokeWidth={3} />}
                                        </div>

                                        {/* Message Bubble Card - Reduced Font Size */}
                                        <div className={cn(
                                            "group relative max-w-[88%] md:max-w-[80%] border-[3px] border-[#1C1C1C] p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-[5px_5px_0px_#1C1C1C] transition-all",
                                            msg.role === 'user'
                                                ? "bg-[#F4C5C5] rounded-tr-none hover:-translate-x-1"
                                                : "bg-white rounded-tl-none hover:translate-x-1"
                                        )}>
                                            {/* Neo-brutalist "Tape" or label - More concise */}
                                            <div className={cn(
                                                "absolute -top-3 px-2 py-0.5 border-[2px] border-[#1C1C1C] text-[9px] font-black uppercase tracking-widest shadow-[2px_2px_0px_#1C1C1C]",
                                                msg.role === 'user' ? "right-4 bg-[#A5D5D5] rotate-2" : "left-4 bg-[#FBC343] -rotate-2"
                                            )}>
                                                {msg.role === 'user' ? 'Student' : 'Tutor'}
                                            </div>

                                            <p className="font-bold text-sm md:text-base leading-relaxed text-[#1C1C1C] whitespace-pre-wrap">
                                                {msg.content}
                                            </p>

                                            <div className={cn(
                                                "mt-3 flex opacity-0 group-hover:opacity-100 transition-opacity",
                                                msg.role === 'user' ? "justify-end" : "justify-start"
                                            )}>
                                                <button className="text-[9px] font-black uppercase tracking-widest text-[#1C1C1C]/40 hover:text-[#1C1C1C]">Copy</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-3 flex-row"
                                >
                                    <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl border-[3px] border-[#1C1C1C] flex items-center justify-center shrink-0 shadow-[4px_4px_0px_#1C1C1C] bg-[#FBC343] -rotate-6 animate-pulse">
                                        <Bot size={20} strokeWidth={3} />
                                    </div>
                                    <div className="bg-white border-[3px] border-[#1C1C1C] p-3 md:p-4 rounded-2xl md:rounded-3xl rounded-tl-none shadow-[4px_4px_0px_#1C1C1C]">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-[#1C1C1C] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                            <div className="w-1.5 h-1.5 bg-[#1C1C1C] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-1.5 h-1.5 bg-[#1C1C1C] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} className="h-24" />
                        </div>
                    </div>

                    {/* Floating-style Input Area - Harmonized Max Width */}
                    <div className="px-4 py-6 md:px-10 md:py-8 relative pointer-events-none">
                        <div className="max-w-6xl mx-auto w-full pointer-events-auto">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="relative flex items-center bg-white border-[3px] md:border-4 border-[#1C1C1C] rounded-2xl md:rounded-3xl p-1.5 md:p-2 shadow-[6px_6px_0px_#1C1C1C] md:shadow-[10px_10px_0px_#1C1C1C] focus-within:shadow-[8px_8px_0px_#FBC343] md:focus-within:shadow-[14px_14px_0px_#FBC343] transition-all rotate-0 hover:-rotate-0.5"
                            >
                                <div className="pl-3 md:pl-6 text-[#1C1C1C]/30 shrink-0">
                                    <Sparkles size={22} strokeWidth={3} />
                                </div>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Message StudyLite AI..."
                                    className="grow bg-transparent border-none py-3 md:py-5 px-3 md:px-6 text-sm md:text-lg font-black placeholder:text-[#1C1C1C]/20 focus:outline-none text-[#1C1C1C]"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className={cn(
                                        "w-10 h-10 md:w-14 md:h-14 flex items-center justify-center border-[3px] border-[#1C1C1C] rounded-xl transition-all shadow-[3px_3px_0px_#1C1C1C] md:shadow-[4px_4px_0px_#1C1C1C] active:shadow-none active:translate-x-1 active:translate-y-1 shrink-0",
                                        input.trim()
                                            ? "bg-[#FBC343] text-[#1C1C1C] hover:rotate-6"
                                            : "bg-gray-100 text-[#1C1C1C]/20 grayscale cursor-not-allowed"
                                    )}
                                >
                                <Send size={24} strokeWidth={3} />
                                </button>
                            </motion.div>
                            <p className="text-center mt-4 md:mt-6 text-[9px] font-black uppercase tracking-widest text-[#1C1C1C]/30 hidden sm:block">
                                Press Enter to send · StudyLite AI can make mistakes. Verify important info.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ChatView;
