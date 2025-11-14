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
exports.PIIRedactionInterceptor = exports.DataSecurityService = exports.DataClassification = exports.MaskingStrategy = exports.PIIFieldType = void 0;
exports.Sensitive = Sensitive;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const crypto = __importStar(require("crypto"));
const base_1 = require("./base");
var PIIFieldType;
(function (PIIFieldType) {
    PIIFieldType["EMAIL"] = "email";
    PIIFieldType["PHONE"] = "phone";
    PIIFieldType["SSN"] = "ssn";
    PIIFieldType["CREDIT_CARD"] = "credit_card";
    PIIFieldType["ADDRESS"] = "address";
    PIIFieldType["NAME"] = "name";
    PIIFieldType["DATE_OF_BIRTH"] = "date_of_birth";
    PIIFieldType["IP_ADDRESS"] = "ip_address";
    PIIFieldType["MEDICAL_RECORD"] = "medical_record";
})(PIIFieldType || (exports.PIIFieldType = PIIFieldType = {}));
var MaskingStrategy;
(function (MaskingStrategy) {
    MaskingStrategy["FULL"] = "full";
    MaskingStrategy["PARTIAL"] = "partial";
    MaskingStrategy["HASH"] = "hash";
    MaskingStrategy["TOKENIZE"] = "tokenize";
    MaskingStrategy["REDACT"] = "redact";
})(MaskingStrategy || (exports.MaskingStrategy = MaskingStrategy = {}));
var DataClassification;
(function (DataClassification) {
    DataClassification["PUBLIC"] = "public";
    DataClassification["INTERNAL"] = "internal";
    DataClassification["CONFIDENTIAL"] = "confidential";
    DataClassification["RESTRICTED"] = "restricted";
    DataClassification["PHI"] = "phi";
    DataClassification["PII"] = "pii";
})(DataClassification || (exports.DataClassification = DataClassification = {}));
let DataSecurityService = class DataSecurityService extends base_1.BaseService {
    constructor() {
        super("DataSecurityService");
    }
    csrfTokens = new Map();
    rateLimitStore = new Map();
    sensitivePatterns = [
        { fieldName: /^(ssn|social_?security)$/i, type: PIIFieldType.SSN, maskingStrategy: MaskingStrategy.PARTIAL },
        { fieldName: /^(email|e_?mail)$/i, type: PIIFieldType.EMAIL, maskingStrategy: MaskingStrategy.PARTIAL },
        { fieldName: /^(phone|telephone|mobile)$/i, type: PIIFieldType.PHONE, maskingStrategy: MaskingStrategy.PARTIAL },
        { fieldName: /^(credit_?card|card_?number)$/i, type: PIIFieldType.CREDIT_CARD, maskingStrategy: MaskingStrategy.PARTIAL },
        { fieldName: /^(address|street|home_?address)$/i, type: PIIFieldType.ADDRESS, maskingStrategy: MaskingStrategy.PARTIAL },
        { fieldName: /^(first_?name|last_?name|full_?name)$/i, type: PIIFieldType.NAME, maskingStrategy: MaskingStrategy.PARTIAL },
        { fieldName: /^(dob|date_?of_?birth|birth_?date)$/i, type: PIIFieldType.DATE_OF_BIRTH, maskingStrategy: MaskingStrategy.PARTIAL },
        { fieldName: /^(ip|ip_?address)$/i, type: PIIFieldType.IP_ADDRESS, maskingStrategy: MaskingStrategy.HASH },
        { fieldName: /^(mrn|medical_?record)$/i, type: PIIFieldType.MEDICAL_RECORD, maskingStrategy: MaskingStrategy.PARTIAL },
    ];
    maskData(value, type, strategy = MaskingStrategy.PARTIAL) {
        if (!value || typeof value !== 'string')
            return value;
        switch (strategy) {
            case MaskingStrategy.FULL:
                return '*'.repeat(value.length);
            case MaskingStrategy.PARTIAL:
                return this.maskPartial(value, type);
            case MaskingStrategy.HASH:
                return this.hashValue(value);
            case MaskingStrategy.TOKENIZE:
                return this.tokenizeValue(value);
            case MaskingStrategy.REDACT:
                return '[REDACTED]';
            default:
                return this.maskPartial(value, type);
        }
    }
    maskEmail(email) {
        if (!email || !email.includes('@'))
            return email;
        const [localPart, domain] = email.split('@');
        if (localPart.length <= 1) {
            return `*@${domain}`;
        }
        const masked = localPart[0] + '*'.repeat(Math.min(localPart.length - 1, 5));
        return `${masked}@${domain}`;
    }
    maskPhone(phone) {
        if (!phone)
            return phone;
        const digits = phone.replace(/\D/g, '');
        if (digits.length <= 4) {
            return '*'.repeat(digits.length);
        }
        const lastFour = digits.slice(-4);
        const masked = '*'.repeat(digits.length - 4) + lastFour;
        let result = '';
        let digitIndex = 0;
        for (const char of phone) {
            if (/\d/.test(char)) {
                result += masked[digitIndex++];
            }
            else {
                result += char;
            }
        }
        return result;
    }
    maskSSN(ssn) {
        if (!ssn)
            return ssn;
        const digits = ssn.replace(/\D/g, '');
        if (digits.length !== 9) {
            return '*'.repeat(ssn.length);
        }
        const lastFour = digits.slice(-4);
        return `***-**-${lastFour}`;
    }
    maskCreditCard(cardNumber) {
        if (!cardNumber)
            return cardNumber;
        const digits = cardNumber.replace(/\D/g, '');
        if (digits.length < 13 || digits.length > 19) {
            return '*'.repeat(cardNumber.length);
        }
        const lastFour = digits.slice(-4);
        const masked = '*'.repeat(digits.length - 4) + lastFour;
        let result = '';
        let digitIndex = 0;
        for (const char of cardNumber) {
            if (/\d/.test(char)) {
                result += masked[digitIndex++];
            }
            else {
                result += char;
            }
        }
        return result;
    }
    maskIPAddress(ipAddress) {
        if (!ipAddress)
            return ipAddress;
        if (ipAddress.includes('.')) {
            const parts = ipAddress.split('.');
            if (parts.length !== 4)
                return ipAddress;
            return `${parts[0]}.*.*.*`;
        }
        if (ipAddress.includes(':')) {
            const parts = ipAddress.split(':');
            if (parts.length < 3)
                return ipAddress;
            return `${parts[0]}:***:***:***:***:***:***:***`;
        }
        return ipAddress;
    }
    maskAddress(address) {
        if (typeof address === 'string') {
            const parts = address.split(',');
            if (parts.length > 0) {
                parts[0] = '[REDACTED STREET]';
            }
            return parts.join(',');
        }
        const masked = { ...address };
        if (masked.street)
            masked.street = '[REDACTED]';
        if (masked.street2)
            masked.street2 = '[REDACTED]';
        if (masked.addressLine1)
            masked.addressLine1 = '[REDACTED]';
        if (masked.addressLine2)
            masked.addressLine2 = '[REDACTED]';
        if (masked.zip)
            masked.zip = masked.zip.toString().slice(0, 3) + '**';
        if (masked.postalCode)
            masked.postalCode = masked.postalCode.toString().slice(0, 3) + '**';
        return masked;
    }
    maskMedicalRecordNumber(mrn) {
        if (!mrn || mrn.length <= 3) {
            return '*'.repeat(mrn?.length || 0);
        }
        const lastThree = mrn.slice(-3);
        return '*'.repeat(mrn.length - 3) + lastThree;
    }
    redactPII(data, aggressive = false) {
        if (!data || typeof data !== 'object')
            return data;
        const redacted = { ...data };
        for (const [key, value] of Object.entries(redacted)) {
            if (value === null || value === undefined)
                continue;
            const pattern = this.detectSensitiveField(key);
            if (pattern) {
                redacted[key] = this.maskData(typeof value === 'string' ? value : JSON.stringify(value), pattern.type, pattern.maskingStrategy);
            }
            else if (aggressive && this.isPotentiallySecret(key)) {
                redacted[key] = '[REDACTED]';
            }
            else if (typeof value === 'object') {
                redacted[key] = this.redactPII(value, aggressive);
            }
        }
        return redacted;
    }
    redactPIIFromText(text) {
        if (!text)
            return text;
        let redacted = text;
        redacted = redacted.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL REDACTED]');
        redacted = redacted.replace(/\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[PHONE REDACTED]');
        redacted = redacted.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN REDACTED]');
        redacted = redacted.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD REDACTED]');
        redacted = redacted.replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP REDACTED]');
        return redacted;
    }
    detectPIIInText(text) {
        const detected = [];
        if (!text)
            return detected;
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        let match;
        while ((match = emailRegex.exec(text)) !== null) {
            detected.push({
                type: PIIFieldType.EMAIL,
                value: match[0],
                position: match.index,
            });
        }
        const phoneRegex = /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
        while ((match = phoneRegex.exec(text)) !== null) {
            detected.push({
                type: PIIFieldType.PHONE,
                value: match[0],
                position: match.index,
            });
        }
        const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
        while ((match = ssnRegex.exec(text)) !== null) {
            detected.push({
                type: PIIFieldType.SSN,
                value: match[0],
                position: match.index,
            });
        }
        const cardRegex = /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g;
        while ((match = cardRegex.exec(text)) !== null) {
            detected.push({
                type: PIIFieldType.CREDIT_CARD,
                value: match[0],
                position: match.index,
            });
        }
        return detected;
    }
    detectSensitiveField(fieldName) {
        return this.sensitivePatterns.find(pattern => pattern.fieldName.test(fieldName));
    }
    classifyDataSensitivity(data) {
        if (!data || typeof data !== 'object') {
            return DataClassification.PUBLIC;
        }
        const fieldNames = Object.keys(data);
        let maxClassification = DataClassification.PUBLIC;
        for (const fieldName of fieldNames) {
            const pattern = this.detectSensitiveField(fieldName);
            if (pattern) {
                switch (pattern.type) {
                    case PIIFieldType.SSN:
                    case PIIFieldType.MEDICAL_RECORD:
                        maxClassification = DataClassification.PHI;
                        return maxClassification;
                    case PIIFieldType.CREDIT_CARD:
                        if (maxClassification < DataClassification.RESTRICTED) {
                            maxClassification = DataClassification.RESTRICTED;
                        }
                        break;
                    case PIIFieldType.EMAIL:
                    case PIIFieldType.PHONE:
                    case PIIFieldType.ADDRESS:
                    case PIIFieldType.NAME:
                    case PIIFieldType.DATE_OF_BIRTH:
                        if (maxClassification < DataClassification.PII) {
                            maxClassification = DataClassification.PII;
                        }
                        break;
                }
            }
        }
        return maxClassification;
    }
    scanForSensitiveFields(data, prefix = '') {
        const sensitiveFields = [];
        for (const [key, value] of Object.entries(data)) {
            const fullPath = prefix ? `${prefix}.${key}` : key;
            if (this.detectSensitiveField(key)) {
                sensitiveFields.push(fullPath);
            }
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                sensitiveFields.push(...this.scanForSensitiveFields(value, fullPath));
            }
            else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    if (item && typeof item === 'object') {
                        sensitiveFields.push(...this.scanForSensitiveFields(item, `${fullPath}[${index}]`));
                    }
                });
            }
        }
        return sensitiveFields;
    }
    safeSerialize(data, maxDepth = 3) {
        const seen = new WeakSet();
        const replacer = (key, value, depth = 0) => {
            if (depth > maxDepth) {
                return '[Max Depth Reached]';
            }
            if (value === null || value === undefined) {
                return value;
            }
            if (typeof value === 'object') {
                if (seen.has(value)) {
                    return '[Circular Reference]';
                }
                seen.add(value);
            }
            if (key && this.detectSensitiveField(key)) {
                return '[REDACTED]';
            }
            if (key && /password|secret|token|key|auth/i.test(key)) {
                return '[REDACTED]';
            }
            if (typeof value === 'object' && !Array.isArray(value)) {
                const redacted = {};
                for (const [k, v] of Object.entries(value)) {
                    redacted[k] = replacer(k, v, depth + 1);
                }
                return redacted;
            }
            return value;
        };
        try {
            return JSON.stringify(replacer('', data, 0), null, 2);
        }
        catch (error) {
            return '[Serialization Error]';
        }
    }
    serializeForExternalAPI(data, allowedClassification) {
        const classification = this.classifyDataSensitivity(data);
        const classificationLevel = {
            [DataClassification.PUBLIC]: 0,
            [DataClassification.INTERNAL]: 1,
            [DataClassification.CONFIDENTIAL]: 2,
            [DataClassification.PII]: 3,
            [DataClassification.RESTRICTED]: 4,
            [DataClassification.PHI]: 5,
        };
        if (classificationLevel[classification] > classificationLevel[allowedClassification]) {
            return this.handleError('Operation failed', new Error('Data classification exceeds allowed level for external API'));
        }
        return this.redactPII(data);
    }
    sanitizeXSS(input) {
        if (!input || typeof input !== 'string')
            return input;
        const MAX_INPUT_LENGTH = 100000;
        if (input.length > MAX_INPUT_LENGTH) {
            this.logWarning(`Input exceeds maximum length: ${input.length}`);
            return this.handleError('Operation failed', new Error('Input exceeds maximum allowed length'));
        }
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }
    sanitizeHTML(html, allowedTags = ['b', 'i', 'em', 'strong', 'p']) {
        if (!html || typeof html !== 'string')
            return html;
        const MAX_HTML_LENGTH = 500000;
        if (html.length > MAX_HTML_LENGTH) {
            this.logWarning(`HTML input exceeds maximum length: ${html.length}`);
            return this.handleError('Operation failed', new Error('HTML input exceeds maximum allowed length'));
        }
        const tagPattern = /<(\/?)([\w]+)([^>]*)>/g;
        let result = html.replace(tagPattern, (match, slash, tag, attrs) => {
            if (allowedTags.includes(tag.toLowerCase())) {
                let safeAttrs = attrs.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
                safeAttrs = safeAttrs.replace(/javascript:/gi, '');
                safeAttrs = safeAttrs.replace(/data:/gi, '');
                safeAttrs = safeAttrs.replace(/style\s*=\s*["'][^"']*["']/gi, '');
                return `<${slash}${tag}${safeAttrs}>`;
            }
            return '';
        });
        result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        return result;
    }
    sanitizeObject(data) {
        if (!data || typeof data !== 'object')
            return data;
        const sanitized = { ...data };
        for (const [key, value] of Object.entries(sanitized)) {
            if (typeof value === 'string') {
                sanitized[key] = this.sanitizeXSS(value);
            }
            else if (typeof value === 'object' && value !== null) {
                sanitized[key] = Array.isArray(value)
                    ? value.map(item => typeof item === 'object' ? this.sanitizeObject(item) : item)
                    : this.sanitizeObject(value);
            }
        }
        return sanitized;
    }
    sanitizeSQLIdentifier(identifier) {
        if (!identifier || typeof identifier !== 'string') {
            return this.handleError('Operation failed', new Error('SQL identifier cannot be empty or non-string'));
        }
        const MAX_IDENTIFIER_LENGTH = 128;
        if (identifier.length > MAX_IDENTIFIER_LENGTH) {
            throw new Error(`SQL identifier exceeds maximum length of ${MAX_IDENTIFIER_LENGTH}`);
        }
        if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(identifier)) {
            this.logWarning(`Invalid SQL identifier attempted: ${identifier}`);
            return this.handleError('Operation failed', new Error('Invalid SQL identifier: must start with letter/underscore and contain only alphanumeric/underscore/$ characters'));
        }
        const SQL_KEYWORDS = [
            'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER',
            'TRUNCATE', 'EXEC', 'EXECUTE', 'UNION', 'WHERE', 'FROM', 'JOIN',
        ];
        if (SQL_KEYWORDS.includes(identifier.toUpperCase())) {
            return this.handleError('Operation failed', new Error('SQL identifier cannot be a reserved SQL keyword'));
        }
        return identifier;
    }
    escapeSQLLikePattern(value) {
        if (!value || typeof value !== 'string')
            return value;
        const MAX_PATTERN_LENGTH = 1000;
        if (value.length > MAX_PATTERN_LENGTH) {
            return this.handleError('Operation failed', new Error('SQL LIKE pattern exceeds maximum allowed length'));
        }
        return value
            .replace(/\\/g, '\\\\')
            .replace(/%/g, '\\%')
            .replace(/_/g, '\\_');
    }
    validateSQLOrderBy(orderBy, allowedColumns) {
        if (!orderBy || typeof orderBy !== 'string') {
            return this.handleError('Operation failed', new Error('ORDER BY clause cannot be empty'));
        }
        if (!allowedColumns || !Array.isArray(allowedColumns) || allowedColumns.length === 0) {
            return this.handleError('Operation failed', new Error('allowedColumns must be a non-empty array'));
        }
        const parts = orderBy.toLowerCase().trim().split(/\s+/);
        if (parts.length > 2) {
            this.logWarning(`Invalid ORDER BY clause attempted: ${orderBy}`);
            return this.handleError('Operation failed', new Error('Invalid ORDER BY clause: too many parts'));
        }
        const column = parts[0];
        const direction = parts[1] || 'asc';
        if (!allowedColumns.map(c => c.toLowerCase()).includes(column)) {
            this.logWarning(`Unauthorized column in ORDER BY: ${column}`);
            throw new Error(`Column "${column}" not allowed in ORDER BY. Allowed: ${allowedColumns.join(', ')}`);
        }
        if (!['asc', 'desc'].includes(direction)) {
            throw new Error(`Invalid sort direction: ${direction}. Must be ASC or DESC`);
        }
        const sanitizedColumn = this.sanitizeSQLIdentifier(column);
        return `${sanitizedColumn} ${direction.toUpperCase()}`;
    }
    async generateCSRFToken(sessionId, userId, expiresInMs = 3600000) {
        const tokenBytes = crypto.randomBytes(32);
        const token = tokenBytes.toString('base64url');
        const csrfToken = {
            token,
            expires: new Date(Date.now() + expiresInMs),
            userId,
            sessionId,
        };
        this.csrfTokens.set(token, csrfToken);
        this.cleanupExpiredCSRFTokens();
        return csrfToken;
    }
    validateCSRFToken(token, sessionId) {
        if (!token || typeof token !== 'string' || !sessionId || typeof sessionId !== 'string') {
            return false;
        }
        const storedToken = this.csrfTokens.get(token);
        if (!storedToken) {
            return false;
        }
        if (storedToken.expires < new Date()) {
            this.csrfTokens.delete(token);
            return false;
        }
        try {
            const storedBuffer = Buffer.from(storedToken.sessionId);
            const providedBuffer = Buffer.from(sessionId);
            if (storedBuffer.length !== providedBuffer.length) {
                return false;
            }
            return crypto.timingSafeEqual(storedBuffer, providedBuffer);
        }
        catch (error) {
            this.logWarning('CSRF token validation error', error);
            return false;
        }
    }
    invalidateCSRFToken(token) {
        this.csrfTokens.delete(token);
    }
    checkRateLimit(key, config) {
        const now = Date.now();
        const windowStart = now - config.windowMs;
        let requests = this.rateLimitStore.get(key) || [];
        requests = requests.filter(timestamp => timestamp > windowStart);
        if (requests.length >= config.maxRequests) {
            return false;
        }
        requests.push(now);
        this.rateLimitStore.set(key, requests);
        this.cleanupRateLimitStore();
        return true;
    }
    getRateLimitStatus(key, config) {
        const now = Date.now();
        const windowStart = now - config.windowMs;
        const requests = (this.rateLimitStore.get(key) || [])
            .filter(timestamp => timestamp > windowStart);
        const remaining = Math.max(0, config.maxRequests - requests.length);
        const resetAt = new Date(now + config.windowMs);
        return { remaining, resetAt };
    }
    async logSensitiveAccess(entry) {
        const fullEntry = {
            ...entry,
            timestamp: new Date(),
        };
        this.logInfo({
            message: 'Sensitive data access',
            ...fullEntry,
            metadata: fullEntry.metadata ? this.redactPII(fullEntry.metadata) : undefined,
        });
    }
    async logFailedAccess(userId, resource, reason) {
        await this.logSensitiveAccess({
            userId,
            action: 'access_denied',
            resource,
            classification: DataClassification.RESTRICTED,
            success: false,
            metadata: { reason },
        });
        this.logWarning(`Failed access attempt: ${userId} -> ${resource}: ${reason}`);
    }
    checkDataAccess(userPermissions, dataClassification) {
        const requiredPermissions = {
            [DataClassification.PUBLIC]: [],
            [DataClassification.INTERNAL]: ['data:read:internal'],
            [DataClassification.CONFIDENTIAL]: ['data:read:confidential'],
            [DataClassification.PII]: ['data:read:pii'],
            [DataClassification.RESTRICTED]: ['data:read:restricted'],
            [DataClassification.PHI]: ['data:read:phi'],
        };
        const required = requiredPermissions[dataClassification];
        const hasPermission = required.length === 0 ||
            required.some(perm => userPermissions.includes(perm));
        return {
            allowed: hasPermission,
            reason: hasPermission ? undefined : 'Insufficient permissions',
            requiredPermissions: hasPermission ? undefined : required,
            classification: dataClassification,
        };
    }
    applyColumnLevelSecurity(data, userPermissions) {
        const filtered = {};
        for (const [key, value] of Object.entries(data)) {
            const pattern = this.detectSensitiveField(key);
            if (!pattern) {
                filtered[key] = value;
                continue;
            }
            const requiredPermission = `data:read:${pattern.type}`;
            if (userPermissions.includes(requiredPermission)) {
                filtered[key] = value;
            }
            else {
                filtered[key] = this.maskData(typeof value === 'string' ? value : JSON.stringify(value), pattern.type, MaskingStrategy.REDACT);
            }
        }
        return filtered;
    }
    applyRowLevelSecurity(rows, userId, ownerField = 'userId') {
        return rows.filter(row => row[ownerField] === userId);
    }
    validateExternalTransmission(data, allowedClassifications) {
        const classification = this.classifyDataSensitivity(data);
        const violations = [];
        if (!allowedClassifications.includes(classification)) {
            violations.push(`Data classification ${classification} not allowed for external transmission`);
        }
        const sensitiveFields = this.scanForSensitiveFields(data);
        if (sensitiveFields.length > 0 && !allowedClassifications.includes(DataClassification.PHI)) {
            violations.push(`Sensitive fields detected: ${sensitiveFields.join(', ')}`);
        }
        return {
            safe: violations.length === 0,
            violations,
        };
    }
    detectDataExfiltration(data, maxSize = 1048576) {
        const dataSize = JSON.stringify(data).length;
        if (dataSize > maxSize) {
            this.logWarning(`Potential data exfiltration: ${dataSize} bytes`);
            return true;
        }
        const piiCount = data.reduce((count, item) => {
            const sensitiveFields = this.scanForSensitiveFields(item);
            return count + sensitiveFields.length;
        }, 0);
        const piiThreshold = data.length * 2;
        if (piiCount > piiThreshold) {
            this.logWarning(`Potential PII exfiltration: ${piiCount} sensitive fields in ${data.length} records`);
            return true;
        }
        return false;
    }
    maskPartial(value, type) {
        switch (type) {
            case PIIFieldType.EMAIL:
                return this.maskEmail(value);
            case PIIFieldType.PHONE:
                return this.maskPhone(value);
            case PIIFieldType.SSN:
                return this.maskSSN(value);
            case PIIFieldType.CREDIT_CARD:
                return this.maskCreditCard(value);
            case PIIFieldType.IP_ADDRESS:
                return this.maskIPAddress(value);
            case PIIFieldType.MEDICAL_RECORD:
                return this.maskMedicalRecordNumber(value);
            default:
                return value.length > 4
                    ? value.slice(0, 1) + '*'.repeat(value.length - 2) + value.slice(-1)
                    : '*'.repeat(value.length);
        }
    }
    hashValue(value) {
        return crypto.createHash('sha256').update(value).digest('hex').slice(0, 16);
    }
    tokenizeValue(value) {
        const token = crypto.randomBytes(16).toString('hex');
        return `TOKEN_${token}`;
    }
    isPotentiallySecret(fieldName) {
        const secretPatterns = [
            /password/i,
            /secret/i,
            /token/i,
            /key/i,
            /auth/i,
            /credential/i,
            /api_?key/i,
        ];
        return secretPatterns.some(pattern => pattern.test(fieldName));
    }
    cleanupExpiredCSRFTokens() {
        const now = new Date();
        for (const [token, data] of this.csrfTokens.entries()) {
            if (data.expires < now) {
                this.csrfTokens.delete(token);
            }
        }
    }
    cleanupRateLimitStore() {
        const now = Date.now();
        const maxAge = 3600000;
        for (const [key, requests] of this.rateLimitStore.entries()) {
            const validRequests = requests.filter(timestamp => timestamp > now - maxAge);
            if (validRequests.length === 0) {
                this.rateLimitStore.delete(key);
            }
            else {
                this.rateLimitStore.set(key, validRequests);
            }
        }
    }
};
exports.DataSecurityService = DataSecurityService;
exports.DataSecurityService = DataSecurityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DataSecurityService);
let PIIRedactionInterceptor = class PIIRedactionInterceptor {
    dataSecurityService;
    constructor(dataSecurityService) {
        this.dataSecurityService = dataSecurityService;
    }
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)(data => {
            if (!data)
                return data;
            if (Array.isArray(data)) {
                return data.map(item => typeof item === 'object' ? this.dataSecurityService.redactPII(item) : item);
            }
            if (typeof data === 'object') {
                return this.dataSecurityService.redactPII(data);
            }
            return data;
        }));
    }
};
exports.PIIRedactionInterceptor = PIIRedactionInterceptor;
exports.PIIRedactionInterceptor = PIIRedactionInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [DataSecurityService])
], PIIRedactionInterceptor);
function Sensitive(type, strategy = MaskingStrategy.PARTIAL) {
    return function (target, propertyKey) {
        Reflect.defineMetadata('sensitive:type', type, target, propertyKey);
        Reflect.defineMetadata('sensitive:strategy', strategy, target, propertyKey);
    };
}
//# sourceMappingURL=data-security.service.js.map