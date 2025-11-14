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
exports.QueryPolicyDto = exports.AcknowledgePolicyDto = exports.UpdatePolicyDto = exports.CreatePolicyDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const models_1 = require("../../database/models");
class CreatePolicyDto {
    title;
    category;
    content;
    version;
    effectiveDate;
    reviewDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String, minLength: 5, maxLength: 200 }, category: { required: true, enum: require("../../database/models/policy-document.model").PolicyCategory }, content: { required: true, type: () => String, minLength: 100 }, version: { required: true, type: () => String }, effectiveDate: { required: true, type: () => String }, reviewDate: { required: false, type: () => String } };
    }
}
exports.CreatePolicyDto = CreatePolicyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Policy title (5-200 chars)',
        minLength: 5,
        maxLength: 200,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: models_1.PolicyCategory, description: 'Policy category' }),
    (0, class_validator_1.IsEnum)(models_1.PolicyCategory),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Complete policy content (100-100000 chars)',
        minLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(100),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy version number (e.g., 1.0)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'When the policy becomes effective (ISO 8601)' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "effectiveDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Next scheduled review date (ISO 8601)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePolicyDto.prototype, "reviewDate", void 0);
class UpdatePolicyDto {
    status;
    approvedBy;
    reviewDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("../../database/models/policy-document.model").PolicyStatus }, approvedBy: { required: false, type: () => String }, reviewDate: { required: false, type: () => String } };
    }
}
exports.UpdatePolicyDto = UpdatePolicyDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: models_1.PolicyStatus,
        description: 'Updated policy status',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.PolicyStatus),
    __metadata("design:type", String)
], UpdatePolicyDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID who approved the policy' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePolicyDto.prototype, "approvedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Next scheduled review date (ISO 8601)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdatePolicyDto.prototype, "reviewDate", void 0);
class AcknowledgePolicyDto {
    ipAddress;
    static _OPENAPI_METADATA_FACTORY() {
        return { ipAddress: { required: true, type: () => String } };
    }
}
exports.AcknowledgePolicyDto = AcknowledgePolicyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'IP address from which acknowledgment was made' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AcknowledgePolicyDto.prototype, "ipAddress", void 0);
class QueryPolicyDto {
    category;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { category: { required: false, enum: require("../../database/models/policy-document.model").PolicyCategory }, status: { required: false, enum: require("../../database/models/policy-document.model").PolicyStatus } };
    }
}
exports.QueryPolicyDto = QueryPolicyDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: models_1.PolicyCategory,
        description: 'Filter by category',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.PolicyCategory),
    __metadata("design:type", String)
], QueryPolicyDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: models_1.PolicyStatus, description: 'Filter by status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.PolicyStatus),
    __metadata("design:type", String)
], QueryPolicyDto.prototype, "status", void 0);
//# sourceMappingURL=policy.dto.js.map