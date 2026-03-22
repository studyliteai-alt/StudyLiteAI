import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, ShieldAlert } from 'lucide-react';

export const AdminStats: React.FC = () => {
    return (
        <div className="space-y-8">
            <header className='mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4'>
                <div>
                    <motion.h1
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className='text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 text-[#1C1C1C] drop-shadow-[2px_2px_0px_white]'
                    >
                        Platform Stats
                    </motion.h1>
                    <motion.p
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className='font-bold uppercase tracking-widest text-[#1C1C1C]/60 text-xs flex items-center gap-2'
                    >
                        <ShieldAlert size={14} /> Analytics & Growth Projections
                    </motion.p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Simulated Chart 1 */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white border-4 border-[#1C1C1C] rounded-3xl shadow-[8px_8px_0px_#1C1C1C] overflow-hidden">
                    <div className="p-6 border-b-4 border-[#1C1C1C] bg-[#FBC343] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TrendingUp size={24} strokeWidth={3} className="text-[#1C1C1C]" />
                            <h3 className="font-black uppercase tracking-widest text-lg text-[#1C1C1C]">Revenue Growth</h3>
                        </div>
                    </div>
                    <div className="p-8 h-64 flex items-end justify-between gap-2 overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')]">
                        {[40, 60, 45, 80, 55, 90, 100].map((height, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className="w-full bg-[#1C1C1C] border-2 border-[#1C1C1C] rounded-t-xl relative group"
                            >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white border-2 border-[#1C1C1C] px-2 py-1 rounded font-black text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                    ₦{height * 1500}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Simulated Chart 2 */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white border-4 border-[#1C1C1C] rounded-3xl shadow-[8px_8px_0px_#1C1C1C] overflow-hidden flex flex-col">
                    <div className="p-6 border-b-4 border-[#1C1C1C] bg-[#A5D5D5] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Zap size={24} strokeWidth={3} className="text-[#1C1C1C]" />
                            <h3 className="font-black uppercase tracking-widest text-lg text-[#1C1C1C]">Token Consumption</h3>
                        </div>
                    </div>
                    <div className="p-8 h-64 flex items-end justify-between gap-4">
                        <div className="w-1/3 flex flex-col items-center gap-4">
                            <motion.div initial={{ height: 0 }} animate={{ height: '70%' }} className="w-full bg-[#FBC343] border-4 border-[#1C1C1C] rounded-t-2xl shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.1)] relative">
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-black text-sm">70%</span>
                            </motion.div>
                            <span className="font-bold text-xs uppercase tracking-widest text-center">Summarization</span>
                        </div>
                        <div className="w-1/3 flex flex-col items-center gap-4">
                            <motion.div initial={{ height: 0 }} animate={{ height: '40%' }} className="w-full bg-[#F4C5C5] border-4 border-[#1C1C1C] rounded-t-2xl shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.1)] relative">
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-black text-sm">40%</span>
                            </motion.div>
                            <span className="font-bold text-xs uppercase tracking-widest text-center">Chat AI</span>
                        </div>
                        <div className="w-1/3 flex flex-col items-center gap-4">
                            <motion.div initial={{ height: 0 }} animate={{ height: '90%' }} className="w-full bg-[#A5D5D5] border-4 border-[#1C1C1C] rounded-t-2xl shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.1)] relative">
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-black text-sm">90%</span>
                            </motion.div>
                            <span className="font-bold text-xs uppercase tracking-widest text-center">Quiz Gen</span>
                        </div>
                    </div>
                </motion.div>
            </div>
            
            <div className="bg-[#1C1C1C] border-4 border-[#1C1C1C] rounded-3xl p-8 shadow-[8px_8px_0px_#FBC343] mt-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                   <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Detailed Reports</h2> 
                   <p className="text-white/60 font-bold text-sm max-w-md space-y-2">
                    Advanced analytics and CSV exports of user operations are currently compiling. Check back shortly as the system processes the latest telemetry data from the Firebase nodes.
                   </p>
                </div>
                <div className="w-16 h-16 border-4 border-[#FBC343] border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );
};
