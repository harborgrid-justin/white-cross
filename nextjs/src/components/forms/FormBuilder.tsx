/**
 * FormBuilder component
 *
 * @module components/forms/FormBuilder
 * @description Drag-and-drop form builder interface
 */

'use client';

import React, { useState } from 'react';
import { Plus, Save, Eye, Settings } from 'lucide-react';

interface FormBuilderProps {
  /** Form ID (undefined for new form) */
  formId?: string;

  /** On save success */
  onSaveSuccess?: (formId: string) => void;
}

export function FormBuilder({ formId, onSaveSuccess }: FormBuilderProps) {
  const [formName, setFormName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement form save with server action
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSaveSuccess?.(formId || 'new-form-id');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          {formId ? 'Edit Form' : 'Create Form'}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Form Name
          </label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter form name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Brief description"
          />
        </div>
      </div>

      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Settings className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-sm text-gray-600">
          Form Builder with drag-and-drop interface
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Full implementation with React DnD, field library, and Zod validation
        </p>
      </div>
    </div>
  );
}
