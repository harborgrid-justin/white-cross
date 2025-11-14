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
exports.BulkEmailDto = exports.EmailTemplateDataDto = exports.SendEmailDto = exports.EmailAttachmentDto = exports.EmailTemplate = exports.EmailPriority = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var EmailPriority;
(function (EmailPriority) {
    EmailPriority["LOW"] = "low";
    EmailPriority["NORMAL"] = "normal";
    EmailPriority["HIGH"] = "high";
    EmailPriority["URGENT"] = "urgent";
})(EmailPriority || (exports.EmailPriority = EmailPriority = {}));
var EmailTemplate;
(function (EmailTemplate) {
    EmailTemplate["ALERT"] = "alert";
    EmailTemplate["NOTIFICATION"] = "notification";
    EmailTemplate["WELCOME"] = "welcome";
    EmailTemplate["PASSWORD_RESET"] = "password-reset";
    EmailTemplate["CUSTOM"] = "custom";
})(EmailTemplate || (exports.EmailTemplate = EmailTemplate = {}));
class EmailAttachmentDto {
    filename;
    content;
    contentType;
    disposition;
    cid;
    static _OPENAPI_METADATA_FACTORY() {
        return { filename: { required: true, type: () => String, description: "Filename of the attachment", maxLength: 255 }, content: { required: true, type: () => Object, description: "Content of the attachment (base64 encoded or buffer)" }, contentType: { required: false, type: () => String, description: "MIME type of the attachment" }, disposition: { required: false, type: () => Object, description: "Content disposition (attachment or inline)" }, cid: { required: false, type: () => String, description: "Content ID for inline attachments (for embedding in HTML)" } };
    }
}
exports.EmailAttachmentDto = EmailAttachmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], EmailAttachmentDto.prototype, "filename", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], EmailAttachmentDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmailAttachmentDto.prototype, "contentType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmailAttachmentDto.prototype, "disposition", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EmailAttachmentDto.prototype, "cid", void 0);
class SendEmailDto {
    to;
    from;
    cc;
    bcc;
    replyTo;
    subject;
    body;
    html;
    attachments;
    priority;
    template;
    templateData;
    queue;
    delay;
    headers;
    tags;
    static _OPENAPI_METADATA_FACTORY() {
        return { to: { required: true, type: () => [String], description: "Recipient email address(es)", format: "email" }, from: { required: false, type: () => String, description: "Sender email address (optional, uses default if not provided)", format: "email" }, cc: { required: false, type: () => [String], description: "CC recipients", format: "email" }, bcc: { required: false, type: () => [String], description: "BCC recipients", format: "email" }, replyTo: { required: false, type: () => String, description: "Reply-to email address", format: "email" }, subject: { required: true, type: () => String, description: "Email subject line", minLength: 1, maxLength: 500 }, body: { required: true, type: () => String, description: "Plain text body" }, html: { required: false, type: () => String, description: "HTML body (optional)" }, attachments: { required: false, type: () => [require("./email.dto").EmailAttachmentDto], description: "Email attachments" }, priority: { required: false, description: "Email priority", enum: require("./email.dto").EmailPriority }, template: { required: false, description: "Template to use (if any)", enum: require("./email.dto").EmailTemplate }, templateData: { required: false, type: () => Object, description: "Template data (variables for template rendering)" }, queue: { required: false, type: () => Boolean, description: "Whether to queue this email (default: true)" }, delay: { required: false, type: () => Number, description: "Delay before sending (in milliseconds, for queued emails)" }, headers: { required: false, type: () => Object, description: "Custom headers" }, tags: { required: false, type: () => [String], description: "Tags for tracking and categorization" } };
    }
}
exports.SendEmailDto = SendEmailDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEmail)({}, { each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], SendEmailDto.prototype, "to", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEmail)({}, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SendEmailDto.prototype, "cc", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEmail)({}, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SendEmailDto.prototype, "bcc", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "replyTo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], SendEmailDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "body", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "html", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => EmailAttachmentDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SendEmailDto.prototype, "attachments", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(EmailPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(EmailTemplate),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "template", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SendEmailDto.prototype, "templateData", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SendEmailDto.prototype, "queue", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SendEmailDto.prototype, "delay", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SendEmailDto.prototype, "headers", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SendEmailDto.prototype, "tags", void 0);
class EmailTemplateDataDto {
    template;
    data;
    static _OPENAPI_METADATA_FACTORY() {
        return { template: { required: true, description: "Template name", enum: require("./email.dto").EmailTemplate }, data: { required: true, type: () => Object, description: "Variables for template rendering" } };
    }
}
exports.EmailTemplateDataDto = EmailTemplateDataDto;
__decorate([
    (0, class_validator_1.IsEnum)(EmailTemplate),
    __metadata("design:type", String)
], EmailTemplateDataDto.prototype, "template", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], EmailTemplateDataDto.prototype, "data", void 0);
class BulkEmailDto {
    emails;
    stopOnError;
    static _OPENAPI_METADATA_FACTORY() {
        return { emails: { required: true, type: () => [require("./email.dto").SendEmailDto], description: "Array of individual email data" }, stopOnError: { required: false, type: () => Boolean, description: "Whether to stop on first error" } };
    }
}
exports.BulkEmailDto = BulkEmailDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SendEmailDto),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], BulkEmailDto.prototype, "emails", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BulkEmailDto.prototype, "stopOnError", void 0);
//# sourceMappingURL=email.dto.js.map