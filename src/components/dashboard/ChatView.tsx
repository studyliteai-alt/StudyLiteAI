import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../../services/ai';
import {
    Send,
    Sparkles,
    Plus,
    Mic,
    MicOff,
    ChevronDown,
    FileText,
    Lightbulb,
    Brain,
    Calculator,
    Copy,
    Edit3,
    ThumbsUp,
    ThumbsDown,
    RotateCcw,
    Check,
    X,
    File
} from 'lucide-react';
import { Logo } from '../Logo';
import { UserProfile } from './types';

interface AttachedFile {
    id: string;
    file: File;
    preview: string;
    type: 'image' | 'file';
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    feedback?: 'like' | 'dislike' | null;
    attachments?: AttachedFile[];
}

export const ChatView = ({ itemVariants: _itemVariants, userData, onSaveSession }: { itemVariants: any, userData: UserProfile, onSaveSession?: (title: string, summary: string) => void }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [savedMessageIds, setSavedMessageIds] = useState<Set<string>>(new Set());
    const [input, setInput] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editInput, setEditInput] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [chatMode, setChatMode] = useState<'Normal' | 'Simplify' | 'Summarize'>('Normal');
    const [isRecording, setIsRecording] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0])
                    .map((result: any) => result.transcript)
                    .join('');
                setInput(transcript);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
            setIsRecording(true);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newAttachedFiles: AttachedFile[] = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
            type: file.type.startsWith('image/') ? 'image' : 'file'
        }));
        setAttachedFiles(prev => [...prev, ...newAttachedFiles]);
    };

    const removeFile = (id: string) => {
        setAttachedFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleSend = async (overrideInput?: string | React.MouseEvent) => {
        const textToSend = typeof overrideInput === 'string' ? overrideInput : input;
        if (!textToSend.trim() && attachedFiles.length === 0) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: textToSend,
            sender: 'user',
            timestamp: new Date(),
            attachments: [...attachedFiles]
        };

        setMessages((prev: Message[]) => [...prev, userMsg]);
        setInput('');
        setAttachedFiles([]);
        setIsTyping(true);


        const response = await aiService.getChatResponse(textToSend);

        const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: response,
            sender: 'ai',
            timestamp: new Date()
        };
        setMessages((prev: Message[]) => [...prev, aiMsg]);
        setIsTyping(false);
    };

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleFeedback = (id: string, type: 'like' | 'dislike') => {
        setMessages(prev => prev.map(msg =>
            msg.id === id ? { ...msg, feedback: msg.feedback === type ? null : type } : msg
        ));
    };

    const handleSaveToHistory = (msg: Message) => {
        if (!onSaveSession || savedMessageIds.has(msg.id)) return;

        // Find the user message before this AI message for the title
        const msgIndex = messages.findIndex(m => m.id === msg.id);
        const userMsg = msgIndex > 0 ? messages[msgIndex - 1] : null;
        const title = userMsg ? userMsg.text.substring(0, 30) : "AI Chat Session";

        onSaveSession(title, msg.text);
        setSavedMessageIds(prev => new Set(prev).add(msg.id));
    };

    const startEdit = (msg: Message) => {
        setEditingId(msg.id);
        setEditInput(msg.text);
    };

    const saveEdit = async () => {
        if (!editingId || !editInput.trim()) return;
        const msgIndex = messages.findIndex(m => m.id === editingId);
        const newHistory = messages.slice(0, msgIndex);
        setMessages(newHistory);
        setEditingId(null);
        handleSend(editInput);
    };

    const handleRegenerate = async (lastUserMsgText: string) => {
        setMessages(prev => prev.slice(0, -1));
        setIsTyping(true);
        const response = await aiService.getChatResponse(lastUserMsgText);
        const aiMsg: Message = {
            id: Date.now().toString(),
            text: response,
            sender: 'ai',
            timestamp: new Date()
        };
        setMessages((prev: Message[]) => [...prev, aiMsg]);
        setIsTyping(false);
    };

    const quickActions = [
        { icon: <FileText size={16} className="text-blue-400" />, label: 'Summarize notes' },
        { icon: <Lightbulb size={16} className="text-yellow-400" />, label: 'Explain concept' },
        { icon: <Brain size={16} className="text-pink-400" />, label: 'Practice quiz' },
        { icon: <Calculator size={16} className="text-green-400" />, label: 'Solve math' },
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            className="flex-grow flex flex-col overflow-hidden text-black h-[calc(100vh-140px)] relative bg-transparent"
        >
            {/* Main Chat/Welcome Area */}
            <div className={`flex-grow w-full relative flex flex-col ${messages.length === 0 ? 'justify-center overflow-hidden' : 'overflow-y-auto no-scrollbar'}`}>
                <div className={`max-w-3xl mx-auto px-6 w-full flex flex-col items-center ${messages.length === 0 ? 'py-0' : 'py-6'}`}>
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center w-full max-w-2xl">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="mb-4"
                            >
                                <Logo size={42} />
                            </motion.div>
                            <h2 className="text-2xl font-black mb-10 tracking-tight leading-tight">
                                How can I help you <br /> study today?
                            </h2>
                            <motion.div
                                variants={{
                                    visible: { transition: { staggerChildren: 0.1 } }
                                }}
                                className="grid grid-cols-2 gap-3 w-full max-w-lg mb-10"
                            >
                                {quickActions.map((action, i) => (
                                    <motion.button
                                        key={i}
                                        variants={{
                                            hidden: { y: 20, opacity: 0 },
                                            visible: { y: 0, opacity: 1 }
                                        }}
                                        whileHover={{ scale: 1.02, translateY: -3 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleSend(action.label)}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-white border-2 border-black text-left group shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] transition-all"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-[#FFFDF5] border-2 border-black flex items-center justify-center group-hover:bg-[#FED766] transition-colors">
                                            {action.icon}
                                        </div>
                                        <span className="text-xs font-black text-black leading-tight">{action.label}</span>
                                    </motion.button>
                                ))}
                            </motion.div>

                            {/* Gemini-style Center Input */}
                            <div className="w-full">
                                {renderInputArea()}
                            </div>
                        </div>
                    ) : (
                        messages.map((msg: Message, idx) => (
                            <motion.div
                                key={msg.id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className={`group flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} w-full mb-6`}
                            >
                                <div className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className="flex-shrink-0 pt-1">
                                        {msg.sender === 'user' ? (
                                            <div className="w-8 h-8 rounded-full border-2 border-black overflow-hidden shadow-sm hover:scale-110 transition-transform">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.avatarSeed}`}
                                                    alt={userData.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white shadow-sm overflow-hidden hover:scale-110 transition-transform">
                                                <Logo size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end text-right' : 'items-start text-left'}`}>
                                        <div className="flex items-center gap-2 mb-1.5 px-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                                {msg.sender === 'user' ? 'You' : 'StudyLite AI'}
                                            </span>
                                        </div>

                                        {/* Attachments Preview in Message */}
                                        {msg.attachments && msg.attachments.length > 0 && (
                                            <div className={`flex flex-wrap gap-2 mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                {msg.attachments.map(file => (
                                                    <div key={file.id} className="relative group/attach">
                                                        {file.type === 'image' ? (
                                                            <img src={file.preview} className="w-48 h-32 object-cover rounded-xl border border-zinc-200 shadow-sm" alt="attachment" />
                                                        ) : (
                                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200 min-w-[160px]">
                                                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                                                    <File size={20} className="text-dash-primary" />
                                                                </div>
                                                                <div className="flex flex-col text-left">
                                                                    <span className="text-[10px] font-black truncate max-w-[100px]">{file.file.name}</span>
                                                                    <span className="text-[8px] text-zinc-400">Document</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className={`px-4 py-3 rounded-xl font-bold text-xs leading-relaxed whitespace-pre-wrap border-2 border-black transition-all duration-200 shadow-[3px_3px_0px_0px_#000] ${msg.sender === 'user'
                                            ? 'bg-[#FED766] text-black rounded-tr-none'
                                            : 'bg-white text-zinc-800 rounded-tl-none'
                                            }`}>
                                            {editingId === msg.id ? (
                                                <div className="flex flex-col gap-3 min-w-[200px]">
                                                    <textarea
                                                        value={editInput}
                                                        onChange={(e) => setEditInput(e.target.value)}
                                                        className="w-full bg-zinc-900/50 rounded-xl p-3 font-bold text-sm text-white focus:outline-none min-h-[100px] resize-none border border-white/10"
                                                        autoFocus
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition-colors flex items-center gap-1.5">
                                                            <X size={14} strokeWidth={3} />
                                                            <span className="text-[10px] font-black uppercase">Cancel</span>
                                                        </button>
                                                        <button onClick={saveEdit} className="px-3 py-1.5 rounded-lg bg-white text-black hover:opacity-80 transition-all flex items-center gap-1.5">
                                                            <Check size={14} strokeWidth={3} />
                                                            <span className="text-[10px] font-black uppercase">Update</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                msg.text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                                                    if (part.startsWith('**') && part.endsWith('**')) {
                                                        return <span key={i} className="text-dash-primary font-black drop-shadow-sm">{part.slice(2, -2)}</span>;
                                                    }
                                                    return part;
                                                })
                                            )}
                                        </div>

                                        {/* Action Bar */}
                                        {!editingId && (
                                            <div className={`flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity px-1 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                {msg.sender === 'user' ? (
                                                    <button onClick={() => startEdit(msg)} className="p-2 rounded-lg hover:bg-white/50 hover:shadow-sm text-zinc-400 hover:text-black transition-all">
                                                        <Edit3 size={14} />
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button onClick={() => handleCopy(msg.text, msg.id)} className={`p-2 rounded-lg transition-all ${copiedId === msg.id ? 'bg-green-50/50 text-green-600 shadow-sm border border-green-100' : 'hover:bg-white/50 hover:shadow-sm text-zinc-400 hover:text-black'}`}>
                                                            {copiedId === msg.id ? <Check size={14} /> : <Copy size={14} />}
                                                        </button>
                                                        <button onClick={() => handleFeedback(msg.id, 'like')} className={`p-2 rounded-lg transition-all ${msg.feedback === 'like' ? 'bg-blue-50/50 text-blue-600 shadow-sm border border-blue-100' : 'hover:bg-white/50 hover:shadow-sm text-zinc-400 hover:text-black'}`}>
                                                            <ThumbsUp size={14} fill={msg.feedback === 'like' ? 'currentColor' : 'none'} />
                                                        </button>
                                                        <button onClick={() => handleFeedback(msg.id, 'dislike')} className={`p-2 rounded-lg transition-all ${msg.feedback === 'dislike' ? 'bg-red-50/50 text-red-600 shadow-sm border border-red-100' : 'hover:bg-white/50 hover:shadow-sm text-zinc-400 hover:text-black'}`}>
                                                            <ThumbsDown size={14} fill={msg.feedback === 'dislike' ? 'currentColor' : 'none'} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleSaveToHistory(msg)}
                                                            className={`p-2 rounded-lg transition-all ${savedMessageIds.has(msg.id) ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'hover:bg-white/50 text-zinc-400 hover:text-black'}`}
                                                            title="Save to History"
                                                        >
                                                            <Sparkles size={14} fill={savedMessageIds.has(msg.id) ? 'currentColor' : 'none'} />
                                                        </button>
                                                        {idx === messages.length - 1 && (
                                                            <button onClick={() => messages[idx - 1]?.sender === 'user' && handleRegenerate(messages[idx - 1].text)} className="p-2 rounded-lg hover:bg-white/50 hover:shadow-sm text-zinc-400 hover:text-black transition-all">
                                                                <RotateCcw size={14} />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4 w-full justify-start"
                        >
                            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white shadow-sm overflow-hidden">
                                <Logo size={20} />
                            </div>
                            <div className="flex gap-2 items-center px-4 py-3 bg-white border-2 border-black rounded-xl rounded-tl-none shadow-[3px_3px_0px_0px_#000]">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            y: [0, -6, 0],
                                        }}
                                        transition={{
                                            duration: 0.6,
                                            repeat: Infinity,
                                            delay: i * 0.1
                                        }}
                                        className="w-1.5 h-1.5 bg-dash-primary rounded-full border border-black"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Fixed Bottom Input Area (Only when chatting) */}
            {messages.length > 0 && (
                <div className="w-full bg-[#FFFDF5]/90 backdrop-blur-md border-t-2 border-black p-3 pb-5 z-20">
                    <div className="max-w-3xl mx-auto w-full">
                        {renderInputArea()}
                    </div>
                </div>
            )}
        </motion.div>
    );

    function renderInputArea() {
        return (
            <>
                {/* Attached Files Preview Bar */}
                <AnimatePresence>
                    {attachedFiles.length > 0 && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="flex flex-wrap gap-2 mb-3 p-3 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000]"
                        >
                            {attachedFiles.map(file => (
                                <div key={file.id} className="relative group/preview">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-black bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                                        {file.type === 'image' ? (
                                            <img src={file.preview} className="w-full h-full object-cover" alt="preview" />
                                        ) : (
                                            <File size={20} className="text-zinc-400" />
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeFile(file.id)}
                                        aria-label="Remove attachment"
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black text-white border-2 border-white flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity shadow-md hover:bg-red-500"
                                    >
                                        <X size={10} strokeWidth={3} />
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Minimalist Input */}
                <div className="relative bg-white border-2 border-black rounded-xl transition-all p-1.5 pl-3 shadow-[4px_4px_0px_0px_#000] focus-within:shadow-[6px_6px_0px_0px_#000] focus-within:-translate-y-0.5">
                    <div className="flex items-end gap-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            aria-label="Attach files"
                            className="mb-0.5 w-9 h-9 rounded-lg bg-[#FFFDF5] border-2 border-black hover:bg-[#FED766] flex items-center justify-center text-black transition-all active:scale-90"
                        >
                            <Plus size={18} strokeWidth={3} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                            className="hidden"
                        />

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Ask anything..."
                            rows={1}
                            style={{ height: 'auto' }}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
                            }}
                            className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-black placeholder:text-zinc-500 px-1 py-2 text-black resize-none no-scrollbar"
                        />

                        <div className="flex items-center gap-2 mb-0.5 pr-0.5">
                            <button
                                onClick={toggleRecording}
                                aria-label={isRecording ? "Stop recording" : "Start voice input"}
                                className={`w-9 h-9 rounded-lg border-2 border-black flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-dash-primary text-black hover:bg-orange-600 hover:text-white shadow-[1px_1px_0px_0px_#000] active:scale-90'}`}
                            >
                                {isRecording ? <MicOff size={16} strokeWidth={3} /> : <Mic size={16} strokeWidth={3} />}
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() && attachedFiles.length === 0}
                                aria-label="Send message"
                                className={`w-9 h-9 rounded-lg border-2 border-black flex items-center justify-center transition-all ${input.trim() || attachedFiles.length > 0 ? 'bg-black text-white hover:bg-zinc-800 shadow-[2px_2px_0px_0px_#000] active:scale-95' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed border-zinc-300 shadow-none'}`}
                            >
                                <Send size={16} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => {
                            const modes: ('Normal' | 'Simplify' | 'Summarize')[] = ['Normal', 'Simplify', 'Summarize'];
                            const nextIndex = (modes.indexOf(chatMode) + 1) % modes.length;
                            setChatMode(modes[nextIndex]);
                        }}
                        className="group flex items-center gap-1.5 px-4 py-1.5 rounded-lg border-2 border-black bg-[#FED766] text-[9px] font-black uppercase tracking-[0.05em] text-black hover:bg-white transition-all shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-y-1 active:shadow-none active:translate-y-1"
                    >
                        <Sparkles size={12} className="text-dash-primary group-hover:rotate-12 transition-transform" />
                        Mode: {chatMode}
                        <ChevronDown size={12} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </>
        );
    }
};
