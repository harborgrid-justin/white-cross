/**
 * LOC: DRM001
 * File: /reuse/document/composites/downstream/drm-systems.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - crypto (Node.js built-in)
 *   - ../document-security-encryption-composite
 *
 * DOWNSTREAM (imported by):
 *   - Document protection services
 *   - Access control systems
 *   - Watermarking services
 */

import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * DRM protection levels
 */
export enum DRMLevel {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  ADVANCED = 'ADVANCED',
  ENTERPRISE = 'ENTERPRISE',
}

/**
 * Watermark types
 */
export enum WatermarkType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  COMPOSITE = 'COMPOSITE',
  INVISIBLE = 'INVISIBLE',
  DYNAMIC = 'DYNAMIC',
}

/**
 * DRM license
 */
export interface DRMLicense {
  licenseId: string;
  documentId: string;
  userId: string;
  issueDate: Date;
  expiresAt: Date;
  rights: DRMRight[];
  restrictions: DRMRestriction[];
  deviceBindings?: string[];
  watermarkId?: string;
}

/**
 * DRM right
 */
export interface DRMRight {
  right: 'VIEW' | 'PRINT' | 'COPY' | 'EDIT' | 'EXTRACT' | 'SHARE';
  granted: boolean;
  limitations?: Record<string, any>;
}

/**
 * DRM restriction
 */
export interface DRMRestriction {
  type: 'COPY_COUNT' | 'PRINT_COUNT' | 'EXPIRATION' | 'DEVICE_BINDING' | 'GEOLOCATION' | 'TIME_WINDOW';
  value: any;
  enforced: boolean;
}

/**
 * Watermark configuration
 */
export interface WatermarkConfig {
  type: WatermarkType;
  text?: string;
  opacity: number;
  rotation: number;
  position: { x: number; y: number };
  fontSize?: number;
  color?: string;
  dynamic: boolean;
  variables?: Record<string, string>;
}

/**
 * DRM verification result
 */
export interface DRMVerificationResult {
  valid: boolean;
  licenseId?: string;
  rightsGranted: string[];
  restrictionsActive: string[];
  expiresAt?: Date;
  violations: string[];
}

/**
 * Digital Rights Management system
 * Manages document protection, licensing, watermarking, and usage restrictions
 */
@Injectable()
export class DRMSystem {
  private readonly logger = new Logger(DRMSystem.name);
  private licenses: Map<string, DRMLicense> = new Map();
  private watermarks: Map<string, { config: WatermarkConfig; appliedAt: Date }> = new Map();
  private usageTracking: Map<string, { action: string; timestamp: Date; count: number }[]> = new Map();

  /**
   * Issues DRM license for document
   * @param documentId - Document identifier
   * @param userId - User identifier
   * @param level - DRM protection level
   * @param expirationDays - License expiration in days
   * @returns Issued DRM license
   */
  async issueDRMLicense(
    documentId: string,
    userId: string,
    level: DRMLevel,
    expirationDays: number = 30
  ): Promise<DRMLicense> {
    try {
      const licenseId = crypto.randomUUID();
      const issueDate = new Date();
      const expiresAt = new Date(issueDate.getTime() + expirationDays * 24 * 60 * 60 * 1000);

      const rights = this.getDefaultRights(level);
      const restrictions = this.getDefaultRestrictions(level);

      const license: DRMLicense = {
        licenseId,
        documentId,
        userId,
        issueDate,
        expiresAt,
        rights,
        restrictions
      };

      this.licenses.set(licenseId, license);
      this.logger.log(`DRM license issued: ${licenseId} for user ${userId}`);

      return license;
    } catch (error) {
      this.logger.error(`Failed to issue DRM license: ${error.message}`);
      throw new BadRequestException('Failed to issue DRM license');
    }
  }

  /**
   * Applies watermark to document
   * @param documentId - Document identifier
   * @param config - Watermark configuration
   * @param contentBuffer - Document content
   * @returns Watermarked document buffer
   */
  async applyWatermark(
    documentId: string,
    config: WatermarkConfig,
    contentBuffer: Buffer
  ): Promise<{ watermarkedContent: Buffer; watermarkId: string; appliedAt: Date }> {
    try {
      const watermarkId = crypto.randomUUID();
      const appliedAt = new Date();

      // In production, use pdf-lib or imagemagick to apply actual watermark
      const watermarkedContent = Buffer.from(contentBuffer);

      this.watermarks.set(watermarkId, { config, appliedAt });

      // Track watermark usage
      const key = `${documentId}:watermark`;
      if (!this.usageTracking.has(key)) {
        this.usageTracking.set(key, []);
      }
      this.usageTracking.get(key).push({
        action: 'watermark_applied',
        timestamp: appliedAt,
        count: 1
      });

      this.logger.log(`Watermark applied: ${watermarkId} on document ${documentId}`);

      return {
        watermarkedContent,
        watermarkId,
        appliedAt
      };
    } catch (error) {
      this.logger.error(`Failed to apply watermark: ${error.message}`);
      throw new BadRequestException('Failed to apply watermark');
    }
  }

