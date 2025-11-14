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
exports.StudentAcademicController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../auth");
const student_service_1 = require("../student.service");
const academic_history_dto_1 = require("../dto/academic-history.dto");
const import_transcript_dto_1 = require("../dto/import-transcript.dto");
const performance_trends_dto_1 = require("../dto/performance-trends.dto");
const base_1 = require("../../../common/base");
let StudentAcademicController = class StudentAcademicController extends base_1.BaseController {
    studentService;
    constructor(studentService) {
        super();
        this.studentService = studentService;
    }
    async importTranscript(id, importTranscriptDto) {
        return this.studentService.importAcademicTranscript(id, importTranscriptDto);
    }
    async getAcademicHistory(id, query) {
        return this.studentService.getAcademicHistory(id, query);
    }
    async getPerformanceTrends(id, query) {
        return this.studentService.getPerformanceTrends(id, query);
    }
};
exports.StudentAcademicController = StudentAcademicController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Import academic transcript", summary: 'Import academic transcript for student',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Imports academic transcript data including grades, courses, GPA, and attendance records. Validates transcript format and calculates academic metrics. Requires ADMIN or COUNSELOR role.' }),
    (0, common_1.Post)(':id/transcript'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Academic transcript imported successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error or invalid transcript format',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Requires ADMIN or COUNSELOR role',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, import_transcript_dto_1.ImportTranscriptDto]),
    __metadata("design:returntype", Promise)
], StudentAcademicController.prototype, "importTranscript", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get academic history", summary: 'Get complete academic history for student',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Returns comprehensive academic history including all transcripts, grades, courses, and academic achievements. Used for academic planning and college applications.' }),
    (0, common_1.Get)(':id/academic-history'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Academic history retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, academic_history_dto_1.AcademicHistoryDto]),
    __metadata("design:returntype", Promise)
], StudentAcademicController.prototype, "getAcademicHistory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get performance trends", summary: 'Analyze academic performance trends for student',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Analyzes academic performance over time including GPA trends, subject performance patterns, and attendance correlation. Provides insights for intervention planning.' }),
    (0, common_1.Get)(':id/performance-trends'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Performance trends analyzed successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found or insufficient data',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, performance_trends_dto_1.PerformanceTrendsDto]),
    __metadata("design:returntype", Promise)
], StudentAcademicController.prototype, "getPerformanceTrends", null);
exports.StudentAcademicController = StudentAcademicController = __decorate([
    (0, swagger_1.ApiTags)('students'),
    (0, common_1.Controller)('students'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard),
    __metadata("design:paramtypes", [student_service_1.StudentService])
], StudentAcademicController);
//# sourceMappingURL=student-academic.controller.js.map