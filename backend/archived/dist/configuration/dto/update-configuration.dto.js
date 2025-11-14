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
exports.UpdateConfigurationDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateConfigurationDto {
    value;
    changedBy;
    changedByName;
    changeReason;
    ipAddress;
    userAgent;
    static _OPENAPI_METADATA_FACTORY() {
        return { value: { required: true, type: () => String }, changedBy: { required: true, type: () => String }, changedByName: { required: false, type: () => String }, changeReason: { required: false, type: () => String }, ipAddress: { required: false, type: () => String }, userAgent: { required: false, type: () => String } };
    }
}
exports.UpdateConfigurationDto = UpdateConfigurationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New configuration value' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateConfigurationDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID making the change' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateConfigurationDto.prototype, "changedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Name of user making the change' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateConfigurationDto.prototype, "changedByName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for the change (audit trail)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateConfigurationDto.prototype, "changeReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'IP address of the requester' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateConfigurationDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User agent string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateConfigurationDto.prototype, "userAgent", void 0);
//# sourceMappingURL=update-configuration.dto.js.map