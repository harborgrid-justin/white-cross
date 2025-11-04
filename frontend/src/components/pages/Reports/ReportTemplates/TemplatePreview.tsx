/**
 * TemplatePreview Component
 *
 * Modal component for previewing report templates with details,
 * statistics, and sample data.
 */

import React from 'react';
import { X, Table } from 'lucide-react';
import { ReportTemplate } from './types';
import { formatDate, getCategoryInfo, renderStarRating } from './utils';

/**
 * Props for the TemplatePreview component
 */
export interface TemplatePreviewProps {
  /** Template to preview */
  template: ReportTemplate | null;
  /** Show/hide modal */
  isOpen: boolean;
  /** Close modal handler */
  onClose: () => void;
  /** Use template handler */
  onUseTemplate?: (id: string) => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * TemplatePreview Component
 *
 * Displays a detailed preview of a report template in a modal dialog,
 * including template details, usage statistics, and sample data.
 *
 * @param props - TemplatePreview component props
 * @returns JSX element representing the template preview modal
 */
export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  isOpen,
  onClose,
  onUseTemplate,
  className = ''
}) => {
  if (!isOpen || !template) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Preview - {template.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
            aria-label="Close preview modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Template Details */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Template Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span className="text-gray-900">
                    {getCategoryInfo(template.category).label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Complexity:</span>
                  <span className="text-gray-900 capitalize">
                    {template.complexity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Data Sources:</span>
                  <span className="text-gray-900">
                    {template.dataSources.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fields:</span>
                  <span className="text-gray-900">{template.fields.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Charts:</span>
                  <span className="text-gray-900">{template.charts.length}</span>
                </div>
              </div>
            </div>

            {/* Usage Statistics */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Usage Statistics
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Usage Count:</span>
                  <span className="text-gray-900">{template.usageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rating:</span>
                  <div className="flex items-center space-x-1">
                    {renderStarRating(template.rating)}
                    <span className="text-gray-900">({template.rating})</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span className="text-gray-900">
                    {formatDate(template.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Updated:</span>
                  <span className="text-gray-900">
                    {formatDate(template.updatedAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Version:</span>
                  <span className="text-gray-900">{template.version}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Data */}
          {template.previewData && template.previewData.length > 0 ? (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Sample Data
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {template.fields.slice(0, 5).map((field, index) => (
                        <th
                          key={index}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {template.previewData.slice(0, 5).map((row, index) => (
                      <tr key={index}>
                        {template.fields.slice(0, 5).map((field, fieldIndex) => (
                          <td
                            key={fieldIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          >
                            {String(
                              (row as Record<string, unknown>)[field] || ''
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Table className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No preview data available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border
                     border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={() => {
              onUseTemplate?.(template.id);
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600
                     border border-transparent rounded-md hover:bg-blue-700"
          >
            Use This Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;
