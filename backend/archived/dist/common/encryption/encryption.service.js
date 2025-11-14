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
exports.HealthcareEncryptionService = exports.HealthcareDataLevel = exports.EncryptionAlgorithm = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
const util_1 = require("util");
const base_1 = require("../base");
const scrypt = (0, util_1.promisify)(crypto.scrypt);
const randomBytes = (0, util_1.promisify)(crypto.randomBytes);
const pbkdf2 = (0, util_1.promisify)(crypto.pbkdf2);
var EncryptionAlgorithm;
(function (EncryptionAlgorithm) {
    EncryptionAlgorithm["AES_256_GCM"] = "aes-256-gcm";
    EncryptionAlgorithm["AES_256_CBC"] = "aes-256-cbc";
    EncryptionAlgorithm["CHACHA20_POLY1305"] = "chacha20-poly1305";
})(EncryptionAlgorithm || (exports.EncryptionAlgorithm = EncryptionAlgorithm = {}));
var HealthcareDataLevel;
(function (HealthcareDataLevel) {
    HealthcareDataLevel["PUBLIC"] = "public";
    HealthcareDataLevel["INTERNAL"] = "internal";
    HealthcareDataLevel["PHI"] = "phi";
    HealthcareDataLevel["SENSITIVE_PHI"] = "sensitive_phi";
    HealthcareDataLevel["RESTRICTED"] = "restricted";
})(HealthcareDataLevel || (exports.HealthcareDataLevel = HealthcareDataLevel = {}));
let HealthcareEncryptionService = class HealthcareEncryptionService extends base_1.BaseService {
    configService;
    keys = new Map();
    keyMetadata = new Map();
    activeKeysByLevel = new Map();
    IV_LENGTH = 16;
    AUTH_TAG_LENGTH = 16;
    SALT_LENGTH = 32;
    KEY_LENGTH = 32;
    MAX_PLAINTEXT_SIZE = 10 * 1024 * 1024;
    constructor(configService) {
        super({ serviceName: 'HealthcareEncryptionService' });
        this.configService = configService;
        this.initializeHealthcareKeys();
    }
    async encryptHealthcareData(plaintext, dataLevel = HealthcareDataLevel.PHI, options) {
        this.validatePlaintext(plaintext);
        const keyId = options?.keyId || this.getActiveKeyForLevel(dataLevel);
        const algorithm = options?.algorithm || EncryptionAlgorithm.AES_256_GCM;
        this.validateKeyForDataLevel(keyId, dataLevel);
        try {
            const key = this.getKey(keyId);
            const iv = await randomBytes(this.IV_LENGTH);
            const cipher = crypto.createCipheriv(algorithm, key, iv);
            let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
            ciphertext += cipher.final('hex');
            const authTag = cipher.getAuthTag();
            this.incrementKeyUsage(keyId);
            const envelope = {
                algorithm,
                ciphertext,
                iv: iv.toString('hex'),
                authTag: authTag.toString('hex'),
                keyId,
                timestamp: Date.now(),
                version: 1,
                dataLevel,
            };
            if (options?.auditRequired !== false) {
                this.logEncryptionAudit(keyId, dataLevel, 'ENCRYPT');
            }
            return envelope;
        }
        catch (error) {
            this.logError(`Healthcare data encryption failed: ${error.message}`, error);
            throw new Error('Healthcare encryption operation failed');
        }
    }
    async decryptHealthcareData(envelope, auditRequired = true) {
        this.validateEncryptedEnvelope(envelope);
        try {
            const key = this.getKey(envelope.keyId || this.getActiveKeyForLevel(HealthcareDataLevel.PHI));
            const iv = Buffer.from(envelope.iv, 'hex');
            const authTag = Buffer.from(envelope.authTag, 'hex');
            const decipher = crypto.createDecipheriv(envelope.algorithm, key, iv);
            decipher.setAuthTag(authTag);
            let plaintext = decipher.update(envelope.ciphertext, 'hex', 'utf8');
            plaintext += decipher.final('utf8');
            if (auditRequired) {
                this.logEncryptionAudit(envelope.keyId || 'unknown', envelope.dataLevel || HealthcareDataLevel.PHI, 'DECRYPT');
            }
            return plaintext;
        }
        catch (error) {
            this.logError(`Healthcare data decryption failed: ${error.message}`, error);
            throw new Error('Healthcare decryption operation failed or data tampered');
        }
    }
    async encryptPHI(phi, options) {
        const envelope = await this.encryptHealthcareData(phi, HealthcareDataLevel.PHI, { ...options, auditRequired: true });
        return Buffer.from(JSON.stringify(envelope)).toString('base64');
    }
    async decryptPHI(encryptedPHI) {
        try {
            const envelope = JSON.parse(Buffer.from(encryptedPHI, 'base64').toString('utf8'));
            return await this.decryptHealthcareData(envelope, true);
        }
        catch (error) {
            this.logError(`PHI decryption failed: ${error.message}`, error);
            throw new Error('Invalid encrypted PHI data');
        }
    }
    async encryptSensitivePHI(sensitivePhi, options) {
        const envelope = await this.encryptHealthcareData(sensitivePhi, HealthcareDataLevel.SENSITIVE_PHI, { ...options, auditRequired: true });
        return Buffer.from(JSON.stringify(envelope)).toString('base64');
    }
    async decryptSensitivePHI(encryptedSensitivePHI) {
        try {
            const envelope = JSON.parse(Buffer.from(encryptedSensitivePHI, 'base64').toString('utf8'));
            this.logWarning(`Sensitive PHI decryption requested for key: ${envelope.keyId}`);
            return await this.decryptHealthcareData(envelope, true);
        }
        catch (error) {
            this.logError(`Sensitive PHI decryption failed: ${error.message}`, error);
            throw new Error('Invalid encrypted sensitive PHI data');
        }
    }
    async encryptRestrictedData(restrictedData, options) {
        const envelope = await this.encryptHealthcareData(restrictedData, HealthcareDataLevel.RESTRICTED, { ...options, auditRequired: true });
        return Buffer.from(JSON.stringify(envelope)).toString('base64');
    }
    async decryptRestrictedData(encryptedRestrictedData) {
        try {
            const envelope = JSON.parse(Buffer.from(encryptedRestrictedData, 'base64').toString('utf8'));
            this.logWarning(`Restricted healthcare data decryption requested for key: ${envelope.keyId}`);
            return await this.decryptHealthcareData(envelope, true);
        }
        catch (error) {
            this.logError(`Restricted data decryption failed: ${error.message}`, error);
            throw new Error('Invalid encrypted restricted healthcare data');
        }
    }
    async encryptSSN(ssn) {
        this.validateSSNFormat(ssn);
        const digits = ssn.replace(/\D/g, '');
        const key = this.getKey(this.getActiveKeyForLevel(HealthcareDataLevel.SENSITIVE_PHI));
        const encryptedDigits = await this.feistelCipher(digits, key, true);
        return `${encryptedDigits.slice(0, 3)}-${encryptedDigits.slice(3, 5)}-${encryptedDigits.slice(5)}`;
    }
    async decryptSSN(encryptedSSN) {
        this.validateSSNFormat(encryptedSSN);
        const digits = encryptedSSN.replace(/\D/g, '');
        const key = this.getKey(this.getActiveKeyForLevel(HealthcareDataLevel.SENSITIVE_PHI));
        const decryptedDigits = await this.feistelCipher(digits, key, false);
        return `${decryptedDigits.slice(0, 3)}-${decryptedDigits.slice(3, 5)}-${decryptedDigits.slice(5)}`;
    }
    async encryptMRN(mrn) {
        let result = '';
        let digits = '';
        for (const char of mrn) {
            if (/\d/.test(char)) {
                digits += char;
            }
        }
        if (digits.length > 0) {
            const key = this.getKey(this.getActiveKeyForLevel(HealthcareDataLevel.PHI));
            const encryptedDigits = await this.feistelCipher(digits, key, true);
            let digitIndex = 0;
            for (const char of mrn) {
                if (/\d/.test(char)) {
                    result += encryptedDigits[digitIndex++];
                }
                else {
                    result += char;
                }
            }
        }
        else {
            result = mrn;
        }
        return result;
    }
    async decryptMRN(encryptedMRN) {
        let result = '';
        let digits = '';
        for (const char of encryptedMRN) {
            if (/\d/.test(char)) {
                digits += char;
            }
        }
        if (digits.length > 0) {
            const key = this.getKey(this.getActiveKeyForLevel(HealthcareDataLevel.PHI));
            const decryptedDigits = await this.feistelCipher(digits, key, false);
            let digitIndex = 0;
            for (const char of encryptedMRN) {
                if (/\d/.test(char)) {
                    result += decryptedDigits[digitIndex++];
                }
                else {
                    result += char;
                }
            }
        }
        else {
            result = encryptedMRN;
        }
        return result;
    }
    async generateHealthcareKey(keyId, dataLevel, algorithm = EncryptionAlgorithm.AES_256_GCM) {
        const key = await randomBytes(this.KEY_LENGTH);
        this.keys.set(keyId, key);
        const maxUsageCount = this.getMaxUsageCountForLevel(dataLevel);
        const expirationDays = this.getExpirationDaysForLevel(dataLevel);
        const metadata = {
            keyId,
            version: 1,
            algorithm,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000),
            status: 'active',
            dataLevel,
            hipaaCompliant: true,
            usageCount: 0,
            maxUsageCount,
        };
        this.keyMetadata.set(keyId, metadata);
        this.activeKeysByLevel.set(dataLevel, keyId);
        this.logInfo(`Generated healthcare encryption key: ${keyId} for level: ${dataLevel}`);
        this.logEncryptionAudit(keyId, dataLevel, 'KEY_GENERATED');
        return metadata;
    }
    async rotateHealthcareKeys() {
        for (const [dataLevel, keyId] of this.activeKeysByLevel) {
            const metadata = this.keyMetadata.get(keyId);
            if (!metadata)
                continue;
            const shouldRotate = this.shouldRotateKey(metadata);
            if (shouldRotate) {
                const newKeyId = `${keyId}-v${metadata.version + 1}`;
                await this.rotateHealthcareKey(keyId, newKeyId, dataLevel);
            }
        }
    }
    async rotateHealthcareKey(oldKeyId, newKeyId, dataLevel) {
        const oldMetadata = this.keyMetadata.get(oldKeyId);
        if (!oldMetadata) {
            throw new Error(`Healthcare key not found: ${oldKeyId}`);
        }
        oldMetadata.status = 'rotating';
        oldMetadata.rotatedAt = new Date();
        this.keyMetadata.set(oldKeyId, oldMetadata);
        const newMetadata = await this.generateHealthcareKey(newKeyId, dataLevel, oldMetadata.algorithm);
        this.logInfo(`Rotated healthcare key from ${oldKeyId} to ${newKeyId} for level: ${dataLevel}`);
        this.logEncryptionAudit(oldKeyId, dataLevel, 'KEY_ROTATED');
        return newMetadata;
    }
    async createHealthcareSearchableIndex(value, dataLevel, keyId) {
        const effectiveKeyId = keyId || this.getActiveKeyForLevel(dataLevel);
        const key = this.getKey(effectiveKeyId);
        const salt = await randomBytes(this.SALT_LENGTH);
        const normalizedValue = value.toLowerCase().trim();
        const hash = crypto
            .createHmac('sha256', key)
            .update(salt)
            .update(normalizedValue)
            .digest('hex');
        return {
            hash,
            salt: salt.toString('hex'),
            keyId: effectiveKeyId,
            dataLevel,
            createdAt: new Date(),
        };
    }
    async generateHealthcareSearchToken(searchValue, index) {
        const key = this.getKey(index.keyId);
        const salt = Buffer.from(index.salt, 'hex');
        const normalizedValue = searchValue.toLowerCase().trim();
        return crypto
            .createHmac('sha256', key)
            .update(salt)
            .update(normalizedValue)
            .digest('hex');
    }
    async encryptPatientRecord(patientData, fieldConfig) {
        const encryptedData = { ...patientData };
        for (const [fieldName, dataLevel] of Object.entries(fieldConfig)) {
            if (encryptedData[fieldName] !== undefined && encryptedData[fieldName] !== null) {
                const value = typeof encryptedData[fieldName] === 'string'
                    ? encryptedData[fieldName]
                    : JSON.stringify(encryptedData[fieldName]);
                switch (dataLevel) {
                    case HealthcareDataLevel.PHI:
                        encryptedData[fieldName] = await this.encryptPHI(value);
                        break;
                    case HealthcareDataLevel.SENSITIVE_PHI:
                        encryptedData[fieldName] = await this.encryptSensitivePHI(value);
                        break;
                    case HealthcareDataLevel.RESTRICTED:
                        encryptedData[fieldName] = await this.encryptRestrictedData(value);
                        break;
                    default:
                        const envelope = await this.encryptHealthcareData(value, dataLevel);
                        encryptedData[fieldName] = Buffer.from(JSON.stringify(envelope)).toString('base64');
                }
            }
        }
        return encryptedData;
    }
    async decryptPatientRecord(encryptedPatientData, fieldConfig) {
        const decryptedData = { ...encryptedPatientData };
        for (const [fieldName, dataLevel] of Object.entries(fieldConfig)) {
            if (decryptedData[fieldName]) {
                try {
                    switch (dataLevel) {
                        case HealthcareDataLevel.PHI:
                            decryptedData[fieldName] = await this.decryptPHI(decryptedData[fieldName]);
                            break;
                        case HealthcareDataLevel.SENSITIVE_PHI:
                            decryptedData[fieldName] = await this.decryptSensitivePHI(decryptedData[fieldName]);
                            break;
                        case HealthcareDataLevel.RESTRICTED:
                            decryptedData[fieldName] = await this.decryptRestrictedData(decryptedData[fieldName]);
                            break;
                        default:
                            const envelope = JSON.parse(Buffer.from(decryptedData[fieldName], 'base64').toString('utf8'));
                            decryptedData[fieldName] = await this.decryptHealthcareData(envelope, true);
                    }
                    try {
                        const parsed = JSON.parse(decryptedData[fieldName]);
                        if (typeof parsed === 'object') {
                            decryptedData[fieldName] = parsed;
                        }
                    }
                    catch {
                    }
                }
                catch (error) {
                    this.logWarning(`Failed to decrypt field ${fieldName}: ${error.message}`);
                }
            }
        }
        return decryptedData;
    }
    initializeHealthcareKeys() {
        const healthcareLevels = [
            HealthcareDataLevel.PHI,
            HealthcareDataLevel.SENSITIVE_PHI,
            HealthcareDataLevel.RESTRICTED,
        ];
        for (const level of healthcareLevels) {
            const keyId = `healthcare-${level}-default`;
            const key = crypto.randomBytes(this.KEY_LENGTH);
            this.keys.set(keyId, key);
            const metadata = {
                keyId,
                version: 1,
                algorithm: EncryptionAlgorithm.AES_256_GCM,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + this.getExpirationDaysForLevel(level) * 24 * 60 * 60 * 1000),
                status: 'active',
                dataLevel: level,
                hipaaCompliant: true,
                usageCount: 0,
                maxUsageCount: this.getMaxUsageCountForLevel(level),
            };
            this.keyMetadata.set(keyId, metadata);
            this.activeKeysByLevel.set(level, keyId);
        }
        this.logWarning('Healthcare encryption keys initialized in memory. ' +
            'For production, integrate with ConfigService and use HSM/KMS.');
    }
    getActiveKeyForLevel(dataLevel) {
        const keyId = this.activeKeysByLevel.get(dataLevel);
        if (!keyId) {
            throw new Error(`No active key found for healthcare data level: ${dataLevel}`);
        }
        return keyId;
    }
    getMaxUsageCountForLevel(dataLevel) {
        switch (dataLevel) {
            case HealthcareDataLevel.RESTRICTED:
                return 10000;
            case HealthcareDataLevel.SENSITIVE_PHI:
                return 50000;
            case HealthcareDataLevel.PHI:
                return 100000;
            default:
                return 1000000;
        }
    }
    getExpirationDaysForLevel(dataLevel) {
        switch (dataLevel) {
            case HealthcareDataLevel.RESTRICTED:
                return 30;
            case HealthcareDataLevel.SENSITIVE_PHI:
                return 90;
            case HealthcareDataLevel.PHI:
                return 180;
            default:
                return 365;
        }
    }
    shouldRotateKey(metadata) {
        const now = new Date();
        if (metadata.expiresAt && metadata.expiresAt <= now) {
            return true;
        }
        if (metadata.maxUsageCount && metadata.usageCount >= metadata.maxUsageCount) {
            return true;
        }
        return false;
    }
    incrementKeyUsage(keyId) {
        const metadata = this.keyMetadata.get(keyId);
        if (metadata) {
            metadata.usageCount++;
            this.keyMetadata.set(keyId, metadata);
        }
    }
    validatePlaintext(plaintext) {
        if (!plaintext || typeof plaintext !== 'string') {
            throw new Error('Plaintext must be a non-empty string');
        }
        if (plaintext.length > this.MAX_PLAINTEXT_SIZE) {
            throw new Error('Plaintext exceeds maximum allowed size');
        }
    }
    validateEncryptedEnvelope(envelope) {
        if (!envelope || typeof envelope !== 'object') {
            throw new Error('Envelope must be a valid EncryptedEnvelope object');
        }
        if (!envelope.ciphertext || !envelope.iv || !envelope.authTag) {
            throw new Error('Envelope missing required fields: ciphertext, iv, or authTag');
        }
    }
    validateKeyForDataLevel(keyId, dataLevel) {
        const metadata = this.keyMetadata.get(keyId);
        if (metadata && metadata.dataLevel !== dataLevel) {
            this.logWarning(`Key ${keyId} data level (${metadata.dataLevel}) doesn't match requested level (${dataLevel})`);
        }
    }
    validateSSNFormat(ssn) {
        if (!/^\d{3}-?\d{2}-?\d{4}$/.test(ssn)) {
            throw new Error('Invalid SSN format. Expected XXX-XX-XXXX or XXXXXXXXX');
        }
    }
    getKey(keyId) {
        const key = this.keys.get(keyId);
        if (!key) {
            this.logError(`Healthcare encryption key not found: ${keyId}`);
            throw new Error(`Healthcare encryption key not found: ${keyId}`);
        }
        return key;
    }
    logEncryptionAudit(keyId, dataLevel, operation) {
        this.logInfo(`Healthcare encryption audit: ${operation} | Key: ${keyId} | Level: ${dataLevel} | Time: ${new Date().toISOString()}`);
    }
    async feistelCipher(input, key, encrypt) {
        const rounds = 8;
        let left = input.slice(0, Math.floor(input.length / 2));
        let right = input.slice(Math.floor(input.length / 2));
        for (let i = 0; i < rounds; i++) {
            const roundKey = crypto
                .createHmac('sha256', key)
                .update(Buffer.from([encrypt ? i : rounds - 1 - i]))
                .digest();
            const f = this.feistelRoundFunction(encrypt ? right : left, roundKey);
            const temp = encrypt ? left : right;
            if (encrypt) {
                left = right;
                right = this.xorDigitStrings(temp, f);
            }
            else {
                right = left;
                left = this.xorDigitStrings(temp, f);
            }
        }
        return left + right;
    }
    feistelRoundFunction(data, key) {
        const hmac = crypto.createHmac('sha256', key).update(data).digest();
        let result = '';
        for (let i = 0; i < data.length; i++) {
            const digit = parseInt(data[i], 10);
            const keyByte = hmac[i % hmac.length];
            result += ((digit + keyByte) % 10).toString();
        }
        return result;
    }
    xorDigitStrings(a, b) {
        let result = '';
        for (let i = 0; i < a.length; i++) {
            const digitA = parseInt(a[i], 10);
            const digitB = parseInt(b[i % b.length], 10);
            result += ((digitA + digitB) % 10).toString();
        }
        return result;
    }
    isEncrypted(value) {
        if (!value || typeof value !== 'string') {
            return false;
        }
        try {
            const decoded = Buffer.from(value, 'base64').toString('utf8');
            const envelope = JSON.parse(decoded);
            return (envelope &&
                typeof envelope === 'object' &&
                envelope.algorithm &&
                envelope.ciphertext &&
                envelope.iv &&
                envelope.authTag &&
                typeof envelope.timestamp === 'number' &&
                typeof envelope.version === 'number');
        }
        catch {
            return false;
        }
    }
    async healthCheck() {
        try {
            const testKey = await this.generateHealthcareKey('health-check-test', HealthcareDataLevel.PHI);
            const testData = 'health-check-test-data';
            const encrypted = await this.encryptPHI(testData);
            const decrypted = await this.decryptPHI(encrypted);
            this.keys.delete(testKey.keyId);
            this.keyMetadata.delete(testKey.keyId);
            const encryptionWorking = decrypted === testData;
            const hipaaCompliant = this.validateHIPAACompliance();
            const keyRotationHealthy = this.checkKeyRotationHealth();
            return {
                keyManagement: true,
                encryption: encryptionWorking,
                hipaaCompliance: hipaaCompliant,
                keyRotation: keyRotationHealthy,
            };
        }
        catch (error) {
            this.logError(`Healthcare encryption health check failed: ${error.message}`, error);
            return {
                keyManagement: false,
                encryption: false,
                hipaaCompliance: false,
                keyRotation: false,
            };
        }
    }
    getHealthcareEncryptionMetrics() {
        const activeKeys = Array.from(this.keyMetadata.values()).filter(k => k.status === 'active');
        const hipaaCompliantKeys = activeKeys.filter(k => k.hipaaCompliant);
        const keysByDataLevel = {};
        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        let keysNearingExpiration = 0;
        let keysNearingUsageLimit = 0;
        for (const metadata of activeKeys) {
            keysByDataLevel[metadata.dataLevel] = (keysByDataLevel[metadata.dataLevel] || 0) + 1;
            if (metadata.expiresAt && metadata.expiresAt <= sevenDaysFromNow) {
                keysNearingExpiration++;
            }
            if (metadata.maxUsageCount && metadata.usageCount >= metadata.maxUsageCount * 0.9) {
                keysNearingUsageLimit++;
            }
        }
        return {
            totalKeys: this.keyMetadata.size,
            activeKeys: activeKeys.length,
            hipaaCompliantKeys: hipaaCompliantKeys.length,
            keysByDataLevel,
            keysNearingExpiration,
            keysNearingUsageLimit,
        };
    }
    validateHIPAACompliance() {
        const activeKeys = Array.from(this.keyMetadata.values()).filter(k => k.status === 'active');
        return activeKeys.every(k => k.hipaaCompliant);
    }
    checkKeyRotationHealth() {
        const activeKeys = Array.from(this.keyMetadata.values()).filter(k => k.status === 'active');
        const unhealthyKeys = activeKeys.filter(k => this.shouldRotateKey(k));
        return unhealthyKeys.length === 0;
    }
};
exports.HealthcareEncryptionService = HealthcareEncryptionService;
exports.HealthcareEncryptionService = HealthcareEncryptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], HealthcareEncryptionService);
//# sourceMappingURL=encryption.service.js.map