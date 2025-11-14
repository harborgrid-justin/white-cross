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
exports.QueryDataRetentionDto = exports.UpdateDataRetentionDto = exports.CreateDataRetentionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const models_1 = require("../../database/models");
class CreateDataRetentionDto {
    category;
    description;
    retentionPeriodDays;
    legalBasis;
    autoDelete;
    static _OPENAPI_METADATA_FACTORY() {
        return { category: { required: true, enum: require("../../database/models/data-retention-policy.model").DataRetentionCategory }, description: { required: true, type: () => String }, retentionPeriodDays: { required: true, type: () => Number, minimum: 1 }, legalBasis: { required: true, type: () => String }, autoDelete: { required: false, type: () => Boolean } };
    }
}
exports.CreateDataRetentionDto = CreateDataRetentionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: models_1.DataRetentionCategory, description: 'Data category' }),
    (0, class_validator_1.IsEnum)(models_1.DataRetentionCategory),
    __metadata("design:type", String)
], CreateDataRetentionDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy description' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDataRetentionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Retention period in days', minimum: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateDataRetentionDto.prototype, "retentionPeriodDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Legal or regulatory basis for retention period',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDataRetentionDto.prototype, "legalBasis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Auto-delete after retention period',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDataRetentionDto.prototype, "autoDelete", void 0);
class UpdateDataRetentionDto {
    retentionPeriodDays;
    status;
    autoDelete;
    static _OPENAPI_METADATA_FACTORY() {
        return { retentionPeriodDays: { required: false, type: () => Number, minimum: 1 }, status: { required: false, enum: require("../../database/models/data-retention-policy.model").RetentionStatus }, autoDelete: { required: false, type: () => Boolean } };
    }
}
exports.UpdateDataRetentionDto = UpdateDataRetentionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Updated retention period in days' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateDataRetentionDto.prototype, "retentionPeriodDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: models_1.RetentionStatus, description: 'Updated status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.RetentionStatus),
    __metadata("design:type", String)
], UpdateDataRetentionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Auto-delete flag' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDataRetentionDto.prototype, "autoDelete", void 0);
class QueryDataRetentionDto {
    category;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { category: { required: false, enum: require("../../database/models/data-retention-policy.model").DataRetentionCategory }, status: { required: false, enum: require("../../database/models/data-retention-policy.model").RetentionStatus } };
    }
}
exports.QueryDataRetentionDto = QueryDataRetentionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: models_1.DataRetentionCategory,
        description: 'Filter by category',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.DataRetentionCategory),
    __metadata("design:type", String)
], QueryDataRetentionDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: models_1.RetentionStatus,
        description: 'Filter by status',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.RetentionStatus),
    __metadata("design:type", String)
], QueryDataRetentionDto.prototype, "status", void 0);
//# sourceMappingURL=data-retention.dto.js.map