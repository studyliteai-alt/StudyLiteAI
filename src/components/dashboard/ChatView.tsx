import { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown, Sparkles, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../services/ai';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../Logo';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    ts: number;
}

const relativeTime = (ts: number): string => {
    const diff = (Date.now() - ts) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
};

interface ChatViewProps {
    isLowData?: boolean;
}

export const ChatView = (_props: ChatViewProps) => {
    const { profile } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLTextAreaElement>(null);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = (smooth = true) => {
        bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    };

    useEffect(() => {
        if (messages.length) scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const container = chatRef.current;
        if (!container) return;
        const onScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 120);
        };
        container.addEventListener('scroll', onScroll);
        return () => container.removeEventListener('scroll', onScroll);
    }, []);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text, ts: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        if (textRef.current) textRef.current.style.height = 'auto';

        try {
            const response = await aiService.getChatResponse(text, profile);
            const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: response, ts: Date.now() };
            setMessages(prev => [...prev, aiMsg]);
        } catch {
            setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: 'I encountered an issue processing your request. Please try again shortly.',
                ts: Date.now()
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const autoGrow = (el: HTMLTextAreaElement) => {
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
    };

    return (
        <div className="flex flex-col h-[calc(100vh-5.5rem)] relative max-w-5xl mx-auto px-4 lg:px-0">
            {/* ── Chat Container ─────────────────────────── */}
            <div className="flex-1 flex flex-col min-h-0 border-none rounded-2xl shadow-sm overflow-hidden relative">

                {/* Messages Area */}
                <div
                    ref={chatRef}
                    className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-6 relative scrollbar-hide"
                >
                    <AnimatePresence mode="popLayout">
                        {messages.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-full gap-8 text-center py-12"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
                                    <Logo size={40} />
                                </div>

                                <div className="space-y-2 max-w-sm">
                                    <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                                        Personal Study Copilot
                                    </h3>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                        Ask me anything about your courses, research, or study materials.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 justify-center max-w-md">
                                    {[
                                        { text: 'Explain Thermodynamics', icon: <Sparkles size={14} /> },
                                        { text: 'Calculus Quiz', icon: <MessageSquare size={14} /> },
                                        { text: 'Summarize Notes', icon: <Sparkles size={14} /> },
                                    ].map((s) => (
                                        <button
                                            key={s.text}
                                            onClick={() => setInput(s.text)}
                                            className="group flex items-center gap-2 px-5 py-2.5 rounded-lg 
                                                       border border-[var(--border)] text-sm font-semibold text-[var(--text-secondary)]
                                                       hover:bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] 
                                                       transition-all active:scale-[0.98]"
                                        >
                                            <span className="text-slate-400 group-hover:text-[var(--accent)]">{s.icon}</span>
                                            {s.text}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            messages.map((m) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={m.id}
                                    className={`flex gap-3 md:gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {m.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center bg-slate-100 border-none text-[var(--accent)] self-start mt-1">
                                            <Logo size={20} />
                                        </div>
                                    )}

                                    <div className={`max-w-[85%] md:max-w-[70%] space-y-1.5 ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                                        <div
                                            className={`px-5 py-3.5 text-[14px] leading-relaxed transition-all
                                                ${m.role === 'user'
                                                    ? 'bg-[var(--accent)] text-white rounded-2xl rounded-tr-sm shadow-sm'
                                                    : 'bg-slate-50  text-[var(--text-primary)] border-none rounded-2xl rounded-tl-sm'}`}
                                        >
                                            {m.role === 'assistant' ? (
                                                <div className="prose prose-sm max-w-none 
                                                                prose-p:leading-relaxed prose-p:mb-3 last:prose-p:mb-0
                                                                prose-pre:bg-slate-900 prose-pre:rounded-xl prose-pre:p-4 prose-pre:my-3
                                                                prose-code:text-[var(--accent)] prose-code:bg-slate-200 dark:prose-code:bg-slate-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                                                                prose-headings:text-[var(--text-primary)] prose-headings:font-bold prose-headings:mb-2
                                                                prose-strong:text-[var(--text-primary)] prose-strong:font-bold
                                                                prose-li:text-[var(--text-secondary)]">
                                                    <ReactMarkdown
                                                        allowedElements={['p', 'strong', 'em', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'br', 'hr', 'a']}
                                                        unwrapDisallowed
                                                    >{m.content}</ReactMarkdown>
                                                </div>
                                            ) : (
                                                <p className="whitespace-pre-wrap font-medium">{m.content}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 px-1">
                                            <time className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {relativeTime(m.ts)}
                                            </time>
                                        </div>
                                    </div>

                                    {m.role === 'user' && (
                                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-[var(--border)] self-start mt-1 bg-slate-100">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.avatarSeed || 'user'}`}
                                                alt="You"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}

                        {loading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-4"
                            >
                                <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center bg-slate-100 border-none text-[var(--accent)] self-start mt-1">
                                    <Logo size={20} />
                                </div>
                                <div className="px-5 py-3.5 bg-slate-50  border-none rounded-2xl rounded-tl-sm flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        {[0, 150, 300].map((d) => (
                                            <span
                                                key={d}
                                                className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/40 animate-pulse"
                                                style={{ animationDelay: `${d}ms` }}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Processing...</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={bottomRef} />
                </div>

                {/* Scroll to bottom button */}
                <AnimatePresence>
                    {showScrollBtn && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            onClick={() => scrollToBottom()}
                            className="absolute bottom-32 right-8 w-12 h-12 rounded-2xl
                                       bg-white border border-slate-200 text-[var(--accent)]
                                       shadow-[0_12px_24px_-8px_rgba(0,0,0,0.15)] flex items-center justify-center
                                       hover:bg-slate-50 hover:border-[var(--accent)]/40 hover:-translate-y-1
                                       transition-all duration-300 z-20"
                        >
                            <ChevronDown size={22} strokeWidth={2.5} />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* ── Input Bar ──────────────────────────── */}
                <div className="shrink-0 p-6 relative">
                    <div className="relative flex items-end gap-2 p-2 border-none rounded-2xl transition-all focus-within:shadow-sm">
                        <div className="hidden sm:flex w-10 h-10 items-center justify-center shrink-0 mb-0.5">
                            <Sparkles size={16} className="text-[var(--accent)] opacity-60" />
                        </div>
                        <textarea
                            ref={textRef}
                            rows={1}
                            value={input}
                            onChange={(e) => { setInput(e.target.value); autoGrow(e.target); }}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent resize-none outline-none text-[15px] font-medium
                                       text-[var(--text-primary)] placeholder:text-slate-400
                                       py-3 px-2 sm:px-2 max-h-40 scrollbar-hide"
                            style={{ minHeight: '48px' }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mb-0.5
                                       transition-all duration-200 disabled:opacity-30
                                       bg-[var(--accent)] text-white shadow-sm hover:brightness-105 active:scale-95"
                        >
                            <Send size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6 pb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                    Personalized AI Tutor · Adaptive Learning System
                </p>
            </div>
        </div>
    );
};
