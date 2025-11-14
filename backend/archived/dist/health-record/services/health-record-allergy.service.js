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
exports.HealthRecordAllergyService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const base_1 = require("../../common/base");
let HealthRecordAllergyService = class HealthRecordAllergyService extends base_1.BaseService {
    allergyModel;
    studentModel;
    constructor(allergyModel, studentModel) {
        super("HealthRecordAllergyService");
        this.allergyModel = allergyModel;
        this.studentModel = studentModel;
    }
    async addAllergy(data) {
        const student = await this.studentModel.findByPk(data.studentId);
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const existingAllergy = await this.allergyModel.findOne({
            where: {
                studentId: data.studentId,
                allergen: data.allergen,
            },
        });
        if (existingAllergy) {
            throw new Error(`Allergy to ${data.allergen} already exists for this student`);
        }
        const allergyData = {
            ...data,
            verificationDate: data.verified ? new Date() : null,
        };
        const savedAllergy = await this.allergyModel.create(allergyData);
        const allergyWithRelations = await this.allergyModel.findByPk(savedAllergy.id, {
            include: [{ model: this.studentModel, as: 'student' }],
        });
        if (!allergyWithRelations) {
            throw new Error('Failed to reload allergy after creation');
        }
        if (data.severity === 'LIFE_THREATENING' || data.severity === 'SEVERE') {
            this.logWarning(`CRITICAL ALLERGY ADDED: ${data.allergen} (${data.severity}) for student ${student.firstName} ${student.lastName}`);
        }
        else {
            this.logInfo(`Allergy added: ${data.allergen} (${data.severity}) for ${student.firstName} ${student.lastName}`);
        }
        return allergyWithRelations;
    }
    async updateAllergy(id, data) {
        const existingAllergy = await this.allergyModel.findOne({
            where: { id },
            include: [{ model: this.studentModel, as: 'student' }],
        });
        if (!existingAllergy) {
            throw new common_1.NotFoundException('Allergy not found');
        }
        const updateData = { ...data };
        if (data.verified && !existingAllergy.verified) {
            updateData.verificationDate = new Date();
        }
        await existingAllergy.update(updateData);
        const allergyWithRelations = await this.allergyModel.findByPk(id, {
            include: [{ model: this.studentModel, as: 'student' }],
        });
        if (!allergyWithRelations) {
            throw new Error('Failed to reload allergy after update');
        }
        this.logInfo(`Allergy updated: ${allergyWithRelations.allergen} for ${allergyWithRelations.student.firstName} ${allergyWithRelations.student.lastName}`);
        return allergyWithRelations;
    }
    async getStudentAllergies(studentId) {
        const allergies = await this.allergyModel.findAll({
            where: { studentId },
            include: [{ model: this.studentModel, as: 'student' }],
            order: [
                ['severity', 'DESC'],
                ['allergen', 'ASC'],
            ],
        });
        this.logInfo(`PHI Access: Allergies retrieved for student ${studentId}, count: ${allergies.length}`);
        return allergies;
    }
    async deleteAllergy(id) {
        const allergy = await this.allergyModel.findOne({
            where: { id },
            include: [{ model: this.studentModel, as: 'student' }],
        });
        if (!allergy) {
            throw new common_1.NotFoundException('Allergy not found');
        }
        await this.allergyModel.destroy({ where: { id } });
        this.logWarning(`Allergy deleted: ${allergy.allergen} for ${allergy.student?.firstName} ${allergy.student?.lastName}`);
        return { success: true };
    }
};
exports.HealthRecordAllergyService = HealthRecordAllergyService;
exports.HealthRecordAllergyService = HealthRecordAllergyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Allergy)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.Student)),
    __metadata("design:paramtypes", [Object, Object])
], HealthRecordAllergyService);
//# sourceMappingURL=health-record-allergy.service.js.map