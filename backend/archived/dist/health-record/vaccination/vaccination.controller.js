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
exports.VaccinationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const vaccination_service_1 = require("./vaccination.service");
const create_vaccination_dto_1 = require("./dto/create-vaccination.dto");
const base_1 = require("../../common/base");
const vaccination_endpoints_dto_1 = require("./dto/vaccination-endpoints.dto");
let VaccinationController = class VaccinationController extends base_1.BaseController {
    vaccinationService;
    constructor(vaccinationService) {
        super();
        this.vaccinationService = vaccinationService;
    }
    async create(createDto) {
        return this.vaccinationService.addVaccination(createDto);
    }
    async getHistory(studentId) {
        return this.vaccinationService.getVaccinationHistory(studentId);
    }
    async checkCompliance(studentId) {
        return this.vaccinationService.checkComplianceStatus(studentId);
    }
    async getDueVaccinations(studentId) {
        return this.vaccinationService.getDueVaccinations(studentId);
    }
    async getOverdueVaccinationsForStudent(studentId) {
        return this.vaccinationService.getOverdueVaccinationsForStudent(studentId);
    }
    async batchImport(batchDto) {
        return this.vaccinationService.batchImport(batchDto.vaccinations);
    }
    async getCDCSchedule(query) {
        return this.vaccinationService.getCDCSchedule(query);
    }
    async createExemption(studentId, exemptionDto) {
        return this.vaccinationService.createExemption(studentId, exemptionDto);
    }
    async getComplianceReport(query) {
        return this.vaccinationService.getComplianceReport(query);
    }
};
exports.VaccinationController = VaccinationController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Add vaccination record',
        description: 'Records a vaccination with CDC CVX code, lot number, and administration details.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Vaccination recorded successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: require("../../database/models/vaccination.model").Vaccination }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vaccination_dto_1.CreateVaccinationDto]),
    __metadata("design:returntype", Promise)
], VaccinationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get vaccination history',
        description: 'Retrieves complete vaccination history for a student.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Vaccination history retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/vaccination.model").Vaccination] }),
    __param(0, (0, common_1.Param)('studentId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VaccinationController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('student/:studentId/compliance'),
    (0, swagger_1.ApiOperation)({
        summary: 'Check compliance status',
        description: 'Checks student vaccination compliance against CDC guidelines.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Compliance status retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                compliant: { type: 'boolean' },
                missing: { type: 'array', items: { type: 'string' } },
                upcoming: { type: 'array', items: { type: 'string' } },
            },
        },
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('studentId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VaccinationController.prototype, "checkCompliance", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "GAP-VAX-001: Get due vaccinations for student", summary: 'Get due vaccinations for student',
        description: 'Returns list of upcoming vaccinations due for the student.' }),
    (0, common_1.Get)('student/:studentId/due'),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Due vaccinations retrieved successfully',
        type: vaccination_endpoints_dto_1.DueVaccinationsResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/vaccination-endpoints.dto").DueVaccinationsResponseDto }),
    __param(0, (0, common_1.Param)('studentId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VaccinationController.prototype, "getDueVaccinations", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "GAP-VAX-002: Get overdue vaccinations for student", summary: 'Get overdue vaccinations for student',
        description: 'Returns list of overdue vaccinations for the student.' }),
    (0, common_1.Get)('student/:studentId/overdue'),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Overdue vaccinations retrieved successfully',
        type: vaccination_endpoints_dto_1.DueVaccinationsResponseDto,
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/vaccination-endpoints.dto").DueVaccinationsResponseDto }),
    __param(0, (0, common_1.Param)('studentId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VaccinationController.prototype, "getOverdueVaccinationsForStudent", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "GAP-VAX-003: Batch vaccination import", summary: 'Import vaccinations in batch',
        description: 'Imports multiple vaccination records at once for bulk data entry.' }),
    (0, common_1.Post)('batch'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Batch import completed',
        type: vaccination_endpoints_dto_1.BatchImportResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: require("./dto/vaccination-endpoints.dto").BatchImportResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vaccination_endpoints_dto_1.BatchVaccinationDto]),
    __metadata("design:returntype", Promise)
], VaccinationController.prototype, "batchImport", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "GAP-VAX-004: Get CDC vaccination schedule", summary: 'Get CDC vaccination schedule',
        description: 'Returns CDC-recommended vaccination schedule by age or grade.' }),
    (0, common_1.Get)('cdc-schedule'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'CDC schedule retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vaccination_endpoints_dto_1.CDCScheduleQueryDto]),
    __metadata("design:returntype", Promise)
], VaccinationController.prototype, "getCDCSchedule", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "GAP-VAX-005: Create vaccination exemption", summary: 'Add vaccination exemption',
        description: 'Creates medical, religious, or personal exemption for vaccination requirements.' }),
    (0, common_1.Post)('student/:studentId/exemption'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiParam)({
        name: 'studentId',
        description: 'Student UUID',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Exemption created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid exemption data',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: require("../../database/models/vaccination.model").Vaccination }),
    __param(0, (0, common_1.Param)('studentId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, vaccination_endpoints_dto_1.CreateExemptionDto]),
    __metadata("design:returntype", Promise)
], VaccinationController.prototype, "createExemption", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "GAP-VAX-006: Get compliance report", summary: 'Get vaccination compliance report',
        description: 'Generates compliance report across students with filtering options.' }),
    (0, common_1.Get)('compliance-report'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Compliance report generated successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vaccination_endpoints_dto_1.ComplianceReportQueryDto]),
    __metadata("design:returntype", Promise)
], VaccinationController.prototype, "getComplianceReport", null);
exports.VaccinationController = VaccinationController = __decorate([
    (0, swagger_1.ApiTags)('health-record-vaccination'),
    (0, common_1.Controller)('health-record/vaccination'),
    __metadata("design:paramtypes", [vaccination_service_1.VaccinationService])
], VaccinationController);
//# sourceMappingURL=vaccination.controller.js.map