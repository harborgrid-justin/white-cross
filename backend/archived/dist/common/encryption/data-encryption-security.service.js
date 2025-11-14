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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataEncryptionSecurityService = void 0;
exports.encryptColumn = encryptColumn;
exports.decryptColumn = decryptColumn;
exports.rotateColumnEncryption = rotateColumnEncryption;
exports.listEncryptedColumns = listEncryptedColumns;
exports.validateEncryption = validateEncryption;
exports.encryptMultipleColumns = encryptMultipleColumns;
exports.reEncryptColumn = reEncryptColumn;
exports.benchmarkEncryption = benchmarkEncryption;
exports.enableTDE = enableTDE;
exports.disableTDE = disableTDE;
exports.rotateTDEKey = rotateTDEKey;
exports.validateTDESetup = validateTDESetup;
exports.encryptTablespace = encryptTablespace;
exports.getTDEStatus = getTDEStatus;
exports.configureTDEPolicy = configureTDEPolicy;
exports.monitorTDEPerformance = monitorTDEPerformance;
exports.generateEncryptionKey = generateEncryptionKey;
exports.storeKey = storeKey;
exports.retrieveKey = retrieveKey;
exports.rotateKeys = rotateKeys;
exports.revokeKey = revokeKey;
exports.listKeys = listKeys;
exports.scheduleKeyRotation = scheduleKeyRotation;
exports.auditKeyUsage = auditKeyUsage;
exports.detectPII = detectPII;
exports.maskPII = maskPII;
exports.anonymizeData = anonymizeData;
exports.tokenizePII = tokenizePII;
exports.detokenizePII = detokenizePII;
exports.validatePIICompliance = validatePIICompliance;
exports.generatePIIReport = generatePIIReport;
exports.configurePIIPolicy = configurePIIPolicy;
exports.logSecurityEvent = logSecurityEvent;
exports.queryAuditLogs = queryAuditLogs;
exports.archiveAuditLogs = archiveAuditLogs;
exports.validateAuditIntegrity = validateAuditIntegrity;
exports.generateAuditReport = generateAuditReport;
exports.detectSuspiciousActivity = detectSuspiciousActivity;
exports.configureAuditPolicy = configureAuditPolicy;
exports.exportAuditLogs = exportAuditLogs;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const base_1 = require("../base");
const keyStore = new Map();
const encryptedColumnsStore = new Map();
const auditLogsStore = [];
const piiTokenStore = new Map();
const tdeConfig = {
    enabled: false,
    masterKey: '',
    algorithm: 'AES-256-GCM',
    policy: null,
};
async function encryptColumn(sequelize, table, column, keyId) {
    const key = keyStore.get(keyId);
    if (!key || key.status !== 'active') {
        throw new Error(`Invalid or inactive encryption key: ${keyId}`);
    }
    try {
        await sequelize.query(`ALTER TABLE ${table} ADD COLUMN ${column}_backup TEXT`, {
            type: sequelize_1.QueryTypes.RAW,
        });
        await sequelize.query(`UPDATE ${table} SET ${column}_backup = ${column}`, {
            type: sequelize_1.QueryTypes.UPDATE,
        });
        const rows = await sequelize.query(`SELECT id, ${column} FROM ${table} WHERE ${column} IS NOT NULL`, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        for (const row of rows) {
            const plaintext = String(row[column]);
            const encrypted = encryptValue(plaintext, key.id);
            await sequelize.query(`UPDATE ${table} SET ${column} = :encrypted WHERE id = :id`, {
                replacements: { encrypted, id: row.id },
                type: sequelize_1.QueryTypes.UPDATE,
            });
        }
        const encryptedCol = {
            tableName: table,
            columnName: column,
            algorithm: key.algorithm,
            keyId: key.id,
            encryptedAt: new Date(),
            checksum: generateChecksum(`${table}.${column}`),
        };
        encryptedColumnsStore.set(`${table}.${column}`, encryptedCol);
        await logSecurityEvent(sequelize, {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            userId: 'system',
            sessionId: 'encryption_service',
            action: 'COLUMN_ENCRYPTED',
            resource: `${table}.${column}`,
            success: true,
            ipAddress: 'localhost',
            userAgent: 'DataEncryptionService',
            severity: 'medium',
            metadata: { keyId, rowsEncrypted: rows.length },
        });
    }
    catch (error) {
        throw new Error(`Column encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
async function decryptColumn(sequelize, table, column, keyId) {
    const key = keyStore.get(keyId);
    if (!key) {
        throw new Error(`Encryption key not found: ${keyId}`);
    }
    try {
        const rows = await sequelize.query(`SELECT id, ${column} FROM ${table} WHERE ${column} IS NOT NULL`, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        for (const row of rows) {
            const encrypted = String(row[column]);
            const decrypted = decryptValue(encrypted, key.id);
            await sequelize.query(`UPDATE ${table} SET ${column} = :decrypted WHERE id = :id`, {
                replacements: { decrypted, id: row.id },
                type: sequelize_1.QueryTypes.UPDATE,
            });
        }
        encryptedColumnsStore.delete(`${table}.${column}`);
        try {
            await sequelize.query(`ALTER TABLE ${table} DROP COLUMN ${column}_backup`, {
                type: sequelize_1.QueryTypes.RAW,
            });
        }
        catch {
        }
        await logSecurityEvent(sequelize, {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            userId: 'system',
            sessionId: 'encryption_service',
            action: 'COLUMN_DECRYPTED',
            resource: `${table}.${column}`,
            success: true,
            ipAddress: 'localhost',
            userAgent: 'DataEncryptionService',
            severity: 'high',
            metadata: { keyId, rowsDecrypted: rows.length },
        });
    }
    catch (error) {
        throw new Error(`Column decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
async function rotateColumnEncryption(sequelize, table, column, oldKeyId, newKeyId) {
    const oldKey = keyStore.get(oldKeyId);
    const newKey = keyStore.get(newKeyId);
    if (!oldKey || !newKey) {
        throw new Error('Invalid encryption keys for rotation');
    }
    try {
        const rows = await sequelize.query(`SELECT id, ${column} FROM ${table} WHERE ${column} IS NOT NULL`, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        for (const row of rows) {
            const encrypted = String(row[column]);
            const decrypted = decryptValue(encrypted, oldKey.id);
            const reEncrypted = encryptValue(decrypted, newKey.id);
            await sequelize.query(`UPDATE ${table} SET ${column} = :reEncrypted WHERE id = :id`, {
                replacements: { reEncrypted, id: row.id },
                type: sequelize_1.QueryTypes.UPDATE,
            });
        }
        const encryptedCol = encryptedColumnsStore.get(`${table}.${column}`);
        if (encryptedCol) {
            encryptedCol.keyId = newKey.id;
            encryptedCol.algorithm = newKey.algorithm;
            encryptedCol.encryptedAt = new Date();
            encryptedColumnsStore.set(`${table}.${column}`, encryptedCol);
        }
        oldKey.status = 'rotated';
        oldKey.rotatedAt = new Date();
        keyStore.set(oldKeyId, oldKey);
        await logSecurityEvent(sequelize, {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            userId: 'system',
            sessionId: 'encryption_service',
            action: 'KEY_ROTATED',
            resource: `${table}.${column}`,
            success: true,
            ipAddress: 'localhost',
            userAgent: 'DataEncryptionService',
            severity: 'medium',
            metadata: { oldKeyId, newKeyId, rowsRotated: rows.length },
        });
    }
    catch (error) {
        throw new Error(`Key rotation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
async function listEncryptedColumns(sequelize) {
    return Array.from(encryptedColumnsStore.values());
}
async function validateEncryption(sequelize, table, column) {
    try {
        const encryptedCol = encryptedColumnsStore.get(`${table}.${column}`);
        if (!encryptedCol)
            return false;
        const samples = await sequelize.query(`SELECT ${column} FROM ${table} WHERE ${column} IS NOT NULL LIMIT 10`, { type: sequelize_1.QueryTypes.SELECT });
        if (samples.length === 0)
            return true;
        for (const sample of samples) {
            const value = String(sample[column]);
            if (!isEncryptedFormat(value)) {
                return false;
            }
        }
        return true;
    }
    catch (error) {
        return false;
    }
}
async function encryptMultipleColumns(sequelize, columns, keyId) {
    for (const { table, column } of columns) {
        await encryptColumn(sequelize, table, column, keyId);
    }
}
async function reEncryptColumn(sequelize, table, column, keyId) {
    const encryptedCol = encryptedColumnsStore.get(`${table}.${column}`);
    if (!encryptedCol) {
        throw new Error(`Column ${table}.${column} is not registered as encrypted`);
    }
    await decryptColumn(sequelize, table, column, keyId);
    await encryptColumn(sequelize, table, column, keyId);
}
async function benchmarkEncryption(sequelize, algorithm) {
    const testData = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(100);
    const iterations = 1000;
    const keyId = generateEncryptionKey(algorithm).id;
    const startTime = Date.now();
    for (let i = 0; i < iterations; i++) {
        const encrypted = encryptValue(testData, keyId);
        decryptValue(encrypted, keyId);
    }
    const endTime = Date.now();
    const opsPerSecond = (iterations * 2) / ((endTime - startTime) / 1000);
    return Math.round(opsPerSecond);
}
async function enableTDE(sequelize, masterKey) {
    if (tdeConfig.enabled) {
        throw new Error('TDE is already enabled');
    }
    try {
        tdeConfig.enabled = true;
        tdeConfig.masterKey = masterKey;
        tdeConfig.algorithm = 'AES-256-GCM';
        await logSecurityEvent(sequelize, {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            userId: 'system',
            sessionId: 'tde_service',
            action: 'TDE_ENABLED',
            resource: 'database',
            success: true,
            ipAddress: 'localhost',
            userAgent: 'DataEncryptionService',
            severity: 'high',
            metadata: { algorithm: tdeConfig.algorithm },
        });
    }
    catch (error) {
        tdeConfig.enabled = false;
        throw new Error(`TDE enablement failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
async function disableTDE(sequelize) {
    if (!tdeConfig.enabled) {
        throw new Error('TDE is not enabled');
    }
    try {
        tdeConfig.enabled = false;
        tdeConfig.masterKey = '';
        await logSecurityEvent(sequelize, {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            userId: 'system',
            sessionId: 'tde_service',
            action: 'TDE_DISABLED',
            resource: 'database',
            success: true,
            ipAddress: 'localhost',
            userAgent: 'DataEncryptionService',
            severity: 'critical',
            metadata: {},
        });
    }
    catch (error) {
        throw new Error(`TDE disable failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
async function rotateTDEKey(sequelize, oldKey, newKey) {
    if (!tdeConfig.enabled) {
        throw new Error('TDE is not enabled');
    }
    if (tdeConfig.masterKey !== oldKey) {
        throw new Error('Invalid old master key');
    }
    tdeConfig.masterKey = newKey;
    await logSecurityEvent(sequelize, {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        userId: 'system',
        sessionId: 'tde_service',
        action: 'TDE_KEY_ROTATED',
        resource: 'database',
        success: true,
        ipAddress: 'localhost',
        userAgent: 'DataEncryptionService',
        severity: 'high',
        metadata: { algorithm: tdeConfig.algorithm },
    });
}
async function validateTDESetup(sequelize) {
    const issues = [];
    if (!tdeConfig.enabled) {
        issues.push('TDE is not enabled');
    }
    if (tdeConfig.enabled && !tdeConfig.masterKey) {
        issues.push('TDE is enabled but master key is missing');
    }
    if (tdeConfig.policy && tdeConfig.policy.keyRotationDays > 0) {
    }
    return {
        enabled: tdeConfig.enabled,
        issues,
    };
}
async function encryptTablespace(sequelize, tablespace, keyId) {
    const key = keyStore.get(keyId);
    if (!key) {
        throw new Error(`Key not found: ${keyId}`);
    }
    await logSecurityEvent(sequelize, {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        userId: 'system',
        sessionId: 'tde_service',
        action: 'TABLESPACE_ENCRYPTED',
        resource: tablespace,
        success: true,
        ipAddress: 'localhost',
        userAgent: 'DataEncryptionService',
        severity: 'medium',
        metadata: { keyId, algorithm: key.algorithm },
    });
}
async function getTDEStatus(sequelize) {
    const lastRotation = auditLogsStore
        .filter((log) => log.action === 'TDE_KEY_ROTATED')
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    const keyRotationDays = tdeConfig.policy?.keyRotationDays || 90;
    const nextRotation = lastRotation
        ? new Date(lastRotation.timestamp.getTime() + keyRotationDays * 24 * 60 * 60 * 1000)
        : undefined;
    return {
        enabled: tdeConfig.enabled,
        algorithm: tdeConfig.algorithm,
        keyRotationDue: nextRotation ? new Date() >= nextRotation : false,
        lastRotation: lastRotation?.timestamp,
        nextRotation,
    };
}
async function configureTDEPolicy(sequelize, policy) {
    tdeConfig.policy = policy;
    await logSecurityEvent(sequelize, {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        userId: 'system',
        sessionId: 'tde_service',
        action: 'TDE_POLICY_CONFIGURED',
        resource: 'database',
        success: true,
        ipAddress: 'localhost',
        userAgent: 'DataEncryptionService',
        severity: 'medium',
        metadata: { policy },
    });
}
async function monitorTDEPerformance(sequelize) {
    const iterations = 100;
    const testQuery = 'SELECT 1';
    const startWithTDE = Date.now();
    for (let i = 0; i < iterations; i++) {
        await sequelize.query(testQuery, { type: sequelize_1.QueryTypes.SELECT });
    }
    const withTDETime = Date.now() - startWithTDE;
    const wasEnabled = tdeConfig.enabled;
    tdeConfig.enabled = false;
    const startWithoutTDE = Date.now();
    for (let i = 0; i < iterations; i++) {
        await sequelize.query(testQuery, { type: sequelize_1.QueryTypes.SELECT });
    }
    const withoutTDETime = Date.now() - startWithoutTDE;
    tdeConfig.enabled = wasEnabled;
    const overhead = ((withTDETime - withoutTDETime) / withoutTDETime) * 100;
    const throughput = iterations / (withTDETime / 1000);
    return {
        overhead: Math.round(overhead * 100) / 100,
        throughput: Math.round(throughput),
    };
}
function generateEncryptionKey(algorithm = 'AES-256-GCM') {
    const keySize = algorithm.includes('256') ? 32 : 16;
    const key = {
        id: crypto.randomBytes(keySize).toString('hex'),
        algorithm,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: 'active',
        usage: 'column',
        metadata: {
            generator: 'DataEncryptionService',
            environment: process.env.NODE_ENV || 'development',
        },
    };
    keyStore.set(key.id, key);
    return key;
}
async function storeKey(key, location = 'memory') {
    switch (location) {
        case 'memory':
            keyStore.set(key.id, key);
            break;
        case 'file':
            keyStore.set(key.id, key);
            break;
        default:
            throw new Error(`Unsupported storage location: ${location}`);
    }
}
async function retrieveKey(keyId, location = 'memory') {
    return keyStore.get(keyId) || null;
}
async function rotateKeys(sequelize, oldKeyId, newKeyId) {
    const oldKey = keyStore.get(oldKeyId);
    if (!oldKey) {
        throw new Error(`Old key not found: ${oldKeyId}`);
    }
    const columnsToRotate = Array.from(encryptedColumnsStore.values()).filter((col) => col.keyId === oldKeyId);
    for (const column of columnsToRotate) {
        await rotateColumnEncryption(sequelize, column.tableName, column.columnName, oldKeyId, newKeyId);
    }
    oldKey.status = 'rotated';
    oldKey.rotatedAt = new Date();
    keyStore.set(oldKeyId, oldKey);
}
async function revokeKey(keyId) {
    const key = keyStore.get(keyId);
    if (!key) {
        throw new Error(`Key not found: ${keyId}`);
    }
    key.status = 'revoked';
    keyStore.set(keyId, key);
}
async function listKeys(location = 'memory') {
    return Array.from(keyStore.values());
}
async function scheduleKeyRotation(interval) {
    return setInterval(async () => {
        const now = new Date();
        for (const [keyId, key] of keyStore) {
            if (key.expiresAt && key.expiresAt <= now && key.status === 'active') {
                const newKey = generateEncryptionKey(key.algorithm);
                common_1.Logger.log(`Key ${keyId} expired and should be rotated to ${newKey.id}`);
            }
        }
    }, interval);
}
async function auditKeyUsage(sequelize, keyId) {
    return auditLogsStore.filter((log) => {
        const metadata = log.metadata;
        return metadata.keyId === keyId;
    });
}
async function detectPII(sequelize, table) {
    const piiPatterns = new Map([
        ['email', /email|mail|e_mail/i],
        ['phone', /phone|mobile|tel|telephone/i],
        ['ssn', /ssn|social_security|social_security_number/i],
        ['credit_card', /credit_card|cc|card_number/i],
        ['name', /first_name|last_name|full_name|name/i],
        ['address', /address|street|zip|postal/i],
        ['dob', /birth_date|dob|date_of_birth/i],
    ]);
    try {
        const columns = await sequelize.query(`SELECT COLUMN_NAME, DATA_TYPE
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_NAME = :table`, {
            replacements: { table },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const piiColumns = [];
        for (const column of columns) {
            const columnName = column.COLUMN_NAME.toLowerCase();
            for (const [, pattern] of piiPatterns) {
                if (pattern.test(columnName)) {
                    piiColumns.push(column.COLUMN_NAME);
                    break;
                }
            }
        }
        return piiColumns;
    }
    catch (error) {
        common_1.Logger.error(`PII detection failed for table ${table}:`, error);
        return [];
    }
}
async function maskPII(data, fields) {
    const maskedData = { ...data };
    for (const field of fields) {
        if (maskedData[field]) {
            const value = String(maskedData[field]);
            if (isEmail(value)) {
                maskedData[field] = maskEmail(value);
            }
            else if (isPhoneNumber(value)) {
                maskedData[field] = maskPhone(value);
            }
            else if (isSSN(value)) {
                maskedData[field] = maskSSN(value);
            }
            else {
                maskedData[field] = maskGeneric(value);
            }
        }
    }
    return maskedData;
}
async function anonymizeData(sequelize, table, columns) {
    for (const column of columns) {
        await sequelize.query(`UPDATE ${table} SET ${column} = :anonymized WHERE ${column} IS NOT NULL`, {
            replacements: { anonymized: '***REDACTED***' },
            type: sequelize_1.QueryTypes.UPDATE,
        });
    }
    await logSecurityEvent(sequelize, {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        userId: 'system',
        sessionId: 'pii_service',
        action: 'DATA_ANONYMIZED',
        resource: table,
        success: true,
        ipAddress: 'localhost',
        userAgent: 'DataEncryptionService',
        severity: 'high',
        metadata: { columns },
    });
}
async function tokenizePII(value) {
    const token = crypto.randomBytes(16).toString('hex');
    piiTokenStore.set(token, value);
    return token;
}
async function detokenizePII(token) {
    const value = piiTokenStore.get(token);
    if (!value) {
        throw new Error('Invalid or expired token');
    }
    return value;
}
async function validatePIICompliance(sequelize) {
    const violations = [];
    const unencryptedPIIColumns = [];
    try {
        const tables = await sequelize.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()`, { type: sequelize_1.QueryTypes.SELECT });
        for (const { TABLE_NAME } of tables) {
            const piiColumns = await detectPII(sequelize, TABLE_NAME);
            for (const column of piiColumns) {
                const isEncrypted = encryptedColumnsStore.has(`${TABLE_NAME}.${column}`);
                if (!isEncrypted) {
                    unencryptedPIIColumns.push({
                        table: TABLE_NAME,
                        column,
                        piiType: 'detected',
                    });
                    violations.push({
                        table: TABLE_NAME,
                        column,
                        reason: 'PII column is not encrypted',
                        severity: 'high',
                    });
                }
            }
        }
        return {
            compliant: violations.length === 0,
            violations,
            unencryptedPIIColumns,
        };
    }
    catch (error) {
        throw new Error(`PII compliance validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
async function generatePIIReport(sequelize) {
    const compliance = await validatePIICompliance(sequelize);
    let report = '=== PII Compliance Report ===\n\n';
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Overall Status: ${compliance.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}\n\n`;
    if (compliance.violations.length > 0) {
        report += '--- Violations ---\n';
        for (const violation of compliance.violations) {
            report += `[${violation.severity.toUpperCase()}] ${violation.table}.${violation.column}: ${violation.reason}\n`;
        }
        report += '\n';
    }
    if (compliance.unencryptedPIIColumns.length > 0) {
        report += '--- Unencrypted PII Columns ---\n';
        for (const col of compliance.unencryptedPIIColumns) {
            report += `${col.table}.${col.column} (${col.piiType})\n`;
        }
        report += '\n';
    }
    report += `Total Violations: ${compliance.violations.length}\n`;
    report += `Unencrypted PII Columns: ${compliance.unencryptedPIIColumns.length}\n`;
    return report;
}
async function configurePIIPolicy(sequelize, policy) {
    await logSecurityEvent(sequelize, {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        userId: 'system',
        sessionId: 'pii_service',
        action: 'PII_POLICY_CONFIGURED',
        resource: 'database',
        success: true,
        ipAddress: 'localhost',
        userAgent: 'DataEncryptionService',
        severity: 'medium',
        metadata: { policy },
    });
}
async function logSecurityEvent(sequelize, event) {
    auditLogsStore.push(event);
    if (auditLogsStore.length > 10000) {
        auditLogsStore.shift();
    }
    common_1.Logger.log(`[SECURITY] ${event.action} - ${event.resource} (${event.severity})`);
}
async function queryAuditLogs(sequelize, filters) {
    let filtered = auditLogsStore;
    if (filters.userId) {
        filtered = filtered.filter((log) => log.userId === filters.userId);
    }
    if (filters.action) {
        filtered = filtered.filter((log) => log.action === filters.action);
    }
    if (filters.startDate) {
        filtered = filtered.filter((log) => log.timestamp >= filters.startDate);
    }
    if (filters.endDate) {
        filtered = filtered.filter((log) => log.timestamp <= filters.endDate);
    }
    if (filters.severity) {
        filtered = filtered.filter((log) => log.severity === filters.severity);
    }
    if (filters.success !== undefined) {
        filtered = filtered.filter((log) => log.success === filters.success);
    }
    return filtered;
}
async function archiveAuditLogs(sequelize, olderThan) {
    const beforeCount = auditLogsStore.length;
    const archivedLogs = auditLogsStore.filter((log) => log.timestamp < olderThan);
    for (let i = auditLogsStore.length - 1; i >= 0; i--) {
        if (auditLogsStore[i].timestamp < olderThan) {
            auditLogsStore.splice(i, 1);
        }
    }
    const archived = beforeCount - auditLogsStore.length;
    await logSecurityEvent(sequelize, {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        userId: 'system',
        sessionId: 'audit_service',
        action: 'LOGS_ARCHIVED',
        resource: 'audit_logs',
        success: true,
        ipAddress: 'localhost',
        userAgent: 'DataEncryptionService',
        severity: 'low',
        metadata: { archivedCount: archived, olderThan: olderThan.toISOString() },
    });
    return archived;
}
async function validateAuditIntegrity(sequelize) {
    const tamperedRecords = [];
    let checksumMismatches = 0;
    for (const log of auditLogsStore) {
        if (!log.id || !log.timestamp || !log.action) {
            tamperedRecords.push(log.id || 'unknown');
        }
    }
    return {
        valid: tamperedRecords.length === 0,
        tamperedRecords,
        missingRecords: 0,
        checksumMismatches,
    };
}
async function generateAuditReport(logs) {
    let report = '=== Security Audit Report ===\n\n';
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Total Events: ${logs.length}\n\n`;
    const byAction = new Map();
    const bySeverity = new Map();
    let successCount = 0;
    let failureCount = 0;
    for (const log of logs) {
        byAction.set(log.action, (byAction.get(log.action) || 0) + 1);
        bySeverity.set(log.severity, (bySeverity.get(log.severity) || 0) + 1);
        if (log.success)
            successCount++;
        else
            failureCount++;
    }
    report += '--- Events by Action ---\n';
    for (const [action, count] of byAction) {
        report += `${action}: ${count}\n`;
    }
    report += '\n--- Events by Severity ---\n';
    for (const [severity, count] of bySeverity) {
        report += `${severity.toUpperCase()}: ${count}\n`;
    }
    report += `\n--- Success/Failure ---\n`;
    report += `Success: ${successCount}\n`;
    report += `Failure: ${failureCount}\n`;
    return report;
}
async function detectSuspiciousActivity(sequelize) {
    const suspicious = [];
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentFailures = auditLogsStore.filter((log) => !log.success && log.timestamp > oneHourAgo);
    const failuresByUser = new Map();
    for (const failure of recentFailures) {
        const logs = failuresByUser.get(failure.userId) || [];
        logs.push(failure);
        failuresByUser.set(failure.userId, logs);
    }
    for (const [userId, failures] of failuresByUser) {
        if (failures.length >= 5) {
            suspicious.push(...failures);
        }
    }
    const criticalEvents = auditLogsStore.filter((log) => log.severity === 'critical' && log.timestamp > oneHourAgo);
    suspicious.push(...criticalEvents);
    return [...new Set(suspicious)];
}
async function configureAuditPolicy(sequelize, policy) {
    await logSecurityEvent(sequelize, {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        userId: 'system',
        sessionId: 'audit_service',
        action: 'AUDIT_POLICY_CONFIGURED',
        resource: 'audit_system',
        success: true,
        ipAddress: 'localhost',
        userAgent: 'DataEncryptionService',
        severity: 'medium',
        metadata: { policy },
    });
}
async function exportAuditLogs(sequelize, format) {
    if (format === 'json') {
        return JSON.stringify(auditLogsStore, null, 2);
    }
    else if (format === 'csv') {
        let csv = 'id,timestamp,userId,action,resource,success,severity\n';
        for (const log of auditLogsStore) {
            csv += `${log.id},${log.timestamp.toISOString()},${log.userId},${log.action},${log.resource},${log.success},${log.severity}\n`;
        }
        return csv;
    }
    else {
        return await generateAuditReport(auditLogsStore);
    }
}
function encryptValue(plaintext, keyId) {
    const key = keyStore.get(keyId);
    if (!key)
        throw new Error(`Key not found: ${keyId}`);
    const keyBuffer = Buffer.from(key.id, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);
    let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return Buffer.from(`${iv.toString('hex')}:${authTag.toString('hex')}:${ciphertext}`).toString('base64');
}
function decryptValue(encrypted, keyId) {
    const key = keyStore.get(keyId);
    if (!key)
        throw new Error(`Key not found: ${keyId}`);
    const decoded = Buffer.from(encrypted, 'base64').toString('utf8');
    const [ivHex, authTagHex, ciphertext] = decoded.split(':');
    if (!ivHex || !authTagHex || !ciphertext) {
        throw new Error('Invalid encrypted format');
    }
    const keyBuffer = Buffer.from(key.id, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
    decipher.setAuthTag(authTag);
    let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
    plaintext += decipher.final('utf8');
    return plaintext;
}
function isEncryptedFormat(value) {
    try {
        const decoded = Buffer.from(value, 'base64').toString('utf8');
        const parts = decoded.split(':');
        return parts.length === 3;
    }
    catch {
        return false;
    }
}
function generateChecksum(data) {
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
}
function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function isPhoneNumber(value) {
    return /^\+?[\d\s\-()]{10,}$/.test(value);
}
function isSSN(value) {
    return /^\d{3}-?\d{2}-?\d{4}$/.test(value);
}
function maskEmail(email) {
    const [username, domain] = email.split('@');
    const maskedUsername = username.substring(0, 2) + '*'.repeat(username.length - 2);
    return `${maskedUsername}@${domain}`;
}
function maskPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.substring(0, 3) + '*'.repeat(digits.length - 6) + digits.substring(digits.length - 3);
}
function maskSSN(ssn) {
    const digits = ssn.replace(/\D/g, '');
    return '***-**-' + digits.substring(digits.length - 4);
}
function maskGeneric(value) {
    if (value.length <= 4)
        return '*'.repeat(value.length);
    return value.substring(0, 2) + '*'.repeat(value.length - 4) + value.substring(value.length - 2);
}
let DataEncryptionSecurityService = class DataEncryptionSecurityService extends base_1.BaseService {
    constructor() {
        super('DataEncryptionSecurityService');
    }
    encryptColumn = encryptColumn;
    decryptColumn = decryptColumn;
    rotateColumnEncryption = rotateColumnEncryption;
    listEncryptedColumns = listEncryptedColumns;
    validateEncryption = validateEncryption;
    encryptMultipleColumns = encryptMultipleColumns;
    reEncryptColumn = reEncryptColumn;
    benchmarkEncryption = benchmarkEncryption;
    enableTDE = enableTDE;
    disableTDE = disableTDE;
    rotateTDEKey = rotateTDEKey;
    validateTDESetup = validateTDESetup;
    encryptTablespace = encryptTablespace;
    getTDEStatus = getTDEStatus;
    configureTDEPolicy = configureTDEPolicy;
    monitorTDEPerformance = monitorTDEPerformance;
    generateEncryptionKey = generateEncryptionKey;
    storeKey = storeKey;
    retrieveKey = retrieveKey;
    rotateKeys = rotateKeys;
    revokeKey = revokeKey;
    listKeys = listKeys;
    scheduleKeyRotation = scheduleKeyRotation;
    auditKeyUsage = auditKeyUsage;
    detectPII = detectPII;
    maskPII = maskPII;
    anonymizeData = anonymizeData;
    tokenizePII = tokenizePII;
    detokenizePII = detokenizePII;
    validatePIICompliance = validatePIICompliance;
    generatePIIReport = generatePIIReport;
    configurePIIPolicy = configurePIIPolicy;
    logSecurityEvent = logSecurityEvent;
    queryAuditLogs = queryAuditLogs;
    archiveAuditLogs = archiveAuditLogs;
    validateAuditIntegrity = validateAuditIntegrity;
    generateAuditReport = generateAuditReport;
    detectSuspiciousActivity = detectSuspiciousActivity;
    configureAuditPolicy = configureAuditPolicy;
    exportAuditLogs = exportAuditLogs;
};
exports.DataEncryptionSecurityService = DataEncryptionSecurityService;
exports.DataEncryptionSecurityService = DataEncryptionSecurityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DataEncryptionSecurityService);
exports.default = {
    encryptColumn,
    decryptColumn,
    rotateColumnEncryption,
    listEncryptedColumns,
    validateEncryption,
    encryptMultipleColumns,
    reEncryptColumn,
    benchmarkEncryption,
    enableTDE,
    disableTDE,
    rotateTDEKey,
    validateTDESetup,
    encryptTablespace,
    getTDEStatus,
    configureTDEPolicy,
    monitorTDEPerformance,
    generateEncryptionKey,
    storeKey,
    retrieveKey,
    rotateKeys,
    revokeKey,
    listKeys,
    scheduleKeyRotation,
    auditKeyUsage,
    detectPII,
    maskPII,
    anonymizeData,
    tokenizePII,
    detokenizePII,
    validatePIICompliance,
    generatePIIReport,
    configurePIIPolicy,
    logSecurityEvent,
    queryAuditLogs,
    archiveAuditLogs,
    validateAuditIntegrity,
    generateAuditReport,
    detectSuspiciousActivity,
    configureAuditPolicy,
    exportAuditLogs,
    DataEncryptionSecurityService,
};
//# sourceMappingURL=data-encryption-security.service.js.map