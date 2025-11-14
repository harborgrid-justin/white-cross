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
exports.ChronicConditionController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chronic_condition_service_1 = require("./chronic-condition.service");
const create_chronic_condition_dto_1 = require("./dto/create-chronic-condition.dto");
const chronic_condition_filters_dto_1 = require("./dto/chronic-condition-filters.dto");
const update_chronic_condition_dto_1 = require("./dto/update-chronic-condition.dto");
const pagination_dto_1 = require("./dto/pagination.dto");
const update_care_plan_dto_1 = require("./dto/update-care-plan.dto");
const accommodation_type_enum_1 = require("./enums/accommodation-type.enum");
const base_1 = require("../../common/base");
let ChronicConditionController = class ChronicConditionController extends base_1.BaseController {
    chronicConditionService;
    constructor(chronicConditionService) {
        super();
        this.chronicConditionService = chronicConditionService;
    }
    create(dto) {
        return this.chronicConditionService.createChronicCondition(dto);
    }
    findOne(id) {
        return this.chronicConditionService.getChronicConditionById(id);
    }
    findByStudent(studentId, includeInactive) {
        return this.chronicConditionService.getStudentChronicConditions(studentId, includeInactive === true || includeInactive === 'true');
    }
    update(id, dto) {
        return this.chronicConditionService.updateChronicCondition(id, dto);
    }
    deactivate(id) {
        return this.chronicConditionService.deactivateChronicCondition(id);
    }
    permanentDelete(id) {
        return this.chronicConditionService.deleteChronicCondition(id);
    }
    search(filters, pagination) {
        return this.chronicConditionService.searchChronicConditions(filters, pagination);
    }
    getReviewsDue(daysAhead) {
        return this.chronicConditionService.getConditionsRequiringReview(daysAhead ? parseInt(daysAhead.toString(), 10) : 30);
    }
    getAccommodations(type) {
        return this.chronicConditionService.getConditionsRequiringAccommodations(type);
    }
    getStatistics(filters) {
        return this.chronicConditionService.getChronicConditionStatistics(filters);
    }
    updateCarePlan(id, dto) {
        return this.chronicConditionService.updateCarePlan(id, dto.carePlan);
    }
    bulkCreate(conditionsData) {
        return this.chronicConditionService.bulkCreateChronicConditions(conditionsData);
    }
};
exports.ChronicConditionController = ChronicConditionController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create new chronic condition',
        description: 'Creates a new chronic condition record with ICD-10 coding, care plan, and accommodation tracking',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Chronic condition successfully created',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    openapi.ApiResponse({ status: 201, type: require("../../database/models/chronic-condition.model").ChronicCondition }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chronic_condition_dto_1.ChronicConditionCreateDto]),
    __metadata("design:returntype", void 0)
], ChronicConditionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get chronic condition by ID',
        description: 'Retrieves a single chronic condition with full details',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Chronic condition UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chronic condition found',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chronic condition not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/chronic-condition.model").ChronicCondition }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChronicConditionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all chronic conditions for a student',
        description: 'Retrieves all chronic conditions associated with a specific student',
    }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student UUID' }),
    (0, swagger_1.ApiQuery)({
        name: 'includeInactive',
        required: false,
        type: Boolean,
        description: 'Include inactive/resolved conditions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student chronic conditions retrieved',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/chronic-condition.model").ChronicCondition] }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], ChronicConditionController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update chronic condition',
        description: 'Updates an existing chronic condition record with change tracking',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Chronic condition UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chronic condition successfully updated',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chronic condition not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/chronic-condition.model").ChronicCondition }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_chronic_condition_dto_1.ChronicConditionUpdateDto]),
    __metadata("design:returntype", void 0)
], ChronicConditionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Deactivate chronic condition',
        description: 'Soft deletes a chronic condition by marking it as RESOLVED (recommended)',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Chronic condition UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chronic condition successfully deactivated',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chronic condition not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChronicConditionController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Delete)(':id/permanent'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Permanently delete chronic condition',
        description: 'Hard deletes a chronic condition (WARNING: HIPAA implications, use with caution)',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Chronic condition UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chronic condition permanently deleted',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chronic condition not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChronicConditionController.prototype, "permanentDelete", null);
__decorate([
    (0, common_1.Post)('search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Search chronic conditions',
        description: 'Advanced search with multi-criteria filtering and pagination',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Search results with pagination metadata',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chronic_condition_filters_dto_1.ChronicConditionFiltersDto,
        pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ChronicConditionController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('reviews/due'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get conditions requiring review',
        description: 'Retrieves conditions with care plans due for review within specified days',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'daysAhead',
        required: false,
        type: Number,
        description: 'Number of days to look ahead (default: 30)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Conditions requiring review retrieved',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/chronic-condition.model").ChronicCondition] }),
    __param(0, (0, common_1.Query)('daysAhead')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ChronicConditionController.prototype, "getReviewsDue", null);
__decorate([
    (0, common_1.Get)('accommodations/:type'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get conditions requiring accommodations',
        description: 'Retrieves conditions requiring IEP or 504 educational accommodation plans',
    }),
    (0, swagger_1.ApiParam)({
        name: 'type',
        enum: accommodation_type_enum_1.AccommodationType,
        description: 'Accommodation type (IEP, 504, or BOTH)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Conditions requiring accommodations retrieved',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/chronic-condition.model").ChronicCondition] }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChronicConditionController.prototype, "getAccommodations", null);
__decorate([
    (0, common_1.Get)('statistics/summary'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get chronic condition statistics',
        description: 'Retrieves comprehensive statistics for chronic condition management and reporting',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chronic_condition_filters_dto_1.ChronicConditionFiltersDto]),
    __metadata("design:returntype", void 0)
], ChronicConditionController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Put)(':id/care-plan'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update care plan',
        description: 'Updates the care plan for a chronic condition and refreshes review date',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Chronic condition UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Care plan successfully updated',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chronic condition not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/chronic-condition.model").ChronicCondition }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_care_plan_dto_1.UpdateCarePlanDto]),
    __metadata("design:returntype", void 0)
], ChronicConditionController.prototype, "updateCarePlan", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, swagger_1.ApiOperation)({
        summary: 'Bulk create chronic conditions',
        description: 'Creates multiple chronic condition records in a single operation (for data imports)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Chronic conditions successfully created',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    openapi.ApiResponse({ status: 201, type: [require("../../database/models/chronic-condition.model").ChronicCondition] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], ChronicConditionController.prototype, "bulkCreate", null);
exports.ChronicConditionController = ChronicConditionController = __decorate([
    (0, swagger_1.ApiTags)('Chronic Conditions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('chronic-conditions'),
    __metadata("design:paramtypes", [chronic_condition_service_1.ChronicConditionService])
], ChronicConditionController);
//# sourceMappingURL=chronic-condition.controller.js.map