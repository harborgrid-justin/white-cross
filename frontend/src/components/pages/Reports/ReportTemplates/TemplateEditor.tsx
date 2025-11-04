/**
 * TemplateEditor Component
 *
 * Modal component for creating and editing report templates.
 */

import React from 'react';
import { X, Save, Upload } from 'lucide-react';
import { ReportTemplate, TemplateCategory, TemplateComplexity } from './types';

/**
 * Props for the TemplateEditor component
 */
export interface TemplateEditorProps {
  /** Show/hide modal */
  isOpen: boolean;
  /** Close modal handler */
  onClose: () => void;
  /** Template being edited (null for new template) */
  template: Partial<ReportTemplate>;
  /** Template state update handler */
  onTemplateChange: (updates: Partial<ReportTemplate>) => void;
  /** Save template handler */
  onSave: () => void;
  /** Whether editing existing template */
  isEditing?: boolean;
  /** Show import option */
  showImportOption?: boolean;
  /** Import handler */
  onImport?: () => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * TemplateEditor Component
 *
 * Provides a modal interface for creating new templates or editing
 * existing ones with form validation and state management.
 *
 * @param props - TemplateEditor component props
 * @returns JSX element representing the template editor modal
 */
export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  isOpen,
  onClose,
  template,
  onTemplateChange,
  onSave,
  isEditing = false,
  showImportOption = false,
  onImport,
  className = ''
}) => {
  if (!isOpen) {
    return null;
  }

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    onTemplateChange({ tags });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Template' : 'Create New Template'}
          </h3>
          <div className="flex items-center space-x-2">
            {showImportOption && !isEditing && (
              <button
                onClick={onImport}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Template Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Name *
            </label>
            <input
              type="text"
              value={template.name || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onTemplateChange({ name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md
                       focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter template name"
              aria-label="Template name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={template.description || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onTemplateChange({ description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md
                       focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe this template"
              aria-label="Template description"
            />
          </div>

          {/* Category and Complexity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={template.category || 'operational'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onTemplateChange({
                    category: e.target.value as TemplateCategory
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md
                         focus:ring-blue-500 focus:border-blue-500"
                aria-label="Template category"
              >
                <option value="clinical">Clinical</option>
                <option value="financial">Financial</option>
                <option value="operational">Operational</option>
                <option value="compliance">Compliance</option>
                <option value="patient-satisfaction">Patient Satisfaction</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complexity
              </label>
              <select
                value={template.complexity || 'simple'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onTemplateChange({
                    complexity: e.target.value as TemplateComplexity
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md
                         focus:ring-blue-500 focus:border-blue-500"
                aria-label="Template complexity"
              >
                <option value="simple">Simple</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={template.tags?.join(', ') || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleTagsChange(e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md
                       focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter tags separated by commas"
              aria-label="Template tags"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={template.isPublic || false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onTemplateChange({ isPublic: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Make this template public
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={template.isFavorite || false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onTemplateChange({ isFavorite: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Add to favorites
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border
                     border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!template.name}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600
                     border border-transparent rounded-md hover:bg-blue-700 disabled:bg-gray-400
                     disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update Template' : 'Create Template'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
