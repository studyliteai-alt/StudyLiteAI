import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';

export const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='min-h-screen grid-bg flex items-center justify-center p-6'>
         <div className='nb-card animate-pulse bg-secondary px-8 py-4 font-black uppercase text-2xl'>
            AI is Loading...
         </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
};
