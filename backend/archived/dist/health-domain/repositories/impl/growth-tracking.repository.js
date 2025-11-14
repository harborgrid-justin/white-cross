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
exports.GrowthTrackingRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_repository_1 = require("../../../database/repositories/base/base.repository");
const audit_logger_interface_1 = require("../../../database/interfaces/audit/audit-logger.interface");
const models_1 = require("../../../database/models");
let GrowthTrackingRepository = class GrowthTrackingRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'GrowthTracking');
    }
    async findByStudent(studentId, options) {
        try {
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, studentId, 'by-student');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.debug(`Cache hit for growth records by student: ${studentId}`);
                return cached;
            }
            const records = await this.model.findAll({
                where: { studentId },
                order: [['measurementDate', 'DESC']],
                limit: options?.limit || 100,
            });
            const entities = records.map((r) => this.mapToEntity(r));
            await this.cacheManager.set(cacheKey, entities, 1800);
            return entities;
        }
        catch (error) {
            this.logger.error('Error finding growth records by student:', error);
            throw new base_repository_1.RepositoryError('Failed to find growth records by student', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findLatestByStudent(studentId) {
        try {
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, studentId, 'latest');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.debug(`Cache hit for latest growth record: ${studentId}`);
                return cached;
            }
            const record = await this.model.findOne({
                where: { studentId },
                order: [['measurementDate', 'DESC']],
            });
            if (!record) {
                return null;
            }
            const entity = this.mapToEntity(record);
            await this.cacheManager.set(cacheKey, entity, 3600);
            return entity;
        }
        catch (error) {
            this.logger.error('Error finding latest growth record:', error);
            throw new base_repository_1.RepositoryError('Failed to find latest growth record', 'FIND_LATEST_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findByDateRange(studentId, startDate, endDate) {
        try {
            const records = await this.model.findAll({
                where: {
                    studentId,
                    measurementDate: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                },
                order: [['measurementDate', 'ASC']],
            });
            return records.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            this.logger.error('Error finding growth records by date range:', error);
            throw new base_repository_1.RepositoryError('Failed to find growth records by date range', 'FIND_BY_DATE_RANGE_ERROR', 500, { studentId, startDate, endDate, error: error.message });
        }
    }
    calculateBMI(height, heightUnit, weight, weightUnit) {
        try {
            let weightInKg = weight;
            let heightInCm = height;
            if (weightUnit.toLowerCase() === 'lbs') {
                weightInKg = weight * 0.453592;
            }
            if (heightUnit.toLowerCase() === 'inches') {
                heightInCm = height * 2.54;
            }
            const heightInM = heightInCm / 100;
            const bmi = weightInKg / (heightInM * heightInM);
            return Math.round(bmi * 10) / 10;
        }
        catch (error) {
            this.logger.error('Error calculating BMI:', error);
            throw new base_repository_1.RepositoryError('Failed to calculate BMI', 'BMI_CALCULATION_ERROR', 500, {
                height,
                heightUnit,
                weight,
                weightUnit,
                error: error.message,
            });
        }
    }
    async getGrowthPercentiles(studentId) {
        try {
            const latest = await this.findLatestByStudent(studentId);
            if (!latest) {
                throw new base_repository_1.RepositoryError('No growth records found for student', 'NO_RECORDS_ERROR', 404, { studentId });
            }
            return {
                bmi: latest.bmiPercentile,
                height: latest.heightPercentile,
                weight: latest.weightPercentile,
                headCircumference: latest.headCircumferencePercentile,
            };
        }
        catch (error) {
            this.logger.error('Error getting growth percentiles:', error);
            if (error instanceof base_repository_1.RepositoryError) {
                throw error;
            }
            throw new base_repository_1.RepositoryError('Failed to get growth percentiles', 'PERCENTILES_ERROR', 500, { studentId, error: error.message });
        }
    }
    async getGrowthTrend(studentId, months = 12) {
        try {
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - months);
            const measurements = await this.findByDateRange(studentId, startDate, new Date());
            if (measurements.length < 2) {
                throw new base_repository_1.RepositoryError('Insufficient data for trend analysis', 'INSUFFICIENT_DATA', 400, { studentId, measurements: measurements.length });
            }
            const firstMeasurement = measurements[0];
            const lastMeasurement = measurements[measurements.length - 1];
            const monthsDiff = this.getMonthsDifference(firstMeasurement.measurementDate, lastMeasurement.measurementDate);
            const heightGrowthRate = monthsDiff > 0
                ? (lastMeasurement.height - firstMeasurement.height) / monthsDiff
                : 0;
            const weightGrowthRate = monthsDiff > 0
                ? (lastMeasurement.weight - firstMeasurement.weight) / monthsDiff
                : 0;
            const projectedNextMeasurement = monthsDiff > 0
                ? {
                    height: lastMeasurement.height + heightGrowthRate * 3,
                    weight: lastMeasurement.weight + weightGrowthRate * 3,
                    bmi: 0,
                }
                : undefined;
            if (projectedNextMeasurement) {
                projectedNextMeasurement.bmi = this.calculateBMI(projectedNextMeasurement.height, lastMeasurement.heightUnit, projectedNextMeasurement.weight, lastMeasurement.weightUnit);
            }
            return {
                studentId,
                measurements,
                averageGrowthRate: {
                    height: Math.round(heightGrowthRate * 100) / 100,
                    weight: Math.round(weightGrowthRate * 100) / 100,
                },
                projectedNextMeasurement,
            };
        }
        catch (error) {
            this.logger.error('Error getting growth trend:', error);
            if (error instanceof base_repository_1.RepositoryError) {
                throw error;
            }
            throw new base_repository_1.RepositoryError('Failed to get growth trend', 'TREND_ERROR', 500, { studentId, months, error: error.message });
        }
    }
    async findByAgeRange(minAge, maxAge, options) {
        try {
            const records = await this.model.findAll({
                where: {
                    ageInMonths: {
                        [sequelize_2.Op.between]: [minAge, maxAge],
                    },
                },
                order: [['measurementDate', 'DESC']],
                limit: options?.limit || 200,
            });
            return records.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            this.logger.error('Error finding growth records by age range:', error);
            throw new base_repository_1.RepositoryError('Failed to find growth records by age range', 'FIND_BY_AGE_ERROR', 500, { minAge, maxAge, error: error.message });
        }
    }
    getMonthsDifference(date1, date2) {
        const months = (date2.getFullYear() - date1.getFullYear()) * 12;
        return months + (date2.getMonth() - date1.getMonth());
    }
    async validateCreate(data) {
        if (!data.studentId) {
            throw new base_repository_1.RepositoryError('Student ID is required', 'VALIDATION_ERROR', 400, { field: 'studentId' });
        }
        if (!data.measurementDate) {
            throw new base_repository_1.RepositoryError('Measurement date is required', 'VALIDATION_ERROR', 400, { field: 'measurementDate' });
        }
        if (!data.height || !data.weight) {
            throw new base_repository_1.RepositoryError('Height and weight are required', 'VALIDATION_ERROR', 400, { fields: ['height', 'weight'] });
        }
        if (data.height <= 0 || data.height > 300) {
            throw new base_repository_1.RepositoryError('Height value out of valid range', 'VALIDATION_ERROR', 400, { height: data.height, range: '0-300cm or 0-120 inches' });
        }
        if (data.weight <= 0 || data.weight > 500) {
            throw new base_repository_1.RepositoryError('Weight value out of valid range', 'VALIDATION_ERROR', 400, { weight: data.weight, range: '0-500kg or 0-1100 lbs' });
        }
    }
    async validateUpdate(id, data) {
        if (data.height !== undefined && (data.height <= 0 || data.height > 300)) {
            throw new base_repository_1.RepositoryError('Height value out of valid range', 'VALIDATION_ERROR', 400, { height: data.height, range: '0-300cm or 0-120 inches' });
        }
        if (data.weight !== undefined && (data.weight <= 0 || data.weight > 500)) {
            throw new base_repository_1.RepositoryError('Weight value out of valid range', 'VALIDATION_ERROR', 400, { weight: data.weight, range: '0-500kg or 0-1100 lbs' });
        }
    }
    async invalidateCaches(growthRecord) {
        try {
            const growthData = growthRecord.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, growthData.id));
            if (growthData.studentId) {
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, growthData.studentId, 'by-student'));
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, growthData.studentId, 'latest'));
                await this.cacheManager.deletePattern(`white-cross:growthtracking:student:${growthData.studentId}:*`);
            }
            await this.cacheManager.deletePattern(`white-cross:growthtracking:age:*`);
        }
        catch (error) {
            this.logger.warn('Error invalidating growth tracking caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, audit_logger_interface_1.sanitizeSensitiveData)({
            ...data,
        });
    }
};
exports.GrowthTrackingRepository = GrowthTrackingRepository;
exports.GrowthTrackingRepository = GrowthTrackingRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.GrowthTracking)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GrowthTrackingRepository);
//# sourceMappingURL=growth-tracking.repository.js.map