'use client';

import React from 'react';
import type { ExportFormat } from './types';
import { getFormatIcon } from './utils';

/**
 * Props for the FormatSelector component
 */
export interface FormatSelectorProps {
  /** Current selected format */
  value: ExportFormat;
  /** Callback when format changes */
  onChange: (format: ExportFormat) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** HTML id attribute */
  id?: string;
  /** Whether to show icon */
  showIcon?: boolean;
}

/**
 * FormatSelector Component
 *
 * Dropdown selector for export format with optional icon display.
 * Supports all export formats: PDF, CSV, Excel, JSON, XML, and images.
 *
 * @param props - FormatSelector component props
 * @returns JSX element representing the format selector
 */
export const FormatSelector: React.FC<FormatSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
  id = 'formatSelect',
  showIcon = true
}) => {
  const FormatIcon = getFormatIcon(value);

  return (
    <div className={`relative ${className}`}>
      {showIcon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <FormatIcon className="w-4 h-4 text-gray-400" />
        </div>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as ExportFormat)}
        disabled={disabled}
        className={`w-full border border-gray-300 rounded-md ${
          showIcon ? 'pl-10 pr-3' : 'px-3'
        } py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
        }`}
        aria-label="Select export format"
      >
        <option value="pdf">PDF</option>
        <option value="csv">CSV</option>
        <option value="xlsx">Excel</option>
        <option value="json">JSON</option>
        <option value="xml">XML</option>
        <option value="png">PNG</option>
        <option value="jpeg">JPEG</option>
        <option value="svg">SVG</option>
      </select>
    </div>
  );
};

export default FormatSelector;
