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
exports.LabResultRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const base_repository_1 = require("../base/base.repository");
const interfaces_1 = require("../../interfaces");
let LabResultRepository = class LabResultRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'LabResult');
    }
    async findByStudent(studentId) {
        try {
            const results = await this.model.findAll({
                where: { studentId },
                order: [['testDate', 'DESC']],
            });
            return results.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            this.logger.error('Error finding lab results by student:', error);
            throw new base_repository_1.RepositoryError('Failed to find lab results by student', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findAbnormalResults(studentId) {
        try {
            const results = await this.model.findAll({
                where: { studentId, isAbnormal: true },
                order: [['testDate', 'DESC']],
            });
            return results.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            this.logger.error('Error finding abnormal lab results:', error);
            throw new base_repository_1.RepositoryError('Failed to find abnormal lab results', 'FIND_ABNORMAL_RESULTS_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findByTestName(studentId, testName) {
        try {
            const results = await this.model.findAll({
                where: { studentId, testName },
                order: [['testDate', 'DESC']],
            });
            return results.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            this.logger.error('Error finding lab results by test name:', error);
            throw new base_repository_1.RepositoryError('Failed to find lab results by test name', 'FIND_BY_TEST_NAME_ERROR', 500, { studentId, testName, error: error.message });
        }
    }
    async validateCreate(data) {
    }
    async validateUpdate(id, data) {
    }
    async invalidateCaches(labResult) {
        try {
            const labResultData = labResult.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, labResultData.id));
            await this.cacheManager.deletePattern(`white-cross:lab-result:student:${labResultData.studentId}:*`);
        }
        catch (error) {
            this.logger.warn('Error invalidating lab result caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, interfaces_1.sanitizeSensitiveData)({
            ...data,
            resultValue: '[PHI]',
            notes: '[PHI]',
        });
    }
};
exports.LabResultRepository = LabResultRepository;
exports.LabResultRepository = LabResultRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)('')),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], LabResultRepository);
//# sourceMappingURL=lab-result.repository.js.map