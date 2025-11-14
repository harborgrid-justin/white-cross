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
var ComplianceReportPersistenceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceReportPersistenceService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const cache_manager_1 = require("@nestjs/cache-manager");
const models_1 = require("../../database/models");
const base_1 = require("../../common/base");
let ComplianceReportPersistenceService = ComplianceReportPersistenceService_1 = class ComplianceReportPersistenceService extends base_1.BaseService {
    analyticsReportModel;
    cacheManager;
    constructor(analyticsReportModel, cacheManager) {
        super({
            serviceName: 'ComplianceReportPersistenceService',
            logger: new common_1.Logger(ComplianceReportPersistenceService_1.name),
            enableAuditLogging: true,
        });
        this.analyticsReportModel = analyticsReportModel;
        this.cacheManager = cacheManager;
    }
    async saveReport(report) {
        try {
            const dbReport = await this.analyticsReportModel.create({
                id: report.id,
                reportType: report.reportType,
                title: report.title,
                description: report.description,
                summary: {
                    ...report.summary,
                    status: report.summary.status,
                },
                sections: report.sections,
                findings: report.findings,
                recommendations: report.recommendations,
                schoolId: report.schoolId,
                periodStart: report.periodStart,
                periodEnd: report.periodEnd,
                generatedDate: report.generatedDate,
                status: report.status,
                format: report.format,
                generatedBy: report.generatedBy,
            });
            this.logInfo(`Report saved to database: ${report.id}`);
            return dbReport;
        }
        catch (error) {
            this.logError('Error saving report to database', error.stack);
            throw error;
        }
    }
    async getReportById(reportId) {
        try {
            const cacheKey = `report:${reportId}`;
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logDebug(`Cache hit for report ${reportId}`);
                return cached;
            }
            const dbReport = await this.analyticsReportModel.findOne({
                where: { id: reportId },
            });
            if (!dbReport) {
                throw new common_1.NotFoundException(`Report with ID ${reportId} not found`);
            }
            const report = this.mapDbReportToCompliance(dbReport);
            await this.cacheManager.set(cacheKey, report, 300000);
            return report;
        }
        catch (error) {
            this.logError(`Error retrieving report ${reportId}`, error.stack);
            throw error;
        }
    }
    async getReports(filters) {
        try {
            const where = {};
            if (filters?.reportType) {
                where.reportType = filters.reportType;
            }
            if (filters?.schoolId) {
                where.schoolId = filters.schoolId;
            }
            if (filters?.startDate || filters?.endDate) {
                where.generatedDate = {};
                if (filters.startDate) {
                    where.generatedDate[sequelize_2.Op.gte] = filters.startDate;
                }
                if (filters.endDate) {
                    where.generatedDate[sequelize_2.Op.lte] = filters.endDate;
                }
            }
            if (filters?.status) {
                where.status = filters.status;
            }
            const dbReports = await this.analyticsReportModel.findAll({
                where,
                order: [['generatedDate', 'DESC']],
            });
            return dbReports.map((r) => this.mapDbReportToCompliance(r));
        }
        catch (error) {
            this.logError('Error retrieving reports', error.stack);
            throw error;
        }
    }
    async cacheReport(cacheKey, report, ttl = 600000) {
        try {
            await this.cacheManager.set(cacheKey, report, ttl);
            this.logDebug(`Report cached with key: ${cacheKey}`);
        }
        catch (error) {
            this.logError('Error caching report', error.stack);
        }
    }
    async getCachedReport(cacheKey) {
        try {
            return await this.cacheManager.get(cacheKey);
        }
        catch (error) {
            this.logError('Error retrieving cached report', error.stack);
            return null;
        }
    }
    async updateReportExport(reportId, fileUrl, fileSize) {
        try {
            const report = await this.getReportById(reportId);
            const updatedReport = { ...report, fileUrl, fileSize };
            await this.cacheManager.set(`report:${reportId}`, updatedReport, 300000);
            this.logDebug(`Report export info updated: ${reportId}`);
        }
        catch (error) {
            this.logError('Error updating report export info', error.stack);
        }
    }
    async updateReportDistribution(reportId, recipients) {
        try {
            const report = await this.getReportById(reportId);
            const updatedReport = {
                ...report,
                distributionList: recipients,
                sentAt: new Date(),
            };
            await this.cacheManager.set(`report:${reportId}`, updatedReport, 300000);
            this.logDebug(`Report distribution info updated: ${reportId}`);
        }
        catch (error) {
            this.logError('Error updating report distribution info', error.stack);
        }
    }
    mapDbReportToCompliance(dbReport) {
        return {
            id: dbReport.id,
            reportType: dbReport.reportType,
            title: dbReport.title,
            description: dbReport.description || '',
            periodStart: dbReport.periodStart,
            periodEnd: dbReport.periodEnd,
            generatedDate: dbReport.generatedDate,
            schoolId: dbReport.schoolId || '',
            summary: {
                ...dbReport.summary,
                status: dbReport.summary.status,
            },
            sections: dbReport.sections,
            findings: dbReport.findings,
            recommendations: dbReport.recommendations,
            status: dbReport.status,
            format: dbReport.format,
            generatedBy: dbReport.generatedBy || 'system',
            createdAt: dbReport.createdAt,
        };
    }
};
exports.ComplianceReportPersistenceService = ComplianceReportPersistenceService;
exports.ComplianceReportPersistenceService = ComplianceReportPersistenceService = ComplianceReportPersistenceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.AnalyticsReport)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, Object])
], ComplianceReportPersistenceService);
//# sourceMappingURL=compliance-report-persistence.service.js.map