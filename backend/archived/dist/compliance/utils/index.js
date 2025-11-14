"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPLIANCE_ERRORS = exports.COMPLIANCE_CONSTANTS = exports.ComplianceUtils = void 0;
const index_1 = require("../enums/index");
class ComplianceUtils {
    static VALID_RELATIONSHIPS = [
        'Mother',
        'Father',
        'Parent',
        'Legal Guardian',
        'Foster Parent',
        'Grandparent',
        'Stepparent',
        'Other Authorized Adult',
    ];
    static VERSION_PATTERN = /^[0-9]+\.[0-9]+(\.[0-9]+)?$/;
    static validateVersionFormat(version) {
        return this.VERSION_PATTERN.test(version);
    }
    static validateRelationship(relationship) {
        return this.VALID_RELATIONSHIPS.includes(relationship);
    }
    static validateContentLength(content, minLength = 50) {
        return content.trim().length >= minLength;
    }
    static validateSignatureData(signatureData) {
        if (signatureData.length < 10) {
            return {
                valid: false,
                error: 'Digital signature data appears incomplete',
            };
        }
        if (signatureData.length > 100000) {
            return {
                valid: false,
                error: 'Digital signature data is too large (max 100KB)',
            };
        }
        return { valid: true };
    }
    static isValidPolicyStatusTransition(currentStatus, newStatus) {
        if (newStatus === index_1.PolicyStatus.ACTIVE) {
            if (currentStatus === index_1.PolicyStatus.ARCHIVED) {
                return {
                    valid: false,
                    error: 'Cannot reactivate an archived policy. Create a new version instead.',
                };
            }
            if (currentStatus === index_1.PolicyStatus.SUPERSEDED) {
                return {
                    valid: false,
                    error: 'Cannot reactivate a superseded policy. Create a new version instead.',
                };
            }
        }
        return { valid: true };
    }
    static calculateDaysOverdue(dueDate) {
        const now = new Date();
        const diffTime = now.getTime() - dueDate.getTime();
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }
    static getPriorityLevel(daysOverdue) {
        if (daysOverdue > 30)
            return 'critical';
        if (daysOverdue > 14)
            return 'high';
        if (daysOverdue > 7)
            return 'medium';
        return 'low';
    }
    static calculateCompletionPercentage(totalItems, completedItems) {
        if (totalItems === 0)
            return 100;
        return Math.round((completedItems / totalItems) * 100);
    }
    static getRequiredCategories(reportType) {
        const categoryMap = {
            [index_1.ComplianceReportType.HIPAA]: [
                index_1.ComplianceCategory.PRIVACY,
                index_1.ComplianceCategory.SECURITY,
            ],
            [index_1.ComplianceReportType.FERPA]: [
                index_1.ComplianceCategory.PRIVACY,
                index_1.ComplianceCategory.DOCUMENTATION,
                index_1.ComplianceCategory.CONSENT,
            ],
            [index_1.ComplianceReportType.MEDICATION_AUDIT]: [
                index_1.ComplianceCategory.MEDICATION,
                index_1.ComplianceCategory.SAFETY,
            ],
            [index_1.ComplianceReportType.STATE_HEALTH]: [
                index_1.ComplianceCategory.HEALTH_RECORDS,
                index_1.ComplianceCategory.SAFETY,
            ],
            [index_1.ComplianceReportType.SAFETY_INSPECTION]: [index_1.ComplianceCategory.SAFETY],
            [index_1.ComplianceReportType.TRAINING_COMPLIANCE]: [index_1.ComplianceCategory.TRAINING],
            [index_1.ComplianceReportType.DATA_PRIVACY]: [
                index_1.ComplianceCategory.SECURITY,
                index_1.ComplianceCategory.PRIVACY,
            ],
            [index_1.ComplianceReportType.CUSTOM]: [],
        };
        return categoryMap[reportType] || [];
    }
}
exports.ComplianceUtils = ComplianceUtils;
exports.COMPLIANCE_CONSTANTS = {
    MIN_POLICY_CONTENT_LENGTH: 100,
    MIN_CONSENT_CONTENT_LENGTH: 50,
    MIN_SIGNATORY_NAME_LENGTH: 2,
    MIN_MINIMUM_NECESSARY_LENGTH: 10,
    MAX_SIGNATURE_DATA_SIZE: 100000,
    MIN_SIGNATURE_DATA_SIZE: 10,
    OVERDUE_CRITICAL_DAYS: 30,
    OVERDUE_HIGH_DAYS: 14,
    OVERDUE_MEDIUM_DAYS: 7,
    EXPIRING_SOON_DAYS: 7,
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    DEFAULT_REPORT_VERSION: '1.0',
    AUDIT_LOG_RETENTION_DAYS: 2555,
    MAX_DOCUMENT_SIZE: 10485760,
    MAX_REQUESTS_PER_MINUTE: 100,
};
exports.COMPLIANCE_ERRORS = {
    INVALID_INPUT: 'Invalid input provided',
    UNAUTHORIZED: 'Unauthorized access',
    NOT_FOUND: 'Resource not found',
    INVALID_VERSION_FORMAT: 'Version must be in format: X.Y or X.Y.Z (e.g., 1.0, 2.1.3)',
    INVALID_RELATIONSHIP: 'Relationship must be a valid authorized relationship type',
    CONTENT_TOO_SHORT: 'Content must meet minimum length requirements for legal validity',
    SIGNATURE_INCOMPLETE: 'Digital signature data appears incomplete',
    SIGNATURE_TOO_LARGE: 'Digital signature data is too large (max 100KB)',
    MINIMUM_NECESSARY_TOO_SHORT: 'Minimum necessary justification must be at least 10 characters (HIPAA requirement)',
    POLICY_ALREADY_ACKNOWLEDGED: 'Policy already acknowledged by this user',
    POLICY_NOT_ACTIVE: 'Policy is not active and cannot be acknowledged',
    POLICY_ARCHIVED_REACTIVATION: 'Cannot reactivate an archived policy. Create a new version instead.',
    POLICY_SUPERSEDED_REACTIVATION: 'Cannot reactivate a superseded policy. Create a new version instead.',
    CONSENT_ALREADY_SIGNED: 'Consent form already signed for this student',
    CONSENT_EXPIRED: 'Consent form has expired and cannot be signed',
    CONSENT_NOT_ACTIVE: 'Consent form is not active and cannot be signed',
    CONSENT_ALREADY_WITHDRAWN: 'Consent was already withdrawn',
    SIGNATORY_NAME_REQUIRED: 'Signatory name is required for legal validity',
    AUTHORIZATION_DATE_REQUIRED: 'Authorization date required when authorization is obtained',
    EXPIRATION_DATE_PAST: 'Expiration date must be in the future',
    REVIEW_DATE_BEFORE_EFFECTIVE: 'Review date cannot be before effective date',
    REPORT_NOT_FOUND: 'Compliance report not found',
    CHECKLIST_ITEM_NOT_FOUND: 'Checklist item not found',
    DISCLOSURE_NOT_FOUND: 'PHI disclosure not found',
    USER_NOT_FOUND: 'User not found',
    STUDENT_NOT_FOUND: 'Student not found',
};
//# sourceMappingURL=index.js.map