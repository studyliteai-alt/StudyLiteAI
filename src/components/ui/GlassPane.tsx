import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlassPaneProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const GlassPane: React.FC<GlassPaneProps> = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      className={cn(
        'bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group',
        className
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-white/40 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

