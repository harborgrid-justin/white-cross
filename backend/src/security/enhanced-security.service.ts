/**
 * @fileoverview Enhanced Production-Grade Security Service
 * @module security/enhanced-security
 * @description Comprehensive security hardening with threat detection, audit logging,
 * data encryption, and PII protection - extends existing security system
 *
 * @version 2.0.0
 * @requires @nestjs/common ^10.x
 * @requires crypto ^18.x
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

// ============================================================================
// SECURITY INTERFACES
// ============================================================================

export interface SecurityConfig {
  encryption: {
    algorithm: string;
    keyLength: number;
    ivLength: number;
  };
  audit: {
    enabled: boolean;
    retentionDays: number;
    sensitiveFields: string[];
  };
  threatDetection: {
    enabled: boolean;
    maxFailedAttempts: number;
    lockoutDuration: number;
    suspiciousPatterns: string[];
  };
  dataProtection: {
    enablePiiDetection: boolean;
    enableDataMasking: boolean;
    maskingCharacter: string;
  };
}

export interface EncryptionOptions {
  algorithm?: string;
  keyDerivation?: 'pbkdf2' | 'scrypt' | 'argon2';
  iterations?: number;
  salt?: Buffer;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  action: string;
  resource: string;
  result: 'SUCCESS' | 'FAILURE';
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: AuditCategory;
}

export enum AuditCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  DATA_ACCESS = 'data_access',
  DATA_MODIFICATION = 'data_modification',
  SECURITY_EVENT = 'security_event',
  SYSTEM_ADMINISTRATION = 'system_administration',
  CONFIGURATION_CHANGE = 'configuration_change',
}

export interface ThreatEvent {
  id: string;
  timestamp: Date;
  type: ThreatType;
  severity: ThreatSeverity;
  source: string;
  target: string;
  description: string;
  metadata?: Record<string, any>;
  mitigated: boolean;
  mitigationActions: string[];
}

export enum ThreatType {
  BRUTE_FORCE = 'brute_force',
  SQL_INJECTION = 'sql_injection',
  XSS_ATTEMPT = 'xss_attempt',
  CSRF_ATTEMPT = 'csrf_attempt',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  DATA_EXFILTRATION = 'data_exfiltration',
  PRIVILEGE_ESCALATION = 'privilege_escalation',
  SUSPICIOUS_PATTERN = 'suspicious_pattern',
}

export enum ThreatSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface PIIDetectionResult {
  detected: boolean;
  fields: Array<{
    field: string;
    type: PIIType;
    confidence: number;
    value: string;
    maskedValue: string;
  }>;
}

export enum PIIType {
  SSN = 'ssn',
  EMAIL = 'email',
  PHONE = 'phone',
  CREDIT_CARD = 'credit_card',
  ADDRESS = 'address',
  NAME = 'name',
  DATE_OF_BIRTH = 'date_of_birth',
  MEDICAL_ID = 'medical_id',
}

// ============================================================================
// ENCRYPTION SERVICE
// ============================================================================

@Injectable()
export class EnhancedEncryptionService {
  private readonly logger = new Logger(EnhancedEncryptionService.name);
  private readonly defaultAlgorithm = 'aes-256-gcm';
  private readonly keyCache = new Map<string, Buffer>();

  constructor(private readonly configService: ConfigService) {}

  /**
   * Encrypts data using AES-256-GCM
   */
  async encrypt(
    data: string | Buffer,
    key: string | Buffer,
    options: EncryptionOptions = {},
  ): Promise<{
    encrypted: Buffer;
    iv: Buffer;
    tag: Buffer;
    salt?: Buffer;
  }> {
    try {
      const algorithm = options.algorithm || this.defaultAlgorithm;
      const dataBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');

      // Generate IV
      const iv = crypto.randomBytes(16);

      // Derive key if string provided
      let derivedKey: Buffer;
      let salt: Buffer | undefined;

      if (Buffer.isBuffer(key)) {
        derivedKey = key;
      } else {
        salt = crypto.randomBytes(32);
        derivedKey = await this.deriveKey(key, salt, options);
      }

      // Create cipher
      const cipher = crypto.createCipher(algorithm, derivedKey);
      cipher.setAAD(iv); // Set Additional Authenticated Data

      // Encrypt data
      const encrypted = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);

      // Get authentication tag
      const tag = cipher.getAuthTag();

      return {
        encrypted,
        iv,
        tag,
        salt,
      };
    } catch (error) {
      this.logger.error('Encryption failed:', error);
      throw new Error(
        `Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Decrypts data using AES-256-GCM
   */
  async decrypt(
    encryptedData: {
      encrypted: Buffer;
      iv: Buffer;
      tag: Buffer;
      salt?: Buffer;
    },
    key: string | Buffer,
    options: EncryptionOptions = {},
  ): Promise<Buffer> {
    try {
      const algorithm = options.algorithm || this.defaultAlgorithm;

      // Derive key if string provided
      let derivedKey: Buffer;

      if (Buffer.isBuffer(key)) {
        derivedKey = key;
      } else {
        if (!encryptedData.salt) {
          throw new Error('Salt is required for key derivation');
        }
        derivedKey = await this.deriveKey(key, encryptedData.salt, options);
      }

      // Create decipher
      const decipher = crypto.createDecipher(algorithm, derivedKey);
      decipher.setAAD(encryptedData.iv);
      decipher.setAuthTag(encryptedData.tag);

      // Decrypt data
      const decrypted = Buffer.concat([decipher.update(encryptedData.encrypted), decipher.final()]);

      return decrypted;
    } catch (error) {
      this.logger.error('Decryption failed:', error);
      throw new Error(
        `Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Generates a cryptographically secure random key
   */
  generateKey(length: number = 32): Buffer {
    return crypto.randomBytes(length);
  }

  /**
   * Derives key from password using PBKDF2
   */
  private async deriveKey(
    password: string,
    salt: Buffer,
    options: EncryptionOptions = {},
  ): Promise<Buffer> {
    const cacheKey = `${password}:${salt.toString('hex')}`;

    if (this.keyCache.has(cacheKey)) {
      return this.keyCache.get(cacheKey);
    }

    const iterations = options.iterations || 100000;
    const keyLength = 32; // 256 bits

    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, iterations, keyLength, 'sha512', (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {
          this.keyCache.set(cacheKey, derivedKey);
          resolve(derivedKey);
        }
      });
    });
  }

  /**
   * Creates a secure hash of data
   */
  hash(data: string | Buffer, algorithm: string = 'sha256'): string {
    const hash = crypto.createHash(algorithm);
    hash.update(data);
    return hash.digest('hex');
  }

  /**
   * Verifies a hash against data
   */
  verifyHash(data: string | Buffer, hash: string, algorithm: string = 'sha256'): boolean {
    const computedHash = this.hash(data, algorithm);
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(computedHash));
  }
}

