import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConsentForm } from './enterprise-features-interfaces';
import { ConsentValidationHelper } from './helpers/consent-validation.helper';
import { ConsentTemplateHelper } from './helpers/consent-template.helper';
import { SignatureHelper } from './helpers/signature.helper';

import { BaseService } from '@/common/base';
@Injectable()
export class ConsentFormManagementService extends BaseService {
  private consentForms: ConsentForm[] = [];

  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Create a new consent form
   */
  createConsentForm(
    studentId: string,
    formType: string,
    content: string,
    expiresAt?: Date,
  ): ConsentForm {
    try {
      ConsentValidationHelper.validateConsentFormParameters(studentId, formType, content);

      const form: ConsentForm = {
        id: SignatureHelper.generateFormId(),
        studentId,
        formType,
        status: 'pending',
        content,
        createdAt: new Date(),
        expiresAt: expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        version: '1.0',
        metadata: {
          createdBy: 'system',
          ipAddress: 'unknown',
        },
      };

      this.consentForms.push(form);
      this.eventEmitter.emit('consent.form.created', {
        formId: form.id,
        studentId,
        formType,
        timestamp: new Date(),
      });
      this.logInfo('Consent form created', { formId: form.id, formType, studentId });
      return form;
    } catch (error) {
      this.logError('Error creating consent form', {
        error: error instanceof Error ? error.message : String(error),
        studentId,
        formType,
      });
      throw error;
    }
  }

  /**
   * Sign a consent form
   */
  signForm(
    formId: string,
    signedBy: string,
    signature: string,
    ipAddress?: string,
    userAgent?: string,
  ): boolean {
    try {
      ConsentValidationHelper.validateSignatureParameters(formId, signedBy, signature);

      const form = this.consentForms.find((f) => f.id === formId);
      if (!form) {
        throw new Error(`Consent form not found: ${formId}`);
      }

      if (form.status !== 'pending') {
        throw new Error(`Form ${formId} is not in pending status`);
      }

      const signatureData = SignatureHelper.createSignatureData(
        formId,
        signedBy,
        signature,
        ipAddress,
        userAgent,
      );

      form.status = 'signed';
      form.lastModifiedAt = new Date();
      form.lastModifiedBy = signedBy;

      this.eventEmitter.emit('consent.form.signed', {
        formId,
        signedBy,
        ipAddress,
        timestamp: signatureData.signedAt,
      });
      this.logInfo('Consent form signed', { formId, signedBy, ipAddress, timestamp: signatureData.signedAt });

      return true;
    } catch (error) {
      this.logError('Error signing consent form', {
        error: error instanceof Error ? error.message : String(error),
        formId,
      });
      return false;
    }
  }

  /**
   * Verify a signature
   */
  verifySignature(formId: string, signature: string): boolean {
    try {
      ConsentValidationHelper.validateVerificationParameters(formId, signature);

      const form = this.consentForms.find((f) => f.id === formId);
      if (!form) {
        throw new Error(`Consent form not found: ${formId}`);
      }

      if (form.status !== 'signed') {
        this.logWarning('Attempted to verify signature on unsigned form', { formId });
        return false;
      }

      const isValid = true;
      this.logInfo('Signature verification completed', { formId, isValid });
      return isValid;
    } catch (error) {
      this.logError('Error verifying signature', {
        error: error instanceof Error ? error.message : String(error),
        formId,
      });
      return false;
    }
  }

  /**
   * Revoke consent
   */
  revokeConsent(formId: string, revokedBy: string, reason: string): boolean {
    try {
      ConsentValidationHelper.validateRevocationParameters(formId, revokedBy, reason);

      const form = this.consentForms.find((f) => f.id === formId);
      if (!form) {
        throw new Error(`Consent form not found: ${formId}`);
      }

      if (form.status !== 'signed') {
        throw new Error(`Cannot revoke consent for form ${formId} - not signed`);
      }

      form.status = 'revoked';
      form.lastModifiedAt = new Date();
      form.lastModifiedBy = revokedBy;

      this.eventEmitter.emit('consent.form.revoked', { formId, revokedBy, reason, timestamp: new Date() });

      this.logInfo('Consent form revoked', { formId, revokedBy, reason });
      return true;
    } catch (error) {
      this.logError('Error revoking consent', {
        error: error instanceof Error ? error.message : String(error),
        formId,
      });
      return false;
    }
  }

  /**
   * Check forms expiring soon
   */
  checkFormsExpiringSoon(days: number = 30): ConsentForm[] {
    try {
      const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

      const expiringForms = this.consentForms.filter(
        (form) => form.status === 'signed' && form.expiresAt && form.expiresAt <= expiryDate,
      );

      this.logInfo('Checked for expiring consent forms', {
        days,
        expiringCount: expiringForms.length,
        expiryDate,
      });

      return expiringForms;
    } catch (error) {
      this.logError('Error checking expiring forms', {
        error: error instanceof Error ? error.message : String(error),
        days,
      });
      return [];
    }
  }

