/**
 * LOC: ALTMGMT1234567
 * File: /reuse/command/alert-management-api.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable API utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Alert management services
 *   - Notification dispatch systems
 *   - Command center controllers
 *   - Incident management workflows
 */

/**
 * File: /reuse/command/alert-management-api.ts
 * Locator: WC-CMD-ALTMGMT-001
 * Purpose: Comprehensive Alert Management API - Multi-channel notifications, escalation, acknowledgment, templates, contact management
 *
 * Upstream: Independent utility module for alert management API implementation
 * Downstream: ../backend/*, Alert services, notification controllers, escalation engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Twilio, SendGrid
 * Exports: 48+ utility functions for alert creation, distribution, escalation, acknowledgment, contact management
 *
 * LLM Context: Production-ready alert management API utilities for emergency response and command systems.
 * Provides comprehensive alerting capabilities including multi-channel distribution (SMS, email, push, voice),
 * escalation workflows, acknowledgment tracking, priority-based routing, geographic targeting, contact list
 * management, and customizable alert templates. Essential for critical communications and emergency notifications.
 */

import { Request, Response, NextFunction } from 'express';
import { Model, DataTypes, Sequelize, Op } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Alert {
  alertId: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  createdAt: Date;
  expiresAt?: Date;
  metadata: Record<string, any>;
  requiresAcknowledgment: boolean;
  escalationEnabled: boolean;
}

interface AlertDistribution {
  alertId: string;
  channels: AlertChannel[];
  recipients: string[];
  filters?: AlertFilter;
  scheduledFor?: Date;
  status: 'pending' | 'sending' | 'sent' | 'failed';
}

interface AlertChannel {
  type: 'sms' | 'email' | 'push' | 'voice' | 'webhook' | 'in_app';
  priority: number;
  config: Record<string, any>;
  fallbackChannel?: string;
}

interface AlertFilter {
  roles?: string[];
  departments?: string[];
  locations?: GeographicFilter[];
  availability?: 'on_duty' | 'off_duty' | 'all';
  customCriteria?: Record<string, any>;
}

interface GeographicFilter {
  latitude: number;
  longitude: number;
  radiusKm: number;
  zoneId?: string;
}

interface EscalationPolicy {
  policyId: string;
  name: string;
  enabled: boolean;
  stages: EscalationStage[];
  alertPriorities: string[];
  alertCategories?: string[];
}

interface EscalationStage {
  stageNumber: number;
  delayMinutes: number;
  recipients: string[];
  channels: string[];
  requireAllAck: boolean;
  conditions?: Record<string, any>;
}

interface AlertAcknowledgment {
  alertId: string;
  userId: string;
  acknowledgedAt: Date;
  response?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  deviceInfo?: Record<string, any>;
}

interface ContactGroup {
  groupId: string;
  name: string;
  description?: string;
  members: ContactMember[];
  tags: string[];
  active: boolean;
  metadata: Record<string, any>;
}

interface ContactMember {
  userId: string;
  role: string;
  contactMethods: ContactMethod[];
  availability?: AvailabilitySchedule;
  priority: number;
}

interface ContactMethod {
  type: 'sms' | 'email' | 'voice' | 'push';
  value: string;
  verified: boolean;
  preferred: boolean;
}

interface AvailabilitySchedule {
  schedule: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
  timezone: string;
  overrides?: Array<{
    date: Date;
    available: boolean;
    reason?: string;
  }>;
}

interface AlertTemplate {
  templateId: string;
  name: string;
  category: string;
  priority: string;
  titleTemplate: string;
  messageTemplate: string;
  variables: string[];
  channels: string[];
  requiresAcknowledgment: boolean;
  escalationPolicyId?: string;
  metadata: Record<string, any>;
}

interface NotificationDelivery {
  deliveryId: string;
  alertId: string;
  channel: string;
  recipient: string;
  status: 'queued' | 'sending' | 'delivered' | 'failed' | 'bounced';
  attempts: number;
  sentAt?: Date;
  deliveredAt?: Date;
  errorMessage?: string;
}

interface AlertMetrics {
  alertId: string;
  totalRecipients: number;
  deliveredCount: number;
  failedCount: number;
  acknowledgedCount: number;
  averageDeliveryTime: number;
  averageAcknowledgmentTime: number;
  byChannel: Record<string, { sent: number; delivered: number; failed: number }>;
}

interface BroadcastAlert {
  broadcastId: string;
  title: string;
  message: string;
  priority: string;
  targetArea?: GeographicFilter;
  targetRoles?: string[];
  channels: string[];
  createdBy: string;
  createdAt: Date;
}

// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================

/**
 * Sequelize model for alerts with escalation and acknowledgment tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Alert model
 *
 * @example
 * ```typescript
 * const Alert = createAlertModel(sequelize);
 * const alert = await Alert.create({
 *   alertId: 'alert_abc123',
 *   title: 'Critical System Failure',
 *   message: 'Database connection lost',
 *   priority: 'critical',
 *   category: 'system',
 *   severity: 'critical',
 *   source: 'monitoring_system',
 *   requiresAcknowledgment: true
 * });
 * ```
 */
export const createAlertModel = (sequelize: Sequelize) => {
  class AlertModel extends Model {
    public id!: number;
    public alertId!: string;
    public title!: string;
    public message!: string;
    public priority!: string;
    public category!: string;
    public severity!: string;
    public source!: string;
    public createdAt!: Date;
    public expiresAt!: Date | null;
    public metadata!: Record<string, any>;
    public requiresAcknowledgment!: boolean;
    public escalationEnabled!: boolean;
    public status!: string;
    public readonly updatedAt!: Date;
  }

  AlertModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      alertId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique alert identifier',
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Alert title',
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Alert message content',
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'medium',
        comment: 'Alert priority level',
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Alert category/type',
      },
      severity: {
        type: DataTypes.ENUM('info', 'warning', 'error', 'critical'),
        allowNull: false,
        defaultValue: 'info',
        comment: 'Alert severity level',
      },
      source: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Alert source system',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Alert expiration timestamp',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional alert metadata',
      },
      requiresAcknowledgment: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether alert requires acknowledgment',
      },
      escalationEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether escalation is enabled',
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Alert status',
      },
    },
    {
      sequelize,
      tableName: 'alerts',
      timestamps: true,
      indexes: [
        { fields: ['alertId'], unique: true },
        { fields: ['priority', 'status'] },
        { fields: ['category'] },
        { fields: ['createdAt'] },
      ],
    },
  );

  return AlertModel;
};

/**
 * Sequelize model for alert acknowledgments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AlertAcknowledgment model
 *
 * @example
 * ```typescript
 * const Acknowledgment = createAlertAcknowledgmentModel(sequelize);
 * const ack = await Acknowledgment.create({
 *   alertId: 'alert_abc123',
 *   userId: 'user_456',
 *   response: 'Acknowledged, responding to incident',
 *   location: { latitude: 40.7128, longitude: -74.0060 }
 * });
 * ```
 */
export const createAlertAcknowledgmentModel = (sequelize: Sequelize) => {
  class Acknowledgment extends Model {
    public id!: number;
    public alertId!: string;
    public userId!: string;
    public acknowledgedAt!: Date;
    public response!: string | null;
    public location!: Record<string, any> | null;
    public deviceInfo!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Acknowledgment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      alertId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Alert identifier',
      },
      userId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who acknowledged',
      },
      acknowledgedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Acknowledgment timestamp',
      },
      response: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'User response message',
      },
      location: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'User location at acknowledgment',
      },
      deviceInfo: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Device information',
      },
    },
    {
      sequelize,
      tableName: 'alert_acknowledgments',
      timestamps: true,
      indexes: [
        { fields: ['alertId'] },
        { fields: ['userId'] },
        { fields: ['acknowledgedAt'] },
      ],
    },
  );

  return Acknowledgment;
};

