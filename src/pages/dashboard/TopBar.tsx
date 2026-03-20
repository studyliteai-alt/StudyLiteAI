import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Settings, User, Search, Database, Flame, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.tsx';
import { auth } from '../../services/firebase.ts';
import { signOut } from 'firebase/auth';

export const TopBar: React.FC = () => {
    const { user } = useAuth();
    const { lowDataMode } = useTheme();
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
        <header className="h-20 lg:h-24 border-b-[3px] border-[#1C1C1C] bg-[#FDFBF7] px-4 lg:px-8 flex items-center justify-between shrink-0 relative z-10 w-full gap-4">
            
            <div className='flex items-center gap-4 max-w-xl w-full'>
                <div className='relative w-full group'>
                    <div className='absolute inset-y-0 left-3 lg:left-4 flex items-center pointer-events-none'>
                        <Search size={22} strokeWidth={3} className='text-[#1C1C1C]/40 group-focus-within:text-[#FBC343] transition-colors scale-75 lg:scale-100' />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search..."
                        className='w-full bg-white border-2 lg:border-[3px] border-[#1C1C1C] text-[#1C1C1C] text-xs lg:text-sm font-bold placeholder:text-[#1C1C1C]/40 rounded-full py-2.5 lg:py-3.5 pl-10 lg:pl-14 pr-4 focus:outline-none focus:shadow-[4px_4px_0px_0px_#FBC343] transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]'
                    />
                </div>
            </div>

            <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 lg:gap-4 shrink-0">
                    <div className='bg-[#FBC343] border-2 lg:border-[3px] border-[#1C1C1C] px-2.5 py-1.5 lg:px-4 lg:py-2 rounded-xl lg:rounded-full flex items-center gap-1.5 lg:gap-2 shadow-[2px_2px_0px_#1C1C1C] lg:shadow-[4px_4px_0px_#1C1C1C] -rotate-2 hover:rotate-0 transition-transform cursor-default'>
                        <Flame size={16} strokeWidth={3} className="text-[#1C1C1C] fill-[#1C1C1C]" />
                        <span className='font-black uppercase tracking-widest text-[#1C1C1C] text-xs lg:text-sm'>12</span>
                    </div>

                    {lowDataMode && (
                        <div className='bg-[#F4C5C5] border-2 lg:border-[3px] border-[#1C1C1C] px-2 py-1 lg:px-3 lg:py-1.5 rounded-xl lg:rounded-full flex items-center gap-1 lg:gap-2 shadow-[2px_2px_0px_0px_#1C1C1C] rotate-2 hidden sm:flex'>
                            <Database size={12} strokeWidth={3} className="text-[#1C1C1C]" />
                            <span className='text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-[#1C1C1C]'>Low Data</span>
                        </div>
                    )}
                    
                    <button onClick={() => navigate('/settings')} className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-[#FDFBF7] hover:bg-[#A5D5D5] border-[2px] lg:border-[3px] border-[#1C1C1C] rounded-xl lg:rounded-full transition-all shadow-[2px_2px_0px_0px_#1C1C1C] lg:shadow-[4px_4px_0px_0px_#1C1C1C] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1C1C1C] group">
                        <Settings size={18} strokeWidth={3} className="text-[#1C1C1C] group-hover:rotate-45 transition-transform duration-300" />
                    </button>
                    
                    <div className="relative" ref={dropdownRef}>
                        <div 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-3 bg-white border-[3px] border-[#1C1C1C] pl-2 pr-6 py-1.5 rounded-full shadow-[4px_4px_0px_0px_#1C1C1C] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1C1C1C] transition-all cursor-pointer"
                        >
                            <div className="w-10 h-10 bg-[#1C1C1C] rounded-full flex items-center justify-center border-2 border-transparent">
                                <User size={18} strokeWidth={3} className='text-white' />
                            </div>
                            <span className="font-black text-xs tracking-widest text-[#1C1C1C] hidden md:block uppercase truncate max-w-[120px]">
                                {user?.displayName || 'Student'}
                            </span>
                        </div>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-4 w-64 bg-white border-[3px] border-[#1C1C1C] rounded-2xl shadow-[8px_8px_0px_#1C1C1C] overflow-hidden flex flex-col z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                                <div className="p-4 border-b-[3px] border-[#1C1C1C] bg-[#A5D5D5] flex flex-col">
                                    <span className="font-black text-sm uppercase tracking-tighter text-[#1C1C1C] truncate">{user?.displayName || 'Student'}</span>
                                    <span className="font-bold text-xs text-[#1C1C1C]/70 truncate">{user?.email || 'student@studylite.ai'}</span>
                                </div>
                                
                                <button 
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        navigate('/settings');
                                    }}
                                    className="flex items-center gap-3 w-full p-4 text-left font-black text-xs uppercase tracking-widest hover:bg-[#FDFBF7] transition-colors border-b-[3px] border-[#1C1C1C]"
                                >
                                    <Settings size={18} strokeWidth={3} /> Account Settings
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
