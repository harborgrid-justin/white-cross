import React, { useEffect, useRef } from 'react';
import { X, Loader, FileText } from 'lucide-react';
import type { ReportField } from './types';

/**
 * Props for QueryPreview component
 */
export interface QueryPreviewProps {
  /** Whether to show the preview modal */
  showPreview: boolean;
  /** Preview data to display */
  previewData: unknown[];
  /** Loading state for preview data */
  previewLoading: boolean;
  /** Selected field IDs to display */
  selectedFields: string[];
  /** Available fields for looking up field metadata */
  availableFields: ReportField[];
  /** Callback when preview is closed */
  onClose: () => void;
}

/**
 * QueryPreview Component
 *
 * Displays a modal with a preview of the report data based on the current
 * configuration. Shows a table with the selected fields and sample data.
 *
 * @param props - Component props
 * @returns JSX element for report preview modal
 */
export const QueryPreview = React.memo<QueryPreviewProps>(({
  showPreview,
  previewData,
  previewLoading,
  selectedFields,
  availableFields,
  onClose
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and ESC key handler
  useEffect(() => {
    if (!showPreview) return;

    // Focus the close button when modal opens
    closeButtonRef.current?.focus();

    // Handle ESC key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showPreview, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showPreview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showPreview]);

  if (!showPreview) {
    return null;
  }

  /**
   * Gets field metadata by ID
   */
  const getFieldById = (fieldId: string): ReportField | undefined => {
    return availableFields.find(f => f.id === fieldId);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h3 id="preview-title" className="text-lg font-semibold text-gray-900">
            Report Preview
          </h3>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close preview"
            title="Close preview"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {previewLoading ? (
            // Loading State
            <div className="flex flex-col items-center justify-center py-12" role="status">
              <Loader className="w-8 h-8 animate-spin text-blue-600 mb-4" aria-hidden="true" />
              <p className="text-gray-600">Loading preview data...</p>
              <span className="sr-only">Loading preview data</span>
            </div>
          ) : previewData.length > 0 ? (
            // Data Table
            <div>
              <div className="mb-4 text-sm text-gray-600">
                Showing {Math.min(10, previewData.length)} of {previewData.length} rows
              </div>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {selectedFields.map((fieldId) => {
                        const field = getFieldById(fieldId);
                        return (
                          <th
                            key={fieldId}
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {field?.label || fieldId}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.slice(0, 10).map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        {selectedFields.map((fieldId) => {
                          const value = (row as Record<string, unknown>)[fieldId];
                          return (
                            <td
                              key={fieldId}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            >
                              {value !== null && value !== undefined
                                ? String(value)
                                : <span className="text-gray-400 italic">null</span>
                              }
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Empty State
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
              <p className="text-gray-600 mb-2">No preview data available</p>
              <p className="text-sm text-gray-500">
                Configure your report settings and click Preview to see sample data
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {!previewLoading && previewData.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <p className="text-xs text-gray-600 text-center">
              Preview shows a sample of the data. The full report may contain more rows.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

QueryPreview.displayName = 'QueryPreview';

export default QueryPreview;
