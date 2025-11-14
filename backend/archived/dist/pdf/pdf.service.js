"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const jspdf_1 = __importDefault(require("jspdf"));
require("jspdf-autotable");
const pdf_lib_1 = require("pdf-lib");
const base_1 = require("../common/base");
const logger_service_1 = require("../common/logging/logger.service");
let PdfService = class PdfService extends base_1.BaseService {
    constructor(logger) {
        super({
            serviceName: 'PdfService',
            logger,
            enableAuditLogging: true,
        });
    }
    async generateStudentHealthSummary(data) {
        try {
            const doc = new jspdf_1.default();
            doc.setFontSize(20);
            doc.text('Student Health Summary', 105, 20, { align: 'center' });
            doc.setFontSize(12);
            doc.text(`Name: ${data.firstName} ${data.lastName}`, 20, 40);
            doc.text(`Date of Birth: ${new Date(data.dateOfBirth).toLocaleDateString()}`, 20, 50);
            doc.text(`Grade: ${data.grade || 'N/A'}`, 20, 60);
            doc.text(`Student ID: ${data.studentNumber || 'N/A'}`, 20, 70);
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
                yPosition = doc.lastAutoTable.finalY + 20;
            }
            else {
                doc.setFontSize(10);
                doc.text('No known allergies', 20, yPosition);
                yPosition += 20;
            }
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
                yPosition = doc.lastAutoTable.finalY + 20;
            }
            else {
                doc.setFontSize(10);
                doc.text('No current medications', 20, yPosition);
                yPosition += 20;
            }
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
            }
            else {
                doc.setFontSize(10);
                doc.text('No chronic conditions', 20, yPosition);
            }
            doc.setFontSize(8);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
            doc.text('White Cross Healthcare Platform', 105, 285, {
                align: 'center',
            });
            const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
            this.logInfo(`Student health summary PDF generated for ID: ${data.id}`);
            return pdfBuffer;
        }
        catch (error) {
            this.logError('Error generating student health summary PDF', error);
            throw new common_1.BadRequestException('Failed to generate student health summary PDF');
        }
    }
    async generateMedicationLog(data) {
        try {
            const doc = new jspdf_1.default();
            doc.setFontSize(20);
            doc.text('Medication Administration Log', 105, 20, { align: 'center' });
            doc.setFontSize(12);
            doc.text(`Medication: ${data.name}`, 20, 40);
            doc.text(`Student: ${data.studentName}`, 20, 50);
            doc.text(`Dosage: ${data.dosage}`, 20, 60);
            doc.text(`Route: ${data.route}`, 20, 70);
            doc.text(`Frequency: ${data.frequency}`, 20, 80);
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
            doc.setFontSize(8);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
            doc.text('White Cross Healthcare Platform', 105, 285, {
                align: 'center',
            });
            const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
            this.logInfo(`Medication log PDF generated for ID: ${data.id}`);
            return pdfBuffer;
        }
        catch (error) {
            this.logError('Error generating medication log PDF', error);
            throw new common_1.BadRequestException('Failed to generate medication log PDF');
        }
    }
    async generateImmunizationReport(data) {
        try {
            const doc = new jspdf_1.default();
            doc.setFontSize(20);
            doc.text('Immunization Compliance Report', 105, 20, {
                align: 'center',
            });
            doc.setFontSize(12);
            doc.text(`Organization: ${data.organizationName}`, 20, 40);
            doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 50);
            doc.text(`Total Students: ${data.totalStudents}`, 20, 60);
            doc.text(`Compliant: ${data.compliantStudents} (${data.complianceRate}%)`, 20, 70);
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
            doc.setFontSize(8);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
            doc.text('White Cross Healthcare Platform', 105, 285, {
                align: 'center',
            });
            const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
            this.logInfo('Immunization compliance report PDF generated');
            return pdfBuffer;
        }
        catch (error) {
            this.logError('Error generating immunization report PDF', error);
            throw new common_1.BadRequestException('Failed to generate immunization report PDF');
        }
    }
    async generateIncidentReport(data) {
        try {
            const doc = new jspdf_1.default();
            doc.setFontSize(20);
            doc.text('Incident Report', 105, 20, { align: 'center' });
            doc.setFontSize(12);
            doc.text(`Incident ID: ${data.id}`, 20, 40);
            doc.text(`Date/Time: ${new Date(data.incidentDateTime).toLocaleString()}`, 20, 50);
            doc.text(`Location: ${data.location}`, 20, 60);
            doc.text(`Severity: ${data.severity}`, 20, 70);
            doc.text(`Student: ${data.studentName}`, 20, 85);
            doc.text(`Grade: ${data.grade || 'N/A'}`, 20, 95);
            doc.setFontSize(14);
            doc.text('Description:', 20, 110);
            doc.setFontSize(10);
            const splitDescription = doc.splitTextToSize(data.description, 170);
            doc.text(splitDescription, 20, 120);
            const yPosition = 120 + splitDescription.length * 7 + 10;
            doc.setFontSize(14);
            doc.text('Actions Taken:', 20, yPosition);
            doc.setFontSize(10);
            const splitActions = doc.splitTextToSize(data.actionsTaken || 'None', 170);
            doc.text(splitActions, 20, yPosition + 10);
            doc.setFontSize(8);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
            doc.text('White Cross Healthcare Platform', 105, 285, {
                align: 'center',
            });
            const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
            this.logInfo(`Incident report PDF generated for ID: ${data.id}`);
            return pdfBuffer;
        }
        catch (error) {
            this.logError('Error generating incident report PDF', error);
            throw new common_1.BadRequestException('Failed to generate incident report PDF');
        }
    }
    async generateCustomReport(data) {
        try {
            const doc = new jspdf_1.default();
            let yPosition = 20;
            doc.setFontSize(20);
            doc.text(data.title, 105, yPosition, { align: 'center' });
            yPosition += 15;
            if (data.subtitle) {
                doc.setFontSize(12);
                doc.text(data.subtitle, 105, yPosition, { align: 'center' });
                yPosition += 10;
            }
            if (data.metadata) {
                doc.setFontSize(10);
                for (const [key, value] of Object.entries(data.metadata)) {
                    doc.text(`${key}: ${value}`, 20, yPosition);
                    yPosition += 7;
                }
                yPosition += 5;
            }
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
                    yPosition = doc.lastAutoTable.finalY + 15;
                }
            }
            doc.setFontSize(8);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
            doc.text('White Cross Healthcare Platform', 105, 285, {
                align: 'center',
            });
            const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
            this.logInfo(`Custom report PDF generated: ${data.title}`);
            return pdfBuffer;
        }
        catch (error) {
            this.logError('Error generating custom report PDF', error);
            throw new common_1.BadRequestException('Failed to generate custom report PDF');
        }
    }
    async mergePdfs(pdfBuffers) {
        try {
            const mergedPdf = await pdf_lib_1.PDFDocument.create();
            for (const base64Buffer of pdfBuffers) {
                const buffer = Buffer.from(base64Buffer, 'base64');
                const pdf = await pdf_lib_1.PDFDocument.load(buffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            const mergedBuffer = await mergedPdf.save();
            this.logInfo(`Merged ${pdfBuffers.length} PDFs`);
            return Buffer.from(mergedBuffer);
        }
        catch (error) {
            this.logError('Error merging PDFs', error);
            throw new common_1.BadRequestException('Failed to merge PDFs');
        }
    }
    async addWatermark(data) {
        try {
            const buffer = Buffer.from(data.pdfBuffer, 'base64');
            const pdfDoc = await pdf_lib_1.PDFDocument.load(buffer);
            const pages = pdfDoc.getPages();
            for (const page of pages) {
                const { width, height } = page.getSize();
                const degrees = await Promise.resolve().then(() => __importStar(require('pdf-lib'))).then((m) => m.degrees);
                page.drawText(data.watermarkText, {
                    x: data.x !== undefined ? data.x : width / 2 - 100,
                    y: data.y !== undefined ? data.y : height / 2,
                    size: data.size || 50,
                    color: (0, pdf_lib_1.rgb)(0.5, 0.5, 0.5),
                    opacity: data.opacity || 0.3,
                    rotate: degrees(data.rotate || 45),
                });
            }
            const watermarkedBuffer = await pdfDoc.save();
            this.logInfo('PDF watermark added');
            return Buffer.from(watermarkedBuffer);
        }
        catch (error) {
            this.logError('Error adding watermark to PDF', error);
            throw new common_1.BadRequestException('Failed to add watermark to PDF');
        }
    }
    async signPdf(pdfBuffer, signatureName) {
        try {
            const buffer = Buffer.from(pdfBuffer, 'base64');
            const pdfDoc = await pdf_lib_1.PDFDocument.load(buffer);
            pdfDoc.setProducer('White Cross Healthcare Platform');
            pdfDoc.setCreator(signatureName || 'System');
            const signedBuffer = await pdfDoc.save();
            this.logInfo('PDF signed');
            return Buffer.from(signedBuffer);
        }
        catch (error) {
            this.logError('Error signing PDF', error);
            throw new common_1.BadRequestException('Failed to sign PDF');
        }
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], PdfService);
//# sourceMappingURL=pdf.service.js.map