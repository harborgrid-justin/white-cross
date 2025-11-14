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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionSecurityService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
const events_1 = require("events");
const logger_service_1 = require("../../common/logging/logger.service");
let ProductionSecurityService = class ProductionSecurityService extends events_1.EventEmitter {
    logger;
    keyStore = new Map();
    encryptedColumns = new Map();
    auditLogs = [];
    securityPolicies = new Map();
    threats = [];
    healthcarePiiPatterns = new Map();
    constructor(logger) {
        super();
        this.logger = logger;
        this.initializeHealthcarePIIPatterns();
        this.createDefaultSecurityPolicies();
        this.startSecurityMonitoring();
    }
    async encryptHealthcareColumn(sequelize, table, column, keyId, phiLevel = 'medium', hipaaRequired = true) {
        try {
            const key = this.keyStore.get(keyId);
            if (!key || key.status !== 'active') {
                throw new Error(`Invalid or inactive encryption key: ${keyId}`);
            }
            if (hipaaRequired && !key.hipaaCompliant) {
                throw new Error(`Key ${keyId} is not HIPAA compliant`);
            }
            const encryptedCol = {
                tableName: table,
                columnName: column,
                algorithm: key.algorithm,
                keyId,
                encryptedAt: new Date(),
                checksum: this.generateChecksum(`${table}.${column}`),
                phiLevel,
                hipaaRequired,
            };
            const encryptQuery = `
        UPDATE ${table} 
        SET ${column} = AES_ENCRYPT(${column}, UNHEX('${key.id}'))
        WHERE ${column} IS NOT NULL AND ${column} != ''
      `;
            await sequelize.query(encryptQuery, { type: sequelize_1.QueryTypes.UPDATE });
            this.encryptedColumns.set(`${table}.${column}`, encryptedCol);
            await this.logHealthcareSecurityEvent({
                timestamp: new Date(),
                userId: 'system',
                sessionId: 'encryption_service',
                action: 'PHI_COLUMN_ENCRYPTED',
                resource: `${table}.${column}`,
                success: true,
                ipAddress: 'localhost',
                userAgent: 'Healthcare Security Service',
                severity: phiLevel === 'critical' ? 'critical' : 'medium',
                hipaaRelevant: hipaaRequired,
                phiAccessed: true,
                metadata: {
                    keyId,
                    algorithm: key.algorithm,
                    phiLevel,
                    clinicalContext: 'data_protection',
                },
            });
            this.emit('healthcareColumnEncrypted', { table, column, keyId, phiLevel });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to encrypt healthcare column ${table}.${column}:`, error);
            await this.logHealthcareSecurityEvent({
                timestamp: new Date(),
                userId: 'system',
                sessionId: 'encryption_service',
                action: 'PHI_ENCRYPTION_FAILED',
                resource: `${table}.${column}`,
                success: false,
                errorMessage,
                ipAddress: 'localhost',
                userAgent: 'Healthcare Security Service',
                severity: 'critical',
                hipaaRelevant: true,
                phiAccessed: false,
                metadata: { keyId, phiLevel },
            });
            throw error;
        }
    }
    async decryptHealthcareColumn(sequelize, table, column, keyId, userId, clinicalJustification) {
        try {
            const key = this.keyStore.get(keyId);
            if (!key) {
                throw new Error(`Encryption key not found: ${keyId}`);
            }
            const encryptedCol = this.encryptedColumns.get(`${table}.${column}`);
            if (!encryptedCol) {
                throw new Error(`Column ${table}.${column} is not registered as encrypted`);
            }
            await this.logHealthcareSecurityEvent({
                timestamp: new Date(),
                userId,
                sessionId: crypto.randomUUID(),
                action: 'PHI_COLUMN_DECRYPTED',
                resource: `${table}.${column}`,
                success: true,
                ipAddress: 'localhost',
                userAgent: 'Healthcare Security Service',
                severity: 'high',
                hipaaRelevant: true,
                phiAccessed: true,
                metadata: {
                    keyId,
                    phiLevel: encryptedCol.phiLevel,
                    clinicalJustification,
                    clinicalContext: 'data_access',
                },
            });
            const decryptQuery = `
        UPDATE ${table} 
        SET ${column} = AES_DECRYPT(${column}, UNHEX('${key.id}'))
        WHERE ${column} IS NOT NULL
      `;
            await sequelize.query(decryptQuery, { type: sequelize_1.QueryTypes.UPDATE });
            this.encryptedColumns.delete(`${table}.${column}`);
            this.emit('healthcareColumnDecrypted', { table, column, keyId, userId });
        }
        catch (error) {
            this.logger.error(`Failed to decrypt healthcare column ${table}.${column}:`, error);
            throw error;
        }
    }
    generateHealthcareEncryptionKey(algorithm = 'AES-256-GCM', usage = 'phi_encryption', complianceLevel = 'high') {
        const keySize = algorithm.includes('256') ? 32 : 16;
        const key = {
            id: crypto.randomBytes(keySize).toString('hex'),
            algorithm,
            keySize,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + (usage === 'phi_encryption' ? 90 : 365) * 24 * 60 * 60 * 1000),
            status: 'active',
            usage,
            hipaaCompliant: true,
            metadata: {
                generator: 'HealthcareSecurityService',
                environment: 'production',
                complianceLevel,
            },
        };
        this.keyStore.set(key.id, key);
        this.emit('healthcareKeyGenerated', { keyId: key.id, algorithm, usage, complianceLevel });
        return key;
    }
    async rotateHealthcareKeys() {
        const now = new Date();
        const keysToRotate = Array.from(this.keyStore.values()).filter((key) => key.expiresAt && key.expiresAt <= now && key.status === 'active');
        for (const oldKey of keysToRotate) {
            try {
                const newKey = this.generateHealthcareEncryptionKey(oldKey.algorithm, oldKey.usage, oldKey.metadata.complianceLevel);
                const columnsToRotate = Array.from(this.encryptedColumns.entries()).filter(([, col]) => col.keyId === oldKey.id);
                for (const [columnKey] of columnsToRotate) {
                    this.logger.log(`Key rotation needed for column: ${columnKey}`);
                }
                oldKey.status = 'rotated';
                oldKey.rotatedAt = now;
                await this.logHealthcareSecurityEvent({
                    timestamp: new Date(),
                    userId: 'system',
                    sessionId: 'key_rotation_service',
                    action: 'HEALTHCARE_KEY_ROTATED',
                    resource: oldKey.id,
                    success: true,
                    ipAddress: 'localhost',
                    userAgent: 'Healthcare Security Service',
                    severity: 'medium',
                    hipaaRelevant: true,
                    phiAccessed: false,
                    metadata: {
                        oldKeyId: oldKey.id,
                        newKeyId: newKey.id,
                        usage: oldKey.usage,
                        clinicalContext: 'key_management',
                    },
                });
            }
            catch (error) {
                this.logger.error(`Failed to rotate healthcare key ${oldKey.id}:`, error);
            }
        }
    }
    async detectHealthcarePHI(sequelize, table) {
        try {
            const columnsQuery = `
        SELECT COLUMN_NAME, DATA_TYPE, COLUMN_COMMENT
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = '${table}'
      `;
            const columns = await sequelize.query(columnsQuery, { type: sequelize_1.QueryTypes.SELECT });
            const phiColumns = [];
            for (const column of columns) {
                const columnName = column.COLUMN_NAME.toLowerCase();
                const dataType = column.DATA_TYPE.toLowerCase();
                for (const [phiType, pattern] of this.healthcarePiiPatterns) {
                    if (pattern.test(columnName) ||
                        (column.COLUMN_COMMENT && pattern.test(column.COLUMN_COMMENT))) {
                        phiColumns.push({
                            column: column.COLUMN_NAME,
                            phiType,
                            riskLevel: this.getHealthcareRiskLevel(phiType),
                            hipaaRequired: this.isHIPAARequired(phiType),
                        });
                        break;
                    }
                }
                if (dataType.includes('varchar') || dataType.includes('text')) {
                    const sampleQuery = `SELECT ${column.COLUMN_NAME} FROM ${table} WHERE ${column.COLUMN_NAME} IS NOT NULL LIMIT 5`;
                    try {
                        const samples = await sequelize.query(sampleQuery, { type: sequelize_1.QueryTypes.SELECT });
                        for (const sample of samples) {
                            const value = sample[column.COLUMN_NAME];
                            const phiType = this.detectHealthcarePHIType(value);
                            if (phiType) {
                                phiColumns.push({
                                    column: column.COLUMN_NAME,
                                    phiType,
                                    riskLevel: this.getHealthcareRiskLevel(phiType),
                                    hipaaRequired: this.isHIPAARequired(phiType),
                                });
                                break;
                            }
                        }
                    }
                    catch {
                    }
                }
            }
            return phiColumns.filter((item, index, self) => index === self.findIndex((t) => t.column === item.column));
        }
        catch (error) {
            this.logger.error(`Healthcare PHI detection failed for table ${table}:`, error);
            return [];
        }
    }
    async maskHealthcarePHI(data, fields, patientId) {
        const maskedData = { ...data };
        for (const field of fields) {
            if (maskedData[field]) {
                const value = String(maskedData[field]);
                const phiType = this.detectHealthcarePHIType(value);
                maskedData[field] = this.applyHealthcareMasking(value, phiType || 'generic');
            }
        }
        await this.logHealthcareSecurityEvent({
            timestamp: new Date(),
            userId: 'system',
            patientId,
            sessionId: 'phi_masking_service',
            action: 'PHI_MASKED',
            resource: 'patient_data',
            success: true,
            ipAddress: 'localhost',
            userAgent: 'Healthcare Security Service',
            severity: 'low',
            hipaaRelevant: true,
            phiAccessed: true,
            metadata: {
                maskedFields: fields,
                clinicalContext: 'data_protection',
            },
        });
        return maskedData;
    }
    async logHealthcareSecurityEvent(event) {
        const auditLog = {
            id: event.id || crypto.randomUUID(),
            ...event,
        };
        this.auditLogs.push(auditLog);
        const logLevel = auditLog.severity === 'critical' ? 'error' : auditLog.severity === 'high' ? 'warn' : 'log';
        this.logger[logLevel](`Healthcare Security Event: ${auditLog.action} - ${auditLog.resource}`, {
            userId: auditLog.userId,
            patientId: auditLog.patientId,
            hipaaRelevant: auditLog.hipaaRelevant,
            phiAccessed: auditLog.phiAccessed,
            severity: auditLog.severity,
        });
        this.emit('healthcareSecurityEvent', auditLog);
        this.analyzeForHealthcareThreats(auditLog);
        if (auditLog.hipaaRelevant && auditLog.severity === 'critical') {
            this.emit('hipaaReportableEvent', auditLog);
        }
    }
    analyzeForHealthcareThreats(auditLog) {
        const metadata = auditLog.metadata;
        if (auditLog.action.includes('EXPORT') &&
            auditLog.phiAccessed &&
            metadata?.recordCount &&
            metadata.recordCount > 1000) {
            const threat = {
                id: crypto.randomUUID(),
                type: 'phi_exfiltration',
                severity: 'critical',
                description: 'Large PHI export detected - potential data breach',
                timestamp: new Date(),
                source: auditLog.userId,
                mitigated: false,
                patientImpact: 'high',
                hipaaReportable: true,
                metadata: {
                    recordCount: metadata.recordCount,
                    clinicalImpact: 'potential_breach',
                    affectedPatients: auditLog.patientId ? [auditLog.patientId] : [],
                },
            };
            this.threats.push(threat);
            this.emit('healthcareThreatDetected', threat);
        }
        if (auditLog.phiAccessed && !auditLog.success) {
            const recentFailures = this.auditLogs.filter((log) => log.userId === auditLog.userId &&
                log.phiAccessed &&
                !log.success &&
                new Date().getTime() - log.timestamp.getTime() < 10 * 60 * 1000);
            if (recentFailures.length >= 3) {
                const threat = {
                    id: crypto.randomUUID(),
                    type: 'unauthorized_access',
                    severity: 'high',
                    description: 'Multiple failed PHI access attempts detected',
                    timestamp: new Date(),
                    source: auditLog.userId,
                    mitigated: false,
                    patientImpact: 'medium',
                    hipaaReportable: false,
                    metadata: {
                        failureCount: recentFailures.length,
                        clinicalImpact: 'access_attempt',
                    },
                };
                this.threats.push(threat);
                this.emit('healthcareThreatDetected', threat);
            }
        }
        const metadata2 = auditLog.metadata;
        if (metadata2?.clinicalContext && auditLog.severity === 'critical') {
            const threat = {
                id: crypto.randomUUID(),
                type: 'clinical_breach',
                severity: 'critical',
                description: 'Critical clinical workflow security violation',
                timestamp: new Date(),
                source: auditLog.userId,
                mitigated: false,
                patientImpact: metadata2.patientImpact || 'medium',
                hipaaReportable: true,
                metadata: {
                    clinicalContext: metadata2.clinicalContext,
                    clinicalImpact: 'workflow_violation',
                },
            };
            this.threats.push(threat);
            this.emit('healthcareThreatDetected', threat);
        }
    }
    initializeHealthcarePIIPatterns() {
        this.healthcarePiiPatterns.set('email', /email|mail|e_mail/i);
        this.healthcarePiiPatterns.set('phone', /phone|mobile|tel|telephone/i);
        this.healthcarePiiPatterns.set('ssn', /ssn|social_security|social_security_number/i);
        this.healthcarePiiPatterns.set('mrn', /mrn|medical_record|patient_id|medical_id/i);
        this.healthcarePiiPatterns.set('diagnosis', /diagnosis|condition|icd|disease/i);
        this.healthcarePiiPatterns.set('medication', /medication|drug|prescription|rx/i);
        this.healthcarePiiPatterns.set('treatment', /treatment|procedure|therapy|surgery/i);
        this.healthcarePiiPatterns.set('provider', /provider|doctor|physician|nurse|clinician/i);
        this.healthcarePiiPatterns.set('insurance', /insurance|payer|coverage|policy/i);
        this.healthcarePiiPatterns.set('lab_result', /lab|test_result|blood|urine|pathology/i);
        this.healthcarePiiPatterns.set('vital_signs', /vital|blood_pressure|heart_rate|temperature|weight/i);
        this.healthcarePiiPatterns.set('appointment', /appointment|visit|encounter|admission/i);
        this.healthcarePiiPatterns.set('emergency_contact', /emergency|next_of_kin|contact_person/i);
    }
    detectHealthcarePHIType(value) {
        if (!value || typeof value !== 'string')
            return null;
        if (/^[A-Z]{2,3}\d{6,10}$/i.test(value))
            return 'mrn';
        if (/^[A-Z]\d{2}(\.\d{1,2})?$/i.test(value))
            return 'diagnosis';
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            return 'email';
        if (/^\+?[\d\s\-()]{10,}$/.test(value))
            return 'phone';
        if (/^\d{3}-?\d{2}-?\d{4}$/.test(value))
            return 'ssn';
        return null;
    }
    getHealthcareRiskLevel(phiType) {
        const riskMap = {
            mrn: 'critical',
            ssn: 'critical',
            diagnosis: 'high',
            medication: 'high',
            treatment: 'high',
            lab_result: 'high',
            insurance: 'medium',
            provider: 'medium',
            appointment: 'medium',
            vital_signs: 'medium',
            emergency_contact: 'low',
            email: 'low',
            phone: 'low',
        };
        return riskMap[phiType] || 'medium';
    }
    isHIPAARequired(phiType) {
        const hipaaRequired = [
            'mrn',
            'ssn',
            'diagnosis',
            'medication',
            'treatment',
            'lab_result',
            'vital_signs',
            'insurance',
        ];
        return hipaaRequired.includes(phiType);
    }
    applyHealthcareMasking(value, phiType) {
        switch (phiType) {
            case 'mrn': {
                return value.substring(0, 3) + '*'.repeat(value.length - 3);
            }
            case 'ssn': {
                const digits = value.replace(/\D/g, '');
                return '***-**-' + digits.substring(digits.length - 4);
            }
            case 'email': {
                const [username, domain] = value.split('@');
                return username.substring(0, 2) + '*'.repeat(username.length - 2) + '@' + domain;
            }
            case 'phone': {
                const phoneDigits = value.replace(/\D/g, '');
                return (phoneDigits.substring(0, 3) +
                    '*'.repeat(phoneDigits.length - 6) +
                    phoneDigits.substring(phoneDigits.length - 3));
            }
            default:
                return value.length <= 4
                    ? '*'.repeat(value.length)
                    : value.substring(0, 2) +
                        '*'.repeat(value.length - 4) +
                        value.substring(value.length - 2);
        }
    }
    generateChecksum(data) {
        return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
    }
    createDefaultSecurityPolicies() {
        const phiEncryptionPolicy = {
            id: 'phi-encryption-policy',
            name: 'PHI Encryption Policy',
            type: 'phi_encryption',
            rules: {
                encryption: {
                    required: true,
                    algorithm: 'AES-256-GCM',
                    keyRotationDays: 90
                }
            },
            active: true,
            hipaaCompliant: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.securityPolicies.set(phiEncryptionPolicy.id, phiEncryptionPolicy);
    }
    startSecurityMonitoring() {
        setInterval(() => {
            void (async () => {
                try {
                    await this.rotateHealthcareKeys();
                    this.cleanupExpiredThreats();
                }
                catch (error) {
                    this.logger.error('Healthcare security monitoring error:', error);
                }
            })();
        }, 2 * 60 * 1000);
        setInterval(() => {
            const sevenYearsAgo = new Date(Date.now() - 7 * 365 * 24 * 60 * 60 * 1000);
            this.auditLogs = this.auditLogs.filter((log) => log.timestamp > sevenYearsAgo);
        }, 60 * 60 * 1000);
    }
    cleanupExpiredThreats() {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        this.threats = this.threats.filter((threat) => threat.timestamp > thirtyDaysAgo || !threat.mitigated);
    }
    async healthCheck() {
        try {
            const testKey = this.generateHealthcareEncryptionKey();
            const keyManagementHealthy = this.keyStore.has(testKey.id) && testKey.hipaaCompliant;
            const testAuditLog = {
                id: crypto.randomUUID(),
                timestamp: new Date(),
                userId: 'health_check',
                sessionId: 'health_check',
                action: 'HEALTH_CHECK',
                resource: 'system',
                success: true,
                ipAddress: 'localhost',
                userAgent: 'Healthcare Security Health Check',
                severity: 'low',
                hipaaRelevant: false,
                phiAccessed: false,
                metadata: {},
            };
            await this.logHealthcareSecurityEvent(testAuditLog);
            const auditHealthy = this.auditLogs.some((log) => log.id === testAuditLog.id);
            return {
                keyManagement: keyManagementHealthy,
                encryption: true,
                auditSystem: auditHealthy,
                threatDetection: true,
                hipaaCompliance: this.validateHIPAACompliance(),
            };
        }
        catch (error) {
            this.logger.error('Healthcare security health check failed:', error);
            return {
                keyManagement: false,
                encryption: false,
                auditSystem: false,
                threatDetection: false,
                hipaaCompliance: false
            };
        }
    }
    validateHIPAACompliance() {
        const activeKeys = Array.from(this.keyStore.values()).filter((k) => k.status === 'active');
        const hipaaCompliantKeys = activeKeys.filter((k) => k.hipaaCompliant);
        return hipaaCompliantKeys.length === activeKeys.length && activeKeys.length > 0;
    }
    getHealthcareSecurityMetrics() {
        const activeKeys = Array.from(this.keyStore.values()).filter((k) => k.status === 'active');
        const hipaaCompliantKeys = activeKeys.filter((k) => k.hipaaCompliant);
        const criticalPHIColumns = Array.from(this.encryptedColumns.values()).filter((c) => c.phiLevel === 'critical');
        const hipaaAuditLogs = this.auditLogs.filter((log) => log.hipaaRelevant);
        const criticalThreats = this.threats.filter((t) => t.severity === 'critical');
        return {
            totalKeys: this.keyStore.size,
            activeKeys: activeKeys.length,
            hipaaCompliantKeys: hipaaCompliantKeys.length,
            encryptedColumns: this.encryptedColumns.size,
            criticalPHIColumns: criticalPHIColumns.length,
            auditLogs: this.auditLogs.length,
            hipaaAuditLogs: hipaaAuditLogs.length,
            threats: this.threats.length,
            criticalThreats: criticalThreats.length,
            activePolicies: Array.from(this.securityPolicies.values()).filter((p) => p.active).length,
        };
    }
};
exports.ProductionSecurityService = ProductionSecurityService;
exports.ProductionSecurityService = ProductionSecurityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], ProductionSecurityService);
//# sourceMappingURL=production-security.service.js.map