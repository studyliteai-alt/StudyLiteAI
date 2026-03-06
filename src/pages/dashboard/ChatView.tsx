import React, { useState, useRef, useEffect } from 'react';
import {
    Send,
    Bot,
    User,
    Sparkles,
    Trash2,
    Loader2,
    BookOpen,
    BrainCircuit,
    ArrowDown,
    ThumbsUp,
    Copy,
    Edit2,
    Share2,
    Check
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { aiService } from '../../services/aiService';
import { chatService, ChatMessage } from '../../services/chatService';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/ui/Modal';

interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: Date;
    isLiked?: boolean;
}

export const ChatView = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { showToast } = useToast();
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);

    useEffect(() => {
        const initChat = async () => {
            try {
                // For simplicity, we'll try to get the latest session or create a new one
                const sessions = await chatService.getSessions();
                let currentSession;

                if (sessions.length > 0) {
                    currentSession = sessions[0];
                } else {
                    currentSession = await chatService.createSession('General Study Session');
                }

                setSessionId(currentSession.id);
                const history = await chatService.getMessages(currentSession.id);

                if (history.length > 0) {
                    setMessages(history.map(m => ({
                        id: m.id,
                        role: m.role,
                        content: m.content,
                        timestamp: new Date(m.created_at),
                        isLiked: m.is_liked
                    })));
                } else {
                    // Initial greeting if no history
                    setMessages([
                        {
                            id: 'welcome',
                            role: 'model',
                            content: "Hello! I'm your AI Study Tutor. How can I help you excel today?",
                            timestamp: new Date()
                        }
                    ]);
                }
            } catch (err) {
                console.error('Chat Init Error:', err);
                showToast('Sync Error', 'Could not load conversation history.', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        initChat();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const isScrolledUp = target.scrollHeight - target.scrollTop - target.clientHeight > 200;
        setShowScrollButton(isScrolledUp);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading || !sessionId) return;

        const userContent = input.trim();
        setInput('');
        setIsLoading(true);

        try {
            // Persist user message
            const userMsg = await chatService.saveMessage(sessionId, 'user', userContent);

            const newUserMessage: Message = {
                id: userMsg.id,
                role: 'user',
                content: userContent,
                timestamp: new Date(userMsg.created_at)
            };

            setMessages(prev => [...prev, newUserMessage]);

            const chatHistory = messages
                .filter(m => m.id !== 'welcome')
                .map(m => ({
                    role: m.role,
                    content: m.content
                }));
            chatHistory.push({ role: 'user', content: userContent });

            const response = await aiService.getChatResponse(chatHistory);

            // Persist model response
            const botMsg = await chatService.saveMessage(sessionId, 'model', response);

            const botMessage: Message = {
                id: botMsg.id,
                role: 'model',
                content: response,
                timestamp: new Date(botMsg.created_at)
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            showToast('AI Error', 'Failed to reach the neural engine. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (message: Message) => {
        setEditingId(message.id);
        setEditContent(message.content);
    };

    const saveEdit = async () => {
        if (!editingId) return;
        try {
            await chatService.updateMessage(editingId, editContent);
            setMessages(prev => prev.map(m => m.id === editingId ? { ...m, content: editContent } : m));
            setEditingId(null);
            showToast('Updated', 'Message modified successfully.', 'success');
        } catch (err) {
            showToast('Error', 'Failed to update message.', 'error');
        }
    };

    const handleCopy = (content: string, id: string) => {
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
        showToast('Copied', 'Message copied to clipboard.', 'info');
    };

    const handleLike = async (id: string, currentLike?: boolean) => {
        try {
            const newLike = !currentLike;
            await chatService.toggleLike(id, newLike);
            setMessages(prev => prev.map(m => m.id === id ? { ...m, isLiked: newLike } : m));
        } catch (err) {
            showToast('Error', 'Failed to update preference.', 'error');
        }
    };

    const handleShare = (content: string) => {
        const shareUrl = `${window.location.origin}/dashboard/chat?content=${encodeURIComponent(content)}`;
        navigator.clipboard.writeText(shareUrl);
        showToast('Link Copied', 'Shareable chat link ready.', 'success');
    };

    const confirmClear = async () => {
        if (!sessionId) return;
        try {
            await chatService.deleteSession(sessionId);
            // Re-initialize a new session
            const newSession = await chatService.createSession('General Study Session');
            setSessionId(newSession.id);
            setMessages([
                {
                    id: 'welcome',
                    role: 'model',
                    content: "Hello! I'm your AI Study Tutor. How can I help you excel today?",
                    timestamp: new Date()
                }
            ]);
            setIsClearModalOpen(false);
            showToast('Chat Reset', 'Conversation history cleared.', 'info');
        } catch (err) {
            showToast('Error', 'Failed to clear history.', 'error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col relative animate-in fade-in duration-1000">
            {/* Header / Clear Action */}
            <div className="flex items-center justify-between mb-8 px-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-[#F8D448] to-[#C7D2FE] rounded-xl flex items-center justify-center shadow-sm">
                        <Sparkles className="w-5 h-5 text-white fill-current" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-[#1A1A1A]">AI Tutor</h1>
                    </div>
                </div>
                <button
                    onClick={() => setIsClearModalOpen(true)}
                    className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-400 hover:text-red-500 hover:border-red-100 transition-all active:scale-95"
                    title="Clear Chat"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {/* Messages Area - Minimalist Gemini Style */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 space-y-12 no-scrollbar pb-40"
            >
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className="flex gap-6 group/msg animate-in fade-in slide-in-from-bottom-2 duration-500"
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-100 shadow-sm ${message.role === 'user' ? 'bg-[#C7D2FE] text-[#1E1E1E]' : 'bg-white text-[#F8D448]'
                            }`}>
                            {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 space-y-2 pt-1">
                            {editingId === message.id ? (
                                <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-brandPurple/20 animate-in zoom-in-95">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full bg-transparent border-none focus:ring-0 font-medium text-sm leading-relaxed min-h-[100px] resize-none"
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="px-4 py-2 text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            CANCEL
                                        </button>
                                        <button
                                            onClick={saveEdit}
                                            className="px-6 py-2 bg-brandPurple text-white rounded-xl text-[10px] font-black tracking-widest hover:scale-105 transition-all shadow-lg shadow-brandPurple/20"
                                        >
                                            SAVE CHANGES
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="prose prose-sm max-w-none text-[#1A1A1A] font-medium leading-relaxed prose-p:mb-4">
                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                </div>
                            )}

                            <div className="flex items-center justify-between opacity-0 group-hover/msg:opacity-100 transition-opacity">
                                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest block">
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleLike(message.id, message.isLiked)}
                                        className={`p-1.5 rounded-lg transition-all ${message.isLiked ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-gray-500 hover:bg-gray-50'}`}
                                        title="Like"
                                    >
                                        <ThumbsUp size={12} className={message.isLiked ? 'fill-current' : ''} />
                                    </button>
                                    <button
                                        onClick={() => handleCopy(message.content, message.id)}
                                        className="p-1.5 text-gray-300 hover:text-gray-500 hover:bg-gray-50 rounded-lg transition-all"
                                        title="Copy"
                                    >
                                        {copiedId === message.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                    </button>
                                    {message.role === 'user' && (
                                        <button
                                            onClick={() => handleEdit(message)}
                                            className="p-1.5 text-gray-300 hover:text-gray-500 hover:bg-gray-50 rounded-lg transition-all"
                                            title="Edit"
                                        >
                                            <Edit2 size={12} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleShare(message.content)}
                                        className="p-1.5 text-gray-300 hover:text-gray-500 hover:bg-gray-50 rounded-lg transition-all"
                                        title="Share"
                                    >
                                        <Share2 size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-6 pt-2 animate-in fade-in duration-500">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 text-[#F8D448] shadow-sm animate-pulse">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-3 pt-2">
                            <div className="h-3 bg-gray-100 rounded-full w-3/4 animate-pulse"></div>
                            <div className="h-3 bg-gray-50 rounded-full w-1/2 animate-pulse"></div>
                            <div className="h-3 bg-gray-50 rounded-full w-5/6 animate-pulse"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Scroll to Bottom Button */}
            {showScrollButton && (
                <button
                    onClick={scrollToBottom}
                    className="absolute bottom-40 right-8 w-10 h-10 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-brandPurple hover:scale-110 transition-all animate-in zoom-in-0 duration-300 z-10"
                >
                    <ArrowDown size={18} />
                </button>
            )}

            {/* Fixed Input Bar Container */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-12 pb-4 px-4 pointer-events-none">
                <div className="max-w-3xl mx-auto space-y-4 pointer-events-auto">
                    {/* Quick Suggestions - Subtle */}
                    {!isLoading && messages.length < 3 && (
                        <div className="flex gap-2 overflow-x-auto no-scrollbar justify-center pb-2">
                            {[
                                { label: 'Summarize lessons', icon: BookOpen },
                                { label: 'Quiz me on Data', icon: BrainCircuit },
                                { label: 'Explain concepts', icon: Sparkles }
                            ].map((prompt, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(prompt.label)}
                                    className="px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full text-[10px] font-bold text-gray-500 hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
                                >
                                    <prompt.icon className="w-3 h-3" />
                                    {prompt.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main Input Pill */}
                    <form onSubmit={handleSend} className="relative group transition-all duration-500">
                        {/* Interactive focus ring / glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#F8D448] to-[#C7D2FE] rounded-[32px] blur-lg opacity-0 group-focus-within:opacity-30 transition-opacity"></div>

                        <div className="relative flex items-center bg-white border border-gray-200 rounded-[28px] shadow-2xl h-14 sm:h-16 px-6">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask your tutor anything..."
                                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none font-semibold text-sm sm:text-base placeholder:text-gray-300"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-10 shadow-md group/btn"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Modal
                isOpen={isClearModalOpen}
                onClose={() => setIsClearModalOpen(false)}
                title="Reset Conversation?"
                description="This will clear your current session history."
                icon={Trash2}
            >
                <div className="p-1">
                    <p className="font-bold text-gray-400 text-sm mb-8 leading-relaxed">
                        Are you sure you want to start a fresh session? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={confirmClear}
                            className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-md hover:shadow-none hover:translate-y-0.5 transition-all"
                        >
                            Reset Chat
                        </button>
                        <button
                            onClick={() => setIsClearModalOpen(false)}
                            className="flex-1 bg-gray-50 text-gray-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all"
                        >
                            Stick Around
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
