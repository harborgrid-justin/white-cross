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
exports.IncidentFiltersDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const incident_severity_enum_1 = require("../enums/incident-severity.enum");
const incident_type_enum_1 = require("../enums/incident-type.enum");
class IncidentFiltersDto {
    studentId;
    reportedById;
    type;
    severity;
    dateFrom;
    dateTo;
    parentNotified;
    followUpRequired;
    page = 1;
    limit = 20;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: false, type: () => String, format: "uuid" }, reportedById: { required: false, type: () => String, format: "uuid" }, type: { required: false, enum: require("../enums/incident-type.enum").IncidentType }, severity: { required: false, enum: require("../enums/incident-severity.enum").IncidentSeverity }, dateFrom: { required: false, type: () => Date }, dateTo: { required: false, type: () => Date }, parentNotified: { required: false, type: () => Boolean }, followUpRequired: { required: false, type: () => Boolean }, page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 20, minimum: 1, maximum: 100 } };
    }
}
exports.IncidentFiltersDto = IncidentFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Student ID filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], IncidentFiltersDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reporter ID filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], IncidentFiltersDto.prototype, "reportedById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Incident type filter',
        enum: incident_type_enum_1.IncidentType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(incident_type_enum_1.IncidentType),
    __metadata("design:type", String)
], IncidentFiltersDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Severity filter',
        enum: incident_severity_enum_1.IncidentSeverity,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(incident_severity_enum_1.IncidentSeverity),
    __metadata("design:type", String)
], IncidentFiltersDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date from filter',
        example: '2025-01-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], IncidentFiltersDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date to filter', example: '2025-12-31' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], IncidentFiltersDto.prototype, "dateTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Parent notified filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], IncidentFiltersDto.prototype, "parentNotified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Follow-up required filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], IncidentFiltersDto.prototype, "followUpRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', default: 1, minimum: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], IncidentFiltersDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Items per page',
        default: 20,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], IncidentFiltersDto.prototype, "limit", void 0);
//# sourceMappingURL=incident-filters.dto.js.map