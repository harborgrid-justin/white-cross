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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationAdministrationCoreController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const administration_filters_dto_1 = require("../dto/administration/administration-filters.dto");
const five_rights_verification_dto_1 = require("../dto/administration/five-rights-verification.dto");
const record_administration_dto_1 = require("../dto/administration/record-administration.dto");
const base_1 = require("../../../common/base");
let MedicationAdministrationCoreController = class MedicationAdministrationCoreController extends base_1.BaseController {
    constructor() {
        super();
    }
    async initiateAdministration(dto) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async verifyFiveRights(dto) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async recordAdministration(dto) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async getAdministrationRecord(id) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async updateAdministrationRecord(id, updateDto) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async deleteAdministrationRecord(id) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async batchRecordAdministrations(batch) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
};
exports.MedicationAdministrationCoreController = MedicationAdministrationCoreController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Initiate administration session", summary: 'Initiate medication administration session',
        description: 'Creates an administration session with pre-loaded safety data.' }),
    (0, common_1.Post)('initiate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Administration session created successfully',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [record_administration_dto_1.InitiateAdministrationDto]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationCoreController.prototype, "initiateAdministration", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Verify Five Rights", summary: 'Verify Five Rights of medication administration',
        description: 'Performs server-side validation of the Five Rights.' }),
    (0, common_1.Post)('verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Five Rights verification completed',
        type: five_rights_verification_dto_1.FiveRightsVerificationResultDto,
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("../dto/administration/five-rights-verification.dto").FiveRightsVerificationResultDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [five_rights_verification_dto_1.VerifyFiveRightsDto]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationCoreController.prototype, "verifyFiveRights", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Record medication administration", summary: 'Record medication administration',
        description: 'Records actual medication administration after Five Rights verification passes.' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Medication administration recorded successfully',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [record_administration_dto_1.RecordAdministrationDto]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationCoreController.prototype, "recordAdministration", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get administration record by ID", summary: 'Get administration record by ID',
        description: 'Retrieves detailed administration record.' }),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Administration log ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Administration record retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationCoreController.prototype, "getAdministrationRecord", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update administration record", summary: 'Update administration record',
        description: 'Updates administration record. Only certain fields can be modified.' }),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Administration log ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Administration record updated successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof administration_filters_dto_1.UpdateAdministrationDto !== "undefined" && administration_filters_dto_1.UpdateAdministrationDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationCoreController.prototype, "updateAdministrationRecord", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete administration record", summary: 'Delete administration record',
        description: 'Soft deletes an administration record.' }),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Administration log ID' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Administration record deleted successfully',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationCoreController.prototype, "deleteAdministrationRecord", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Batch record administrations", summary: 'Batch record multiple administrations',
        description: 'Records multiple medication administrations in a single transaction.' }),
    (0, common_1.Post)('batch'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Batch administrations recorded successfully',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationCoreController.prototype, "batchRecordAdministrations", null);
exports.MedicationAdministrationCoreController = MedicationAdministrationCoreController = __decorate([
    (0, swagger_1.ApiTags)('Medication Administration'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('medications/administrations'),
    __metadata("design:paramtypes", [])
], MedicationAdministrationCoreController);
//# sourceMappingURL=medication-administration-core.controller.js.map