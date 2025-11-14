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
exports.InteractionCheckerService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const drug_catalog_model_1 = require("../../../database/models/drug-catalog.model");
const drug_interaction_model_1 = require("../../../database/models/drug-interaction.model");
const student_drug_allergy_model_1 = require("../../../database/models/student-drug-allergy.model");
const base_1 = require("../../../common/base");
const drug_interaction_types_1 = require("../types/drug-interaction.types");
let InteractionCheckerService = class InteractionCheckerService extends base_1.BaseService {
    drugCatalogModel;
    drugInteractionModel;
    studentDrugAllergyModel;
    constructor(drugCatalogModel, drugInteractionModel, studentDrugAllergyModel) {
        super("InteractionCheckerService");
        this.drugCatalogModel = drugCatalogModel;
        this.drugInteractionModel = drugInteractionModel;
        this.studentDrugAllergyModel = studentDrugAllergyModel;
    }
    async checkInteractions(data) {
        this.logInfo(`Checking interactions for ${data.drugIds.length} drugs`);
        const result = {
            hasInteractions: false,
            interactions: [],
            allergies: [],
            riskLevel: 'NONE',
        };
        const drugs = await this.drugCatalogModel.findAll({
            where: {
                id: { [sequelize_2.Op.in]: data.drugIds },
            },
        });
        if (drugs.length < 2) {
            return result;
        }
        await this.checkPairwiseInteractions(drugs, result);
        if (data.studentId) {
            await this.checkStudentAllergies(data.studentId, data.drugIds, result);
        }
        result.riskLevel = this.calculateRiskLevel(result);
        this.logInfo(`Interaction check complete: ${result.riskLevel} risk level`);
        return result;
    }
    async checkPairwiseInteractions(drugs, result) {
        for (let i = 0; i < drugs.length; i++) {
            for (let j = i + 1; j < drugs.length; j++) {
                const drug1 = drugs[i];
                const drug2 = drugs[j];
                const interaction = await this.drugInteractionModel.findOne({
                    where: {
                        [sequelize_2.Op.or]: [
                            { drug1Id: drug1.id, drug2Id: drug2.id },
                            { drug1Id: drug2.id, drug2Id: drug1.id },
                        ],
                    },
                    include: [
                        { model: drug_catalog_model_1.DrugCatalog, as: 'drug1' },
                        { model: drug_catalog_model_1.DrugCatalog, as: 'drug2' },
                    ],
                });
                if (interaction) {
                    result.hasInteractions = true;
                    result.interactions.push({
                        drug1: {
                            id: drug1.id,
                            genericName: drug1.genericName,
                            brandNames: drug1.brandNames,
                        },
                        drug2: {
                            id: drug2.id,
                            genericName: drug2.genericName,
                            brandNames: drug2.brandNames,
                        },
                        severity: interaction.severity,
                        description: interaction.description,
                        clinicalEffects: interaction.clinicalEffects,
                        management: interaction.management,
                        references: interaction.references,
                    });
                }
            }
        }
    }
    async checkStudentAllergies(studentId, drugIds, result) {
        const allergies = await this.studentDrugAllergyModel.findAll({
            where: {
                studentId,
                drugId: { [sequelize_2.Op.in]: drugIds },
            },
            include: [{ model: drug_catalog_model_1.DrugCatalog, as: 'drug' }],
        });
        if (allergies.length > 0) {
            result.hasInteractions = true;
            result.allergies = allergies
                .filter((allergy) => allergy.drug != null)
                .map((allergy) => ({
                drug: {
                    id: allergy.drug.id,
                    genericName: allergy.drug.genericName,
                    brandNames: allergy.drug.brandNames,
                },
                allergyType: allergy.allergyType,
                reaction: allergy.reaction,
                severity: allergy.severity,
            }));
        }
    }
    calculateRiskLevel(result) {
        if (!result.hasInteractions) {
            return 'NONE';
        }
        const hasCritical = result.interactions.some((i) => i.severity === drug_interaction_types_1.InteractionSeverity.CONTRAINDICATED);
        if (hasCritical) {
            return 'CRITICAL';
        }
        const hasMajor = result.interactions.some((i) => i.severity === drug_interaction_types_1.InteractionSeverity.MAJOR);
        if (hasMajor) {
            return 'HIGH';
        }
        const hasModerate = result.interactions.some((i) => i.severity === drug_interaction_types_1.InteractionSeverity.MODERATE);
        if (hasModerate) {
            return 'MODERATE';
        }
        if (result.allergies && result.allergies.length > 0) {
            const hasSevereAllergy = result.allergies.some((a) => a.severity === 'SEVERE' || a.severity === 'LIFE_THREATENING');
            if (hasSevereAllergy) {
                return 'CRITICAL';
            }
            return 'HIGH';
        }
        return 'LOW';
    }
    async getDrugInteractions(drugId) {
        const interactions = await this.drugInteractionModel.findAll({
            where: {
                [sequelize_2.Op.or]: [{ drug1Id: drugId }, { drug2Id: drugId }],
            },
            include: [
                { model: drug_catalog_model_1.DrugCatalog, as: 'drug1' },
                { model: drug_catalog_model_1.DrugCatalog, as: 'drug2' },
            ],
        });
        return interactions.map((interaction) => {
            const interactingDrug = interaction.drug1Id === drugId ? interaction.drug2 : interaction.drug1;
            return {
                interactingDrug,
                severity: interaction.severity,
                description: interaction.description,
                clinicalEffects: interaction.clinicalEffects,
                management: interaction.management,
            };
        });
    }
    async validateDrugCombination(drugIds) {
        const result = await this.checkInteractions({ drugIds });
        const validation = {
            isSafe: result.riskLevel === 'NONE' || result.riskLevel === 'LOW',
            warnings: [],
            criticalIssues: [],
        };
        const moderateInteractions = result.interactions.filter((i) => i.severity === drug_interaction_types_1.InteractionSeverity.MODERATE);
        if (moderateInteractions.length > 0) {
            validation.warnings.push(`${moderateInteractions.length} moderate drug interactions detected`);
        }
        const criticalInteractions = result.interactions.filter((i) => i.severity === drug_interaction_types_1.InteractionSeverity.MAJOR ||
            i.severity === drug_interaction_types_1.InteractionSeverity.CONTRAINDICATED);
        if (criticalInteractions.length > 0) {
            validation.criticalIssues.push(`${criticalInteractions.length} major/critical drug interactions detected`);
            validation.isSafe = false;
        }
        if (result.allergies && result.allergies.length > 0) {
            const severeAllergies = result.allergies.filter((a) => a.severity === 'SEVERE' || a.severity === 'LIFE_THREATENING');
            if (severeAllergies.length > 0) {
                validation.criticalIssues.push(`${severeAllergies.length} severe allergies detected`);
                validation.isSafe = false;
            }
            else {
                validation.warnings.push(`${result.allergies.length} allergies detected`);
            }
        }
        return validation;
    }
};
exports.InteractionCheckerService = InteractionCheckerService;
exports.InteractionCheckerService = InteractionCheckerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(drug_catalog_model_1.DrugCatalog)),
    __param(1, (0, sequelize_1.InjectModel)(drug_interaction_model_1.DrugInteraction)),
    __param(2, (0, sequelize_1.InjectModel)(student_drug_allergy_model_1.StudentDrugAllergy)),
    __metadata("design:paramtypes", [Object, Object, Object])
], InteractionCheckerService);
//# sourceMappingURL=interaction-checker.service.js.map