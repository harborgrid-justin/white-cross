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
exports.HealthDomainController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const health_domain_service_1 = require("./health-domain.service");
const dto_1 = require("./dto");
const exemption_dto_1 = require("./dto/exemption.dto");
const base_1 = require("../common/base");
const schedule_dto_1 = require("./dto/schedule.dto");
let HealthDomainController = class HealthDomainController extends base_1.BaseController {
    healthDomainService;
    constructor(healthDomainService) {
        super();
        this.healthDomainService = healthDomainService;
    }
    async createHealthRecord(createDto) {
        return this.healthDomainService.createHealthRecord(createDto);
    }
    async getHealthRecord(id) {
        return this.healthDomainService.getHealthRecord(id);
    }
    async updateHealthRecord(id, updateDto) {
        return this.healthDomainService.updateHealthRecord(id, updateDto);
    }
    async deleteHealthRecord(id) {
        await this.healthDomainService.deleteHealthRecord(id);
    }
    async getStudentHealthRecords(studentId, filters, pagination) {
        return this.healthDomainService.getHealthRecords(studentId, filters, pagination.page, pagination.limit);
    }
    async searchHealthRecords(query, filters, pagination) {
        return this.healthDomainService.searchHealthRecords(query, filters, pagination.page, pagination.limit);
    }
    async bulkDeleteHealthRecords(ids) {
        return this.healthDomainService.bulkDeleteHealthRecords(ids);
    }
    async createAllergy(createDto) {
        return this.healthDomainService.createAllergy(createDto);
    }
    async updateAllergy(id, updateDto) {
        return this.healthDomainService.updateAllergy(id, updateDto);
    }
    async deleteAllergy(id) {
        await this.healthDomainService.deleteAllergy(id);
    }
    async getStudentAllergies(studentId, filters, pagination) {
        return this.healthDomainService.getStudentAllergies(studentId, filters, pagination.page, pagination.limit);
    }
    async getCriticalAllergies() {
        return this.healthDomainService.getCriticalAllergies();
    }
    async verifyAllergy(id, verifiedBy) {
        return this.healthDomainService.verifyAllergy(id, verifiedBy);
    }
    async createImmunization(createDto) {
        return this.healthDomainService.createImmunization(createDto);
    }
    async updateImmunization(id, updateDto) {
        return this.healthDomainService.updateImmunization(id, updateDto);
    }
    async deleteImmunization(id) {
        await this.healthDomainService.deleteImmunization(id);
    }
    async getStudentImmunizations(studentId, filters, pagination) {
        return this.healthDomainService.getStudentImmunizations(studentId, filters, pagination.page, pagination.limit);
    }
    async getImmunizationCompliance(studentId) {
        return this.healthDomainService.getImmunizationCompliance(studentId);
    }
    async getOverdueImmunizations(queryDto) {
        return this.healthDomainService.getOverdueImmunizations(queryDto);
    }
    async createExemption(createDto) {
        return this.healthDomainService.createExemption(createDto);
    }
    async getExemptions(filterDto, pagination) {
        return this.healthDomainService.getExemptions(filterDto, pagination.page, pagination.limit);
    }
    async getExemption(id) {
        return this.healthDomainService.getExemption(id);
    }
    async updateExemption(id, updateDto) {
        return this.healthDomainService.updateExemption(id, updateDto);
    }
    async deleteExemption(id) {
        await this.healthDomainService.deleteExemption(id);
    }
    async getStudentExemptions(studentId) {
        return this.healthDomainService.getStudentExemptions(studentId);
    }
    async getScheduleByAge(queryDto) {
        return this.healthDomainService.getScheduleByAge(queryDto);
    }
    async getCatchUpSchedule(queryDto) {
        return this.healthDomainService.getCatchUpSchedule(queryDto);
    }
    async getSchoolEntryRequirements(queryDto) {
        return this.healthDomainService.getSchoolEntryRequirements(queryDto);
    }
    async checkContraindications(queryDto) {
        return this.healthDomainService.checkContraindications(queryDto);
    }
    async getVaccinationRates(queryDto) {
        return this.healthDomainService.getVaccinationRates(queryDto);
    }
    async generateStateReport(exportDto) {
        return this.healthDomainService.generateStateReport(exportDto);
    }
    async getComplianceSummary(schoolId, gradeLevel) {
        return this.healthDomainService.getComplianceSummary(schoolId, gradeLevel);
    }
    async getExemptionRates(schoolId, vaccineName) {
        return this.healthDomainService.getExemptionRates(schoolId, vaccineName);
    }
    async createChronicCondition(createDto) {
        return this.healthDomainService.createChronicCondition(createDto);
    }
    async updateChronicCondition(id, updateDto) {
        return this.healthDomainService.updateChronicCondition(id, updateDto);
    }
    async deleteChronicCondition(id) {
        await this.healthDomainService.deleteChronicCondition(id);
    }
    async getStudentChronicConditions(studentId, filters, pagination) {
        return this.healthDomainService.getStudentChronicConditions(studentId, filters, pagination.page, pagination.limit);
    }
    async recordVitalSigns(studentId, vitals, notes) {
        return this.healthDomainService.recordVitalSigns(studentId, vitals, notes);
    }
    async getLatestVitalSigns(studentId) {
        return this.healthDomainService.getLatestVitalSigns(studentId);
    }
    async getVitalSignsHistory(studentId, pagination) {
        return this.healthDomainService.getVitalSignsHistory(studentId, pagination.page, pagination.limit);
    }
    async getGrowthData(studentId) {
        return this.healthDomainService.getGrowthData(studentId);
    }
    async checkAbnormalVitals(studentId) {
        return this.healthDomainService.checkAbnormalVitals(studentId);
    }
    async getHealthSummary(studentId) {
        return this.healthDomainService.getHealthSummary(studentId);
    }
    async getHealthStatistics(studentId) {
        return this.healthDomainService.getHealthStatistics(studentId);
    }
    async exportStudentData(studentId, options) {
        return this.healthDomainService.exportStudentData(studentId, options);
    }
    async importStudentData(importData, options) {
        return this.healthDomainService.importStudentData(importData, options);
    }
};
exports.HealthDomainController = HealthDomainController;
__decorate([
    (0, common_1.Post)('records'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new health record' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Health record created successfully',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.HealthDomainCreateRecordDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "createHealthRecord", null);
__decorate([
    (0, common_1.Get)('records/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get health record by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Health record ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health record retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getHealthRecord", null);
__decorate([
    (0, common_1.Put)('records/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update health record' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Health record ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health record updated successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.HealthDomainUpdateRecordDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "updateHealthRecord", null);
__decorate([
    (0, common_1.Delete)('records/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete health record' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Health record ID' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Health record deleted successfully',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "deleteHealthRecord", null);
__decorate([
    (0, common_1.Get)('records/student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get health records for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health records retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.HealthRecordFiltersDto,
        dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getStudentHealthRecords", null);
__decorate([
    (0, common_1.Get)('records/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search health records' }),
    (0, swagger_1.ApiQuery)({ name: 'query', description: 'Search query' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Search results retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.HealthRecordFiltersDto,
        dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "searchHealthRecords", null);
__decorate([
    (0, common_1.Delete)('records/bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk delete health records' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Records deleted successfully' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Object }),
    __param(0, (0, common_1.Body)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "bulkDeleteHealthRecords", null);
__decorate([
    (0, common_1.Post)('allergies'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new allergy record' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Allergy record created successfully',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.HealthDomainCreateAllergyDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "createAllergy", null);
__decorate([
    (0, common_1.Put)('allergies/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update allergy record' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Allergy ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Allergy record updated successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.HealthDomainUpdateAllergyDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "updateAllergy", null);
__decorate([
    (0, common_1.Delete)('allergies/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete allergy record' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Allergy ID' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Allergy record deleted successfully',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "deleteAllergy", null);
__decorate([
    (0, common_1.Get)('allergies/student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get allergies for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Allergies retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AllergyFiltersDto,
        dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getStudentAllergies", null);
__decorate([
    (0, common_1.Get)('allergies/critical'),
    (0, swagger_1.ApiOperation)({ summary: 'Get critical allergies across all students' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Critical allergies retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getCriticalAllergies", null);
__decorate([
    (0, common_1.Post)('allergies/:id/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify an allergy' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Allergy ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Allergy verified successfully' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('verifiedBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "verifyAllergy", null);
__decorate([
    (0, common_1.Post)('immunizations'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new immunization record' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Immunization record created successfully',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateImmunizationDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "createImmunization", null);
__decorate([
    (0, common_1.Put)('immunizations/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update immunization record' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Immunization ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Immunization record updated successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateImmunizationDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "updateImmunization", null);
__decorate([
    (0, common_1.Delete)('immunizations/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete immunization record' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Immunization ID' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Immunization record deleted successfully',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "deleteImmunization", null);
__decorate([
    (0, common_1.Get)('immunizations/student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get immunizations for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Immunizations retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.VaccinationFiltersDto,
        dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getStudentImmunizations", null);
__decorate([
    (0, common_1.Get)('immunizations/compliance/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get immunization compliance report for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Compliance report retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getImmunizationCompliance", null);
__decorate([
    (0, common_1.Get)('immunizations/overdue'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overdue immunizations across all students' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Overdue immunizations retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_dto_1.OverdueVaccinationsQueryDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getOverdueImmunizations", null);
__decorate([
    (0, common_1.Post)('immunizations/exemptions'),
    (0, swagger_1.ApiOperation)({
        summary: 'Record vaccine exemption',
        description: 'Creates a new vaccine exemption request. Medical exemptions require provider documentation.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Exemption created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid exemption data' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [exemption_dto_1.HealthDomainCreateExemptionDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "createExemption", null);
__decorate([
    (0, common_1.Get)('immunizations/exemptions'),
    (0, swagger_1.ApiOperation)({ summary: 'List vaccine exemptions with filters' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Exemptions retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [exemption_dto_1.ExemptionFilterDto,
        dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getExemptions", null);
__decorate([
    (0, common_1.Get)('immunizations/exemptions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get exemption by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Exemption UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exemption retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Exemption not found' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getExemption", null);
__decorate([
    (0, common_1.Put)('immunizations/exemptions/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update exemption',
        description: 'Updates exemption details or status (approve/deny)',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Exemption UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exemption updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Exemption not found' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, exemption_dto_1.UpdateExemptionDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "updateExemption", null);
__decorate([
    (0, common_1.Delete)('immunizations/exemptions/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete exemption' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Exemption UUID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Exemption deleted successfully' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "deleteExemption", null);
__decorate([
    (0, common_1.Get)('immunizations/exemptions/student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all exemptions for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student exemptions retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getStudentExemptions", null);
__decorate([
    (0, common_1.Get)('immunizations/schedules/age'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get vaccination schedule by age',
        description: 'Returns CDC-recommended vaccination schedule for specific age',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_dto_1.GetScheduleByAgeDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getScheduleByAge", null);
__decorate([
    (0, common_1.Get)('immunizations/schedules/catch-up'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get catch-up vaccination schedule',
        description: 'Calculates catch-up schedule for students who are behind on vaccinations',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Catch-up schedule retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_dto_1.GetCatchUpScheduleDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getCatchUpSchedule", null);
__decorate([
    (0, common_1.Get)('immunizations/schedules/school-entry'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get school entry requirements',
        description: 'Returns state-specific vaccination requirements for school entry by grade level',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'School entry requirements retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_dto_1.SchoolEntryRequirementsDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getSchoolEntryRequirements", null);
__decorate([
    (0, common_1.Post)('immunizations/schedules/check-contraindications'),
    (0, swagger_1.ApiOperation)({
        summary: 'Check contraindications for vaccine',
        description: 'Checks student allergies and conditions for vaccine contraindications',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Contraindications check completed',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_dto_1.CheckContraindicationsDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "checkContraindications", null);
__decorate([
    (0, common_1.Get)('immunizations/reports/vaccination-rates'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get vaccination rates report',
        description: 'Generates vaccination coverage rates by school, grade, or vaccine type',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Vaccination rates retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_dto_1.VaccinationRatesQueryDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getVaccinationRates", null);
__decorate([
    (0, common_1.Post)('immunizations/reports/state-export'),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate state registry export',
        description: 'Exports vaccination data in state-required format (HL7, CSV, etc.) for registry submission',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'State report generated successfully',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_dto_1.StateReportingExportDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "generateStateReport", null);
__decorate([
    (0, common_1.Get)('immunizations/reports/compliance-summary'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get compliance summary report',
        description: 'Returns overall compliance statistics across schools/grades',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Compliance summary retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('schoolId')),
    __param(1, (0, common_1.Query)('gradeLevel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getComplianceSummary", null);
__decorate([
    (0, common_1.Get)('immunizations/reports/exemption-rates'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get exemption rates report',
        description: 'Returns exemption statistics by type, school, and vaccine',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Exemption rates retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('schoolId')),
    __param(1, (0, common_1.Query)('vaccineName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getExemptionRates", null);
__decorate([
    (0, common_1.Post)('chronic-conditions'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new chronic condition record' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Chronic condition record created successfully',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.HealthDomainCreateChronicConditionDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "createChronicCondition", null);
__decorate([
    (0, common_1.Put)('chronic-conditions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update chronic condition record' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Chronic condition ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chronic condition record updated successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.HealthDomainUpdateChronicConditionDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "updateChronicCondition", null);
__decorate([
    (0, common_1.Delete)('chronic-conditions/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete chronic condition record' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Chronic condition ID' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Chronic condition record deleted successfully',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "deleteChronicCondition", null);
__decorate([
    (0, common_1.Get)('chronic-conditions/student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chronic conditions for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chronic conditions retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ChronicConditionFiltersDto,
        dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getStudentChronicConditions", null);
__decorate([
    (0, common_1.Post)('vital-signs'),
    (0, swagger_1.ApiOperation)({ summary: 'Record vital signs' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Vital signs recorded successfully',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)('studentId')),
    __param(1, (0, common_1.Body)('vitals')),
    __param(2, (0, common_1.Body)('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "recordVitalSigns", null);
__decorate([
    (0, common_1.Get)('vital-signs/latest/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get latest vital signs for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Latest vital signs retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getLatestVitalSigns", null);
__decorate([
    (0, common_1.Get)('vital-signs/student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vital signs history for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Vital signs history retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getVitalSignsHistory", null);
__decorate([
    (0, common_1.Get)('vital-signs/growth/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get growth chart data for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Growth data retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getGrowthData", null);
__decorate([
    (0, common_1.Get)('vital-signs/abnormal/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Check for abnormal vital signs' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Abnormal vitals check completed' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "checkAbnormalVitals", null);
__decorate([
    (0, common_1.Get)('analytics/summary/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get health summary for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health summary retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getHealthSummary", null);
__decorate([
    (0, common_1.Get)('analytics/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get health statistics' }),
    (0, swagger_1.ApiQuery)({
        name: 'studentId',
        required: false,
        description: 'Optional student ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health statistics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "getHealthStatistics", null);
__decorate([
    (0, common_1.Post)('export/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Export student health data' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data exported successfully' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "exportStudentData", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, swagger_1.ApiOperation)({ summary: 'Import student health data' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Data imported successfully' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)('importData')),
    __param(1, (0, common_1.Body)('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HealthDomainController.prototype, "importStudentData", null);
exports.HealthDomainController = HealthDomainController = __decorate([
    (0, swagger_1.ApiTags)('Health Domains'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('health-domains'),
    __metadata("design:paramtypes", [health_domain_service_1.HealthDomainService])
], HealthDomainController);
//# sourceMappingURL=health-domain.controller.js.map