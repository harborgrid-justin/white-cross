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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigWithFallback = getConfigWithFallback;
exports.validateConfigurationValue = validateConfigurationValue;
exports.encryptSensitiveConfig = encryptSensitiveConfig;
exports.decryptSensitiveConfig = decryptSensitiveConfig;
exports.getAllConfigWithValidation = getAllConfigWithValidation;
exports.clearConfigCache = clearConfigCache;
exports.getConfigStats = getConfigStats;
const crypto = __importStar(require("crypto"));
const configCache = new Map();
const ENCRYPTION_KEY = process.env.CONFIG_ENCRYPTION_KEY;
if (!ENCRYPTION_KEY && process.env.NODE_ENV === 'production') {
    throw new Error('SECURITY ERROR: CONFIG_ENCRYPTION_KEY must be set in production. ' +
        'This key is used to encrypt sensitive configuration values.');
}
function getConfigWithFallback(key, defaultValue = null, useCache = true, cacheTTL = 5 * 60 * 1000) {
    if (!key || typeof key !== 'string') {
        return defaultValue;
    }
    if (useCache && configCache.has(key)) {
        const cached = configCache.get(key);
        if (Date.now() - cached.timestamp < cached.ttl) {
            return cached.value;
        }
        configCache.delete(key);
    }
    let value = defaultValue;
    try {
        const envKey = key.toUpperCase().replace(/\./g, '_');
        if (process.env[envKey] !== undefined) {
            value = parseEnvironmentValue(process.env[envKey]);
        }
        else {
            value = getNestedValue(process.env, key) || defaultValue;
        }
        if (useCache) {
            configCache.set(key, {
                value,
                timestamp: Date.now(),
                ttl: cacheTTL,
            });
        }
    }
    catch (error) {
        console.warn(`Error retrieving configuration for key '${key}':`, error);
        value = defaultValue;
    }
    return value;
}
function validateConfigurationValue(key, value, schema) {
    const errors = validateValue(key, value, schema);
    if (errors.length > 0) {
        console.warn(`Configuration validation errors for '${key}':`, errors);
        return false;
    }
    return true;
}
function encryptSensitiveConfig(value, algorithm = 'aes-256-gcm') {
    if (!value || typeof value !== 'string') {
        throw new Error('Value must be a non-empty string');
    }
    if (!ENCRYPTION_KEY) {
        throw new Error('CONFIG_ENCRYPTION_KEY must be set to encrypt configuration values');
    }
    try {
        const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(value, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = algorithm.includes('gcm')
            ? cipher.getAuthTag()
            : null;
        const parts = [
            algorithm,
            iv.toString('hex'),
            authTag ? authTag.toString('hex') : '',
            encrypted,
        ].join(':');
        return parts;
    }
    catch (error) {
        throw new Error(`Failed to encrypt configuration value: ${error instanceof Error ? error.message : String(error)}`);
    }
}
function decryptSensitiveConfig(encryptedValue) {
    if (!encryptedValue || typeof encryptedValue !== 'string') {
        throw new Error('Encrypted value must be a non-empty string');
    }
    if (!ENCRYPTION_KEY) {
        throw new Error('CONFIG_ENCRYPTION_KEY must be set to decrypt configuration values');
    }
    try {
        const parts = encryptedValue.split(':');
        if (parts.length !== 4) {
            throw new Error('Invalid encrypted value format');
        }
        const [algorithm, ivHex, authTagHex, encrypted] = parts;
        if (!algorithm || !ivHex || !encrypted) {
            throw new Error('Invalid encrypted value format');
        }
        const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        if (algorithm.includes('gcm') && authTagHex) {
            const authTag = Buffer.from(authTagHex, 'hex');
            decipher.setAuthTag(authTag);
        }
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    catch (error) {
        throw new Error(`Failed to decrypt configuration value: ${error instanceof Error ? error.message : String(error)}`);
    }
}
function getAllConfigWithValidation(schema) {
    const config = {};
    const errors = [];
    for (const [key, keySchema] of Object.entries(schema)) {
        const value = getConfigWithFallback(key);
        config[key] = value;
        const validationErrors = validateValue(key, value, keySchema);
        errors.push(...validationErrors);
    }
    return { config, errors };
}
function clearConfigCache(key) {
    if (key) {
        configCache.delete(key);
    }
    else {
        configCache.clear();
    }
}
function getConfigStats() {
    const cachedKeys = Array.from(configCache.keys());
    const memoryUsage = JSON.stringify(Array.from(configCache.entries())).length;
    return {
        cacheSize: configCache.size,
        cachedKeys,
        memoryUsage,
    };
}
function parseEnvironmentValue(value) {
    if (value === 'true')
        return true;
    if (value === 'false')
        return false;
    if (value === 'null')
        return null;
    if (value === 'undefined')
        return undefined;
    if (/^-?\d+$/.test(value)) {
        return parseInt(value, 10);
    }
    if (/^-?\d*\.\d+$/.test(value)) {
        return parseFloat(value);
    }
    if ((value.startsWith('{') && value.endsWith('}')) ||
        (value.startsWith('[') && value.endsWith(']'))) {
        try {
            return JSON.parse(value);
        }
        catch {
        }
    }
    return value;
}
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
}
function validateValue(key, value, schema) {
    const errors = [];
    if (schema.required && (value === null || value === undefined)) {
        errors.push({
            key,
            value,
            error: 'Required configuration value is missing',
            severity: 'error',
        });
        return errors;
    }
    if (value === null || value === undefined) {
        return errors;
    }
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (actualType !== schema.type) {
        errors.push({
            key,
            value,
            error: `Expected type '${schema.type}' but got '${actualType}'`,
            severity: 'error',
        });
        return errors;
    }
    if (schema.type === 'string' && typeof value === 'string') {
        if (schema.minLength && value.length < schema.minLength) {
            errors.push({
                key,
                value,
                error: `String length ${value.length} is less than minimum ${schema.minLength}`,
                severity: 'error',
            });
        }
        if (schema.maxLength && value.length > schema.maxLength) {
            errors.push({
                key,
                value,
                error: `String length ${value.length} exceeds maximum ${schema.maxLength}`,
                severity: 'error',
            });
        }
        if (schema.pattern && !schema.pattern.test(value)) {
            errors.push({
                key,
                value,
                error: `String does not match required pattern`,
                severity: 'error',
            });
        }
    }
    if (schema.type === 'number' && typeof value === 'number') {
        if (schema.min !== undefined && value < schema.min) {
            errors.push({
                key,
                value,
                error: `Number ${value} is less than minimum ${schema.min}`,
                severity: 'error',
            });
        }
        if (schema.max !== undefined && value > schema.max) {
            errors.push({
                key,
                value,
                error: `Number ${value} exceeds maximum ${schema.max}`,
                severity: 'error',
            });
        }
    }
    if (schema.enum && !schema.enum.includes(value)) {
        errors.push({
            key,
            value,
            error: `Value '${value}' is not in allowed enum values: ${schema.enum.join(', ')}`,
            severity: 'error',
        });
    }
    if (schema.type === 'object' &&
        schema.properties &&
        typeof value === 'object' &&
        value !== null) {
        const objValue = value;
        for (const [propKey, propSchema] of Object.entries(schema.properties)) {
            const propValue = objValue[propKey];
            const propErrors = validateValue(`${key}.${propKey}`, propValue, propSchema);
            errors.push(...propErrors);
        }
    }
    return errors;
}
//# sourceMappingURL=helpers.js.map