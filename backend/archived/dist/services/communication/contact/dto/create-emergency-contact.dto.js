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
exports.ContactCreateEmergencyDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../enums");
class ContactCreateEmergencyDto {
    studentId;
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
        return { studentId: { required: true, type: () => String, format: "uuid" }, firstName: { required: true, type: () => String, minLength: 1, maxLength: 100, pattern: "/^[a-zA-Z\\s'-]+$/" }, lastName: { required: true, type: () => String, minLength: 1, maxLength: 100, pattern: "/^[a-zA-Z\\s'-]+$/" }, relationship: { required: true, type: () => String, enum: enums_1.VALID_RELATIONSHIPS }, phoneNumber: { required: true, type: () => String, minLength: 10, maxLength: 20 }, email: { required: false, type: () => String, format: "email", minLength: 0, maxLength: 255 }, address: { required: false, type: () => String, minLength: 0, maxLength: 500 }, priority: { required: true, enum: require("../enums/contact-priority.enum").ContactPriority }, isActive: { required: false, type: () => Boolean }, preferredContactMethod: { required: false, enum: require("../enums/preferred-contact-method.enum").PreferredContactMethod }, verificationStatus: { required: false, enum: require("../enums/verification-status.enum").VerificationStatus }, notificationChannels: { required: false, type: () => [String], enum: enums_1.VALID_NOTIFICATION_CHANNELS, minItems: 1, maxItems: 3 }, canPickupStudent: { required: false, type: () => Boolean }, notes: { required: false, type: () => String, minLength: 0, maxLength: 1000 } };
    }
}
exports.ContactCreateEmergencyDto = ContactCreateEmergencyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Student ID this contact belongs to',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ContactCreateEmergencyDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Jane',
        description: 'First name',
        minLength: 1,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    (0, class_validator_1.Matches)(/^[a-zA-Z\s'-]+$/, {
        message: 'First name can only contain letters, spaces, hyphens, and apostrophes',
    }),
    __metadata("design:type", String)
], ContactCreateEmergencyDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Doe',
        description: 'Last name',
        minLength: 1,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    (0, class_validator_1.Matches)(/^[a-zA-Z\s'-]+$/, {
        message: 'Last name can only contain letters, spaces, hyphens, and apostrophes',
    }),
    __metadata("design:type", String)
], ContactCreateEmergencyDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'PARENT',
        description: 'Relationship to student',
        enum: enums_1.VALID_RELATIONSHIPS,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(enums_1.VALID_RELATIONSHIPS),
    __metadata("design:type", String)
], ContactCreateEmergencyDto.prototype, "relationship", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+1-555-123-4567',
        description: 'Phone number (required)',
        minLength: 10,
        maxLength: 20,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 20),
    __metadata("design:type", String)
], ContactCreateEmergencyDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'jane.doe@example.com',
        description: 'Email address (optional)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.Length)(0, 255),
    __metadata("design:type", String)
], ContactCreateEmergencyDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123 Main St, Springfield, IL 62701',
        description: 'Physical address',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 500),
    __metadata("design:type", String)
], ContactCreateEmergencyDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: enums_1.ContactPriority,
        example: enums_1.ContactPriority.PRIMARY,
        description: 'Contact priority level',
        default: enums_1.ContactPriority.PRIMARY,
    }),
    (0, class_validator_1.IsEnum)(enums_1.ContactPriority),
    __metadata("design:type", String)
], ContactCreateEmergencyDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Active status',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ContactCreateEmergencyDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: enums_1.PreferredContactMethod,
        example: enums_1.PreferredContactMethod.SMS,
        description: 'Preferred contact method',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.PreferredContactMethod),
    __metadata("design:type", String)
], ContactCreateEmergencyDto.prototype, "preferredContactMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: enums_1.VerificationStatus,
        example: enums_1.VerificationStatus.UNVERIFIED,
        description: 'Verification status',
        default: enums_1.VerificationStatus.UNVERIFIED,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.VerificationStatus),
    __metadata("design:type", String)
], ContactCreateEmergencyDto.prototype, "verificationStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ['sms', 'email'],
        description: 'Notification channels',
        isArray: true,
        enum: enums_1.VALID_NOTIFICATION_CHANNELS,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(3),
    (0, class_validator_1.IsIn)(enums_1.VALID_NOTIFICATION_CHANNELS, { each: true }),
    __metadata("design:type", Array)
], ContactCreateEmergencyDto.prototype, "notificationChannels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Whether contact can pick up student',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ContactCreateEmergencyDto.prototype, "canPickupStudent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Available after 3 PM',
        description: 'Additional notes',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 1000),
    __metadata("design:type", String)
], ContactCreateEmergencyDto.prototype, "notes", void 0);
//# sourceMappingURL=create-emergency-contact.dto.js.map