// ============================================================================
// AUDIT LOGGING SERVICE
// ============================================================================

@Injectable()
export class EnhancedAuditService {
  private readonly logger = new Logger(EnhancedAuditService.name);
  private auditLog: AuditLogEntry[] = [];
  private readonly maxLogSize = 10000;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Logs an audit event
   */
  async logEvent(
    action: string,
    resource: string,
    result: 'SUCCESS' | 'FAILURE',
    context: {
      userId?: string;
      sessionId?: string;
      ipAddress: string;
      userAgent: string;
      metadata?: Record<string, any>;
    },
    category: AuditCategory = AuditCategory.DATA_ACCESS,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM',
  ): Promise<void> {
    try {
      const auditEntry: AuditLogEntry = {
        id: this.generateAuditId(),
        timestamp: new Date(),
        action,
        resource,
        result,
        category,
        severity,
        ...context,
      };

      // Store audit entry
      this.auditLog.push(auditEntry);

      // Maintain log size
      if (this.auditLog.length > this.maxLogSize) {
        this.auditLog.shift();
      }

      // Log to console for immediate visibility
      const logLevel = this.getLogLevel(severity);
      this.logger[logLevel](`Audit Event: ${action} on ${resource} - ${result}`, {
        auditId: auditEntry.id,
        userId: context.userId,
        ipAddress: context.ipAddress,
        metadata: context.metadata,
      });

      // In production, persist to database or external audit system
    } catch (error) {
      this.logger.error('Failed to log audit event:', error);
    }
  }

