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
exports.CreateAuditLogDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const index_1 = require("../enums/index");
class CreateAuditLogDto {
    userId;
    action;
    entityType;
    entityId;
    changes;
    ipAddress;
    userAgent;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: false, type: () => String }, action: { required: true, enum: require("../enums/index").AuditAction }, entityType: { required: true, type: () => String }, entityId: { required: false, type: () => String }, changes: { required: false, type: () => Object }, ipAddress: { required: false, type: () => String }, userAgent: { required: false, type: () => String } };
    }
}
exports.CreateAuditLogDto = CreateAuditLogDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of user performing the action (optional for system actions)',
        example: 'user-uuid-123',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Action type performed',
        enum: index_1.AuditAction,
        example: index_1.AuditAction.VIEW,
    }),
    (0, class_validator_1.IsEnum)(index_1.AuditAction),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of entity being accessed or modified',
        example: 'HealthRecord',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Unique identifier of the specific entity instance',
        example: 'record-uuid-456',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Object containing change details (before/after values)',
        example: { status: { before: 'draft', after: 'submitted' } },
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateAuditLogDto.prototype, "changes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'IP address of the request origin for security tracking',
        example: '192.168.1.100',
    }),
    (0, class_validator_1.IsIP)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Browser/client user agent string',
        example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "userAgent", void 0);
//# sourceMappingURL=create-audit-log.dto.js.map