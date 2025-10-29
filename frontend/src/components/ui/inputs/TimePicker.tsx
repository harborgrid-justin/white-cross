'use client';

/**
 * WF-TIMEPICKER-001 | TimePicker.tsx - Time Picker Component
 * Purpose: Time selection input with validation
 * Upstream: Design system | Dependencies: React, Tailwind CSS
 * Downstream: Forms, scheduling, medication administration
 * Related: DatePicker, Input
 * Exports: TimePicker component | Key Features: 12/24 hour format, min/max validation, keyboard accessible
 * Last Updated: 2025-10-26 | File Type: .tsx
 * Critical Path: Click input → Select time → Validate → Update value
 * LLM Context: Time picker component for White Cross healthcare platform
 */

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Time format type
 */
export type TimeFormat = '12h' | '24h';

/**
 * Props for the TimePicker component.
 */
export interface TimePickerProps {
  /** Current selected time (HH:mm format, 24-hour) */
  value?: string | null;
  /** Callback when time changes */
  onChange: (time: string | null) => void;
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
  /** Minimum selectable time (HH:mm format) */
  minTime?: string;
  /** Maximum selectable time (HH:mm format) */
  maxTime?: string;
  /** Time format (12h or 24h) - affects display only */
  format?: TimeFormat;
  /** Step interval in minutes (default: 1) */
  step?: number;
  /** Additional class name */
  className?: string;
}

/**
 * Validate time is within range
 */
const isTimeInRange = (time: string, minTime?: string, maxTime?: string): boolean => {
  if (!time) return true;

  if (minTime && time < minTime) return false;
  if (maxTime && time > maxTime) return false;

  return true;
};

/**
 * Format time for display based on format preference
 */
const formatTimeDisplay = (time: string, format: TimeFormat): string => {
  if (!time || format === '24h') return time;

  // Convert 24h to 12h format
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;

  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * TimePicker component with native HTML5 time input.
 *
 * Provides a time selection interface using the browser's native time picker
 * for better accessibility and mobile support. Supports 12/24 hour formats,
 * min/max validation, and step intervals.
 *
 * **Features:**
 * - Native time picker (browser-specific UI)
 * - 12/24 hour format display
 * - Min/max time validation
 * - Step interval control (default: 1 minute)
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
 * - Native browser time picker accessibility
 *
 * @component
 * @param {TimePickerProps} props - TimePicker component props
 * @returns {JSX.Element} Rendered time picker
 *
 * @example
 * ```tsx
 * // Basic time picker
 * const [time, setTime] = useState<string | null>(null);
 * <TimePicker
 *   label="Appointment Time"
 *   value={time}
 *   onChange={setTime}
 * />
 *
 * // Time picker with 12-hour format
 * <TimePicker
 *   label="Medication Time"
 *   value={medTime}
 *   onChange={setMedTime}
 *   format="12h"
 * />
 *
 * // Time picker with range
 * <TimePicker
 *   label="Select Time"
 *   value={time}
 *   onChange={setTime}
 *   minTime="08:00"
 *   maxTime="17:00"
 *   helperText="Office hours: 8 AM - 5 PM"
 * />
 *
 * // Time picker with 15-minute intervals
 * <TimePicker
 *   label="Appointment Slot"
 *   value={slotTime}
 *   onChange={setSlotTime}
 *   step={15}
 *   helperText="Appointments available every 15 minutes"
 * />
 *
 * // Required time picker with error
 * <TimePicker
 *   label="Administration Time"
 *   value={adminTime}
 *   onChange={setAdminTime}
 *   required
 *   error={errors.adminTime}
 *   helperText="Required for medication record"
 * />
 *
 * // Disabled time picker
 * <TimePicker
 *   label="Scheduled Time"
 *   value={scheduledTime}
 *   onChange={setScheduledTime}
 *   disabled
 * />
 * ```
 *
 * @remarks
 * **Healthcare Context**:
 * - Use for medication administration times
 * - Appointment scheduling
 * - Daily schedule management
 * - Medication reminders
 * - Health check timing
 * - Meal and activity logging
 * - Treatment schedule entry
 *
 * **Time Format**: Value is always stored in 24-hour format (HH:mm) for consistency.
 * The `format` prop only affects display when showing the selected time.
 *
 * **Note**: This component uses the native HTML5 time input. Browser support
 * is excellent across modern browsers. Falls back to text input in older browsers.
 *
 * @see {@link TimePickerProps} for detailed prop documentation
 */
export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select time',
  error,
  helperText,
  required = false,
  disabled = false,
  minTime,
  maxTime,
  format = '24h',
  step = 1,
  className,
}) => {
  const [inputId] = useState(`timepicker-${Math.random().toString(36).substr(2, 9)}`);
  const hasError = !!error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Validate against min/max
    if (newValue && !isTimeInRange(newValue, minTime, maxTime)) {
      return; // Don't update if out of range
    }

    onChange(newValue || null);
  };

  const inputValue = value || '';
  const displayTime = value ? formatTimeDisplay(value, format) : '';

  // Calculate step in seconds for the input
  const stepSeconds = step * 60;

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
          type="time"
          value={inputValue}
          onChange={handleChange}
          disabled={disabled}
          min={minTime}
          max={maxTime}
          step={stepSeconds}
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

      {value && format === '12h' && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Selected: {displayTime}
        </p>
      )}
    </div>
  );
};

TimePicker.displayName = 'TimePicker';

export default TimePicker;
