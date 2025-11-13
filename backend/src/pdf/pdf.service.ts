import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PDFDocument, rgb } from 'pdf-lib';
import { BaseService } from '@/common/base';
import { LoggerService } from '../shared/logging/logger.service';
import {
  GenerateImmunizationReportDto,
  GenerateIncidentReportDto,
  GenerateMedicationLogDto,
  GenerateStudentHealthSummaryDto,
  PdfGenerateCustomReportDto,
  WatermarkPdfDto,
} from '@/pdf/dto';

// Extend jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

/**
 * PDF Service
 * Handles PDF generation for healthcare documents including health summaries,
 * medication logs, immunization reports, incident reports, and custom reports.
 * Also provides advanced features like PDF merging, watermarking, and digital signatures.
 */
@Injectable()
export class PdfService extends BaseService {
  constructor(
    @Inject(LoggerService) logger: LoggerService,
  ) {
    super({
      serviceName: 'PdfService',
      logger,
      enableAuditLogging: true,
    });
  }

  /**
   * Generate student health summary PDF
   */
  async generateStudentHealthSummary(data: GenerateStudentHealthSummaryDto): Promise<Buffer> {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.text('Student Health Summary', 105, 20, { align: 'center' });

      // Student information
      doc.setFontSize(12);
      doc.text(`Name: ${data.firstName} ${data.lastName}`, 20, 40);
      doc.text(`Date of Birth: ${new Date(data.dateOfBirth).toLocaleDateString()}`, 20, 50);
      doc.text(`Grade: ${data.grade || 'N/A'}`, 20, 60);
      doc.text(`Student ID: ${data.studentNumber || 'N/A'}`, 20, 70);

      // Allergies
      let yPosition = 90;
      doc.setFontSize(14);
      doc.text('Allergies', 20, yPosition);
      yPosition += 10;

      if (data.allergies && data.allergies.length > 0) {
        doc.autoTable({
          startY: yPosition,
          head: [['Allergen', 'Severity', 'Reaction']],
          body: data.allergies.map((allergy) => [
            allergy.allergen,
            allergy.severity,
            allergy.reaction || 'N/A',
          ]),
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] },
        });
        yPosition = doc.lastAutoTable!.finalY + 20;
      } else {
        doc.setFontSize(10);
        doc.text('No known allergies', 20, yPosition);
        yPosition += 20;
      }

      // Medications
      doc.setFontSize(14);
      doc.text('Current Medications', 20, yPosition);
      yPosition += 10;

      if (data.medications && data.medications.length > 0) {
        doc.autoTable({
          startY: yPosition,
          head: [['Medication', 'Dosage', 'Frequency', 'Route']],
          body: data.medications.map((med) => [med.name, med.dosage, med.frequency, med.route]),
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] },
        });
        yPosition = doc.lastAutoTable!.finalY + 20;
      } else {
        doc.setFontSize(10);
        doc.text('No current medications', 20, yPosition);
        yPosition += 20;
      }

      // Chronic conditions
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text('Chronic Conditions', 20, yPosition);
      yPosition += 10;

      if (data.chronicConditions && data.chronicConditions.length > 0) {
        doc.setFontSize(10);
        data.chronicConditions.forEach((condition) => {
          doc.text(`- ${condition.diagnosisName}`, 25, yPosition);
          yPosition += 7;
        });
      } else {
        doc.setFontSize(10);
        doc.text('No chronic conditions', 20, yPosition);
      }

      // Footer
      doc.setFontSize(8);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
      doc.text('White Cross Healthcare Platform', 105, 285, {
        align: 'center',
      });

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      this.logInfo(`Student health summary PDF generated for ID: ${data.id}`);

      return pdfBuffer;
    } catch (error) {
      this.logError('Error generating student health summary PDF', error as Error);
      throw new BadRequestException('Failed to generate student health summary PDF');
    }
  }

  /**
   * Generate medication administration log PDF
   */
  async generateMedicationLog(data: GenerateMedicationLogDto): Promise<Buffer> {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.text('Medication Administration Log', 105, 20, { align: 'center' });

      // Medication details
      doc.setFontSize(12);
      doc.text(`Medication: ${data.name}`, 20, 40);
      doc.text(`Student: ${data.studentName}`, 20, 50);
      doc.text(`Dosage: ${data.dosage}`, 20, 60);
      doc.text(`Route: ${data.route}`, 20, 70);
      doc.text(`Frequency: ${data.frequency}`, 20, 80);

      // Administration records
      if (data.administrations && data.administrations.length > 0) {
        doc.autoTable({
          startY: 95,
          head: [['Date/Time', 'Administered By', 'Verified By', 'Notes']],
          body: data.administrations.map((admin) => [
            new Date(admin.administeredAt).toLocaleString(),
            admin.administeredBy,
            admin.verifiedBy || 'N/A',
            admin.notes || 'N/A',
          ]),
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] },
        });
      }

      // Footer
      doc.setFontSize(8);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
      doc.text('White Cross Healthcare Platform', 105, 285, {
        align: 'center',
      });

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      this.logInfo(`Medication log PDF generated for ID: ${data.id}`);

      return pdfBuffer;
    } catch (error) {
      this.logError('Error generating medication log PDF', error as Error);
      throw new BadRequestException('Failed to generate medication log PDF');
    }
  }

  /**
   * Generate immunization compliance report PDF
   */
  async generateImmunizationReport(data: GenerateImmunizationReportDto): Promise<Buffer> {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.text('Immunization Compliance Report', 105, 20, {
        align: 'center',
      });

      // Report metadata
      doc.setFontSize(12);
      doc.text(`Organization: ${data.organizationName}`, 20, 40);
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 50);
      doc.text(`Total Students: ${data.totalStudents}`, 20, 60);
      doc.text(`Compliant: ${data.compliantStudents} (${data.complianceRate}%)`, 20, 70);

      // Student immunization status
      if (data.students && data.students.length > 0) {
        doc.autoTable({
          startY: 85,
          head: [['Student Name', 'Grade', 'Status', 'Missing Vaccines']],
          body: data.students.map((student) => [
            `${student.firstName} ${student.lastName}`,
            student.grade || 'N/A',
            student.compliant ? 'Compliant' : 'Non-Compliant',
            student.missingVaccines?.join(', ') || 'None',
          ]),
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] },
          columnStyles: {
            3: { cellWidth: 60 },
          },
        });
      }

      // Footer
      doc.setFontSize(8);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
      doc.text('White Cross Healthcare Platform', 105, 285, {
        align: 'center',
      });

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      this.logInfo('Immunization compliance report PDF generated');

      return pdfBuffer;
    } catch (error) {
      this.logError('Error generating immunization report PDF', error as Error);
      throw new BadRequestException('Failed to generate immunization report PDF');
    }
  }

  /**
   * Generate incident report PDF
   */
  async generateIncidentReport(data: GenerateIncidentReportDto): Promise<Buffer> {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.text('Incident Report', 105, 20, { align: 'center' });

      // Incident details
      doc.setFontSize(12);
      doc.text(`Incident ID: ${data.id}`, 20, 40);
      doc.text(`Date/Time: ${new Date(data.incidentDateTime).toLocaleString()}`, 20, 50);
      doc.text(`Location: ${data.location}`, 20, 60);
      doc.text(`Severity: ${data.severity}`, 20, 70);

      // Student information
      doc.text(`Student: ${data.studentName}`, 20, 85);
      doc.text(`Grade: ${data.grade || 'N/A'}`, 20, 95);

      // Description
      doc.setFontSize(14);
      doc.text('Description:', 20, 110);
      doc.setFontSize(10);
      const splitDescription = doc.splitTextToSize(data.description, 170);
      doc.text(splitDescription, 20, 120);

      // Actions taken
      const yPosition = 120 + splitDescription.length * 7 + 10;
      doc.setFontSize(14);
      doc.text('Actions Taken:', 20, yPosition);
      doc.setFontSize(10);
      const splitActions = doc.splitTextToSize(data.actionsTaken || 'None', 170);
      doc.text(splitActions, 20, yPosition + 10);

      // Footer
      doc.setFontSize(8);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
      doc.text('White Cross Healthcare Platform', 105, 285, {
        align: 'center',
      });

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      this.logInfo(`Incident report PDF generated for ID: ${data.id}`);

      return pdfBuffer;
    } catch (error) {
      this.logError('Error generating incident report PDF', error as Error);
      throw new BadRequestException('Failed to generate incident report PDF');
    }
  }

  /**
   * Generate custom report with tables
   */
  async generateCustomReport(data: PdfGenerateCustomReportDto): Promise<Buffer> {
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Title
      doc.setFontSize(20);
      doc.text(data.title, 105, yPosition, { align: 'center' });
      yPosition += 15;

      // Subtitle
      if (data.subtitle) {
        doc.setFontSize(12);
        doc.text(data.subtitle, 105, yPosition, { align: 'center' });
        yPosition += 10;
      }

      // Metadata
      if (data.metadata) {
        doc.setFontSize(10);
        for (const [key, value] of Object.entries(data.metadata)) {
          doc.text(`${key}: ${value}`, 20, yPosition);
          yPosition += 7;
        }
        yPosition += 5;
      }

      // Tables
      if (data.tables) {
        for (const table of data.tables) {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }

          if (table.title) {
            doc.setFontSize(14);
            doc.text(table.title, 20, yPosition);
            yPosition += 10;
          }

          doc.autoTable({
            startY: yPosition,
            head: [table.headers],
            body: table.rows,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] },
          });

          yPosition = doc.lastAutoTable!.finalY + 15;
        }
      }

      // Footer
      doc.setFontSize(8);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
      doc.text('White Cross Healthcare Platform', 105, 285, {
        align: 'center',
      });

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      this.logInfo(`Custom report PDF generated: ${data.title}`);

      return pdfBuffer;
    } catch (error) {
      this.logError('Error generating custom report PDF', error as Error);
      throw new BadRequestException('Failed to generate custom report PDF');
    }
  }

  /**
   * Merge multiple PDFs into one
   */
  async mergePdfs(pdfBuffers: string[]): Promise<Buffer> {
    try {
      const mergedPdf = await PDFDocument.create();

      for (const base64Buffer of pdfBuffers) {
        const buffer = Buffer.from(base64Buffer, 'base64');
        const pdf = await PDFDocument.load(buffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBuffer = await mergedPdf.save();
      this.logInfo(`Merged ${pdfBuffers.length} PDFs`);

      return Buffer.from(mergedBuffer);
    } catch (error) {
      this.logError('Error merging PDFs', error as Error);
      throw new BadRequestException('Failed to merge PDFs');
    }
  }

  /**
   * Add watermark to PDF
   */
  async addWatermark(data: WatermarkPdfDto): Promise<Buffer> {
    try {
      const buffer = Buffer.from(data.pdfBuffer, 'base64');
      const pdfDoc = await PDFDocument.load(buffer);
      const pages = pdfDoc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        const degrees = await import('pdf-lib').then((m) => m.degrees);
        page.drawText(data.watermarkText, {
          x: data.x !== undefined ? data.x : width / 2 - 100,
          y: data.y !== undefined ? data.y : height / 2,
          size: data.size || 50,
          color: rgb(0.5, 0.5, 0.5),
          opacity: data.opacity || 0.3,
          rotate: degrees(data.rotate || 45),
        });
      }

      const watermarkedBuffer = await pdfDoc.save();
      this.logInfo('PDF watermark added');

      return Buffer.from(watermarkedBuffer);
    } catch (error) {
      this.logError('Error adding watermark to PDF', error as Error);
      throw new BadRequestException('Failed to add watermark to PDF');
    }
  }

  /**
   * Add digital signature to PDF
   * Note: This is a basic implementation. For production use,
   * implement proper certificate handling and signature validation.
   */
  async signPdf(pdfBuffer: string, signatureName?: string): Promise<Buffer> {
    try {
      const buffer = Buffer.from(pdfBuffer, 'base64');
      const pdfDoc = await PDFDocument.load(buffer);

      // Add signature metadata
      pdfDoc.setProducer('White Cross Healthcare Platform');
      pdfDoc.setCreator(signatureName || 'System');

      // In a production environment, you would:
      // 1. Load a certificate
      // 2. Create a signature field
      // 3. Sign the PDF with the certificate
      // 4. Add signature appearance

      const signedBuffer = await pdfDoc.save();
      this.logInfo('PDF signed');

      return Buffer.from(signedBuffer);
    } catch (error) {
      this.logError('Error signing PDF', error as Error);
      throw new BadRequestException('Failed to sign PDF');
    }
  }
}
