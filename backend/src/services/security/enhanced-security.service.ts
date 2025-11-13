/**
 * @fileoverview Enhanced Production-Grade Security Service
 * @module security/enhanced-security
 * @description Main orchestrator for comprehensive security hardening with threat detection,
 * audit logging, data encryption, and PII protection
 *
 * @version 2.0.0
 * @requires @nestjs/common ^10.x
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PIIDetectionResult,
  ThreatEvent,
  ThreatType,
  AuditCategory,
} from './interfaces/security.interfaces';
import { EnhancedEncryptionService } from '@/services/encryption.service';
import { EnhancedAuditService } from '@/services/audit.service';
import { PIIDetectionService } from '@/services/pii-detection.service';
import { EnhancedThreatDetectionService } from '@/services/enhanced-threat-detection.service';

import { BaseService } from '@/common/base';
// Re-export interfaces for backward compatibility
export * from './interfaces/security.interfaces';

// Re-export services for backward compatibility
export { EnhancedEncryptionService } from '@/services/encryption.service';
export { EnhancedAuditService } from '@/services/audit.service';
export { PIIDetectionService } from '@/services/pii-detection.service';
export { EnhancedThreatDetectionService } from '@/services/enhanced-threat-detection.service';

// ============================================================================
// MAIN ENHANCED SECURITY SERVICE (Orchestrator)
// ============================================================================

@Injectable()
export class EnhancedSecurityService extends BaseService {
  constructor(
    private readonly configService: ConfigService,
    private readonly encryptionService: EnhancedEncryptionService,
    private readonly auditService: EnhancedAuditService,
    private readonly threatDetection: EnhancedThreatDetectionService,
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
      this.logError('Security scan failed:', error);
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
