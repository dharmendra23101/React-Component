import React, { ChangeEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  name?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
  variant?: 'outlined' | 'filled' | 'ghost' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  helperText?: string;
  errorMessage?: string;
  showClearButton?: boolean;
  showPasswordToggle?: boolean;
  readOnly?: boolean;
  required?: boolean;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  maxLength?: number;
  showCharacterCount?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value = '',
  defaultValue,
  name,
  onChange,
  onClear,
  onFocus,
  onBlur,
  type = 'text',
  variant = 'outlined',
  size = 'md',
  disabled = false,
  invalid = false,
  loading = false,
  helperText,
  errorMessage,
  showClearButton = false,
  showPasswordToggle = false,
  readOnly = false,
  required = false,
  className = '',
  leftIcon,
  rightIcon,
  maxLength,
  showCharacterCount = false,
  autoFocus = false,
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasInteracted(true);
    if (onBlur) onBlur(e);
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg',
  };
  
  const variantClasses = {
    outlined: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700',
    filled: 'bg-gray-100 dark:bg-gray-700 border border-transparent',
    ghost: 'bg-transparent border border-transparent',
    floating: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 pt-4',
  };
  
  const stateClasses = {
    default: 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400',
    invalid: 'border-red-500 dark:border-red-400 focus:ring-2 focus:ring-red-500 focus:border-red-500',
    disabled: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed',
    focused: 'ring-2 ring-blue-500 border-blue-500 dark:border-blue-400',
  };
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  // Set readOnly if we have a value but no onChange handler
  const isReadOnly = readOnly || (value !== undefined && !onChange);
  
  // Calculate character count
  const charCount = value ? value.length : 0;
  const hasMaxLength = maxLength !== undefined;
  const isOverLimit = hasMaxLength && charCount > maxLength;
  
  // Determine if we should show left/right padding based on icon presence
  const leftPaddingClass = leftIcon ? 'pl-10' : 'pl-3';
  const rightPaddingClass = (showClearButton || showPasswordToggle || loading || rightIcon || (showCharacterCount && hasMaxLength)) ? 'pr-10' : 'pr-3';
  
  // For floating label variant
  const labelClasses = variant === 'floating' 
    ? `absolute top-2 left-3 text-xs font-medium text-gray-500 dark:text-gray-400 transition-all pointer-events-none ${required ? 'after:content-["*"] after:text-red-500 after:ml-0.5' : ''}`
    : `block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 ${required ? 'after:content-["*"] after:text-red-500 after:ml-0.5' : ''}`;
  
  const floatingPlaceholder = variant === 'floating' ? (isFocused || value || defaultValue ? '' : placeholder) : placeholder;
  
  return (
    <div className={`w-full ${className}`}>
      {label && variant !== 'floating' && (
        <motion.label 
          className={labelClasses}
          htmlFor={name}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          type={inputType}
          name={name}
          id={name}
          className={`
            w-full rounded-md
            ${leftPaddingClass} ${rightPaddingClass} 
            ${sizeClasses[size]} 
            ${variantClasses[variant]}
            ${disabled 
              ? stateClasses.disabled 
              : invalid 
                ? stateClasses.invalid 
                : isFocused 
                  ? stateClasses.focused 
                  : stateClasses.default}
            transition-all duration-200
          `}
          placeholder={floatingPlaceholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          readOnly={isReadOnly}
          aria-invalid={invalid}
          required={required}
          maxLength={maxLength}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
        />
        
        {variant === 'floating' && label && (
          <label 
            className={labelClasses}
            htmlFor={name}
          >
            {label}
          </label>
        )}
        
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <motion.svg 
              className="animate-spin h-5 w-5 text-gray-400" 
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
          </div>
        )}
        
        {!loading && rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            {rightIcon}
          </div>
        )}
        
        {!loading && showClearButton && value && (
          <motion.button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={onClear}
            aria-label="Clear input"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </motion.button>
        )}
        
        {!loading && showPasswordToggle && type === 'password' && (
          <motion.button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            )}
          </motion.button>
        )}
        
        {!loading && !showClearButton && !showPasswordToggle && !rightIcon && showCharacterCount && hasMaxLength && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className={`text-xs font-medium ${isOverLimit ? 'text-red-500' : 'text-gray-400'}`}>
              {charCount}/{maxLength}
            </span>
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {helperText && !invalid && (
          <motion.p 
            className="mt-1 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {helperText}
          </motion.p>
        )}
        
        {invalid && errorMessage && (
          <motion.p 
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {errorMessage}
          </motion.p>
        )}
        
        {showCharacterCount && hasMaxLength && isOverLimit && (
          <motion.p 
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            Character limit exceeded
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputField;