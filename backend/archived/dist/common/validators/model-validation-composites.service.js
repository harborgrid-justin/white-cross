"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmailValidator = createEmailValidator;
exports.createPhoneValidator = createPhoneValidator;
exports.createSSNValidator = createSSNValidator;
exports.createDateRangeValidator = createDateRangeValidator;
exports.createAgeValidator = createAgeValidator;
exports.createCreditCardValidator = createCreditCardValidator;
exports.createIPAddressValidator = createIPAddressValidator;
exports.createURLValidator = createURLValidator;
exports.createCrossFieldEqualityValidator = createCrossFieldEqualityValidator;
exports.createDateRangeCrossValidator = createDateRangeCrossValidator;
exports.createConditionalRequirement = createConditionalRequirement;
exports.createMutualExclusivityValidator = createMutualExclusivityValidator;
exports.createSumValidator = createSumValidator;
exports.createAsyncUniquenessValidator = createAsyncUniquenessValidator;
exports.createAsyncExternalAPIValidator = createAsyncExternalAPIValidator;
exports.createAsyncReferenceValidator = createAsyncReferenceValidator;
exports.createAsyncRateLimitValidator = createAsyncRateLimitValidator;
exports.createPasswordStrengthValidator = createPasswordStrengthValidator;
exports.createMedicalRecordNumberValidator = createMedicalRecordNumberValidator;
exports.createDrugNDCValidator = createDrugNDCValidator;
exports.createICD10Validator = createICD10Validator;
exports.createCPTValidator = createCPTValidator;
exports.applyValidationRules = applyValidationRules;
exports.applyCrossFieldValidations = applyCrossFieldValidations;
exports.createCustomValidationError = createCustomValidationError;
exports.validateInstance = validateInstance;
exports.createValidationSummary = createValidationSummary;
const sequelize_1 = require("sequelize");
function createEmailValidator(options = {}) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const disposableDomains = ['tempmail.com', 'guerrillamail.com', 'mailinator.com'];
    return {
        validator: async (value) => {
            if (!value)
                return false;
            if (!emailRegex.test(value))
                return false;
            const domain = value.split('@')[1].toLowerCase();
            if (!options.allowDisposable && disposableDomains.includes(domain)) {
                return false;
            }
            return true;
        },
        message: options.message || 'Invalid email address',
        async: options.checkMX || false,
    };
}
function createPhoneValidator(format, options = {}) {
    const patterns = {
        US: /^\+?1?\d{10}$/,
        E164: /^\+[1-9]\d{1,14}$/,
        international: /^\+?[\d\s\-()]+$/,
    };
    return {
        validator: (value) => {
            if (!value)
                return false;
            const cleaned = value.replace(/[\s\-()]/g, '');
            return patterns[format].test(cleaned);
        },
        message: options.message || `Invalid phone number format (expected ${format})`,
    };
}
function createSSNValidator(options = {}) {
    return {
        validator: (value) => {
            if (!value)
                return false;
            let ssn = value;
            if (options.allowDashes) {
                ssn = ssn.replace(/-/g, '');
            }
            if (!/^\d{9}$/.test(ssn))
                return false;
            const area = parseInt(ssn.substring(0, 3));
            const group = parseInt(ssn.substring(3, 5));
            const serial = parseInt(ssn.substring(5, 9));
            if (area === 0 || area === 666 || area >= 900)
                return false;
            if (group === 0)
                return false;
            if (serial === 0)
                return false;
            return true;
        },
        message: options.message || 'Invalid Social Security Number',
    };
}
function createDateRangeValidator(minDate, maxDate, options = {}) {
    return {
        validator: (value) => {
            if (!value)
                return false;
            const date = new Date(value);
            if (minDate) {
                if (options.inclusive) {
                    if (date < minDate)
                        return false;
                }
                else {
                    if (date <= minDate)
                        return false;
                }
            }
            if (maxDate) {
                if (options.inclusive) {
                    if (date > maxDate)
                        return false;
                }
                else {
                    if (date >= maxDate)
                        return false;
                }
            }
            return true;
        },
        message: options.message || 'Date is outside valid range',
    };
}
function createAgeValidator(minAge, maxAge, options = {}) {
    return {
        validator: (value) => {
            if (!value)
                return false;
            const birthDate = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (minAge !== null && age < minAge)
                return false;
            if (maxAge !== null && age > maxAge)
                return false;
            return true;
        },
        message: options.message || `Age must be between ${minAge} and ${maxAge}`,
    };
}
function createCreditCardValidator(allowedTypes, options = {}) {
    return {
        validator: (value) => {
            if (!value)
                return false;
            const cleaned = value.replace(/\s/g, '');
            if (!/^\d+$/.test(cleaned))
                return false;
            let sum = 0;
            let isEven = false;
            for (let i = cleaned.length - 1; i >= 0; i--) {
                let digit = parseInt(cleaned.charAt(i), 10);
                if (isEven) {
                    digit *= 2;
                    if (digit > 9) {
                        digit -= 9;
                    }
                }
                sum += digit;
                isEven = !isEven;
            }
            return sum % 10 === 0;
        },
        message: options.message || 'Invalid credit card number',
    };
}
function createIPAddressValidator(version = 'both', options = {}) {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return {
        validator: (value) => {
            if (!value)
                return false;
            const hasCIDR = value.includes('/');
            if (hasCIDR && !options.allowCIDR)
                return false;
            if (version === 'v4' || version === 'both') {
                if (ipv4Regex.test(value)) {
                    const parts = value.split('/')[0].split('.');
                    return parts.every((part) => {
                        const num = parseInt(part, 10);
                        return num >= 0 && num <= 255;
                    });
                }
            }
            if (version === 'v6' || version === 'both') {
                if (ipv6Regex.test(value)) {
                    return true;
                }
            }
            return false;
        },
        message: options.message || `Invalid IP address (expected IPv${version === 'both' ? '4/6' : version})`,
    };
}
function createURLValidator(options = {}) {
    return {
        validator: (value) => {
            if (!value)
                return false;
            try {
                const url = new URL(value);
                if (options.requireHTTPS && url.protocol !== 'https:') {
                    return false;
                }
                if (options.allowedProtocols && !options.allowedProtocols.includes(url.protocol.slice(0, -1))) {
                    return false;
                }
                if (options.allowedDomains && !options.allowedDomains.includes(url.hostname)) {
                    return false;
                }
                return true;
            }
            catch {
                return false;
            }
        },
        message: options.message || 'Invalid URL',
    };
}
function createCrossFieldEqualityValidator(fields, options = {}) {
    return {
        fields,
        validator: (values) => {
            if (fields.length < 2)
                return true;
            const firstValue = values[fields[0]];
            if (firstValue === null || firstValue === undefined)
                return true;
            const compareValue = options.caseSensitive !== false
                ? firstValue
                : String(firstValue).toLowerCase();
            return fields.slice(1).every((field) => {
                const value = values[field];
                const compare = options.caseSensitive !== false
                    ? value
                    : String(value || '').toLowerCase();
                return compare === compareValue;
            });
        },
        message: options.message || `Fields ${fields.join(', ')} must match`,
    };
}
function createDateRangeCrossValidator(startField, endField, options = {}) {
    return {
        fields: [startField, endField],
        validator: (values) => {
            const start = values[startField];
            const end = values[endField];
            if (!start || !end)
                return true;
            const startDate = new Date(start);
            const endDate = new Date(end);
            if (options.allowEqual) {
                return startDate <= endDate;
            }
            return startDate < endDate;
        },
        message: options.message || `${endField} must be after ${startField}`,
    };
}
function createConditionalRequirement(dependentField, conditionField, conditionValue, options = {}) {
    return {
        fields: [dependentField, conditionField],
        validator: (values) => {
            const condition = values[conditionField];
            const dependent = values[dependentField];
            if (condition === conditionValue) {
                return dependent !== null && dependent !== undefined && dependent !== '';
            }
            return true;
        },
        message: options.message || `${dependentField} is required when ${conditionField} is ${conditionValue}`,
    };
}
function createMutualExclusivityValidator(fields, options = {}) {
    return {
        fields,
        validator: (values) => {
            const nonEmptyCount = fields.filter((field) => {
                const value = values[field];
                return value !== null && value !== undefined && value !== '';
            }).length;
            if (nonEmptyCount > 1)
                return false;
            if (nonEmptyCount === 0 && !options.allowNone)
                return false;
            return true;
        },
        message: options.message || `Only one of ${fields.join(', ')} can be specified`,
    };
}
function createSumValidator(fields, expectedSum, options = {}) {
    return {
        fields,
        validator: (values) => {
            const sum = fields.reduce((acc, field) => {
                const value = parseFloat(values[field]);
                return acc + (isNaN(value) ? 0 : value);
            }, 0);
            if (typeof expectedSum === 'number') {
                const tolerance = options.tolerance || 0;
                return Math.abs(sum - expectedSum) <= tolerance;
            }
            return expectedSum(sum);
        },
        message: options.message || `Sum of ${fields.join(', ')} must equal ${expectedSum}`,
    };
}
function createAsyncUniquenessValidator(model, field, options = {}) {
    return {
        validator: async (value, instance) => {
            if (!value)
                return true;
            const where = {};
            if (options.caseSensitive === false) {
                where[field] = { [sequelize_1.Op.iLike]: value };
            }
            else {
                where[field] = value;
            }
            if (options.scope) {
                const scopeConditions = typeof options.scope === 'function'
                    ? options.scope(instance)
                    : options.scope;
                Object.assign(where, scopeConditions);
            }
            if (instance.id) {
                where.id = { [sequelize_1.Op.ne]: instance.id };
            }
            const existing = await model.findOne({ where });
            return !existing;
        },
        message: options.message || `${field} must be unique`,
        async: true,
    };
}
function createAsyncExternalAPIValidator(apiValidator, options = {}) {
    return {
        validator: async (value, instance) => {
            if (!value)
                return true;
            const timeout = options.timeout || 5000;
            const retries = options.retries || 1;
            for (let attempt = 0; attempt < retries; attempt++) {
                try {
                    const result = await Promise.race([
                        apiValidator(value, instance),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
                    ]);
                    return result;
                }
                catch (error) {
                    if (attempt === retries - 1) {
                        console.error('External API validation failed:', error);
                        return false;
                    }
                }
            }
            return false;
        },
        message: options.message || 'External validation failed',
        async: true,
    };
}
function createAsyncReferenceValidator(model, options = {}) {
    return {
        validator: async (value) => {
            if (!value)
                return true;
            const where = { id: value };
            if (options.additionalConditions) {
                Object.assign(where, options.additionalConditions);
            }
            const findOptions = { where };
            if (options.respectParanoid === false) {
                findOptions.paranoid = false;
            }
            const record = await model.findOne(findOptions);
            return !!record;
        },
        message: options.message || 'Referenced record does not exist',
        async: true,
    };
}
function createAsyncRateLimitValidator(key, limit, window, options = {}) {
    const attemptCache = new Map();
    return {
        validator: async (value, instance) => {
            const cacheKey = `${key}:${value || instance[key]}`;
            const now = new Date();
            let attempts = attemptCache.get(cacheKey);
            if (!attempts || attempts.resetAt < now) {
                attempts = {
                    count: 1,
                    resetAt: new Date(now.getTime() + window),
                };
                attemptCache.set(cacheKey, attempts);
                return true;
            }
            if (attempts.count >= limit) {
                return false;
            }
            attempts.count++;
            return true;
        },
        message: options.message || `Rate limit exceeded (${limit} attempts per ${window}ms)`,
        async: true,
    };
}
function createPasswordStrengthValidator(requirements, options = {}) {
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
    return {
        validator: (value) => {
            if (!value)
                return false;
            if (requirements.minLength && value.length < requirements.minLength)
                return false;
            if (requirements.maxLength && value.length > requirements.maxLength)
                return false;
            if (requirements.requireUppercase && !/[A-Z]/.test(value))
                return false;
            if (requirements.requireLowercase && !/[a-z]/.test(value))
                return false;
            if (requirements.requireNumbers && !/\d/.test(value))
                return false;
            if (requirements.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value))
                return false;
            if (requirements.preventCommonPasswords) {
                const lower = value.toLowerCase();
                if (commonPasswords.some((pwd) => lower.includes(pwd)))
                    return false;
            }
            if (requirements.preventRepeating) {
                if (/(.)\1{2,}/.test(value))
                    return false;
            }
            return true;
        },
        message: options.message || 'Password does not meet strength requirements',
    };
}
function createMedicalRecordNumberValidator(format, options = {}) {
    return {
        validator: (value) => {
            if (!value)
                return false;
            if (options.facilityPrefix && !value.startsWith(options.facilityPrefix)) {
                return false;
            }
            if (format instanceof RegExp) {
                if (!format.test(value))
                    return false;
            }
            else {
                if (!format(value))
                    return false;
            }
            if (options.checkDigit) {
                const digits = value.replace(/\D/g, '');
                switch (options.checkDigit) {
                    case 'mod10': {
                        const sum = digits.split('').reduce((acc, d) => acc + parseInt(d), 0);
                        if (sum % 10 !== 0)
                            return false;
                        break;
                    }
                    case 'luhn': {
                        let sum = 0;
                        let isEven = false;
                        for (let i = digits.length - 1; i >= 0; i--) {
                            let digit = parseInt(digits[i]);
                            if (isEven) {
                                digit *= 2;
                                if (digit > 9)
                                    digit -= 9;
                            }
                            sum += digit;
                            isEven = !isEven;
                        }
                        if (sum % 10 !== 0)
                            return false;
                        break;
                    }
                }
            }
            return true;
        },
        message: options.message || 'Invalid medical record number',
    };
}
function createDrugNDCValidator(options = {}) {
    const formats = {
        '5-4-2': /^\d{5}-\d{4}-\d{2}$/,
        '5-3-2': /^\d{5}-\d{3}-\d{2}$/,
        '4-4-2': /^\d{4}-\d{4}-\d{2}$/,
    };
    return {
        validator: (value) => {
            if (!value)
                return false;
            const format = options.format || '5-4-2';
            if (!formats[format].test(value))
                return false;
            return true;
        },
        message: options.message || 'Invalid NDC code format',
    };
}
function createICD10Validator(options = {}) {
    const icd10Regex = /^[A-TV-Z]\d{2}(\.\d{1,4})?$/;
    return {
        validator: (value) => {
            if (!value)
                return false;
            const code = value.toUpperCase();
            if (!icd10Regex.test(code))
                return false;
            if (options.validateCategory) {
                const category = code.charAt(0);
                if (category === 'U' && !code.startsWith('U0'))
                    return false;
            }
            return true;
        },
        message: options.message || 'Invalid ICD-10 code',
    };
}
function createCPTValidator(options = {}) {
    const cptRegex = /^\d{5}(-\d{2})?$/;
    return {
        validator: (value) => {
            if (!value)
                return false;
            if (!cptRegex.test(value))
                return false;
            const baseCode = parseInt(value.substring(0, 5));
            if (options.validateRange) {
                if (baseCode < 1 || baseCode > 99999)
                    return false;
            }
            if (value.length > 5 && !options.allowModifiers)
                return false;
            return true;
        },
        message: options.message || 'Invalid CPT code',
    };
}
function applyValidationRules(model, validations) {
    for (const [field, rules] of Object.entries(validations)) {
        const attribute = model.rawAttributes[field];
        if (!attribute)
            continue;
        attribute.validate = attribute.validate || {};
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            const validatorName = `custom_${field}_${i}`;
            attribute.validate[validatorName] = async function (value) {
                try {
                    const isValid = await rule.validator(value, this);
                    if (!isValid) {
                        const message = typeof rule.message === 'function'
                            ? rule.message(value, this)
                            : rule.message;
                        throw new Error(message);
                    }
                }
                catch (error) {
                    throw error instanceof Error ? error : new Error(String(error));
                }
            };
        }
    }
    return model;
}
function applyCrossFieldValidations(model, validations) {
    model.addHook('beforeValidate', async (instance) => {
        const errors = [];
        for (const validation of validations) {
            const values = {};
            for (const field of validation.fields) {
                values[field] = instance[field];
            }
            try {
                const isValid = await validation.validator(values, instance);
                if (!isValid) {
                    errors.push(new sequelize_1.ValidationErrorItem(validation.message, 'Validation error', validation.fields[0], values[validation.fields[0]], instance, 'function', validation.fields[0], []));
                }
            }
            catch (error) {
                errors.push(new sequelize_1.ValidationErrorItem(error.message, 'Validation error', validation.fields[0], values[validation.fields[0]], instance, 'function', validation.fields[0], []));
            }
        }
        if (errors.length > 0) {
            throw new sequelize_1.ValidationError('Cross-field validation failed', errors);
        }
    });
    return model;
}
function createCustomValidationError(field, message, value, instance, context) {
    const error = new sequelize_1.ValidationErrorItem(message, 'Validation error', field, value, instance, 'function', field, []);
    if (context) {
        error.context = context;
    }
    return error;
}
async function validateInstance(instance, options = {}) {
    try {
        await instance.validate({ fields: options.fields, hooks: !options.skipHooks });
        return { valid: true, errors: [] };
    }
    catch (error) {
        if (error instanceof sequelize_1.ValidationError) {
            return { valid: false, errors: error.errors };
        }
        throw error;
    }
}
function createValidationSummary(errors, options = {}) {
    if (options.groupByField) {
        const grouped = {};
        for (const error of errors) {
            const field = error.path || 'general';
            if (!grouped[field]) {
                grouped[field] = [];
            }
            grouped[field].push(error.message);
        }
        if (options.format === 'json') {
            return grouped;
        }
        if (options.format === 'html') {
            let html = '<ul class="validation-errors">';
            for (const [field, messages] of Object.entries(grouped)) {
                html += `<li><strong>${field}:</strong><ul>`;
                for (const message of messages) {
                    html += `<li>${message}</li>`;
                }
                html += '</ul></li>';
            }
            html += '</ul>';
            return html;
        }
        let text = '';
        for (const [field, messages] of Object.entries(grouped)) {
            text += `${field}:\n`;
            for (const message of messages) {
                text += `  - ${message}\n`;
            }
        }
        return text;
    }
    if (options.format === 'json') {
        return errors.map((e) => ({
            field: e.path,
            message: e.message,
            value: options.includeValues ? e.value : undefined,
        }));
    }
    return errors.map((e) => e.message).join('\n');
}
//# sourceMappingURL=model-validation-composites.service.js.map