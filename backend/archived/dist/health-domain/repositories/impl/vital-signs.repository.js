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
exports.VitalSignsRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_repository_1 = require("../../../database/repositories/base/base.repository");
const audit_logger_interface_1 = require("../../../database/interfaces/audit/audit-logger.interface");
const models_1 = require("../../../database/models");
let VitalSignsRepository = class VitalSignsRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'VitalSigns');
    }
    async findByStudent(studentId, options) {
        try {
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, studentId, 'by-student');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.debug(`Cache hit for vital signs by student: ${studentId}`);
                return cached;
            }
            const vitalSigns = await this.model.findAll({
                where: { studentId },
                order: [['measurementDate', 'DESC']],
                limit: options?.limit || 100,
            });
            const entities = vitalSigns.map((v) => this.mapToEntity(v));
            await this.cacheManager.set(cacheKey, entities, 1800);
            return entities;
        }
        catch (error) {
            this.logger.error('Error finding vital signs by student:', error);
            throw new base_repository_1.RepositoryError('Failed to find vital signs by student', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findLatestByStudent(studentId) {
        try {
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, studentId, 'latest');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.debug(`Cache hit for latest vital signs: ${studentId}`);
                return cached;
            }
            const vitalSign = await this.model.findOne({
                where: { studentId },
                order: [['measurementDate', 'DESC']],
            });
            if (!vitalSign) {
                return null;
            }
            const entity = this.mapToEntity(vitalSign);
            await this.cacheManager.set(cacheKey, entity, 3600);
            return entity;
        }
        catch (error) {
            this.logger.error('Error finding latest vital signs:', error);
            throw new base_repository_1.RepositoryError('Failed to find latest vital signs', 'FIND_LATEST_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findByDateRange(studentId, startDate, endDate) {
        try {
            const vitalSigns = await this.model.findAll({
                where: {
                    studentId,
                    measurementDate: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                },
                order: [['measurementDate', 'ASC']],
            });
            return vitalSigns.map((v) => this.mapToEntity(v));
        }
        catch (error) {
            this.logger.error('Error finding vital signs by date range:', error);
            throw new base_repository_1.RepositoryError('Failed to find vital signs by date range', 'FIND_BY_DATE_RANGE_ERROR', 500, { studentId, startDate, endDate, error: error.message });
        }
    }
    async findAbnormalVitals(studentId, options) {
        try {
            const whereClause = {
                isAbnormal: true,
            };
            if (studentId) {
                whereClause.studentId = studentId;
            }
            const vitalSigns = await this.model.findAll({
                where: whereClause,
                order: [['measurementDate', 'DESC']],
                limit: options?.limit || 100,
            });
            return vitalSigns.map((v) => this.mapToEntity(v));
        }
        catch (error) {
            this.logger.error('Error finding abnormal vital signs:', error);
            throw new base_repository_1.RepositoryError('Failed to find abnormal vital signs', 'FIND_ABNORMAL_ERROR', 500, { studentId, error: error.message });
        }
    }
    async getVitalTrends(studentId, vitalType, days = 30) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, `${studentId}:${vitalType}:${days}`, 'trends');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                return cached;
            }
            const vitalSigns = await this.model.findAll({
                where: {
                    studentId,
                    measurementDate: {
                        [sequelize_2.Op.gte]: startDate,
                    },
                },
                order: [['measurementDate', 'ASC']],
            });
            const entities = vitalSigns.map((v) => this.mapToEntity(v));
            await this.cacheManager.set(cacheKey, entities, 1800);
            return entities;
        }
        catch (error) {
            this.logger.error('Error getting vital trends:', error);
            throw new base_repository_1.RepositoryError('Failed to get vital trends', 'TRENDS_ERROR', 500, { studentId, vitalType, days, error: error.message });
        }
    }
    async bulkRecordVitals(records, context) {
        let transaction;
        try {
            transaction = await this.model.sequelize.transaction();
            const results = await this.model.bulkCreate(records, {
                transaction,
                validate: true,
                returning: true,
            });
            await this.auditLogger.logBulkOperation('BULK_RECORD_VITALS', this.entityName, context, { count: results.length });
            if (transaction) {
                await transaction.commit();
            }
            this.logger.log(`Bulk recorded ${results.length} vital sign measurements`);
            return results.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            this.logger.error('Error bulk recording vital signs:', error);
            throw new base_repository_1.RepositoryError('Failed to bulk record vital signs', 'BULK_RECORD_ERROR', 500, { count: records.length, error: error.message });
        }
    }
    async validateCreate(data) {
        if (!data.studentId) {
            throw new base_repository_1.RepositoryError('Student ID is required', 'VALIDATION_ERROR', 400, { field: 'studentId' });
        }
        if (!data.measurementDate) {
            throw new base_repository_1.RepositoryError('Measurement date is required', 'VALIDATION_ERROR', 400, { field: 'measurementDate' });
        }
        if (data.measurementDate > new Date()) {
            throw new base_repository_1.RepositoryError('Measurement date cannot be in the future', 'VALIDATION_ERROR', 400, { measurementDate: data.measurementDate });
        }
        if (data.temperature !== undefined) {
            if (data.temperature < 90 || data.temperature > 110) {
                throw new base_repository_1.RepositoryError('Temperature value out of valid range', 'VALIDATION_ERROR', 400, { temperature: data.temperature, range: '90-110°F' });
            }
        }
        if (data.heartRate !== undefined) {
            if (data.heartRate < 30 || data.heartRate > 220) {
                throw new base_repository_1.RepositoryError('Heart rate value out of valid range', 'VALIDATION_ERROR', 400, { heartRate: data.heartRate, range: '30-220 bpm' });
            }
        }
        if (data.oxygenSaturation !== undefined) {
            if (data.oxygenSaturation < 70 || data.oxygenSaturation > 100) {
                throw new base_repository_1.RepositoryError('Oxygen saturation value out of valid range', 'VALIDATION_ERROR', 400, { oxygenSaturation: data.oxygenSaturation, range: '70-100%' });
            }
        }
        if (data.bloodPressureSystolic !== undefined) {
            if (data.bloodPressureSystolic < 60 || data.bloodPressureSystolic > 250) {
                throw new base_repository_1.RepositoryError('Blood pressure systolic value out of valid range', 'VALIDATION_ERROR', 400, {
                    bloodPressureSystolic: data.bloodPressureSystolic,
                    range: '60-250 mmHg',
                });
            }
        }
    }
    async validateUpdate(id, data) {
        if (data.temperature !== undefined) {
            if (data.temperature < 90 || data.temperature > 110) {
                throw new base_repository_1.RepositoryError('Temperature value out of valid range', 'VALIDATION_ERROR', 400, { temperature: data.temperature, range: '90-110°F' });
            }
        }
        if (data.heartRate !== undefined) {
            if (data.heartRate < 30 || data.heartRate > 220) {
                throw new base_repository_1.RepositoryError('Heart rate value out of valid range', 'VALIDATION_ERROR', 400, { heartRate: data.heartRate, range: '30-220 bpm' });
            }
        }
    }
    async invalidateCaches(vitalSign) {
        try {
            const vitalSignData = vitalSign.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, vitalSignData.id));
            if (vitalSignData.studentId) {
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, vitalSignData.studentId, 'by-student'));
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, vitalSignData.studentId, 'latest'));
                await this.cacheManager.deletePattern(`white-cross:vitalsigns:student:${vitalSignData.studentId}:*`);
                await this.cacheManager.deletePattern(`white-cross:vitalsigns:${vitalSignData.studentId}:*:trends`);
            }
            if (vitalSignData.isAbnormal) {
                await this.cacheManager.deletePattern(`white-cross:vitalsigns:abnormal:*`);
            }
        }
        catch (error) {
            this.logger.warn('Error invalidating vital signs caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, audit_logger_interface_1.sanitizeSensitiveData)({
            ...data,
        });
    }
};
exports.VitalSignsRepository = VitalSignsRepository;
exports.VitalSignsRepository = VitalSignsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.VitalSigns)),
    __metadata("design:paramtypes", [Object, Object, Object])
], VitalSignsRepository);
//# sourceMappingURL=vital-signs.repository.js.map