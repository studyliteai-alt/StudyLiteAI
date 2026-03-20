import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn.ts';
import { useTheme } from '../../context/ThemeContext.tsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    const { lowDataMode } = useTheme();

    const variantStyles = {
      primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md border border-transparent',
      secondary: 'bg-secondary text-black hover:bg-secondary/90 shadow-sm hover:shadow-md border border-transparent',
      accent: 'bg-accent text-white hover:bg-accent/90 shadow-sm hover:shadow-md border border-transparent',
      outline: 'bg-transparent border border-black/10 text-black hover:bg-black/5',
      ghost: 'bg-transparent text-black hover:bg-black/5 shadow-none border border-transparent'
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      icon: 'p-3'
    };

    const Component = lowDataMode ? 'button' : motion.button;
    const motionProps = lowDataMode ? {} : {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { type: 'spring', stiffness: 500, damping: 25 }
    };

    return (
      // @ts-ignore
      <Component
        ref={ref}
        className={cn(
          'font-inter font-medium tracking-tight flex items-center justify-center gap-2 rounded-xl transition-colors',
          variantStyles[variant as keyof typeof variantStyles],
          sizeStyles[size as keyof typeof sizeStyles],
          fullWidth && 'w-full',
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

Button.displayName = 'Button';

