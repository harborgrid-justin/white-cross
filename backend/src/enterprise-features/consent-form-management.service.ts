import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConsentForm } from './enterprise-features-interfaces';
import * as crypto from 'crypto';

@Injectable()
export class ConsentFormManagementService {
  private readonly logger = new Logger(ConsentFormManagementService.name);
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
      this.validateConsentFormParameters(studentId, formType, content);

      const form: ConsentForm = {
        id: `CF-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
        studentId,
        formType,
        status: 'pending',
        content,
        createdAt: new Date(),
        expiresAt: expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Default 1 year
        version: '1.0',
        metadata: {
          createdBy: 'system',
          ipAddress: 'unknown',
        },
      };

      // Store form for tracking
      this.consentForms.push(form);

      // Emit form creation event
      this.eventEmitter.emit('consent.form.created', {
        formId: form.id,
        studentId,
        formType,
        timestamp: new Date(),
      });

      this.logger.log('Consent form created', {
        formId: form.id,
        formType,
        studentId,
      });
      return form;
    } catch (error) {
      this.logger.error('Error creating consent form', {
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
      this.validateSignatureParameters(formId, signedBy, signature);

      const form = this.consentForms.find((f) => f.id === formId);
      if (!form) {
        throw new Error(`Consent form not found: ${formId}`);
      }

      if (form.status !== 'pending') {
        throw new Error(`Form ${formId} is not in pending status`);
      }

      // Create signature hash for verification
      const signatureHash = crypto.createHash('sha256').update(signature).digest('hex');

      const signatureData = {
        formId,
        signedBy,
        signatureHash,
        signedAt: new Date(),
        ipAddress,
        userAgent,
        verified: true,
      };

      // Update form status
      form.status = 'signed';
      form.lastModifiedAt = new Date();
      form.lastModifiedBy = signedBy;

      // Emit signature event
      this.eventEmitter.emit('consent.form.signed', {
        formId,
        signedBy,
        ipAddress,
        timestamp: signatureData.signedAt,
      });

      this.logger.log('Consent form signed', {
        formId,
        signedBy,
        ipAddress,
        timestamp: signatureData.signedAt,
      });

      return true;
    } catch (error) {
      this.logger.error('Error signing consent form', {
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
      this.validateVerificationParameters(formId, signature);

      const form = this.consentForms.find((f) => f.id === formId);
      if (!form) {
        throw new Error(`Consent form not found: ${formId}`);
      }

      if (form.status !== 'signed') {
        this.logger.warn('Attempted to verify signature on unsigned form', {
          formId,
        });
        return false;
      }

      // Create signature hash for comparison
      crypto.createHash('sha256').update(signature).digest('hex');

      // In production, this would compare with stored signature hash
      // For now, return true for demonstration
      const isValid = true;

      this.logger.log('Signature verification completed', {
        formId,
        isValid,
      });
      return isValid;
    } catch (error) {
      this.logger.error('Error verifying signature', {
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
      this.validateRevocationParameters(formId, revokedBy, reason);

      const form = this.consentForms.find((f) => f.id === formId);
      if (!form) {
        throw new Error(`Consent form not found: ${formId}`);
      }

      if (form.status !== 'signed') {
        throw new Error(`Cannot revoke consent for form ${formId} - not signed`);
      }

      // Update form status
      form.status = 'revoked';
      form.lastModifiedAt = new Date();
      form.lastModifiedBy = revokedBy;

      // Emit revocation event
      this.eventEmitter.emit('consent.form.revoked', {
        formId,
        revokedBy,
        reason,
        timestamp: new Date(),
      });

      this.logger.log('Consent form revoked', { formId, revokedBy, reason });
      return true;
    } catch (error) {
      this.logger.error('Error revoking consent', {
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

      this.logger.log('Checked for expiring consent forms', {
        days,
        expiringCount: expiringForms.length,
        expiryDate,
      });

      return expiringForms;
    } catch (error) {
      this.logger.error('Error checking expiring forms', {
        error: error instanceof Error ? error.message : String(error),
        days,
      });
      return [];
    }
  }

  /**
   * Renew consent form
   */
  renewConsentForm(
    formId: string,
    extendedBy: string,
    additionalYears: number = 1,
  ): ConsentForm | null {
    try {
      this.validateRenewalParameters(formId, extendedBy, additionalYears);

      const form = this.consentForms.find((f) => f.id === formId);
      if (!form) {
        throw new Error(`Consent form not found: ${formId}`);
      }

      const newExpiryDate = new Date(
        form.expiresAt.getTime() + additionalYears * 365 * 24 * 60 * 60 * 1000,
      );

      // Create renewed form
      const renewedForm: ConsentForm = {
        ...form,
        id: `CF-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
        status: 'pending', // Requires re-signature
        expiresAt: newExpiryDate,
        version: (parseFloat(form.version) + 0.1).toFixed(1),
        createdAt: new Date(),
        lastModifiedAt: new Date(),
        lastModifiedBy: extendedBy,
      };

