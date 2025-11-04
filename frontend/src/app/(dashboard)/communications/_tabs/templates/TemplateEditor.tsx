/**
 * WF-COMM-TEMPLATES-EDITOR | Template Editor Component
 * Purpose: Create and edit template content with variable detection
 * Upstream: CommunicationTemplatesTab | Dependencies: React, UI components, hooks
 * Downstream: Template operations | Called by: CommunicationTemplatesTab
 * Related: Template management, variable extraction
 * Exports: TemplateEditor component
 * Last Updated: 2025-11-04 | File Type: .tsx
 * Critical Path: Template creation and editing with validation
 * LLM Context: Modal form for creating/editing templates with live variable detection
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { TemplateFormData, TEMPLATE_CATEGORIES, INITIAL_TEMPLATE_FORM, MessageTemplate } from './types';
import { useTemplateVariables } from './hooks';

interface TemplateEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: TemplateFormData) => void;
  initialData?: MessageTemplate | null;
  mode: 'create' | 'edit';
}

/**
 * Template Editor Component
 *
 * Modal form for creating new templates or editing existing ones. Includes
 * real-time variable detection and validation.
 *
 * **Features:**
 * - Template name, category, subject, content inputs
 * - Public/private toggle
 * - Live variable detection from content
 * - Variable badge display
 * - Form validation
 * - Edit mode pre-population
 *
 * @component
 * @param {TemplateEditorProps} props - Component props
 * @returns {JSX.Element} Rendered template editor modal
 */
export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<TemplateFormData>(INITIAL_TEMPLATE_FORM);
  const { variables, hasVariables } = useTemplateVariables(formData.content);

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        subject: initialData.subject,
        content: initialData.content,
        isPublic: initialData.isPublic,
      });
    } else {
      setFormData(INITIAL_TEMPLATE_FORM);
    }
  }, [mode, initialData, isOpen]);

  const handleSubmit = () => {
    if (!formData.name || !formData.subject || !formData.content) {
      return;
    }

    onSave(formData);
    setFormData(INITIAL_TEMPLATE_FORM);
    onClose();
  };

  const handleClose = () => {
    setFormData(INITIAL_TEMPLATE_FORM);
    onClose();
  };

  const isFormValid = formData.name && formData.subject && formData.content;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'create' ? 'Create New Template' : 'Edit Template'}
      size="lg"
    >
      <div className="space-y-4">
        <Input
          label="Template Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter template name..."
          required
        />

        <Select
          label="Category"
          options={TEMPLATE_CATEGORIES.filter(c => c.value !== 'all')}
          value={formData.category}
          onChange={(value) => setFormData({ ...formData, category: value as string })}
          required
        />

        <Input
          label="Subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Enter message subject..."
          required
        />

        <Textarea
          label="Template Content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Enter template content. Use {{VARIABLE_NAME}} for dynamic values..."
          required
          autoResize
          minRows={8}
          maxRows={15}
          helperText="Use {{VARIABLE_NAME}} syntax for dynamic values (e.g., {{STUDENT_NAME}}, {{DATE}})"
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            id="template-public"
            checked={formData.isPublic}
            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="template-public"
            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
          >
            Make this template available to all staff
          </label>
        </div>

        {hasVariables && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Detected Variables:
            </p>
            <div className="flex flex-wrap gap-2">
              {variables.map((variable, index) => (
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

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            {mode === 'create' ? 'Create Template' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
