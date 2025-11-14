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
exports.QueryChecklistDto = exports.UpdateChecklistDto = exports.CreateChecklistDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const models_1 = require("../../database/models");
class CreateChecklistDto {
    requirement;
    description;
    category;
    reportId;
    dueDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { requirement: { required: true, type: () => String, minLength: 5, maxLength: 500 }, description: { required: false, type: () => String }, category: { required: true, enum: require("../../database/models/compliance-checklist-item.model").ComplianceCategory }, reportId: { required: false, type: () => String }, dueDate: { required: false, type: () => String } };
    }
}
exports.CreateChecklistDto = CreateChecklistDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Compliance requirement description (5-500 chars)',
        minLength: 5,
        maxLength: 500,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateChecklistDto.prototype, "requirement", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Detailed requirement explanation' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateChecklistDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: models_1.ComplianceCategory, description: 'Compliance category' }),
    (0, class_validator_1.IsEnum)(models_1.ComplianceCategory),
    __metadata("design:type", String)
], CreateChecklistDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Associated compliance report ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateChecklistDto.prototype, "reportId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Completion due date (ISO 8601)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateChecklistDto.prototype, "dueDate", void 0);
class UpdateChecklistDto {
    status;
    evidence;
    notes;
    completedBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("../../database/models/compliance-checklist-item.model").ChecklistItemStatus }, evidence: { required: false, type: () => String }, notes: { required: false, type: () => String }, completedBy: { required: false, type: () => String } };
    }
}
exports.UpdateChecklistDto = UpdateChecklistDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: models_1.ChecklistItemStatus,
        description: 'Updated status',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.ChecklistItemStatus),
    __metadata("design:type", String)
], UpdateChecklistDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL or description of compliance evidence',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateChecklistDto.prototype, "evidence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateChecklistDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID who completed the item' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateChecklistDto.prototype, "completedBy", void 0);
class QueryChecklistDto {
    reportId;
    category;
    status;
    page;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { reportId: { required: false, type: () => String }, category: { required: false, enum: require("../../database/models/compliance-checklist-item.model").ComplianceCategory }, status: { required: false, enum: require("../../database/models/compliance-checklist-item.model").ChecklistItemStatus }, page: { required: false, type: () => Number }, limit: { required: false, type: () => Number } };
    }
}
exports.QueryChecklistDto = QueryChecklistDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by report ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryChecklistDto.prototype, "reportId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: models_1.ComplianceCategory,
        description: 'Filter by category',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.ComplianceCategory),
    __metadata("design:type", String)
], QueryChecklistDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: models_1.ChecklistItemStatus,
        description: 'Filter by status',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.ChecklistItemStatus),
    __metadata("design:type", String)
], QueryChecklistDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryChecklistDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', default: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryChecklistDto.prototype, "limit", void 0);
//# sourceMappingURL=checklist.dto.js.map