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
exports.PhoneNumberValidationResult = exports.ValidatePhoneNumberDto = exports.PhoneNumberType = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var PhoneNumberType;
(function (PhoneNumberType) {
    PhoneNumberType["MOBILE"] = "mobile";
    PhoneNumberType["FIXED_LINE"] = "fixed-line";
    PhoneNumberType["FIXED_LINE_OR_MOBILE"] = "fixed-line-or-mobile";
    PhoneNumberType["TOLL_FREE"] = "toll-free";
    PhoneNumberType["PREMIUM_RATE"] = "premium-rate";
    PhoneNumberType["VOIP"] = "voip";
    PhoneNumberType["UNKNOWN"] = "unknown";
})(PhoneNumberType || (exports.PhoneNumberType = PhoneNumberType = {}));
class ValidatePhoneNumberDto {
    phoneNumber;
    defaultCountry;
    static _OPENAPI_METADATA_FACTORY() {
        return { phoneNumber: { required: true, type: () => String }, defaultCountry: { required: false, type: () => String } };
    }
}
exports.ValidatePhoneNumberDto = ValidatePhoneNumberDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phone number to validate',
        example: '+15551234567',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidatePhoneNumberDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Default country code (ISO 3166-1 alpha-2)',
        example: 'US',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidatePhoneNumberDto.prototype, "defaultCountry", void 0);
class PhoneNumberValidationResult {
    isValid;
    e164Format;
    countryCode;
    type;
    nationalFormat;
    error;
    static _OPENAPI_METADATA_FACTORY() {
        return { isValid: { required: true, type: () => Boolean }, e164Format: { required: false, type: () => String }, countryCode: { required: false, type: () => String }, type: { required: false, enum: require("./phone-number.dto").PhoneNumberType }, nationalFormat: { required: false, type: () => String }, error: { required: false, type: () => String } };
    }
}
exports.PhoneNumberValidationResult = PhoneNumberValidationResult;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the phone number is valid',
        example: true,
    }),
    __metadata("design:type", Boolean)
], PhoneNumberValidationResult.prototype, "isValid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phone number in E.164 format',
        example: '+15551234567',
        required: false,
    }),
    __metadata("design:type", String)
], PhoneNumberValidationResult.prototype, "e164Format", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country code (ISO 3166-1 alpha-2)',
        example: 'US',
        required: false,
    }),
    __metadata("design:type", String)
], PhoneNumberValidationResult.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phone number type',
        enum: PhoneNumberType,
        required: false,
    }),
    __metadata("design:type", String)
], PhoneNumberValidationResult.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'National format of phone number',
        example: '(555) 123-4567',
        required: false,
    }),
    __metadata("design:type", String)
], PhoneNumberValidationResult.prototype, "nationalFormat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Validation error message',
        example: 'Invalid phone number format',
        required: false,
    }),
    __metadata("design:type", String)
], PhoneNumberValidationResult.prototype, "error", void 0);
//# sourceMappingURL=phone-number.dto.js.map