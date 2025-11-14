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
exports.ConfigurationBulkUpdateDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class BulkConfigurationItem {
    key;
    value;
    scopeId;
    static _OPENAPI_METADATA_FACTORY() {
        return { key: { required: true, type: () => String }, value: { required: true, type: () => String }, scopeId: { required: false, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Configuration key' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkConfigurationItem.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New value' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkConfigurationItem.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Optional scope ID for scoped configs' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkConfigurationItem.prototype, "scopeId", void 0);
class ConfigurationBulkUpdateDto {
    updates;
    changedBy;
    changeReason;
    static _OPENAPI_METADATA_FACTORY() {
        return { updates: { required: true, type: () => [BulkConfigurationItem] }, changedBy: { required: true, type: () => String }, changeReason: { required: false, type: () => String } };
    }
}
exports.ConfigurationBulkUpdateDto = ConfigurationBulkUpdateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of configuration updates',
        type: [BulkConfigurationItem],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BulkConfigurationItem),
    __metadata("design:type", Array)
], ConfigurationBulkUpdateDto.prototype, "updates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID performing the bulk update' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfigurationBulkUpdateDto.prototype, "changedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for bulk update' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfigurationBulkUpdateDto.prototype, "changeReason", void 0);
//# sourceMappingURL=bulk-update.dto.js.map