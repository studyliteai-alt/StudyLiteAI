import React from 'react';
import { cn } from '../../utils/cn.ts';
import { useTheme } from '../../context/ThemeContext.tsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className, 
  ...props 
}) => {
  const { lowDataMode } = useTheme();

  return (
    <div className='flex flex-col gap-2'>
      {label && <label className='font-space font-bold uppercase text-sm tracking-wider'>{label}</label>}
      <input 
        className={cn(
          'nb-input outline-none focus:ring-0',
          error ? 'border-accent' : 'border-black',
          lowDataMode ? 'low-data' : '',
          className
        )}
        {...props}
      />
      {error && <span className='text-accent text-xs font-bold uppercase'>{error}</span>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ 
  label, 
  error, 
  className, 
  ...props 
}) => {
  const { lowDataMode } = useTheme();

  return (
    <div className='flex flex-col gap-2'>
      {label && <label className='font-space font-bold uppercase text-sm tracking-wider'>{label}</label>}
      <textarea 
        className={cn(
          'nb-input block w-full resize-none font-inter min-h-[120px] focus:ring-0',
          error ? 'border-accent' : 'border-black',
          lowDataMode ? 'low-data' : '',
          className
        )}
        {...props}
      />
      {error && <span className='text-accent text-xs font-bold uppercase'>{error}</span>}
    </div>
  );
};
