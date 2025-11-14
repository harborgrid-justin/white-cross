"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REQUIRED_ENV_VARS = void 0;
exports.parseEnvInt = parseEnvInt;
exports.parseEnvBoolean = parseEnvBoolean;
exports.parseEnvArray = parseEnvArray;
exports.validateRequiredEnvVars = validateRequiredEnvVars;
exports.REQUIRED_ENV_VARS = [
    'NODE_ENV',
    'DB_HOST',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET',
];
function parseEnvInt(value, defaultValue) {
    if (!value)
        return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
}
function parseEnvBoolean(value, defaultValue) {
    if (!value)
        return defaultValue;
    return value.toLowerCase() === 'true' || value === '1';
}
function parseEnvArray(value, separator = ',') {
    if (!value)
        return [];
    return value.split(separator).map((item) => item.trim());
}
function validateRequiredEnvVars() {
    const missing = exports.REQUIRED_ENV_VARS.filter((varName) => !process.env[varName]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}
//# sourceMappingURL=environment.js.map