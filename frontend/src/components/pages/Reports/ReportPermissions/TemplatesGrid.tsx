'use client';

import React from 'react';
import { Copy, UserCheck, Plus } from 'lucide-react';

import type { PermissionTemplate } from './types';
import { getPermissionLevelDisplay } from './utils';

/**
 * Props for the TemplatesGrid component
 */
export interface TemplatesGridProps {
  /** Permission templates to display */
  templates: PermissionTemplate[];
  /** Apply template handler */
  onApplyTemplate?: (templateId: string) => void;
  /** Create template handler */
  onCreateTemplate?: () => void;
}

/**
 * TemplatesGrid Component
 *
 * Displays permission templates in a grid layout with cards.
 * Each card shows template details and allows applying the template.
 */
export const TemplatesGrid: React.FC<TemplatesGridProps> = ({
  templates,
  onApplyTemplate,
  onCreateTemplate
}) => {
  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <Copy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Permission Templates</h3>
        <p className="text-gray-600 mb-4">
          Create reusable permission templates for common access patterns.
        </p>
        <button
          onClick={onCreateTemplate}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white
                   bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {templates.map((template) => {
        const levelConfig = getPermissionLevelDisplay(template.level);
        const LevelIcon = levelConfig.icon;

        return (
          <div
            key={template.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 rounded-lg p-2">
                  <LevelIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              </div>

              {template.isDefault && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Default
                </span>
              )}
            </div>

            {/* Template Details */}
            <div className="space-y-3">
              {/* Permission Level */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Level:</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${levelConfig.color}`}>
                  {levelConfig.label}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Actions:</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {template.actions.slice(0, 3).map((action) => (
                    <span
                      key={action}
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {action}
                    </span>
                  ))}
                  {template.actions.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{template.actions.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Scope */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Scope:</span>
                <span className="text-gray-900 capitalize">{template.scope}</span>
              </div>

              {/* Usage Count */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Usage:</span>
                <span className="text-gray-900">{template.usageCount} times</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center space-x-2">
              <button
                onClick={() => onApplyTemplate?.(template.id)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600
                         bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                aria-label={`Apply ${template.name} template`}
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Apply Template
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TemplatesGrid;
