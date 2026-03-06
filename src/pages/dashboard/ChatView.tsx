import React, { useState, useRef, useEffect } from 'react';
import {
    Send,
    Bot,
    User,
    Sparkles,
    Trash2,
    Loader2,
    BookOpen,
    BrainCircuit
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { aiService } from '../../services/aiService';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/ui/Modal';

interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: Date;
}

export const ChatView = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'model',
            content: "Hello! I'm your AI Study Tutor. I've analyzed your current courses in the Workspace. How can I help you excel today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { showToast } = useToast();
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const chatHistory = messages.map(m => ({
                role: m.role,
                content: m.content
            }));
            chatHistory.push({ role: 'user', content: userMessage.content });

            const response = await aiService.getChatResponse(chatHistory);

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            showToast('AI Error', 'Failed to reach the neural engine. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const confirmClear = () => {
        setMessages([messages[0]]);
        setIsClearModalOpen(false);
        showToast('Chat Reset', 'Conversation history cleared.', 'info');
    };

    return (
        <div className="max-w-3xl mx-auto h-[calc(100vh-160px)] flex flex-col relative animate-in fade-in duration-1000">
            {/* Header / Clear Action */}
            <div className="flex items-center justify-between mb-12 px-4">
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
            <div className="flex-1 overflow-y-auto px-4 space-y-12 no-scrollbar pb-32">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className="flex gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-100 shadow-sm ${message.role === 'user' ? 'bg-[#C7D2FE] text-[#1E1E1E]' : 'bg-white text-[#F8D448]'
                            }`}>
                            {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 space-y-2 pt-1">
                            <div className="prose prose-sm max-w-none text-[#1A1A1A] font-medium leading-relaxed prose-p:mb-4">
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest block">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
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

            {/* Floating Centered Input Container */}
            <div className="absolute bottom-0 inset-x-0 pb-6 px-4">
                <div className="max-w-2xl mx-auto space-y-4">
                    {/* Quick Suggestions - Subtle */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar justify-center">
                        {[
                            { label: 'Summarize lessons', icon: BookOpen },
                            { label: 'Quiz me on Data', icon: BrainCircuit },
                            { label: 'Explain concepts', icon: Sparkles }
                        ].map((prompt, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(prompt.label)}
                                className="px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full text-[10px] font-bold text-gray-500 hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-all flex items-center gap-2 shadow-sm"
                            >
                                <prompt.icon className="w-3 h-3" />
                                {prompt.label}
                            </button>
                        ))}
                    </div>

                    {/* Main Input Pill */}
                    <form onSubmit={handleSend} className="relative group transition-all duration-500">
                        {/* Interactive focus ring / glow */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F8D448] to-[#C7D2FE] rounded-full blur-md opacity-0 group-focus-within:opacity-20 transition-opacity"></div>

                        <div className="relative flex items-center bg-white border border-gray-200 rounded-full shadow-lg h-16 px-6">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask your tutor anything..."
                                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none font-semibold text-sm placeholder:text-gray-300"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="w-10 h-10 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-10 shadow-md group/btn"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />}
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
