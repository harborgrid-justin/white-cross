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
exports.EmergencyAlertDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const message_type_enum_1 = require("../enums/message-type.enum");
class EmergencyAlertDto {
    title;
    message;
    severity;
    audience;
    groups;
    channels;
    senderId;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, message: { required: true, type: () => String }, severity: { required: true, type: () => Object }, audience: { required: true, type: () => Object }, groups: { required: false, type: () => [String] }, channels: { required: true, enum: require("../enums/message-type.enum").MessageType, isArray: true, minItems: 1 }, senderId: { required: true, type: () => String } };
    }
}
exports.EmergencyAlertDto = EmergencyAlertDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmergencyAlertDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmergencyAlertDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    __metadata("design:type", String)
], EmergencyAlertDto.prototype, "severity", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['ALL_STAFF', 'NURSES_ONLY', 'SPECIFIC_GROUPS']),
    __metadata("design:type", String)
], EmergencyAlertDto.prototype, "audience", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], EmergencyAlertDto.prototype, "groups", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsEnum)(message_type_enum_1.MessageType, { each: true }),
    __metadata("design:type", Array)
], EmergencyAlertDto.prototype, "channels", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmergencyAlertDto.prototype, "senderId", void 0);
//# sourceMappingURL=emergency-alert.dto.js.map