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
exports.AUDIT_CONSTANTS = exports.AuditUtilsService = void 0;
const common_1 = require("@nestjs/common");
const phi_access_type_enum_1 = require("../enums/phi-access-type.enum");
const phi_data_category_enum_1 = require("../enums/phi-data-category.enum");
const base_1 = require("../../../common/base");
let AuditUtilsService = class AuditUtilsService extends base_1.BaseService {
    constructor() {
        super('AuditUtilsService');
    }
    validateAuditEntry(entry) {
        const errors = [];
        if (!entry.action) {
            errors.push('Action is required');
        }
        if (!entry.entityType) {
            errors.push('Entity type is required');
        }
        if (entry.ipAddress && !this.isValidIPAddress(entry.ipAddress)) {
            errors.push('Invalid IP address format');
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    validatePHIEntry(entry) {
        const errors = [];
        const baseValidation = this.validateAuditEntry(entry);
        errors.push(...baseValidation.errors);
        if (!entry.studentId) {
            errors.push('Student ID is required for PHI access');
        }
        if (!entry.accessType) {
            errors.push('Access type is required for PHI access');
        }
        else if (!Object.values(phi_access_type_enum_1.PHIAccessType).includes(entry.accessType)) {
            errors.push('Invalid PHI access type');
        }
        if (!entry.dataCategory) {
            errors.push('Data category is required for PHI access');
        }
        else if (!Object.values(phi_data_category_enum_1.PHIDataCategory).includes(entry.dataCategory)) {
            errors.push('Invalid PHI data category');
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    isValidIPAddress(ip) {
        const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return ipv4Regex.test(ip) || ipv6Regex.test(ip);
    }
    extractIPAddress(req) {
        if (typeof req === 'string') {
            return req;
        }
        return (req?.ip ||
            req?.connection?.remoteAddress ||
            req?.socket?.remoteAddress ||
            req?.headers?.['x-forwarded-for']?.split(',')[0] ||
            req?.headers?.['x-real-ip'] ||
            undefined);
    }
    extractUserAgent(req) {
        if (typeof req === 'string') {
            return req;
        }
        return req?.headers?.['user-agent'] || req?.userAgent || undefined;
    }
    sanitizeAuditData(data) {
        const sanitized = { ...data };
        if ('password' in sanitized) {
            delete sanitized.password;
        }
        if ('token' in sanitized && typeof sanitized.token === 'string') {
            sanitized.token = '***REDACTED***';
        }
        if ('apiKey' in sanitized && typeof sanitized.apiKey === 'string') {
            sanitized.apiKey = '***REDACTED***';
        }
        Object.keys(sanitized).forEach((key) => {
            if (typeof sanitized[key] === 'string' && sanitized[key].length > 1000) {
                sanitized[key] = sanitized[key].substring(0, 1000) + '... [TRUNCATED]';
            }
        });
        return sanitized;
    }
};
exports.AuditUtilsService = AuditUtilsService;
exports.AuditUtilsService = AuditUtilsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AuditUtilsService);
exports.AUDIT_CONSTANTS = {
    MAX_QUERY_LIMIT: 1000,
    DEFAULT_PAGE_LIMIT: 50,
    PHI_ACCESS_TYPES: Object.values(phi_access_type_enum_1.PHIAccessType),
    PHI_DATA_CATEGORIES: Object.values(phi_data_category_enum_1.PHIDataCategory),
    RETENTION_PERIODS: {
        AUDIT_LOGS: 2555,
        PHI_ACCESS_LOGS: 2555,
    },
    BUSINESS_HOURS: {
        START: 6,
        END: 20,
    },
};
//# sourceMappingURL=audit-utils.service.js.map