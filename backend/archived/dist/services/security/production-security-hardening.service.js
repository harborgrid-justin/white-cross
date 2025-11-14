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
exports.SecurityHardeningFunctions = exports.SecurityFactory = exports.ProductionSecurityHardeningService = void 0;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const events_1 = require("events");
const logger_service_1 = require("../../common/logging/logger.service");
const common_2 = require("@nestjs/common");
let ProductionSecurityHardeningService = class ProductionSecurityHardeningService extends events_1.EventEmitter {
    keyStore = new Map();
    encryptedColumns = new Map();
    auditLogs = [];
    securityPolicies = new Map();
    threats = [];
    piiPatterns = new Map();
    constructor(logger) {
        super();
        this.initializePIIPatterns();
        this.startSecurityMonitoring();
    }
    async encryptColumn(sequelize, table, column, keyId) {
        try {
            const key = this.keyStore.get(keyId);
            if (!key || key.status !== 'active') {
                throw new Error(`Invalid or inactive encryption key: ${keyId}`);
            }
            const encryptedCol = {
                tableName: table,
                columnName: column,
                algorithm: key.algorithm,
                keyId,
                encryptedAt: new Date(),
                checksum: this.generateChecksum(`${table}.${column}`)
            };
            const encryptQuery = `
        UPDATE ${table} 
        SET ${column} = AES_ENCRYPT(${column}, '${key.id}')
        WHERE ${column} IS NOT NULL
      `;
            await sequelize.query(encryptQuery, { type: sequelize_1.QueryTypes.UPDATE });
            this.encryptedColumns.set(`${table}.${column}`, encryptedCol);
            await this.logSecurityEvent({
                id: crypto.randomUUID(),
                timestamp: new Date(),
                userId: 'system',
                sessionId: 'encryption_service',
                action: 'COLUMN_ENCRYPTED',
                resource: `${table}.${column}`,
                success: true,
                ipAddress: 'localhost',
                userAgent: 'Security Service',
                severity: 'medium',
                metadata: { keyId, algorithm: key.algorithm }
            });
            this.emit('columnEncrypted', { table, column, keyId });
        }
        catch (error) {
            this.logError(`Failed to encrypt column ${table}.${column}:`, error);
            throw error;
        }
    }
    async decryptColumn(sequelize, table, column, keyId) {
        try {
            const key = this.keyStore.get(keyId);
            if (!key) {
                throw new Error(`Encryption key not found: ${keyId}`);
            }
            const decryptQuery = `
        UPDATE ${table} 
        SET ${column} = AES_DECRYPT(${column}, '${key.id}')
        WHERE ${column} IS NOT NULL
      `;
            await sequelize.query(decryptQuery, { type: sequelize_1.QueryTypes.UPDATE });
            this.encryptedColumns.delete(`${table}.${column}`);
            await this.logSecurityEvent({
                id: crypto.randomUUID(),
                timestamp: new Date(),
                userId: 'system',
                sessionId: 'encryption_service',
                action: 'COLUMN_DECRYPTED',
                resource: `${table}.${column}`,
                success: true,
                ipAddress: 'localhost',
                userAgent: 'Security Service',
                severity: 'high',
                metadata: { keyId }
            });
            this.emit('columnDecrypted', { table, column, keyId });
        }
        catch (error) {
            this.logError(`Failed to decrypt column ${table}.${column}:`, error);
            throw error;
        }
    }
    async rotateColumnEncryption(sequelize, table, column, oldKeyId, newKeyId) {
        try {
            const oldKey = this.keyStore.get(oldKeyId);
            const newKey = this.keyStore.get(newKeyId);
            if (!oldKey || !newKey) {
                throw new Error('Invalid encryption keys for rotation');
            }
            const rotateQuery = `
        UPDATE ${table} 
        SET ${column} = AES_ENCRYPT(
          AES_DECRYPT(${column}, '${oldKey.id}'), 
          '${newKey.id}'
        )
        WHERE ${column} IS NOT NULL
      `;
            await sequelize.query(rotateQuery, { type: sequelize_1.QueryTypes.UPDATE });
            const encryptedCol = this.encryptedColumns.get(`${table}.${column}`);
            if (encryptedCol) {
                encryptedCol.keyId = newKeyId;
                encryptedCol.algorithm = newKey.algorithm;
                encryptedCol.encryptedAt = new Date();
            }
            oldKey.status = 'rotated';
            oldKey.rotatedAt = new Date();
            await this.logSecurityEvent({
                id: crypto.randomUUID(),
                timestamp: new Date(),
                userId: 'system',
                sessionId: 'encryption_service',
                action: 'KEY_ROTATED',
                resource: `${table}.${column}`,
                success: true,
                ipAddress: 'localhost',
                userAgent: 'Security Service',
                severity: 'medium',
                metadata: { oldKeyId, newKeyId }
            });
            this.emit('keyRotated', { table, column, oldKeyId, newKeyId });
        }
        catch (error) {
            this.logError(`Failed to rotate encryption for ${table}.${column}:`, error);
            throw error;
        }
    }
    async listEncryptedColumns(sequelize) {
        return Array.from(this.encryptedColumns.values());
    }
    async validateEncryption(sequelize, table, column) {
        try {
            const encryptedCol = this.encryptedColumns.get(`${table}.${column}`);
            if (!encryptedCol)
                return false;
            const testQuery = `
        SELECT COUNT(*) as count 
        FROM ${table} 
        WHERE ${column} IS NOT NULL 
        AND AES_DECRYPT(${column}, '${encryptedCol.keyId}') IS NOT NULL
        LIMIT 1
      `;
            const result = await sequelize.query(testQuery, { type: sequelize_1.QueryTypes.SELECT });
            return result[0].count > 0;
        }
        catch (error) {
            this.logError(`Encryption validation failed for ${table}.${column}:`, error);
            return false;
        }
    }
    generateEncryptionKey(algorithm = 'AES-256-GCM') {
        const keySize = algorithm.includes('256') ? 32 : 16;
        const key = {
            id: crypto.randomBytes(keySize).toString('hex'),
            algorithm,
            keySize,
            createdAt: new Date(),
            status: 'active',
            usage: 'encryption',
            metadata: {
                generator: 'ProductionSecurityHardening',
                environment: process.env.NODE_ENV || 'development'
            }
        };
        this.keyStore.set(key.id, key);
        this.emit('keyGenerated', { keyId: key.id, algorithm });
        return key;
    }
    async storeKey(key, location = 'memory') {
        try {
            switch (location) {
                case 'memory':
                    this.keyStore.set(key.id, key);
                    break;
                case 'file':
                    const keyData = JSON.stringify(key, null, 2);
                    require('fs').writeFileSync(`./keys/${key.id}.key`, keyData, { mode: 0o600 });
                    break;
                default:
                    throw new Error(`Unsupported key storage location: ${location}`);
            }
            await this.logSecurityEvent({
                id: crypto.randomUUID(),
                timestamp: new Date(),
                userId: 'system',
                sessionId: 'key_management',
                action: 'KEY_STORED',
                resource: key.id,
                success: true,
                ipAddress: 'localhost',
                userAgent: 'Security Service',
                severity: 'low',
                metadata: { location, algorithm: key.algorithm }
            });
        }
        catch (error) {
            this.logError(`Failed to store key ${key.id}:`, error);
            throw error;
        }
    }
    async retrieveKey(keyId, location = 'memory') {
        try {
            switch (location) {
                case 'memory':
                    return this.keyStore.get(keyId) || null;
                case 'file':
                    try {
                        const keyData = require('fs').readFileSync(`./keys/${keyId}.key`, 'utf8');
                        return JSON.parse(keyData);
                    }
                    catch {
                        return null;
                    }
                default:
                    throw new Error(`Unsupported key storage location: ${location}`);
            }
        }
        catch (error) {
            this.logError(`Failed to retrieve key ${keyId}:`, error);
            return null;
        }
    }
    async detectPII(sequelize, table) {
        try {
            const columnsQuery = `
        SELECT COLUMN_NAME, DATA_TYPE, COLUMN_COMMENT 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = '${table}'
      `;
            const columns = await sequelize.query(columnsQuery, { type: sequelize_1.QueryTypes.SELECT });
            const piiColumns = [];
            for (const column of columns) {
                const columnName = column.COLUMN_NAME.toLowerCase();
                const dataType = column.DATA_TYPE.toLowerCase();
                for (const [piiType, pattern] of this.piiPatterns) {
                    if (pattern.test(columnName) || (column.COLUMN_COMMENT && pattern.test(column.COLUMN_COMMENT))) {
                        piiColumns.push(column.COLUMN_NAME);
                        break;
                    }
                }
                if (dataType.includes('varchar') || dataType.includes('text')) {
                    const sampleQuery = `SELECT ${column.COLUMN_NAME} FROM ${table} WHERE ${column.COLUMN_NAME} IS NOT NULL LIMIT 10`;
                    try {
                        const samples = await sequelize.query(sampleQuery, { type: sequelize_1.QueryTypes.SELECT });
                        for (const sample of samples) {
                            const value = sample[column.COLUMN_NAME];
                            if (this.containsPII(value)) {
                                piiColumns.push(column.COLUMN_NAME);
                                break;
                            }
                        }
                    }
                    catch (error) {
                    }
                }
            }
            return [...new Set(piiColumns)];
        }
        catch (error) {
            this.logError(`PII detection failed for table ${table}:`, error);
            return [];
        }
    }
    async maskPII(data, fields) {
        const maskedData = { ...data };
        for (const field of fields) {
            if (maskedData[field]) {
                const value = maskedData[field].toString();
                if (this.isEmail(value)) {
                    maskedData[field] = this.maskEmail(value);
                }
                else if (this.isPhoneNumber(value)) {
                    maskedData[field] = this.maskPhone(value);
                }
                else if (this.isCreditCard(value)) {
                    maskedData[field] = this.maskCreditCard(value);
                }
                else if (this.isSSN(value)) {
                    maskedData[field] = this.maskSSN(value);
                }
                else {
                    maskedData[field] = this.maskGeneric(value);
                }
            }
        }
        return maskedData;
    }
    async tokenizePII(value) {
        const token = crypto.randomBytes(16).toString('hex');
        const hash = crypto.createHash('sha256').update(value).digest('hex');
        await this.logSecurityEvent({
            id: crypto.randomUUID(),
            timestamp: new Date(),
            userId: 'system',
            sessionId: 'pii_service',
            action: 'PII_TOKENIZED',
            resource: 'pii_data',
            success: true,
            ipAddress: 'localhost',
            userAgent: 'Security Service',
            severity: 'low',
            metadata: { token, hash: hash.substring(0, 8) }
        });
        return token;
    }
    async logSecurityEvent(event) {
        const auditLog = {
            id: event.id || crypto.randomUUID(),
            ...event
        };
        this.auditLogs.push(auditLog);
        this.logInfo(`Security Event: ${auditLog.action} - ${auditLog.resource}`);
        this.emit('securityEvent', auditLog);
        await this.analyzeForThreats(auditLog);
    }
    async queryAuditLogs(sequelize, filters) {
        let filteredLogs = this.auditLogs;
        if (filters.userId) {
            filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
        }
        if (filters.action) {
            filteredLogs = filteredLogs.filter(log => log.action === filters.action);
        }
        if (filters.startDate) {
            filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate);
        }
        if (filters.endDate) {
            filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate);
        }
        if (filters.severity) {
            filteredLogs = filteredLogs.filter(log => log.severity === filters.severity);
        }
        if (filters.success !== undefined) {
            filteredLogs = filteredLogs.filter(log => log.success === filters.success);
        }
        return filteredLogs;
    }
    async detectSuspiciousActivity(sequelize) {
        const suspiciousLogs = [];
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const recentFailures = this.auditLogs.filter(log => log.timestamp > oneHourAgo &&
            !log.success &&
            log.action === 'LOGIN_ATTEMPT');
        const failuresByUser = new Map();
        for (const failure of recentFailures) {
            const count = failuresByUser.get(failure.userId) || 0;
            failuresByUser.set(failure.userId, count + 1);
        }
        for (const [userId, count] of failuresByUser) {
            if (count > 5) {
                const threat = {
                    id: crypto.randomUUID(),
                    type: 'brute_force',
                    severity: 'high',
                    description: `Multiple failed login attempts detected for user ${userId}`,
                    timestamp: new Date(),
                    source: userId,
                    mitigated: false,
                    metadata: { failureCount: count }
                };
                this.threats.push(threat);
                suspiciousLogs.push(...recentFailures.filter(log => log.userId === userId));
            }
        }
        return suspiciousLogs;
    }
    async analyzeForThreats(auditLog) {
        if (auditLog.metadata?.query) {
            const query = auditLog.metadata.query.toLowerCase();
            const sqlInjectionPatterns = [
                /union\s+select/i,
                /drop\s+table/i,
                /delete\s+from/i,
                /insert\s+into/i,
                /update\s+.*\s+set/i,
                /exec\s*\(/i,
                /script\s*>/i
            ];
            for (const pattern of sqlInjectionPatterns) {
                if (pattern.test(query)) {
                    const threat = {
                        id: crypto.randomUUID(),
                        type: 'sql_injection',
                        severity: 'critical',
                        description: 'Potential SQL injection attempt detected',
                        timestamp: new Date(),
                        source: auditLog.ipAddress,
                        mitigated: false,
                        metadata: { query: query.substring(0, 100), userId: auditLog.userId }
                    };
                    this.threats.push(threat);
                    this.emit('threatDetected', threat);
                    break;
                }
            }
        }
        if (auditLog.action === 'DATA_EXPORT' && auditLog.metadata?.recordCount > 10000) {
            const threat = {
                id: crypto.randomUUID(),
                type: 'data_exfiltration',
                severity: 'high',
                description: 'Large data export detected',
                timestamp: new Date(),
                source: auditLog.userId,
                mitigated: false,
                metadata: { recordCount: auditLog.metadata.recordCount }
            };
            this.threats.push(threat);
            this.emit('threatDetected', threat);
        }
    }
    initializePIIPatterns() {
        this.piiPatterns.set('email', /email|mail|e_mail/i);
        this.piiPatterns.set('phone', /phone|mobile|tel|telephone/i);
        this.piiPatterns.set('ssn', /ssn|social_security|social_security_number/i);
        this.piiPatterns.set('credit_card', /credit_card|cc|card_number/i);
        this.piiPatterns.set('name', /first_name|last_name|full_name|name/i);
        this.piiPatterns.set('address', /address|street|zip|postal/i);
        this.piiPatterns.set('dob', /birth_date|dob|date_of_birth/i);
    }
    containsPII(value) {
        if (!value || typeof value !== 'string')
            return false;
        return this.isEmail(value) ||
            this.isPhoneNumber(value) ||
            this.isCreditCard(value) ||
            this.isSSN(value);
    }
    isEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    isPhoneNumber(value) {
        return /^\+?[\d\s\-\(\)]{10,}$/.test(value);
    }
    isCreditCard(value) {
        return /^\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}$/.test(value);
    }
    isSSN(value) {
        return /^\d{3}-?\d{2}-?\d{4}$/.test(value);
    }
    maskEmail(email) {
        const [username, domain] = email.split('@');
        const maskedUsername = username.substring(0, 2) + '*'.repeat(username.length - 2);
        return `${maskedUsername}@${domain}`;
    }
    maskPhone(phone) {
        const digits = phone.replace(/\D/g, '');
        return digits.substring(0, 3) + '*'.repeat(digits.length - 6) + digits.substring(digits.length - 3);
    }
    maskCreditCard(cc) {
        const digits = cc.replace(/\D/g, '');
        return '*'.repeat(digits.length - 4) + digits.substring(digits.length - 4);
    }
    maskSSN(ssn) {
        const digits = ssn.replace(/\D/g, '');
        return '***-**-' + digits.substring(digits.length - 4);
    }
    maskGeneric(value) {
        if (value.length <= 4)
            return '*'.repeat(value.length);
        return value.substring(0, 2) + '*'.repeat(value.length - 4) + value.substring(value.length - 2);
    }
    generateChecksum(data) {
        return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
    }
    startSecurityMonitoring() {
        setInterval(async () => {
            try {
                await this.detectSuspiciousActivity({});
            }
            catch (error) {
                this.logError('Security monitoring error:', error);
            }
        }, 5 * 60 * 1000);
        setInterval(() => {
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            this.auditLogs = this.auditLogs.filter(log => log.timestamp > oneWeekAgo);
        }, 60 * 60 * 1000);
    }
    async healthCheck() {
        try {
            const testKey = this.generateEncryptionKey();
            const keyStoreHealthy = this.keyStore.has(testKey.id);
            const testAuditLog = {
                id: crypto.randomUUID(),
                timestamp: new Date(),
                userId: 'health_check',
                sessionId: 'health_check',
                action: 'HEALTH_CHECK',
                resource: 'system',
                success: true,
                ipAddress: 'localhost',
                userAgent: 'Health Check',
                severity: 'low',
                metadata: {}
            };
            await this.logSecurityEvent(testAuditLog);
            const auditHealthy = this.auditLogs.some(log => log.id === testAuditLog.id);
            return {
                keyStore: keyStoreHealthy,
                auditSystem: auditHealthy,
                threatDetection: true,
                encryption: true
            };
        }
        catch (error) {
            this.logError('Security health check failed:', error);
            return {
                keyStore: false,
                auditSystem: false,
                threatDetection: false,
                encryption: false
            };
        }
    }
    getSecurityMetrics() {
        return {
            totalKeys: this.keyStore.size,
            activeKeys: Array.from(this.keyStore.values()).filter(k => k.status === 'active').length,
            encryptedColumns: this.encryptedColumns.size,
            auditLogs: this.auditLogs.length,
            threats: this.threats.length,
            activePolicies: Array.from(this.securityPolicies.values()).filter(p => p.active).length
        };
    }
};
exports.ProductionSecurityHardeningService = ProductionSecurityHardeningService;
exports.ProductionSecurityHardeningService = ProductionSecurityHardeningService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], ProductionSecurityHardeningService);
class SecurityFactory {
    static createProductionSecurity() {
        return new ProductionSecurityHardeningService();
    }
}
exports.SecurityFactory = SecurityFactory;
exports.SecurityHardeningFunctions = {
    encryptColumn: (service) => service.encryptColumn.bind(service),
    decryptColumn: (service) => service.decryptColumn.bind(service),
    rotateColumnEncryption: (service) => service.rotateColumnEncryption.bind(service),
    listEncryptedColumns: (service) => service.listEncryptedColumns.bind(service),
    validateEncryption: (service) => service.validateEncryption.bind(service),
    generateEncryptionKey: (service) => service.generateEncryptionKey.bind(service),
    storeKey: (service) => service.storeKey.bind(service),
    retrieveKey: (service) => service.retrieveKey.bind(service),
    detectPII: (service) => service.detectPII.bind(service),
    maskPII: (service) => service.maskPII.bind(service),
    tokenizePII: (service) => service.tokenizePII.bind(service),
    logSecurityEvent: (service) => service.logSecurityEvent.bind(service),
    queryAuditLogs: (service) => service.queryAuditLogs.bind(service),
    detectSuspiciousActivity: (service) => service.detectSuspiciousActivity.bind(service)
};
//# sourceMappingURL=production-security-hardening.service.js.map