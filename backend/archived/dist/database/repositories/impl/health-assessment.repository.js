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
exports.HealthAssessmentRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const base_repository_1 = require("../base/base.repository");
const interfaces_1 = require("../../interfaces");
let HealthAssessmentRepository = class HealthAssessmentRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'HealthAssessment');
    }
    async findByStudent(studentId) {
        try {
            const assessments = await this.model.findAll({
                where: { studentId },
                order: [['assessmentDate', 'DESC']],
            });
            return assessments.map((a) => this.mapToEntity(a));
        }
        catch (error) {
            this.logger.error('Error finding health assessments by student:', error);
            throw new base_repository_1.RepositoryError('Failed to find health assessments by student', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findByType(assessmentType) {
        try {
            const assessments = await this.model.findAll({
                where: { assessmentType },
                order: [['assessmentDate', 'DESC']],
            });
            return assessments.map((a) => this.mapToEntity(a));
        }
        catch (error) {
            this.logger.error('Error finding health assessments by type:', error);
            throw new base_repository_1.RepositoryError('Failed to find health assessments by type', 'FIND_BY_TYPE_ERROR', 500, { assessmentType, error: error.message });
        }
    }
    async findByRiskLevel(riskLevel) {
        try {
            const assessments = await this.model.findAll({
                where: { riskLevel },
                order: [['assessmentDate', 'DESC']],
            });
            return assessments.map((a) => this.mapToEntity(a));
        }
        catch (error) {
            this.logger.error('Error finding health assessments by risk level:', error);
            throw new base_repository_1.RepositoryError('Failed to find health assessments by risk level', 'FIND_BY_RISK_LEVEL_ERROR', 500, { riskLevel, error: error.message });
        }
    }
    async validateCreate(data) {
    }
    async validateUpdate(id, data) {
    }
    async invalidateCaches(assessment) {
        try {
            const assessmentData = assessment.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, assessmentData.id));
            await this.cacheManager.deletePattern(`white-cross:health-assessment:student:${assessmentData.studentId}:*`);
        }
        catch (error) {
            this.logger.warn('Error invalidating health assessment caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, interfaces_1.sanitizeSensitiveData)({
            ...data,
            findings: '[PHI]',
            recommendations: '[PHI]',
        });
    }
};
exports.HealthAssessmentRepository = HealthAssessmentRepository;
exports.HealthAssessmentRepository = HealthAssessmentRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)('')),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], HealthAssessmentRepository);
//# sourceMappingURL=health-assessment.repository.js.map