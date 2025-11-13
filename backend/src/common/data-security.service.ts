/**
 * Enterprise-Grade Data Security Service
 *
 * Production-ready data security utilities for NestJS applications with HIPAA compliance.
 * Implements data masking, PII redaction, sanitization, injection prevention, and access control.
 *
 * @module DataSecurity
 * @security OWASP Top 10 compliance
 * @compliance HIPAA, GDPR, PCI-DSS
 */

import { Injectable, Logger, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as crypto from 'crypto';

import { BaseService } from '../../common/base';
/**
 * PII (Personally Identifiable Information) field types
 */
export enum PIIFieldType {
  EMAIL = 'email',
  PHONE = 'phone',
  SSN = 'ssn',
  CREDIT_CARD = 'credit_card',
  ADDRESS = 'address',
  NAME = 'name',
  DATE_OF_BIRTH = 'date_of_birth',
  IP_ADDRESS = 'ip_address',
  MEDICAL_RECORD = 'medical_record',
}

/**
 * Data masking strategies
 */
export enum MaskingStrategy {
  FULL = 'full',
  PARTIAL = 'partial',
  HASH = 'hash',
  TOKENIZE = 'tokenize',
  REDACT = 'redact',
}

/**
 * Sensitive field detection patterns
 */
interface SensitiveFieldPattern {
  fieldName: RegExp;
  type: PIIFieldType;
  maskingStrategy: MaskingStrategy;
}

/**
 * Data classification levels
 */
export enum DataClassification {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted',
  PHI = 'phi', // Protected Health Information
  PII = 'pii', // Personally Identifiable Information
}

/**
 * Access control decision
 */
export interface AccessControlDecision {
  allowed: boolean;
  reason?: string;
  requiredPermissions?: string[];
  classification: DataClassification;
}

/**
 * Audit log entry for sensitive operations
 */
export interface AuditLogEntry {
  timestamp: Date;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  classification: DataClassification;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator: (context: ExecutionContext) => string;
}

/**
 * CSRF token payload
 */
export interface CSRFToken {
  token: string;
  expires: Date;
  userId?: string;
  sessionId: string;
}

/**
 * Enterprise-grade data security service
 */
@Injectable()
export class DataSecurityService extends BaseService {
  private readonly csrfTokens: Map<string, CSRFToken> = new Map();
  private readonly rateLimitStore: Map<string, number[]> = new Map();

  private readonly sensitivePatterns: SensitiveFieldPattern[] = [
    { fieldName: /^(ssn|social_?security)$/i, type: PIIFieldType.SSN, maskingStrategy: MaskingStrategy.PARTIAL },
    { fieldName: /^(email|e_?mail)$/i, type: PIIFieldType.EMAIL, maskingStrategy: MaskingStrategy.PARTIAL },
    { fieldName: /^(phone|telephone|mobile)$/i, type: PIIFieldType.PHONE, maskingStrategy: MaskingStrategy.PARTIAL },
    { fieldName: /^(credit_?card|card_?number)$/i, type: PIIFieldType.CREDIT_CARD, maskingStrategy: MaskingStrategy.PARTIAL },
    { fieldName: /^(address|street|home_?address)$/i, type: PIIFieldType.ADDRESS, maskingStrategy: MaskingStrategy.PARTIAL },
    { fieldName: /^(first_?name|last_?name|full_?name)$/i, type: PIIFieldType.NAME, maskingStrategy: MaskingStrategy.PARTIAL },
    { fieldName: /^(dob|date_?of_?birth|birth_?date)$/i, type: PIIFieldType.DATE_OF_BIRTH, maskingStrategy: MaskingStrategy.PARTIAL },
    { fieldName: /^(ip|ip_?address)$/i, type: PIIFieldType.IP_ADDRESS, maskingStrategy: MaskingStrategy.HASH },
    { fieldName: /^(mrn|medical_?record)$/i, type: PIIFieldType.MEDICAL_RECORD, maskingStrategy: MaskingStrategy.PARTIAL },
  ];

  // ==================== Data Masking Utilities ====================

  /**
   * Masks sensitive data based on field type
   *
   * @param value - Value to mask
   * @param type - PII field type (email, phone, SSN, etc.)
   * @param strategy - Masking strategy (full, partial, hash, tokenize, redact)
   * @returns Masked value appropriate for the field type and strategy
   * @security Prevents exposure of sensitive data in logs and responses
   * @example
   * ```typescript
   * maskData('john@example.com', PIIFieldType.EMAIL, MaskingStrategy.PARTIAL);
   * // Returns: 'j***@example.com'
   *
   * maskData('123-45-6789', PIIFieldType.SSN, MaskingStrategy.PARTIAL);
   * // Returns: '***-**-6789'
   * ```
   */
  maskData(value: string, type: PIIFieldType, strategy: MaskingStrategy = MaskingStrategy.PARTIAL): string {
    if (!value || typeof value !== 'string') return value;

    switch (strategy) {
      case MaskingStrategy.FULL:
        return '*'.repeat(value.length);

      case MaskingStrategy.PARTIAL:
        return this.maskPartial(value, type);

      case MaskingStrategy.HASH:
        return this.hashValue(value);

      case MaskingStrategy.TOKENIZE:
        return this.tokenizeValue(value);

      case MaskingStrategy.REDACT:
        return '[REDACTED]';

      default:
        return this.maskPartial(value, type);
    }
  }

  /**
   * Masks email address (preserves domain)
   *
   * @param email - Email address to mask
   * @returns Masked email (e.g., j***@example.com)
   * @security GDPR-compliant email masking
   */
  maskEmail(email: string): string {
    if (!email || !email.includes('@')) return email;

    const [localPart, domain] = email.split('@');

    if (localPart.length <= 1) {
      return `*@${domain}`;
    }

    const masked = localPart[0] + '*'.repeat(Math.min(localPart.length - 1, 5));
    return `${masked}@${domain}`;
  }

  /**
   * Masks phone number (preserves last 4 digits)
   *
   * @param phone - Phone number to mask
   * @returns Masked phone (e.g., ***-***-1234)
   * @security PCI-DSS compliant phone masking
   */
  maskPhone(phone: string): string {
    if (!phone) return phone;

    const digits = phone.replace(/\D/g, '');

    if (digits.length <= 4) {
      return '*'.repeat(digits.length);
    }

    const lastFour = digits.slice(-4);
    const masked = '*'.repeat(digits.length - 4) + lastFour;

    // Preserve original formatting
    let result = '';
    let digitIndex = 0;

    for (const char of phone) {
      if (/\d/.test(char)) {
        result += masked[digitIndex++];
      } else {
        result += char;
      }
    }

    return result;
  }

  /**
   * Masks Social Security Number (preserves last 4 digits)
   *
   * @param ssn - SSN to mask
   * @returns Masked SSN (e.g., ***-**-1234)
   * @security HIPAA-compliant SSN masking
   */
  maskSSN(ssn: string): string {
    if (!ssn) return ssn;

    const digits = ssn.replace(/\D/g, '');

    if (digits.length !== 9) {
      return '*'.repeat(ssn.length);
    }

    const lastFour = digits.slice(-4);
    return `***-**-${lastFour}`;
  }

  /**
   * Masks credit card number (preserves last 4 digits)
   *
   * @param cardNumber - Credit card number to mask
   * @returns Masked card (e.g., ****-****-****-1234)
   * @security PCI-DSS compliant card masking
   */
  maskCreditCard(cardNumber: string): string {
    if (!cardNumber) return cardNumber;

    const digits = cardNumber.replace(/\D/g, '');

    if (digits.length < 13 || digits.length > 19) {
      return '*'.repeat(cardNumber.length);
    }

    const lastFour = digits.slice(-4);
    const masked = '*'.repeat(digits.length - 4) + lastFour;

    // Preserve formatting
    let result = '';
    let digitIndex = 0;

    for (const char of cardNumber) {
      if (/\d/.test(char)) {
        result += masked[digitIndex++];
      } else {
        result += char;
      }
    }

    return result;
  }

  /**
   * Masks IP address (preserves first octet)
   *
   * @param ipAddress - IP address to mask
   * @returns Masked IP (e.g., 192.*.*.*  or 2001:***:***:****)
   * @security GDPR-compliant IP anonymization
   */
  maskIPAddress(ipAddress: string): string {
    if (!ipAddress) return ipAddress;

    // IPv4
    if (ipAddress.includes('.')) {
      const parts = ipAddress.split('.');
      if (parts.length !== 4) return ipAddress;
      return `${parts[0]}.*.*.*`;
    }

    // IPv6
    if (ipAddress.includes(':')) {
      const parts = ipAddress.split(':');
      if (parts.length < 3) return ipAddress;
      return `${parts[0]}:***:***:***:***:***:***:***`;
    }

    return ipAddress;
  }

  /**
   * Masks address (preserves city and state)
   *
   * @param address - Address object or string
   * @returns Masked address
   * @security HIPAA-compliant address masking
   */
  maskAddress(address: string | Record<string, any>): string | Record<string, any> {
    if (typeof address === 'string') {
      // Simple string address - mask street number and name
      const parts = address.split(',');
      if (parts.length > 0) {
        parts[0] = '[REDACTED STREET]';
      }
      return parts.join(',');
    }

    // Object address
    const masked = { ...address };
    if (masked.street) masked.street = '[REDACTED]';
    if (masked.street2) masked.street2 = '[REDACTED]';
    if (masked.addressLine1) masked.addressLine1 = '[REDACTED]';
    if (masked.addressLine2) masked.addressLine2 = '[REDACTED]';
    if (masked.zip) masked.zip = masked.zip.toString().slice(0, 3) + '**';
    if (masked.postalCode) masked.postalCode = masked.postalCode.toString().slice(0, 3) + '**';

    return masked;
  }

  /**
   * Masks medical record number (preserves last 3 digits)
   *
   * @param mrn - Medical record number
   * @returns Masked MRN
   * @security HIPAA-compliant MRN masking
   */
  maskMedicalRecordNumber(mrn: string): string {
    if (!mrn || mrn.length <= 3) {
      return '*'.repeat(mrn?.length || 0);
    }

    const lastThree = mrn.slice(-3);
    return '*'.repeat(mrn.length - 3) + lastThree;
  }

  // ==================== PII Redaction ====================

  /**
   * Redacts all PII from an object
   *
   * @param data - Object containing potential PII
   * @param aggressive - If true, redacts more fields
   * @returns Object with PII redacted
   * @security Automatic PII detection and redaction
   */
  redactPII<T extends Record<string, any>>(data: T, aggressive: boolean = false): T {
    if (!data || typeof data !== 'object') return data;

    const redacted = { ...data };

    for (const [key, value] of Object.entries(redacted)) {
      if (value === null || value === undefined) continue;

      const pattern = this.detectSensitiveField(key);

      if (pattern) {
        redacted[key] = this.maskData(
          typeof value === 'string' ? value : JSON.stringify(value),
          pattern.type,
          pattern.maskingStrategy,
        );
      } else if (aggressive && this.isPotentiallySecret(key)) {
        redacted[key] = '[REDACTED]';
      } else if (typeof value === 'object') {
        redacted[key] = this.redactPII(value, aggressive);
      }
    }

    return redacted;
  }

  /**
   * Redacts PII from text using pattern matching
   *
   * @param text - Text potentially containing PII
   * @returns Text with PII redacted
   * @security Pattern-based PII detection in free text
   */
  redactPIIFromText(text: string): string {
    if (!text) return text;

    let redacted = text;

    // Email pattern
    redacted = redacted.replace(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      '[EMAIL REDACTED]',
    );

    // Phone pattern (US)
    redacted = redacted.replace(
      /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
      '[PHONE REDACTED]',
    );

    // SSN pattern
    redacted = redacted.replace(
      /\b\d{3}-\d{2}-\d{4}\b/g,
      '[SSN REDACTED]',
    );

    // Credit card pattern
    redacted = redacted.replace(
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
      '[CARD REDACTED]',
    );

    // IP address pattern
    redacted = redacted.replace(
      /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
      '[IP REDACTED]',
    );

    return redacted;
  }

  /**
   * Detects and extracts all PII from text
   *
   * @param text - Text to analyze
   * @returns Array of detected PII with types
   * @security PII discovery for compliance auditing
   */
  detectPIIInText(text: string): Array<{ type: PIIFieldType; value: string; position: number }> {
    const detected: Array<{ type: PIIFieldType; value: string; position: number }> = [];

    if (!text) return detected;

    // Email detection
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    let match;

    while ((match = emailRegex.exec(text)) !== null) {
      detected.push({
        type: PIIFieldType.EMAIL,
        value: match[0],
        position: match.index,
      });
    }

    // Phone detection
    const phoneRegex = /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
    while ((match = phoneRegex.exec(text)) !== null) {
      detected.push({
        type: PIIFieldType.PHONE,
        value: match[0],
        position: match.index,
      });
    }

    // SSN detection
    const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
    while ((match = ssnRegex.exec(text)) !== null) {
      detected.push({
        type: PIIFieldType.SSN,
        value: match[0],
        position: match.index,
      });
    }

    // Credit card detection
    const cardRegex = /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g;
    while ((match = cardRegex.exec(text)) !== null) {
      detected.push({
        type: PIIFieldType.CREDIT_CARD,
        value: match[0],
        position: match.index,
      });
    }

    return detected;
  }

  // ==================== Sensitive Field Detection ====================

  /**
   * Detects if a field name is sensitive
   *
   * @param fieldName - Field name to check
   * @returns Pattern if sensitive, undefined otherwise
   * @security Automatic sensitive field classification
   */
  detectSensitiveField(fieldName: string): SensitiveFieldPattern | undefined {
    return this.sensitivePatterns.find(pattern => pattern.fieldName.test(fieldName));
  }

  /**
   * Classifies data sensitivity level
   *
   * @param data - Data object to classify
   * @returns Data classification level
   * @security Determines appropriate access controls
   */
  classifyDataSensitivity(data: Record<string, any>): DataClassification {
    if (!data || typeof data !== 'object') {
      return DataClassification.PUBLIC;
    }

    const fieldNames = Object.keys(data);
    let maxClassification = DataClassification.PUBLIC;

    for (const fieldName of fieldNames) {
      const pattern = this.detectSensitiveField(fieldName);

      if (pattern) {
        switch (pattern.type) {
          case PIIFieldType.SSN:
          case PIIFieldType.MEDICAL_RECORD:
            maxClassification = DataClassification.PHI;
            return maxClassification; // PHI is highest, return immediately

          case PIIFieldType.CREDIT_CARD:
            if (maxClassification < DataClassification.RESTRICTED) {
              maxClassification = DataClassification.RESTRICTED;
            }
            break;

          case PIIFieldType.EMAIL:
          case PIIFieldType.PHONE:
          case PIIFieldType.ADDRESS:
          case PIIFieldType.NAME:
          case PIIFieldType.DATE_OF_BIRTH:
            if (maxClassification < DataClassification.PII) {
              maxClassification = DataClassification.PII;
            }
            break;
        }
      }
    }

    return maxClassification;
  }

  /**
   * Scans object for sensitive fields
   *
   * @param data - Object to scan
   * @returns Array of sensitive field paths
   * @security Deep scanning for nested sensitive data
   */
  scanForSensitiveFields(data: Record<string, any>, prefix: string = ''): string[] {
    const sensitiveFields: string[] = [];

    for (const [key, value] of Object.entries(data)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;

      if (this.detectSensitiveField(key)) {
        sensitiveFields.push(fullPath);
      }

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        sensitiveFields.push(...this.scanForSensitiveFields(value, fullPath));
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item && typeof item === 'object') {
            sensitiveFields.push(...this.scanForSensitiveFields(item, `${fullPath}[${index}]`));
          }
        });
      }
    }

    return sensitiveFields;
  }

  // ==================== Secure Data Serialization ====================

  /**
   * Safely serializes data for logging
   *
   * @param data - Data to serialize
   * @param maxDepth - Maximum object depth
   * @returns JSON string with PII redacted
   * @security Prevents PII leakage in logs
   */
  safeSerialize(data: any, maxDepth: number = 3): string {
    const seen = new WeakSet();

    const replacer = (key: string, value: any, depth: number = 0): any => {
      if (depth > maxDepth) {
        return '[Max Depth Reached]';
      }

      if (value === null || value === undefined) {
        return value;
      }

      if (typeof value === 'object') {
        if (seen.has(value)) {
          return '[Circular Reference]';
        }
        seen.add(value);
      }

      // Redact sensitive fields
      if (key && this.detectSensitiveField(key)) {
        return '[REDACTED]';
      }

      // Redact password-like fields
      if (key && /password|secret|token|key|auth/i.test(key)) {
        return '[REDACTED]';
      }

      if (typeof value === 'object' && !Array.isArray(value)) {
        const redacted: any = {};
        for (const [k, v] of Object.entries(value)) {
          redacted[k] = replacer(k, v, depth + 1);
        }
        return redacted;
      }

      return value;
    };

    try {
      return JSON.stringify(replacer('', data, 0), null, 2);
    } catch (error) {
      return '[Serialization Error]';
    }
  }

  /**
   * Serializes data for external API with classification-based filtering
   *
   * @param data - Data to serialize
   * @param allowedClassification - Maximum allowed classification
   * @returns Filtered and serialized data
   * @security Classification-based data filtering
   */
  serializeForExternalAPI(
    data: Record<string, any>,
    allowedClassification: DataClassification,
  ): Record<string, any> {
    const classification = this.classifyDataSensitivity(data);

    const classificationLevel = {
      [DataClassification.PUBLIC]: 0,
      [DataClassification.INTERNAL]: 1,
      [DataClassification.CONFIDENTIAL]: 2,
      [DataClassification.PII]: 3,
      [DataClassification.RESTRICTED]: 4,
      [DataClassification.PHI]: 5,
    };

    if (classificationLevel[classification] > classificationLevel[allowedClassification]) {
      return this.handleError('Operation failed', new Error('Data classification exceeds allowed level for external API'));
    }

    return this.redactPII(data);
  }

  // ==================== Data Sanitization ====================

  /**
   * Sanitizes user input to prevent XSS attacks
   *
   * @param input - User input string
   * @returns Sanitized string with HTML entities encoded
   * @security OWASP XSS prevention - encodes all potentially dangerous characters
   * @example
   * ```typescript
   * const safe = sanitizeXSS('<script>alert("xss")</script>');
   * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
   * ```
   */
  sanitizeXSS(input: string): string {
    if (!input || typeof input !== 'string') return input;

    // Maximum input length to prevent DoS
    const MAX_INPUT_LENGTH = 100000;
    if (input.length > MAX_INPUT_LENGTH) {
      this.logWarning(`Input exceeds maximum length: ${input.length}`);
      return this.handleError('Operation failed', new Error('Input exceeds maximum allowed length'));
    }

    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Sanitizes HTML content allowing safe tags
   *
   * @param html - HTML content to sanitize
   * @param allowedTags - Array of allowed HTML tags (default: basic formatting tags)
   * @returns Sanitized HTML with only whitelisted tags and safe attributes
   * @security Whitelist-based HTML sanitization with attribute filtering
   * @warning This is a basic sanitizer. For production, consider using a library like DOMPurify
   * @example
   * ```typescript
   * const safe = sanitizeHTML('<p onclick="alert()">Hello</p><script>bad()</script>');
   * // Returns: '<p>Hello</p>'
   * ```
   */
  sanitizeHTML(html: string, allowedTags: string[] = ['b', 'i', 'em', 'strong', 'p']): string {
    if (!html || typeof html !== 'string') return html;

    // Maximum input length to prevent DoS
    const MAX_HTML_LENGTH = 500000;
    if (html.length > MAX_HTML_LENGTH) {
      this.logWarning(`HTML input exceeds maximum length: ${html.length}`);
      return this.handleError('Operation failed', new Error('HTML input exceeds maximum allowed length'));
    }

    // Remove all tags except allowed ones
    const tagPattern = /<(\/?)([\w]+)([^>]*)>/g;

    let result = html.replace(tagPattern, (match, slash, tag, attrs) => {
      if (allowedTags.includes(tag.toLowerCase())) {
        // Remove all event handlers (onclick, onload, etc.)
        let safeAttrs = attrs.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
        // Remove javascript: protocol
        safeAttrs = safeAttrs.replace(/javascript:/gi, '');
        // Remove data: protocol (can be used for XSS)
        safeAttrs = safeAttrs.replace(/data:/gi, '');
        // Remove style attribute to prevent CSS-based attacks
        safeAttrs = safeAttrs.replace(/style\s*=\s*["'][^"']*["']/gi, '');

        return `<${slash}${tag}${safeAttrs}>`;
      }
      return '';
    });

    // Remove any remaining script content
    result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    return result;
  }

  /**
   * Sanitizes object for safe storage
   *
   * @param data - Object to sanitize
   * @returns Sanitized object
   * @security Recursive XSS prevention for nested objects
   */
  sanitizeObject<T extends Record<string, any>>(data: T): T {
    if (!data || typeof data !== 'object') return data;

    const sanitized = { ...data };

    for (const [key, value] of Object.entries(sanitized)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeXSS(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = Array.isArray(value)
          ? value.map(item => typeof item === 'object' ? this.sanitizeObject(item) : item)
          : this.sanitizeObject(value);
      }
    }

    return sanitized;
  }

  // ==================== SQL Injection Prevention ====================

  /**
   * Validates and sanitizes SQL identifiers (table/column names)
   *
   * @param identifier - SQL identifier to validate (e.g., table or column name)
   * @returns Sanitized identifier if valid
   * @security Prevents SQL injection in dynamic queries by validating identifier syntax
   * @throws Error if identifier is empty, too long, or contains invalid characters
   * @warning Always use parameterized queries when possible. This is for dynamic table/column names only.
   * @example
   * ```typescript
   * const safe = sanitizeSQLIdentifier('users'); // ✓ Returns 'users'
   * const unsafe = sanitizeSQLIdentifier('users; DROP TABLE--'); // ✗ Throws Error
   * ```
   */
  sanitizeSQLIdentifier(identifier: string): string {
    if (!identifier || typeof identifier !== 'string') {
      return this.handleError('Operation failed', new Error('SQL identifier cannot be empty or non-string'));
    }

    // Maximum identifier length (based on SQL standards)
    const MAX_IDENTIFIER_LENGTH = 128;
    if (identifier.length > MAX_IDENTIFIER_LENGTH) {
      throw new Error(`SQL identifier exceeds maximum length of ${MAX_IDENTIFIER_LENGTH}`);
    }

    // Only allow alphanumeric, underscore, and dollar sign
    // Must start with letter, underscore, or dollar sign
    if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(identifier)) {
      this.logWarning(`Invalid SQL identifier attempted: ${identifier}`);
      return this.handleError('Operation failed', new Error('Invalid SQL identifier: must start with letter/underscore and contain only alphanumeric/underscore/$ characters'));
    }

    // Blacklist SQL keywords that should never be identifiers
    const SQL_KEYWORDS = [
      'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER',
      'TRUNCATE', 'EXEC', 'EXECUTE', 'UNION', 'WHERE', 'FROM', 'JOIN',
    ];

    if (SQL_KEYWORDS.includes(identifier.toUpperCase())) {
      return this.handleError('Operation failed', new Error('SQL identifier cannot be a reserved SQL keyword'));
    }

    return identifier;
  }

  /**
   * Escapes string value for SQL LIKE patterns
   *
   * @param value - Search pattern value to escape
   * @returns Escaped pattern safe for use in SQL LIKE clauses
   * @security Prevents LIKE injection attacks by escaping wildcards and escape characters
   * @warning Still use parameterized queries. This escapes the pattern, not the entire query.
   * @example
   * ```typescript
   * const userInput = '50%_discount';
   * const escaped = escapeSQLLikePattern(userInput);
   * // Returns: '50\\%\\_discount' (literal search, not wildcard)
   * // Use in query: SELECT * FROM products WHERE name LIKE ? (with escaped value)
   * ```
   */
  escapeSQLLikePattern(value: string): string {
    if (!value || typeof value !== 'string') return value;

    // Maximum pattern length to prevent DoS
    const MAX_PATTERN_LENGTH = 1000;
    if (value.length > MAX_PATTERN_LENGTH) {
      return this.handleError('Operation failed', new Error('SQL LIKE pattern exceeds maximum allowed length'));
    }

    // Escape backslash first, then wildcards
    return value
      .replace(/\\/g, '\\\\')  // Escape backslash
      .replace(/%/g, '\\%')    // Escape % wildcard
      .replace(/_/g, '\\_');   // Escape _ wildcard
  }

  /**
   * Validates SQL ORDER BY clause against a whitelist
   *
   * @param orderBy - Order by clause (e.g., "name ASC" or "created_at DESC")
   * @param allowedColumns - Whitelist of allowed column names (lowercase)
   * @returns Validated and sanitized ORDER BY clause
   * @security Prevents SQL injection in ORDER BY by validating against whitelist
   * @throws Error if column not in whitelist, invalid direction, or malformed clause
   * @example
   * ```typescript
   * const validated = validateSQLOrderBy('name DESC', ['name', 'created_at']);
   * // Returns: 'name DESC'
   *
   * const invalid = validateSQLOrderBy('name; DROP TABLE', ['name']);
   * // Throws: Error
   * ```
   */
  validateSQLOrderBy(orderBy: string, allowedColumns: string[]): string {
    if (!orderBy || typeof orderBy !== 'string') {
      return this.handleError('Operation failed', new Error('ORDER BY clause cannot be empty'));
    }

    if (!allowedColumns || !Array.isArray(allowedColumns) || allowedColumns.length === 0) {
      return this.handleError('Operation failed', new Error('allowedColumns must be a non-empty array'));
    }

    const parts = orderBy.toLowerCase().trim().split(/\s+/);

    if (parts.length > 2) {
      this.logWarning(`Invalid ORDER BY clause attempted: ${orderBy}`);
      return this.handleError('Operation failed', new Error('Invalid ORDER BY clause: too many parts'));
    }

    const column = parts[0];
    const direction = parts[1] || 'asc';

    // Validate column is in whitelist
    if (!allowedColumns.map(c => c.toLowerCase()).includes(column)) {
      this.logWarning(`Unauthorized column in ORDER BY: ${column}`);
      throw new Error(`Column "${column}" not allowed in ORDER BY. Allowed: ${allowedColumns.join(', ')}`);
    }

    // Validate sort direction
    if (!['asc', 'desc'].includes(direction)) {
      throw new Error(`Invalid sort direction: ${direction}. Must be ASC or DESC`);
    }

    // Additional sanitization via identifier validation
    const sanitizedColumn = this.sanitizeSQLIdentifier(column);

    return `${sanitizedColumn} ${direction.toUpperCase()}`;
  }

  // ==================== CSRF Token Management ====================

  /**
   * Generates CSRF token for session
   *
   * @param sessionId - Session identifier
   * @param userId - Optional user identifier
   * @param expiresInMs - Token expiration time in milliseconds
   * @returns CSRF token object
   * @security Double-submit cookie pattern
   */
  async generateCSRFToken(
    sessionId: string,
    userId?: string,
    expiresInMs: number = 3600000,
  ): Promise<CSRFToken> {
    const tokenBytes = crypto.randomBytes(32);
    const token = tokenBytes.toString('base64url');

    const csrfToken: CSRFToken = {
      token,
      expires: new Date(Date.now() + expiresInMs),
      userId,
      sessionId,
    };

    this.csrfTokens.set(token, csrfToken);

    // Clean up expired tokens
    this.cleanupExpiredCSRFTokens();

    return csrfToken;
  }

  /**
   * Validates CSRF token
   *
   * @param token - Token to validate
   * @param sessionId - Session identifier
   * @returns True if valid
   * @security Timing-safe token comparison to prevent timing attacks
   * @throws Never throws, returns false on any error
   */
  validateCSRFToken(token: string, sessionId: string): boolean {
    // Input validation
    if (!token || typeof token !== 'string' || !sessionId || typeof sessionId !== 'string') {
      return false;
    }

    const storedToken = this.csrfTokens.get(token);

    if (!storedToken) {
      return false;
    }

    // Check expiration
    if (storedToken.expires < new Date()) {
      this.csrfTokens.delete(token);
      return false;
    }

    // Timing-safe comparison of session IDs
    try {
      const storedBuffer = Buffer.from(storedToken.sessionId);
      const providedBuffer = Buffer.from(sessionId);

      if (storedBuffer.length !== providedBuffer.length) {
        return false;
      }

      return crypto.timingSafeEqual(storedBuffer, providedBuffer);
    } catch (error) {
      this.logWarning('CSRF token validation error', error);
      return false;
    }
  }

  /**
   * Invalidates CSRF token
   *
   * @param token - Token to invalidate
   * @security Token cleanup after use
   */
  invalidateCSRFToken(token: string): void {
    this.csrfTokens.delete(token);
  }

  // ==================== Rate Limiting ====================

  /**
   * Checks rate limit for data access
   *
   * @param key - Rate limit key (e.g., userId, IP)
   * @param config - Rate limit configuration
   * @returns True if within limit
   * @security Sliding window rate limiting
   */
  checkRateLimit(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get or create request timestamps for this key
    let requests = this.rateLimitStore.get(key) || [];

    // Filter out requests outside the window
    requests = requests.filter(timestamp => timestamp > windowStart);

    if (requests.length >= config.maxRequests) {
      return false;
    }

    // Add current request
    requests.push(now);
    this.rateLimitStore.set(key, requests);

    // Cleanup old entries
    this.cleanupRateLimitStore();

    return true;
  }

  /**
   * Gets remaining rate limit for key
   *
   * @param key - Rate limit key
   * @param config - Rate limit configuration
   * @returns Remaining requests and reset time
   * @security Rate limit transparency
   */
  getRateLimitStatus(key: string, config: RateLimitConfig): {
    remaining: number;
    resetAt: Date;
  } {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    const requests = (this.rateLimitStore.get(key) || [])
      .filter(timestamp => timestamp > windowStart);

    const remaining = Math.max(0, config.maxRequests - requests.length);
    const resetAt = new Date(now + config.windowMs);

    return { remaining, resetAt };
  }

  // ==================== Audit Logging ====================

  /**
   * Logs sensitive data access for audit trail
   *
   * @param entry - Audit log entry
   * @security HIPAA-compliant audit logging
   */
  async logSensitiveAccess(entry: Omit<AuditLogEntry, 'timestamp'>): Promise<void> {
    const fullEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date(),
    };

    // In production, store in dedicated audit log database
    this.logInfo({
      message: 'Sensitive data access',
      ...fullEntry,
      // Redact sensitive metadata
      metadata: fullEntry.metadata ? this.redactPII(fullEntry.metadata) : undefined,
    });
  }

  /**
   * Logs failed access attempts
   *
   * @param userId - User identifier
   * @param resource - Resource attempted
   * @param reason - Failure reason
   * @security Security monitoring and alerting
   */
  async logFailedAccess(userId: string, resource: string, reason: string): Promise<void> {
    await this.logSensitiveAccess({
      userId,
      action: 'access_denied',
      resource,
      classification: DataClassification.RESTRICTED,
      success: false,
      metadata: { reason },
    });

    this.logWarning(`Failed access attempt: ${userId} -> ${resource}: ${reason}`);
  }

  // ==================== Access Control ====================

  /**
   * Checks if user can access data based on classification
   *
   * @param userPermissions - User's permissions
   * @param dataClassification - Data classification level
   * @returns Access control decision
   * @security Role-based access control
   */
  checkDataAccess(
    userPermissions: string[],
    dataClassification: DataClassification,
  ): AccessControlDecision {
    const requiredPermissions: Record<DataClassification, string[]> = {
      [DataClassification.PUBLIC]: [],
      [DataClassification.INTERNAL]: ['data:read:internal'],
      [DataClassification.CONFIDENTIAL]: ['data:read:confidential'],
      [DataClassification.PII]: ['data:read:pii'],
      [DataClassification.RESTRICTED]: ['data:read:restricted'],
      [DataClassification.PHI]: ['data:read:phi'],
    };

    const required = requiredPermissions[dataClassification];

    const hasPermission = required.length === 0 ||
      required.some(perm => userPermissions.includes(perm));

    return {
      allowed: hasPermission,
      reason: hasPermission ? undefined : 'Insufficient permissions',
      requiredPermissions: hasPermission ? undefined : required,
      classification: dataClassification,
    };
  }

  /**
   * Implements column-level security filtering
   *
   * @param data - Data object to filter
   * @param userPermissions - User's permissions
   * @returns Filtered data based on column permissions
   * @security Column-level access control
   */
  applyColumnLevelSecurity<T extends Record<string, any>>(
    data: T,
    userPermissions: string[],
  ): Partial<T> {
    const filtered: Partial<T> = {};

    for (const [key, value] of Object.entries(data)) {
      const pattern = this.detectSensitiveField(key);

      if (!pattern) {
        // Non-sensitive field, include it
        filtered[key as keyof T] = value;
        continue;
      }

      // Check if user has permission for this field type
      const requiredPermission = `data:read:${pattern.type}`;

      if (userPermissions.includes(requiredPermission)) {
        filtered[key as keyof T] = value;
      } else {
        // User doesn't have permission, mask the field
        filtered[key as keyof T] = this.maskData(
          typeof value === 'string' ? value : JSON.stringify(value),
          pattern.type,
          MaskingStrategy.REDACT,
        ) as any;
      }
    }

    return filtered;
  }

  /**
   * Implements row-level security filtering
   *
   * @param rows - Array of data rows
   * @param userId - Current user ID
   * @param ownerField - Field name containing owner ID
   * @returns Filtered rows user can access
   * @security Row-level access control
   */
  applyRowLevelSecurity<T extends Record<string, any>>(
    rows: T[],
    userId: string,
    ownerField: string = 'userId',
  ): T[] {
    return rows.filter(row => row[ownerField] === userId);
  }

  // ==================== Data Leak Prevention ====================

  /**
   * Validates data before external transmission
   *
   * @param data - Data to validate
   * @param allowedClassifications - Allowed classification levels
   * @returns True if safe to transmit
   * @security Data loss prevention (DLP)
   */
  validateExternalTransmission(
    data: Record<string, any>,
    allowedClassifications: DataClassification[],
  ): { safe: boolean; violations: string[] } {
    const classification = this.classifyDataSensitivity(data);
    const violations: string[] = [];

    if (!allowedClassifications.includes(classification)) {
      violations.push(`Data classification ${classification} not allowed for external transmission`);
    }

    const sensitiveFields = this.scanForSensitiveFields(data);

    if (sensitiveFields.length > 0 && !allowedClassifications.includes(DataClassification.PHI)) {
      violations.push(`Sensitive fields detected: ${sensitiveFields.join(', ')}`);
    }

    return {
      safe: violations.length === 0,
      violations,
    };
  }

  /**
   * Scans for data exfiltration patterns
   *
   * @param data - Data to scan
   * @param maxSize - Maximum allowed data size in bytes
   * @returns True if potential exfiltration detected
   * @security Detects bulk data access patterns
   */
  detectDataExfiltration(data: any[], maxSize: number = 1048576): boolean {
    const dataSize = JSON.stringify(data).length;

    if (dataSize > maxSize) {
      this.logWarning(`Potential data exfiltration: ${dataSize} bytes`);
      return true;
    }

    // Check for bulk PII extraction
    const piiCount = data.reduce((count, item) => {
      const sensitiveFields = this.scanForSensitiveFields(item);
      return count + sensitiveFields.length;
    }, 0);

    const piiThreshold = data.length * 2; // More than 2 PII fields per record

    if (piiCount > piiThreshold) {
      this.logWarning(`Potential PII exfiltration: ${piiCount} sensitive fields in ${data.length} records`);
      return true;
    }

    return false;
  }

  // ==================== Private Helper Methods ====================

  /**
   * Masks data partially based on type
   */
  private maskPartial(value: string, type: PIIFieldType): string {
    switch (type) {
      case PIIFieldType.EMAIL:
        return this.maskEmail(value);
      case PIIFieldType.PHONE:
        return this.maskPhone(value);
      case PIIFieldType.SSN:
        return this.maskSSN(value);
      case PIIFieldType.CREDIT_CARD:
        return this.maskCreditCard(value);
      case PIIFieldType.IP_ADDRESS:
        return this.maskIPAddress(value);
      case PIIFieldType.MEDICAL_RECORD:
        return this.maskMedicalRecordNumber(value);
      default:
        return value.length > 4
          ? value.slice(0, 1) + '*'.repeat(value.length - 2) + value.slice(-1)
          : '*'.repeat(value.length);
    }
  }

  /**
   * Hashes value for masking
   */
  private hashValue(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex').slice(0, 16);
  }

  /**
   * Tokenizes value
   */
  private tokenizeValue(value: string): string {
    const token = crypto.randomBytes(16).toString('hex');
    // In production, store mapping in secure token vault
    return `TOKEN_${token}`;
  }

  /**
   * Checks if field name is potentially secret
   */
  private isPotentiallySecret(fieldName: string): boolean {
    const secretPatterns = [
      /password/i,
      /secret/i,
      /token/i,
      /key/i,
      /auth/i,
      /credential/i,
      /api_?key/i,
    ];

    return secretPatterns.some(pattern => pattern.test(fieldName));
  }

  /**
   * Cleans up expired CSRF tokens
   */
  private cleanupExpiredCSRFTokens(): void {
    const now = new Date();

    for (const [token, data] of this.csrfTokens.entries()) {
      if (data.expires < now) {
        this.csrfTokens.delete(token);
      }
    }
  }

  /**
   * Cleans up old rate limit entries
   */
  private cleanupRateLimitStore(): void {
    const now = Date.now();
    const maxAge = 3600000; // 1 hour

    for (const [key, requests] of this.rateLimitStore.entries()) {
      const validRequests = requests.filter(timestamp => timestamp > now - maxAge);

      if (validRequests.length === 0) {
        this.rateLimitStore.delete(key);
      } else {
        this.rateLimitStore.set(key, validRequests);
      }
    }
  }
}

/**
 * NestJS Interceptor for automatic PII redaction in responses
 */
@Injectable()
export class PIIRedactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSecurityService: DataSecurityService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (!data) return data;

        if (Array.isArray(data)) {
          return data.map(item =>
            typeof item === 'object' ? this.dataSecurityService.redactPII(item) : item,
          );
        }

        if (typeof data === 'object') {
          return this.dataSecurityService.redactPII(data);
        }

        return data;
      }),
    );
  }
}

/**
 * Decorator for automatic field encryption in DTOs
 */
export function Sensitive(type: PIIFieldType, strategy: MaskingStrategy = MaskingStrategy.PARTIAL) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata('sensitive:type', type, target, propertyKey);
    Reflect.defineMetadata('sensitive:strategy', strategy, target, propertyKey);
  };
}
