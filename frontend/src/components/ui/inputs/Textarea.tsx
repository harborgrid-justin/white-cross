'use client';

/**
 * WF-TEXTAREA-001 | Textarea.tsx - Textarea Component
 * Purpose: Multi-line text input with validation and auto-resize
 * Upstream: Design system | Dependencies: React, Tailwind CSS
 * Downstream: Forms, notes, descriptions | Called by: Form components
 * Related: Input component, form validation
 * Exports: Textarea component | Key Features: Auto-resize, validation, character count
 * Last Updated: 2025-10-21 | File Type: .tsx
 * Critical Path: User input → Validation → State update
 * LLM Context: Textarea component for White Cross healthcare platform
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  autoResize?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  minRows?: number;
  maxRows?: number;
}

const textareaVariants = {
  default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  filled: 'bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500',
  outlined: 'border-2 border-gray-300 focus:border-blue-500 focus:ring-0'
};

const textareaSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base'
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    label,
    error,
    helperText,
    required = false,
    variant = 'default',
    size = 'md',
    autoResize = false,
    maxLength,
    showCharCount = false,
    minRows = 3,
    maxRows = 10,
    disabled,
    id,
    value,
    onChange,
    ...props
  }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const internalRef = ref || textareaRef;
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const currentLength = typeof value === 'string' ? value.length : 0;

    const adjustHeight = useCallback(() => {
      const textarea = typeof internalRef === 'object' && internalRef?.current;
      if (autoResize && textarea) {
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
        const minHeight = lineHeight * minRows;
        const maxHeight = lineHeight * maxRows;
        
        textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
      }
    }, [autoResize, internalRef, minRows, maxRows]);

    useEffect(() => {
      adjustHeight();
    }, [value, adjustHeight]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (maxLength && e.target.value.length > maxLength) {
        return;
      }
      onChange?.(e);
      if (autoResize) {
        setTimeout(adjustHeight, 0);
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'block text-sm font-medium mb-1',
              hasError ? 'text-red-700' : 'text-gray-700',
              disabled && 'text-gray-400'
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <textarea
            ref={internalRef}
            id={textareaId}
            className={cn(
              'block w-full rounded-md border shadow-sm transition-colors resize-none',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
              textareaVariants[variant],
              textareaSizes[size],
              hasError && 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500',
              !autoResize && 'resize-y',
              className
            )}
            disabled={disabled}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-required={required ? 'true' : undefined}
            aria-describedby={
              error ? `${textareaId}-error` :
              helperText ? `${textareaId}-helper` : undefined
            }
            rows={autoResize ? minRows : props.rows || minRows}
            value={value}
            onChange={handleChange}
            {...props}
          />
        </div>
        
        <div className="flex justify-between items-start mt-1">
          <div className="flex-1">
            {error && (
              <p className="text-sm text-red-600" id={`${textareaId}-error`}>
                {error}
              </p>
            )}
            
            {helperText && !error && (
              <p className="text-sm text-gray-500" id={`${textareaId}-helper`}>
                {helperText}
              </p>
            )}
          </div>
          
          {(showCharCount || maxLength) && (
            <div className="ml-2 flex-shrink-0">
              <span className={cn(
                'text-xs',
                maxLength && currentLength > maxLength * 0.9 ? 'text-orange-600' :
                maxLength && currentLength === maxLength ? 'text-red-600' :
                'text-gray-500'
              )}>
                {maxLength ? `${currentLength}/${maxLength}` : currentLength}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
