/**
 * LOC: PHI001
 * File: /reuse/document/composites/downstream/phi-protection-modules.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - crypto (Node.js built-in)
 *   - ../document-security-encryption-composite
 *
 * DOWNSTREAM (imported by):
 *   - PHI processing services
 *   - Data protection services
 *   - PII/PHI detection services
 */

import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * PII/PHI data types
 */
export enum PHIDataType {
  NAME = 'NAME',
  DATE_OF_BIRTH = 'DATE_OF_BIRTH',
  SOCIAL_SECURITY_NUMBER = 'SSN',
  MEDICAL_RECORD_NUMBER = 'MRN',
  HEALTH_PLAN_ID = 'HEALTH_PLAN_ID',
  ACCOUNT_NUMBER = 'ACCOUNT_NUMBER',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  FACS_NUMBER = 'FACS_NUMBER',
  ADDRESS = 'ADDRESS',
  CITY = 'CITY',
  STATE = 'STATE',
  ZIP_CODE = 'ZIP_CODE',
  IP_ADDRESS = 'IP_ADDRESS',
  VEHICLE_ID = 'VEHICLE_ID',
  DEVICE_ID = 'DEVICE_ID',
  BIOMETRIC = 'BIOMETRIC',
  DIAGNOSIS = 'DIAGNOSIS',
  MEDICATION = 'MEDICATION',
  TREATMENT = 'TREATMENT',
}

/**
 * PHI masking type
 */
export enum MaskingType {
  REDACTION = 'REDACTION',
  PARTIAL_MASKING = 'PARTIAL_MASKING',
  TOKENIZATION = 'TOKENIZATION',
  ENCRYPTION = 'ENCRYPTION',
  HASHING = 'HASHING',
}

/**
 * PHI field
 */
export interface PHIField {
  fieldId: string;
  dataType: PHIDataType;
  value: string;
  masked: boolean;
  masking Type?: MaskingType;
  originalHash?: string;
  token?: string;
}

/**
 * PII/PHI detection result
 */
export interface PHIDetectionResult {
  documentId: string;
  piiDetected: boolean;
  phiDetected: boolean;
  detectedFields: {
    dataType: PHIDataType;
    confidence: number;
    locations: { line: number; column: number }[];
  }[];
  totalFieldsDetected: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

/**
 * PHI masking result
 */
export interface PHIMaskingResult {
  fieldId: string;
  originalValue: string;
  maskedValue: string;
  maskingType: MaskingType;
  timestamp: Date;
}

/**
 * PHI protection service
 * Manages detection, masking, and protection of PHI/PII data
 */
@Injectable()
export class PHIProtectionModule {
  private readonly logger = new Logger(PHIProtectionModule.name);
  private phiPatterns = this.initializePatterns();
  private tokenizedValues: Map<string, { token: string; dataType: PHIDataType; createdAt: Date }> = new Map();
  private maskingHistory: PHIMaskingResult[] = [];

  /**
   * Initializes PII/PHI detection patterns
   */
  private initializePatterns(): Map<PHIDataType, RegExp> {
    return new Map([
      [PHIDataType.SOCIAL_SECURITY_NUMBER, /\b\d{3}-\d{2}-\d{4}\b/g],
      [PHIDataType.MEDICAL_RECORD_NUMBER, /\bMRN\s*:?\s*(\d{6,})\b/gi],
      [PHIDataType.EMAIL, /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g],
      [PHIDataType.PHONE, /\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/g],
      [PHIDataType.ZIP_CODE, /\b\d{5}(?:-\d{4})?\b/g],
      [PHIDataType.DATE_OF_BIRTH, /\b(?:0?[1-9]|1[0-2])\/(?:0?[1-9]|[12][0-9]|3[01])\/(?:\d{4}|\d{2})\b/g],
      [PHIDataType.IP_ADDRESS, /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g],
    ]);
  }

