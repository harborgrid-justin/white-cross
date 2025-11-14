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
exports.IncidentReportRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_repository_1 = require("../base/base.repository");
const interfaces_1 = require("../../interfaces");
const incident_report_model_1 = require("../../models/incident-report.model");
let IncidentReportRepository = class IncidentReportRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'IncidentReport');
    }
    async findByStudent(studentId, options) {
        try {
            const incidents = await this.model.findAll({
                where: { studentId },
                order: [['occurredAt', 'DESC']],
                ...options,
            });
            return incidents.map((incident) => this.mapToEntity(incident));
        }
        catch (error) {
            this.logger.error('Error finding incidents by student:', error);
            throw new base_repository_1.RepositoryError('Failed to find incidents by student', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findBySeverity(severity, options) {
        try {
            const incidents = await this.model.findAll({
                where: { severity },
                order: [['occurredAt', 'DESC']],
                ...options,
            });
            return incidents.map((incident) => this.mapToEntity(incident));
        }
        catch (error) {
            this.logger.error('Error finding incidents by severity:', error);
            throw new base_repository_1.RepositoryError('Failed to find incidents by severity', 'FIND_BY_SEVERITY_ERROR', 500, { severity, error: error.message });
        }
    }
    async findByDateRange(startDate, endDate, options) {
        try {
            const incidents = await this.model.findAll({
                where: {
                    occurredAt: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                },
                order: [['occurredAt', 'DESC']],
                ...options,
            });
            return incidents.map((incident) => this.mapToEntity(incident));
        }
        catch (error) {
            this.logger.error('Error finding incidents by date range:', error);
            throw new base_repository_1.RepositoryError('Failed to find incidents by date range', 'FIND_BY_DATE_RANGE_ERROR', 500, { startDate, endDate, error: error.message });
        }
    }
    async validateCreate(data) { }
    async validateUpdate(id, data) { }
    async invalidateCaches(entity) {
        try {
            const entityData = entity.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, entityData.id));
            await this.cacheManager.deletePattern(`white-cross:${this.entityName.toLowerCase()}:*`);
        }
        catch (error) {
            this.logger.warn(`Error invalidating ${this.entityName} caches:`, error);
        }
    }
    sanitizeForAudit(data) {
        return (0, interfaces_1.sanitizeSensitiveData)({ ...data });
    }
};
exports.IncidentReportRepository = IncidentReportRepository;
exports.IncidentReportRepository = IncidentReportRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(incident_report_model_1.IncidentReport)),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], IncidentReportRepository);
//# sourceMappingURL=incident-report.repository.js.map