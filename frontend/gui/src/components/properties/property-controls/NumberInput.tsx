/**
 * NumberInput - Number input with stepper buttons
 *
 * Features:
 * - Number input field
 * - +/- increment/decrement buttons
 * - Min/max validation
 * - Keyboard arrow support
 * - Configurable step size
 */

'use client';

import React from 'react';
import * as Label from '@radix-ui/react-label';
import { Plus, Minus } from 'lucide-react';

interface NumberInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
}

/**
 * NumberInput Component
 */
export function NumberInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  helpText,
  error,
  required = false,
}: NumberInputProps) {
  const inputId = `number-input-${id}`;
  const helpId = `number-input-help-${id}`;
  const errorId = `number-input-error-${id}`;

  const handleIncrement = () => {
    const newValue = (value || 0) + step;
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    const newValue = (value || 0) - step;
    if (min === undefined || newValue >= min) {
      onChange(newValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange(newValue);
    } else if (e.target.value === '') {
      onChange(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
    }
  };

  const isMinReached = min !== undefined && value <= min;
  const isMaxReached = max !== undefined && value >= max;

  return (
    <div className="space-y-2">
      <Label.Root htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
      </Label.Root>

      <div className="flex items-center gap-2">
        {/* Decrement button */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={isMinReached}
          className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrement"
        >
          <Minus className="h-4 w-4" />
        </button>

        {/* Number input */}
        <input
          type="number"
          id={inputId}
          value={value ?? ''}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          required={required}
          aria-describedby={[helpText && helpId, error && errorId].filter(Boolean).join(' ') || undefined}
          aria-invalid={!!error}
          className={`flex-1 px-3 py-2 text-sm rounded-md border bg-background transition-colors text-center
            ${error ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-primary'}
            focus:outline-none focus:ring-2 focus:ring-offset-0
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        />

        {/* Increment button */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={isMaxReached}
          className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Increment"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {helpText && (
        <p id={helpId} className="text-xs text-muted-foreground">
          {helpText}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
