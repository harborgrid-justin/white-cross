/**
 * @fileoverview Message Database Model (Communication)
 * @module database/models/communication/Message
 * @description Sequelize model for managing secure healthcare communications sent to parents, guardians,
 * and staff. Supports multiple delivery methods, scheduled messaging, priority management, and comprehensive
 * compliance tracking for HIPAA-compliant messaging.
 *
 * Key Features:
 * - Multi-channel delivery (email, SMS, push notifications)
 * - Priority-based message management (LOW, MEDIUM, HIGH, URGENT)
 * - Category classification (emergency, health updates, reminders, etc.)
 * - Scheduled message delivery
 * - Attachment support (up to 10 files, HTTPS only)
 * - Template integration
 * - Recipient tracking and delivery status
 * - PHI protection and sensitive data validation
 *
 * Message Categories:
 * - EMERGENCY: Critical health/safety alerts (requires URGENT priority)
 * - HEALTH_UPDATE: General health information and updates
 * - APPOINTMENT_REMINDER: Upcoming appointment notifications
 * - MEDICATION_REMINDER: Medication administration reminders
 * - GENERAL: General school health communications
 * - INCIDENT_NOTIFICATION: Incident report notifications to parents
 * - COMPLIANCE: Compliance-related communications
 *
 * Delivery Methods (via MessageDelivery model):
 * - EMAIL: Standard email notifications
 * - SMS: Text message alerts (limited content)
 * - PUSH_NOTIFICATION: Mobile app notifications
 * - VOICE: Automated voice calls (critical alerts)
 *
 * @compliance HIPAA - Secure messaging for PHI transmission
 * @compliance TCPA - Telephone Consumer Protection Act compliance for SMS/voice
 * @compliance CAN-SPAM - Email marketing and notification compliance
 *
 * @legal Messages containing PHI must use encrypted channels
 * @legal Retention requirement: 7 years for healthcare communications
 * @legal Emergency notifications must be delivered within minutes
 * @legal Proof of delivery required for critical communications
 *
 * @requires sequelize
 * @requires ../../config/sequelize
 * @requires ../../types/enums
 *
 * LOC: 37CFEAA3A7
 * Last Updated: 2025-10-17
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { MessagePriority, MessageCategory } from '../../types/enums';

/**
 * @interface MessageAttributes
 * @description Defines the complete structure of a message record
 *
 * @property {string} id - Unique identifier (UUID v4)
 *
 * @property {string} [subject] - Message subject line (max 255 characters)
 * @business Optional for SMS/push; recommended for email
 * @business Keep concise for mobile notifications
 *
 * @property {string} content - Message body content (1-50000 characters)
 * @business Required for all messages
 * @compliance Automatically scanned for sensitive data (SSN, credit cards)
 * @compliance HIPAA violation if contains unencrypted SSN or payment info
 * @business SMS: Limited to ~160 characters for single message
 * @business Email: Can be longer, supports HTML formatting
 *
 * @property {MessagePriority} priority - Message priority level
 * @enum {MessagePriority} ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
 * @business LOW: General information, can be batched
 * @business MEDIUM: Standard notifications, sent promptly
 * @business HIGH: Important updates, immediate delivery
 * @business URGENT: Critical alerts, all channels, immediate
 * @business EMERGENCY category requires URGENT priority
 *
 * @property {MessageCategory} category - Message category
 * @enum {MessageCategory} ['EMERGENCY', 'HEALTH_UPDATE', 'APPOINTMENT_REMINDER', 'MEDICATION_REMINDER', 'GENERAL', 'INCIDENT_NOTIFICATION', 'COMPLIANCE']
 * @business EMERGENCY: Must have URGENT priority, all recipients notified
 * @business APPOINTMENT_REMINDER: Sent 24h and 1h before appointment
 * @business MEDICATION_REMINDER: Sent at scheduled medication times
 * @business INCIDENT_NOTIFICATION: Parent notification for incidents
 *
 * @property {number} recipientCount - Number of recipients (0-10000)
 * @business Used for tracking and reporting
 * @business Updated when MessageDelivery records created
 * @business Max 10000 recipients per message (batch larger sends)
 *
 * @property {Date} [scheduledAt] - Scheduled delivery time
 * @business Optional - if not set, send immediately
 * @business Must be future date
 * @business Used for appointment reminders, scheduled announcements
 * @business Emergency messages ignore scheduled time
 *
 * @property {string[]} attachments - Array of attachment URLs (max 10)
 * @business Must be HTTPS URLs for security
 * @business Max 10 attachments per message
 * @business Each URL max 2048 characters
 * @compliance Attachments containing PHI must be encrypted
 * @business Common attachments: consent forms, health info, policies
 *
 * @property {string} senderId - Reference to sending user
 * @business Required for accountability and audit trail
 * @compliance Tracked for HIPAA compliance
 *
 * @property {string} [templateId] - Reference to message template
 * @business Optional - if using template for consistent messaging
 * @business Templates help ensure compliant, professional communications
 *
 * @property {Date} createdAt - Record creation timestamp
 * @legal Used for compliance audits and delivery timing
 * @property {Date} updatedAt - Record last update timestamp
 */
