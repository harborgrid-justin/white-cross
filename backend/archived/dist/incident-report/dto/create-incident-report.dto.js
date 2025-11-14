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
exports.CreateIncidentReportDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const compliance_status_enum_1 = require("../enums/compliance-status.enum");
const incident_severity_enum_1 = require("../enums/incident-severity.enum");
const incident_type_enum_1 = require("../enums/incident-type.enum");
class CreateIncidentReportDto {
    studentId;
    reportedById;
    type;
    severity;
    description;
    location;
    witnesses;
    actionsTaken;
    occurredAt;
    parentNotified;
    followUpRequired;
    followUpNotes;
    attachments;
    evidencePhotos;
    evidenceVideos;
    insuranceClaimNumber;
    legalComplianceStatus;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, reportedById: { required: true, type: () => String, format: "uuid" }, type: { required: true, enum: require("../enums/incident-type.enum").IncidentType }, severity: { required: true, enum: require("../enums/incident-severity.enum").IncidentSeverity }, description: { required: true, type: () => String, minLength: 20, maxLength: 5000 }, location: { required: true, type: () => String, minLength: 3, maxLength: 500 }, witnesses: { required: false, type: () => [String], maxLength: 100 }, actionsTaken: { required: true, type: () => String, minLength: 10, maxLength: 5000 }, occurredAt: { required: true, type: () => Date }, parentNotified: { required: false, type: () => Boolean }, followUpRequired: { required: false, type: () => Boolean }, followUpNotes: { required: false, type: () => String, maxLength: 5000 }, attachments: { required: false, type: () => [String], maxLength: 2048 }, evidencePhotos: { required: false, type: () => [String], maxLength: 2048 }, evidenceVideos: { required: false, type: () => [String], maxLength: 2048 }, insuranceClaimNumber: { required: false, type: () => String, maxLength: 50 }, legalComplianceStatus: { required: false, enum: require("../enums/compliance-status.enum").ComplianceStatus } };
    }
}
exports.CreateIncidentReportDto = CreateIncidentReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Student ID', example: 'uuid' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateIncidentReportDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reporter user ID', example: 'uuid' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateIncidentReportDto.prototype, "reportedById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of incident',
        enum: incident_type_enum_1.IncidentType,
        example: incident_type_enum_1.IncidentType.INJURY,
    }),
    (0, class_validator_1.IsEnum)(incident_type_enum_1.IncidentType),
    __metadata("design:type", String)
], CreateIncidentReportDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Severity level',
        enum: incident_severity_enum_1.IncidentSeverity,
        example: incident_severity_enum_1.IncidentSeverity.MEDIUM,
    }),
    (0, class_validator_1.IsEnum)(incident_severity_enum_1.IncidentSeverity),
    __metadata("design:type", String)
], CreateIncidentReportDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed description of incident (minimum 20 characters, maximum 5000 characters)',
        example: 'Student fell from playground equipment and injured knee',
        minLength: 20,
        maxLength: 5000,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(20, {
        message: 'Description must be at least 20 characters for proper documentation',
    }),
    (0, class_validator_1.MaxLength)(5000, { message: 'Description cannot exceed 5000 characters' }),
    __metadata("design:type", String)
], CreateIncidentReportDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Location where incident occurred (minimum 3 characters, maximum 500 characters)',
        example: 'Playground - Main area',
        minLength: 3,
        maxLength: 500,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3, {
        message: 'Location is required for safety documentation (minimum 3 characters)',
    }),
    (0, class_validator_1.MaxLength)(500, { message: 'Location cannot exceed 500 characters' }),
    __metadata("design:type", String)
], CreateIncidentReportDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of witnesses (each name max 100 characters)',
        example: ['John Doe', 'Jane Smith'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(100, {
        each: true,
        message: 'Each witness name cannot exceed 100 characters',
    }),
    __metadata("design:type", Array)
], CreateIncidentReportDto.prototype, "witnesses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Actions taken in response (minimum 10 characters, maximum 5000 characters)',
        example: 'First aid applied, ice pack provided, parent notified',
        minLength: 10,
        maxLength: 5000,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10, {
        message: 'Actions taken must be documented for all incidents (minimum 10 characters)',
    }),
    (0, class_validator_1.MaxLength)(5000, { message: 'Actions taken cannot exceed 5000 characters' }),
    __metadata("design:type", String)
], CreateIncidentReportDto.prototype, "actionsTaken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When incident occurred',
        example: '2025-10-28T10:30:00Z',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateIncidentReportDto.prototype, "occurredAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether parent was notified',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateIncidentReportDto.prototype, "parentNotified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether follow-up is required',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateIncidentReportDto.prototype, "followUpRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Follow-up notes (maximum 5000 characters)',
        example: 'Monitor for swelling, check tomorrow',
        maxLength: 5000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000, { message: 'Follow-up notes cannot exceed 5000 characters' }),
    __metadata("design:type", String)
], CreateIncidentReportDto.prototype, "followUpNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Attachment URLs (each URL max 2048 characters)',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(2048, {
        each: true,
        message: 'Each attachment URL cannot exceed 2048 characters',
    }),
    __metadata("design:type", Array)
], CreateIncidentReportDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Evidence photo URLs (each URL max 2048 characters)',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(2048, {
        each: true,
        message: 'Each evidence photo URL cannot exceed 2048 characters',
    }),
    __metadata("design:type", Array)
], CreateIncidentReportDto.prototype, "evidencePhotos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Evidence video URLs (each URL max 2048 characters)',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(2048, {
        each: true,
        message: 'Each evidence video URL cannot exceed 2048 characters',
    }),
    __metadata("design:type", Array)
], CreateIncidentReportDto.prototype, "evidenceVideos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Insurance claim number (maximum 50 characters)',
        example: 'INS-2025-001234',
        maxLength: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, {
        message: 'Insurance claim number cannot exceed 50 characters',
    }),
    __metadata("design:type", String)
], CreateIncidentReportDto.prototype, "insuranceClaimNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Legal compliance status',
        enum: compliance_status_enum_1.ComplianceStatus,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(compliance_status_enum_1.ComplianceStatus),
    __metadata("design:type", String)
], CreateIncidentReportDto.prototype, "legalComplianceStatus", void 0);
//# sourceMappingURL=create-incident-report.dto.js.map