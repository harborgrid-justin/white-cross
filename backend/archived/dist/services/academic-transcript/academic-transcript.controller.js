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
exports.AcademicTranscriptController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const academic_transcript_service_1 = require("./academic-transcript.service");
const transcript_import_dto_1 = require("./dto/transcript-import.dto");
const generate_report_dto_1 = require("./dto/generate-report.dto");
const sync_sis_dto_1 = require("./dto/sync-sis.dto");
const analytics_query_dto_1 = require("./dto/analytics-query.dto");
const base_1 = require("../../common/base");
let AcademicTranscriptController = class AcademicTranscriptController extends base_1.BaseController {
    academicTranscriptService;
    constructor(academicTranscriptService) {
        super();
        this.academicTranscriptService = academicTranscriptService;
    }
    async importTranscript(importDto) {
        return this.academicTranscriptService.importTranscript(importDto);
    }
    async getAcademicHistory(studentId) {
        return this.academicTranscriptService.getAcademicHistory(studentId);
    }
    async getTranscript(studentId, academicYear, semester) {
        const history = await this.academicTranscriptService.getAcademicHistory(studentId);
        if (academicYear || semester) {
            return history.filter((record) => (!academicYear || record.academicYear === academicYear) &&
                (!semester || record.semester === semester));
        }
        return history;
    }
    async generateReport(studentId, reportDto) {
        const format = reportDto.format || 'json';
        return this.academicTranscriptService.generateTranscriptReport(studentId, format);
    }
    async syncWithSIS(studentId, syncDto) {
        const success = await this.academicTranscriptService.syncWithSIS(studentId, syncDto.sisApiEndpoint);
        return {
            success,
            syncedAt: new Date().toISOString(),
            recordsImported: success ? 1 : 0,
        };
    }
    async getPerformanceAnalytics(studentId, queryDto) {
        return this.academicTranscriptService.analyzePerformanceTrends(studentId);
    }
    async calculateGPA(studentId, academicYear) {
        const history = await this.academicTranscriptService.getAcademicHistory(studentId);
        const records = academicYear
            ? history.filter((record) => record.academicYear === academicYear)
            : history;
        if (records.length === 0) {
            return {
                studentId,
                gpa: 0,
                academicYear: academicYear || 'all',
                calculatedAt: new Date().toISOString(),
                message: 'No academic records found',
            };
        }
        const totalGPA = records.reduce((sum, record) => sum + record.gpa, 0);
        const gpa = totalGPA / records.length;
        return {
            studentId,
            gpa: Math.round(gpa * 100) / 100,
            academicYear: academicYear || 'cumulative',
            calculatedAt: new Date().toISOString(),
            recordCount: records.length,
        };
    }
};
exports.AcademicTranscriptController = AcademicTranscriptController;
__decorate([
    (0, common_1.Post)('import'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Import academic transcript',
        description: 'Imports academic transcript data from SIS including subjects, grades, attendance, and behavior records.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Transcript imported successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: 'student-uuid_2024-2025_Fall' },
                studentId: { type: 'string', format: 'uuid' },
                academicYear: { type: 'string', example: '2024-2025' },
                semester: { type: 'string', example: 'Fall' },
                gpa: { type: 'number', example: 3.75 },
                subjects: { type: 'array' },
                attendance: { type: 'object' },
                behavior: { type: 'object' },
            },
        },
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
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transcript_import_dto_1.TranscriptImportDto]),
    __metadata("design:returntype", Promise)
], AcademicTranscriptController.prototype, "importTranscript", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get student's academic history", summary: 'Get academic history',
        description: 'Retrieves complete academic history for a student across all academic years and semesters.' }),
    (0, common_1.Get)(':studentId/history'),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Academic history retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    studentId: { type: 'string' },
                    academicYear: { type: 'string' },
                    semester: { type: 'string' },
                    gpa: { type: 'number' },
                    subjects: { type: 'array' },
                    attendance: { type: 'object' },
                    behavior: { type: 'object' },
                },
            },
        },
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
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('studentId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AcademicTranscriptController.prototype, "getAcademicHistory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get student transcript (current academic year)", summary: 'Get student transcript',
        description: 'Retrieves the academic transcript for a student for the current academic year.' }),
    (0, common_1.Get)(':studentId'),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'academicYear',
        description: 'Academic year (e.g., 2024-2025)',
        required: false,
        type: 'string',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'semester',
        description: 'Semester (Fall, Spring, Summer)',
        required: false,
        type: 'string',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transcript retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student or transcript not found',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('studentId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Query)('academicYear')),
    __param(2, (0, common_1.Query)('semester')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AcademicTranscriptController.prototype, "getTranscript", null);
