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
exports.AllergyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const allergy_crud_service_1 = require("./services/allergy-crud.service");
const allergy_query_service_1 = require("./services/allergy-query.service");
const allergy_safety_service_1 = require("./services/allergy-safety.service");
const allergy_filters_dto_1 = require("./dto/allergy-filters.dto");
const update_allergy_dto_1 = require("./dto/update-allergy.dto");
const create_allergy_dto_1 = require("./dto/create-allergy.dto");
const pagination_dto_1 = require("./dto/pagination.dto");
const verify_allergy_dto_1 = require("./dto/verify-allergy.dto");
const base_1 = require("../../common/base");
let AllergyController = class AllergyController extends base_1.BaseController {
    allergyCrudService;
    allergyQueryService;
    allergySafetyService;
    constructor(allergyCrudService, allergyQueryService, allergySafetyService) {
        super();
        this.allergyCrudService = allergyCrudService;
        this.allergyQueryService = allergyQueryService;
        this.allergySafetyService = allergySafetyService;
    }
    async createAllergy(createAllergyDto) {
        return this.allergyCrudService.createAllergy(createAllergyDto);
    }
    async getAllergyById(id) {
        return this.allergyCrudService.getAllergyById(id);
    }
    async getStudentAllergies(studentId, includeInactive) {
        return this.allergyQueryService.getStudentAllergies(studentId, includeInactive || false);
    }
    async getCriticalAllergies(studentId) {
        return this.allergyQueryService.getCriticalAllergies(studentId);
    }
    async searchAllergies(filters, pagination) {
        return this.allergyQueryService.searchAllergies(filters, pagination);
    }
    async getAllergyStatistics(filters) {
        return this.allergyQueryService.getAllergyStatistics(filters);
    }
    async updateAllergy(id, updateAllergyDto) {
        return this.allergyCrudService.updateAllergy(id, updateAllergyDto);
    }
    async deactivateAllergy(id) {
        return this.allergyCrudService.deactivateAllergy(id);
    }
    async deleteAllergy(id) {
        return this.allergyCrudService.deleteAllergy(id);
    }
    async verifyAllergy(id, verifyAllergyDto) {
        return this.allergySafetyService.verifyAllergy(id, verifyAllergyDto.verifiedBy);
    }
    async checkDrugAllergyConflict(body) {
        return this.allergySafetyService.checkDrugAllergyConflict(body.studentId, body.medicationName, body.medicationClass);
    }
    async bulkCreateAllergies(allergiesData) {
        return this.allergySafetyService.bulkCreateAllergies(allergiesData);
    }
};
exports.AllergyController = AllergyController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create a new allergy record\nPOST /allergy", summary: 'Create a new allergy record',
        description: 'Creates a new allergy record for a student with severity classification and clinical information' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Allergy created successfully',
        type: create_allergy_dto_1.CreateAllergyDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data - validation errors',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: require("../../database/models/allergy.model").Allergy }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_allergy_dto_1.CreateAllergyDto]),
    __metadata("design:returntype", Promise)
], AllergyController.prototype, "createAllergy", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get allergy by ID\nGET /allergy/:id", summary: 'Get allergy by ID',
        description: 'Retrieves a single allergy record by UUID' }),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Allergy UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Allergy retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid UUID format',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Allergy not found',
    }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/allergy.model").Allergy }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AllergyController.prototype, "getAllergyById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get all allergies for a specific student\nGET /allergy/student/:studentId", summary: 'Get all allergies for a student',
        description: 'Retrieves all allergy records for a specific student, optionally including inactive allergies' }),
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'includeInactive',
        description: 'Include inactive/resolved allergies',
        required: false,
        type: Boolean,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student allergies retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    studentId: { type: 'string', format: 'uuid' },
                    allergen: { type: 'string', example: 'Peanuts' },
                    severity: {
                        type: 'string',
                        enum: ['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING'],
                    },
                    reaction: {
                        type: 'string',
                        example: 'Anaphylaxis, hives, difficulty breathing',
                    },
                    verified: { type: 'boolean' },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/allergy.model").Allergy] }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('includeInactive', new common_1.ParseBoolPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], AllergyController.prototype, "getStudentAllergies", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get critical allergies for a student (SEVERE and LIFE_THREATENING only)\nGET /allergy/student/:studentId/critical", summary: 'Get critical allergies',
        description: 'Retrieves only SEVERE and LIFE_THREATENING allergies for a student - used for safety alerts' }),
    (0, common_1.Get)('student/:studentId/critical'),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Critical allergies retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/allergy.model").Allergy] }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AllergyController.prototype, "getCriticalAllergies", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Search allergies with filters and pagination\nGET /allergy/search", summary: 'Search allergies',
        description: 'Advanced allergy search with filters (allergen type, severity, verified status) and pagination' }),
    (0, common_1.Get)('search/all'),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        description: 'Page number',
        required: false,
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        description: 'Items per page',
        required: false,
        type: Number,
        example: 20,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Search results with pagination',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'array', items: { type: 'object' } },
                meta: {
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
        description: 'Unauthorized',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [allergy_filters_dto_1.AllergyFiltersDto,
        pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], AllergyController.prototype, "searchAllergies", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get allergy statistics\nGET /allergy/statistics", summary: 'Get allergy statistics',
        description: 'Retrieves aggregated statistics about allergies (counts by severity, type, etc.)' }),
    (0, common_1.Get)('statistics/all'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                totalAllergies: { type: 'number', example: 245 },
                bySeverity: {
                    type: 'object',
                    properties: {
                        MILD: { type: 'number', example: 80 },
                        MODERATE: { type: 'number', example: 100 },
                        SEVERE: { type: 'number', example: 45 },
                        LIFE_THREATENING: { type: 'number', example: 20 },
                    },
                },
                byType: {
                    type: 'object',
                    properties: {
                        MEDICATION: { type: 'number', example: 50 },
                        FOOD: { type: 'number', example: 150 },
                        ENVIRONMENTAL: { type: 'number', example: 45 },
                    },
                },
                verified: { type: 'number', example: 200 },
                unverified: { type: 'number', example: 45 },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [allergy_filters_dto_1.AllergyFiltersDto]),
    __metadata("design:returntype", Promise)
], AllergyController.prototype, "getAllergyStatistics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update an allergy record\nPATCH /allergy/:id", summary: 'Update an allergy record',
        description: 'Updates an existing allergy record with new information' }),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Allergy UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Allergy updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Allergy not found',
    }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/allergy.model").Allergy }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_allergy_dto_1.AllergyUpdateDto]),
    __metadata("design:returntype", Promise)
], AllergyController.prototype, "updateAllergy", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Deactivate an allergy (soft delete)\nDELETE /allergy/:id/deactivate", summary: 'Deactivate allergy',
        description: 'Soft deletes an allergy record (marks as inactive) - used when allergy is resolved or no longer relevant' }),
    (0, common_1.Delete)(':id/deactivate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Allergy UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Allergy deactivated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Allergy not found',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AllergyController.prototype, "deactivateAllergy", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Permanently delete an allergy record\nDELETE /allergy/:id", summary: 'Delete allergy permanently',
        description: 'Permanently deletes an allergy record from the database - use with caution' }),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Allergy UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Allergy deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Allergy not found',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AllergyController.prototype, "deleteAllergy", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Verify an allergy record by healthcare professional\nPOST /allergy/:id/verify", summary: 'Verify allergy',
        description: 'Marks an allergy as clinically verified by a healthcare professional' }),
    (0, common_1.Post)(':id/verify'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Allergy UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Allergy verified successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Allergy not found',
    }),
    openapi.ApiResponse({ status: 201, type: require("../../database/models/allergy.model").Allergy }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, verify_allergy_dto_1.VerifyAllergyDto]),
    __metadata("design:returntype", Promise)
], AllergyController.prototype, "verifyAllergy", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Check for drug-allergy conflicts\nPOST /allergy/check-conflict", summary: 'Check drug-allergy conflict',
        description: 'Safety check to detect potential drug-allergy interactions before medication administration' }),
    (0, common_1.Post)('check-conflict'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['studentId', 'medicationName'],
            properties: {
                studentId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'Student UUID',
                },
                medicationName: {
                    type: 'string',
                    example: 'Amoxicillin',
                    description: 'Medication name to check',
                },
                medicationClass: {
                    type: 'string',
                    example: 'Penicillin',
                    description: 'Medication class (optional)',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Conflict check completed',
        schema: {
            type: 'object',
            properties: {
                hasConflict: { type: 'boolean', example: true },
                conflictingAllergies: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            allergen: { type: 'string', example: 'Penicillin' },
                            severity: { type: 'string', example: 'SEVERE' },
                            reaction: { type: 'string', example: 'Anaphylaxis' },
                        },
                    },
                },
                recommendation: {
                    type: 'string',
                    example: 'DO NOT ADMINISTER - Severe allergy conflict detected',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AllergyController.prototype, "checkDrugAllergyConflict", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Bulk create allergies\nPOST /allergy/bulk", summary: 'Bulk create allergies',
        description: 'Creates multiple allergy records in a single transaction - useful for data imports' }),
    (0, common_1.Post)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBody)({
        type: [create_allergy_dto_1.CreateAllergyDto],
        description: 'Array of allergy records to create',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Allergies created successfully',
        schema: {
            type: 'object',
            properties: {
                created: { type: 'number', example: 15 },
                failed: { type: 'number', example: 0 },
                errors: { type: 'array', items: { type: 'object' } },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: [require("../../database/models/allergy.model").Allergy] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AllergyController.prototype, "bulkCreateAllergies", null);
exports.AllergyController = AllergyController = __decorate([
    (0, swagger_1.ApiTags)('Allergies'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('allergies'),
    __metadata("design:paramtypes", [allergy_crud_service_1.AllergyCrudService,
        allergy_query_service_1.AllergyQueryService,
        allergy_safety_service_1.AllergySafetyService])
], AllergyController);
//# sourceMappingURL=allergy.controller.js.map