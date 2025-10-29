/**
 * Emergency Contact Service
 *
 * Business logic for managing student emergency contacts, including:
 * - CRUD operations with validation
 * - Primary contact enforcement (max 2 primary contacts)
 * - Multi-channel notification sending (SMS, email, voice)
 * - Contact verification workflows
 * - Statistics and reporting
 */
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { EmergencyContact } from '../database/models/emergency-contact.model';
import { Student } from '../database/models/student.model';
import { ContactPriority, VerificationStatus } from '../contact/enums';
import {
  CreateEmergencyContactDto,
  UpdateEmergencyContactDto,
  NotificationDto,
  NotificationResultDto,
} from './dto';

@Injectable()
export class EmergencyContactService {
  private readonly logger = new Logger(EmergencyContactService.name);

  constructor(
    @InjectModel(EmergencyContact)
    private readonly emergencyContactModel: typeof EmergencyContact,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {}

  /**
   * Get emergency contacts for a student
   */
  async getStudentEmergencyContacts(studentId: string): Promise<EmergencyContact[]> {
    try {
      const contacts = await this.emergencyContactModel.findAll({
        where: {
          studentId,
          isActive: true,
        },
        order: [
          ['priority', 'ASC'],
          ['firstName', 'ASC'],
        ],
      });

      this.logger.log(`Retrieved ${contacts.length} emergency contacts for student ${studentId}`);
      return contacts;
    } catch (error) {
      this.logger.error(`Error fetching student emergency contacts: ${error.message}`, error.stack);
      throw new Error('Failed to fetch emergency contacts');
    }
  }

  /**
   * Create new emergency contact
   */
  async createEmergencyContact(data: CreateEmergencyContactDto): Promise<EmergencyContact> {
    if (!this.emergencyContactModel.sequelize) {
      throw new Error('Database connection not available');
    }
    const transaction = await this.emergencyContactModel.sequelize.transaction();

    try {
      // Verify student exists
      const student = await this.studentModel.findOne({
        where: { id: data.studentId },
        transaction,
      });

      if (!student) {
        throw new NotFoundException(`Student not found`);
      }

      if (!student.isActive) {
        throw new BadRequestException('Cannot add emergency contact to inactive student');
      }

      // Validate phone number format
      const cleanPhone = data.phoneNumber.replace(/[\s\-().]/g, '');
      if (cleanPhone.length < 10) {
        throw new BadRequestException('Phone number must contain at least 10 digits');
      }

      // Validate email format if provided
      if (data.email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(data.email)) {
          throw new BadRequestException('Invalid email format');
        }
      }

      // Validate notification channels
      if (data.notificationChannels) {
        const validChannels = ['sms', 'email', 'voice'];
        for (const channel of data.notificationChannels) {
          if (!validChannels.includes(channel)) {
            throw new BadRequestException(
              `Invalid notification channel: ${channel}. Must be one of: ${validChannels.join(', ')}`,
            );
          }
        }

        // Ensure email channel has email address
        if (data.notificationChannels.includes('email') && !data.email) {
          throw new BadRequestException(
            'Email address is required when email is selected as a notification channel',
          );
        }

        // Ensure SMS/voice channels have phone number
        if (
          (data.notificationChannels.includes('sms') || data.notificationChannels.includes('voice')) &&
          !data.phoneNumber
        ) {
          throw new BadRequestException('Phone number is required for SMS or voice notification channels');
        }
      }

      // Check if creating a PRIMARY contact and enforce business rules
      if (data.priority === ContactPriority.PRIMARY) {
        const existingPrimaryContacts = await this.emergencyContactModel.count({
          where: {
            studentId: data.studentId,
            priority: ContactPriority.PRIMARY,
            isActive: true,
          },
          transaction,
        });

        if (existingPrimaryContacts >= 2) {
          throw new BadRequestException(
            'Student already has 2 primary contacts. Please set one as SECONDARY before adding another PRIMARY contact.',
          );
        }
      }

      // Prepare contact data with serialized notification channels
      const contactData = {
        ...data,
        notificationChannels: data.notificationChannels
          ? JSON.stringify(data.notificationChannels)
          : JSON.stringify(['sms', 'email']), // Default channels
      };

      const savedContact = await this.emergencyContactModel.create(contactData, { transaction });

      await transaction.commit();

      this.logger.log(
        `Emergency contact created: ${savedContact.firstName} ${savedContact.lastName} (${savedContact.priority}) for student ${student.firstName} ${student.lastName}`,
      );

      return savedContact;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Error creating emergency contact: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Update emergency contact
   */
  async updateEmergencyContact(
    id: string,
    data: UpdateEmergencyContactDto,
  ): Promise<EmergencyContact> {
    if (!this.emergencyContactModel.sequelize) {
      throw new Error('Database connection not available');
    }
    const transaction = await this.emergencyContactModel.sequelize.transaction();

    try {
      const existingContact = await this.emergencyContactModel.findOne({
        where: { id },
        transaction,
      });

      if (!existingContact) {
        throw new NotFoundException('Emergency contact not found');
      }

      // Validate phone number format if being updated
      if (data.phoneNumber) {
        const cleanPhone = data.phoneNumber.replace(/[\s\-().]/g, '');
        if (cleanPhone.length < 10) {
          throw new BadRequestException('Phone number must contain at least 10 digits');
        }
      }

      // Validate email format if being updated
      if (data.email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(data.email)) {
          throw new BadRequestException('Invalid email format');
        }
      }

      // Validate notification channels if being updated
      if (data.notificationChannels) {
        const validChannels = ['sms', 'email', 'voice'];
        for (const channel of data.notificationChannels) {
          if (!validChannels.includes(channel)) {
            throw new BadRequestException(
              `Invalid notification channel: ${channel}. Must be one of: ${validChannels.join(', ')}`,
            );
          }
        }

        // Check if email channel requires email address
        const finalEmail = data.email !== undefined ? data.email : existingContact.email;
        if (data.notificationChannels.includes('email') && !finalEmail) {
          throw new BadRequestException(
            'Email address is required when email is selected as a notification channel',
          );
        }
      }

      // Handle priority changes with PRIMARY contact enforcement
      if (data.priority !== undefined && data.priority !== existingContact.priority) {
        if (data.priority === ContactPriority.PRIMARY) {
          // Check if student already has 2 PRIMARY contacts
          const existingPrimaryContacts = await this.emergencyContactModel.count({
            where: {
              studentId: existingContact.studentId,
              priority: ContactPriority.PRIMARY,
              isActive: true,
              id: { [Op.ne]: id },
            },
            transaction,
          });

          if (existingPrimaryContacts >= 2) {
            throw new BadRequestException(
              'Student already has 2 primary contacts. Please set one as SECONDARY before changing this contact to PRIMARY.',
            );
          }
        } else if (existingContact.priority === ContactPriority.PRIMARY) {
          // Downgrading from PRIMARY - ensure at least one PRIMARY contact remains
          const otherPrimaryContacts = await this.emergencyContactModel.count({
            where: {
              studentId: existingContact.studentId,
              priority: ContactPriority.PRIMARY,
              isActive: true,
              id: { [Op.ne]: id },
            },
            transaction,
          });

          if (otherPrimaryContacts === 0) {
            throw new BadRequestException(
              'Cannot change priority from PRIMARY. Student must have at least one PRIMARY contact. Add another PRIMARY contact first or change this to SECONDARY and promote another contact.',
            );
          }
        }
      }

      // Handle deactivation - ensure at least one PRIMARY contact remains active
      if (
        data.isActive === false &&
        existingContact.isActive &&
        existingContact.priority === ContactPriority.PRIMARY
      ) {
        const otherActivePrimaryContacts = await this.emergencyContactModel.count({
          where: {
            studentId: existingContact.studentId,
            priority: ContactPriority.PRIMARY,
            isActive: true,
            id: { [Op.ne]: id },
          },
          transaction,
        });

        if (otherActivePrimaryContacts === 0) {
          throw new BadRequestException(
            'Cannot deactivate the only active PRIMARY contact. Student must have at least one active PRIMARY contact.',
          );
        }
      }

      // Prepare update data with serialized notification channels
      const updateData: any = { ...data };
      if (data.notificationChannels) {
        updateData.notificationChannels = JSON.stringify(data.notificationChannels);
      }

      await existingContact.update(updateData, { transaction });

      await transaction.commit();

      this.logger.log(
        `Emergency contact updated: ${existingContact.firstName} ${existingContact.lastName}`,
      );

      return existingContact;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Error updating emergency contact: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Delete emergency contact (soft delete)
   */
  async deleteEmergencyContact(id: string): Promise<{ success: boolean }> {
    if (!this.emergencyContactModel.sequelize) {
      throw new Error('Database connection not available');
    }
    const transaction = await this.emergencyContactModel.sequelize.transaction();

    try {
      const contact = await this.emergencyContactModel.findOne({
        where: { id },
        transaction,
      });

      if (!contact) {
        throw new NotFoundException('Emergency contact not found');
      }

      // Prevent deletion if this is the only active PRIMARY contact
      if (contact.isActive && contact.priority === ContactPriority.PRIMARY) {
        const otherActivePrimaryContacts = await this.emergencyContactModel.count({
          where: {
            studentId: contact.studentId,
            priority: ContactPriority.PRIMARY,
            isActive: true,
            id: { [Op.ne]: id },
          },
          transaction,
        });

        if (otherActivePrimaryContacts === 0) {
          throw new BadRequestException(
            'Cannot delete the only active PRIMARY contact. Student must have at least one active PRIMARY contact. Add another PRIMARY contact first.',
          );
        }
      }

      await contact.update({ isActive: false }, { transaction });

      await transaction.commit();

      this.logger.log(`Emergency contact deleted: ${contact.firstName} ${contact.lastName}`);

      return { success: true };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Error deleting emergency contact: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Send emergency notification to all contacts for a student
   */
  async sendEmergencyNotification(
    studentId: string,
    notificationData: NotificationDto,
  ): Promise<NotificationResultDto[]> {
    try {
      // Get all active emergency contacts for the student
      const contacts = await this.getStudentEmergencyContacts(studentId);

      if (contacts.length === 0) {
        throw new NotFoundException('No emergency contacts found for student');
      }

      const results: NotificationResultDto[] = [];

      // Send notifications to contacts based on priority
      for (const contact of contacts) {
        const result: NotificationResultDto = {
          contactId: contact.id,
          contact: {
            firstName: contact.firstName,
            lastName: contact.lastName,
            phoneNumber: contact.phoneNumber,
            email: contact.email || undefined,
          },
          channels: {},
          timestamp: new Date(),
        };

        // Send SMS if requested and phone number is available
        if (notificationData.channels.includes('sms') && contact.phoneNumber) {
          try {
            const smsResult = await this.sendSMS(contact.phoneNumber, notificationData.message);
            result.channels.sms = { success: true, messageId: smsResult.messageId };
          } catch (error) {
            result.channels.sms = { success: false, error: error.message };
          }
        }

        // Send email if requested and email is available
        if (notificationData.channels.includes('email') && contact.email) {
          try {
            const emailResult = await this.sendEmail(
              contact.email,
              `Emergency Notification - Student ${studentId}`,
              notificationData.message,
              notificationData.attachments,
            );
            result.channels.email = { success: true, messageId: emailResult.messageId };
          } catch (error) {
            result.channels.email = { success: false, error: error.message };
          }
        }

        // Send voice call if requested and phone number is available
        if (notificationData.channels.includes('voice') && contact.phoneNumber) {
          try {
            const voiceResult = await this.makeVoiceCall(contact.phoneNumber, notificationData.message);
            result.channels.voice = { success: true, callId: voiceResult.callId };
          } catch (error) {
            result.channels.voice = { success: false, error: error.message };
          }
        }

        results.push(result);
      }

      this.logger.log(
        `Emergency notification sent for student ${studentId}: ${notificationData.type} (${notificationData.priority})`,
      );

      return results;
    } catch (error) {
      this.logger.error(`Error sending emergency notification: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Send notification to specific contact
   */
  async sendContactNotification(
    contactId: string,
    notificationData: NotificationDto,
  ): Promise<NotificationResultDto> {
    try {
      const contact = await this.emergencyContactModel.findOne({
        where: { id: contactId },
      });

      if (!contact) {
        throw new NotFoundException('Emergency contact not found');
      }

      if (!contact.isActive) {
        throw new BadRequestException('Emergency contact is not active');
      }

      const result: NotificationResultDto = {
        contactId: contact.id,
        contact: {
          firstName: contact.firstName,
          lastName: contact.lastName,
          phoneNumber: contact.phoneNumber,
          email: contact.email || undefined,
        },
        channels: {},
        timestamp: new Date(),
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
                result.channels.sms = { success: false, error: error.message };
              }
            }
            break;

          case 'email':
            if (contact.email) {
              try {
                const emailResult = await this.sendEmail(
                  contact.email,
                  `Notification - Student ${notificationData.studentId}`,
                  notificationData.message,
                  notificationData.attachments,
                );
                result.channels.email = { success: true, messageId: emailResult.messageId };
              } catch (error) {
                result.channels.email = { success: false, error: error.message };
              }
            }
            break;

          case 'voice':
            if (contact.phoneNumber) {
              try {
                const voiceResult = await this.makeVoiceCall(contact.phoneNumber, notificationData.message);
                result.channels.voice = { success: true, callId: voiceResult.callId };
              } catch (error) {
                result.channels.voice = { success: false, error: error.message };
              }
            }
            break;
        }
      }

      this.logger.log(`Notification sent to contact ${contact.firstName} ${contact.lastName}`);
      return result;
    } catch (error) {
      this.logger.error(`Error sending contact notification: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Verify emergency contact information
   */
  async verifyContact(contactId: string, verificationMethod: 'sms' | 'email' | 'voice') {
    try {
      const contact = await this.emergencyContactModel.findOne({
        where: { id: contactId },
      });

      if (!contact) {
        throw new NotFoundException('Emergency contact not found');
      }

      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const message = `Verification code for student emergency contact: ${verificationCode}`;

      let result;
      switch (verificationMethod) {
        case 'sms':
          if (!contact.phoneNumber) {
            throw new BadRequestException('Phone number not available for SMS verification');
          }
          result = await this.sendSMS(contact.phoneNumber, message);
          break;

        case 'email':
          if (!contact.email) {
            throw new BadRequestException('Email address not available for email verification');
          }
          result = await this.sendEmail(contact.email, 'Contact Verification', message);
          break;

        case 'voice':
          if (!contact.phoneNumber) {
            throw new BadRequestException('Phone number not available for voice verification');
          }
          result = await this.makeVoiceCall(contact.phoneNumber, message);
          break;

        default:
          throw new BadRequestException('Invalid verification method');
      }

      // Update verification status to PENDING
      await contact.update({
        verificationStatus: VerificationStatus.PENDING,
      });

      this.logger.log(`Verification ${verificationMethod} sent to contact ${contact.firstName} ${contact.lastName}`);

      return {
        verificationCode, // In production, this should not be returned
        method: verificationMethod,
        ...result,
      };
    } catch (error) {
      this.logger.error(`Error verifying contact: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get emergency contact statistics
   */
  async getContactStatistics() {
    try {
      const totalContacts = await this.emergencyContactModel.count({
        where: { isActive: true },
      });

      // Get counts by priority
      const byPriority: Record<string, number> = {};
      for (const priority of Object.values(ContactPriority)) {
        const count = await this.emergencyContactModel.count({
          where: { isActive: true, priority },
        });
        byPriority[priority] = count;
      }

      // Count students without contacts
      const allStudents = await this.studentModel.count({
        where: { isActive: true },
      });

      if (!this.emergencyContactModel.sequelize) {
        throw new Error('Database connection not available');
      }

      const [studentsWithContactsResult]: any = await this.emergencyContactModel.sequelize.query(
        'SELECT COUNT(DISTINCT "studentId") as count FROM "EmergencyContacts" WHERE "isActive" = true',
        { type: 'SELECT' }
      );

      const studentsWithoutContacts = allStudents - (parseInt(studentsWithContactsResult.count) || 0);

      return {
        totalContacts,
        studentsWithoutContacts,
        byPriority,
      };
    } catch (error) {
      this.logger.error(`Error fetching contact statistics: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get emergency contact by ID
   */
  async getEmergencyContactById(id: string): Promise<EmergencyContact> {
    try {
      const contact = await this.emergencyContactModel.findOne({
        where: { id },
      });

      if (!contact) {
        throw new NotFoundException('Emergency contact not found');
      }

      this.logger.log(`Retrieved emergency contact: ${id}`);
      return contact;
    } catch (error) {
      this.logger.error(`Error getting emergency contact by ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Private helper methods for actual communication
  // These would integrate with external services like Twilio, SendGrid, etc.

  private async sendSMS(phoneNumber: string, message: string) {
    // Mock implementation - replace with actual SMS service
    this.logger.log(`SMS would be sent to ${phoneNumber}: ${message}`);
    return {
      messageId: `sms_${Date.now()}`,
      success: true,
    };
  }

  private async sendEmail(email: string, subject: string, message: string, attachments?: string[]) {
    // Mock implementation - replace with actual email service
    this.logger.log(`Email would be sent to ${email}: ${subject}`);
    return {
      messageId: `email_${Date.now()}`,
      success: true,
    };
  }

  private async makeVoiceCall(phoneNumber: string, message: string) {
    // Mock implementation - replace with actual voice service
    this.logger.log(`Voice call would be made to ${phoneNumber}: ${message}`);
    return {
      callId: `call_${Date.now()}`,
      success: true,
    };
  }
}
