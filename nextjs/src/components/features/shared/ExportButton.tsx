'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/overlays/Modal';
import { Download, FileText, FileSpreadsheet, File, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import toast from 'react-hot-toast';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Export format type
 */
export type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json';

/**
 * Export configuration
 */
export interface ExportConfig {
  /** Format to export */
  format: ExportFormat;
  /** Display label */
  label: string;
  /** Icon component */
  icon: React.ElementType;
  /** Description */
  description?: string;
}

/**
 * ExportButton props
 */
export interface ExportButtonProps {
  /** Data to export */
  data: any[];
  /** Filename (without extension) */
  filename?: string;
  /** Available export formats */
  formats?: ExportFormat[];
  /** Custom export configurations */
  customFormats?: ExportConfig[];
  /** Export handler - if provided, handles export logic externally */
  onExport?: (format: ExportFormat, data: any[]) => Promise<void>;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Button size */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Show as icon button */
  iconOnly?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom className */
  className?: string;
  /** Accessible label */
  ariaLabel?: string;
  /** Show format selection modal */
  showModal?: boolean;
}

const defaultFormats: Record<ExportFormat, ExportConfig> = {
  csv: {
    format: 'csv',
    label: 'CSV',
    icon: FileText,
    description: 'Comma-separated values file, compatible with Excel and other spreadsheet applications'
  },
  xlsx: {
    format: 'xlsx',
    label: 'Excel',
    icon: FileSpreadsheet,
    description: 'Microsoft Excel workbook with formatting and multiple sheets support'
  },
  pdf: {
    format: 'pdf',
    label: 'PDF',
    icon: File,
    description: 'Portable Document Format, ideal for sharing and printing'
  },
  json: {
    format: 'json',
    label: 'JSON',
    icon: FileText,
    description: 'JavaScript Object Notation, suitable for data interchange and APIs'
  }
};

/**
 * Convert data to CSV format
 */
const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return '';

  // Get headers from first object
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');

  // Convert rows
  const csvRows = data.map(row => {
    return headers.map(header => {
      let value = row[header];
      // Handle nested objects
      if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
      }
      // Escape quotes and wrap in quotes if contains comma or quote
      if (typeof value === 'string') {
        value = value.replace(/"/g, '""');
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value}"`;
        }
      }
      return value ?? '';
    }).join(',');
  });

  return [csvHeaders, ...csvRows].join('\n');
};

/**
 * Download file
 */
const downloadFile = (content: string | Blob, filename: string, mimeType: string): void => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * ExportButton - A flexible export button with multiple format options
 *
 * @example
 * ```tsx
 * <ExportButton
 *   data={students}
 *   filename="students-report"
 *   formats={['csv', 'xlsx', 'pdf']}
 *   onExport={async (format, data) => {
 *     await exportService.export(format, data);
 *   }}
 * />
 * ```
 */
export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename = 'export',
  formats = ['csv', 'xlsx', 'pdf'],
  customFormats,
  onExport,
  variant = 'outline',
  size = 'md',
  iconOnly = false,
  disabled = false,
  className,
  ariaLabel = 'Export data',
  showModal = true
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);

  // Build format configurations
  const formatConfigs = customFormats || formats.map(format => defaultFormats[format]);

  const handleExport = useCallback(async (format: ExportFormat) => {
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }

    setIsExporting(true);
    setExportingFormat(format);

    try {
      // Use custom export handler if provided
      if (onExport) {
        await onExport(format, data);
        toast.success(`Exported as ${format.toUpperCase()}`);
      } else {
        // Default export implementation
        switch (format) {
          case 'csv': {
            const csv = convertToCSV(data);
            downloadFile(csv, `${filename}.csv`, 'text/csv');
            toast.success('Exported as CSV');
            break;
          }
          case 'json': {
            const json = JSON.stringify(data, null, 2);
            downloadFile(json, `${filename}.json`, 'application/json');
            toast.success('Exported as JSON');
            break;
          }
          case 'xlsx':
          case 'pdf':
            toast.error(`${format.toUpperCase()} export requires custom handler`);
            break;
          default:
            toast.error(`Unsupported format: ${format}`);
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
      setIsModalOpen(false);
    }
  }, [data, filename, onExport]);

  const handleButtonClick = () => {
    if (formatConfigs.length === 1) {
      // Direct export if only one format
      handleExport(formatConfigs[0].format);
    } else if (showModal) {
      // Show modal for format selection
      setIsModalOpen(true);
    } else {
      // Default to first format
      handleExport(formatConfigs[0].format);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleButtonClick}
        disabled={disabled || isExporting || data.length === 0}
        isLoading={isExporting}
        className={className}
        aria-label={ariaLabel}
      >
        <Download className={cn('h-4 w-4', !iconOnly && 'mr-2')} aria-hidden="true" />
        {!iconOnly && 'Export'}
      </Button>

      {/* Format Selection Modal */}
      {showModal && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Choose Export Format"
          size="md"
        >
          <div className="space-y-3">
            {formatConfigs.map(config => {
              const Icon = config.icon;
              const isExportingThis = exportingFormat === config.format;

              return (
                <button
                  key={config.format}
                  onClick={() => handleExport(config.format)}
                  disabled={isExporting}
                  className={cn(
                    'w-full flex items-start gap-4 p-4 rounded-lg border-2 transition-all duration-200',
                    'hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    isExportingThis && 'border-primary-500 bg-primary-50 dark:bg-primary-900/10',
                    !isExportingThis && 'border-gray-200 dark:border-gray-700'
                  )}
                  aria-label={`Export as ${config.label}`}
                >
                  <div className="flex-shrink-0">
                    {isExportingThis ? (
                      <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                        <div className="h-5 w-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {config.label}
                      </h4>
                      {isExportingThis && (
                        <Check className="h-5 w-5 text-primary-600" aria-hidden="true" />
                      )}
                    </div>
                    {config.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {config.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

ExportButton.displayName = 'ExportButton';

export default React.memo(ExportButton);
