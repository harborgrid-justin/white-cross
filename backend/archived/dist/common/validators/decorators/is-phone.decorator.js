"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPhoneConstraint = void 0;
exports.IsPhone = IsPhone;
const class_validator_1 = require("class-validator");
let IsPhoneConstraint = class IsPhoneConstraint {
    validate(value, args) {
        if (typeof value !== 'string')
            return false;
        const options = args.constraints[0] || {};
        const patterns = {
            standard: /^(\+1[-.\s]?)?(\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
            withExtension: /^(\+1[-.\s]?)?(\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}(\s?(ext|x)\s?\d{1,5})?$/i,
            international: /^\+[1-9]\d{1,14}$/,
        };
        let pattern = patterns.standard;
        if (options.allowExtension) {
            pattern = patterns.withExtension;
        }
        if (options.allowInternational) {
            return patterns.international.test(value) || pattern.test(value);
        }
        const isValid = pattern.test(value);
        if (isValid && options.requireCountryCode) {
            return value.startsWith('+1') || value.startsWith('1');
        }
        return isValid;
    }
    defaultMessage(args) {
        const options = args.constraints[0] || {};
        if (options.requireCountryCode) {
            return 'Phone number must include country code (+1)';
        }
        if (options.allowInternational) {
            return 'Phone number must be in valid US or international format';
        }
        if (options.allowExtension) {
            return 'Phone number must be in valid US format (e.g., (555) 123-4567 ext 123)';
        }
        return 'Phone number must be in valid US format (e.g., (555) 123-4567, 555-123-4567)';
    }
};
exports.IsPhoneConstraint = IsPhoneConstraint;
exports.IsPhoneConstraint = IsPhoneConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isPhone', async: false })
], IsPhoneConstraint);
function IsPhone(options, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isPhone',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
            options: validationOptions,
            validator: IsPhoneConstraint,
        });
    };
}
//# sourceMappingURL=is-phone.decorator.js.map