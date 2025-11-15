'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNotificationTemplates } from '@/lib/actions/notifications.cache';
import type { NotificationTemplate } from '@/lib/actions/notifications.types';

/**
 * Notification Templates Page
 *
 * Manage notification templates for common scenarios
 */
export default function NotificationTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);

  // Use React Query for data fetching with caching
  const {
    data: templates = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['notification-templates'],
    queryFn: getNotificationTemplates,
  });

  // Log errors to console
  React.useEffect(() => {
    if (error) {
      console.error('Failed to load templates:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notification Templates</h1>
            <p className="mt-2 text-gray-600">
              Pre-configured templates for common notification types
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Create template
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Templates list */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading templates...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-shadow hover:shadow-md ${
                      selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {template.name}
                        </h3>
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {template.type.replace(/_/g, ' ')}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full capitalize">
                            {template.category}
                          </span>
                        </div>
                        {template.description && (
                          <p className="mt-2 text-sm text-gray-500">
                            {template.description}
                          </p>
                        )}
                        <p className="mt-3 text-sm text-gray-600">
                          <strong>Title:</strong> {template.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          <strong>Message:</strong> {template.message}
                        </p>
                        {template.variables.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500">
                              Variables: {template.variables.join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Template preview */}
          <div className="lg:col-span-1">
            {selectedTemplate ? (
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h2 className="text-lg font-semibold mb-4">Template Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTemplate.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedTemplate.type.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">
                      {selectedTemplate.category}
                    </p>
                  </div>
                  {selectedTemplate.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTemplate.description}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Variables ({selectedTemplate.variables.length})
                    </label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedTemplate.variables.map((variable) => (
                        <span
                          key={variable}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Edit template
                    </button>
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                      Duplicate template
                    </button>
                    <button className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50">
                      Delete template
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center sticky top-4">
                <p className="text-gray-500">Select a template to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
