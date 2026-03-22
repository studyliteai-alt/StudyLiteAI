import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { User, LogOut, ShieldAlert, Key } from 'lucide-react';
import { auth } from '../../services/firebase.ts';
import { signOut } from 'firebase/auth';

export const AdminTopBar: React.FC = () => {
    const { user, userData } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    return (
        <header className="h-20 lg:h-24 border-b-2 border-[#1C1C1C] bg-[#FDFBF7] pl-20 pr-4 lg:px-8 flex items-center justify-between shrink-0 relative z-10 w-full gap-4">
            
            <div className='flex items-center gap-4 max-w-xl w-full'>
                <div className="bg-[#1C1C1C] text-white px-4 py-2 rounded-xl border-2 border-[#1C1C1C] items-center gap-3 font-black uppercase tracking-widest shadow-[4px_4px_0px_white] -rotate-1 hidden md:flex">
                    <ShieldAlert size={18} className="text-[#F4C5C5]" />
                    <span className="text-sm">Root Access Granted</span>
                </div>
            </div>

            <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 lg:gap-4 shrink-0">
                    
                    <div className="relative" ref={dropdownRef}>
                        <div 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-3 bg-white border-[3px] border-[#1C1C1C] pl-2 pr-6 py-1.5 rounded-full shadow-[4px_4px_0px_0px_#1C1C1C] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1C1C1C] transition-all cursor-pointer"
                        >
                            <div className="w-10 h-10 bg-[#1C1C1C] rounded-full flex items-center justify-center border-2 border-[#1C1C1C] overflow-hidden shadow-[inset_0px_0px_0px_2px_#FBC343] shrink-0">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Avatar" className='w-full h-full object-cover' />
                                ) : (
                                    <Key size={20} className="text-[#FBC343]" />
                                )}
                            </div>
                            <span className="font-black text-xs tracking-widest text-[#1C1C1C] hidden md:block uppercase truncate max-w-[120px]">
                                {userData?.name || 'Admin'}
                            </span>
                        </div>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-4 w-64 bg-white border-[3px] border-[#1C1C1C] rounded-2xl shadow-[8px_8px_0px_#1C1C1C] overflow-hidden flex flex-col z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                                <div className="p-4 border-b-[3px] border-[#1C1C1C] bg-[#F4C5C5] flex flex-col">
                                    <span className="font-black text-sm uppercase tracking-tighter text-[#1C1C1C] truncate">{userData?.name || 'Admin'}</span>
                                    <span className="font-bold text-xs text-[#1C1C1C]/70 truncate">{user?.email}</span>
                                </div>
                                
                                <button 
                                    onClick={() => navigate('/home')}
                                    className="flex items-center gap-3 w-full p-4 text-left font-black text-xs uppercase tracking-widest hover:bg-[#FDFBF7] transition-colors border-b-[3px] border-[#1C1C1C]"
                                >
                                    <User size={18} strokeWidth={3} /> Return to Platform
                                </button>

                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full p-4 text-left font-black text-xs uppercase tracking-widest hover:bg-[#F4C5C5] transition-colors text-[#1C1C1C]"
                                >
                                    <LogOut size={18} strokeWidth={3} /> Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
        </header>
    );
};
