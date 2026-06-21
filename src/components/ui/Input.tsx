import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label, error, hint, leftIcon, rightIcon, className, id, ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '_');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100',
            'placeholder:text-slate-400 dark:placeholder:text-slate-500',
            'transition-all duration-200 outline-none',
            'focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500',
            error
              ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
              : 'border-slate-200 dark:border-slate-600',
            leftIcon ? 'pl-10' : 'px-4',
            rightIcon ? 'pr-10' : '',
            'py-2.5 text-sm',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label, error, options, className, id, ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '_');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100',
          'transition-all duration-200 outline-none py-2.5 px-4 text-sm cursor-pointer',
          'focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500',
          error
            ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
            : 'border-slate-200 dark:border-slate-600',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label, error, className, id, ...props
}) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '_');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'w-full rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100',
          'placeholder:text-slate-400 dark:placeholder:text-slate-500',
          'transition-all duration-200 outline-none px-4 py-2.5 text-sm resize-none',
          'focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500',
          error
            ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
            : 'border-slate-200 dark:border-slate-600',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};
