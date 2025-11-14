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
exports.MedicationAdministrationSafetyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const administration_filters_dto_1 = require("../dto/administration/administration-filters.dto");
const base_1 = require("../../../common/base");
let MedicationAdministrationSafetyController = class MedicationAdministrationSafetyController extends base_1.BaseController {
    constructor() {
        super();
    }
    async checkAllergies(dto) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async checkInteractions(dto) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
    async calculateDose(dto) {
        throw new Error('Not implemented - Awaiting service layer integration');
    }
};
exports.MedicationAdministrationSafetyController = MedicationAdministrationSafetyController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Check allergies", summary: 'Check student allergies for medication',
        description: 'Checks if student has any allergies that may interact with the medication.' }),
    (0, common_1.Post)('check-allergies'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Allergy check completed' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [administration_filters_dto_1.CheckSafetyDto]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationSafetyController.prototype, "checkAllergies", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Check drug interactions", summary: 'Check drug-drug interactions for student',
        description: "Checks for potential drug-drug interactions with student's current medications." }),
    (0, common_1.Post)('check-interactions'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Interaction check completed' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [administration_filters_dto_1.CheckSafetyDto]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationSafetyController.prototype, "checkInteractions", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Calculate dose", summary: 'Calculate medication dose',
        description: 'Calculates appropriate dose based on patient weight, age, and prescription parameters.' }),
    (0, common_1.Post)('calculate-dose'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dose calculated successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [administration_filters_dto_1.CalculateDoseDto]),
    __metadata("design:returntype", Promise)
], MedicationAdministrationSafetyController.prototype, "calculateDose", null);
exports.MedicationAdministrationSafetyController = MedicationAdministrationSafetyController = __decorate([
    (0, swagger_1.ApiTags)('Medication Administration'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('medications/administrations'),
    __metadata("design:paramtypes", [])
], MedicationAdministrationSafetyController);
//# sourceMappingURL=medication-administration-safety.controller.js.map