  /**
   * Detects PII/PHI in document
   * @param documentContent - Document content to scan
   * @param documentId - Document identifier
   * @returns Detection result with findings
   */
  async detectPHI(documentContent: string, documentId: string): Promise<PHIDetectionResult> {
    try {
      const detectedFields: any[] = [];
      const detectedTypes = new Set<PHIDataType>();

      // Scan for each pattern
      for (const [dataType, pattern] of this.phiPatterns) {
        const matches = Array.from(documentContent.matchAll(pattern));

        if (matches.length > 0) {
          detectedTypes.add(dataType);

          matches.forEach(match => {
            detectedFields.push({
              dataType,
              confidence: 0.95,
              value: match[0],
              line: documentContent.substring(0, match.index).split('\n').length,
              column: match.index
            });
          });
        }
      }

      // Detect diagnosis and treatment using keyword matching
      const clinicalKeywords = {
        DIAGNOSIS: /\b(diabetes|hypertension|cancer|cardiac|pneumonia|covid)\b/gi,
        MEDICATION: /\b(metformin|lisinopril|chemotherapy|insulin)\b/gi,
        TREATMENT: /\b(surgery|radiation|chemotherapy|dialysis)\b/gi,
      };

      for (const [type, pattern] of Object.entries(clinicalKeywords)) {
        const matches = Array.from(documentContent.matchAll(pattern as RegExp));
        if (matches.length > 0) {
          const dataType = type as any;
          detectedTypes.add(PHIDataType[dataType]);

          matches.forEach(match => {
            detectedFields.push({
              dataType: PHIDataType[dataType],
              confidence: 0.85,
              value: match[0],
              line: documentContent.substring(0, match.index).split('\n').length,
              column: match.index
            });
          });
        }
      }

      const piiDetected = detectedFields.some(f =>
        [PHIDataType.NAME, PHIDataType.SOCIAL_SECURITY_NUMBER, PHIDataType.EMAIL, PHIDataType.PHONE].includes(f.dataType)
      );

      const phiDetected = detectedFields.some(f =>
        [PHIDataType.MEDICAL_RECORD_NUMBER, PHIDataType.DIAGNOSIS, PHIDataType.MEDICATION, PHIDataType.TREATMENT].includes(f.dataType)
      );

      const riskLevel = detectedFields.length > 10 ? 'CRITICAL' :
                       detectedFields.length > 5 ? 'HIGH' :
                       detectedFields.length > 2 ? 'MEDIUM' : 'LOW';

      this.logger.log(`PHI detection completed for ${documentId}: ${detectedFields.length} fields detected`);

      return {
        documentId,
        piiDetected,
        phiDetected,
        detectedFields,
        totalFieldsDetected: detectedFields.length,
        riskLevel
      };
    } catch (error) {
      this.logger.error(`PHI detection failed: ${error.message}`);
      throw new BadRequestException('Failed to detect PHI');
    }
  }

  /**
   * Masks sensitive data in document
   * @param documentContent - Document content
   * @param fields - Fields to mask
   * @param maskingType - Type of masking to apply
   * @returns Masked document content
   */
  async maskPHI(
    documentContent: string,
    fields: PHIField[],
    maskingType: MaskingType = MaskingType.REDACTION
  ): Promise<{ maskedContent: string; maskedFields: PHIMaskingResult[] }> {
    try {
      let maskedContent = documentContent;
      const maskedFields: PHIMaskingResult[] = [];

      for (const field of fields) {
        let maskedValue = '';

        switch (maskingType) {
          case MaskingType.REDACTION:
            maskedValue = '[REDACTED]';
            break;
          case MaskingType.PARTIAL_MASKING:
            maskedValue = this.partialMask(field.value, field.dataType);
            break;
          case MaskingType.TOKENIZATION:
            maskedValue = await this.tokenize(field.value, field.dataType);
            break;
          case MaskingType.ENCRYPTION:
            maskedValue = await this.encryptField(field.value);
            break;
          case MaskingType.HASHING:
            maskedValue = this.hashField(field.value);
            break;
        }

        // Replace in document
        maskedContent = maskedContent.replace(field.value, maskedValue);

        maskedFields.push({
          fieldId: field.fieldId,
          originalValue: field.value,
          maskedValue,
          maskingType,
          timestamp: new Date()
        });

        this.maskingHistory.push({
          fieldId: field.fieldId,
          originalValue: field.value,
          maskedValue,
          maskingType,
          timestamp: new Date()
        });
      }

      this.logger.log(`PHI masked: ${maskedFields.length} fields`);

      return { maskedContent, maskedFields };
    } catch (error) {
      this.logger.error(`PHI masking failed: ${error.message}`);
      throw new BadRequestException('Failed to mask PHI');
    }
  }

