/**
 * DocumentTemplateEditor component
 *
 * @module components/documents/DocumentTemplateEditor
 * @description WYSIWYG editor for creating and editing document templates
 */

'use client';

import React, { useState } from 'react';
import { Save, Eye, FileText } from 'lucide-react';

interface DocumentTemplateEditorProps {
  /** Template ID (undefined for new template) */
  templateId?: string;

  /** On save success */
  onSaveSuccess?: (templateId: string) => void;

  /** On save error */
  onSaveError?: (error: string) => void;
}

export function DocumentTemplateEditor({
  templateId,
  onSaveSuccess,
  onSaveError
}: DocumentTemplateEditorProps) {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = async () => {
    if (!templateName.trim()) {
      setError('Template name is required');
      return;
    }

    if (!content.trim()) {
      setError('Template content is required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // TODO: Implement server action for saving template
      // This should:
      // 1. Validate template data
      // 2. Save template to database
      // 3. Create audit log entry
      // 4. Return template ID

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const savedTemplateId = templateId || 'new-template-id';
      onSaveSuccess?.(savedTemplateId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save template';
      setError(errorMessage);
      onSaveError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const insertVariable = (variable: string) => {
    setContent(prev => prev + `{{${variable}}}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">
              {templateId ? 'Edit Template' : 'Create Template'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Template
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {!showPreview ? (
          <div className="space-y-6">
            {/* Template metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Student Health Form"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="health-records">Health Records</option>
                  <option value="medications">Medications</option>
                  <option value="incidents">Incidents</option>
                  <option value="consent-forms">Consent Forms</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of this template"
              />
            </div>

            {/* Variable insertion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insert Variables
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'student.name',
                  'student.dob',
                  'student.grade',
                  'parent.name',
                  'parent.phone',
                  'parent.email',
                  'school.name',
                  'nurse.name',
                  'current.date',
                  'current.time'
                ].map((variable) => (
                  <button
                    key={variable}
                    onClick={() => insertVariable(variable)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    {variable}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Variables will be replaced with actual data when the template is used
              </p>
            </div>

            {/* Template content editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Content *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder="Enter template content here. Use {{variable.name}} for dynamic values."
              />
              <p className="text-xs text-gray-500 mt-2">
                Use double curly braces for variables: {`{{variable.name}}`}
              </p>
            </div>
          </div>
        ) : (
          /* Preview mode */
          <div className="border border-gray-300 rounded-md p-6 bg-white min-h-[500px]">
            <h4 className="text-xl font-semibold mb-4">{templateName || 'Untitled Template'}</h4>
            {description && (
              <p className="text-sm text-gray-600 mb-6 italic">{description}</p>
            )}
            <div className="prose prose-sm max-w-none">
              {content ? (
                <pre className="whitespace-pre-wrap font-sans">{content}</pre>
              ) : (
                <p className="text-gray-400">No content to preview</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
