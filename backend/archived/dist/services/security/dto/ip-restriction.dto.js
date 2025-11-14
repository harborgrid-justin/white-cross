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
exports.IpCheckDto = exports.UpdateIpRestrictionDto = exports.SecurityCreateIpRestrictionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const ip_restriction_type_enum_1 = require("../enums/ip-restriction-type.enum");
class SecurityCreateIpRestrictionDto {
    type;
    ipAddress;
    ipRange;
    countries;
    reason;
    createdBy;
    expiresAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, enum: require("../enums/ip-restriction-type.enum").IpRestrictionType }, ipAddress: { required: false, type: () => String }, ipRange: { required: false, type: () => ({ start: { required: true, type: () => String }, end: { required: true, type: () => String } }) }, countries: { required: false, type: () => [String] }, reason: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, expiresAt: { required: false, type: () => String } };
    }
}
exports.SecurityCreateIpRestrictionDto = SecurityCreateIpRestrictionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ip_restriction_type_enum_1.IpRestrictionType,
        description: 'Type of IP restriction',
    }),
    (0, class_validator_1.IsEnum)(ip_restriction_type_enum_1.IpRestrictionType),
    __metadata("design:type", String)
], SecurityCreateIpRestrictionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'IP address or CIDR notation (e.g., 192.168.1.0/24)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SecurityCreateIpRestrictionDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'IP range with start and end addresses',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SecurityCreateIpRestrictionDto.prototype, "ipRange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ISO country codes for geo restrictions',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SecurityCreateIpRestrictionDto.prototype, "countries", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for the restriction' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SecurityCreateIpRestrictionDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID who created the restriction' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SecurityCreateIpRestrictionDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expiration date for the restriction' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SecurityCreateIpRestrictionDto.prototype, "expiresAt", void 0);
class UpdateIpRestrictionDto extends (0, swagger_1.PartialType)(SecurityCreateIpRestrictionDto) {
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { isActive: { required: false, type: () => Boolean } };
    }
}
exports.UpdateIpRestrictionDto = UpdateIpRestrictionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Active status of the restriction' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateIpRestrictionDto.prototype, "isActive", void 0);
class IpCheckDto {
    ipAddress;
    userId;
    static _OPENAPI_METADATA_FACTORY() {
        return { ipAddress: { required: true, type: () => String }, userId: { required: false, type: () => String } };
    }
}
exports.IpCheckDto = IpCheckDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'IP address to check' }),
    (0, class_validator_1.IsIP)(),
    __metadata("design:type", String)
], IpCheckDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User ID for user-specific restrictions',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IpCheckDto.prototype, "userId", void 0);
//# sourceMappingURL=ip-restriction.dto.js.map