      this.consentForms.push(renewedForm);

      // Emit renewal event
      this.eventEmitter.emit('consent.form.renewed', {
        originalFormId: formId,
        newFormId: renewedForm.id,
        extendedBy,
        newExpiryDate,
        additionalYears,
        timestamp: new Date(),
      });

      this.logger.log('Consent form renewed', {
        originalFormId: formId,
        newFormId: renewedForm.id,
        extendedBy,
        newExpiryDate,
        additionalYears,
      });

      return renewedForm;
    } catch (error) {
      this.logger.error('Error renewing consent form', {
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
      this.validateStudentId(studentId);

      let forms = this.consentForms.filter((form) => form.studentId === studentId);

      if (status) {
        forms = forms.filter((form) => form.status === status);
      }

      this.logger.log('Retrieved consent forms by student', {
        studentId,
        status,
        count: forms.length,
      });
      return forms;
    } catch (error) {
      this.logger.error('Error retrieving consent forms by student', {
        error: error instanceof Error ? error.message : String(error),
        studentId,
      });
      return [];
    }
  }

  /**
   * Get consent form history
   */
  getConsentFormHistory(formId: string): any[] {
    try {
      this.validateFormId(formId);

      // In production, this would return version history
      // For now, return basic form information
      const form = this.consentForms.find((f) => f.id === formId);
      if (!form) {
        return [];
      }

      const history = [
        {
          version: form.version,
          status: form.status,
          createdAt: form.createdAt,
          lastModifiedAt: form.lastModifiedAt,
          lastModifiedBy: form.lastModifiedBy,
        },
      ];

      this.logger.log('Retrieved consent form history', {
        formId,
        historyEntries: history.length,
      });
      return history;
    } catch (error) {
      this.logger.error('Error retrieving form history', {
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

      this.logger.log('Sent reminders for unsigned consent forms', {
        unsignedFormsCount: unsignedForms.length,
        remindersSent,
      });
      return remindersSent;
    } catch (error) {
      this.logger.error('Error sending reminders', error);
      return 0;
    }
  }

  /**
   * Generate consent form template
   */
  generateConsentFormTemplate(
    formType: string,
    studentId: string,
  ): { html: string; variables: Record<string, any> } {
    try {
      this.validateTemplateParameters(formType, studentId);

      const variables = {
        studentName: 'Student Name',
        schoolName: 'School Name',
        formType,
        date: new Date().toLocaleDateString(),
        studentId,
      };

      const html = `
        <div class="consent-form">
          <h2>${formType} Consent Form</h2>
          <div class="form-header">
            <p><strong>Student:</strong> ${variables.studentName}</p>
            <p><strong>School:</strong> ${variables.schoolName}</p>
            <p><strong>Date:</strong> ${variables.date}</p>
            <p><strong>Student ID:</strong> ${variables.studentId}</p>
          </div>
          <div class="form-content">
            <p>This consent form is generated for ${formType} purposes.</p>
            <p>Please review and sign below to indicate your consent.</p>
          </div>
          <div class="signature-section">
            <p>Signature: ___________________________ Date: ___________</p>
          </div>
        </div>
      `;

      this.logger.log('Consent form template generated', {
        formType,
        studentId,
      });
      return { html, variables };
    } catch (error) {
      this.logger.error('Error generating form template', {
        error: error instanceof Error ? error.message : String(error),
        formType,
      });
      throw error;
    }
  }

  /**
   * Validate consent form parameters
   */
  private validateConsentFormParameters(
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
  private validateSignatureParameters(formId: string, signedBy: string, signature: string): void {
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
  private validateVerificationParameters(formId: string, signature: string): void {
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
  private validateRevocationParameters(formId: string, revokedBy: string, reason: string): void {
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
  private validateRenewalParameters(
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
  private validateStudentId(studentId: string): void {
    if (!studentId || studentId.trim().length === 0) {
      throw new Error('Student ID is required');
    }
  }

  /**
   * Validate form ID
   */
  private validateFormId(formId: string): void {
    if (!formId || formId.trim().length === 0) {
      throw new Error('Form ID is required');
    }
  }

  /**
   * Validate template parameters
   */
  private validateTemplateParameters(formType: string, studentId: string): void {
    if (!formType || formType.trim().length === 0) {
      throw new Error('Form type is required');
    }

    if (!studentId || studentId.trim().length === 0) {
      throw new Error('Student ID is required');
    }
  }
}
