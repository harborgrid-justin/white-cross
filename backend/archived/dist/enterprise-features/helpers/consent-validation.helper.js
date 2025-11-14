"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsentValidationHelper = void 0;
class ConsentValidationHelper {
    static validateConsentFormParameters(studentId, formType, content) {
        if (!studentId || studentId.trim().length === 0) {
            throw new Error('Student ID is required');
        }
        if (!formType || formType.trim().length === 0) {
            throw new Error('Form type is required');
        }
        if (!content || content.trim().length === 0) {
            throw new Error('Form content is required');
        }
    }
    static validateSignatureParameters(formId, signedBy, signature) {
        if (!formId || formId.trim().length === 0) {
            throw new Error('Form ID is required');
        }
        if (!signedBy || signedBy.trim().length === 0) {
            throw new Error('Signer information is required');
        }
        if (!signature || signature.trim().length === 0) {
            throw new Error('Signature is required');
        }
    }
    static validateVerificationParameters(formId, signature) {
        if (!formId || formId.trim().length === 0) {
            throw new Error('Form ID is required');
        }
        if (!signature || signature.trim().length === 0) {
            throw new Error('Signature is required');
        }
    }
    static validateRevocationParameters(formId, revokedBy, reason) {
        if (!formId || formId.trim().length === 0) {
            throw new Error('Form ID is required');
        }
        if (!revokedBy || revokedBy.trim().length === 0) {
            throw new Error('Revoker information is required');
        }
        if (!reason || reason.trim().length === 0) {
            throw new Error('Revocation reason is required');
        }
    }
    static validateRenewalParameters(formId, extendedBy, additionalYears) {
        if (!formId || formId.trim().length === 0) {
            throw new Error('Form ID is required');
        }
        if (!extendedBy || extendedBy.trim().length === 0) {
            throw new Error('Extender information is required');
        }
        if (additionalYears <= 0 || additionalYears > 10) {
            throw new Error('Additional years must be between 1 and 10');
        }
    }
    static validateStudentId(studentId) {
        if (!studentId || studentId.trim().length === 0) {
            throw new Error('Student ID is required');
        }
    }
    static validateFormId(formId) {
        if (!formId || formId.trim().length === 0) {
            throw new Error('Form ID is required');
        }
    }
    static validateTemplateParameters(formType, studentId) {
        if (!formType || formType.trim().length === 0) {
            throw new Error('Form type is required');
        }
        if (!studentId || studentId.trim().length === 0) {
            throw new Error('Student ID is required');
        }
    }
}
exports.ConsentValidationHelper = ConsentValidationHelper;
//# sourceMappingURL=consent-validation.helper.js.map