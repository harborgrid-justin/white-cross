/**
 * Contact Validation Service
 *
 * Handles all validation logic for emergency contacts including:
 * - Phone number format validation
 * - Email format validation
 * - Notification channel validation
 * - Contact data integrity checks
 *
 * This service is responsible for ensuring data quality and preventing
 * invalid contact information from being stored in the system.
 */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EmergencyContact } from '@/database/models';

import { BaseService } from '@/common/base';
@Injectable()
export class ContactValidationService extends BaseService {
  constructor() {
    super('ContactValidationService');
  }

  /**
   * Validate phone number format
   * Ensures phone number contains at least 10 digits
   *
   * @param phoneNumber - Raw phone number string
   * @returns Cleaned phone number with digits only
   * @throws BadRequestException if phone number is invalid
   */
  validatePhoneNumber(phoneNumber: string): string {
    const cleanPhone = phoneNumber.replace(/[\s\-().]/g, '');
    if (cleanPhone.length < 10) {
      throw new BadRequestException(
        'Phone number must contain at least 10 digits',
      );
    }
    return cleanPhone;
  }

  /**
   * Validate email format
   * Uses regex pattern to ensure valid email structure
   *
   * @param email - Email address to validate
   * @throws BadRequestException if email format is invalid
   */
  validateEmail(email: string): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }
  }

  /**
   * Validate notification channels
   * Ensures all channels are valid and required contact info is present
   *
   * @param channels - Array of notification channel names
   * @param email - Optional email address
   * @param phoneNumber - Optional phone number
   * @throws BadRequestException if channels are invalid or missing required info
   */
  validateNotificationChannels(
    channels: string[],
    email?: string,
    phoneNumber?: string,
  ): void {
    const validChannels = ['sms', 'email', 'voice'];

    // Validate each channel is in allowed list
    for (const channel of channels) {
      if (!validChannels.includes(channel)) {
        throw new BadRequestException(
          `Invalid notification channel: ${channel}. Must be one of: ${validChannels.join(', ')}`,
        );
      }
    }

    // Ensure email channel has email address
    if (channels.includes('email') && !email) {
      throw new BadRequestException(
        'Email address is required when email is selected as a notification channel',
      );
    }

    // Ensure SMS/voice channels have phone number
    if (
      (channels.includes('sms') || channels.includes('voice')) &&
      !phoneNumber
    ) {
      throw new BadRequestException(
        'Phone number is required for SMS or voice notification channels',
      );
    }
  }

  /**
   * Validate complete contact data for creation
   * Performs all validation checks on contact creation data
   *
   * @param data - Contact creation data
   * @throws BadRequestException if any validation fails
   */
  validateContactCreation(data: {
    phoneNumber: string;
    email?: string;
    notificationChannels?: string[];
  }): void {
    // Validate phone number
    this.validatePhoneNumber(data.phoneNumber);

    // Validate email if provided
    if (data.email) {
      this.validateEmail(data.email);
    }

    // Validate notification channels if provided
    if (data.notificationChannels) {
      this.validateNotificationChannels(
        data.notificationChannels,
        data.email,
        data.phoneNumber,
      );
    }

    this.logDebug('Contact creation data validation passed');
  }

  /**
   * Validate contact data for updates
   * Handles partial updates and combines with existing data
   *
   * @param updateData - Partial update data
   * @param existingContact - Current contact data
   * @throws BadRequestException if any validation fails
   */
  validateContactUpdate(
    updateData: {
      phoneNumber?: string;
      email?: string;
      notificationChannels?: string[];
    },
    existingContact: EmergencyContact,
  ): void {
    // Validate phone number if being updated
    if (updateData.phoneNumber) {
      this.validatePhoneNumber(updateData.phoneNumber);
    }

    // Validate email if being updated
    if (updateData.email) {
      this.validateEmail(updateData.email);
    }

    // Validate notification channels if being updated
    if (updateData.notificationChannels) {
      // Determine final email value (update or existing)
      const finalEmail =
        updateData.email !== undefined
          ? updateData.email
          : existingContact.email;

      // Determine final phone value (update or existing)
      const finalPhone =
        updateData.phoneNumber !== undefined
          ? updateData.phoneNumber
          : existingContact.phoneNumber;

      this.validateNotificationChannels(
        updateData.notificationChannels,
        finalEmail,
        finalPhone,
      );
    }

    this.logDebug('Contact update data validation passed');
  }
}
