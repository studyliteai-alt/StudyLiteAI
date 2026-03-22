import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Users, BarChart3, Database, LogOut, ChevronLeft, ChevronRight, Menu, X, ArrowLeft, ShieldAlert } from 'lucide-react';
import { auth } from '../../services/firebase.ts';
import { signOut } from 'firebase/auth';
import { cn } from '../../utils/cn.ts';

const adminNav = [
    { name: 'User Directory', href: '/admin', icon: Users },
    { name: 'Platform Stats', href: '/admin/stats', icon: BarChart3 },
    { name: 'System Logs', href: '/admin/logs', icon: Database },
];

export const AdminSidebar: React.FC = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = React.useState(() => localStorage.getItem('adminSidebarCollapsed') === 'true');
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(prev => {
            const next = !prev;
            localStorage.setItem('adminSidebarCollapsed', String(next));
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
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-60 w-14 h-14 bg-[#1C1C1C] border-[3px] border-[#FBC343] rounded-full flex items-center justify-center shadow-[4px_4px_0px_#FBC343] hover:scale-105 active:scale-95 transition-all"
            >
                {mobileOpen ? <X strokeWidth={3} size={24} className="text-[#FBC343]" /> : <Menu strokeWidth={3} size={24} className="text-[#FBC343]" />}
            </button>

            <div
                onClick={() => setMobileOpen(false)}
                className={cn("lg:hidden fixed inset-0 bg-[#A5D5D5]/20 backdrop-blur-sm z-45 transition-all duration-300", mobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none")}
            />

            <aside className={cn(
                "fixed lg:relative border-r-[3px] border-[#1C1C1C] flex flex-col bg-[#1C1C1C] text-white z-50 h-dvh lg:h-full shrink-0 transition-all duration-300 shadow-[10px_0px_0px_0px_#1C1C1C]",
                isCollapsed ? 'w-72 lg:w-24' : 'w-72',
                mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}>
                <button onClick={toggleCollapse} className="hidden lg:flex absolute -right-4 top-12 w-8 h-8 bg-[#F4C5C5] border-[3px] border-[#1C1C1C] rounded-full items-center justify-center z-50 shadow-[2px_2px_0px_#1C1C1C] hover:scale-110 transition-transform text-[#1C1C1C]">
                    {isCollapsed ? <ChevronRight size={16} strokeWidth={3} /> : <ChevronLeft size={16} strokeWidth={3} />}
                </button>

                {/* Logo Area */}
                <div className="h-20 lg:h-24 flex items-center px-4 lg:px-6 border-b-[3px] border-[#1C1C1C] shrink-0 bg-[#F4C5C5] relative justify-center overflow-visible">
                    <div className={cn("flex items-center relative z-10 cursor-pointer hover:scale-105 transition-transform", isCollapsed ? "justify-center w-full lg:justify-center" : "gap-3 w-full lg:pl-2")} onClick={() => navigate('/admin')}>
                        <div className="bg-[#1C1C1C] p-1.5 rounded-xl border-[3px] border-[#1C1C1C] shadow-[2px_2px_0px_white]">
                            <ShieldAlert size={24} className="text-[#FBC343]" strokeWidth={3} />
                        </div>
                        <span className={cn("font-black text-xl tracking-tighter text-[#1C1C1C] drop-shadow-[2px_2px_0px_white]", isCollapsed ? "block lg:hidden" : "block")}>
                            Admin Root
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto w-full">
                    {adminNav.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) => cn(
                                'group flex items-center px-4 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all border-[3px] w-full',
                                isActive && item.href !== '#'
                                    ? 'bg-[#FBC343] text-[#1C1C1C] border-[#1C1C1C] shadow-[4px_4px_0px_0px_#A5D5D5] translate-x-1'
                                    : 'text-white border-transparent hover:border-white hover:bg-white hover:text-[#1C1C1C] hover:shadow-[4px_4px_0px_0px_#FBC343]'
                            )}
                        >
                            {({ isActive }) => (
                                <div className={cn('flex items-center w-full', isCollapsed ? 'justify-start lg:justify-center' : 'gap-4')}>
                                    <item.icon
                                        className={cn('shrink-0', isActive && item.href !== '#' ? 'text-[#1C1C1C]' : 'text-white group-hover:text-[#1C1C1C] group-hover:scale-110 transition-transform')}
                                        size={20}
                                        strokeWidth={3}
                                    />
                                    <span className={cn('truncate', isCollapsed ? 'block lg:hidden ml-4' : '')}>{item.name}</span>
                                </div>
                            )}
                        </NavLink>
                    ))}
                    
                    <div className="my-8 border-b-2 border-white/20 pb-8 border-dashed"></div>
                    
                    <NavLink
                        to="/home"
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                            'group flex items-center px-4 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all border-[3px] w-full mt-4 text-[#A5D5D5] border-transparent hover:border-[#A5D5D5] hover:bg-[#A5D5D5] hover:text-[#1C1C1C] hover:shadow-[4px_4px_0px_0px_white]'
                        )}
                    >
                        <div className={cn('flex items-center w-full', isCollapsed ? 'justify-start lg:justify-center' : 'gap-4')}>
                            <ArrowLeft
                                className='shrink-0 group-hover:-translate-x-1 transition-transform'
                                size={20}
                                strokeWidth={3}
                            />
                            <span className={cn('truncate', isCollapsed ? 'block lg:hidden ml-4' : '')}>Return to App</span>
                        </div>
                    </NavLink>
                </nav>

                <div className="p-4 md:p-6 border-t-[3px] border-white/20 shrink-0 mt-auto flex flex-col gap-4">
                    <button
                        onClick={handleLogout}
                        className={cn("flex items-center justify-center gap-3 py-4 text-xs font-black uppercase tracking-widest text-[#1C1C1C] bg-white border-[3px] border-[#1C1C1C] rounded-2xl shadow-[4px_4px_0px_0px_#FBC343] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FBC343] transition-all", isCollapsed ? "px-4 w-full lg:px-0 lg:w-12 lg:h-12 lg:rounded-2xl" : "px-4 w-full")}
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
