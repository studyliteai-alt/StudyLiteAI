import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { motion } from 'framer-motion';
import { Brain, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { ProtectedRoute } from './components/layout/ProtectedRoute.tsx';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Signup = lazy(() => import('./pages/Auth/Signup'));
const Pricing = lazy(() => import('./pages/Pricing'));

// Dashboard Pages
const Home = lazy(() => import('./pages/dashboard/Home'));
const StudySession = lazy(() => import('./pages/dashboard/StudySession'));
const HistoryPage = lazy(() => import('./pages/dashboard/History'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const ChatView = lazy(() => import('./pages/dashboard/ChatView'));
const QuizView = lazy(() => import('./pages/dashboard/QuizView'));
const Leaderboard = lazy(() => import('./pages/dashboard/Leaderboard').then(module => ({ default: module.Leaderboard })));
import { AdminLayout } from './pages/admin/AdminLayout';
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminStats = lazy(() => import('./pages/admin/AdminStats').then(module => ({ default: module.AdminStats })));
const AdminLogs = lazy(() => import('./pages/admin/AdminLogs').then(module => ({ default: module.AdminLogs })));

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={
            <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#1c1c1c 2px, transparent 2px), linear-gradient(90deg, #1c1c1c 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 flex flex-col items-center"
                >
                    <div className="relative mb-8">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                            className="absolute -inset-4 border-[3px] border-dashed border-[#1C1C1C] rounded-full"
                        ></motion.div>
                        <motion.div 
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="bg-[#FBC343] border-[3px] border-[#1C1C1C] w-20 h-20 rounded-2xl flex items-center justify-center shadow-[6px_6px_0px_0px_#1C1C1C]"
                        >
                            <Brain size={36} className="text-[#1C1C1C]" />
                        </motion.div>
                        
                        <motion.div
                            animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                            className="absolute -top-6 -right-6 text-[#A5D5D5]"
                        >
                            <Sparkles size={24} />
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: 0.8 }}
                            className="absolute -bottom-4 -left-6 text-[#F4C5C5]"
                        >
                            <BookOpen size={20} />
                        </motion.div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-3">
                        <h2 className="text-2xl font-black uppercase tracking-widest text-[#1C1C1C]">StudyLite</h2>
                        <div className="flex gap-2">
                            {[0, 1, 2].map((i) => (
                                <motion.div 
                                    key={i}
                                    animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2, ease: "easeInOut" }}
                                    className={`w-3 h-3 rounded-full border-2 border-[#1C1C1C] ${i === 0 ? 'bg-[#F4C5C5]' : i === 1 ? 'bg-[#FBC343]' : 'bg-[#A5D5D5]'}`}
                                ></motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
          }>
            <Routes>
              {/* Public Routes */}
              <Route path='/' element={<Landing />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/pricing' element={<Pricing />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path='/home' element={<Home />} />
                <Route path='/session' element={<StudySession />} />
                <Route path='/history' element={<HistoryPage />} />
                <Route path='/settings' element={<Settings />} />
                <Route path='/chat' element={<ChatView />} />
                <Route path='/quiz/:quizId?' element={<QuizView />} />
                <Route path='/leaderboard' element={<Leaderboard />} />
              </Route>

              {/* Admin Routes */}
              <Route path='/admin' element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path='stats' element={<AdminStats />} />
                <Route path='logs' element={<AdminLogs />} />
              </Route>

              {/* Catch all */}
              <Route path='*' element={
                <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 relative overflow-hidden font-inter text-[#1C1C1C]">
                  {/* Background Grid */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#1c1c1c 2px, transparent 2px), linear-gradient(90deg, #1c1c1c 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FBC343]/20 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 flex flex-col items-center text-center max-w-lg"
                  >
                    <div className="relative mb-8 flex justify-center items-center w-full">
                      <motion.h1 
                        className="text-[8rem] md:text-[12rem] font-black leading-none drop-shadow-[8px_8px_0px_#FBC343] relative z-20"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      >
                        404
                      </motion.h1>
                      <motion.div 
                        className="absolute bg-[#A5D5D5] border-[4px] border-[#1C1C1C] rounded-full w-40 h-40 shadow-[8px_8px_0px_0px_#1C1C1C] z-10"
                        animate={{ rotate: 360, x: [-20, 20, -20], y: [-10, 10, -10] }}
                        transition={{ rotate: { repeat: Infinity, duration: 10, ease: "linear" }, x: { repeat: Infinity, duration: 5, ease: "easeInOut" }, y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
                      />
                    </div>
                    
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 bg-white border-[3px] border-[#1C1C1C] px-6 py-3 rounded-2xl shadow-[6px_6px_0px_0px_#1C1C1C] -rotate-2">Lost in Study Space?</h2>
                    <p className="font-bold border-2 border-transparent border-dashed px-4 py-2 opacity-80 mb-10 text-base md:text-lg max-w-sm bg-[#FDFBF7]/80 backdrop-blur-sm rounded-xl">The page you're looking for was misplaced during our last cram session.</p>
                    
                    <a href="/" className="bg-[#1C1C1C] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:-translate-y-1 border-[3px] border-transparent transition-all shadow-[6px_6px_0px_0px_#F4C5C5] hover:shadow-[10px_10px_0px_0px_#A5D5D5] hover:border-[#1C1C1C] flex items-center gap-3 group">
                      <ArrowRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" strokeWidth={3} /> Return to Reality
                    </a>
                  </motion.div>
                </div>
              } />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;