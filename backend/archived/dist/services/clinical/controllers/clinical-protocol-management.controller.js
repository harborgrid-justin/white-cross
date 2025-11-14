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
exports.ClinicalProtocolManagementController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const clinical_protocol_service_1 = require("../services/clinical-protocol.service");
const create_protocol_dto_1 = require("../dto/protocol/create-protocol.dto");
const update_protocol_dto_1 = require("../dto/protocol/update-protocol.dto");
const activate_protocol_dto_1 = require("../dto/protocol/activate-protocol.dto");
const base_1 = require("../../../common/base");
let ClinicalProtocolManagementController = class ClinicalProtocolManagementController extends base_1.BaseController {
    protocolService;
    constructor(protocolService) {
        super();
        this.protocolService = protocolService;
    }
    async create(createDto) {
        return this.protocolService.create(createDto);
    }
    async update(id, updateDto) {
        return this.protocolService.update(id, updateDto);
    }
    async activate(id, activateDto) {
        return this.protocolService.activate(id, activateDto);
    }
    async deactivate(id) {
        return this.protocolService.deactivate(id);
    }
    async remove(id) {
        await this.protocolService.remove(id);
    }
};
exports.ClinicalProtocolManagementController = ClinicalProtocolManagementController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create clinical protocol',
        description: 'Creates a new clinical protocol for standardized healthcare procedures.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Clinical protocol created successfully',
    }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/clinical-protocol.model").ClinicalProtocol }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_protocol_dto_1.CreateProtocolDto]),
    __metadata("design:returntype", Promise)
], ClinicalProtocolManagementController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update protocol' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/clinical-protocol.model").ClinicalProtocol }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_protocol_dto_1.UpdateProtocolDto]),
    __metadata("design:returntype", Promise)
], ClinicalProtocolManagementController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/activate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Activate protocol',
        description: 'Activates a clinical protocol for immediate use.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: 'string',
        description: 'Protocol ID to activate',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Protocol activated successfully',
    }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/clinical-protocol.model").ClinicalProtocol }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, activate_protocol_dto_1.ActivateProtocolDto]),
    __metadata("design:returntype", Promise)
], ClinicalProtocolManagementController.prototype, "activate", null);
__decorate([
    (0, common_1.Post)(':id/deactivate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Deactivate protocol',
        description: 'Deactivates a clinical protocol.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: 'string',
        description: 'Protocol ID to deactivate',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Protocol deactivated successfully',
    }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/clinical-protocol.model").ClinicalProtocol }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClinicalProtocolManagementController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete protocol' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClinicalProtocolManagementController.prototype, "remove", null);
exports.ClinicalProtocolManagementController = ClinicalProtocolManagementController = __decorate([
    (0, swagger_1.ApiTags)('Clinical - Protocols'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clinical/protocols'),
    __metadata("design:paramtypes", [clinical_protocol_service_1.ClinicalProtocolService])
], ClinicalProtocolManagementController);
//# sourceMappingURL=clinical-protocol-management.controller.js.map