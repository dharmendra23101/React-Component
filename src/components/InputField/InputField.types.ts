import { ReactNode } from 'react';

export interface InputFieldProps {
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  type?: string;
  name?: string;
  id?: string;
  className?: string;
  showClearButton?: boolean;
  showPasswordToggle?: boolean;
  onClear?: () => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  maxLength?: number;
  showCharacterCount?: boolean;
  required?: boolean;
}