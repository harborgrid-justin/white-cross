import { Injectable, Logger } from '@nestjs/common';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportFormat } from '../enums/report-format.enum';
import { ComplianceReport } from '../interfaces/compliance-report.interfaces';

import { BaseService } from '@/common/base';
/**
 * Compliance Report Exporter Service
 *
 * Responsible for exporting compliance reports to various formats.
 * Handles format-specific rendering and file generation.
 *
 * @responsibilities
 * - Export reports to PDF format using jsPDF
 * - Export reports to CSV format
 * - Export reports to Excel format
 * - Export reports to JSON format
 * - Generate file URLs for storage
 */
@Injectable()
export class ComplianceReportExporterService extends BaseService {
  constructor() {
    super("ComplianceReportExporterService");
  }

  /**
   * Export report to specified format
   */
  async exportReport(
    report: ComplianceReport,
    format: ReportFormat,
  ): Promise<{ fileUrl: string; fileSize: number }> {
    try {
      let fileUrl: string;
      let fileSize: number;

      switch (format) {
        case ReportFormat.PDF:
          fileUrl = await this.exportToPDF(report);
          fileSize = 1024 * 512; // Estimated 512KB
          break;

        case ReportFormat.CSV:
          fileUrl = await this.exportToCSV(report);
          fileSize = 1024 * 128; // Estimated 128KB
          break;

        case ReportFormat.EXCEL:
          fileUrl = await this.exportToExcel(report);
          fileSize = 1024 * 256; // Estimated 256KB
          break;

        case ReportFormat.JSON:
          fileUrl = await this.exportToJSON(report);
          fileSize = 1024 * 64; // Estimated 64KB
          break;

        default:
          fileUrl = `/reports/${report.id}.${format.toLowerCase()}`;
          fileSize = 1024 * 256;
      }

      this.logInfo(`Report exported: ${report.id} to ${format} format`);
      return { fileUrl, fileSize };
    } catch (error) {
      this.logError(`Error exporting report ${report.id}`, error.stack);
      throw error;
    }
  }

