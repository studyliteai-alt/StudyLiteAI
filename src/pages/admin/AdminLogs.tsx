import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Terminal, Play, Square } from 'lucide-react';

const mockLogs = [
    "[SYS] Authentication service initialized.",
    "[SEC] New login from IP 192.168.1.44 intercepted.",
    "[NET] Firebase connection stable. Latency: 24ms",
    "[DB] Snapshot listener attached to users collection.",
    "[WORKER] Token cleanup job commenced.",
    "[WORKER] Token cleanup job finished. 0 purged.",
    "[PAY] Flutterwave webhook endpoint pinged successfully.",
    "[SEC] Admin override accessed by active session.",
    "[SYS] Memory allocation stable.",
    "[AI] Anthropic API connection established."
];

export const AdminLogs: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [isStreaming, setIsStreaming] = useState(true);

    useEffect(() => {
        if (!isStreaming) return;

        let currentIndex = 0;
        setLogs([mockLogs[0]]);

        const interval = setInterval(() => {
            currentIndex++;
            if (currentIndex < mockLogs.length) {
                setLogs(prev => [...prev, mockLogs[currentIndex]]);
            } else {
                setLogs(prev => [...prev, `[SYS] Heartbeat ping... ${new Date().getTime()}`]);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [isStreaming]);

    return (
        <div className="space-y-8 h-full flex flex-col">
            <header className='mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4'>
                <div>
                    <motion.h1
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className='text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 text-[#1C1C1C] drop-shadow-[2px_2px_0px_white]'
                    >
                        System Logs
                    </motion.h1>
                    <motion.p
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className='font-bold uppercase tracking-widest text-[#1C1C1C]/60 text-xs flex items-center gap-2'
                    >
                        <ShieldAlert size={14} /> Server Diagnostics & Telemetry
                    </motion.p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setIsStreaming(!isStreaming)}
                        className={`flex items-center gap-2 px-6 py-3 border-4 border-[#1C1C1C] rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-[4px_4px_0px_#1C1C1C] hover:-translate-y-1 ${isStreaming ? 'bg-[#F4C5C5] text-[#1C1C1C]' : 'bg-[#A5D5D5] text-[#1C1C1C]'}`}
                    >
                        {isStreaming ? <><Square fill="currentColor" size={14} /> Stop Stream</> : <><Play fill="currentColor" size={14} /> Start Stream</>}
                    </button>
                </div>
            </header>

            <div className="flex-1 bg-[#1C1C1C] border-4 border-[#1C1C1C] shadow-[12px_12px_0px_#A5D5D5] rounded-3xl overflow-hidden flex flex-col min-h-[500px]">
                <div className="bg-[#2D2D2D] border-b-4 border-[#1C1C1C] px-6 py-4 flex items-center gap-3">
                    <Terminal className="text-[#10B981]" size={20} />
                    <span className="text-[#10B981] font-mono font-bold tracking-widest text-xs uppercase">Terminal Process - Tail Logs</span>
                    <div className="ml-auto flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#F4C5C5]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#FBC343]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                    </div>
                </div>
                <div className="p-6 md:p-8 font-mono text-sm overflow-y-auto flex-1 flex flex-col gap-2">
                    {logs.map((log, index) => (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            key={index}
                            className="text-[#10B981]"
                        >
                            <span className="text-white/40 mr-4">[{new Date().toISOString().split('T')[1].slice(0, 8)}]</span>
                            <span dangerouslySetInnerHTML={{ __html: log.replace(/\[(.*?)\]/, '<span class="text-[#FBC343]">[$1]</span>') }} />
                        </motion.div>
                    ))}
                    {isStreaming && (
                        <motion.div 
                            animate={{ opacity: [1, 0, 1] }} 
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-3 h-5 bg-[#10B981] mt-2 inline-block"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
