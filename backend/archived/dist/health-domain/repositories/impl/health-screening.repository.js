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
exports.HealthScreeningRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_repository_1 = require("../../../database/repositories/base/base.repository");
const audit_logger_interface_1 = require("../../../database/interfaces/audit/audit-logger.interface");
const models_1 = require("../../../database/models");
let HealthScreeningRepository = class HealthScreeningRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'HealthScreening');
    }
    async findByStudent(studentId, options) {
        try {
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, studentId, 'by-student');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.debug(`Cache hit for screenings by student: ${studentId}`);
                return cached;
            }
            const screenings = await this.model.findAll({
                where: { studentId },
                order: [['screeningDate', 'DESC']],
            });
            const entities = screenings.map((s) => this.mapToEntity(s));
            await this.cacheManager.set(cacheKey, entities, 1800);
            return entities;
        }
        catch (error) {
            this.logger.error('Error finding screenings by student:', error);
            throw new base_repository_1.RepositoryError('Failed to find screenings by student', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findByScreeningType(screeningType, options) {
        try {
            const screenings = await this.model.findAll({
                where: { screeningType },
                order: [['screeningDate', 'DESC']],
                limit: options?.limit || 100,
            });
            return screenings.map((s) => this.mapToEntity(s));
        }
        catch (error) {
            this.logger.error('Error finding screenings by type:', error);
            throw new base_repository_1.RepositoryError('Failed to find screenings by type', 'FIND_BY_TYPE_ERROR', 500, { screeningType, error: error.message });
        }
    }
    async findDueScreenings(date, options) {
        try {
            const screenings = await this.model.findAll({
                where: {
                    nextScheduledDate: {
                        [sequelize_2.Op.lte]: date,
                    },
                    followUpRequired: true,
                    followUpCompleted: false,
                },
                order: [['nextScheduledDate', 'ASC']],
                limit: options?.limit || 100,
            });
            return screenings.map((s) => this.mapToEntity(s));
        }
        catch (error) {
            this.logger.error('Error finding due screenings:', error);
            throw new base_repository_1.RepositoryError('Failed to find due screenings', 'FIND_DUE_ERROR', 500, { date, error: error.message });
        }
    }
    async findByDateRange(startDate, endDate, options) {
        try {
            const screenings = await this.model.findAll({
                where: {
                    screeningDate: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                },
                order: [['screeningDate', 'DESC']],
                limit: options?.limit || 500,
            });
            return screenings.map((s) => this.mapToEntity(s));
        }
        catch (error) {
            this.logger.error('Error finding screenings by date range:', error);
            throw new base_repository_1.RepositoryError('Failed to find screenings by date range', 'FIND_BY_DATE_RANGE_ERROR', 500, { startDate, endDate, error: error.message });
        }
    }
    async findAbnormalResults(screeningType, options) {
        try {
            const whereClause = {
                isAbnormal: true,
            };
            if (screeningType) {
                whereClause.screeningType = screeningType;
            }
            const screenings = await this.model.findAll({
                where: whereClause,
                order: [['screeningDate', 'DESC']],
                limit: options?.limit || 100,
            });
            return screenings.map((s) => this.mapToEntity(s));
        }
        catch (error) {
            this.logger.error('Error finding abnormal screenings:', error);
            throw new base_repository_1.RepositoryError('Failed to find abnormal screenings', 'FIND_ABNORMAL_ERROR', 500, { screeningType, error: error.message });
        }
    }
    async getScreeningSchedule(studentId) {
        try {
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, studentId, 'schedule');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                return cached;
            }
            const screenings = await this.model.findAll({
                where: {
                    studentId,
                    nextScheduledDate: {
                        [sequelize_2.Op.gte]: new Date(),
                    },
                },
                order: [['nextScheduledDate', 'ASC']],
            });
            const entities = screenings.map((s) => this.mapToEntity(s));
            await this.cacheManager.set(cacheKey, entities, 3600);
            return entities;
        }
        catch (error) {
            this.logger.error('Error getting screening schedule:', error);
            throw new base_repository_1.RepositoryError('Failed to get screening schedule', 'SCHEDULE_ERROR', 500, { studentId, error: error.message });
        }
    }
    async validateCreate(data) {
        if (!data.studentId) {
            throw new base_repository_1.RepositoryError('Student ID is required', 'VALIDATION_ERROR', 400, { field: 'studentId' });
        }
        if (!data.screeningType) {
            throw new base_repository_1.RepositoryError('Screening type is required', 'VALIDATION_ERROR', 400, { field: 'screeningType' });
        }
        if (!data.screeningDate) {
            throw new base_repository_1.RepositoryError('Screening date is required', 'VALIDATION_ERROR', 400, { field: 'screeningDate' });
        }
        const validTypes = [
            'vision',
            'hearing',
            'dental',
            'scoliosis',
            'bmi',
            'general',
        ];
        if (!validTypes.includes(data.screeningType.toLowerCase())) {
            throw new base_repository_1.RepositoryError('Invalid screening type', 'VALIDATION_ERROR', 400, { screeningType: data.screeningType, validTypes });
        }
        const validResults = ['pass', 'fail', 'refer', 'incomplete', 'pending'];
        if (data.result && !validResults.includes(data.result.toLowerCase())) {
            throw new base_repository_1.RepositoryError('Invalid screening result', 'VALIDATION_ERROR', 400, { result: data.result, validResults });
        }
    }
    async validateUpdate(id, data) {
        if (data.screeningType) {
            const validTypes = [
                'vision',
                'hearing',
                'dental',
                'scoliosis',
                'bmi',
                'general',
            ];
            if (!validTypes.includes(data.screeningType.toLowerCase())) {
                throw new base_repository_1.RepositoryError('Invalid screening type', 'VALIDATION_ERROR', 400, { screeningType: data.screeningType, validTypes });
            }
        }
        if (data.result) {
            const validResults = ['pass', 'fail', 'refer', 'incomplete', 'pending'];
            if (!validResults.includes(data.result.toLowerCase())) {
                throw new base_repository_1.RepositoryError('Invalid screening result', 'VALIDATION_ERROR', 400, { result: data.result, validResults });
            }
        }
    }
    async invalidateCaches(screening) {
        try {
            const screeningData = screening.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, screeningData.id));
            if (screeningData.studentId) {
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, screeningData.studentId, 'by-student'));
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, screeningData.studentId, 'schedule'));
                await this.cacheManager.deletePattern(`white-cross:healthscreening:student:${screeningData.studentId}:*`);
            }
            if (screeningData.screeningType) {
                await this.cacheManager.deletePattern(`white-cross:healthscreening:type:${screeningData.screeningType}:*`);
            }
            if (screeningData.isAbnormal) {
                await this.cacheManager.deletePattern(`white-cross:healthscreening:abnormal:*`);
            }
        }
        catch (error) {
            this.logger.warn('Error invalidating screening caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, audit_logger_interface_1.sanitizeSensitiveData)({
            ...data,
        });
    }
};
exports.HealthScreeningRepository = HealthScreeningRepository;
exports.HealthScreeningRepository = HealthScreeningRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.HealthScreening)),
    __metadata("design:paramtypes", [Object, Object, Object])
], HealthScreeningRepository);
//# sourceMappingURL=health-screening.repository.js.map