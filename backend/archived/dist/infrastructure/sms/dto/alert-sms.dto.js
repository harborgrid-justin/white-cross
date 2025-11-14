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
exports.AlertSmsDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const create_alert_dto_1 = require("../../../services/alerts/dto/create-alert.dto");
class AlertSmsDto {
    title;
    message;
    severity;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String, maxLength: 100 }, message: { required: true, type: () => String, maxLength: 500 }, severity: { required: true, enum: require("../../../services/alerts/dto/create-alert.dto").AlertSeverity } };
    }
}
exports.AlertSmsDto = AlertSmsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alert title',
        example: 'Critical Alert',
        maxLength: 100,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Title is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Title cannot exceed 100 characters' }),
    __metadata("design:type", String)
], AlertSmsDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alert message',
        example: 'Student requires immediate attention',
        maxLength: 500,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Message is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Message cannot exceed 500 characters' }),
    __metadata("design:type", String)
], AlertSmsDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alert severity level',
        enum: create_alert_dto_1.AlertSeverity,
        example: create_alert_dto_1.AlertSeverity.CRITICAL,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Severity is required' }),
    (0, class_validator_1.IsEnum)(create_alert_dto_1.AlertSeverity, { message: 'Invalid severity level' }),
    __metadata("design:type", String)
], AlertSmsDto.prototype, "severity", void 0);
//# sourceMappingURL=alert-sms.dto.js.map