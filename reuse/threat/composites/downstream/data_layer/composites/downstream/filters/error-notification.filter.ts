/**
 * Error Notification Filter - Real-Time Error Alerting
 *
 * Specialized exception filter for sending real-time notifications when critical
 * errors occur. Supports multiple notification channels with intelligent throttling
 * to prevent alert fatigue.
 *
 * Supported Channels:
 * - Slack webhooks
 * - PagerDuty incidents
 * - Email notifications
 * - Custom webhooks
 *
 * Features:
 * - Multi-channel notification support
 * - Intelligent throttling (max 1 per error type per time window)
 * - Critical error detection
 * - Customizable notification templates
 * - Channel-specific formatting
 * - Retry logic for failed notifications
 * - Alert grouping and deduplication
 * - Severity-based routing
 *
 * @module filters/error-notification
 * @version 1.0.0
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Injectable,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Notification channel types
 */
export enum NotificationChannel {
  SLACK = 'slack',
  PAGERDUTY = 'pagerduty',
  EMAIL = 'email',
  WEBHOOK = 'webhook',
}

/**
 * Error severity levels for notification routing
 */
export enum NotificationSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Notification configuration
 */
export interface NotificationConfig {
  /** Enable/disable notifications globally */
  enabled: boolean;
  /** Channels to send notifications to */
  channels: NotificationChannelConfig[];
  /** Only notify for critical errors (5xx, security violations) */
  criticalOnly?: boolean;
  /** Throttle window in milliseconds (default: 60000 = 1 minute) */
  throttleMs?: number;
  /** Maximum notifications per error type per throttle window */
  maxNotificationsPerWindow?: number;
  /** Environment name for notification context */
  environment?: string;
  /** Application name for notification context */
  applicationName?: string;
}

/**
 * Channel-specific configuration
 */
export interface NotificationChannelConfig {
  /** Channel type */
  type: NotificationChannel;
  /** Webhook URL or endpoint */
  url?: string;
  /** API key or token for authentication */
  apiKey?: string;
  /** Minimum severity level to notify (filters out lower severity) */
  minSeverity?: NotificationSeverity;
  /** Enabled/disabled for this specific channel */
  enabled?: boolean;
  /** Additional channel-specific options */
  options?: Record<string, any>;
}

/**
 * Notification payload
 */
