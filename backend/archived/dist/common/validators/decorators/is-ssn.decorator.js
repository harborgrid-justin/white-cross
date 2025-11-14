"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsSSNConstraint = void 0;
exports.IsSSN = IsSSN;
const class_validator_1 = require("class-validator");
let IsSSNConstraint = class IsSSNConstraint {
    INVALID_SSNS = [
        '000000000',
        '111111111',
        '222222222',
        '333333333',
        '444444444',
        '555555555',
        '666666666',
        '777777777',
        '888888888',
        '999999999',
        '123456789',
    ];
    validate(value, args) {
        if (typeof value !== 'string')
            return false;
        const options = args.constraints[0] || {};
        const cleanSSN = value.replace(/-/g, '');
        if (!/^\d{9}$/.test(cleanSSN))
            return false;
        if (!options.allowDashes && value.includes('-'))
            return false;
        if (options.allowDashes && value.includes('-')) {
            if (!/^\d{3}-\d{2}-\d{4}$/.test(value))
                return false;
        }
        if (options.strictValidation) {
            return this.performStrictValidation(cleanSSN);
        }
        return true;
    }
    performStrictValidation(ssn) {
        if (this.INVALID_SSNS.includes(ssn))
            return false;
        const area = ssn.substring(0, 3);
        const group = ssn.substring(3, 5);
        const serial = ssn.substring(5, 9);
        const areaNum = parseInt(area, 10);
        if (areaNum === 0 || areaNum === 666 || areaNum >= 900)
            return false;
        if (group === '00')
            return false;
        if (serial === '0000')
            return false;
        if (ssn === '123456789' || ssn === '987654321')
            return false;
        return true;
    }
    defaultMessage(args) {
        const options = args.constraints[0] || {};
        if (options.strictValidation) {
            return 'SSN must be a valid Social Security Number';
        }
        if (options.allowDashes) {
            return 'SSN must be in format XXX-XX-XXXX or XXXXXXXXX';
        }
        return 'SSN must be 9 digits';
    }
};
exports.IsSSNConstraint = IsSSNConstraint;
exports.IsSSNConstraint = IsSSNConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isSSN', async: false })
], IsSSNConstraint);
function IsSSN(options, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isSSN',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
            options: validationOptions,
            validator: IsSSNConstraint,
        });
    };
}
//# sourceMappingURL=is-ssn.decorator.js.map