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
exports.GradeTransitionController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../services/auth/guards/jwt-auth.guard");
const grade_transition_service_1 = require("./grade-transition.service");
const dto_1 = require("./dto");
const models_1 = require("../database/models");
const base_1 = require("../common/base");
let GradeTransitionController = class GradeTransitionController extends base_1.BaseController {
    gradeTransitionService;
    constructor(gradeTransitionService) {
        super();
        this.gradeTransitionService = gradeTransitionService;
    }
    async performBulkGradeTransition(bulkTransitionDto) {
        const { effectiveDate, dryRun } = bulkTransitionDto;
        return await this.gradeTransitionService.performBulkTransition(effectiveDate, dryRun ?? true);
    }
    async getGraduatingStudents() {
        return await this.gradeTransitionService.getGraduatingStudents();
    }
    async transitionStudent(studentId, transitionStudentDto) {
        const { newGrade, transitionedBy } = transitionStudentDto;
        await this.gradeTransitionService.transitionStudent(studentId, newGrade, transitionedBy);
        return {
            success: true,
            message: 'Student grade transitioned successfully',
        };
    }
};
exports.GradeTransitionController = GradeTransitionController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Perform bulk grade transition for end of school year\nPOST /student-management/grade-transitions/bulk", summary: 'Perform bulk grade transition',
        description: 'Processes grade level transitions for all eligible students. Includes promotion criteria validation, retention decisions, and graduation processing. Can be run in dry-run mode for testing. Requires ADMIN role.' }),
    (0, common_1.Post)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Bulk grade transition completed successfully',
        type: dto_1.BulkTransitionResultDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error or transition criteria not met',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Requires ADMIN role',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/transition-result.dto").BulkTransitionResultDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.BulkTransitionDto]),
    __metadata("design:returntype", Promise)
], GradeTransitionController.prototype, "performBulkGradeTransition", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get students eligible for graduation\nGET /student-management/grade-transitions/graduating", summary: 'Get graduating students',
        description: 'Retrieves all students who are eligible for graduation (12th grade students)' }),
    (0, common_1.Get)('graduating'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of graduating students retrieved successfully',
        type: [models_1.Student],
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/student.model").Student] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GradeTransitionController.prototype, "getGraduatingStudents", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Transition individual student to a new grade\nPOST /student-management/grade-transitions/:studentId", summary: 'Transition individual student',
        description: 'Transitions a specific student to a new grade level' }),
    (0, common_1.Post)(':studentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student grade transitioned successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: {
                    type: 'string',
                    example: 'Student grade transitioned successfully',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid request data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.TransitionStudentDto]),
    __metadata("design:returntype", Promise)
], GradeTransitionController.prototype, "transitionStudent", null);
exports.GradeTransitionController = GradeTransitionController = __decorate([
    (0, swagger_1.ApiTags)('Grade Transition'),
    (0, common_1.Controller)('student-management/grade-transitions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [grade_transition_service_1.GradeTransitionService])
], GradeTransitionController);
//# sourceMappingURL=grade-transition.controller.js.map