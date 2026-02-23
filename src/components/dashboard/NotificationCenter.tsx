import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Check, Info, AlertTriangle, Zap } from 'lucide-react';
import { Notification } from './types';

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
}

export const NotificationCenter = ({
    isOpen,
    onClose,
    notifications,
    onMarkAsRead,
    onMarkAllAsRead
}: NotificationCenterProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l-4 border-black z-[101] shadow-2xl flex flex-col"
                    >
                        <div className="p-8 border-b-2 border-black flex items-center justify-between bg-dash-bg">
                            <div>
                                <h2 className="text-2xl font-black">Notifications</h2>
                                <p className="text-xs font-bold text-dash-text-muted mt-1 uppercase tracking-widest">
                                    {notifications.filter(n => !n.read).length} Unread Updates
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-black/5 rounded-xl transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-zinc-50/50">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <motion.div
                                        key={n.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-5 rounded-2xl border-2 border-black bg-white transition-all ${!n.read ? 'shadow-[4px_4px_0px_0px_#000]' : 'opacity-60 grayscale-[0.5]'
                                            }`}
                                        onClick={() => !n.read && onMarkAsRead(n.id)}
                                    >
                                        <div className="flex gap-4">
                                            <div className={`w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center shrink-0 ${n.type === 'success' ? 'bg-green-100 text-green-600' :
                                                    n.type === 'warning' ? 'bg-rose-100 text-rose-600' :
                                                        'bg-blue-100 text-dash-primary'
                                                }`}>
                                                {n.type === 'success' ? <Zap size={20} fill="currentColor" /> :
                                                    n.type === 'warning' ? <AlertTriangle size={20} /> :
                                                        <Info size={20} />}
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-sm">{n.title}</h3>
                                                    <span className="text-[10px] font-black uppercase text-zinc-400">{n.time}</span>
                                                </div>
                                                <p className="text-xs font-medium text-dash-text-muted leading-relaxed">
                                                    {n.message}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                                    <Bell size={48} className="mb-4" />
                                    <p className="font-black">All caught up!</p>
                                    <p className="text-sm font-medium">No new notifications at the moment.</p>
                                </div>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="p-6 border-t-2 border-black bg-white">
                                <button
                                    onClick={onMarkAllAsRead}
                                    className="w-full action-btn outline py-3 flex items-center justify-center gap-2"
                                >
                                    <Check size={18} />
                                    <span>Clear All Notifications</span>
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
