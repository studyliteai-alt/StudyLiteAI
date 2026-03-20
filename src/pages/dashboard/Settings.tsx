import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar.tsx';
import { TopBar } from './TopBar.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { Trash2, User, Database, Zap, Sparkles, Camera } from 'lucide-react';
import { cn } from '../../utils/cn.ts';
import { motion } from 'framer-motion';
import { updateProfile, deleteUser } from 'firebase/auth';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase.ts';

const Settings: React.FC = () => {
    const { lowDataMode, setLowDataMode } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.displayName || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(user?.photoURL || null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async () => {
        if (!user) return;
        setLoading(true);
        setMessage(null);
        try {
            let photoURL = user.photoURL;

            // Handle Image Upload if file exists
            if (imageFile) {
                const storageRef = ref(storage, `avatars/${user.uid}`);
                await uploadBytes(storageRef, imageFile);
                photoURL = await getDownloadURL(storageRef);
            }

            // Update Auth Profile
            await updateProfile(user, { 
                displayName: name,
                photoURL: photoURL
            });

            // Update Firestore Doc
            await updateDoc(doc(db, 'users', user.uid), {
                name: name,
                photoURL: photoURL
            });

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handlePurgeAccount = async () => {
        if (!user || !window.confirm("Are you absolutely sure? This will delete all your data permanently.")) return;
        setLoading(true);
        try {
            await deleteDoc(doc(db, 'users', user.uid));
            await deleteUser(user);
            navigate('/signup');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete account. You might need to re-login first.' });
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const sectionVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className='flex bg-[#FDFBF7] overflow-hidden font-inter text-[#1C1C1C] relative neo-dashboard-layout'>
            {/* Background Grid */}
            {!lowDataMode && (
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#1c1c1c 2px, transparent 2px), linear-gradient(90deg, #1c1c1c 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
            )}
            
            <Sidebar />
            <div className='flex flex-col grow overflow-hidden relative z-10'>
                <TopBar />
                
                <main className='grow p-6 md:p-12 overflow-y-auto relative pb-32'>
                    <div className='max-w-5xl mx-auto'>
                        <header className='mb-16 border-b-[3px] border-[#1C1C1C] pb-8'>
                            <motion.h1 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className='text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-[#1C1C1C] drop-shadow-[4px_4px_0px_white]'
                            >
                                Control <br className="hidden md:block"/>Center
                            </motion.h1>
                            <motion.p 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className='font-bold uppercase tracking-widest text-[#1C1C1C]/60 text-sm'
                            >
                                System configurations & user directives.
                            </motion.p>
                        </header>

                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className='flex flex-col gap-12 mb-16'
                        >
                            {/* Avatar Section */}
                            <motion.section variants={sectionVariants} className="flex flex-col items-center">
                                <div className='relative group mb-6'>
                                    <div className='w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#1C1C1C] overflow-hidden shadow-[8px_8px_0px_#1C1C1C] bg-[#FBC343] relative'>
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Avatar" className='w-full h-full object-cover' />
                                        ) : (
                                            <div className='w-full h-full flex items-center justify-center bg-[#A5D5D5]'>
                                                <User size={64} className='text-[#1C1C1C]/40' />
                                            </div>
                                        )}
                                    </div>
                                    <label className='absolute bottom-0 right-0 w-12 h-12 bg-white border-[3px] border-[#1C1C1C] rounded-xl flex items-center justify-center shadow-[4px_4px_0px_#1C1C1C] cursor-pointer hover:-translate-y-1 transition-transform'>
                                        <Camera size={24} />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                </div>
                                <div className='text-center mb-12'>
                                    <h3 className='text-xl font-black uppercase tracking-tight text-[#1C1C1C]'>Neural Signature</h3>
                                    <p className='text-xs font-bold uppercase tracking-widest text-[#1C1C1C]/40'>Visual identifier across the network.</p>
                                </div>
                            </motion.section>

                            {/* Profile Section */}
                            <motion.section variants={sectionVariants}>
                                <h2 className='text-3xl font-black uppercase tracking-tighter mb-6 flex items-center gap-4 text-[#1C1C1C]'>
                                    <div className='w-12 h-12 bg-[#FBC343] border-[3px] border-[#1C1C1C] rounded-xl flex items-center justify-center shadow-[4px_4px_0px_#1C1C1C] -rotate-3'>
                                        <User size={24} strokeWidth={3}/>
                                    </div>
                                    User Identity
                                </h2>
                                <div className='p-6 md:p-10 bg-[#A5D5D5] border-[3px] border-[#1C1C1C] rounded-4xl shadow-[8px_8px_0px_#1C1C1C] rotate-1'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-end'>
                                        <div className='flex flex-col gap-3'>
                                            <label className="font-black uppercase tracking-widest text-[#1C1C1C] text-sm drop-shadow-[1px_1px_0px_white]">Callsign</label>
                                            <input 
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className='bg-white border-[3px] border-[#1C1C1C] p-5 rounded-2xl text-[#1C1C1C] font-bold text-lg tracking-wide focus:outline-none focus:shadow-[6px_6px_0px_#F4C5C5] transition-shadow shadow-[6px_6px_0px_#1C1C1C]'
                                            />
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <label className="font-black uppercase tracking-widest text-[#1C1C1C] text-sm drop-shadow-[1px_1px_0px_white]">Secure Uplink (Email)</label>
                                            <input 
                                                defaultValue={user?.email || 'student@university.edu'} 
                                                disabled 
                                                className='bg-[#1C1C1C]/10 border-2 border-[#1C1C1C] p-5 rounded-2xl text-[#1C1C1C]/60 font-bold text-lg tracking-wide cursor-not-allowed shadow-[inset_6px_6px_0px_rgba(0,0,0,0.1)]'
                                            />
                                        </div>
                                        
                                        {message && (
                                            <div className={cn(
                                                "col-span-1 md:col-span-2 px-6 py-3 rounded-xl border-2 border-[#1C1C1C] font-bold text-sm uppercase tracking-widest",
                                                message.type === 'success' ? "bg-[#A5D5D5]" : "bg-[#F4C5C5]"
                                            )}>
                                                {message.text}
                                            </div>
                                        )}

                                        <button 
                                            onClick={handleUpdateProfile}
                                            disabled={loading}
                                            className='col-span-1 md:col-span-2 mt-2 md:mt-4 bg-[#1C1C1C] text-white border-[3px] border-[#1C1C1C] py-4 md:py-5 rounded-full font-black uppercase tracking-widest text-base md:text-lg hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_#1C1C1C] hover:bg-white hover:text-[#1C1C1C] transition-all shadow-none w-full disabled:opacity-50'
                                        >
                                            {loading ? 'Processing...' : 'Commit Changes'}
                                        </button>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Performance Section */}
                            <motion.section variants={sectionVariants}>
                                <h2 className='text-3xl font-black uppercase tracking-tighter mb-6 flex items-center gap-4 text-[#1C1C1C]'>
                                    <div className='w-12 h-12 bg-[#F4C5C5] border-[3px] border-[#1C1C1C] rounded-xl flex items-center justify-center shadow-[4px_4px_0px_#1C1C1C] rotate-2'>
                                        <Database size={24} strokeWidth={3}/>
                                    </div>
                                    System Engine
                                </h2>
                                <div className='p-6 md:p-10 bg-white border-[3px] border-[#1C1C1C] rounded-4xl shadow-[8px_8px_0px_#1C1C1C] -rotate-1'>
                                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 md:gap-8 py-6 border-b-[3px] border-[#1C1C1C] border-dashed'>
                                        <div>
                                            <h3 className='text-xl font-black uppercase tracking-tighter text-[#1C1C1C]'>Low Data Protocol</h3>
                                            <p className='font-bold uppercase tracking-widest text-[#1C1C1C]/60 text-xs max-w-md mt-2'>Strips back visuals and zero heavy animations for weaker neural connections.</p>
                                        </div>
                                        <button 
                                            onClick={() => setLowDataMode(!lowDataMode)}
                                            className={cn(
                                                'w-24 h-12 border-[3px] border-[#1C1C1C] rounded-full p-1.5 transition-colors relative shadow-[4px_4px_0px_#1C1C1C]',
                                                lowDataMode ? 'bg-[#1C1C1C]' : 'bg-[#E5E5E5]'
                                            )}
                                        >
                                            <motion.div 
                                                layout
                                                className='w-7 h-7 bg-white border-[3px] border-[#1C1C1C] rounded-full shadow-[2px_2px_0px_#1C1C1C]'
                                                animate={{ x: lowDataMode ? 44 : 0 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            />
                                        </button>
                                    </div>
                                    
                                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 md:gap-8 py-6 opacity-40 cursor-not-allowed'>
                                        <div>
                                            <h3 className='text-xl font-black uppercase tracking-tighter text-[#1C1C1C] flex flex-wrap items-center gap-3'>
                                                Adaptive Precision 
                                                <span className="text-[10px] bg-[#FBC343] text-[#1C1C1C] px-3 py-1 border-[2px] border-[#1C1C1C] rounded-full font-black uppercase tracking-widest shadow-[2px_2px_0px_#1C1C1C] rotate-3">PRO</span>
                                            </h3>
                                            <p className='font-bold uppercase tracking-widest text-[#1C1C1C]/80 text-xs max-w-md mt-2'>Adjust AI summary length based on your remaining session limits.</p>
                                        </div>
                                        <div className='w-24 h-12 bg-[#E5E5E5] border-[3px] border-[#1C1C1C] rounded-full p-1.5 shadow-[4px_4px_0px_#1C1C1C]'>
                                            <div className='w-7 h-7 bg-gray-400 border-[3px] border-[#1C1C1C] rounded-full shadow-[2px_2px_0px_#1C1C1C]'></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Plan Section */}
                            <motion.section variants={sectionVariants}>
                                <h2 className='text-3xl font-black uppercase tracking-tighter mb-6 flex items-center gap-4 text-[#1C1C1C]'>
                                    <div className='w-12 h-12 bg-[#1C1C1C] border-[3px] border-[#1C1C1C] rounded-xl flex items-center justify-center shadow-[4px_4px_0px_#A5D5D5] rotate-1'>
                                        <Zap size={24} strokeWidth={3} className="text-[#FBC343]" />
                                    </div>
                                    Active Contract
                                </h2>
                                <div className='p-8 md:p-12 bg-[#1C1C1C] text-white rounded-4xl border-[3px] border-[#1C1C1C] shadow-[8px_8px_0px_#FBC343] rotate-1'>
                                    <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8'>
                                        <div>
                                            <div className='text-[10px] font-black uppercase text-[#A5D5D5] mb-3 tracking-widest flex items-center gap-2'><Sparkles size={14} strokeWidth={3} /> Current Tier</div>
                                            <h3 className='text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 drop-shadow-[2px_2px_0px_#F4C5C5]'>Basic Student</h3>
                                            <p className='font-bold uppercase tracking-widest text-white/50 text-sm'>3 of 5 AI pulses exhausted this cycle.</p>
                                        </div>
                                        <button className='w-full md:w-auto mt-4 md:mt-0 bg-[#FBC343] border-[3px] border-[#1C1C1C] text-[#1C1C1C] font-black uppercase tracking-widest text-base md:text-lg rounded-full py-4 px-8 md:py-5 md:px-10 shadow-[8px_8px_0px_#A5D5D5] hover:-translate-y-1 hover:shadow-[12px_12px_0px_#A5D5D5] transition-all -rotate-2'>
                                           Overclock to PRO
                                        </button>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Danger Zone */}
                            <motion.section variants={sectionVariants} className='mt-8'>
                                <div className='border-[3px] border-[#1C1C1C] bg-[#FDFBF7] p-8 md:p-10 rounded-4xl shadow-[inset_10px_10px_0px_#F4C5C5] relative overflow-hidden -rotate-1'>
                                    <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 md:gap-8 relative z-10'>
                                        <div>
                                            <h2 className='text-2xl font-black uppercase tracking-tighter text-[#1C1C1C] mb-2'>Danger Zone</h2>
                                            <p className='font-bold uppercase tracking-widest text-[#1C1C1C]/60 text-xs max-w-md'>Purge all saved sessions and permanently delete your physical neural link.</p>
                                        </div>
                                        <button 
                                            onClick={handlePurgeAccount}
                                            disabled={loading}
                                            className='w-full lg:w-auto mt-4 lg:mt-0 justify-center bg-[#F4C5C5] text-[#1C1C1C] border-[3px] border-[#1C1C1C] font-black uppercase tracking-widest text-sm md:text-base px-6 py-4 md:px-8 md:py-5 flex items-center gap-3 rounded-full hover:bg-[#1C1C1C] hover:text-white transition-colors shadow-[6px_6px_0px_#1C1C1C] rotate-2 disabled:opacity-50'
                                        >
                                            <Trash2 size={24} strokeWidth={3} /> {loading ? 'Purging...' : 'Purge Account'}
                                        </button>
                                    </div>
                                </div>
                            </motion.section>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;
