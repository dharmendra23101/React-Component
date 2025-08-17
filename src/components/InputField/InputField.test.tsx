import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputField } from './InputField';

describe('InputField', () => {
  test('renders input element with label', () => {
    render(<InputField label="Email" name="email" />);
    
    const labelElement = screen.getByText(/Email/i);
    const inputElement = screen.getByRole('textbox');
    
    expect(labelElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
  });

  test('handles onChange event', () => {
    const handleChange = jest.fn();
    render(<InputField onChange={handleChange} />);
    
    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'test@example.com' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('displays helper text', () => {
    render(<InputField helperText="This is a helper text" name="test" />);
    
    const helperText = screen.getByText(/This is a helper text/i);
    
    expect(helperText).toBeInTheDocument();
  });

  test('displays error message when invalid', () => {
    render(
      <InputField 
        invalid 
        errorMessage="This field is required" 
        name="test" 
      />
    );
    
    const errorMessage = screen.getByText(/This field is required/i);
    
    expect(errorMessage).toBeInTheDocument();
  });

  test('applies disabled attribute', () => {
    render(<InputField disabled name="test" />);
    
    const inputElement = screen.getByRole('textbox');
    
    expect(inputElement).toBeDisabled();
  });

  test('toggles password visibility', () => {
    render(
      <InputField 
        type="password" 
        showPasswordToggle 
        name="password"
      />
    );
    
    // Get the input element and verify it's a password field
    const inputElement = screen.getByRole('textbox') as HTMLInputElement;
    expect(inputElement.type).toBe('password');
    
    // Find the toggle button using the aria-label
    const toggleButton = screen.getByRole('button', { name: /Show password/i });
    fireEvent.click(toggleButton);
    
    // After clicking, the type should be changed to text
    expect(inputElement.type).toBe('text');
  });

  test('clears input when clear button is clicked', () => {
    const handleClear = jest.fn();
    render(
      <InputField 
        value="test value" 
        showClearButton 
        onClear={handleClear} 
        name="test"
      />
    );
    
    // Find the clear button using the aria-label
    const clearButton = screen.getByRole('button', { name: /Clear input/i });
    fireEvent.click(clearButton);
    
    expect(handleClear).toHaveBeenCalledTimes(1);
  });
  
  test('renders with different variants', () => {
    const { rerender } = render(<InputField variant="outlined" name="test" />);
    let inputElement = screen.getByRole('textbox');
    
    expect(inputElement).toHaveClass('bg-white');
    expect(inputElement).toHaveClass('border-gray-300');
    
    rerender(<InputField variant="filled" name="test" />);
    inputElement = screen.getByRole('textbox');
    
    expect(inputElement).toHaveClass('bg-gray-100');
    expect(inputElement).toHaveClass('border-transparent');
    
    rerender(<InputField variant="ghost" name="test" />);
    inputElement = screen.getByRole('textbox');
    
    expect(inputElement).toHaveClass('bg-transparent');
    expect(inputElement).toHaveClass('border-transparent');
  });
  
  test('renders with different sizes', () => {
    const { rerender } = render(<InputField size="sm" name="test" />);
    let inputElement = screen.getByRole('textbox');
    
    expect(inputElement).toHaveClass('h-8');
    expect(inputElement).toHaveClass('text-sm');
    
    rerender(<InputField size="md" name="test" />);
    inputElement = screen.getByRole('textbox');
    
    expect(inputElement).toHaveClass('h-10');
    expect(inputElement).toHaveClass('text-base');
    
    rerender(<InputField size="lg" name="test" />);
    inputElement = screen.getByRole('textbox');
    
    expect(inputElement).toHaveClass('h-12');
    expect(inputElement).toHaveClass('text-lg');
  });
  
  test('shows loading spinner', () => {
    render(<InputField loading name="test" />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});