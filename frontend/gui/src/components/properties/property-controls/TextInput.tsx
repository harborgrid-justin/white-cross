/**
 * TextInput - Basic text input control
 *
 * Features:
 * - Single-line and multi-line (textarea) modes
 * - Validation error display
 * - Placeholder and help text
 * - Accessibility (ARIA labels)
 */

'use client';

import React from 'react';
import * as Label from '@radix-ui/react-label';

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

/**
 * TextInput Component
 */
export function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  helpText,
  error,
  required = false,
  multiline = false,
  rows = 4,
}: TextInputProps) {
  const inputId = `text-input-${id}`;
  const helpId = `text-input-help-${id}`;
  const errorId = `text-input-error-${id}`;

  const commonProps = {
    id: inputId,
    value: value || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    placeholder,
    required,
    'aria-describedby': [helpText && helpId, error && errorId].filter(Boolean).join(' ') || undefined,
    'aria-invalid': !!error,
    className: `w-full px-3 py-2 text-sm rounded-md border bg-background transition-colors
      ${error ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-primary'}
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:cursor-not-allowed disabled:opacity-50`,
  };

  return (
    <div className="space-y-2">
      <Label.Root htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
      </Label.Root>

      {multiline ? (
        <textarea {...commonProps} rows={rows} />
      ) : (
        <input type="text" {...commonProps} />
      )}

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