__decorate([
    (0, common_1.Post)(':studentId/report'),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate transcript report',
        description: 'Generates a formatted transcript report in PDF, HTML, or JSON format.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Report generated successfully',
        schema: {
            type: 'object',
            properties: {
                student: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        studentNumber: { type: 'string' },
                        grade: { type: 'string' },
                    },
                },
                academicRecords: { type: 'array' },
                generatedAt: { type: 'string', format: 'date-time' },
                format: { type: 'string', enum: ['pdf', 'html', 'json'] },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('studentId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, generate_report_dto_1.AcademicGenerateReportDto]),
    __metadata("design:returntype", Promise)
], AcademicTranscriptController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Post)(':studentId/sync'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Sync with SIS',
        description: 'Synchronizes student transcript data with external Student Information System (SIS).',
    }),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Sync completed successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                syncedAt: { type: 'string', format: 'date-time' },
                recordsImported: { type: 'number', example: 1 },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input or SIS endpoint',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'SIS integration error',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Param)('studentId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sync_sis_dto_1.SyncSISDto]),
    __metadata("design:returntype", Promise)
], AcademicTranscriptController.prototype, "syncWithSIS", null);
__decorate([
    (0, common_1.Get)(':studentId/analytics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get performance analytics',
        description: 'Analyzes academic performance trends including GPA progression, attendance patterns, and recommendations.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'includeTrends',
        description: 'Include trend analysis',
        required: false,
        type: 'boolean',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'includeRecommendations',
        description: 'Include recommendations',
        required: false,
        type: 'boolean',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Analytics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                gpa: {
                    type: 'object',
                    properties: {
                        current: { type: 'number' },
                        average: { type: 'number' },
                        trend: {
                            type: 'string',
                            enum: ['improving', 'declining', 'stable'],
                        },
                    },
                },
                attendance: {
                    type: 'object',
                    properties: {
                        current: { type: 'number' },
                        average: { type: 'number' },
                        trend: {
                            type: 'string',
                            enum: ['improving', 'declining', 'stable'],
                        },
                    },
                },
                recommendations: {
                    type: 'array',
                    items: { type: 'string' },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found or insufficient data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('studentId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, analytics_query_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AcademicTranscriptController.prototype, "getPerformanceAnalytics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Calculate current GPA", summary: 'Calculate student GPA',
        description: 'Calculates the current GPA for a student for the specified academic period.' }),
    (0, common_1.Get)(':studentId/gpa'),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'academicYear',
        description: 'Academic year to calculate GPA for',
        required: false,
        type: 'string',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'GPA calculated successfully',
        schema: {
            type: 'object',
            properties: {
                studentId: { type: 'string' },
                gpa: { type: 'number', example: 3.75 },
                academicYear: { type: 'string', example: '2024-2025' },
                calculatedAt: { type: 'string', format: 'date-time' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found or no academic records',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('studentId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Query)('academicYear')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AcademicTranscriptController.prototype, "calculateGPA", null);
exports.AcademicTranscriptController = AcademicTranscriptController = __decorate([
    (0, swagger_1.ApiTags)('Academic Transcripts'),
    (0, common_1.Controller)('academic-transcripts'),
    __metadata("design:paramtypes", [academic_transcript_service_1.AcademicTranscriptService])
], AcademicTranscriptController);
//# sourceMappingURL=academic-transcript.controller.js.map