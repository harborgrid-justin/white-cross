'use client';

import React, { useState } from 'react';
import { Archive, Play, X, CheckCircle } from 'lucide-react';
import type { ExportConfig } from './types';

/**
 * Props for the BatchExport component
 */
export interface BatchExportProps {
  /** Available export configurations */
  configs: ExportConfig[];
  /** Callback when batch export starts */
  onBatchStart: (configIds: string[]) => void;
  /** Callback when batch export is cancelled */
  onBatchCancel?: (jobIds: string[]) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Custom CSS classes */
  className?: string;
}

/**
 * BatchExport Component
 *
 * Manages bulk export operations.
 * Allows selection and execution of multiple export configurations at once.
 *
 * @param props - BatchExport component props
 * @returns JSX element representing the batch export controls
 */
export const BatchExport: React.FC<BatchExportProps> = ({
  configs,
  onBatchStart,
  onBatchCancel,
  disabled = false,
  className = ''
}) => {
  const [selectedConfigs, setSelectedConfigs] = useState<string[]>([]);

  /**
   * Toggles config selection
   */
  const toggleConfigSelection = (configId: string) => {
    setSelectedConfigs((prev) =>
      prev.includes(configId)
        ? prev.filter((id) => id !== configId)
        : [...prev, configId]
    );
  };

  /**
   * Selects all configs
   */
  const selectAll = () => {
    setSelectedConfigs(configs.map((c) => c.id));
  };

  /**
   * Deselects all configs
   */
  const deselectAll = () => {
    setSelectedConfigs([]);
  };

  /**
   * Handles batch start
   */
  const handleBatchStart = () => {
    if (selectedConfigs.length > 0) {
      onBatchStart(selectedConfigs);
      setSelectedConfigs([]);
    }
  };

  const hasSelection = selectedConfigs.length > 0;
  const allSelected = selectedConfigs.length === configs.length && configs.length > 0;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">
          <Archive className="w-4 h-4 inline mr-2" />
          Batch Export
        </label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={allSelected ? deselectAll : selectAll}
            disabled={disabled || configs.length === 0}
            className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none
                     disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>

      {configs.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-lg">
          <Archive className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No export configurations available</p>
        </div>
      ) : (
        <>
          {/* Config selection list */}
          <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md mb-4">
            {configs.map((config) => (
              <label
                key={config.id}
                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer
                         border-b border-gray-100 last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={selectedConfigs.includes(config.id)}
                  onChange={() => toggleConfigSelection(config.id)}
                  disabled={disabled}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500
                           disabled:bg-gray-100 disabled:cursor-not-allowed"
                  aria-label={`Select ${config.name}`}
                />
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{config.name}</p>
                  <p className="text-xs text-gray-600">
                    {config.reportName} • {config.format.toUpperCase()}
                  </p>
                </div>
                {selectedConfigs.includes(config.id) && (
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                )}
              </label>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {hasSelection ? (
                <>
                  <strong>{selectedConfigs.length}</strong> configuration{selectedConfigs.length !== 1 ? 's' : ''} selected
                </>
              ) : (
                'No configurations selected'
              )}
            </p>

            <div className="flex items-center space-x-2">
              {onBatchCancel && (
                <button
                  type="button"
                  onClick={() => onBatchCancel(selectedConfigs)}
                  disabled={disabled || !hasSelection}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                           bg-white border border-gray-300 rounded-md hover:bg-gray-50
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                           disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  aria-label="Cancel batch export"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleBatchStart}
                disabled={disabled || !hasSelection}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white
                         bg-blue-600 border border-transparent rounded-md hover:bg-blue-700
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                         disabled:bg-gray-400 disabled:cursor-not-allowed"
                aria-label="Start batch export"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Batch Export
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BatchExport;
