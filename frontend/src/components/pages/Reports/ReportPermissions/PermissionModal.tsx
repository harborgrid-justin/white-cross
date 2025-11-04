'use client';

import React from 'react';
import { X, Save } from 'lucide-react';

import type {
  PermissionRule,
  PermissionEntity,
  ReportReference,
  PermissionLevel,
  PermissionScope
} from './types';

/**
 * Props for the PermissionModal component
 */
export interface PermissionModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Modal close handler */
  onClose: () => void;
  /** Form submission handler */
  onSubmit: (e: React.FormEvent) => void;
  /** Current form data */
  formData: Partial<PermissionRule>;
  /** Form field update handler */
  onFieldChange: <K extends keyof PermissionRule>(field: K, value: PermissionRule[K]) => void;
  /** Available entities for selection */
  entities: PermissionEntity[];
  /** Available reports for selection */
  reports: ReportReference[];
  /** Whether form is valid for submission */
  isValid: boolean;
}

/**
 * PermissionModal Component
 *
 * Modal dialog for creating or editing permission rules.
 * Handles entity selection, permission level, scope, and resource selection.
 */
export const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFieldChange,
  entities,
  reports,
  isValid
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={onSubmit}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add Permission Rule</h3>
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
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Entity Selection */}
              <div>
                <label htmlFor="entitySelect" className="block text-sm font-medium text-gray-700 mb-1">
                  Entity
                </label>
                <select
                  id="entitySelect"
                  value={formData.entityId || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    onFieldChange('entityId', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select entity</option>
                  {entities.map((entity) => (
                    <option key={entity.id} value={entity.id}>
                      {entity.name} ({entity.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Permission Level */}
              <div>
                <label htmlFor="permissionLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Permission Level
                </label>
                <select
                  id="permissionLevel"
                  value={formData.level || 'read'}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    onFieldChange('level', e.target.value as PermissionLevel)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="none">No Access</option>
                  <option value="read">Read Only</option>
                  <option value="write">Read & Write</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Scope Selection */}
              <div>
                <label htmlFor="scopeSelect" className="block text-sm font-medium text-gray-700 mb-1">
                  Scope
                </label>
                <select
                  id="scopeSelect"
                  value={formData.scope || 'report'}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    onFieldChange('scope', e.target.value as PermissionScope)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="report">Specific Report</option>
                  <option value="category">Report Category</option>
                  <option value="global">All Reports</option>
                </select>
              </div>

              {/* Resource Selection (conditional) */}
              {formData.scope !== 'global' && (
                <div>
                  <label htmlFor="resourceSelect" className="block text-sm font-medium text-gray-700 mb-1">
                    Resource
                  </label>
                  <select
                    id="resourceSelect"
                    value={formData.resourceId || ''}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      onFieldChange('resourceId', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select resource</option>
                    {reports.map((report) => (
                      <option key={report.id} value={report.id}>
                        {report.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
              Create Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermissionModal;
