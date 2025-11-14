"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneNumberScalar = void 0;
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("graphql");
const libphonenumber_js_1 = require("libphonenumber-js");
let PhoneNumberScalar = class PhoneNumberScalar {
    description = 'Valid phone number in E.164 format (+1234567890)';
    defaultCountry = 'US';
    parseValue(value) {
        return this.validateAndFormatPhone(value);
    }
    serialize(value) {
        if (!value) {
            return value;
        }
        return this.validateAndFormatPhone(value);
    }
    parseLiteral(ast) {
        if (ast.kind === graphql_2.Kind.STRING) {
            return this.validateAndFormatPhone(ast.value);
        }
        throw new Error('PhoneNumber must be a string');
    }
    validateAndFormatPhone(value) {
        if (!value) {
            throw new Error('PhoneNumber must be a non-empty string');
        }
        try {
            const phoneNumber = (0, libphonenumber_js_1.parsePhoneNumber)(value, this.defaultCountry);
            if (!phoneNumber || !phoneNumber.isValid()) {
                throw new Error(`Invalid phone number: ${value}`);
            }
            return phoneNumber.format('E.164');
        }
        catch (error) {
            throw new Error(`Invalid phone number format: ${value}. Expected format: +1 (555) 123-4567 or +15551234567`);
        }
    }
};
exports.PhoneNumberScalar = PhoneNumberScalar;
exports.PhoneNumberScalar = PhoneNumberScalar = __decorate([
    (0, graphql_1.Scalar)('PhoneNumber')
], PhoneNumberScalar);
//# sourceMappingURL=phone-number.scalar.js.map