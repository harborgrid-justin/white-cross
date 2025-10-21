/**
 * WF-SELECT-001 | Select.tsx - Select Component
 * Purpose: Dropdown select component with search and multi-select
 * Upstream: Design system | Dependencies: React, Tailwind CSS
 * Downstream: Forms, filters | Called by: Form components
 * Related: Input component, form validation
 * Exports: Select component | Key Features: Search, multi-select, validation
 * Last Updated: 2025-10-21 | File Type: .tsx
 * Critical Path: User selection → Validation → State update
 * LLM Context: Select component for White Cross healthcare platform
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'value' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  options: SelectOption[];
  value?: string | number | (string | number)[];
  onChange?: (value: string | number | (string | number)[]) => void;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  clearable?: boolean;
  loading?: boolean;
  maxHeight?: number;
}

const selectVariants = {
  default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  filled: 'bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500',
  outlined: 'border-2 border-gray-300 focus:border-blue-500 focus:ring-0'
};

const selectSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base'
};

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({
    className,
    label,
    error,
    helperText,
    required = false,
    variant = 'default',
    size = 'md',
    options = [],
    value,
    onChange,
    placeholder = 'Select an option...',
    searchable = false,
    multiple = false,
    clearable = false,
    loading = false,
    disabled,
    id,
    maxHeight = 200,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const selectRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const selectedValues = Array.isArray(value) ? value : value !== undefined ? [value] : [];
    
    const filteredOptions = searchable && searchTerm
      ? options.filter(option => 
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    const selectedLabels = options
      .filter(option => selectedValues.includes(option.value))
      .map(option => option.label);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchTerm('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    const handleToggle = () => {
      if (!disabled && !loading) {
        setIsOpen(!isOpen);
      }
    };

    const handleOptionClick = (optionValue: string | number) => {
      if (multiple) {
        const newValues = selectedValues.includes(optionValue)
          ? selectedValues.filter(v => v !== optionValue)
          : [...selectedValues, optionValue];
        onChange?.(newValues);
      } else {
        onChange?.(optionValue);
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(multiple ? [] : '');
    };

    const displayValue = selectedLabels.length > 0 
      ? (multiple && selectedLabels.length > 1 
          ? `${selectedLabels.length} selected` 
          : selectedLabels[0])
      : placeholder;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
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
        
        <div className="relative" ref={selectRef}>
          <div
            id={selectId}
            className={cn(
              'relative w-full cursor-pointer rounded-md border shadow-sm transition-colors',
              'focus:outline-none focus:ring-1',
              'disabled:cursor-not-allowed disabled:bg-gray-50',
              selectVariants[variant],
              selectSizes[size],
              hasError && 'border-red-300 focus:border-red-500 focus:ring-red-500',
              disabled && 'bg-gray-50 text-gray-500',
              className
            )}
            onClick={handleToggle}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggle();
              }
            }}
          >
            <span className={cn(
              'block truncate',
              selectedLabels.length === 0 && 'text-gray-400'
            )}>
              {displayValue}
            </span>
            
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : (
                <>
                  {clearable && selectedLabels.length > 0 && (
                    <button
                      type="button"
                      className="mr-1 p-1 text-gray-400 hover:text-gray-600"
                      onClick={handleClear}
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </span>
          </div>

          {isOpen && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              {searchable && (
                <div className="p-2 border-b border-gray-200">
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              
              <div
                className="py-1 overflow-auto"
                style={{ maxHeight }}
              >
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    {searchTerm ? 'No options found' : 'No options available'}
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <div
                        key={option.value}
                        className={cn(
                          'relative cursor-pointer select-none py-2 pl-3 pr-9 text-sm',
                          isSelected ? 'bg-blue-100 text-blue-900' : 'text-gray-900 hover:bg-gray-100',
                          option.disabled && 'cursor-not-allowed opacity-50'
                        )}
                        onClick={() => !option.disabled && handleOptionClick(option.value)}
                      >
                        <span className={cn(
                          'block truncate',
                          isSelected ? 'font-medium' : 'font-normal'
                        )}>
                          {option.label}
                        </span>
                        
                        {isSelected && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${selectId}-error`}>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500" id={`${selectId}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
