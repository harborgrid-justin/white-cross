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
exports.DrugInteractionService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const drug_interaction_model_1 = require("../../../database/models/drug-interaction.model");
const drug_catalog_service_1 = require("./drug-catalog.service");
const interaction_checker_service_1 = require("./interaction-checker.service");
const allergy_management_service_1 = require("./allergy-management.service");
const base_1 = require("../../../common/base");
let DrugInteractionService = class DrugInteractionService extends base_1.BaseService {
    drugInteractionModel;
    drugCatalogService;
    interactionChecker;
    allergyManager;
    constructor(drugInteractionModel, drugCatalogService, interactionChecker, allergyManager) {
        super("DrugInteractionService");
        this.drugInteractionModel = drugInteractionModel;
        this.drugCatalogService = drugCatalogService;
        this.interactionChecker = interactionChecker;
        this.allergyManager = allergyManager;
    }
    async searchDrugs(query, limit = 20) {
        return this.drugCatalogService.searchDrugs(query, limit);
    }
    async searchByRxNorm(rxnormCode) {
        return this.drugCatalogService.searchByRxNorm(rxnormCode);
    }
    async getDrugById(id) {
        return this.drugCatalogService.getDrugById(id);
    }
    async addDrug(data) {
        return this.drugCatalogService.addDrug(data);
    }
    async updateDrug(id, updates) {
        return this.drugCatalogService.updateDrug(id, updates);
    }
    async getDrugsByClass(drugClass) {
        return this.drugCatalogService.getDrugsByClass(drugClass);
    }
    async getControlledSubstances(schedule) {
        return this.drugCatalogService.getControlledSubstances(schedule);
    }
    async bulkImportDrugs(drugs) {
        return this.drugCatalogService.bulkImportDrugs(drugs);
    }
    async checkInteractions(data) {
        return this.interactionChecker.checkInteractions(data);
    }
    async getDrugInteractions(drugId) {
        return this.interactionChecker.getDrugInteractions(drugId);
    }
    async validateDrugCombination(drugIds) {
        return this.interactionChecker.validateDrugCombination(drugIds);
    }
    async addInteraction(data) {
        this.logInfo(`Adding interaction between drugs ${data.drug1Id} and ${data.drug2Id}`);
        await this.drugCatalogService.getDrugById(data.drug1Id);
        await this.drugCatalogService.getDrugById(data.drug2Id);
        if (data.drug1Id === data.drug2Id) {
            throw new common_1.ConflictException('Cannot create interaction with same drug');
        }
        const existing = await this.drugInteractionModel.findOne({
            where: {
                [this.drugInteractionModel.sequelize.Op.or]: [
                    { drug1Id: data.drug1Id, drug2Id: data.drug2Id },
                    { drug1Id: data.drug2Id, drug2Id: data.drug1Id },
                ],
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Interaction already exists');
        }
        return this.drugInteractionModel.create(data);
    }
    async updateInteraction(id, updates) {
        const interaction = await this.drugInteractionModel.findByPk(id);
        if (!interaction) {
            throw new common_1.NotFoundException('Interaction not found');
        }
        Object.assign(interaction, updates);
        await interaction.save();
        return interaction;
    }
    async deleteInteraction(id) {
        const deletedCount = await this.drugInteractionModel.destroy({
            where: { id },
        });
        if (deletedCount === 0) {
            throw new common_1.NotFoundException('Interaction not found');
        }
        this.logInfo(`Deleted interaction ${id}`);
    }
    async addAllergy(data) {
        return this.allergyManager.addAllergy(data);
    }
    async updateAllergy(id, updates) {
        return this.allergyManager.updateAllergy(id, updates);
    }
    async deleteAllergy(id) {
        return this.allergyManager.deleteAllergy(id);
    }
    async getStudentAllergies(studentId) {
        return this.allergyManager.getStudentAllergies(studentId);
    }
    async getInteractionStatistics() {
        const totalDrugs = await this.drugCatalogService.getTotalDrugCount();
        const interactions = await this.drugInteractionModel.findAll({
            include: [
                { model: this.drugCatalogService['drugCatalogModel'], as: 'drug1' },
                { model: this.drugCatalogService['drugCatalogModel'], as: 'drug2' },
            ],
        });
        const bySeverity = {};
        const drugInteractionCounts = new Map();
        for (const interaction of interactions) {
            bySeverity[interaction.severity] = (bySeverity[interaction.severity] || 0) + 1;
            for (const drug of [interaction.drug1, interaction.drug2]) {
                if (drug) {
                    const existing = drugInteractionCounts.get(drug.id);
                    if (existing) {
                        existing.count++;
                    }
                    else {
                        drugInteractionCounts.set(drug.id, { drug, count: 1 });
                    }
                }
            }
        }
        const topInteractingDrugs = Array.from(drugInteractionCounts.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
            .map((item) => ({
            drug: item.drug,
            interactionCount: item.count,
        }));
        return {
            totalDrugs,
            totalInteractions: interactions.length,
            bySeverity,
            topInteractingDrugs,
        };
    }
    async getAllergyStatistics() {
        return this.allergyManager.getAllergyStatistics();
    }
};
exports.DrugInteractionService = DrugInteractionService;
exports.DrugInteractionService = DrugInteractionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(drug_interaction_model_1.DrugInteraction)),
    __metadata("design:paramtypes", [Object, drug_catalog_service_1.DrugCatalogService,
        interaction_checker_service_1.InteractionCheckerService,
        allergy_management_service_1.AllergyManagementService])
], DrugInteractionService);
//# sourceMappingURL=drug-interaction.service.js.map