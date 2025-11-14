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
exports.MaterializedViewService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const schedule_1 = require("@nestjs/schedule");
const base_1 = require("../../common/base");
let MaterializedViewService = class MaterializedViewService extends base_1.BaseService {
    sequelize;
    constructor(sequelize) {
        super("MaterializedViewService");
        this.sequelize = sequelize;
    }
    async refreshStudentHealthSummary() {
        const startTime = Date.now();
        try {
            this.logInfo('Refreshing mv_student_health_summary...');
            await this.sequelize.query('REFRESH MATERIALIZED VIEW CONCURRENTLY "mv_student_health_summary";');
            const duration = Date.now() - startTime;
            this.logInfo(`mv_student_health_summary refreshed successfully in ${duration}ms`);
        }
        catch (error) {
            this.logError(`Failed to refresh mv_student_health_summary: ${error.message}`, error.stack);
            throw error;
        }
    }
    async refreshComplianceStatus() {
        const startTime = Date.now();
        try {
            this.logInfo('Refreshing mv_compliance_status...');
            await this.sequelize.query('REFRESH MATERIALIZED VIEW CONCURRENTLY "mv_compliance_status";');
            const duration = Date.now() - startTime;
            this.logInfo(`mv_compliance_status refreshed successfully in ${duration}ms`);
        }
        catch (error) {
            this.logError(`Failed to refresh mv_compliance_status: ${error.message}`, error.stack);
            throw error;
        }
    }
    async refreshMedicationSchedule() {
        const startTime = Date.now();
        try {
            this.logInfo('Refreshing mv_medication_schedule...');
            await this.sequelize.query('REFRESH MATERIALIZED VIEW CONCURRENTLY "mv_medication_schedule";');
            const duration = Date.now() - startTime;
            this.logInfo(`mv_medication_schedule refreshed successfully in ${duration}ms`);
        }
        catch (error) {
            this.logError(`Failed to refresh mv_medication_schedule: ${error.message}`, error.stack);
            throw error;
        }
    }
    async refreshAllergySummary() {
        const startTime = Date.now();
        try {
            this.logInfo('Refreshing mv_allergy_summary...');
            await this.sequelize.query('REFRESH MATERIALIZED VIEW CONCURRENTLY "mv_allergy_summary";');
            const duration = Date.now() - startTime;
            this.logInfo(`mv_allergy_summary refreshed successfully in ${duration}ms`);
        }
        catch (error) {
            this.logError(`Failed to refresh mv_allergy_summary: ${error.message}`, error.stack);
            throw error;
        }
    }
    async refreshAppointmentStatistics() {
        const startTime = Date.now();
        try {
            this.logInfo('Refreshing mv_appointment_statistics...');
            await this.sequelize.query('REFRESH MATERIALIZED VIEW CONCURRENTLY "mv_appointment_statistics";');
            const duration = Date.now() - startTime;
            this.logInfo(`mv_appointment_statistics refreshed successfully in ${duration}ms`);
        }
        catch (error) {
            this.logError(`Failed to refresh mv_appointment_statistics: ${error.message}`, error.stack);
            throw error;
        }
    }
    async refreshAll() {
        const startTime = Date.now();
        const results = {
            success: [],
            failed: [],
            totalDuration: 0,
        };
        this.logInfo('Starting refresh of all materialized views...');
        const refreshOperations = [
            { name: 'student_health_summary', fn: () => this.refreshStudentHealthSummary() },
            { name: 'compliance_status', fn: () => this.refreshComplianceStatus() },
            { name: 'medication_schedule', fn: () => this.refreshMedicationSchedule() },
            { name: 'allergy_summary', fn: () => this.refreshAllergySummary() },
            { name: 'appointment_statistics', fn: () => this.refreshAppointmentStatistics() },
        ];
        for (const operation of refreshOperations) {
            try {
                await operation.fn();
                results.success.push(operation.name);
            }
            catch (error) {
                this.logError(`Failed to refresh ${operation.name}: ${error.message}`);
                results.failed.push(operation.name);
            }
        }
        results.totalDuration = Date.now() - startTime;
        this.logInfo(`Materialized view refresh complete: ${results.success.length} succeeded, ${results.failed.length} failed, ${results.totalDuration}ms total`);
        return results;
    }
    async getLastRefreshTime(viewName) {
        try {
            const result = await this.sequelize.query(`
        SELECT pg_stat_get_last_vacuum_time(oid) AS last_refresh
        FROM pg_class
        WHERE relname = :viewName;
        `, {
                replacements: { viewName },
                type: sequelize_typescript_1.Sequelize.QueryTypes.SELECT,
            });
            return result[0]?.last_refresh || null;
        }
        catch (error) {
            this.logError(`Failed to get last refresh time for ${viewName}: ${error.message}`);
            return null;
        }
    }
    async getViewStatistics(viewName) {
        try {
            const result = await this.sequelize.query(`
        SELECT
          schemaname || '.' || matviewname AS view_name,
          pg_total_relation_size(schemaname || '.' || matviewname) AS size_bytes,
          pg_size_pretty(pg_total_relation_size(schemaname || '.' || matviewname)) AS size_pretty,
          (SELECT n_live_tup FROM pg_stat_user_tables WHERE schemaname || '.' || relname = :viewName) AS row_count
        FROM pg_matviews
        WHERE matviewname = :viewName;
        `, {
                replacements: { viewName },
                type: sequelize_typescript_1.Sequelize.QueryTypes.SELECT,
            });
            if (!result[0]) {
                return null;
            }
            const lastRefresh = await this.getLastRefreshTime(viewName);
            return {
                viewName: result[0].view_name,
                sizeBytes: result[0].size_bytes,
                sizePretty: result[0].size_pretty,
                rowCount: result[0].row_count,
                lastRefresh,
            };
        }
        catch (error) {
            this.logError(`Failed to get statistics for ${viewName}: ${error.message}`);
            return null;
        }
    }
    async getAllViewStatistics() {
        const views = [
            'mv_student_health_summary',
            'mv_compliance_status',
            'mv_medication_schedule',
            'mv_allergy_summary',
            'mv_appointment_statistics',
        ];
        const statistics = await Promise.all(views.map(view => this.getViewStatistics(view)));
        return statistics.filter(stat => stat !== null);
    }
    async scheduledHourlyRefresh() {
        this.logInfo('Starting scheduled hourly refresh...');
        try {
            await Promise.all([
                this.refreshStudentHealthSummary(),
                this.refreshMedicationSchedule(),
                this.refreshAllergySummary(),
            ]);
            this.logInfo('Scheduled hourly refresh completed successfully');
        }
        catch (error) {
            this.logError(`Scheduled hourly refresh failed: ${error.message}`, error.stack);
        }
    }
    async scheduledComplianceRefresh() {
        this.logInfo('Starting scheduled compliance refresh...');
        try {
            await this.refreshComplianceStatus();
            this.logInfo('Scheduled compliance refresh completed successfully');
        }
        catch (error) {
            this.logError(`Scheduled compliance refresh failed: ${error.message}`, error.stack);
        }
    }
    async scheduledDailyRefresh() {
        this.logInfo('Starting scheduled daily refresh...');
        try {
            await this.refreshAppointmentStatistics();
            this.logInfo('Scheduled daily refresh completed successfully');
        }
        catch (error) {
            this.logError(`Scheduled daily refresh failed: ${error.message}`, error.stack);
        }
    }
    async healthCheck() {
        const views = [
            'mv_student_health_summary',
            'mv_compliance_status',
            'mv_medication_schedule',
            'mv_allergy_summary',
            'mv_appointment_statistics',
        ];
        const checks = await Promise.all(views.map(async (viewName) => {
            try {
                const result = await this.sequelize.query(`SELECT COUNT(*) as count FROM "${viewName}";`, { type: sequelize_typescript_1.Sequelize.QueryTypes.SELECT });
                return {
                    name: viewName,
                    exists: true,
                    hasData: result[0].count > 0,
                };
            }
            catch (error) {
                return {
                    name: viewName,
                    exists: false,
                    hasData: false,
                };
            }
        }));
        const healthy = checks.every(check => check.exists);
        return { healthy, views: checks };
    }
};
exports.MaterializedViewService = MaterializedViewService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaterializedViewService.prototype, "scheduledHourlyRefresh", null);
__decorate([
    (0, schedule_1.Cron)('0 */6 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaterializedViewService.prototype, "scheduledComplianceRefresh", null);
__decorate([
    (0, schedule_1.Cron)('0 2 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaterializedViewService.prototype, "scheduledDailyRefresh", null);
exports.MaterializedViewService = MaterializedViewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize])
], MaterializedViewService);
//# sourceMappingURL=materialized-view.service.js.map