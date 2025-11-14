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
exports.HealthRiskAssessmentController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const base_1 = require("../common/base");
const health_risk_assessment_service_1 = require("./health-risk-assessment.service");
const dto_1 = require("./dto");
let HealthRiskAssessmentController = class HealthRiskAssessmentController extends base_1.BaseController {
    healthRiskAssessmentService;
    constructor(healthRiskAssessmentService) {
        super();
        this.healthRiskAssessmentService = healthRiskAssessmentService;
    }
    async calculateRiskScore(studentId) {
        this.logInfo(`Calculating risk score for student: ${studentId}`);
        return this.healthRiskAssessmentService.calculateRiskScore(studentId);
    }
    async getHighRiskStudents(query) {
        const minScore = query.minScore ?? 50;
        this.logInfo(`Retrieving high-risk students (minScore: ${minScore})`);
        return this.healthRiskAssessmentService.getHighRiskStudents(minScore);
    }
};
exports.HealthRiskAssessmentController = HealthRiskAssessmentController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Calculate comprehensive health risk score for a specific student", summary: 'Calculate health risk score for a student',
        description: 'Calculates a comprehensive health risk assessment score (0-100) based on ' +
            'allergies, chronic conditions, medications, and recent incident history. ' +
            'Returns risk factors, overall score, risk level, and recommendations.' }),
    (0, common_1.Get)(':studentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'UUID of the student to assess',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health risk assessment calculated successfully',
        type: dto_1.HealthRiskScoreDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error during risk calculation',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/health-risk-score.dto").HealthRiskScoreDto }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthRiskAssessmentController.prototype, "calculateRiskScore", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get list of high-risk students", summary: 'Get high-risk students',
        description: 'Retrieves a list of active students whose health risk score meets or exceeds ' +
            'the specified minimum threshold. Results are sorted by risk score (highest first).' }),
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiQuery)({
        name: 'minScore',
        description: 'Minimum risk score threshold (0-100). Default is 50 (high risk).',
        required: false,
        type: Number,
        example: 50,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'High-risk students retrieved successfully',
        type: [dto_1.HighRiskStudentDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid query parameters',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error during student retrieval',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: [require("./dto/high-risk-student.dto").HighRiskStudentDto] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.HighRiskQueryDto]),
    __metadata("design:returntype", Promise)
], HealthRiskAssessmentController.prototype, "getHighRiskStudents", null);
exports.HealthRiskAssessmentController = HealthRiskAssessmentController = __decorate([
    (0, swagger_1.ApiTags)('Health Risk Assessments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('health-risk-assessments'),
    __metadata("design:paramtypes", [health_risk_assessment_service_1.HealthRiskAssessmentService])
], HealthRiskAssessmentController);
//# sourceMappingURL=health-risk-assessment.controller.js.map