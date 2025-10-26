'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/buttons/Button';
import { Card } from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Filter definition
 */
export interface FilterConfig {
  /** Unique identifier for the filter */
  id: string;
  /** Display label */
  label: string;
  /** Filter type */
  type: 'select' | 'multiselect' | 'daterange' | 'numberrange' | 'text' | 'checkbox' | 'radio';
  /** Options for select/multiselect/radio/checkbox */
  options?: Array<{ value: string; label: string }>;
  /** Current value */
  value?: any;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the filter is required */
  required?: boolean;
}

/**
 * FilterPanel props
 */
export interface FilterPanelProps {
  /** Array of filter configurations */
  filters: FilterConfig[];
  /** Filter change handler */
  onChange: (filterId: string, value: any) => void;
  /** Clear all filters handler */
  onClear?: () => void;
  /** Apply filters handler */
  onApply?: () => void;
  /** Whether to show apply button */
  showApplyButton?: boolean;
  /** Whether to show clear button */
  showClearButton?: boolean;
  /** Whether panel is collapsible */
  collapsible?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
  /** Custom className */
  className?: string;
  /** Title for the filter panel */
  title?: string;
  /** Show active filter count badge */
  showActiveCount?: boolean;
}

/**
 * FilterPanel - A flexible filter panel component with various filter types
 *
 * @example
 * ```tsx
 * const filters: FilterConfig[] = [
 *   {
 *     id: 'status',
 *     label: 'Status',
 *     type: 'select',
 *     options: [
 *       { value: 'active', label: 'Active' },
 *       { value: 'inactive', label: 'Inactive' }
 *     ],
 *     value: 'active'
 *   },
 *   {
 *     id: 'search',
 *     label: 'Search',
 *     type: 'text',
 *     placeholder: 'Search by name...'
 *   }
 * ];
 *
 * <FilterPanel
 *   filters={filters}
 *   onChange={(id, value) => handleFilterChange(id, value)}
 *   onApply={handleApplyFilters}
 * />
 * ```
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  onClear,
  onApply,
  showApplyButton = false,
  showClearButton = true,
  collapsible = true,
  defaultCollapsed = false,
  className,
  title = 'Filters',
  showActiveCount = true
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Count active filters
  const activeFiltersCount = filters.filter(filter => {
    if (Array.isArray(filter.value)) {
      return filter.value.length > 0;
    }
    return filter.value !== undefined && filter.value !== '' && filter.value !== null;
  }).length;

  const handleClear = useCallback(() => {
    filters.forEach(filter => {
      onChange(filter.id, filter.type === 'multiselect' ? [] : '');
    });
    onClear?.();
  }, [filters, onChange, onClear]);

  const renderFilter = (filter: FilterConfig) => {
    switch (filter.type) {
      case 'select':
        return (
          <select
            value={filter.value || ''}
            onChange={(e) => onChange(filter.id, e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 transition-all duration-200"
            aria-label={filter.label}
          >
            <option value="">{filter.placeholder || 'Select...'}</option>
            {filter.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        const selectedValues = filter.value || [];
        return (
          <div className="space-y-2">
            <select
              multiple
              value={selectedValues}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                onChange(filter.id, values);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 transition-all duration-200"
              size={Math.min(filter.options?.length || 3, 5)}
              aria-label={filter.label}
            >
              {filter.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedValues.map((value: string) => {
                  const option = filter.options?.find(opt => opt.value === value);
                  return (
                    <Badge
                      key={value}
                      variant="secondary"
                      size="sm"
                      className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
                      onClick={() => {
                        onChange(filter.id, selectedValues.filter((v: string) => v !== value));
                      }}
                    >
                      {option?.label}
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <input
            type="text"
            value={filter.value || ''}
            onChange={(e) => onChange(filter.id, e.target.value)}
            placeholder={filter.placeholder}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 transition-all duration-200"
            aria-label={filter.label}
          />
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {filter.options?.map(option => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 py-1 transition-colors duration-150"
              >
                <input
                  type="checkbox"
                  checked={(filter.value || []).includes(option.value)}
                  onChange={(e) => {
                    const currentValues = filter.value || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    onChange(filter.id, newValues);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {filter.options?.map(option => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 py-1 transition-colors duration-150"
              >
                <input
                  type="radio"
                  name={filter.id}
                  value={option.value}
                  checked={filter.value === option.value}
                  onChange={(e) => onChange(filter.id, e.target.value)}
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'daterange':
        return (
          <div className="space-y-2">
            <input
              type="date"
              value={filter.value?.start || ''}
              onChange={(e) => onChange(filter.id, { ...filter.value, start: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 transition-all duration-200"
              aria-label={`${filter.label} start date`}
            />
            <input
              type="date"
              value={filter.value?.end || ''}
              onChange={(e) => onChange(filter.id, { ...filter.value, end: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 transition-all duration-200"
              aria-label={`${filter.label} end date`}
            />
          </div>
        );

      case 'numberrange':
        return (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={filter.value?.min || ''}
              onChange={(e) => onChange(filter.id, { ...filter.value, min: e.target.value })}
              placeholder="Min"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 transition-all duration-200"
              aria-label={`${filter.label} minimum`}
            />
            <input
              type="number"
              value={filter.value?.max || ''}
              onChange={(e) => onChange(filter.id, { ...filter.value, max: e.target.value })}
              placeholder="Max"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 transition-all duration-200"
              aria-label={`${filter.label} maximum`}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700',
          collapsible && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150'
        )}
        onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
        role={collapsible ? 'button' : undefined}
        tabIndex={collapsible ? 0 : undefined}
        onKeyDown={collapsible ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsCollapsed(!isCollapsed);
          }
        } : undefined}
        aria-expanded={collapsible ? !isCollapsed : undefined}
      >
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          {showActiveCount && activeFiltersCount > 0 && (
            <Badge variant="primary" size="sm">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {collapsible && (
          isCollapsed ? (
            <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
          ) : (
            <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
          )
        )}
      </div>

      {/* Filter Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-4">
          {filters.map(filter => (
            <div key={filter.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {filter.label}
                {filter.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderFilter(filter)}
            </div>
          ))}

          {/* Action Buttons */}
          {(showApplyButton || showClearButton) && (
            <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              {showClearButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  disabled={activeFiltersCount === 0}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
              {showApplyButton && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onApply}
                  className="flex-1"
                >
                  Apply Filters
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

FilterPanel.displayName = 'FilterPanel';

export default React.memo(FilterPanel);
