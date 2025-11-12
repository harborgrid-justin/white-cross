/**
 * FilterPanel Component
 *
 * Displays a modal panel for filtering audits by status, type,
 * priority, auditor, and department.
 *
 * @module ComplianceAudit/FilterPanel
 */

'use client';

import React from 'react';
import { X } from 'lucide-react';
import type { AuditFilters, AuditStatus, AuditType } from './types';

/**
 * Props for the FilterPanel component
 */
export interface FilterPanelProps {
  /** Whether the panel is visible */
  show: boolean;
  /** Currently active filters */
  activeFilters: AuditFilters;
  /** Called when panel should be closed */
  onClose: () => void;
  /** Called when filters are applied */
  onApply: (filters: AuditFilters) => void;
  /** Called when filters should be cleared */
  onClear?: () => void;
}

/**
 * FilterPanel Component
 *
 * Renders a modal overlay with filter options for audits.
 * Allows users to filter by multiple criteria including
 * status, type, priority, auditor, and department.
 *
 * @param props - FilterPanel component props
 * @returns JSX element representing the filter panel
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  show,
  activeFilters,
  onClose,
  onApply,
  onClear
}) => {
  const [localFilters, setLocalFilters] = React.useState<AuditFilters>(activeFilters);

  // Update local filters when activeFilters prop changes
  React.useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

  if (!show) {
    return null;
  }

  /**
   * Handles status filter toggle
   */
  const handleStatusToggle = (status: AuditStatus) => {
    setLocalFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  /**
   * Handles type filter toggle
   */
  const handleTypeToggle = (type: AuditType) => {
    setLocalFilters(prev => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type]
    }));
  };

  /**
   * Handles apply button click
   */
  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  /**
   * Handles cancel button click
   */
  const handleCancel = () => {
    setLocalFilters(activeFilters);
    onClose();
  };

  /**
   * Handles clear filters
   */
  const handleClear = () => {
    const emptyFilters: AuditFilters = {
      status: [],
      type: [],
      priority: [],
      auditor: [],
      department: []
    };
    setLocalFilters(emptyFilters);
    onClear?.();
  };

  /**
   * Formats status label
   */
  const formatStatusLabel = (status: string): string => {
    return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  /**
   * Formats type label
   */
  const formatTypeLabel = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const statusOptions: AuditStatus[] = ['scheduled', 'in-progress', 'completed', 'cancelled', 'overdue'];
  const typeOptions: AuditType[] = ['internal', 'external', 'regulatory', 'certification', 'compliance', 'risk'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filter Audits</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Options */}
        <div className="p-6 space-y-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <label key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.status.includes(status)}
                    onChange={() => handleStatusToggle(status)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {formatStatusLabel(status)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="space-y-2">
              {typeOptions.map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.type.includes(type)}
                    onChange={() => handleTypeToggle(type)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {formatTypeLabel(type)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Clear All
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300
                       rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent
                       rounded-md hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
