/**
 * ExportFormatSelector Component
 *
 * Handles export configuration including:
 * - Data type selection (health records, medications, etc.)
 * - Export format selection (CSV, Excel, PDF, JSON)
 * - Date range selection
 * - HIPAA compliance warnings
 *
 * @component ExportFormatSelector
 */

'use client';

import React from 'react';
import { Download, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export interface ExportConfig {
  type: 'health-records' | 'medications' | 'appointments' | 'incidents' | 'compliance';
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  dateRange: {
    start: string;
    end: string;
  };
  name: string;
}

interface ExportFormatSelectorProps {
  config: ExportConfig;
  onConfigChange: (config: Partial<ExportConfig>) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const DATA_TYPE_OPTIONS = [
  { value: 'health-records', label: 'Student Health Records' },
  { value: 'medications', label: 'Medication Logs' },
  { value: 'appointments', label: 'Appointment History' },
  { value: 'incidents', label: 'Incident Reports' },
  { value: 'compliance', label: 'Compliance Reports' }
] as const;

const FORMAT_OPTIONS = [
  { value: 'csv', label: 'CSV (Comma Separated)' },
  { value: 'xlsx', label: 'Excel Spreadsheet' },
  { value: 'pdf', label: 'PDF Report' },
  { value: 'json', label: 'JSON Data' }
] as const;

export default function ExportFormatSelector({
  config,
  onConfigChange,
  onSubmit,
  isSubmitting = false
}: ExportFormatSelectorProps) {
  const handleTypeChange = (value: string) => {
    onConfigChange({
      type: value as ExportConfig['type']
    });
  };

  const handleFormatChange = (value: string) => {
    onConfigChange({
      format: value as ExportConfig['format']
    });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    onConfigChange({
      dateRange: {
        ...config.dateRange,
        [field]: value
      }
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onConfigChange({ name: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Data Type Selection */}
          <div>
            <label
              htmlFor="export-type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Data Type
            </label>
            <Select
              id="export-type"
              value={config.type}
              onChange={handleTypeChange}
              options={DATA_TYPE_OPTIONS}
              aria-label="Select data type to export"
            />
          </div>

          {/* Export Format Selection */}
          <div>
            <label
              htmlFor="export-format"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Export Format
            </label>
            <Select
              id="export-format"
              value={config.format}
              onChange={handleFormatChange}
              options={FORMAT_OPTIONS}
              aria-label="Select export format"
            />
          </div>

          {/* Date Range Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="Start Date"
                value={config.dateRange.start}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                aria-label="Start date"
              />
              <Input
                type="date"
                placeholder="End Date"
                value={config.dateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                aria-label="End date"
              />
            </div>
          </div>

          {/* Export Name */}
          <div>
            <label
              htmlFor="export-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Export Name
            </label>
            <Input
              id="export-name"
              placeholder="Enter export job name..."
              value={config.name}
              onChange={handleNameChange}
              aria-label="Export job name"
              required
            />
          </div>

          {/* HIPAA Compliance Warning */}
          <div
            className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
            role="alert"
            aria-live="polite"
          >
            <Shield className="h-5 w-5 text-yellow-600 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                HIPAA Compliance Required
              </p>
              <p className="text-xs text-yellow-700">
                This export contains PHI and requires administrative approval
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !config.name.trim()}
          >
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            {isSubmitting ? 'Creating Export...' : 'Create Export Job'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