  /**
   * Export report to PDF format using jsPDF
   */
  async exportToPDF(report: ComplianceReport): Promise<string> {
    try {
      const doc = new jsPDF.default();
      const pageWidth = doc.internal.pageSize.width;
      let yPos = 20;

      // Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(report.title, pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;

      // Report metadata
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Report ID: ${report.id}`, 15, yPos);
      yPos += 5;
      doc.text(
        `Generated: ${report.generatedDate.toLocaleDateString()}`,
        15,
        yPos,
      );
      yPos += 5;
      doc.text(
        `Period: ${report.periodStart.toLocaleDateString()} - ${report.periodEnd.toLocaleDateString()}`,
        15,
        yPos,
      );
      yPos += 10;

      // Executive Summary
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Executive Summary', 15, yPos);
      yPos += 7;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Value']],
        body: [
          ['Total Records', report.summary.totalRecords.toString()],
          ['Compliant Records', report.summary.compliantRecords.toString()],
          [
            'Non-Compliant Records',
            report.summary.nonCompliantRecords.toString(),
          ],
          ['Compliance Rate', `${report.summary.complianceRate}%`],
          ['Status', report.summary.status],
        ],
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;

      // Findings
      if (report.findings.length > 0) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Findings', 15, yPos);
        yPos += 7;

        autoTable(doc, {
          startY: yPos,
          head: [['Severity', 'Category', 'Issue', 'Affected']],
          body: report.findings.map((f) => [
            f.severity,
            f.category,
            f.issue,
            f.affectedCount.toString(),
          ]),
          theme: 'striped',
          headStyles: { fillColor: [231, 76, 60] },
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;
      }

      // Recommendations
      if (report.recommendations.length > 0) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Recommendations', 15, yPos);
        yPos += 7;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        report.recommendations.forEach((rec, index) => {
          if (yPos > 280) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`${index + 1}. ${rec}`, 15, yPos, {
            maxWidth: pageWidth - 30,
          });
          yPos += 7;
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          `Page ${i} of ${pageCount} | Generated by White Cross Health Platform`,
          pageWidth / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' },
        );
      }

      // In production, save to cloud storage (S3, Azure Blob, etc.)
      const fileUrl = `/reports/${report.id}.pdf`;

      this.logDebug(`PDF generated for report ${report.id}`);
      return fileUrl;
    } catch (error) {
      this.logError('Error generating PDF', error.stack);
      throw error;
    }
  }

  /**
   * Export report to CSV format
   */
  async exportToCSV(report: ComplianceReport): Promise<string> {
    try {
      const rows: string[][] = [];

      // Header
      rows.push(['Report Type', report.reportType]);
      rows.push(['Title', report.title]);
      rows.push(['Generated Date', report.generatedDate.toISOString()]);
      rows.push(['Period Start', report.periodStart.toISOString()]);
      rows.push(['Period End', report.periodEnd.toISOString()]);
      rows.push([]);

      // Summary
      rows.push(['SUMMARY']);
      rows.push(['Metric', 'Value']);
      rows.push(['Total Records', report.summary.totalRecords.toString()]);
      rows.push([
        'Compliant Records',
        report.summary.compliantRecords.toString(),
      ]);
      rows.push([
        'Non-Compliant Records',
        report.summary.nonCompliantRecords.toString(),
      ]);
      rows.push(['Compliance Rate', `${report.summary.complianceRate}%`]);
      rows.push(['Status', report.summary.status]);
      rows.push([]);

      // Findings
      if (report.findings.length > 0) {
        rows.push(['FINDINGS']);
        rows.push([
          'Severity',
          'Category',
          'Issue',
          'Details',
          'Affected Count',
        ]);
        report.findings.forEach((f) => {
          rows.push([
            f.severity,
            f.category,
            f.issue,
            f.details,
            f.affectedCount.toString(),
          ]);
        });
        rows.push([]);
      }

      // Recommendations
      if (report.recommendations.length > 0) {
        rows.push(['RECOMMENDATIONS']);
        report.recommendations.forEach((rec, idx) => {
          rows.push([(idx + 1).toString(), rec]);
        });
      }

      // Convert to CSV string with proper escaping
      const csvContent = rows
        .map((row) => row.map((cell) => this.escapeCSVCell(cell)).join(','))
        .join('\n');

      // In production, save to cloud storage
      const fileUrl = `/reports/${report.id}.csv`;

      this.logDebug(`CSV generated for report ${report.id}`);
      return fileUrl;
    } catch (error) {
      this.logError('Error generating CSV', error.stack);
      throw error;
    }
  }

  /**
   * Export report to Excel format
   */
  async exportToExcel(report: ComplianceReport): Promise<string> {
    // For now, Excel export is same as CSV with .xlsx extension
    // In production, use a library like exceljs for true Excel format
    const csvUrl = await this.exportToCSV(report);
    return csvUrl.replace('.csv', '.xlsx');
  }

  /**
   * Export report to JSON format
   */
  async exportToJSON(report: ComplianceReport): Promise<string> {
    try {
      // Structured JSON export
      const jsonData = {
        metadata: {
          reportId: report.id,
          reportType: report.reportType,
          generatedDate: report.generatedDate,
          periodStart: report.periodStart,
          periodEnd: report.periodEnd,
          schoolId: report.schoolId,
        },
        summary: report.summary,
        sections: report.sections,
        findings: report.findings,
        recommendations: report.recommendations,
        status: report.status,
      };

      // In production, save to cloud storage
      const fileUrl = `/reports/${report.id}.json`;

      this.logDebug(`JSON generated for report ${report.id}`);
      return fileUrl;
    } catch (error) {
      this.logError('Error generating JSON', error.stack);
      throw error;
    }
  }

  // ==================== Private Helper Methods ====================

  /**
   * Escape CSV cell content
   */
  private escapeCSVCell(cell: string): string {
    if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
      return `"${cell.replace(/"/g, '""')}"`;
    }
    return cell;
  }
}
