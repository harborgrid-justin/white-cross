"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseValidationService = exports.VALIDATION_METADATA = void 0;
exports.ValidateInput = ValidateInput;
exports.ValidateController = ValidateController;
exports.CustomValidation = CustomValidation;
exports.SanitizeInput = SanitizeInput;
exports.ValidatePHI = ValidatePHI;
const common_1 = require("@nestjs/common");
exports.VALIDATION_METADATA = 'enterprise:validation';
let EnterpriseValidationService = class EnterpriseValidationService {
    async validateData(data, schema, options = {}) {
        const result = {
            isValid: true,
            errors: [],
            warnings: []
        };
        try {
            if (!data) {
                result.isValid = false;
                result.errors.push('Data is required');
                return result;
            }
            const securityResult = this.validateSecurity(data);
            result.errors.push(...securityResult.errors);
            result.warnings.push(...securityResult.warnings);
            if (schema) {
                const schemaResult = await this.validateAgainstSchema(data, schema);
                result.errors.push(...schemaResult.errors);
                result.warnings.push(...schemaResult.warnings);
                result.sanitizedData = schemaResult.sanitizedData;
            }
            result.isValid = result.errors.length === 0;
            return result;
        }
        catch (error) {
            result.isValid = false;
            result.errors.push(`Validation error: ${error.message}`);
            return result;
        }
    }
    validateSecurity(data) {
        const errors = [];
        const warnings = [];
        const validateObject = (obj, path = '') => {
            if (typeof obj === 'string') {
                if (/<script|javascript:|on\w+=/i.test(obj)) {
                    errors.push(`Potential XSS detected in ${path}`);
                }
                if (/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/i.test(obj)) {
                    warnings.push(`Potential SQL injection pattern in ${path}`);
                }
                if (obj.length > 10000) {
                    warnings.push(`Unusually long string in ${path} (${obj.length} characters)`);
                }
            }
            else if (typeof obj === 'object' && obj !== null) {
                for (const [key, value] of Object.entries(obj)) {
                    const currentPath = path ? `${path}.${key}` : key;
                    validateObject(value, currentPath);
                }
            }
        };
        validateObject(data);
        return { errors, warnings };
    }
    async validateAgainstSchema(data, schema) {
        const result = {
            isValid: true,
            errors: [],
            warnings: [],
            sanitizedData: data
        };
        if (schema.type === 'object' && typeof data !== 'object') {
            result.errors.push('Expected object type');
            result.isValid = false;
        }
        return result;
    }
    sanitizeData(data) {
        if (typeof data === 'string') {
            return data.replace(/<[^>]*>/g, '').trim();
        }
        else if (Array.isArray(data)) {
            return data.map(item => this.sanitizeData(item));
        }
        else if (typeof data === 'object' && data !== null) {
            const sanitized = {};
            for (const [key, value] of Object.entries(data)) {
                sanitized[key] = this.sanitizeData(value);
            }
            return sanitized;
        }
        return data;
    }
};
exports.EnterpriseValidationService = EnterpriseValidationService;
exports.EnterpriseValidationService = EnterpriseValidationService = __decorate([
    (0, common_1.Injectable)()
], EnterpriseValidationService);
function ValidateInput(options = {}) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const methodName = `${target.constructor.name}.${propertyKey}`;
        descriptor.value = async function (...args) {
            const validationService = this.validationService;
            if (options.skipValidation && options.skipValidation({})) {
                return await originalMethod.apply(this, args);
            }
            if (validationService) {
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    if (arg && typeof arg === 'object') {
                        const validationResult = await validationService.validateData(arg, null, options);
                        if (!validationResult.isValid) {
                            const errorMessage = options.errorMessages?.[`arg${i}`] ||
                                `Validation failed for argument ${i}: ${validationResult.errors.join(', ')}`;
                            throw new common_1.BadRequestException(errorMessage);
                        }
                        if (validationResult.sanitizedData) {
                            args[i] = validationResult.sanitizedData;
                        }
                    }
                }
            }
            try {
                return await originalMethod.apply(this, args);
            }
            catch (error) {
                if (error instanceof common_1.BadRequestException) {
                    throw error;
                }
                console.warn(`Method execution error in ${methodName}:`, error);
                throw error;
            }
        };
        (0, common_1.SetMetadata)(exports.VALIDATION_METADATA, options)(target, propertyKey, descriptor);
    };
}
function ValidateController(options = {}) {
    return function (target) {
        (0, common_1.SetMetadata)(exports.VALIDATION_METADATA, { controller: true, ...options })(target);
    };
}
function CustomValidation(rule, errorMessage) {
    return function (target, propertyKey, parameterIndex) {
        const existingValidations = Reflect.getMetadata('enterprise:custom-validations', target, propertyKey) || [];
        existingValidations[parameterIndex] = { rule, errorMessage };
        Reflect.defineMetadata('enterprise:custom-validations', existingValidations, target, propertyKey);
    };
}
function SanitizeInput(fields) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const validationService = this.validationService;
            if (validationService) {
                const sanitizedArgs = args.map(arg => {
                    if (typeof arg === 'object' && arg !== null) {
                        if (fields) {
                            const sanitized = { ...arg };
                            for (const field of fields) {
                                if (sanitized[field]) {
                                    sanitized[field] = validationService.sanitizeData(sanitized[field]);
                                }
                            }
                            return sanitized;
                        }
                        else {
                            return validationService.sanitizeData(arg);
                        }
                    }
                    return arg;
                });
                return await originalMethod.apply(this, sanitizedArgs);
            }
            return await originalMethod.apply(this, args);
        };
    };
}
function ValidatePHI(options = {}) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const methodName = `${target.constructor.name}.${propertyKey}`;
        descriptor.value = async function (...args) {
            if (!options.allowPHI) {
                for (const arg of args) {
                    if (this.containsPHI && this.containsPHI(arg)) {
                        throw new common_1.BadRequestException('PHI data not allowed in this context');
                    }
                }
            }
            const result = await originalMethod.apply(this, args);
            if (options.maskFields && result && typeof result === 'object') {
                const maskedResult = { ...result };
                for (const field of options.maskFields) {
                    if (maskedResult[field]) {
                        maskedResult[field] = '***MASKED***';
                    }
                }
                return maskedResult;
            }
            return result;
        };
        (0, common_1.SetMetadata)('enterprise:phi-validation', options)(target, propertyKey, descriptor);
    };
}
//# sourceMappingURL=validation.decorators.js.map