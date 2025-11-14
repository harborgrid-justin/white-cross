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
exports.AllergyRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_repository_1 = require("../base/base.repository");
const interfaces_1 = require("../../interfaces");
const allergy_model_1 = require("../../models/allergy.model");
let AllergyRepository = class AllergyRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'Allergy');
    }
    async findByStudent(studentId) {
        try {
            const allergies = await this.model.findAll({
                where: { studentId, active: true },
                order: [
                    ['severity', 'DESC'],
                    ['allergen', 'ASC'],
                ],
            });
            return allergies.map((a) => this.mapToEntity(a));
        }
        catch (error) {
            this.logger.error('Error finding allergies by student:', error);
            throw new base_repository_1.RepositoryError('Failed to find allergies by student', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findBySeverity(severity) {
        try {
            const allergies = await this.model.findAll({
                where: { severity, active: true },
                order: [
                    ['studentId', 'ASC'],
                    ['allergen', 'ASC'],
                ],
            });
            return allergies.map((a) => this.mapToEntity(a));
        }
        catch (error) {
            this.logger.error('Error finding allergies by severity:', error);
            throw new base_repository_1.RepositoryError('Failed to find allergies by severity', 'FIND_BY_SEVERITY_ERROR', 500, { severity, error: error.message });
        }
    }
    async findByAllergen(allergen) {
        try {
            const allergies = await this.model.findAll({
                where: {
                    allergen: { [sequelize_2.Op.iLike]: `%${allergen}%` },
                    active: true,
                },
                order: [['severity', 'DESC']],
            });
            return allergies.map((a) => this.mapToEntity(a));
        }
        catch (error) {
            this.logger.error('Error finding allergies by allergen:', error);
            throw new base_repository_1.RepositoryError('Failed to find allergies by allergen', 'FIND_BY_ALLERGEN_ERROR', 500, { allergen, error: error.message });
        }
    }
    async validateCreate(data) {
        const existing = await this.model.findOne({
            where: {
                studentId: data.studentId,
                allergen: data.allergen,
                active: true,
            },
        });
        if (existing) {
            throw new base_repository_1.RepositoryError('Allergy already exists for this student', 'DUPLICATE_ALLERGY', 409, { studentId: data.studentId, allergen: data.allergen });
        }
    }
    async validateUpdate(id, data) {
    }
    async invalidateCaches(allergy) {
        try {
            const allergyData = allergy.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, allergyData.id));
            await this.cacheManager.deletePattern(`white-cross:allergy:student:${allergyData.studentId}:*`);
        }
        catch (error) {
            this.logger.warn('Error invalidating allergy caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, interfaces_1.sanitizeSensitiveData)({ ...data });
    }
};
exports.AllergyRepository = AllergyRepository;
exports.AllergyRepository = AllergyRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(allergy_model_1.Allergy)),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], AllergyRepository);
//# sourceMappingURL=allergy.repository.js.map