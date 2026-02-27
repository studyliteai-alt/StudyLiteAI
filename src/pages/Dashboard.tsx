import { useState, useEffect } from 'react';
import { Zap, Flame } from 'lucide-react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { WorkspaceView } from '../components/dashboard/WorkspaceView';
import { SettingsView } from '../components/dashboard/SettingsView';
import { ChatView } from '../components/dashboard/ChatView';
import { LeaderboardView } from '../components/dashboard/LeaderboardView';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { RightSidebar } from '../components/dashboard/RightSidebar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { settingsService, SETTINGS_DEFAULTS, type UserSettings } from '../services/settings';
import { studySessionService, type StudySession } from '../services/studySession';
import { quizService, type QuizResult } from '../services/quiz';

/* ─── Types ──────────────────────────────────────── */
interface AppNotification {
    id: string;
    icon: React.ReactNode;
    title: string;
    body: string;
    time: string;
    read: boolean;
}

const SEED_NOTIFICATIONS: AppNotification[] = [
    {
        id: 'tip-1',
        icon: <Zap size={14} className="text-white" />,
        title: 'Mastery unlocked',
        body: 'You completed "Cell Biology" with 95% accuracy.',
        time: 'Just now',
        read: false,
    },
    {
        id: 'streak-1',
        icon: <Flame size={14} className="text-white" />,
        title: 'Persistence pays off',
        body: 'Your study streak reached 7 days today!',
        time: '2 min ago',
        read: false,
    }
];

export type DashboardTab = 'workspace' | 'study' | 'leaderboard' | 'settings';

export const Dashboard = () => {
    const { user, profile } = useAuth();
    const { isLowData: themeLowData } = useTheme();
    const [activeTab, setActiveTab] = useState<DashboardTab>('study');
    const [settings, setSettings] = useState<UserSettings>(SETTINGS_DEFAULTS);

    const [sessions, setSessions] = useState<StudySession[]>([]);
    const [quizzes, setQuizzes] = useState<QuizResult[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const [notifications, setNotifications] = useState<AppNotification[]>(SEED_NOTIFICATIONS);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Right Sidebar State
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [rightSidebarView, setRightSidebarView] = useState<'notifications' | 'help'>('notifications');

    const unreadCount = notifications.filter(n => !n.read).length;
    const isLowData = themeLowData || (settings.isLowData ?? false);

    useEffect(() => {
        if (!user) return;
        settingsService.getSettings(user.uid).then(saved => {
            if (saved) setSettings({ ...SETTINGS_DEFAULTS, ...saved });
        });
    }, [user]);

    useEffect(() => {
        if (!user) return;
        setLoadingData(true);
        Promise.all([
            studySessionService.getUserSessions(user.uid),
            quizService.getUserQuizzes(user.uid)
        ]).then(([s, q]) => {
            setSessions(s);
            setQuizzes(q);
        }).finally(() => setLoadingData(false));
    }, [user]);

    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    const changeTab = (tab: DashboardTab) => setActiveTab(tab);

    const openRightSidebar = (view: 'notifications' | 'help') => {
        setRightSidebarView(view);
        setRightSidebarOpen(true);
        if (view === 'notifications') markAllRead();
    };

    const tabTitles: Record<DashboardTab, string> = {
        study: 'AI Tutor',
        workspace: 'Workspace',
        leaderboard: 'Leaderboard',
        settings: 'Settings'
    };

    return (
        <div className="theme-dashboard h-screen flex flex-col md:flex-row overflow-hidden bg-[var(--bg)] selection:bg-[var(--accent)] selection:text-white">
            <Sidebar
                activeTab={activeTab}
                onTabChange={changeTab}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <DashboardHeader
                    profile={profile}
                    unreadCount={unreadCount}
                    title={tabTitles[activeTab]}
                    onNotifClick={() => openRightSidebar('notifications')}
                    onHelpClick={() => openRightSidebar('help')}
                    onProfileClick={() => changeTab('settings')}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="flex-1 overflow-y-auto scrollbar-hide" id="main-content">
                    <div className="max-w-7xl mx-auto md:p-6 lg:p-8 animate-fade-in transition-all duration-500">
                        {activeTab === 'study' && <ChatView isLowData={isLowData} />}

                        {activeTab === 'workspace' && (
                            <WorkspaceView
                                firstName={profile?.displayName?.split(' ')[0] || 'Scholar'}
                                profile={profile}
                                sessions={sessions}
                                quizzes={quizzes}
                                loading={loadingData}
                                onTabChange={changeTab as any}
                                isPro={profile?.subscriptionStatus === 'pro'}
                                promptsUsed={profile?.promptsUsed || 0}
                                promptLimit={profile?.subscriptionStatus === 'pro' ? 999 : 5}
                                usagePercent={profile?.subscriptionStatus === 'pro' ? 0 : Math.min(((profile?.promptsUsed || 0) / 5) * 100, 100)}
                                isLowData={isLowData}
                            />
                        )}

                        {activeTab === 'leaderboard' && <LeaderboardView />}

                        {activeTab === 'settings' && (
                            <SettingsView />
                        )}
                    </div>
                </main>
            </div>

            <RightSidebar
                isOpen={rightSidebarOpen}
                onClose={() => setRightSidebarOpen(false)}
                view={rightSidebarView}
                notifications={notifications}
            />
        </div>
    );
};

