'use client';

/**
 * WF-COMM-TEMPLATES-001 | CommunicationTemplatesTab.tsx - Message Templates Interface
 * Purpose: Create and manage reusable message templates
 * Upstream: Communications system | Dependencies: React, UI components, template sub-components
 * Downstream: Template management API | Called by: Communications page
 * Related: Message composition, broadcast messaging, HIPAA compliance
 * Exports: CommunicationTemplatesTab component | Key Features: Template CRUD, categories, variables
 * Last Updated: 2025-11-04 | File Type: .tsx
 * Critical Path: Create template → Save → Use in compose/broadcast
 * LLM Context: Template management system for White Cross healthcare platform
 *
 * **Refactoring Notes:**
 * This component has been refactored from 650 lines into smaller, focused sub-components:
 * - templates/TemplateFilters.tsx - Search and category filtering (60 lines)
 * - templates/TemplateList.tsx - Grid layout and empty state (80 lines)
 * - templates/TemplateCard.tsx - Individual template display (140 lines)
 * - templates/TemplateEditor.tsx - Create/edit modal (180 lines)
 * - templates/TemplatePreview.tsx - Preview modal (130 lines)
 * - templates/hooks.ts - Custom hooks for template logic (140 lines)
 * - templates/types.ts - TypeScript interfaces and constants (90 lines)
 * - templates/mockData.ts - Sample template data (80 lines)
 *
 * Main component now orchestrates template workflow and delegates rendering to sub-components.
 */

import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/ui/button';
import {
  MessageTemplate,
  TemplateFormData,
  TemplateFilters as TemplateFiltersType,
  TEMPLATE_CATEGORIES,
  mockTemplates,
  TemplateFilters,
  TemplateList,
  TemplateEditor,
  TemplatePreview,
  useTemplates,
  useTemplateFilters,
  useTemplateCategories,
} from './templates';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Props for CommunicationTemplatesTab component
 */
interface CommunicationTemplatesTabProps {
  className?: string;
  onTemplateSelected?: (template: MessageTemplate) => void;
}

/**
 * Communication Templates Tab Component
 *
 * Manages reusable message templates for common communication scenarios in the
 * school nursing environment. Provides template creation, editing, categorization,
 * and variable substitution.
 *
 * **Features:**
 * - Pre-defined healthcare templates
 * - Custom template creation
 * - Template categories
 * - Variable substitution ({{VARIABLE_NAME}})
 * - Template usage tracking
 * - Public/private templates
 * - Template search and filtering
 * - Template preview
 * - Quick template application
 *
 * **Template Categories:**
 * - Medications
 * - Health Screenings
 * - Immunizations
 * - Allergies
 * - Health Alerts
 * - Permission Slips
 * - Injuries/Incidents
 * - General Communication
 *
 * **Variables:**
 * Templates support dynamic variables that are replaced with actual values:
 * - {{STUDENT_NAME}} - Student's full name
 * - {{MEDICATION_NAME}} - Medication name
 * - {{TIME}} - Time value
 * - {{DATE}} - Date value
 * - {{PHONE}} - Phone number
 * - {{EMAIL}} - Email address
 * - Custom variables as needed
 *
 * @component
 * @param {CommunicationTemplatesTabProps} props - Component props
 * @returns {JSX.Element} Rendered templates management interface
 *
 * @example
 * ```tsx
 * <CommunicationTemplatesTab onTemplateSelected={handleTemplateSelect} />
 * ```
 */
export const CommunicationTemplatesTab: React.FC<CommunicationTemplatesTabProps> = ({
  className,
  onTemplateSelected,
}) => {
  // Template state management
  const { templates, addTemplate, deleteTemplate, incrementUsage } = useTemplates(mockTemplates);

  // Filter state
  const [filters, setFilters] = useState<TemplateFiltersType>({
    searchTerm: '',
    category: 'all',
  });

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);

  // Custom hooks
  const filteredTemplates = useTemplateFilters(templates, filters);
  const { getCategoryLabel } = useTemplateCategories();

  /**
   * Handles creating a new template
   */
  const handleCreateTemplate = useCallback((formData: TemplateFormData) => {
    const newTemplate = addTemplate(formData, 'Current User');
    alert('Template created successfully!');
  }, [addTemplate]);

  /**
   * Handles deleting a template
   */
  const handleDeleteTemplate = useCallback((templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteTemplate(templateId);
      alert('Template deleted successfully!');
    }
  }, [deleteTemplate]);

  /**
   * Handles using a template
   */
  const handleUseTemplate = useCallback((template: MessageTemplate) => {
    incrementUsage(template.id);
    onTemplateSelected?.(template);
    alert(`Template "${template.name}" selected! You can now fill in the variables and send.`);
  }, [incrementUsage, onTemplateSelected]);

  /**
   * Handles opening preview modal
   */
  const handlePreviewTemplate = useCallback((template: MessageTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  }, []);

  /**
   * Handles opening edit modal
   */
  const handleEditTemplate = useCallback((template: MessageTemplate) => {
    setSelectedTemplate(template);
    setIsEditModalOpen(true);
  }, []);

  /**
   * Gets category label for a category value
   */
  const getCategoryLabelWrapper = useCallback((categoryValue: string) => {
    return getCategoryLabel(categoryValue, TEMPLATE_CATEGORIES);
  }, [getCategoryLabel]);

  /**
   * Formats date for display
   */
  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, []);

  const hasFilters = filters.searchTerm !== '' || filters.category !== 'all';

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Message Templates</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create and manage reusable message templates
          </p>
        </div>
        <Button variant="default" onClick={() => setIsCreateModalOpen(true)}>
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <TemplateFilters
        filters={filters}
        onFiltersChange={setFilters}
        totalCount={templates.length}
        filteredCount={filteredTemplates.length}
      />

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TemplateList
          templates={filteredTemplates}
          categoryLabel={getCategoryLabelWrapper}
          onUseTemplate={handleUseTemplate}
          onPreviewTemplate={handlePreviewTemplate}
          onEditTemplate={handleEditTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          formatDate={formatDate}
          hasFilters={hasFilters}
        />
      </div>

      {/* Create Template Modal */}
      <TemplateEditor
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTemplate}
        mode="create"
      />

      {/* Edit Template Modal */}
      <TemplateEditor
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(formData) => {
          // TODO: Implement template update logic
          alert('Edit functionality coming soon!');
          setIsEditModalOpen(false);
        }}
        initialData={selectedTemplate}
        mode="edit"
      />

      {/* Preview Modal */}
      <TemplatePreview
        template={selectedTemplate}
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        onUseTemplate={handleUseTemplate}
        categoryLabel={getCategoryLabelWrapper}
        formatDate={formatDate}
      />
    </div>
  );
};

export default CommunicationTemplatesTab;
