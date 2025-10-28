/**
 * LOC: C6BF3D5EA9-BCST
 * WC-SVC-COM-017-BCST | broadcastOperations.ts - Broadcast and Emergency Alert Operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - database/models
 *   - types.ts
 *   - messageOperations.ts
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (main service aggregator)
 */

/**
 * WC-SVC-COM-017-BCST | broadcastOperations.ts - Broadcast and Emergency Alert Operations
 * Purpose: Mass messaging to targeted audiences and emergency alert distribution
 * Upstream: database models, validation utilities, message operations | Dependencies: sequelize, joi
 * Downstream: index.ts | Called by: CommunicationService, emergency systems
 * Related: messageOperations, deliveryOperations
 * Exports: Broadcast and emergency alert functions
 * Last Updated: 2025-10-18 | File Type: .ts | HIPAA: Contains PHI - compliance validation required
 * Critical Path: Audience building → Recipient validation → HIPAA check → Broadcast delivery
 * LLM Context: Broadcast operations - handles mass messaging with audience targeting and emergency alerts
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { User, Student, EmergencyContact } from '../../database/models';
import {
  MessageType,
  MessagePriority,
  MessageCategory,
  RecipientType
} from '../../database/types/enums';
import {
  BroadcastMessageData,
  CreateMessageData,
  EmergencyAlertData,
  MessageDeliveryStatusResult
} from './types';
import {
  validateScheduledTime,
  validateHIPAACompliance,
  validateMessageContent,
  validateEmergencyAlert,
  broadcastMessageSchema,
  emergencyAlertSchema,
  COMMUNICATION_LIMITS
} from '../../utils/communicationValidation';
import { sendMessage } from './messageOperations';
import { Message } from '../../database/models';

/**
 * Send broadcast message to multiple audiences
 * Builds recipient list based on audience criteria and sends message
 * @param data - Broadcast message data with audience targeting
 * @returns Created message and delivery statuses
 */
export async function sendBroadcastMessage(data: BroadcastMessageData): Promise<{
  message: Message;
  deliveryStatuses: MessageDeliveryStatusResult[];
}> {
  try {
    // Validate input data
    const { error, value } = broadcastMessageSchema.validate(data, { abortEarly: false });

    if (error) {
      const validationErrors = error.details.map((detail) => detail.message).join(', ');
      throw new Error(`Validation failed: ${validationErrors}`);
    }

    // Validate scheduled time if provided
    if (data.scheduledAt) {
      const scheduledValidation = validateScheduledTime(data.scheduledAt);
      if (!scheduledValidation.isValid) {
        throw new Error(scheduledValidation.error);
      }
    }

    // HIPAA compliance check for broadcast content
    const hipaaValidation = validateHIPAACompliance(data.content);
    if (!hipaaValidation.isValid) {
      throw new Error(`HIPAA compliance failed: ${hipaaValidation.errors.join(', ')}`);
    }

    if (hipaaValidation.warnings.length > 0) {
      logger.warn(`Broadcast HIPAA compliance warnings: ${hipaaValidation.warnings.join(', ')}`);
    }

    // HIPAA compliance check for subject if present
    if (data.subject) {
      const subjectHipaaValidation = validateHIPAACompliance(data.subject);
      if (!subjectHipaaValidation.isValid) {
        throw new Error(`HIPAA compliance failed in subject: ${subjectHipaaValidation.errors.join(', ')}`);
      }
    }

    // Validate message content for each channel
    const contentValidationErrors: string[] = [];
    const contentValidationWarnings: string[] = [];

    for (const channel of data.channels) {
      const contentValidation = validateMessageContent(data.content, channel, data.subject);

      if (!contentValidation.isValid) {
        contentValidationErrors.push(...contentValidation.errors.map(err => `[${channel}] ${err}`));
      }

      if (contentValidation.warnings.length > 0) {
        contentValidationWarnings.push(...contentValidation.warnings.map(warn => `[${channel}] ${warn}`));
      }
    }

    if (contentValidationErrors.length > 0) {
      throw new Error(`Content validation failed: ${contentValidationErrors.join(', ')}`);
    }

    if (contentValidationWarnings.length > 0) {
      logger.warn(`Broadcast message content warnings: ${contentValidationWarnings.join(', ')}`);
    }

    // Validate emergency messages have URGENT priority
    if (data.category === MessageCategory.EMERGENCY && data.priority !== MessagePriority.URGENT) {
      logger.warn('Emergency broadcast messages should have URGENT priority. Auto-adjusting priority.');
      data.priority = MessagePriority.URGENT;
    }

    // Build recipient list based on audience criteria
    const recipients: CreateMessageData['recipients'] = [];

    // Get students based on criteria
    if (data.audience.grades || data.audience.nurseIds || data.audience.studentIds) {
      const studentWhereClause: any = { isActive: true };

      if (data.audience.grades?.length) {
        studentWhereClause.grade = { [Op.in]: data.audience.grades };
      }

      if (data.audience.nurseIds?.length) {
        studentWhereClause.nurseId = { [Op.in]: data.audience.nurseIds };
      }

      if (data.audience.studentIds?.length) {
        studentWhereClause.id = { [Op.in]: data.audience.studentIds };
      }

      const students = await Student.findAll({
        where: studentWhereClause,
        include: [
          {
            model: EmergencyContact,
            as: 'emergencyContacts',
            where: { isActive: true },
            required: false,
            separate: true,
            order: [['priority', 'ASC']]
          }
        ]
      });

      // Add emergency contacts if requested
      if (data.audience.includeEmergencyContacts || data.audience.includeParents) {
        for (const student of students) {
          const studentWithContacts = student as any;
          if (studentWithContacts.emergencyContacts && Array.isArray(studentWithContacts.emergencyContacts)) {
            for (const contact of studentWithContacts.emergencyContacts) {
              recipients.push({
                type: RecipientType.EMERGENCY_CONTACT,
                id: contact.id,
                email: contact.email || undefined,
                phoneNumber: contact.phoneNumber
              });
            }
          }
        }
      }
    }

    // Validate recipient count doesn't exceed broadcast limit
    if (recipients.length > COMMUNICATION_LIMITS.MAX_RECIPIENTS_BROADCAST) {
      throw new Error(
        `Broadcast message exceeds maximum recipient limit of ${COMMUNICATION_LIMITS.MAX_RECIPIENTS_BROADCAST}. ` +
        `Current recipient count: ${recipients.length}`
      );
    }

    if (recipients.length === 0) {
      throw new Error('No recipients found matching the specified audience criteria');
    }

    logger.info(`Broadcast message will be sent to ${recipients.length} recipients`);

    // Convert to message format and send
    const messageData: CreateMessageData = {
      recipients,
      channels: data.channels,
      subject: data.subject,
      content: data.content,
      priority: data.priority,
      category: data.category,
      scheduledAt: data.scheduledAt,
      senderId: data.senderId
    };

    return await sendMessage(messageData);
  } catch (error) {
    logger.error('Error sending broadcast message:', error);
    throw error;
  }
}