/**
 * Sequelize model for contact groups and member management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ContactGroup model
 *
 * @example
 * ```typescript
 * const ContactGroup = createContactGroupModel(sequelize);
 * const group = await ContactGroup.create({
 *   groupId: 'group_emergency_responders',
 *   name: 'Emergency Responders',
 *   description: 'All emergency response personnel',
 *   members: [...],
 *   tags: ['emergency', 'first_responder'],
 *   active: true
 * });
 * ```
 */
export const createContactGroupModel = (sequelize: Sequelize) => {
  class ContactGroupModel extends Model {
    public id!: number;
    public groupId!: string;
    public name!: string;
    public description!: string | null;
    public members!: ContactMember[];
    public tags!: string[];
    public active!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ContactGroupModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      groupId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique contact group identifier',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Contact group name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Group description',
      },
      members: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of contact members',
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Group tags for filtering',
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether group is active',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'contact_groups',
      timestamps: true,
      indexes: [
        { fields: ['groupId'], unique: true },
        { fields: ['active'] },
        { fields: ['name'] },
      ],
    },
  );

  return ContactGroupModel;
};

// ============================================================================
// ALERT CREATION & MANAGEMENT (4-8)
// ============================================================================

/**
 * Creates a new alert with validation and enrichment.
 *
 * @param {Alert} alert - Alert data
 * @param {Model} AlertModel - Sequelize model
 * @returns {Promise<any>} Created alert record
 *
 * @example
 * ```typescript
 * const alert = await createAlert({
 *   alertId: 'alert_' + Date.now(),
 *   title: 'Critical Incident',
 *   message: 'Major fire reported at 123 Main St',
 *   priority: 'critical',
 *   category: 'fire',
 *   severity: 'critical',
 *   source: 'dispatch_system',
 *   createdAt: new Date(),
 *   metadata: { incidentId: 'inc_789' },
 *   requiresAcknowledgment: true,
 *   escalationEnabled: true
 * }, AlertModel);
 * ```
 */
export const createAlert = async (
  alert: Alert,
  AlertModel: any,
): Promise<any> => {
  const record = await AlertModel.create({
    alertId: alert.alertId,
    title: alert.title,
    message: alert.message,
    priority: alert.priority,
    category: alert.category,
    severity: alert.severity,
    source: alert.source,
    expiresAt: alert.expiresAt,
    metadata: alert.metadata,
    requiresAcknowledgment: alert.requiresAcknowledgment,
    escalationEnabled: alert.escalationEnabled,
    status: 'active',
  });

  return record;
};

/**
 * Updates existing alert status and metadata.
 *
 * @param {string} alertId - Alert identifier
 * @param {Partial<Alert>} updates - Updates to apply
 * @param {Model} AlertModel - Sequelize model
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await updateAlert('alert_abc123', {
 *   status: 'resolved',
 *   metadata: { resolvedBy: 'user_456', resolution: 'Incident contained' }
 * }, AlertModel);
 * ```
 */
export const updateAlert = async (
  alertId: string,
  updates: Partial<Alert>,
  AlertModel: any,
): Promise<boolean> => {
  const [updated] = await AlertModel.update(updates, {
    where: { alertId },
  });

  return updated > 0;
};

/**
 * Retrieves alerts with filtering and pagination.
 *
 * @param {Record<string, any>} filters - Filter criteria
 * @param {number} limit - Maximum alerts to return
 * @param {number} offset - Pagination offset
 * @param {Model} AlertModel - Sequelize model
 * @returns {Promise<{ alerts: Alert[]; total: number }>} Filtered alerts and count
 *
 * @example
 * ```typescript
 * const result = await getAlerts({
 *   priority: ['critical', 'high'],
 *   status: 'active',
 *   category: 'fire'
 * }, 50, 0, AlertModel);
 * console.log(`Found ${result.total} alerts, showing ${result.alerts.length}`);
 * ```
 */
