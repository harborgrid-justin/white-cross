/**
 * @fileoverview PII Detection Service
 * @module security/services/pii-detection
 * @description Detects and masks personally identifiable information
 *
 * @version 2.0.0
 * @requires @nestjs/common ^10.x
 */

import { Injectable, Logger } from '@nestjs/common';
import { PIIDetectionResult, PIIType } from '../interfaces/security.interfaces';

import { BaseService } from '@/common/base';
@Injectable()
export class PIIDetectionService extends BaseService {
  // PII detection patterns
  private readonly patterns: Record<PIIType, RegExp> = {
    [PIIType.SSN]: /\b\d{3}-?\d{2}-?\d{4}\b/g,
    [PIIType.EMAIL]: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    [PIIType.PHONE]: /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    [PIIType.CREDIT_CARD]: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
    [PIIType.ADDRESS]:
      /\b\d+\s+[A-Za-z0-9\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/gi,
    [PIIType.NAME]: /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g,
    [PIIType.DATE_OF_BIRTH]:
      /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-](19|20)\d{2}\b/g,
    [PIIType.MEDICAL_ID]: /\b[A-Z]{2}\d{8,12}\b/g,
  };

  /**
   * Detects PII in text or data object
   */
  detectPII(data: string | Record<string, unknown>): PIIDetectionResult {
    const detected: PIIDetectionResult['fields'] = [];

    if (typeof data === 'string') {
      this.detectPIIInText(data, 'text', detected);
    } else {
      for (const [field, value] of Object.entries(data)) {
        if (typeof value === 'string') {
          this.detectPIIInText(value, field, detected);
        }
      }
    }

    return {
      detected: detected.length > 0,
      fields: detected,
    };
  }

  /**
   * Masks PII in data
   */
  maskPII(
    data: string | Record<string, unknown>,
    maskingChar: string = '*',
  ): string | Record<string, unknown> {
    if (typeof data === 'string') {
      return this.maskPIIInText(data, maskingChar);
    }

    const maskedData = { ...data };
    for (const [field, value] of Object.entries(maskedData)) {
      if (typeof value === 'string') {
        maskedData[field] = this.maskPIIInText(value, maskingChar);
      }
    }

    return maskedData;
  }

  private detectPIIInText(
    text: string,
    fieldName: string,
    detected: PIIDetectionResult['fields'],
  ): void {
    for (const [type, pattern] of Object.entries(this.patterns)) {
      const matches = text.match(pattern);
      if (matches) {
        for (const match of matches) {
          detected.push({
            field: fieldName,
            type: type as PIIType,
            confidence: this.calculateConfidence(type as PIIType, match),
            value: match,
            maskedValue: this.maskValue(match, '*'),
          });
        }
      }
    }
  }

  private maskPIIInText(text: string, maskingChar: string): string {
    let maskedText = text;

    for (const pattern of Object.values(this.patterns)) {
      maskedText = maskedText.replace(pattern, (match) => this.maskValue(match, maskingChar));
    }

    return maskedText;
  }

  private maskValue(value: string, maskingChar: string): string {
    // Keep first and last character, mask the middle
    if (value.length <= 2) {
      return maskingChar.repeat(value.length);
    }

    const start = value.charAt(0);
    const end = value.charAt(value.length - 1);
    const middle = maskingChar.repeat(value.length - 2);

    return `${start}${middle}${end}`;
  }

  private calculateConfidence(type: PIIType, value: string): number {
    // Simple confidence calculation based on pattern strength
    switch (type) {
      case PIIType.SSN:
        return /^\d{3}-\d{2}-\d{4}$/.test(value) ? 0.9 : 0.7;
      case PIIType.EMAIL:
        return 0.95; // Email pattern is pretty reliable
      case PIIType.CREDIT_CARD:
        return this.luhnCheck(value.replace(/\D/g, '')) ? 0.95 : 0.6;
      default:
        return 0.8;
    }
  }

  private luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }
}
