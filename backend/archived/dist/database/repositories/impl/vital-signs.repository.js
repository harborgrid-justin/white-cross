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
const base_repository_1 = require("../base/base.repository");
const interfaces_1 = require("../../interfaces");
const vital_signs_model_1 = require("../../models/vital-signs.model");
let VitalSignsRepository = class VitalSignsRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'VitalSigns');
    }
    async findByStudent(studentId, limit = 10) {
        try {
            const vitalSigns = await this.model.findAll({
                where: { studentId },
                order: [['measurementDate', 'DESC']],
                limit,
            });
            return vitalSigns.map((v) => this.mapToEntity(v));
        }
        catch (error) {
            this.logger.error('Error finding vital signs by student:', error);
            throw new base_repository_1.RepositoryError('Failed to find vital signs by student', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findByDateRange(studentId, startDate, endDate) {
        try {
            const vitalSigns = await this.model.findAll({
                where: {
                    studentId,
                    measurementDate: { [sequelize_2.Op.between]: [startDate, endDate] },
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
    async validateCreate(data) {
    }
    async validateUpdate(id, data) {
    }
    async invalidateCaches(vitalSigns) {
        try {
            const vitalSignsData = vitalSigns.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, vitalSignsData.id));
            await this.cacheManager.deletePattern(`white-cross:vital-signs:student:${vitalSignsData.studentId}:*`);
        }
        catch (error) {
            this.logger.warn('Error invalidating vital signs caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, interfaces_1.sanitizeSensitiveData)({ ...data });
    }
};
exports.VitalSignsRepository = VitalSignsRepository;
exports.VitalSignsRepository = VitalSignsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(vital_signs_model_1.VitalSigns)),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], VitalSignsRepository);
//# sourceMappingURL=vital-signs.repository.js.map