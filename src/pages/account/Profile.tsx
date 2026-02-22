import { User, Mail, Shield, LogOut, Zap } from 'lucide-react';
import { AppLayout } from '../../components/AppLayout';
import { useAuth } from '../../context/AuthContext';

export const Profile = () => {
    const { user } = useAuth();
    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-12">My Profile</h1>

                <div className="grid gap-8">
                    {/* User Info */}
                    <div className="bg-white border-2 border-brandBlack/5 rounded-[32px] p-8 shadow-sm">
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <User className="text-brandPurple" size={24} /> Account Info
                        </h2>
                        <div className="space-y-8">
                            <div>
                                <label className="block text-xs font-bold text-brandBlack/40 mb-2 uppercase tracking-widest">Name</label>
                                <p className="text-xl font-bold">{user?.displayName || 'Scholar'}</p>
                            </div>
                            <div className="pt-8 border-t border-brandBlack/5">
                                <label className="block text-xs font-bold text-brandBlack/40 mb-2 uppercase tracking-widest">Email</label>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-brandBlack/30" />
                                    <p className="text-xl font-bold">{user?.email || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Plan Information */}
                    <div className="bg-brandPurple text-white border-2 border-brandBlack rounded-[32px] p-8 shadow-lg shadow-brandPurple/10">
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <Zap className="text-brandYellow" size={24} /> Plan
                        </h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-white/40 mb-1 uppercase tracking-widest">Current Plan</p>
                                <p className="text-3xl font-bold italic">Free Plan</p>
                            </div>
                            <button className="bg-brandYellow text-brandBlack px-8 py-3 rounded-xl font-bold hover:bg-white transition-all">
                                Upgrade Plan
                            </button>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white border-2 border-brandBlack/5 rounded-[32px] p-8 shadow-sm">
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <Shield className="text-brandYellow" size={24} /> Security
                        </h2>
                        <div className="flex gap-4">
                            <button className="bg-brandBlack text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-brandPurple transition-all">
                                Change Password
                            </button>
                        </div>
                    </div>

                    {/* Logout Zone */}
                    <div className="p-8 bg-red-50 rounded-[32px] border-2 border-dashed border-red-200 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-red-600 mb-1">Session Management</h2>
                            <p className="text-sm font-medium text-red-600/60">Manage your active login session.</p>
                        </div>
                        <button className="flex items-center gap-2 text-white bg-red-600 px-8 py-3.5 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/10">
                            <LogOut className="w-5 h-5" /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};
