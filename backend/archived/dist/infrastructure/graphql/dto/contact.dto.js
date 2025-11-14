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
exports.DeleteResponseDto = exports.ContactStatsDto = exports.ContactFilterInputDto = exports.ContactUpdateInputDto = exports.ContactInputDto = exports.ContactListResponseDto = exports.ContactDto = exports.ContactType = void 0;
const openapi = require("@nestjs/swagger");
const graphql_1 = require("@nestjs/graphql");
const graphql_scalars_1 = require("graphql-scalars");
const pagination_dto_1 = require("./pagination.dto");
const class_validator_1 = require("class-validator");
const base_healthcare_dto_1 = require("./base/base-healthcare.dto");
var ContactType;
(function (ContactType) {
    ContactType["Guardian"] = "guardian";
    ContactType["Staff"] = "staff";
    ContactType["Vendor"] = "vendor";
    ContactType["Provider"] = "provider";
    ContactType["Other"] = "other";
})(ContactType || (exports.ContactType = ContactType = {}));
(0, graphql_1.registerEnumType)(ContactType, {
    name: 'ContactType',
    description: 'Type of contact (guardian, staff, vendor, provider, other)',
});
let ContactDto = class ContactDto {
    id;
    firstName;
    lastName;
    fullName;
    displayName;
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
    updatedBy;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, fullName: { required: true, type: () => String }, displayName: { required: true, type: () => String }, email: { required: false, type: () => String }, phone: { required: false, type: () => String }, type: { required: true, enum: require("./contact.dto").ContactType }, organization: { required: false, type: () => String }, title: { required: false, type: () => String }, address: { required: false, type: () => String }, city: { required: false, type: () => String }, state: { required: false, type: () => String }, zip: { required: false, type: () => String }, relationTo: { required: false, type: () => String }, relationshipType: { required: false, type: () => String }, customFields: { required: false, type: () => Object }, isActive: { required: true, type: () => Boolean }, notes: { required: false, type: () => String }, createdBy: { required: false, type: () => String }, updatedBy: { required: false, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.ContactDto = ContactDto;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], ContactDto.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ContactDto.prototype, "firstName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ContactDto.prototype, "lastName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ContactDto.prototype, "fullName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ContactDto.prototype, "displayName", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ContactDto.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ContactDto.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)(() => ContactType),
    __metadata("design:type", String)
], ContactDto.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ContactDto.prototype, "organization", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ContactDto.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ContactDto.prototype, "address", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ContactDto.prototype, "city", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ContactDto.prototype, "state", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ContactDto.prototype, "zip", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], ContactDto.prototype, "relationTo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ContactDto.prototype, "relationshipType", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_scalars_1.GraphQLJSON, { nullable: true }),
    __metadata("design:type", Object)
], ContactDto.prototype, "customFields", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], ContactDto.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ContactDto.prototype, "notes", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], ContactDto.prototype, "createdBy", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], ContactDto.prototype, "updatedBy", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], ContactDto.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], ContactDto.prototype, "updatedAt", void 0);
exports.ContactDto = ContactDto = __decorate([
    (0, graphql_1.ObjectType)()
], ContactDto);
let ContactListResponseDto = class ContactListResponseDto {
    contacts;
    pagination;
    static _OPENAPI_METADATA_FACTORY() {
        return { contacts: { required: true, type: () => [require("./contact.dto").ContactDto] }, pagination: { required: true, type: () => require("./pagination.dto").PaginationDto } };
    }
};
exports.ContactListResponseDto = ContactListResponseDto;
__decorate([
    (0, graphql_1.Field)(() => [ContactDto]),
    __metadata("design:type", Array)
], ContactListResponseDto.prototype, "contacts", void 0);
__decorate([
    (0, graphql_1.Field)(() => pagination_dto_1.PaginationDto),
    __metadata("design:type", pagination_dto_1.PaginationDto)
], ContactListResponseDto.prototype, "pagination", void 0);
exports.ContactListResponseDto = ContactListResponseDto = __decorate([
    (0, graphql_1.ObjectType)()
], ContactListResponseDto);
let ContactInputDto = class ContactInputDto extends base_healthcare_dto_1.BaseHealthcareInputDto {
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
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: false, type: () => String, maxLength: 100, format: "email" }, phone: { required: false, type: () => String, pattern: "/^\\+?[1-9]\\d{1,14}$/" }, type: { required: true, enum: require("./contact.dto").ContactType }, organization: { required: false, type: () => String, maxLength: 100 }, title: { required: false, type: () => String, maxLength: 50 }, address: { required: false, type: () => String, maxLength: 200 }, city: { required: false, type: () => String, maxLength: 50 }, state: { required: false, type: () => String, minLength: 2, maxLength: 2, pattern: "/^[A-Z]{2}$/" }, zip: { required: false, type: () => String, pattern: "/^\\d{5}(-\\d{4})?$/" }, relationTo: { required: false, type: () => String }, relationshipType: { required: false, type: () => String, maxLength: 50 }, customFields: { required: false, type: () => Object }, notes: { required: false, type: () => String, maxLength: 1000 } };
    }
};
exports.ContactInputDto = ContactInputDto;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email format' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Email must not exceed 100 characters' }),
    __metadata("design:type", String)
], ContactInputDto.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\+?[1-9]\d{1,14}$/, {
        message: 'Invalid phone number format. Use E.164 format (e.g., +12345678900)',
    }),
    __metadata("design:type", String)
], ContactInputDto.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)(() => ContactType),
    (0, class_validator_1.IsEnum)(ContactType, { message: 'Invalid contact type' }),
    __metadata("design:type", String)
], ContactInputDto.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Organization must not exceed 100 characters' }),
    __metadata("design:type", String)
], ContactInputDto.prototype, "organization", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'Title must not exceed 50 characters' }),
    __metadata("design:type", String)
], ContactInputDto.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200, { message: 'Address must not exceed 200 characters' }),
    __metadata("design:type", String)
], ContactInputDto.prototype, "address", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'City must not exceed 50 characters' }),
    __metadata("design:type", String)
], ContactInputDto.prototype, "city", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2, { message: 'State must be 2 characters' }),
    (0, class_validator_1.MinLength)(2, { message: 'State must be 2 characters' }),
    (0, class_validator_1.Matches)(/^[A-Z]{2}$/, {
        message: 'State must be 2 uppercase letters (e.g., CA, NY)',
    }),
    __metadata("design:type", String)
], ContactInputDto.prototype, "state", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{5}(-\d{4})?$/, {
        message: 'Invalid ZIP code format (e.g., 12345 or 12345-6789)',
    }),
    __metadata("design:type", String)
], ContactInputDto.prototype, "zip", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactInputDto.prototype, "relationTo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'Relationship type must not exceed 50 characters' }),
    __metadata("design:type", String)
], ContactInputDto.prototype, "relationshipType", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_scalars_1.GraphQLJSON, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ContactInputDto.prototype, "customFields", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000, { message: 'Notes must not exceed 1000 characters' }),
    __metadata("design:type", String)
], ContactInputDto.prototype, "notes", void 0);
exports.ContactInputDto = ContactInputDto = __decorate([
    (0, graphql_1.InputType)()
], ContactInputDto);
let ContactUpdateInputDto = class ContactUpdateInputDto extends base_healthcare_dto_1.BaseHealthcareUpdateInputDto {
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
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: false, type: () => String, maxLength: 100, format: "email" }, phone: { required: false, type: () => String, pattern: "/^\\+?[1-9]\\d{1,14}$/" }, type: { required: false, enum: require("./contact.dto").ContactType }, organization: { required: false, type: () => String, maxLength: 100 }, title: { required: false, type: () => String, maxLength: 50 }, address: { required: false, type: () => String, maxLength: 200 }, city: { required: false, type: () => String, maxLength: 50 }, state: { required: false, type: () => String, minLength: 2, maxLength: 2, pattern: "/^[A-Z]{2}$/" }, zip: { required: false, type: () => String, pattern: "/^\\d{5}(-\\d{4})?$/" }, relationTo: { required: false, type: () => String }, relationshipType: { required: false, type: () => String, maxLength: 50 }, customFields: { required: false, type: () => Object }, notes: { required: false, type: () => String, maxLength: 1000 } };
    }
};
exports.ContactUpdateInputDto = ContactUpdateInputDto;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email format' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Email must not exceed 100 characters' }),
    __metadata("design:type", String)
], ContactUpdateInputDto.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\+?[1-9]\d{1,14}$/, {
        message: 'Invalid phone number format. Use E.164 format (e.g., +12345678900)',
    }),
    __metadata("design:type", String)
], ContactUpdateInputDto.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)(() => ContactType, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ContactType, { message: 'Invalid contact type' }),
    __metadata("design:type", String)
], ContactUpdateInputDto.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Organization must not exceed 100 characters' }),
    __metadata("design:type", String)
], ContactUpdateInputDto.prototype, "organization", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'Title must not exceed 50 characters' }),
    __metadata("design:type", String)
], ContactUpdateInputDto.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200, { message: 'Address must not exceed 200 characters' }),
    __metadata("design:type", String)
], ContactUpdateInputDto.prototype, "address", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'City must not exceed 50 characters' }),
    __metadata("design:type", String)
], ContactUpdateInputDto.prototype, "city", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2, { message: 'State must be 2 characters' }),
    (0, class_validator_1.MinLength)(2, { message: 'State must be 2 characters' }),
    (0, class_validator_1.Matches)(/^[A-Z]{2}$/, {
        message: 'State must be 2 uppercase letters (e.g., CA, NY)',
    }),
    __metadata("design:type", String)
], ContactUpdateInputDto.prototype, "state", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{5}(-\d{4})?$/, {
        message: 'Invalid ZIP code format (e.g., 12345 or 12345-6789)',
    }),
    __metadata("design:type", String)
], ContactUpdateInputDto.prototype, "zip", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactUpdateInputDto.prototype, "relationTo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'Relationship type must not exceed 50 characters' }),
    __metadata("design:type", String)
], ContactUpdateInputDto.prototype, "relationshipType", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_scalars_1.GraphQLJSON, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ContactUpdateInputDto.prototype, "customFields", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000, { message: 'Notes must not exceed 1000 characters' }),
    __metadata("design:type", String)
], ContactUpdateInputDto.prototype, "notes", void 0);
exports.ContactUpdateInputDto = ContactUpdateInputDto = __decorate([
    (0, graphql_1.InputType)()
], ContactUpdateInputDto);
let ContactFilterInputDto = class ContactFilterInputDto extends base_healthcare_dto_1.BaseHealthcareFilterInputDto {
    type;
    types;
    relationTo;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: false, enum: require("./contact.dto").ContactType }, types: { required: false, enum: require("./contact.dto").ContactType, isArray: true }, relationTo: { required: false, type: () => String } };
    }
};
exports.ContactFilterInputDto = ContactFilterInputDto;
__decorate([
    (0, graphql_1.Field)(() => ContactType, { nullable: true }),
    __metadata("design:type", String)
], ContactFilterInputDto.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(() => [ContactType], { nullable: true }),
    __metadata("design:type", Array)
], ContactFilterInputDto.prototype, "types", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], ContactFilterInputDto.prototype, "relationTo", void 0);
exports.ContactFilterInputDto = ContactFilterInputDto = __decorate([
    (0, graphql_1.InputType)()
], ContactFilterInputDto);
let ContactStatsDto = class ContactStatsDto {
    total;
    byType;
    static _OPENAPI_METADATA_FACTORY() {
        return { total: { required: true, type: () => Number }, byType: { required: true, type: () => Object } };
    }
};
exports.ContactStatsDto = ContactStatsDto;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ContactStatsDto.prototype, "total", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_scalars_1.GraphQLJSON),
    __metadata("design:type", Object)
], ContactStatsDto.prototype, "byType", void 0);
exports.ContactStatsDto = ContactStatsDto = __decorate([
    (0, graphql_1.ObjectType)()
], ContactStatsDto);
let DeleteResponseDto = class DeleteResponseDto {
    success;
    message;
    static _OPENAPI_METADATA_FACTORY() {
        return { success: { required: true, type: () => Boolean }, message: { required: true, type: () => String } };
    }
};
exports.DeleteResponseDto = DeleteResponseDto;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], DeleteResponseDto.prototype, "success", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], DeleteResponseDto.prototype, "message", void 0);
exports.DeleteResponseDto = DeleteResponseDto = __decorate([
    (0, graphql_1.ObjectType)()
], DeleteResponseDto);
//# sourceMappingURL=contact.dto.js.map