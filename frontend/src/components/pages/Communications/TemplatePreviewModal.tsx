/**
 * TemplatePreviewModal Component
 *
 * Modal dialog for previewing communication templates.
 * Displays template content, subject, and variables.
 */

'use client';

import React from 'react';
import type { CommunicationTemplate } from './CommunicationTemplates.types';

/**
 * Props for the TemplatePreviewModal component
 */
interface TemplatePreviewModalProps {
  /** Template to preview (null when modal is closed) */
  template: CommunicationTemplate | null;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback when "Use Template" is clicked */
  onUseTemplate?: (template: CommunicationTemplate) => void;
}

/**
 * TemplatePreviewModal component for previewing communication templates
 *
 * @component
 * @example
 * ```tsx
 * <TemplatePreviewModal
 *   template={selectedTemplate}
 *   onClose={() => setSelectedTemplate(null)}
 *   onUseTemplate={handleUseTemplate}
 * />
 * ```
 */
export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  onClose,
  onUseTemplate
}): React.ReactElement | null => {
  // Don't render if no template is selected
  if (!template) {
    return null;
  }

  /**
   * Handles using the template and closing the modal
   */
  const handleUseTemplate = (): void => {
    onUseTemplate?.(template);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Vertical centering trick */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-lg font-medium text-gray-900"
              id="modal-title"
            >
              Template Preview: {template.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
              aria-label="Close preview"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* Subject (for email templates) */}
            {template.subject && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <div className="p-3 bg-gray-50 rounded-md text-sm">
                  {template.subject}
                </div>
              </div>
            )}

            {/* Template content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <div className="p-3 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">
                {template.content}
              </div>
            </div>

            {/* Variables */}
            {template.variables.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variables
                </label>
                <div className="flex flex-wrap gap-2">
                  {template.variables.map((variable) => (
                    <code
                      key={variable}
                      className="inline-flex items-center px-2 py-1 rounded text-sm font-mono bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      {`{{${variable}}}`}
                    </code>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
            <button
              onClick={handleUseTemplate}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Use Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
