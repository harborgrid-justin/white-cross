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
exports.DrugCatalogController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const drug_interaction_service_1 = require("../services/drug-interaction.service");
const drug_search_dto_1 = require("../dto/drug/drug-search.dto");
const add_drug_dto_1 = require("../dto/drug/add-drug.dto");
const update_drug_dto_1 = require("../dto/drug/update-drug.dto");
const base_1 = require("../../../common/base");
let DrugCatalogController = class DrugCatalogController extends base_1.BaseController {
    drugInteractionService;
    constructor(drugInteractionService) {
        super();
        this.drugInteractionService = drugInteractionService;
    }
    async searchDrugs(searchDto) {
        return this.drugInteractionService.searchDrugs(searchDto.query, searchDto.limit);
    }
    async getDrugById(id) {
        return this.drugInteractionService.getDrugById(id);
    }
    async getDrugByRxNorm(code) {
        return this.drugInteractionService.searchByRxNorm(code);
    }
    async addDrug(addDrugDto) {
        return this.drugInteractionService.addDrug(addDrugDto);
    }
    async updateDrug(id, updateDrugDto) {
        return this.drugInteractionService.updateDrug(id, updateDrugDto);
    }
    async getDrugsByClass(drugClass) {
        return this.drugInteractionService.getDrugsByClass(drugClass);
    }
    async getControlledSubstances(schedule) {
        return this.drugInteractionService.getControlledSubstances(schedule);
    }
    async bulkImportDrugs(drugs) {
        return this.drugInteractionService.bulkImportDrugs(drugs);
    }
};
exports.DrugCatalogController = DrugCatalogController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Search drugs by name or brand", summary: 'Search drugs by name or brand' }),
    (0, common_1.Post)('search'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Drugs found successfully' }),
    openapi.ApiResponse({ status: 201, type: [require("../../../database/models/drug-catalog.model").DrugCatalog] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [drug_search_dto_1.DrugSearchDto]),
    __metadata("design:returntype", Promise)
], DrugCatalogController.prototype, "searchDrugs", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get drug by ID", summary: 'Get drug by ID' }),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Drug ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Drug found successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Drug not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/drug-catalog.model").DrugCatalog }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DrugCatalogController.prototype, "getDrugById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get drug by RxNorm code", summary: 'Get drug by RxNorm code' }),
    (0, common_1.Get)('rxnorm/:code'),
    (0, swagger_1.ApiParam)({ name: 'code', description: 'RxNorm code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Drug found successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Drug not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/drug-catalog.model").DrugCatalog }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DrugCatalogController.prototype, "getDrugByRxNorm", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Add new drug to catalog", summary: 'Add new drug to catalog' }),
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Drug created successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/drug-catalog.model").DrugCatalog }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_drug_dto_1.AddDrugDto]),
    __metadata("design:returntype", Promise)
], DrugCatalogController.prototype, "addDrug", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update drug information", summary: 'Update drug information' }),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Drug ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Drug updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Drug not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/drug-catalog.model").DrugCatalog }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_drug_dto_1.UpdateDrugDto]),
    __metadata("design:returntype", Promise)
], DrugCatalogController.prototype, "updateDrug", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get drugs by class", summary: 'Get drugs by classification' }),
    (0, common_1.Get)('class/:drugClass'),
    (0, swagger_1.ApiParam)({
        name: 'drugClass',
        description: 'Drug class (e.g., NSAID, antibiotic)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Drugs found successfully' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/drug-catalog.model").DrugCatalog] }),
    __param(0, (0, common_1.Param)('drugClass')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DrugCatalogController.prototype, "getDrugsByClass", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get controlled substances", summary: 'Get controlled substances' }),
    (0, common_1.Get)('controlled/substances'),
    (0, swagger_1.ApiQuery)({
        name: 'schedule',
        required: false,
        description: 'Controlled substance schedule (I-V)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Controlled substances found successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/drug-catalog.model").DrugCatalog] }),
    __param(0, (0, common_1.Query)('schedule')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DrugCatalogController.prototype, "getControlledSubstances", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Bulk import drugs", summary: 'Bulk import drugs from FDA data',
        description: 'Import multiple drugs at once with duplicate detection' }),
    (0, common_1.Post)('bulk-import'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Bulk import completed' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], DrugCatalogController.prototype, "bulkImportDrugs", null);
exports.DrugCatalogController = DrugCatalogController = __decorate([
    (0, swagger_1.ApiTags)('Clinical - Drug Catalog'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clinical/drugs'),
    __metadata("design:paramtypes", [drug_interaction_service_1.DrugInteractionService])
], DrugCatalogController);
//# sourceMappingURL=drug-catalog.controller.js.map