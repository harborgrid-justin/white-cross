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
exports.IncidentFilterDto = exports.UpdateIncidentStatusDto = exports.SecurityCreateIncidentDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const incident_severity_enum_1 = require("../enums/incident-severity.enum");
const incident_status_enum_1 = require("../enums/incident-status.enum");
const incident_type_enum_1 = require("../enums/incident-type.enum");
class SecurityCreateIncidentDto {
    type;
    severity;
    title;
    description;
    userId;
    ipAddress;
    userAgent;
    resourceAccessed;
    detectionMethod;
    indicators;
    impact;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, enum: require("../enums/incident-type.enum").SecurityIncidentType }, severity: { required: true, enum: require("../enums/incident-severity.enum").IncidentSeverity }, title: { required: true, type: () => String }, description: { required: true, type: () => String }, userId: { required: false, type: () => String }, ipAddress: { required: false, type: () => String }, userAgent: { required: false, type: () => String }, resourceAccessed: { required: false, type: () => String }, detectionMethod: { required: true, type: () => String }, indicators: { required: true, type: () => [String] }, impact: { required: false, type: () => String }, metadata: { required: false, type: () => Object } };
    }
}
exports.SecurityCreateIncidentDto = SecurityCreateIncidentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: incident_type_enum_1.SecurityIncidentType,
        description: 'Type of security incident',
    }),
    (0, class_validator_1.IsEnum)(incident_type_enum_1.SecurityIncidentType),
    __metadata("design:type", String)
], SecurityCreateIncidentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: incident_severity_enum_1.IncidentSeverity,
        description: 'Severity level of the incident',
    }),
    (0, class_validator_1.IsEnum)(incident_severity_enum_1.IncidentSeverity),
    __metadata("design:type", String)
], SecurityCreateIncidentDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Incident title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SecurityCreateIncidentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed description of the incident' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SecurityCreateIncidentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID associated with the incident' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SecurityCreateIncidentDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'IP address associated with the incident',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SecurityCreateIncidentDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User agent string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SecurityCreateIncidentDto.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Resource that was accessed' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SecurityCreateIncidentDto.prototype, "resourceAccessed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Method of detection' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SecurityCreateIncidentDto.prototype, "detectionMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicators that triggered detection',
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SecurityCreateIncidentDto.prototype, "indicators", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Impact assessment' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SecurityCreateIncidentDto.prototype, "impact", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional metadata',
        type: 'object',
        additionalProperties: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SecurityCreateIncidentDto.prototype, "metadata", void 0);
class UpdateIncidentStatusDto {
    status;
    assignedTo;
    resolution;
    preventiveMeasures;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: true, enum: require("../enums/incident-status.enum").IncidentStatus }, assignedTo: { required: false, type: () => String }, resolution: { required: false, type: () => String }, preventiveMeasures: { required: false, type: () => [String] } };
    }
}
exports.UpdateIncidentStatusDto = UpdateIncidentStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: incident_status_enum_1.IncidentStatus,
        description: 'New status for the incident',
    }),
    (0, class_validator_1.IsEnum)(incident_status_enum_1.IncidentStatus),
    __metadata("design:type", String)
], UpdateIncidentStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID to assign the incident to' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIncidentStatusDto.prototype, "assignedTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Resolution details' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateIncidentStatusDto.prototype, "resolution", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preventive measures taken',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateIncidentStatusDto.prototype, "preventiveMeasures", void 0);
class IncidentFilterDto {
    type;
    severity;
    status;
    userId;
    startDate;
    endDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: false, enum: require("../enums/incident-type.enum").SecurityIncidentType }, severity: { required: false, enum: require("../enums/incident-severity.enum").IncidentSeverity }, status: { required: false, enum: require("../enums/incident-status.enum").IncidentStatus }, userId: { required: false, type: () => String }, startDate: { required: false, type: () => String }, endDate: { required: false, type: () => String } };
    }
}
exports.IncidentFilterDto = IncidentFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: incident_type_enum_1.SecurityIncidentType,
        description: 'Filter by incident type',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(incident_type_enum_1.SecurityIncidentType),
    __metadata("design:type", String)
], IncidentFilterDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: incident_severity_enum_1.IncidentSeverity,
        description: 'Filter by severity',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(incident_severity_enum_1.IncidentSeverity),
    __metadata("design:type", String)
], IncidentFilterDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: incident_status_enum_1.IncidentStatus,
        description: 'Filter by status',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(incident_status_enum_1.IncidentStatus),
    __metadata("design:type", String)
], IncidentFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by user ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IncidentFilterDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start date for filtering' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], IncidentFilterDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date for filtering' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], IncidentFilterDto.prototype, "endDate", void 0);
//# sourceMappingURL=security-incident.dto.js.map