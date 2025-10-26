/**
 * FilterPanel Component
 *
 * Collapsible sidebar for advanced filtering
 */

'use client';

import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';
import { FilterCondition, SearchEntityType } from '../../types';
import { FilterFieldDefinition, getFilterDefinitionsForEntity } from '../../types/filter.types';
import { useFilters } from '../../hooks/useFilters';

export interface FilterPanelProps {
  entityType: SearchEntityType;
  onFiltersChange?: (conditions: FilterCondition[]) => void;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export function FilterPanel({
  entityType,
  onFiltersChange,
  className,
  collapsible = true,
  defaultExpanded = true,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const {
    filters,
    addCondition,
    removeCondition,
    clearFilters,
    activeFields,
    conditionCount,
    availableFields,
  } = useFilters({ entityType });

  const handleAddFilter = (fieldDef: FilterFieldDefinition) => {
    const newCondition: FilterCondition = {
      field: fieldDef.id,
      operator: fieldDef.defaultOperator,
      value: null,
    };
    addCondition(newCondition);
  };

  const handleRemoveFilter = (fieldId: string) => {
    removeCondition(fieldId);
  };

  const handleClearAll = () => {
    clearFilters();
  };

  // Group fields by category (if categories exist)
  const fieldGroups = React.useMemo(() => {
    // Simple grouping for now - could be enhanced with categories
    return [
      {
        name: 'Filters',
        fields: availableFields,
      },
    ];
  }, [availableFields]);

  return (
    <div className={clsx('bg-white border border-gray-200 rounded-lg', className)}>
      {/* Header */}
      <div
        className={clsx(
          'flex items-center justify-between p-4 border-b border-gray-200',
          collapsible && 'cursor-pointer hover:bg-gray-50'
        )}
        onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {conditionCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              {conditionCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {conditionCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          )}
          {collapsible && (
            <div className="text-gray-400">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Active Filters */}
          {activeFields.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Active Filters</h4>
              <div className="flex flex-wrap gap-2">
                {activeFields.map((fieldId) => {
                  const fieldDef = availableFields.find(f => f.id === fieldId);
                  return (
                    <div
                      key={fieldId}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      <span>{fieldDef?.label || fieldId}</span>
                      <button
                        onClick={() => handleRemoveFilter(fieldId)}
                        className="hover:bg-blue-100 rounded-full p-0.5"
                        aria-label={`Remove ${fieldDef?.label || fieldId} filter`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Filters */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Add Filters</h4>
            {fieldGroups.map((group) => (
              <div key={group.name} className="space-y-2">
                {group.fields
                  .filter(field => !activeFields.includes(field.id))
                  .map((field) => (
                    <button
                      key={field.id}
                      onClick={() => handleAddFilter(field)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      {field.label}
                    </button>
                  ))}
              </div>
            ))}
          </div>

          {availableFields.filter(f => !activeFields.includes(f.id)).length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              All available filters are active
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Compact filter panel for mobile
 */
export function CompactFilterPanel(props: FilterPanelProps) {
  return <FilterPanel {...props} collapsible defaultExpanded={false} />;
}
