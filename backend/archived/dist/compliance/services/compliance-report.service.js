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
exports.ComplianceReportService = void 0;
const common_1 = require("@nestjs/common");
const compliance_report_repository_1 = require("../../database/repositories/impl/compliance-report.repository");
const models_1 = require("../../database/models");
const base_1 = require("../../common/base");
let ComplianceReportService = class ComplianceReportService extends base_1.BaseService {
    reportRepository;
    constructor(reportRepository) {
        super("ComplianceReportService");
        this.reportRepository = reportRepository;
    }
    async listReports(query) {
        const { page = 1, limit = 20, ...filters } = query;
        const allReports = await this.reportRepository.findAll();
        let filteredReports = allReports;
        if (filters.status) {
            filteredReports = filteredReports.filter((report) => report.status === filters.status);
        }
        if (filters.reportType) {
            filteredReports = filteredReports.filter((report) => report.reportType === filters.reportType);
        }
        if (filters.period) {
            filteredReports = filteredReports.filter((report) => report.period === filters.period);
        }
        const total = filteredReports.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedReports = filteredReports.slice(startIndex, endIndex);
        return {
            data: paginatedReports,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getReportById(id) {
        const report = await this.reportRepository.findById(id);
        if (!report) {
            throw new common_1.NotFoundException(`Compliance report with ID ${id} not found`);
        }
        return report;
    }
    async createReport(dto, createdById, context) {
        return this.reportRepository.create({
            ...dto,
            createdById,
            status: models_1.ComplianceStatus.PENDING,
            dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        });
    }
    async updateReport(id, dto, context) {
        await this.getReportById(id);
        const updateData = { ...dto };
        if (dto.status === models_1.ComplianceStatus.COMPLIANT && !updateData.submittedAt) {
            updateData.submittedAt = new Date();
        }
        if (dto.reviewedBy && !updateData.reviewedAt) {
            updateData.reviewedAt = new Date();
        }
        return this.reportRepository.update(id, updateData);
    }
    async deleteReport(id, context) {
        await this.getReportById(id);
        return this.reportRepository.delete(id);
    }
    async generateReport(dto, createdById, context) {
        return this.createReport({
            reportType: dto.reportType,
            title: `${dto.reportType} Compliance Report - ${dto.period}`,
            description: `Auto-generated compliance report for ${dto.period} period`,
            period: dto.period,
            dueDate: dto.startDate,
        }, createdById, context);
    }
};
exports.ComplianceReportService = ComplianceReportService;
exports.ComplianceReportService = ComplianceReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DatabaseComplianceReportRepository')),
    __metadata("design:paramtypes", [compliance_report_repository_1.ComplianceReportRepository])
], ComplianceReportService);
//# sourceMappingURL=compliance-report.service.js.map