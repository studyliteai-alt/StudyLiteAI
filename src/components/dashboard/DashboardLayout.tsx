import { useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Search, Bell, Menu, Zap, Trophy, Flame, X, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const DashboardLayout = () => {
    const { user, uploadAvatar } = useAuth();
    const { showToast } = useToast();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const notifications = [
        { id: 1, title: 'Quiz Completed', message: 'You scored 88% in Biology!', type: 'success', time: '2m ago' },
        { id: 2, title: 'New Achievement', message: '7-day study streak unlocked.', type: 'info', time: '1h ago' },
        { id: 3, title: 'System Update', message: 'Quiz mode is now available.', type: 'alert', time: '5h ago' }
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
        <div className="flex h-screen bg-[#F0F2F5] font-sans selection:bg-brandPurple selection:text-white text-[#1A1A1A] overflow-hidden theme-dashboard">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Modern Dashboard Header - Reduced Scale */}
                <header className="h-16 bg-white/50 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 z-30">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2.5 bg-white rounded-xl shadow-sm border border-gray-200 active:scale-95 transition-all"
                        >
                            <Menu size={20} />
                        </button>

                        <div className="hidden lg:block">
                            <h1 className="text-lg font-black tracking-tight text-[#1A1A1A]">StudyLite</h1>
                        </div>
                    </div>

                    {/* Centered Pill Search */}
                    <div className="flex-[2] max-w-md hidden md:block">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="w-full bg-white border border-gray-200 rounded-full py-2 pl-10 pr-4 font-semibold text-xs focus:outline-none focus:ring-4 focus:ring-black/5 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 flex-1 justify-end">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all cursor-default">
                            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                            <span className="text-[10px] font-black tracking-tighter">12 DAYS</span>
                        </div>

                        {/* Leaderboard Link */}
                        <button className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all shadow-sm group active:scale-95" title="Leaderboard">
                            <Trophy className="w-4 h-4 text-gray-400 group-hover:text-brandPurple" />
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className={`p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all shadow-sm relative group active:scale-95 ${isNotificationsOpen ? 'ring-4 ring-black/5' : ''}`}
                                title="Notifications"
                            >
                                <Bell className="w-4 h-4 text-gray-400 group-hover:text-black" />
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#FB7185] rounded-full"></span>
                            </button>

                            {isNotificationsOpen && (
                                <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-gray-200 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest">Notifications</h3>
                                        <button onClick={() => setIsNotificationsOpen(false)}><X size={14} className="text-gray-400" /></button>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map(n => (
                                            <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group">
                                                <div className="flex gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.type === 'success' ? 'bg-green-100 text-green-600' :
                                                        n.type === 'info' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                                                        }`}>
                                                        {n.type === 'success' ? <CheckCircle size={14} /> :
                                                            n.type === 'info' ? <Info size={14} /> : <AlertCircle size={14} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-black italic mb-0.5">{n.title}</p>
                                                        <p className="text-[10px] font-medium text-gray-500 line-clamp-2">{n.message}</p>
                                                        <span className="text-[9px] font-bold text-gray-300 uppercase mt-1 block">{n.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-3 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-brandPurple hover:bg-brandPurple hover:text-white transition-all">Clear All</button>
                                </div>
                            )}
                        </div>

                        {/* Profile Summary */}
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                            <div className="text-right hidden sm:block">
                                <p className="font-black text-xs tracking-tight leading-none text-[#1A1A1A]">
                                    {user?.user_metadata?.full_name || 'Student User'}
                                </p>
                                <p className={`text-[9px] font-black mt-1 uppercase tracking-widest px-1.5 py-0.5 rounded ${user?.user_metadata?.is_premium ? 'bg-[#F8D448] text-black' : 'text-gray-300'}`}>
                                    {user?.user_metadata?.is_premium ? 'PREMIUM' : 'FREE'}
                                </p>
                            </div>
                            <div
                                onClick={handleAvatarClick}
                                className={`w-8 h-8 rounded-full overflow-hidden border border-white shadow-sm cursor-pointer hover:scale-110 transition-transform bg-gradient-to-br from-[#F8D448] to-[#C7D2FE] p-0.5 relative ${uploading ? 'animate-pulse' : ''}`}
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
                                        <span className="text-[9px] font-black text-black">
                                            {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                {user?.user_metadata?.is_premium && (
                                    <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#F8D448] rounded-full flex items-center justify-center border border-[#1A1A1A]">
                                        <Zap size={6} className="text-[#1A1A1A] fill-current" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white/30">
                    <div className="max-w-[1400px] mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};
