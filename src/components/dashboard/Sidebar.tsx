import { Link, useLocation } from 'react-router-dom';
import { useRef, useState } from 'react';
import {
    LayoutDashboard,
    MessageSquare,
    TrendingUp,
    History,
    Settings,
    LogOut,
    Zap,
    Trophy,
    Gamepad2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Logo } from '../Logo';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const location = useLocation();
    const { user, signOut, uploadAvatar } = useAuth();
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const navItems = [
        { name: 'Study Vault', path: '/dashboard', icon: LayoutDashboard },
        { name: 'AI Tutor', path: '/dashboard/chat', icon: MessageSquare },
        { name: 'Quiz Center', path: '/dashboard/quiz', icon: Gamepad2 },
        { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: Trophy },
        { name: 'History', path: '/dashboard/history', icon: History },
        { name: 'Progress', path: '/dashboard/performance', icon: TrendingUp },
        { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        showToast('Uploading...', 'Setting your new profile picture', 'info');

        const { error } = await uploadAvatar(file);

        if (error) {
            showToast('Upload Failed', error.message || 'Something went wrong', 'error');
        } else {
            showToast('Success!', 'Profile picture updated.', 'success');
        }
        setUploading(false);
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 bg-[#1A1A1A] flex flex-col items-center py-6 z-50 transition-all duration-500 ease-in-out
                lg:relative lg:translate-x-0 w-[72px]
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo Section */}
                <div className="mb-8">
                    <Link to="/dashboard" className="group">
                        <div className="w-10 h-10 bg-white rounded-[14px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Logo size={24} />
                        </div>
                    </Link>
                </div>

                {/* Primary Nav */}
                <nav className="flex-1 flex flex-col gap-6">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => onClose()}
                                className={`
                                    w-10 h-10 flex items-center justify-center rounded-[14px] transition-all relative group
                                    ${isActive
                                        ? 'bg-[#F8D448] text-black shadow-[0_3px_0_0_#9A7F1A]'
                                        : 'text-white/40 hover:text-white hover:bg-white/10'
                                    }
                                `}
                            >
                                <item.icon size={20} className="relative z-10" />

                                {/* Tooltip */}
                                <div className="absolute left-14 px-2.5 py-1.5 bg-black text-white text-[9px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/10 shadow-xl">
                                    {item.name}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="mt-auto flex flex-col gap-6 pt-6 border-t border-white/5 w-full items-center">
                    <button
                        onClick={() => signOut()}
                        className="w-10 h-10 flex items-center justify-center rounded-[14px] text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all group relative"
                    >
                        <LogOut size={20} />
                        <div className="absolute left-14 px-2.5 py-1.5 bg-black text-white text-[9px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/10 shadow-xl">
                            Sign Out
                        </div>
                    </button>

                    <div
                        onClick={handleAvatarClick}
                        className={`w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform bg-gradient-to-br from-[#F8D448] to-[#C7D2FE] p-0.5 relative ${uploading ? 'animate-pulse' : ''}`}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-[10px] font-black text-black">
                                    {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                                </span>
                            )}
                        </div>
                        {user?.user_metadata?.is_premium && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#F8D448] rounded-full flex items-center justify-center border-2 border-[#1A1A1A] shadow-sm">
                                <Zap size={8} className="text-[#1A1A1A] fill-current" />
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};
