import { Bell, Menu, Flame, HelpCircle } from 'lucide-react';
import { UserProfile } from '../../services/auth';

interface DashboardHeaderProps {
    profile: UserProfile | null;
    unreadCount: number;
    title: string;
    onNotifClick: () => void;
    onHelpClick: () => void;
    onProfileClick: () => void;
    onMenuClick: () => void;
}

export const DashboardHeader = ({
    profile,
    unreadCount,
    title,
    onNotifClick,
    onHelpClick,
    onProfileClick,
    onMenuClick,
}: DashboardHeaderProps) => {
    return (
        <header
            className="shrink-0 h-16 flex items-center justify-between px-6 md:px-8
                       bg-white/90 backdrop-blur-xl
                       border-b border-[var(--border)] z-40"
        >
            {/* Left: Hamburger (Mobile) + Branding/Section Title */}
            <div className="flex items-center gap-4 md:gap-8 flex-1">
                <button
                    onClick={onMenuClick}
                    className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 border border-[var(--border)] text-slate-600 active:scale-95 transition-all"
                >
                    <Menu size={18} />
                </button>

                <div className="flex flex-col">
                    <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none flex items-center gap-2">
                        <span className="text-[#A855F7] whitespace-nowrap">StudyLite</span>
                        <span className="text-slate-200 font-extralight" aria-hidden>/</span>
                        <span className="text-slate-500 font-medium whitespace-nowrap">{title}</span>
                    </h1>
                </div>
            </div>

            {/* Right: Notifications + User */}
            <div className="flex items-center gap-3 shrink-0">
                {/* Streak */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 transition-all hover:scale-105 cursor-default">
                    <Flame size={14} fill="currentColor" />
                    <span className="text-[12px] font-black italic">7</span>
                </div>

                {/* Need Help */}
                <button
                    onClick={onHelpClick}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-[var(--border)] text-slate-600 hover:bg-slate-100 hover:text-[var(--accent)] transition-all font-bold text-[11px]"
                >
                    <HelpCircle size={14} />
                    Need help?
                </button>

                {/* Notification Bell */}
                <button
                    onClick={onNotifClick}
                    aria-label={`Notifications, ${unreadCount} unread`}
                    className="w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all relative"
                >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 border-2 border-white rounded-full" />
                    )}
                </button>

                <div className="w-[1px] h-6 bg-[var(--border)] mx-1" />

                {/* User Profile */}
                <button
                    onClick={onProfileClick}
                    className="flex items-center gap-2.5 group"
                >
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm border-2 border-white ring-1 ring-slate-100 group-hover:scale-105 transition-all">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.avatarSeed || 'Kacie'}`}
                            alt={profile?.displayName || 'User'}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </button>
            </div>
        </header>
    );
};
