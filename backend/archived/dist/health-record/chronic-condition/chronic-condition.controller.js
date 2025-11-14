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
exports.HealthRecordChronicConditionController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chronic_condition_service_1 = require("./chronic-condition.service");
const create_chronic_condition_dto_1 = require("./dto/create-chronic-condition.dto");
const update_chronic_condition_dto_1 = require("./dto/update-chronic-condition.dto");
const models_1 = require("../../database/models");
const base_1 = require("../../common/base");
let HealthRecordChronicConditionController = class HealthRecordChronicConditionController extends base_1.BaseController {
    chronicConditionService;
    constructor(chronicConditionService) {
        super();
        this.chronicConditionService = chronicConditionService;
    }
    async create(createDto, req) {
        return this.chronicConditionService.create(createDto, req.user);
    }
    async findAll(req, studentId, status) {
        if (studentId) {
            return this.chronicConditionService.findByStudent(studentId, req.user);
        }
        return this.chronicConditionService.getChronicConditions();
    }
    async findById(id, req) {
        return this.chronicConditionService.findOne(id, req.user);
    }
    async update(id, updateDto, req) {
        return this.chronicConditionService.update(id, updateDto, req.user);
    }
    async remove(id, req) {
        return this.chronicConditionService.remove(id, req.user);
    }
    async findByStudent(studentId, req) {
        return this.chronicConditionService.findByStudent(studentId, req.user);
    }
};
exports.HealthRecordChronicConditionController = HealthRecordChronicConditionController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new chronic condition record' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Chronic condition created successfully',
        type: models_1.ChronicCondition,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    openapi.ApiResponse({ status: 201, type: require("../../database/models/chronic-condition.model").ChronicCondition }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chronic_condition_dto_1.CreateChronicConditionDto, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordChronicConditionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all chronic conditions with optional filtering',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of chronic conditions',
        type: [models_1.ChronicCondition],
    }),
    (0, swagger_1.ApiQuery)({ name: 'studentId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        enum: ['ACTIVE', 'MANAGED', 'RESOLVED', 'MONITORING'],
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/chronic-condition.model").ChronicCondition] }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('studentId')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], HealthRecordChronicConditionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chronic condition by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Chronic condition UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chronic condition details',
        type: models_1.ChronicCondition,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chronic condition not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/chronic-condition.model").ChronicCondition }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordChronicConditionController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update chronic condition' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Chronic condition UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chronic condition updated successfully',
        type: models_1.ChronicCondition,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chronic condition not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/chronic-condition.model").ChronicCondition }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_chronic_condition_dto_1.UpdateChronicConditionDto, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordChronicConditionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete chronic condition' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Chronic condition UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Chronic condition deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chronic condition not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordChronicConditionController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chronic conditions for a specific student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of student chronic conditions',
        type: [models_1.ChronicCondition],
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/chronic-condition.model").ChronicCondition] }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordChronicConditionController.prototype, "findByStudent", null);
exports.HealthRecordChronicConditionController = HealthRecordChronicConditionController = __decorate([
    (0, swagger_1.ApiTags)('chronic-conditions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('chronic-conditions'),
    __metadata("design:paramtypes", [chronic_condition_service_1.ChronicConditionService])
], HealthRecordChronicConditionController);
//# sourceMappingURL=chronic-condition.controller.js.map