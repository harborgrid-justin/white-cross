/**
 * Contact Verification Service
 *
 * Handles emergency contact verification workflows including:
 * - Verification code generation
 * - Multi-channel verification (SMS, email, voice)
 * - Verification status management
 * - Contact validation through user confirmation
 *
 * This service ensures emergency contact information is accurate
 * and up-to-date by requiring contacts to verify their information.
 */
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EmergencyContact } from '@/database/models';
import { VerificationStatus } from '../../contact/enums';
import { NotificationDeliveryService } from './notification-delivery.service';

import { BaseService } from '@/common/base';
@Injectable()
export class ContactVerificationService extends BaseService {
  constructor(
    @InjectModel(EmergencyContact)
    private readonly emergencyContactModel: typeof EmergencyContact,
    private readonly notificationService: NotificationDeliveryService,
  ) {}

  /**
   * Verify emergency contact information
   * Sends verification code through specified channel
   *
   * @param contactId - Contact identifier
   * @param verificationMethod - Channel to use for verification (sms, email, voice)
   * @returns Verification result with code and delivery details
   * @throws NotFoundException if contact not found
   * @throws BadRequestException if contact information missing for method
   */
  async verifyContact(
    contactId: string,
    verificationMethod: 'sms' | 'email' | 'voice',
  ) {
    try {
      const contact = await this.emergencyContactModel.findOne({
        where: { id: contactId },
      });

      if (!contact) {
        throw new NotFoundException('Emergency contact not found');
      }

      // Generate 6-digit verification code
      const verificationCode = this.generateVerificationCode();
      const message = `Verification code for student emergency contact: ${verificationCode}`;

      let result;
      switch (verificationMethod) {
        case 'sms':
          if (!contact.phoneNumber) {
            throw new BadRequestException(
              'Phone number not available for SMS verification',
            );
          }
          result = await this.notificationService.sendSMS(
            contact.phoneNumber,
            message,
          );
          break;

        case 'email':
          if (!contact.email) {
            throw new BadRequestException(
              'Email address not available for email verification',
            );
          }
          result = await this.notificationService.sendEmail(
            contact.email,
            'Contact Verification',
            message,
          );
          break;

        case 'voice':
          if (!contact.phoneNumber) {
            throw new BadRequestException(
              'Phone number not available for voice verification',
            );
          }
          result = await this.notificationService.makeVoiceCall(
            contact.phoneNumber,
            message,
          );
          break;

        default:
          throw new BadRequestException('Invalid verification method');
      }

      // Update verification status to PENDING
      await contact.update({
        verificationStatus: VerificationStatus.PENDING,
      });

      this.logInfo(
        `Verification ${verificationMethod} sent to contact ${contact.firstName} ${contact.lastName}`,
      );

      return {
        verificationCode, // In production, this should not be returned
        method: verificationMethod,
        ...result,
      };
    } catch (error) {
      this.logError(
        `Error verifying contact: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Confirm verification with code
   * Updates contact verification status to VERIFIED
   *
   * @param contactId - Contact identifier
   * @param code - Verification code entered by user
   * @returns Success indicator
   * @throws NotFoundException if contact not found
   * @throws BadRequestException if code is invalid
   */
  async confirmVerification(
    contactId: string,
    code: string,
  ): Promise<{ success: boolean }> {
    try {
      const contact = await this.emergencyContactModel.findOne({
        where: { id: contactId },
      });

      if (!contact) {
        throw new NotFoundException('Emergency contact not found');
      }

      // In production, validate code against stored hash
      // For now, this is a placeholder for the verification logic
      const isValidCode = true; // Replace with actual validation

      if (!isValidCode) {
        throw new BadRequestException('Invalid verification code');
      }

      // Update verification status to VERIFIED
      await contact.update({
        verificationStatus: VerificationStatus.VERIFIED,
      });

      this.logInfo(
        `Contact verified: ${contact.firstName} ${contact.lastName}`,
      );

      return { success: true };
    } catch (error) {
      this.logError(
        `Error confirming verification: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get verification status for a contact
   *
   * @param contactId - Contact identifier
   * @returns Verification status
   * @throws NotFoundException if contact not found
   */
  async getVerificationStatus(contactId: string): Promise<VerificationStatus> {
    const contact = await this.emergencyContactModel.findOne({
      where: { id: contactId },
    });

    if (!contact) {
      throw new NotFoundException('Emergency contact not found');
    }

    return contact.verificationStatus;
  }

  /**
   * Reset verification status
   * Sets contact back to UNVERIFIED state
   *
   * @param contactId - Contact identifier
   * @returns Success indicator
   * @throws NotFoundException if contact not found
   */
  async resetVerification(contactId: string): Promise<{ success: boolean }> {
    try {
      const contact = await this.emergencyContactModel.findOne({
        where: { id: contactId },
      });

      if (!contact) {
        throw new NotFoundException('Emergency contact not found');
      }

      await contact.update({
        verificationStatus: VerificationStatus.UNVERIFIED,
      });

      this.logInfo(
        `Verification reset for contact: ${contact.firstName} ${contact.lastName}`,
      );

      return { success: true };
    } catch (error) {
      this.logError(
        `Error resetting verification: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  // ==================== Private Helper Methods ====================

  /**
   * Generate 6-digit verification code
   * Creates random numeric code for verification
   *
   * @returns 6-digit verification code as string
   */
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
