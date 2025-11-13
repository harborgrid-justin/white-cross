import { Injectable, Logger } from '@nestjs/common';
import { createHmac } from 'crypto';
import { BaseService } from '../../common/base';
import {
  HealthRecordUpdatedPayload,
  isHealthRecordUpdatedPayload,
  isStudentCreatedPayload,
  isStudentUpdatedPayload,
  StudentCreatedPayload,
  StudentUpdatedPayload,
  WebhookPayload,
} from '../types/webhook.types';

@Injectable()
export class WebhookHandlerService extends BaseService {
  /**
   * Validate webhook signature
   */
  validateSignature(
    payload: string,
    signature: string,
    secret: string,
  ): boolean {
    try {
      const computedSignature = createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      return signature === computedSignature;
    } catch (error) {
      this.logError('Error validating webhook signature', error);
      return false;
    }
  }

  /**
   * Process webhook event
   */
  async processWebhookEvent(
    integrationId: string,
    eventType: string,
    payload: WebhookPayload,
  ): Promise<void> {
    this.logInfo(
      `Processing webhook event: ${eventType} for integration ${integrationId}`,
    );

    // Implementation would handle different event types
    // For example: student.created, student.updated, health_record.updated, etc.

    switch (eventType) {
      case 'student.created':
        if (isStudentCreatedPayload(payload)) {
          await this.handleStudentCreated(integrationId, payload);
        }
        break;
      case 'student.updated':
        if (isStudentUpdatedPayload(payload)) {
          await this.handleStudentUpdated(integrationId, payload);
        }
        break;
      case 'health_record.updated':
        if (isHealthRecordUpdatedPayload(payload)) {
          await this.handleHealthRecordUpdated(integrationId, payload);
        }
        break;
      default:
        this.logWarning(`Unknown webhook event type: ${eventType}`);
    }
  }

  private async handleStudentCreated(
    integrationId: string,
    _payload: StudentCreatedPayload,
  ): Promise<void> {
    this.logInfo(`Handling student created event for ${integrationId}`);
    // Implementation would create or update student record
  }

  private async handleStudentUpdated(
    integrationId: string,
    _payload: StudentUpdatedPayload,
  ): Promise<void> {
    this.logInfo(`Handling student updated event for ${integrationId}`);
    // Implementation would update student record
  }

  private async handleHealthRecordUpdated(
    integrationId: string,
    _payload: HealthRecordUpdatedPayload,
  ): Promise<void> {
    this.logInfo(
      `Handling health record updated event for ${integrationId}`,
    );
    // Implementation would update health record
  }
}
