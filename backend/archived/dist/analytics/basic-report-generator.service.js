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
var BasicReportGeneratorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicReportGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const cache_manager_1 = require("@nestjs/cache-manager");
const analytics_report_types_1 = require("./types/analytics-report.types");
const base_report_generator_service_1 = require("./services/base-report-generator.service");
let BasicReportGeneratorService = BasicReportGeneratorService_1 = class BasicReportGeneratorService extends base_report_generator_service_1.BaseReportGeneratorService {
    constructor(eventEmitter, cacheManager) {
        super(eventEmitter, cacheManager, BasicReportGeneratorService_1.name);
    }
    async generateBasicReport(schoolId, reportType, period, options = {}) {
        return this.generateReport(schoolId, reportType, period, options, async () => {
            const reportData = await this.collectBasicData(schoolId, reportType, period);
            const reportContent = await this.generateBasicContent(reportData, reportType);
            return { data: reportData, content: reportContent };
        });
    }
    async exportReport(reportData, formats = ['JSON']) {
        return super.exportReport(reportData, formats);
    }
    async collectBasicData(schoolId, reportType, period) {
        switch (reportType) {
            case analytics_report_types_1.AnalyticsReportType.HEALTH_OVERVIEW:
                return {
                    schoolId,
                    period,
                    metrics: {
                        totalStudents: 500,
                        activeHealthRecords: 1250,
                        medicationAdherence: 87.5,
                        immunizationCompliance: 92.3,
                    },
                };
            case analytics_report_types_1.AnalyticsReportType.MEDICATION_SUMMARY:
                return {
                    schoolId,
                    period,
                    medications: [
                        { name: 'Ibuprofen', count: 45, students: 32 },
                        { name: 'Acetaminophen', count: 38, students: 28 },
                    ],
                };
            default:
                return { schoolId, period, data: 'Basic data for ' + reportType };
        }
    }
    async generateBasicContent(data, reportType) {
        const baseContent = {
            title: `${reportType.replace('_', ' ')} Report`,
            type: reportType,
            generatedAt: new Date(),
            data,
        };
        switch (reportType) {
            case analytics_report_types_1.AnalyticsReportType.HEALTH_OVERVIEW:
                return {
                    ...baseContent,
                    summary: {
                        totalStudents: data.metrics.totalStudents,
                        healthRecordCoverage: (data.metrics.activeHealthRecords / data.metrics.totalStudents * 100).toFixed(1) + '%',
                        medicationAdherence: data.metrics.medicationAdherence + '%',
                        immunizationCompliance: data.metrics.immunizationCompliance + '%',
                    },
                    insights: this.generateBasicInsights(data),
                };
            case analytics_report_types_1.AnalyticsReportType.MEDICATION_SUMMARY:
                return {
                    ...baseContent,
                    summary: {
                        totalMedications: data.medications.reduce((sum, med) => sum + med.count, 0),
                        uniqueMedications: data.medications.length,
                        totalStudents: data.medications.reduce((sum, med) => sum + med.students, 0),
                    },
                    topMedications: data.medications,
                };
            default:
                return baseContent;
        }
    }
    generateBasicInsights(data) {
        const insights = [];
        if (data.metrics?.medicationAdherence > 85) {
            insights.push('Good medication adherence rates');
        }
        if (data.metrics?.immunizationCompliance > 90) {
            insights.push('Strong immunization compliance');
        }
        if (data.metrics && data.metrics.activeHealthRecords / data.metrics.totalStudents > 2) {
            insights.push('High health record activity per student');
        }
        return insights;
    }
};
exports.BasicReportGeneratorService = BasicReportGeneratorService;
exports.BasicReportGeneratorService = BasicReportGeneratorService = BasicReportGeneratorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2, Object])
], BasicReportGeneratorService);
//# sourceMappingURL=basic-report-generator.service.js.map