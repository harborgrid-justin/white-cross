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
exports.ClinicalProtocolQueryController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const clinical_protocol_service_1 = require("../services/clinical-protocol.service");
const protocol_filters_dto_1 = require("../dto/protocol/protocol-filters.dto");
const base_1 = require("../../../common/base");
let ClinicalProtocolQueryController = class ClinicalProtocolQueryController extends base_1.BaseController {
    protocolService;
    constructor(protocolService) {
        super();
        this.protocolService = protocolService;
    }
    async findAll(filters) {
        return this.protocolService.findAll(filters);
    }
    async getActive() {
        return this.protocolService.getActiveProtocols();
    }
    async findOne(id) {
        return this.protocolService.findOne(id);
    }
};
exports.ClinicalProtocolQueryController = ClinicalProtocolQueryController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Query clinical protocols',
        description: 'Retrieves clinical protocols with filtering and pagination.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        type: String,
        description: 'Filter by protocol category',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        type: String,
        description: 'Filter by protocol status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        type: String,
        description: 'Text search across protocol names and descriptions',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'createdBy',
        required: false,
        type: String,
        description: 'Filter by creator ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number for pagination (default: 1)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of protocols per page (default: 20)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Clinical protocols retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [protocol_filters_dto_1.ProtocolFiltersDto]),
    __metadata("design:returntype", Promise)
], ClinicalProtocolQueryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all active protocols',
        description: 'Retrieves all currently active clinical protocols.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Active protocols retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/clinical-protocol.model").ClinicalProtocol] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClinicalProtocolQueryController.prototype, "getActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get protocol by ID',
        description: 'Retrieves detailed information for a specific clinical protocol.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: 'string',
        description: 'Protocol unique identifier',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Protocol details retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/clinical-protocol.model").ClinicalProtocol }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClinicalProtocolQueryController.prototype, "findOne", null);
exports.ClinicalProtocolQueryController = ClinicalProtocolQueryController = __decorate([
    (0, swagger_1.ApiTags)('Clinical - Protocols'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clinical/protocols'),
    __metadata("design:paramtypes", [clinical_protocol_service_1.ClinicalProtocolService])
], ClinicalProtocolQueryController);
//# sourceMappingURL=clinical-protocol-query.controller.js.map