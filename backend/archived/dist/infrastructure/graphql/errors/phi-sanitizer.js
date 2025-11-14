"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizePHI = sanitizePHI;
exports.sanitizeGraphQLError = sanitizeGraphQLError;
exports.containsPHI = containsPHI;
const PHI_PATTERNS = [
    {
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        replacement: '[EMAIL]',
    },
    { pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, replacement: '[PHONE]' },
    {
        pattern: /\b\+?1?\s*\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\b/g,
        replacement: '[PHONE]',
    },
    { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[SSN]' },
    {
        pattern: /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}\b/g,
        replacement: '[DATE]',
    },
    {
        pattern: /\b\d{4}[\/\-](0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12][0-9]|3[01])\b/g,
        replacement: '[DATE]',
    },
    { pattern: /\bMRN[:\s]*[A-Z0-9-]+/gi, replacement: '[MRN]' },
    {
        pattern: /\bmedical[\s_-]?record[\s_-]?number[:\s]*[A-Z0-9-]+/gi,
        replacement: '[MRN]',
    },
    {
        pattern: /\bpatient[\s_-]?id[:\s]*[A-Z0-9-]+/gi,
        replacement: '[PATIENT_ID]',
    },
    {
        pattern: /\bstudent[\s_-]?id[:\s]*[A-Z0-9-]+/gi,
        replacement: '[STUDENT_ID]',
    },
    {
        pattern: /\bstudent[\s_-]?number[:\s]*[A-Z0-9-]+/gi,
        replacement: '[STUDENT_ID]',
    },
    {
        pattern: /\b\d+\s+[A-Za-z0-9\s,]+\s+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Circle|Cir)\b/gi,
        replacement: '[ADDRESS]',
    },
    { pattern: /\b\d{5}(-\d{4})?\b/g, replacement: '[ZIP]' },
    { pattern: /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, replacement: '[NAME]' },
    { pattern: /\b[A-Z][a-z]+,\s*[A-Z][a-z]+\b/g, replacement: '[NAME]' },
    { pattern: /\b[A-Z]\d{2}(\.\d{1,2})?\b/g, replacement: '[DIAGNOSIS_CODE]' },
    { pattern: /\bCPT[:\s]*\d{5}\b/gi, replacement: '[CPT_CODE]' },
    {
        pattern: /\b[A-Z][a-z]+\s+\d+\s*(mg|mcg|ml|g|units?)\b/gi,
        replacement: '[MEDICATION]',
    },
];
const SENSITIVE_FIELD_NAMES = [
    'firstName',
    'lastName',
    'fullName',
    'email',
    'phone',
    'dateOfBirth',
    'ssn',
    'socialSecurityNumber',
    'address',
    'city',
    'state',
    'zip',
    'medicalRecordNum',
    'studentNumber',
    'diagnosis',
    'medication',
    'allergen',
    'chronicCondition',
];
function sanitizePHI(text) {
    if (!text)
        return text;
    let sanitized = text;
    for (const { pattern, replacement } of PHI_PATTERNS) {
        sanitized = sanitized.replace(pattern, replacement);
    }
    for (const fieldName of SENSITIVE_FIELD_NAMES) {
        const fieldPattern = new RegExp(`${fieldName}[\\s]*[:=][\\s]*(['"]?)([^'"\\s,}]+)\\1`, 'gi');
        sanitized = sanitized.replace(fieldPattern, `${fieldName}: [REDACTED]`);
    }
    sanitized = sanitizeSQL(sanitized);
    return sanitized;
}
function sanitizeSQL(text) {
    let sanitized = text.replace(/WHERE\s+[^=]+\s*=\s*['"]?([^'";\s]+)['"]?/gi, 'WHERE [FIELD] = [REDACTED]');
    sanitized = sanitized.replace(/VALUES\s*\([^)]+\)/gi, 'VALUES ([REDACTED])');
    sanitized = sanitized.replace(/SET\s+([^=]+)\s*=\s*['"]?([^'";\s,]+)['"]?/gi, 'SET $1 = [REDACTED]');
    return sanitized;
}
function sanitizeGraphQLError(error) {
    const sanitizedError = { ...error };
    if (sanitizedError.message) {
        sanitizedError.message = sanitizePHI(sanitizedError.message);
    }
    if (sanitizedError.extensions) {
        if (sanitizedError.extensions.exception?.message) {
            sanitizedError.extensions.exception.message = sanitizePHI(sanitizedError.extensions.exception.message);
        }
        if (sanitizedError.extensions.exception?.stacktrace) {
            sanitizedError.extensions.exception.stacktrace =
                sanitizedError.extensions.exception.stacktrace.map((line) => sanitizePHI(line));
        }
        if (sanitizedError.extensions.originalError?.message) {
            sanitizedError.extensions.originalError.message = sanitizePHI(sanitizedError.extensions.originalError.message);
        }
        if (sanitizedError.extensions.validationErrors) {
            sanitizedError.extensions.validationErrors =
                sanitizedError.extensions.validationErrors.map((validationError) => ({
                    ...validationError,
                    message: sanitizePHI(validationError.message || ''),
                    value: '[REDACTED]',
                }));
        }
    }
    return sanitizedError;
}
function containsPHI(text) {
    if (!text)
        return false;
    for (const { pattern } of PHI_PATTERNS) {
        if (pattern.test(text)) {
            return true;
        }
    }
    for (const fieldName of SENSITIVE_FIELD_NAMES) {
        const fieldPattern = new RegExp(`${fieldName}[\\s]*[:=][\\s]*(['"]?)([^'"\\s,}]+)\\1`, 'i');
        if (fieldPattern.test(text)) {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=phi-sanitizer.js.map