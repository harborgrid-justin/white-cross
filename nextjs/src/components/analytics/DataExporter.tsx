/**
 * Data Exporter Component
 * Export analytics data in multiple formats
 */

'use client';

import { useState } from 'react';
import { Download, FileText, Table, FileJson, Loader2 } from 'lucide-react';
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  exportToJSON,
  type PDFExportOptions,
} from '@/lib/analytics/export';
import type { ExportFormat } from '@/lib/validations/report.schemas';

interface DataExporterProps<T extends Record<string, any>> {
  data: T[];
  filename: string;
  columns?: Array<{ key: keyof T; header: string }>;
  pdfOptions?: Partial<PDFExportOptions>;
  title?: string;
}

export function DataExporter<T extends Record<string, any>>({
  data,
  filename,
  columns,
  pdfOptions,
  title = 'Export Data',
}: DataExporterProps<T>) {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setSelectedFormat(format);

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const fullFilename = `${filename}_${timestamp}`;

      switch (format) {
        case 'csv':
          exportToCSV(data, fullFilename, columns);
          break;

        case 'excel':
          exportToExcel(data, fullFilename, columns);
          break;

        case 'pdf':
          const pdfCols =
            columns?.map((col) => ({
              header: col.header,
              dataKey: String(col.key),
            })) ||
            Object.keys(data[0] || {}).map((key) => ({
              header: key,
              dataKey: key,
            }));

          exportToPDF({
            title: pdfOptions?.title || filename,
            subtitle: pdfOptions?.subtitle,
            columns: pdfCols,
            data,
            footer: pdfOptions?.footer || 'Confidential - White Cross Healthcare',
          });
          break;

        case 'json':
          exportToJSON(data, fullFilename);
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      format: 'csv' as ExportFormat,
      label: 'CSV',
      description: 'Comma-separated values',
      icon: Table,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
    },
    {
      format: 'excel' as ExportFormat,
      label: 'Excel',
      description: 'Microsoft Excel format',
      icon: Table,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      hoverColor: 'hover:bg-emerald-100',
    },
    {
      format: 'pdf' as ExportFormat,
      label: 'PDF',
      description: 'Portable document format',
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100',
    },
    {
      format: 'json' as ExportFormat,
      label: 'JSON',
      description: 'JavaScript object notation',
      icon: FileJson,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Export {data.length.toLocaleString()} record{data.length !== 1 ? 's' : ''} in your
          preferred format
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          const isProcessing = isExporting && selectedFormat === option.format;

          return (
            <button
              key={option.format}
              onClick={() => handleExport(option.format)}
              disabled={isExporting}
              className={`
                flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200
                transition-all duration-200
                ${isExporting ? 'opacity-50 cursor-not-allowed' : option.hoverColor}
                ${isProcessing ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              <div className={`p-3 rounded-full ${option.bgColor} mb-3`}>
                {isProcessing ? (
                  <Loader2 className={`h-6 w-6 ${option.color} animate-spin`} />
                ) : (
                  <Icon className={`h-6 w-6 ${option.color}`} />
                )}
              </div>

              <div className="text-center">
                <div className="font-semibold text-gray-900">{option.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
              </div>

              {isProcessing && (
                <div className="text-xs text-blue-600 mt-2 font-medium">Exporting...</div>
              )}
            </button>
          );
        })}
      </div>

      {data.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">No data available to export.</p>
        </div>
      )}

      {/* Export Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Export Information</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• CSV and Excel formats are best for data analysis</li>
          <li>• PDF format includes charts and formatted layout</li>
          <li>• JSON format is suitable for programmatic use</li>
          <li>• All exports include timestamps and metadata</li>
        </ul>
      </div>
    </div>
  );
}
