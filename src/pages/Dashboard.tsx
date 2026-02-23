import { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard,
    History,
    Target,
    Settings,
    MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Dashboard.css';
import { aiService } from '../services/ai';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { studySessionService } from '../services/studySession';
import { quizService } from '../services/quiz';
import { settingsService } from '../services/settings';
import { logOut, updateUserProfile } from '../services/auth';

// Components
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { RecentSessions } from '../components/dashboard/RecentSessions';
import { QuizHistory } from '../components/dashboard/QuizHistory';
import { StudyWorkspace } from '../components/dashboard/StudyWorkspace';
import { ProTip, DailyGoal } from '../components/dashboard/DashboardWidgets';

// Nav Views
import { HistoryView } from '../components/dashboard/HistoryView';
import { PerformanceView } from '../components/dashboard/PerformanceView';
import { SettingsView } from '../components/dashboard/SettingsView';
import { ChatView } from '../components/dashboard/ChatView';
import { NotificationCenter } from '../components/dashboard/NotificationCenter';

import { ProfileEditModal } from '../components/dashboard/ProfileEditModal';

// Types
import { NavItem, Stat, Session, QuizResult, DashboardView, WorkspaceStep, ResultTab, Notification, UserProfile, StudyData } from '../components/dashboard/types';

const Dashboard = () => {
    const { user, profile: authProfile } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeDashboardTab') || 'overview');
    const [currentView, setCurrentView] = useState<DashboardView>(() => (localStorage.getItem('currentDashboardView') as DashboardView) || 'overview');
    const [isLowData, setIsLowData] = useState(false);

    // Profile State
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile>({
        name: 'Felix Carter',
        handle: 'Pro Member',
        avatarSeed: 'Felix'
    });

    // Sync local profile state with auth profile
    useEffect(() => {
        if (authProfile) {
            setUserProfile({
                name: authProfile.displayName,
                handle: authProfile.handle || (authProfile.role === 'admin' ? 'Admin' : 'Pro Member'),
                avatarSeed: authProfile.avatarSeed || authProfile.displayName
            });
        }
    }, [authProfile]);

    // Fallback sync for UI speed
    useEffect(() => {
        if (!authProfile) {
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) setUserProfile(JSON.parse(savedProfile));
        }
    }, [authProfile]);

    useEffect(() => {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }, [userProfile]);

    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: '🔥 High Streak!',
            message: 'You have studied for 12 days in a row. Keep it up!',
            type: 'success',
            time: '2m ago',
            read: false
        },
        {
            id: '2',
            title: 'New Feature: AI Quiz',
            message: 'You can now generate quizzes from your notes automatically.',
            type: 'info',
            time: '1h ago',
            read: false
        },
        {
            id: '3',
            title: 'Low Accuracy Alert',
            message: 'Your score in "Quantum Mechanics" has dropped. Review recommended.',
            type: 'warning',
            time: '2h ago',
            read: true
        }
    ]);

    // Workspace State
    const [step, setStep] = useState<WorkspaceStep>('input');
    const [noteInput, setNoteInput] = useState('');
    const [studyData, setStudyData] = useState<StudyData | null>(null);
    const [activeResultTab, setActiveResultTab] = useState<ResultTab>('summary');
    const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);

    const navItems: NavItem[] = [
        { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { id: 'chat', icon: <MessageSquare size={20} />, label: 'AI Assistant' },
        { id: 'history', icon: <History size={20} />, label: 'History' },
        { id: 'performance', icon: <Target size={20} />, label: 'Performance' },
        { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
    ];


    const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
    const [recentSessions, setRecentSessions] = useState<Session[]>([]);
    const hasInitialSync = useRef(false);

    // Dynamic Stats
    const stats: Stat[] = [
        {
            label: "Total Sessions",
            value: recentSessions.length.toString(),
            color: "primary"
        },
        {
            label: "Avg. Quiz Score",
            value: quizHistory.length > 0
                ? Math.round(quizHistory.reduce((acc, q) => acc + (parseInt(q.score) || 0), 0) / quizHistory.length * 10).toString() + "%"
                : "0%",
            color: "pink"
        },
        {
            label: "Study Streak",
            value: recentSessions.length > 0 ? "12d" : "0d", // Streak logic would need actual dates
            color: "yellow"
        },
        {
            label: "Simplified",
            value: (recentSessions.length * 2.5).toFixed(0),
            color: "green"
        },
    ];

    // Persistence Logic
    useEffect(() => {
        // Load local data first for fast UI
        const savedSessions = localStorage.getItem('recentSessions');
        if (savedSessions) setRecentSessions(JSON.parse(savedSessions));

        const savedQuizHistory = localStorage.getItem('quizHistory');
        if (savedQuizHistory) setQuizHistory(JSON.parse(savedQuizHistory));
    }, []);

    // Sync with Firestore when user logs in
    useEffect(() => {
        const syncData = async () => {
            if (user && !hasInitialSync.current) {
                console.log("[Dashboard] Syncing with Firestore...");
                try {
                    try {
                        // Sync Study Sessions
                        const firestoreSessions = await studySessionService.getUserSessions(user.uid);
                        if (firestoreSessions.length > 0) {
                            setRecentSessions(firestoreSessions);
                        }

                        // Sync Quiz History
                        const firestoreQuizzes = await quizService.getUserQuizzes(user.uid);
                        if (firestoreQuizzes.length > 0) {
                            setQuizHistory(firestoreQuizzes);
                        }

                        // Sync Settings
                        const firestoreSettings = await settingsService.getSettings(user.uid);
                        if (firestoreSettings) {
                            setIsLowData(firestoreSettings.isLowData || false);
                        }

                        console.log("[Dashboard] Sync complete.");
                    } catch (err) {
                        console.warn("[Dashboard] Background sync failed (likely offline):", err);
                        // No need to alert user; local storage data is already loaded
                    }
                    hasInitialSync.current = true;
                } catch (error) {
                    console.error("[Dashboard] Firestore sync failed:", error);
                }
            }
        };
        syncData();
    }, [user]);

    // Save settings when they change
    useEffect(() => {
        if (user && hasInitialSync.current) {
            settingsService.saveSettings(user.uid, {
                isLowData,
                notificationsEnabled: true // Placeholder
            }).catch(console.error);
        }
    }, [isLowData, user]);

    useEffect(() => {
        localStorage.setItem('recentSessions', JSON.stringify(recentSessions));
    }, [recentSessions]);

    useEffect(() => {
        localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
    }, [quizHistory]);

    useEffect(() => {
        localStorage.setItem('activeDashboardTab', activeTab);
    }, [activeTab]);

    useEffect(() => {
        localStorage.setItem('currentDashboardView', currentView);
    }, [currentView]);

    const handleStartSession = () => {
        setCurrentView('workspace');
        setStep('input');
        setNoteInput('');
    };

    const handleProcessNotes = async () => {
        if (!noteInput.trim()) return;
        setStep('processing');
        try {
            const data = await aiService.processStudyMaterial(noteInput);
            setStudyData(data);
            setStep('results');
        } catch (error) {
            console.error("Failed to process notes:", error);
            setStep('input');
            showToast("Processing Failed", "We couldn't simplify your notes. Please check your API key or connection.", "error");
        }
    };

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const handleLogout = async () => {
        try {
            await logOut();
            localStorage.clear();
            showToast("Logged Out", "You have been securely logged out.", "success");
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
            showToast("Logout Failed", "Something went wrong. Please try again.", "error");
        }
    };

    const handleSaveProfile = async (data: UserProfile) => {
        setUserProfile(data);
        if (user) {
            try {
                await updateUserProfile(user.uid, {
                    displayName: data.name,
                    handle: data.handle,
                    avatarSeed: data.avatarSeed
                });
            } catch (error) {
                console.error("Failed to save profile to Firestore:", error);
            }
        }
    };

    const handleSaveChatSession = async (title: string, _summary: string) => {
        const newSession: Omit<Session, 'id'> = {
            title: title || "AI Discussion",
            category: "AI Chat",
            date: "Just now",
            items: 1, // Chat is one item
            mastery: 100,
            color: "blue"
        };

        if (user) {
            try {
                const firestoreId = await studySessionService.saveSession(user.uid, newSession);
                const sessionWithId: Session = { ...newSession, id: firestoreId as any };
                setRecentSessions(prev => [sessionWithId, ...prev]);
                showToast("Chat Saved", "This discussion has been added to your history.", "success");
            } catch (error) {
                console.error("Failed to save chat to Firestore:", error);
                const localSession: Session = { ...newSession, id: Date.now() };
                setRecentSessions(prev => [localSession, ...prev]);
                showToast("Chat Saved Locally", "Saved to your device (Offline).", "info");
            }
        } else {
            const localSession: Session = { ...newSession, id: Date.now() };
            setRecentSessions(prev => [localSession, ...prev]);
            showToast("Chat Saved", "Saved to local storage.", "success");
        }
    };

    const hasUnread = notifications.some(n => !n.read);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className={`dashboard-container ${isLowData ? 'low-data-mode' : ''}`}>
            <Sidebar
                navItems={navItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setCurrentView={setCurrentView}
                onNewSession={handleStartSession}
                onLogout={handleLogout}
            />

            <main className={`dash-main ${activeTab === 'chat' ? 'overflow-hidden' : ''}`}>
                <DashboardHeader
                    currentView={currentView}
                    userData={userProfile}
                    onEditProfile={() => setIsProfileModalOpen(true)}
                    onStartSession={handleStartSession}
                    onCloseWorkspace={() => setCurrentView('overview')}
                    onToggleNotifications={() => setIsNotificationsOpen(true)}
                    hasUnread={hasUnread}
                />

                <AnimatePresence mode="wait">
                    {currentView === 'workspace' ? (
                        <StudyWorkspace
                            step={step}
                            noteInput={noteInput}
                            setNoteInput={setNoteInput}
                            handleProcessNotes={handleProcessNotes}
                            activeResultTab={activeResultTab}
                            setActiveResultTab={setActiveResultTab}
                            selectedQuizIndex={selectedQuizIndex}
                            setSelectedQuizIndex={setSelectedQuizIndex}
                            studyData={studyData}
                            onComplete={async () => {
                                if (studyData) {
                                    const sessionTitle = noteInput.split('\n')[0].substring(0, 30) || "Study Session";
                                    const newSession: Omit<Session, 'id'> = {
                                        title: sessionTitle,
                                        category: "General",
                                        date: "Just now",
                                        items: 10,
                                        mastery: 85,
                                        color: "purple"
                                    };

                                    // Save to Firestore if user is logged in
                                    if (user) {
                                        try {
                                            const firestoreId = await studySessionService.saveSession(user.uid, newSession);
                                            const sessionWithId: Session = { ...newSession, id: firestoreId as any };
                                            setRecentSessions(prev => [sessionWithId, ...prev]);
                                            showToast("Session Saved", "Your study material has been added to your history.", "success");
                                        } catch (error) {
                                            console.error("Failed to save to Firestore:", error);
                                            // Fallback to local
                                            const localSession: Session = { ...newSession, id: Date.now() };
                                            setRecentSessions(prev => [localSession, ...prev]);
                                            showToast("Saved Locally", "Offline mode: Session saved to your device.", "info");
                                        }
                                    } else {
                                        const localSession: Session = { ...newSession, id: Date.now() };
                                        setRecentSessions(prev => [localSession, ...prev]);
                                        showToast("Session Saved", "Saved to local storage.", "success");
                                    }

                                    const newQuiz: Omit<QuizResult, 'id'> = {
                                        title: sessionTitle + " Quiz",
                                        score: "8/10",
                                        time: "Just now",
                                        status: 'excellent'
                                    };

                                    if (user) {
                                        try {
                                            const quizId = await quizService.saveQuizResult(user.uid, newQuiz);
                                            setQuizHistory(prev => [{ ...newQuiz, id: quizId as any }, ...prev]);
                                        } catch (error) {
                                            console.error("Failed to save quiz to Firestore:", error);
                                            setQuizHistory(prev => [{ ...newQuiz, id: Date.now() + 1 }, ...prev]);
                                        }
                                    } else {
                                        setQuizHistory(prev => [{ ...newQuiz, id: Date.now() + 1 }, ...prev]);
                                    }
                                }
                                setCurrentView('overview');
                            }}
                        />
                    ) : (
                        <motion.div
                            key={activeTab}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {activeTab === 'overview' && (
                                <div className="space-y-12">
                                    <StatsGrid stats={stats} itemVariants={itemVariants} />

                                    <RecentSessions
                                        sessions={recentSessions}
                                        onStartSession={handleStartSession}
                                        itemVariants={itemVariants}
                                    />

                                    <div className="dashboard-bottom-grid">
                                        <QuizHistory quizzes={quizHistory} itemVariants={itemVariants} />

                                        <aside className="space-y-8">
                                            <ProTip itemVariants={itemVariants} />
                                            <DailyGoal itemVariants={itemVariants} />
                                        </aside>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <HistoryView sessions={recentSessions} itemVariants={itemVariants} />
                            )}

                            {activeTab === 'performance' && (
                                <PerformanceView stats={stats} itemVariants={itemVariants} />
                            )}

                            {activeTab === 'chat' && (
                                <ChatView
                                    itemVariants={itemVariants}
                                    userData={userProfile}
                                    onSaveSession={handleSaveChatSession}
                                />
                            )}

                            {activeTab === 'settings' && (
                                <SettingsView
                                    isLowData={isLowData}
                                    setIsLowData={setIsLowData}
                                    userData={userProfile}
                                    onUpdateUser={handleSaveProfile}
                                    onLogout={handleLogout}
                                    itemVariants={itemVariants}
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <NotificationCenter
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
            />

            <ProfileEditModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                userData={userProfile}
                onSave={handleSaveProfile}
            />
        </div>
    );
};

export default Dashboard;
