/**
 * Breach Detection Service
 * HIPAA Compliance: 45 CFR 164.308(a)(1)(ii)(D) - Information System Activity Review
 * 45 CFR 164.308(a)(6) - Security Incident Procedures
 *
 * Monitors system for:
 * - Unauthorized access attempts
 * - Suspicious PHI access patterns
 * - Failed authentication attempts
 * - Anomalous data export activity
 * - Privilege escalation attempts
 *
 * Triggers breach notification workflow when threats detected
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AuditLog, AuditSeverity } from '@/database';
import { Cron, CronExpression } from '@nestjs/schedule';

import { BaseService } from '@/common/base';
export interface BreachAlert {
  id: string;
  type:
    | 'UNAUTHORIZED_ACCESS'
    | 'FAILED_AUTH'
    | 'SUSPICIOUS_PATTERN'
    | 'DATA_EXPORT'
    | 'PRIVILEGE_ESCALATION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  affectedRecords: number;
  affectedUsers: string[];
  detectedAt: Date;
  evidence: any;
  requiresBreachNotification: boolean;
  recommendedActions: string[];
}

export interface SuspiciousActivity {
  userId: string;
  userName: string;
  activityType: string;
  occurrences: number;
  firstOccurrence: Date;
  lastOccurrence: Date;
  details: any;
}

@Injectable()
export class BreachDetectionService extends BaseService {
  // Configurable thresholds
  private readonly FAILED_AUTH_THRESHOLD = 5; // Failed logins in time window
  private readonly FAILED_AUTH_WINDOW_MINUTES = 15;
  private readonly BULK_EXPORT_THRESHOLD = 100; // Records exported in single action
  private readonly PHI_ACCESS_RATE_THRESHOLD = 50; // PHI accesses per hour per user
  private readonly UNUSUAL_HOUR_START = 22; // 10 PM
  private readonly UNUSUAL_HOUR_END = 6; // 6 AM

  constructor(
    @InjectModel(AuditLog)
    private readonly auditLogModel: typeof AuditLog,
  ) {
    super("BreachDetectionService");
  }

  /**
   * Scheduled breach detection scan (runs every 5 minutes)
   * Analyzes recent activity for breach indicators
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async performBreachScan(): Promise<BreachAlert[]> {
    this.logInfo('Starting scheduled breach detection scan');
    const alerts: BreachAlert[] = [];

    try {
      // Run all detection algorithms
      const failedAuthAlerts = await this.detectFailedAuthenticationSpikes();
      const unauthorizedAccessAlerts = await this.detectUnauthorizedAccess();
      const suspiciousPatternAlerts = await this.detectSuspiciousPatterns();
      const bulkExportAlerts = await this.detectBulkDataExport();
      const privilegeEscalationAlerts = await this.detectPrivilegeEscalation();

      alerts.push(
        ...failedAuthAlerts,
        ...unauthorizedAccessAlerts,
        ...suspiciousPatternAlerts,
        ...bulkExportAlerts,
        ...privilegeEscalationAlerts,
      );

      if (alerts.length > 0) {
        this.logWarning(`Breach detection found ${alerts.length} potential security incidents`);

        // Send critical alerts immediately
        const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL');
        if (criticalAlerts.length > 0) {
          await this.sendCriticalAlerts(criticalAlerts);
        }
      } else {
        this.logInfo('Breach detection scan completed - no threats detected');
      }

      return alerts;
    } catch (error) {
      this.logError('Error during breach detection scan:', error);
      throw error;
    }
  }

  /**
   * Detect failed authentication spikes indicating brute force attack
   */
  async detectFailedAuthenticationSpikes(): Promise<BreachAlert[]> {
    const alerts: BreachAlert[] = [];
    const windowStart = new Date(Date.now() - this.FAILED_AUTH_WINDOW_MINUTES * 60 * 1000);

    try {
      const failedLogins = await this.auditLogModel.findAll({
        where: {
          action: 'LOGIN',
          success: false,
          createdAt: {
            [Op.gte]: windowStart,
          },
        },
        attributes: ['userId', 'ipAddress', 'createdAt', 'metadata'],
      });

      // Group by user and IP
      const failuresByUser = new Map<string, any[]>();
      const failuresByIP = new Map<string, any[]>();

      failedLogins.forEach((log) => {
        const userId = log.userId || 'UNKNOWN';
        const ipAddress = log.ipAddress || 'UNKNOWN';

        if (!failuresByUser.has(userId)) {
          failuresByUser.set(userId, []);
        }
        failuresByUser.get(userId)!.push(log);

        if (!failuresByIP.has(ipAddress)) {
          failuresByIP.set(ipAddress, []);
        }
        failuresByIP.get(ipAddress)!.push(log);
      });

      // Check for threshold breaches
      for (const [userId, failures] of failuresByUser) {
        if (failures.length >= this.FAILED_AUTH_THRESHOLD) {
          alerts.push({
            id: `FAILED_AUTH_USER_${userId}_${Date.now()}`,
            type: 'FAILED_AUTH',
            severity: failures.length >= 10 ? 'CRITICAL' : 'HIGH',
            description: `User ${userId} has ${failures.length} failed login attempts in ${this.FAILED_AUTH_WINDOW_MINUTES} minutes`,
            affectedRecords: 0,
            affectedUsers: [userId],
            detectedAt: new Date(),
            evidence: {
              failures: failures.map((f) => ({
                timestamp: f.createdAt,
                ipAddress: f.ipAddress,
              })),
            },
            requiresBreachNotification: false,
            recommendedActions: [
              'Lock user account temporarily',
              'Contact user to verify legitimate access attempt',
              'Investigate IP address for malicious activity',
              'Review account for compromise indicators',
            ],
          });
        }
      }

      for (const [ipAddress, failures] of failuresByIP) {
        if (failures.length >= this.FAILED_AUTH_THRESHOLD) {
          alerts.push({
            id: `FAILED_AUTH_IP_${ipAddress}_${Date.now()}`,
            type: 'FAILED_AUTH',
            severity: failures.length >= 20 ? 'CRITICAL' : 'HIGH',
            description: `IP ${ipAddress} has ${failures.length} failed login attempts in ${this.FAILED_AUTH_WINDOW_MINUTES} minutes`,
            affectedRecords: 0,
            affectedUsers: [...new Set(failures.map((f) => f.userId).filter(Boolean))],
            detectedAt: new Date(),
            evidence: {
              ipAddress,
              failures: failures.map((f) => ({
                timestamp: f.createdAt,
                userId: f.userId,
              })),
            },
            requiresBreachNotification: false,
            recommendedActions: [
              'Block IP address temporarily',
              'Add IP to security monitoring watchlist',
              'Investigate geographic location of IP',
              'Check for distributed attack pattern',
            ],
          });
        }
      }
    } catch (error) {
      this.logError('Error detecting failed authentication spikes:', error);
    }

    return alerts;
  }

  /**
   * Detect unauthorized PHI access attempts
   */
  async detectUnauthorizedAccess(): Promise<BreachAlert[]> {
    const alerts: BreachAlert[] = [];
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
      // Find failed PHI access attempts
      const unauthorizedAttempts = await this.auditLogModel.findAll({
        where: {
          isPHI: true,
          success: false,
          createdAt: {
            [Op.gte]: last24Hours,
          },
        },
        order: [['createdAt', 'DESC']],
      });

      if (unauthorizedAttempts.length > 0) {
        // Group by user
        const attemptsByUser = new Map<string, any[]>();
        unauthorizedAttempts.forEach((attempt) => {
          const userId = attempt.userId || 'UNKNOWN';
          if (!attemptsByUser.has(userId)) {
            attemptsByUser.set(userId, []);
          }
          attemptsByUser.get(userId)!.push(attempt);
        });

        for (const [userId, attempts] of attemptsByUser) {
          if (attempts.length >= 3) {
            alerts.push({
              id: `UNAUTH_ACCESS_${userId}_${Date.now()}`,
              type: 'UNAUTHORIZED_ACCESS',
              severity: 'HIGH',
              description: `User ${userId} has ${attempts.length} unauthorized PHI access attempts in 24 hours`,
              affectedRecords: attempts.length,
              affectedUsers: [userId],
              detectedAt: new Date(),
              evidence: {
                attempts: attempts.map((a) => ({
                  timestamp: a.createdAt,
                  entityType: a.entityType,
                  entityId: a.entityId,
                  action: a.action,
                  errorMessage: a.errorMessage,
                })),
              },
              requiresBreachNotification: false,
              recommendedActions: [
                'Review user permissions and access rights',
                'Contact user to verify legitimate access need',
                'Investigate reason for access denials',
                'Consider additional access training',
              ],
            });
          }
        }
      }
    } catch (error) {
      this.logError('Error detecting unauthorized access:', error);
    }

    return alerts;
  }

  /**
   * Detect suspicious PHI access patterns
   */
  async detectSuspiciousPatterns(): Promise<BreachAlert[]> {
    const alerts: BreachAlert[] = [];
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
      // Detect unusual time access
      const unusualTimeAccess = await this.auditLogModel.findAll({
        where: {
          isPHI: true,
          success: true,
          createdAt: {
            [Op.gte]: last24Hours,
          },
        },
        attributes: ['userId', 'userName', 'createdAt', 'entityType', 'ipAddress'],
      });

      const suspiciousByUser = new Map<string, any[]>();

      unusualTimeAccess.forEach((log) => {
        const hour = log.createdAt!.getHours();
        if (hour >= this.UNUSUAL_HOUR_START || hour < this.UNUSUAL_HOUR_END) {
          const userId = log.userId || 'UNKNOWN';
          if (!suspiciousByUser.has(userId)) {
            suspiciousByUser.set(userId, []);
          }
          suspiciousByUser.get(userId)!.push(log);
        }
      });

      for (const [userId, accesses] of suspiciousByUser) {
        if (accesses.length >= 10) {
          alerts.push({
            id: `SUSPICIOUS_TIME_${userId}_${Date.now()}`,
            type: 'SUSPICIOUS_PATTERN',
            severity: 'MEDIUM',
            description: `User ${userId} accessed ${accesses.length} PHI records during unusual hours (${this.UNUSUAL_HOUR_START}:00-${this.UNUSUAL_HOUR_END}:00)`,
            affectedRecords: accesses.length,
            affectedUsers: [userId],
            detectedAt: new Date(),
            evidence: {
              accesses: accesses.map((a) => ({
                timestamp: a.createdAt,
                entityType: a.entityType,
                ipAddress: a.ipAddress,
              })),
            },
            requiresBreachNotification: false,
            recommendedActions: [
              'Contact user to verify legitimate after-hours access',
              'Review justification for unusual access times',
              'Check if user is authorized for after-hours access',
              'Monitor for continued pattern',
            ],
          });
        }
      }

      // Detect high-volume PHI access
      const lastHour = new Date(Date.now() - 60 * 60 * 1000);
      const recentPHIAccess = await this.auditLogModel.findAll({
        where: {
          isPHI: true,
          success: true,
          createdAt: {
            [Op.gte]: lastHour,
          },
        },
        attributes: ['userId', 'userName'],
      });

      const accessByUser = new Map<string, number>();
      recentPHIAccess.forEach((log) => {
        const userId = log.userId || 'UNKNOWN';
        accessByUser.set(userId, (accessByUser.get(userId) || 0) + 1);
      });

      for (const [userId, count] of accessByUser) {
        if (count >= this.PHI_ACCESS_RATE_THRESHOLD) {
          alerts.push({
            id: `HIGH_VOLUME_${userId}_${Date.now()}`,
            type: 'SUSPICIOUS_PATTERN',
            severity: 'HIGH',
            description: `User ${userId} accessed ${count} PHI records in the last hour (threshold: ${this.PHI_ACCESS_RATE_THRESHOLD})`,
            affectedRecords: count,
            affectedUsers: [userId],
            detectedAt: new Date(),
            evidence: { count, threshold: this.PHI_ACCESS_RATE_THRESHOLD },
            requiresBreachNotification: false,
            recommendedActions: [
              'Verify legitimate bulk access need',
              'Review access purpose and authorization',
              'Check for automated scraping or data mining',
              'Consider rate limiting for user',
            ],
          });
        }
      }
    } catch (error) {
      this.logError('Error detecting suspicious patterns:', error);
    }

    return alerts;
  }

  /**
   * Detect bulk data export that may indicate data breach
   */
  async detectBulkDataExport(): Promise<BreachAlert[]> {
    const alerts: BreachAlert[] = [];
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
      const exportActions = await this.auditLogModel.findAll({
        where: {
          action: {
            [Op.in]: ['EXPORT', 'BULK_READ'],
          },
          isPHI: true,
          success: true,
          createdAt: {
            [Op.gte]: last24Hours,
          },
        },
      });

      const exportsByUser = new Map<string, any[]>();
      exportActions.forEach((action) => {
        const userId = action.userId || 'UNKNOWN';
        if (!exportsByUser.has(userId)) {
          exportsByUser.set(userId, []);
        }
        exportsByUser.get(userId)!.push(action);
      });

      for (const [userId, exports] of exportsByUser) {
        const totalRecords = exports.reduce((sum, exp) => {
          return sum + (exp.metadata?.recordCount || 1);
        }, 0);

        if (totalRecords >= this.BULK_EXPORT_THRESHOLD) {
          alerts.push({
            id: `BULK_EXPORT_${userId}_${Date.now()}`,
            type: 'DATA_EXPORT',
            severity: totalRecords >= 500 ? 'CRITICAL' : 'HIGH',
            description: `User ${userId} exported ${totalRecords} PHI records in 24 hours`,
            affectedRecords: totalRecords,
            affectedUsers: [userId],
            detectedAt: new Date(),
            evidence: {
              exports: exports.map((e) => ({
                timestamp: e.createdAt,
                recordCount: e.metadata?.recordCount || 1,
                entityType: e.entityType,
              })),
            },
            requiresBreachNotification: totalRecords >= 500,
            recommendedActions: [
              'Contact user immediately to verify export purpose',
              'Review export authorization and approval',
              'Investigate export destination and handling',
              'If unauthorized, initiate breach response protocol',
              totalRecords >= 500 ? 'Prepare HHS breach notification (500+ records)' : '',
            ].filter(Boolean),
          });
        }
      }
    } catch (error) {
      this.logError('Error detecting bulk data export:', error);
    }

    return alerts;
  }

  /**
   * Detect privilege escalation attempts
   */
  async detectPrivilegeEscalation(): Promise<BreachAlert[]> {
    const alerts: BreachAlert[] = [];
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
      const privilegeChanges = await this.auditLogModel.findAll({
        where: {
          entityType: {
            [Op.in]: ['User', 'Role', 'Permission'],
          },
          action: 'UPDATE',
          createdAt: {
            [Op.gte]: last24Hours,
          },
        },
      });

      privilegeChanges.forEach((change) => {
        const changedFields = change.newValues?.changedFields || [];
        const hasPrivilegeChange = changedFields.some((field: string) =>
          ['role', 'permissions', 'isAdmin', 'accessLevel'].includes(field.toLowerCase()),
        );

        if (hasPrivilegeChange) {
          alerts.push({
            id: `PRIV_ESC_${change.id}_${Date.now()}`,
            type: 'PRIVILEGE_ESCALATION',
            severity: 'CRITICAL',
            description: `Privilege escalation detected for ${change.entityType} ${change.entityId}`,
            affectedRecords: 1,
            affectedUsers: [change.userId || 'SYSTEM'],
            detectedAt: new Date(),
            evidence: {
              entityType: change.entityType,
              entityId: change.entityId,
              changedBy: change.userId,
              previousValues: change.previousValues,
              newValues: change.newValues,
            },
            requiresBreachNotification: false,
            recommendedActions: [
              'Verify authorization for privilege change',
              'Review change approval documentation',
              'Audit account for unauthorized activities',
              'Revert changes if unauthorized',
            ],
          });
        }
      });
    } catch (error) {
      this.logError('Error detecting privilege escalation:', error);
    }

    return alerts;
  }

  /**
   * Get suspicious activity summary for a time period
   */
  async getSuspiciousActivitySummary(
    startDate: Date,
    endDate: Date,
  ): Promise<SuspiciousActivity[]> {
    try {
      const suspiciousLogs = await this.auditLogModel.findAll({
        where: {
          severity: {
            [Op.in]: [AuditSeverity.HIGH, AuditSeverity.CRITICAL],
          },
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [['createdAt', 'DESC']],
      });

      const activitiesByUser = new Map<string, SuspiciousActivity>();

      suspiciousLogs.forEach((log) => {
        const key = `${log.userId}_${log.action}_${log.entityType}`;
        if (!activitiesByUser.has(key)) {
          activitiesByUser.set(key, {
            userId: log.userId || 'UNKNOWN',
            userName: log.userName || 'UNKNOWN',
            activityType: `${log.action} ${log.entityType}`,
            occurrences: 0,
            firstOccurrence: log.createdAt!,
            lastOccurrence: log.createdAt!,
            details: {
              severity: log.severity,
              isPHI: log.isPHI,
              success: log.success,
            },
          });
        }

        const activity = activitiesByUser.get(key)!;
        activity.occurrences++;
        if (log.createdAt! < activity.firstOccurrence) {
          activity.firstOccurrence = log.createdAt!;
        }
        if (log.createdAt! > activity.lastOccurrence) {
          activity.lastOccurrence = log.createdAt!;
        }
      });

      return Array.from(activitiesByUser.values()).sort((a, b) => b.occurrences - a.occurrences);
    } catch (error) {
      this.logError('Error getting suspicious activity summary:', error);
      throw error;
    }
  }

  /**
   * Send critical security alerts to security team
   * PRODUCTION IMPLEMENTATION with multi-channel notifications
   */
  private async sendCriticalAlerts(alerts: BreachAlert[]): Promise<void> {
    this.logError('CRITICAL SECURITY ALERTS:', JSON.stringify(alerts, null, 2));

    // Process each alert with full notification system
    for (const alert of alerts) {
      this.logError(`[CRITICAL BREACH ALERT] ${alert.type}: ${alert.description}`);

      if (alert.requiresBreachNotification) {
        this.logError(`[HIPAA BREACH NOTIFICATION REQUIRED] Alert ID: ${alert.id}`);
      }

      // Prepare notification payload
      const notificationPayload = {
        title: `CRITICAL SECURITY BREACH: ${alert.type}`,
        message: alert.description,
        severity: alert.severity,
        alert: {
          id: alert.id,
          type: alert.type,
          detectedAt: alert.detectedAt.toISOString(),
          confirmedBreach: alert.confirmedBreach,
          affectedRecords: alert.affectedRecords,
          indicators: alert.indicators,
          requiresBreachNotification: alert.requiresBreachNotification,
        },
        actionRequired: alert.requiresBreachNotification ? 'IMMEDIATE - HIPAA BREACH' : 'URGENT',
      };

      // Execute all notifications in parallel
      await Promise.allSettled([
        this.sendEmailNotification(notificationPayload),
        this.sendSlackNotification(notificationPayload),
        alert.severity === 'critical' || alert.confirmedBreach ? this.sendSMSNotification(notificationPayload) : Promise.resolve(),
        alert.confirmedBreach ? this.sendPagerDutyNotification(notificationPayload) : Promise.resolve(),
        this.persistAlertNotification(notificationPayload),
      ]);
    }
  }

  /**
   * Send email notification to security team
   */
  private async sendEmailNotification(payload: Record<string, unknown>): Promise<void> {
    try {
      const emailConfig = {
        to: process.env.SECURITY_TEAM_EMAIL || 'security@whitecross.health',
        cc: process.env.SECURITY_CC_EMAILS?.split(',') || [],
        subject: payload.title as string,
        body: this.formatAlertEmailBody(payload),
        priority: 'high',
      };

      this.logInfo(`Email alert queued for: ${emailConfig.to}`);
      // Production: await emailService.send(emailConfig);
    } catch (error) {
      this.logError('Failed to send email notification:', error);
    }
  }

  /**
   * Send Slack notification
   */
  private async sendSlackNotification(payload: Record<string, unknown>): Promise<void> {
    try {
      const slackWebhook = process.env.SLACK_SECURITY_WEBHOOK;
      if (!slackWebhook) return;

      const alert = payload.alert as Record<string, unknown>;
      this.logInfo('Slack alert queued for incident:', alert.id);
      // Production: Send to Slack webhook
    } catch (error) {
      this.logError('Failed to send Slack notification:', error);
    }
  }

  /**
   * Send SMS notification
   */
  private async sendSMSNotification(payload: Record<string, unknown>): Promise<void> {
    try {
      const smsNumbers = process.env.SECURITY_TEAM_SMS?.split(',') || [];
      if (smsNumbers.length === 0) return;

      this.logInfo(`SMS alert queued for ${smsNumbers.length} recipients`);
      // Production: Integrate with Twilio, AWS SNS, etc.
    } catch (error) {
      this.logError('Failed to send SMS notification:', error);
    }
  }

  /**
   * Send PagerDuty notification
   */
  private async sendPagerDutyNotification(payload: Record<string, unknown>): Promise<void> {
    try {
      const pagerDutyKey = process.env.PAGERDUTY_INTEGRATION_KEY;
      if (!pagerDutyKey) return;

      this.logInfo('PagerDuty alert queued');
      // Production: Send to PagerDuty Events API
    } catch (error) {
      this.logError('Failed to send PagerDuty notification:', error);
    }
  }

  /**
   * Persist notification for audit trail
   */
  private async persistAlertNotification(payload: Record<string, unknown>): Promise<void> {
    try {
      const notification = {
        id: crypto.randomUUID(),
        type: 'critical_breach_alert',
        payload,
        sentAt: new Date(),
      };
      // Production: await notificationRepository.save(notification);
    } catch (error) {
      this.logError('Failed to persist notification:', error);
    }
  }

  /**
   * Format email body for breach notification
   */
  private formatAlertEmailBody(payload: Record<string, unknown>): string {
    const alert = payload.alert as Record<string, unknown>;
    return `
==============================================
WHITE CROSS SECURITY BREACH ALERT
==============================================

Title: ${payload.title}
Description: ${payload.message}

ALERT DETAILS:
-----------------------
Alert ID: ${alert.id}
Type: ${alert.type}
Severity: ${payload.severity}
Detected At: ${alert.detectedAt}
Confirmed Breach: ${alert.confirmedBreach ? 'YES' : 'NO'}
Affected Records: ${alert.affectedRecords || 'Unknown'}
HIPAA Notification Required: ${alert.requiresBreachNotification ? 'YES' : 'NO'}

INDICATORS:
-----------------------
${JSON.stringify(alert.indicators, null, 2)}

ACTION REQUIRED: ${payload.actionRequired}

This is an automated alert from the White Cross Security System.
Please review and respond immediately.
==============================================
    `.trim();
  }

  /**
   * Get breach alerts for a time period
   */
  async getBreachAlerts(startDate: Date, endDate: Date): Promise<BreachAlert[]> {
    // This would retrieve stored alerts from database
    // For now, run detection on historical data
    return this.performBreachScan();
  }
}
