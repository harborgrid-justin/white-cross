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
exports.ChronicConditionFiltersDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const condition_status_enum_1 = require("../enums/condition-status.enum");
class ChronicConditionFiltersDto {
    studentId;
    status;
    requiresIEP;
    requires504;
    isActive;
    searchTerm;
    reviewDueSoon;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: false, type: () => String, format: "uuid" }, status: { required: false, enum: require("../enums/condition-status.enum").ConditionStatus }, requiresIEP: { required: false, type: () => Boolean }, requires504: { required: false, type: () => Boolean }, isActive: { required: false, type: () => Boolean }, searchTerm: { required: false, type: () => String }, reviewDueSoon: { required: false, type: () => Boolean } };
    }
}
exports.ChronicConditionFiltersDto = ChronicConditionFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by specific student UUID',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ChronicConditionFiltersDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by management status',
        enum: condition_status_enum_1.ConditionStatus,
        example: condition_status_enum_1.ConditionStatus.ACTIVE,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(condition_status_enum_1.ConditionStatus),
    __metadata("design:type", String)
], ChronicConditionFiltersDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter conditions requiring IEP plans',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ChronicConditionFiltersDto.prototype, "requiresIEP", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter conditions requiring 504 plans',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ChronicConditionFiltersDto.prototype, "requires504", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by active/inactive status',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ChronicConditionFiltersDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Full-text search across condition, ICD code, notes, care plan',
        example: 'diabetes',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChronicConditionFiltersDto.prototype, "searchTerm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter conditions with reviews due within 30 days',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ChronicConditionFiltersDto.prototype, "reviewDueSoon", void 0);
//# sourceMappingURL=chronic-condition-filters.dto.js.map