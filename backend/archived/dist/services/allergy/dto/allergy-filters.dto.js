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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllergyFiltersDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../../../common/enums");
const models_1 = require("../../../database/models");
class AllergyFiltersDto {
    studentId;
    severity;
    allergenType;
    verified;
    isActive;
    searchTerm;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: false, type: () => String, description: "Filter to specific student's allergies", format: "uuid" }, severity: { required: false, description: "Filter by severity level", enum: require("../../../common/enums").AllergySeverity }, allergenType: { required: false, description: "Filter by allergen category", enum: require("../../../database/models/allergy.model").AllergyType }, verified: { required: false, type: () => Boolean, description: "Filter by verification status" }, isActive: { required: false, type: () => Boolean, description: "Filter by active status" }, searchTerm: { required: false, type: () => String, description: "Full-text search across allergen, reaction, treatment, notes" } };
    }
}
exports.AllergyFiltersDto = AllergyFiltersDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AllergyFiltersDto.prototype, "studentId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.AllergySeverity),
    __metadata("design:type", String)
], AllergyFiltersDto.prototype, "severity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.AllergyType),
    __metadata("design:type", String)
], AllergyFiltersDto.prototype, "allergenType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AllergyFiltersDto.prototype, "verified", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AllergyFiltersDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AllergyFiltersDto.prototype, "searchTerm", void 0);
//# sourceMappingURL=allergy-filters.dto.js.map