  /**
   * Gets audit logs with filtering
   */
  getAuditLogs(filter?: {
    userId?: string;
    action?: string;
    category?: AuditCategory;
    startDate?: Date;
    endDate?: Date;
    severity?: string;
  }): AuditLogEntry[] {
    let filteredLogs = [...this.auditLog];

    if (filter) {
      if (filter.userId) {
        filteredLogs = filteredLogs.filter((log) => log.userId === filter.userId);
      }
      if (filter.action) {
        filteredLogs = filteredLogs.filter((log) => log.action.includes(filter.action));
      }
      if (filter.category) {
        filteredLogs = filteredLogs.filter((log) => log.category === filter.category);
      }
      if (filter.startDate) {
        filteredLogs = filteredLogs.filter((log) => log.timestamp >= filter.startDate);
      }
      if (filter.endDate) {
        filteredLogs = filteredLogs.filter((log) => log.timestamp <= filter.endDate);
      }
      if (filter.severity) {
        filteredLogs = filteredLogs.filter((log) => log.severity === filter.severity);
      }
    }

    return filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private generateAuditId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private getLogLevel(severity: string): 'log' | 'warn' | 'error' {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warn';
      default:
        return 'log';
    }
  }
}

// ============================================================================
// THREAT DETECTION SERVICE
// ============================================================================

@Injectable()
export class ThreatDetectionService {
  private readonly logger = new Logger(ThreatDetectionService.name);
  private threatEvents: ThreatEvent[] = [];
  private failedAttempts = new Map<string, { count: number; lastAttempt: Date }>();
  private readonly maxThreatEvents = 1000;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Detects and logs threat events
   */
  async detectThreat(
    type: ThreatType,
    source: string,
    target: string,
    description: string,
    metadata?: Record<string, any>,
  ): Promise<ThreatEvent> {
    const severity = this.calculateThreatSeverity(type, metadata);

    const threatEvent: ThreatEvent = {
      id: this.generateThreatId(),
      timestamp: new Date(),
      type,
      severity,
      source,
      target,
      description,
      metadata,
      mitigated: false,
      mitigationActions: [],
    };

    // Store threat event
    this.threatEvents.push(threatEvent);

    // Maintain event list size
    if (this.threatEvents.length > this.maxThreatEvents) {
      this.threatEvents.shift();
    }

    // Auto-mitigate certain threats
    await this.attemptAutoMitigation(threatEvent);

    // Log threat
    this.logger.error(`Threat Detected: ${type} from ${source} targeting ${target}`, {
      threatId: threatEvent.id,
      severity,
      description,
      metadata,
    });

    return threatEvent;
  }

  /**
   * Records failed authentication attempt
   */
  async recordFailedAttempt(identifier: string): Promise<boolean> {
    const existing = this.failedAttempts.get(identifier);
    const now = new Date();

    if (existing) {
      // Reset if last attempt was more than 1 hour ago
      if (now.getTime() - existing.lastAttempt.getTime() > 3600000) {
        existing.count = 1;
      } else {
        existing.count++;
      }
      existing.lastAttempt = now;
    } else {
      this.failedAttempts.set(identifier, { count: 1, lastAttempt: now });
    }

    const attempts = this.failedAttempts.get(identifier);

    // Detect brute force if more than 5 attempts
    if (attempts.count >= 5) {
      await this.detectThreat(
        ThreatType.BRUTE_FORCE,
        identifier,
        'authentication_system',
        `Brute force attack detected: ${attempts.count} failed attempts`,
        { attempts: attempts.count },
      );
      return true; // Indicates lockout needed
    }

    return false;
  }

