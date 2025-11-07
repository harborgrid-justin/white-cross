/**
 * @fileoverview Twilio SMS Provider
 * @module infrastructure/sms/providers/twilio.provider
 * @description Twilio integration for SMS sending with delivery tracking
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Twilio from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import {
  SmsDeliveryResultDto,
  SmsDeliveryStatus,
} from '../dto/sms-queue-job.dto';

/**
 * Twilio-specific error codes
 */
export enum TwilioErrorCode {
  INVALID_PHONE_NUMBER = '21211',
  UNVERIFIED_NUMBER = '21408',
  INVALID_FROM_NUMBER = '21606',
  RATE_LIMIT_EXCEEDED = '20429',
  INSUFFICIENT_FUNDS = '20003',
  UNREACHABLE_CARRIER = '30003',
  UNREACHABLE_DESTINATION = '30005',
  LANDLINE_UNREACHABLE = '30006',
  SPAM_DETECTED = '30007',
  UNKNOWN_ERROR = '30008',
}

/**
 * Twilio Provider configuration
 */
interface TwilioConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
  statusCallbackUrl?: string;
}

/**
 * Twilio SMS Provider
 * Handles SMS sending through Twilio API with comprehensive error handling
 */
@Injectable()
export class TwilioProvider {
  private readonly logger = new Logger(TwilioProvider.name);
  private readonly client: Twilio.Twilio | null = null;
  private readonly config: TwilioConfig;
  private readonly isConfigured: boolean;

  // Twilio pricing (approximate, USD per segment)
  private readonly COST_PER_SEGMENT_US = 0.0079;
  private readonly COST_PER_SEGMENT_CA = 0.0075;
  private readonly COST_PER_SEGMENT_INTL = 0.045;

  constructor(private readonly configService: ConfigService) {
    // Load Twilio configuration from environment
    this.config = {
      accountSid: this.configService.get<string>('TWILIO_ACCOUNT_SID', ''),
      authToken: this.configService.get<string>('TWILIO_AUTH_TOKEN', ''),
      fromNumber: this.configService.get<string>('TWILIO_FROM_NUMBER', ''),
      statusCallbackUrl: this.configService.get<string>(
        'TWILIO_STATUS_CALLBACK_URL',
      ),
    };

    // Check if Twilio is properly configured
    this.isConfigured = !!(
      this.config.accountSid &&
      this.config.authToken &&
      this.config.fromNumber
    );

    if (this.isConfigured) {
      try {
        this.client = Twilio(this.config.accountSid, this.config.authToken);
        this.logger.log('Twilio provider initialized successfully');
      } catch (error) {
        this.logger.error(
          `Failed to initialize Twilio client: ${error.message}`,
        );
      }
    } else {
      this.logger.warn(
        'Twilio provider not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER environment variables.',
      );
    }
  }

  /**
   * Check if Twilio is configured and ready
   *
   * @returns True if configured
   */
  isReady(): boolean {
    return this.isConfigured && this.client !== null;
  }

