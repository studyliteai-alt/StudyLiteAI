import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, Settings, LogOut, FileText, MessageSquare, PlayCircle, Trophy, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { auth } from '../../services/firebase.ts';
import { signOut } from 'firebase/auth';
import { cn } from '../../utils/cn.ts';
import logo from '../../assets/logo.svg';

const navigation = [
    { name: 'Home', href: '/home', icon: LayoutDashboard },
    { name: 'Study Session', href: '/session', icon: FileText },
    { name: 'AI Tutor', href: '/chat', icon: MessageSquare },
    { name: 'Practice Quiz', href: '/quiz', icon: PlayCircle },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Memory Bank', href: '/history', icon: History },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = React.useState(() => localStorage.getItem('sidebarCollapsed') === 'true');
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(prev => {
            const next = !prev;
            localStorage.setItem('sidebarCollapsed', String(next));
            return next;
        });
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    return (
        <>
            {/* Mobile Hamburger overlay button */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-60 w-14 h-14 bg-[#FBC343] border-[3px] border-[#1C1C1C] rounded-full flex items-center justify-center shadow-[4px_4px_0px_#1C1C1C] hover:scale-105 active:scale-95 transition-all"
            >
                {mobileOpen ? <X strokeWidth={3} size={24} className="text-[#1C1C1C]" /> : <Menu strokeWidth={3} size={24} className="text-[#1C1C1C]" />}
            </button>

            {/* Mobile Overlay Background */}
            <div
                onClick={() => setMobileOpen(false)}
                className={cn("lg:hidden fixed inset-0 bg-[#A5D5D5]/20 backdrop-blur-sm z-[45] transition-all duration-300", mobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none")}
            />

            <aside className={cn(
                "fixed lg:relative border-r-[3px] border-[#1C1C1C] flex flex-col bg-[#FDFBF7] z-50 h-dvh lg:h-full shrink-0 transition-all duration-300",
                isCollapsed ? 'w-72 lg:w-24' : 'w-72',
                mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}>
                {/* Toggle Button - Desktop Only */}
                <button onClick={toggleCollapse} className="hidden lg:flex absolute -right-4 top-12 w-8 h-8 bg-[#FBC343] border-[3px] border-[#1C1C1C] rounded-full items-center justify-center z-50 shadow-[2px_2px_0px_#1C1C1C] hover:scale-110 transition-transform">
                    {isCollapsed ? <ChevronRight size={16} strokeWidth={3} /> : <ChevronLeft size={16} strokeWidth={3} />}
                </button>

                {/* Logo Area */}
                <div className="h-20 lg:h-24 flex items-center px-4 lg:px-6 border-b-[3px] border-[#1C1C1C] shrink-0 bg-[#A5D5D5] relative justify-center overflow-visible">
                    {/* <div className='hidden lg:block absolute -right-4 -top-4 w-16 h-16 border-[3px] border-[#1C1C1C] rounded-full bg-[#1C1C1C] translate-x-1/2 -translate-y-1/2 pointer-events-none'></div> */}
                    {/* <div className='hidden lg:block absolute -left-2 -bottom-2 w-10 h-10 border-[3px] border-[#1C1C1C] rounded-xl bg-[#FBC343] -rotate-12 pointer-events-none'></div> */}

                    <div className={cn("flex items-center relative z-10 cursor-pointer hover:scale-105 transition-transform", isCollapsed ? "justify-center w-full lg:justify-center" : "gap-3 w-full lg:pl-2")} onClick={() => navigate('/')}>
                        {/* <div className="w-10 h-10 bg-[#1C1C1C] rounded-xl flex items-center justify-center border-[3px] border-[#1C1C1C] shadow-[4px_4px_0px_white] rotate-6 hover:rotate-12 transition-transform shrink-0">
                            <Sparkles className="text-[#FBC343]" size={20} strokeWidth={3} />
                        </div> */}
                        <div>
                            <img src={logo} alt="Logo" className="w-10 h-10" />
                        </div>
                        <span className={cn("font-black text-xl tracking-tighter text-[#1C1C1C] drop-shadow-[2px_2px_0px_white]", isCollapsed ? "block lg:hidden" : "block")}>
                            StudyLite.ai
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto w-full">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            onClick={() => setMobileOpen(false)} // close gracefully
                            className={({ isActive }) => cn(
                                'group flex items-center px-4 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all border-[3px] w-full',
                                isActive
                                    ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-[4px_4px_0px_0px_#FBC343] translate-x-1'
                                    : 'text-[#1C1C1C] border-transparent hover:border-[#1C1C1C] hover:bg-white hover:shadow-[4px_4px_0px_0px_#A5D5D5]'
                            )}
                        >
                            {({ isActive }) => (
                                <div className={cn('flex items-center w-full', isCollapsed ? 'justify-start lg:justify-center' : 'gap-4')}>
                                    <item.icon
                                        className={cn('shrink-0', isActive ? 'text-[#FBC343]' : 'text-[#1C1C1C] group-hover:scale-110 transition-transform')}
                                        size={20}
                                        strokeWidth={3}
                                    />
                                    <span className={cn('truncate', isCollapsed ? 'block lg:hidden ml-4' : '')}>{item.name}</span>
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Footer */}
                <div className="p-4 md:p-6 border-t-[3px] border-[#1C1C1C] bg-[#FDFBF7] shrink-0 mt-auto flex justify-center">
                    <button
                        onClick={handleLogout}
                        className={cn("flex items-center justify-center gap-3 py-4 text-xs font-black uppercase tracking-widest text-[#1C1C1C] bg-[#F4C5C5] border-[3px] border-[#1C1C1C] rounded-2xl shadow-[4px_4px_0px_0px_#1C1C1C] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1C1C1C] transition-all", isCollapsed ? "px-4 w-full lg:px-0 lg:w-12 lg:h-12 lg:rounded-2xl" : "px-4 w-full")}
                        title="Logout"
                    >
                        <LogOut size={18} strokeWidth={3} className={cn("shrink-0", isCollapsed ? "lg:ml-1" : "")} />
                        <span className={isCollapsed ? 'block lg:hidden' : 'block'}>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};
