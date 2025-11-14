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
exports.EmergencyContactUpdateDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../contact/enums");
class EmergencyContactUpdateDto {
    firstName;
    lastName;
    relationship;
    phoneNumber;
    email;
    address;
    priority;
    isActive;
    preferredContactMethod;
    verificationStatus;
    notificationChannels;
    canPickupStudent;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { firstName: { required: false, type: () => String, minLength: 1, maxLength: 100 }, lastName: { required: false, type: () => String, minLength: 1, maxLength: 100 }, relationship: { required: false, type: () => String, minLength: 1, maxLength: 50 }, phoneNumber: { required: false, type: () => String, pattern: "/^[\\d\\s\\-().+]+$/" }, email: { required: false, type: () => String, maxLength: 255, format: "email" }, address: { required: false, type: () => String }, priority: { required: false, enum: require("../../contact/enums/contact-priority.enum").ContactPriority }, isActive: { required: false, type: () => Boolean }, preferredContactMethod: { required: false, enum: require("../../contact/enums/preferred-contact-method.enum").PreferredContactMethod }, verificationStatus: { required: false, enum: require("../../contact/enums/verification-status.enum").VerificationStatus }, notificationChannels: { required: false, type: () => [Object], minItems: 1 }, canPickupStudent: { required: false, type: () => Boolean }, notes: { required: false, type: () => String } };
    }
}
exports.EmergencyContactUpdateDto = EmergencyContactUpdateDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Emergency contact first name',
        example: 'Jane',
        minLength: 1,
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], EmergencyContactUpdateDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Emergency contact last name',
        example: 'Doe',
        minLength: 1,
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], EmergencyContactUpdateDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Relationship to student',
        example: 'Mother',
        minLength: 1,
        maxLength: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], EmergencyContactUpdateDto.prototype, "relationship", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Phone number (minimum 10 digits)',
        example: '+1-555-123-4567',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[\d\s\-().+]+$/, {
        message: 'Phone number must contain only digits, spaces, hyphens, parentheses, or plus sign',
    }),
    __metadata("design:type", String)
], EmergencyContactUpdateDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email address',
        example: 'jane.doe@example.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email format' }),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], EmergencyContactUpdateDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Physical address',
        example: '123 Main St, City, State 12345',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmergencyContactUpdateDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Contact priority level',
        enum: enums_1.ContactPriority,
        example: enums_1.ContactPriority.PRIMARY,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.ContactPriority),
    __metadata("design:type", String)
], EmergencyContactUpdateDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Active status',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EmergencyContactUpdateDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preferred contact method',
        enum: enums_1.PreferredContactMethod,
        example: enums_1.PreferredContactMethod.ANY,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.PreferredContactMethod),
    __metadata("design:type", String)
], EmergencyContactUpdateDto.prototype, "preferredContactMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Verification status',
        enum: enums_1.VerificationStatus,
        example: enums_1.VerificationStatus.VERIFIED,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.VerificationStatus),
    __metadata("design:type", String)
], EmergencyContactUpdateDto.prototype, "verificationStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Notification channels (sms, email, voice)',
        example: ['sms', 'email'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], EmergencyContactUpdateDto.prototype, "notificationChannels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether contact is authorized to pick up student',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EmergencyContactUpdateDto.prototype, "canPickupStudent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes',
        example: 'Prefers text messages during work hours',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmergencyContactUpdateDto.prototype, "notes", void 0);
//# sourceMappingURL=update-emergency-contact.dto.js.map