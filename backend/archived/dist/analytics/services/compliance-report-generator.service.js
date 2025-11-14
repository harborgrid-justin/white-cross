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
exports.ComplianceReportGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const compliance_data_collector_service_1 = require("./compliance-data-collector.service");
const compliance_metrics_calculator_service_1 = require("./compliance-metrics-calculator.service");
const compliance_report_builder_service_1 = require("./compliance-report-builder.service");
const compliance_report_exporter_service_1 = require("./compliance-report-exporter.service");
const compliance_report_persistence_service_1 = require("./compliance-report-persistence.service");
const base_1 = require("../../common/base");
let ComplianceReportGeneratorService = class ComplianceReportGeneratorService extends base_1.BaseService {
    dataCollector;
    metricsCalculator;
    reportBuilder;
    reportExporter;
    reportPersistence;
    scheduledConfigs = [];
    constructor(dataCollector, metricsCalculator, reportBuilder, reportExporter, reportPersistence) {
        super("ComplianceReportGeneratorService");
        this.dataCollector = dataCollector;
        this.metricsCalculator = metricsCalculator;
        this.reportBuilder = reportBuilder;
        this.reportExporter = reportExporter;
        this.reportPersistence = reportPersistence;
    }
    async generateImmunizationReport(params) {
        try {
            this.logInfo(`Generating immunization compliance report for school ${params.schoolId}`);
            const cacheKey = `immunization-report:${params.schoolId}:${params.periodStart}-${params.periodEnd}`;
            const cached = await this.reportPersistence.getCachedReport(cacheKey);
            if (cached && cached.format === params.format) {
                this.logDebug('Cache hit for immunization report');
                return cached;
            }
            const data = await this.dataCollector.getImmunizationData(params.schoolId, params.periodStart, params.periodEnd);
            const metrics = this.metricsCalculator.calculateImmunizationMetrics(data.totalStudents);
            const report = this.reportBuilder.buildImmunizationReport({
                ...params,
                metrics,
            });
            await this.reportPersistence.saveReport(report);
            await this.reportPersistence.cacheReport(cacheKey, report, 600000);
            this.logInfo(`Immunization compliance report generated: ${report.id}`);
            return report;
        }
        catch (error) {
            this.logError('Error generating immunization report', error.stack);
            throw error;
        }
    }
    async generateControlledSubstanceReport(params) {
        try {
            this.logInfo(`Generating controlled substance report for school ${params.schoolId}`);
            const data = await this.dataCollector.getControlledSubstanceData(params.schoolId, params.periodStart, params.periodEnd);
            const metrics = this.metricsCalculator.calculateControlledSubstanceMetrics(data.totalRecords);
            const report = this.reportBuilder.buildControlledSubstanceReport({
                ...params,
                metrics,
            });
            await this.reportPersistence.saveReport(report);
            this.logInfo(`Controlled substance report generated: ${report.id}`);
            return report;
        }
        catch (error) {
            this.logError('Error generating controlled substance report', error.stack);
            throw error;
        }
    }
    async generateHIPAAAuditReport(params) {
        try {
            this.logInfo(`Generating HIPAA audit report for school ${params.schoolId}`);
            const metrics = this.metricsCalculator.calculateHIPAAMetrics();
            const report = this.reportBuilder.buildHIPAAAuditReport({
                ...params,
                metrics,
            });
            await this.reportPersistence.saveReport(report);
            this.logInfo(`HIPAA audit report generated: ${report.id}`);
            return report;
        }
        catch (error) {
            this.logError('Error generating HIPAA audit report', error.stack);
            throw error;
        }
    }
    async generateScreeningReport(params) {
        try {
            this.logInfo(`Generating health screening report for school ${params.schoolId}`);
            const data = await this.dataCollector.getScreeningData(params.schoolId, params.periodStart, params.periodEnd);
            const metrics = this.metricsCalculator.calculateScreeningMetrics(data.totalStudents);
            const report = this.reportBuilder.buildScreeningReport({
                ...params,
                metrics,
            });
            await this.reportPersistence.saveReport(report);
            this.logInfo(`Health screening report generated: ${report.id}`);
            return report;
        }
        catch (error) {
            this.logError('Error generating health screening report', error.stack);
            throw error;
        }
    }
    async getReport(reportId) {
        return this.reportPersistence.getReportById(reportId);
    }
    async getReports(filters) {
        return this.reportPersistence.getReports(filters);
    }
    async scheduleRecurringReport(config) {
        try {
            const scheduledConfig = {
                ...config,
                id: this.generateConfigId(),
                nextScheduled: this.calculateNextScheduled(config.frequency),
            };
            this.scheduledConfigs.push(scheduledConfig);
            this.logInfo(`Recurring report scheduled: ${scheduledConfig.id} - ${config.reportType} ${config.frequency}`);
            return scheduledConfig;
        }
        catch (error) {
            this.logError('Error scheduling recurring report', error.stack);
            throw error;
        }
    }
    async getScheduledReports() {
        return this.scheduledConfigs.filter((c) => c.isActive);
    }
    async exportReport(reportId, format) {
        try {
            const report = await this.reportPersistence.getReportById(reportId);
            const { fileUrl, fileSize } = await this.reportExporter.exportReport(report, format);
            await this.reportPersistence.updateReportExport(reportId, fileUrl, fileSize);
            this.logInfo(`Report exported: ${reportId} to ${format} format`);
            return fileUrl;
        }
        catch (error) {
            this.logError(`Error exporting report ${reportId}`, error.stack);
            throw error;
        }
    }
    async distributeReport(reportId, recipients) {
        try {
            const report = await this.reportPersistence.getReportById(reportId);
            const emailPayload = {
                to: recipients,
                subject: `${report.title} - ${report.periodStart.toLocaleDateString()} to ${report.periodEnd.toLocaleDateString()}`,
                body: this.generateEmailBody(report),
                attachments: [
                    {
                        filename: `${report.reportType}_${report.id}.pdf`,
                        url: report.fileUrl || `/reports/${report.id}.pdf`,
                    },
                ],
                priority: report.findings.some((f) => f.severity === 'CRITICAL' || f.severity === 'HIGH')
                    ? 'high'
                    : 'normal',
            };
            await this.reportPersistence.updateReportDistribution(reportId, recipients);
            this.logInfo(`Report distributed: ${reportId} to ${recipients.length} recipients`);
        }
        catch (error) {
            this.logError(`Error distributing report ${reportId}`, error.stack);
            throw error;
        }
    }
    generateConfigId() {
        return `CFG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
    calculateNextScheduled(frequency) {
        const now = new Date();
        const next = new Date(now);
        switch (frequency) {
            case 'DAILY':
                next.setDate(now.getDate() + 1);
                break;
            case 'WEEKLY':
                next.setDate(now.getDate() + 7);
                break;
            case 'MONTHLY':
                next.setMonth(now.getMonth() + 1);
                break;
            case 'QUARTERLY':
                next.setMonth(now.getMonth() + 3);
                break;
            case 'ANNUALLY':
                next.setFullYear(now.getFullYear() + 1);
                break;
        }
        return next;
    }
    generateEmailBody(report) {
        const criticalFindings = report.findings.filter((f) => f.severity === 'CRITICAL' || f.severity === 'HIGH');
        let body = `<h2>${report.title}</h2>`;
        body += `<p><strong>Report Period:</strong> ${report.periodStart.toLocaleDateString()} - ${report.periodEnd.toLocaleDateString()}</p>`;
        body += `<p><strong>Generated:</strong> ${report.generatedDate.toLocaleString()}</p>`;
        body += `<hr>`;
        body += `<h3>Summary</h3>`;
        body += `<ul>`;
        body += `<li><strong>Compliance Rate:</strong> ${report.summary.complianceRate}%</li>`;
        body += `<li><strong>Status:</strong> ${report.summary.status}</li>`;
        body += `<li><strong>Total Records:</strong> ${report.summary.totalRecords}</li>`;
        body += `<li><strong>Compliant:</strong> ${report.summary.compliantRecords}</li>`;
        body += `<li><strong>Non-Compliant:</strong> ${report.summary.nonCompliantRecords}</li>`;
        body += `</ul>`;
        if (criticalFindings.length > 0) {
            body += `<h3 style="color: red;">Critical Findings (${criticalFindings.length})</h3>`;
            body += `<ul>`;
            criticalFindings.forEach((f) => {
                body += `<li><strong>${f.category}:</strong> ${f.issue}</li>`;
            });
            body += `</ul>`;
        }
        body += `<p>Please review the full report attached to this email.</p>`;
        body += `<p><em>This is an automated email from White Cross Health Platform.</em></p>`;
        return body;
    }
};
exports.ComplianceReportGeneratorService = ComplianceReportGeneratorService;
exports.ComplianceReportGeneratorService = ComplianceReportGeneratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [compliance_data_collector_service_1.ComplianceDataCollectorService,
        compliance_metrics_calculator_service_1.ComplianceMetricsCalculatorService,
        compliance_report_builder_service_1.ComplianceReportBuilderService,
        compliance_report_exporter_service_1.ComplianceReportExporterService,
        compliance_report_persistence_service_1.ComplianceReportPersistenceService])
], ComplianceReportGeneratorService);
//# sourceMappingURL=compliance-report-generator.service.js.map