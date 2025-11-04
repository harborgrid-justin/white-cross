import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { DataSource, ReportField } from './types';
import { getDataSourceInfo } from './utils';

/**
 * Props for FieldSelector component
 */
export interface FieldSelectorProps {
  /** Selected data sources */
  dataSources: DataSource[];
  /** Available fields by data source */
  availableFields: Record<DataSource, ReportField[]>;
  /** Currently selected field IDs */
  selectedFields: string[];
  /** Expanded state for each data source */
  expandedSources: Record<DataSource, boolean>;
  /** Callback when a field is toggled */
  onToggleField: (fieldId: string) => void;
  /** Callback when a source section is expanded/collapsed */
  onToggleSourceExpansion: (source: DataSource) => void;
}

/**
 * FieldSelector Component
 *
 * Displays expandable sections for each selected data source,
 * allowing users to choose which fields to include in the report.
 *
 * @param props - Component props
 * @returns JSX element for field selection
 */
export const FieldSelector = React.memo<FieldSelectorProps>(({
  dataSources,
  availableFields,
  selectedFields,
  expandedSources,
  onToggleField,
  onToggleSourceExpansion
}) => {
  if (dataSources.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-md font-medium text-gray-900 mb-4">Select Fields</h3>

      <div className="space-y-4">
        {dataSources.map((source) => {
          const sourceInfo = getDataSourceInfo(source);
          const SourceIcon = sourceInfo.icon;
          const fields = availableFields[source] || [];
          const isExpanded = expandedSources[source];
          const selectedFieldsInSource = fields.filter(f => selectedFields.includes(f.id)).length;

          return (
            <div key={source} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => onToggleSourceExpansion(source)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-t-lg"
                aria-expanded={isExpanded}
                aria-controls={`fields-${source}`}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${sourceInfo.color} mr-3`}>
                    <SourceIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {sourceInfo.label}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      ({selectedFieldsInSource}/{fields.length} selected)
                    </span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" aria-hidden="true" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
                )}
              </button>

              {isExpanded && (
                <div
                  id={`fields-${source}`}
                  className="border-t border-gray-200"
                  role="region"
                  aria-label={`${sourceInfo.label} fields`}
                >
                  {fields.length > 0 ? (
                    <div className="p-4 grid grid-cols-2 gap-3">
                      {fields.map((field) => {
                        const isChecked = selectedFields.includes(field.id);

                        return (
                          <label
                            key={field.id}
                            className="flex items-start cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => onToggleField(field.id)}
                              className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              aria-describedby={field.description ? `${field.id}-desc` : undefined}
                            />
                            <div className="ml-2 flex-1">
                              <span className="text-sm text-gray-700">
                                {field.label}
                                {field.required && (
                                  <span className="text-red-500 ml-1" aria-label="Required field">
                                    *
                                  </span>
                                )}
                              </span>
                              {field.description && (
                                <p
                                  id={`${field.id}-desc`}
                                  className="text-xs text-gray-500 mt-0.5"
                                >
                                  {field.description}
                                </p>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-gray-500 text-center">
                      No fields available for this data source
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedFields.length === 0 && (
        <p className="mt-4 text-sm text-gray-500" role="status">
          No fields selected. Please select at least one field to include in the report.
        </p>
      )}

      {selectedFields.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md" role="status">
          <p className="text-sm text-blue-800">
            {selectedFields.length} {selectedFields.length === 1 ? 'field' : 'fields'} selected
          </p>
        </div>
      )}
    </div>
  );
});

FieldSelector.displayName = 'FieldSelector';

export default FieldSelector;
