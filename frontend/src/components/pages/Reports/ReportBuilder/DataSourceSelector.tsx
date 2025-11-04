import React from 'react';
import type { DataSource, ReportField } from './types';
import { getDataSourceInfo } from './utils';

/**
 * Props for DataSourceSelector component
 */
export interface DataSourceSelectorProps {
  /** Available data sources to choose from */
  dataSources: DataSource[];
  /** Currently selected data sources */
  selectedSources: DataSource[];
  /** Available fields by data source */
  availableFields: Record<DataSource, ReportField[]>;
  /** Callback when a data source is toggled */
  onToggleSource: (source: DataSource) => void;
}

/**
 * DataSourceSelector Component
 *
 * Allows users to select which data sources to include in their report.
 * Displays each data source as a card with icon, label, and available field count.
 *
 * @param props - Component props
 * @returns JSX element for data source selection
 */
export const DataSourceSelector = React.memo<DataSourceSelectorProps>(({
  dataSources,
  selectedSources,
  availableFields,
  onToggleSource
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Data Sources</h2>

        <div className="grid grid-cols-1 gap-4">
          {dataSources.map((source) => {
            const sourceInfo = getDataSourceInfo(source);
            const SourceIcon = sourceInfo.icon;
            const isSelected = selectedSources.includes(source);
            const fieldCount = availableFields[source]?.length || 0;

            return (
              <div
                key={source}
                className={`
                  p-4 border rounded-lg cursor-pointer transition-colors
                  ${isSelected
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => onToggleSource(source)}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggleSource(source);
                  }
                }}
                aria-pressed={isSelected}
                aria-label={`${isSelected ? 'Deselect' : 'Select'} ${sourceInfo.label} data source`}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${sourceInfo.color} mr-3`}>
                    <SourceIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {sourceInfo.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {fieldCount} {fieldCount === 1 ? 'field' : 'fields'} available
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSource(source)}
                    onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    aria-label={`Select ${sourceInfo.label} data source`}
                    tabIndex={-1}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {selectedSources.length === 0 && (
          <p className="mt-4 text-sm text-gray-500" role="status">
            No data sources selected. Please select at least one data source to continue.
          </p>
        )}
      </div>
    </div>
  );
});

DataSourceSelector.displayName = 'DataSourceSelector';

export default DataSourceSelector;