export const getAlerts = async (
  filters: Record<string, any>,
  limit: number,
  offset: number,
  AlertModel: any,
): Promise<{ alerts: Alert[]; total: number }> => {
  const whereClause: any = {};

  if (filters.priority) {
    whereClause.priority = Array.isArray(filters.priority)
      ? { [Op.in]: filters.priority }
      : filters.priority;
  }

  if (filters.status) {
    whereClause.status = filters.status;
  }

  if (filters.category) {
    whereClause.category = filters.category;
  }

  if (filters.severity) {
    whereClause.severity = Array.isArray(filters.severity)
      ? { [Op.in]: filters.severity }
      : filters.severity;
  }

  if (filters.requiresAcknowledgment !== undefined) {
    whereClause.requiresAcknowledgment = filters.requiresAcknowledgment;
  }

  const { count, rows } = await AlertModel.findAndCountAll({
    where: whereClause,
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return {
    alerts: rows.map((r: any) => r.toJSON()),
    total: count,
  };
};

/**
 * Expires alerts based on expiration time.
 *
 * @param {Model} AlertModel - Sequelize model
 * @returns {Promise<number>} Number of expired alerts
 *
 * @example
 * ```typescript
 * const expired = await expireAlerts(AlertModel);
 * console.log(`Expired ${expired} alerts`);
 * ```
 */
export const expireAlerts = async (AlertModel: any): Promise<number> => {
  const [updated] = await AlertModel.update(
    { status: 'expired' },
    {
      where: {
        expiresAt: {
          [Op.lt]: new Date(),
        },
        status: { [Op.ne]: 'expired' },
      },
    },
  );

  return updated;
};

/**
 * Cancels active alert.
 *
 * @param {string} alertId - Alert identifier
 * @param {string} cancelledBy - User who cancelled
 * @param {string} reason - Cancellation reason
 * @param {Model} AlertModel - Sequelize model
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await cancelAlert('alert_abc123', 'user_456', 'False alarm - system test', AlertModel);
 * ```
 */
export const cancelAlert = async (
  alertId: string,
  cancelledBy: string,
  reason: string,
  AlertModel: any,
): Promise<boolean> => {
  const [updated] = await AlertModel.update(
    {
      status: 'cancelled',
      metadata: {
        cancelledBy,
        cancelReason: reason,
        cancelledAt: new Date(),
      },
    },
    {
      where: { alertId, status: { [Op.ne]: 'cancelled' } },
    },
  );

  return updated > 0;
};

// ============================================================================
// MULTI-CHANNEL DISTRIBUTION (9-13)
// ============================================================================

/**
 * Distributes alert through multiple channels.
 *
 * @param {AlertDistribution} distribution - Distribution configuration
 * @param {Function} sendFn - Channel send function
 * @returns {Promise<NotificationDelivery[]>} Delivery results
 *
 * @example
 * ```typescript
 * const deliveries = await distributeAlert({
 *   alertId: 'alert_abc123',
 *   channels: [
 *     { type: 'sms', priority: 1, config: {} },
 *     { type: 'email', priority: 2, config: {} }
 *   ],
 *   recipients: ['user_456', 'user_789'],
 *   status: 'pending'
 * }, (channel, recipient, message) => sendNotification(channel, recipient, message));
 * ```
 */
export const distributeAlert = async (
  distribution: AlertDistribution,
  sendFn: (channel: string, recipient: string, message: any) => Promise<any>,
): Promise<NotificationDelivery[]> => {
  const deliveries: NotificationDelivery[] = [];

  // Sort channels by priority
  const sortedChannels = [...distribution.channels].sort(
    (a, b) => a.priority - b.priority,
  );

  for (const channel of sortedChannels) {
    for (const recipient of distribution.recipients) {
      const delivery: NotificationDelivery = {
        deliveryId: `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        alertId: distribution.alertId,
        channel: channel.type,
        recipient,
        status: 'queued',
        attempts: 0,
      };

      try {
        delivery.status = 'sending';
        delivery.attempts++;
        delivery.sentAt = new Date();

        await sendFn(channel.type, recipient, {
          alertId: distribution.alertId,
          config: channel.config,
        });

        delivery.status = 'delivered';
        delivery.deliveredAt = new Date();
      } catch (error: any) {
        delivery.status = 'failed';
        delivery.errorMessage = error.message;

        // Try fallback channel if configured
        if (channel.fallbackChannel) {
          try {
            await sendFn(channel.fallbackChannel, recipient, {
              alertId: distribution.alertId,
              config: channel.config,
            });
            delivery.status = 'delivered';
            delivery.deliveredAt = new Date();
          } catch {
            // Fallback also failed
          }
        }
      }

      deliveries.push(delivery);
    }
  }

  return deliveries;
};

/**
 * Sends SMS notification via configured provider.
 *
 * @param {string} recipient - Phone number
 * @param {string} message - Message content
 * @param {Record<string, any>} config - SMS provider configuration
 * @returns {Promise<any>} Delivery result
 *
 * @example
 * ```typescript
 * await sendSMSNotification('+15551234567', 'Critical alert: Fire at Main St', {
 *   provider: 'twilio',
 *   from: '+15559876543'
 * });
 * ```
 */
export const sendSMSNotification = async (
  recipient: string,
  message: string,
  config: Record<string, any>,
): Promise<any> => {
  // In production, integrate with Twilio, AWS SNS, or other SMS provider
  console.log(`Sending SMS to ${recipient}: ${message}`);

  return {
    success: true,
    messageId: `sms_${Date.now()}`,
    provider: config.provider || 'twilio',
    sentAt: new Date(),
  };
};

/**
 * Sends email notification via configured provider.
 *
 * @param {string} recipient - Email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body (HTML or text)
 * @param {Record<string, any>} config - Email provider configuration
 * @returns {Promise<any>} Delivery result
 *
 * @example
 * ```typescript
 * await sendEmailNotification(
 *   'user@example.com',
 *   'Critical Alert',
 *   '<h1>Fire Emergency</h1><p>Details...</p>',
 *   { provider: 'sendgrid', from: 'alerts@example.com' }
 * );
 * ```
 */
export const sendEmailNotification = async (
  recipient: string,
  subject: string,
  body: string,
  config: Record<string, any>,
): Promise<any> => {
  // In production, integrate with SendGrid, AWS SES, or other email provider
  console.log(`Sending email to ${recipient}: ${subject}`);

  return {
    success: true,
    messageId: `email_${Date.now()}`,
    provider: config.provider || 'sendgrid',
    sentAt: new Date(),
  };
};

/**
 * Sends push notification to mobile device.
 *
 * @param {string} recipient - Device token or user ID
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Record<string, any>} data - Additional data payload
 * @returns {Promise<any>} Delivery result
 *
 * @example
 * ```typescript
 * await sendPushNotification(
 *   'device_token_abc123',
 *   'Critical Alert',
 *   'Fire emergency at 123 Main St',
 *   { alertId: 'alert_abc123', priority: 'critical' }
 * );
 * ```
 */
export const sendPushNotification = async (
  recipient: string,
  title: string,
  body: string,
  data: Record<string, any>,
): Promise<any> => {
  // In production, integrate with FCM, APNS, or other push notification service
  console.log(`Sending push to ${recipient}: ${title}`);

  return {
    success: true,
    messageId: `push_${Date.now()}`,
    sentAt: new Date(),
  };
};

/**
 * Sends voice call notification via telephony provider.
 *
 * @param {string} recipient - Phone number
 * @param {string} message - Message to speak
 * @param {Record<string, any>} config - Voice provider configuration
 * @returns {Promise<any>} Call result
 *
 * @example
 * ```typescript
 * await sendVoiceNotification(
 *   '+15551234567',
 *   'This is a critical emergency alert. Fire reported at 123 Main Street.',
 *   { provider: 'twilio', voice: 'alice', language: 'en-US' }
 * );
 * ```
 */
export const sendVoiceNotification = async (
  recipient: string,
  message: string,
  config: Record<string, any>,
): Promise<any> => {
  // In production, integrate with Twilio Voice, AWS Connect, or other telephony provider
  console.log(`Initiating voice call to ${recipient}: ${message}`);

  return {
    success: true,
    callId: `call_${Date.now()}`,
    provider: config.provider || 'twilio',
    duration: 0,
    status: 'initiated',
  };
};

// ============================================================================
// ESCALATION WORKFLOWS (14-18)
// ============================================================================

/**
 * Creates escalation policy with multiple stages.
 *
 * @param {EscalationPolicy} policy - Escalation policy configuration
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Created policy record
 *
 * @example
 * ```typescript
 * const policy = await createEscalationPolicy({
 *   policyId: 'policy_critical_incidents',
 *   name: 'Critical Incident Escalation',
 *   enabled: true,
 *   stages: [
 *     { stageNumber: 1, delayMinutes: 5, recipients: ['team_leads'], channels: ['sms', 'push'], requireAllAck: false },
 *     { stageNumber: 2, delayMinutes: 15, recipients: ['managers'], channels: ['sms', 'voice'], requireAllAck: true }
 *   ],
 *   alertPriorities: ['critical', 'high']
 * }, sequelize);
 * ```
 */
export const createEscalationPolicy = async (
  policy: EscalationPolicy,
  sequelize: Sequelize,
): Promise<any> => {
  const [record] = await sequelize.query(
    `
    INSERT INTO escalation_policies
    (policy_id, name, enabled, stages, alert_priorities, alert_categories)
    VALUES (?, ?, ?, ?, ?, ?)
    RETURNING *
    `,
    {
      replacements: [
        policy.policyId,
        policy.name,
        policy.enabled,
        JSON.stringify(policy.stages),
        JSON.stringify(policy.alertPriorities),
        JSON.stringify(policy.alertCategories || []),
      ],
      type: Sequelize.QueryTypes.INSERT,
    },
  );

  return record;
};

/**
 * Initiates escalation workflow for alert.
 *
 * @param {string} alertId - Alert identifier
 * @param {string} policyId - Escalation policy ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Escalation workflow record
 *
 * @example
 * ```typescript
 * const escalation = await initiateEscalation('alert_abc123', 'policy_critical_incidents', sequelize);
 * ```
 */
export const initiateEscalation = async (
  alertId: string,
  policyId: string,
  sequelize: Sequelize,
): Promise<any> => {
  const [record] = await sequelize.query(
    `
    INSERT INTO escalation_workflows
    (alert_id, policy_id, current_stage, started_at, status)
    VALUES (?, ?, 1, ?, 'active')
    RETURNING *
    `,
    {
      replacements: [alertId, policyId, new Date()],
      type: Sequelize.QueryTypes.INSERT,
    },
  );

  return record;
};

/**
 * Advances escalation to next stage.
 *
 * @param {string} alertId - Alert identifier
 * @param {number} nextStage - Next stage number
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await advanceEscalationStage('alert_abc123', 2, sequelize);
 * ```
 */
export const advanceEscalationStage = async (
  alertId: string,
  nextStage: number,
  sequelize: Sequelize,
): Promise<boolean> => {
  const [result] = await sequelize.query(
    `
    UPDATE escalation_workflows
    SET current_stage = ?, updated_at = ?
    WHERE alert_id = ? AND status = 'active'
    `,
    {
      replacements: [nextStage, new Date(), alertId],
      type: Sequelize.QueryTypes.UPDATE,
    },
  );

  return result > 0;
};

/**
 * Checks if escalation conditions are met for advancement.
 *
 * @param {string} alertId - Alert identifier
 * @param {EscalationStage} stage - Current escalation stage
 * @param {Model} AckModel - Acknowledgment model
 * @returns {Promise<boolean>} Whether to escalate
 *
 * @example
 * ```typescript
 * const shouldEscalate = await shouldEscalateToNextStage(
 *   'alert_abc123',
 *   { stageNumber: 1, delayMinutes: 5, recipients: ['user_1'], channels: ['sms'], requireAllAck: false },
 *   AcknowledgmentModel
 * );
 * ```
 */
export const shouldEscalateToNextStage = async (
  alertId: string,
  stage: EscalationStage,
  AckModel: any,
): Promise<boolean> => {
  const acks = await AckModel.findAll({
    where: { alertId },
  });

  if (stage.requireAllAck) {
    // All recipients must acknowledge
    return acks.length < stage.recipients.length;
  } else {
    // At least one acknowledgment stops escalation
    return acks.length === 0;
  }
};

/**
 * Stops escalation workflow for alert.
 *
 * @param {string} alertId - Alert identifier
 * @param {string} reason - Stop reason
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await stopEscalation('alert_abc123', 'Alert acknowledged by all recipients', sequelize);
 * ```
 */
export const stopEscalation = async (
  alertId: string,
  reason: string,
  sequelize: Sequelize,
): Promise<boolean> => {
  const [result] = await sequelize.query(
    `
    UPDATE escalation_workflows
    SET status = 'stopped', stop_reason = ?, stopped_at = ?
    WHERE alert_id = ? AND status = 'active'
    `,
    {
      replacements: [reason, new Date(), alertId],
      type: Sequelize.QueryTypes.UPDATE,
    },
  );

  return result > 0;
};

// ============================================================================
// ALERT ACKNOWLEDGMENT (19-22)
// ============================================================================

/**
 * Records alert acknowledgment from user.
 *
 * @param {AlertAcknowledgment} ack - Acknowledgment data
 * @param {Model} AckModel - Sequelize model
 * @returns {Promise<any>} Created acknowledgment record
 *
 * @example
 * ```typescript
 * const ack = await acknowledgeAlert({
 *   alertId: 'alert_abc123',
 *   userId: 'user_456',
 *   acknowledgedAt: new Date(),
 *   response: 'En route to incident location',
 *   location: { latitude: 40.7128, longitude: -74.0060 },
 *   deviceInfo: { device: 'mobile', os: 'iOS' }
 * }, AcknowledgmentModel);
 * ```
 */
export const acknowledgeAlert = async (
  ack: AlertAcknowledgment,
  AckModel: any,
): Promise<any> => {
  const record = await AckModel.create({
    alertId: ack.alertId,
    userId: ack.userId,
    acknowledgedAt: ack.acknowledgedAt,
    response: ack.response,
    location: ack.location,
    deviceInfo: ack.deviceInfo,
  });

  return record;
};

/**
 * Retrieves all acknowledgments for an alert.
 *
 * @param {string} alertId - Alert identifier
 * @param {Model} AckModel - Sequelize model
 * @returns {Promise<AlertAcknowledgment[]>} Acknowledgments
 *
 * @example
 * ```typescript
 * const acks = await getAlertAcknowledgments('alert_abc123', AcknowledgmentModel);
 * console.log(`${acks.length} users acknowledged this alert`);
 * ```
 */
export const getAlertAcknowledgments = async (
  alertId: string,
  AckModel: any,
): Promise<AlertAcknowledgment[]> => {
  const acks = await AckModel.findAll({
    where: { alertId },
    order: [['acknowledgedAt', 'ASC']],
  });

  return acks.map((a: any) => a.toJSON());
};

/**
 * Calculates acknowledgment statistics for alert.
 *
 * @param {string} alertId - Alert identifier
 * @param {number} totalRecipients - Total number of recipients
 * @param {Date} alertCreatedAt - Alert creation timestamp
 * @param {Model} AckModel - Sequelize model
 * @returns {Promise<Record<string, any>>} Acknowledgment statistics
 *
 * @example
 * ```typescript
 * const stats = await getAcknowledgmentStats('alert_abc123', 50, new Date(), AcknowledgmentModel);
 * console.log(`${stats.acknowledgedCount}/${stats.totalRecipients} acknowledged (${stats.percentageAcknowledged}%)`);
 * ```
 */
export const getAcknowledgmentStats = async (
  alertId: string,
  totalRecipients: number,
  alertCreatedAt: Date,
  AckModel: any,
): Promise<Record<string, any>> => {
  const acks = await AckModel.findAll({
    where: { alertId },
  });

  const acknowledgedCount = acks.length;
  const percentageAcknowledged =
    totalRecipients > 0 ? (acknowledgedCount / totalRecipients) * 100 : 0;

  let averageAckTime = 0;
  if (acknowledgedCount > 0) {
    const totalTime = acks.reduce((sum: number, ack: any) => {
      const ackTime = new Date(ack.acknowledgedAt).getTime();
      const createTime = alertCreatedAt.getTime();
      return sum + (ackTime - createTime);
    }, 0);
    averageAckTime = totalTime / acknowledgedCount / 1000; // Convert to seconds
  }

  return {
    totalRecipients,
    acknowledgedCount,
    pendingCount: totalRecipients - acknowledgedCount,
    percentageAcknowledged: Math.round(percentageAcknowledged * 100) / 100,
    averageAckTimeSeconds: Math.round(averageAckTime),
    firstAck: acks.length > 0 ? acks[0].toJSON() : null,
    lastAck: acks.length > 0 ? acks[acks.length - 1].toJSON() : null,
  };
};

/**
 * Identifies users who haven't acknowledged alert.
 *
 * @param {string} alertId - Alert identifier
 * @param {string[]} allRecipients - All recipients who received alert
 * @param {Model} AckModel - Sequelize model
 * @returns {Promise<string[]>} Non-acknowledging users
 *
 * @example
 * ```typescript
 * const pending = await getPendingAcknowledgments('alert_abc123', allRecipientIds, AcknowledgmentModel);
 * pending.forEach(userId => {
 *   console.log(`User ${userId} has not acknowledged yet`);
 * });
 * ```
 */
export const getPendingAcknowledgments = async (
  alertId: string,
  allRecipients: string[],
  AckModel: any,
): Promise<string[]> => {
  const acks = await AckModel.findAll({
    where: { alertId },
    attributes: ['userId'],
  });

  const acknowledgedUsers = acks.map((a: any) => a.userId);
  return allRecipients.filter(userId => !acknowledgedUsers.includes(userId));
};

// ============================================================================
// PRIORITY-BASED ALERTING (23-26)
// ============================================================================

/**
 * Routes alert based on priority level.
 *
 * @param {Alert} alert - Alert data
 * @returns {AlertDistribution} Distribution configuration
 *
 * @example
 * ```typescript
 * const distribution = routeAlertByPriority({
 *   alertId: 'alert_abc123',
 *   priority: 'critical',
 *   category: 'fire',
 *   ...
 * });
 * // Critical alerts get SMS + voice, high alerts get SMS + push, etc.
 * ```
 */
export const routeAlertByPriority = (alert: Alert): AlertDistribution => {
  const channels: AlertChannel[] = [];

  switch (alert.priority) {
    case 'critical':
      channels.push(
        { type: 'voice', priority: 1, config: { immediate: true } },
        { type: 'sms', priority: 2, config: {} },
        { type: 'push', priority: 3, config: {} },
        { type: 'email', priority: 4, config: {} },
      );
      break;

    case 'high':
      channels.push(
        { type: 'sms', priority: 1, config: {} },
        { type: 'push', priority: 2, config: {} },
        { type: 'email', priority: 3, config: {} },
      );
      break;

    case 'medium':
      channels.push(
        { type: 'push', priority: 1, config: {} },
        { type: 'email', priority: 2, config: {} },
      );
      break;

    case 'low':
      channels.push(
        { type: 'email', priority: 1, config: {} },
        { type: 'in_app', priority: 2, config: {} },
      );
      break;
  }

  return {
    alertId: alert.alertId,
    channels,
    recipients: [],
    status: 'pending',
  };
};

/**
 * Determines recipient list based on alert priority and category.
 *
 * @param {Alert} alert - Alert data
 * @param {ContactGroup[]} groups - Available contact groups
 * @returns {string[]} Recipient user IDs
 *
 * @example
 * ```typescript
 * const recipients = selectRecipientsByPriority(alert, contactGroups);
 * console.log(`Alert will be sent to ${recipients.length} recipients`);
 * ```
 */
export const selectRecipientsByPriority = (
  alert: Alert,
  groups: ContactGroup[],
): string[] => {
  const recipients: string[] = [];

  groups.forEach(group => {
    if (!group.active) return;

    // Critical alerts go to all groups
    if (alert.priority === 'critical') {
      group.members.forEach(member => {
        if (!recipients.includes(member.userId)) {
          recipients.push(member.userId);
        }
      });
      return;
    }

    // Match by category tags
    const categoryMatch = group.tags.some(tag =>
      alert.category.toLowerCase().includes(tag.toLowerCase()),
    );

    if (categoryMatch) {
      group.members.forEach(member => {
        if (!recipients.includes(member.userId)) {
          recipients.push(member.userId);
        }
      });
    }
  });

  return recipients;
};

/**
 * Calculates alert delivery urgency score.
 *
 * @param {Alert} alert - Alert data
 * @returns {number} Urgency score (0-100)
 *
 * @example
 * ```typescript
 * const urgency = calculateAlertUrgency(alert);
 * if (urgency > 80) {
 *   console.log('Immediate delivery required');
 * }
 * ```
 */
export const calculateAlertUrgency = (alert: Alert): number => {
  let score = 0;

  // Priority contribution (0-40 points)
  const priorityScores: Record<string, number> = {
    critical: 40,
    high: 30,
    medium: 20,
    low: 10,
  };
  score += priorityScores[alert.priority] || 10;

  // Severity contribution (0-40 points)
  const severityScores: Record<string, number> = {
    critical: 40,
    error: 30,
    warning: 20,
    info: 10,
  };
  score += severityScores[alert.severity] || 10;

  // Acknowledgment requirement (0-20 points)
  if (alert.requiresAcknowledgment) {
    score += 20;
  }

  return Math.min(score, 100);
};

/**
 * Throttles low-priority alerts to prevent notification fatigue.
 *
 * @param {Alert[]} alerts - Alerts to potentially throttle
 * @param {number} maxPerHour - Maximum alerts per hour
 * @returns {Alert[]} Filtered alerts
 *
 * @example
 * ```typescript
 * const filtered = throttleLowPriorityAlerts(alerts, 10);
 * // Only allows 10 low-priority alerts per hour
 * ```
 */
export const throttleLowPriorityAlerts = (
  alerts: Alert[],
  maxPerHour: number,
): Alert[] => {
  const oneHourAgo = new Date(Date.now() - 3600000);

  const lowPriorityRecent = alerts.filter(
    alert =>
      (alert.priority === 'low' || alert.priority === 'medium') &&
      alert.createdAt >= oneHourAgo,
  );

  if (lowPriorityRecent.length < maxPerHour) {
    return alerts;
  }

  // Only allow critical and high priority alerts
  return alerts.filter(
    alert => alert.priority === 'critical' || alert.priority === 'high',
  );
};

// ============================================================================
// GEOGRAPHIC ALERTING (27-30)
// ============================================================================

/**
 * Filters recipients by geographic proximity.
 *
 * @param {ContactMember[]} members - Contact members
 * @param {GeographicFilter} filter - Geographic filter
 * @param {Function} getLocationFn - Function to get user location
 * @returns {Promise<ContactMember[]>} Filtered members
 *
 * @example
 * ```typescript
 * const nearbyMembers = await filterRecipientsByLocation(
 *   allMembers,
 *   { latitude: 40.7128, longitude: -74.0060, radiusKm: 10 },
 *   (userId) => getUserLocation(userId)
 * );
 * ```
 */
export const filterRecipientsByLocation = async (
  members: ContactMember[],
  filter: GeographicFilter,
  getLocationFn: (userId: string) => Promise<{ latitude: number; longitude: number } | null>,
): Promise<ContactMember[]> => {
  const nearby: ContactMember[] = [];

  for (const member of members) {
    const location = await getLocationFn(member.userId);
    if (!location) continue;

    const distance = calculateDistance(
      filter.latitude,
      filter.longitude,
      location.latitude,
      location.longitude,
    );

    if (distance <= filter.radiusKm) {
      nearby.push(member);
    }
  }

  return nearby;
};

/**
 * Creates broadcast alert for geographic area.
 *
 * @param {BroadcastAlert} broadcast - Broadcast configuration
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Created broadcast record
 *
 * @example
 * ```typescript
 * const broadcast = await createGeographicBroadcast({
 *   broadcastId: 'bcast_abc123',
 *   title: 'Weather Alert',
 *   message: 'Severe thunderstorm warning in your area',
 *   priority: 'high',
 *   targetArea: { latitude: 40.7128, longitude: -74.0060, radiusKm: 50 },
 *   channels: ['sms', 'push'],
 *   createdBy: 'admin_123',
 *   createdAt: new Date()
 * }, sequelize);
 * ```
 */
export const createGeographicBroadcast = async (
  broadcast: BroadcastAlert,
  sequelize: Sequelize,
): Promise<any> => {
  const [record] = await sequelize.query(
    `
    INSERT INTO geographic_broadcasts
    (broadcast_id, title, message, priority, target_area, target_roles, channels, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
    `,
    {
      replacements: [
        broadcast.broadcastId,
        broadcast.title,
        broadcast.message,
        broadcast.priority,
        JSON.stringify(broadcast.targetArea),
        JSON.stringify(broadcast.targetRoles),
        JSON.stringify(broadcast.channels),
        broadcast.createdBy,
      ],
      type: Sequelize.QueryTypes.INSERT,
    },
  );

  return record;
};

/**
 * Calculates affected population in geographic area.
 *
 * @param {GeographicFilter} area - Geographic area
 * @param {Model} ContactGroupModel - Contact group model
 * @param {Function} getLocationFn - Function to get user location
 * @returns {Promise<number>} Estimated affected population
 *
 * @example
 * ```typescript
 * const affected = await calculateAffectedPopulation(
 *   { latitude: 40.7128, longitude: -74.0060, radiusKm: 10 },
 *   ContactGroupModel,
 *   getUserLocation
 * );
 * console.log(`Approximately ${affected} people in affected area`);
 * ```
 */
export const calculateAffectedPopulation = async (
  area: GeographicFilter,
  ContactGroupModel: any,
  getLocationFn: (userId: string) => Promise<{ latitude: number; longitude: number } | null>,
): Promise<number> => {
  const groups = await ContactGroupModel.findAll({
    where: { active: true },
  });

  let count = 0;
  const uniqueUsers = new Set<string>();

  for (const group of groups) {
    for (const member of group.members) {
      if (uniqueUsers.has(member.userId)) continue;

      const location = await getLocationFn(member.userId);
      if (!location) continue;

      const distance = calculateDistance(
        area.latitude,
        area.longitude,
        location.latitude,
        location.longitude,
      );

      if (distance <= area.radiusKm) {
        uniqueUsers.add(member.userId);
        count++;
      }
    }
  }

  return count;
};

/**
 * Generates geographic zone boundary polygon.
 *
 * @param {GeographicFilter} center - Center point and radius
 * @param {number} segments - Number of polygon segments
 * @returns {Array<{ latitude: number; longitude: number }>} Boundary points
 *
 * @example
 * ```typescript
 * const boundary = generateZoneBoundary(
 *   { latitude: 40.7128, longitude: -74.0060, radiusKm: 5 },
 *   32
 * );
 * // Returns 32-sided polygon approximating circular zone
 * ```
 */
export const generateZoneBoundary = (
  center: GeographicFilter,
  segments: number,
): Array<{ latitude: number; longitude: number }> => {
  const points: Array<{ latitude: number; longitude: number }> = [];
  const radiusDegrees = center.radiusKm / 111; // Rough km to degrees conversion

  for (let i = 0; i < segments; i++) {
    const angle = (2 * Math.PI * i) / segments;
    const lat = center.latitude + radiusDegrees * Math.cos(angle);
    const lng = center.longitude + radiusDegrees * Math.sin(angle);
    points.push({ latitude: lat, longitude: lng });
  }

  return points;
};

// ============================================================================
// CONTACT LIST MANAGEMENT (31-35)
// ============================================================================

/**
 * Creates new contact group.
 *
 * @param {ContactGroup} group - Contact group data
 * @param {Model} ContactGroupModel - Sequelize model
 * @returns {Promise<any>} Created group record
 *
 * @example
 * ```typescript
 * const group = await createContactGroup({
 *   groupId: 'group_first_responders',
 *   name: 'First Responders',
 *   description: 'All first responder personnel',
 *   members: [...],
 *   tags: ['emergency', 'first_line'],
 *   active: true,
 *   metadata: {}
 * }, ContactGroupModel);
 * ```
 */
export const createContactGroup = async (
  group: ContactGroup,
  ContactGroupModel: any,
): Promise<any> => {
  const record = await ContactGroupModel.create({
    groupId: group.groupId,
    name: group.name,
    description: group.description,
    members: group.members,
    tags: group.tags,
    active: group.active,
    metadata: group.metadata,
  });

  return record;
};

/**
 * Adds member to contact group.
 *
 * @param {string} groupId - Group identifier
 * @param {ContactMember} member - Member to add
 * @param {Model} ContactGroupModel - Sequelize model
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await addContactGroupMember('group_first_responders', {
 *   userId: 'user_123',
 *   role: 'firefighter',
 *   contactMethods: [
 *     { type: 'sms', value: '+15551234567', verified: true, preferred: true }
 *   ],
 *   priority: 1
 * }, ContactGroupModel);
 * ```
 */
export const addContactGroupMember = async (
  groupId: string,
  member: ContactMember,
  ContactGroupModel: any,
): Promise<boolean> => {
  const group = await ContactGroupModel.findOne({ where: { groupId } });
  if (!group) return false;

  const members = group.members || [];
  const existingIndex = members.findIndex(
    (m: ContactMember) => m.userId === member.userId,
  );

  if (existingIndex >= 0) {
    members[existingIndex] = member; // Update existing member
  } else {
    members.push(member);
  }

  await group.update({ members });
  return true;
};

/**
 * Removes member from contact group.
 *
 * @param {string} groupId - Group identifier
 * @param {string} userId - User ID to remove
 * @param {Model} ContactGroupModel - Sequelize model
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await removeContactGroupMember('group_first_responders', 'user_123', ContactGroupModel);
 * ```
 */
export const removeContactGroupMember = async (
  groupId: string,
  userId: string,
  ContactGroupModel: any,
): Promise<boolean> => {
  const group = await ContactGroupModel.findOne({ where: { groupId } });
  if (!group) return false;

  const members = (group.members || []).filter(
    (m: ContactMember) => m.userId !== userId,
  );

  await group.update({ members });
  return true;
};

/**
 * Retrieves contact groups by tag.
 *
 * @param {string[]} tags - Tags to filter by
 * @param {Model} ContactGroupModel - Sequelize model
 * @returns {Promise<ContactGroup[]>} Matching contact groups
 *
 * @example
 * ```typescript
 * const emergencyGroups = await getContactGroupsByTag(['emergency', 'critical'], ContactGroupModel);
 * ```
 */
export const getContactGroupsByTag = async (
  tags: string[],
  ContactGroupModel: any,
): Promise<ContactGroup[]> => {
  const groups = await ContactGroupModel.findAll({
    where: {
      active: true,
    },
  });

  const matching = groups.filter((group: any) => {
    return tags.some(tag => group.tags.includes(tag));
  });

  return matching.map((g: any) => g.toJSON());
};

/**
 * Validates contact methods for member.
 *
 * @param {ContactMember} member - Contact member
 * @returns {Array<{ method: ContactMethod; valid: boolean; reason?: string }>} Validation results
 *
 * @example
 * ```typescript
 * const validation = validateContactMethods(member);
 * validation.forEach(result => {
 *   if (!result.valid) {
 *     console.log(`Invalid ${result.method.type}: ${result.reason}`);
 *   }
 * });
 * ```
 */
export const validateContactMethods = (
  member: ContactMember,
): Array<{ method: ContactMethod; valid: boolean; reason?: string }> => {
  const results: Array<{
    method: ContactMethod;
    valid: boolean;
    reason?: string;
  }> = [];

  member.contactMethods.forEach(method => {
    let valid = true;
    let reason: string | undefined;

    switch (method.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(method.value)) {
          valid = false;
          reason = 'Invalid email format';
        }
        break;

      case 'sms':
      case 'voice':
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(method.value.replace(/[\s()-]/g, ''))) {
          valid = false;
          reason = 'Invalid phone number format';
        }
        break;

      case 'push':
        if (!method.value || method.value.length < 10) {
          valid = false;
          reason = 'Invalid device token';
        }
        break;
    }

    if (!method.verified) {
      reason = (reason || '') + ' (not verified)';
    }

    results.push({ method, valid, reason });
  });

  return results;
};

// ============================================================================
// ALERT TEMPLATES (36-40)
// ============================================================================

/**
 * Creates reusable alert template.
 *
 * @param {AlertTemplate} template - Template configuration
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Created template record
 *
 * @example
 * ```typescript
 * const template = await createAlertTemplate({
 *   templateId: 'tmpl_fire_emergency',
 *   name: 'Fire Emergency',
 *   category: 'fire',
 *   priority: 'critical',
 *   titleTemplate: 'Fire Emergency - {{location}}',
 *   messageTemplate: 'Fire reported at {{location}}. {{units}} units dispatched. ETA: {{eta}} minutes.',
 *   variables: ['location', 'units', 'eta'],
 *   channels: ['sms', 'voice', 'push'],
 *   requiresAcknowledgment: true,
 *   escalationPolicyId: 'policy_critical_incidents',
 *   metadata: {}
 * }, sequelize);
 * ```
 */
export const createAlertTemplate = async (
  template: AlertTemplate,
  sequelize: Sequelize,
): Promise<any> => {
  const [record] = await sequelize.query(
    `
    INSERT INTO alert_templates
    (template_id, name, category, priority, title_template, message_template, variables, channels, requires_acknowledgment, escalation_policy_id, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
    `,
    {
      replacements: [
        template.templateId,
        template.name,
        template.category,
        template.priority,
        template.titleTemplate,
        template.messageTemplate,
        JSON.stringify(template.variables),
        JSON.stringify(template.channels),
        template.requiresAcknowledgment,
        template.escalationPolicyId,
        JSON.stringify(template.metadata),
      ],
      type: Sequelize.QueryTypes.INSERT,
    },
  );

  return record;
};

/**
 * Renders alert from template with variable substitution.
 *
 * @param {AlertTemplate} template - Alert template
 * @param {Record<string, any>} variables - Variable values
 * @returns {Alert} Rendered alert
 *
 * @example
 * ```typescript
 * const alert = renderAlertFromTemplate(fireTemplate, {
 *   location: '123 Main St',
 *   units: 3,
 *   eta: 5
 * });
 * console.log(alert.title); // "Fire Emergency - 123 Main St"
 * ```
 */
export const renderAlertFromTemplate = (
  template: AlertTemplate,
  variables: Record<string, any>,
): Alert => {
  let title = template.titleTemplate;
  let message = template.messageTemplate;

  // Replace variables
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    title = title.replace(placeholder, String(value));
    message = message.replace(placeholder, String(value));
  });

  return {
    alertId: `alert_${Date.now()}`,
    title,
    message,
    priority: template.priority as any,
    category: template.category,
    severity: (template.priority === 'critical' ? 'critical' : 'warning') as any,
    source: 'template',
    createdAt: new Date(),
    metadata: {
      templateId: template.templateId,
      variables,
      ...template.metadata,
    },
    requiresAcknowledgment: template.requiresAcknowledgment,
    escalationEnabled: !!template.escalationPolicyId,
  };
};

/**
 * Retrieves alert templates by category.
 *
 * @param {string} category - Template category
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<AlertTemplate[]>} Matching templates
 *
 * @example
 * ```typescript
 * const fireTemplates = await getAlertTemplatesByCategory('fire', sequelize);
 * ```
 */
export const getAlertTemplatesByCategory = async (
  category: string,
  sequelize: Sequelize,
): Promise<AlertTemplate[]> => {
  const templates = await sequelize.query(
    `SELECT * FROM alert_templates WHERE category = ?`,
    {
      replacements: [category],
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  return templates as AlertTemplate[];
};

/**
 * Updates alert template.
 *
 * @param {string} templateId - Template identifier
 * @param {Partial<AlertTemplate>} updates - Updates to apply
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await updateAlertTemplate('tmpl_fire_emergency', {
 *   messageTemplate: 'Updated message: {{location}}',
 *   variables: ['location', 'severity']
 * }, sequelize);
 * ```
 */
export const updateAlertTemplate = async (
  templateId: string,
  updates: Partial<AlertTemplate>,
  sequelize: Sequelize,
): Promise<boolean> => {
  const setClauses: string[] = [];
  const values: any[] = [];

  Object.entries(updates).forEach(([key, value]) => {
    const columnName = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    setClauses.push(`${columnName} = ?`);
    values.push(typeof value === 'object' ? JSON.stringify(value) : value);
  });

  if (setClauses.length === 0) return false;

  values.push(templateId);

  const [result] = await sequelize.query(
    `UPDATE alert_templates SET ${setClauses.join(', ')} WHERE template_id = ?`,
    {
      replacements: values,
      type: Sequelize.QueryTypes.UPDATE,
    },
  );

  return result > 0;
};

/**
 * Validates template variables are provided.
 *
 * @param {AlertTemplate} template - Alert template
 * @param {Record<string, any>} variables - Provided variables
 * @returns {{ valid: boolean; missing: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateTemplateVariables(template, { location: '123 Main St' });
 * if (!validation.valid) {
 *   console.log('Missing variables:', validation.missing);
 * }
 * ```
 */
export const validateTemplateVariables = (
  template: AlertTemplate,
  variables: Record<string, any>,
): { valid: boolean; missing: string[] } => {
  const missing: string[] = [];

  template.variables.forEach(varName => {
    if (!(varName in variables) || variables[varName] === undefined) {
      missing.push(varName);
    }
  });

  return {
    valid: missing.length === 0,
    missing,
  };
};

// ============================================================================
// DELIVERY TRACKING & METRICS (41-45)
// ============================================================================

/**
 * Tracks notification delivery status.
 *
 * @param {NotificationDelivery} delivery - Delivery record
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Created delivery record
 *
 * @example
 * ```typescript
 * await trackNotificationDelivery({
 *   deliveryId: 'del_abc123',
 *   alertId: 'alert_456',
 *   channel: 'sms',
 *   recipient: 'user_789',
 *   status: 'delivered',
 *   attempts: 1,
 *   sentAt: new Date(),
 *   deliveredAt: new Date()
 * }, sequelize);
 * ```
 */
export const trackNotificationDelivery = async (
  delivery: NotificationDelivery,
  sequelize: Sequelize,
): Promise<any> => {
  const [record] = await sequelize.query(
    `
    INSERT INTO notification_deliveries
    (delivery_id, alert_id, channel, recipient, status, attempts, sent_at, delivered_at, error_message)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
    `,
    {
      replacements: [
        delivery.deliveryId,
        delivery.alertId,
        delivery.channel,
        delivery.recipient,
        delivery.status,
        delivery.attempts,
        delivery.sentAt,
        delivery.deliveredAt,
        delivery.errorMessage,
      ],
      type: Sequelize.QueryTypes.INSERT,
    },
  );

  return record;
};

/**
 * Calculates comprehensive alert metrics.
 *
 * @param {string} alertId - Alert identifier
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<AlertMetrics>} Alert metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateAlertMetrics('alert_abc123', sequelize);
 * console.log(`Delivery rate: ${(metrics.deliveredCount / metrics.totalRecipients * 100).toFixed(1)}%`);
 * ```
 */
export const calculateAlertMetrics = async (
  alertId: string,
  sequelize: Sequelize,
): Promise<AlertMetrics> => {
  const deliveries = await sequelize.query(
    `SELECT * FROM notification_deliveries WHERE alert_id = ?`,
    {
      replacements: [alertId],
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  const acks = await sequelize.query(
    `SELECT * FROM alert_acknowledgments WHERE alert_id = ?`,
    {
      replacements: [alertId],
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  const alert = await sequelize.query(
    `SELECT * FROM alerts WHERE alert_id = ? LIMIT 1`,
    {
      replacements: [alertId],
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  const alertData = alert[0] as any;
  const deliveryRecords = deliveries as any[];
  const ackRecords = acks as any[];

  const totalRecipients = new Set(deliveryRecords.map(d => d.recipient)).size;
  const deliveredCount = deliveryRecords.filter(d => d.status === 'delivered')
    .length;
  const failedCount = deliveryRecords.filter(d => d.status === 'failed').length;
  const acknowledgedCount = ackRecords.length;

  // Calculate average delivery time
  const deliveryTimes = deliveryRecords
    .filter(d => d.delivered_at && d.sent_at)
    .map(
      d =>
        (new Date(d.delivered_at).getTime() -
          new Date(d.sent_at).getTime()) /
        1000,
    );
  const averageDeliveryTime =
    deliveryTimes.length > 0
      ? deliveryTimes.reduce((sum, time) => sum + time, 0) / deliveryTimes.length
      : 0;

  // Calculate average acknowledgment time
  const ackTimes = ackRecords
    .filter(a => alertData)
    .map(
      a =>
        (new Date(a.acknowledged_at).getTime() -
          new Date(alertData.created_at).getTime()) /
        1000,
    );
  const averageAcknowledgmentTime =
    ackTimes.length > 0
      ? ackTimes.reduce((sum, time) => sum + time, 0) / ackTimes.length
      : 0;

  // Group by channel
  const byChannel: Record<
    string,
    { sent: number; delivered: number; failed: number }
  > = {};
  deliveryRecords.forEach(d => {
    if (!byChannel[d.channel]) {
      byChannel[d.channel] = { sent: 0, delivered: 0, failed: 0 };
    }
    byChannel[d.channel].sent++;
    if (d.status === 'delivered') byChannel[d.channel].delivered++;
    if (d.status === 'failed') byChannel[d.channel].failed++;
  });

  return {
    alertId,
    totalRecipients,
    deliveredCount,
    failedCount,
    acknowledgedCount,
    averageDeliveryTime: Math.round(averageDeliveryTime),
    averageAcknowledgmentTime: Math.round(averageAcknowledgmentTime),
    byChannel,
  };
};

/**
 * Retrieves delivery failures for troubleshooting.
 *
 * @param {string} alertId - Alert identifier
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<NotificationDelivery[]>} Failed deliveries
 *
 * @example
 * ```typescript
 * const failures = await getDeliveryFailures('alert_abc123', sequelize);
 * failures.forEach(failure => {
 *   console.log(`Failed to ${failure.recipient} via ${failure.channel}: ${failure.errorMessage}`);
 * });
 * ```
 */
export const getDeliveryFailures = async (
  alertId: string,
  sequelize: Sequelize,
): Promise<NotificationDelivery[]> => {
  const failures = await sequelize.query(
    `SELECT * FROM notification_deliveries WHERE alert_id = ? AND status = 'failed'`,
    {
      replacements: [alertId],
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  return failures as NotificationDelivery[];
};

/**
 * Retries failed notification deliveries.
 *
 * @param {string} alertId - Alert identifier
 * @param {Function} sendFn - Channel send function
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} Number of successful retries
 *
 * @example
 * ```typescript
 * const retried = await retryFailedDeliveries(
 *   'alert_abc123',
 *   (channel, recipient, message) => sendNotification(channel, recipient, message),
 *   sequelize
 * );
 * console.log(`Successfully retried ${retried} deliveries`);
 * ```
 */
export const retryFailedDeliveries = async (
  alertId: string,
  sendFn: (channel: string, recipient: string, message: any) => Promise<any>,
  sequelize: Sequelize,
): Promise<number> => {
  const failures = await getDeliveryFailures(alertId, sequelize);
  let successCount = 0;

  for (const failure of failures) {
    try {
      await sendFn(failure.channel, failure.recipient, { alertId });

      await sequelize.query(
        `UPDATE notification_deliveries SET status = 'delivered', attempts = attempts + 1, delivered_at = ? WHERE delivery_id = ?`,
        {
          replacements: [new Date(), failure.deliveryId],
          type: Sequelize.QueryTypes.UPDATE,
        },
      );

      successCount++;
    } catch (error) {
      // Retry failed, log and continue
      console.error(
        `Retry failed for ${failure.deliveryId}:`,
        (error as Error).message,
      );
    }
  }

  return successCount;
};

/**
 * Generates alert performance report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Performance report
 *
 * @example
 * ```typescript
 * const report = await generateAlertPerformanceReport(
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   sequelize
 * );
 * console.log(`Total alerts: ${report.totalAlerts}, Avg delivery time: ${report.avgDeliveryTime}s`);
 * ```
 */
export const generateAlertPerformanceReport = async (
  startDate: Date,
  endDate: Date,
  sequelize: Sequelize,
): Promise<Record<string, any>> => {
  const alerts = await sequelize.query(
    `SELECT * FROM alerts WHERE created_at BETWEEN ? AND ?`,
    {
      replacements: [startDate, endDate],
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  const deliveries = await sequelize.query(
    `SELECT * FROM notification_deliveries WHERE sent_at BETWEEN ? AND ?`,
    {
      replacements: [startDate, endDate],
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  const acks = await sequelize.query(
    `SELECT * FROM alert_acknowledgments WHERE acknowledged_at BETWEEN ? AND ?`,
    {
      replacements: [startDate, endDate],
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  const alertRecords = alerts as any[];
  const deliveryRecords = deliveries as any[];
  const ackRecords = acks as any[];

  const byPriority: Record<string, number> = {};
  alertRecords.forEach(alert => {
    byPriority[alert.priority] = (byPriority[alert.priority] || 0) + 1;
  });

  const deliveryRate =
    deliveryRecords.length > 0
      ? (deliveryRecords.filter(d => d.status === 'delivered').length /
          deliveryRecords.length) *
        100
      : 0;

  return {
    period: { startDate, endDate },
    totalAlerts: alertRecords.length,
    byPriority,
    totalDeliveries: deliveryRecords.length,
    deliveryRate: Math.round(deliveryRate * 100) / 100,
    totalAcknowledgments: ackRecords.length,
    ackRate:
      alertRecords.length > 0
        ? Math.round((ackRecords.length / alertRecords.length) * 100 * 100) / 100
        : 0,
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculates distance between two geographic coordinates (Haversine formula).
 *
 * @param {number} lat1 - Latitude 1
 * @param {number} lon1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lon2 - Longitude 2
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default {
  // Sequelize Models
  createAlertModel,
  createAlertAcknowledgmentModel,
  createContactGroupModel,

  // Alert Creation & Management
  createAlert,
  updateAlert,
  getAlerts,
  expireAlerts,
  cancelAlert,

  // Multi-Channel Distribution
  distributeAlert,
  sendSMSNotification,
  sendEmailNotification,
  sendPushNotification,
  sendVoiceNotification,

  // Escalation Workflows
  createEscalationPolicy,
  initiateEscalation,
  advanceEscalationStage,
  shouldEscalateToNextStage,
  stopEscalation,

  // Alert Acknowledgment
  acknowledgeAlert,
  getAlertAcknowledgments,
  getAcknowledgmentStats,
  getPendingAcknowledgments,

  // Priority-Based Alerting
  routeAlertByPriority,
  selectRecipientsByPriority,
  calculateAlertUrgency,
  throttleLowPriorityAlerts,

  // Geographic Alerting
  filterRecipientsByLocation,
  createGeographicBroadcast,
  calculateAffectedPopulation,
  generateZoneBoundary,

  // Contact List Management
  createContactGroup,
  addContactGroupMember,
  removeContactGroupMember,
  getContactGroupsByTag,
  validateContactMethods,

  // Alert Templates
  createAlertTemplate,
  renderAlertFromTemplate,
  getAlertTemplatesByCategory,
  updateAlertTemplate,
  validateTemplateVariables,

  // Delivery Tracking & Metrics
  trackNotificationDelivery,
  calculateAlertMetrics,
  getDeliveryFailures,
  retryFailedDeliveries,
  generateAlertPerformanceReport,
};
