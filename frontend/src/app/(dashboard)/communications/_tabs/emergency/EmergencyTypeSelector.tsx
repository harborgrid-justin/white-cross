/**
 * WF-COMM-EMERGENCY-TYPE-SELECTOR | EmergencyTypeSelector.tsx - Emergency Type Selection Component
 * Purpose: Emergency type selection with severity display and template preview
 * Related: CommunicationEmergencyTab component
 * Last Updated: 2025-11-04
 */

'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Select, SelectOption } from '@/components/ui/inputs/Select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { EmergencyTypeSelectorProps } from './types';
import { EMERGENCY_TYPES } from './constants';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Emergency Type Selector Component
 *
 * Provides emergency type selection dropdown with severity badges
 * and template preview display.
 *
 * **Features:**
 * - Dropdown with all emergency types
 * - Severity-based color coding
 * - Template preview
 * - Auto-configuration on selection
 *
 * @component
 * @param {EmergencyTypeSelectorProps} props - Component props
 * @returns {JSX.Element} Rendered emergency type selector
 *
 * @example
 * ```tsx
 * <EmergencyTypeSelector
 *   value={emergencyType}
 *   onChange={(typeId, template) => {
 *     setEmergencyType(typeId);
 *     applyTemplate(typeId);
 *   }}
 *   error={errors.emergencyType}
 * />
 * ```
 */
export const EmergencyTypeSelector = React.memo<EmergencyTypeSelectorProps>(
  ({ value, onChange, error, className }) => {
    // Convert emergency types to select options
    const emergencyTypeOptions: SelectOption[] = EMERGENCY_TYPES.map((type) => ({
      value: type.id,
      label: type.name,
    }));

    // Find selected type for preview
    const selectedType = EMERGENCY_TYPES.find((t) => t.id === value);

    // Handle selection change
    const handleChange = (typeId: string) => {
      onChange(typeId);
    };

    return (
      <Card className={cn('p-6 border-2 border-red-200 dark:border-red-800', className)}>
        <div className="space-y-4">
          <Select
            label="Emergency Type"
            options={emergencyTypeOptions}
            value={value}
            onChange={(selectedValue: string | number | (string | number)[]) =>
              handleChange(String(selectedValue))
            }
            placeholder="Select emergency type..."
            required
            error={error}
            helperText="Select the type of emergency to use the appropriate template"
          />

          {selectedType && (
            <div
              className={cn(
                'p-4 rounded-lg border-2',
                selectedType.severity === 'critical' &&
                  'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700',
                selectedType.severity === 'high' &&
                  'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700',
                selectedType.severity === 'moderate' &&
                  'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedType.name}
                </h3>
                <Badge
                  variant={
                    selectedType.severity === 'critical'
                      ? 'destructive'
                      : selectedType.severity === 'high'
                      ? 'default'
                      : 'secondary'
                  }
                  className={
                    selectedType.severity === 'high'
                      ? 'bg-orange-500 text-white'
                      : selectedType.severity === 'moderate'
                      ? 'bg-yellow-500 text-white'
                      : ''
                  }
                >
                  {selectedType.severity.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {selectedType.description}
              </p>
            </div>
          )}
        </div>
      </Card>
    );
  }
);

EmergencyTypeSelector.displayName = 'EmergencyTypeSelector';

export default EmergencyTypeSelector;
