/**
 * PHI Manager
 *
 * Handles PHI detection, redaction, and compliance
 */

import type { PHIPatterns } from './types';

export class PHIManager {
  private readonly patterns: PHIPatterns = {
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
    mrn: /\bMRN[:\s]?\d+\b/gi,
    dob: /\b(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}\b/g,
    phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  };

  /**
   * Check if data contains PHI
   */
  containsPHI(data: string): boolean {
    if (typeof data !== 'string') return false;
    return Object.values(this.patterns).some(pattern => pattern.test(data));
  }

  /**
   * Redact PHI from data
   */
  redactPHI(data: string): string {
    if (typeof data !== 'string') return data;

    let redacted = data;
    redacted = redacted.replace(this.patterns.ssn, '***-**-****');
    redacted = redacted.replace(this.patterns.mrn, 'MRN:****');
    redacted = redacted.replace(this.patterns.dob, '**/**/****');
    redacted = redacted.replace(this.patterns.phone, '***-***-****');
    redacted = redacted.replace(this.patterns.email, '****@****.***');
    return redacted;
  }

  /**
   * Get all PHI patterns
   */
  getPatterns(): PHIPatterns {
    return { ...this.patterns };
  }

  /**
   * Scan object for PHI recursively
   */
  scanObjectForPHI(obj: unknown): { hasPHI: boolean; locations: string[] } {
    const locations: string[] = [];
    const hasPHI = this.scanObjectRecursive(obj, '', locations);
    return { hasPHI, locations };
  }

  /**
   * Redact PHI from object recursively
   */
  redactPHIFromObject(obj: unknown): unknown {
    return this.redactObjectRecursive(obj);
  }

  /**
   * Validate data doesn't contain unexpected PHI
   */
  validateNoPHI(data: string, allowedPatterns: string[] = []): { valid: boolean; violations: string[] } {
    const violations: string[] = [];

    // Check for patterns not in allowed list
    if (!allowedPatterns.includes('ssn') && this.patterns.ssn.test(data)) {
      violations.push('SSN detected');
    }
    if (!allowedPatterns.includes('mrn') && this.patterns.mrn.test(data)) {
      violations.push('MRN detected');
    }
    if (!allowedPatterns.includes('dob') && this.patterns.dob.test(data)) {
      violations.push('Date of birth detected');
    }
    if (!allowedPatterns.includes('phone') && this.patterns.phone.test(data)) {
      violations.push('Phone number detected');
    }
    if (!allowedPatterns.includes('email') && this.patterns.email.test(data)) {
      violations.push('Email address detected');
    }

    return { valid: violations.length === 0, violations };
  }

  private scanObjectRecursive(obj: unknown, path: string, locations: string[]): boolean {
    if (typeof obj === 'string') {
      if (this.containsPHI(obj)) {
        locations.push(path);
        return true;
      }
      return false;
    }

    if (Array.isArray(obj)) {
      let hasPHI = false;
      obj.forEach((item, index) => {
        if (this.scanObjectRecursive(item, `${path}[${index}]`, locations)) {
          hasPHI = true;
        }
      });
      return hasPHI;
    }

    if (obj && typeof obj === 'object') {
      let hasPHI = false;
      for (const [key, value] of Object.entries(obj)) {
        const newPath = path ? `${path}.${key}` : key;
        if (this.scanObjectRecursive(value, newPath, locations)) {
          hasPHI = true;
        }
      }
      return hasPHI;
    }

    return false;
  }

  private redactObjectRecursive(obj: unknown): unknown {
    if (typeof obj === 'string') {
      return this.redactPHI(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.redactObjectRecursive(item));
    }

    if (obj && typeof obj === 'object') {
      const redacted: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        redacted[key] = this.redactObjectRecursive(value);
      }
      return redacted;
    }

    return obj;
  }
}