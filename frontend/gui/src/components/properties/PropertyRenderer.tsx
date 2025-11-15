/**
 * PropertyRenderer - Dynamic property control renderer
 *
 * Renders the appropriate input control based on PropertyControlType.
 * Features:
 * - Dynamic control mapping
 * - Debounced updates (300ms)
 * - Validation with Zod
 * - Error message display
 */

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { PropertySchema } from '../../types';

// Import property controls
import { TextInput } from './property-controls/TextInput';
import { NumberInput } from './property-controls/NumberInput';
import { ColorPicker } from './property-controls/ColorPicker';
import { SelectInput } from './property-controls/SelectInput';
import { Toggle } from './property-controls/Toggle';
import { SpacingEditor } from './property-controls/SpacingEditor';

interface PropertyRendererProps {
  property: PropertySchema;
  value: any;
  onChange: (value: any) => void;
}

/**
 * Custom hook for debounced value updates
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * PropertyRenderer Component
 */
export function PropertyRenderer({ property, value, onChange }: PropertyRendererProps) {
  const formContext = useFormContext();
  const [localValue, setLocalValue] = useState(value);

  // Debounce the value before calling onChange
  const debouncedValue = useDebounce(localValue, 300);

  // Call onChange when debounced value changes
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue]);

  // Update local value when external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle value change from control
  const handleChange = useCallback((newValue: any) => {
    setLocalValue(newValue);
  }, []);

  // Get error message from form context
  const error = formContext?.formState?.errors?.[property.id];
  const errorMessage = error?.message as string | undefined;

  // Common props for all controls
  const commonProps = {
    id: property.id,
    label: property.label,
    value: localValue,
    onChange: handleChange,
    placeholder: property.placeholder,
    helpText: property.helpText,
    error: errorMessage,
    required: property.required,
  };

  // Render the appropriate control based on PropertyControlType
  switch (property.control) {
    case 'text-input':
      return <TextInput {...commonProps} />;

    case 'textarea':
      return <TextInput {...commonProps} multiline />;

    case 'number-input':
      return (
        <NumberInput
          {...commonProps}
          min={property.validation?.min}
          max={property.validation?.max}
          step={1}
        />
      );

    case 'toggle':
      return <Toggle {...commonProps} />;

    case 'select':
      return <SelectInput {...commonProps} options={property.options || []} />;

    case 'color-picker':
      return <ColorPicker {...commonProps} />;

    case 'spacing-editor':
      return <SpacingEditor {...commonProps} />;

    case 'image-upload':
      return (
        <div className="text-sm text-muted-foreground">
          Image upload control coming soon
        </div>
      );

    case 'icon-picker':
      return (
        <div className="text-sm text-muted-foreground">
          Icon picker control coming soon
        </div>
      );

    case 'typography-editor':
      return (
        <div className="text-sm text-muted-foreground">
          Typography editor control coming soon
        </div>
      );

    case 'border-editor':
      return (
        <div className="text-sm text-muted-foreground">
          Border editor control coming soon
        </div>
      );

    case 'shadow-editor':
      return (
        <div className="text-sm text-muted-foreground">
          Shadow editor control coming soon
        </div>
      );

    case 'gradient-editor':
      return (
        <div className="text-sm text-muted-foreground">
          Gradient editor control coming soon
        </div>
      );

    case 'code-editor':
      return (
        <div className="text-sm text-muted-foreground">
          Code editor control coming soon
        </div>
      );

    case 'json-editor':
      return (
        <div className="text-sm text-muted-foreground">
          JSON editor control coming soon
        </div>
      );

    default:
      return (
        <div className="text-sm text-destructive">
          Unknown control type: {property.control}
        </div>
      );
  }
}