/**
 * Send emergency alert to staff
 * @param alert - Emergency alert configuration
 * @returns Created message and delivery statuses
 */
export async function sendEmergencyAlert(alert: EmergencyAlertData): Promise<{
  message: Message;
  deliveryStatuses: MessageDeliveryStatusResult[];
}> {
  try {
    // Validate input data
    const { error, value } = emergencyAlertSchema.validate(alert, { abortEarly: false });

    if (error) {
      const validationErrors = error.details.map((detail) => detail.message).join(', ');
      throw new Error(`Validation failed: ${validationErrors}`);
    }

    // Validate emergency alert requirements
    const emergencyValidation = validateEmergencyAlert({
      title: alert.title,
      message: alert.message,
      severity: alert.severity,
      priority: MessagePriority.URGENT,
      channels: alert.channels
    });

    if (!emergencyValidation.isValid) {
      throw new Error(`Emergency alert validation failed: ${emergencyValidation.errors.join(', ')}`);
    }

    if (emergencyValidation.warnings.length > 0) {
      logger.warn(`Emergency alert warnings: ${emergencyValidation.warnings.join(', ')}`);
    }

    // Build recipient list based on audience
    const recipients: CreateMessageData['recipients'] = [];

    if (alert.audience === 'ALL_STAFF') {
      const staff = await User.findAll({
        where: { isActive: true },
        attributes: ['id', 'email']
      });
      recipients.push(
        ...staff.map((s) => ({
          type: RecipientType.NURSE,
          id: s.id,
          email: s.email
        }))
      );
    } else if (alert.audience === 'NURSES_ONLY') {
      const nurses = await User.findAll({
        where: {
          isActive: true,
          role: 'NURSE'
        },
        attributes: ['id', 'email']
      });
      recipients.push(
        ...nurses.map((n) => ({
          type: RecipientType.NURSE,
          id: n.id,
          email: n.email
        }))
      );
    }

    // Send with highest priority
    return await sendMessage({
      recipients,
      channels: alert.channels,
      subject: `EMERGENCY ALERT: ${alert.title}`,
      content: alert.message,
      priority: MessagePriority.URGENT,
      category: MessageCategory.EMERGENCY,
      senderId: alert.senderId
    });
  } catch (error) {
    logger.error('Error sending emergency alert:', error);
    throw error;
  }
}
