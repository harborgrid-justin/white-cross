/**
 * Alert Configuration and Management
 *
 * Monitors metrics and triggers alerts based on thresholds
 */

import type { AlertConfig, PerformanceMetric, LogEntry } from './types';
import { error as logError } from './logger';

// Alert configurations
const alertConfigs: Map<string, AlertConfig> = new Map();

// Alert history
const alertHistory: Array<{
  config: AlertConfig;
  triggered: Date;
  value: number;
  message: string;
}> = [];

// Metric buffer for windowed calculations
const metricBuffer: Map<string, Array<{ value: number; timestamp: Date }>> = new Map();

/**
 * Register an alert configuration
 */
export function registerAlert(config: AlertConfig): void {
  alertConfigs.set(config.id, config);
}

/**
 * Remove an alert configuration
 */
export function unregisterAlert(id: string): void {
  alertConfigs.delete(id);
}

/**
 * Get all alert configurations
 */
export function getAlertConfigs(): AlertConfig[] {
  return Array.from(alertConfigs.values());
}

/**
 * Get alert configuration by ID
 */
export function getAlertConfig(id: string): AlertConfig | undefined {
  return alertConfigs.get(id);
}

/**
 * Update alert configuration
 */
export function updateAlertConfig(id: string, updates: Partial<AlertConfig>): void {
  const config = alertConfigs.get(id);
  if (config) {
    alertConfigs.set(id, { ...config, ...updates });
  }
}

/**
 * Check metric against alert thresholds
 */
export function checkMetric(metric: PerformanceMetric): void {
  // Store metric in buffer
  if (!metricBuffer.has(metric.name)) {
    metricBuffer.set(metric.name, []);
  }

  const buffer = metricBuffer.get(metric.name)!;
  buffer.push({ value: metric.value, timestamp: metric.timestamp });

  // Keep only metrics within the time window
  const now = new Date();
  buffer.filter((m) => {
    const age = now.getTime() - m.timestamp.getTime();
    return age < 3600000; // Keep last hour
  });

  // Check against alert configs
  alertConfigs.forEach((config) => {
    if (!config.enabled || config.type !== 'performance') return;

    // Calculate metric over window
    const windowStart = new Date(now.getTime() - config.window * 1000);
    const windowMetrics = buffer.filter((m) => m.timestamp >= windowStart);

    if (windowMetrics.length === 0) return;

    // Calculate average
    const average = windowMetrics.reduce((sum, m) => sum + m.value, 0) / windowMetrics.length;

    // Check threshold
    if (average >= config.threshold) {
      triggerAlert(config, average, `Performance metric ${metric.name} exceeded threshold`);
    }
  });
}

/**
 * Check error rate
 */
export function checkErrorRate(errors: LogEntry[]): void {
  const now = new Date();

  alertConfigs.forEach((config) => {
    if (!config.enabled || config.type !== 'error_rate') return;

    const windowStart = new Date(now.getTime() - config.window * 1000);
    const windowErrors = errors.filter((e) => e.timestamp >= windowStart);

    const errorRate = windowErrors.length;

    if (errorRate >= config.threshold) {
      triggerAlert(config, errorRate, `Error rate exceeded threshold: ${errorRate} errors`);
    }
  });
}

/**
 * Trigger an alert
 */
function triggerAlert(config: AlertConfig, value: number, message: string): void {
  // Check if this alert was recently triggered (prevent spam)
  const recentAlert = alertHistory.find(
    (h) =>
      h.config.id === config.id &&
      Date.now() - h.triggered.getTime() < 300000 // 5 minutes
  );

  if (recentAlert) return;

  // Record in history
  alertHistory.push({
    config,
    triggered: new Date(),
    value,
    message,
  });

  // Log alert
  logError('Alert triggered', undefined, {
    alert_id: config.id,
    alert_name: config.name,
    value,
    threshold: config.threshold,
  });

  // Send notifications
  sendNotifications(config, message, value);
}

/**
 * Send alert notifications
 */
async function sendNotifications(
  config: AlertConfig,
  message: string,
  value: number
): Promise<void> {
  const payload = {
    alert: config.name,
    message,
    value,
    threshold: config.threshold,
    severity: getSeverity(value, config.threshold),
    timestamp: new Date().toISOString(),
  };

  // Send to each configured channel
  for (const channel of config.channels) {
    try {
      switch (channel) {
        case 'slack':
          await sendSlackNotification(payload);
          break;
        case 'email':
          await sendEmailNotification(config, payload);
          break;
        case 'pagerduty':
          await sendPagerDutyNotification(payload);
          break;
      }
    } catch (error) {
      console.error(`Failed to send ${channel} notification:`, error);
    }
  }
}