  /**
   * Applies dynamic watermark based on user context
   * @param documentId - Document identifier
   * @param userId - User identifier
   * @param userName - User name
   * @param contentBuffer - Document content
   * @returns Watermarked document with user-specific information
   */
  async applyDynamicWatermark(
    documentId: string,
    userId: string,
    userName: string,
    contentBuffer: Buffer
  ): Promise<{ watermarkedContent: Buffer; watermarkId: string; variables: Record<string, string> }> {
    try {
      const watermarkId = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      const accessHash = crypto.createHash('sha256').update(`${userId}:${timestamp}`).digest('hex').substring(0, 8);

      const variables = {
        userId,
        userName,
        timestamp,
        accessHash,
        documentId
      };

      const config: WatermarkConfig = {
        type: WatermarkType.DYNAMIC,
        text: `${userName} - ${timestamp}`,
        opacity: 0.3,
        rotation: -45,
        position: { x: 50, y: 50 },
        dynamic: true,
        variables
      };

      const watermarkedContent = Buffer.from(contentBuffer);
      this.watermarks.set(watermarkId, { config, appliedAt: new Date() });

      this.logger.log(`Dynamic watermark applied: ${watermarkId}`);

      return { watermarkedContent, watermarkId, variables };
    } catch (error) {
      this.logger.error(`Failed to apply dynamic watermark: ${error.message}`);
      throw new BadRequestException('Failed to apply dynamic watermark');
    }
  }

  /**
   * Verifies DRM license validity
   * @param licenseId - License identifier
   * @param userId - User identifier
   * @param action - Requested action
   * @returns Verification result
   */
  async verifyDRMLicense(
    licenseId: string,
    userId: string,
    action: 'VIEW' | 'PRINT' | 'COPY' | 'EDIT' | 'EXTRACT' | 'SHARE'
  ): Promise<DRMVerificationResult> {
    const license = this.licenses.get(licenseId);

    if (!license) {
      return {
        valid: false,
        rightsGranted: [],
        restrictionsActive: [],
        violations: ['License not found']
      };
    }

    const violations: string[] = [];
    const restrictionsActive: string[] = [];
    const rightsGranted: string[] = [];

    // Check user match
    if (license.userId !== userId) {
      violations.push('License does not belong to user');
    }

    // Check expiration
    if (new Date() > license.expiresAt) {
      violations.push('License has expired');
      restrictionsActive.push('EXPIRATION');
    }

    // Check rights
    const right = license.rights.find(r => r.right === action);
    if (!right || !right.granted) {
      violations.push(`Right '${action}' not granted`);
    } else {
      rightsGranted.push(action);
    }

    // Check restrictions
    license.restrictions.forEach(restriction => {
      if (restriction.enforced) {
        restrictionsActive.push(restriction.type);

        // Validate restriction based on type
        switch (restriction.type) {
          case 'COPY_COUNT':
            if (action === 'COPY' && this.checkCopyLimit(license.documentId, restriction.value)) {
              violations.push(`Copy limit reached: ${restriction.value}`);
            }
            break;
          case 'PRINT_COUNT':
            if (action === 'PRINT' && this.checkPrintLimit(license.documentId, restriction.value)) {
              violations.push(`Print limit reached: ${restriction.value}`);
            }
            break;
        }
      }
    });

    const valid = violations.length === 0;

    return {
      valid,
      licenseId,
      rightsGranted,
      restrictionsActive,
      expiresAt: license.expiresAt,
      violations
    };
  }

