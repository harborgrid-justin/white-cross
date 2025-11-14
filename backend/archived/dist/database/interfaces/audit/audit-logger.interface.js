"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeSensitiveData = sanitizeSensitiveData;
const database_enums_1 = require("../../types/database.enums");
function sanitizeSensitiveData(data) {
    if (typeof data !== 'object' || data === null) {
        return data;
    }
    const sanitized = Array.isArray(data)
        ? []
        : {};
    for (const key in data) {
        const value = data[key];
        if (database_enums_1.SENSITIVE_FIELDS.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
            sanitized[key] = '[REDACTED]';
        }
        else if (typeof value === 'object' && value !== null) {
            sanitized[key] =
                sanitizeSensitiveData(value);
        }
        else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}
//# sourceMappingURL=audit-logger.interface.js.map