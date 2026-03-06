import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './components/MainLayout';
import { ScrollToTop } from './components/ScrollToTop';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { WorkspaceView } from './pages/dashboard/WorkspaceView';
import { PerformanceView } from './pages/dashboard/PerformanceView';
import { HistoryView } from './pages/dashboard/HistoryView';
import { SettingsView } from './pages/dashboard/SettingsView';
import { ChatView } from './pages/dashboard/ChatView';
import { QuizView } from './pages/dashboard/QuizView';
import { LeaderboardView } from './pages/dashboard/LeaderboardView';
import { SharedQuizView } from './pages/dashboard/SharedQuizView';

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <ThemeProvider>
                    <ErrorBoundary>
                        <Router>
                            <ScrollToTop />
                            <div className="min-h-screen bg-cream text-brandBlack font-sans selection:bg-brandPurple selection:text-white flex flex-col">
                                <Routes>
                                    {/* Main Layout Routes - With Navbar & Footer */}
                                    <Route element={<MainLayout />}>
                                        <Route path="/" element={<LandingPage />} />
                                        <Route path="/login" element={<LoginPage />} />
                                        <Route path="/signup" element={<SignUpPage />} />
                                    </Route>

                                    {/* Protected Dashboard Routes - NOT nested in MainLayout */}
                                    <Route element={<ProtectedRoute />}>
                                        <Route path="/dashboard" element={<DashboardLayout />}>
                                            <Route index element={<WorkspaceView />} />
                                            <Route path="chat" element={<ChatView />} />
                                            <Route path="performance" element={<PerformanceView />} />
                                            <Route path="history" element={<HistoryView />} />
                                            <Route path="quiz" element={<QuizView />} />
                                            <Route path="quiz/share/:quizId" element={<SharedQuizView />} />
                                            <Route path="leaderboard" element={<LeaderboardView />} />
                                            <Route path="settings" element={<SettingsView />} />
                                        </Route>
                                    </Route>

                                    <Route path="*" element={
                                        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                                            <h1 className="text-4xl font-black mb-4">404</h1>
                                            <p className="text-brandBlack/60 mb-8 font-medium">This page doesn't exist.</p>
                                            <Link to="/" className="bg-brandBlack text-white px-8 py-3 rounded-full font-bold">Go Home</Link>
                                        </div>
                                    } />
                                </Routes>
                            </div>
                        </Router>
                    </ErrorBoundary>
                </ThemeProvider>
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;
