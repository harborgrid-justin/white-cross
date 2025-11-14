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
exports.DrugAllergyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const drug_interaction_service_1 = require("../services/drug-interaction.service");
const add_allergy_dto_1 = require("../dto/drug/add-allergy.dto");
const update_allergy_dto_1 = require("../dto/drug/update-allergy.dto");
const base_1 = require("../../../common/base");
let DrugAllergyController = class DrugAllergyController extends base_1.BaseController {
    drugInteractionService;
    constructor(drugInteractionService) {
        super();
        this.drugInteractionService = drugInteractionService;
    }
    async addAllergy(addAllergyDto) {
        return this.drugInteractionService.addAllergy(addAllergyDto);
    }
    async updateAllergy(id, updateAllergyDto) {
        return this.drugInteractionService.updateAllergy(id, updateAllergyDto);
    }
    async deleteAllergy(id) {
        await this.drugInteractionService.deleteAllergy(id);
    }
    async getStudentAllergies(studentId) {
        return this.drugInteractionService.getStudentAllergies(studentId);
    }
};
exports.DrugAllergyController = DrugAllergyController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Add student drug allergy", summary: 'Add student drug allergy' }),
    (0, common_1.Post)('allergies'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Allergy recorded successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Allergy already exists' }),
    openapi.ApiResponse({ status: 201, type: require("../../../database/models/student-drug-allergy.model").StudentDrugAllergy }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_allergy_dto_1.AddAllergyDto]),
    __metadata("design:returntype", Promise)
], DrugAllergyController.prototype, "addAllergy", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update student drug allergy", summary: 'Update student drug allergy' }),
    (0, common_1.Patch)('allergies/:id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Allergy ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Allergy updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Allergy not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../../database/models/student-drug-allergy.model").StudentDrugAllergy }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_allergy_dto_1.ClinicalUpdateAllergyDto]),
    __metadata("design:returntype", Promise)
], DrugAllergyController.prototype, "updateAllergy", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete student drug allergy", summary: 'Delete student drug allergy' }),
    (0, common_1.Delete)('allergies/:id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Allergy ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Allergy deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Allergy not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DrugAllergyController.prototype, "deleteAllergy", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get student drug allergies", summary: 'Get all allergies for a student' }),
    (0, common_1.Get)('allergies/student/:studentId'),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Allergies found successfully' }),
    openapi.ApiResponse({ status: 200, type: [require("../../../database/models/student-drug-allergy.model").StudentDrugAllergy] }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DrugAllergyController.prototype, "getStudentAllergies", null);
exports.DrugAllergyController = DrugAllergyController = __decorate([
    (0, swagger_1.ApiTags)('Clinical - Drug Allergies'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clinical/drugs'),
    __metadata("design:paramtypes", [drug_interaction_service_1.DrugInteractionService])
], DrugAllergyController);
//# sourceMappingURL=drug-allergy.controller.js.map