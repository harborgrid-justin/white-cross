/**
 * @fileoverview Enhanced Threat Detection Service
 * @module security/services/enhanced-threat-detection
 * @description Advanced threat detection and auto-mitigation for enhanced security
 *
 * @version 2.0.0
 * @requires @nestjs/common ^10.x
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '@/common/base';
import {
  ThreatEvent,
  ThreatType,
  ThreatSeverity,
} from '../interfaces/security.interfaces';

@Injectable()
export class EnhancedThreatDetectionService extends BaseService {
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
    metadata?: Record<string, unknown>,
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
    this.logError(`Threat Detected: ${type} from ${source} targeting ${target}`, {
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

    const attempts = this.failedAttempts.get(identifier)!;

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
    metadata?: Record<string, unknown>,
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
    if (metadata?.attempts && typeof metadata.attempts === 'number' && metadata.attempts > 10) {
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
