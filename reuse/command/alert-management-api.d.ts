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
import { Sequelize } from 'sequelize';
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
    byChannel: Record<string, {
        sent: number;
        delivered: number;
        failed: number;
    }>;
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
export declare const createAlertModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        alertId: string;
        title: string;
        message: string;
        priority: string;
        category: string;
        severity: string;
        source: string;
        createdAt: Date;
        expiresAt: Date | null;
        metadata: Record<string, any>;
        requiresAcknowledgment: boolean;
        escalationEnabled: boolean;
        status: string;
        readonly updatedAt: Date;
    };
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
export declare const createAlertAcknowledgmentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        alertId: string;
        userId: string;
        acknowledgedAt: Date;
        response: string | null;
        location: Record<string, any> | null;
        deviceInfo: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
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
export declare const createContactGroupModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        groupId: string;
        name: string;
        description: string | null;
        members: ContactMember[];
        tags: string[];
        active: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
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
export declare const createAlert: (alert: Alert, AlertModel: any) => Promise<any>;
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
export declare const updateAlert: (alertId: string, updates: Partial<Alert>, AlertModel: any) => Promise<boolean>;
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
export declare const getAlerts: (filters: Record<string, any>, limit: number, offset: number, AlertModel: any) => Promise<{
    alerts: Alert[];
    total: number;
}>;
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
export declare const expireAlerts: (AlertModel: any) => Promise<number>;
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
export declare const cancelAlert: (alertId: string, cancelledBy: string, reason: string, AlertModel: any) => Promise<boolean>;
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
export declare const distributeAlert: (distribution: AlertDistribution, sendFn: (channel: string, recipient: string, message: any) => Promise<any>) => Promise<NotificationDelivery[]>;
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
export declare const sendSMSNotification: (recipient: string, message: string, config: Record<string, any>) => Promise<any>;
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
export declare const sendEmailNotification: (recipient: string, subject: string, body: string, config: Record<string, any>) => Promise<any>;
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
export declare const sendPushNotification: (recipient: string, title: string, body: string, data: Record<string, any>) => Promise<any>;
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
export declare const sendVoiceNotification: (recipient: string, message: string, config: Record<string, any>) => Promise<any>;
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
export declare const createEscalationPolicy: (policy: EscalationPolicy, sequelize: Sequelize) => Promise<any>;
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
export declare const initiateEscalation: (alertId: string, policyId: string, sequelize: Sequelize) => Promise<any>;
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
export declare const advanceEscalationStage: (alertId: string, nextStage: number, sequelize: Sequelize) => Promise<boolean>;
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
export declare const shouldEscalateToNextStage: (alertId: string, stage: EscalationStage, AckModel: any) => Promise<boolean>;
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
export declare const stopEscalation: (alertId: string, reason: string, sequelize: Sequelize) => Promise<boolean>;
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
export declare const acknowledgeAlert: (ack: AlertAcknowledgment, AckModel: any) => Promise<any>;
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
export declare const getAlertAcknowledgments: (alertId: string, AckModel: any) => Promise<AlertAcknowledgment[]>;
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
export declare const getAcknowledgmentStats: (alertId: string, totalRecipients: number, alertCreatedAt: Date, AckModel: any) => Promise<Record<string, any>>;
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
export declare const getPendingAcknowledgments: (alertId: string, allRecipients: string[], AckModel: any) => Promise<string[]>;
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
export declare const routeAlertByPriority: (alert: Alert) => AlertDistribution;
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
export declare const selectRecipientsByPriority: (alert: Alert, groups: ContactGroup[]) => string[];
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
export declare const calculateAlertUrgency: (alert: Alert) => number;
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
export declare const throttleLowPriorityAlerts: (alerts: Alert[], maxPerHour: number) => Alert[];
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
export declare const filterRecipientsByLocation: (members: ContactMember[], filter: GeographicFilter, getLocationFn: (userId: string) => Promise<{
    latitude: number;
    longitude: number;
} | null>) => Promise<ContactMember[]>;
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
export declare const createGeographicBroadcast: (broadcast: BroadcastAlert, sequelize: Sequelize) => Promise<any>;
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
export declare const calculateAffectedPopulation: (area: GeographicFilter, ContactGroupModel: any, getLocationFn: (userId: string) => Promise<{
    latitude: number;
    longitude: number;
} | null>) => Promise<number>;
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
export declare const generateZoneBoundary: (center: GeographicFilter, segments: number) => Array<{
    latitude: number;
    longitude: number;
}>;
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
export declare const createContactGroup: (group: ContactGroup, ContactGroupModel: any) => Promise<any>;
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
export declare const addContactGroupMember: (groupId: string, member: ContactMember, ContactGroupModel: any) => Promise<boolean>;
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
export declare const removeContactGroupMember: (groupId: string, userId: string, ContactGroupModel: any) => Promise<boolean>;
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
export declare const getContactGroupsByTag: (tags: string[], ContactGroupModel: any) => Promise<ContactGroup[]>;
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
export declare const validateContactMethods: (member: ContactMember) => Array<{
    method: ContactMethod;
    valid: boolean;
    reason?: string;
}>;
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
export declare const createAlertTemplate: (template: AlertTemplate, sequelize: Sequelize) => Promise<any>;
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
export declare const renderAlertFromTemplate: (template: AlertTemplate, variables: Record<string, any>) => Alert;
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
export declare const getAlertTemplatesByCategory: (category: string, sequelize: Sequelize) => Promise<AlertTemplate[]>;
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
export declare const updateAlertTemplate: (templateId: string, updates: Partial<AlertTemplate>, sequelize: Sequelize) => Promise<boolean>;
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
export declare const validateTemplateVariables: (template: AlertTemplate, variables: Record<string, any>) => {
    valid: boolean;
    missing: string[];
};
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
export declare const trackNotificationDelivery: (delivery: NotificationDelivery, sequelize: Sequelize) => Promise<any>;
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
export declare const calculateAlertMetrics: (alertId: string, sequelize: Sequelize) => Promise<AlertMetrics>;
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
export declare const getDeliveryFailures: (alertId: string, sequelize: Sequelize) => Promise<NotificationDelivery[]>;
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
export declare const retryFailedDeliveries: (alertId: string, sendFn: (channel: string, recipient: string, message: any) => Promise<any>, sequelize: Sequelize) => Promise<number>;
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
export declare const generateAlertPerformanceReport: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<Record<string, any>>;
declare const _default: {
    createAlertModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            alertId: string;
            title: string;
            message: string;
            priority: string;
            category: string;
            severity: string;
            source: string;
            createdAt: Date;
            expiresAt: Date | null;
            metadata: Record<string, any>;
            requiresAcknowledgment: boolean;
            escalationEnabled: boolean;
            status: string;
            readonly updatedAt: Date;
        };
    };
    createAlertAcknowledgmentModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            alertId: string;
            userId: string;
            acknowledgedAt: Date;
            response: string | null;
            location: Record<string, any> | null;
            deviceInfo: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createContactGroupModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            groupId: string;
            name: string;
            description: string | null;
            members: ContactMember[];
            tags: string[];
            active: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createAlert: (alert: Alert, AlertModel: any) => Promise<any>;
    updateAlert: (alertId: string, updates: Partial<Alert>, AlertModel: any) => Promise<boolean>;
    getAlerts: (filters: Record<string, any>, limit: number, offset: number, AlertModel: any) => Promise<{
        alerts: Alert[];
        total: number;
    }>;
    expireAlerts: (AlertModel: any) => Promise<number>;
    cancelAlert: (alertId: string, cancelledBy: string, reason: string, AlertModel: any) => Promise<boolean>;
    distributeAlert: (distribution: AlertDistribution, sendFn: (channel: string, recipient: string, message: any) => Promise<any>) => Promise<NotificationDelivery[]>;
    sendSMSNotification: (recipient: string, message: string, config: Record<string, any>) => Promise<any>;
    sendEmailNotification: (recipient: string, subject: string, body: string, config: Record<string, any>) => Promise<any>;
    sendPushNotification: (recipient: string, title: string, body: string, data: Record<string, any>) => Promise<any>;
    sendVoiceNotification: (recipient: string, message: string, config: Record<string, any>) => Promise<any>;
    createEscalationPolicy: (policy: EscalationPolicy, sequelize: Sequelize) => Promise<any>;
    initiateEscalation: (alertId: string, policyId: string, sequelize: Sequelize) => Promise<any>;
    advanceEscalationStage: (alertId: string, nextStage: number, sequelize: Sequelize) => Promise<boolean>;
    shouldEscalateToNextStage: (alertId: string, stage: EscalationStage, AckModel: any) => Promise<boolean>;
    stopEscalation: (alertId: string, reason: string, sequelize: Sequelize) => Promise<boolean>;
    acknowledgeAlert: (ack: AlertAcknowledgment, AckModel: any) => Promise<any>;
    getAlertAcknowledgments: (alertId: string, AckModel: any) => Promise<AlertAcknowledgment[]>;
    getAcknowledgmentStats: (alertId: string, totalRecipients: number, alertCreatedAt: Date, AckModel: any) => Promise<Record<string, any>>;
    getPendingAcknowledgments: (alertId: string, allRecipients: string[], AckModel: any) => Promise<string[]>;
    routeAlertByPriority: (alert: Alert) => AlertDistribution;
    selectRecipientsByPriority: (alert: Alert, groups: ContactGroup[]) => string[];
    calculateAlertUrgency: (alert: Alert) => number;
    throttleLowPriorityAlerts: (alerts: Alert[], maxPerHour: number) => Alert[];
    filterRecipientsByLocation: (members: ContactMember[], filter: GeographicFilter, getLocationFn: (userId: string) => Promise<{
        latitude: number;
        longitude: number;
    } | null>) => Promise<ContactMember[]>;
    createGeographicBroadcast: (broadcast: BroadcastAlert, sequelize: Sequelize) => Promise<any>;
    calculateAffectedPopulation: (area: GeographicFilter, ContactGroupModel: any, getLocationFn: (userId: string) => Promise<{
        latitude: number;
        longitude: number;
    } | null>) => Promise<number>;
    generateZoneBoundary: (center: GeographicFilter, segments: number) => Array<{
        latitude: number;
        longitude: number;
    }>;
    createContactGroup: (group: ContactGroup, ContactGroupModel: any) => Promise<any>;
    addContactGroupMember: (groupId: string, member: ContactMember, ContactGroupModel: any) => Promise<boolean>;
    removeContactGroupMember: (groupId: string, userId: string, ContactGroupModel: any) => Promise<boolean>;
    getContactGroupsByTag: (tags: string[], ContactGroupModel: any) => Promise<ContactGroup[]>;
    validateContactMethods: (member: ContactMember) => Array<{
        method: ContactMethod;
        valid: boolean;
        reason?: string;
    }>;
    createAlertTemplate: (template: AlertTemplate, sequelize: Sequelize) => Promise<any>;
    renderAlertFromTemplate: (template: AlertTemplate, variables: Record<string, any>) => Alert;
    getAlertTemplatesByCategory: (category: string, sequelize: Sequelize) => Promise<AlertTemplate[]>;
    updateAlertTemplate: (templateId: string, updates: Partial<AlertTemplate>, sequelize: Sequelize) => Promise<boolean>;
    validateTemplateVariables: (template: AlertTemplate, variables: Record<string, any>) => {
        valid: boolean;
        missing: string[];
    };
    trackNotificationDelivery: (delivery: NotificationDelivery, sequelize: Sequelize) => Promise<any>;
    calculateAlertMetrics: (alertId: string, sequelize: Sequelize) => Promise<AlertMetrics>;
    getDeliveryFailures: (alertId: string, sequelize: Sequelize) => Promise<NotificationDelivery[]>;
    retryFailedDeliveries: (alertId: string, sendFn: (channel: string, recipient: string, message: any) => Promise<any>, sequelize: Sequelize) => Promise<number>;
    generateAlertPerformanceReport: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<Record<string, any>>;
};
export default _default;
//# sourceMappingURL=alert-management-api.d.ts.map