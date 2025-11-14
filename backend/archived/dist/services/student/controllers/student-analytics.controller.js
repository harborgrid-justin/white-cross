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
exports.StudentAnalyticsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const auth_1 = require("../../auth");
const interceptors_1 = require("../../../health-record/interceptors");
const student_service_1 = require("../student.service");
const base_1 = require("../../../common/base");
let StudentAnalyticsController = class StudentAnalyticsController extends base_1.BaseController {
    studentService;
    constructor(studentService) {
        super();
        this.studentService = studentService;
    }
    async getStatistics(id) {
        return this.studentService.getStatistics(id);
    }
    async exportData(id) {
        return this.studentService.exportData(id);
    }
};
exports.StudentAnalyticsController = StudentAnalyticsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get student statistics", summary: 'Get student statistics',
        description: 'Retrieves aggregated statistics for a student (health records, allergies, medications, etc.).' }),
    (0, common_1.Get)(':id/statistics'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                healthRecords: { type: 'number', example: 25 },
                allergies: { type: 'number', example: 2 },
                medications: { type: 'number', example: 1 },
                appointments: { type: 'number', example: 8 },
                incidents: { type: 'number', example: 1 },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentAnalyticsController.prototype, "getStatistics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Export student data", summary: 'Export student data',
        description: 'Generates comprehensive data export for a student including full profile and statistics.' }),
    (0, common_1.Get)(':id/export'),
    (0, common_1.UseInterceptors)(interceptors_1.HealthRecordAuditInterceptor),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Data exported successfully',
        schema: {
            type: 'object',
            properties: {
                exportDate: { type: 'string', format: 'date-time' },
                student: { $ref: '#/components/schemas/Student' },
                statistics: {
                    type: 'object',
                    properties: {
                        healthRecords: { type: 'number' },
                        allergies: { type: 'number' },
                        medications: { type: 'number' },
                        appointments: { type: 'number' },
                        incidents: { type: 'number' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentAnalyticsController.prototype, "exportData", null);
exports.StudentAnalyticsController = StudentAnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('students'),
    (0, common_1.Controller)('students'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard),
    __metadata("design:paramtypes", [student_service_1.StudentService])
], StudentAnalyticsController);
//# sourceMappingURL=student-analytics.controller.js.map