/**
 * WF-COMM-TEMPLATES-LIST | Template List Component
 * Purpose: Display grid of templates or empty state
 * Upstream: CommunicationTemplatesTab | Dependencies: React, TemplateCard
 * Downstream: TemplateCard | Called by: CommunicationTemplatesTab
 * Related: Template management, template display
 * Exports: TemplateList component
 * Last Updated: 2025-11-04 | File Type: .tsx
 * Critical Path: Template grid layout and empty state
 * LLM Context: Grid layout component for displaying multiple template cards
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { MessageTemplate } from './types';
import { TemplateCard } from './TemplateCard';

interface TemplateListProps {
  templates: MessageTemplate[];
  categoryLabel: (category: string) => string;
  onUseTemplate: (template: MessageTemplate) => void;
  onPreviewTemplate: (template: MessageTemplate) => void;
  onEditTemplate: (template: MessageTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  formatDate: (dateString: string) => string;
  hasFilters: boolean;
}

/**
 * Template List Component
 *
 * Displays a grid of template cards or an empty state when no templates match
 * the current filters.
 *
 * **Features:**
 * - Responsive grid layout (1-3 columns)
 * - Empty state with contextual messaging
 * - Delegates rendering to TemplateCard
 *
 * @component
 * @param {TemplateListProps} props - Component props
 * @returns {JSX.Element} Rendered template grid or empty state
 */
export const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  categoryLabel,
  onUseTemplate,
  onPreviewTemplate,
  onEditTemplate,
  onDeleteTemplate,
  formatDate,
  hasFilters,
}) => {
  if (templates.length === 0) {
    return (
      <div className="col-span-full">
        <Card className="p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-4 text-gray-600 dark:text-gray-400">No templates found</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
            {hasFilters
              ? 'Try adjusting your search or filters'
              : 'Create your first template to get started'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <>
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          categoryLabel={categoryLabel(template.category)}
          onUse={onUseTemplate}
          onPreview={onPreviewTemplate}
          onEdit={onEditTemplate}
          onDelete={onDeleteTemplate}
          formatDate={formatDate}
        />
      ))}
    </>
  );
};
