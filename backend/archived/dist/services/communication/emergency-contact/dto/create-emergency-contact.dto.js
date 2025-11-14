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
exports.EmergencyContactCreateDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../contact/enums");
class EmergencyContactCreateDto {
    studentId;
    firstName;
    lastName;
    relationship;
    phoneNumber;
    email;
    address;
    priority;
    preferredContactMethod;
    notificationChannels;
    canPickupStudent;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, firstName: { required: true, type: () => String, minLength: 1, maxLength: 100 }, lastName: { required: true, type: () => String, minLength: 1, maxLength: 100 }, relationship: { required: true, type: () => String, minLength: 1, maxLength: 50 }, phoneNumber: { required: true, type: () => String, maxLength: 20, pattern: "/^[\\d\\s\\-().+]+$/" }, email: { required: false, type: () => String, maxLength: 255, format: "email" }, address: { required: false, type: () => String, maxLength: 500 }, priority: { required: true, enum: require("../../contact/enums/contact-priority.enum").ContactPriority }, preferredContactMethod: { required: false, enum: require("../../contact/enums/preferred-contact-method.enum").PreferredContactMethod }, notificationChannels: { required: false, type: () => [Object], minItems: 1 }, canPickupStudent: { required: false, type: () => Boolean }, notes: { required: false, type: () => String, maxLength: 1000 } };
    }
}
exports.EmergencyContactCreateDto = EmergencyContactCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], EmergencyContactCreateDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Emergency contact first name',
        example: 'Jane',
        minLength: 1,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], EmergencyContactCreateDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Emergency contact last name',
        example: 'Doe',
        minLength: 1,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], EmergencyContactCreateDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Relationship to student',
        example: 'Mother',
        minLength: 1,
        maxLength: 50,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], EmergencyContactCreateDto.prototype, "relationship", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phone number (minimum 10 digits, maximum 20 characters)',
        example: '+1-555-123-4567',
        maxLength: 20,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20, { message: 'Phone number cannot exceed 20 characters' }),
    (0, class_validator_1.Matches)(/^[\d\s\-().+]+$/, {
        message: 'Phone number must contain only digits, spaces, hyphens, parentheses, or plus sign',
    }),
    __metadata("design:type", String)
], EmergencyContactCreateDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email address',
        example: 'jane.doe@example.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email format' }),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], EmergencyContactCreateDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Physical address (maximum 500 characters)',
        example: '123 Main St, City, State 12345',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Address cannot exceed 500 characters' }),
    __metadata("design:type", String)
], EmergencyContactCreateDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact priority level',
        enum: enums_1.ContactPriority,
        example: enums_1.ContactPriority.PRIMARY,
    }),
    (0, class_validator_1.IsEnum)(enums_1.ContactPriority),
    __metadata("design:type", String)
], EmergencyContactCreateDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preferred contact method',
        enum: enums_1.PreferredContactMethod,
        example: enums_1.PreferredContactMethod.ANY,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.PreferredContactMethod),
    __metadata("design:type", String)
], EmergencyContactCreateDto.prototype, "preferredContactMethod", void 0);
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
], EmergencyContactCreateDto.prototype, "notificationChannels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether contact is authorized to pick up student',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EmergencyContactCreateDto.prototype, "canPickupStudent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes (maximum 1000 characters)',
        example: 'Prefers text messages during work hours',
        maxLength: 1000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000, { message: 'Notes cannot exceed 1000 characters' }),
    __metadata("design:type", String)
], EmergencyContactCreateDto.prototype, "notes", void 0);
//# sourceMappingURL=create-emergency-contact.dto.js.map