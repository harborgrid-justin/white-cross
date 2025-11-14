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
exports.DrugInteractionManagementController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const drug_interaction_service_1 = require("../services/drug-interaction.service");
const interaction_check_dto_1 = require("../dto/drug/interaction-check.dto");
const add_interaction_dto_1 = require("../dto/drug/add-interaction.dto");
const update_interaction_dto_1 = require("../dto/drug/update-interaction.dto");
const base_1 = require("../../../common/base");
let DrugInteractionManagementController = class DrugInteractionManagementController extends base_1.BaseController {
    drugInteractionService;
    constructor(drugInteractionService) {
        super();
        this.drugInteractionService = drugInteractionService;
    }
    async checkInteractions(interactionCheckDto) {
        return this.drugInteractionService.checkInteractions(interactionCheckDto);
    }
    async addInteraction(addInteractionDto) {
        return this.drugInteractionService.addInteraction(addInteractionDto);
    }
    async updateInteraction(id, updateInteractionDto) {
        return this.drugInteractionService.updateInteraction(id, updateInteractionDto);
    }
    async deleteInteraction(id) {
        await this.drugInteractionService.deleteInteraction(id);
    }
    async getDrugInteractions(drugId) {
        return this.drugInteractionService.getDrugInteractions(drugId);
    }
    async getInteractionStatistics() {
        return this.drugInteractionService.getInteractionStatistics();
    }
};
exports.DrugInteractionManagementController = DrugInteractionManagementController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Check drug interactions", summary: 'Check drug-drug interactions and allergies',
        description: 'Performs pairwise interaction checking and calculates overall risk level' }),
    (0, common_1.Post)('interactions/check'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Interaction check completed successfully',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interaction_check_dto_1.InteractionCheckDto]),
    __metadata("design:returntype", Promise)
], DrugInteractionManagementController.prototype, "checkInteractions", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Add drug interaction", summary: 'Add a drug-drug interaction' }),
    (0, common_1.Post)('interactions'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Interaction created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Interaction already exists' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/drug-interaction.model").DrugInteraction }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_interaction_dto_1.AddInteractionDto]),
    __metadata("design:returntype", Promise)
], DrugInteractionManagementController.prototype, "addInteraction", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update drug interaction", summary: 'Update drug interaction' }),
    (0, common_1.Patch)('interactions/:id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Interaction ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Interaction updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Interaction not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/drug-interaction.model").DrugInteraction }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_interaction_dto_1.UpdateInteractionDto]),
    __metadata("design:returntype", Promise)
], DrugInteractionManagementController.prototype, "updateInteraction", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete drug interaction", summary: 'Delete drug interaction' }),
    (0, common_1.Delete)('interactions/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Interaction ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Interaction deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Interaction not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DrugInteractionManagementController.prototype, "deleteInteraction", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get all interactions for a drug", summary: 'Get all interactions for a specific drug' }),
    (0, common_1.Get)(':drugId/interactions'),
    (0, swagger_1.ApiParam)({ name: 'drugId', description: 'Drug ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Interactions found successfully' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('drugId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DrugInteractionManagementController.prototype, "getDrugInteractions", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get interaction statistics", summary: 'Get drug interaction statistics' }),
    (0, common_1.Get)('interactions/statistics/summary'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DrugInteractionManagementController.prototype, "getInteractionStatistics", null);
exports.DrugInteractionManagementController = DrugInteractionManagementController = __decorate([
    (0, swagger_1.ApiTags)('Clinical - Drug Interactions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clinical/drugs'),
    __metadata("design:paramtypes", [drug_interaction_service_1.DrugInteractionService])
], DrugInteractionManagementController);
//# sourceMappingURL=drug-interaction-management.controller.js.map