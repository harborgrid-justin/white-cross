"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsICD10Constraint = void 0;
exports.IsICD10 = IsICD10;
const class_validator_1 = require("class-validator");
let IsICD10Constraint = class IsICD10Constraint {
    validate(value, args) {
        if (typeof value !== 'string')
            return false;
        const options = args.constraints[0] || {
            allowBillingFormat: true,
            strictFormat: true,
        };
        const code = value.toUpperCase().trim();
        const pattern = /^[A-Z]\d{2}(\.\d{1,4})?$/;
        if (!pattern.test(code))
            return false;
        if (options.strictFormat) {
            return this.performStrictValidation(code);
        }
        return true;
    }
    performStrictValidation(code) {
        const firstChar = code[0];
        const validStarts = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (!validStarts.includes(firstChar))
            return false;
        const restrictedCategories = [
            'U00',
            'U01',
            'U02',
            'U03',
            'U04',
            'U05',
            'U06',
            'U08',
            'U09',
        ];
        const category = code.substring(0, 3);
        if (firstChar === 'U' &&
            !code.startsWith('U07') &&
            restrictedCategories.includes(category)) {
            return false;
        }
        return true;
    }
    defaultMessage(args) {
        return 'ICD-10 code must be in valid format (e.g., A00, A00.1, Z99.89)';
    }
};
exports.IsICD10Constraint = IsICD10Constraint;
exports.IsICD10Constraint = IsICD10Constraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isICD10', async: false })
], IsICD10Constraint);
function IsICD10(options, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isICD10',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
            options: validationOptions,
            validator: IsICD10Constraint,
        });
    };
}
//# sourceMappingURL=is-icd10.decorator.js.map