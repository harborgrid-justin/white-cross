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
const base_repository_1 = require("../base/base.repository");
const interfaces_1 = require("../../interfaces");
const growth_tracking_model_1 = require("../../models/growth-tracking.model");
let GrowthTrackingRepository = class GrowthTrackingRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'GrowthTracking');
    }
    async findByStudent(studentId) {
        try {
            const measurements = await this.model.findAll({
                where: { studentId },
                order: [['measurementDate', 'ASC']],
            });
            return measurements.map((m) => this.mapToEntity(m));
        }
        catch (error) {
            this.logger.error('Error finding growth tracking by student:', error);
            throw new base_repository_1.RepositoryError('Failed to find growth tracking by student', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findLatestMeasurement(studentId) {
        try {
            const measurement = await this.model.findOne({
                where: { studentId },
                order: [['measurementDate', 'DESC']],
            });
            return measurement ? this.mapToEntity(measurement) : null;
        }
        catch (error) {
            this.logger.error('Error finding latest growth measurement:', error);
            throw new base_repository_1.RepositoryError('Failed to find latest growth measurement', 'FIND_LATEST_ERROR', 500, { studentId, error: error.message });
        }
    }
    async validateCreate(data) {
    }
    async validateUpdate(id, data) {
    }
    async invalidateCaches(growth) {
        try {
            const growthData = growth.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, growthData.id));
            await this.cacheManager.deletePattern(`white-cross:growth-tracking:student:${growthData.studentId}:*`);
        }
        catch (error) {
            this.logger.warn('Error invalidating growth tracking caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, interfaces_1.sanitizeSensitiveData)({ ...data });
    }
};
exports.GrowthTrackingRepository = GrowthTrackingRepository;
exports.GrowthTrackingRepository = GrowthTrackingRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(growth_tracking_model_1.GrowthTracking)),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], GrowthTrackingRepository);
//# sourceMappingURL=growth-tracking.repository.js.map