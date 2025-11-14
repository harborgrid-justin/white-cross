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
exports.StudentCoreController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const auth_1 = require("../../auth");
const interceptors_1 = require("../../../health-record/interceptors");
const student_crud_service_1 = require("../services/student-crud.service");
const create_student_dto_1 = require("../dto/create-student.dto");
const student_filter_dto_1 = require("../dto/student-filter.dto");
const update_student_dto_1 = require("../dto/update-student.dto");
const database_1 = require("../../../database");
const base_1 = require("../../../common/base");
let StudentCoreController = class StudentCoreController extends base_1.BaseController {
    crudService;
    constructor(crudService) {
        super();
        this.crudService = crudService;
    }
    async create(createStudentDto) {
        return this.crudService.create(createStudentDto);
    }
    async findAll(filterDto) {
        return this.crudService.findAll(filterDto);
    }
    async findOne(id) {
        return this.crudService.findOne(id);
    }
    async update(id, updateStudentDto) {
        return this.crudService.update(id, updateStudentDto);
    }
    async remove(id) {
        return this.crudService.remove(id);
    }
};
exports.StudentCoreController = StudentCoreController;
__decorate([
    (0, common_1.Post)(),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new student' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Student created successfully',
        type: database_1.Student,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflict - student number already exists' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/student.model").Student }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_dto_1.CreateStudentDto]),
    __metadata("design:returntype", Promise)
], StudentCoreController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated list of students' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (1-based)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String, description: 'Sort field' }),
    (0, swagger_1.ApiQuery)({
        name: 'sortOrder',
        required: false,
        type: String,
        description: 'Sort order (asc/desc)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Students retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Student' }
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' },
                    },
                },
            },
        },
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [student_filter_dto_1.StudentFilterDto]),
    __metadata("design:returntype", Promise)
], StudentCoreController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a student by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Student found', type: database_1.Student }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/student.model").Student }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentCoreController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a student' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Student updated successfully', type: database_1.Student }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation error' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflict - student number already exists' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/student.model").Student }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_student_dto_1.UpdateStudentDto]),
    __metadata("design:returntype", Promise)
], StudentCoreController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a student' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Student deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentCoreController.prototype, "remove", null);
exports.StudentCoreController = StudentCoreController = __decorate([
    (0, swagger_1.ApiTags)('students-core'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('students'),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)(interceptors_1.HealthRecordAuditInterceptor),
    __metadata("design:paramtypes", [student_crud_service_1.StudentCrudService])
], StudentCoreController);
//# sourceMappingURL=student-core.controller.js.map