import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './components/MainLayout';
import { ScrollToTop } from './components/ScrollToTop';
import { LandingPage } from './pages/LandingPage';
import { SignUp } from './pages/auth/SignUp';
import { Login } from './pages/auth/Login';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { Dashboard } from './pages/dashboard/Dashboard';
import { StudyHistory } from './pages/dashboard/StudyHistory';
import { SingleSession } from './pages/dashboard/SingleSession';
import { StudyWorkspace } from './pages/study/StudyWorkspace';
import { Profile } from './pages/account/Profile';
import { Pricing } from './pages/Pricing';
import { Checkout } from './pages/checkout/Checkout';
import { PaymentSuccess } from './pages/checkout/PaymentSuccess';
import { PaymentFailed } from './pages/checkout/PaymentFailed';
import { About } from './pages/info/About';
import { Features } from './pages/info/Features';
import { HelpCenter } from './pages/info/HelpCenter';
import { Blog } from './pages/info/Blog';
import { TermsOfService } from './pages/info/TermsOfService';
import { PrivacyPolicy } from './pages/info/PrivacyPolicy';
import { NotFound } from './pages/info/NotFound';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminRoute } from './components/AdminRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ErrorBoundary>
                    <Router>
                        <ScrollToTop />
                        <div className="min-h-screen bg-cream text-brandBlack font-sans selection:bg-brandPurple selection:text-white flex flex-col">
                            <Routes>
                                {/* Auth Routes - No Navbar/Footer */}
                                <Route path="/signup" element={<SignUp />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/reset-password" element={<ResetPassword />} />

                                {/* App Screens - Professional Layout (Uses AppLayout internally) */}
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/history" element={<StudyHistory />} />
                                <Route path="/study" element={<StudyWorkspace />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/session/:id" element={<SingleSession />} />

                                {/* Admin Protected Routes */}
                                <Route element={<AdminRoute />}>
                                    <Route path="/admin" element={<AdminDashboard />} />
                                </Route>

                                {/* Main Layout Routes - With Navbar & Footer */}
                                <Route element={<MainLayout />}>
                                    <Route path="/" element={<LandingPage />} />
                                    <Route path="/pricing" element={<Pricing />} />
                                    <Route path="/checkout" element={<Checkout />} />
                                    <Route path="/success" element={<PaymentSuccess />} />
                                    <Route path="/failed" element={<PaymentFailed />} />
                                    <Route path="/about" element={<About />} />
                                    <Route path="/features" element={<Features />} />
                                    <Route path="/help" element={<HelpCenter />} />
                                    <Route path="/blog" element={<Blog />} />
                                    <Route path="/terms" element={<TermsOfService />} />
                                    <Route path="/privacy" element={<PrivacyPolicy />} />
                                    <Route path="*" element={<NotFound />} />
                                </Route>
                            </Routes>
                        </div>
                    </Router>
                </ErrorBoundary>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
