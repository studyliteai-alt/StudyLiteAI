import { AppLayout } from '../../components/AppLayout';
import { Users, BookOpen, CreditCard, Activity, Search, Filter, MoreVertical } from 'lucide-react';

const stats = [
    { label: 'Total Scholars', value: '1,284', icon: Users, color: 'text-brandPurple', bg: 'bg-brandPurple/10', trend: '+12% this week' },
    { label: 'AI Generations', value: '8,432', icon: BookOpen, color: 'text-brandGreen', bg: 'bg-brandGreen/10', trend: '+18% this week' },
    { label: 'Total Revenue', value: '$3,852', icon: CreditCard, color: 'text-brandYellow', bg: 'bg-brandYellow/10', trend: '+5% this week' },
    { label: 'System Health', value: '99.9%', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50', trend: 'Optimal Performance' },
];

const recentUsers = [
    { name: 'Alice Johnson', email: 'alice@example.com', plan: 'Pro', joined: '2h ago', status: 'Active' },
    { name: 'Bob Smith', email: 'bob@example.com', plan: 'Free', joined: '5h ago', status: 'Active' },
    { name: 'Charlie Brown', email: 'charlie@example.com', plan: 'Pro', joined: '1d ago', status: 'Inactive' },
    { name: 'Diana Prince', email: 'diana@example.com', plan: 'Free', joined: '2d ago', status: 'Active' },
];

const systemLogs = [
    { event: 'AI Summary Generated', user: 'alice@example.com', time: '10m ago', type: 'info' },
    { event: 'New Subscription (Pro)', user: 'bob@example.com', time: '45m ago', type: 'success' },
    { event: 'Payment Failed', user: 'charlie@example.com', time: '1h ago', type: 'error' },
    { event: 'High Latency Detected', user: 'System', time: '3h ago', type: 'warning' },
];

export const AdminDashboard = () => {
    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto pb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Admin Command Center</h1>
                        <p className="text-brandBlack/40 font-medium">Monitoring StudyLite AI performance and growth.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 bg-white border-2 border-brandBlack px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                            <Filter size={18} /> Filters
                        </button>
                        <button className="bg-brandBlack text-white px-8 py-3.5 rounded-xl font-bold hover:bg-brandPurple transition-all shadow-xl shadow-brandPurple/10">
                            Download Report
                        </button>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border-2 border-brandBlack shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 border-2 border-brandBlack/5`}>
                                <stat.icon size={24} />
                            </div>
                            <p className="text-xs font-bold text-brandBlack/40 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold mb-1">{stat.value}</p>
                            <p className="text-[10px] font-bold text-brandGreen italic">{stat.trend}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* User Management */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border-2 border-brandBlack rounded-[40px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]">
                            <div className="p-8 border-b-2 border-brandBlack flex justify-between items-center bg-brandPurple/5">
                                <h2 className="text-xl font-bold">User Management</h2>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brandBlack/30" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        className="pl-10 pr-4 py-2 bg-white border-2 border-brandBlack/10 rounded-xl text-sm focus:border-brandPurple outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b-2 border-brandBlack/5 text-xs font-bold text-brandBlack/40 uppercase tracking-widest">
                                            <th className="p-6">User</th>
                                            <th className="p-6">Plan</th>
                                            <th className="p-6">Joined</th>
                                            <th className="p-6">Status</th>
                                            <th className="p-6"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-brandBlack/5">
                                        {recentUsers.map((user, i) => (
                                            <tr key={i} className="hover:bg-brandPurple/5 transition-colors">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-brandPurple/10 flex items-center justify-center font-bold text-brandPurple">
                                                            {user.name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm">{user.name}</p>
                                                            <p className="text-xs text-brandBlack/40">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-sm font-bold">
                                                    <span className={`px-3 py-1 rounded-full ${user.plan === 'Pro' ? 'bg-brandYellow/10 text-[#854D0E]' : 'bg-brandBlack/5 text-brandBlack/60'}`}>
                                                        {user.plan}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-sm font-medium text-brandBlack/60">{user.joined}</td>
                                                <td className="p-6">
                                                    <span className={`flex items-center gap-1.5 text-xs font-bold ${user.status === 'Active' ? 'text-brandGreen' : 'text-red-500'}`}>
                                                        <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-brandGreen' : 'bg-red-500'}`}></div>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <button className="text-brandBlack/30 hover:text-brandBlack transition-colors">
                                                        <MoreVertical size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* System Logs */}
                    <div className="space-y-6">
                        <div className="bg-brandBlack text-white rounded-[40px] p-8 shadow-[8px_8px_0px_0px_rgba(168,85,247,0.2)] h-full">
                            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                                <Activity className="text-brandPurple" size={24} /> Live Activity
                            </h2>
                            <div className="space-y-8">
                                {systemLogs.map((log, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-2 h-2 rounded-full mt-1.5 ${log.type === 'success' ? 'bg-brandGreen' :
                                                log.type === 'error' ? 'bg-red-500' :
                                                    log.type === 'warning' ? 'bg-brandYellow' : 'bg-brandPurple'
                                                }`}></div>
                                            {i !== systemLogs.length - 1 && <div className="w-0.5 flex-1 bg-white/10 my-1"></div>}
                                        </div>
                                        <div className="pb-8">
                                            <p className="text-sm font-bold group-hover:text-brandPurple transition-colors leading-tight mb-1">{log.event}</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-[10px] font-medium text-white/40">{log.user}</p>
                                                <span className="text-[10px] text-white/20">•</span>
                                                <p className="text-[10px] font-medium text-white/40 italic">{log.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 py-4 rounded-2xl border-2 border-white/10 text-xs font-bold hover:bg-white hover:text-brandBlack transition-all uppercase tracking-widest">
                                View Performance Logs
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};
