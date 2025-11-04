'use client';

import React from 'react';
import { Upload, Download, Trash2, FileText } from 'lucide-react';
import { ComplianceEvidenceProps } from './types';

/**
 * ComplianceEvidence Component
 *
 * Manages evidence files for a compliance requirement. Supports uploading new files,
 * downloading existing files, and deleting files. Displays an empty state when no
 * evidence is present.
 *
 * @param props - ComplianceEvidence component props
 * @returns JSX element representing the compliance evidence tab
 */
const ComplianceEvidence: React.FC<ComplianceEvidenceProps> = ({
  evidence,
  onUploadEvidence,
  onDownloadEvidence,
  onDeleteEvidence
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Evidence Files ({evidence.length})
        </h3>
        <label className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600
                        bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 cursor-pointer">
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) {
                onUploadEvidence?.(e.target.files);
              }
            }}
          />
        </label>
      </div>

      {/* Evidence Files Grid */}
      {evidence.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {evidence.map((evidenceItem) => (
            <div
              key={evidenceItem.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{evidenceItem.name}</p>
                  <p className="text-xs text-gray-500">
                    {evidenceItem.type} • Uploaded {new Date(evidenceItem.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onDownloadEvidence?.(evidenceItem.id)}
                  className="p-1 text-gray-400 hover:text-blue-600 rounded"
                  aria-label="Download evidence"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteEvidence?.(evidenceItem.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                  aria-label="Delete evidence"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Evidence Files</h3>
          <p className="text-gray-600 mb-4">Upload files to document compliance with this requirement.</p>
          <label className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600
                          bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Upload Your First File
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) {
                  onUploadEvidence?.(e.target.files);
                }
              }}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default ComplianceEvidence;
