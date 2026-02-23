import { motion, AnimatePresence } from 'framer-motion';
import { X, User, AtSign, Sparkles, Save } from 'lucide-react';
import { useState } from 'react';
import { UserProfile } from './types';

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData: UserProfile;
    onSave: (data: UserProfile) => void;
}

export const ProfileEditModal = ({ isOpen, onClose, userData, onSave }: ProfileEditModalProps) => {
    const [formData, setFormData] = useState<UserProfile>(userData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-[#FFFDF5] border-[3px] border-black rounded-[32px] overflow-hidden shadow-[12px_12px_0px_0px_#000]"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-dash-primary text-white flex items-center justify-center shadow-[3px_3px_0px_0px_#000] border-2 border-black">
                                        <User size={20} strokeWidth={3} />
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight">Edit Profile</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                                >
                                    <X size={24} strokeWidth={3} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Avatar Preview */}
                                <div className="flex justify-center mb-8">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-[28px] border-[3px] border-black overflow-hidden shadow-[6px_6px_0px_0px_#000] bg-white">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.avatarSeed}`}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, avatarSeed: Math.random().toString(36).substring(7) })}
                                            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-dash-secondary border-[3px] border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
                                        >
                                            <Sparkles size={18} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-wider text-zinc-500 ml-1">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                                                <User size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-white border-[3px] border-black rounded-2xl py-3 pl-12 pr-4 font-bold focus:ring-4 ring-dash-primary/20 outline-none transition-all"
                                                placeholder="Your Name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-wider text-zinc-500 ml-1">Plan / Status</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                                                <AtSign size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.handle}
                                                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                                                className="w-full bg-white border-[3px] border-black rounded-2xl py-3 pl-12 pr-4 font-bold focus:ring-4 ring-dash-primary/20 outline-none transition-all"
                                                placeholder="e.g. Pro Member"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_var(--dash-primary)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_var(--dash-primary)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[4px_4px_0px_0px_var(--dash-primary)] transition-all mt-8"
                                >
                                    <Save size={20} strokeWidth={3} />
                                    Save Profile
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
