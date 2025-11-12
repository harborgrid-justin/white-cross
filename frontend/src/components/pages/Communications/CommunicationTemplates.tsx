'use client';

import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import type { CommunicationTemplatesProps, TemplateFilters } from './types';
import { useTemplates, useTemplateFilters } from './hooks';
import { TemplateFiltersComponent } from './TemplateFilters';
import { TemplateList } from './TemplateList';
import { TemplatePreviewModal } from './TemplatePreviewModal';

/**
 * CommunicationTemplates component for managing communication templates
 *
 * Features:
 * - Template library with search and filtering
 * - Template creation, editing, and deletion
 * - Template usage analytics
 * - Variable management for dynamic content
 * - Category and type organization
 * - Bulk operations support
 * - Template preview functionality
 * - Usage statistics and analytics
 *
 * @component
 * @example
 * ```tsx
 * <CommunicationTemplates
 *   onUseTemplate={(template) => handleUseTemplate(template)}
 *   onEditTemplate={(template) => handleEditTemplate(template)}
 *   onDeleteTemplate={(id) => handleDeleteTemplate(id)}
 *   onCreateTemplate={() => handleCreateTemplate()}
 * />
 * ```
 */
export const CommunicationTemplates: React.FC<CommunicationTemplatesProps> = ({
  className = '',
  isLoading = false,
  error,
  onUseTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onCreateTemplate
}): React.ReactElement => {
  // State management
  const [previewTemplate, setPreviewTemplate] = useState<CommunicationTemplate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState<TemplateFilters>({
    search: '',
    type: '',
    category: '',
    tags: [],
    status: 'all',
    sortBy: 'updated_at',
    sortOrder: 'desc'
  });

  // Custom hooks
  const {
    templates,
    selectedTemplates,
    setSelectedTemplates,
    handleTemplateSelect,
    handleSelectAll,
    handleDuplicateTemplate
  } = useTemplates();

  const filteredTemplates = useTemplateFilters(templates, filters);

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedTemplates.size === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedTemplates.size} template(s)?`)) {
      selectedTemplates.forEach(templateId => {
        onDeleteTemplate?.(templateId);
      });
      setSelectedTemplates(new Set());
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    ) as React.ReactElement;
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading templates</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    ) as React.ReactElement;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Communication Templates</h2>
          <p className="text-gray-600 mt-1">Manage and organize communication templates</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Create new template"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Template
        </button>
      </div>

      {/* Filters */}
      <TemplateFiltersComponent
        filters={filters}
        setFilters={setFilters}
        filteredCount={filteredTemplates.length}
        totalCount={templates.length}
        selectedCount={selectedTemplates.size}
        onBulkDelete={handleBulkDelete}
      />

      {/* Templates List */}
      <TemplateList
        templates={filteredTemplates}
        selectedTemplates={selectedTemplates}
        onTemplateSelect={handleTemplateSelect}
        onSelectAll={() => handleSelectAll(filteredTemplates)}
        onUseTemplate={onUseTemplate}
        onEditTemplate={onEditTemplate}
        onDeleteTemplate={onDeleteTemplate}
        onDuplicateTemplate={handleDuplicateTemplate}
        onPreviewTemplate={setPreviewTemplate}
        filters={filters}
        onCreateTemplate={onCreateTemplate}
      />

      {/* Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={onUseTemplate}
      />
    </div>
  );
};

export default CommunicationTemplates;
