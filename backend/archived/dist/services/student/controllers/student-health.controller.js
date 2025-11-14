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
exports.StudentHealthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const auth_1 = require("../../auth");
const interceptors_1 = require("../../../health-record/interceptors");
const student_service_1 = require("../student.service");
const mental_health_records_dto_1 = require("../dto/mental-health-records.dto");
const student_health_records_dto_1 = require("../dto/student-health-records.dto");
const base_1 = require("../../../common/base");
let StudentHealthController = class StudentHealthController extends base_1.BaseController {
    studentService;
    constructor(studentService) {
        super();
        this.studentService = studentService;
    }
    async getHealthRecords(id, query) {
        return this.studentService.getStudentHealthRecords(id, query.page, query.limit);
    }
    async getMentalHealthRecords(id, query) {
        return this.studentService.getStudentMentalHealthRecords(id, query.page, query.limit);
    }
};
exports.StudentHealthController = StudentHealthController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get student health records", summary: 'Get student health records',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Returns paginated list of all health records for a student including medications, allergies, immunizations, and visit logs. Full audit trail maintained. Requires assigned nurse or admin access.' }),
    (0, common_1.Get)(':id/health-records'),
    (0, common_1.UseInterceptors)(interceptors_1.HealthRecordAuditInterceptor),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health records retrieved successfully with pagination',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Must be assigned nurse or admin',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, student_health_records_dto_1.StudentHealthRecordsDto]),
    __metadata("design:returntype", Promise)
], StudentHealthController.prototype, "getHealthRecords", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get student mental health records", summary: 'Get student mental health records',
        description: 'EXTREMELY SENSITIVE PHI ENDPOINT - Returns paginated mental health records including counseling sessions, behavioral assessments, and crisis interventions. Extra protection due to stigma concerns. Strict access control - mental health specialist or admin only. All access logged for compliance and ethical review.' }),
    (0, common_1.Get)(':id/mental-health-records'),
    (0, common_1.UseInterceptors)(interceptors_1.HealthRecordAuditInterceptor),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Mental health records retrieved successfully with pagination',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Mental health specialist or admin role required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mental_health_records_dto_1.MentalHealthRecordsDto]),
    __metadata("design:returntype", Promise)
], StudentHealthController.prototype, "getMentalHealthRecords", null);
exports.StudentHealthController = StudentHealthController = __decorate([
    (0, swagger_1.ApiTags)('students'),
    (0, common_1.Controller)('students'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard),
    __metadata("design:paramtypes", [student_service_1.StudentService])
], StudentHealthController);
//# sourceMappingURL=student-health.controller.js.map