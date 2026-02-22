import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const AdminRoute = () => {
    const { user, role, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-cream gap-4">
                <Loader2 className="animate-spin text-brandPurple" size={48} />
                <p className="text-lg font-bold text-brandBlack/40 uppercase tracking-widest italic">Verifying Clearance...</p>
            </div>
        );
    }

    if (!user || role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
