'use client';

/**
 * WF-COMBOBOX-001 | Combobox.tsx - Combobox Component
 * Purpose: Searchable select with filtering and autocomplete
 * Upstream: Design system | Dependencies: React, Headless UI, Tailwind CSS
 * Downstream: Forms, search inputs, autocomplete fields
 * Related: Select, Input, DropdownMenu
 * Exports: Combobox component | Key Features: Search filtering, keyboard navigation, custom rendering, accessible
 * Last Updated: 2025-10-26 | File Type: .tsx
 * Critical Path: Type to search → Filter options → Select option → Update value
 * LLM Context: Combobox component for White Cross healthcare platform
 */

import React, { Fragment, useState } from 'react';
import { Combobox as HeadlessCombobox, Transition } from '@headlessui/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Option type for combobox
 */
export interface ComboboxOption<T = any> {
  /** Option value */
  value: T;
  /** Display label */
  label: string;
  /** Optional disabled state */
  disabled?: boolean;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Optional description */
  description?: string;
}

/**
 * Props for the Combobox component.
 */
export interface ComboboxProps<T = any> {
  /** Available options */
  options: ComboboxOption<T>[];
  /** Current selected value */
  value: T | null;
  /** Callback when value changes */
  onChange: (value: T | null) => void;
  /** Label for the combobox */
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
  /** Show clear button */
  clearable?: boolean;
  /** Custom filter function (defaults to label matching) */
  filterFn?: (option: ComboboxOption<T>, query: string) => boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional class name */
  className?: string;
}

/**
 * Default filter function
 */
const defaultFilterFn = <T,>(option: ComboboxOption<T>, query: string): boolean => {
  return option.label.toLowerCase().includes(query.toLowerCase());
};

/**
 * Combobox component with search and autocomplete.
 *
 * A searchable select component that filters options as you type. Built on
 * Headless UI Combobox for comprehensive accessibility and keyboard navigation.
 *
 * **Features:**
 * - Search/filter as you type
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Custom option rendering (icon, description)
 * - Clear button (optional)
 * - Custom filter function
 * - Empty state message
 * - Label and error states
 * - Dark mode support
 * - Full accessibility
 *
 * **Accessibility:**
 * - ARIA attributes handled by Headless UI
 * - Keyboard navigation (Arrow Up/Down, Enter, Escape)
 * - Focus management
 * - Screen reader announcements
 * - role="combobox" and aria-expanded
 *
 * @component
 * @param {ComboboxProps} props - Combobox component props
 * @returns {JSX.Element} Rendered combobox
 *
 * @example
 * ```tsx
 * // Basic combobox
 * const [medication, setMedication] = useState<string | null>(null);
 * const medications = [
 *   { value: 'aspirin', label: 'Aspirin' },
 *   { value: 'ibuprofen', label: 'Ibuprofen' },
 *   { value: 'acetaminophen', label: 'Acetaminophen' },
 * ];
 *
 * <Combobox
 *   options={medications}
 *   value={medication}
 *   onChange={setMedication}
 *   label="Select Medication"
 *   placeholder="Search medications..."
 * />
 *
 * // Combobox with descriptions and icons
 * const diagnoses = [
 *   {
 *     value: 'flu',
 *     label: 'Influenza',
 *     description: 'Respiratory viral infection',
 *     icon: <VirusIcon />
 *   },
 *   {
 *     value: 'cold',
 *     label: 'Common Cold',
 *     description: 'Upper respiratory infection'
 *   }
 * ];
 *
 * <Combobox
 *   options={diagnoses}
 *   value={diagnosis}
 *   onChange={setDiagnosis}
 *   label="Primary Diagnosis"
 * />
 *
 * // Clearable combobox
 * <Combobox
 *   options={options}
 *   value={value}
 *   onChange={setValue}
 *   label="Select Option"
 *   clearable
 *   placeholder="Type to search..."
 * />
 *
 * // With custom filter
 * <Combobox
 *   options={medicalCodes}
 *   value={selectedCode}
 *   onChange={setSelectedCode}
 *   label="ICD-10 Code"
 *   filterFn={(option, query) =>
 *     option.label.includes(query) ||
 *     option.value.includes(query)
 *   }
 *   emptyMessage="No matching codes found"
 * />
 * ```
 *
 * @remarks
 * **Healthcare Context**:
 * - Medication selection with search
 * - Diagnosis code lookup (ICD-10, CPT)
 * - Patient search and selection
 * - Provider selection
 * - Medical facility search
 * - Allergy selection
 * - Prescription drug database search
 *
 * **Headless UI**: Uses @headlessui/react Combobox for accessibility.
 * Handles keyboard navigation, focus management, and ARIA attributes automatically.
 *
 * @see {@link ComboboxOption} for option structure
 */
