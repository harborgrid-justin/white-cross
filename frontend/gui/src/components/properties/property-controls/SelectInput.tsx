/**
 * SelectInput - Dropdown select control
 *
 * Features:
 * - Radix UI Select component
 * - Dynamic options
 * - Placeholder support
 * - Accessibility (ARIA labels)
 */

'use client';

import React from 'react';
import * as Select from '@radix-ui/react-select';
import * as Label from '@radix-ui/react-label';
import { Check, ChevronDown } from 'lucide-react';

interface SelectOption {
  label: string;
  value: any;
}

interface SelectInputProps {
  id: string;
  label: string;
  value: any;
  onChange: (value: any) => void;
  options: SelectOption[];
  placeholder?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
}

/**
 * SelectInput Component
 */
export function SelectInput({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  helpText,
  error,
  required = false,
}: SelectInputProps) {
  const selectId = `select-${id}`;
  const helpId = `select-help-${id}`;
  const errorId = `select-error-${id}`;

  return (
    <div className="space-y-2">
      <Label.Root htmlFor={selectId} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
      </Label.Root>

      <Select.Root value={value?.toString()} onValueChange={(val) => onChange(val)}>
        <Select.Trigger
          id={selectId}
          aria-describedby={[helpText && helpId, error && errorId].filter(Boolean).join(' ') || undefined}
          aria-invalid={!!error}
          className={`inline-flex items-center justify-between w-full px-3 py-2 text-sm rounded-md border bg-background transition-colors
            ${error ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-primary'}
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="overflow-hidden bg-popover rounded-md border border-border shadow-md"
            position="popper"
            sideOffset={5}
          >
            <Select.Viewport className="p-1">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value.toString()}
                  className="relative flex items-center px-8 py-2 text-sm rounded-sm outline-none cursor-pointer select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                    <Check className="h-4 w-4" />
                  </Select.ItemIndicator>
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

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
