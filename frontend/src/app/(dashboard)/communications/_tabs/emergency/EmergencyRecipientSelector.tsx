/**
 * WF-COMM-EMERGENCY-RECIPIENT-SELECTOR | EmergencyRecipientSelector.tsx - Recipient Selection Component
 * Purpose: Individual student or group recipient selection
 * Related: CommunicationEmergencyTab component
 * Last Updated: 2025-11-04
 */

'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Select, SelectOption } from '@/components/ui/inputs/Select';
import { Card } from '@/components/ui/card';
import type { EmergencyRecipientSelectorProps } from './types';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

// Mock data - in production, these would come from props or API
const STUDENT_OPTIONS: SelectOption[] = [
  { value: '1', label: 'Emily Smith - Grade 3A' },
  { value: '2', label: 'Michael Johnson - Grade 5B' },
  { value: '3', label: 'Olivia Brown - Grade 2C' },
];

const GROUP_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Parents (Emergency)' },
  { value: 'grade-3', label: '3rd Grade Parents' },
  { value: 'grade-5', label: '5th Grade Parents' },
];

/**
 * Emergency Recipient Selector Component
 *
 * Provides recipient selection for emergency alerts with support for
 * individual students or groups.
 *
 * **Features:**
 * - Radio buttons for recipient type selection
 * - Multi-select for individual students
 * - Single select for groups
 * - Searchable dropdowns
 * - Conditional rendering based on type
 *
 * @component
 * @param {EmergencyRecipientSelectorProps} props - Component props
 * @returns {JSX.Element} Rendered recipient selector
 *
 * @example
 * ```tsx
 * <EmergencyRecipientSelector
 *   recipientType="individual"
 *   selectedStudents={['1', '2']}
 *   selectedGroup=""
 *   onRecipientTypeChange={setRecipientType}
 *   onStudentsChange={setSelectedStudents}
 *   onGroupChange={setSelectedGroup}
 *   error={errors.recipients}
 * />
 * ```
 */
export const EmergencyRecipientSelector = React.memo<EmergencyRecipientSelectorProps>(
  ({
    recipientType,
    selectedStudents,
    selectedGroup,
    onRecipientTypeChange,
    onStudentsChange,
    onGroupChange,
    error,
    className,
  }) => {
    return (
      <Card className={cn('p-6', className)}>
        <div className="space-y-4">
          {/* Recipient Type Radio Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recipient Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="individual"
                  checked={recipientType === 'individual'}
                  onChange={(e) => onRecipientTypeChange(e.target.value as 'individual')}
                  className="mr-2"
                  aria-label="Select individual students"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Individual Student(s)
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="group"
                  checked={recipientType === 'group'}
                  onChange={(e) => onRecipientTypeChange(e.target.value as 'group')}
                  className="mr-2"
                  aria-label="Select group"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Group / All Parents
                </span>
              </label>
            </div>
          </div>

          {/* Conditional Recipient Selection */}
          {recipientType === 'individual' ? (
            <Select
              label="Select Students"
              options={STUDENT_OPTIONS}
              value={selectedStudents}
              onChange={(value: string | number | (string | number)[]) => {
                if (Array.isArray(value)) {
                  onStudentsChange(value.map(String));
                }
              }}
              placeholder="Select students..."
              multiple
              searchable
              required
              error={error}
              helperText="Select the student(s) this emergency alert concerns"
            />
          ) : (
            <Select
              label="Select Group"
              options={GROUP_OPTIONS}
              value={selectedGroup}
              onChange={(value: string | number | (string | number)[]) =>
                onGroupChange(String(value))
              }
              placeholder="Select recipient group..."
              required
              error={error}
              helperText="Select the group to send this emergency alert to"
            />
          )}
        </div>
      </Card>
    );
  }
);

EmergencyRecipientSelector.displayName = 'EmergencyRecipientSelector';

export default EmergencyRecipientSelector;
