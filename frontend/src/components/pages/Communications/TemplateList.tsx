/**
 * TemplateList Component
 *
 * Displays a list of communication templates with selection, actions, and metadata.
 * Includes template items with checkboxes, action buttons, tags, and usage information.
 */

'use client';

import React from 'react';
import {
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  TagIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import type { CommunicationTemplate } from './CommunicationTemplates.types';
import { getTypeIcon, getCategoryColor } from './CommunicationTemplates.utils';

/**
 * Props for the TemplateList component
 */
interface TemplateListProps {
  /** Array of templates to display */
  templates: CommunicationTemplate[];
  /** Set of selected template IDs */
  selectedTemplates: Set<string>;
  /** Callback when template selection changes */
  onTemplateSelect: (templateId: string, isSelected: boolean) => void;
  /** Callback when "Select All" is toggled */
  onSelectAll: () => void;
  /** Callback when template is used */
  onUseTemplate?: (template: CommunicationTemplate) => void;
  /** Callback when template is previewed */
  onPreviewTemplate: (template: CommunicationTemplate) => void;
  /** Callback when template is duplicated */
  onDuplicateTemplate: (template: CommunicationTemplate) => void;
  /** Callback when template is edited */
  onEditTemplate?: (template: CommunicationTemplate) => void;
  /** Callback when template is deleted */
  onDeleteTemplate?: (templateId: string) => void;
  /** Callback when create template is clicked (for empty state) */
  onCreateTemplate?: () => void;
  /** Whether filters are active */
  hasActiveFilters: boolean;
}

/**
 * TemplateList component for displaying communication templates
 *
 * @component
 * @example
 * ```tsx
 * <TemplateList
 *   templates={filteredTemplates}
 *   selectedTemplates={selected}
 *   onTemplateSelect={handleSelect}
 *   onSelectAll={handleSelectAll}
 *   onUseTemplate={handleUse}
 *   onPreviewTemplate={handlePreview}
 *   onDuplicateTemplate={handleDuplicate}
 *   onEditTemplate={handleEdit}
 *   onDeleteTemplate={handleDelete}
 *   onCreateTemplate={handleCreate}
 *   hasActiveFilters={false}
 * />
 * ```
 */
export const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  selectedTemplates,
  onTemplateSelect,
  onSelectAll,
  onUseTemplate,
  onPreviewTemplate,
  onDuplicateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onCreateTemplate,
  hasActiveFilters
}): React.ReactElement => {
  // Empty state
  if (templates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="text-center py-12">
          <DocumentDuplicateIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No templates found
          </h3>
          <p className="text-gray-500 mb-4">
            {hasActiveFilters
              ? 'Try adjusting your filters to see more templates.'
              : 'Get started by creating your first communication template.'}
          </p>
          {!hasActiveFilters && (
            <button
              onClick={onCreateTemplate}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Template
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="divide-y divide-gray-200">
        {/* Select All Header */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={
                selectedTemplates.size === templates.length &&
                templates.length > 0
              }
              onChange={onSelectAll}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              aria-label="Select all templates"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Select All
            </span>
          </label>
        </div>

        {/* Template Items */}
        {templates.map((template) => (
          <div
            key={template.id}
            className="px-6 py-4 hover:bg-gray-50"
          >
            <div className="flex items-start space-x-3">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedTemplates.has(template.id)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onTemplateSelect(template.id, e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                aria-label={`Select ${template.name}`}
              />

              {/* Template Content */}
              <div className="flex-1 min-w-0">
                {/* Header with title, badges, and actions */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(template.type)}
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {template.name}
                      </h3>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                        template.category
                      )}`}
                    >
                      {template.category}
                    </span>
                    {!template.isActive && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUseTemplate?.(template)}
                      className="inline-flex items-center px-3 py-1 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      aria-label={`Use template ${template.name}`}
                    >
                      Use Template
                    </button>
                    <button
                      onClick={() => onPreviewTemplate(template)}
                      className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                      aria-label={`Preview template ${template.name}`}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDuplicateTemplate(template)}
                      className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                      aria-label={`Duplicate template ${template.name}`}
                    >
                      <DocumentDuplicateIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEditTemplate?.(template)}
                      className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                      aria-label={`Edit template ${template.name}`}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTemplate?.(template.id)}
                      className="p-2 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md"
                      aria-label={`Delete template ${template.name}`}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Template Preview */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {template.subject && `Subject: ${template.subject} | `}
                  {template.content}
                </p>

                {/* Tags */}
                {template.tags.length > 0 && (
                  <div className="flex items-center space-x-2 mb-3">
                    <TagIcon className="h-4 w-4 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variables */}
                {template.variables.length > 0 && (
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs font-medium text-gray-500">
                      Variables:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((variable) => (
                        <code
                          key={variable}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200"
                        >
                          {`{{${variable}}}`}
                        </code>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <UserIcon className="h-3 w-3" />
                      <span>{template.created_by}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-3 w-3" />
                      <span>
                        Updated{' '}
                        {new Date(template.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      Used {template.usage_count} times
                      {template.last_used && (
                        <span className="ml-1">
                          (last:{' '}
                          {new Date(template.last_used).toLocaleDateString()})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
