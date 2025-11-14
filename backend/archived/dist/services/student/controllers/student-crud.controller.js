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
exports.StudentCrudController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../auth");
const student_service_1 = require("../student.service");
const create_student_dto_1 = require("../dto/create-student.dto");
const student_filter_dto_1 = require("../dto/student-filter.dto");
const update_student_dto_1 = require("../dto/update-student.dto");
const base_1 = require("../../../common/base");
let StudentCrudController = class StudentCrudController extends base_1.BaseController {
    studentService;
    constructor(studentService) {
        super();
        this.studentService = studentService;
    }
    async create(createStudentDto) {
        return this.studentService.create(createStudentDto);
    }
    async findAll(filterDto) {
        return this.studentService.findAll(filterDto);
    }
    async findOne(id) {
        return this.studentService.findOne(id);
    }
    async update(id, updateStudentDto) {
        return this.studentService.update(id, updateStudentDto);
    }
    async remove(id) {
        return this.studentService.remove(id);
    }
};
exports.StudentCrudController = StudentCrudController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create a new student", summary: 'Create a new student',
        description: 'Creates a new student record with validation. Student number and medical record number must be unique.' }),
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Student created successfully',
        type: 'Student',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data (validation errors)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Student number or medical record number already exists',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/student.model").Student }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_dto_1.CreateStudentDto]),
    __metadata("design:returntype", Promise)
], StudentCrudController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get all students with filters and pagination", summary: 'Get all students',
        description: 'Retrieves paginated list of students with optional filters (search, grade, nurse, active status)' }),
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Students retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Student' },
                },
                meta: {
                    type: 'object',
                    properties: {
                        page: { type: 'number', example: 1 },
                        limit: { type: 'number', example: 20 },
                        total: { type: 'number', example: 150 },
                        pages: { type: 'number', example: 8 },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [student_filter_dto_1.StudentFilterDto]),
    __metadata("design:returntype", Promise)
], StudentCrudController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get student by ID", summary: 'Get student by ID',
        description: 'Retrieves a single student by their UUID with full profile information' }),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student retrieved successfully',
        type: 'Student',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid UUID format',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/student.model").Student }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentCrudController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update student", summary: 'Update student',
        description: 'Updates student information. All fields are optional. Validates uniqueness constraints.' }),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student updated successfully',
        type: 'Student',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Student number or medical record number already exists',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/student.model").Student }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_student_dto_1.UpdateStudentDto]),
    __metadata("design:returntype", Promise)
], StudentCrudController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete student (soft delete)", summary: 'Delete student',
        description: 'Soft deletes a student by setting isActive to false. Does not permanently remove data.' }),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Student deleted successfully (soft delete)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid UUID format',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
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
], StudentCrudController.prototype, "remove", null);
exports.StudentCrudController = StudentCrudController = __decorate([
    (0, swagger_1.ApiTags)('students'),
    (0, common_1.Controller)('students'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard),
    __metadata("design:paramtypes", [student_service_1.StudentService])
], StudentCrudController);
//# sourceMappingURL=student-crud.controller.js.map