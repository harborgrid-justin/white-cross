/**
 * Export Dashboard Page
 *
 * Main export interface with data selection, format configuration, and download.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useExport } from '@/features/data-transfer/hooks/useExport';
import type {
  EntityType,
  ExportConfig,
  ExportFormat,
  ExportFormatConfig,
} from '@/features/data-transfer/types';

// ============================================================================
// Component
// ============================================================================

export default function ExportDashboardPage() {
  const [selectedEntity, setSelectedEntity] = useState<EntityType>('students');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [includeAllFields, setIncludeAllFields] = useState(true);
  const [sanitizeData, setSanitizeData] = useState(false);
  const [compressOutput, setCompressOutput] = useState(false);

  const { exportData, isExporting, result, progress, download } = useExport({
    autoDownload: true,
    onComplete: (result) => {
      console.log('Export completed:', result);
    },
    onError: (error) => {
      console.error('Export error:', error);
    },
  });

  /**
   * Handles export start
   */
  const handleStartExport = async () => {
    // Get format configuration
    const formatConfig = getFormatConfig(selectedFormat);

    // Create export configuration
    const config: ExportConfig = {
      entityType: selectedEntity,
      format: formatConfig,
      fields: {
        entityType: selectedEntity,
        fields: getFieldSelection(selectedEntity, includeAllFields),
      },
      options: {
        compress: compressOutput,
        sanitize: sanitizeData,
        includeMetadata: true,
      },
    };

    // Get sample data (in real app, fetch from API)
    const data = await fetchData(selectedEntity);

    // Perform export
    await exportData(data, config);
  };

  /**
   * Gets format configuration
   */
  const getFormatConfig = (format: ExportFormat): ExportFormatConfig => {
    switch (format) {
      case 'csv':
        return {
          type: 'csv',
          delimiter: ',',
          includeHeader: true,
        };
      case 'excel':
        return {
          type: 'excel',
          sheetName: selectedEntity.charAt(0).toUpperCase() + selectedEntity.slice(1),
          autoFilter: true,
        };
      case 'json':
        return {
          type: 'json',
          pretty: true,
        };
      case 'pdf':
        return {
          type: 'pdf',
          orientation: 'landscape',
        };
    }
  };

  /**
   * Gets field selection
   */
  const getFieldSelection = (
    entityType: EntityType,
    includeAll: boolean
  ): Array<{ field: string; label?: string }> => {
    // Define fields for each entity type
    const fieldsMap: Record<EntityType, string[]> = {
      students: ['studentId', 'firstName', 'lastName', 'dateOfBirth', 'grade', 'email'],
      medications: ['medicationId', 'name', 'dosage', 'route', 'frequency'],
      'health-records': ['recordId', 'studentId', 'recordType', 'date', 'notes'],
      immunizations: ['immunizationId', 'vaccineName', 'date', 'provider'],
      allergies: ['allergyId', 'allergen', 'severity', 'reaction'],
      appointments: ['appointmentId', 'studentId', 'date', 'type', 'status'],
      'emergency-contacts': ['contactId', 'name', 'relationship', 'phone', 'email'],
      incidents: ['incidentId', 'date', 'type', 'severity', 'description'],
      documents: ['documentId', 'fileName', 'type', 'uploadDate'],
    };

    const fields = fieldsMap[entityType] || [];
    return fields.map((field) => ({ field }));
  };

  /**
   * Fetches data for entity type (mock implementation)
   */
  const fetchData = async (
    entityType: EntityType
  ): Promise<Array<Record<string, unknown>>> => {
    // TODO: Replace with actual API call
    return [];
  };

  /**
   * Entity type options
   */
  const entityTypes: Array<{ value: EntityType; label: string }> = [
    { value: 'students', label: 'Students' },
    { value: 'medications', label: 'Medications' },
    { value: 'health-records', label: 'Health Records' },
    { value: 'immunizations', label: 'Immunizations' },
    { value: 'allergies', label: 'Allergies' },
    { value: 'appointments', label: 'Appointments' },
    { value: 'emergency-contacts', label: 'Emergency Contacts' },
    { value: 'incidents', label: 'Incidents' },
    { value: 'documents', label: 'Documents' },
  ];

  /**
   * Format options
   */
  const formats: Array<{ value: ExportFormat; label: string; description: string }> = [
    { value: 'csv', label: 'CSV', description: 'Comma-separated values (Excel compatible)' },
    { value: 'excel', label: 'Excel', description: 'Microsoft Excel spreadsheet (.xlsx)' },
    { value: 'json', label: 'JSON', description: 'JavaScript Object Notation' },
    { value: 'pdf', label: 'PDF', description: 'Portable Document Format (report)' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Export Data</h1>
          <p className="mt-2 text-gray-600">
            Export healthcare data in various formats for analysis and reporting
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/export/reports"
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">Report Export</h3>
            <p className="text-sm text-gray-600 mt-1">
              Generate formatted reports in PDF format
            </p>
          </Link>

          <Link
            href="/export/scheduled"
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">Scheduled Exports</h3>
            <p className="text-sm text-gray-600 mt-1">
              Set up recurring exports with email delivery
            </p>
          </Link>

          <Link
            href="/export/data"
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">Bulk Data Export</h3>
            <p className="text-sm text-gray-600 mt-1">
              Export large datasets with advanced filtering
            </p>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Data Selection */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                1. Select Data to Export
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Type
                  </label>
                  <select
                    value={selectedEntity}
                    onChange={(e) => setSelectedEntity(e.target.value as EntityType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={isExporting}
                  >
                    {entityTypes.map((entity) => (
                      <option key={entity.value} value={entity.value}>
                        {entity.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeAllFields}
                      onChange={(e) => setIncludeAllFields(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600"
                      disabled={isExporting}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Include all fields
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Format Selection */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                2. Choose Export Format
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formats.map((format) => (
                  <label
                    key={format.value}
                    className={`
                      relative flex items-start p-4 border-2 rounded-lg cursor-pointer
                      transition-all
                      ${
                        selectedFormat === format.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.value}
                      checked={selectedFormat === format.value}
                      onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
                      className="mt-1"
                      disabled={isExporting}
                    />
                    <div className="ml-3">
                      <span className="block font-medium text-gray-900">
                        {format.label}
                      </span>
                      <span className="block text-sm text-gray-500">
                        {format.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                3. Export Options
              </h2>

              <div className="space-y-3">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={sanitizeData}
                    onChange={(e) => setSanitizeData(e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600"
                    disabled={isExporting}
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">
                      Sanitize PHI data
                    </span>
                    <span className="block text-sm text-gray-500">
                      Remove or mask protected health information (SSN, DOB, etc.)
                    </span>
                  </div>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={compressOutput}
                    onChange={(e) => setCompressOutput(e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600"
                    disabled={isExporting}
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">
                      Compress output
                    </span>
                    <span className="block text-sm text-gray-500">
                      Create a ZIP archive for large exports
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Start Export */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <button
                onClick={handleStartExport}
                disabled={isExporting}
                className={`
                  w-full py-3 px-6 rounded-lg font-medium transition-colors
                  ${
                    isExporting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
              >
                {isExporting ? 'Exporting...' : 'Export Data'}
              </button>
            </div>
          </div>

          {/* Right Column - Progress & Info */}
          <div className="space-y-6">
            {/* Progress */}
            {progress && isExporting && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Export Progress
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>
                        {progress.currentRecord.toLocaleString()} /{' '}
                        {progress.totalRecords.toLocaleString()} records
                      </span>
                      <span>{Math.round(progress.percentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {result && result.status === 'completed' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Export Complete
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Records Exported:</span>
                    <span className="font-medium text-gray-900">
                      {result.exportedRecords.toLocaleString()}
                    </span>
                  </div>

                  {result.fileSize && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">File Size:</span>
                      <span className="font-medium text-gray-900">
                        {(result.fileSize / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  )}

                  {result.fileName && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">File Name:</span>
                      <span className="font-medium text-gray-900 truncate ml-2">
                        {result.fileName}
                      </span>
                    </div>
                  )}
                </div>

                {result.fileUrl && result.fileName && (
                  <button
                    onClick={() => download(result.fileUrl!, result.fileName!)}
                    className="mt-4 w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    Download File
                  </button>
                )}
              </div>
            )}

            {/* HIPAA Notice */}
            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                HIPAA Compliance
              </h3>
              <p className="text-sm text-yellow-700">
                Exported files may contain protected health information (PHI).
                Ensure proper handling and storage according to HIPAA regulations.
              </p>
              <div className="mt-3">
                <label className="flex items-center text-sm">
                  <input type="checkbox" className="rounded border-yellow-300" required />
                  <span className="ml-2 text-yellow-800">
                    I understand HIPAA requirements
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
