/**
 * Import Dashboard Page
 *
 * Main import interface with file selection, configuration, and monitoring.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileDropzone } from '@/features/data-transfer/components/FileDropzone';
import { ImportProgress } from '@/features/data-transfer/components/ImportProgress';
import { useImport } from '@/features/data-transfer/hooks/useImport';
import type { EntityType, ImportConfig, ImportFormatConfig } from '@/features/data-transfer/types';

// ============================================================================
// Component
// ============================================================================

export default function ImportDashboardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<EntityType>('students');
  const [showProgress, setShowProgress] = useState(false);

  const { import: performImport, progress, isImporting, result, cancel, pause, resume } = useImport({
    onComplete: (result) => {
      console.log('Import completed:', result);
      setShowProgress(false);
    },
    onError: (error) => {
      console.error('Import error:', error);
    },
  });

  /**
   * Handles file selection
   */
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  /**
   * Starts the import process
   */
  const handleStartImport = async () => {
    if (!selectedFile) return;

    // Create basic import configuration
    const config: ImportConfig = {
      entityType: selectedEntity,
      format: {
        type: 'csv',
        delimiter: ',',
        hasHeader: true,
        encoding: 'utf-8',
      } as ImportFormatConfig,
      mapping: {
        entityType: selectedEntity,
        mappings: [], // Auto-map based on headers
      },
      options: {
        batchSize: 1000,
        skipErrors: false,
        errorThreshold: 100,
        duplicateStrategy: 'error',
        validateOnly: false,
        createCheckpoints: true,
        notifyOnComplete: true,
      },
    };

    setShowProgress(true);
    await performImport(selectedFile, config);
  };

  /**
   * Entity type options
   */
  const entityTypes: Array<{ value: EntityType; label: string; description: string }> = [
    { value: 'students', label: 'Students', description: 'Student demographic and enrollment data' },
    { value: 'medications', label: 'Medications', description: 'Medication records and prescriptions' },
    { value: 'health-records', label: 'Health Records', description: 'General health records and vitals' },
    { value: 'immunizations', label: 'Immunizations', description: 'Vaccination records' },
    { value: 'allergies', label: 'Allergies', description: 'Allergy and adverse reaction records' },
    { value: 'appointments', label: 'Appointments', description: 'Scheduled appointments' },
    { value: 'emergency-contacts', label: 'Emergency Contacts', description: 'Parent and guardian contact information' },
    { value: 'incidents', label: 'Incidents', description: 'Incident reports and logs' },
    { value: 'documents', label: 'Documents', description: 'Document metadata' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Import Data</h1>
          <p className="mt-2 text-gray-600">
            Upload and import healthcare data from CSV, Excel, or JSON files
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/import/templates"
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">Import Templates</h3>
            <p className="text-sm text-gray-600 mt-1">
              Use pre-configured templates for common imports
            </p>
          </Link>

          <Link
            href="/import/history"
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">Import History</h3>
            <p className="text-sm text-gray-600 mt-1">
              View past imports and download error logs
            </p>
          </Link>

          <Link
            href="/import/students"
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">Student Import</h3>
            <p className="text-sm text-gray-600 mt-1">
              Advanced student data import with field mapping
            </p>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Entity Selection */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                1. Select Data Type
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {entityTypes.map((entity) => (
                  <label
                    key={entity.value}
                    className={`
                      relative flex items-start p-4 border-2 rounded-lg cursor-pointer
                      transition-all
                      ${
                        selectedEntity === entity.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="entity-type"
                      value={entity.value}
                      checked={selectedEntity === entity.value}
                      onChange={(e) => setSelectedEntity(e.target.value as EntityType)}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <span className="block font-medium text-gray-900">
                        {entity.label}
                      </span>
                      <span className="block text-sm text-gray-500">
                        {entity.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                2. Upload File
              </h2>

              <FileDropzone
                onFileSelect={handleFileSelect}
                acceptedFormats={['csv', 'excel', 'json']}
                maxSize={100 * 1024 * 1024} // 100MB
                disabled={isImporting}
              />

              {selectedFile && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                      disabled={isImporting}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Start Import */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                3. Start Import
              </h2>

              <button
                onClick={handleStartImport}
                disabled={!selectedFile || isImporting}
                className={`
                  w-full py-3 px-6 rounded-lg font-medium transition-colors
                  ${
                    !selectedFile || isImporting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
              >
                {isImporting ? 'Importing...' : 'Start Import'}
              </button>
            </div>
          </div>

          {/* Right Column - Progress & Info */}
          <div className="space-y-6">
            {/* Progress */}
            {showProgress && progress && (
              <ImportProgress
                progress={progress}
                onCancel={cancel}
                onPause={pause}
                onResume={resume}
                showDetails
              />
            )}

            {/* Results */}
            {result && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Import Results
                </h3>

                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Total Rows:</dt>
                    <dd className="font-medium text-gray-900">
                      {result.totalRows.toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Successful:</dt>
                    <dd className="font-medium text-green-600">
                      {result.successfulRows.toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Failed:</dt>
                    <dd className="font-medium text-red-600">
                      {result.failedRows.toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Skipped:</dt>
                    <dd className="font-medium text-yellow-600">
                      {result.skippedRows.toLocaleString()}
                    </dd>
                  </div>
                </dl>

                {result.errors.length > 0 && (
                  <div className="mt-4">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Download Error Report
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Help */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Check our documentation for file format requirements and best practices.
              </p>
              <Link
                href="/docs/import"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View Documentation →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