  /**
   * De-identifies document by removing all PHI
   * @param documentContent - Document content
   * @returns De-identified document
   */
  async deidentify(documentContent: string): Promise<{ deidentifiedContent: string; removedFields: number }> {
    try {
      let deidentifiedContent = documentContent;
      let removedCount = 0;

      // Remove all detected patterns
      for (const [, pattern] of this.phiPatterns) {
        const matches = Array.from(deidentifiedContent.matchAll(pattern));
        removedCount += matches.length;
        deidentifiedContent = deidentifiedContent.replace(pattern, '[REMOVED]');
      }

      this.logger.log(`Document de-identified: ${removedCount} fields removed`);

      return { deidentifiedContent, removedFields: removedCount };
    } catch (error) {
      this.logger.error(`De-identification failed: ${error.message}`);
      throw new BadRequestException('Failed to de-identify document');
    }
  }

  /**
   * Tokenizes sensitive value
   * @param value - Value to tokenize
   * @param dataType - Data type
   * @returns Unique token
   */
  private async tokenize(value: string, dataType: PHIDataType): Promise<string> {
    const hash = crypto.createHash('sha256').update(value).digest('hex');

    // Check if already tokenized
    for (const [key, token] of this.tokenizedValues) {
      if (key === value) {
        return token.token;
      }
    }

    const token = `TOK_${hash.substring(0, 16).toUpperCase()}`;
    this.tokenizedValues.set(value, { token, dataType, createdAt: new Date() });

    return token;
  }

  /**
   * Encrypts field value
   * @param value - Value to encrypt
   * @returns Encrypted value in hex
   */
  private async encryptField(value: string): Promise<string> {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return `ENC_${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
  }

  /**
   * Hashes field value
   * @param value - Value to hash
   * @returns Hash value
   */
  private hashField(value: string): string {
    return `HASH_${crypto.createHash('sha512').update(value).digest('hex').substring(0, 16).toUpperCase()}`;
  }

  /**
   * Partially masks value
   * @param value - Value to mask
   * @param dataType - Data type
   * @returns Partially masked value
   */
  private partialMask(value: string, dataType: PHIDataType): string {
    switch (dataType) {
      case PHIDataType.SOCIAL_SECURITY_NUMBER:
        return `XXX-XX-${value.slice(-4)}`;
      case PHIDataType.EMAIL:
        const parts = value.split('@');
        return `${parts[0].substring(0, 2)}***@${parts[1]}`;
      case PHIDataType.PHONE:
        return `XXX-XXX-${value.slice(-4)}`;
      case PHIDataType.NAME:
        return `${value.substring(0, 1)}${'*'.repeat(value.length - 2)}${value.slice(-1)}`;
      default:
        return `${'*'.repeat(value.length)}`;
    }
  }

  /**
   * De-tokenizes value
   * @param token - Token to resolve
   * @returns Original value if found, null otherwise
   */
  async detokenize(token: string): Promise<string | null> {
    for (const [value, tokenInfo] of this.tokenizedValues) {
      if (tokenInfo.token === token) {
        return value;
      }
    }
    return null;
  }

  /**
   * Gets masking history
   * @param filters - Filter criteria
   * @returns Masking history entries
   */
  async getMaskingHistory(filters?: {
    fieldId?: string;
    maskingType?: MaskingType;
    startDate?: Date;
    endDate?: Date;
  }): Promise<PHIMaskingResult[]> {
    let history = [...this.maskingHistory];

    if (filters?.fieldId) {
      history = history.filter(h => h.fieldId === filters.fieldId);
    }
    if (filters?.maskingType) {
      history = history.filter(h => h.maskingType === filters.maskingType);
    }
    if (filters?.startDate) {
      history = history.filter(h => h.timestamp >= filters.startDate);
    }
    if (filters?.endDate) {
      history = history.filter(h => h.timestamp <= filters.endDate);
    }

    return history;
  }

  /**
   * Validates PHI protection compliance
   * @returns Compliance status
   */
  async validateComplianceStatus(): Promise<{
    compliant: boolean;
    findings: string[];
    recommendations: string[];
  }> {
    const findings: string[] = [];
    const recommendations: string[] = [];

    // Check masking history
    if (this.maskingHistory.length === 0) {
      findings.push('No masking operations recorded');
      recommendations.push('Implement PHI masking in data processing workflow');
    }

    // Check tokenization
    if (this.tokenizedValues.size === 0) {
      recommendations.push('Consider tokenization for sensitive values');
    }

    return {
      compliant: findings.length === 0,
      findings,
      recommendations
    };
  }
}

export default PHIProtectionModule;
