/**
 * DocumentTemplatesList component
 *
 * @module components/documents/DocumentTemplatesList
 * @description Display list of document templates
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Edit, Trash2, Copy } from 'lucide-react';

interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  usageCount: number;
}

interface DocumentTemplatesListProps {
  /** Templates to display */
  templates?: DocumentTemplate[];

  /** Loading state */
  isLoading?: boolean;
}

export function DocumentTemplatesList({
  templates,
  isLoading = false
}: DocumentTemplatesListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Placeholder data
  const placeholderTemplates: DocumentTemplate[] = templates || [
    {
      id: '1',
      name: 'Student Health Form',
      description: 'Standard health assessment form for new students',
      category: 'Health Records',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-10-20'),
      createdBy: 'Admin',
      usageCount: 45
    },
    {
      id: '2',
      name: 'Medication Authorization',
      description: 'Parent/guardian authorization for medication administration',
      category: 'Medications',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-09-15'),
      createdBy: 'Nurse Smith',
      usageCount: 78
    },
    {
      id: '3',
      name: 'Incident Report',
      description: 'Template for documenting student incidents',
      category: 'Incidents',
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-10-01'),
      createdBy: 'Admin',
      usageCount: 23
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (placeholderTemplates.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-sm font-medium text-gray-900">No templates found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new template</p>
        <div className="mt-6">
          <Link
            href="/documents/templates/new/edit"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View mode toggle */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 text-sm font-medium border ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } rounded-l-md`}
          >
            Grid
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm font-medium border-t border-r border-b ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } rounded-r-md`}
          >
            List
          </button>
        </div>
      </div>

      {/* Templates grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {placeholderTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {placeholderTemplates.map((template) => (
            <TemplateListItem key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Template card for grid view
 */
function TemplateCard({ template }: { template: DocumentTemplate }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-shrink-0">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
        <div className="flex items-center gap-1">
          <Link
            href={`/documents/templates/${template.id}/edit`}
            className="p-1 rounded hover:bg-gray-100"
            title="Edit template"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </Link>
          <button
            className="p-1 rounded hover:bg-gray-100"
            title="Duplicate template"
          >
            <Copy className="w-4 h-4 text-gray-600" />
          </button>
          <button
            className="p-1 rounded hover:bg-gray-100"
            title="Delete template"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">{template.name}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
          {template.category}
        </span>
        <span>{template.usageCount} uses</span>
      </div>
    </div>
  );
}

/**
 * Template list item for list view
 */
function TemplateListItem({ template }: { template: DocumentTemplate }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow flex items-center justify-between">
      <div className="flex items-center flex-1">
        <FileText className="h-6 w-6 text-blue-600 mr-4" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">{template.name}</h3>
          <p className="text-xs text-gray-600 mt-1">{template.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
          {template.category}
        </span>
        <span className="text-xs text-gray-500">{template.usageCount} uses</span>
        <div className="flex items-center gap-1">
          <Link
            href={`/documents/templates/${template.id}/edit`}
            className="p-2 rounded hover:bg-gray-100"
            title="Edit template"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </Link>
          <button
            className="p-2 rounded hover:bg-gray-100"
            title="Duplicate template"
          >
            <Copy className="w-4 h-4 text-gray-600" />
          </button>
          <button
            className="p-2 rounded hover:bg-gray-100"
            title="Delete template"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
