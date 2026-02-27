import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();

    // AuthContext already shows a spinner while loading — we just wait
    if (loading) return null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