export const Combobox = <T,>({
  options,
  value,
  onChange,
  label,
  placeholder = 'Search...',
  error,
  helperText,
  required = false,
  disabled = false,
  clearable = false,
  filterFn = defaultFilterFn,
  emptyMessage = 'No options found',
  className,
}: ComboboxProps<T>) => {
  const [query, setQuery] = useState('');
  const [inputId] = useState(`combobox-${Math.random().toString(36).substr(2, 9)}`);
  const hasError = !!error;

  // Find selected option
  const selectedOption = options.find((opt) => opt.value === value) || null;

  // Filter options based on query
  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => filterFn(option, query));

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setQuery('');
  };

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

      <HeadlessCombobox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <div className="relative">
            <HeadlessCombobox.Input
              id={inputId}
              className={cn(
                'block w-full rounded-lg border shadow-sm transition-all duration-200',
                'px-3 py-2 pr-10 text-sm',
                'focus:outline-none focus:ring-2',
                'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
                'dark:disabled:bg-gray-900 dark:disabled:text-gray-600',
                hasError
                  ? 'border-danger-300 text-danger-900 focus:border-danger-500 focus:ring-danger-500 dark:border-danger-500 dark:text-danger-400'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white',
              )}
              displayValue={(value: T | null) =>
                value ? (options.find((opt) => opt.value === value)?.label || '') : ''
              }
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
              aria-invalid={hasError ? 'true' : 'false'}
              aria-required={required ? 'true' : undefined}
              aria-describedby={
                error ? `${inputId}-error` :
                helperText ? `${inputId}-helper` : undefined
              }
            />

            <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
              {clearable && selectedOption && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Clear selection"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              <HeadlessCombobox.Button className="flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </HeadlessCombobox.Button>
            </div>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <HeadlessCombobox.Options
              className={cn(
                'absolute z-50 mt-1 w-full',
                'max-h-60 overflow-auto',
                'bg-white dark:bg-gray-800',
                'border border-gray-200 dark:border-gray-700',
                'rounded-lg shadow-lg',
                'py-1',
                'focus:outline-none',
                'text-sm'
              )}
            >
              {filteredOptions.length === 0 && query !== '' ? (
                <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                  {emptyMessage}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <HeadlessCombobox.Option
                    key={String(option.value)}
                    value={option.value}
                    disabled={option.disabled}
                    className={({ active, disabled }) =>
                      cn(
                        'relative cursor-pointer select-none py-2 pl-10 pr-4',
                        active && !disabled && 'bg-primary-600 text-white',
                        !active && !disabled && 'text-gray-900 dark:text-gray-100',
                        disabled && 'cursor-not-allowed opacity-50'
                      )
                    }
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center gap-3">
                          {option.icon && (
                            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                              {option.icon}
                            </span>
                          )}
                          <div className="flex-1">
                            <span
                              className={cn(
                                'block truncate',
                                selected && 'font-semibold'
                              )}
                            >
                              {option.label}
                            </span>
                            {option.description && (
                              <span
                                className={cn(
                                  'block text-xs mt-0.5',
                                  active ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'
                                )}
                              >
                                {option.description}
                              </span>
                            )}
                          </div>
                        </div>

                        {selected && (
                          <span
                            className={cn(
                              'absolute inset-y-0 left-0 flex items-center pl-3',
                              active ? 'text-white' : 'text-primary-600'
                            )}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </>
                    )}
                  </HeadlessCombobox.Option>
                ))
              )}
            </HeadlessCombobox.Options>
          </Transition>
        </div>
      </HeadlessCombobox>

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
    </div>
  );
};

Combobox.displayName = 'Combobox';

export default Combobox;
