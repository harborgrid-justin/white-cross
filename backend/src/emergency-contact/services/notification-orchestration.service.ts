/**
 * Notification Orchestration Service
 *
 * Orchestrates multi-contact and multi-channel notification delivery:
 * - Emergency notification broadcasts to all student contacts
 * - Single contact notification with multi-channel support
 * - Result aggregation and error handling
 * - Contact filtering and priority-based routing
 *
 * This service coordinates between contact retrieval, notification delivery,
 * and result aggregation to provide a complete notification workflow.
 */
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EmergencyContact } from '../../database/models/emergency-contact.model';
import { NotificationDto } from '../dto/notification.dto';
import { NotificationResultDto } from '../dto/notification-result.dto';
import { NotificationDeliveryService } from './notification-delivery.service';
import { ContactManagementService } from './contact-management.service';

import { BaseService } from '../../../common/base';
@Injectable()
export class NotificationOrchestrationService extends BaseService {
  constructor(
    @InjectModel(EmergencyContact)
    private readonly emergencyContactModel: typeof EmergencyContact,
    private readonly notificationService: NotificationDeliveryService,
    private readonly contactManagementService: ContactManagementService,
  ) {}

  /**
   * Send emergency notification to all contacts for a student
   * Broadcasts notification through multiple channels to all active contacts
   *
   * @param studentId - Student identifier
   * @param notificationData - Notification content and channel configuration
   * @returns Array of notification results, one per contact
   * @throws NotFoundException if no contacts found for student
   */
  async sendEmergencyNotification(
    studentId: string,
    notificationData: NotificationDto,
  ): Promise<NotificationResultDto[]> {
    try {
      // Get all active emergency contacts for the student
      const contacts =
        await this.contactManagementService.getStudentEmergencyContacts(
          studentId,
        );

      if (contacts.length === 0) {
        throw new NotFoundException('No emergency contacts found for student');
      }

      const results: NotificationResultDto[] = [];

      // Send notifications to contacts based on priority
      for (const contact of contacts) {
        const result = await this.sendNotificationToContact(
          contact,
          notificationData,
        );
        results.push(result);
      }

      this.logInfo(
        `Emergency notification sent for student ${studentId}: ${notificationData.type} (${notificationData.priority})`,
      );

      return results;
    } catch (error) {
      this.logError(
        `Error sending emergency notification: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Send notification to specific contact
   * Delivers notification through requested channels to a single contact
   *
   * @param contactId - Contact identifier
   * @param notificationData - Notification content and channel configuration
   * @returns Notification result with channel-specific outcomes
   * @throws NotFoundException if contact not found
   * @throws BadRequestException if contact is not active
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

      const result = await this.sendNotificationToContact(
        contact,
        notificationData,
      );

      this.logInfo(
        `Notification sent to contact ${contact.firstName} ${contact.lastName}`,
      );

      return result;
    } catch (error) {
      this.logError(
        `Error sending contact notification: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  // ==================== Private Helper Methods ====================

  /**
   * Send notification to a contact through specified channels
   * Handles multi-channel delivery and result aggregation
   *
   * @param contact - Emergency contact record
   * @param notificationData - Notification configuration
   * @returns Aggregated notification result
   */
  private async sendNotificationToContact(
    contact: EmergencyContact,
    notificationData: NotificationDto,
  ): Promise<NotificationResultDto> {
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

    // Send through each requested channel
    for (const channel of notificationData.channels) {
      const channelResult = await this.sendThroughChannel(
        channel,
        contact,
        notificationData,
      );
      result.channels[channel] = channelResult;
    }

    return result;
  }

  /**
   * Send notification through a specific channel
   * Routes to appropriate notification method based on channel type
   *
   * @param channel - Notification channel (sms, email, voice)
   * @param contact - Emergency contact
   * @param notificationData - Notification configuration
   * @returns Channel-specific result
   */
  private async sendThroughChannel(
    channel: 'sms' | 'email' | 'voice',
    contact: EmergencyContact,
    notificationData: NotificationDto,
  ): Promise<{ success: boolean; messageId?: string; callId?: string; error?: string }> {
    switch (channel) {
      case 'sms':
        return await this.sendSMSToContact(contact, notificationData.message);

      case 'email':
        return await this.sendEmailToContact(
          contact,
          notificationData.message,
          notificationData.studentId,
          notificationData.attachments,
        );

      case 'voice':
        return await this.makeVoiceCallToContact(
          contact,
          notificationData.message,
        );

      default:
        return {
          success: false,
          error: `Unknown channel: ${channel}`,
        };
    }
  }

  /**
   * Send SMS to contact
   *
   * @param contact - Emergency contact
   * @param message - SMS message content
   * @returns SMS delivery result
   */
  private async sendSMSToContact(
    contact: EmergencyContact,
    message: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!contact.phoneNumber) {
      return this.handleError('Operation failed', new Error('Phone number not available'));
    }

    try {
      const smsResult = await this.notificationService.sendSMS(
        contact.phoneNumber,
        message,
      );
      return {
        success: true,
        messageId: smsResult.messageId,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send email to contact
   *
   * @param contact - Emergency contact
   * @param message - Email message content
   * @param studentId - Student identifier for subject line
   * @param attachments - Optional email attachments
   * @returns Email delivery result
   */
  private async sendEmailToContact(
    contact: EmergencyContact,
    message: string,
    studentId?: string,
    attachments?: string[],
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!contact.email) {
      return this.handleError('Operation failed', new Error('Email address not available'));
    }

    try {
      const subject = studentId
        ? `Notification - Student ${studentId}`
        : 'Emergency Notification';

      const emailResult = await this.notificationService.sendEmail(
        contact.email,
        subject,
        message,
        attachments,
      );
      return {
        success: true,
        messageId: emailResult.messageId,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Make voice call to contact
   *
   * @param contact - Emergency contact
   * @param message - Voice message content (text-to-speech)
   * @returns Voice call result
   */
  private async makeVoiceCallToContact(
    contact: EmergencyContact,
    message: string,
  ): Promise<{ success: boolean; callId?: string; error?: string }> {
    if (!contact.phoneNumber) {
      return this.handleError('Operation failed', new Error('Phone number not available'));
    }

    try {
      const voiceResult = await this.notificationService.makeVoiceCall(
        contact.phoneNumber,
        message,
      );
      return {
        success: true,
        callId: voiceResult.callId,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
