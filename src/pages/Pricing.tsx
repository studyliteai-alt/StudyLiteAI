import React from 'react';
import { Sidebar } from './dashboard/Sidebar.tsx';
import { TopBar } from './dashboard/TopBar.tsx';
import { Card } from '../components/ui/Card.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn.ts';

const PricingPage: React.FC = () => {
    const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');

    const plans = [
        {
          name: "Basic",
          price: billingCycle === 'monthly' ? "0" : "0",
          features: ["5 sessions per month", "Standard AI", "Summary view only", "Ad-supported"],
          cta: "Current Plan",
          tag: "Starter",
          active: true,
          color: "bg-white",
          rotate: "-rotate-1"
        },
        {
          name: "Student Pro",
          price: billingCycle === 'monthly' ? "5" : "4",
          features: ["Unlimited sessions", "Advanced AI Quiz Generator", "Low Data Mode", "Ads-free experience", "Priority Support"],
          cta: "Upgrade to Pro",
          tag: "Explosive Value",
          active: false,
          color: "bg-secondary",
          rotate: "rotate-1"
        },
        {
          name: "School",
          price: "Custom",
          features: ["Bulk student accounts", "Learning Analytics dashboard", "SSO integration", "Custom AI models", "24/7 Support"],
          cta: "Contact Us",
          tag: "Institutions",
          active: false,
          color: "bg-black text-white",
          rotate: "rotate-0"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className='flex h-screen bg-off-white overflow-hidden font-inter'>
            <Sidebar />
            <div className='flex flex-col grow'>
                <TopBar />
                
                <main className='grow p-10 overflow-y-auto grid-bg relative'>
                    <div className='max-w-6xl mx-auto'>
                        <header className='mb-20 text-center flex flex-col items-center'>
                            <motion.h1 
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className='text-7xl font-black uppercase italic mb-6 leading-none tracking-tighter'
                            >
                                Choose Your Level
                            </motion.h1>
                            <motion.p 
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className='font-black opacity-30 uppercase italic max-w-xl tracking-widest text-sm'
                            >
                                Join thousands of students across Africa using AI to simplify their studies.
                            </motion.p>
                            
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className='flex items-center gap-6 mt-12 bg-black p-2 border-[3px] border-black rounded-2xl relative'
                            >
                                <motion.div 
                                    className='absolute bg-secondary border-2 border-black h-[calc(100%-16px)] rounded-xl z-0'
                                    animate={{ 
                                        x: billingCycle === 'monthly' ? 0 : 124,
                                        width: billingCycle === 'monthly' ? 120 : 110
                                    }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                                <button 
                                    onClick={() => setBillingCycle('monthly')}
                                    className={cn(
                                        'px-8 py-3 font-black uppercase italic text-sm tracking-widest transition-colors z-10 relative',
                                        billingCycle === 'monthly' ? 'text-black' : 'text-white'
                                    )}
                                >
                                    Monthly
                                </button>
                                <button 
                                    onClick={() => setBillingCycle('yearly')}
                                    className={cn(
                                        'px-8 py-3 font-black uppercase italic text-sm tracking-widest transition-colors z-10 relative',
                                        billingCycle === 'yearly' ? 'text-black' : 'text-white'
                                    )}
                                >
                                    Yearly <span className='text-[10px] opacity-60 ml-1'>(-20%)</span>
                                </button>
                            </motion.div>
                        </header>

                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className='grid md:grid-cols-3 gap-10 items-stretch font-inter mb-32'
                        >
                            {plans.map((p, i) => (
                                <motion.div 
                                    key={i} 
                                    variants={itemVariants}
                                    whileHover={{ y: -10, rotate: i === 1 ? 0 : (i === 0 ? -2 : 2) }}
                                    className='h-full flex flex-col'
                                >
                                    <Card className={cn(p.color, 'p-10 flex flex-col h-full border-black border-[3px] shadow-[8px_8px_0px_0px_#000] relative overflow-visible')} noHover>
                                       {i === 1 && (
                                            <motion.div 
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className='absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 font-black uppercase italic border-2 border-white shadow-[4px_4px_0px_0px_#7C3AED] text-[10px] tracking-widest z-10 w-max'
                                            >
                                                Most Popular Choice
                                            </motion.div>
                                       )}
                                       <div className='mb-10'>
                                          <div className='text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-4 italic leading-none'>{p.tag}</div>
                                          <h3 className='text-4xl font-black uppercase italic mb-8 font-space'>{p.name}</h3>
                                          <div className='text-6xl font-black flex items-baseline gap-1 tracking-tighter'>
                                             {p.price !== 'Custom' && <span className='text-2xl'>$</span>}
                                             {p.price}
                                             {p.price !== 'Custom' && <span className='text-lg opacity-40 uppercase ml-2 tracking-widest'>/mo</span>}
                                          </div>
                                       </div>
                                       
                                       <ul className='grow flex flex-col gap-6 mb-12'>
                                          {p.features.map((f, j) => (
                                              <li key={j} className='flex items-center gap-4 font-black uppercase text-xs italic tracking-tighter leading-none'>
                                                 <div className={cn(
                                                     'w-6 h-6 flex items-center justify-center border-black border-[2px] shadow-[2px_2px_0px_0px_#000] shrink-0 rounded-lg',
                                                     i === 2 ? 'bg-secondary text-black' : 'bg-black text-white'
                                                 )}><Check size={14} strokeWidth={4} /></div>
                                                 {f}
                                              </li>
                                          ))}
                                       </ul>
                                       
                                       <Button 
                                            variant={i === 1 ? 'primary' : 'outline'} 
                                            fullWidth 
                                            size='lg'
                                            disabled={p.active}
                                            className={cn(
                                                'mt-auto font-black italic uppercase tracking-widest py-6 rounded-2xl border-2 border-black transition-all',
                                                i === 1 ? 'shadow-[4px_4px_0px_0px_#000] hover:shadow-none' : 'hover:bg-black hover:text-white'
                                            )}
                                       >
                                          {p.cta}
                                       </Button>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                        
                        {/* Comparison Table */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className='hidden md:block pb-32'
                        >
                            <h2 className='text-5xl font-black uppercase italic text-center mb-16 tracking-tighter'>Feature Comparison</h2>
                            <Card className='p-0 overflow-hidden border-black border-[3px] shadow-[10px_10px_0px_0px_#000] rounded-[32px]'>
                                <table className='w-full border-collapse'>
                                    <thead>
                                        <tr className='bg-black text-white border-b-2 border-black'>
                                            <th className='p-8 text-left font-black uppercase italic border-r-2 border-white/10 tracking-widest text-xs'>Key Feature</th>
                                            <th className='p-8 text-center font-black uppercase italic border-r-2 border-white/10 tracking-widest text-xs'>Basic</th>
                                            <th className='p-8 text-center font-black uppercase italic border-r-2 border-white/10 tracking-widest text-xs text-secondary'>Pro Plan</th>
                                            <th className='p-8 text-center font-black uppercase italic tracking-widest text-xs'>Institutions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='font-black uppercase italic text-xs tracking-widest'>
                                        {[
                                            { name: "Monthly Sessions", b: "5", p: "Unlimited", s: "Unlimited" },
                                            { name: "AI Difficulty Level", b: "Standard", p: "Advanced", s: "Custom" },
                                            { name: "Low Data Mode", b: "✗", p: "✓", s: "✓" },
                                            { name: "Quiz Generation", b: "Limited", p: "Full", s: "Full" },
                                            { name: "Support Response", b: "48h", p: "Priority", s: "24/7" },
                                            { name: "Ad-Free Experience", b: "✗", p: "✓", s: "✓" }
                                        ].map((row, i) => (
                                            <tr key={i} className='border-b-2 border-black last:border-b-0 group hover:bg-black/5 transition-colors'>
                                                <td className='p-8 border-r-2 border-black font-bold opacity-60'>{row.name}</td>
                                                <td className='p-8 text-center border-r-2 border-black opacity-30'>{row.b}</td>
                                                <td className='p-8 text-center border-r-2 border-black bg-secondary/5 font-black text-primary text-sm'>{row.p}</td>
                                                <td className='p-8 text-center opacity-60'>{row.s}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PricingPage;