  /**
   * Send SMS via Twilio
   *
   * @param to - Recipient phone number (E.164 format)
   * @param message - Message content
   * @param metadata - Optional metadata for tracking
   * @returns Delivery result
   * @throws Error if Twilio is not configured or sending fails
   *
   * @example
   * ```typescript
   * const result = await twilioProvider.sendSms('+15551234567', 'Test message');
   * console.log(`Message ID: ${result.messageId}, Cost: $${result.cost}`);
   * ```
   */
  async sendSms(
    to: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): Promise<SmsDeliveryResultDto> {
    if (!this.isReady()) {
      throw new Error('Twilio provider is not configured');
    }

    const startTime = Date.now();

    try {
      this.logger.debug(`Sending SMS to ${to} via Twilio`);

      // Prepare message options
      const messageOptions: any = {
        body: message,
        from: this.config.fromNumber,
        to: to,
      };

      // Add status callback if configured
      if (this.config.statusCallbackUrl) {
        messageOptions.statusCallback = this.config.statusCallbackUrl;
      }

      // Send SMS via Twilio
      const twilioMessage: MessageInstance =
        await this.client!.messages.create(messageOptions);

      // Calculate cost based on destination
      const segmentCount = twilioMessage.numSegments
        ? parseInt(twilioMessage.numSegments)
        : 1;
      const cost = this.calculateCost(to, segmentCount);

      const result: SmsDeliveryResultDto = {
        status: this.mapTwilioStatus(twilioMessage.status),
        messageId: twilioMessage.sid,
        to: twilioMessage.to,
        segmentCount: segmentCount,
        cost: cost,
        timestamp: new Date().toISOString(),
      };

      const duration = Date.now() - startTime;
      this.logger.log(
        `SMS sent successfully to ${to} (${segmentCount} segments, $${cost.toFixed(4)}, ${duration}ms)`,
      );

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Twilio SMS failed to ${to} (${duration}ms): ${error.message}`,
      );

      return {
        status: SmsDeliveryStatus.FAILED,
        to: to,
        segmentCount: 1,
        cost: 0,
        timestamp: new Date().toISOString(),
        error: error.message,
        errorCode: error.code || TwilioErrorCode.UNKNOWN_ERROR,
      };
    }
  }

  /**
   * Get message delivery status from Twilio
   *
   * @param messageId - Twilio message SID
   * @returns Updated delivery result
   * @throws Error if message not found
   */
  async getMessageStatus(messageId: string): Promise<SmsDeliveryResultDto> {
    if (!this.isReady()) {
      throw new Error('Twilio provider is not configured');
    }

    try {
      const message = await this.client!.messages(messageId).fetch();

      const segmentCount = message.numSegments
        ? parseInt(message.numSegments)
        : 1;
      const cost = this.calculateCost(message.to, segmentCount);

      return {
        status: this.mapTwilioStatus(message.status),
        messageId: message.sid,
        to: message.to,
        segmentCount: segmentCount,
        cost: cost,
        timestamp:
          message.dateUpdated?.toISOString() || new Date().toISOString(),
        error: message.errorMessage || undefined,
        errorCode: message.errorCode?.toString() || undefined,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch message status for ${messageId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Handle delivery status webhook from Twilio
   *
   * @param webhookData - Webhook payload from Twilio
   * @returns Parsed delivery result
   */
  async handleStatusWebhook(webhookData: any): Promise<SmsDeliveryResultDto> {
    try {
      const segmentCount = parseInt(webhookData.NumSegments) || 1;
      const cost = this.calculateCost(webhookData.To, segmentCount);

      return {
        status: this.mapTwilioStatus(
          webhookData.MessageStatus || webhookData.SmsStatus,
        ),
        messageId: webhookData.MessageSid || webhookData.SmsSid,
        to: webhookData.To,
        segmentCount: segmentCount,
        cost: cost,
        timestamp: new Date().toISOString(),
        error: webhookData.ErrorMessage || undefined,
        errorCode: webhookData.ErrorCode || undefined,
      };
    } catch (error) {
      this.logger.error(`Failed to process Twilio webhook: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if error is retryable
   *
   * @param errorCode - Twilio error code
   * @returns True if the error is transient and retryable
   */
  isRetryableError(errorCode: string): boolean {
    const retryableCodes = [
      TwilioErrorCode.RATE_LIMIT_EXCEEDED,
      TwilioErrorCode.UNREACHABLE_CARRIER,
      TwilioErrorCode.UNKNOWN_ERROR,
    ];

    return retryableCodes.includes(errorCode as TwilioErrorCode);
  }

  /**
   * Get recommended retry delay based on error
   *
   * @param errorCode - Twilio error code
   * @param attemptNumber - Current retry attempt
   * @returns Delay in milliseconds
   */
  getRetryDelay(errorCode: string, attemptNumber: number): number {
    // Rate limit errors need longer delays
    if (errorCode === TwilioErrorCode.RATE_LIMIT_EXCEEDED) {
      return Math.min(60000 * attemptNumber, 300000); // 1-5 minutes
    }

    // Exponential backoff for other errors
    return Math.min(1000 * Math.pow(2, attemptNumber), 30000); // 2s, 4s, 8s, 16s, max 30s
  }

  // ==================== Private Helper Methods ====================

  /**
   * Map Twilio message status to our internal status enum
   *
   * @param twilioStatus - Twilio message status
   * @returns Our internal SmsDeliveryStatus
   * @private
   */
  private mapTwilioStatus(twilioStatus: string): SmsDeliveryStatus {
    switch (twilioStatus?.toLowerCase()) {
      case 'queued':
      case 'accepted':
        return SmsDeliveryStatus.QUEUED;
      case 'sending':
      case 'sent':
        return SmsDeliveryStatus.SENT;
      case 'delivered':
        return SmsDeliveryStatus.DELIVERED;
      case 'failed':
        return SmsDeliveryStatus.FAILED;
      case 'undelivered':
        return SmsDeliveryStatus.UNDELIVERED;
      default:
        return SmsDeliveryStatus.QUEUED;
    }
  }

  /**
   * Calculate SMS cost based on destination and segment count
   *
   * @param to - Destination phone number
   * @param segmentCount - Number of message segments
   * @returns Estimated cost in USD
   * @private
   */
  private calculateCost(to: string, segmentCount: number): number {
    let costPerSegment = this.COST_PER_SEGMENT_INTL;

    if (to.startsWith('+1')) {
      // US/Canada
      costPerSegment = to.substring(2, 5).startsWith('1') // Canadian area codes start with 1
        ? this.COST_PER_SEGMENT_CA
        : this.COST_PER_SEGMENT_US;
    }

    return costPerSegment * segmentCount;
  }
}
