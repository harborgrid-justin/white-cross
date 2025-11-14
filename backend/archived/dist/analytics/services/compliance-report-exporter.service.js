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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceReportExporterService = void 0;
const common_1 = require("@nestjs/common");
const jsPDF = __importStar(require("jspdf"));
const jspdf_autotable_1 = __importDefault(require("jspdf-autotable"));
const report_format_enum_1 = require("../enums/report-format.enum");
const base_1 = require("../../common/base");
let ComplianceReportExporterService = class ComplianceReportExporterService extends base_1.BaseService {
    constructor() {
        super("ComplianceReportExporterService");
    }
    async exportReport(report, format) {
        try {
            let fileUrl;
            let fileSize;
            switch (format) {
                case report_format_enum_1.ReportFormat.PDF:
                    fileUrl = await this.exportToPDF(report);
                    fileSize = 1024 * 512;
                    break;
                case report_format_enum_1.ReportFormat.CSV:
                    fileUrl = await this.exportToCSV(report);
                    fileSize = 1024 * 128;
                    break;
                case report_format_enum_1.ReportFormat.EXCEL:
                    fileUrl = await this.exportToExcel(report);
                    fileSize = 1024 * 256;
                    break;
                case report_format_enum_1.ReportFormat.JSON:
                    fileUrl = await this.exportToJSON(report);
                    fileSize = 1024 * 64;
                    break;
                default:
                    fileUrl = `/reports/${report.id}.${format.toLowerCase()}`;
                    fileSize = 1024 * 256;
            }
            this.logInfo(`Report exported: ${report.id} to ${format} format`);
            return { fileUrl, fileSize };
        }
        catch (error) {
            this.logError(`Error exporting report ${report.id}`, error.stack);
            throw error;
        }
    }
    async exportToPDF(report) {
        try {
            const doc = new jsPDF.default();
            const pageWidth = doc.internal.pageSize.width;
            let yPos = 20;
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text(report.title, pageWidth / 2, yPos, { align: 'center' });
            yPos += 10;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Report ID: ${report.id}`, 15, yPos);
            yPos += 5;
            doc.text(`Generated: ${report.generatedDate.toLocaleDateString()}`, 15, yPos);
            yPos += 5;
            doc.text(`Period: ${report.periodStart.toLocaleDateString()} - ${report.periodEnd.toLocaleDateString()}`, 15, yPos);
            yPos += 10;
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Executive Summary', 15, yPos);
            yPos += 7;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            (0, jspdf_autotable_1.default)(doc, {
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
            yPos = doc.lastAutoTable.finalY + 10;
            if (report.findings.length > 0) {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('Findings', 15, yPos);
                yPos += 7;
                (0, jspdf_autotable_1.default)(doc, {
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
                yPos = doc.lastAutoTable.finalY + 10;
            }
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
            const pageCount = doc.getNumberOfPages();
            doc.setFontSize(8);
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.text(`Page ${i} of ${pageCount} | Generated by White Cross Health Platform`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
            }
            const fileUrl = `/reports/${report.id}.pdf`;
            this.logDebug(`PDF generated for report ${report.id}`);
            return fileUrl;
        }
        catch (error) {
            this.logError('Error generating PDF', error.stack);
            throw error;
        }
    }
    async exportToCSV(report) {
        try {
            const rows = [];
            rows.push(['Report Type', report.reportType]);
            rows.push(['Title', report.title]);
            rows.push(['Generated Date', report.generatedDate.toISOString()]);
            rows.push(['Period Start', report.periodStart.toISOString()]);
            rows.push(['Period End', report.periodEnd.toISOString()]);
            rows.push([]);
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
            if (report.recommendations.length > 0) {
                rows.push(['RECOMMENDATIONS']);
                report.recommendations.forEach((rec, idx) => {
                    rows.push([(idx + 1).toString(), rec]);
                });
            }
            const csvContent = rows
                .map((row) => row.map((cell) => this.escapeCSVCell(cell)).join(','))
                .join('\n');
            const fileUrl = `/reports/${report.id}.csv`;
            this.logDebug(`CSV generated for report ${report.id}`);
            return fileUrl;
        }
        catch (error) {
            this.logError('Error generating CSV', error.stack);
            throw error;
        }
    }
    async exportToExcel(report) {
        const csvUrl = await this.exportToCSV(report);
        return csvUrl.replace('.csv', '.xlsx');
    }
    async exportToJSON(report) {
        try {
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
            const fileUrl = `/reports/${report.id}.json`;
            this.logDebug(`JSON generated for report ${report.id}`);
            return fileUrl;
        }
        catch (error) {
            this.logError('Error generating JSON', error.stack);
            throw error;
        }
    }
    escapeCSVCell(cell) {
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
            return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
    }
};
exports.ComplianceReportExporterService = ComplianceReportExporterService;
exports.ComplianceReportExporterService = ComplianceReportExporterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ComplianceReportExporterService);
//# sourceMappingURL=compliance-report-exporter.service.js.map