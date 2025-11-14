"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsMRNConstraint = void 0;
exports.IsMRN = IsMRN;
const class_validator_1 = require("class-validator");
let IsMRNConstraint = class IsMRNConstraint {
    validate(value, args) {
        if (typeof value !== 'string')
            return false;
        const options = args.constraints[0] || {
            minLength: 6,
            maxLength: 12,
            allowLowercase: false,
        };
        const minLength = options.minLength || 6;
        const maxLength = options.maxLength || 12;
        if (options.pattern) {
            return options.pattern.test(value);
        }
        let pattern;
        if (options.allowLowercase) {
            pattern = new RegExp(`^[A-Za-z0-9]{${minLength},${maxLength}}$`);
        }
        else {
            pattern = new RegExp(`^[A-Z0-9]{${minLength},${maxLength}}$`);
        }
        if (!pattern.test(value))
            return false;
        if (/^(.)\1+$/.test(value))
            return false;
        if (!/\d/.test(value))
            return false;
        return true;
    }
    defaultMessage(args) {
        const options = args.constraints[0] || {};
        const minLength = options.minLength || 6;
        const maxLength = options.maxLength || 12;
        if (options.allowLowercase) {
            return `MRN must be ${minLength}-${maxLength} alphanumeric characters`;
        }
        return `MRN must be ${minLength}-${maxLength} uppercase alphanumeric characters`;
    }
};
exports.IsMRNConstraint = IsMRNConstraint;
exports.IsMRNConstraint = IsMRNConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isMRN', async: false })
], IsMRNConstraint);
function IsMRN(options, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isMRN',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
            options: validationOptions,
            validator: IsMRNConstraint,
        });
    };
}
//# sourceMappingURL=is-mrn.decorator.js.map