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
exports.ImmunizationRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_repository_1 = require("../base/base.repository");
const audit_logger_interface_1 = require("../../interfaces/audit/audit-logger.interface");
const immunization_model_1 = require("../../models/immunization.model");
let ImmunizationRepository = class ImmunizationRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'Immunization');
    }
    async findByStudent(studentId) {
        try {
            const immunizations = await this.model.findAll({
                where: { studentId },
                order: [['administeredDate', 'DESC']],
            });
            return immunizations.map((i) => this.mapToEntity(i));
        }
        catch (error) {
            this.logger.error('Error finding immunizations by student:', error);
            throw new base_repository_1.RepositoryError('Failed to find immunizations by student', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findByVaccine(studentId, vaccineName) {
        try {
            const immunizations = await this.model.findAll({
                where: { studentId, vaccineName },
                order: [['dosageNumber', 'ASC']],
            });
            return immunizations.map((i) => this.mapToEntity(i));
        }
        catch (error) {
            this.logger.error('Error finding immunizations by vaccine:', error);
            throw new base_repository_1.RepositoryError('Failed to find immunizations by vaccine', 'FIND_BY_VACCINE_ERROR', 500, { studentId, vaccineName, error: error.message });
        }
    }
    async findUpcomingDue(daysAhead = 30) {
        try {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + daysAhead);
            const immunizations = await this.model.findAll({
                where: {
                    nextDueDate: {
                        [sequelize_2.Op.between]: [new Date(), futureDate],
                    },
                },
                order: [['nextDueDate', 'ASC']],
            });
            return immunizations.map((i) => this.mapToEntity(i));
        }
        catch (error) {
            this.logger.error('Error finding upcoming due immunizations:', error);
            throw new base_repository_1.RepositoryError('Failed to find upcoming due immunizations', 'FIND_UPCOMING_DUE_ERROR', 500, { error: error.message });
        }
    }
    async validateCreate(data) {
    }
    async validateUpdate(id, data) {
    }
    async invalidateCaches(immunization) {
        try {
            const immunizationData = immunization.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, immunizationData.id));
            await this.cacheManager.deletePattern(`white-cross:immunization:student:${immunizationData.studentId}:*`);
        }
        catch (error) {
            this.logger.warn('Error invalidating immunization caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, audit_logger_interface_1.sanitizeSensitiveData)({ ...data });
    }
};
exports.ImmunizationRepository = ImmunizationRepository;
exports.ImmunizationRepository = ImmunizationRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(immunization_model_1.Immunization)),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], ImmunizationRepository);
//# sourceMappingURL=immunization.repository.js.map