'use client';

import React, { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import {
  ReportTemplate,
  TemplateFolder,
  TemplateLibrary,
  TemplateEditor,
  TemplatePreview,
  useTemplateEditor,
  useTemplateActions
} from './ReportTemplates';

/**
 * Props for the ReportTemplates component
 */
interface ReportTemplatesProps {
  /** List of report templates */
  templates?: ReportTemplate[];
  /** Template folders */
  folders?: TemplateFolder[];
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Create template handler */
  onCreateTemplate?: (
    template: Omit<
      ReportTemplate,
      'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'rating'
    >
  ) => void;
  /** Update template handler */
  onUpdateTemplate?: (id: string, updates: Partial<ReportTemplate>) => void;
  /** Delete template handler */
  onDeleteTemplate?: (id: string) => void;
  /** Duplicate template handler */
  onDuplicateTemplate?: (id: string) => void;
  /** Use template handler */
  onUseTemplate?: (id: string) => void;
  /** Preview template handler */
  onPreviewTemplate?: (id: string) => void;
  /** Import template handler */
  onImportTemplate?: (file: File) => void;
  /** Export template handler */
  onExportTemplate?: (id: string) => void;
  /** Toggle favorite handler */
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  /** Share template handler */
  onShareTemplate?: (id: string) => void;
  /** Create folder handler */
  onCreateFolder?: (
    folder: Omit<
      TemplateFolder,
      'id' | 'templateCount' | 'createdAt' | 'updatedAt'
    >
  ) => void;
}

/**
 * ReportTemplates Component
 *
 * A comprehensive report templates management component that allows users to
 * browse, create, edit, and organize report templates. Supports categorization,
 * favoriting, sharing, and template marketplace functionality.
 *
 * @param props - ReportTemplates component props
 * @returns JSX element representing the report templates interface
 */
const ReportTemplates: React.FC<ReportTemplatesProps> = ({
  templates = [],
  folders = [],
  loading = false,
  className = '',
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  onUseTemplate,
  onPreviewTemplate,
  onImportTemplate,
  onExportTemplate,
  onToggleFavorite,
  onShareTemplate,
  onCreateFolder
}) => {
  // State for preview and import modals
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] =
    useState<ReportTemplate | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);

  // Use template editor hook
  const {
    selectedTemplate,
    showCreateModal,
    newTemplate,
    setNewTemplate,
    openCreateModal,
    openEditModal,
    closeModal
  } = useTemplateEditor();

  // Use template actions hook
  const { handleTemplateAction } = useTemplateActions({
    onUseTemplate,
    onPreviewTemplate: (id) => {
      const template = templates.find((t) => t.id === id);
      if (template) {
        setSelectedTemplateForPreview(template);
        setShowPreviewModal(true);
      }
      onPreviewTemplate?.(id);
    },
    onDuplicateTemplate,
    onExportTemplate,
    onShareTemplate,
    onToggleFavorite,
    onDeleteTemplate
  });

  // Handle template actions with additional logic
  const handleAction = (action: string, template: ReportTemplate) => {
    if (action === 'edit') {
      openEditModal(template);
    } else {
      handleTemplateAction(action, template);
    }
  };

  // Handle create/update template
  const handleSaveTemplate = () => {
    if (newTemplate.name) {
      if (selectedTemplate) {
        // Update existing template
        onUpdateTemplate?.(selectedTemplate.id, newTemplate);
      } else {
        // Create new template
        onCreateTemplate?.(
          newTemplate as Omit<
            ReportTemplate,
            'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'rating'
          >
        );
      }
      closeModal();
    }
  };

  // Handle file import
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImportTemplate) {
      onImportTemplate(file);
      setShowImportModal(false);
    }
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Report Templates
            </h1>
            <p className="text-gray-600 mt-1">
              Browse, create, and manage report templates for quick report
              generation
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </button>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white
                       bg-blue-600 border border-transparent rounded-md hover:bg-blue-700
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </button>
          </div>
        </div>
      </div>

      {/* Template Library */}
      <TemplateLibrary
        templates={templates}
        loading={loading}
        onTemplateAction={handleAction}
        onCreateTemplate={openCreateModal}
      />

      {/* Template Editor Modal */}
      <TemplateEditor
        isOpen={showCreateModal}
        onClose={closeModal}
        template={newTemplate}
        onTemplateChange={setNewTemplate}
        onSave={handleSaveTemplate}
        isEditing={!!selectedTemplate}
        showImportOption
        onImport={() => setShowImportModal(true)}
      />

      {/* Template Preview Modal */}
      <TemplatePreview
        template={selectedTemplateForPreview}
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setSelectedTemplateForPreview(null);
        }}
        onUseTemplate={onUseTemplate}
      />

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Import Template
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="Close import modal"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <label className="block">
                  <span className="text-sm font-medium text-gray-900">
                    Choose a template file
                  </span>
                  <input
                    type="file"
                    accept=".json,.xml,.csv"
                    onChange={handleFileImport}
                    className="sr-only"
                  />
                  <span className="block text-sm text-gray-500 mt-1">
                    Support for JSON, XML, and CSV files
                  </span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border
                         border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTemplates;

// Re-export types and components for external use
export type {
  ReportTemplate,
  TemplateFolder,
  TemplateCategory,
  TemplateComplexity,
  DataSource
} from './ReportTemplates';
