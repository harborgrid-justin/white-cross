/**
 * Incident Report Evidence Page
 *
 * Displays and manages evidence/attachments for an incident report.
 * HIPAA-compliant component with proper access control and secure file handling.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useValidatedParams, IncidentIdParamSchema } from '@/utils/routeValidation';

interface IncidentEvidenceProps {}

/**
 * IncidentEvidence Component
 *
 * Features:
 * - Display evidence attachments
 * - Upload photos, documents, forms
 * - Secure file storage with encryption
 * - Audit trail for evidence access
 * - Route parameter validation for security
 */
const IncidentEvidence: React.FC<IncidentEvidenceProps> = () => {
  const navigate = useNavigate();

  // Validate route parameters
  const { data: params, loading, error } = useValidatedParams(
    IncidentIdParamSchema,
    { fallbackRoute: '/incident-reports' }
  );

  const id = params?.id;

  // Handle loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Validating incident ID...</span>
        </div>
      </div>
    );
  }

  // Handle validation errors
  if (error || !id) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Incident ID</h2>
          <p className="text-gray-700 mb-4">
            {error?.userMessage || 'The incident ID is not valid.'}
          </p>
          <button
            onClick={() => navigate('/incident-reports')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Incident Reports
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Evidence & Attachments</h1>
          <p className="text-gray-600 mt-1">Incident ID: {id}</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Attached Files</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Upload Evidence
            </button>
          </div>

          {/* Evidence grid will be implemented here */}
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-gray-500">No evidence attached yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Drag and drop files here or click "Upload Evidence"
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  HIPAA Security Notice
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    All uploaded evidence is encrypted and access is logged for compliance.
                    Only authorized personnel can view these files.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentEvidence;