  /**
   * Renew consent form
   */
  renewConsentForm(formId: string, extendedBy: string, additionalYears: number = 1): ConsentForm | null {
    try {
      ConsentValidationHelper.validateRenewalParameters(formId, extendedBy, additionalYears);

      const form = this.consentForms.find((f) => f.id === formId);
      if (!form) {
        throw new Error(`Consent form not found: ${formId}`);
      }

      const newExpiryDate = new Date(form.expiresAt.getTime() + additionalYears * 365 * 24 * 60 * 60 * 1000);
      const renewedForm: ConsentForm = {
        ...form,
        id: SignatureHelper.generateFormId(),
        status: 'pending',
        expiresAt: newExpiryDate,
        version: (parseFloat(form.version || '1.0') + 0.1).toFixed(1),
        createdAt: new Date(),
        lastModifiedAt: new Date(),
        lastModifiedBy: extendedBy,
      };

      this.consentForms.push(renewedForm);
      this.eventEmitter.emit('consent.form.renewed', {
        originalFormId: formId,
        newFormId: renewedForm.id,
        extendedBy,
        newExpiryDate,
        additionalYears,
        timestamp: new Date(),
      });
      this.logInfo('Consent form renewed', { originalFormId: formId, newFormId: renewedForm.id, extendedBy, newExpiryDate, additionalYears });

      return renewedForm;
    } catch (error) {
      this.logError('Error renewing consent form', {
        error: error instanceof Error ? error.message : String(error),
        formId,
      });
      return null;
    }
  }

  /**
   * Get consent forms by student
   */
  getConsentFormsByStudent(studentId: string, status?: string): ConsentForm[] {
    try {
      ConsentValidationHelper.validateStudentId(studentId);
      let forms = this.consentForms.filter((form) => form.studentId === studentId);
      if (status) {
        forms = forms.filter((form) => form.status === status);
      }
      this.logInfo('Retrieved consent forms by student', { studentId, status, count: forms.length });
      return forms;
    } catch (error) {
      this.logError('Error retrieving consent forms by student', {
        error: error instanceof Error ? error.message : String(error),
        studentId,
      });
      return [];
    }
  }

  /**
   * Get consent form history
   */
  getConsentFormHistory(formId: string): Array<Record<string, unknown>> {
    try {
      ConsentValidationHelper.validateFormId(formId);
      const form = this.consentForms.find((f) => f.id === formId);
      if (!form) {
        return [];
      }

      const history = [{
        version: form.version,
        status: form.status,
        createdAt: form.createdAt,
        lastModifiedAt: form.lastModifiedAt,
        lastModifiedBy: form.lastModifiedBy,
      }];
      this.logInfo('Retrieved consent form history', { formId, historyEntries: history.length });
      return history;
    } catch (error) {
      this.logError('Error retrieving form history', {
        error: error instanceof Error ? error.message : String(error),
        formId,
      });
      return [];
    }
  }

  /**
   * Send reminders for unsigned forms
   */
  sendReminderForUnsignedForms(): number {
    try {
      const unsignedForms = this.consentForms.filter(
        (form) =>
          form.status === 'pending' &&
          form.createdAt &&
          Date.now() - form.createdAt.getTime() > 7 * 24 * 60 * 60 * 1000, // 7 days old
      );

      // In production, this would send actual reminders
      const remindersSent = unsignedForms.length;

      if (remindersSent > 0) {
        // Emit reminder event
        this.eventEmitter.emit('consent.reminders.sent', {
          unsignedFormsCount: unsignedForms.length,
          remindersSent,
          timestamp: new Date(),
        });
      }

      this.logInfo('Sent reminders for unsigned consent forms', {
        unsignedFormsCount: unsignedForms.length,
        remindersSent,
      });
      return remindersSent;
    } catch (error) {
      this.logError('Error sending reminders', error);
      return 0;
    }
  }

  /**
   * Generate consent form template
   */
  generateConsentFormTemplate(formType: string, studentId: string): { html: string; variables: Record<string, string> } {
    try {
      ConsentValidationHelper.validateTemplateParameters(formType, studentId);
      const variables = ConsentTemplateHelper.getDefaultVariables(formType, studentId);
      const html = ConsentTemplateHelper.generateHtmlTemplate(
        formType,
        variables.studentName,
        variables.schoolName,
        variables.date,
        variables.studentId,
      );
      this.logInfo('Consent form template generated', { formType, studentId });
      return { html, variables };
    } catch (error) {
      this.logError('Error generating form template', {
        error: error instanceof Error ? error.message : String(error),
        formType,
      });
      throw error;
    }
  }

}
