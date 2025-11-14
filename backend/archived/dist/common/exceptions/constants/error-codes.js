"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = exports.ComplianceErrorCodes = exports.SystemErrorCodes = exports.SecurityErrorCodes = exports.HealthcareErrorCodes = exports.BusinessErrorCodes = exports.ValidationErrorCodes = exports.AuthzErrorCodes = exports.AuthErrorCodes = void 0;
exports.getErrorCodeCategory = getErrorCodeCategory;
exports.isClientError = isClientError;
exports.isServerError = isServerError;
exports.getHttpStatusForErrorCode = getHttpStatusForErrorCode;
exports.AuthErrorCodes = {
    INVALID_CREDENTIALS: 'AUTH_001',
    ACCOUNT_LOCKED: 'AUTH_002',
    ACCOUNT_DISABLED: 'AUTH_003',
    TOKEN_EXPIRED: 'AUTH_004',
    TOKEN_INVALID: 'AUTH_005',
    REFRESH_TOKEN_INVALID: 'AUTH_006',
    SESSION_EXPIRED: 'AUTH_007',
    MFA_REQUIRED: 'AUTH_008',
    MFA_INVALID: 'AUTH_009',
    PASSWORD_EXPIRED: 'AUTH_010',
    WEAK_PASSWORD: 'AUTH_011',
};
exports.AuthzErrorCodes = {
    INSUFFICIENT_PERMISSIONS: 'AUTHZ_001',
    ROLE_REQUIRED: 'AUTHZ_002',
    RESOURCE_FORBIDDEN: 'AUTHZ_003',
    ORGANIZATION_ACCESS_DENIED: 'AUTHZ_004',
    FEATURE_NOT_ENABLED: 'AUTHZ_005',
    IP_RESTRICTED: 'AUTHZ_006',
    TIME_RESTRICTED: 'AUTHZ_007',
};
exports.ValidationErrorCodes = {
    REQUIRED_FIELD_MISSING: 'VALID_001',
    INVALID_FORMAT: 'VALID_002',
    INVALID_TYPE: 'VALID_003',
    OUT_OF_RANGE: 'VALID_004',
    INVALID_LENGTH: 'VALID_005',
    INVALID_PATTERN: 'VALID_006',
    INVALID_ENUM_VALUE: 'VALID_007',
    INVALID_EMAIL: 'VALID_008',
    INVALID_PHONE: 'VALID_009',
    INVALID_DATE: 'VALID_010',
    INVALID_SSN: 'VALID_011',
    INVALID_MRN: 'VALID_012',
    INVALID_NPI: 'VALID_013',
    INVALID_ICD10: 'VALID_014',
    INVALID_DOSAGE: 'VALID_015',
    INVALID_FILE_TYPE: 'VALID_016',
    FILE_TOO_LARGE: 'VALID_017',
    INVALID_JSON: 'VALID_018',
    INVALID_UUID: 'VALID_019',
    DUPLICATE_ENTRY: 'VALID_020',
};
exports.BusinessErrorCodes = {
    RESOURCE_NOT_FOUND: 'BUSINESS_001',
    RESOURCE_ALREADY_EXISTS: 'BUSINESS_002',
    INVALID_STATE_TRANSITION: 'BUSINESS_003',
    CONSTRAINT_VIOLATION: 'BUSINESS_004',
    CONCURRENT_MODIFICATION: 'BUSINESS_005',
    DEPENDENCY_EXISTS: 'BUSINESS_006',
    DEPENDENCY_MISSING: 'BUSINESS_007',
    QUOTA_EXCEEDED: 'BUSINESS_008',
    OPERATION_NOT_ALLOWED: 'BUSINESS_009',
    INVALID_OPERATION: 'BUSINESS_010',
};
exports.HealthcareErrorCodes = {
    CONSENT_REQUIRED: 'HEALTH_001',
    CONSENT_EXPIRED: 'HEALTH_002',
    CONSENT_REVOKED: 'HEALTH_003',
    PARENT_AUTHORIZATION_REQUIRED: 'HEALTH_004',
    DRUG_INTERACTION_DETECTED: 'HEALTH_101',
    ALLERGY_CONFLICT: 'HEALTH_102',
    DOSAGE_OUT_OF_RANGE: 'HEALTH_103',
    DUPLICATE_MEDICATION: 'HEALTH_104',
    CONTRAINDICATION_DETECTED: 'HEALTH_105',
    AGE_RESTRICTION_VIOLATED: 'HEALTH_106',
    INVALID_DIAGNOSIS_CODE: 'HEALTH_201',
    INCOMPLETE_MEDICAL_HISTORY: 'HEALTH_202',
    VITAL_SIGNS_OUT_OF_RANGE: 'HEALTH_203',
    VACCINATION_OVERDUE: 'HEALTH_204',
    VACCINATION_TOO_SOON: 'HEALTH_205',
    APPOINTMENT_CONFLICT: 'HEALTH_301',
    APPOINTMENT_PAST_DUE: 'HEALTH_302',
    NO_AVAILABLE_SLOTS: 'HEALTH_303',
    PROVIDER_UNAVAILABLE: 'HEALTH_304',
    PRESCRIPTION_EXPIRED: 'HEALTH_401',
    REFILL_NOT_ALLOWED: 'HEALTH_402',
    MEDICATION_DISCONTINUED: 'HEALTH_403',
    CONTROLLED_SUBSTANCE_VIOLATION: 'HEALTH_404',
    INCIDENT_REQUIRES_REVIEW: 'HEALTH_501',
    INCIDENT_NOTIFICATION_REQUIRED: 'HEALTH_502',
    OPERATION_NOT_ALLOWED: 'HEALTH_601',
};
exports.SecurityErrorCodes = {
    RATE_LIMIT_EXCEEDED: 'SECURITY_001',
    SUSPICIOUS_ACTIVITY_DETECTED: 'SECURITY_002',
    XSS_ATTEMPT_DETECTED: 'SECURITY_003',
    SQL_INJECTION_ATTEMPT: 'SECURITY_004',
    CSRF_TOKEN_INVALID: 'SECURITY_005',
    CSRF_TOKEN_MISSING: 'SECURITY_006',
    IP_BLACKLISTED: 'SECURITY_007',
    USER_AGENT_BLOCKED: 'SECURITY_008',
    ENCRYPTION_FAILED: 'SECURITY_009',
    DECRYPTION_FAILED: 'SECURITY_010',
};
exports.SystemErrorCodes = {
    INTERNAL_SERVER_ERROR: 'SYSTEM_001',
    SERVICE_UNAVAILABLE: 'SYSTEM_002',
    DATABASE_ERROR: 'SYSTEM_003',
    DATABASE_CONNECTION_FAILED: 'SYSTEM_004',
    CACHE_ERROR: 'SYSTEM_005',
    EXTERNAL_SERVICE_ERROR: 'SYSTEM_006',
    TIMEOUT: 'SYSTEM_007',
    CONFIGURATION_ERROR: 'SYSTEM_008',
    QUEUE_ERROR: 'SYSTEM_009',
    FILE_SYSTEM_ERROR: 'SYSTEM_010',
};
exports.ComplianceErrorCodes = {
    HIPAA_VIOLATION: 'COMPLY_001',
    FERPA_VIOLATION: 'COMPLY_002',
    AUDIT_LOG_REQUIRED: 'COMPLY_003',
    DATA_RETENTION_VIOLATION: 'COMPLY_004',
    PHI_EXPOSURE_RISK: 'COMPLY_005',
    CONSENT_DOCUMENTATION_MISSING: 'COMPLY_006',
};
exports.ErrorCodes = {
    ...exports.AuthErrorCodes,
    ...exports.AuthzErrorCodes,
    ...exports.ValidationErrorCodes,
    ...exports.BusinessErrorCodes,
    ...exports.HealthcareErrorCodes,
    ...exports.SecurityErrorCodes,
    ...exports.SystemErrorCodes,
    ...exports.ComplianceErrorCodes,
};
function getErrorCodeCategory(code) {
    return code.split('_')[0];
}
function isClientError(code) {
    const category = getErrorCodeCategory(code);
    return ['AUTH', 'AUTHZ', 'VALID', 'BUSINESS'].includes(category);
}
function isServerError(code) {
    const category = getErrorCodeCategory(code);
    return ['SYSTEM'].includes(category);
}
function getHttpStatusForErrorCode(code) {
    const category = getErrorCodeCategory(code);
    const statusMap = {
        AUTH: 401,
        AUTHZ: 403,
        VALID: 400,
        BUSINESS: 400,
        HEALTH: 400,
        SECURITY: 429,
        SYSTEM: 500,
        COMPLY: 400,
    };
    if (code === exports.BusinessErrorCodes.RESOURCE_NOT_FOUND)
        return 404;
    if (code === exports.BusinessErrorCodes.RESOURCE_ALREADY_EXISTS)
        return 409;
    if (code === exports.SecurityErrorCodes.RATE_LIMIT_EXCEEDED)
        return 429;
    if (code === exports.SystemErrorCodes.SERVICE_UNAVAILABLE)
        return 503;
    return statusMap[category] || 500;
}
//# sourceMappingURL=error-codes.js.map