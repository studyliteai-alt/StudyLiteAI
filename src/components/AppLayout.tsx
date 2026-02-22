import { LayoutDashboard, LineChart, Settings, LogOut, Search, Bell, Menu, Shield } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { logOut } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { ScrollToTopButton } from './ScrollToTopButton';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, role } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: LineChart, label: 'Analytics', path: '/analytics' },
        ...(role === 'admin' ? [{ icon: Shield, label: 'Admin', path: '/admin' }] : []),
        { icon: Settings, label: 'Settings', path: '/profile' },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex">
            {/* Sidebar Navigation */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r-2 border-brandBlack/5 transform transition-transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col p-6`}>
                <div className="mb-12 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                        studylite.ai
                    </Link>
                    <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <Menu size={24} />
                    </button>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item, i) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={i}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-brandPurple text-white shadow-lg shadow-brandPurple/20' : 'text-brandBlack/40 hover:bg-brandPurple/5 hover:text-brandPurple'}`}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-brandBlack/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-brandBlack/40 font-bold hover:text-red-500 transition-colors w-full text-left"
                    >
                        <LogOut size={20} />
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b-2 border-brandBlack/5 px-4 md:px-8 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2" onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <div className="hidden md:flex items-center bg-[#F1F3F5] px-4 py-2 rounded-xl w-64 lg:w-96 gap-3">
                            <Search size={18} className="text-brandBlack/40" />
                            <input type="text" placeholder="Search sessions..." className="bg-transparent border-none outline-none text-sm font-medium w-full" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <button className="relative p-2 text-brandBlack/40 hover:text-brandPurple transition-colors">
                            <Bell size={22} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-brandPurple rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-brandBlack/5">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold max-w-[150px] truncate">{user?.email || 'Student'}</p>
                                <p className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block ${role === 'admin' ? 'text-brandYellow bg-brandYellow/10' : 'text-brandPurple bg-brandPurple/10'}`}>
                                    {role === 'admin' ? 'Admin' : 'Pro Member'}
                                </p>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-brandBlack text-white rounded-full flex items-center justify-center font-bold">
                                {user?.email?.charAt(0).toUpperCase() || 'S'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    {children}
                    <ScrollToTopButton />
                </div>
            </main>
        </div>
    );
};
