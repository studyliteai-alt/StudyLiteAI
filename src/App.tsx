import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { MainLayout } from './components/MainLayout';
import { ScrollToTop } from './components/ScrollToTop';
import { LandingPage } from './pages/LandingPage';
import { SignUp } from './pages/auth/SignUp';
import { Login } from './pages/auth/Login';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { Pricing } from './pages/Pricing';
import { Checkout } from './pages/checkout/Checkout';
import { PaymentSuccess } from './pages/checkout/PaymentSuccess';
import { PaymentFailed } from './pages/checkout/PaymentFailed';
import Dashboard from './pages/Dashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ToastProvider>
                    <ErrorBoundary>
                        <Router>
                            <ScrollToTop />
                            <div className="min-h-screen bg-cream text-brandBlack font-sans selection:bg-brandPurple selection:text-white flex flex-col">
                                <Routes>
                                    <Route path="/dashboard" element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    } />
                                    {/* Auth Routes - No Navbar/Footer */}
                                    <Route path="/signup" element={<SignUp />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/forgot-password" element={<ForgotPassword />} />
                                    <Route path="/reset-password" element={<ResetPassword />} />

                                    {/* Main Layout Routes - With Navbar & Footer */}
                                    <Route element={<MainLayout />}>
                                        <Route path="/" element={<LandingPage />} />
                                        <Route path="/pricing" element={<Pricing />} />
                                        <Route path="/checkout" element={<Checkout />} />
                                        <Route path="/success" element={<PaymentSuccess />} />
                                        <Route path="/failed" element={<PaymentFailed />} />
                                        <Route path="*" element={
                                            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                                                <h1 className="text-4xl font-black mb-4">404</h1>
                                                <p className="text-brandBlack/60 mb-8 font-medium">This page doesn't exist.</p>
                                                <a href="/" className="bg-brandBlack text-white px-8 py-3 rounded-full font-bold">Go Home</a>
                                            </div>
                                        } />
                                    </Route>
                                </Routes>
                            </div>
                        </Router>
                    </ErrorBoundary>
                </ToastProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
