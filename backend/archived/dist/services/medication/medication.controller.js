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
exports.MedicationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const base_1 = require("../../common/base");
const health_record_audit_interceptor_1 = require("../../health-record/interceptors/health-record-audit.interceptor");
const medication_service_1 = require("./services/medication.service");
const create_medication_dto_1 = require("./dto/create-medication.dto");
const deactivate_medication_dto_1 = require("./dto/deactivate-medication.dto");
const list_medications_query_dto_1 = require("./dto/list-medications-query.dto");
const update_medication_dto_1 = require("./dto/update-medication.dto");
let MedicationController = class MedicationController extends base_1.BaseController {
    medicationService;
    constructor(medicationService) {
        super();
        this.medicationService = medicationService;
    }
    async list(query) {
        this.logInfo(`GET /medications - page=${query.page}, limit=${query.limit}, search=${query.search}`);
        return this.medicationService.getMedications(query);
    }
    async getStats() {
        this.logInfo('GET /medications/stats');
        return this.medicationService.getMedicationStats();
    }
    async create(createDto) {
        this.logInfo(`POST /medications - Creating medication: ${createDto.medicationName}`);
        return this.medicationService.createMedication(createDto);
    }
    async getById(id) {
        this.logInfo(`GET /medications/${id}`);
        return this.medicationService.getMedicationById(id);
    }
    async update(id, updateDto) {
        this.logInfo(`PUT /medications/${id}`);
        return this.medicationService.updateMedication(id, updateDto);
    }
    async deactivate(id, deactivateDto) {
        this.logInfo(`POST /medications/${id}/deactivate - Reason: ${deactivateDto.reason}`);
        return this.medicationService.deactivateMedication(id, deactivateDto);
    }
    async activate(id) {
        this.logInfo(`POST /medications/${id}/activate`);
        return this.medicationService.activateMedication(id);
    }
    async getByStudent(studentId, page = 1, limit = 20) {
        this.logInfo(`GET /medications/student/${studentId} - page=${page}, limit=${limit}`);
        return this.medicationService.getMedicationsByStudent(studentId, Number(page), Number(limit));
    }
};
exports.MedicationController = MedicationController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "List all medications with pagination and filtering", summary: 'Get all medications',
        description: 'Retrieve a paginated list of medications with optional filtering by search term, student ID, and active status. ' +
            'Supports full-text search on medication names. All access is logged for HIPAA compliance.' }),
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (default: 1)',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page (default: 20, max: 100)',
        example: 20,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        type: String,
        description: 'Search term for medication name (case-insensitive)',
        example: 'ibuprofen',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'studentId',
        required: false,
        type: String,
        description: 'Filter by student UUID',
        example: '660e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'isActive',
        required: false,
        type: Boolean,
        description: 'Filter by active status',
        example: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Medications retrieved successfully with pagination metadata',
        schema: {
            type: 'object',
            properties: {
                medications: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            name: { type: 'string' },
                            dosage: { type: 'string' },
                            frequency: { type: 'string' },
                            route: { type: 'string' },
                            prescribedBy: { type: 'string' },
                            startDate: { type: 'string', format: 'date-time' },
                            endDate: { type: 'string', format: 'date-time', nullable: true },
                            status: { type: 'string' },
                            studentId: { type: 'string', format: 'uuid' },
                        },
                    },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        pages: { type: 'number' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Missing or invalid JWT token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error - Database or system failure',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_medications_query_dto_1.ListMedicationsQueryDto]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get medication statistics", summary: 'Get medication statistics',
        description: 'Retrieve aggregated statistics about medications across the system.' }),
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Medication statistics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "getStats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create a new medication record", summary: 'Create new medication',
        description: 'Create a new medication record with complete prescribing information, dosage instructions, and student assignment. ' +
            'Requires NURSE or ADMIN role. All creations are logged for HIPAA audit trail.' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({ type: create_medication_dto_1.CreateMedicationDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Medication created successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                dosage: { type: 'string' },
                frequency: { type: 'string' },
                route: { type: 'string' },
                prescribedBy: { type: 'string' },
                startDate: { type: 'string', format: 'date-time' },
                studentId: { type: 'string', format: 'uuid' },
                status: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Validation error (missing required fields or invalid format)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Requires NURSE or ADMIN role',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found - Cannot create medication for non-existent student',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: require("../../database/models/student-medication.model").StudentMedication }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_medication_dto_1.CreateMedicationDto]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get a medication by ID", summary: 'Get medication by ID',
        description: 'Retrieve detailed information for a specific medication including prescribing details, dosage instructions, and student information. ' +
            'Access is logged for HIPAA compliance.' }),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Medication UUID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Medication retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Medication not found - Invalid medication ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "getById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update a medication", summary: 'Update medication',
        description: 'Update medication information such as dosage, frequency, route, or instructions. ' +
            'At least one field must be provided. Requires NURSE or ADMIN role. All updates are logged for HIPAA compliance.' }),
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Medication UUID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiBody)({ type: update_medication_dto_1.UpdateMedicationDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Medication updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Validation error or at least one field must be provided',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Requires NURSE or ADMIN role',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Medication not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_medication_dto_1.UpdateMedicationDto]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Deactivate a medication (soft delete)", summary: 'Deactivate medication',
        description: 'Deactivate a medication (soft delete) while preserving historical record for audit trail. ' +
            'Requires detailed reason and deactivation type. Sets status to DISCONTINUED and records end date. ' +
            'Requires NURSE or ADMIN role. All deactivations are logged for HIPAA compliance.' }),
    (0, common_1.Post)(':id/deactivate'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Medication UUID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiBody)({ type: deactivate_medication_dto_1.DeactivateMedicationDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Medication deactivated successfully - Historical record preserved',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Deactivation reason and type required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Requires NURSE or ADMIN role',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Medication not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, deactivate_medication_dto_1.DeactivateMedicationDto]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "deactivate", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Activate a medication (restore from soft delete)", summary: 'Activate medication',
        description: 'Reactivate a previously deactivated medication by setting status back to ACTIVE and clearing end date. ' +
            'Requires NURSE or ADMIN role. All activations are logged for HIPAA compliance.' }),
    (0, common_1.Post)(':id/activate'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Medication UUID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Medication activated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Requires NURSE or ADMIN role',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Medication not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "activate", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get all medications for a student", summary: 'Get medications for a student',
        description: 'Retrieve a paginated list of all medications (active and inactive) for a specific student. ' +
            'Returns complete medication history including discontinued medications for medical record keeping. ' +
            'This is a highly sensitive PHI endpoint - all access is logged for HIPAA audit trail.' }),
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        example: '660e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (default: 1)',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page (default: 20)',
        example: 20,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student medications retrieved successfully with pagination',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Cannot view medications for students outside your scope',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found - Invalid student ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    (0, common_1.UseInterceptors)(health_record_audit_interceptor_1.HealthRecordAuditInterceptor),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('studentId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], MedicationController.prototype, "getByStudent", null);
exports.MedicationController = MedicationController = __decorate([
    (0, swagger_1.ApiTags)('medications'),
    (0, common_1.Controller)('medications'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [medication_service_1.MedicationService])
], MedicationController);
//# sourceMappingURL=medication.controller.js.map