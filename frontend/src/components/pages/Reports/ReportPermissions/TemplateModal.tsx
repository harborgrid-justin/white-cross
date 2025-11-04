'use client';

import React from 'react';
import { X, Save } from 'lucide-react';

import type { PermissionTemplate, PermissionLevel } from './types';

/**
 * Props for the TemplateModal component
 */
export interface TemplateModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Modal close handler */
  onClose: () => void;
  /** Form submission handler */
  onSubmit: (e: React.FormEvent) => void;
  /** Current form data */
  formData: Partial<PermissionTemplate>;
  /** Form field update handler */
  onFieldChange: <K extends keyof PermissionTemplate>(field: K, value: PermissionTemplate[K]) => void;
  /** Whether form is valid for submission */
  isValid: boolean;
}

/**
 * TemplateModal Component
 *
 * Modal dialog for creating or editing permission templates.
 * Templates allow quick application of common permission patterns.
 */
export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFieldChange,
  isValid
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <form onSubmit={onSubmit}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Create Permission Template</h3>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-4">
            {/* Template Name */}
            <div>
              <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 mb-1">
                Template Name
              </label>
              <input
                type="text"
                id="templateName"
                value={formData.name || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onFieldChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                         focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter template name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="templateDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="templateDescription"
                value={formData.description || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onFieldChange('description', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                         focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe this permission template"
              />
            </div>

            {/* Permission Level */}
            <div>
              <label htmlFor="templateLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Permission Level
              </label>
              <select
                id="templateLevel"
                value={formData.level || 'read'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onFieldChange('level', e.target.value as PermissionLevel)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                         focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="read">Read Only</option>
                <option value="write">Read & Write</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300
                       rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent
                       rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2 inline" />
              Create Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateModal;
