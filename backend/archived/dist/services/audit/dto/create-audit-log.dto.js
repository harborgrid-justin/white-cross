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
exports.CreateBasicAuditLogDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const administration_enums_1 = require("../../administration/enums/administration.enums");
class CreateBasicAuditLogDto {
    userId;
    action;
    entityType;
    entityId;
    changes;
    ipAddress;
    userAgent;
    success;
    errorMessage;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: false, type: () => String }, action: { required: true, enum: require("../../administration/enums/administration.enums").AuditAction }, entityType: { required: true, type: () => String }, entityId: { required: false, type: () => String }, changes: { required: false, type: () => Object }, ipAddress: { required: false, type: () => String }, userAgent: { required: false, type: () => String }, success: { required: false, type: () => Boolean }, errorMessage: { required: false, type: () => String } };
    }
}
exports.CreateBasicAuditLogDto = CreateBasicAuditLogDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID who performed the action' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBasicAuditLogDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: administration_enums_1.AuditAction, description: 'Action performed' }),
    (0, class_validator_1.IsEnum)(administration_enums_1.AuditAction),
    __metadata("design:type", String)
], CreateBasicAuditLogDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of entity being audited' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBasicAuditLogDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID of the entity being audited' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBasicAuditLogDto.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Changes made or additional data' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateBasicAuditLogDto.prototype, "changes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'IP address of the request' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBasicAuditLogDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User agent of the request' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBasicAuditLogDto.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the action was successful',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBasicAuditLogDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Error message if action failed' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBasicAuditLogDto.prototype, "errorMessage", void 0);
//# sourceMappingURL=create-audit-log.dto.js.map