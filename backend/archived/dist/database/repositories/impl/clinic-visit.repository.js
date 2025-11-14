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
exports.ClinicVisitRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const base_repository_1 = require("../base/base.repository");
const audit_logger_interface_1 = require("../../interfaces/audit/audit-logger.interface");
let ClinicVisitRepository = class ClinicVisitRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'ClinicVisit');
    }
    async findByStudent(studentId) {
        try {
            const visits = await this.model.findAll({
                where: { studentId },
                order: [['visitDate', 'DESC']],
            });
            return visits.map((v) => this.mapToEntity(v));
        }
        catch (error) {
            this.logger.error('Error finding clinic visits by student:', error);
            throw new base_repository_1.RepositoryError('Failed to find clinic visits by student', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findByProvider(providerId) {
        try {
            const visits = await this.model.findAll({
                where: { providerId },
                order: [['visitDate', 'DESC']],
            });
            return visits.map((v) => this.mapToEntity(v));
        }
        catch (error) {
            this.logger.error('Error finding clinic visits by provider:', error);
            throw new base_repository_1.RepositoryError('Failed to find clinic visits by provider', 'FIND_BY_PROVIDER_ERROR', 500, { providerId, error: error.message });
        }
    }
    async findRequiringFollowUp() {
        try {
            const visits = await this.model.findAll({
                where: { followUpRequired: true },
                order: [['followUpDate', 'ASC']],
            });
            return visits.map((v) => this.mapToEntity(v));
        }
        catch (error) {
            this.logger.error('Error finding visits requiring follow-up:', error);
            throw new base_repository_1.RepositoryError('Failed to find visits requiring follow-up', 'FIND_FOLLOW_UP_REQUIRED_ERROR', 500, { error: error.message });
        }
    }
    async validateCreate(data) {
    }
    async validateUpdate(id, data) {
    }
    async invalidateCaches(visit) {
        try {
            const visitData = visit.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, visitData.id));
            await this.cacheManager.deletePattern(`white-cross:clinic-visit:student:${visitData.studentId}:*`);
        }
        catch (error) {
            this.logger.warn('Error invalidating clinic visit caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, audit_logger_interface_1.sanitizeSensitiveData)({
            ...data,
            diagnosis: '[PHI]',
            treatment: '[PHI]',
            notes: '[PHI]',
        });
    }
};
exports.ClinicVisitRepository = ClinicVisitRepository;
exports.ClinicVisitRepository = ClinicVisitRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)('')),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], ClinicVisitRepository);
//# sourceMappingURL=clinic-visit.repository.js.map