import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn.ts';
import { useTheme } from '../../context/ThemeContext.tsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'primary' | 'secondary' | 'accent' | 'glass';
  noHover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'white', noHover = false, children, ...props }, ref) => {
    const { lowDataMode } = useTheme();

    const variantStyles = {
      white: 'bg-white text-black border-slate-100',
      primary: 'bg-primary text-white border-transparent shadow-primary/20',
      secondary: 'bg-secondary text-black border-transparent shadow-secondary/20',
      accent: 'bg-accent text-white border-transparent shadow-accent/20',
      glass: 'glass-card'
    };

    const Component = lowDataMode ? 'div' : motion.div;
    const motionProps = lowDataMode || noHover ? {} : {
      whileHover: { y: -4, boxShadow: '0 12px 32px -8px rgba(0,0,0,0.08)' },
      transition: { type: 'spring', stiffness: 400, damping: 25 }
    };

    return (
      // @ts-ignore
      <Component
        ref={ref}
        className={cn(
          'p-8 rounded-2xl transition-all duration-300',
          variant !== 'glass' && 'border shadow-sm',
          variantStyles[variant as keyof typeof variantStyles],
          lowDataMode && 'low-data',
          className
        )}
        {...motionProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';


