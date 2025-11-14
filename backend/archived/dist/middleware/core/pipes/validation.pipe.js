"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HealthcareValidationPipe_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthcareValidationPipe = void 0;
exports.createHealthcareValidationPipe = createHealthcareValidationPipe;
exports.createAdminValidationPipe = createAdminValidationPipe;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const validation_types_1 = require("../types/validation.types");
let HealthcareValidationPipe = HealthcareValidationPipe_1 = class HealthcareValidationPipe {
    logger = new common_1.Logger(HealthcareValidationPipe_1.name);
    config;
    constructor(config) {
        this.config = {
            enableHipaaCompliance: true,
            enableSecurityValidation: true,
            logValidationErrors: true,
            maxFieldLength: 1000,
            allowedFileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
            ...validation_types_1.VALIDATION_CONFIGS.healthcare,
            ...config,
        };
    }
    async transform(value, { metatype }) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = (0, class_transformer_1.plainToClass)(metatype, value);
        const errors = await (0, class_validator_1.validate)(object, {
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        });
        if (errors.length > 0) {
            const validationErrors = this.formatValidationErrors(errors);
            if (this.config.logValidationErrors) {
                this.logger.warn('Validation failed', {
                    errors: validationErrors,
                });
            }
            throw new common_1.BadRequestException({
                message: 'Validation failed',
                errors: validationErrors,
            });
        }
        if (this.config.enableHipaaCompliance) {
            this.validateHealthcareData(object);
        }
        if (this.config.enableSecurityValidation) {
            this.validateSecurity(object);
        }
        return object;
    }
    toValidate(metatype) {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
    formatValidationErrors(errors) {
        return errors.flatMap((error) => {
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
    }
    validateHealthcareData(data) {
        const errors = [];
        if (data.medicalRecordNumber &&
            !validation_types_1.HEALTHCARE_PATTERNS.MRN.test(data.medicalRecordNumber)) {
            errors.push({
                field: 'medicalRecordNumber',
                message: 'Invalid medical record number format',
                value: data.medicalRecordNumber,
            });
        }
        if (data.providerId && !validation_types_1.HEALTHCARE_PATTERNS.NPI.test(data.providerId)) {
            errors.push({
                field: 'providerId',
                message: 'Invalid NPI format (must be 10 digits)',
                value: data.providerId,
            });
        }
        if (data.icdCode && !validation_types_1.HEALTHCARE_PATTERNS.ICD10.test(data.icdCode)) {
            errors.push({
                field: 'icdCode',
                message: 'Invalid ICD-10 code format',
                value: data.icdCode,
            });
        }
        if (data.phone && !validation_types_1.HEALTHCARE_PATTERNS.PHONE.test(data.phone)) {
            errors.push({
                field: 'phone',
                message: 'Invalid phone number format',
                value: data.phone,
            });
        }
        if (data.dosage && !validation_types_1.HEALTHCARE_PATTERNS.DOSAGE.test(data.dosage)) {
            errors.push({
                field: 'dosage',
                message: 'Invalid medication dosage format',
                value: data.dosage,
            });
        }
        if (errors.length > 0) {
            throw new common_1.BadRequestException({
                message: 'Healthcare data validation failed',
                errors,
            });
        }
    }
    validateSecurity(data) {
        const errors = [];
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string' &&
                value.length > this.config.maxFieldLength) {
                errors.push({
                    field: key,
                    message: `Field exceeds maximum length of ${this.config.maxFieldLength} characters`,
                    value: value.substring(0, 50) + '...',
                });
            }
        }
        const xssPattern = /<script|javascript:|onerror=|onclick=/i;
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string' && xssPattern.test(value)) {
                errors.push({
                    field: key,
                    message: 'Potential XSS attack detected',
                    constraint: 'security',
                });
            }
        }
        const sqlPattern = /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b)/i;
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string' && sqlPattern.test(value)) {
                errors.push({
                    field: key,
                    message: 'Potential SQL injection detected',
                    constraint: 'security',
                });
            }
        }
        if (errors.length > 0) {
            if (this.config.logValidationErrors) {
                this.logger.error('Security validation failed', { errors });
            }
            throw new common_1.BadRequestException({
                message: 'Security validation failed',
                errors,
            });
        }
    }
};
exports.HealthcareValidationPipe = HealthcareValidationPipe;
exports.HealthcareValidationPipe = HealthcareValidationPipe = HealthcareValidationPipe_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], HealthcareValidationPipe);
function createHealthcareValidationPipe() {
    return new HealthcareValidationPipe(validation_types_1.VALIDATION_CONFIGS.healthcare);
}
function createAdminValidationPipe() {
    return new HealthcareValidationPipe(validation_types_1.VALIDATION_CONFIGS.admin);
}
//# sourceMappingURL=validation.pipe.js.map