"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNPIConstraint = void 0;
exports.IsNPI = IsNPI;
const class_validator_1 = require("class-validator");
let IsNPIConstraint = class IsNPIConstraint {
    validate(value, args) {
        if (typeof value !== 'string')
            return false;
        const options = args.constraints[0] || {
            validateChecksum: true,
        };
        if (!/^\d{10}$/.test(value))
            return false;
        if (value.startsWith('0'))
            return false;
        if (options.validateChecksum) {
            return this.validateLuhnChecksum(value);
        }
        return true;
    }
    validateLuhnChecksum(npi) {
        const fullNumber = '80840' + npi.substring(0, 9);
        let sum = 0;
        let shouldDouble = true;
        for (let i = fullNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(fullNumber[i], 10);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        const calculatedCheckDigit = (10 - (sum % 10)) % 10;
        const providedCheckDigit = parseInt(npi[9], 10);
        return calculatedCheckDigit === providedCheckDigit;
    }
    defaultMessage() {
        return 'NPI must be a valid 10-digit National Provider Identifier';
    }
};
exports.IsNPIConstraint = IsNPIConstraint;
exports.IsNPIConstraint = IsNPIConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isNPI', async: false })
], IsNPIConstraint);
function IsNPI(options, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isNPI',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
            options: validationOptions,
            validator: IsNPIConstraint,
        });
    };
}
//# sourceMappingURL=is-npi.decorator.js.map