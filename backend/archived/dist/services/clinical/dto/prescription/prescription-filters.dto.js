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
exports.PrescriptionFiltersDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const prescription_status_enum_1 = require("../../enums/prescription-status.enum");
class PrescriptionFiltersDto {
    studentId;
    visitId;
    treatmentPlanId;
    prescribedBy;
    status;
    drugName;
    activeOnly;
    limit = 20;
    offset = 0;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: false, type: () => String, format: "uuid" }, visitId: { required: false, type: () => String, format: "uuid" }, treatmentPlanId: { required: false, type: () => String, format: "uuid" }, prescribedBy: { required: false, type: () => String, format: "uuid" }, status: { required: false, enum: require("../../enums/prescription-status.enum").PrescriptionStatus }, drugName: { required: false, type: () => String }, activeOnly: { required: false, type: () => Boolean }, limit: { required: false, type: () => Number, default: 20, minimum: 1, maximum: 100 }, offset: { required: false, type: () => Number, default: 0, minimum: 0 } };
    }
}
exports.PrescriptionFiltersDto = PrescriptionFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by student ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PrescriptionFiltersDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by clinic visit ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PrescriptionFiltersDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by treatment plan ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PrescriptionFiltersDto.prototype, "treatmentPlanId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by prescriber' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PrescriptionFiltersDto.prototype, "prescribedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by status',
        enum: prescription_status_enum_1.PrescriptionStatus,
    }),
    (0, class_validator_1.IsEnum)(prescription_status_enum_1.PrescriptionStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PrescriptionFiltersDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by drug name (partial match)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PrescriptionFiltersDto.prototype, "drugName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Show only active prescriptions',
        default: false,
    }),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PrescriptionFiltersDto.prototype, "activeOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of results to return',
        minimum: 1,
        maximum: 100,
        default: 20,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PrescriptionFiltersDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of results to skip',
        minimum: 0,
        default: 0,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PrescriptionFiltersDto.prototype, "offset", void 0);
//# sourceMappingURL=prescription-filters.dto.js.map