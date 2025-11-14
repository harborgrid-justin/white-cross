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
exports.PrescriptionController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prescription_service_1 = require("../services/prescription.service");
const create_prescription_dto_1 = require("../dto/prescription/create-prescription.dto");
const update_prescription_dto_1 = require("../dto/prescription/update-prescription.dto");
const fill_prescription_dto_1 = require("../dto/prescription/fill-prescription.dto");
const prescription_filters_dto_1 = require("../dto/prescription/prescription-filters.dto");
const base_1 = require("../../../common/base");
let PrescriptionController = class PrescriptionController extends base_1.BaseController {
    prescriptionService;
    constructor(prescriptionService) {
        super();
        this.prescriptionService = prescriptionService;
    }
    async create(createDto) {
        return this.prescriptionService.create(createDto);
    }
    async findAll(filters) {
        return this.prescriptionService.findAll(filters);
    }
    async findOne(id) {
        return this.prescriptionService.findOne(id);
    }
    async findByStudent(studentId) {
        return this.prescriptionService.findByStudent(studentId);
    }
    async findActiveByStudent(studentId) {
        return this.prescriptionService.findActiveByStudent(studentId);
    }
    async update(id, updateDto) {
        return this.prescriptionService.update(id, updateDto);
    }
    async fill(id, fillDto) {
        return this.prescriptionService.fill(id, fillDto);
    }
    async markPickedUp(id) {
        return this.prescriptionService.markPickedUp(id);
    }
    async cancel(id) {
        return this.prescriptionService.cancel(id);
    }
    async remove(id) {
        await this.prescriptionService.remove(id);
    }
};
exports.PrescriptionController = PrescriptionController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create prescription' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Prescription created successfully',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: require("../../../database/models/prescription.model").Prescription }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_prescription_dto_1.CreatePrescriptionDto]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Query prescriptions' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Prescriptions retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [prescription_filters_dto_1.PrescriptionFiltersDto]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get prescription by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Prescription retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prescription not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/prescription.model").Prescription }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get prescriptions for a student' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Prescriptions retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/prescription.model").Prescription] }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Get)('student/:studentId/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active prescriptions for a student' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Active prescriptions retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/prescription.model").Prescription] }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "findActiveByStudent", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update prescription' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Prescription updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prescription not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/prescription.model").Prescription }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_prescription_dto_1.UpdatePrescriptionDto]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/fill'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Fill prescription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription filled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prescription not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("../../../database/models/prescription.model").Prescription }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fill_prescription_dto_1.FillPrescriptionDto]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "fill", null);
__decorate([
    (0, common_1.Patch)(':id/mark-picked-up'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Mark prescription as picked up' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Prescription marked as picked up successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prescription not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("../../../database/models/prescription.model").Prescription }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "markPickedUp", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel prescription' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Prescription cancelled successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prescription not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("../../../database/models/prescription.model").Prescription }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete prescription' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Prescription deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prescription not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "remove", null);
exports.PrescriptionController = PrescriptionController = __decorate([
    (0, swagger_1.ApiTags)('Clinical - Prescriptions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clinical/prescriptions'),
    __metadata("design:paramtypes", [prescription_service_1.PrescriptionService])
], PrescriptionController);
//# sourceMappingURL=prescription.controller.js.map