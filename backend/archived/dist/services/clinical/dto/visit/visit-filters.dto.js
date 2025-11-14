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
exports.VisitFiltersDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const visit_disposition_enum_1 = require("../../enums/visit-disposition.enum");
const class_transformer_1 = require("class-transformer");
class VisitFiltersDto {
    studentId;
    attendedBy;
    disposition;
    dateFrom;
    dateTo;
    activeOnly;
    limit = 20;
    offset = 0;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: false, type: () => String, format: "uuid" }, attendedBy: { required: false, type: () => String, format: "uuid" }, disposition: { required: false, enum: require("../../enums/visit-disposition.enum").VisitDisposition }, dateFrom: { required: false, type: () => Date }, dateTo: { required: false, type: () => Date }, activeOnly: { required: false, type: () => Boolean }, limit: { required: false, type: () => Number, default: 20, minimum: 1, maximum: 100 }, offset: { required: false, type: () => Number, default: 0, minimum: 0 } };
    }
}
exports.VisitFiltersDto = VisitFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by student ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], VisitFiltersDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by attending healthcare provider ID',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], VisitFiltersDto.prototype, "attendedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by visit disposition',
        enum: visit_disposition_enum_1.VisitDisposition,
        example: visit_disposition_enum_1.VisitDisposition.RETURN_TO_CLASS,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(visit_disposition_enum_1.VisitDisposition),
    __metadata("design:type", String)
], VisitFiltersDto.prototype, "disposition", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter visits from this date',
        example: '2024-01-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], VisitFiltersDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter visits until this date',
        example: '2024-12-31',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], VisitFiltersDto.prototype, "dateTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Show only active visits (not checked out)',
        example: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], VisitFiltersDto.prototype, "activeOnly", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum number of results',
        example: 20,
        default: 20,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], VisitFiltersDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of results to skip (for pagination)',
        example: 0,
        default: 0,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], VisitFiltersDto.prototype, "offset", void 0);
//# sourceMappingURL=visit-filters.dto.js.map