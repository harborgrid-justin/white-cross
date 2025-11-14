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
exports.LabResultsRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_repository_1 = require("../../../database/repositories/base/base.repository");
const audit_logger_interface_1 = require("../../../database/interfaces/audit/audit-logger.interface");
const models_1 = require("../../../database/models");
let LabResultsRepository = class LabResultsRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'LabResults');
    }
    async findByStudent(studentId, options) {
        try {
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, studentId, 'by-student');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.debug(`Cache hit for lab results by student: ${studentId}`);
                return cached;
            }
            const results = await this.model.findAll({
                where: { studentId },
                order: [
                    ['resultDate', 'DESC'],
                    ['orderedDate', 'DESC'],
                ],
            });
            const entities = results.map((r) => this.mapToEntity(r));
            await this.cacheManager.set(cacheKey, entities, 1800);
            return entities;
        }
        catch (error) {
            this.logger.error('Error finding lab results by student:', error);
            throw new base_repository_1.RepositoryError('Failed to find lab results by student', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findByTestType(testType, options) {
        try {
            const results = await this.model.findAll({
                where: { testType },
                order: [['resultDate', 'DESC']],
                limit: options?.limit || 100,
            });
            return results.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            this.logger.error('Error finding lab results by test type:', error);
            throw new base_repository_1.RepositoryError('Failed to find lab results by test type', 'FIND_BY_TEST_TYPE_ERROR', 500, { testType, error: error.message });
        }
    }
    async findByDateRange(studentId, startDate, endDate) {
        try {
            const results = await this.model.findAll({
                where: {
                    studentId,
                    resultDate: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                },
                order: [['resultDate', 'DESC']],
            });
            return results.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            this.logger.error('Error finding lab results by date range:', error);
            throw new base_repository_1.RepositoryError('Failed to find lab results by date range', 'FIND_BY_DATE_RANGE_ERROR', 500, { studentId, startDate, endDate, error: error.message });
        }
    }
    async findAbnormalResults(studentId, options) {
        try {
            const whereClause = {
                isAbnormal: true,
                status: 'completed',
            };
            if (studentId) {
                whereClause.studentId = studentId;
            }
            const results = await this.model.findAll({
                where: whereClause,
                order: [['resultDate', 'DESC']],
                limit: options?.limit || 100,
            });
            return results.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            this.logger.error('Error finding abnormal lab results:', error);
            throw new base_repository_1.RepositoryError('Failed to find abnormal lab results', 'FIND_ABNORMAL_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findPendingResults(options) {
        try {
            const results = await this.model.findAll({
                where: {
                    status: {
                        [sequelize_2.Op.in]: ['pending', 'completed'],
                    },
                    reviewedBy: null,
                },
                order: [['orderedDate', 'ASC']],
                limit: options?.limit || 50,
            });
            return results.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            this.logger.error('Error finding pending lab results:', error);
            throw new base_repository_1.RepositoryError('Failed to find pending lab results', 'FIND_PENDING_ERROR', 500, { error: error.message });
        }
    }
    async getResultTrends(studentId, testType, months = 12) {
        try {
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - months);
            const cacheKey = this.cacheKeyBuilder.summary(this.entityName, `${studentId}:${testType}:${months}`, 'trends');
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                return cached;
            }
            const results = await this.model.findAll({
                where: {
                    studentId,
                    testType,
                    resultDate: {
                        [sequelize_2.Op.gte]: startDate,
                    },
                    status: 'completed',
                    resultValue: {
                        [sequelize_2.Op.ne]: null,
                    },
                },
                order: [['resultDate', 'ASC']],
            });
            if (results.length === 0) {
                throw new base_repository_1.RepositoryError('No results found for trend analysis', 'NO_RESULTS_ERROR', 404, { studentId, testType, months });
            }
            const entities = results.map((r) => this.mapToEntity(r));
            const values = entities.map((e) => e.resultValue);
            const averageValue = values.reduce((sum, val) => sum + val, 0) / values.length;
            let trend = 'stable';
            if (values.length >= 2) {
                const firstHalf = values.slice(0, Math.floor(values.length / 2));
                const secondHalf = values.slice(Math.floor(values.length / 2));
                const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
                const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
                const percentChange = ((secondAvg - firstAvg) / firstAvg) * 100;
                if (percentChange > 10) {
                    trend = 'increasing';
                }
                else if (percentChange < -10) {
                    trend = 'decreasing';
                }
            }
            const trendData = {
                testName: entities[0].testName,
                testType,
                results: entities.map((e) => ({
                    date: e.resultDate,
                    value: e.resultValue,
                    unit: e.resultUnit || '',
                    isAbnormal: e.isAbnormal,
                })),
                trend,
                averageValue: Math.round(averageValue * 100) / 100,
            };
            await this.cacheManager.set(cacheKey, trendData, 3600);
            return trendData;
        }
        catch (error) {
            this.logger.error('Error getting result trends:', error);
            if (error instanceof base_repository_1.RepositoryError) {
                throw error;
            }
            throw new base_repository_1.RepositoryError('Failed to get result trends', 'TRENDS_ERROR', 500, { studentId, testType, months, error: error.message });
        }
    }
    async compareResults(studentId, testType) {
        try {
            const results = await this.model.findAll({
                where: {
                    studentId,
                    testType,
                    status: 'completed',
                },
                order: [['resultDate', 'ASC']],
            });
            return results.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            this.logger.error('Error comparing lab results:', error);
            throw new base_repository_1.RepositoryError('Failed to compare lab results', 'COMPARE_ERROR', 500, { studentId, testType, error: error.message });
        }
    }
    async validateCreate(data) {
        if (!data.studentId) {
            throw new base_repository_1.RepositoryError('Student ID is required', 'VALIDATION_ERROR', 400, { field: 'studentId' });
        }
        if (!data.testType || !data.testName) {
            throw new base_repository_1.RepositoryError('Test type and test name are required', 'VALIDATION_ERROR', 400, { fields: ['testType', 'testName'] });
        }
        if (!data.orderedDate) {
            throw new base_repository_1.RepositoryError('Ordered date is required', 'VALIDATION_ERROR', 400, { field: 'orderedDate' });
        }
        const validStatuses = ['pending', 'completed', 'reviewed', 'cancelled'];
        if (data.status && !validStatuses.includes(data.status.toLowerCase())) {
            throw new base_repository_1.RepositoryError('Invalid status', 'VALIDATION_ERROR', 400, {
                status: data.status,
                validStatuses,
            });
        }
        if (data.collectionDate && data.collectionDate < data.orderedDate) {
            throw new base_repository_1.RepositoryError('Collection date cannot be before ordered date', 'VALIDATION_ERROR', 400, { orderedDate: data.orderedDate, collectionDate: data.collectionDate });
        }
        if (data.resultDate) {
            if (data.collectionDate && data.resultDate < data.collectionDate) {
                throw new base_repository_1.RepositoryError('Result date cannot be before collection date', 'VALIDATION_ERROR', 400, { collectionDate: data.collectionDate, resultDate: data.resultDate });
            }
            if (data.resultDate < data.orderedDate) {
                throw new base_repository_1.RepositoryError('Result date cannot be before ordered date', 'VALIDATION_ERROR', 400, { orderedDate: data.orderedDate, resultDate: data.resultDate });
            }
        }
    }
    async validateUpdate(id, data) {
        if (data.status) {
            const validStatuses = ['pending', 'completed', 'reviewed', 'cancelled'];
            if (!validStatuses.includes(data.status.toLowerCase())) {
                throw new base_repository_1.RepositoryError('Invalid status', 'VALIDATION_ERROR', 400, {
                    status: data.status,
                    validStatuses,
                });
            }
        }
        if (data.status === 'reviewed' && !data.reviewedBy) {
            throw new base_repository_1.RepositoryError('Reviewer is required when marking as reviewed', 'VALIDATION_ERROR', 400, { status: data.status });
        }
    }
    async invalidateCaches(labResult) {
        try {
            const labData = labResult.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, labData.id));
            if (labData.studentId) {
                await this.cacheManager.delete(this.cacheKeyBuilder.summary(this.entityName, labData.studentId, 'by-student'));
                await this.cacheManager.deletePattern(`white-cross:labresults:student:${labData.studentId}:*`);
                await this.cacheManager.deletePattern(`white-cross:labresults:${labData.studentId}:*:trends`);
            }
            if (labData.testType) {
                await this.cacheManager.deletePattern(`white-cross:labresults:type:${labData.testType}:*`);
            }
            if (labData.isAbnormal) {
                await this.cacheManager.deletePattern(`white-cross:labresults:abnormal:*`);
            }
            if (labData.status === 'pending' || labData.status === 'completed') {
                await this.cacheManager.deletePattern(`white-cross:labresults:pending:*`);
            }
        }
        catch (error) {
            this.logger.warn('Error invalidating lab results caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, audit_logger_interface_1.sanitizeSensitiveData)({
            ...data,
        });
    }
};
exports.LabResultsRepository = LabResultsRepository;
exports.LabResultsRepository = LabResultsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.LabResults)),
    __metadata("design:paramtypes", [Object, Object, Object])
], LabResultsRepository);
//# sourceMappingURL=lab-results.repository.js.map