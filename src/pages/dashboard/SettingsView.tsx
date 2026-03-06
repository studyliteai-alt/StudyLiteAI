import React, { useState } from 'react';
import {
    User,
    Settings as SettingsIcon,
    CreditCard,
    Zap,
    ChevronRight,
    Sparkles,
    Trash2,
    ShieldCheck,
    Bell,
    Palette,
    LogOut,
    ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/ui/Modal';
import { useNavigate } from 'react-router-dom';

export const SettingsView = () => {
    const { user, updateProfile, uploadAvatar, deleteAccount, signOut } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newName, setNewName] = useState(user?.user_metadata?.full_name || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingAvatar(true);
        try {
            const { error } = await uploadAvatar(file);
            if (error) {
                showToast('Upload Failed', error.message || 'Failed to upload image.', 'error');
            } else {
                showToast('Avatar Updated', 'Your new profile picture is live!', 'success');
            }
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const confirmProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim() || isUpdating) return;

        setIsUpdating(true);
        try {
            const { error } = await updateProfile({ full_name: newName.trim() });
            if (error) {
                showToast('Update Failed', error.message, 'error');
            } else {
                showToast('Profile Updated', 'Your name has been synchronized.', 'success');
                setIsProfileModalOpen(false);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            const { error } = await deleteAccount();
            if (error) {
                showToast('Action Failed', 'Could not delete account. Try again later.', 'error');
            } else {
                showToast('Account Deleted', 'Everything has been wiped from our servers.', 'success');
                navigate('/');
            }
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const sections = [
        {
            title: 'Account',
            icon: User,
            items: [
                { label: 'Profile Information', desc: 'Name, email, and avatar', action: () => setIsProfileModalOpen(true), icon: User },
                { label: 'Security', desc: 'Password and authentication', action: () => showToast('Security', 'Password reset link sent.', 'success'), icon: ShieldCheck },
            ]
        },
        {
            title: 'Experience',
            icon: SettingsIcon,
            items: [
                { label: 'Visuals', desc: 'Themes and colors', action: () => showToast('Theme', 'System theme applied.', 'info'), icon: Palette },
                { label: 'Notifications', desc: 'Study alerts and emails', action: () => showToast('Alerts', 'Settings saved.', 'success'), icon: Bell },
            ]
        },
        {
            title: 'Billing',
            icon: CreditCard,
            items: [
                { label: user?.user_metadata?.is_premium ? 'Manage Premium' : 'Upgrade to Premium', desc: 'Pro feature access', action: () => showToast('Billing', 'Paystack integration ready.', 'info'), icon: Sparkles },
                { label: 'Statements', desc: 'Recent history', action: () => showToast('History', 'No records found.', 'info'), icon: ExternalLink },
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter text-[#1A1A1A]">Settings</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Personalize your study experience</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all shadow-sm"
                >
                    <LogOut size={16} /> Sign Out
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            <input
                                type="file"
                                id="settings-avatar"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                disabled={isUploadingAvatar}
                            />
                            <label
                                htmlFor="settings-avatar"
                                className={`w-32 h-32 rounded-full border-4 border-gray-50 flex items-center justify-center overflow-hidden shadow-xl shadow-black/5 relative cursor-pointer hover:scale-105 transition-all group ${isUploadingAvatar ? 'opacity-50' : ''}`}
                            >
                                {user?.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-brandPurple flex items-center justify-center text-white font-black text-4xl italic">
                                        {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-[#1A1A1A]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] text-white uppercase font-black">
                                    <Sparkles className="w-4 h-4 mb-1" />
                                    Edit Photo
                                </div>
                            </label>
                            {isUploadingAvatar && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-brandPurple border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tighter">{user?.user_metadata?.full_name || 'Academic'}</h2>
                        <p className="text-xs font-bold text-gray-400 mt-1">{user?.email}</p>

                        <div className="w-full h-px bg-gray-50 my-6"></div>

                        <div className="flex gap-2 justify-center">
                            <div className="px-4 py-1.5 bg-brandYellow/10 text-brandYellow rounded-full text-[10px] font-black uppercase tracking-widest border border-brandYellow/10">
                                {user?.user_metadata?.is_premium ? 'Pro Member' : 'Free Tier'}
                            </div>
                            <div className="px-4 py-1.5 bg-gray-50 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100">
                                ACTIVE
                            </div>
                        </div>
                    </div>

                    {/* Pro Card Overlay */}
                    <div className="bg-[#1A1A1A] rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-black/10">
                        <div className="relative z-10">
                            <Zap className="w-8 h-8 text-[#F8D448] mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-black italic tracking-tight">Access Pro features</h3>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1 mb-6">Unlimited AI Tutor & Storage</p>
                            <button className="w-full bg-brandPurple text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all">
                                UPGRADE NOW
                            </button>
                        </div>
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-brandPurple/20 rounded-full blur-3xl"></div>
                    </div>
                </div>

                {/* Settings Items */}
                <div className="lg:col-span-2 space-y-8">
                    {sections.map((section, si) => (
                        <div key={si} className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                                    <section.icon className="w-5 h-5 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-black italic text-[#1A1A1A] tracking-tight">{section.title}</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {section.items.map((item, ii) => (
                                    <button
                                        key={ii}
                                        onClick={item.action}
                                        className="flex items-center justify-between p-6 rounded-3xl hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100 text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            {item.icon && (
                                                <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <item.icon size={18} className="text-[#1A1A1A]" />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-black text-sm italic text-[#1A1A1A]">{item.label}</h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{item.desc}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-brandPurple transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Danger Zone */}
                    <div className="bg-red-50/50 rounded-[40px] p-10 border border-red-100 space-y-6">
                        <div className="flex items-center gap-3">
                            <Trash2 className="w-5 h-5 text-red-500" />
                            <h3 className="text-xl font-black italic text-red-500 tracking-tight">Danger Zone</h3>
                        </div>
                        <p className="text-xs font-bold text-red-700/60 max-w-lg">
                            Deleting your account is permanent. All your projects, quiz results, and study sessions will be wiped immediately.
                        </p>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="bg-white border border-red-200 text-red-500 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                            DELETE ACCOUNT FOREVER
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Update Modal */}
            <Modal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                title="Profile Details"
                description="Update your display identity"
                icon={User}
            >
                <form onSubmit={confirmProfileUpdate} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Display Name</label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="e.g. Alex Scholar"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold focus:outline-none focus:ring-4 focus:ring-black/5 transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                        {isUpdating ? 'Synchronizing...' : 'Save Profile'}
                    </button>
                </form>
            </Modal>

            {/* Delete Account Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Wipe Account?"
                description="This action cannot be undone."
                icon={Trash2}
            >
                <div className="space-y-6">
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                        <p className="text-xs font-bold text-red-700 leading-relaxed italic">
                            By proceeding, you authorize the immediate deletion of all data associated with {user?.email}.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="w-full bg-red-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-all disabled:opacity-50"
                        >
                            {isDeleting ? 'Deleting Data...' : 'Confirm Destruction'}
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="w-full py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#1A1A1A] transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
