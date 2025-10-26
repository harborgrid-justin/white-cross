/**
 * PDF Generation Service
 *
 * Server-side PDF generation using jsPDF.
 * Provides templates for various healthcare reports and documents.
 *
 * Features:
 * - Student health summary PDFs
 * - Medication administration logs
 * - Immunization compliance reports
 * - Incident reports
 * - Audit log exports
 * - Custom report generation
 *
 * @module services/pdf/PdfService
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { logger } from '../../utils/logger';

// Extend jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

/**
 * PDF Service class
 */
export class PdfService {
  /**
   * Generate student health summary PDF
   */
  async generateStudentHealthSummary(studentData: any): Promise<Buffer> {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.text('Student Health Summary', 105, 20, { align: 'center' });

      // Student information
      doc.setFontSize(12);
      doc.text(`Name: ${studentData.firstName} ${studentData.lastName}`, 20, 40);
      doc.text(`Date of Birth: ${new Date(studentData.dateOfBirth).toLocaleDateString()}`, 20, 50);
      doc.text(`Grade: ${studentData.grade || 'N/A'}`, 20, 60);
      doc.text(`Student ID: ${studentData.studentNumber || 'N/A'}`, 20, 70);

      // Allergies
      let yPosition = 90;
      doc.setFontSize(14);
      doc.text('Allergies', 20, yPosition);
      yPosition += 10;

      if (studentData.allergies && studentData.allergies.length > 0) {
        doc.autoTable({
          startY: yPosition,
          head: [['Allergen', 'Severity', 'Reaction']],
          body: studentData.allergies.map((allergy: any) => [
            allergy.allergen,
            allergy.severity,
            allergy.reaction || 'N/A'
          ]),
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] }
        });
        yPosition = (doc as any).lastAutoTable.finalY + 20;
      } else {
        doc.setFontSize(10);
        doc.text('No known allergies', 20, yPosition);
        yPosition += 20;
      }

      // Medications
      doc.setFontSize(14);
      doc.text('Current Medications', 20, yPosition);
      yPosition += 10;

      if (studentData.medications && studentData.medications.length > 0) {
        doc.autoTable({
          startY: yPosition,
          head: [['Medication', 'Dosage', 'Frequency', 'Route']],
          body: studentData.medications.map((med: any) => [
            med.name,
            med.dosage,
            med.frequency,
            med.route
          ]),
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] }
        });
        yPosition = (doc as any).lastAutoTable.finalY + 20;
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

      if (studentData.chronicConditions && studentData.chronicConditions.length > 0) {
        doc.setFontSize(10);
        studentData.chronicConditions.forEach((condition: any) => {
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
      doc.text('White Cross Healthcare Platform', 105, 285, { align: 'center' });

      // Convert to buffer
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      logger.info('Student health summary PDF generated', { studentId: studentData.id });

      return pdfBuffer;
    } catch (error) {
      logger.error('Error generating student health summary PDF', error);
      throw error;
    }
  }

  /**
   * Generate medication administration log PDF
   */
  async generateMedicationLog(medicationData: any): Promise<Buffer> {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.text('Medication Administration Log', 105, 20, { align: 'center' });

      // Medication details
      doc.setFontSize(12);
      doc.text(`Medication: ${medicationData.name}`, 20, 40);
      doc.text(`Student: ${medicationData.studentName}`, 20, 50);
      doc.text(`Dosage: ${medicationData.dosage}`, 20, 60);
      doc.text(`Route: ${medicationData.route}`, 20, 70);
      doc.text(`Frequency: ${medicationData.frequency}`, 20, 80);

      // Administration records
      if (medicationData.administrations && medicationData.administrations.length > 0) {
        doc.autoTable({
          startY: 95,
          head: [['Date/Time', 'Administered By', 'Verified By', 'Notes']],
          body: medicationData.administrations.map((admin: any) => [
            new Date(admin.administeredAt).toLocaleString(),
            admin.administeredBy,
            admin.verifiedBy || 'N/A',
            admin.notes || 'N/A'
          ]),
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] }
        });
      }

      // Footer
      doc.setFontSize(8);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
      doc.text('White Cross Healthcare Platform', 105, 285, { align: 'center' });

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      logger.info('Medication administration log PDF generated', { medicationId: medicationData.id });

      return pdfBuffer;
    } catch (error) {
      logger.error('Error generating medication log PDF', error);
      throw error;
    }
  }

  /**
   * Generate immunization compliance report PDF
   */
  async generateImmunizationReport(reportData: any): Promise<Buffer> {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.text('Immunization Compliance Report', 105, 20, { align: 'center' });

      // Report metadata
      doc.setFontSize(12);
      doc.text(`Organization: ${reportData.organizationName}`, 20, 40);
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 50);
      doc.text(`Total Students: ${reportData.totalStudents}`, 20, 60);
      doc.text(`Compliant: ${reportData.compliantStudents} (${reportData.complianceRate}%)`, 20, 70);

      // Student immunization status
      if (reportData.students && reportData.students.length > 0) {
        doc.autoTable({
          startY: 85,
          head: [['Student Name', 'Grade', 'Status', 'Missing Vaccines']],
          body: reportData.students.map((student: any) => [
            `${student.firstName} ${student.lastName}`,
            student.grade || 'N/A',
            student.compliant ? 'Compliant' : 'Non-Compliant',
            student.missingVaccines?.join(', ') || 'None'
          ]),
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] },
          columnStyles: {
            3: { cellWidth: 60 }
          }
        });
      }

      // Footer
      doc.setFontSize(8);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
      doc.text('White Cross Healthcare Platform', 105, 285, { align: 'center' });

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      logger.info('Immunization compliance report PDF generated');

      return pdfBuffer;
    } catch (error) {
      logger.error('Error generating immunization report PDF', error);
      throw error;
    }
  }

  /**
   * Generate incident report PDF
   */
  async generateIncidentReport(incidentData: any): Promise<Buffer> {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.text('Incident Report', 105, 20, { align: 'center' });

      // Incident details
      doc.setFontSize(12);
      doc.text(`Incident ID: ${incidentData.id}`, 20, 40);
      doc.text(`Date/Time: ${new Date(incidentData.incidentDateTime).toLocaleString()}`, 20, 50);
      doc.text(`Location: ${incidentData.location}`, 20, 60);
      doc.text(`Severity: ${incidentData.severity}`, 20, 70);

      // Student information
      doc.text(`Student: ${incidentData.studentName}`, 20, 85);
      doc.text(`Grade: ${incidentData.grade || 'N/A'}`, 20, 95);

      // Description
      doc.setFontSize(14);
      doc.text('Description:', 20, 110);
      doc.setFontSize(10);
      const splitDescription = doc.splitTextToSize(incidentData.description, 170);
      doc.text(splitDescription, 20, 120);

      // Actions taken
      const yPosition = 120 + (splitDescription.length * 7) + 10;
      doc.setFontSize(14);
      doc.text('Actions Taken:', 20, yPosition);
      doc.setFontSize(10);
      const splitActions = doc.splitTextToSize(incidentData.actionsTaken || 'None', 170);
      doc.text(splitActions, 20, yPosition + 10);

      // Footer
      doc.setFontSize(8);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
      doc.text('White Cross Healthcare Platform', 105, 285, { align: 'center' });

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      logger.info('Incident report PDF generated', { incidentId: incidentData.id });

      return pdfBuffer;
    } catch (error) {
      logger.error('Error generating incident report PDF', error);
      throw error;
    }
  }

  /**
   * Generate custom report with tables
   */
  async generateCustomReport(options: {
    title: string;
    subtitle?: string;
    metadata?: Record<string, string>;
    tables?: Array<{
      title?: string;
      headers: string[];
      rows: any[][];
    }>;
  }): Promise<Buffer> {
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Title
      doc.setFontSize(20);
      doc.text(options.title, 105, yPosition, { align: 'center' });
      yPosition += 15;

      // Subtitle
      if (options.subtitle) {
        doc.setFontSize(12);
        doc.text(options.subtitle, 105, yPosition, { align: 'center' });
        yPosition += 10;
      }

      // Metadata
      if (options.metadata) {
        doc.setFontSize(10);
        for (const [key, value] of Object.entries(options.metadata)) {
          doc.text(`${key}: ${value}`, 20, yPosition);
          yPosition += 7;
        }
        yPosition += 5;
      }

      // Tables
      if (options.tables) {
        for (const table of options.tables) {
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
            headStyles: { fillColor: [41, 128, 185] }
          });

          yPosition = (doc as any).lastAutoTable.finalY + 15;
        }
      }

      // Footer
      doc.setFontSize(8);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
      doc.text('White Cross Healthcare Platform', 105, 285, { align: 'center' });

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      logger.info('Custom report PDF generated', { title: options.title });

      return pdfBuffer;
    } catch (error) {
      logger.error('Error generating custom report PDF', error);
      throw error;
    }
  }
}

// Singleton instance
let pdfService: PdfService | null = null;

/**
 * Get or create PDF service instance
 */
export function getPdfService(): PdfService {
  if (!pdfService) {
    pdfService = new PdfService();
  }
  return pdfService;
}

export default getPdfService;
