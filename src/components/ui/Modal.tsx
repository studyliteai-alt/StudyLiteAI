import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Card } from './Card.tsx';
import { Button } from './Button.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}) => {
  const { lowDataMode } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm'>
          <motion.div 
            initial={lowDataMode ? {} : { opacity: 0, scale: 0.9, y: 20 }}
            animate={lowDataMode ? {} : { opacity: 1, scale: 1, y: 0 }}
            exit={lowDataMode ? {} : { opacity: 0, scale: 0.9, y: 20 }}
            className='w-full max-w-lg'
          >
            <Card className='relative w-full max-h-[90vh] overflow-y-auto p-0'>
              <div className='sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b-2 border-black'>
                <h2 className='text-xl italic'>{title}</h2>
                <Button 
                  variant='ghost' 
                  size='sm' 
                  onClick={onClose}
                  className='border-none p-1 min-w-0'
                >
                  <X />
                </Button>
              </div>
              <div className='p-6'>
                {children}
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
