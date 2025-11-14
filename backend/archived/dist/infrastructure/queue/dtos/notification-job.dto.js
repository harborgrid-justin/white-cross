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
exports.NotificationJobDto = exports.EmailNotificationPayload = exports.PushNotificationPayload = exports.NotificationPriority = exports.NotificationType = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var NotificationType;
(function (NotificationType) {
    NotificationType["PUSH"] = "push";
    NotificationType["EMAIL"] = "email";
    NotificationType["SMS"] = "sms";
    NotificationType["IN_APP"] = "in_app";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "low";
    NotificationPriority["NORMAL"] = "normal";
    NotificationPriority["HIGH"] = "high";
    NotificationPriority["URGENT"] = "urgent";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
class PushNotificationPayload {
    title;
    body;
    icon;
    clickAction;
    data;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String, description: "Notification title", maxLength: 100 }, body: { required: true, type: () => String, description: "Notification body", maxLength: 500 }, icon: { required: false, type: () => String, description: "Icon URL", format: "uri" }, clickAction: { required: false, type: () => String, description: "Action URL when notification is clicked" }, data: { required: false, type: () => Object, description: "Custom data" } };
    }
}
exports.PushNotificationPayload = PushNotificationPayload;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], PushNotificationPayload.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], PushNotificationPayload.prototype, "body", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PushNotificationPayload.prototype, "icon", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PushNotificationPayload.prototype, "clickAction", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], PushNotificationPayload.prototype, "data", void 0);
class EmailNotificationPayload {
    subject;
    htmlBody;
    textBody;
    templateId;
    templateData;
    static _OPENAPI_METADATA_FACTORY() {
        return { subject: { required: true, type: () => String, description: "Email subject", maxLength: 200 }, htmlBody: { required: true, type: () => String, description: "Email body (HTML)" }, textBody: { required: false, type: () => String, description: "Email body (plain text)" }, templateId: { required: false, type: () => String, description: "Template ID to use" }, templateData: { required: false, type: () => Object, description: "Template variables" } };
    }
}
exports.EmailNotificationPayload = EmailNotificationPayload;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], EmailNotificationPayload.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EmailNotificationPayload.prototype, "htmlBody", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmailNotificationPayload.prototype, "textBody", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmailNotificationPayload.prototype, "templateId", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], EmailNotificationPayload.prototype, "templateData", void 0);
class NotificationJobDto {
    notificationId;
    messageId;
    recipientId;
    type;
    priority;
    pushPayload;
    emailPayload;
    recipientEmail;
    recipientPhone;
    deviceTokens;
    title;
    message;
    createdAt;
    initiatedBy;
    jobId;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { notificationId: { required: false, type: () => String, description: "Notification ID", format: "uuid" }, messageId: { required: false, type: () => String, description: "Related message ID (if triggered by a message)", format: "uuid" }, recipientId: { required: true, type: () => String, description: "Recipient user ID", format: "uuid" }, type: { required: true, description: "Notification type", enum: require("./notification-job.dto").NotificationType }, priority: { required: false, description: "Notification priority", enum: require("./notification-job.dto").NotificationPriority }, pushPayload: { required: false, type: () => require("./notification-job.dto").PushNotificationPayload, description: "Push notification payload (if type is PUSH)" }, emailPayload: { required: false, type: () => require("./notification-job.dto").EmailNotificationPayload, description: "Email notification payload (if type is EMAIL)" }, recipientEmail: { required: false, type: () => String, description: "Recipient email address (for EMAIL type)", format: "email" }, recipientPhone: { required: false, type: () => String, description: "Recipient phone number (for SMS type)" }, deviceTokens: { required: false, type: () => [String], description: "Device tokens for push notifications" }, title: { required: true, type: () => String, description: "Notification title", maxLength: 200 }, message: { required: true, type: () => String, description: "Notification message", maxLength: 1000 }, createdAt: { required: true, type: () => Date, description: "Job creation timestamp" }, initiatedBy: { required: false, type: () => String, description: "User who initiated the job" }, jobId: { required: false, type: () => String, description: "Job identifier" }, metadata: { required: false, type: () => Object, description: "Additional metadata" } };
    }
}
exports.NotificationJobDto = NotificationJobDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NotificationJobDto.prototype, "notificationId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NotificationJobDto.prototype, "messageId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], NotificationJobDto.prototype, "recipientId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(NotificationType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], NotificationJobDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(NotificationPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NotificationJobDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PushNotificationPayload),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", PushNotificationPayload)
], NotificationJobDto.prototype, "pushPayload", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EmailNotificationPayload),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", EmailNotificationPayload)
], NotificationJobDto.prototype, "emailPayload", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NotificationJobDto.prototype, "recipientEmail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NotificationJobDto.prototype, "recipientPhone", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], NotificationJobDto.prototype, "deviceTokens", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], NotificationJobDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], NotificationJobDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], NotificationJobDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NotificationJobDto.prototype, "initiatedBy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NotificationJobDto.prototype, "jobId", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], NotificationJobDto.prototype, "metadata", void 0);
//# sourceMappingURL=notification-job.dto.js.map