import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { ShieldAlert, Trash2, ArrowUpCircle, Users, Activity, AlertTriangle, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase.ts';
import { cn } from '../../utils/cn.ts';

interface UserData {
  uid: string;
  name: string;
  email: string;
  plan: string;
  credits: number;
  cancellationRequested?: boolean;
  isAdmin?: boolean;
}

const AdminDashboard: React.FC = () => {
    const { userData } = useAuth();
    const navigate = useNavigate();
    const [usersList, setUsersList] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        // Kick them out if not admin
        if (!userData || !userData.isAdmin) {
            navigate('/dashboard');
            return;
        }

        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            const data: UserData[] = [];
            snapshot.forEach((docSnap) => {
                data.push(docSnap.data() as UserData);
            });
            setUsersList(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userData, navigate]);

    const handleProcessCancellation = async (uid: string) => {
        if (!window.confirm("Are you sure you want to cancel this user's plan? This will set them back to Free tier.")) return;
        setActionLoading(uid);
        try {
            await updateDoc(doc(db, 'users', uid), {
                plan: 'Free',
                credits: 50,
                cancellationRequested: false
            });
        } catch (error) {
            console.error("Error processing cancellation:", error);
            alert("Failed to process cancellation.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleAddTokens = async (uid: string, currentCredits: number) => {
        setActionLoading(uid);
        try {
            await updateDoc(doc(db, 'users', uid), {
                credits: currentCredits + 50
            });
        } catch (error) {
            console.error("Error adding tokens:", error);
        } finally {
            setActionLoading(null);
        }
    };

    const handlePurgeUser = async (uid: string) => {
        if (!window.confirm("WARNING: This will ONLY delete the user's Firestore document. You must still delete their Auth record manually in Firebase Console if desired. Proceed?")) return;
        setActionLoading(uid);
        try {
            await deleteDoc(doc(db, 'users', uid));
        } catch (error) {
            console.error("Error purging user:", error);
        } finally {
            setActionLoading(null);
        }
    };

    if (!userData?.isAdmin) return null;

    const totalUsers = usersList.length;
    const premiumUsers = usersList.filter(u => u.plan === 'Premium').length;
    const pendingCancels = usersList.filter(u => u.cancellationRequested).length;
    const totalCredits = usersList.reduce((sum, u) => sum + (u.credits || 0), 0);

    return (
        <>
            <header className='mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4'>
                            <div>
                                <motion.h1
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className='text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 text-[#1C1C1C] drop-shadow-[2px_2px_0px_white]'
                                >
                                    Command Center
                                </motion.h1>
                                <motion.p
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className='font-bold uppercase tracking-widest text-[#1C1C1C]/60 text-xs flex items-center gap-2'
                                >
                                    <ShieldAlert size={14} /> Root Administrative Privileges Active
                                </motion.p>
                            </div>
                        </header>

                        {/* Metric Widgets */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                            {/* Card 1 */}
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white border-4 border-[#1C1C1C] p-6 rounded-3xl shadow-[6px_6px_0px_#1C1C1C] flex flex-col justify-between min-h-[160px] relative overflow-hidden group hover:-translate-y-1 hover:shadow-[8px_8px_0px_#1C1C1C] transition-all">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#A5D5D5]/20 rounded-full -translate-y-16 translate-x-12 group-hover:scale-110 transition-transform"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="bg-[#A5D5D5] p-3 border-2 border-[#1C1C1C] rounded-2xl shadow-[2px_2px_0px_#1C1C1C] -rotate-2">
                                        <Users size={24} className="text-[#1C1C1C]" strokeWidth={3} />
                                    </div>
                                    <span className="font-black text-4xl tracking-tighter text-[#1C1C1C]">{totalUsers}</span>
                                </div>
                                <div className="relative z-10 mt-6">
                                    <h3 className="font-black uppercase tracking-widest text-[#1C1C1C] text-sm leading-tight">Total Operatives</h3>
                                    <p className="font-bold text-[#1C1C1C]/60 text-xs mt-1">Registered on the network</p>
                                </div>
                            </motion.div>

                            {/* Card 2 */}
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-[#FBC343] border-4 border-[#1C1C1C] p-6 rounded-3xl shadow-[6px_6px_0px_#1C1C1C] flex flex-col justify-between min-h-[160px] relative overflow-hidden group hover:-translate-y-1 hover:shadow-[8px_8px_0px_#1C1C1C] transition-all">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full -translate-y-16 translate-x-12 group-hover:scale-110 transition-transform"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="bg-white p-3 border-2 border-[#1C1C1C] rounded-2xl shadow-[2px_2px_0px_#1C1C1C] rotate-2">
                                        <Activity size={24} className="text-[#1C1C1C]" strokeWidth={3} />
                                    </div>
                                    <span className="font-black text-4xl tracking-tighter text-[#1C1C1C]">{premiumUsers}</span>
                                </div>
                                <div className="relative z-10 mt-6">
                                    <h3 className="font-black uppercase tracking-widest text-[#1C1C1C] text-sm leading-tight">Premium Active</h3>
                                    <p className="font-bold text-[#1C1C1C]/60 text-xs mt-1">Generating revenue</p>
                                </div>
                            </motion.div>

                            {/* Card 3 */}
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-[#F4C5C5] border-4 border-[#1C1C1C] p-6 rounded-3xl shadow-[6px_6px_0px_#1C1C1C] flex flex-col justify-between min-h-[160px] relative overflow-hidden group hover:-translate-y-1 hover:shadow-[8px_8px_0px_#1C1C1C] transition-all">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full -translate-y-16 translate-x-12 group-hover:scale-110 transition-transform"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="bg-white p-3 border-2 border-[#1C1C1C] rounded-2xl shadow-[2px_2px_0px_#1C1C1C] -rotate-3">
                                        <AlertTriangle size={24} className="text-[#1C1C1C]" strokeWidth={3} />
                                    </div>
                                    <span className="font-black text-4xl tracking-tighter text-[#1C1C1C]">{pendingCancels}</span>
                                </div>
                                <div className="relative z-10 mt-6">
                                    <h3 className="font-black uppercase tracking-widest text-[#1C1C1C] text-sm leading-tight">Action Items</h3>
                                    <p className="font-bold text-[#1C1C1C]/60 text-xs mt-1">Pending cancellations</p>
                                </div>
                            </motion.div>

                            {/* Card 4 */}
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-[#1C1C1C] text-white border-4 border-[#1C1C1C] p-6 rounded-3xl shadow-[6px_6px_0px_#FBC343] flex flex-col justify-between min-h-[160px] relative overflow-hidden group hover:-translate-y-1 hover:shadow-[8px_8px_0px_#A5D5D5] transition-all">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-12 group-hover:scale-110 transition-transform"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="bg-white p-3 border-2 border-[#1C1C1C] rounded-2xl shadow-[2px_2px_0px_#1C1C1C] rotate-1">
                                        <Zap size={24} className="text-[#FBC343]" strokeWidth={3} />
                                    </div>
                                    <span className="font-black text-4xl tracking-tighter text-white">{totalCredits}</span>
                                </div>
                                <div className="relative z-10 mt-6">
                                    <h3 className="font-black uppercase tracking-widest text-white text-sm leading-tight">System Load</h3>
                                    <p className="font-bold text-white/50 text-xs mt-1">Total output tokens globally</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Data Grid */}
                        <div className="bg-white border-4 border-[#1C1C1C] rounded-4xl shadow-[8px_8px_0px_#1C1C1C] overflow-hidden flex flex-col">
                            <div className="p-6 md:p-8 border-b-4 border-[#1C1C1C] bg-[#FDFBF7] flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
                                <div className="absolute -right-8 -top-8 w-32 h-32 border-4 border-[#1C1C1C]rounded-full opacity-10 blur-[1px]"></div>
                                <div className="relative z-10">
                                    <h3 className="font-black uppercase tracking-tighter text-2xl text-[#1C1C1C]">Directory Grid</h3>
                                    <p className="font-bold text-xs uppercase tracking-widest text-[#1C1C1C]/60 mt-1">Complete roster of neural links</p>
                                </div>
                                <div className="relative z-10 self-start md:self-auto text-[10px] md:text-xs font-black uppercase tracking-widest text-[#1C1C1C] bg-white px-4 py-2 border-[3px] border-[#1C1C1C] rounded-full shadow-[2px_2px_0px_#1C1C1C] flex items-center gap-2">
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 rounded-full bg-[#10B981]"></motion.div>
                                    Live Sync Active
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#1C1C1C] text-white">
                                            <th className="p-5 font-black uppercase tracking-widest text-[10px] whitespace-nowrap border-b-4 border-[#1C1C1C]">Operative ID</th>
                                            <th className="p-5 font-black uppercase tracking-widest text-[10px] whitespace-nowrap border-b-4 border-[#1C1C1C]">Secure Uplink</th>
                                            <th className="p-5 font-black uppercase tracking-widest text-[10px] whitespace-nowrap border-b-4 border-[#1C1C1C]">Active Tier</th>
                                            <th className="p-5 font-black uppercase tracking-widest text-[10px] whitespace-nowrap border-b-4 border-[#1C1C1C] text-center">Tokens</th>
                                            <th className="p-5 font-black uppercase tracking-widest text-[10px] whitespace-nowrap border-b-4 border-[#1C1C1C] text-right">System Overrides</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-[#1C1C1C]">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={5} className="p-12 text-center font-black text-xl uppercase tracking-widest text-[#1C1C1C]/30 animate-pulse">Scanning Neural Network...</td>
                                            </tr>
                                        ) : usersList.map((u) => (
                                            <motion.tr 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                key={u.uid} 
                                                className={cn("hover:bg-[#E5E5E5]/40 transition-colors group", u.cancellationRequested ? "bg-[#F4C5C5]/10 hover:bg-[#F4C5C5]/30" : "")}
                                            >
                                                <td className="p-5">
                                                    <div className="flex flex-col gap-1 items-start">
                                                        <span className="font-black text-sm uppercase text-[#1C1C1C] truncate max-w-[150px] md:max-w-[200px] block">{u.name || 'Unknown'}</span>
                                                        {u.isAdmin && <span className="text-[8px] font-black uppercase bg-[#FBC343] text-[#1C1C1C] border-2 border-[#1C1C1C] px-2 py-0.5 rounded-full shadow-[2px_2px_0px_#1C1C1C]">Admin Node</span>}
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <span className="font-bold text-xs text-[#1C1C1C]/70 truncate max-w-[150px] md:max-w-xs block">{u.email}</span>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex flex-col gap-2 items-start">
                                                        <span className={cn(
                                                            "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-2 border-[#1C1C1C] shadow-[2px_2px_0px_#1C1C1C] whitespace-nowrap",
                                                            u.plan === 'Premium' ? "bg-[#A5D5D5] text-[#1C1C1C]" : "bg-white text-[#1C1C1C]"
                                                        )}>
                                                            {u.plan || 'Free'}
                                                        </span>
                                                        {u.cancellationRequested && (
                                                            <span className="text-[9px] font-black uppercase tracking-widest bg-[#F4C5C5] text-[#1C1C1C] border border-[#1C1C1C] px-2 py-0.5 rounded-md whitespace-nowrap shadow-[1px_1px_0px_#1C1C1C]">
                                                                Pending Halt
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-5 text-center">
                                                    <span className="font-black text-xl bg-white border-2 border-[#1C1C1C] px-4 py-1.5 rounded-xl shadow-[2px_2px_0px_#1C1C1C] inline-block min-w-14 -rotate-2 group-hover:rotate-0 transition-transform">{u.credits || 0}</span>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex flex-wrap items-center justify-end gap-2.5">
                                                        {u.cancellationRequested && (
                                                            <button 
                                                                disabled={actionLoading === u.uid}
                                                                onClick={() => handleProcessCancellation(u.uid)}
                                                                className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] border-2 border-[#1C1C1C] text-[#F4C5C5] rounded-xl hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(28,28,28,0.5)] transition-all disabled:opacity-50"
                                                                title="Process Cancellation"
                                                            >
                                                                <CheckCircle size={16} strokeWidth={3} />
                                                                <span className="text-[10px] font-black uppercase tracking-widest hidden xl:block">Process</span>
                                                            </button>
                                                        )}
                                                        <button 
                                                            disabled={actionLoading === u.uid}
                                                            onClick={() => handleAddTokens(u.uid, u.credits || 0)}
                                                            className="p-2 md:p-2.5 bg-[#FBC343] border-2 border-[#1C1C1C] text-[#1C1C1C] rounded-xl hover:-translate-y-1 hover:shadow-[4px_4px_0px_#1C1C1C] transition-all disabled:opacity-50"
                                                            title="Add 50 Tokens"
                                                        >
                                                            <ArrowUpCircle size={18} strokeWidth={3} />
                                                        </button>
                                                        <button 
                                                            disabled={actionLoading === u.uid}
                                                            onClick={() => handlePurgeUser(u.uid)}
                                                            className="p-2 md:p-2.5 bg-white border-2 border-[#1C1C1C] text-[#1C1C1C]/40 rounded-xl hover:text-white hover:bg-[#F4C5C5] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#1C1C1C] transition-all disabled:opacity-50"
                                                            title="Purge Document"
                                                        >
                                                            <Trash2 size={18} strokeWidth={3} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
        </>
    );
};

export default AdminDashboard;
