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
exports.MedicationInteractionService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../database/models");
const models_2 = require("../database/models");
const dto_1 = require("./dto");
const base_1 = require("../common/base");
const KNOWN_INTERACTIONS = {
    warfarin: [
        {
            severity: dto_1.InteractionSeverity.MAJOR,
            medication1: 'warfarin',
            medication2: 'aspirin',
            description: 'Increased risk of bleeding',
            recommendation: 'Monitor INR closely, consider alternative pain management',
        },
    ],
    metformin: [
        {
            severity: dto_1.InteractionSeverity.MODERATE,
            medication1: 'metformin',
            medication2: 'insulin',
            description: 'Increased risk of hypoglycemia',
            recommendation: 'Monitor blood glucose levels frequently',
        },
    ],
};
let MedicationInteractionService = class MedicationInteractionService extends base_1.BaseService {
    studentMedicationModel;
    constructor(studentMedicationModel) {
        super("MedicationInteractionService");
        this.studentMedicationModel = studentMedicationModel;
    }
    async checkStudentMedications(studentId) {
        try {
            const medications = await this.studentMedicationModel.findAll({
                where: { studentId, isActive: true },
                include: [{ model: models_2.Medication, as: 'medication' }],
            });
            const interactions = [];
            for (let i = 0; i < medications.length; i++) {
                for (let j = i + 1; j < medications.length; j++) {
                    const med1 = medications[i]?.medication?.name?.toLowerCase() ?? '';
                    const med2 = medications[j]?.medication?.name?.toLowerCase() ?? '';
                    const foundInteractions = this.findInteractions(med1, med2);
                    interactions.push(...foundInteractions);
                }
            }
            const hasInteractions = interactions.length > 0;
            const safetyScore = this.calculateSafetyScore(interactions);
            this.logInfo({
                message: 'Medication interaction check completed',
                studentId,
                medicationCount: medications.length,
                interactionCount: interactions.length,
            });
            return {
                hasInteractions,
                interactions,
                safetyScore,
            };
        }
        catch (error) {
            this.logError('Error checking medication interactions', {
                error,
                studentId,
            });
            throw error;
        }
    }
    async checkNewMedication(studentId, newMedicationName) {
        try {
            const existingMedications = await this.studentMedicationModel.findAll({
                where: { studentId, isActive: true },
                include: [{ model: models_2.Medication, as: 'medication' }],
            });
            const interactions = [];
            for (const existingMed of existingMedications) {
                const existingName = existingMed.medication?.name.toLowerCase() || '';
                const foundInteractions = this.findInteractions(newMedicationName.toLowerCase(), existingName);
                interactions.push(...foundInteractions);
            }
            const hasInteractions = interactions.length > 0;
            const safetyScore = this.calculateSafetyScore(interactions);
            this.logInfo({
                message: 'New medication interaction check completed',
                studentId,
                newMedication: newMedicationName,
                interactionCount: interactions.length,
            });
            return {
                hasInteractions,
                interactions,
                safetyScore,
            };
        }
        catch (error) {
            this.logError('Error checking new medication interactions', {
                error,
            });
            throw error;
        }
    }
    async getInteractionRecommendations(studentId) {
        try {
            const result = await this.checkStudentMedications(studentId);
            const recommendations = [];
            if (!result.hasInteractions) {
                recommendations.push('No significant drug interactions detected');
                return recommendations;
            }
            result.interactions.forEach((interaction) => {
                recommendations.push(`${interaction.medication1} + ${interaction.medication2}: ${interaction.recommendation}`);
            });
            if (result.safetyScore < 70) {
                recommendations.push('URGENT: Consult with pharmacist or physician regarding medication regimen');
            }
            return recommendations;
        }
        catch (error) {
            this.logError('Error getting interaction recommendations', { error });
            throw error;
        }
    }
    findInteractions(med1, med2) {
        const interactions = [];
        if (KNOWN_INTERACTIONS[med1]) {
            const matches = KNOWN_INTERACTIONS[med1].filter((i) => i.medication2.toLowerCase() === med2);
            interactions.push(...matches);
        }
        if (KNOWN_INTERACTIONS[med2]) {
            const matches = KNOWN_INTERACTIONS[med2].filter((i) => i.medication2.toLowerCase() === med1);
            interactions.push(...matches);
        }
        return interactions;
    }
    calculateSafetyScore(interactions) {
        if (interactions.length === 0)
            return 100;
        const severityScores = {
            [dto_1.InteractionSeverity.MINOR]: 5,
            [dto_1.InteractionSeverity.MODERATE]: 15,
            [dto_1.InteractionSeverity.MAJOR]: 30,
            [dto_1.InteractionSeverity.CONTRAINDICATED]: 50,
        };
        let totalDeduction = 0;
        interactions.forEach((interaction) => {
            totalDeduction += severityScores[interaction.severity] || 0;
        });
        return Math.max(0, 100 - totalDeduction);
    }
};
exports.MedicationInteractionService = MedicationInteractionService;
exports.MedicationInteractionService = MedicationInteractionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.StudentMedication)),
    __metadata("design:paramtypes", [Object])
], MedicationInteractionService);
//# sourceMappingURL=medication-interaction.service.js.map