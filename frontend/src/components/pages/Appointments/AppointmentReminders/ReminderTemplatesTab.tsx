'use client';

import React from 'react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import type { ReminderTemplate } from './types';
import { getReminderTypeInfo, getTimingText } from './utils';

/**
 * Props for the ReminderTemplatesTab component
 *
 * @interface ReminderTemplatesTabProps
 */
export interface ReminderTemplatesTabProps {
  /** Available reminder templates */
  templates: ReminderTemplate[];
  /** Whether user can manage (create/edit/delete) templates */
  canManageTemplates: boolean;
  /** Handler for template preview */
  onPreview: (template: ReminderTemplate) => void;
  /** Handler for creating new template */
  onCreate: () => void;
  /** Handler for editing existing template */
  onEdit: (template: ReminderTemplate) => void;
  /** Handler for deleting template */
  onDelete: (templateId: string) => void;
}

/**
 * ReminderTemplatesTab Component
 *
 * Displays and manages reminder message templates. Shows template cards with
 * preview, edit, and delete actions. Supports creating new templates.
 *
 * @param {ReminderTemplatesTabProps} props - Component props
 * @returns {JSX.Element} Templates tab content
 *
 * @example
 * <ReminderTemplatesTab
 *   templates={templates}
 *   canManageTemplates={true}
 *   onPreview={handlePreviewMessage}
 *   onCreate={() => setIsCreatingTemplate(true)}
 *   onEdit={setSelectedTemplate}
 *   onDelete={handleDeleteTemplate}
 * />
 */
const ReminderTemplatesTab: React.FC<ReminderTemplatesTabProps> = ({
  templates,
  canManageTemplates,
  onPreview,
  onCreate,
  onEdit,
  onDelete
}) => {
  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Reminder Templates</h3>
        {canManageTemplates && (
          <button
            onClick={onCreate}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600
                     border border-transparent rounded-md hover:bg-blue-700 focus:outline-none
                     focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </button>
        )}
      </div>

      {/* Templates Grid */}
      {templates.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {templates.map((template) => {
            const typeInfo = getReminderTypeInfo(template.type);
            const IconComponent = typeInfo.icon;

            return (
              <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-full ${typeInfo.bg}`}>
                      <IconComponent className={`w-5 h-5 ${typeInfo.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">{template.name}</h4>
                        {template.isDefault && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full flex-shrink-0">
                            Default
                          </span>
                        )}
                        {!template.isActive && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full flex-shrink-0">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {getTimingText(template.timing)} • {template.type.toUpperCase()}
                      </p>
                      {template.subject && (
                        <p className="text-sm font-medium text-gray-800 mt-2 truncate">
                          {template.subject}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {template.message}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                    <button
                      onClick={() => onPreview(template)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Preview template"
                      aria-label="Preview template"
                    >
                      <Eye size={16} />
                    </button>
                    {canManageTemplates && (
                      <>
                        <button
                          onClick={() => onEdit(template)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Edit template"
                          aria-label="Edit template"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(template.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete template"
                          aria-label="Delete template"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first reminder template to get started.
            </p>
            {canManageTemplates && (
              <button
                onClick={onCreate}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600
                         border border-transparent rounded-md hover:bg-blue-700 focus:outline-none
                         focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReminderTemplatesTab;
