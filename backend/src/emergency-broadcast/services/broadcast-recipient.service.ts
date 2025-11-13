/**
 * @fileoverview Emergency Broadcast Recipient Service
 * @module emergency-broadcast/services
 * @description Handles recipient retrieval and management for emergency broadcasts
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { StudentRepository } from '../../database/repositories/impl/student.repository';
import { EmergencyBroadcastRepository } from '../../database/repositories/impl/emergency-broadcast.repository';

import { BaseService } from '../../common/base';
export interface BroadcastRecipient {
  id: string;
  type: 'STUDENT' | 'PARENT' | 'STAFF';
  name: string;
  phone?: string;
  email?: string;
}

interface BroadcastData {
  schoolId?: string;
  gradeLevel?: string;
  classId?: string;
}

interface StudentData {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
}

interface QueryWhereClause {
  schoolId?: string;
  gradeLevel?: string;
  classId?: string;
}

@Injectable()
export class BroadcastRecipientService extends BaseService {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly broadcastRepository: EmergencyBroadcastRepository,
  ) {}

  /**
   * Get recipients for broadcast based on audience criteria
   */
  async getRecipients(broadcastId: string): Promise<BroadcastRecipient[]> {
    try {
      this.logInfo('Retrieving recipients for broadcast', { broadcastId });

      // Get broadcast details to determine audience
      const broadcast = await this.broadcastRepository.findById(broadcastId);
      if (!broadcast) {
        throw new NotFoundException(`Broadcast ${broadcastId} not found`);
      }

      const recipients: BroadcastRecipient[] = [];

      // Get students based on filtering criteria
      const students = await this.getStudentRecipients(broadcast as BroadcastData);
      recipients.push(...students);

      // TODO: Add parent/guardian recipients
      // const parents = await this.getParentRecipients(broadcast, students);
      // recipients.push(...parents);

      // TODO: Add staff recipients
      // const staff = await this.getStaffRecipients(broadcast);
      // recipients.push(...staff);

      this.logInfo(`Found ${recipients.length} recipients for broadcast ${broadcastId}`);

      return recipients;
    } catch (error) {
      this.logError('Error retrieving recipients:', error);
      return [];
    }
  }

  /**
   * Get student recipients based on broadcast criteria
   */
  private async getStudentRecipients(broadcast: BroadcastData): Promise<BroadcastRecipient[]> {
    const whereClause: QueryWhereClause = {};

    // Filter by school if specified
    if (broadcast.schoolId) {
      whereClause.schoolId = broadcast.schoolId;
    }

    // Filter by grade if specified
    if (broadcast.gradeLevel) {
      whereClause.gradeLevel = broadcast.gradeLevel;
    }

    // Filter by class if specified
    if (broadcast.classId) {
      whereClause.classId = broadcast.classId;
    }

    // Query students matching criteria
    const students = await this.studentRepository.findMany({
      where: whereClause,
      pagination: { page: 1, limit: 10000 }, // Large limit for emergency broadcasts
    });

    // Map to recipient format with contact information
    return students.data.map((student: StudentData) => ({
      id: student.id,
      type: 'STUDENT' as const,
      name: `${student.firstName} ${student.lastName}`,
      phone: student.phone,
      email: student.email,
    }));
  }

  /**
   * Get parent/guardian recipients for students
   */
  private getParentRecipients(): Promise<BroadcastRecipient[]> {
    // TODO: Implement parent/guardian recipient retrieval
    // This would query emergency contacts or parent tables
    // For now, return empty array
    return Promise.resolve<BroadcastRecipient[]>([]);
  }

  /**
   * Get staff recipients based on broadcast criteria
   */
  private getStaffRecipients(): Promise<BroadcastRecipient[]> {
    // TODO: Implement staff recipient retrieval
    // This would query staff/employee tables based on:
    // - School/campus assignment
    // - Department
    // - Role (teachers, admin, support staff)
    // For now, return empty array
    return Promise.resolve<BroadcastRecipient[]>([]);
  }

  /**
   * Validate recipient has required contact information for channels
   */
  validateRecipientForChannels(
    recipient: BroadcastRecipient,
    channels: string[],
  ): { isValid: boolean; missingChannels: string[] } {
    const missingChannels: string[] = [];

    for (const channel of channels) {
      switch (channel.toLowerCase()) {
        case 'sms':
        case 'voice':
          if (!recipient.phone) {
            missingChannels.push(channel);
          }
          break;
        case 'email':
          if (!recipient.email) {
            missingChannels.push(channel);
          }
          break;
        case 'push':
          // Push notifications would require device tokens
          // This would be checked against a device registration table
          break;
      }
    }

    return {
      isValid: missingChannels.length === 0,
      missingChannels,
    };
  }

  /**
   * Filter recipients who have valid contact info for at least one channel
   */
  filterValidRecipients(
    recipients: BroadcastRecipient[],
    channels: string[],
  ): {
    valid: BroadcastRecipient[];
    invalid: Array<{ recipient: BroadcastRecipient; missingChannels: string[] }>;
  } {
    const valid: BroadcastRecipient[] = [];
    const invalid: Array<{ recipient: BroadcastRecipient; missingChannels: string[] }> = [];

    for (const recipient of recipients) {
      const validation = this.validateRecipientForChannels(recipient, channels);
      if (validation.isValid || validation.missingChannels.length < channels.length) {
        // Include if valid for at least one channel
        valid.push(recipient);
      } else {
        // Exclude if invalid for all channels
        invalid.push({
          recipient,
          missingChannels: validation.missingChannels,
        });
      }
    }

    if (invalid.length > 0) {
      this.logWarning(`${invalid.length} recipients excluded due to missing contact information`);
    }

    return { valid, invalid };
  }

  /**
   * Get recipient statistics for reporting
   */
  getRecipientStats(recipients: BroadcastRecipient[]): {
    total: number;
    byType: Record<string, number>;
    withPhone: number;
    withEmail: number;
    withBoth: number;
  } {
    const stats = {
      total: recipients.length,
      byType: {} as Record<string, number>,
      withPhone: 0,
      withEmail: 0,
      withBoth: 0,
    };

    for (const recipient of recipients) {
      // Count by type
      stats.byType[recipient.type] = (stats.byType[recipient.type] || 0) + 1;

      // Count contact methods
      const hasPhone = !!recipient.phone;
      const hasEmail = !!recipient.email;

      if (hasPhone) stats.withPhone++;
      if (hasEmail) stats.withEmail++;
      if (hasPhone && hasEmail) stats.withBoth++;
    }

    return stats;
  }
}
