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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHealthcareService = void 0;
const common_1 = require("@nestjs/common");
const base_crud_service_1 = require("./base-crud.service");
let BaseHealthcareService = class BaseHealthcareService extends base_crud_service_1.BaseCrudService {
    PHI_FIELDS = [
        'firstName', 'lastName', 'dateOfBirth', 'socialSecurityNumber',
        'medicalRecordNumber', 'diagnosis', 'medication', 'allergies',
        'address', 'phoneNumber', 'email', 'emergencyContact'
    ];
    constructor(context) {
        super(context);
    }
    async createHealthcareEntity(data, accessContext, options = {}) {
        return this.executeWithLogging('create healthcare entity', async () => {
            const validation = this.validateHealthcareData(data);
            if (!validation.isValid) {
                throw new common_1.ForbiddenException(`Healthcare validation failed: ${validation.errors.join(', ')}`);
            }
            this.logPHIAccess('CREATE', accessContext, data);
            const result = await this.createEntity(data, options);
            this.logInfo(`PHI Created: Healthcare entity ${this.model.name} created by user ${accessContext.userId}`, 'PHI_ACCESS');
            return result;
        });
    }
    async findHealthcareEntityById(id, accessContext, options = {}) {
        return this.executeWithLogging('find healthcare entity', async () => {
            this.logPHIAccess('READ', accessContext, { entityId: id });
            const result = await this.findEntityById(id, options);
            if (result.success && result.data) {
                this.logInfo(`PHI Accessed: Healthcare entity ${this.model.name} ID ${id} accessed by user ${accessContext.userId}`, 'PHI_ACCESS');
            }
            return result;
        });
    }
    async updateHealthcareEntity(id, updates, accessContext, options = {}) {
        return this.executeWithLogging('update healthcare entity', async () => {
            const validation = this.validateHealthcareData(updates);
            if (!validation.isValid) {
                throw new common_1.ForbiddenException(`Healthcare validation failed: ${validation.errors.join(', ')}`);
            }
            this.logPHIAccess('UPDATE', accessContext, { entityId: id, updates });
            const result = await this.updateEntityById(id, updates, options);
            if (result.success) {
                this.logInfo(`PHI Modified: Healthcare entity ${this.model.name} ID ${id} updated by user ${accessContext.userId}`, 'PHI_ACCESS');
            }
            return result;
        });
    }
    async deleteHealthcareEntity(id, accessContext) {
        return this.executeWithLogging('delete healthcare entity', async () => {
            const result = await this.deleteEntityById(id, true);
            if (result.success) {
                this.logPHIAccess('DELETE', accessContext, { entityId: id });
                this.logInfo(`PHI Deleted: Healthcare entity ${this.model.name} ID ${id} soft-deleted by user ${accessContext.userId}`, 'PHI_ACCESS');
            }
            return result;
        });
    }
    validateHealthcareData(data) {
        const result = {
            isValid: true,
            errors: [],
            warnings: []
        };
        if (!data || typeof data !== 'object') {
            result.isValid = false;
            result.errors.push('Invalid healthcare data provided');
            return result;
        }
        if ('dateOfBirth' in data && data.dateOfBirth) {
            const dob = new Date(data.dateOfBirth);
            if (isNaN(dob.getTime()) || dob > new Date()) {
                result.errors.push('Invalid date of birth');
                result.isValid = false;
            }
        }
        if ('phoneNumber' in data && data.phoneNumber) {
            const phoneRegex = /^\+?[1-9]\d{1,14}$/;
            if (!phoneRegex.test(data.phoneNumber)) {
                result.warnings.push('Phone number format may be invalid');
            }
        }
        if ('email' in data && data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                result.errors.push('Invalid email address format');
                result.isValid = false;
            }
        }
        return result;
    }
    logPHIAccess(action, context, data) {
        const sanitizedData = this.sanitizePHIForLogging(data);
        this.logInfo(`PHI_AUDIT: ${action} ${this.model.name} by user ${context.userId} (${context.userRole}) - Reason: ${context.accessReason}`, 'PHI_AUDIT');
        this.logDebug(`PHI Access Details: ${JSON.stringify({
            action,
            entity: this.model.name,
            userId: context.userId,
            userRole: context.userRole,
            accessReason: context.accessReason,
            timestamp: context.timestamp,
            dataFields: sanitizedData ? Object.keys(sanitizedData) : [],
        })}`, 'PHI_AUDIT');
    }
    sanitizePHIForLogging(data) {
        if (!data || typeof data !== 'object') {
            return null;
        }
        const sanitized = {};
        Object.keys(data).forEach(key => {
            if (this.PHI_FIELDS.includes(key)) {
                sanitized[key] = '[PHI_REDACTED]';
            }
            else {
                sanitized[key] = data[key];
            }
        });
        return sanitized;
    }
    validateHealthcareAccess(context, requiredRole) {
        const allowedRoles = ['nurse', 'admin', 'healthcare_provider', requiredRole].filter(Boolean);
        if (!allowedRoles.includes(context.userRole.toLowerCase())) {
            throw new common_1.ForbiddenException(`User role ${context.userRole} does not have permission to access healthcare data`);
        }
        return true;
    }
    generateComplianceMetadata(operation) {
        return {
            timestamp: new Date().toISOString(),
            operation,
            service: this.constructor.name,
            entity: this.model.name,
            complianceVersion: '1.0',
            hipaaCompliant: true
        };
    }
};
exports.BaseHealthcareService = BaseHealthcareService;
exports.BaseHealthcareService = BaseHealthcareService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], BaseHealthcareService);
//# sourceMappingURL=base-healthcare.service.js.map