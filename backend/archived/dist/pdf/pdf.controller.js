"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pdf_service_1 = require("./pdf.service");
const base_1 = require("../common/base");
const dto_1 = require("./dto");
let PdfController = class PdfController extends base_1.BaseController {
    pdfService;
    constructor(pdfService) {
        super();
        this.pdfService = pdfService;
    }
    async generateStudentHealthSummary(dto, res) {
        const pdfBuffer = await this.pdfService.generateStudentHealthSummary(dto);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=health-summary-${dto.id}.pdf`,
            'Content-Length': pdfBuffer.length,
        });
        res.status(common_1.HttpStatus.OK).send(pdfBuffer);
    }
    async generateMedicationLog(dto, res) {
        const pdfBuffer = await this.pdfService.generateMedicationLog(dto);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=medication-log-${dto.id}.pdf`,
            'Content-Length': pdfBuffer.length,
        });
        res.status(common_1.HttpStatus.OK).send(pdfBuffer);
    }
    async generateImmunizationReport(dto, res) {
        const pdfBuffer = await this.pdfService.generateImmunizationReport(dto);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=immunization-report-${Date.now()}.pdf`,
            'Content-Length': pdfBuffer.length,
        });
        res.status(common_1.HttpStatus.OK).send(pdfBuffer);
    }
    async generateIncidentReport(dto, res) {
        const pdfBuffer = await this.pdfService.generateIncidentReport(dto);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=incident-report-${dto.id}.pdf`,
            'Content-Length': pdfBuffer.length,
        });
        res.status(common_1.HttpStatus.OK).send(pdfBuffer);
    }
    async generateCustomReport(dto, res) {
        const pdfBuffer = await this.pdfService.generateCustomReport(dto);
        const sanitizedTitle = dto.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${sanitizedTitle}-${Date.now()}.pdf`,
            'Content-Length': pdfBuffer.length,
        });
        res.status(common_1.HttpStatus.OK).send(pdfBuffer);
    }
    async mergePdfs(dto, res) {
        const pdfBuffer = await this.pdfService.mergePdfs(dto.pdfBuffers);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=merged-${Date.now()}.pdf`,
            'Content-Length': pdfBuffer.length,
        });
        res.status(common_1.HttpStatus.OK).send(pdfBuffer);
    }
    async addWatermark(dto, res) {
        const pdfBuffer = await this.pdfService.addWatermark(dto);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=watermarked-${Date.now()}.pdf`,
            'Content-Length': pdfBuffer.length,
        });
        res.status(common_1.HttpStatus.OK).send(pdfBuffer);
    }
    async signPdf(dto, res) {
        const pdfBuffer = await this.pdfService.signPdf(dto.pdfBuffer, dto.signatureName);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=signed-${Date.now()}.pdf`,
            'Content-Length': pdfBuffer.length,
        });
        res.status(common_1.HttpStatus.OK).send(pdfBuffer);
    }
};
exports.PdfController = PdfController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Generate student health summary PDF", summary: 'Generate student health summary PDF' }),
    (0, common_1.Post)('student-health-summary'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'PDF generated successfully',
        type: Buffer,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GenerateStudentHealthSummaryDto, Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "generateStudentHealthSummary", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Generate medication administration log PDF", summary: 'Generate medication administration log PDF' }),
    (0, common_1.Post)('medication-log'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'PDF generated successfully',
        type: Buffer,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GenerateMedicationLogDto, Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "generateMedicationLog", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Generate immunization compliance report PDF", summary: 'Generate immunization compliance report PDF' }),
    (0, common_1.Post)('immunization-report'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'PDF generated successfully',
        type: Buffer,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GenerateImmunizationReportDto, Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "generateImmunizationReport", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Generate incident report PDF", summary: 'Generate incident report PDF' }),
    (0, common_1.Post)('incident-report'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'PDF generated successfully',
        type: Buffer,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GenerateIncidentReportDto, Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "generateIncidentReport", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Generate custom report PDF", summary: 'Generate custom report PDF' }),
    (0, common_1.Post)('custom-report'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'PDF generated successfully',
        type: Buffer,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PdfGenerateCustomReportDto, Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "generateCustomReport", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Merge multiple PDFs into one", summary: 'Merge multiple PDFs into one' }),
    (0, common_1.Post)('merge'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'PDFs merged successfully',
        type: Buffer,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.MergePdfsDto, Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "mergePdfs", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Add watermark to PDF", summary: 'Add watermark to PDF' }),
    (0, common_1.Post)('watermark'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Watermark added successfully',
        type: Buffer,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.WatermarkPdfDto, Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "addWatermark", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Add digital signature to PDF", summary: 'Add digital signature to PDF' }),
    (0, common_1.Post)('sign'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'PDF signed successfully',
        type: Buffer,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SignPdfDto, Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "signPdf", null);
exports.PdfController = PdfController = __decorate([
    (0, swagger_1.ApiTags)('PDF'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('pdf'),
    __metadata("design:paramtypes", [pdf_service_1.PdfService])
], PdfController);
//# sourceMappingURL=pdf.controller.js.map