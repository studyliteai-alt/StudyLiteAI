import { motion } from 'framer-motion';
import { LogOut, Plus } from 'lucide-react';
import { NavItem } from './types';

interface SidebarProps {
    navItems: NavItem[];
    activeTab: string;
    setActiveTab: (id: string) => void;
    setCurrentView: (view: 'overview' | 'workspace') => void;
    onNewSession: () => void;
    onLogout?: () => void;
}

export const Sidebar = ({
    navItems,
    activeTab,
    setActiveTab,
    setCurrentView,
    onNewSession,
    onLogout
}: SidebarProps) => {
    return (
        <aside className="dash-sidebar">
            <div className="flex flex-col items-center justify-between w-full h-full py-6">
                {/* Top Section */}
                <div className="flex flex-col items-center gap-6">
                    <div className="sidebar-logo">
                        <motion.div
                            whileHover={{ rotate: 12, scale: 1.1 }}
                            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border-[3px] border-black box-shadow-[3px_3px_0px_0px_#000]"
                            onClick={() => setCurrentView('overview')}
                            style={{ cursor: 'pointer' }}
                        >
                            <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="20" y="20" width="60" height="60" rx="12" fill="#A855F7" />
                                <circle cx="50" cy="50" r="15" fill="#FACC15" />
                                <rect x="45" y="45" width="10" height="25" rx="2" fill="#18181B" transform="rotate(-45 45 45)" />
                                <path d="M30 70C30 70 40 60 50 60C60 60 70 70 70 70" stroke="white" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        </motion.div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.1, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="sidebar-item !bg-white !text-dash-primary !border-black hover:shadow-[4px_4px_0px_0px_#000] transition-all"
                        onClick={onNewSession}
                        title="New Study Session"
                    >
                        <Plus size={22} strokeWidth={3} />
                    </motion.button>
                </div>

                {/* Middle Section: Navigation */}
                <nav className="flex flex-col items-center gap-3 w-full px-2">
                    {navItems.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.1, x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab(item.id);
                                if (item.id === 'overview') setCurrentView('overview');
                            }}
                            title={item.label}
                        >
                            {item.icon}
                        </motion.div>
                    ))}
                </nav>

                {/* Bottom Section: Logout */}
                <div className="flex flex-col items-center gap-3">
                    <motion.div
                        whileHover={{ rotate: -12, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="sidebar-item hover:bg-rose-50 hover:text-rose-600 hover:border-rose-600 transition-colors cursor-pointer"
                        onClick={onLogout}
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </motion.div>
                </div>
            </div>
        </aside>
    );
};
