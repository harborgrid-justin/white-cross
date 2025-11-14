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
exports.CreateDelegationDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateDelegationDto {
    toUserId;
    permissions;
    reason;
    expiresAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { toUserId: { required: true, type: () => String, format: "uuid" }, permissions: { required: true, type: () => [String] }, reason: { required: false, type: () => String }, expiresAt: { required: true, type: () => String } };
    }
}
exports.CreateDelegationDto = CreateDelegationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User receiving the delegated permissions',
        example: 'uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDelegationDto.prototype, "toUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of permission IDs to delegate',
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateDelegationDto.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for delegation', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDelegationDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Expiration date for delegation',
        example: '2025-12-31T23:59:59Z',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDelegationDto.prototype, "expiresAt", void 0);
//# sourceMappingURL=create-delegation.dto.js.map