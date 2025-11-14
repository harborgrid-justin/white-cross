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
exports.SendNotificationDto = exports.NotificationActionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../enums");
class NotificationActionDto {
    label;
    action;
    icon;
    static _OPENAPI_METADATA_FACTORY() {
        return { label: { required: true, type: () => String }, action: { required: true, type: () => String }, icon: { required: false, type: () => String } };
    }
}
exports.NotificationActionDto = NotificationActionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Action label' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NotificationActionDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Action identifier' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NotificationActionDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Action icon URL', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NotificationActionDto.prototype, "icon", void 0);
class SendNotificationDto {
    userIds;
    title;
    body;
    category;
    priority;
    data;
    actions;
    imageUrl;
    sound;
    badge;
    scheduledFor;
    static _OPENAPI_METADATA_FACTORY() {
        return { userIds: { required: true, type: () => [String] }, title: { required: true, type: () => String }, body: { required: true, type: () => String }, category: { required: true, enum: require("../enums/notification.enum").NotificationCategory }, priority: { required: false, enum: require("../enums/notification.enum").NotificationPriority }, data: { required: false, type: () => Object }, actions: { required: false, type: () => [require("./send-notification.dto").NotificationActionDto] }, imageUrl: { required: false, type: () => String }, sound: { required: false, type: () => String }, badge: { required: false, type: () => Number }, scheduledFor: { required: false, type: () => Date } };
    }
}
exports.SendNotificationDto = SendNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of user IDs to send notification to' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SendNotificationDto.prototype, "userIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification body text' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notification category',
        enum: enums_1.NotificationCategory,
    }),
    (0, class_validator_1.IsEnum)(enums_1.NotificationCategory),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notification priority',
        enum: enums_1.NotificationPriority,
        required: false,
        default: enums_1.NotificationPriority.NORMAL,
    }),
    (0, class_validator_1.IsEnum)(enums_1.NotificationPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional data payload', required: false }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SendNotificationDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notification actions',
        required: false,
        type: [NotificationActionDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => NotificationActionDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SendNotificationDto.prototype, "actions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Image URL', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sound name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "sound", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Badge count', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SendNotificationDto.prototype, "badge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Scheduled delivery time', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], SendNotificationDto.prototype, "scheduledFor", void 0);
//# sourceMappingURL=send-notification.dto.js.map