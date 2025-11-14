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
exports.BaseHealthcareFilterInputDto = exports.BaseHealthcareUpdateInputDto = exports.BaseHealthcareInputDto = exports.BaseHealthcareDto = void 0;
const openapi = require("@nestjs/swagger");
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
class BaseHealthcareDto {
    static createRequiredStringField(fieldName, maxLength, minLength = 1) {
        return [
            (0, class_validator_1.IsString)(),
            (0, class_validator_1.MinLength)(minLength, { message: `${fieldName} must not be empty` }),
            (0, class_validator_1.MaxLength)(maxLength, {
                message: `${fieldName} must not exceed ${maxLength} characters`,
            }),
        ];
    }
    static createOptionalStringField(fieldName, maxLength, minLength = 1) {
        return [
            (0, class_validator_1.IsOptional)(),
            (0, class_validator_1.IsString)(),
            (0, class_validator_1.MinLength)(minLength, { message: `${fieldName} must not be empty` }),
            (0, class_validator_1.MaxLength)(maxLength, {
                message: `${fieldName} must not exceed ${maxLength} characters`,
            }),
        ];
    }
    static createDateField(fieldName) {
        return [(0, class_validator_1.IsDateString)({}, { message: `Invalid date format for ${fieldName}` })];
    }
    static createOptionalDateField(fieldName) {
        return [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)({}, { message: `Invalid date format for ${fieldName}` })];
    }
    static createEnumField(enumType, fieldName) {
        return [(0, class_validator_1.IsEnum)(enumType, { message: `Invalid ${fieldName} value` })];
    }
    static createOptionalEnumField(enumType, fieldName) {
        return [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(enumType, { message: `Invalid ${fieldName} value` })];
    }
    static createIdField() {
        return [(0, class_validator_1.IsString)()];
    }
    static createOptionalIdField() {
        return [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
    }
    static createOptionalBooleanField() {
        return [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
    }
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.BaseHealthcareDto = BaseHealthcareDto;
let BaseHealthcareInputDto = class BaseHealthcareInputDto extends BaseHealthcareDto {
    firstName;
    lastName;
    dateOfBirth;
    photo;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, dateOfBirth: { required: true, type: () => Date }, photo: { required: false, type: () => String, maxLength: 500 }, isActive: { required: false, type: () => Boolean } };
    }
};
exports.BaseHealthcareInputDto = BaseHealthcareInputDto;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], BaseHealthcareInputDto.prototype, "firstName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], BaseHealthcareInputDto.prototype, "lastName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], BaseHealthcareInputDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Photo URL must not exceed 500 characters' }),
    __metadata("design:type", String)
], BaseHealthcareInputDto.prototype, "photo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, defaultValue: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BaseHealthcareInputDto.prototype, "isActive", void 0);
exports.BaseHealthcareInputDto = BaseHealthcareInputDto = __decorate([
    (0, graphql_1.InputType)()
], BaseHealthcareInputDto);
let BaseHealthcareUpdateInputDto = class BaseHealthcareUpdateInputDto extends BaseHealthcareDto {
    firstName;
    lastName;
    dateOfBirth;
    photo;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { firstName: { required: false, type: () => String }, lastName: { required: false, type: () => String }, dateOfBirth: { required: false, type: () => Date }, photo: { required: false, type: () => String, maxLength: 500 }, isActive: { required: false, type: () => Boolean } };
    }
};
exports.BaseHealthcareUpdateInputDto = BaseHealthcareUpdateInputDto;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BaseHealthcareUpdateInputDto.prototype, "firstName", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BaseHealthcareUpdateInputDto.prototype, "lastName", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], BaseHealthcareUpdateInputDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Photo URL must not exceed 500 characters' }),
    __metadata("design:type", String)
], BaseHealthcareUpdateInputDto.prototype, "photo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BaseHealthcareUpdateInputDto.prototype, "isActive", void 0);
exports.BaseHealthcareUpdateInputDto = BaseHealthcareUpdateInputDto = __decorate([
    (0, graphql_1.InputType)()
], BaseHealthcareUpdateInputDto);
let BaseHealthcareFilterInputDto = class BaseHealthcareFilterInputDto extends BaseHealthcareDto {
    isActive;
    search;
    static _OPENAPI_METADATA_FACTORY() {
        return { isActive: { required: false, type: () => Boolean }, search: { required: false, type: () => String } };
    }
};
exports.BaseHealthcareFilterInputDto = BaseHealthcareFilterInputDto;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BaseHealthcareFilterInputDto.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseHealthcareFilterInputDto.prototype, "search", void 0);
exports.BaseHealthcareFilterInputDto = BaseHealthcareFilterInputDto = __decorate([
    (0, graphql_1.InputType)()
], BaseHealthcareFilterInputDto);
//# sourceMappingURL=base-healthcare.dto.js.map