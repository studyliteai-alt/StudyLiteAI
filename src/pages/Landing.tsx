import React, { useState, useEffect, Suspense, lazy } from 'react';
const HeroBackground = lazy(() => import('../components/HeroBackground.tsx'));
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Brain, Edit3, Image as ImageIcon, Users, Clock, Heart, Star, Sparkles, CheckCircle, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';
import logo from '../assets/logo.svg';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activePage, setActivePage] = useState(0);

  const testimonials = [
    { name: "Sarah J.", role: "Medical Student", content: "StudyLite turned my 100-page textbooks into manageable active recall sets in seconds. My GPA literally jumped from 3.2 to 3.9.", color: "bg-[#A5D5D5]", icon: Brain },
    { name: "Alex Chen", role: "Computer Science", content: "The AI summary tool is a lifesaver for complex research papers. It captures the nuance perfectly.", color: "bg-[#FBC343]", icon: Sparkles },
    { name: "Elena R.", role: "Law Student", content: "Cases used to take me hours to brief. Now I just upload the PDF and get a breakdown of the key rulings instantly.", color: "bg-[#F4C5C5]", icon: FileText },
    { name: "David K.", role: "Biology Senior", content: "The quiz generation is unmatched. I haven't used anything else for exam prep since I found this.", color: "bg-white", icon: Star },
    { name: "Mia Wong", role: "Psychology", content: "The Neo-Brutalist design is so refreshing. It actually makes me want to study more!", color: "#8FB8D9", icon: Heart, rawColor: true },
    { name: "James L.", role: "History Major", content: "Organizing my thesis sources used to be a nightmare. StudyLite's AI categorization is pure magic.", color: "bg-[#A5D5D5]", icon: Edit3 },
    { name: "Fatima B.", role: "Engineering", content: "The equation recognition in PDF summaries is surprisingly accurate. Saves me so much time rewriting notes.", color: "bg-[#FBC343]", icon: Brain },
    { name: "Samuel O.", role: "Economics", content: "I love how I can listen to my summaries while commuting. It turns dead time into study time effortlessly.", color: "bg-[#F4C5C5]", icon: Clock },
    { name: "Chioma A.", role: "Pol. Science", content: "The flashcards are generated with such precision. It's like having a personal tutor who knows exactly what's important.", color: "bg-white", icon: Sparkles },
    { name: "Ibrahim K.", role: "Architecture", content: "The visual organization of the dashboard helps me keep track of all my design theory readings without feeling overwhelmed.", color: "#8FB8D9", icon: Heart, rawColor: true },
    { name: "Zainab M.", role: "Chemistry", content: "Complex mechanisms are broken down into simple steps. It's the best study aid I've ever used for Organic Chem.", color: "bg-[#A5D5D5]", icon: Sparkles },
    { name: "Tunde R.", role: "Mathematics", content: "The step-by-step logic in the AI summaries is incredible. It helps me see the connections between theorems easily.", color: "bg-[#F4C5C5]", icon: Brain }
  ];

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);

  const nextPage = () => setActivePage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setActivePage((prev) => (prev - 1 + totalPages) % totalPages);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div id="home" className="min-h-screen bg-[#FDFBF7] text-[#1C1C1C] font-inter selection:bg-[#FBC343] overflow-x-hidden" style={{ zoom: 0.85 }}>
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 pointer-events-none">
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto bg-[#FDFBF7]/90 backdrop-blur-md border-[3px] border-[#1C1C1C] rounded-full px-4 md:px-6 py-3 shadow-[4px_4px_0px_0px_#1C1C1C] transition-all"
        >
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={logo} alt="StudyLite.ai" className="h-8" />
            <span className="text-xl md:text-2xl font-black tracking-tighter">StudyLite.ai</span>
          </div>

          {/* Links - Pill Shape */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 border-2 border-[#1C1C1C] rounded-full px-6 py-2 bg-white shadow-[2px_2px_0px_0px_#1C1C1C] transition-all hover:shadow-[4px_4px_0px_0px_#1C1C1C]">
            <a href="#home" className="text-xs font-bold hover:text-[#FBC343] transition-colors" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a>
            <a href="#features" className="text-xs font-bold opacity-70 hover:opacity-100 hover:text-[#A5D5D5] transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>Features</a>
            <a href="#how" className="text-xs font-bold opacity-70 hover:opacity-100 hover:text-[#F4C5C5] transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }); }}>How it Works</a>
            <a href="#testimonials" className="text-xs font-bold opacity-70 hover:opacity-100 hover:text-[#8FB8D9] transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' }); }}>Reviews</a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-1 md:gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="text-[#1C1C1C] px-3 md:px-4 py-2 text-xs font-bold hover:text-[#FBC343] transition-colors hidden md:block"
            >
              Log In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="bg-[#1C1C1C] text-white px-5 md:px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#FBC343] hover:text-[#1C1C1C] border-2 border-transparent hover:border-[#1C1C1C] hover:shadow-[3px_3px_0px_0px_#1C1C1C] transition-all"
            >
              Get Started
            </motion.button>
          </div>
        </motion.nav>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-24 grid lg:grid-cols-2 gap-12 items-center min-h-[95vh] relative text-[#1C1C1C]">
        {/* Animated Background Animation */}
        <Suspense fallback={null}>
          <HeroBackground />
        </Suspense>

        {/* Left */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 flex flex-col justify-center"
        >
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#FBC343]/10 rounded-full blur-3xl pointer-events-none"></div>
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-[3px] border-[#1C1C1C] bg-[#A5D5D5] text-[#1C1C1C] shadow-[4px_4px_0px_0px_#1C1C1C] text-xs font-black uppercase tracking-widest mb-6 transition-transform w-max">
            Study Smarter, Not Harder
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6"
          >
            Accelerate Your <br />
            <span className="text-[#FBC343] drop-shadow-[2px_2px_0px_#1C1C1C]">Learning</span> With AI.
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-base md:text-lg font-bold opacity-80 mb-8 max-w-lg leading-relaxed"
          >
            Stop highlighting and start understanding. Upload your course materials and our AI creates tailored study guides, active recall quizzes, and flashcards instantly.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="bg-[#1C1C1C] text-white px-8 py-3.5 rounded-full text-sm font-black tracking-widest uppercase border-[3px] border-[#1C1C1C] flex items-center gap-3 shadow-[4px_4px_0px_0px_#FBC343] hover:shadow-[6px_6px_0px_0px_#A5D5D5] transition-all"
            >
              Start Learning <ArrowRight size={18} strokeWidth={3} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-[#1C1C1C] px-8 py-3.5 rounded-full text-sm font-black tracking-widest uppercase border-[3px] border-[#1C1C1C] shadow-[4px_4px_0px_0px_#1C1C1C] hover:shadow-[6px_6px_0px_0px_#1C1C1C] transition-all hidden sm:flex items-center"
            >
              How it works
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right - Clean Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-linear-to-tr from-[#FBC343]/20 via-[#A5D5D5]/20 to-[#F4C5C5]/20 rounded-full blur-3xl pointer-events-none"></div>

          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="relative bg-white/90 backdrop-blur-xl border-[3px] border-[#1C1C1C] rounded-3xl shadow-[8px_8px_0px_0px_#1C1C1C] overflow-hidden group"
          >
            {/* Browser Header */}
            <div className="bg-[#1C1C1C] px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F4C5C5]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FBC343]"></div>
              <div className="w-3 h-3 rounded-full bg-[#A5D5D5]"></div>
            </div>
            {/* Mockup Content */}
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black mb-1">Intro to Biology</h3>
                  <p className="text-sm font-bold opacity-60">Chapter 4: Cellular Respiration</p>
                </div>
                <div className="bg-[#FDFBF7] border-2 border-[#1C1C1C] px-3 py-1.5 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_#1C1C1C] flex items-center gap-2 group-hover:bg-[#FBC343] transition-colors">
                  <Sparkles size={12} className="text-[#1C1C1C]" /> AI Active
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FDFBF7] border-2 border-[#1C1C1C] rounded-2xl p-4 shadow-[4px_4px_0px_0px_#1C1C1C] group-hover:-translate-y-1 transition-transform">
                  <div className="w-8 h-8 rounded-full bg-[#A5D5D5] border-2 border-[#1C1C1C] flex items-center justify-center mb-3"><FileText size={14} /></div>
                  <h4 className="font-black text-sm mb-1">Generate Summary</h4>
                  <p className="text-xs font-bold opacity-60">Condense 40 pages into key points.</p>
                </div>
                <div className="bg-[#1C1C1C] text-white border-2 border-[#1C1C1C] rounded-2xl p-4 shadow-[4px_4px_0px_0px_#A5D5D5] group-hover:-translate-y-1 transition-transform delay-75">
                  <div className="w-8 h-8 rounded-full bg-[#FBC343] border-2 border-[#1C1C1C] flex items-center justify-center mb-3"><Brain size={14} className="text-[#1C1C1C]" /></div>
                  <h4 className="font-black text-sm mb-1">Take a Quiz</h4>
                  <p className="text-xs font-bold opacity-60 text-white/70">Test your knowledge dynamically.</p>
                </div>
              </div>

              <div className="mt-4 bg-[#F4C5C5] border-2 border-[#1C1C1C] rounded-2xl p-4 shadow-[4px_4px_0px_0px_#1C1C1C] flex items-center gap-4 group-hover:-translate-y-1 transition-transform delay-150">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#1C1C1C] flex items-center justify-center"><CheckCircle size={18} /></div>
                <div>
                  <h4 className="font-black text-sm">Mastery Increased</h4>
                  <p className="text-xs font-bold opacity-80">+15% retention rate this week</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Minimal Accent */}
          <motion.div animate={{ rotate: [0, 180, 360] }} transition={{ repeat: Infinity, duration: 12, ease: "linear" }} className="absolute -top-6 -right-6 w-16 h-16 border-[3px] border-[#1C1C1C] border-dashed rounded-full flex items-center justify-center bg-white z-20">
            <Star size={20} className="text-[#FBC343]" />
          </motion.div>
        </motion.div>
      </section>

      {/* Banner - Nigerian Universities Marquee */}
      <section className="bg-[#1C1C1C] py-6 border-y-4 border-[#1C1C1C] overflow-hidden relative">
        <div className="relative flex overflow-x-hidden w-full group">
          <motion.div
            className="flex gap-12 px-6 items-center w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          >
            {[
              { name: "University of Lagos", color: "bg-[#FBC343]" },
              { name: "Obafemi Awolowo University", color: "bg-[#A5D5D5]" },
              { name: "University of Ibadan", color: "bg-[#F4C5C5]" },
              { name: "Ahmadu Bello University", color: "bg-white" },
              { name: "Covenant University", color: "bg-[#8FB8D9]" },
              { name: "University of Nigeria", color: "bg-[#FBC343]" },
              { name: "University of Benin", color: "bg-[#A5D5D5]" },
              { name: "University of Ilorin", color: "bg-[#F4C5C5]" },
              // duplicates for seamless loop
              { name: "University of Lagos", color: "bg-[#FBC343]" },
              { name: "Obafemi Awolowo University", color: "bg-[#A5D5D5]" },
              { name: "University of Ibadan", color: "bg-[#F4C5C5]" },
              { name: "Ahmadu Bello University", color: "bg-white" },
              { name: "Covenant University", color: "bg-[#8FB8D9]" },
              { name: "University of Nigeria", color: "bg-[#FBC343]" },
              { name: "University of Benin", color: "bg-[#A5D5D5]" },
              { name: "University of Ilorin", color: "bg-[#F4C5C5]" },
            ].map((uni, i) => (
              <div key={i} className="flex items-center gap-3 shrink-0">
                <div className={`w-3 h-3 rounded-full ${uni.color} border-[1.5px] border-[#1C1C1C]`}></div>
                <span className="text-white font-black tracking-widest uppercase text-sm">{uni.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
        {/* Gradient masks */}
        <div className="absolute top-0 bottom-0 left-0 w-16 bg-linear-to-r from-[#1C1C1C] to-transparent pointer-events-none z-10"></div>
        <div className="absolute top-0 bottom-0 right-0 w-16 bg-linear-to-l from-[#1C1C1C] to-transparent pointer-events-none z-10"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-[#FDFBF7] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black mb-6">Save time studying <br />with our AI tools</motion.h2>
            <motion.p variants={fadeInUp} className="max-w-2xl mx-auto font-medium opacity-80 mb-16 text-base md:text-lg">Generate instant summaries, build flashcards organically, and listen to your notes with dynamic architecture designed specifically for students.</motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05, rotate: -3, y: -10 }}
              className="p-8 bg-[#A5D5D5] border-[3px] border-[#1C1C1C] rounded-3xl shadow-[8px_8px_0px_0px_#1C1C1C] hover:shadow-[12px_12px_0px_0px_#1C1C1C] cursor-pointer transition-all text-left relative group z-10 hover:z-20"
            >
              <div className="w-16 h-16 bg-white border-[3px] border-[#1C1C1C] rounded-full flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_#1C1C1C] group-hover:scale-110 group-hover:bg-[#FBC343] transition-all">
                <FileText size={28} />
              </div>
              <h3 className="text-2xl font-black mb-3">PDF Summaries</h3>
              <p className="font-semibold opacity-90 leading-relaxed text-sm md:text-base">Upload dense PDFs and let our AI distill them into easy-to-read, structured key points.</p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05, rotate: 3, y: -10 }}
              className="p-8 bg-[#F4C5C5] border-[3px] border-[#1C1C1C] rounded-3xl shadow-[8px_8px_0px_0px_#1C1C1C] hover:shadow-[12px_12px_0px_0px_#1C1C1C] cursor-pointer transition-all text-left relative group z-10 hover:z-20"
            >
              <div className="w-16 h-16 bg-white border-[3px] border-[#1C1C1C] rounded-full flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_#1C1C1C] group-hover:scale-110 group-hover:bg-[#A5D5D5] transition-all">
                <Edit3 size={28} />
              </div>
              <h3 className="text-2xl font-black mb-3">Quiz Generation</h3>
              <p className="font-semibold opacity-90 leading-relaxed text-sm md:text-base">Test your recall against smart quizzes built automatically from your course materials.</p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05, rotate: -3, y: -10 }}
              className="p-8 bg-[#FBC343] border-[3px] border-[#1C1C1C] rounded-3xl shadow-[8px_8px_0px_0px_#1C1C1C] hover:shadow-[12px_12px_0px_0px_#1C1C1C] cursor-pointer transition-all text-left relative group z-10 hover:z-20"
            >
              <div className="w-16 h-16 bg-white border-[3px] border-[#1C1C1C] rounded-full flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_#1C1C1C] group-hover:scale-110 group-hover:bg-[#F4C5C5] transition-all">
                <Brain size={28} />
              </div>
              <h3 className="text-2xl font-black mb-3">Smart Revision</h3>
              <p className="font-semibold opacity-90 leading-relaxed text-sm md:text-base">Spaced repetition and personalized learning paths adapt to your unique memory curve.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="bg-[#1C1C1C] text-white py-24 border-y-4 border-[#1C1C1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 drop-shadow-[2px_2px_0px_#FBC343]">How it works</h2>
            <p className="max-w-xl mx-auto font-medium opacity-80 text-sm md:text-base">Three simple steps to completely upgrade your study routine and achieve better results.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Upload Material', desc: 'Drag and drop your syllabus, lecture slides, or dense textbook PDFs.', color: 'text-[#8FB8D9]', bg: 'bg-[#8FB8D9]' },
              { step: '02', title: 'AI Processing', desc: 'Our engine extracts key concepts, formulas, and definitions in seconds.', color: 'text-[#F4C5C5]', bg: 'bg-[#F4C5C5]' },
              { step: '03', title: 'Learn & Test', desc: 'Interact with summaries, listen to audio notes, and take adaptive quizzes.', color: 'text-[#FBC343]', bg: 'bg-[#FBC343]' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, type: "spring", stiffness: 200 }}
                className="bg-white text-[#1C1C1C] border-4 border-[#1C1C1C] rounded-3xl p-8 relative shadow-[8px_8px_0px_0px_#Fdfbf7] hover:shadow-[12px_12px_0px_0px_#FBC343] hover:border-[#FBC343] cursor-pointer transition-all group"
              >
                <div className={`absolute -top-6 -left-6 w-12 h-12 rounded-full border-[3px] border-[#1C1C1C] ${item.bg} flex items-center justify-center font-black text-xl shadow-[4px_4px_0px_0px_#1C1C1C] group-hover:scale-110 transition-transform`}>{item.step}</div>
                <h3 className="text-2xl font-black mb-3 mt-2 group-hover:text-[#FBC343] transition-colors">{item.title}</h3>
                <p className="font-semibold opacity-80 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section - BENTO GRID REDESIGN */}
      <section className="bg-[#1C1C1C] text-white border-y-4 border-[#1C1C1C] py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-5xl md:text-6xl lg:text-7xl font-black drop-shadow-[4px_4px_0px_#FBC343] mb-6">Why StudyLite?</motion.h2>
            <p className="font-medium opacity-80 max-w-2xl mx-auto text-base md:text-lg">We don't just provide tools, we provide a complete upgrade to your academic operating system.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Bento 1: Large Stat */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-2 bg-[#FBC343] text-[#1C1C1C] p-8 md:p-10 border-[3px] border-[#1C1C1C] rounded-3xl shadow-[8px_8px_0px_0px_white] flex flex-col justify-between group overflow-hidden relative">
              <div className="relative z-10">
                <span className="text-6xl md:text-8xl font-black drop-shadow-[4px_4px_0px_white]">50K+</span>
                <h4 className="text-2xl font-black uppercase tracking-wider mt-4">Active Students</h4>
                <p className="font-bold opacity-90 mt-2 max-w-sm">Trusting us with their academic workflow and seeing immediate results in their daily output.</p>
              </div>
              <Users size={120} className="absolute -bottom-10 -right-10 text-white opacity-40 group-hover:scale-110 transition-transform duration-500" />
            </motion.div>

            {/* Bento 2: Square Stat */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-[#A5D5D5] text-[#1C1C1C] p-8 border-[3px] border-[#1C1C1C] rounded-3xl shadow-[8px_8px_0px_0px_white] flex flex-col justify-center relative overflow-hidden group">
              <div className="relative z-10 text-center">
                <span className="text-5xl md:text-6xl font-black drop-shadow-[3px_3px_0px_white] mb-2 block">86%</span>
                <h4 className="text-xl font-black uppercase tracking-wider">Better Grades</h4>
                <p className="font-bold opacity-80 mt-2 text-sm">Reported by users after one full semester.</p>
              </div>
              <Star size={80} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-30 group-hover:rotate-12 transition-transform duration-500" />
            </motion.div>

            {/* Bento 3: Square Stat */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-[#F4C5C5] text-[#1C1C1C] p-8 border-[3px] border-[#1C1C1C] rounded-3xl shadow-[8px_8px_0px_0px_white] flex flex-col justify-center relative overflow-hidden group">
              <div className="relative z-10 text-center">
                <span className="text-5xl md:text-6xl font-black drop-shadow-[3px_3px_0px_white] mb-2 block">24/7</span>
                <h4 className="text-xl font-black uppercase tracking-wider">AI Uptime</h4>
                <p className="font-bold opacity-80 mt-2 text-sm">Never stop learning with our available intelligence.</p>
              </div>
              <Clock size={80} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-30 group-hover:-rotate-12 transition-transform duration-500" />
            </motion.div>

            {/* Bento 4: Wide feature mention */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="md:col-span-2 bg-white text-[#1C1C1C] p-8 border-[3px] border-[#1C1C1C] rounded-3xl shadow-[8px_8px_0px_0px_#FBC343] flex items-center justify-between overflow-hidden">
              <div>
                <h4 className="text-2xl md:text-3xl font-black mb-2">Built for top-tier universities</h4>
                <p className="font-bold opacity-70">Join students from Stanford, MIT, Harvard, and more.</p>
              </div>
              <div className="hidden md:flex gap-4">
                <div className="w-12 h-12 rounded-full border-[3px] border-[#1C1C1C] bg-[#8FB8D9]"></div>
                <div className="w-12 h-12 rounded-full border-[3px] border-[#1C1C1C] bg-[#F4C5C5] -ml-6"></div>
                <div className="w-12 h-12 rounded-full border-[3px] border-[#1C1C1C] bg-[#FBC343] -ml-6"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background decorative grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 2px, transparent 2px), linear-gradient(90deg, #fff 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
      </section>

      {/* Testimonials - Bento Grid Redesign */}
      {/* Testimonials - Carousel Grid */}
      <section id="testimonials" className="bg-[#FDFBF7] py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* HIGH-IMPACT Carousel Navigation */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-10 mb-20 bg-[#1C1C1C] text-white p-12 border-[6px] border-[#1C1C1C] shadow-[12px_12px_0px_0px_#FBC343] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FBC343] opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="text-center md:text-left relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-xl border-[3px] border-white bg-[#FBC343] text-[#1C1C1C] shadow-[4px_4px_0px_0px_white] text-sm font-black uppercase tracking-tighter mb-6 transition-transform hover:-translate-y-1 cursor-default"
              >
                <Sparkles size={16} /> 573+ Reviews
              </motion.div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 leading-none">
                Don't Take <br />
                <span className="text-[#FBC343] drop-shadow-[4px_4px_0px_white]">Our Word</span> For It.
              </h2>
              <p className="text-xl font-bold opacity-60 max-w-xl">We've helped over 50,000 students worldwide save millions of hours of study time.</p>
            </div>
            <div className="flex gap-6 relative z-10">
              <motion.button
                whileHover={{ scale: 1.1, rotate: -5, boxShadow: "8px 8px 0px 0px #FBC343" }}
                whileTap={{ scale: 0.9 }}
                onClick={prevPage}
                className="w-20 h-20 rounded-2xl bg-white text-[#1C1C1C] border-4 border-[#1C1C1C] flex items-center justify-center shadow-[8px_8px_0px_0px_#FBC343] hover:bg-[#FBC343] hover:text-[#1C1C1C] transition-all"
                aria-label="Previous page"
              >
                <ChevronLeft size={36} strokeWidth={4} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5, boxShadow: "8px 8px 0px 0px #A5D5D5" }}
                whileTap={{ scale: 0.9 }}
                onClick={nextPage}
                className="w-20 h-20 rounded-2xl bg-white text-[#1C1C1C] border-4 border-[#1C1C1C] flex items-center justify-center shadow-[8px_8px_0px_0px_#A5D5D5] hover:bg-[#A5D5D5] hover:text-[#1C1C1C] transition-all"
                aria-label="Next page"
              >
                <ChevronRight size={36} strokeWidth={4} />
              </motion.button>
            </div>
          </div>

          {/* DYNAMIC SHUFFLE GRID */}
          <div className="relative min-h-[750px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotate: 2 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                {testimonials.slice(activePage * ITEMS_PER_PAGE, (activePage + 1) * ITEMS_PER_PAGE).map((testimonial, i) => (
                  <motion.div
                    key={i}
                    layout
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 50, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={cn(
                      "p-10 border-[5px] border-[#1C1C1C] rounded-[2.5rem] shadow-[12px_12px_0px_0px_#1C1C1C] flex flex-col justify-between group transition-shadow hover:shadow-[20px_20px_0px_0px_#1C1C1C] relative overflow-hidden",
                      testimonial.rawColor ? "" : testimonial.color,
                      i === 0 || i === 4 ? "-rotate-2" : i === 2 || i === 5 ? "rotate-2" : "rotate-1"
                    )}
                    style={testimonial.rawColor ? { backgroundColor: testimonial.color } : {}}
                  >
                    {/* Animated background element on hover */}
                    <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-full bg-white/10 transition-all duration-500 pointer-events-none"></div>

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-10">
                        <div className="flex gap-1.5 p-2 bg-white/20 rounded-lg backdrop-blur-sm border-2 border-[#1C1C1C]/10">
                          {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill="#1C1C1C" />)}
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-white border-[3px] border-[#1C1C1C] flex items-center justify-center shadow-[4px_4px_0px_0px_#1C1C1C] group-hover:scale-125 group-hover:rotate-12 transition-transform">
                          <testimonial.icon size={28} strokeWidth={3} />
                        </div>
                      </div>
                      <p className="text-2xl font-black leading-tight mb-8 tracking-tight">"{testimonial.content}"</p>
                    </div>

                    <div className="flex items-center gap-5 relative z-10 pt-6 border-t-[3px] border-[#1C1C1C]/10">
                      <div className="w-14 h-14 rounded-2xl bg-white border-[3px] border-[#1C1C1C] flex items-center justify-center font-black text-lg shadow-[4px_4px_0px_0px_#1C1C1C] group-hover:-translate-y-1 transition-transform">
                        {testimonial.name[0]}
                      </div>
                      <div>
                        <h4 className="font-black text-xl mb-1">{testimonial.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black opacity-60 uppercase tracking-widest">{testimonial.role}</span>
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1C1C1C] text-[#FBC343] rounded-full text-[10px] font-black uppercase tracking-tighter shadow-[2px_2px_0px_0px_white]">
                            <Sparkles size={10} /> Genius
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Accent Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#1C1C1C 1px, transparent 1px), linear-gradient(90deg, #1C1C1C 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </section>

      {/* See How It Works / Showcases REDESIGN */}
      <section className="bg-[#FDFBF7] py-32 border-b-4 border-[#1C1C1C] relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FBC343]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <span className="inline-block px-4 py-2 bg-[#1C1C1C] text-white border-[3px] border-[#1C1C1C] shadow-[4px_4px_0px_0px_#A5D5D5] rounded-full text-xs font-black uppercase tracking-widest mb-6 rotate-2 hover:rotate-0 transition-transform cursor-default">Platform Preview</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">See your new<br />study flow</motion.h2>
            <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-2xl mx-auto font-bold opacity-70 text-base md:text-lg">Take a look at the interfaces and interactions we've crafted to help you organize your academic life efficiently.</motion.p>
          </div>

          <div className="flex flex-col gap-16 md:gap-24">
            {/* Feature Row 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="order-2 md:order-1">
                <h3 className="text-3xl md:text-4xl font-black mb-4">Your Neural Dashboard</h3>
                <p className="font-bold opacity-80 mb-6 text-base leading-relaxed max-w-md">From classes to assignments, everything has its perfect place. Our UI is designed to reduce cognitive load so you can focus strictly on learning.</p>
                <ul className="space-y-4 font-bold opacity-90 mb-8">
                  <li className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-[#A5D5D5] border-2 border-[#1C1C1C] flex items-center justify-center text-white"><CheckCircle size={12} strokeWidth={3} /></div> Minimalist clutter-free view</li>
                  <li className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-[#F4C5C5] border-2 border-[#1C1C1C] flex items-center justify-center text-white"><CheckCircle size={12} strokeWidth={3} /></div> Instant access to recent materials</li>
                </ul>
                <button className="flex items-center gap-3 text-sm font-black bg-white border-[3px] border-[#1C1C1C] px-6 py-3 rounded-full shadow-[4px_4px_0px_0px_#1C1C1C] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1C1C1C] transition-all" onClick={() => navigate('/signup')}>Try the Dashboard <ArrowRight size={18} /></button>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0, rotate: 2 }} whileHover={{ rotate: 0 }} viewport={{ once: true, margin: "-100px" }} className="order-1 md:order-2 bg-[#A5D5D5] border-[3px] border-[#1C1C1C] p-6 md:p-8 rounded-3xl shadow-[12px_12px_0px_0px_#1C1C1C] transition-transform">
                <div className="aspect-video bg-white rounded-xl border-[3px] border-[#1C1C1C] overflow-hidden flex flex-col">
                  {/* Fake Browser header */}
                  <div className="h-8 border-b-[3px] border-[#1C1C1C] bg-[#FDFBF7] flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-[#1C1C1C] bg-[#F4C5C5]"></div>
                    <div className="w-3 h-3 rounded-full border-2 border-[#1C1C1C] bg-[#FBC343]"></div>
                    <div className="w-3 h-3 rounded-full border-2 border-[#1C1C1C] bg-[#8FB8D9]"></div>
                  </div>
                  <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 relative pointer-events-none">
                    <ImageIcon size={64} className="mx-auto text-slate-300 relative z-10 hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-200/50 to-transparent"></div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Feature Row 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0, rotate: -2 }} whileHover={{ rotate: 0 }} viewport={{ once: true, margin: "-100px" }} className="bg-[#F4C5C5] border-[3px] border-[#1C1C1C] p-6 md:p-8 rounded-3xl shadow-[12px_12px_0px_0px_#1C1C1C] transition-transform">
                <div className="aspect-video bg-white rounded-xl border-[3px] border-[#1C1C1C] overflow-hidden flex flex-col relative group">
                  {/* Fake Browser header */}
                  <div className="h-8 border-b-[3px] border-[#1C1C1C] bg-[#FDFBF7] flex items-center px-4 gap-2 z-20">
                    <div className="w-3 h-3 rounded-full border-2 border-[#1C1C1C] bg-[#F4C5C5]"></div>
                    <div className="w-3 h-3 rounded-full border-2 border-[#1C1C1C] bg-[#FBC343]"></div>
                    <div className="w-3 h-3 rounded-full border-2 border-[#1C1C1C] bg-[#8FB8D9]"></div>
                  </div>
                  <div className="flex-1 flex items-center justify-center bg-slate-50 relative overflow-hidden">
                    <span className="font-black text-4xl lg:text-5xl drop-shadow-[2px_2px_0px_white] z-10 text-center uppercase tracking-tight group-hover:scale-105 transition-transform">Interactive<br />Quizzes</span>
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-[#FBC343]/40 to-transparent pointer-events-none group-hover:from-[#FBC343]/60 transition-colors"></div>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }}>
                <h3 className="text-3xl md:text-4xl font-black mb-4">Adaptive Testing</h3>
                <p className="font-bold opacity-80 mb-6 text-base leading-relaxed max-w-md">Our testing engine learns what you have forgotten. It generates questions tailored to your weakest points to maximize your retention.</p>
                <ul className="space-y-4 font-bold opacity-90 mb-8">
                  <li className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-[#A5D5D5] border-2 border-[#1C1C1C] flex items-center justify-center text-white"><CheckCircle size={12} strokeWidth={3} /></div> Automatically generated from your PDFs</li>
                  <li className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-[#F4C5C5] border-2 border-[#1C1C1C] flex items-center justify-center text-white"><CheckCircle size={12} strokeWidth={3} /></div> Spaced repetition algorithm built-in</li>
                </ul>
                <button className="flex items-center gap-3 text-sm font-black bg-[#1C1C1C] text-white border-[3px] border-[#1C1C1C] px-6 py-3 rounded-full shadow-[4px_4px_0px_0px_#FBC343] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FBC343] transition-all" onClick={() => navigate('/signup')}>Generate a Quiz <ArrowRight size={18} /></button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-[#1C1C1C] py-32 border-b-4 border-[#1C1C1C] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 2px, transparent 2px), linear-gradient(90deg, #fff 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-5xl md:text-6xl font-black text-white drop-shadow-[4px_4px_0px_#A5D5D5] mb-6 tracking-tighter">Simple Pricing.</motion.h2>
            <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-2xl mx-auto font-bold opacity-80 text-white text-base md:text-lg">Start for free, upgrade when you need extreme neural acceleration.</motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -10 }} className="bg-white border-4 border-[#1C1C1C] rounded-4xl p-8 shadow-[8px_8px_0px_0px_#A5D5D5] flex flex-col group transition-transform">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1C1C1C]">Basic</h3>
                  <p className="font-bold text-[#1C1C1C]/60 text-sm mt-1">For casual students</p>
                </div>
                <div className="w-12 h-12 rounded-full border-[3px] border-[#1C1C1C] flex items-center justify-center bg-[#A5D5D5] shadow-[2px_2px_0px_0px_#1C1C1C]">
                  <FileText size={20} strokeWidth={3} className="text-[#1C1C1C]" />
                </div>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-black text-[#1C1C1C] drop-shadow-[2px_2px_0px_#A5D5D5]">₦0</span>
                <span className="text-[#1C1C1C]/60 font-bold uppercase tracking-widest text-xs ml-2">/ forever</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1 font-bold text-[#1C1C1C] text-sm">
                <li className="flex items-center gap-3"><CheckCircle size={18} className="text-[#A5D5D5]" /> 50 AI Output Credits</li>
                <li className="flex items-center gap-3"><CheckCircle size={18} className="text-[#A5D5D5]" /> Basic PDF Summaries</li>
                <li className="flex items-center gap-3"><CheckCircle size={18} className="text-[#A5D5D5]" /> Standard Quizzes</li>
                <li className="flex items-center gap-3"><CheckCircle size={18} className="text-[#A5D5D5]" /> General Support</li>
              </ul>
              <button onClick={() => navigate('/signup')} className="w-full bg-[#1C1C1C] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#A5D5D5] transition-all border-[3px] border-transparent">
                Start for Free
              </button>
            </motion.div>

            {/* Premium Tier */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} whileHover={{ y: -10 }} className="bg-[#FBC343] border-4 border-[#1C1C1C] rounded-4xl p-8 shadow-[8px_8px_0px_0px_#F4C5C5] flex flex-col group transition-transform relative overflow-hidden">
              <div className="absolute top-6 right-6 px-3 py-1 bg-white border-2 border-[#1C1C1C] rounded-full text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#1C1C1C] rotate-6 group-hover:rotate-0 transition-transform">Popular</div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1C1C1C]">Premium</h3>
                  <p className="font-bold text-[#1C1C1C]/70 text-sm mt-1">For intense study sessions</p>
                </div>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-black text-[#1C1C1C] drop-shadow-[2px_2px_0px_white]">₦1,500</span>
                <span className="text-[#1C1C1C]/70 font-bold uppercase tracking-widest text-xs ml-2">/ month</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1 font-bold text-[#1C1C1C] text-sm">
                <li className="flex items-center gap-3"><CheckCircle size={18} className="text-white fill-[#1C1C1C]" /> 200 AI Output Credits</li>
                <li className="flex items-center gap-3"><CheckCircle size={18} className="text-white fill-[#1C1C1C]" /> Advanced PDF Parsing & Analysis</li>
                <li className="flex items-center gap-3"><CheckCircle size={18} className="text-white fill-[#1C1C1C]" /> Dynamic Spaced Repetition Profiles</li>
                <li className="flex items-center gap-3"><CheckCircle size={18} className="text-white fill-[#1C1C1C]" /> Premium VIP Visual Assets (LED Glow)</li>
              </ul>
              <button onClick={() => navigate('/signup')} className="w-full bg-white text-[#1C1C1C] py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1C1C1C] transition-all border-[3px] border-[#1C1C1C] shadow-[4px_4px_0px_0px_#1C1C1C]">
                Upgrade to Premium
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Light Neo-Brutalist Bento Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 mt-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Main big block */}
          <div className="lg:col-span-2 bg-[#FBC343] border-[3px] border-[#1C1C1C] rounded-4xl p-8 md:p-10 shadow-[8px_8px_0px_0px_#1C1C1C] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:scale-110 transition-transform duration-500">
              <Brain size={180} />
            </div>
            <div className="relative z-10 mb-12">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4">Ready to <br />Level Up?</h2>
              <p className="font-bold text-[#1C1C1C] max-w-sm">Join thousands of students turning hours of reading into minutes of mastering.</p>
            </div>
            <button onClick={() => navigate('/signup')} className="relative z-10 self-start bg-[#1C1C1C] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_white] transition-all flex items-center gap-3">
              Get Started Free <ArrowRight size={20} strokeWidth={3} />
            </button>
          </div>

          {/* Links Block 1 */}
          <div className="bg-white border-[3px] border-[#1C1C1C] rounded-4xl p-8 shadow-[8px_8px_0px_0px_#1C1C1C]">
            <h3 className="font-black uppercase tracking-widest text-lg mb-6 border-b-[3px] border-[#1C1C1C] pb-4 inline-block">Platform</h3>
            <ul className="space-y-4 font-bold text-[#1C1C1C]">
              <li><a href="#" className="hover:text-[#FBC343] hover:underline decoration-[3px] underline-offset-4 transition-all flex items-center gap-2"><ArrowRight size={14} strokeWidth={3} /> Features</a></li>
              <li><a href="#" className="hover:text-[#F4C5C5] hover:underline decoration-[3px] underline-offset-4 transition-all flex items-center gap-2"><ArrowRight size={14} strokeWidth={3} /> Pricing</a></li>
              <li><a href="#" className="hover:text-[#A5D5D5] hover:underline decoration-[3px] underline-offset-4 transition-all flex items-center gap-2"><ArrowRight size={14} strokeWidth={3} /> FAQ</a></li>
              <li><a href="#" className="hover:text-[#8FB8D9] hover:underline decoration-[3px] underline-offset-4 transition-all flex items-center gap-2"><ArrowRight size={14} strokeWidth={3} /> Support</a></li>
            </ul>
          </div>

          {/* Links Block 2 */}
          <div className="bg-[#A5D5D5] border-[3px] border-[#1C1C1C] rounded-4xl p-8 shadow-[8px_8px_0px_0px_#1C1C1C] flex flex-col justify-between">
            <div>
              <h3 className="font-black uppercase tracking-widest text-lg mb-6 border-b-[3px] border-[#1C1C1C] pb-4 inline-block">Legal</h3>
              <ul className="space-y-4 font-bold text-[#1C1C1C]">
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={14} strokeWidth={3} /> Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={14} strokeWidth={3} /> Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight size={14} strokeWidth={3} /> Cookie Policy</a></li>
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t-[3px] border-[#1C1C1C]/20">
              <div className="flex gap-3">
                {['Tw', 'In', 'Tk'].map((social, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white border-[3px] border-[#1C1C1C] flex items-center justify-center hover:-translate-y-1 hover:shadow-[3px_3px_0px_0px_#1C1C1C] font-black text-xs transition-all">
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white border-[3px] border-[#1C1C1C] rounded-2xl p-6 shadow-[6px_6px_0px_0px_#1C1C1C] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="StudyLite.ai" className="h-6" />
            <span className="font-black tracking-tighter text-xl text-[#1C1C1C] pt-1">StudyLite.ai</span>
          </div>
          <p className="font-bold text-sm">© 2026 StudyLite.ai — All rights reserved.</p>
          <p className="font-bold text-sm flex items-center gap-2 bg-[#F4C5C5] px-3 py-1.5 border-[3px] border-[#1C1C1C] rounded-full">
            Built with <Heart size={14} className="fill-[#1C1C1C] text-[#1C1C1C]" />
          </p>
        </div>
      </footer>
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-100 bg-[#FBC343] text-[#1C1C1C] p-4 rounded-full border-[3px] border-[#1C1C1C] shadow-[4px_4px_0px_0px_#1C1C1C] hover:shadow-[6px_6px_0px_0px_#A5D5D5] transition-all focus:outline-none"
            aria-label="Scroll to top"
          >
            <ChevronUp size={28} strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;
