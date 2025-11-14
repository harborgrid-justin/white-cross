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
exports.TreatmentPlanController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const treatment_plan_service_1 = require("../services/treatment-plan.service");
const create_treatment_plan_dto_1 = require("../dto/treatment/create-treatment-plan.dto");
const update_treatment_plan_dto_1 = require("../dto/treatment/update-treatment-plan.dto");
const treatment_plan_filters_dto_1 = require("../dto/treatment/treatment-plan-filters.dto");
const base_1 = require("../../../common/base");
let TreatmentPlanController = class TreatmentPlanController extends base_1.BaseController {
    treatmentPlanService;
    constructor(treatmentPlanService) {
        super();
        this.treatmentPlanService = treatmentPlanService;
    }
    async create(createDto) {
        return this.treatmentPlanService.create(createDto);
    }
    async findAll(filters) {
        return this.treatmentPlanService.findAll(filters);
    }
    async findOne(id) {
        return this.treatmentPlanService.findOne(id);
    }
    async findByStudent(studentId, limit) {
        return this.treatmentPlanService.findByStudent(studentId, limit);
    }
    async findActiveByStudent(studentId) {
        return this.treatmentPlanService.findActiveByStudent(studentId);
    }
    async update(id, updateDto) {
        return this.treatmentPlanService.update(id, updateDto);
    }
    async activate(id) {
        return this.treatmentPlanService.activate(id);
    }
    async complete(id) {
        return this.treatmentPlanService.complete(id);
    }
    async cancel(id) {
        return this.treatmentPlanService.cancel(id);
    }
    async remove(id) {
        await this.treatmentPlanService.remove(id);
    }
};
exports.TreatmentPlanController = TreatmentPlanController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create treatment plan',
        description: 'Creates a new treatment plan for a student',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Treatment plan created successfully',
    }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/treatment-plan.model").TreatmentPlan }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_treatment_plan_dto_1.CreateTreatmentPlanDto]),
    __metadata("design:returntype", Promise)
], TreatmentPlanController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Query treatment plans',
        description: 'Search and filter treatment plans with pagination',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Treatment plans retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [treatment_plan_filters_dto_1.TreatmentPlanFiltersDto]),
    __metadata("design:returntype", Promise)
], TreatmentPlanController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get treatment plan by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Treatment plan ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment plan found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Treatment plan not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/treatment-plan.model").TreatmentPlan }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TreatmentPlanController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get treatment plans for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Maximum number of results',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student treatment plans retrieved',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/treatment-plan.model").TreatmentPlan] }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], TreatmentPlanController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Get)('student/:studentId/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active treatment plans for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active treatment plans retrieved' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/treatment-plan.model").TreatmentPlan] }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TreatmentPlanController.prototype, "findActiveByStudent", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update treatment plan' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Treatment plan ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment plan updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Treatment plan not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/treatment-plan.model").TreatmentPlan }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_treatment_plan_dto_1.UpdateTreatmentPlanDto]),
    __metadata("design:returntype", Promise)
], TreatmentPlanController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate treatment plan' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Treatment plan ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment plan activated' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Treatment plan already active' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/treatment-plan.model").TreatmentPlan }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TreatmentPlanController.prototype, "activate", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete treatment plan' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Treatment plan ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment plan completed' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/treatment-plan.model").TreatmentPlan }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TreatmentPlanController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel treatment plan' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Treatment plan ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment plan cancelled' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/treatment-plan.model").TreatmentPlan }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TreatmentPlanController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete treatment plan' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Treatment plan ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Treatment plan deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Treatment plan not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TreatmentPlanController.prototype, "remove", null);
exports.TreatmentPlanController = TreatmentPlanController = __decorate([
    (0, swagger_1.ApiTags)('Clinical - Treatment Plans'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clinical/treatment-plans'),
    __metadata("design:paramtypes", [treatment_plan_service_1.TreatmentPlanService])
], TreatmentPlanController);
//# sourceMappingURL=treatment-plan.controller.js.map