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
exports.MedicationLogRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_repository_1 = require("../base/base.repository");
const interfaces_1 = require("../../interfaces");
const medication_log_model_1 = require("../../models/medication-log.model");
let MedicationLogRepository = class MedicationLogRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'MedicationLog');
    }
    async findByStudent(studentId, options) {
        try {
            const logs = await this.model.findAll({
                where: { studentId },
                order: [['administeredAt', 'DESC']],
                ...options,
            });
            return logs.map((log) => this.mapToEntity(log));
        }
        catch (error) {
            this.logger.error('Error finding medication logs by student:', error);
            throw new base_repository_1.RepositoryError('Failed to find medication logs by student', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findPending(studentId, options) {
        try {
            const where = { status: 'PENDING' };
            if (studentId) {
                where.studentId = studentId;
            }
            const logs = await this.model.findAll({
                where,
                order: [['scheduledAt', 'ASC']],
                ...options,
            });
            return logs.map((log) => this.mapToEntity(log));
        }
        catch (error) {
            this.logger.error('Error finding pending medication logs:', error);
            throw new base_repository_1.RepositoryError('Failed to find pending medication logs', 'FIND_PENDING_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findByDateRange(startDate, endDate, studentId, options) {
        try {
            const where = {
                administeredAt: {
                    [sequelize_2.Op.between]: [startDate, endDate],
                },
            };
            if (studentId) {
                where.studentId = studentId;
            }
            const logs = await this.model.findAll({
                where,
                order: [['administeredAt', 'DESC']],
                ...options,
            });
            return logs.map((log) => this.mapToEntity(log));
        }
        catch (error) {
            this.logger.error('Error finding medication logs by date range:', error);
            throw new base_repository_1.RepositoryError('Failed to find medication logs by date range', 'FIND_BY_DATE_RANGE_ERROR', 500, { startDate, endDate, studentId, error: error.message });
        }
    }
    async calculateAdherenceRate(studentId, medicationId, startDate, endDate) {
        try {
            const where = { studentId };
            if (medicationId) {
                where.medicationId = medicationId;
            }
            if (startDate && endDate) {
                where.scheduledAt = {
                    [sequelize_2.Op.between]: [startDate, endDate],
                };
            }
            const logs = await this.model.findAll({ where });
            const totalScheduled = logs.length;
            const totalAdministered = logs.filter((log) => log.status === 'ADMINISTERED').length;
            return {
                totalScheduled,
                totalAdministered,
                adherenceRate: totalScheduled > 0
                    ? Math.round((totalAdministered / totalScheduled) * 100)
                    : 0,
            };
        }
        catch (error) {
            this.logger.error('Error calculating adherence rate:', error);
            throw new base_repository_1.RepositoryError('Failed to calculate adherence rate', 'CALCULATE_ADHERENCE_ERROR', 500, { studentId, medicationId, error: error.message });
        }
    }
    async validateCreate(data) {
    }
    async validateUpdate(id, data) {
    }
    async invalidateCaches(log) {
        try {
            const logData = log.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, logData.id));
            await this.cacheManager.deletePattern(`white-cross:medication-log:student:${logData.studentId}:*`);
        }
        catch (error) {
            this.logger.warn('Error invalidating medication log caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, interfaces_1.sanitizeSensitiveData)({ ...data });
    }
};
exports.MedicationLogRepository = MedicationLogRepository;
exports.MedicationLogRepository = MedicationLogRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(medication_log_model_1.MedicationLog)),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], MedicationLogRepository);
//# sourceMappingURL=medication-log.repository.js.map