  /**
   * Enforces DRM restrictions on document access
   * @param documentId - Document identifier
   * @param userId - User identifier
   * @param action - Requested action
   * @param context - Access context
   * @returns Enforcement result
   */
  async enforceDRMRestrictions(
    documentId: string,
    userId: string,
    action: string,
    context: { ipAddress?: string; location?: string; deviceId?: string }
  ): Promise<{ allowed: boolean; reason?: string }> {
    try {
      // Find active license for user
      const userLicenses = Array.from(this.licenses.values()).filter(
        l => l.documentId === documentId && l.userId === userId && new Date() <= l.expiresAt
      );

      if (userLicenses.length === 0) {
        return { allowed: false, reason: 'No active DRM license found' };
      }

      const license = userLicenses[0];

      // Track usage
      const key = `${documentId}:${action}`;
      if (!this.usageTracking.has(key)) {
        this.usageTracking.set(key, []);
      }

      const tracking = this.usageTracking.get(key);
      const today = new Date().toDateString();
      const todayCount = tracking.filter(t => t.timestamp.toDateString() === today).length;

      // Verify restrictions
      for (const restriction of license.restrictions) {
        if (!restriction.enforced) continue;

        if (restriction.type === 'COPY_COUNT' && action === 'COPY') {
          if (todayCount >= restriction.value) {
            return { allowed: false, reason: `Daily copy limit reached: ${restriction.value}` };
          }
        }

        if (restriction.type === 'PRINT_COUNT' && action === 'PRINT') {
          if (todayCount >= restriction.value) {
            return { allowed: false, reason: `Daily print limit reached: ${restriction.value}` };
          }
        }

        if (restriction.type === 'DEVICE_BINDING' && license.deviceBindings) {
          if (!license.deviceBindings.includes(context.deviceId)) {
            return { allowed: false, reason: 'Device not authorized' };
          }
        }
      }

      // Record usage
      tracking.push({ action, timestamp: new Date(), count: 1 });
      this.logger.log(`DRM restriction enforced: ${documentId} - ${action}`);

      return { allowed: true };
    } catch (error) {
      this.logger.error(`DRM enforcement failed: ${error.message}`);
      return { allowed: false, reason: 'DRM enforcement failed' };
    }
  }

  /**
   * Binds DRM license to specific device
   * @param licenseId - License identifier
   * @param deviceId - Device identifier
   * @returns Updated license
   */
  async bindLicenseToDevice(licenseId: string, deviceId: string): Promise<DRMLicense> {
    const license = this.licenses.get(licenseId);
    if (!license) {
      throw new BadRequestException('License not found');
    }

    if (!license.deviceBindings) {
      license.deviceBindings = [];
    }

    if (!license.deviceBindings.includes(deviceId)) {
      license.deviceBindings.push(deviceId);
    }

    this.logger.log(`License bound to device: ${licenseId} - ${deviceId}`);
    return license;
  }

  /**
   * Revokes DRM license
   * @param licenseId - License identifier
   * @param reason - Revocation reason
   * @returns Revocation result
   */
  async revokeDRMLicense(
    licenseId: string,
    reason: string
  ): Promise<{ revoked: boolean; timestamp: Date; reason: string }> {
    const license = this.licenses.get(licenseId);
    if (!license) {
      throw new BadRequestException('License not found');
    }

    // Set expiration to now
    license.expiresAt = new Date();

    this.logger.warn(`DRM license revoked: ${licenseId} - ${reason}`);

    return {
      revoked: true,
      timestamp: new Date(),
      reason
    };
  }

  /**
   * Gets DRM license details
   * @param licenseId - License identifier
   * @returns License details
   */
  async getDRMLicense(licenseId: string): Promise<DRMLicense | null> {
    return this.licenses.get(licenseId) || null;
  }

  /**
   * Extends DRM license expiration
   * @param licenseId - License identifier
   * @param additionalDays - Days to extend
   * @returns Updated license
   */
  async extendDRMLicense(licenseId: string, additionalDays: number): Promise<DRMLicense> {
    const license = this.licenses.get(licenseId);
    if (!license) {
      throw new BadRequestException('License not found');
    }

    license.expiresAt = new Date(license.expiresAt.getTime() + additionalDays * 24 * 60 * 60 * 1000);

    this.logger.log(`DRM license extended: ${licenseId} by ${additionalDays} days`);
    return license;
  }

