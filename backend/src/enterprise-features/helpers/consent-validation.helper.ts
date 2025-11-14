/**
 * Consent Form Validation Helper
 * Extracted validation methods for consent form management
 */

export class ConsentValidationHelper {
  /**
   * Validate consent form parameters
   */
  static validateConsentFormParameters(
    studentId: string,
    formType: string,
    content: string,
  ): void {
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

  /**
   * Validate signature parameters
   */
  static validateSignatureParameters(formId: string, signedBy: string, signature: string): void {
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

  /**
   * Validate verification parameters
   */
  static validateVerificationParameters(formId: string, signature: string): void {
    if (!formId || formId.trim().length === 0) {
      throw new Error('Form ID is required');
    }

    if (!signature || signature.trim().length === 0) {
      throw new Error('Signature is required');
    }
  }

  /**
   * Validate revocation parameters
   */
  static validateRevocationParameters(formId: string, revokedBy: string, reason: string): void {
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

  /**
   * Validate renewal parameters
   */
  static validateRenewalParameters(
    formId: string,
    extendedBy: string,
    additionalYears: number,
  ): void {
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

  /**
   * Validate student ID
   */
  static validateStudentId(studentId: string): void {
    if (!studentId || studentId.trim().length === 0) {
      throw new Error('Student ID is required');
    }
  }

  /**
   * Validate form ID
   */
  static validateFormId(formId: string): void {
    if (!formId || formId.trim().length === 0) {
      throw new Error('Form ID is required');
    }
  }

  /**
   * Validate template parameters
   */
  static validateTemplateParameters(formType: string, studentId: string): void {
    if (!formType || formType.trim().length === 0) {
      throw new Error('Form type is required');
    }

    if (!studentId || studentId.trim().length === 0) {
      throw new Error('Student ID is required');
    }
  }
}
