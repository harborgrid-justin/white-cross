'use client';

/**
 * WF-DATEPICKER-001 | DatePicker.tsx - Date Picker Component
 * Purpose: Date selection input with calendar popup
 * Upstream: Design system | Dependencies: React, Tailwind CSS, date-fns
 * Downstream: Forms, scheduling, health records
 * Related: TimePicker, Input
 * Exports: DatePicker component | Key Features: Calendar view, keyboard navigation, date validation
 * Last Updated: 2025-10-26 | File Type: .tsx
 * Critical Path: Click input → Show calendar → Select date → Update value
 * LLM Context: Date picker component for White Cross healthcare platform
 */

import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Props for the DatePicker component.
 */
export interface DatePickerProps {
  /** Current selected date */
  value?: Date | null;
  /** Callback when date changes */
  onChange: (date: Date | null) => void;
  /** Label for the input */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Required field */
  required?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Additional class name */
  className?: string;
}

/**
 * Format date as YYYY-MM-DD for input value
 */
const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format date for display
 */
const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Parse date from input value
 */
const parseDateFromInput = (value: string): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Check if date is within range
 */
const isDateInRange = (date: Date, minDate?: Date, maxDate?: Date): boolean => {
  if (minDate && date < minDate) return false;
  if (maxDate && date > maxDate) return false;
  return true;
};

/**
 * DatePicker component with native HTML5 date input.
 *
 * Provides a date selection interface using the browser's native date picker
 * for better accessibility and mobile support. Falls back to text input in
 * browsers that don't support type="date".
 *
 * **Features:**
 * - Native date picker (browser-specific UI)
 * - Min/max date validation
 * - Label and error states
 * - Keyboard accessible
 * - Mobile-friendly
 * - Dark mode support
 *
 * **Accessibility:**
 * - Semantic label with htmlFor association
 * - aria-invalid for error state
 * - aria-required for required fields
 * - aria-describedby for error/helper text
 * - Native browser date picker accessibility
 *
 * @component
 * @param {DatePickerProps} props - DatePicker component props
 * @returns {JSX.Element} Rendered date picker
 *
 * @example
 * ```tsx
 * // Basic date picker
 * const [date, setDate] = useState<Date | null>(new Date());
 * <DatePicker
 *   label="Appointment Date"
 *   value={date}
 *   onChange={setDate}
 * />
 *
 * // Date picker with range
 * <DatePicker
 *   label="Select Future Date"
 *   value={date}
 *   onChange={setDate}
 *   minDate={new Date()}
 *   maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
 * />
 *
 * // Required date picker with error
 * <DatePicker
 *   label="Birth Date"
 *   value={birthDate}
 *   onChange={setBirthDate}
 *   required
 *   error={errors.birthDate}
 *   helperText="Required for age verification"
 * />
 *
 * // Disabled date picker
 * <DatePicker
 *   label="Visit Date"
 *   value={visitDate}
 *   onChange={setVisitDate}
 *   disabled
 * />
 * ```
 *
 * @remarks
 * **Healthcare Context**:
 * - Use for appointment scheduling
 * - Birth date entry with age validation
 * - Medication start/end dates
 * - Vaccination dates
 * - Health screening dates
 * - Medical history date entries
 *
 * **Note**: This component uses the native HTML5 date input. For a custom
 * calendar UI with more features, consider integrating react-day-picker or
 * similar library.
 *
 * @see {@link DatePickerProps} for detailed prop documentation
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  error,
  helperText,
  required = false,
  disabled = false,
  minDate,
  maxDate,
  className,
}) => {
  const [inputId] = useState(`datepicker-${Math.random().toString(36).substr(2, 9)}`);
  const hasError = !!error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const date = parseDateFromInput(newValue);

    // Validate against min/max
    if (date && !isDateInRange(date, minDate, maxDate)) {
      return; // Don't update if out of range
    }

    onChange(date);
  };

  const inputValue = value ? formatDateForInput(value) : '';

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium mb-1',
            hasError ? 'text-danger-700 dark:text-danger-400' : 'text-gray-700 dark:text-gray-300',
            disabled && 'text-gray-400 dark:text-gray-600'
          )}
        >
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type="date"
          value={inputValue}
          onChange={handleChange}
          disabled={disabled}
          min={minDate ? formatDateForInput(minDate) : undefined}
          max={maxDate ? formatDateForInput(maxDate) : undefined}
          className={cn(
            'block w-full rounded-lg border shadow-sm transition-all duration-200',
            'px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
            'dark:disabled:bg-gray-900 dark:disabled:text-gray-600',
            hasError
              ? 'border-danger-300 text-danger-900 focus:border-danger-500 focus:ring-danger-500 dark:border-danger-500 dark:text-danger-400'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white',
          )}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-required={required ? 'true' : undefined}
          aria-describedby={
            error ? `${inputId}-error` :
            helperText ? `${inputId}-helper` : undefined
          }
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400" id={`${inputId}-error`}>
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400" id={`${inputId}-helper`}>
          {helperText}
        </p>
      )}

      {value && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Selected: {formatDateForDisplay(value)}
        </p>
      )}
    </div>
  );
};

DatePicker.displayName = 'DatePicker';

export default DatePicker;
