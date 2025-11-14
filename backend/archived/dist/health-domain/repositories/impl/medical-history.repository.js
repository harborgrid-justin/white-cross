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
exports.MedicalHistoryRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_repository_1 = require("../../../database/repositories/base/base.repository");
const audit_logger_interface_1 = require("../../../database/interfaces/audit/audit-logger.interface");
const models_1 = require("../../../database/models");
let MedicalHistoryRepository = class MedicalHistoryRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'MedicalHistory');
    }
    async findByStudent(studentId, options) {
        try {
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, studentId, 'by-student');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.debug(`Cache hit for medical history by student: ${studentId}`);
                return cached;
            }
            const records = await this.model.findAll({
                where: { studentId },
                order: [
                    ['isCritical', 'DESC'],
                    ['isActive', 'DESC'],
                    ['diagnosisDate', 'DESC'],
                ],
            });
            const entities = records.map((r) => this.mapToEntity(r));
            await this.cacheManager.set(cacheKey, entities, 1800);
            return entities;
        }
        catch (error) {
            this.logger.error('Error finding medical history by student:', error);
            throw new base_repository_1.RepositoryError('Failed to find medical history by student', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findByCondition(condition, options) {
        try {
            const records = await this.model.findAll({
                where: {
                    condition: {
                        [sequelize_2.Op.iLike]: `%${condition}%`,
                    },
                },
                order: [['diagnosisDate', 'DESC']],
                limit: options?.limit || 100,
            });
            return records.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            this.logger.error('Error finding medical history by condition:', error);
            throw new base_repository_1.RepositoryError('Failed to find medical history by condition', 'FIND_BY_CONDITION_ERROR', 500, { condition, error: error.message });
        }
    }
    async findActiveConditions(studentId) {
        try {
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, studentId, 'active');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                return cached;
            }
            const records = await this.model.findAll({
                where: {
                    studentId,
                    isActive: true,
                },
                order: [
                    ['isCritical', 'DESC'],
                    ['diagnosisDate', 'DESC'],
                ],
            });
            const entities = records.map((r) => this.mapToEntity(r));
            await this.cacheManager.set(cacheKey, entities, 1800);
            return entities;
        }
        catch (error) {
            this.logger.error('Error finding active conditions:', error);
            throw new base_repository_1.RepositoryError('Failed to find active conditions', 'FIND_ACTIVE_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findByCategory(category, options) {
        try {
            const records = await this.model.findAll({
                where: { category },
                order: [['diagnosisDate', 'DESC']],
                limit: options?.limit || 100,
            });
            return records.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            this.logger.error('Error finding medical history by category:', error);
            throw new base_repository_1.RepositoryError('Failed to find medical history by category', 'FIND_BY_CATEGORY_ERROR', 500, { category, error: error.message });
        }
    }
    async findFamilyHistory(studentId) {
        try {
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, studentId, 'family-history');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                return cached;
            }
            const records = await this.model.findAll({
                where: {
                    studentId,
                    isFamilyHistory: true,
                },
                order: [
                    ['familyRelation', 'ASC'],
                    ['condition', 'ASC'],
                ],
            });
            const entities = records.map((r) => this.mapToEntity(r));
            await this.cacheManager.set(cacheKey, entities, 3600);
            return entities;
        }
        catch (error) {
            this.logger.error('Error finding family history:', error);
            throw new base_repository_1.RepositoryError('Failed to find family history', 'FIND_FAMILY_ERROR', 500, { studentId, error: error.message });
        }
    }
    async searchConditions(query, options) {
        try {
            const searchTerm = `%${query}%`;
            const records = await this.model.findAll({
                where: {
                    [sequelize_2.Op.or]: [
                        { condition: { [sequelize_2.Op.iLike]: searchTerm } },
                        { diagnosisCode: { [sequelize_2.Op.iLike]: searchTerm } },
                        { treatment: { [sequelize_2.Op.iLike]: searchTerm } },
                        { medication: { [sequelize_2.Op.iLike]: searchTerm } },
                    ],
                },
                order: [['diagnosisDate', 'DESC']],
                limit: options?.limit || 50,
            });
            return records.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            this.logger.error('Error searching medical conditions:', error);
            throw new base_repository_1.RepositoryError('Failed to search medical conditions', 'SEARCH_ERROR', 500, { query, error: error.message });
        }
    }
    async flagCriticalConditions(studentId) {
        try {
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, studentId, 'critical');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                return cached;
            }
            const records = await this.model.findAll({
                where: {
                    studentId,
                    isCritical: true,
                    isActive: true,
                },
                order: [['diagnosisDate', 'DESC']],
            });
            const entities = records.map((r) => this.mapToEntity(r));
            await this.cacheManager.set(cacheKey, entities, 1800);
            return entities;
        }
        catch (error) {
            this.logger.error('Error finding critical conditions:', error);
            throw new base_repository_1.RepositoryError('Failed to find critical conditions', 'FIND_CRITICAL_ERROR', 500, { studentId, error: error.message });
        }
    }
    async validateCreate(data) {
        if (!data.studentId) {
            throw new base_repository_1.RepositoryError('Student ID is required', 'VALIDATION_ERROR', 400, { field: 'studentId' });
        }
        if (!data.recordType) {
            throw new base_repository_1.RepositoryError('Record type is required', 'VALIDATION_ERROR', 400, { field: 'recordType' });
        }
        if (!data.condition) {
            throw new base_repository_1.RepositoryError('Condition is required', 'VALIDATION_ERROR', 400, { field: 'condition' });
        }
        const validTypes = [
            'condition',
            'allergy',
            'surgery',
            'hospitalization',
            'family_history',
            'medication',
            'immunization',
        ];
        if (!validTypes.includes(data.recordType.toLowerCase())) {
            throw new base_repository_1.RepositoryError('Invalid record type', 'VALIDATION_ERROR', 400, { recordType: data.recordType, validTypes });
        }
        if (data.severity) {
            const validSeverities = ['mild', 'moderate', 'severe', 'critical'];
            if (!validSeverities.includes(data.severity.toLowerCase())) {
                throw new base_repository_1.RepositoryError('Invalid severity level', 'VALIDATION_ERROR', 400, { severity: data.severity, validSeverities });
            }
        }
        if (data.isFamilyHistory && !data.familyRelation) {
            throw new base_repository_1.RepositoryError('Family relation is required for family history records', 'VALIDATION_ERROR', 400, { field: 'familyRelation' });
        }
        if (data.diagnosisDate && data.resolvedDate) {
            if (data.resolvedDate < data.diagnosisDate) {
                throw new base_repository_1.RepositoryError('Resolved date cannot be before diagnosis date', 'VALIDATION_ERROR', 400, {
                    diagnosisDate: data.diagnosisDate,
                    resolvedDate: data.resolvedDate,
                });
            }
        }
    }
    async validateUpdate(id, data) {
        if (data.recordType) {
            const validTypes = [
                'condition',
                'allergy',
                'surgery',
                'hospitalization',
                'family_history',
                'medication',
                'immunization',
            ];
            if (!validTypes.includes(data.recordType.toLowerCase())) {
                throw new base_repository_1.RepositoryError('Invalid record type', 'VALIDATION_ERROR', 400, { recordType: data.recordType, validTypes });
            }
        }
        if (data.severity) {
            const validSeverities = ['mild', 'moderate', 'severe', 'critical'];
            if (!validSeverities.includes(data.severity.toLowerCase())) {
                throw new base_repository_1.RepositoryError('Invalid severity level', 'VALIDATION_ERROR', 400, { severity: data.severity, validSeverities });
            }
        }
    }
    async invalidateCaches(medicalHistory) {
        try {
            const historyData = medicalHistory.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, historyData.id));
            if (historyData.studentId) {
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, historyData.studentId, 'by-student'));
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, historyData.studentId, 'active'));
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, historyData.studentId, 'critical'));
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, historyData.studentId, 'family-history'));
                await this.cacheManager.deletePattern(`white-cross:medicalhistory:student:${historyData.studentId}:*`);
            }
            if (historyData.condition) {
                await this.cacheManager.deletePattern(`white-cross:medicalhistory:condition:*`);
            }
            if (historyData.category) {
                await this.cacheManager.deletePattern(`white-cross:medicalhistory:category:${historyData.category}:*`);
            }
        }
        catch (error) {
            this.logger.warn('Error invalidating medical history caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, audit_logger_interface_1.sanitizeSensitiveData)({
            ...data,
        });
    }
};
exports.MedicalHistoryRepository = MedicalHistoryRepository;
exports.MedicalHistoryRepository = MedicalHistoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.MedicalHistory)),
    __metadata("design:paramtypes", [Object, Object, Object])
], MedicalHistoryRepository);
//# sourceMappingURL=medical-history.repository.js.map