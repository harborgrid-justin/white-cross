'use client';

/**
 * FormBuilderList component
 *
 * @module components/forms/FormBuilderList
 * @description Display list of custom forms
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Edit, Trash2, Copy, Eye } from 'lucide-react';

interface CustomForm {
  id: string;
  name: string;
  description?: string;
  fieldCount: number;
  responseCount: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  status: 'draft' | 'published' | 'archived';
}

interface FormBuilderListProps {
  /** Forms to display */
  forms?: CustomForm[];

  /** Loading state */
  isLoading?: boolean;
}

export function FormBuilderList({
  forms,
  isLoading = false
}: FormBuilderListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Placeholder data
  const placeholderForms: CustomForm[] = forms || [
    {
      id: '1',
      name: 'Student Enrollment Form',
      description: 'Comprehensive student enrollment and health information',
      fieldCount: 25,
      responseCount: 45,
      createdAt: new Date('2024-09-01'),
      updatedAt: new Date('2024-10-20'),
      createdBy: 'Admin',
      status: 'published'
    },
    {
      id: '2',
      name: 'Daily Health Screening',
      description: 'COVID-19 and general health screening form',
      fieldCount: 10,
      responseCount: 1250,
      createdAt: new Date('2024-08-15'),
      updatedAt: new Date('2024-10-25'),
      createdBy: 'Nurse Smith',
      status: 'published'
    },
    {
      id: '3',
      name: 'Field Trip Consent',
      description: 'Parent consent and medical information for field trips',
      fieldCount: 15,
      responseCount: 78,
      createdAt: new Date('2024-09-20'),
      updatedAt: new Date('2024-10-15'),
      createdBy: 'Admin',
      status: 'published'
    },
    {
      id: '4',
      name: 'Allergy Assessment',
      description: 'Detailed allergy and reaction information form',
      fieldCount: 20,
      responseCount: 0,
      createdAt: new Date('2024-10-24'),
      updatedAt: new Date('2024-10-24'),
      createdBy: 'Nurse Johnson',
      status: 'draft'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (placeholderForms.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-sm font-medium text-gray-900">No forms found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new custom form</p>
        <div className="mt-6">
          <Link
            href="/forms/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Form
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

      {/* Forms grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {placeholderForms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {placeholderForms.map((form) => (
            <FormListItem key={form.id} form={form} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Form card for grid view
 */
function FormCard({ form }: { form: CustomForm }) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-shrink-0">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[form.status]}`}>
          {form.status}
        </span>
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">{form.name}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{form.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span>{form.fieldCount} fields</span>
        <span>{form.responseCount} responses</span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/forms/${form.id}/edit`}
          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Link>
        <Link
          href={`/forms/${form.id}/responses`}
          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Eye className="w-4 h-4 mr-2" />
          Responses
        </Link>
      </div>
    </div>
  );
}

/**
 * Form list item for list view
 */
function FormListItem({ form }: { form: CustomForm }) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow flex items-center justify-between">
      <div className="flex items-center flex-1">
        <FileText className="h-6 w-6 text-blue-600 mr-4" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">{form.name}</h3>
          <p className="text-xs text-gray-600 mt-1">{form.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <div className="text-xs text-gray-500">
          <div>{form.fieldCount} fields</div>
          <div>{form.responseCount} responses</div>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[form.status]}`}>
          {form.status}
        </span>
        <div className="flex items-center gap-1">
          <Link
            href={`/forms/${form.id}/edit`}
            className="p-2 rounded hover:bg-gray-100"
            title="Edit form"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </Link>
          <Link
            href={`/forms/${form.id}/responses`}
            className="p-2 rounded hover:bg-gray-100"
            title="View responses"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </Link>
          <button
            className="p-2 rounded hover:bg-gray-100"
            title="Duplicate form"
          >
            <Copy className="w-4 h-4 text-gray-600" />
          </button>
          <button
            className="p-2 rounded hover:bg-gray-100"
            title="Delete form"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
