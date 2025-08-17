import React, { Fragment, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../Button/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  centerContent?: boolean;
  scrollBehavior?: 'inside' | 'outside';
  animationPreset?: 'fade' | 'slide' | 'scale' | 'flip';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  centerContent = false,
  scrollBehavior = 'inside',
  animationPreset = 'scale',
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && closeOnEsc) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, closeOnEsc]);
  
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    'full': 'max-w-full mx-4',
  };

  const modalContentClasses = `
    ${sizeClasses[size]} w-full rounded-lg bg-white dark:bg-gray-800 shadow-2xl transform
    ${scrollBehavior === 'inside' ? 'max-h-[calc(100vh-2rem)] flex flex-col' : ''}
  `;

  const bodyClasses = `px-6 py-4 ${scrollBehavior === 'inside' ? 'overflow-y-auto flex-1' : ''}`;

  // Animation variants based on preset
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slide: {
      hidden: { opacity: 0, y: -50 },
      visible: { opacity: 1, y: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 },
    },
    flip: {
      hidden: { opacity: 0, rotateX: 80 },
      visible: { opacity: 1, rotateX: 0 },
    },
  };

  const selectedVariant = modalVariants[animationPreset];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            transition={{ duration: 0.2 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
          >
            <motion.div 
              className={modalContentClasses}
              role="dialog"
              aria-modal="true"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={selectedVariant}
              transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 30 
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {title && (
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 relative">
                  <motion.h3 
                    className="text-lg font-medium text-gray-900 dark:text-white"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {title}
                  </motion.h3>
                  
                  {showCloseButton && (
                    <motion.button
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                      onClick={onClose}
                      aria-label="Close"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  )}
                </div>
              )}
              
              <motion.div 
                className={bodyClasses}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <div className={centerContent ? 'flex flex-col items-center' : ''}>
                  {children}
                </div>
              </motion.div>
              
              {footer && (
                <motion.div 
                  className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {footer}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
};

export default Modal;