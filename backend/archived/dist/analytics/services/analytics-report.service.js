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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsReportService = void 0;
const common_1 = require("@nestjs/common");
const compliance_report_generator_service_1 = require("./compliance-report-generator.service");
const health_trend_analytics_service_1 = require("./health-trend-analytics.service");
const time_period_enum_1 = require("../enums/time-period.enum");
const base_1 = require("../../common/base");
let AnalyticsReportService = class AnalyticsReportService extends base_1.BaseService {
    healthTrendService;
    reportGeneratorService;
    constructor(healthTrendService, reportGeneratorService) {
        super("AnalyticsReportService");
        this.healthTrendService = healthTrendService;
        this.reportGeneratorService = reportGeneratorService;
    }
    async generateCustomReport(dto, userId) {
        try {
            const start = dto.startDate;
            const end = dto.endDate;
            const format = dto.format || 'JSON';
            const schoolId = dto.filters?.schoolId || 'default-school';
            let report;
            switch (dto.reportType) {
                case 'IMMUNIZATION_REPORT':
                    report = await this.reportGeneratorService.generateImmunizationReport({
                        schoolId,
                        periodStart: start,
                        periodEnd: end,
                        format: format,
                        generatedBy: userId,
                    });
                    break;
                case 'COMPLIANCE_STATUS':
                    report =
                        await this.reportGeneratorService.generateControlledSubstanceReport({
                            schoolId,
                            periodStart: start,
                            periodEnd: end,
                            format: format,
                            generatedBy: userId,
                        });
                    break;
                case 'STUDENT_HEALTH_SUMMARY':
                    report = await this.reportGeneratorService.generateScreeningReport({
                        schoolId,
                        periodStart: start,
                        periodEnd: end,
                        format: format,
                        generatedBy: userId,
                    });
                    break;
                default:
                    const summary = await this.healthTrendService.getPopulationSummary(schoolId, time_period_enum_1.TimePeriod.CUSTOM, { start, end });
                    report = {
                        id: `RPT-${Date.now()}`,
                        reportName: dto.reportName,
                        reportType: dto.reportType,
                        generatedDate: new Date(),
                        period: { start, end },
                        data: summary,
                        format,
                        status: 'COMPLETED',
                    };
            }
            return {
                report: {
                    id: report.id,
                    name: dto.reportName,
                    type: dto.reportType,
                    format,
                    generatedAt: new Date(),
                    status: 'COMPLETED',
                    downloadUrl: report.fileUrl || `/api/v1/analytics/reports/${report.id}`,
                    recipients: dto.recipients,
                    schedule: dto.schedule,
                },
            };
        }
        catch (error) {
            this.logError('Error generating custom report', error);
            throw error;
        }
    }
    async getGeneratedReport(reportId, query) {
        try {
            const report = await this.reportGeneratorService.getReport(reportId);
            if (!report) {
                throw new common_1.NotFoundException('Report not found');
            }
            if (!query.includeData) {
                return {
                    report: {
                        id: report.id,
                        title: report.title,
                        reportType: report.reportType,
                        generatedDate: report.generatedDate,
                        status: report.status,
                        format: report.format,
                        fileUrl: report.fileUrl,
                    },
                };
            }
            return { report };
        }
        catch (error) {
            this.logError('Error getting generated report', error);
            throw error;
        }
    }
};
exports.AnalyticsReportService = AnalyticsReportService;
exports.AnalyticsReportService = AnalyticsReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [health_trend_analytics_service_1.HealthTrendAnalyticsService,
        compliance_report_generator_service_1.ComplianceReportGeneratorService])
], AnalyticsReportService);
//# sourceMappingURL=analytics-report.service.js.map