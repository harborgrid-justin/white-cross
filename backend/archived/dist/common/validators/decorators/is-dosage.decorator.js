"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsDosageConstraint = void 0;
exports.IsDosage = IsDosage;
const class_validator_1 = require("class-validator");
let IsDosageConstraint = class IsDosageConstraint {
    STANDARD_UNITS = [
        'mg',
        'mcg',
        'g',
        'ml',
        'L',
        'IU',
        'units',
        'unit',
        'mEq',
        'gtt',
        '%',
        'puff',
        'puffs',
        'spray',
        'sprays',
        'tablet',
        'tablets',
        'capsule',
        'capsules',
    ];
    validate(value, args) {
        if (typeof value !== 'string')
            return false;
        const options = args.constraints[0] || {};
        const pattern = /^(\d+(?:\.\d+)?)\s*([a-zA-Z%]+)$/;
        const match = value.match(pattern);
        if (!match)
            return false;
        const [, amountStr, unit] = match;
        const amount = parseFloat(amountStr);
        if (amount <= 0)
            return false;
        const allowedUnits = options.allowedUnits || this.STANDARD_UNITS;
        const unitLower = unit.toLowerCase();
        const isValidUnit = allowedUnits.some((u) => u.toLowerCase() === unitLower);
        if (!isValidUnit)
            return false;
        if (options.minValue !== undefined && amount < options.minValue)
            return false;
        if (options.maxValue !== undefined && amount > options.maxValue)
            return false;
        return true;
    }
    defaultMessage(args) {
        const options = args.constraints[0] || {};
        if (options.allowedUnits) {
            return `Dosage must be in format: number + unit (allowed units: ${options.allowedUnits.join(', ')})`;
        }
        return 'Dosage must be in format: number + unit (e.g., 10 mg, 2.5 ml, 500 mcg)';
    }
};
exports.IsDosageConstraint = IsDosageConstraint;
exports.IsDosageConstraint = IsDosageConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isDosage', async: false })
], IsDosageConstraint);
function IsDosage(options, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isDosage',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
            options: validationOptions,
            validator: IsDosageConstraint,
        });
    };
}
//# sourceMappingURL=is-dosage.decorator.js.map