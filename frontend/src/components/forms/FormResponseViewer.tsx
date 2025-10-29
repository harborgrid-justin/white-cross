/**
 * FormResponseViewer component
 *
 * @module components/forms/FormResponseViewer
 * @description View and export form responses
 */

import React from 'react';
import { Download, Eye } from 'lucide-react';

interface FormResponseViewerProps {
  /** Form ID */
  formId: string;
}

export async function FormResponseViewer({ formId }: FormResponseViewerProps) {
  // This is a server component - can fetch data directly
  // TODO: Fetch form responses from database

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Form Responses</h3>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export to CSV
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="text-center py-12">
          <Eye className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-sm text-gray-600">
            Form Response Viewer - Display submitted responses
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Form ID: {formId}
          </p>
        </div>
      </div>
    </div>
  );
}
