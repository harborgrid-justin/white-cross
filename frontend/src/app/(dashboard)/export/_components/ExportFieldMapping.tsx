/**
 * ExportFieldMapping Component
 *
 * Displays export preview with:
 * - Estimated record count and file size
 * - Field selection checkboxes
 * - Processing time estimate
 * - Security and encryption notice
 *
 * @component ExportFieldMapping
 */

'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface ExportField {
  id: string;
  label: string;
  selected: boolean;
}

export interface ExportPreviewData {
  estimatedRecords: number;
  estimatedSize: string;
  processingTime: string;
  recordType: string;
}

interface ExportFieldMappingProps {
  fields: ExportField[];
  previewData: ExportPreviewData;
  onFieldToggle: (fieldId: string) => void;
  onToggleAll: (selected: boolean) => void;
}

export default function ExportFieldMapping({
  fields,
  previewData,
  onFieldToggle,
  onToggleAll
}: ExportFieldMappingProps) {
  const selectedCount = fields.filter(f => f.selected).length;
  const allSelected = selectedCount === fields.length;
  const someSelected = selectedCount > 0 && selectedCount < fields.length;

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggleAll(e.target.checked);
  };

  const handleFieldToggle = (fieldId: string) => {
    onFieldToggle(fieldId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Data Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Data Summary</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Estimated Records:</span>
                <span className="font-medium">
                  {previewData.estimatedRecords} {previewData.recordType}
                </span>
              </div>
              <div className="flex justify-between">
                <span>File Size (approx.):</span>
                <span className="font-medium">{previewData.estimatedSize}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Time:</span>
                <span className="font-medium">{previewData.processingTime}</span>
              </div>
            </div>
          </div>

          {/* Field Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Fields to Export</h4>
              <span className="text-sm text-gray-500">
                {selectedCount} of {fields.length} selected
              </span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {/* Select All Option */}
              <label className="flex items-center space-x-2 cursor-pointer pb-2 border-b border-gray-200">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = someSelected;
                    }
                  }}
                  onChange={handleToggleAll}
                  className="rounded"
                  aria-label="Select all fields"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All Fields
                </span>
              </label>

              {/* Individual Field Checkboxes */}
              {fields.map((field) => (
                <label
                  key={field.id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={field.selected}
                    onChange={() => handleFieldToggle(field.id)}
                    className="rounded"
                    aria-label={`Select ${field.label}`}
                  />
                  <span className="text-sm text-gray-700">{field.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div
            className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-blue-600 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium text-blue-800">Secure Export</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Export will be encrypted and access logged for audit compliance
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
