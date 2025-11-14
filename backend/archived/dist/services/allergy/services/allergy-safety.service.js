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
exports.AllergySafetyService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const allergy_model_1 = require("../models/allergy.model");
const models_1 = require("../../../database/models");
const enums_1 = require("../../../common/enums");
const allergy_crud_service_1 = require("./allergy-crud.service");
const base_1 = require("../../../common/base");
let AllergySafetyService = class AllergySafetyService extends base_1.BaseService {
    allergyModel;
    allergyCrudService;
    constructor(allergyModel, allergyCrudService) {
        super("AllergySafetyService");
        this.allergyModel = allergyModel;
        this.allergyCrudService = allergyCrudService;
    }
    async verifyAllergy(id, verifiedBy) {
        const updatedAllergy = await this.allergyCrudService.updateAllergy(id, {
            verified: true,
            verifiedBy,
        });
        this.logInfo(`Allergy verified: ID ${id} by healthcare professional ${verifiedBy}`);
        return updatedAllergy;
    }
    async checkDrugAllergyConflict(studentId, medicationName, medicationClass) {
        const allergies = await this.allergyModel.findAll({
            where: {
                studentId,
                isActive: true,
            },
            include: [{ model: models_1.Student, as: 'student' }],
        });
        if (allergies.length === 0) {
            return {
                hasConflict: false,
                conflictingAllergies: [],
                riskLevel: 'NONE',
                recommendation: 'No known allergies. Proceed with administration.',
            };
        }
        const conflictingAllergies = [];
        const medicationLower = medicationName.toLowerCase();
        const medicationClassLower = medicationClass?.toLowerCase();
        for (const allergy of allergies) {
            const allergenLower = allergy.allergen.toLowerCase();
            if (allergenLower === medicationLower) {
                conflictingAllergies.push(allergy);
                continue;
            }
            if (medicationLower.includes(allergenLower) ||
                allergenLower.includes(medicationLower)) {
                conflictingAllergies.push(allergy);
                continue;
            }
            if (medicationClassLower &&
                (allergenLower.includes(medicationClassLower) ||
                    medicationClassLower.includes(allergenLower))) {
                conflictingAllergies.push(allergy);
                continue;
            }
        }
        if (conflictingAllergies.length === 0) {
            return {
                hasConflict: false,
                conflictingAllergies: [],
                riskLevel: 'NONE',
                recommendation: 'No allergy conflicts detected. Proceed with caution.',
            };
        }
        const severities = conflictingAllergies.map((a) => a.severity);
        let riskLevel = 'LOW';
        if (severities.includes(enums_1.AllergySeverity.LIFE_THREATENING)) {
            riskLevel = 'LIFE_THREATENING';
        }
        else if (severities.includes(enums_1.AllergySeverity.SEVERE)) {
            riskLevel = 'SEVERE';
        }
        else if (severities.includes(enums_1.AllergySeverity.MODERATE)) {
            riskLevel = 'MODERATE';
        }
        let recommendation = '';
        if (riskLevel === 'LIFE_THREATENING') {
            recommendation = `CRITICAL ALERT: DO NOT ADMINISTER. Patient has life-threatening allergy to ${conflictingAllergies[0].allergen}. Contact physician immediately.`;
        }
        else if (riskLevel === 'SEVERE') {
            recommendation = `SEVERE ALERT: Do not administer without physician approval. Patient has severe allergy to ${conflictingAllergies[0].allergen}.`;
        }
        else if (riskLevel === 'MODERATE') {
            recommendation = `MODERATE ALERT: Consult healthcare professional before administering. Patient has moderate allergy to ${conflictingAllergies[0].allergen}.`;
        }
        else {
            recommendation = `CAUTION: Patient has reported allergy to ${conflictingAllergies[0].allergen}. Monitor for reactions.`;
        }
        this.logError(`DRUG-ALLERGY CONFLICT DETECTED: Student ${studentId}, ` +
            `Medication: ${medicationName}, Risk Level: ${riskLevel}, ` +
            `Conflicting Allergies: ${conflictingAllergies.map((a) => a.allergen).join(', ')}`);
        return {
            hasConflict: true,
            conflictingAllergies,
            riskLevel,
            recommendation,
        };
    }
    async bulkCreateAllergies(allergiesData) {
        const createdAllergies = [];
        for (const allergyData of allergiesData) {
            try {
                const allergy = await this.allergyCrudService.createAllergy(allergyData);
                createdAllergies.push(allergy);
            }
            catch (error) {
                this.logError(`Failed to create allergy for student ${allergyData.studentId}: ${error.message}`);
            }
        }
        this.logInfo(`Bulk allergy creation: ${createdAllergies.length} of ${allergiesData.length} allergies created`);
        return createdAllergies;
    }
    async validateBulkStudentIds(studentIds) {
        return {
            valid: true,
            invalidIds: [],
        };
    }
};
exports.AllergySafetyService = AllergySafetyService;
exports.AllergySafetyService = AllergySafetyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(allergy_model_1.Allergy)),
    __metadata("design:paramtypes", [Object, allergy_crud_service_1.AllergyCrudService])
], AllergySafetyService);
//# sourceMappingURL=allergy-safety.service.js.map