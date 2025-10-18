/**
 * LOC: 6BE10E91B6
 * WC-GEN-249 | emergencyContactService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - emergencyContacts.ts (routes/emergencyContacts.ts)
 */

/**
 * WC-GEN-249 | emergencyContactService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../utils/logger, ../database/models, ../database/types/enums | Dependencies: sequelize, ../utils/logger, ../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, interfaces | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { logger } from '../utils/logger';
import {
  EmergencyContact,
  Student,
  sequelize
} from '../database/models';
import { ContactPriority } from '../database/types/enums';

export interface CreateEmergencyContactData {
  studentId: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  priority: ContactPriority;
  preferredContactMethod?: 'SMS' | 'EMAIL' | 'VOICE' | 'ANY';
  notificationChannels?: ('sms' | 'email' | 'voice')[];
  canPickupStudent?: boolean;
  notes?: string;
}

export interface UpdateEmergencyContactData {
  firstName?: string;
  lastName?: string;
  relationship?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  priority?: ContactPriority;
  isActive?: boolean;
  preferredContactMethod?: 'SMS' | 'EMAIL' | 'VOICE' | 'ANY';
  verificationStatus?: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'FAILED';
  notificationChannels?: ('sms' | 'email' | 'voice')[];
  canPickupStudent?: boolean;
  notes?: string;
}

export interface NotificationData {
  message: string;
  type: 'emergency' | 'health' | 'medication' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  studentId: string;
  channels: ('sms' | 'email' | 'voice')[];
  attachments?: string[];
}

export interface NotificationResult {
  contactId: string;
  contact: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
  };
  channels: {
    sms?: { success: boolean; messageId?: string; error?: string };
    email?: { success: boolean; messageId?: string; error?: string };
    voice?: { success: boolean; callId?: string; error?: string };
  };
  timestamp: Date;
}

export class EmergencyContactService {
  /**
   * Get emergency contacts for a student
   */
  static async getStudentEmergencyContacts(studentId: string) {
    try {
      const contacts = await EmergencyContact.findAll({
        where: {
          studentId,
          isActive: true
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        order: [
          ['priority', 'ASC'],
          ['firstName', 'ASC']
        ]
      });

      return contacts;
    } catch (error) {
      logger.error('Error fetching student emergency contacts:', error);
      throw new Error('Failed to fetch emergency contacts');
    }
  }

  /**
   * Create new emergency contact
   */
  static async createEmergencyContact(data: CreateEmergencyContactData) {
    const transaction = await sequelize.transaction();

    try {
      // Verify student exists
      const student = await Student.findByPk(data.studentId);

      if (!student) {
        throw new Error('Student not found');
      }

      if (!student.isActive) {
        throw new Error('Cannot add emergency contact to inactive student');
      }

      // Validate phone number format (model will validate, but add extra checks)
      const cleanPhone = data.phoneNumber.replace(/[\s\-().]/g, '');
      if (cleanPhone.length < 10) {
        throw new Error('Phone number must contain at least 10 digits');
      }

      // Validate email format if provided
      if (data.email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(data.email)) {
          throw new Error('Invalid email format');
        }
      }

      // Validate notification channels
      if (data.notificationChannels) {
        const validChannels = ['sms', 'email', 'voice'];
        for (const channel of data.notificationChannels) {
          if (!validChannels.includes(channel)) {
            throw new Error(`Invalid notification channel: ${channel}. Must be one of: ${validChannels.join(', ')}`);
          }
        }

        // Ensure email channel has email address
        if (data.notificationChannels.includes('email') && !data.email) {
          throw new Error('Email address is required when email is selected as a notification channel');
        }

        // Ensure SMS/voice channels have phone number (always required, but good to validate)
        if ((data.notificationChannels.includes('sms') || data.notificationChannels.includes('voice')) && !data.phoneNumber) {
          throw new Error('Phone number is required for SMS or voice notification channels');
        }
      }

      // Check if creating a PRIMARY contact and enforce business rules
      if (data.priority === ContactPriority.PRIMARY) {
        const existingPrimaryContacts = await EmergencyContact.count({
          where: {
            studentId: data.studentId,
            priority: ContactPriority.PRIMARY,
            isActive: true
          },
          transaction
        });

        if (existingPrimaryContacts >= 2) {
          throw new Error(
            'Student already has 2 primary contacts. Please set one as SECONDARY before adding another PRIMARY contact.'
          );
        }
      }

      // Prepare contact data with serialized notification channels
      const contactData: any = {
        ...data,
        notificationChannels: data.notificationChannels
          ? JSON.stringify(data.notificationChannels)
          : JSON.stringify(['sms', 'email']) // Default channels
      };

      const contact = await EmergencyContact.create(contactData, { transaction });

      // Reload with associations
      await contact.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        transaction
      });

      await transaction.commit();

      logger.info(`Emergency contact created: ${contact.firstName} ${contact.lastName} (${contact.priority}) for student ${student.firstName} ${student.lastName}`);
      return contact;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating emergency contact:', error);
      throw error;
    }
  }

  /**
   * Update emergency contact
   */
  static async updateEmergencyContact(id: string, data: UpdateEmergencyContactData) {
    const transaction = await sequelize.transaction();

    try {
      const existingContact = await EmergencyContact.findByPk(id, {
        include: [{ model: Student, as: 'student' }],
        transaction
      });

      if (!existingContact) {
        throw new Error('Emergency contact not found');
      }

      // Validate phone number format if being updated
      if (data.phoneNumber) {
        const cleanPhone = data.phoneNumber.replace(/[\s\-().]/g, '');
        if (cleanPhone.length < 10) {
          throw new Error('Phone number must contain at least 10 digits');
        }
      }

      // Validate email format if being updated
      if (data.email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(data.email)) {
          throw new Error('Invalid email format');
        }
      }

      // Validate notification channels if being updated
      if (data.notificationChannels) {
        const validChannels = ['sms', 'email', 'voice'];
        for (const channel of data.notificationChannels) {
          if (!validChannels.includes(channel)) {
            throw new Error(`Invalid notification channel: ${channel}. Must be one of: ${validChannels.join(', ')}`);
          }
        }

        // Check if email channel requires email address
        const finalEmail = data.email !== undefined ? data.email : existingContact.email;
        if (data.notificationChannels.includes('email') && !finalEmail) {
          throw new Error('Email address is required when email is selected as a notification channel');
        }
      }

      // Handle priority changes with PRIMARY contact enforcement
      if (data.priority !== undefined && data.priority !== existingContact.priority) {
        if (data.priority === ContactPriority.PRIMARY) {
          // Check if student already has 2 PRIMARY contacts
          const existingPrimaryContacts = await EmergencyContact.count({
            where: {
              studentId: existingContact.studentId,
              priority: ContactPriority.PRIMARY,
              isActive: true,
              id: { [Op.ne]: id } // Exclude current contact
            },
            transaction
          });

          if (existingPrimaryContacts >= 2) {
            throw new Error(
              'Student already has 2 primary contacts. Please set one as SECONDARY before changing this contact to PRIMARY.'
            );
          }
        } else if (existingContact.priority === ContactPriority.PRIMARY) {
          // Downgrading from PRIMARY - ensure at least one PRIMARY contact remains
          const otherPrimaryContacts = await EmergencyContact.count({
            where: {
              studentId: existingContact.studentId,
              priority: ContactPriority.PRIMARY,
              isActive: true,
              id: { [Op.ne]: id }
            },
            transaction
          });

          if (otherPrimaryContacts === 0) {
            throw new Error(
              'Cannot change priority from PRIMARY. Student must have at least one PRIMARY contact. Add another PRIMARY contact first or change this to SECONDARY and promote another contact.'
            );
          }
        }
      }

      // Handle deactivation - ensure at least one PRIMARY contact remains active
      if (data.isActive === false && existingContact.isActive && existingContact.priority === ContactPriority.PRIMARY) {
        const otherActivePrimaryContacts = await EmergencyContact.count({
          where: {
            studentId: existingContact.studentId,
            priority: ContactPriority.PRIMARY,
            isActive: true,
            id: { [Op.ne]: id }
          },
          transaction
        });

        if (otherActivePrimaryContacts === 0) {
          throw new Error(
            'Cannot deactivate the only active PRIMARY contact. Student must have at least one active PRIMARY contact.'
          );
        }
      }

      // Prepare update data with serialized notification channels
      const updateData: any = { ...data };
      if (data.notificationChannels) {
        updateData.notificationChannels = JSON.stringify(data.notificationChannels);
      }

      await existingContact.update(updateData, { transaction });

      // Reload with associations
      await existingContact.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        transaction
      });

      await transaction.commit();

      logger.info(`Emergency contact updated: ${existingContact.firstName} ${existingContact.lastName} for student ${existingContact.student!.firstName} ${existingContact.student!.lastName}`);
      return existingContact;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error updating emergency contact:', error);
      throw error;
    }
  }

  /**
   * Delete emergency contact (soft delete)
   */
  static async deleteEmergencyContact(id: string) {
    const transaction = await sequelize.transaction();

    try {
      const contact = await EmergencyContact.findByPk(id, {
        include: [{ model: Student, as: 'student' }],
        transaction
      });

      if (!contact) {
        throw new Error('Emergency contact not found');
      }

      // Prevent deletion if this is the only active PRIMARY contact
      if (contact.isActive && contact.priority === ContactPriority.PRIMARY) {
        const otherActivePrimaryContacts = await EmergencyContact.count({
          where: {
            studentId: contact.studentId,
            priority: ContactPriority.PRIMARY,
            isActive: true,
            id: { [Op.ne]: id }
          },
          transaction
        });

        if (otherActivePrimaryContacts === 0) {
          throw new Error(
            'Cannot delete the only active PRIMARY contact. Student must have at least one active PRIMARY contact. Add another PRIMARY contact first.'
          );
        }
      }

      await contact.update({ isActive: false }, { transaction });

      await transaction.commit();

      logger.info(`Emergency contact deleted: ${contact.firstName} ${contact.lastName} for student ${contact.student!.firstName} ${contact.student!.lastName}`);
      return { success: true };
    } catch (error) {
      await transaction.rollback();
      logger.error('Error deleting emergency contact:', error);
      throw error;
    }
  }

  /**
   * Send emergency notification to all contacts for a student
   */
  static async sendEmergencyNotification(
    studentId: string,
    notificationData: NotificationData
  ): Promise<NotificationResult[]> {
    try {
      // Get all active emergency contacts for the student
      const contacts = await this.getStudentEmergencyContacts(studentId);

      if (contacts.length === 0) {
        throw new Error('No emergency contacts found for student');
      }

      const results: NotificationResult[] = [];

      // Send notifications to contacts based on priority
      for (const contact of contacts) {
        const result: NotificationResult = {
          contactId: contact.id,
          contact: {
            firstName: contact.firstName,
            lastName: contact.lastName,
            phoneNumber: contact.phoneNumber,
            email: contact.email || undefined
          },
          channels: {},
          timestamp: new Date()
        };

        // Send SMS if requested and phone number is available
        if (notificationData.channels.includes('sms') && contact.phoneNumber) {
          try {
            const smsResult = await this.sendSMS(contact.phoneNumber, notificationData.message);
            result.channels.sms = { success: true, messageId: smsResult.messageId };
          } catch (error) {
            result.channels.sms = { success: false, error: (error as Error).message };
          }
        }

        // Send email if requested and email is available
        if (notificationData.channels.includes('email') && contact.email) {
          try {
            const emailResult = await this.sendEmail(
              contact.email,
              `Emergency Notification - ${contact.student!.firstName} ${contact.student!.lastName}`,
              notificationData.message,
              notificationData.attachments
            );
            result.channels.email = { success: true, messageId: emailResult.messageId };
          } catch (error) {
            result.channels.email = { success: false, error: (error as Error).message };
          }
        }

        // Send voice call if requested and phone number is available
        if (notificationData.channels.includes('voice') && contact.phoneNumber) {
          try {
            const voiceResult = await this.makeVoiceCall(contact.phoneNumber, notificationData.message);
            result.channels.voice = { success: true, callId: voiceResult.callId };
          } catch (error) {
            result.channels.voice = { success: false, error: (error as Error).message };
          }
        }

        results.push(result);
      }

      // Log the notification attempt
      logger.info(`Emergency notification sent for student ${studentId}: ${notificationData.type} (${notificationData.priority})`);

      return results;
    } catch (error) {
      logger.error('Error sending emergency notification:', error);
      throw error;
    }
  }

  /**
   * Send notification to specific contact
   */
  static async sendContactNotification(
    contactId: string,
    notificationData: NotificationData
  ): Promise<NotificationResult> {
    try {
      const contact = await EmergencyContact.findByPk(contactId, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });

      if (!contact) {
        throw new Error('Emergency contact not found');
      }

      if (!contact.isActive) {
        throw new Error('Emergency contact is not active');
      }

      const result: NotificationResult = {
        contactId: contact.id,
        contact: {
          firstName: contact.firstName,
          lastName: contact.lastName,
          phoneNumber: contact.phoneNumber,
          email: contact.email || undefined
        },
        channels: {},
        timestamp: new Date()
      };

      // Send through requested channels
      for (const channel of notificationData.channels) {
        switch (channel) {
          case 'sms':
            if (contact.phoneNumber) {
              try {
                const smsResult = await this.sendSMS(contact.phoneNumber, notificationData.message);
                result.channels.sms = { success: true, messageId: smsResult.messageId };
              } catch (error) {
                result.channels.sms = { success: false, error: (error as Error).message };
              }
            }
            break;

          case 'email':
            if (contact.email) {
              try {
                const emailResult = await this.sendEmail(
                  contact.email,
                  `Notification - ${contact.student!.firstName} ${contact.student!.lastName}`,
                  notificationData.message,
                  notificationData.attachments
                );
                result.channels.email = { success: true, messageId: emailResult.messageId };
              } catch (error) {
                result.channels.email = { success: false, error: (error as Error).message };
              }
            }
            break;

          case 'voice':
            if (contact.phoneNumber) {
              try {
                const voiceResult = await this.makeVoiceCall(contact.phoneNumber, notificationData.message);
                result.channels.voice = { success: true, callId: voiceResult.callId };
              } catch (error) {
                result.channels.voice = { success: false, error: (error as Error).message };
              }
            }
            break;
        }
      }

      logger.info(`Notification sent to contact ${contact.firstName} ${contact.lastName} for student ${contact.student!.firstName} ${contact.student!.lastName}`);
      return result;
    } catch (error) {
      logger.error('Error sending contact notification:', error);
      throw error;
    }
  }

  /**
   * Verify emergency contact information
   */
  static async verifyContact(contactId: string, verificationMethod: 'sms' | 'email' | 'voice') {
    try {
      const contact = await EmergencyContact.findByPk(contactId, {
        include: [{ model: Student, as: 'student' }]
      });

      if (!contact) {
        throw new Error('Emergency contact not found');
      }

      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const message = `Verification code for ${contact.student!.firstName} ${contact.student!.lastName}: ${verificationCode}`;

      let result;
      switch (verificationMethod) {
        case 'sms':
          if (!contact.phoneNumber) {
            throw new Error('Phone number not available for SMS verification');
          }
          result = await this.sendSMS(contact.phoneNumber, message);
          break;

        case 'email':
          if (!contact.email) {
            throw new Error('Email address not available for email verification');
          }
          result = await this.sendEmail(
            contact.email,
            'Contact Verification',
            message
          );
          break;

        case 'voice':
          if (!contact.phoneNumber) {
            throw new Error('Phone number not available for voice verification');
          }
          result = await this.makeVoiceCall(contact.phoneNumber, message);
          break;

        default:
          throw new Error('Invalid verification method');
      }

      // Store verification code in cache/database for validation
      // This would typically use Redis or similar for temporary storage
      logger.info(`Verification ${verificationMethod} sent to contact ${contact.firstName} ${contact.lastName}`);

      return {
        verificationCode, // In production, this should not be returned
        method: verificationMethod,
        ...result
      };
    } catch (error) {
      logger.error('Error verifying contact:', error);
      throw error;
    }
  }

  /**
   * Get emergency contact statistics
   */
  static async getContactStatistics() {
    try {
      const stats = await EmergencyContact.findAll({
        where: { isActive: true },
        attributes: [
          'priority',
          [sequelize.fn('COUNT', sequelize.col('priority')), 'count']
        ],
        group: ['priority'],
        raw: true
      });

      const totalContacts = await EmergencyContact.count({
        where: { isActive: true }
      });

      const studentsWithoutContacts = await Student.count({
        where: {
          isActive: true,
          '$emergencyContacts.id$': null
        },
        include: [
          {
            model: EmergencyContact,
            as: 'emergencyContacts',
            where: { isActive: true },
            required: false
          }
        ],
        distinct: true
      });

      return {
        totalContacts,
        studentsWithoutContacts,
        byPriority: stats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.priority] = parseInt(curr.count, 10);
          return acc;
        }, {} as Record<string, number>)
      };
    } catch (error) {
      logger.error('Error fetching contact statistics:', error);
      throw error;
    }
  }

  // Private helper methods for actual communication
  // These would integrate with external services like Twilio, SendGrid, etc.

  private static async sendSMS(phoneNumber: string, message: string) {
    // Mock implementation - replace with actual SMS service
    logger.info(`SMS would be sent to ${phoneNumber}: ${message}`);
    return {
      messageId: `sms_${Date.now()}`,
      success: true
    };
  }

  private static async sendEmail(email: string, subject: string, _message: string, _attachments?: string[]) {
    // Mock implementation - replace with actual email service
    logger.info(`Email would be sent to ${email}: ${subject}`);
    return {
      messageId: `email_${Date.now()}`,
      success: true
    };
  }

  private static async makeVoiceCall(phoneNumber: string, message: string) {
    // Mock implementation - replace with actual voice service
    logger.info(`Voice call would be made to ${phoneNumber}: ${message}`);
    return {
      callId: `call_${Date.now()}`,
      success: true
    };
  }
}
