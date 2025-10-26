/**
 * Analytics Export Utilities
 * Functions for exporting analytics data to various formats
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Export to CSV
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: Array<{ key: keyof T; header: string }>
) {
  if (data.length === 0) {
    throw new Error('No data to export');
  }

  // Determine columns
  const cols = columns || Object.keys(data[0]).map((key) => ({ key, header: key }));

  // Create CSV header
  const headers = cols.map((col) => col.header).join(',');

  // Create CSV rows
  const rows = data.map((row) =>
    cols
      .map((col) => {
        const value = row[col.key];
        // Escape commas and quotes
        const escaped = String(value || '')
          .replace(/"/g, '""')
          .replace(/,/g, '\\,');
        return `"${escaped}"`;
      })
      .join(',')
  );

  // Combine header and rows
  const csv = [headers, ...rows].join('\n');

  // Download
  downloadFile(csv, filename, 'text/csv');
}

/**
 * Export to Excel (CSV format compatible with Excel)
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: Array<{ key: keyof T; header: string }>
) {
  // Excel uses UTF-8 BOM for proper encoding
  const BOM = '\uFEFF';

  if (data.length === 0) {
    throw new Error('No data to export');
  }

  const cols = columns || Object.keys(data[0]).map((key) => ({ key, header: key }));

  const headers = cols.map((col) => col.header).join('\t');
  const rows = data.map((row) =>
    cols.map((col) => String(row[col.key] || '')).join('\t')
  );

  const tsv = BOM + [headers, ...rows].join('\n');

  downloadFile(tsv, filename, 'application/vnd.ms-excel');
}

/**
 * Export to PDF
 */
export interface PDFExportOptions {
  title: string;
  subtitle?: string;
  orientation?: 'portrait' | 'landscape';
  columns: Array<{ header: string; dataKey: string }>;
  data: Record<string, any>[];
  footer?: string;
}

export function exportToPDF(options: PDFExportOptions) {
  const { title, subtitle, orientation = 'portrait', columns, data, footer } = options;

  // Create PDF
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
  });

  // Add title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 20);

  // Add subtitle
  let yPos = 28;
  if (subtitle) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, 14, yPos);
    yPos += 8;
  }

  // Add timestamp
  doc.setFontSize(10);
  doc.setTextColor(128);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, yPos);
  yPos += 10;

  // Add table
  const tableColumns = columns.map((col) => ({ header: col.header, dataKey: col.dataKey }));
  const tableData = data;

  (doc as any).autoTable({
    startY: yPos,
    head: [tableColumns.map((col) => col.header)],
    body: tableData.map((row) => tableColumns.map((col) => row[col.dataKey] || '')),
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246], // Blue
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  });

  // Add footer
  if (footer) {
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128);
      const pageHeight = doc.internal.pageSize.height;
      doc.text(footer, 14, pageHeight - 10);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, pageHeight - 10);
    }
  }

  // Save PDF
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  doc.save(`${title.replace(/\s+/g, '_')}_${timestamp}.pdf`);
}

/**
 * Export chart to image
 */
export function exportChartToImage(chartElement: HTMLElement, filename: string) {
  // Use html2canvas for chart export (requires installation)
  import('html2canvas').then((html2canvas) => {
    html2canvas.default(chartElement, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
    }).then((canvas) => {
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  });
}

/**
 * Export to JSON
 */
export function exportToJSON<T>(data: T, filename: string) {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
}

/**
 * Download file helper
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename.endsWith(getExtension(mimeType))
    ? filename
    : `${filename}${getExtension(mimeType)}`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Get file extension from MIME type
 */
function getExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    'text/csv': '.csv',
    'application/json': '.json',
    'application/pdf': '.pdf',
    'application/vnd.ms-excel': '.xls',
  };

  return extensions[mimeType] || '.txt';
}

/**
 * Prepare data for export (sanitize and format)
 */
export function prepareDataForExport<T extends Record<string, any>>(
  data: T[],
  options?: {
    excludeFields?: string[];
    formatDates?: boolean;
    formatNumbers?: boolean;
  }
): T[] {
  const { excludeFields = [], formatDates = true, formatNumbers = true } = options || {};

  return data.map((row) => {
    const cleaned: any = {};

    Object.entries(row).forEach(([key, value]) => {
      // Skip excluded fields
      if (excludeFields.includes(key)) {
        return;
      }

      // Format dates
      if (formatDates && value instanceof Date) {
        cleaned[key] = value.toLocaleString();
        return;
      }

      // Format numbers
      if (formatNumbers && typeof value === 'number') {
        cleaned[key] = value.toLocaleString();
        return;
      }

      // Handle null/undefined
      if (value === null || value === undefined) {
        cleaned[key] = '';
        return;
      }

      // Default
      cleaned[key] = value;
    });

    return cleaned as T;
  });
}

/**
 * Export multiple sheets to Excel (using CSV approach)
 */
export function exportMultipleSheetsToExcel(
  sheets: Array<{
    name: string;
    data: Record<string, any>[];
    columns?: Array<{ key: string; header: string }>;
  }>,
  filename: string
) {
  // Note: For true multi-sheet Excel export, use a library like xlsx
  // This creates separate files
  sheets.forEach((sheet) => {
    const sheetFilename = `${filename}_${sheet.name}`;
    exportToExcel(sheet.data, sheetFilename, sheet.columns);
  });
}

/**
 * Create printable report
 */
export interface PrintReportOptions {
  title: string;
  sections: Array<{
    title: string;
    content: string | HTMLElement;
  }>;
  styles?: string;
}

export function createPrintableReport(options: PrintReportOptions) {
  const { title, sections, styles = '' } = options;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Could not open print window');
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @media print {
            @page { margin: 1in; }
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #2563eb;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 10px;
          }
          h2 {
            color: #1e40af;
            margin-top: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f3f4f6;
            font-weight: bold;
          }
          .timestamp {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 20px;
          }
          ${styles}
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="timestamp">Generated: ${new Date().toLocaleString()}</div>
        ${sections
          .map(
            (section) => `
          <section>
            <h2>${section.title}</h2>
            <div>${
              typeof section.content === 'string'
                ? section.content
                : section.content.outerHTML
            }</div>
          </section>
        `
          )
          .join('')}
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();

  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.print();
  };
}

/**
 * Generate report summary
 */
export interface ReportSummary {
  title: string;
  dateRange: { start: Date; end: Date };
  totalRecords: number;
  keyMetrics: Array<{ label: string; value: string | number }>;
}

export function generateReportSummary(summary: ReportSummary): string {
  return `
${summary.title}
${'='.repeat(summary.title.length)}

Date Range: ${summary.dateRange.start.toLocaleDateString()} - ${summary.dateRange.end.toLocaleDateString()}
Total Records: ${summary.totalRecords.toLocaleString()}

Key Metrics:
${summary.keyMetrics.map((metric) => `  ${metric.label}: ${metric.value}`).join('\n')}

Generated: ${new Date().toLocaleString()}
  `.trim();
}
