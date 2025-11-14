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
exports.CalculateDoseDto = exports.CheckSafetyDto = exports.AdministrationHistoryFiltersDto = exports.AdministrationStatus = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var AdministrationStatus;
(function (AdministrationStatus) {
    AdministrationStatus["ADMINISTERED"] = "administered";
    AdministrationStatus["REFUSED"] = "refused";
    AdministrationStatus["MISSED"] = "missed";
    AdministrationStatus["HELD"] = "held";
    AdministrationStatus["ERROR"] = "error";
})(AdministrationStatus || (exports.AdministrationStatus = AdministrationStatus = {}));
class AdministrationHistoryFiltersDto {
    studentId;
    medicationId;
    prescriptionId;
    administeredBy;
    status;
    startDate;
    endDate;
    page = 1;
    limit = 20;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: false, type: () => String }, medicationId: { required: false, type: () => String }, prescriptionId: { required: false, type: () => String }, administeredBy: { required: false, type: () => String }, status: { required: false, enum: require("./administration-filters.dto").AdministrationStatus }, startDate: { required: false, type: () => String }, endDate: { required: false, type: () => String }, page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 20, minimum: 1, maximum: 100 } };
    }
}
exports.AdministrationHistoryFiltersDto = AdministrationHistoryFiltersDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by student ID',
        example: '770e8400-e29b-41d4-a716-446655440000',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdministrationHistoryFiltersDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by medication ID',
        example: '880e8400-e29b-41d4-a716-446655440000',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdministrationHistoryFiltersDto.prototype, "medicationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by prescription ID',
        example: '660e8400-e29b-41d4-a716-446655440000',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdministrationHistoryFiltersDto.prototype, "prescriptionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by administrator (nurse) ID',
        example: '990e8400-e29b-41d4-a716-446655440000',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdministrationHistoryFiltersDto.prototype, "administeredBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by administration status',
        enum: AdministrationStatus,
        example: AdministrationStatus.ADMINISTERED,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AdministrationStatus),
    __metadata("design:type", String)
], AdministrationHistoryFiltersDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by start date (ISO 8601)',
        example: '2025-11-01T00:00:00Z',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdministrationHistoryFiltersDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by end date (ISO 8601)',
        example: '2025-11-30T23:59:59Z',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdministrationHistoryFiltersDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Page number for pagination',
        example: 1,
        default: 1,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AdministrationHistoryFiltersDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 20,
        default: 20,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], AdministrationHistoryFiltersDto.prototype, "limit", void 0);
class CheckSafetyDto {
    studentId;
    medicationId;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String }, medicationId: { required: true, type: () => String } };
    }
}
exports.CheckSafetyDto = CheckSafetyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID to check',
        example: '770e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckSafetyDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Medication ID to check',
        example: '880e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckSafetyDto.prototype, "medicationId", void 0);
class CalculateDoseDto {
    prescriptionId;
    studentId;
    static _OPENAPI_METADATA_FACTORY() {
        return { prescriptionId: { required: true, type: () => String }, studentId: { required: true, type: () => String } };
    }
}
exports.CalculateDoseDto = CalculateDoseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prescription ID',
        example: '660e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CalculateDoseDto.prototype, "prescriptionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID',
        example: '770e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CalculateDoseDto.prototype, "studentId", void 0);
//# sourceMappingURL=administration-filters.dto.js.map