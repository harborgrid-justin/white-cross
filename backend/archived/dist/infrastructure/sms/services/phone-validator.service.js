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
exports.PhoneValidatorService = void 0;
const common_1 = require("@nestjs/common");
const libphonenumber_js_1 = require("libphonenumber-js");
const phone_number_dto_1 = require("../dto/phone-number.dto");
const base_1 = require("../../../common/base");
let PhoneValidatorService = class PhoneValidatorService extends base_1.BaseService {
    constructor() {
        super("PhoneValidatorService");
    }
    async validatePhoneNumber(phoneNumber, defaultCountry) {
        try {
            const cleanedNumber = phoneNumber.trim();
            if (!cleanedNumber) {
                return {
                    isValid: false,
                    error: 'Phone number is empty',
                };
            }
            const country = defaultCountry
                ? defaultCountry.toUpperCase()
                : undefined;
            const isValid = (0, libphonenumber_js_1.isValidPhoneNumber)(cleanedNumber, country);
            if (!isValid) {
                return {
                    isValid: false,
                    error: 'Invalid phone number format',
                };
            }
            const parsedNumber = (0, libphonenumber_js_1.parsePhoneNumber)(cleanedNumber, country);
            if (!parsedNumber) {
                return {
                    isValid: false,
                    error: 'Unable to parse phone number',
                };
            }
            const result = {
                isValid: true,
                e164Format: parsedNumber.format('E.164'),
                countryCode: parsedNumber.country,
                nationalFormat: parsedNumber.formatNational(),
                type: this.mapPhoneNumberType(parsedNumber),
            };
            this.logDebug(`Validated phone number: ${result.e164Format} (${result.countryCode})`);
            return result;
        }
        catch (error) {
            this.logWarning(`Phone validation error for ${phoneNumber}: ${error.message}`);
            return {
                isValid: false,
                error: error.message || 'Phone number validation failed',
            };
        }
    }
    async normalizeToE164(phoneNumber, defaultCountry) {
        const result = await this.validatePhoneNumber(phoneNumber, defaultCountry);
        return result.isValid ? result.e164Format : null;
    }
    async getCountryCode(phoneNumber) {
        const result = await this.validatePhoneNumber(phoneNumber);
        return result.isValid ? result.countryCode : null;
    }
    async getNumberType(phoneNumber, defaultCountry) {
        const result = await this.validatePhoneNumber(phoneNumber, defaultCountry);
        return result.isValid ? result.type : null;
    }
    async isMobileNumber(phoneNumber, defaultCountry) {
        const type = await this.getNumberType(phoneNumber, defaultCountry);
        return (type === phone_number_dto_1.PhoneNumberType.MOBILE ||
            type === phone_number_dto_1.PhoneNumberType.FIXED_LINE_OR_MOBILE);
    }
    async validateBatch(phoneNumbers, defaultCountry) {
        const results = await Promise.all(phoneNumbers.map((number) => this.validatePhoneNumber(number, defaultCountry)));
        const validCount = results.filter((r) => r.isValid).length;
        this.logInfo(`Batch validation: ${validCount}/${phoneNumbers.length} valid numbers`);
        return results;
    }
    async formatPhoneNumber(phoneNumber, format = 'international', defaultCountry) {
        try {
            const country = defaultCountry
                ? defaultCountry.toUpperCase()
                : undefined;
            const parsedNumber = (0, libphonenumber_js_1.parsePhoneNumber)(phoneNumber, country);
            if (!parsedNumber) {
                return null;
            }
            return format === 'national'
                ? parsedNumber.formatNational()
                : parsedNumber.formatInternational();
        }
        catch (error) {
            this.logWarning(`Phone formatting error: ${error.message}`);
            return null;
        }
    }
    mapPhoneNumberType(parsedNumber) {
        const type = parsedNumber.getType();
        switch (type) {
            case 'MOBILE':
                return phone_number_dto_1.PhoneNumberType.MOBILE;
            case 'FIXED_LINE':
                return phone_number_dto_1.PhoneNumberType.FIXED_LINE;
            case 'FIXED_LINE_OR_MOBILE':
                return phone_number_dto_1.PhoneNumberType.FIXED_LINE_OR_MOBILE;
            case 'TOLL_FREE':
                return phone_number_dto_1.PhoneNumberType.TOLL_FREE;
            case 'PREMIUM_RATE':
                return phone_number_dto_1.PhoneNumberType.PREMIUM_RATE;
            case 'VOIP':
                return phone_number_dto_1.PhoneNumberType.VOIP;
            default:
                return phone_number_dto_1.PhoneNumberType.UNKNOWN;
        }
    }
};
exports.PhoneValidatorService = PhoneValidatorService;
exports.PhoneValidatorService = PhoneValidatorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PhoneValidatorService);
//# sourceMappingURL=phone-validator.service.js.map