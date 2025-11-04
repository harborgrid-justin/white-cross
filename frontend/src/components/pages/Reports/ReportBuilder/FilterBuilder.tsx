import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { FilterCondition, FilterOperator, ReportField } from './types';

/**
 * Props for FilterBuilder component
 */
export interface FilterBuilderProps {
  /** Current filter conditions */
  filters: FilterCondition[];
  /** Available fields for filtering */
  availableFields: ReportField[];
  /** Callback when a new filter is added */
  onAddFilter: () => void;
  /** Callback when a filter is updated */
  onUpdateFilter: (filterId: string, updates: Partial<FilterCondition>) => void;
  /** Callback when a filter is removed */
  onRemoveFilter: (filterId: string) => void;
}

/**
 * FilterBuilder Component
 *
 * Allows users to build complex filter conditions for their report.
 * Each filter consists of a field, operator, and value(s).
 *
 * @param props - Component props
 * @returns JSX element for filter configuration
 */
export const FilterBuilder = React.memo<FilterBuilderProps>(({
  filters,
  availableFields,
  onAddFilter,
  onUpdateFilter,
  onRemoveFilter
}) => {
  /**
   * Checks if an operator requires a value input
   */
  const operatorRequiresValue = (operator: FilterOperator): boolean => {
    return !['is_null', 'not_null'].includes(operator);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters & Sorting</h2>
          <button
            onClick={onAddFilter}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700
                     bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Add new filter"
          >
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            Add Filter
          </button>
        </div>

        {filters.length > 0 ? (
          <div className="space-y-4" role="list" aria-label="Filter conditions">
            {filters.map((filter, index) => {
              const selectedField = availableFields.find(f => f.id === filter.fieldId);
              const requiresValue = operatorRequiresValue(filter.operator);

              return (
                <div
                  key={filter.id}
                  className="p-4 border border-gray-200 rounded-lg"
                  role="listitem"
                  aria-label={`Filter ${index + 1}`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Field Selector */}
                    <div className="flex-1">
                      <label htmlFor={`filter-field-${filter.id}`} className="sr-only">
                        Select field for filter {index + 1}
                      </label>
                      <select
                        id={`filter-field-${filter.id}`}
                        value={filter.fieldId}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          onUpdateFilter(filter.id, { fieldId: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md
                                 focus:ring-blue-500 focus:border-blue-500"
                        aria-required="true"
                      >
                        <option value="">Select field</option>
                        {availableFields.map((field) => (
                          <option key={field.id} value={field.id}>
                            {field.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Operator Selector */}
                    <div className="flex-shrink-0">
                      <label htmlFor={`filter-operator-${filter.id}`} className="sr-only">
                        Select operator for filter {index + 1}
                      </label>
                      <select
                        id={`filter-operator-${filter.id}`}
                        value={filter.operator}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          onUpdateFilter(filter.id, { operator: e.target.value as FilterOperator })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md
                                 focus:ring-blue-500 focus:border-blue-500"
                        aria-required="true"
                      >
                        <option value="equals">Equals</option>
                        <option value="not_equals">Not Equals</option>
                        <option value="contains">Contains</option>
                        <option value="not_contains">Does Not Contain</option>
                        <option value="greater_than">Greater Than</option>
                        <option value="less_than">Less Than</option>
                        <option value="between">Between</option>
                        <option value="is_null">Is Empty</option>
                        <option value="not_null">Is Not Empty</option>
                      </select>
                    </div>

                    {/* Value Input (conditional) */}
                    {requiresValue && (
                      <div className="flex-1">
                        <label htmlFor={`filter-value-${filter.id}`} className="sr-only">
                          Enter value for filter {index + 1}
                        </label>
                        <input
                          id={`filter-value-${filter.id}`}
                          type={selectedField?.type === 'number' ? 'number' : 'text'}
                          value={(filter.value as string) || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            onUpdateFilter(filter.id, { value: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md
                                   focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Filter value"
                          aria-required="true"
                        />
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => onRemoveFilter(filter.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded
                               focus:outline-none focus:ring-2 focus:ring-red-500"
                      title={`Remove filter ${index + 1}`}
                      aria-label={`Remove filter ${index + 1}`}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Field description hint */}
                  {selectedField?.description && (
                    <p className="mt-2 text-xs text-gray-500" id={`filter-hint-${filter.id}`}>
                      {selectedField.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-600 mb-2">No filters added</p>
            <p className="text-sm text-gray-500">
              Click "Add Filter" to create filter conditions for your report
            </p>
          </div>
        )}

        {/* Filter Summary */}
        {filters.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md" role="status">
            <p className="text-sm text-blue-800">
              {filters.length} {filters.length === 1 ? 'filter' : 'filters'} active
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

FilterBuilder.displayName = 'FilterBuilder';

export default FilterBuilder;
