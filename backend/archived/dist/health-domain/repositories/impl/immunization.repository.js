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
const base_repository_1 = require("../../../database/repositories/base/base.repository");
const audit_logger_interface_1 = require("../../../database/interfaces/audit/audit-logger.interface");
const models_1 = require("../../../database/models");
let ImmunizationRepository = class ImmunizationRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'Immunization');
    }
    async findByStudent(studentId, options) {
        try {
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, studentId, 'by-student');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.debug(`Cache hit for immunizations by student: ${studentId}`);
                return cached;
            }
            const immunizations = await this.model.findAll({
                where: { studentId },
                order: [['administeredDate', 'DESC']],
            });
            const entities = immunizations.map((i) => this.mapToEntity(i));
            await this.cacheManager.set(cacheKey, entities, 1800);
            return entities;
        }
        catch (error) {
            this.logger.error('Error finding immunizations by student:', error);
            throw new base_repository_1.RepositoryError('Failed to find immunizations by student', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findByVaccineType(vaccineType, options) {
        try {
            const immunizations = await this.model.findAll({
                where: { vaccineType },
                order: [['administeredDate', 'DESC']],
                limit: options?.limit || 100,
            });
            return immunizations.map((i) => this.mapToEntity(i));
        }
        catch (error) {
            this.logger.error('Error finding immunizations by vaccine type:', error);
            throw new base_repository_1.RepositoryError('Failed to find immunizations by vaccine type', 'FIND_BY_VACCINE_TYPE_ERROR', 500, { vaccineType, error: error.message });
        }
    }
    async findDueImmunizations(studentId, asOfDate = new Date()) {
        try {
            const immunizations = await this.model.findAll({
                where: {
                    studentId,
                    nextDueDate: {
                        [sequelize_2.Op.lte]: asOfDate,
                    },
                    isCompliant: false,
                },
                order: [['nextDueDate', 'ASC']],
            });
            return immunizations.map((i) => this.mapToEntity(i));
        }
        catch (error) {
            this.logger.error('Error finding due immunizations:', error);
            throw new base_repository_1.RepositoryError('Failed to find due immunizations', 'FIND_DUE_ERROR', 500, { studentId, asOfDate, error: error.message });
        }
    }
    async findByDateRange(startDate, endDate, options) {
        try {
            const immunizations = await this.model.findAll({
                where: {
                    administeredDate: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                },
                order: [['administeredDate', 'DESC']],
                limit: options?.limit || 500,
            });
            return immunizations.map((i) => this.mapToEntity(i));
        }
        catch (error) {
            this.logger.error('Error finding immunizations by date range:', error);
            throw new base_repository_1.RepositoryError('Failed to find immunizations by date range', 'FIND_BY_DATE_RANGE_ERROR', 500, { startDate, endDate, error: error.message });
        }
    }
    async checkComplianceStatus(studentId) {
        try {
            const requiredVaccines = [
                'DTaP',
                'Polio',
                'MMR',
                'Varicella',
                'Hepatitis B',
                'Meningococcal',
            ];
            const immunizations = await this.findByStudent(studentId);
            const receivedVaccines = new Set(immunizations.filter((i) => i.isCompliant).map((i) => i.vaccineType));
            const missingVaccines = requiredVaccines.filter((vaccine) => !receivedVaccines.has(vaccine));
            return {
                isCompliant: missingVaccines.length === 0,
                missingVaccines,
            };
        }
        catch (error) {
            this.logger.error('Error checking compliance status:', error);
            throw new base_repository_1.RepositoryError('Failed to check compliance status', 'COMPLIANCE_CHECK_ERROR', 500, { studentId, error: error.message });
        }
    }
    async getVaccinationHistory(studentId) {
        try {
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, studentId, 'history');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                return cached;
            }
            const immunizations = await this.model.findAll({
                where: { studentId },
                order: [
                    ['vaccineType', 'ASC'],
                    ['administeredDate', 'ASC'],
                ],
            });
            const entities = immunizations.map((i) => this.mapToEntity(i));
            await this.cacheManager.set(cacheKey, entities, 3600);
            return entities;
        }
        catch (error) {
            this.logger.error('Error getting vaccination history:', error);
            throw new base_repository_1.RepositoryError('Failed to get vaccination history', 'HISTORY_ERROR', 500, { studentId, error: error.message });
        }
    }
    async validateCreate(data) {
        if (!data.studentId) {
            throw new base_repository_1.RepositoryError('Student ID is required', 'VALIDATION_ERROR', 400, { field: 'studentId' });
        }
        if (!data.vaccineType || !data.vaccineName) {
            throw new base_repository_1.RepositoryError('Vaccine type and name are required', 'VALIDATION_ERROR', 400, { fields: ['vaccineType', 'vaccineName'] });
        }
        if (!data.administeredDate) {
            throw new base_repository_1.RepositoryError('Administered date is required', 'VALIDATION_ERROR', 400, { field: 'administeredDate' });
        }
        if (data.administeredDate > new Date()) {
            throw new base_repository_1.RepositoryError('Administered date cannot be in the future', 'VALIDATION_ERROR', 400, { administeredDate: data.administeredDate });
        }
        const existing = await this.model.findOne({
            where: {
                studentId: data.studentId,
                vaccineType: data.vaccineType,
                administeredDate: data.administeredDate,
            },
        });
        if (existing) {
            throw new base_repository_1.RepositoryError('Duplicate immunization record', 'DUPLICATE_IMMUNIZATION', 409, { studentId: data.studentId, vaccineType: data.vaccineType });
        }
    }
    async validateUpdate(id, data) {
        if (data.administeredDate && data.administeredDate > new Date()) {
            throw new base_repository_1.RepositoryError('Administered date cannot be in the future', 'VALIDATION_ERROR', 400, { administeredDate: data.administeredDate });
        }
    }
    async invalidateCaches(immunization) {
        try {
            const immunizationData = immunization.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, immunizationData.id));
            if (immunizationData.studentId) {
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, immunizationData.studentId, 'by-student'));
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, immunizationData.studentId, 'history'));
                await this.cacheManager.deletePattern(`white-cross:immunization:student:${immunizationData.studentId}:*`);
            }
            if (immunizationData.vaccineType) {
                await this.cacheManager.deletePattern(`white-cross:immunization:vaccine:${immunizationData.vaccineType}:*`);
            }
        }
        catch (error) {
            this.logger.warn('Error invalidating immunization caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, audit_logger_interface_1.sanitizeSensitiveData)({
            ...data,
        });
    }
};
exports.ImmunizationRepository = ImmunizationRepository;
exports.ImmunizationRepository = ImmunizationRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Immunization)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ImmunizationRepository);
//# sourceMappingURL=immunization.repository.js.map