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
exports.AccessControlCreateIpRestrictionDto = exports.IpRestrictionType = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var IpRestrictionType;
(function (IpRestrictionType) {
    IpRestrictionType["BLACKLIST"] = "BLACKLIST";
    IpRestrictionType["WHITELIST"] = "WHITELIST";
})(IpRestrictionType || (exports.IpRestrictionType = IpRestrictionType = {}));
class AccessControlCreateIpRestrictionDto {
    ipAddress;
    type;
    reason;
    createdBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { ipAddress: { required: true, type: () => String }, type: { required: true, enum: require("./create-ip-restriction.dto").IpRestrictionType }, reason: { required: false, type: () => String }, createdBy: { required: true, type: () => String, format: "uuid" } };
    }
}
exports.AccessControlCreateIpRestrictionDto = AccessControlCreateIpRestrictionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'IP address to restrict',
        example: '192.168.1.100',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AccessControlCreateIpRestrictionDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of restriction',
        enum: IpRestrictionType,
        example: IpRestrictionType.BLACKLIST,
    }),
    (0, class_validator_1.IsEnum)(IpRestrictionType, { message: 'Type must be BLACKLIST or WHITELIST' }),
    __metadata("design:type", String)
], AccessControlCreateIpRestrictionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for the restriction',
        example: 'Multiple failed login attempts',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AccessControlCreateIpRestrictionDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the user who created the restriction',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'Created by user ID must be a valid UUID' }),
    __metadata("design:type", String)
], AccessControlCreateIpRestrictionDto.prototype, "createdBy", void 0);
//# sourceMappingURL=create-ip-restriction.dto.js.map