  /**
   * Monitors DRM usage patterns
   * @param documentId - Document identifier
   * @returns Usage statistics
   */
  async monitorDRMUsage(documentId: string): Promise<{
    documentId: string;
    viewCount: number;
    printCount: number;
    copyCount: number;
    lastAccess: Date;
    activeLicenses: number;
  }> {
    let viewCount = 0;
    let printCount = 0;
    let copyCount = 0;
    let lastAccess: Date = new Date(0);

    // Aggregate usage from tracking
    const keys = Array.from(this.usageTracking.keys()).filter(k => k.startsWith(`${documentId}:`));
    keys.forEach(key => {
      const events = this.usageTracking.get(key);
      events.forEach(e => {
        if (e.timestamp > lastAccess) lastAccess = e.timestamp;
        if (key.includes('view')) viewCount += e.count;
        if (key.includes('print')) printCount += e.count;
        if (key.includes('copy')) copyCount += e.count;
      });
    });

    const activeLicenses = Array.from(this.licenses.values()).filter(
      l => l.documentId === documentId && new Date() <= l.expiresAt
    ).length;

    return {
      documentId,
      viewCount,
      printCount,
      copyCount,
      lastAccess,
      activeLicenses
    };
  }

  /**
   * Generates DRM usage report
   * @param documentId - Document identifier
   * @param startDate - Report start date
   * @param endDate - Report end date
   * @returns Usage report
   */
  async generateDRMUsageReport(
    documentId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Record<string, any>> {
    const events: { action: string; timestamp: Date; count: number }[] = [];

    const keys = Array.from(this.usageTracking.keys()).filter(k => k.startsWith(`${documentId}:`));
    keys.forEach(key => {
      const tracking = this.usageTracking.get(key);
      tracking.forEach(event => {
        if (event.timestamp >= startDate && event.timestamp <= endDate) {
          events.push(event);
        }
      });
    });

    return {
      documentId,
      period: { start: startDate, end: endDate },
      totalEvents: events.length,
      eventTypes: [...new Set(events.map(e => e.action))],
      events,
      summary: {
        views: events.filter(e => e.action === 'view').reduce((sum, e) => sum + e.count, 0),
        prints: events.filter(e => e.action === 'print').reduce((sum, e) => sum + e.count, 0),
        copies: events.filter(e => e.action === 'copy').reduce((sum, e) => sum + e.count, 0)
      }
    };
  }

  /**
   * Checks copy usage limit
   */
  private checkCopyLimit(documentId: string, limit: number): boolean {
    const key = `${documentId}:copy`;
    const tracking = this.usageTracking.get(key) || [];
    const count = tracking.reduce((sum, t) => sum + t.count, 0);
    return count >= limit;
  }

  /**
   * Checks print usage limit
   */
  private checkPrintLimit(documentId: string, limit: number): boolean {
    const key = `${documentId}:print`;
    const tracking = this.usageTracking.get(key) || [];
    const count = tracking.reduce((sum, t) => sum + t.count, 0);
    return count >= limit;
  }

  /**
   * Gets default rights for DRM level
   */
  private getDefaultRights(level: DRMLevel): DRMRight[] {
    const baseRights: DRMRight[] = [
      { right: 'VIEW', granted: true },
      { right: 'PRINT', granted: false },
      { right: 'COPY', granted: false },
      { right: 'EDIT', granted: false },
      { right: 'EXTRACT', granted: false },
      { right: 'SHARE', granted: false }
    ];

    switch (level) {
      case DRMLevel.BASIC:
        return baseRights;
      case DRMLevel.STANDARD:
        return baseRights.map(r => r.right === 'PRINT' ? { ...r, granted: true } : r);
      case DRMLevel.ADVANCED:
        return baseRights.map(r => r.right === 'PRINT' || r.right === 'COPY' ? { ...r, granted: true } : r);
      case DRMLevel.ENTERPRISE:
        return baseRights.map(r => ({ ...r, granted: true }));
      default:
        return baseRights;
    }
  }

  /**
   * Gets default restrictions for DRM level
   */
  private getDefaultRestrictions(level: DRMLevel): DRMRestriction[] {
    const restrictions: DRMRestriction[] = [
      { type: 'COPY_COUNT', value: 0, enforced: false },
      { type: 'PRINT_COUNT', value: 0, enforced: false },
      { type: 'EXPIRATION', value: 30, enforced: true },
      { type: 'DEVICE_BINDING', value: null, enforced: false },
      { type: 'GEOLOCATION', value: null, enforced: false }
    ];

    if (level === DRMLevel.BASIC) {
      restrictions[0].value = 5;
      restrictions[0].enforced = true;
    } else if (level === DRMLevel.STANDARD) {
      restrictions[0].value = 10;
      restrictions[0].enforced = true;
      restrictions[1].value = 5;
      restrictions[1].enforced = true;
    }

    return restrictions;
  }
}

export default DRMSystem;
