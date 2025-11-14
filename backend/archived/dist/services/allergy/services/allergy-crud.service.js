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
exports.AllergyCrudService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const allergy_model_1 = require("../models/allergy.model");
const models_1 = require("../../../database/models");
const base_1 = require("../../../common/base");
let AllergyCrudService = class AllergyCrudService extends base_1.BaseService {
    allergyModel;
    studentModel;
    constructor(allergyModel, studentModel) {
        super("AllergyCrudService");
        this.allergyModel = allergyModel;
        this.studentModel = studentModel;
    }
    async createAllergy(createAllergyDto) {
        const student = await this.studentModel.findByPk(createAllergyDto.studentId);
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${createAllergyDto.studentId} not found`);
        }
        const existingAllergy = await this.allergyModel.findOne({
            where: {
                studentId: createAllergyDto.studentId,
                allergen: createAllergyDto.allergen,
                isActive: true,
            },
        });
        if (existingAllergy) {
            throw new common_1.ConflictException(`Student already has an active allergy record for ${createAllergyDto.allergen}`);
        }
        const allergyData = {
            ...createAllergyDto,
            verifiedAt: createAllergyDto.verified ? new Date() : undefined,
        };
        const savedAllergy = await this.allergyModel.create(allergyData);
        this.logInfo(`Allergy created: ${savedAllergy.allergen} (${savedAllergy.severity}) for student ${savedAllergy.studentId}`);
        return (await this.allergyModel.findByPk(savedAllergy.id, {
            include: [{ model: models_1.Student, as: 'student' }],
        }));
    }
    async getAllergyById(id) {
        const allergy = await this.allergyModel.findByPk(id, {
            include: [{ model: models_1.Student, as: 'student' }],
        });
        if (!allergy) {
            throw new common_1.NotFoundException(`Allergy with ID ${id} not found`);
        }
        this.logInfo(`Allergy accessed: ID ${id}, Student ${allergy.studentId}`);
        return allergy;
    }
    async updateAllergy(id, updateAllergyDto) {
        const allergy = await this.allergyModel.findByPk(id, {
            include: [{ model: models_1.Student, as: 'student' }],
        });
        if (!allergy) {
            throw new common_1.NotFoundException(`Allergy with ID ${id} not found`);
        }
        const oldValues = {
            allergen: allergy.allergen,
            severity: allergy.severity,
            verified: allergy.verified,
        };
        const updateData = { ...updateAllergyDto };
        if (updateAllergyDto.verified && !allergy.verified) {
            updateData.verifiedAt = new Date();
        }
        await allergy.update(updateData);
        const updatedAllergy = allergy;
        this.logInfo(`Allergy updated: ${updatedAllergy.allergen} for student ${updatedAllergy.studentId}. ` +
            `Old values: ${JSON.stringify(oldValues)}`);
        const result = await this.allergyModel.findByPk(updatedAllergy.id, {
            include: [{ model: models_1.Student, as: 'student' }],
        });
        if (!result) {
            throw new common_1.NotFoundException(`Allergy with ID ${updatedAllergy.id} not found after update`);
        }
        return result;
    }
    async deactivateAllergy(id) {
        const allergy = await this.allergyModel.findByPk(id);
        if (!allergy) {
            throw new common_1.NotFoundException(`Allergy with ID ${id} not found`);
        }
        await allergy.update({ isActive: false });
        this.logInfo(`Allergy deactivated: ${allergy.allergen} for student ${allergy.studentId}`);
        return { success: true };
    }
    async deleteAllergy(id) {
        const allergy = await this.allergyModel.findByPk(id, {
            include: [{ model: models_1.Student, as: 'student' }],
        });
        if (!allergy) {
            throw new common_1.NotFoundException(`Allergy with ID ${id} not found`);
        }
        const auditData = {
            allergen: allergy.allergen,
            severity: allergy.severity,
            studentId: allergy.studentId,
            studentName: allergy.student
                ? `${allergy.student.firstName} ${allergy.student.lastName}`
                : 'Unknown',
        };
        await allergy.destroy();
        this.logWarning(`Allergy permanently deleted: ${auditData.allergen} for ${auditData.studentName}. ` +
            `Data: ${JSON.stringify(auditData)}`);
        return { success: true };
    }
};
exports.AllergyCrudService = AllergyCrudService;
exports.AllergyCrudService = AllergyCrudService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(allergy_model_1.Allergy)),
    __param(1, (0, sequelize_1.InjectModel)(models_1.Student)),
    __metadata("design:paramtypes", [Object, Object])
], AllergyCrudService);
//# sourceMappingURL=allergy-crud.service.js.map