interface MessageAttributes {
  id: string;
  subject?: string;
  content: string;
  priority: MessagePriority;
  category: MessageCategory;
  recipientCount: number;
  scheduledAt?: Date;
  attachments: string[];
  senderId: string;
  templateId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface MessageCreationAttributes
 * @description Defines optional fields when creating a new message
 * @extends MessageAttributes
 */
interface MessageCreationAttributes
  extends Optional<
    MessageAttributes,
    'id' | 'subject' | 'recipientCount' | 'scheduledAt' | 'attachments' | 'templateId' | 'createdAt' | 'updatedAt'
  > {}

/**
 * @class Message
 * @extends Model
 * @description Sequelize model class for healthcare communication messages
 *
 * Workflow Summary:
 * 1. Message created → Content validated for sensitive data
 * 2. Recipients determined → MessageDelivery records created
 * 3. Delivery method chosen → Email, SMS, push, or voice
 * 4. Scheduled or immediate → Send now or at scheduledAt time
 * 5. Message sent → Delivery status tracked per recipient
 * 6. Delivery confirmed → Status updated (SENT, DELIVERED, FAILED)
 * 7. Failures handled → Retry logic applied based on priority
 * 8. Audit trail maintained → All activity logged for 7 years
 *
 * Message Priority Guidelines:
 * - URGENT: Emergency alerts, critical incidents (deliver immediately, all methods)
 * - HIGH: Appointment changes, medication alerts (deliver within 15 minutes)
 * - MEDIUM: General reminders, health updates (deliver within 1 hour)
 * - LOW: Informational content, newsletters (can be batched, deliver within 24 hours)
 *
 * Notification Timelines:
 * - EMERGENCY category + URGENT priority: Immediate delivery via all available channels
 * - INCIDENT_NOTIFICATION: Within timeframe based on incident severity
 *   - CRITICAL incidents: 1 hour notification required
 *   - HIGH incidents: 2 hour notification required
 * - APPOINTMENT_REMINDER: 24 hours and 1 hour before appointment
 * - MEDICATION_REMINDER: 30 minutes before scheduled administration
 *
 * Security & Compliance:
 * - Content scanned for SSN patterns (XXX-XX-XXXX format)
 * - Content scanned for credit card patterns (16-digit sequences)
 * - Warnings issued for potential Medical Record Numbers (6+ digit sequences)
 * - All attachments must use HTTPS protocol
 * - PHI-containing messages logged for HIPAA compliance
 * - Emergency messages bypass normal opt-out preferences
 *
 * Delivery Methods (managed via MessageDelivery):
 * - EMAIL: Best for detailed information, attachments
 * - SMS: Best for urgent alerts, appointment reminders (160 char limit)
 * - PUSH_NOTIFICATION: Best for app users, real-time updates
 * - VOICE: Best for critical emergencies, elder/non-tech recipients
 *
 * Template Integration:
 * - Templates ensure consistent, compliant messaging
 * - Common templates: appointment reminders, incident notifications, consent requests
 * - Templates support variable substitution (student name, date, etc.)
 * - Reduces human error and improves professionalism
 *
 * Associations:
 * - belongsTo: User (senderId - message sender)
 * - belongsTo: MessageTemplate (optional - if using template)
 * - hasMany: MessageDelivery (delivery records per recipient)
 *
 * Content Validations:
 * - noSensitiveData: Scans for SSN, credit cards, potential MRNs
 * - emergencyPriority: EMERGENCY category requires URGENT priority
 * - validAttachments: Max 10, HTTPS only, valid URLs
 *
 * @example
 * // Send an emergency notification
 * const message = await Message.create({
 *   subject: 'EMERGENCY: School Closure Due to Weather',
 *   content: 'Due to severe weather conditions, school is closed today...',
 *   priority: MessagePriority.URGENT,
 *   category: MessageCategory.EMERGENCY,
 *   senderId: 'admin-uuid',
 *   recipientCount: 500
 * });
 *
 * @example
 * // Schedule an appointment reminder
 * const reminder = await Message.create({
 *   subject: 'Appointment Reminder',
 *   content: 'This is a reminder that {{studentName}} has a health appointment tomorrow at {{time}}',
 *   priority: MessagePriority.MEDIUM,
 *   category: MessageCategory.APPOINTMENT_REMINDER,
 *   scheduledAt: new Date(appointmentDate - 24*60*60*1000), // 24 hours before
 *   senderId: 'nurse-uuid',
 *   templateId: 'appointment-reminder-template-uuid'
 * });
 */
export class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: string;
  public subject?: string;
  public content!: string;
  public priority!: MessagePriority;
  public category!: MessageCategory;
  public recipientCount!: number;
  public scheduledAt?: Date;
  public attachments!: string[];
  public senderId!: string;
  public templateId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: 'Subject cannot exceed 255 characters',
        },
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Message content is required',
        },
        len: {
          args: [1, 50000],
          msg: 'Content must be between 1 and 50000 characters',
        },
        noSensitiveData(value: string) {
          // Check for SSN patterns (XXX-XX-XXXX or XXXXXXXXX)
          const ssnPattern = /\b\d{3}-?\d{2}-?\d{4}\b/g;
          if (ssnPattern.test(value)) {
            throw new Error('HIPAA Violation: Messages must not contain Social Security Numbers');
          }

          // Check for credit card patterns
          const ccPattern = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
          if (ccPattern.test(value)) {
            throw new Error('PCI Violation: Messages must not contain credit card numbers');
          }

          // Warn about potential medical record numbers (MRN) - 6+ consecutive digits
          const mrnPattern = /\b\d{6,}\b/g;
          const matches = value.match(mrnPattern);
          if (matches && matches.length > 2) {
            // Only warn if multiple instances, as it could be legitimate numeric content
            console.warn('Warning: Message contains multiple numeric sequences that may be medical record numbers');
          }
        },
      },
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(MessagePriority)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(MessagePriority)],
          msg: 'Invalid message priority',
        },
      },
    },
    category: {
      type: DataTypes.ENUM(...Object.values(MessageCategory)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(MessageCategory)],
          msg: 'Invalid message category',
        },
        emergencyPriority(value: MessageCategory) {
          if (value === MessageCategory.EMERGENCY && this.priority !== MessagePriority.URGENT) {
            throw new Error('Emergency messages must have URGENT priority');
          }
        },
      },
    },
    recipientCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Recipient count cannot be negative',
        },
        max: {
          args: [10000],
          msg: 'Recipient count cannot exceed 10000',
        },
      },
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'Scheduled time must be a valid date',
          args: true,
        },
        isFuture(value: Date) {
          if (value && new Date(value) <= new Date()) {
            throw new Error('Scheduled time must be in the future');
          }
        },
      },
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      validate: {
        validateAttachmentsArray(value: string[]) {
          if (!Array.isArray(value)) {
            throw new Error('Attachments must be an array');
          }
          if (value.length > 10) {
            throw new Error('Cannot exceed 10 attachments per message');
          }
        },
        validUrls(value: string[]) {
          if (!Array.isArray(value)) return;

          const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

          for (const url of value) {
            if (!urlPattern.test(url)) {
              throw new Error(`Invalid attachment URL format: ${url.substring(0, 50)}...`);
            }
            if (url.length > 2048) {
              throw new Error('Attachment URL cannot exceed 2048 characters');
            }
            // Security: Ensure HTTPS for PHI attachments
            if (!url.startsWith('https://')) {
              throw new Error('Attachment URLs must use HTTPS protocol for security');
            }
          }
        },
      },
    },
    senderId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Sender ID is required',
        },
        isUUID: {
          args: 4,
          msg: 'Sender ID must be a valid UUID',
        },
      },
    },
    templateId: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUUID: {
          args: 4,
          msg: 'Template ID must be a valid UUID',
        },
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: true,
    indexes: [
      { fields: ['senderId'] },
      { fields: ['templateId'] },
      { fields: ['priority', 'createdAt'] },
      { fields: ['category'] },
      { fields: ['scheduledAt'] },
    ],
  }
);
