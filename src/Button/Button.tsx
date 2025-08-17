import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { tokens } from '../styles/tokens';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'success' | 'danger' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  isActive?: boolean;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animateOnHover?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  isActive = false,
  elevation = 'sm',
  rounded = 'md',
  animateOnHover = true,
  ...rest
}) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20',
    secondary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20',
    outline: 'bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300',
    link: 'bg-transparent underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-0 h-auto',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/20',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20',
  };
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
    xl: 'px-6 py-3 text-xl',
  };

  const elevationClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
  
  const isDisabled = disabled || isLoading;

  // For link variant, don't apply certain classes
  const buttonClasses = variant === 'link' 
    ? `inline-flex items-center justify-center font-medium transition-colors
       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
       ${variantClasses[variant]}
       ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}
       ${fullWidth ? 'w-full' : ''}
       ${className}`
    : `inline-flex items-center justify-center font-medium transition-all duration-200
       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
       ${variantClasses[variant]}
       ${sizeClasses[size]}
       ${elevationClasses[elevation]}
       ${roundedClasses[rounded]}
       ${isActive ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
       ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}
       ${fullWidth ? 'w-full' : ''}
       ${className}`;
  
  // Animation properties for Framer Motion
  const animationProps = animateOnHover ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { 
      type: "spring" as const, 
      stiffness: 400, 
      damping: 17 
    }
  } : {};
  
  return (
    <motion.button
      className={buttonClasses}
      disabled={isDisabled}
      {...animationProps}
      {...rest}
    >
      {isLoading && (
        <motion.svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </motion.svg>
      )}
      
      {!isLoading && leftIcon && (
        <motion.span 
          className="mr-2"
          initial={{ x: -5, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {leftIcon}
        </motion.span>
      )}
      
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      
      {!isLoading && rightIcon && (
        <motion.span 
          className="ml-2"
          initial={{ x: 5, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {rightIcon}
        </motion.span>
      )}
    </motion.button>
  );
};

export default Button;