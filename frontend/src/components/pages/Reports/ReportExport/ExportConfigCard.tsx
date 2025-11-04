'use client';

import React from 'react';
import { Zap, Edit3, Trash2 } from 'lucide-react';
import type { ExportConfig } from './types';
import { getFormatIcon } from './utils';

/**
 * Props for the ExportConfigCard component
 */
export interface ExportConfigCardProps {
  /** Export configuration data */
  config: ExportConfig;
  /** Callback when start button is clicked */
  onStart: (configId: string) => void;
  /** Callback when edit button is clicked */
  onEdit: (config: ExportConfig) => void;
  /** Callback when delete button is clicked */
  onDelete: (configId: string) => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * ExportConfigCard Component
 *
 * Displays an export configuration with actions.
 * Shows format, destination, schedule info, and provides start/edit/delete actions.
 *
 * @param props - ExportConfigCard component props
 * @returns JSX element representing the export config card
 */
export const ExportConfigCard: React.FC<ExportConfigCardProps> = React.memo(({
  config,
  onStart,
  onEdit,
  onDelete,
  className = ''
}) => {
  const FormatIcon = getFormatIcon(config.format);

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 rounded-lg p-2">
            <FormatIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{config.name}</h3>
            <p className="text-sm text-gray-600">{config.reportName}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onStart(config.id)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
            title="Start export"
            aria-label={`Start export for ${config.name}`}
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(config)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
            title="Edit config"
            aria-label={`Edit ${config.name}`}
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(config.id)}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete config"
            aria-label={`Delete ${config.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Format:</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {config.format.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Destination:</span>
          <span className="text-gray-900 capitalize">{config.destination}</span>
        </div>

        {config.schedule?.enabled && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Schedule:</span>
            <span className="text-gray-900 capitalize">{config.schedule.frequency}</span>
          </div>
        )}

        {config.recipients && config.recipients.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Recipients:</span>
            <span className="text-gray-900">{config.recipients.length}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Created:</span>
          <span className="text-gray-900">
            {new Date(config.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
});

ExportConfigCard.displayName = 'ExportConfigCard';

export default ExportConfigCard;
