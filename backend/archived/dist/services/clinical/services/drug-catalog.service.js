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
exports.DrugCatalogService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const drug_catalog_model_1 = require("../../../database/models/drug-catalog.model");
const base_1 = require("../../../common/base");
let DrugCatalogService = class DrugCatalogService extends base_1.BaseService {
    drugCatalogModel;
    constructor(drugCatalogModel) {
        super("DrugCatalogService");
        this.drugCatalogModel = drugCatalogModel;
    }
    async searchDrugs(query, limit = 20) {
        this.logInfo(`Searching drugs with query: ${query}`);
        return this.drugCatalogModel.findAll({
            where: {
                isActive: true,
                [sequelize_2.Op.or]: [
                    { genericName: { [sequelize_2.Op.iLike]: `%${query}%` } },
                    (0, sequelize_2.literal)(`'${query}' = ANY(brand_names)`),
                ],
            },
            limit,
        });
    }
    async searchByRxNorm(rxnormCode) {
        this.logInfo(`Searching drug by RxNorm code: ${rxnormCode}`);
        return this.drugCatalogModel.findOne({
            where: { rxnormCode },
        });
    }
    async getDrugById(id) {
        const drug = await this.drugCatalogModel.findByPk(id);
        if (!drug) {
            throw new common_1.NotFoundException(`Drug with ID ${id} not found`);
        }
        return drug;
    }
    async addDrug(data) {
        this.logInfo(`Adding new drug: ${data.genericName}`);
        try {
            return await this.drugCatalogModel.create({
                genericName: data.genericName,
                brandNames: data.brandNames || [],
                rxnormCode: data.rxnormCode,
                drugClass: data.drugClass,
                routeOfAdministration: data.routeOfAdministration,
                dosageForms: data.dosageForms || [],
                strengthsAvailable: data.strengthsAvailable || [],
                isControlledSubstance: data.isControlledSubstance || false,
                deaSchedule: data.deaSchedule,
                blackBoxWarnings: data.blackBoxWarnings || [],
                commonSideEffects: data.commonSideEffects || [],
                isActive: true,
            });
        }
        catch (error) {
            this.logError(`Failed to add drug: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    }
    async updateDrug(id, updates) {
        const drug = await this.getDrugById(id);
        Object.assign(drug, updates);
        await drug.save();
        return drug;
    }
    async getDrugsByClass(drugClass) {
        return this.drugCatalogModel.findAll({
            where: {
                drugClass: {
                    [sequelize_2.Op.iLike]: `%${drugClass}%`,
                },
                isActive: true,
            },
            order: [['genericName', 'ASC']],
        });
    }
    async getControlledSubstances(schedule) {
        const where = {
            controlledSubstanceSchedule: {
                [sequelize_2.Op.ne]: null,
            },
            isActive: true,
        };
        if (schedule) {
            where.controlledSubstanceSchedule = schedule;
        }
        return this.drugCatalogModel.findAll({
            where,
            order: [
                ['controlledSubstanceSchedule', 'ASC'],
                ['genericName', 'ASC'],
            ],
        });
    }
    async bulkImportDrugs(drugs) {
        this.logInfo(`Bulk importing ${drugs.length} drugs`);
        const result = {
            imported: 0,
            failed: 0,
            errors: [],
        };
        for (const drug of drugs) {
            try {
                if (drug.rxnormCode) {
                    const existing = await this.drugCatalogModel.findOne({
                        where: { rxnormCode: drug.rxnormCode },
                    });
                    if (existing) {
                        result.failed++;
                        result.errors.push(`Drug with RxNorm code ${drug.rxnormCode} already exists`);
                        continue;
                    }
                }
                await this.addDrug(drug);
                result.imported++;
            }
            catch (error) {
                result.failed++;
                result.errors.push(`Failed to import ${drug.genericName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        this.logInfo(`Bulk import complete: ${result.imported} imported, ${result.failed} failed`);
        return result;
    }
    async getTotalDrugCount() {
        return this.drugCatalogModel.count({
            where: { isActive: true },
        });
    }
    async deactivateDrug(id) {
        const drug = await this.getDrugById(id);
        drug.isActive = false;
        await drug.save();
        this.logInfo(`Deactivated drug: ${drug.genericName}`);
    }
    async reactivateDrug(id) {
        const drug = await this.drugCatalogModel.findByPk(id);
        if (!drug) {
            throw new common_1.NotFoundException(`Drug with ID ${id} not found`);
        }
        drug.isActive = true;
        await drug.save();
        this.logInfo(`Reactivated drug: ${drug.genericName}`);
    }
};
exports.DrugCatalogService = DrugCatalogService;
exports.DrugCatalogService = DrugCatalogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(drug_catalog_model_1.DrugCatalog)),
    __metadata("design:paramtypes", [Object])
], DrugCatalogService);
//# sourceMappingURL=drug-catalog.service.js.map