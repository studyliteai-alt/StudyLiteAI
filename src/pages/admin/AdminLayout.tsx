import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const AdminLayout: React.FC = () => {
    const { userData } = useAuth();
    const { lowDataMode } = useTheme();

    if (!userData?.isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className='flex bg-[#FDFBF7] h-screen overflow-hidden font-inter text-[#1C1C1C] relative neo-dashboard-layout'>
            {/* Background Grid */}
            {!lowDataMode && (
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#1c1c1c 2px, transparent 2px), linear-gradient(90deg, #1c1c1c 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
            )}

            <AdminSidebar />
            <div className='flex flex-col grow overflow-hidden relative z-10'>
                <AdminTopBar />

                <main className='grow p-6 md:p-12 overflow-y-auto relative pb-32'>
                    <div className='max-w-7xl mx-auto'>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
