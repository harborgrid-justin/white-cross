/**
 * SeverityFilter Component
 *
 * Production-grade multi-select filter for incident severity with:
 * - Color-coded severity levels (LOW=green, MEDIUM=yellow, HIGH=orange, CRITICAL=red)
 * - Checkbox-based multi-selection
 * - Visual severity indicators
 * - Clear all functionality
 *
 * @module pages/incidents/components/SeverityFilter
 */

import React, { useState } from 'react';
import { IncidentSeverity, getIncidentSeverityLabel } from '@/types/incidents';

interface SeverityFilterProps {
  /** Currently selected severity levels */
  selected: IncidentSeverity[];
  /** Callback when selection changes */
  onChange: (severities: IncidentSeverity[]) => void;
  /** Optional CSS class name */
  className?: string;
  /** Whether filter is disabled */
  disabled?: boolean;
  /** Label for the filter */
  label?: string;
}

interface SeverityOption {
  value: IncidentSeverity;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/**
 * SeverityFilter component
 *
 * Multi-select filter for incident severity levels with color-coded options.
 * Each severity level has a distinct color:
 * - LOW: Green
 * - MEDIUM: Yellow
 * - HIGH: Orange
 * - CRITICAL: Red
 *
 * @example
 * ```tsx
 * <SeverityFilter
 *   selected={selectedSeverities}
 *   onChange={(severities) => dispatch(setFilters({ severity: severities }))}
 * />
 * ```
 */
export const SeverityFilter: React.FC<SeverityFilterProps> = ({
  selected,
  onChange,
  className = '',
  disabled = false,
  label = 'Severity Level',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Define severity options with color coding
  const severityOptions: SeverityOption[] = [
    {
      value: IncidentSeverity.LOW,
      label: getIncidentSeverityLabel(IncidentSeverity.LOW),
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300',
    },
    {
      value: IncidentSeverity.MEDIUM,
      label: getIncidentSeverityLabel(IncidentSeverity.MEDIUM),
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-300',
    },
    {
      value: IncidentSeverity.HIGH,
      label: getIncidentSeverityLabel(IncidentSeverity.HIGH),
      color: 'text-orange-700',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-300',
    },
    {
      value: IncidentSeverity.CRITICAL,
      label: getIncidentSeverityLabel(IncidentSeverity.CRITICAL),
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-300',
    },
  ];

  const handleToggle = (severity: IncidentSeverity) => {
    if (selected.includes(severity)) {
      onChange(selected.filter((s) => s !== severity));
    } else {
      onChange([...selected, severity]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const displayValue = selected.length > 0
    ? `${selected.length} severity level${selected.length !== 1 ? 's' : ''}`
    : 'Select severity levels...';

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>

      <div className="relative">
        {/* Dropdown trigger button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            relative w-full cursor-pointer rounded-md border border-gray-300
            bg-white dark:bg-gray-700 dark:border-gray-600
            px-3 py-2 text-left shadow-sm
            focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${selected.length > 0 ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}
          `}
        >
          <span className="block truncate">{displayValue}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
            <div className="py-1">
              {severityOptions.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className={`
                      flex items-center px-3 py-2 cursor-pointer
                      hover:bg-gray-50 dark:hover:bg-gray-700
                      ${isSelected ? option.bgColor : ''}
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(option.value)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 flex items-center gap-2">
                      {/* Color indicator dot */}
                      <span
                        className={`
                          w-3 h-3 rounded-full
                          ${option.value === IncidentSeverity.LOW ? 'bg-green-500' : ''}
                          ${option.value === IncidentSeverity.MEDIUM ? 'bg-yellow-500' : ''}
                          ${option.value === IncidentSeverity.HIGH ? 'bg-orange-500' : ''}
                          ${option.value === IncidentSeverity.CRITICAL ? 'bg-red-500' : ''}
                        `}
                      />
                      <span className={`text-sm font-medium ${isSelected ? option.color : 'text-gray-700 dark:text-gray-200'}`}>
                        {option.label}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Clear all button */}
            {selected.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-2">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selection summary with color indicators */}
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selected.map((severity) => {
            const option = severityOptions.find((opt) => opt.value === severity);
            if (!option) return null;

            return (
              <span
                key={severity}
                className={`
                  inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                  ${option.bgColor} ${option.color} ${option.borderColor} border
                `}
              >
                <span
                  className={`
                    w-2 h-2 rounded-full
                    ${severity === IncidentSeverity.LOW ? 'bg-green-600' : ''}
                    ${severity === IncidentSeverity.MEDIUM ? 'bg-yellow-600' : ''}
                    ${severity === IncidentSeverity.HIGH ? 'bg-orange-600' : ''}
                    ${severity === IncidentSeverity.CRITICAL ? 'bg-red-600' : ''}
                  `}
                />
                {option.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SeverityFilter;
