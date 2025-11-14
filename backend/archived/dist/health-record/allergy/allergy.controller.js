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
exports.HealthRecordAllergyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const allergy_service_1 = require("./allergy.service");
const create_allergy_dto_1 = require("./dto/create-allergy.dto");
const update_allergy_dto_1 = require("./dto/update-allergy.dto");
const check_conflicts_dto_1 = require("./dto/check-conflicts.dto");
const auth_1 = require("../../services/auth");
const auth_2 = require("../../services/auth");
const auth_3 = require("../../services/auth");
const models_1 = require("../../database/models");
const base_1 = require("../../common/base");
let HealthRecordAllergyController = class HealthRecordAllergyController extends base_1.BaseController {
    allergyService;
    constructor(allergyService) {
        super();
        this.allergyService = allergyService;
    }
    async getAllergyById(id, req) {
        return this.allergyService.findOne(id, req.user);
    }
    async getStudentAllergies(studentId, req) {
        return this.allergyService.findByStudent(studentId, req.user);
    }
    async create(req, createAllergyDto) {
        return this.allergyService.create(createAllergyDto, req.user);
    }
    async updateAllergy(id, updateAllergyDto, req) {
        return this.allergyService.update(id, updateAllergyDto, req.user);
    }
    async checkMedicationConflicts(checkDto, req) {
        const result = await this.allergyService.checkMedicationInteractions(checkDto.studentId, checkDto.medicationName);
        let recommendation = 'SAFE';
        let warning;
        if (result.hasInteractions) {
            const hasSevere = result.interactions.some((i) => i.severity === 'SEVERE' || i.severity === 'LIFE_THREATENING');
            if (hasSevere) {
                recommendation = 'DO_NOT_ADMINISTER';
                warning = `CRITICAL: Patient has life-threatening or severe allergy. DO NOT administer ${checkDto.medicationName}.`;
            }
            else {
                recommendation = 'CONSULT_PHYSICIAN';
                warning = `CAUTION: Potential allergic reaction detected. Consult physician before administering ${checkDto.medicationName}.`;
            }
        }
        return {
            hasConflicts: result.hasInteractions,
            conflicts: result.interactions.map((interaction) => ({
                allergen: interaction.allergen,
                severity: interaction.severity,
                reaction: interaction.reaction,
                conflictType: 'DIRECT_MATCH',
            })),
            recommendation,
            warning,
        };
    }
    async deleteAllergy(id, req) {
        return this.allergyService.remove(id, req.user);
    }
};
exports.HealthRecordAllergyController = HealthRecordAllergyController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get allergy by ID\n@requires Authentication", summary: 'Get allergy record by ID' }),
    (0, common_1.Get)(':id'),
    (0, auth_3.Roles)(models_1.UserRole.ADMIN, models_1.UserRole.NURSE, models_1.UserRole.COUNSELOR, models_1.UserRole.VIEWER),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Allergy UUID', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Allergy retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Allergy not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/allergy.model").Allergy }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordAllergyController.prototype, "getAllergyById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get all allergies for a student\n@requires Authentication", summary: 'Get all allergies for a student' }),
    (0, common_1.Get)('student/:studentId'),
    (0, auth_3.Roles)(models_1.UserRole.ADMIN, models_1.UserRole.NURSE, models_1.UserRole.COUNSELOR, models_1.UserRole.VIEWER),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student UUID', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student allergies retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Must be assigned nurse or admin',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student not found' }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/allergy.model").Allergy] }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordAllergyController.prototype, "getStudentAllergies", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create new allergy record\n@requires ADMIN or NURSE role", summary: 'Create new allergy record' }),
    (0, common_1.Post)(),
    (0, auth_3.Roles)(models_1.UserRole.ADMIN, models_1.UserRole.NURSE),
    (0, swagger_1.ApiBody)({ type: create_allergy_dto_1.CreateAllergyDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The allergy record has been successfully created.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - invalid data provided.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - authentication required.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error.',
    }),
    openapi.ApiResponse({ status: 201, type: require("../../database/models/allergy.model").Allergy }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_allergy_dto_1.CreateAllergyDto]),
    __metadata("design:returntype", Promise)
], HealthRecordAllergyController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update allergy record\n@requires ADMIN or NURSE role", summary: 'Update allergy record' }),
    (0, common_1.Put)(':id'),
    (0, auth_3.Roles)(models_1.UserRole.ADMIN, models_1.UserRole.NURSE),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Allergy UUID', type: 'string' }),
    (0, swagger_1.ApiBody)({ type: update_allergy_dto_1.UpdateAllergyDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Allergy updated successfully with audit entry',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Validation error' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Requires NURSE or ADMIN role',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Allergy not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/allergy.model").Allergy }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_allergy_dto_1.UpdateAllergyDto, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordAllergyController.prototype, "updateAllergy", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Check medication-allergy conflicts\nCRITICAL SAFETY FEATURE - Prevents allergic reactions\n@requires Authentication", summary: 'Check medication-allergy conflicts (CRITICAL SAFETY)',
        description: "Checks if a medication conflicts with student's known allergies. Returns severity level and recommendations." }),
    (0, common_1.Post)('check-conflicts'),
    (0, auth_3.Roles)(models_1.UserRole.ADMIN, models_1.UserRole.NURSE, models_1.UserRole.COUNSELOR),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBody)({ type: check_conflicts_dto_1.CheckMedicationConflictsDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Conflict check completed successfully',
        type: check_conflicts_dto_1.MedicationConflictResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid student ID or medication name',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Requires NURSE, COUNSELOR, or ADMIN role',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: require("./dto/check-conflicts.dto").MedicationConflictResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_conflicts_dto_1.CheckMedicationConflictsDto, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordAllergyController.prototype, "checkMedicationConflicts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete allergy record\n@requires ADMIN role", summary: 'Delete allergy record (Admin only)' }),
    (0, common_1.Delete)(':id'),
    (0, auth_3.Roles)(models_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Allergy UUID', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Allergy deleted successfully (no content)',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin only' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Allergy not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordAllergyController.prototype, "deleteAllergy", null);
exports.HealthRecordAllergyController = HealthRecordAllergyController = __decorate([
    (0, swagger_1.ApiTags)('Health Records - Allergies'),
    (0, common_1.Controller)('health-records/allergies'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_2.RolesGuard),
    __metadata("design:paramtypes", [allergy_service_1.AllergyService])
], HealthRecordAllergyController);
//# sourceMappingURL=allergy.controller.js.map