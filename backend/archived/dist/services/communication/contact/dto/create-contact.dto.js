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
exports.CreateContactDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../enums");
class CreateContactDto {
    firstName;
    lastName;
    email;
    phone;
    type;
    organization;
    title;
    address;
    city;
    state;
    zip;
    relationTo;
    relationshipType;
    customFields;
    isActive;
    notes;
    createdBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { firstName: { required: true, type: () => String, minLength: 1, maxLength: 100 }, lastName: { required: true, type: () => String, minLength: 1, maxLength: 100 }, email: { required: false, type: () => String, format: "email", minLength: 0, maxLength: 255 }, phone: { required: false, type: () => String, minLength: 10, maxLength: 20, pattern: "/^[\\d\\s\\-\\+\\(\\)]+$/" }, type: { required: true, enum: require("../enums/contact-type.enum").ContactType }, organization: { required: false, type: () => String, minLength: 0, maxLength: 200 }, title: { required: false, type: () => String, minLength: 0, maxLength: 100 }, address: { required: false, type: () => String, minLength: 0, maxLength: 255 }, city: { required: false, type: () => String, minLength: 0, maxLength: 100 }, state: { required: false, type: () => String, minLength: 0, maxLength: 50 }, zip: { required: false, type: () => String, minLength: 0, maxLength: 20 }, relationTo: { required: false, type: () => String, format: "uuid" }, relationshipType: { required: false, type: () => String, minLength: 0, maxLength: 50 }, customFields: { required: false, type: () => Object }, isActive: { required: false, type: () => Boolean }, notes: { required: false, type: () => String }, createdBy: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.CreateContactDto = CreateContactDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'John',
        description: 'First name',
        minLength: 1,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], CreateContactDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Doe',
        description: 'Last name',
        minLength: 1,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], CreateContactDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'john.doe@example.com',
        description: 'Email address',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.Length)(0, 255),
    __metadata("design:type", String)
], CreateContactDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+1-555-0123', description: 'Phone number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 20),
    (0, class_validator_1.Matches)(/^[\d\s\-\+\(\)]+$/, {
        message: 'Invalid phone number format',
    }),
    __metadata("design:type", String)
], CreateContactDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: enums_1.ContactType,
        example: enums_1.ContactType.Guardian,
        description: 'Contact type',
    }),
    (0, class_validator_1.IsEnum)(enums_1.ContactType),
    __metadata("design:type", String)
], CreateContactDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Acme Healthcare',
        description: 'Organization name',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 200),
    __metadata("design:type", String)
], CreateContactDto.prototype, "organization", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Director',
        description: 'Job title or role',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 100),
    __metadata("design:type", String)
], CreateContactDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123 Main St',
        description: 'Physical address',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 255),
    __metadata("design:type", String)
], CreateContactDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Springfield', description: 'City' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 100),
    __metadata("design:type", String)
], CreateContactDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'IL', description: 'State or province' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 50),
    __metadata("design:type", String)
], CreateContactDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '62701', description: 'Postal code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 20),
    __metadata("design:type", String)
], CreateContactDto.prototype, "zip", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'UUID of related student or user',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "relationTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'parent',
        description: 'Type of relationship',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 50),
    __metadata("design:type", String)
], CreateContactDto.prototype, "relationshipType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: { emergencyProtocol: 'call-911' },
        description: 'Custom healthcare-specific fields',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateContactDto.prototype, "customFields", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Active status',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateContactDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Prefers morning calls',
        description: 'Additional notes',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'User ID who creates this contact',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "createdBy", void 0);
//# sourceMappingURL=create-contact.dto.js.map