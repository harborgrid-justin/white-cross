/**
 * @fileoverview Emergency Broadcast Priority Service
 * @module emergency-broadcast/services
 * @description Handles priority determination and channel selection for emergency broadcasts
 */

import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../common/base';
import {
  EmergencyType,
  EmergencyPriority,
  CommunicationChannel,
} from '../emergency-broadcast.enums';

@Injectable()
export class BroadcastPriorityService extends BaseService {
  /**
   * Determine priority from emergency type
   */
  determinePriority(type: EmergencyType): EmergencyPriority {
    const criticalTypes = [
      EmergencyType.ACTIVE_THREAT,
      EmergencyType.MEDICAL_EMERGENCY,
      EmergencyType.FIRE,
      EmergencyType.NATURAL_DISASTER,
    ];

    const highTypes = [
      EmergencyType.LOCKDOWN,
      EmergencyType.EVACUATION,
      EmergencyType.SHELTER_IN_PLACE,
    ];

    const mediumTypes = [
      EmergencyType.WEATHER_ALERT,
      EmergencyType.TRANSPORTATION,
      EmergencyType.FACILITY_ISSUE,
    ];

    if (criticalTypes.includes(type)) return EmergencyPriority.CRITICAL;
    if (highTypes.includes(type)) return EmergencyPriority.HIGH;
    if (mediumTypes.includes(type)) return EmergencyPriority.MEDIUM;
    return EmergencyPriority.LOW;
  }

  /**
   * Determine delivery channels based on priority
   */
  getDeliveryChannels(priority: EmergencyPriority): CommunicationChannel[] {
    switch (priority) {
      case EmergencyPriority.CRITICAL:
        return [
          CommunicationChannel.SMS,
          CommunicationChannel.EMAIL,
          CommunicationChannel.PUSH,
          CommunicationChannel.VOICE,
        ];

      case EmergencyPriority.HIGH:
        return [CommunicationChannel.SMS, CommunicationChannel.EMAIL, CommunicationChannel.PUSH];

      case EmergencyPriority.MEDIUM:
        return [CommunicationChannel.EMAIL, CommunicationChannel.PUSH];

      case EmergencyPriority.LOW:
        return [CommunicationChannel.EMAIL];
    }
  }

  /**
   * Get default expiration based on priority
   */
  getDefaultExpiration(priority: EmergencyPriority): Date {
    const hours = priority === EmergencyPriority.CRITICAL ? 1 : 24;
    return new Date(Date.now() + hours * 60 * 60 * 1000);
  }

  /**
   * Validate priority and channel combination
   */
  validatePriorityChannels(
    priority: EmergencyPriority,
    channels: CommunicationChannel[],
  ): { isValid: boolean; warnings: string[] } {
    const warnings: string[] = [];
    const recommendedChannels = this.getDeliveryChannels(priority);

    // Check if critical priority has sufficient channels
    if (priority === EmergencyPriority.CRITICAL) {
      if (!channels.includes(CommunicationChannel.SMS)) {
        warnings.push('Critical broadcasts should include SMS for immediate delivery');
      }
      if (!channels.includes(CommunicationChannel.VOICE)) {
        warnings.push('Critical broadcasts should include voice calls for maximum impact');
      }
    }

    // Check for missing recommended channels
    const missingRecommended = recommendedChannels.filter((channel) => !channels.includes(channel));
    if (missingRecommended.length > 0) {
      warnings.push(
        `Missing recommended channels for ${priority} priority: ${missingRecommended.join(', ')}`,
      );
    }

    // Check for excessive channels for low priority
    if (priority === EmergencyPriority.LOW && channels.length > 2) {
      warnings.push('Low priority broadcasts typically use only email');
    }

    return {
      isValid: warnings.length === 0,
      warnings,
    };
  }
}
