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
exports.StudentQueryController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const auth_1 = require("../../auth");
const student_service_1 = require("../student.service");
const base_1 = require("../../../common/base");
let StudentQueryController = class StudentQueryController extends base_1.BaseController {
    studentService;
    constructor(studentService) {
        super();
        this.studentService = studentService;
    }
    async search(query, limit) {
        return this.studentService.search(query, limit);
    }
    async getAllGrades() {
        return this.studentService.findAllGrades();
    }
    async findByGrade(grade) {
        return this.studentService.findByGrade(grade);
    }
    async findAssignedStudents(nurseId) {
        return this.studentService.findAssignedStudents(nurseId);
    }
};
exports.StudentQueryController = StudentQueryController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Search students", summary: 'Search students',
        description: 'Full-text search across firstName, lastName, and studentNumber fields.' }),
    (0, common_1.Get)('search/query'),
    (0, throttler_1.Throttle)({ default: { limit: 60, ttl: 60000 } }),
    (0, swagger_1.ApiQuery)({
        name: 'q',
        description: 'Search query string',
        required: true,
        type: 'string',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        description: 'Maximum number of results',
        required: false,
        type: 'number',
        example: 20,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Search results',
        schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/Student' },
        },
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/student.model").Student] }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], StudentQueryController.prototype, "search", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get all grades", summary: 'Get all grades',
        description: 'Retrieves list of all unique grade levels currently in use by active students.' }),
    (0, common_1.Get)('grades/list'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Grades retrieved successfully',
        schema: {
            type: 'array',
            items: { type: 'string' },
            example: ['K', '1', '2', '3', '4', '5'],
        },
    }),
    openapi.ApiResponse({ status: 200, type: [String] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudentQueryController.prototype, "getAllGrades", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get students by grade", summary: 'Get students by grade',
        description: 'Retrieves all active students in a specific grade level.' }),
    (0, common_1.Get)('grade/:grade'),
    (0, swagger_1.ApiParam)({
        name: 'grade',
        description: 'Grade level',
        type: 'string',
        example: '3',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Students retrieved successfully',
        schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/Student' },
        },
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/student.model").Student] }),
    __param(0, (0, common_1.Param)('grade')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentQueryController.prototype, "findByGrade", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get assigned students for a nurse", summary: 'Get assigned students',
        description: 'Retrieves all active students assigned to a specific nurse.' }),
    (0, common_1.Get)('nurse/:nurseId'),
    (0, swagger_1.ApiParam)({
        name: 'nurseId',
        description: 'Nurse UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Assigned students retrieved successfully',
        schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/Student' },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid UUID format',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/student.model").Student] }),
    __param(0, (0, common_1.Param)('nurseId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentQueryController.prototype, "findAssignedStudents", null);
exports.StudentQueryController = StudentQueryController = __decorate([
    (0, swagger_1.ApiTags)('students'),
    (0, common_1.Controller)('students'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard),
    __metadata("design:paramtypes", [student_service_1.StudentService])
], StudentQueryController);
//# sourceMappingURL=student-query.controller.js.map