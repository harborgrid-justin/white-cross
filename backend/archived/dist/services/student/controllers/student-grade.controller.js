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
exports.StudentGradeController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../auth");
const student_service_1 = require("../student.service");
const grade_transition_dto_1 = require("../dto/grade-transition.dto");
const graduation_dto_1 = require("../dto/graduation.dto");
const base_1 = require("../../../common/base");
let StudentGradeController = class StudentGradeController extends base_1.BaseController {
    studentService;
    constructor(studentService) {
        super();
        this.studentService = studentService;
    }
    async advanceGrade(id, gradeTransitionDto) {
        return await this.studentService.advanceStudentGrade(id, gradeTransitionDto);
    }
    async retainGrade(id, gradeTransitionDto) {
        return await this.studentService.retainStudentGrade(id, gradeTransitionDto);
    }
    async graduateStudent(id, graduationDto) {
        return await this.studentService.processStudentGraduation(id, graduationDto);
    }
    async getGradeHistory(id) {
        return await this.studentService.getGradeTransitionHistory(id);
    }
};
exports.StudentGradeController = StudentGradeController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Advance student to next grade", summary: 'Advance student to next grade level',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Advances student to the next grade level. Validates academic requirements, updates enrollment records, and triggers necessary notifications. Requires ADMIN or COUNSELOR role.' }),
    (0, common_1.Post)(':id/advance-grade'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student advanced to next grade successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error or academic requirements not met',
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
    __metadata("design:paramtypes", [String, grade_transition_dto_1.GradeTransitionDto]),
    __metadata("design:returntype", Promise)
], StudentGradeController.prototype, "advanceGrade", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Retain student in current grade", summary: 'Retain student in current grade level',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Retains student in their current grade level. Documents retention reasons, updates academic records, and creates intervention plans. Requires ADMIN or COUNSELOR role.' }),
    (0, common_1.Post)(':id/retain-grade'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student retained in current grade successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error or invalid retention reason',
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
    __metadata("design:paramtypes", [String, grade_transition_dto_1.GradeTransitionDto]),
    __metadata("design:returntype", Promise)
], StudentGradeController.prototype, "retainGrade", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Process student graduation", summary: 'Process student graduation',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Processes student graduation including diploma generation, transcript finalization, and alumni record creation. Requires ADMIN role.' }),
    (0, common_1.Post)(':id/graduate'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student graduation processed successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error or graduation requirements not met',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Requires ADMIN role',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, graduation_dto_1.GraduationDto]),
    __metadata("design:returntype", Promise)
], StudentGradeController.prototype, "graduateStudent", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get grade transition history", summary: 'Get grade transition history for student',
        description: 'HIGHLY SENSITIVE PHI ENDPOINT - Returns complete grade transition history including advancements, retentions, and graduation records.' }),
    (0, common_1.Get)(':id/grade-history'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Student UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Grade transition history retrieved successfully',
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentGradeController.prototype, "getGradeHistory", null);
exports.StudentGradeController = StudentGradeController = __decorate([
    (0, swagger_1.ApiTags)('students'),
    (0, common_1.Controller)('students'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard),
    __metadata("design:paramtypes", [student_service_1.StudentService])
], StudentGradeController);
//# sourceMappingURL=student-grade.controller.js.map