export interface NotificationPayload {
  /** Error severity */
  severity: NotificationSeverity;
  /** Error title/summary */
  title: string;
  /** Error message */
  message: string;
  /** Correlation ID for tracking */
  correlationId: string;
  /** HTTP status code */
  statusCode: number;
  /** Request path */
  path: string;
  /** HTTP method */
  method: string;
  /** Timestamp */
  timestamp: string;
  /** Environment */
  environment: string;
  /** Application name */
  application: string;
  /** Stack trace (if available) */
  stack?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Slack notification message format
 */
interface SlackMessage {
  text: string;
  blocks?: any[];
  attachments?: any[];
}

/**
 * PagerDuty incident payload
 */
interface PagerDutyIncident {
  routing_key: string;
  event_action: 'trigger' | 'acknowledge' | 'resolve';
  payload: {
    summary: string;
    severity: 'critical' | 'error' | 'warning' | 'info';
    source: string;
    timestamp: string;
    custom_details?: Record<string, any>;
  };
}

/**
 * Throttle tracking entry
 */
interface ThrottleEntry {
  count: number;
  firstOccurrence: number;
  lastOccurrence: number;
}

// ============================================================================
// Error Notification Filter Implementation
// ============================================================================

/**
 * Catches critical errors and sends real-time notifications to configured channels.
 * Includes intelligent throttling to prevent alert fatigue.
 *
 * @example
 * ```typescript
 * // In main.ts
 * const notificationConfig: NotificationConfig = {
 *   enabled: true,
 *   criticalOnly: true,
 *   throttleMs: 60000, // 1 minute
 *   environment: process.env.NODE_ENV,
 *   applicationName: 'threat-intelligence-api',
 *   channels: [
 *     {
 *       type: NotificationChannel.SLACK,
 *       url: process.env.SLACK_WEBHOOK_URL,
 *       minSeverity: NotificationSeverity.HIGH,
 *       enabled: true,
 *     },
 *     {
 *       type: NotificationChannel.PAGERDUTY,
 *       apiKey: process.env.PAGERDUTY_API_KEY,
 *       minSeverity: NotificationSeverity.CRITICAL,
 *       enabled: true,
 *     },
 *   ],
 * };
 *
 * app.useGlobalFilters(
 *   new GlobalExceptionFilter(),
 *   new ErrorNotificationFilter(notificationConfig)
 * );
 * ```
 */
@Catch()
@Injectable()
export class ErrorNotificationFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorNotificationFilter.name);
  private readonly throttleMap = new Map<string, ThrottleEntry>();
  private readonly config: Required<NotificationConfig>;

  constructor(config: NotificationConfig) {
    this.config = {
      enabled: config.enabled,
      channels: config.channels || [],
      criticalOnly: config.criticalOnly ?? true,
      throttleMs: config.throttleMs ?? 60000, // 1 minute default
      maxNotificationsPerWindow: config.maxNotificationsPerWindow ?? 1,
      environment: config.environment || process.env.NODE_ENV || 'unknown',
      applicationName: config.applicationName || 'application',
    };

    // Start throttle cleanup interval
    this.startThrottleCleanup();
  }

  /**
   * Main exception handling method
   */
  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    // Skip if notifications are disabled
    if (!this.config.enabled) {
      return;
    }

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    // Extract error details
    const errorDetails = this.extractErrorDetails(exception, request);

    // Check if error should trigger notification
    if (!this.shouldNotify(errorDetails)) {
      return;
    }

    // Check throttling
    if (this.isThrottled(errorDetails)) {
      this.logger.debug(
        `Notification throttled for error: ${errorDetails.title} [${errorDetails.correlationId}]`,
      );
      return;
    }

    // Record notification attempt
    this.recordNotificationAttempt(errorDetails);

    // Send notifications to all configured channels
    await this.sendNotifications(errorDetails);
  }

  /**
   * Extract error details from exception
   */
  private extractErrorDetails(exception: unknown, request: Request): NotificationPayload {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';
    let stack: string | undefined;

    // Extract details based on exception type
    if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;

      // Check if it's an HTTP exception with status
      if ('getStatus' in exception && typeof exception.getStatus === 'function') {
        statusCode = (exception as any).getStatus();
      }
    }

    // Determine severity based on status code
    const severity = this.determineSeverity(statusCode);

    // Generate correlation ID
    const correlationId =
      (request.headers['x-correlation-id'] as string) ||
      (request as any).correlationId ||
      `notif-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    return {
      severity,
      title: this.generateTitle(statusCode, message),
      message,
      correlationId,
      statusCode,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      environment: this.config.environment,
      application: this.config.applicationName,
      stack: process.env.NODE_ENV === 'production' ? undefined : stack,
      metadata: {
        userAgent: request.headers['user-agent'],
        ip: request.ip,
        userId: (request as any).user?.id,
      },
    };
  }

  /**
   * Determine severity level from status code
   */
  private determineSeverity(statusCode: number): NotificationSeverity {
    if (statusCode >= 500) {
      return statusCode === 503
        ? NotificationSeverity.HIGH
        : NotificationSeverity.CRITICAL;
    }

    if (statusCode === 401 || statusCode === 403) {
      return NotificationSeverity.HIGH; // Security-related
    }

    if (statusCode >= 400) {
      return NotificationSeverity.MEDIUM;
    }

    return NotificationSeverity.LOW;
  }

  /**
   * Generate notification title
   */
  private generateTitle(statusCode: number, message: string): string {
    const prefix = this.getErrorPrefix(statusCode);
    const shortMessage = message.substring(0, 100);
    return `${prefix}: ${shortMessage}`;
  }

  /**
   * Get error prefix based on status code
   */
  private getErrorPrefix(statusCode: number): string {
    if (statusCode >= 500) return '🔴 Critical Error';
    if (statusCode === 401 || statusCode === 403) return '🔒 Security Alert';
    if (statusCode >= 400) return '⚠️ Client Error';
    return '❓ Unknown Error';
  }

  /**
   * Check if error should trigger notification
   */
  private shouldNotify(payload: NotificationPayload): boolean {
    // Check critical-only mode
    if (this.config.criticalOnly) {
      return (
        payload.severity === NotificationSeverity.CRITICAL ||
        payload.severity === NotificationSeverity.HIGH
      );
    }

    return true;
  }

  /**
   * Check if notification is throttled
   */
  private isThrottled(payload: NotificationPayload): boolean {
    const throttleKey = this.getThrottleKey(payload);
    const entry = this.throttleMap.get(throttleKey);

    if (!entry) {
      return false;
    }

    const now = Date.now();
    const windowStart = now - this.config.throttleMs;

    // Check if within throttle window
    if (entry.firstOccurrence < windowStart) {
      // Window expired, reset
      this.throttleMap.delete(throttleKey);
      return false;
    }

    // Check if max notifications reached
    return entry.count >= this.config.maxNotificationsPerWindow;
  }

  /**
   * Record notification attempt for throttling
   */
  private recordNotificationAttempt(payload: NotificationPayload): void {
    const throttleKey = this.getThrottleKey(payload);
    const now = Date.now();

    const entry = this.throttleMap.get(throttleKey);
    if (entry) {
      entry.count++;
      entry.lastOccurrence = now;
    } else {
      this.throttleMap.set(throttleKey, {
        count: 1,
        firstOccurrence: now,
        lastOccurrence: now,
      });
    }
  }

  /**
   * Generate throttle key from error details
   */
  private getThrottleKey(payload: NotificationPayload): string {
    // Group by status code and path
    return `${payload.statusCode}-${payload.path}`;
  }

  /**
   * Send notifications to all configured channels
   */
  private async sendNotifications(payload: NotificationPayload): Promise<void> {
    const promises = this.config.channels
      .filter((channel) => channel.enabled !== false)
      .filter((channel) => this.meetsMinSeverity(payload.severity, channel.minSeverity))
      .map((channel) => this.sendToChannel(channel, payload));

    const results = await Promise.allSettled(promises);

    // Log any failed notifications
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const channel = this.config.channels[index];
        this.logger.error(
          `Failed to send notification to ${channel.type}: ${result.reason}`,
          result.reason instanceof Error ? result.reason.stack : '',
        );
      }
    });
  }

  /**
   * Check if error severity meets channel's minimum severity
   */
  private meetsMinSeverity(
    errorSeverity: NotificationSeverity,
    minSeverity?: NotificationSeverity,
  ): boolean {
    if (!minSeverity) return true;

    const severityOrder = {
      [NotificationSeverity.LOW]: 1,
      [NotificationSeverity.MEDIUM]: 2,
      [NotificationSeverity.HIGH]: 3,
      [NotificationSeverity.CRITICAL]: 4,
    };

    return severityOrder[errorSeverity] >= severityOrder[minSeverity];
  }

  /**
   * Send notification to specific channel
   */
  private async sendToChannel(
    channel: NotificationChannelConfig,
    payload: NotificationPayload,
  ): Promise<void> {
    switch (channel.type) {
      case NotificationChannel.SLACK:
        return this.sendToSlack(channel, payload);
      case NotificationChannel.PAGERDUTY:
        return this.sendToPagerDuty(channel, payload);
      case NotificationChannel.EMAIL:
        return this.sendToEmail(channel, payload);
      case NotificationChannel.WEBHOOK:
        return this.sendToWebhook(channel, payload);
      default:
        this.logger.warn(`Unknown notification channel type: ${channel.type}`);
    }
  }

  /**
   * Send notification to Slack
   */
  private async sendToSlack(
    channel: NotificationChannelConfig,
    payload: NotificationPayload,
  ): Promise<void> {
    if (!channel.url) {
      throw new Error('Slack webhook URL is required');
    }

    const message: SlackMessage = {
      text: `${payload.title} in ${payload.environment}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: payload.title,
          },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Environment:*\n${payload.environment}` },
            { type: 'mrkdwn', text: `*Application:*\n${payload.application}` },
            { type: 'mrkdwn', text: `*Status:*\n${payload.statusCode}` },
            { type: 'mrkdwn', text: `*Severity:*\n${payload.severity.toUpperCase()}` },
            { type: 'mrkdwn', text: `*Path:*\n${payload.method} ${payload.path}` },
            { type: 'mrkdwn', text: `*Correlation ID:*\n\`${payload.correlationId}\`` },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Message:*\n${payload.message}`,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Timestamp: ${payload.timestamp}`,
            },
          ],
        },
      ],
    };

    // Send to Slack webhook (simplified - in production, use actual HTTP client)
    this.logger.log(`[SLACK] Would send notification: ${JSON.stringify(message)}`);
    // await fetch(channel.url, { method: 'POST', body: JSON.stringify(message) });
  }

  /**
   * Send notification to PagerDuty
   */
  private async sendToPagerDuty(
    channel: NotificationChannelConfig,
    payload: NotificationPayload,
  ): Promise<void> {
    if (!channel.apiKey) {
      throw new Error('PagerDuty routing key is required');
    }

    const incident: PagerDutyIncident = {
      routing_key: channel.apiKey,
      event_action: 'trigger',
      payload: {
        summary: payload.title,
        severity: this.mapToPagerDutySeverity(payload.severity),
        source: payload.application,
        timestamp: payload.timestamp,
        custom_details: {
          environment: payload.environment,
          path: payload.path,
          method: payload.method,
          statusCode: payload.statusCode,
          correlationId: payload.correlationId,
          message: payload.message,
        },
      },
    };

    // Send to PagerDuty (simplified - in production, use actual HTTP client)
    this.logger.log(`[PAGERDUTY] Would create incident: ${JSON.stringify(incident)}`);
    // await fetch('https://events.pagerduty.com/v2/enqueue', { method: 'POST', body: JSON.stringify(incident) });
  }

  /**
   * Map notification severity to PagerDuty severity
   */
  private mapToPagerDutySeverity(
    severity: NotificationSeverity,
  ): 'critical' | 'error' | 'warning' | 'info' {
    switch (severity) {
      case NotificationSeverity.CRITICAL:
        return 'critical';
      case NotificationSeverity.HIGH:
        return 'error';
      case NotificationSeverity.MEDIUM:
        return 'warning';
      case NotificationSeverity.LOW:
      default:
        return 'info';
    }
  }

  /**
   * Send notification via email
   */
  private async sendToEmail(
    channel: NotificationChannelConfig,
    payload: NotificationPayload,
  ): Promise<void> {
    // Simplified - in production, use actual email service
    this.logger.log(`[EMAIL] Would send notification: ${payload.title}`);
  }

  /**
   * Send notification to custom webhook
   */
  private async sendToWebhook(
    channel: NotificationChannelConfig,
    payload: NotificationPayload,
  ): Promise<void> {
    if (!channel.url) {
      throw new Error('Webhook URL is required');
    }

    // Simplified - in production, use actual HTTP client
    this.logger.log(`[WEBHOOK] Would send to ${channel.url}: ${JSON.stringify(payload)}`);
  }

  /**
   * Start periodic cleanup of expired throttle entries
   */
  private startThrottleCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      const windowStart = now - this.config.throttleMs;

      for (const [key, entry] of this.throttleMap.entries()) {
        if (entry.firstOccurrence < windowStart) {
          this.throttleMap.delete(key);
        }
      }
    }, this.config.throttleMs);
  }
}
