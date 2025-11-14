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
exports.ScreeningController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const screening_service_1 = require("./screening.service");
const screening_dto_1 = require("./dto/screening.dto");
const base_1 = require("../../common/base");
let ScreeningController = class ScreeningController extends base_1.BaseController {
    screeningService;
    constructor(screeningService) {
        super();
        this.screeningService = screeningService;
    }
    async getStudentScreenings(studentId) {
        return this.screeningService.getStudentScreenings(studentId);
    }
    async batchCreate(batchDto) {
        return this.screeningService.batchCreate(batchDto.screenings);
    }
    async getOverdueScreenings(query) {
        return this.screeningService.getOverdueScreenings(query);
    }
    async getScreeningSchedule(query) {
        return this.screeningService.getScreeningSchedule(query);
    }
    async createReferral(id, referralDto) {
        return this.screeningService.createReferral(id, referralDto);
    }
    async getStatistics(query) {
        return this.screeningService.getScreeningStatistics(query);
    }
};
exports.ScreeningController = ScreeningController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "GAP-SCREEN-001: Get all screenings for a student", summary: 'Get student screenings',
        description: 'Retrieves all health screening records for a specific student.' }),
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student screenings retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('studentId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScreeningController.prototype, "getStudentScreenings", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "GAP-SCREEN-002: Batch screening creation", summary: 'Import screenings in batch',
        description: 'Creates multiple screening records at once for mass screening events.' }),
    (0, common_1.Post)('batch'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Batch screenings created successfully',
        schema: {
            type: 'object',
            properties: {
                successCount: { type: 'number' },
                errorCount: { type: 'number' },
                createdIds: { type: 'array', items: { type: 'string' } },
                errors: { type: 'array', items: { type: 'string' } },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [screening_dto_1.BatchScreeningDto]),
    __metadata("design:returntype", Promise)
], ScreeningController.prototype, "batchCreate", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "GAP-SCREEN-003: Get overdue screenings", summary: 'Get overdue screenings',
        description: 'Retrieves list of students with overdue health screenings.' }),
    (0, common_1.Get)('overdue'),
    (0, swagger_1.ApiQuery)({
        name: 'schoolId',
        required: false,
        description: 'Filter by school ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'gradeLevel',
        required: false,
        description: 'Filter by grade level',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'screeningType',
        required: false,
        description: 'Filter by screening type',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Overdue screenings retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [screening_dto_1.OverdueScreeningsQueryDto]),
    __metadata("design:returntype", Promise)
], ScreeningController.prototype, "getOverdueScreenings", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "GAP-SCREEN-004: Get screening schedule", summary: 'Get screening schedule',
        description: 'Retrieves required screening schedule by grade level and state.' }),
    (0, common_1.Get)('schedule'),
    (0, swagger_1.ApiQuery)({
        name: 'gradeLevel',
        required: false,
        description: 'Grade level',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'stateCode',
        required: false,
        description: 'State code for state-specific requirements',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Screening schedule retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [screening_dto_1.ScreeningScheduleQueryDto]),
    __metadata("design:returntype", Promise)
], ScreeningController.prototype, "getScreeningSchedule", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "GAP-SCREEN-005: Create screening referral", summary: 'Create screening referral',
        description: 'Creates a referral to a specialist based on screening results.' }),
    (0, common_1.Post)(':id/referral'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Screening UUID',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Referral created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Screening not found',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: Object }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, screening_dto_1.CreateReferralDto]),
    __metadata("design:returntype", Promise)
], ScreeningController.prototype, "createReferral", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "GAP-SCREEN-006: Get screening statistics", summary: 'Get screening statistics',
        description: 'Retrieves screening statistics and compliance metrics.' }),
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiQuery)({
        name: 'schoolId',
        required: false,
        description: 'Filter by school ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        description: 'Start date for statistics',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        description: 'End date for statistics',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'screeningType',
        required: false,
        description: 'Filter by screening type',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Screening statistics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [screening_dto_1.ScreeningStatisticsQueryDto]),
    __metadata("design:returntype", Promise)
], ScreeningController.prototype, "getStatistics", null);
exports.ScreeningController = ScreeningController = __decorate([
    (0, swagger_1.ApiTags)('health-records-screenings'),
    (0, common_1.Controller)('health-records/screenings'),
    __metadata("design:paramtypes", [screening_service_1.ScreeningService])
], ScreeningController);
//# sourceMappingURL=screening.controller.js.map