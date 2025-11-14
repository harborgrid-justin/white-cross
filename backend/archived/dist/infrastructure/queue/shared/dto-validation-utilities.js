"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DtoValidationUtilities = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class DtoValidationUtilities {
    static async validateDto(dtoClass, data) {
        try {
            const dtoInstance = (0, class_transformer_1.plainToClass)(dtoClass, data, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
            });
            const validationErrors = await (0, class_validator_1.validate)(dtoInstance, {
                whitelist: true,
                forbidNonWhitelisted: true,
                skipMissingProperties: false,
            });
            if (validationErrors.length > 0) {
                return {
                    isValid: false,
                    errors: this.formatValidationErrors(validationErrors),
                };
            }
            return {
                isValid: true,
                errors: [],
                dto: dtoInstance,
            };
        }
        catch (error) {
            return {
                isValid: false,
                errors: [`Validation failed: ${error.message}`],
            };
        }
    }
    static formatValidationErrors(errors) {
        const formattedErrors = [];
        errors.forEach((error) => {
            if (error.constraints) {
                Object.values(error.constraints).forEach((constraint) => {
                    formattedErrors.push(constraint);
                });
            }
            if (error.children && error.children.length > 0) {
                const nestedErrors = this.formatValidationErrors(error.children);
                formattedErrors.push(...nestedErrors.map(err => `${error.property}: ${err}`));
            }
        });
        return formattedErrors;
    }
    static validateBaseJobProperties(data) {
        const errors = [];
        if (!data.createdAt) {
            errors.push('createdAt is required');
        }
        else if (!(data.createdAt instanceof Date) && !this.isValidDateString(data.createdAt)) {
            errors.push('createdAt must be a valid date');
        }
        if (data.jobId && typeof data.jobId !== 'string') {
            errors.push('jobId must be a string');
        }
        if (data.initiatedBy && typeof data.initiatedBy !== 'string') {
            errors.push('initiatedBy must be a string');
        }
        if (data.metadata && typeof data.metadata !== 'object') {
            errors.push('metadata must be an object');
        }
        return errors;
    }
    static validateUuidField(value, fieldName) {
        const errors = [];
        if (!value) {
            errors.push(`${fieldName} is required`);
        }
        else if (typeof value !== 'string') {
            errors.push(`${fieldName} must be a string`);
        }
        else if (!this.isValidUuid(value)) {
            errors.push(`${fieldName} must be a valid UUID`);
        }
        return errors;
    }
    static validateStringField(value, fieldName, options = {}) {
        const errors = [];
        const { required = true, minLength, maxLength } = options;
        if (!value) {
            if (required) {
                errors.push(`${fieldName} is required`);
            }
            return errors;
        }
        if (typeof value !== 'string') {
            errors.push(`${fieldName} must be a string`);
            return errors;
        }
        if (minLength && value.length < minLength) {
            errors.push(`${fieldName} must be at least ${minLength} characters long`);
        }
        if (maxLength && value.length > maxLength) {
            errors.push(`${fieldName} must be no longer than ${maxLength} characters`);
        }
        return errors;
    }
    static validateEnumField(value, fieldName, enumObject, required = true) {
        const errors = [];
        if (!value) {
            if (required) {
                errors.push(`${fieldName} is required`);
            }
            return errors;
        }
        const enumValues = Object.values(enumObject);
        if (!enumValues.includes(value)) {
            errors.push(`${fieldName} must be one of: ${enumValues.join(', ')}`);
        }
        return errors;
    }
    static validateArrayField(value, fieldName, options = {}) {
        const errors = [];
        const { required = true, minLength, maxLength, itemValidator } = options;
        if (!value) {
            if (required) {
                errors.push(`${fieldName} is required`);
            }
            return errors;
        }
        if (!Array.isArray(value)) {
            errors.push(`${fieldName} must be an array`);
            return errors;
        }
        if (minLength && value.length < minLength) {
            errors.push(`${fieldName} must contain at least ${minLength} items`);
        }
        if (maxLength && value.length > maxLength) {
            errors.push(`${fieldName} must contain no more than ${maxLength} items`);
        }
        if (itemValidator) {
            value.forEach((item, index) => {
                const itemErrors = itemValidator(item, index);
                errors.push(...itemErrors.map(err => `${fieldName}[${index}]: ${err}`));
            });
        }
        return errors;
    }
    static validateNumberField(value, fieldName, options = {}) {
        const errors = [];
        const { required = true, min, max, integer = false } = options;
        if (value === undefined || value === null) {
            if (required) {
                errors.push(`${fieldName} is required`);
            }
            return errors;
        }
        if (typeof value !== 'number' || isNaN(value)) {
            errors.push(`${fieldName} must be a valid number`);
            return errors;
        }
        if (integer && !Number.isInteger(value)) {
            errors.push(`${fieldName} must be an integer`);
        }
        if (min !== undefined && value < min) {
            errors.push(`${fieldName} must be at least ${min}`);
        }
        if (max !== undefined && value > max) {
            errors.push(`${fieldName} must be no more than ${max}`);
        }
        return errors;
    }
    static isValidUuid(uuid) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
    static isValidDateString(dateString) {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }
    static createValidationResult(isValid, errors, dto) {
        return { isValid, errors, dto };
    }
    static combineValidationResults(...results) {
        const allErrors = [];
        let allValid = true;
        results.forEach(result => {
            if (!result.isValid) {
                allValid = false;
            }
            allErrors.push(...result.errors);
        });
        return {
            isValid: allValid,
            errors: allErrors,
        };
    }
}
exports.DtoValidationUtilities = DtoValidationUtilities;
//# sourceMappingURL=dto-validation-utilities.js.map