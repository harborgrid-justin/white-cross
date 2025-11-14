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
exports.PrescriptionRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_repository_1 = require("../base/base.repository");
const interfaces_1 = require("../../interfaces");
let PrescriptionRepository = class PrescriptionRepository extends base_repository_1.BaseRepository {
    constructor(model, auditLogger, cacheManager) {
        super(model, auditLogger, cacheManager, 'Prescription');
    }
    async findByStudent(studentId) {
        try {
            const prescriptions = await this.model.findAll({
                where: { studentId },
                order: [['prescribedDate', 'DESC']],
            });
            return prescriptions.map((p) => this.mapToEntity(p));
        }
        catch (error) {
            this.logger.error('Error finding prescriptions:', error);
            throw new base_repository_1.RepositoryError('Failed to find prescriptions', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: error.message });
        }
    }
    async findActivePrescriptions(studentId) {
        try {
            const prescriptions = await this.model.findAll({
                where: {
                    studentId,
                    status: 'active',
                    [sequelize_2.Op.or]: [{ endDate: null }, { endDate: { [sequelize_2.Op.gte]: new Date() } }],
                },
                order: [['medicationName', 'ASC']],
            });
            return prescriptions.map((p) => this.mapToEntity(p));
        }
        catch (error) {
            this.logger.error('Error finding active prescriptions:', error);
            throw new base_repository_1.RepositoryError('Failed to find active prescriptions', 'FIND_ACTIVE_ERROR', 500, { studentId, error: error.message });
        }
    }
    async validateCreate(data) { }
    async validateUpdate(id, data) { }
    async invalidateCaches(prescription) {
        try {
            const prescriptionData = prescription.get();
            await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, prescriptionData.id));
            await this.cacheManager.deletePattern(`white-cross:prescription:student:${prescriptionData.studentId}:*`);
        }
        catch (error) {
            this.logger.warn('Error invalidating prescription caches:', error);
        }
    }
    sanitizeForAudit(data) {
        return (0, interfaces_1.sanitizeSensitiveData)({ ...data });
    }
};
exports.PrescriptionRepository = PrescriptionRepository;
exports.PrescriptionRepository = PrescriptionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)('')),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __param(2, (0, common_1.Inject)('ICacheManager')),
    __metadata("design:paramtypes", [Object, Object, Object])
], PrescriptionRepository);
//# sourceMappingURL=prescription.repository.js.map