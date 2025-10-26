/**
 * FormFields Components
 * Reusable form input components with validation display
 */

'use client';

import React from 'react';
import { FieldError } from 'react-hook-form';

// Base Input Props
interface BaseInputProps {
  label?: string;
  error?: FieldError | string;
  required?: boolean;
  helperText?: string;
  className?: string;
}

// Text Input
export interface TextInputProps extends BaseInputProps {
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  autoComplete?: string;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      error,
      required,
      helperText,
      className = '',
      name,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const errorMessage = typeof error === 'string' ? error : error?.message;

    return (
      <div className={`mb-4.5 ${className}`}>
        {label && (
          <label
            htmlFor={name}
            className="mb-2.5 block font-medium text-black dark:text-white"
          >
            {label} {required && <span className="text-meta-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          className={`w-full rounded border-[1.5px] bg-white px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
            errorMessage
              ? 'border-meta-1 focus:border-meta-1'
              : 'border-stroke'
          }`}
          {...props}
        />
        {helperText && !errorMessage && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
        {errorMessage && (
          <p className="mt-1 text-sm text-meta-1">{errorMessage}</p>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

// Textarea
export interface TextareaProps extends BaseInputProps {
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  rows?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      required,
      helperText,
      className = '',
      name,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const errorMessage = typeof error === 'string' ? error : error?.message;

    return (
      <div className={`mb-4.5 ${className}`}>
        {label && (
          <label
            htmlFor={name}
            className="mb-2.5 block font-medium text-black dark:text-white"
          >
            {label} {required && <span className="text-meta-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={name}
          name={name}
          rows={rows}
          className={`w-full rounded border-[1.5px] bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
            errorMessage
              ? 'border-meta-1 focus:border-meta-1'
              : 'border-stroke'
          }`}
          {...props}
        />
        {helperText && !errorMessage && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
        {errorMessage && (
          <p className="mt-1 text-sm text-meta-1">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends BaseInputProps {
  name: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      required,
      helperText,
      className = '',
      name,
      options,
      placeholder,
      ...props
    },
    ref
  ) => {
    const errorMessage = typeof error === 'string' ? error : error?.message;

    return (
      <div className={`mb-4.5 ${className}`}>
        {label && (
          <label
            htmlFor={name}
            className="mb-2.5 block font-medium text-black dark:text-white"
          >
            {label} {required && <span className="text-meta-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={name}
          name={name}
          className={`w-full rounded border-[1.5px] bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
            errorMessage
              ? 'border-meta-1 focus:border-meta-1'
              : 'border-stroke'
          }`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helperText && !errorMessage && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
        {errorMessage && (
          <p className="mt-1 text-sm text-meta-1">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Checkbox
export interface CheckboxProps extends BaseInputProps {
  name: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      helperText,
      className = '',
      name,
      ...props
    },
    ref
  ) => {
    const errorMessage = typeof error === 'string' ? error : error?.message;

    return (
      <div className={`mb-4.5 ${className}`}>
        <label className="flex cursor-pointer items-start">
          <div className="relative pt-0.5">
            <input
              ref={ref}
              id={name}
              name={name}
              type="checkbox"
              className="sr-only"
              {...props}
            />
            <div
              className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                errorMessage ? 'border-meta-1' : 'border-stroke'
              } dark:border-strokedark`}
            >
              <span className="h-2.5 w-2.5 rounded-sm bg-primary opacity-0"></span>
            </div>
          </div>
          {label && (
            <span className="font-normal text-black dark:text-white">
              {label}
            </span>
          )}
        </label>
        {helperText && !errorMessage && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
        {errorMessage && (
          <p className="mt-1 text-sm text-meta-1">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Submit Button
export interface SubmitButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function SubmitButton({
  children,
  isLoading = false,
  disabled = false,
  className = '',
  variant = 'primary',
}: SubmitButtonProps) {
  const variantStyles = {
    primary: 'bg-primary hover:bg-opacity-90',
    secondary: 'bg-gray-2 hover:bg-gray-3 text-black dark:bg-meta-4 dark:text-white',
    danger: 'bg-danger hover:bg-opacity-90',
  };

  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className={`flex w-full justify-center rounded p-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
