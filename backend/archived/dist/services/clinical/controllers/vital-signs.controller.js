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
exports.VitalSignsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const vital_signs_service_1 = require("../services/vital-signs.service");
const record_vitals_dto_1 = require("../dto/vitals/record-vitals.dto");
const update_vitals_dto_1 = require("../dto/vitals/update-vitals.dto");
const vitals_filters_dto_1 = require("../dto/vitals/vitals-filters.dto");
const base_1 = require("../../../common/base");
let VitalSignsController = class VitalSignsController extends base_1.BaseController {
    vitalsService;
    constructor(vitalsService) {
        super();
        this.vitalsService = vitalsService;
    }
    async record(recordDto) {
        return this.vitalsService.record(recordDto);
    }
    async findAll(filters) {
        return this.vitalsService.findAll(filters);
    }
    async findByStudent(studentId) {
        return this.vitalsService.findByStudent(studentId);
    }
    async getTrends(studentId, startDate, endDate) {
        return this.vitalsService.getTrends(studentId, new Date(startDate), new Date(endDate));
    }
    async findOne(id) {
        return this.vitalsService.findOne(id);
    }
    async update(id, updateDto) {
        return this.vitalsService.update(id, updateDto);
    }
    async remove(id) {
        await this.vitalsService.remove(id);
    }
};
exports.VitalSignsController = VitalSignsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Record vital signs',
        description: 'Records vital signs for a student during a clinical visit. Supports multiple vital sign types including blood pressure, temperature, heart rate, respiratory rate, oxygen saturation, height, weight, and BMI calculations.',
    }),
    (0, swagger_1.ApiBody)({ type: record_vitals_dto_1.RecordVitalsDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Vital signs recorded successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student or visit not found' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/vital-signs.model").VitalSigns }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [record_vitals_dto_1.RecordVitalsDto]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "record", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Query vital signs',
        description: 'Retrieves vital signs with optional filtering by student, date range, visit, or vital type. Supports pagination and sorting options.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'studentId',
        required: false,
        description: 'Filter by student ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'visitId',
        required: false,
        description: 'Filter by visit ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        description: 'Start date for filtering',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        description: 'End date for filtering',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'vitalType',
        required: false,
        description: 'Filter by vital sign type',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Vital signs retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vitals_filters_dto_1.VitalsFiltersDto]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get vital history for a student',
        description: 'Retrieves complete vital signs history for a student. Includes growth charts, vital trends, and abnormal readings flagged for clinical attention.',
    }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student UUID', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student vital history retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student not found' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/vital-signs.model").VitalSigns] }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Get)('student/:studentId/trends'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get vital trends for a student',
        description: 'Analyzes vital signs trends over time for a specific student. Provides growth velocity, percentile tracking, and identification of concerning patterns requiring clinical follow-up.',
    }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student UUID', format: 'uuid' }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        description: 'Start date for trend analysis',
        example: '2024-01-01',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        description: 'End date for trend analysis',
        example: '2024-12-31',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Vital trends retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid date range' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student not found' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/vital-signs.model").VitalSigns] }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "getTrends", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get vital signs by ID',
        description: 'Retrieves a specific vital signs record by its UUID. Returns detailed information including measurements, percentiles, and clinical flags.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Vital signs record UUID',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Vital signs record retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Vital signs record not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/vital-signs.model").VitalSigns }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update vital signs',
        description: 'Updates an existing vital signs record. Maintains audit trail of changes for clinical accuracy and compliance tracking.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Vital signs record UUID',
        format: 'uuid',
    }),
    (0, swagger_1.ApiBody)({ type: update_vitals_dto_1.UpdateVitalsDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Vital signs updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Vital signs record not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/vital-signs.model").VitalSigns }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_vitals_dto_1.UpdateVitalsDto]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete vital signs',
        description: 'Soft deletes a vital signs record. Record is retained for audit purposes but marked as deleted. Permanent deletion may be restricted by retention policies.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Vital signs record UUID',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Vital signs record deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Vital signs record not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "remove", null);
exports.VitalSignsController = VitalSignsController = __decorate([
    (0, swagger_1.ApiTags)('Clinical - Vital Signs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clinical/vital-signs'),
    __metadata("design:paramtypes", [vital_signs_service_1.VitalSignsService])
], VitalSignsController);
//# sourceMappingURL=vital-signs.controller.js.map