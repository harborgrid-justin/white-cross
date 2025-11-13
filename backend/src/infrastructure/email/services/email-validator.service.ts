/**
 * @fileoverview Email Validator Service
 * @module infrastructure/email/services
 * @description Service for validating email addresses
 */

import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import * as validator from 'email-validator';
import { EmailValidationResult } from '../types/email.types';

@Injectable()
export class EmailValidatorService extends BaseService {
  /**
   * Validate email address
   */
  validateEmail(email: string): EmailValidationResult {
    if (!email) {
      return { valid: false, email, reason: 'Email is required' };
    }

    if (!validator.validate(email)) {
      return { valid: false, email, reason: 'Invalid email format' };
    }

    // Additional checks
    const parts = email.split('@');
    if (parts.length !== 2) {
      return { valid: false, email, reason: 'Invalid email format' };
    }

    const [localPart, domain] = parts;

    if (localPart.length === 0 || localPart.length > 64) {
      return { valid: false, email, reason: 'Invalid local part length' };
    }

    if (domain.length === 0 || domain.length > 255) {
      return { valid: false, email, reason: 'Invalid domain length' };
    }

    return { valid: true, email };
  }

  /**
   * Validate multiple email addresses
   */
  validateEmails(emails: string[]): EmailValidationResult[] {
    return emails.map((email) => this.validateEmail(email));
  }

  /**
   * Check if all emails in array are valid
   */
  areAllValid(emails: string[]): boolean {
    return emails.every(email => this.validateEmail(email).valid);
  }

  /**
   * Filter valid emails from array
   */
  filterValidEmails(emails: string[]): string[] {
    return emails.filter((email) => this.validateEmail(email).valid);
  }

  /**
   * Get validation summary for multiple emails
   */
  getValidationSummary(emails: string[]): {
    total: number;
    valid: number;
    invalid: number;
    validEmails: string[];
    invalidEmails: EmailValidationResult[];
  } {
    const results = this.validateEmails(emails);
    const valid = results.filter((r) => r.valid);
    const invalid = results.filter((r) => !r.valid);

    return {
      total: emails.length,
      valid: valid.length,
      invalid: invalid.length,
      validEmails: valid.map((r) => r.email),
      invalidEmails: invalid,
    };
  }
}
