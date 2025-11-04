/**
 * WF-COMM-TEMPLATES-PREVIEW | Template Preview Component
 * Purpose: Preview template details and metadata
 * Upstream: CommunicationTemplatesTab | Dependencies: React, UI components
 * Downstream: Template usage | Called by: CommunicationTemplatesTab
 * Related: Template display, template selection
 * Exports: TemplatePreview component
 * Last Updated: 2025-11-04 | File Type: .tsx
 * Critical Path: Template preview with use action
 * LLM Context: Modal for previewing template details before use
 */

'use client';

import React from 'react';
import { Modal } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageTemplate } from './types';

interface TemplatePreviewProps {
  template: MessageTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: MessageTemplate) => void;
  categoryLabel: (category: string) => string;
  formatDate: (dateString: string) => string;
}

/**
 * Template Preview Component
 *
 * Modal displaying full template details including metadata, content, and
 * variables. Allows users to preview before using a template.
 *
 * **Features:**
 * - Full template content display
 * - Category and public status badges
 * - Variable list
 * - Usage statistics
 * - Creator and date information
 * - Use template action
 *
 * @component
 * @param {TemplatePreviewProps} props - Component props
 * @returns {JSX.Element} Rendered template preview modal
 */
export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  isOpen,
  onClose,
  onUseTemplate,
  categoryLabel,
  formatDate,
}) => {
  if (!template) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={template.name}
      size="lg"
    >
      <div className="space-y-4">
        <div>
          <Badge variant="secondary">{categoryLabel(template.category)}</Badge>
          {template.isPublic && (
            <Badge variant="info" className="ml-2">Public</Badge>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Subject:</p>
          <p className="text-base text-gray-900 dark:text-white">{template.subject}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Content:</p>
          <p className="text-base text-gray-900 dark:text-white whitespace-pre-wrap">
            {template.content}
          </p>
        </div>

        {template.variables.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Variables:</p>
            <div className="flex flex-wrap gap-2">
              {template.variables.map((variable, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                >
                  {variable}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-medium">Created by:</span> {template.createdBy}
            </div>
            <div>
              <span className="font-medium">Created:</span> {formatDate(template.createdAt)}
            </div>
            <div>
              <span className="font-medium">Usage count:</span> {template.usage}
            </div>
            {template.lastUsed && (
              <div>
                <span className="font-medium">Last used:</span> {formatDate(template.lastUsed)}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="default"
            onClick={() => {
              onUseTemplate(template);
              onClose();
            }}
          >
            Use This Template
          </Button>
        </div>
      </div>
    </Modal>
  );
};
