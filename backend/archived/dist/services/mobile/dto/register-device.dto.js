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
exports.RegisterDeviceDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../enums");
class RegisterDeviceDto {
    deviceId;
    platform;
    token;
    deviceName;
    deviceModel;
    osVersion;
    appVersion;
    static _OPENAPI_METADATA_FACTORY() {
        return { deviceId: { required: true, type: () => String }, platform: { required: true, enum: require("../enums/notification.enum").NotificationPlatform }, token: { required: true, type: () => String }, deviceName: { required: false, type: () => String }, deviceModel: { required: false, type: () => String }, osVersion: { required: false, type: () => String }, appVersion: { required: false, type: () => String } };
    }
}
exports.RegisterDeviceDto = RegisterDeviceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique device identifier' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDeviceDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notification platform',
        enum: enums_1.NotificationPlatform,
    }),
    (0, class_validator_1.IsEnum)(enums_1.NotificationPlatform),
    __metadata("design:type", String)
], RegisterDeviceDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Device push notification token' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDeviceDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Device name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterDeviceDto.prototype, "deviceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Device model', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterDeviceDto.prototype, "deviceModel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'OS version', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterDeviceDto.prototype, "osVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'App version', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterDeviceDto.prototype, "appVersion", void 0);
//# sourceMappingURL=register-device.dto.js.map