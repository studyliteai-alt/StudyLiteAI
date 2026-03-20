import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './Sidebar.tsx';
import { TopBar } from './TopBar.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { db } from '../../services/firebase.ts';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';
import { cn } from '../../utils/cn.ts';

const ChatView: React.FC = () => {
    const { user } = useAuth();
    const { lowDataMode } = useTheme();
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch Messages from Firestore
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'chat_messages'),
            where('userId', '==', user.uid),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (msgs.length === 0) {
                setMessages([{ id: 'default', role: 'ai', content: "Hello! I'm your StudyLite AI assistant. How can I help you study today?" }]);
            } else {
                setMessages(msgs);
            }
        });

        return () => unsubscribe();
    }, [user]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !user) return;

        const userContent = input;
        setInput('');
        
        try {
            // 1. Add User Message to Firestore
            await addDoc(collection(db, 'chat_messages'), {
                userId: user.uid,
                role: 'user',
                content: userContent,
                timestamp: serverTimestamp()
            });

            setIsTyping(true);

            // Simulate AI response for now (to be replaced by actual AI service later)
            setTimeout(async () => {
                await addDoc(collection(db, 'chat_messages'), {
                    userId: user.uid,
                    role: 'ai',
                    content: `Let's dive into ${userContent}. I can break this topic down into smaller chunks, create flashcards, or quiz you on the core concepts. What works best for you?`,
                    timestamp: serverTimestamp()
                });
                setIsTyping(false);
                
                // Award XP for chatting
                await updateDoc(doc(db, 'users', user.uid), {
                    xp: increment(5)
                });
            }, 1000);

        } catch (error) {
            console.error("Error sending message:", error);
            setIsTyping(false);
        }
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
                    <div className="max-w-6xl mx-auto w-full px-4 pt-10 md:px-10 flex items-center justify-between border-b-2 border-[#1C1C1C]/10 pb-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-[#1C1C1C]">Neural Assistant</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1C]/40 mt-1">Direct link to Core Intelligence</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 bg-[#34A853] rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#1C1C1C]/40">Active Uplink</span>
                        </div>
                    </div>
                    {/* Chat Messages Area - Harmonized Max Width */}
                    <div className="grow overflow-y-auto scrollbar-hide">
                        <div className="max-w-6xl mx-auto w-full px-4 py-6 md:px-10 md:py-10 space-y-8">
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex items-start gap-4 md:gap-8",
                                            msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                        )}
                                    >
                                        {/* Avatar Sticker - More distinctive */}
                                        <div className={cn(
                                            "w-10 h-10 md:w-14 md:h-14 rounded-2xl md:rounded-3xl border-4 border-[#1C1C1C] flex items-center justify-center shrink-0 shadow-[4px_4px_0px_#1C1C1C] transition-all hover:scale-110 group-hover:rotate-6",
                                            msg.role === 'user' ? "bg-white rotate-3" : "bg-[#FBC343] -rotate-3"
                                        )}>
                                            {msg.role === 'user' ? <User size={24} strokeWidth={3} /> : <Bot size={24} strokeWidth={3} />}
                                        </div>

                                        {/* Message Bubble Card - Wider and more prominent */}
                                        <div className={cn(
                                            "group relative max-w-[92%] md:max-w-4xl w-full border-4 border-[#1C1C1C] p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-[6px_6px_0px_#1C1C1C] transition-all",
                                            msg.role === 'user'
                                                ? "bg-[#F4C5C5] rounded-tr-none hover:-translate-x-1"
                                                : "bg-white rounded-tl-none hover:translate-x-1"
                                        )}>
                                            {/* Neo-brutalist "Tape" or label - More substantial */}
                                            <div className={cn(
                                                "absolute -top-4 px-4 py-1.5 border-[3px] border-[#1C1C1C] text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_#1C1C1C]",
                                                msg.role === 'user' ? "right-6 bg-[#A5D5D5] rotate-1" : "left-6 bg-[#FBC343] -rotate-1"
                                            )}>
                                                {msg.role === 'user' ? 'Direct Input' : 'Core Intelligence'}
                                            </div>

                                            <p className={cn(
                                                "font-bold leading-relaxed text-[#1C1C1C] whitespace-pre-wrap",
                                                msg.role === 'ai' ? "text-lg md:text-xl tracking-tight" : "text-base md:text-lg"
                                            )}>
                                                {msg.content}
                                            </p>

                                            <div className={cn(
                                                "mt-4 flex opacity-0 group-hover:opacity-100 transition-opacity",
                                                msg.role === 'user' ? "justify-end" : "justify-start"
                                            )}>
                                                <button className="px-3 py-1 bg-white border-2 border-[#1C1C1C] rounded-lg shadow-[2px_2px_0px_#1C1C1C] text-[9px] font-black uppercase tracking-widest text-[#1C1C1C] hover:bg-[#FDFBF7] transition-all">Copy Response</button>
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
                                className="relative flex items-center bg-white border-4 border-[#1C1C1C] rounded-2xl md:rounded-4xl p-2 md:p-3 shadow-[8px_8px_0px_#1C1C1C] md:shadow-[14px_14px_0px_#1C1C1C] focus-within:shadow-[12px_12px_0px_#FBC343] md:focus-within:shadow-[18px_18px_0px_#FBC343] transition-all rotate-0"
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