/**
 * Send Slack notification
 */
async function sendSlackNotification(payload: any): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const color = payload.severity === 'critical' ? 'danger' : 'warning';

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `Alert: ${payload.alert}`,
      attachments: [
        {
          color,
          title: payload.alert,
          text: payload.message,
          fields: [
            { title: 'Value', value: payload.value.toString(), short: true },
            { title: 'Threshold', value: payload.threshold.toString(), short: true },
            { title: 'Severity', value: payload.severity, short: true },
          ],
          timestamp: payload.timestamp,
        },
      ],
    }),
  });
}

/**
 * Send email notification
 */
async function sendEmailNotification(config: AlertConfig, payload: any): Promise<void> {
  // This would integrate with your email service
  await fetch('/api/monitoring/alerts/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: process.env.ALERT_EMAIL,
      subject: `Alert: ${payload.alert}`,
      body: `
        Alert: ${payload.alert}

        ${payload.message}

        Value: ${payload.value}
        Threshold: ${payload.threshold}
        Severity: ${payload.severity}

        Timestamp: ${payload.timestamp}
      `,
    }),
  });
}

/**
 * Send PagerDuty notification
 */
async function sendPagerDutyNotification(payload: any): Promise<void> {
  const integrationKey = process.env.PAGERDUTY_INTEGRATION_KEY;
  if (!integrationKey) return;

  await fetch('https://events.pagerduty.com/v2/enqueue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      routing_key: integrationKey,
      event_action: 'trigger',
      payload: {
        summary: `${payload.alert}: ${payload.message}`,
        severity: payload.severity,
        source: 'white-cross-monitoring',
        timestamp: payload.timestamp,
        custom_details: {
          value: payload.value,
          threshold: payload.threshold,
        },
      },
    }),
  });
}

/**
 * Get severity level based on value and threshold
 */
function getSeverity(value: number, threshold: number): 'info' | 'warning' | 'error' | 'critical' {
  const ratio = value / threshold;

  if (ratio >= 2) return 'critical';
  if (ratio >= 1.5) return 'error';
  if (ratio >= 1) return 'warning';
  return 'info';
}

/**
 * Get alert history
 */
export function getAlertHistory(limit = 100): typeof alertHistory {
  return alertHistory.slice(-limit);
}

/**
 * Clear alert history
 */
export function clearAlertHistory(): void {
  alertHistory.length = 0;
}

/**
 * Initialize default alerts
 */
export function initializeDefaultAlerts(): void {
  // Error rate alert
  registerAlert({
    id: 'error-rate-high',
    name: 'High Error Rate',
    type: 'error_rate',
    threshold: 10,
    window: 300, // 5 minutes
    channels: ['slack', 'email'],
    enabled: true,
  });

  // Performance alert - LCP
  registerAlert({
    id: 'performance-lcp',
    name: 'Poor LCP Performance',
    type: 'performance',
    threshold: 4000, // 4 seconds
    window: 300,
    channels: ['slack'],
    enabled: true,
  });

  // API latency alert
  registerAlert({
    id: 'api-latency-high',
    name: 'High API Latency',
    type: 'performance',
    threshold: 2000, // 2 seconds
    window: 300,
    channels: ['slack', 'email'],
    enabled: true,
  });

  // Healthcare-specific alerts
  registerAlert({
    id: 'medication-errors',
    name: 'Medication Administration Errors',
    type: 'custom',
    threshold: 3,
    window: 3600, // 1 hour
    channels: ['slack', 'email', 'pagerduty'],
    enabled: true,
  });

  registerAlert({
    id: 'compliance-violations',
    name: 'Compliance Violations',
    type: 'security',
    threshold: 1,
    window: 3600,
    channels: ['slack', 'email', 'pagerduty'],
    enabled: true,
  });
}

export default {
  registerAlert,
  unregisterAlert,
  getAlertConfigs,
  getAlertConfig,
  updateAlertConfig,
  checkMetric,
  checkErrorRate,
  getAlertHistory,
  clearAlertHistory,
  initializeDefaultAlerts,
};
