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
const base_repository_1 = require("../base/base.repository");
const interfaces_1 = require("../../interfaces");
let MedicalHistoryRepository = class MedicalHistoryRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'MedicalHistory');
    }
    async findByStudent(studentId) {
        try {
            const history = await this.model.findAll({
                where: { studentId },
                order: [['diagnosisDate', 'DESC']],
            });
            return history.map((h) => this.mapToEntity(h));
        }
        catch (error) {
            this.logger.error('Error finding medical history by student:', error);
            throw new base_repository_1.RepositoryError('Failed to find medical history by student', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findByCategory(studentId, category) {
        try {
            const history = await this.model.findAll({
                where: { studentId, category },
                order: [['diagnosisDate', 'DESC']],
            });
            return history.map((h) => this.mapToEntity(h));
        }
        catch (error) {
            this.logger.error('Error finding medical history by category:', error);
            throw new base_repository_1.RepositoryError('Failed to find medical history by category', 'FIND_BY_CATEGORY_ERROR', 500, { studentId, category, error: error.message });
        }
    }
    async findActiveConditions(studentId) {
        try {
            const history = await this.model.findAll({
                where: { studentId, isResolved: false },
                order: [['diagnosisDate', 'DESC']],
            });
            return history.map((h) => this.mapToEntity(h));
        }
        catch (error) {
            this.logger.error('Error finding active conditions:', error);
            throw new base_repository_1.RepositoryError('Failed to find active conditions', 'FIND_ACTIVE_CONDITIONS_ERROR', 500, { studentId, error: error.message });
        }
    }
    async validateCreate(data) {
    }
    async validateUpdate(id, data) {
    }
    async invalidateCaches(history) {
        try {
            const historyData = history.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, historyData.id));
            await this.cacheManager.deletePattern(`white-cross:medical-history:student:${historyData.studentId}:*`);
        }
        catch (error) {
            this.logger.warn('Error invalidating medical history caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, interfaces_1.sanitizeSensitiveData)({
            ...data,
            condition: '[PHI]',
            notes: '[PHI]',
        });
    }
};
exports.MedicalHistoryRepository = MedicalHistoryRepository;
exports.MedicalHistoryRepository = MedicalHistoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)('')),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], MedicalHistoryRepository);
//# sourceMappingURL=medical-history.repository.js.map