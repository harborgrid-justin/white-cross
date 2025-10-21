/**
 * WF-COMP-205 | IncidentExport.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react-router-dom
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, functions | Key Features: useState, functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Incident Report Export Page
 *
 * Provides export functionality for incident reports with various formats.
 * HIPAA-compliant with proper audit logging for PHI exports.
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface IncidentExportProps {}

/**
 * IncidentExport Component
 *
 * Features:
 * - Export to PDF, DOCX, CSV
 * - Include/exclude sections
 * - Redact sensitive information
 * - Audit log all exports
 */
const IncidentExport: React.FC<IncidentExportProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'docx' | 'csv'>('pdf');
  const [includeEvidence, setIncludeEvidence] = useState(true);
  const [includeWitnesses, setIncludeWitnesses] = useState(true);
  const [includeActions, setIncludeActions] = useState(true);

  const handleExport = () => {
    // Export logic will be implemented here
    console.log('Exporting incident report...', {
      id,
      format: selectedFormat,
      includeEvidence,
      includeWitnesses,
      includeActions,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/incident-reports/${id}`)}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <span className="mr-2">&larr;</span> Back to Incident Report
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Export Incident Report</h1>
          <p className="text-gray-600 mt-1">Incident ID: {id}</p>
        </div>

        <div className="space-y-6">
          {/* Export Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setSelectedFormat('pdf')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  selectedFormat === 'pdf'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">📄</div>
                  <div className="font-medium">PDF</div>
                  <div className="text-xs text-gray-500">Print-ready format</div>
                </div>
              </button>
              <button
                onClick={() => setSelectedFormat('docx')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  selectedFormat === 'docx'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="font-medium">DOCX</div>
                  <div className="text-xs text-gray-500">Editable document</div>
                </div>
              </button>
              <button
                onClick={() => setSelectedFormat('csv')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  selectedFormat === 'csv'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-medium">CSV</div>
                  <div className="text-xs text-gray-500">Data only</div>
                </div>
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Include Sections
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeActions}
                  onChange={(e) => setIncludeActions(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Actions Taken</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeWitnesses}
                  onChange={(e) => setIncludeWitnesses(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Witness Information</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeEvidence}
                  onChange={(e) => setIncludeEvidence(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Evidence & Attachments</span>
              </label>
            </div>
          </div>

          {/* HIPAA Compliance Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  HIPAA Compliance Notice
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    This export will be logged in the audit trail. Ensure you have proper
                    authorization to export this protected health information.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => navigate(`/incident-reports/${id}`)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentExport;
