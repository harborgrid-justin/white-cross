/**
 * WF-COMM-TEMPLATES-CARD | Template Card Component
 * Purpose: Display individual template with actions
 * Upstream: TemplateList | Dependencies: React, UI components
 * Downstream: Template actions | Called by: TemplateList
 * Related: Template management, template preview
 * Exports: TemplateCard component
 * Last Updated: 2025-11-04 | File Type: .tsx
 * Critical Path: Template display and action buttons
 * LLM Context: Individual template card with use/preview/edit/delete actions
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageTemplate } from './types';

interface TemplateCardProps {
  template: MessageTemplate;
  categoryLabel: string;
  onUse: (template: MessageTemplate) => void;
  onPreview: (template: MessageTemplate) => void;
  onEdit: (template: MessageTemplate) => void;
  onDelete: (templateId: string) => void;
  formatDate: (dateString: string) => string;
}

/**
 * Template Card Component
 *
 * Displays a single template with its details and action buttons.
 *
 * **Features:**
 * - Template name, category, and public status
 * - Subject and content preview
 * - Variable badges
 * - Usage statistics
 * - Action buttons (Use, Preview, Edit, Delete)
 *
 * @component
 * @param {TemplateCardProps} props - Component props
 * @returns {JSX.Element} Rendered template card
 */
export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  categoryLabel,
  onUse,
  onPreview,
  onEdit,
  onDelete,
  formatDate,
}) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
            {template.name}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {categoryLabel}
          </Badge>
        </div>
        {template.isPublic && (
          <Badge variant="info" className="text-xs ml-2">
            Public
          </Badge>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Subject:</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{template.subject}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Content Preview:</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{template.content}</p>
        </div>

        {template.variables.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Variables:</p>
            <div className="flex flex-wrap gap-1">
              {template.variables.map((variable, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                >
                  {variable}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-4">
        <span>Used {template.usage} times</span>
        {template.lastUsed && (
          <span>Last: {formatDate(template.lastUsed)}</span>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          fullWidth
          onClick={() => onUse(template)}
        >
          Use Template
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPreview(template)}
          aria-label="Preview template"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(template)}
          aria-label="Edit template"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(template.id)}
          aria-label="Delete template"
        >
          <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      </div>
    </Card>
  );
};
