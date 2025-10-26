/**
 * Document upload page
 *
 * @module app/documents/upload/page
 * @description Page for uploading documents with metadata
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentUploader } from '@/components/documents';
import { DocumentCategory, DocumentAccessLevel } from '@/types/documents';
import type { DocumentMetadata } from '@/types/documents';

export default function DocumentUploadPage() {
  const router = useRouter();

  const [metadata, setMetadata] = useState<Partial<DocumentMetadata>>({
    title: '',
    description: '',
    category: DocumentCategory.OTHER,
    accessLevel: DocumentAccessLevel.INTERNAL,
    tags: [],
    customFields: {},
    requiresSignature: false,
    isPHI: false,
    autoDelete: false
  });

  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUploadSuccess = (documentId: string) => {
    setUploadSuccess(true);
    setUploadError(null);

    // Redirect after 2 seconds
    setTimeout(() => {
      router.push(`/documents/${documentId}`);
    }, 2000);
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
    setUploadSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Document</h1>
          <p className="mt-2 text-gray-600">
            Upload a document and provide metadata for organization
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Document Uploader */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document File
            </label>
            <DocumentUploader
              defaultMetadata={metadata}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              maxFileSizeMB={100}
            />
          </div>

          {/* Success Message */}
          {uploadSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                Document uploaded successfully! Redirecting...
              </p>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{uploadError}</p>
            </div>
          )}

          {/* Metadata Form */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Document Metadata</h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={metadata.title}
                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter document title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={metadata.description || ''}
                onChange={(e) =>
                  setMetadata({ ...metadata, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter document description"
                rows={3}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={metadata.category}
                onChange={(e) =>
                  setMetadata({
                    ...metadata,
                    category: e.target.value as DocumentCategory
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value={DocumentCategory.CONSENT_FORM}>Consent Form</option>
                <option value={DocumentCategory.MEDICAL_RECORD}>Medical Record</option>
                <option value={DocumentCategory.IMMUNIZATION_RECORD}>
                  Immunization Record
                </option>
                <option value={DocumentCategory.EMERGENCY_CONTACT}>
                  Emergency Contact
                </option>
                <option value={DocumentCategory.MEDICATION_ORDER}>
                  Medication Order
                </option>
                <option value={DocumentCategory.CARE_PLAN}>Care Plan</option>
                <option value={DocumentCategory.INCIDENT_REPORT}>
                  Incident Report
                </option>
                <option value={DocumentCategory.PARENT_COMMUNICATION}>
                  Parent Communication
                </option>
                <option value={DocumentCategory.POLICY}>Policy</option>
                <option value={DocumentCategory.PROCEDURE}>Procedure</option>
                <option value={DocumentCategory.TRAINING}>Training</option>
                <option value={DocumentCategory.OTHER}>Other</option>
              </select>
            </div>

            {/* Access Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Level *
              </label>
              <select
                value={metadata.accessLevel}
                onChange={(e) =>
                  setMetadata({
                    ...metadata,
                    accessLevel: e.target.value as DocumentAccessLevel
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value={DocumentAccessLevel.PUBLIC}>Public</option>
                <option value={DocumentAccessLevel.INTERNAL}>Internal</option>
                <option value={DocumentAccessLevel.CONFIDENTIAL}>Confidential</option>
                <option value={DocumentAccessLevel.PHI}>PHI (Protected Health Information)</option>
                <option value={DocumentAccessLevel.RESTRICTED}>Restricted</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                placeholder="Enter tags separated by commas"
                onChange={(e) =>
                  setMetadata({
                    ...metadata,
                    tags: e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean)
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={metadata.isPHI}
                  onChange={(e) => setMetadata({ ...metadata, isPHI: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  This document contains Protected Health Information (PHI)
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={metadata.requiresSignature}
                  onChange={(e) =>
                    setMetadata({ ...metadata, requiresSignature: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Requires signature before use
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push('/documents')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
