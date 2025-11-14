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
exports.QueryViolationDto = exports.UpdateRemediationDto = exports.CreateRemediationDto = exports.UpdateViolationDto = exports.CreateViolationDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const models_1 = require("../../database/models");
class CreateViolationDto {
    violationType;
    title;
    description;
    severity;
    discoveredAt;
    affectedStudents;
    affectedDataCategories;
    rootCause;
    static _OPENAPI_METADATA_FACTORY() {
        return { violationType: { required: true, enum: require("../../database/models/compliance-violation.model").ViolationType }, title: { required: true, type: () => String, minLength: 5, maxLength: 200 }, description: { required: true, type: () => String }, severity: { required: true, enum: require("../../database/models/compliance-violation.model").ViolationSeverity }, discoveredAt: { required: true, type: () => String }, affectedStudents: { required: false, type: () => [String] }, affectedDataCategories: { required: false, type: () => [String] }, rootCause: { required: false, type: () => String } };
    }
}
exports.CreateViolationDto = CreateViolationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: models_1.ViolationType, description: 'Type of violation' }),
    (0, class_validator_1.IsEnum)(models_1.ViolationType),
    __metadata("design:type", String)
], CreateViolationDto.prototype, "violationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Violation title/summary',
        minLength: 5,
        maxLength: 200,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateViolationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed description of violation' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateViolationDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: models_1.ViolationSeverity, description: 'Severity level' }),
    (0, class_validator_1.IsEnum)(models_1.ViolationSeverity),
    __metadata("design:type", String)
], CreateViolationDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'When the violation was discovered (ISO 8601)' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateViolationDto.prototype, "discoveredAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Affected student IDs' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateViolationDto.prototype, "affectedStudents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Affected data categories' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateViolationDto.prototype, "affectedDataCategories", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Root cause analysis' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateViolationDto.prototype, "rootCause", void 0);
class UpdateViolationDto {
    status;
    assignedTo;
    rootCause;
    resolutionNotes;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("../../database/models/compliance-violation.model").ViolationStatus }, assignedTo: { required: false, type: () => String }, rootCause: { required: false, type: () => String }, resolutionNotes: { required: false, type: () => String } };
    }
}
exports.UpdateViolationDto = UpdateViolationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: models_1.ViolationStatus, description: 'Updated status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.ViolationStatus),
    __metadata("design:type", String)
], UpdateViolationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID assigned to investigate' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateViolationDto.prototype, "assignedTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Root cause analysis' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateViolationDto.prototype, "rootCause", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Resolution notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateViolationDto.prototype, "resolutionNotes", void 0);
class CreateRemediationDto {
    violationId;
    action;
    priority;
    assignedTo;
    dueDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { violationId: { required: true, type: () => String }, action: { required: true, type: () => String }, priority: { required: true, enum: require("../../database/models/remediation-action.model").RemediationPriority }, assignedTo: { required: true, type: () => String }, dueDate: { required: true, type: () => String } };
    }
}
exports.CreateRemediationDto = CreateRemediationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Related violation ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRemediationDto.prototype, "violationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Remediation action description' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRemediationDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: models_1.RemediationPriority, description: 'Priority level' }),
    (0, class_validator_1.IsEnum)(models_1.RemediationPriority),
    __metadata("design:type", String)
], CreateRemediationDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID responsible for action' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRemediationDto.prototype, "assignedTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target completion date (ISO 8601)' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateRemediationDto.prototype, "dueDate", void 0);
class UpdateRemediationDto {
    status;
    implementationNotes;
    verificationNotes;
    verifiedBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("../../database/models/remediation-action.model").RemediationStatus }, implementationNotes: { required: false, type: () => String }, verificationNotes: { required: false, type: () => String }, verifiedBy: { required: false, type: () => String } };
    }
}
exports.UpdateRemediationDto = UpdateRemediationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: models_1.RemediationStatus,
        description: 'Updated status',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.RemediationStatus),
    __metadata("design:type", String)
], UpdateRemediationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Implementation notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRemediationDto.prototype, "implementationNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Verification notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRemediationDto.prototype, "verificationNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID who verified completion' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRemediationDto.prototype, "verifiedBy", void 0);
class QueryViolationDto {
    violationType;
    severity;
    status;
    page;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { violationType: { required: false, enum: require("../../database/models/compliance-violation.model").ViolationType }, severity: { required: false, enum: require("../../database/models/compliance-violation.model").ViolationSeverity }, status: { required: false, enum: require("../../database/models/compliance-violation.model").ViolationStatus }, page: { required: false, type: () => Number }, limit: { required: false, type: () => Number } };
    }
}
exports.QueryViolationDto = QueryViolationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: models_1.ViolationType, description: 'Filter by type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.ViolationType),
    __metadata("design:type", String)
], QueryViolationDto.prototype, "violationType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: models_1.ViolationSeverity,
        description: 'Filter by severity',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.ViolationSeverity),
    __metadata("design:type", String)
], QueryViolationDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: models_1.ViolationStatus,
        description: 'Filter by status',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.ViolationStatus),
    __metadata("design:type", String)
], QueryViolationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryViolationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryViolationDto.prototype, "limit", void 0);
//# sourceMappingURL=violation.dto.js.map