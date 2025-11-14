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
exports.HealthRecordCrudController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../services/auth");
const health_record_service_1 = require("../health-record.service");
const create_health_record_dto_1 = require("../dto/create-health-record.dto");
const update_health_record_dto_1 = require("../dto/update-health-record.dto");
const health_record_audit_interceptor_1 = require("../interceptors/health-record-audit.interceptor");
const health_record_cache_interceptor_1 = require("../interceptors/health-record-cache.interceptor");
const health_record_rate_limit_guard_1 = require("../guards/health-record-rate-limit.guard");
const base_1 = require("../../common/base");
let HealthRecordCrudController = class HealthRecordCrudController extends base_1.BaseController {
    healthRecordService;
    constructor(healthRecordService) {
        super();
        this.healthRecordService = healthRecordService;
    }
    async findAll(page, limit, type, studentId, dateFrom, dateTo, provider) {
        const filters = {};
        if (type)
            filters.type = type;
        if (studentId)
            filters.studentId = studentId;
        if (provider)
            filters.provider = provider;
        if (dateFrom)
            filters.dateFrom = new Date(dateFrom);
        if (dateTo)
            filters.dateTo = new Date(dateTo);
        const result = await this.healthRecordService.getAllHealthRecords(page || 1, limit || 20, filters);
        return {
            data: result.records,
            meta: {
                pagination: result.pagination,
                filters,
            },
        };
    }
    async create(createDto) {
        return this.healthRecordService.createHealthRecord(createDto);
    }
    async findByStudent(studentId) {
        return this.healthRecordService.getHealthRecord(studentId);
    }
    async findOne(id) {
        const record = await this.healthRecordService.getHealthRecordById(id);
        return {
            data: record,
            meta: {
                recordId: id,
                timestamp: new Date().toISOString(),
            },
        };
    }
    async update(id, updateDto) {
        return this.healthRecordService.updateHealthRecord(id, updateDto);
    }
    async remove(id) {
        await this.healthRecordService.deleteHealthRecord(id);
    }
    async getHealthSummary(studentId) {
        return this.healthRecordService.getCompleteHealthProfile(studentId);
    }
};
exports.HealthRecordCrudController = HealthRecordCrudController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get all health records with optional filtering and pagination", summary: 'Get all health records',
        description: 'Retrieves all health records across all students with optional filtering and pagination.' }),
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Number of records per page',
        example: 20,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        description: 'Filter by record type',
        example: 'VACCINATION',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'studentId',
        required: false,
        description: 'Filter by student ID',
        format: 'uuid',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateFrom',
        required: false,
        description: 'Filter records from this date (ISO string)',
        example: '2024-01-01T00:00:00.000Z',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dateTo',
        required: false,
        description: 'Filter records to this date (ISO string)',
        example: '2024-12-31T23:59:59.999Z',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'provider',
        required: false,
        description: 'Filter by provider name',
        example: 'Dr. Smith',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health records retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('studentId')),
    __param(4, (0, common_1.Query)('dateFrom')),
    __param(5, (0, common_1.Query)('dateTo')),
    __param(6, (0, common_1.Query)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], HealthRecordCrudController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create a new health record", summary: 'Create health record',
        description: 'Creates a new health record entry for a student. Can include visit notes, diagnoses, treatments, and medications.' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({ type: create_health_record_dto_1.HealthRecordCreateDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Health record created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data (validation errors)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: require("../../database/models/health-record.model").HealthRecord }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_health_record_dto_1.HealthRecordCreateDto]),
    __metadata("design:returntype", Promise)
], HealthRecordCrudController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get all health records for a student", summary: 'Get student health records',
        description: 'Retrieves all health records for a specific student with optional filtering.' }),
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health records retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/health-record.model").HealthRecord }),
    __param(0, (0, common_1.Param)('studentId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthRecordCrudController.prototype, "findByStudent", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get specific health record by ID", summary: 'Get health record by ID',
        description: 'Retrieves a specific health record by its UUID.' }),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Health record UUID',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health record retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Health record not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthRecordCrudController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update health record", summary: 'Update health record',
        description: 'Updates an existing health record.' }),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Health record UUID',
        format: 'uuid',
    }),
    (0, swagger_1.ApiBody)({ type: update_health_record_dto_1.HealthRecordUpdateDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health record updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data (validation errors)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Health record not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/health-record.model").HealthRecord }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_health_record_dto_1.HealthRecordUpdateDto]),
    __metadata("design:returntype", Promise)
], HealthRecordCrudController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete health record (soft delete)", summary: 'Delete health record',
        description: 'Soft deletes a health record for compliance.' }),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Health record UUID',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Health record deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Health record not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthRecordCrudController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get student health summary", summary: 'Get health summary',
        description: 'Retrieves comprehensive health summary including recent visits, conditions, medications, and allergies.' }),
    (0, common_1.Get)('student/:studentId/summary'),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health summary retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('studentId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthRecordCrudController.prototype, "getHealthSummary", null);
exports.HealthRecordCrudController = HealthRecordCrudController = __decorate([
    (0, swagger_1.ApiTags)('Health Records'),
    (0, common_1.Controller)('health-records'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, health_record_rate_limit_guard_1.HealthRecordRateLimitGuard),
    (0, common_1.UseInterceptors)(health_record_audit_interceptor_1.HealthRecordAuditInterceptor, health_record_cache_interceptor_1.HealthRecordCacheInterceptor),
    __metadata("design:paramtypes", [health_record_service_1.HealthRecordService])
], HealthRecordCrudController);
//# sourceMappingURL=health-record-crud.controller.js.map