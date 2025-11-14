"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreatDetectionService = exports.EnhancedSecurityService = exports.EnhancedThreatDetectionService = exports.PIIDetectionService = exports.EnhancedAuditService = exports.EnhancedEncryptionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const security_interfaces_1 = require("./interfaces/security.interfaces");
const encryption_service_1 = require("./services/encryption.service");
const audit_service_1 = require("./services/audit.service");
const pii_detection_service_1 = require("./services/pii-detection.service");
const enhanced_threat_detection_service_1 = require("./services/enhanced-threat-detection.service");
const base_1 = require("../../common/base");
__exportStar(require("./interfaces/security.interfaces"), exports);
var encryption_service_2 = require("./services/encryption.service");
Object.defineProperty(exports, "EnhancedEncryptionService", { enumerable: true, get: function () { return encryption_service_2.EnhancedEncryptionService; } });
var audit_service_2 = require("./services/audit.service");
Object.defineProperty(exports, "EnhancedAuditService", { enumerable: true, get: function () { return audit_service_2.EnhancedAuditService; } });
var pii_detection_service_2 = require("./services/pii-detection.service");
Object.defineProperty(exports, "PIIDetectionService", { enumerable: true, get: function () { return pii_detection_service_2.PIIDetectionService; } });
var enhanced_threat_detection_service_2 = require("./services/enhanced-threat-detection.service");
Object.defineProperty(exports, "EnhancedThreatDetectionService", { enumerable: true, get: function () { return enhanced_threat_detection_service_2.EnhancedThreatDetectionService; } });
let EnhancedSecurityService = class EnhancedSecurityService extends base_1.BaseService {
    configService;
    encryptionService;
    auditService;
    threatDetection;
    piiDetection;
    constructor(configService, encryptionService, auditService, threatDetection, piiDetection) {
        super('EnhancedSecurityService');
        this.configService = configService;
        this.encryptionService = encryptionService;
        this.auditService = auditService;
        this.threatDetection = threatDetection;
        this.piiDetection = piiDetection;
    }
    async securityScan(data, context) {
        try {
            const piiDetected = this.piiDetection.detectPII(data);
            const threatsDetected = [];
            for (const [field, value] of Object.entries(data)) {
                if (typeof value === 'string') {
                    if (this.containsSqlInjection(value)) {
                        const threat = await this.threatDetection.detectThreat(security_interfaces_1.ThreatType.SQL_INJECTION, context.ipAddress, field, 'Potential SQL injection detected in input', { field, value: value.substring(0, 100) });
                        threatsDetected.push(threat);
                    }
                    if (this.containsXSS(value)) {
                        const threat = await this.threatDetection.detectThreat(security_interfaces_1.ThreatType.XSS_ATTEMPT, context.ipAddress, field, 'Potential XSS attempt detected in input', { field, value: value.substring(0, 100) });
                        threatsDetected.push(threat);
                    }
                }
            }
            await this.auditService.logEvent(context.action, 'data_security_scan', threatsDetected.length > 0 ? 'FAILURE' : 'SUCCESS', {
                userId: context.userId,
                ipAddress: context.ipAddress,
                userAgent: 'security-scanner',
                metadata: {
                    piiFields: piiDetected.fields.length,
                    threatsDetected: threatsDetected.length,
                },
            }, security_interfaces_1.AuditCategory.SECURITY_EVENT, threatsDetected.length > 0 ? 'HIGH' : 'LOW');
            return {
                piiDetected,
                threatsDetected,
                auditLogged: true,
            };
        }
        catch (error) {
            this.logError('Security scan failed:', error);
            throw error;
        }
    }
    async encryptSensitiveData(data, masterKey) {
        const piiResult = this.piiDetection.detectPII(data);
        const encryptedData = { ...data };
        const encryptionKeys = {};
        for (const piiField of piiResult.fields) {
            if (encryptedData[piiField.field]) {
                const encrypted = await this.encryptionService.encrypt(encryptedData[piiField.field], masterKey);
                encryptedData[piiField.field] = encrypted.encrypted.toString('base64');
                encryptionKeys[piiField.field] = JSON.stringify({
                    iv: encrypted.iv.toString('base64'),
                    tag: encrypted.tag.toString('base64'),
                    salt: encrypted.salt?.toString('base64'),
                });
            }
        }
        return { encryptedData, encryptionKeys };
    }
    containsSqlInjection(value) {
        const sqlPatterns = [
            /('|(\\')|(;)|(\|)|(\*)|(%)|(\-\-)|(\+)|(\|\|)/i,
            /(union|select|insert|update|delete|drop|create|alter|exec|execute)/i,
            /(script|javascript|vbscript|onload|onerror|onclick)/i,
        ];
        return sqlPatterns.some((pattern) => pattern.test(value));
    }
    containsXSS(value) {
        const xssPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<iframe\b/gi,
            /<embed\b/gi,
            /<object\b/gi,
        ];
        return xssPatterns.some((pattern) => pattern.test(value));
    }
};
exports.EnhancedSecurityService = EnhancedSecurityService;
exports.EnhancedSecurityService = EnhancedSecurityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        encryption_service_1.EnhancedEncryptionService,
        audit_service_1.EnhancedAuditService,
        enhanced_threat_detection_service_1.EnhancedThreatDetectionService,
        pii_detection_service_1.PIIDetectionService])
], EnhancedSecurityService);
//# sourceMappingURL=enhanced-security.service.js.map