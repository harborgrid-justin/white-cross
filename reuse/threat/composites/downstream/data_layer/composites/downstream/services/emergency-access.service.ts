/**
 * Break-Glass Emergency Access Service
 *
 * HIPAA Requirement: Emergency Access Procedure (§164.312(a)(2)(ii))
 *
 * Features:
 * - Time-limited emergency access
 * - Justification required for all emergency access
 * - Comprehensive audit logging
 * - Real-time notifications to security team
 * - Automatic revocation after time limit
 * - Emergency access approval workflow (optional)
 *
 * @module emergency-access.service
 * @hipaa-requirement §164.312(a)(2)(ii) - Emergency Access Procedure
 */

import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import * as crypto from 'crypto';

export interface EmergencyAccessRequest {
  userId: string;
  userEmail: string;
  userRole: string;
  patientId?: string;
  resourceId?: string;
  resourceType: string;
  justification: string;
  urgency: 'emergency' | 'urgent' | 'routine';
  clinicalReason: string;
  ipAddress: string;
  userAgent: string;
}

export interface EmergencyAccessGrant {
  accessId: string;
  userId: string;
  patientId?: string;
  resourceId?: string;
  resourceType: string;
  justification: string;
  grantedAt: Date;
  expiresAt: Date;
  revokedAt?: Date;
  active: boolean;
  accessLog: EmergencyAccessLogEntry[];
}

export interface EmergencyAccessLogEntry {
  timestamp: Date;
  action: string;
  resource: string;
  details: any;
}

export interface EmergencyAccessStats {
  totalRequests: number;
  activeAccess: number;
  expiredAccess: number;
  revokedAccess: number;
  topUsers: Array<{ userId: string; count: number }>;
  topReasons: Array<{ reason: string; count: number }>;
}

@Injectable()
export class EmergencyAccessService {
  private readonly logger = new Logger(EmergencyAccessService.name);

  private readonly DEFAULT_ACCESS_DURATION = 2 * 60 * 60; // 2 hours in seconds
  private readonly MAX_CONCURRENT_ACCESS = 3;

  constructor(
    @InjectRedis() private readonly redis: Redis,
  ) {}

  /**
   * Request emergency break-glass access
   * HIPAA: Grant temporary elevated access for patient care emergencies
   */
  async requestEmergencyAccess(
    request: EmergencyAccessRequest,
  ): Promise<EmergencyAccessGrant> {
    // Validate request
    this.validateRequest(request);

    // Check if user already has active emergency access
    const activeAccess = await this.getActiveEmergencyAccess(request.userId);

    if (activeAccess.length >= this.MAX_CONCURRENT_ACCESS) {
      throw new BadRequestException(
        `Maximum concurrent emergency access limit reached (${this.MAX_CONCURRENT_ACCESS})`,
      );
    }

    // Generate access ID
    const accessId = crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.DEFAULT_ACCESS_DURATION * 1000);

    // Create emergency access grant
    const grant: EmergencyAccessGrant = {
      accessId,
      userId: request.userId,
      patientId: request.patientId,
      resourceId: request.resourceId,
      resourceType: request.resourceType,
      justification: request.justification,
      grantedAt: now,
      expiresAt,
      active: true,
      accessLog: [],
    };

    // Store in Redis
    await this.redis.setex(
      `emergency:access:${accessId}`,
      this.DEFAULT_ACCESS_DURATION,
      JSON.stringify(grant),
    );

    // Track active emergency access for user
    await this.redis.sadd(`emergency:user:${request.userId}`, accessId);
    await this.redis.expire(`emergency:user:${request.userId}`, this.DEFAULT_ACCESS_DURATION);

    // Log emergency access request
    await this.logEmergencyAccess({
      accessId,
      userId: request.userId,
      action: 'EMERGENCY_ACCESS_GRANTED',
      details: {
        resourceType: request.resourceType,
        resourceId: request.resourceId,
        patientId: request.patientId,
        justification: request.justification,
        urgency: request.urgency,
        clinicalReason: request.clinicalReason,
        expiresAt: expiresAt.toISOString(),
      },
      ipAddress: request.ipAddress,
      userAgent: request.userAgent,
    });

