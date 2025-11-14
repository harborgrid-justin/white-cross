"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationException = void 0;
const common_1 = require("@nestjs/common");
const error_codes_1 = require("../constants/error-codes");
class ValidationException extends common_1.HttpException {
    errorCode;
    errors;
    constructor(message = 'Validation failed', errors = [], errorCode = error_codes_1.ValidationErrorCodes.INVALID_FORMAT) {
        const response = {
            success: false,
            error: 'Validation Error',
            message,
            errorCode,
            errors,
        };
        super(response, common_1.HttpStatus.BAD_REQUEST);
        this.errorCode = errorCode;
        this.errors = errors;
        this.name = 'ValidationException';
    }
    static requiredFieldMissing(field) {
        return new ValidationException('Required field missing', [{ field, message: `${field} is required` }], error_codes_1.ValidationErrorCodes.REQUIRED_FIELD_MISSING);
    }
    static invalidFormat(field, expectedFormat, value) {
        return new ValidationException('Invalid format', [
            {
                field,
                message: `${field} has invalid format. Expected: ${expectedFormat}`,
                value,
            },
        ], error_codes_1.ValidationErrorCodes.INVALID_FORMAT);
    }
    static invalidType(field, expectedType, actualType) {
        return new ValidationException('Invalid type', [
            {
                field,
                message: `${field} must be ${expectedType}, got ${actualType}`,
            },
        ], error_codes_1.ValidationErrorCodes.INVALID_TYPE);
    }
    static outOfRange(field, min, max, value) {
        return new ValidationException('Value out of range', [
            {
                field,
                message: `${field} must be between ${min} and ${max}`,
                value,
            },
        ], error_codes_1.ValidationErrorCodes.OUT_OF_RANGE);
    }
    static invalidLength(field, min, max, actualLength) {
        let message = `${field} has invalid length`;
        if (min !== undefined && max !== undefined) {
            message = `${field} must be between ${min} and ${max} characters`;
        }
        else if (min !== undefined) {
            message = `${field} must be at least ${min} characters`;
        }
        else if (max !== undefined) {
            message = `${field} must not exceed ${max} characters`;
        }
        return new ValidationException('Invalid length', [{ field, message, value: actualLength }], error_codes_1.ValidationErrorCodes.INVALID_LENGTH);
    }
    static duplicateEntry(field, value) {
        return new ValidationException('Duplicate entry', [
            {
                field,
                message: `${field} already exists`,
                value,
            },
        ], error_codes_1.ValidationErrorCodes.DUPLICATE_ENTRY);
    }
    static fromClassValidator(errors) {
        const validationErrors = errors.flatMap((error) => {
            if (error.constraints) {
                return Object.entries(error.constraints).map(([constraint, message]) => ({
                    field: error.property,
                    message: String(message),
                    value: error.value,
                    constraint,
                }));
            }
            return [];
        });
        return new ValidationException('Validation failed', validationErrors);
    }
}
exports.ValidationException = ValidationException;
//# sourceMappingURL=validation.exception.js.map