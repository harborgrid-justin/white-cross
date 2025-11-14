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
exports.HealthRecordRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_repository_1 = require("../base/base.repository");
const interfaces_1 = require("../../interfaces");
const health_record_model_1 = require("../../models/health-record.model");
let HealthRecordRepository = class HealthRecordRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'HealthRecord');
    }
    async findByStudent(studentId, options) {
        try {
            const records = await this.model.findAll({
                where: { studentId },
                order: [['recordDate', 'DESC']],
            });
            return records.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            this.logger.error('Error finding health records by student:', error);
            throw new base_repository_1.RepositoryError('Failed to find health records by student', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findByType(studentId, recordType) {
        try {
            const records = await this.model.findAll({
                where: { studentId, recordType },
                order: [['recordDate', 'DESC']],
            });
            return records.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            this.logger.error('Error finding health records by type:', error);
            throw new base_repository_1.RepositoryError('Failed to find health records by type', 'FIND_BY_TYPE_ERROR', 500, { studentId, recordType, error: error.message });
        }
    }
    async findByDateRange(studentId, startDate, endDate) {
        try {
            const records = await this.model.findAll({
                where: {
                    studentId,
                    recordDate: { [sequelize_2.Op.between]: [startDate, endDate] },
                },
                order: [['recordDate', 'DESC']],
            });
            return records.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            this.logger.error('Error finding health records by date range:', error);
            throw new base_repository_1.RepositoryError('Failed to find health records by date range', 'FIND_BY_DATE_RANGE_ERROR', 500, { studentId, startDate, endDate, error: error.message });
        }
    }
    async validateCreate(data) {
    }
    async validateUpdate(id, data) {
    }
    async invalidateCaches(record) {
        try {
            const recordData = record.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, recordData.id));
            await this.cacheManager.deletePattern(`white-cross:health-record:student:${recordData.studentId}:*`);
        }
        catch (error) {
            this.logger.warn('Error invalidating health record caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, interfaces_1.sanitizeSensitiveData)({
            ...data,
            diagnosis: '[PHI]',
            notes: '[PHI]',
        });
    }
};
exports.HealthRecordRepository = HealthRecordRepository;
exports.HealthRecordRepository = HealthRecordRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(health_record_model_1.HealthRecord)),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], HealthRecordRepository);
//# sourceMappingURL=health-record.repository.js.map