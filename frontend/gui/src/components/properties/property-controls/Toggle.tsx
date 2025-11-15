/**
 * Toggle - Boolean switch control
 *
 * Features:
 * - Radix UI Switch component
 * - Label association
 * - Disabled state support
 * - Accessibility (ARIA labels)
 */

'use client';

import React from 'react';
import * as Switch from '@radix-ui/react-switch';
import * as Label from '@radix-ui/react-label';

interface ToggleProps {
  id: string;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  helpText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Toggle Component
 */
export function Toggle({
  id,
  label,
  value,
  onChange,
  helpText,
  error,
  required = false,
  disabled = false,
}: ToggleProps) {
  const switchId = `toggle-${id}`;
  const helpId = `toggle-help-${id}`;
  const errorId = `toggle-error-${id}`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label.Root htmlFor={switchId} className="text-sm font-medium text-foreground cursor-pointer">
          {label}
          {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
        </Label.Root>

        <Switch.Root
          id={switchId}
          checked={value ?? false}
          onCheckedChange={onChange}
          disabled={disabled}
          aria-describedby={[helpText && helpId, error && errorId].filter(Boolean).join(' ') || undefined}
          aria-invalid={!!error}
          className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Switch.Thumb className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
        </Switch.Root>
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