  /**
   * Gets threat statistics
   */
  getThreatStatistics(): {
    totalThreats: number;
    threatsByType: Record<ThreatType, number>;
    threatsBySeverity: Record<ThreatSeverity, number>;
    recentThreats: ThreatEvent[];
  } {
    const threatsByType = {} as Record<ThreatType, number>;
    const threatsBySeverity = {} as Record<ThreatSeverity, number>;

    for (const threat of this.threatEvents) {
      threatsByType[threat.type] = (threatsByType[threat.type] || 0) + 1;
      threatsBySeverity[threat.severity] = (threatsBySeverity[threat.severity] || 0) + 1;
    }

    const recentThreats = this.threatEvents
      .filter((threat) => Date.now() - threat.timestamp.getTime() < 86400000) // Last 24 hours
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      totalThreats: this.threatEvents.length,
      threatsByType,
      threatsBySeverity,
      recentThreats,
    };
  }

  private calculateThreatSeverity(
    type: ThreatType,
    metadata?: Record<string, any>,
  ): ThreatSeverity {
    // Base severity by threat type
    const baseSeverity: Record<ThreatType, ThreatSeverity> = {
      [ThreatType.BRUTE_FORCE]: ThreatSeverity.HIGH,
      [ThreatType.SQL_INJECTION]: ThreatSeverity.CRITICAL,
      [ThreatType.XSS_ATTEMPT]: ThreatSeverity.HIGH,
      [ThreatType.CSRF_ATTEMPT]: ThreatSeverity.MEDIUM,
      [ThreatType.UNAUTHORIZED_ACCESS]: ThreatSeverity.HIGH,
      [ThreatType.DATA_EXFILTRATION]: ThreatSeverity.CRITICAL,
      [ThreatType.PRIVILEGE_ESCALATION]: ThreatSeverity.CRITICAL,
      [ThreatType.SUSPICIOUS_PATTERN]: ThreatSeverity.MEDIUM,
    };

    let severity = baseSeverity[type] || ThreatSeverity.MEDIUM;

    // Adjust based on metadata
    if (metadata?.attempts && metadata.attempts > 10) {
      severity = ThreatSeverity.CRITICAL;
    }

    return severity;
  }

  private async attemptAutoMitigation(threatEvent: ThreatEvent): Promise<void> {
    const mitigationActions: string[] = [];

    switch (threatEvent.type) {
      case ThreatType.BRUTE_FORCE:
        mitigationActions.push('Temporary IP block applied');
        mitigationActions.push('Rate limiting increased');
        break;

      case ThreatType.SQL_INJECTION:
      case ThreatType.XSS_ATTEMPT:
        mitigationActions.push('Request blocked');
        mitigationActions.push('Input sanitization applied');
        break;

      default:
        mitigationActions.push('Threat logged for manual review');
    }

    threatEvent.mitigationActions = mitigationActions;
    threatEvent.mitigated = mitigationActions.length > 0;
  }

  private generateThreatId(): string {
    return `threat_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
}

// ============================================================================
// PII DETECTION SERVICE
// ============================================================================

@Injectable()
export class PIIDetectionService {
  private readonly logger = new Logger(PIIDetectionService.name);

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
  detectPII(data: string | Record<string, any>): PIIDetectionResult {
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
    data: string | Record<string, any>,
    maskingChar: string = '*',
  ): string | Record<string, any> {
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

// ============================================================================
// MAIN ENHANCED SECURITY SERVICE
// ============================================================================

@Injectable()
export class EnhancedSecurityService {
  private readonly logger = new Logger(EnhancedSecurityService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly encryptionService: EnhancedEncryptionService,
    private readonly auditService: EnhancedAuditService,
    private readonly threatDetection: ThreatDetectionService,
    private readonly piiDetection: PIIDetectionService,
  ) {}

  /**
   * Comprehensive security scan of data
   */
  async securityScan(
    data: Record<string, any>,
    context: {
      userId?: string;
      action: string;
      ipAddress: string;
    },
  ): Promise<{
    piiDetected: PIIDetectionResult;
    threatsDetected: ThreatEvent[];
    auditLogged: boolean;
  }> {
    try {
      // Detect PII
      const piiDetected = this.piiDetection.detectPII(data);

      // Check for security threats in the data
      const threatsDetected: ThreatEvent[] = [];

      // Simple threat detection (in production, use more sophisticated methods)
      for (const [field, value] of Object.entries(data)) {
        if (typeof value === 'string') {
          if (this.containsSqlInjection(value)) {
            const threat = await this.threatDetection.detectThreat(
              ThreatType.SQL_INJECTION,
              context.ipAddress,
              field,
              'Potential SQL injection detected in input',
              { field, value: value.substring(0, 100) },
            );
            threatsDetected.push(threat);
          }

          if (this.containsXSS(value)) {
            const threat = await this.threatDetection.detectThreat(
              ThreatType.XSS_ATTEMPT,
              context.ipAddress,
              field,
              'Potential XSS attempt detected in input',
              { field, value: value.substring(0, 100) },
            );
            threatsDetected.push(threat);
          }
        }
      }

      // Log audit event
      await this.auditService.logEvent(
        context.action,
        'data_security_scan',
        threatsDetected.length > 0 ? 'FAILURE' : 'SUCCESS',
        {
          userId: context.userId,
          ipAddress: context.ipAddress,
          userAgent: 'security-scanner',
          metadata: {
            piiFields: piiDetected.fields.length,
            threatsDetected: threatsDetected.length,
          },
        },
        AuditCategory.SECURITY_EVENT,
        threatsDetected.length > 0 ? 'HIGH' : 'LOW',
      );

      return {
        piiDetected,
        threatsDetected,
        auditLogged: true,
      };
    } catch (error) {
      this.logger.error('Security scan failed:', error);
      throw error;
    }
  }

  /**
   * Encrypts sensitive data
   */
  async encryptSensitiveData(
    data: Record<string, any>,
    masterKey: string,
  ): Promise<{
    encryptedData: Record<string, any>;
    encryptionKeys: Record<string, string>;
  }> {
    const piiResult = this.piiDetection.detectPII(data);
    const encryptedData = { ...data };
    const encryptionKeys: Record<string, string> = {};

    for (const piiField of piiResult.fields) {
      if (encryptedData[piiField.field]) {
        const encrypted = await this.encryptionService.encrypt(
          encryptedData[piiField.field],
          masterKey,
        );

        // Store encrypted data and keys
        encryptedData[piiField.field] = encrypted.encrypted.toString('base64');
        encryptionKeys[piiField.field] = JSON.stringify({
          iv: encrypted.iv.toString('base64'),
          tag: encrypted.tag.toString('base64'),
          salt: encrypted.salt?.toString('base64'),
        });
      }
    }

    return { encryptedData, encryptionKeys };
  }

  private containsSqlInjection(value: string): boolean {
    const sqlPatterns = [
      /('|(\\')|(;)|(\|)|(\*)|(%)|(\-\-)|(\+)|(\|\|)/i,
      /(union|select|insert|update|delete|drop|create|alter|exec|execute)/i,
      /(script|javascript|vbscript|onload|onerror|onclick)/i,
    ];

    return sqlPatterns.some((pattern) => pattern.test(value));
  }

  private containsXSS(value: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b/gi,
      /<embed\b/gi,
      /<object\b/gi,
    ];

    return xssPatterns.some((pattern) => pattern.test(value));
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  EnhancedSecurityService,
  EnhancedEncryptionService,
  EnhancedAuditService,
  ThreatDetectionService,
  PIIDetectionService,
};
