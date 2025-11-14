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
exports.HealthRecordMedicationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const medication_service_1 = require("./medication.service");
const create_medication_dto_1 = require("./dto/create-medication.dto");
const update_medication_dto_1 = require("./dto/update-medication.dto");
const models_1 = require("../../database/models");
const base_1 = require("../../common/base");
let HealthRecordMedicationController = class HealthRecordMedicationController extends base_1.BaseController {
    medicationService;
    constructor(medicationService) {
        super();
        this.medicationService = medicationService;
    }
    async create(createDto) {
        return this.medicationService.create(createDto);
    }
    async findAll(isActive, isControlled, search) {
        const options = {};
        if (isActive !== undefined) {
            options.isActive = isActive === 'true';
        }
        if (isControlled !== undefined) {
            options.isControlled = isControlled === 'true';
        }
        if (search) {
            options.search = search;
        }
        return this.medicationService.findAll(options);
    }
    async getControlledSubstances() {
        return this.medicationService.getControlledSubstances();
    }
    async getWitnessRequiredMedications() {
        return this.medicationService.getWitnessRequiredMedications();
    }
    async findById(id) {
        return this.medicationService.findById(id);
    }
    async update(id, updateDto) {
        return this.medicationService.update(id, updateDto);
    }
    async deactivate(id) {
        await this.medicationService.deactivate(id, 'system');
    }
    async reactivate(id) {
        return this.medicationService.reactivate(id);
    }
};
exports.HealthRecordMedicationController = HealthRecordMedicationController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new medication' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Medication created successfully',
        type: models_1.Medication,
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Medication with this NDC already exists',
    }),
    openapi.ApiResponse({ status: 201, type: require("../../database/models/medication.model").Medication }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_medication_dto_1.HealthRecordCreateMedicationDto]),
    __metadata("design:returntype", Promise)
], HealthRecordMedicationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all medications with optional filtering' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of medications',
        type: [models_1.Medication],
    }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'isControlled', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/medication.model").Medication] }),
    __param(0, (0, common_1.Query)('isActive')),
    __param(1, (0, common_1.Query)('isControlled')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], HealthRecordMedicationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('controlled'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all controlled substances' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of controlled medications',
        type: [models_1.Medication],
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/medication.model").Medication] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthRecordMedicationController.prototype, "getControlledSubstances", null);
__decorate([
    (0, common_1.Get)('witness-required'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get medications requiring witness for administration',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of medications requiring witness',
        type: [models_1.Medication],
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/medication.model").Medication] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthRecordMedicationController.prototype, "getWitnessRequiredMedications", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get medication by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Medication UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Medication details',
        type: models_1.Medication,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Medication not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/medication.model").Medication }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthRecordMedicationController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update medication' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Medication UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Medication updated successfully',
        type: models_1.Medication,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Medication not found' }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Medication with this NDC already exists',
    }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/medication.model").Medication }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_medication_dto_1.UpdateHealthRecordMedicationDto]),
    __metadata("design:returntype", Promise)
], HealthRecordMedicationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate medication (soft delete)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Medication UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Medication deactivated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Medication not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthRecordMedicationController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Post)(':id/reactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Reactivate medication' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Medication UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Medication reactivated successfully',
        type: models_1.Medication,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Medication not found' }),
    openapi.ApiResponse({ status: 201, type: require("../../database/models/medication.model").Medication }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthRecordMedicationController.prototype, "reactivate", null);
exports.HealthRecordMedicationController = HealthRecordMedicationController = __decorate([
    (0, swagger_1.ApiTags)('medications'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('medications'),
    __metadata("design:paramtypes", [medication_service_1.MedicationService])
], HealthRecordMedicationController);
//# sourceMappingURL=medication.controller.js.map