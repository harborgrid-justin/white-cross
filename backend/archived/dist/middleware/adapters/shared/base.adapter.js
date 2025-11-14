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
exports.RequestValidationUtils = exports.ResponseUtils = exports.HealthcareMiddlewareUtils = exports.BaseFrameworkAdapter = void 0;
const common_1 = require("@nestjs/common");
const middleware_types_1 = require("../../utils/types/middleware.types");
let BaseFrameworkAdapter = class BaseFrameworkAdapter {
    frameworkName;
    constructor(frameworkName) {
        this.frameworkName = frameworkName;
    }
    createContext(correlationId) {
        return {
            startTime: Date.now(),
            correlationId: correlationId || this.generateCorrelationId(),
            framework: this.frameworkName,
            environment: process.env.NODE_ENV || 'development',
            metadata: {},
        };
    }
    generateCorrelationId() {
        return `${this.frameworkName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    validateMiddlewareConfig(config) {
        return typeof config === 'object' && config !== null;
    }
};
exports.BaseFrameworkAdapter = BaseFrameworkAdapter;
exports.BaseFrameworkAdapter = BaseFrameworkAdapter = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], BaseFrameworkAdapter);
let HealthcareMiddlewareUtils = class HealthcareMiddlewareUtils {
    validateHealthcareUser(user) {
        return !!(user &&
            typeof user.userId === 'string' &&
            typeof user.email === 'string' &&
            Object.values(middleware_types_1.UserRole).includes(user.role));
    }
    hasPermission(user, requiredPermission) {
        if (!user.permissions) {
            return false;
        }
        return user.permissions.includes(requiredPermission);
    }
    hasAnyPermission(user, requiredPermissions) {
        if (!user.permissions) {
            return false;
        }
        return requiredPermissions.some((permission) => user.permissions.includes(permission));
    }
    getRoleLevel(role) {
        const levels = {
            [middleware_types_1.UserRole.STUDENT]: 1,
            [middleware_types_1.UserRole.SCHOOL_NURSE]: 2,
            [middleware_types_1.UserRole.ADMINISTRATOR]: 3,
            [middleware_types_1.UserRole.SYSTEM_ADMIN]: 4,
        };
        return levels[role] || 0;
    }
    hasRoleLevel(user, minimumRole) {
        return this.getRoleLevel(user.role) >= this.getRoleLevel(minimumRole);
    }
    sanitizeHealthcareContext(context) {
        return {
            facilityId: context.facilityId,
            accessType: context.accessType,
            auditRequired: context.auditRequired,
            phiAccess: context.phiAccess,
            complianceFlags: context.complianceFlags,
        };
    }
    detectPHI(data) {
        if (!data || typeof data !== 'object') {
            return false;
        }
        const phiFields = [
            'ssn',
            'socialSecurityNumber',
            'medicalRecordNumber',
            'mrn',
            'dateOfBirth',
            'dob',
            'diagnosis',
            'medication',
            'treatment',
            'symptoms',
            'allergies',
            'immunizations',
            'visitNotes',
        ];
        const dataString = JSON.stringify(data).toLowerCase();
        const hasPHIFields = phiFields.some((field) => dataString.includes(field.toLowerCase()));
        const ssnPattern = /\d{3}-?\d{2}-?\d{4}/;
        const mrnPattern = /mrn[:\s]*[a-z0-9]+/i;
        const dobPattern = /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/;
        const hasPatterns = ssnPattern.test(dataString) ||
            mrnPattern.test(dataString) ||
            dobPattern.test(dataString);
        return hasPHIFields || hasPatterns;
    }
    createEmergencyContext(providerId, reason, patientId) {
        return {
            providerId,
            patientId,
            accessType: 'emergency',
            auditRequired: true,
            phiAccess: true,
            complianceFlags: ['emergency_access', 'audit_required', reason],
        };
    }
    createBreakGlassContext(providerId, justification, patientId, facilityId) {
        return {
            patientId,
            facilityId,
            providerId,
            accessType: 'break_glass',
            auditRequired: true,
            phiAccess: true,
            complianceFlags: [
                'break_glass_access',
                'audit_required',
                'high_priority_audit',
                `justification:${justification}`,
            ],
        };
    }
    canAccessFacility(user, facilityId) {
        if (user.role === middleware_types_1.UserRole.SYSTEM_ADMIN) {
            return true;
        }
        return user.facilityId === facilityId;
    }
    getAllowedActions(role) {
        const studentPermissions = [
            middleware_types_1.Permission.VIEW_OWN_HEALTH_RECORDS,
            middleware_types_1.Permission.UPDATE_OWN_EMERGENCY_CONTACTS,
        ];
        const nursePermissions = [
            middleware_types_1.Permission.VIEW_STUDENT_HEALTH_RECORDS,
            middleware_types_1.Permission.CREATE_HEALTH_RECORDS,
            middleware_types_1.Permission.UPDATE_HEALTH_RECORDS,
            middleware_types_1.Permission.ADMINISTER_MEDICATION,
            middleware_types_1.Permission.VIEW_IMMUNIZATION_RECORDS,
            middleware_types_1.Permission.CREATE_INCIDENT_REPORTS,
        ];
        const adminPermissions = [
            middleware_types_1.Permission.MANAGE_USERS,
            middleware_types_1.Permission.VIEW_REPORTS,
            middleware_types_1.Permission.EXPORT_DATA,
            middleware_types_1.Permission.MANAGE_FACILITY_SETTINGS,
            ...nursePermissions,
        ];
        const systemAdminPermissions = [
            middleware_types_1.Permission.SYSTEM_ADMINISTRATION,
            middleware_types_1.Permission.AUDIT_LOGS,
            middleware_types_1.Permission.EMERGENCY_ACCESS,
            middleware_types_1.Permission.BREAK_GLASS_ACCESS,
            ...adminPermissions,
        ];
        const rolePermissions = {
            [middleware_types_1.UserRole.STUDENT]: studentPermissions,
            [middleware_types_1.UserRole.SCHOOL_NURSE]: nursePermissions,
            [middleware_types_1.UserRole.ADMINISTRATOR]: adminPermissions,
            [middleware_types_1.UserRole.SYSTEM_ADMIN]: systemAdminPermissions,
        };
        return rolePermissions[role] || [];
    }
};
exports.HealthcareMiddlewareUtils = HealthcareMiddlewareUtils;
exports.HealthcareMiddlewareUtils = HealthcareMiddlewareUtils = __decorate([
    (0, common_1.Injectable)()
], HealthcareMiddlewareUtils);
let ResponseUtils = class ResponseUtils {
    createErrorResponse(error, statusCode = 500, includeStack = false) {
        const response = {
            error: true,
            message: error.message,
            statusCode,
            timestamp: new Date().toISOString(),
        };
        if (includeStack && process.env.NODE_ENV === 'development') {
            response.stack = error.stack;
        }
        return response;
    }
    createSuccessResponse(data, message = 'Success', statusCode = 200) {
        return {
            success: true,
            message,
            data,
            statusCode,
            timestamp: new Date().toISOString(),
        };
    }
    sanitizeForHIPAA(data) {
        if (!data || typeof data !== 'object') {
            return data;
        }
        const sensitiveFields = [
            'ssn',
            'socialSecurityNumber',
            'password',
            'token',
            'creditCard',
            'bankAccount',
            'medicalRecordNumber',
        ];
        if (Array.isArray(data)) {
            return data.map((item) => this.sanitizeForHIPAA(item));
        }
        const sanitized = { ...data };
        sensitiveFields.forEach((field) => {
            if (sanitized[field]) {
                delete sanitized[field];
            }
        });
        Object.keys(sanitized).forEach((key) => {
            if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
                sanitized[key] = this.sanitizeForHIPAA(sanitized[key]);
            }
        });
        return sanitized;
    }
    addCorrelationId(response, correlationId) {
        if (typeof response === 'object' && response !== null) {
            response.correlationId = correlationId;
        }
        return response;
    }
};
exports.ResponseUtils = ResponseUtils;
exports.ResponseUtils = ResponseUtils = __decorate([
    (0, common_1.Injectable)()
], ResponseUtils);
let RequestValidationUtils = class RequestValidationUtils {
    validateHealthcareHeaders(headers) {
        const requiredHeaders = ['x-facility-id'];
        const missing = requiredHeaders.filter((header) => !headers[header] && !headers[header.toLowerCase()]);
        return {
            valid: missing.length === 0,
            missing,
        };
    }
    validateRequestSize(body, maxSize = 10 * 1024 * 1024) {
        if (!body)
            return true;
        const size = JSON.stringify(body).length;
        return size <= maxSize;
    }
    validateFileUpload(file, allowedTypes = ['pdf', 'jpg', 'png', 'doc', 'docx'], maxSize = 5 * 1024 * 1024) {
        if (!file) {
            return { valid: false, error: 'No file provided' };
        }
        if (file.size > maxSize) {
            return { valid: false, error: `File size exceeds ${maxSize} bytes` };
        }
        const fileExtension = file.name?.split('.').pop()?.toLowerCase();
        if (!fileExtension || !allowedTypes.includes(fileExtension)) {
            return {
                valid: false,
                error: `File type not allowed. Allowed: ${allowedTypes.join(', ')}`,
            };
        }
        return { valid: true };
    }
};
exports.RequestValidationUtils = RequestValidationUtils;
exports.RequestValidationUtils = RequestValidationUtils = __decorate([
    (0, common_1.Injectable)()
], RequestValidationUtils);
//# sourceMappingURL=base.adapter.js.map