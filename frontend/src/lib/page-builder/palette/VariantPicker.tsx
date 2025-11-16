/**
 * Variant Picker
 *
 * UI for selecting component variants in the page builder
 */

'use client';

import React, { useState } from 'react';
import { VariantConfig, VariantValue } from '../types/variant.types';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export interface VariantPickerProps {
  /** Variant configuration */
  variant: VariantConfig;

  /** Current selected value */
  value?: string;

  /** Callback when value changes */
  onChange?: (value: string) => void;

  /** Display mode */
  mode?: 'radio' | 'select' | 'grid';

  /** Custom className */
  className?: string;
}

/**
 * Variant Picker Component
 */
export function VariantPicker({
  variant,
  value,
  onChange,
  mode = 'radio',
  className,
}: VariantPickerProps) {
  const [selectedValue, setSelectedValue] = useState(
    value || variant.defaultValue || variant.values[0]?.value
  );

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Label and Description */}
      <div>
        <Label className="text-sm font-medium">{variant.label}</Label>
        {variant.description && (
          <p className="text-xs text-muted-foreground mt-1">{variant.description}</p>
        )}
      </div>

      {/* Variant selector based on mode */}
      {mode === 'radio' && (
        <RadioGroup value={selectedValue} onValueChange={handleChange}>
          <div className="space-y-2">
            {variant.values.map((variantValue) => (
              <div key={variantValue.value} className="flex items-center space-x-2">
                <RadioGroupItem value={variantValue.value} id={variantValue.value} />
                <Label
                  htmlFor={variantValue.value}
                  className="flex-1 cursor-pointer text-sm font-normal"
                >
                  <div className="flex items-center justify-between">
                    <span>{variantValue.label}</span>
                    {variantValue.isDefault && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        Default
                      </Badge>
                    )}
                  </div>
                  {variantValue.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {variantValue.description}
                    </p>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      )}

      {mode === 'select' && (
        <Select value={selectedValue} onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue placeholder={`Select ${variant.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {variant.values.map((variantValue) => (
              <SelectItem key={variantValue.value} value={variantValue.value}>
                <div className="flex items-center justify-between w-full">
                  <span>{variantValue.label}</span>
                  {variantValue.isDefault && (
                    <Badge variant="secondary" className="text-xs ml-2">
                      Default
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {mode === 'grid' && (
        <div className="grid grid-cols-2 gap-2">
          {variant.values.map((variantValue) => (
            <VariantOption
              key={variantValue.value}
              variantValue={variantValue}
              isSelected={selectedValue === variantValue.value}
              onClick={() => handleChange(variantValue.value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Variant Option Card (for grid mode)
 */
interface VariantOptionProps {
  variantValue: VariantValue;
  isSelected: boolean;
  onClick: () => void;
}

function VariantOption({ variantValue, isSelected, onClick }: VariantOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative rounded-lg border-2 p-3 text-left transition-all',
        'hover:border-primary hover:shadow-sm',
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border bg-background'
      )}
    >
      {/* Preview Image */}
      {variantValue.preview && (
        <div className="mb-2 rounded overflow-hidden border">
          <img
            src={variantValue.preview}
            alt={variantValue.label}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Icon */}
      {variantValue.icon && (
        <div className="mb-2 text-primary">
          {/* Icon would be rendered here */}
          <span className="text-sm">{variantValue.icon}</span>
        </div>
      )}

      {/* Label */}
      <div className="font-medium text-sm">{variantValue.label}</div>

      {/* Description */}
      {variantValue.description && (
        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {variantValue.description}
        </div>
      )}

      {/* Default badge */}
      {variantValue.isDefault && (
        <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
          Default
        </Badge>
      )}

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}
    </button>
  );
}

/**
 * Multi-Variant Picker (for components with multiple variants)
 */
export interface MultiVariantPickerProps {
  /** Array of variant configurations */
  variants: VariantConfig[];

  /** Current selected values */
  values?: Record<string, string>;

  /** Callback when any value changes */
  onChange?: (values: Record<string, string>) => void;

  /** Display mode for each variant */
  mode?: 'radio' | 'select' | 'grid';

  /** Custom className */
  className?: string;
}

export function MultiVariantPicker({
  variants,
  values = {},
  onChange,
  mode = 'radio',
  className,
}: MultiVariantPickerProps) {
  const [selectedValues, setSelectedValues] = useState(values);

  const handleVariantChange = (variantName: string, value: string) => {
    const newValues = { ...selectedValues, [variantName]: value };
    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {variants.map((variant) => (
        <VariantPicker
          key={variant.name}
          variant={variant}
          value={selectedValues[variant.name]}
          onChange={(value) => handleVariantChange(variant.name, value)}
          mode={mode}
        />
      ))}
    </div>
  );
}
