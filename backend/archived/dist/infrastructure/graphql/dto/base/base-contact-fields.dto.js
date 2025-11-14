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
exports.BaseContactFieldsDto = void 0;
const openapi = require("@nestjs/swagger");
const graphql_1 = require("@nestjs/graphql");
const graphql_scalars_1 = require("graphql-scalars");
const class_validator_1 = require("class-validator");
const contact_dto_1 = require("../contact.dto");
class BaseContactFieldsDto {
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
        return { email: { required: false, type: () => String, maxLength: 100, format: "email" }, phone: { required: false, type: () => String, maxLength: 15 }, type: { required: false, enum: require("../contact.dto").ContactType }, organization: { required: false, type: () => String, maxLength: 100 }, title: { required: false, type: () => String, maxLength: 50 }, address: { required: false, type: () => String, maxLength: 200 }, city: { required: false, type: () => String, maxLength: 50 }, state: { required: false, type: () => String, minLength: 2, maxLength: 2, pattern: "/^[A-Z]{2}$/" }, zip: { required: false, type: () => String, pattern: "/^\\d{5}(-\\d{4})?$/" }, relationTo: { required: false, type: () => String }, relationshipType: { required: false, type: () => String, maxLength: 50 }, customFields: { required: false, type: () => Object }, notes: { required: false, type: () => String, maxLength: 1000 } };
    }
}
exports.BaseContactFieldsDto = BaseContactFieldsDto;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email format' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Email must not exceed 100 characters' }),
    __metadata("design:type", String)
], BaseContactFieldsDto.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPhoneNumber)('US', { message: 'Invalid phone number format' }),
    (0, class_validator_1.MaxLength)(15, { message: 'Phone must not exceed 15 characters' }),
    __metadata("design:type", String)
], BaseContactFieldsDto.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)(() => contact_dto_1.ContactType, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contact_dto_1.ContactType, { message: 'Invalid contact type' }),
    __metadata("design:type", String)
], BaseContactFieldsDto.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Organization must not exceed 100 characters' }),
    __metadata("design:type", String)
], BaseContactFieldsDto.prototype, "organization", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'Title must not exceed 50 characters' }),
    __metadata("design:type", String)
], BaseContactFieldsDto.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200, { message: 'Address must not exceed 200 characters' }),
    __metadata("design:type", String)
], BaseContactFieldsDto.prototype, "address", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'City must not exceed 50 characters' }),
    __metadata("design:type", String)
], BaseContactFieldsDto.prototype, "city", void 0);
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
], BaseContactFieldsDto.prototype, "state", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{5}(-\d{4})?$/, {
        message: 'Invalid ZIP code format (e.g., 12345 or 12345-6789)',
    }),
    __metadata("design:type", String)
], BaseContactFieldsDto.prototype, "zip", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseContactFieldsDto.prototype, "relationTo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'Relationship type must not exceed 50 characters' }),
    __metadata("design:type", String)
], BaseContactFieldsDto.prototype, "relationshipType", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_scalars_1.GraphQLJSON, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BaseContactFieldsDto.prototype, "customFields", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000, { message: 'Notes must not exceed 1000 characters' }),
    __metadata("design:type", String)
], BaseContactFieldsDto.prototype, "notes", void 0);
//# sourceMappingURL=base-contact-fields.dto.js.map