    // Send immediate alert to security team
    await this.sendSecurityAlert({
      type: 'BREAK_GLASS_ACCESS',
      severity: 'HIGH',
      userId: request.userId,
      userEmail: request.userEmail,
      accessId,
      justification: request.justification,
      expiresAt,
    });

    // Send notification to compliance officer
    await this.sendComplianceNotification({
      userId: request.userId,
      userEmail: request.userEmail,
      resourceType: request.resourceType,
      justification: request.justification,
    });

    this.logger.warn(
      `Emergency access granted: ${accessId} for user ${request.userId} (${request.userEmail})`,
    );

    return grant;
  }

  /**
   * Validate emergency access
   * HIPAA: Check if user has valid emergency access
   */
  async validateEmergencyAccess(
    accessId: string,
    userId: string,
  ): Promise<{ valid: boolean; grant?: EmergencyAccessGrant; reason?: string }> {
    const accessData = await this.redis.get(`emergency:access:${accessId}`);

    if (!accessData) {
      return {
        valid: false,
        reason: 'Emergency access not found or expired',
      };
    }

    const grant: EmergencyAccessGrant = JSON.parse(accessData);

    // Verify user ID matches
    if (grant.userId !== userId) {
      this.logger.error(`Emergency access mismatch: ${accessId} user ${userId}`);
      return {
        valid: false,
        reason: 'Access ID does not belong to this user',
      };
    }

    // Check if active
    if (!grant.active) {
      return {
        valid: false,
        reason: 'Emergency access has been revoked',
      };
    }

    // Check expiration
    if (new Date() > new Date(grant.expiresAt)) {
      await this.revokeEmergencyAccess(accessId, 'Expired');
      return {
        valid: false,
        reason: 'Emergency access has expired',
      };
    }

    return {
      valid: true,
      grant,
    };
  }

  /**
   * Log activity during emergency access
   * HIPAA: Track all actions taken with emergency access
   */
  async logEmergencyActivity(
    accessId: string,
    activity: {
      action: string;
      resource: string;
      details: any;
    },
  ): Promise<void> {
    const accessData = await this.redis.get(`emergency:access:${accessId}`);

    if (!accessData) {
      return;
    }

    const grant: EmergencyAccessGrant = JSON.parse(accessData);

    // Add activity to log
    grant.accessLog.push({
      timestamp: new Date(),
      action: activity.action,
      resource: activity.resource,
      details: activity.details,
    });

    // Update grant
    const ttl = await this.redis.ttl(`emergency:access:${accessId}`);
    await this.redis.setex(
      `emergency:access:${accessId}`,
      ttl > 0 ? ttl : 3600,
      JSON.stringify(grant),
    );

    this.logger.debug(`Emergency activity logged: ${accessId} - ${activity.action}`);
  }

  /**
   * Revoke emergency access
   * HIPAA: Terminate emergency access immediately
   */
  async revokeEmergencyAccess(accessId: string, reason: string): Promise<void> {
    const accessData = await this.redis.get(`emergency:access:${accessId}`);

    if (!accessData) {
      this.logger.warn(`Attempted to revoke non-existent emergency access: ${accessId}`);
      return;
    }

    const grant: EmergencyAccessGrant = JSON.parse(accessData);

    // Mark as revoked
    grant.active = false;
    grant.revokedAt = new Date();

    // Store revoked grant for audit (keep for 90 days)
    await this.redis.setex(
      `emergency:access:${accessId}`,
      90 * 24 * 60 * 60,
      JSON.stringify(grant),
    );

    // Remove from active list
    await this.redis.srem(`emergency:user:${grant.userId}`, accessId);

    // Log revocation
    await this.logEmergencyAccess({
      accessId,
      userId: grant.userId,
      action: 'EMERGENCY_ACCESS_REVOKED',
      details: {
        reason,
        duration: Date.now() - new Date(grant.grantedAt).getTime(),
        actionsPerformed: grant.accessLog.length,
      },
      ipAddress: '0.0.0.0',
      userAgent: 'system',
    });

    this.logger.warn(`Emergency access revoked: ${accessId} - Reason: ${reason}`);
  }

  /**
   * Revoke all emergency access for a user
   * HIPAA: Security measure
   */
  async revokeAllUserEmergencyAccess(userId: string, reason: string): Promise<number> {
    const accessIds = await this.redis.smembers(`emergency:user:${userId}`);

    let revoked = 0;
    for (const accessId of accessIds) {
      await this.revokeEmergencyAccess(accessId, reason);
      revoked++;
    }

    await this.redis.del(`emergency:user:${userId}`);

    this.logger.warn(`All emergency access revoked for user ${userId}: ${revoked} grants`);

    return revoked;
  }

  /**
   * Get active emergency access for a user
   */
  async getActiveEmergencyAccess(userId: string): Promise<EmergencyAccessGrant[]> {
    const accessIds = await this.redis.smembers(`emergency:user:${userId}`);

    const grants: EmergencyAccessGrant[] = [];

    for (const accessId of accessIds) {
      const validation = await this.validateEmergencyAccess(accessId, userId);

      if (validation.valid && validation.grant) {
        grants.push(validation.grant);
      }
    }

    return grants;
  }

  /**
   * Get emergency access history for a user
   * HIPAA: Provide audit trail
   */
  async getEmergencyAccessHistory(
    userId: string,
    limit: number = 50,
  ): Promise<any[]> {
    const auditKey = `audit:emergency:${userId}`;
    const logs = await this.redis.lrange(auditKey, 0, limit - 1);

    return logs.map(log => JSON.parse(log));
  }

  /**
   * Get emergency access statistics
   * HIPAA: Monitor emergency access usage
   */
  async getEmergencyAccessStats(
    startDate: Date,
    endDate: Date,
  ): Promise<EmergencyAccessStats> {
    // This is a simplified implementation
    // In production, use a time-series database

    const stats: EmergencyAccessStats = {
      totalRequests: 0,
      activeAccess: 0,
      expiredAccess: 0,
      revokedAccess: 0,
      topUsers: [],
      topReasons: [],
    };

    // Count active emergency access
    const userKeys = await this.redis.keys('emergency:user:*');
    stats.activeAccess = userKeys.length;

    return stats;
  }

  /**
   * Validate emergency access request
   */
  private validateRequest(request: EmergencyAccessRequest): void {
    if (!request.justification || request.justification.length < 20) {
      throw new BadRequestException('Justification must be at least 20 characters');
    }

    if (!request.clinicalReason || request.clinicalReason.length < 10) {
      throw new BadRequestException('Clinical reason must be at least 10 characters');
    }

    if (!['emergency', 'urgent', 'routine'].includes(request.urgency)) {
      throw new BadRequestException('Invalid urgency level');
    }

    // Validate resource type
    const validResourceTypes = [
      'patient_record',
      'medical_history',
      'lab_results',
      'medications',
      'images',
      'notes',
    ];

    if (!validResourceTypes.includes(request.resourceType)) {
      throw new BadRequestException('Invalid resource type');
    }
  }

  /**
   * Log emergency access event
   */
  private async logEmergencyAccess(event: {
    accessId: string;
    userId: string;
    action: string;
    details: any;
    ipAddress: string;
    userAgent: string;
  }): Promise<void> {
    const auditKey = `audit:emergency:${event.userId}`;
    const auditEntry = {
      timestamp: new Date().toISOString(),
      ...event,
    };

    await this.redis.lpush(auditKey, JSON.stringify(auditEntry));
    await this.redis.ltrim(auditKey, 0, 999); // Keep last 1000 events
    await this.redis.expire(auditKey, 90 * 24 * 60 * 60); // 90 days retention
  }

  /**
   * Send security alert
   */
  private async sendSecurityAlert(alert: any): Promise<void> {
    // In production: Send to SIEM, PagerDuty, Slack, etc.
    await this.redis.publish('security-alerts', JSON.stringify({
      ...alert,
      timestamp: new Date().toISOString(),
    }));

    this.logger.warn(`Security alert sent: ${alert.type}`);
  }

  /**
   * Send compliance notification
   */
  private async sendComplianceNotification(notification: any): Promise<void> {
    // In production: Email compliance officer
    await this.redis.publish('compliance-notifications', JSON.stringify({
      ...notification,
      timestamp: new Date().toISOString(),
    }));
  }
}

export default EmergencyAccessService;
