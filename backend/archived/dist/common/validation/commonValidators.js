"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUUID = validateUUID;
exports.validateRequiredFields = validateRequiredFields;
exports.validateEmail = validateEmail;
exports.validatePhoneNumber = validatePhoneNumber;
exports.validateStringLength = validateStringLength;
exports.validateNumericRange = validateNumericRange;
exports.validateEnum = validateEnum;
exports.validateArray = validateArray;
exports.combineValidationResults = combineValidationResults;
exports.validateObject = validateObject;
const validation_service_1 = require("../security/validation.service");
function validateUUID(value, fieldName = 'ID') {
    const errors = [];
    if (!value) {
        errors.push({
            field: fieldName,
            message: `${fieldName} is required`,
            code: validation_service_1.ValidationErrorCode.REQUIRED,
        });
    }
    else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
        errors.push({
            field: fieldName,
            message: `${fieldName} must be a valid UUID format`,
            code: validation_service_1.ValidationErrorCode.INVALID_FORMAT,
            value,
        });
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
    };
}
function validateRequiredFields(data, requiredFields) {
    const errors = [];
    for (const field of requiredFields) {
        const value = data[field];
        if (value === undefined || value === null || value === '') {
            errors.push({
                field,
                message: `${field} is required`,
                code: validation_service_1.ValidationErrorCode.REQUIRED,
            });
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
    };
}
function validateEmail(email, fieldName = 'email') {
    const errors = [];
    if (!email) {
        errors.push({
            field: fieldName,
            message: `${fieldName} is required`,
            code: validation_service_1.ValidationErrorCode.REQUIRED,
        });
    }
    else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push({
                field: fieldName,
                message: `${fieldName} must be a valid email address`,
                code: validation_service_1.ValidationErrorCode.INVALID_FORMAT,
                value: email,
            });
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
    };
}
function validatePhoneNumber(phone, fieldName = 'phone') {
    const errors = [];
    const warnings = [];
    if (!phone) {
        errors.push({
            field: fieldName,
            message: `${fieldName} is required`,
            code: validation_service_1.ValidationErrorCode.REQUIRED,
        });
    }
    else {
        const digitsOnly = phone.replace(/\D/g, '');
        if (digitsOnly.length < 10) {
            errors.push({
                field: fieldName,
                message: `${fieldName} must contain at least 10 digits`,
                code: validation_service_1.ValidationErrorCode.TOO_SHORT,
                value: phone,
            });
        }
        else if (digitsOnly.length > 15) {
            errors.push({
                field: fieldName,
                message: `${fieldName} cannot contain more than 15 digits`,
                code: validation_service_1.ValidationErrorCode.TOO_LONG,
                value: phone,
            });
        }
        if (!/^[\d\s\-\(\)\+\.]+$/.test(phone)) {
            warnings.push({
                field: fieldName,
                message: `${fieldName} contains unusual characters`,
                code: validation_service_1.ValidationErrorCode.UNUSUAL_FORMAT,
                value: phone,
            });
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}
function validateStringLength(value, fieldName, constraints) {
    const errors = [];
    const { min, max } = constraints;
    if (!value) {
        if (min && min > 0) {
            errors.push({
                field: fieldName,
                message: `${fieldName} is required`,
                code: validation_service_1.ValidationErrorCode.REQUIRED,
            });
        }
    }
    else {
        if (min !== undefined && value.length < min) {
            errors.push({
                field: fieldName,
                message: `${fieldName} must be at least ${min} characters long`,
                code: validation_service_1.ValidationErrorCode.TOO_SHORT,
                value: value.length,
            });
        }
        if (max !== undefined && value.length > max) {
            errors.push({
                field: fieldName,
                message: `${fieldName} cannot exceed ${max} characters`,
                code: validation_service_1.ValidationErrorCode.TOO_LONG,
                value: value.length,
            });
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
    };
}
function validateNumericRange(value, fieldName, constraints) {
    const errors = [];
    const { min, max, integer } = constraints;
    if (value === undefined || value === null) {
        errors.push({
            field: fieldName,
            message: `${fieldName} is required`,
            code: validation_service_1.ValidationErrorCode.REQUIRED,
        });
    }
    else {
        if (typeof value !== 'number' || isNaN(value)) {
            errors.push({
                field: fieldName,
                message: `${fieldName} must be a valid number`,
                code: validation_service_1.ValidationErrorCode.INVALID_TYPE,
                value,
            });
        }
        else {
            if (integer && !Number.isInteger(value)) {
                errors.push({
                    field: fieldName,
                    message: `${fieldName} must be an integer`,
                    code: validation_service_1.ValidationErrorCode.NOT_INTEGER,
                    value,
                });
            }
            if (min !== undefined && value < min) {
                errors.push({
                    field: fieldName,
                    message: `${fieldName} must be at least ${min}`,
                    code: validation_service_1.ValidationErrorCode.TOO_SMALL,
                    value,
                });
            }
            if (max !== undefined && value > max) {
                errors.push({
                    field: fieldName,
                    message: `${fieldName} cannot exceed ${max}`,
                    code: validation_service_1.ValidationErrorCode.TOO_LARGE,
                    value,
                });
            }
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
    };
}
function validateEnum(value, fieldName, allowedValues) {
    const errors = [];
    if (!value) {
        errors.push({
            field: fieldName,
            message: `${fieldName} is required`,
            code: validation_service_1.ValidationErrorCode.REQUIRED,
        });
    }
    else if (!allowedValues.includes(value)) {
        errors.push({
            field: fieldName,
            message: `${fieldName} must be one of: ${allowedValues.join(', ')}`,
            code: validation_service_1.ValidationErrorCode.INVALID_VALUE,
            value,
        });
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
    };
}
function validateArray(value, fieldName, constraints) {
    const errors = [];
    const warnings = [];
    const { minLength, maxLength, uniqueItems, itemValidator } = constraints;
    if (!Array.isArray(value)) {
        errors.push({
            field: fieldName,
            message: `${fieldName} must be an array`,
            code: validation_service_1.ValidationErrorCode.INVALID_TYPE,
            value,
        });
        return { isValid: false, errors, warnings };
    }
    if (minLength !== undefined && value.length < minLength) {
        errors.push({
            field: fieldName,
            message: `${fieldName} must contain at least ${minLength} items`,
            code: validation_service_1.ValidationErrorCode.TOO_SHORT,
            value: value.length,
        });
    }
    if (maxLength !== undefined && value.length > maxLength) {
        errors.push({
            field: fieldName,
            message: `${fieldName} cannot contain more than ${maxLength} items`,
            code: validation_service_1.ValidationErrorCode.TOO_LONG,
            value: value.length,
        });
    }
    if (uniqueItems && value.length > 0) {
        const unique = new Set(value);
        if (unique.size !== value.length) {
            warnings.push({
                field: fieldName,
                message: `${fieldName} contains duplicate items`,
                code: validation_service_1.ValidationErrorCode.DUPLICATE_ITEMS,
            });
        }
    }
    if (itemValidator) {
        value.forEach((item, index) => {
            const itemResult = itemValidator(item, index);
            itemResult.errors.forEach((error) => {
                errors.push({
                    ...error,
                    field: `${fieldName}[${index}].${error.field}`,
                });
            });
            if (itemResult.warnings && itemResult.warnings.length > 0) {
                itemResult.warnings.forEach((warning) => {
                    warnings.push({
                        ...warning,
                        field: `${fieldName}[${index}].${warning.field}`,
                    });
                });
            }
        });
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}
function combineValidationResults(...results) {
    const allErrors = [];
    const allWarnings = [];
    for (const result of results) {
        allErrors.push(...result.errors);
        if (result.warnings && result.warnings.length > 0) {
            allWarnings.push(...result.warnings);
        }
    }
    return {
        isValid: allErrors.length === 0,
        errors: allErrors,
        warnings: allWarnings,
    };
}
function validateObject(data, schema) {
    const results = [];
    for (const [field, validator] of Object.entries(schema)) {
        const value = data[field];
        const result = validator(value);
        results.push(result);
    }
    return combineValidationResults(...results);
}
//# sourceMappingURL=commonValidators.js.map