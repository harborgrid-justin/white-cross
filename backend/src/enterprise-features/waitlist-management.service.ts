// Waitlist Management Service
// Handles intelligent appointment waitlist management

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  WaitlistEntry,
  WaitlistPriorityResult,
  WaitlistPriority,
  WaitlistStatus,
} from './enterprise-features-interfaces';
import { WAITLIST_CONSTANTS, ENTERPRISE_CONSTANTS } from './enterprise-features-constants';

import { BaseService } from '../common/base';
@Injectable()
export class WaitlistManagementService extends BaseService {
  private waitlist: WaitlistEntry[] = []; // In production, this would be a database

  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Add a student to the appointment waitlist
   */
  addToWaitlist(
    studentId: string,
    appointmentType: string,
    priority: WaitlistPriority = WaitlistPriority.ROUTINE,
  ): WaitlistEntry {
    try {
      const entry: WaitlistEntry = {
        id: `${ENTERPRISE_CONSTANTS.ID_PREFIXES.WAITLIST}${Date.now()}`,
        studentId,
        appointmentType,
        priority,
        addedAt: new Date(),
        status: WaitlistStatus.WAITING,
      };

      this.waitlist.push(entry);

      this.logInfo('Student added to waitlist', {
        studentId,
        appointmentType,
        priority,
        entryId: entry.id,
      });

      // Emit event for audit logging
      this.eventEmitter.emit('waitlist.entry.added', {
        entry,
        timestamp: new Date(),
      });

      return entry;
    } catch (error) {
      this.logError('Error adding to waitlist', {
        error: error instanceof Error ? error.message : String(error),
        studentId,
        appointmentType,
      });
      throw error;
    }
  }

  /**
   * Attempt to auto-fill an appointment slot from the waitlist
   */
  autoFillFromWaitlist(appointmentSlot: Date, appointmentType: string): boolean {
    try {
      // Find highest priority waiting student for this appointment type
      const eligibleEntries = this.waitlist
        .filter((entry) =>
          entry.appointmentType === appointmentType &&
          entry.status === WaitlistStatus.WAITING,
        )
        .sort((a, b) => {
          // Sort by priority first, then by date added
          if (a.priority !== b.priority) {
            return a.priority === WaitlistPriority.URGENT ? -1 : 1;
          }
          return a.addedAt.getTime() - b.addedAt.getTime();
        });

      if (eligibleEntries.length === 0) {
        this.logInfo('No eligible waitlist entries found', { appointmentType });
        return false;
      }

      const selectedEntry = eligibleEntries[0];

      // In production: Create appointment and notify student
      selectedEntry.status = WaitlistStatus.SCHEDULED;

      this.logInfo('Auto-filling appointment from waitlist', {
        appointmentSlot,
        appointmentType,
        studentId: selectedEntry.studentId,
        entryId: selectedEntry.id,
      });

      // Emit event for notification system
      this.eventEmitter.emit('appointment.auto-filled', {
        entry: selectedEntry,
        appointmentSlot,
        timestamp: new Date(),
      });

      return true;
    } catch (error) {
      this.logError('Error auto-filling from waitlist', {
        error: error instanceof Error ? error.message : String(error),
        appointmentSlot,
        appointmentType,
      });
      throw error;
    }
  }

  /**
   * Get waitlist entries organized by priority
   */
  async getWaitlistByPriority(): Promise<WaitlistPriorityResult> {
    try {
      const high = this.waitlist.filter(entry =>
        entry.priority === WaitlistPriority.URGENT &&
        entry.status === WaitlistStatus.WAITING
      );

      const routine = this.waitlist.filter(entry =>
        entry.priority === WaitlistPriority.ROUTINE &&
        entry.status === WaitlistStatus.WAITING
      );

      const result: WaitlistPriorityResult = {
        high,
        routine,
        totalCount: high.length + routine.length,
      };

      this.logInfo('Retrieved waitlist by priority', {
        highCount: high.length,
        routineCount: routine.length,
        totalCount: result.totalCount,
      });

      return result;
    } catch (error) {
      this.logError('Error getting waitlist by priority', error);
      throw error;
    }
  }

  /**
   * Get waitlist status for a specific student
   */
  async getWaitlistStatus(
    studentId: string,
  ): Promise<{ waitlists: WaitlistEntry[] }> {
    try {
      const studentWaitlists = this.waitlist.filter(entry =>
        entry.studentId === studentId &&
        entry.status === WaitlistStatus.WAITING
      );

      this.logInfo('Getting waitlist status for student', {
        studentId,
        waitlistCount: studentWaitlists.length,
      });

      return { waitlists: studentWaitlists };
    } catch (error) {
      this.logError('Error getting waitlist status', {
        error,
        studentId,
      });
      throw error;
    }
  }

  /**
   * Remove a student from the waitlist
   */
  async removeFromWaitlist(
    entryId: string,
    removedBy: string,
    reason?: string,
  ): Promise<boolean> {
    try {
      const entryIndex = this.waitlist.findIndex(entry => entry.id === entryId);

      if (entryIndex === -1) {
        this.logWarning('Waitlist entry not found', { entryId });
        return false;
      }

      const entry = this.waitlist[entryIndex];
      entry.status = WaitlistStatus.CANCELLED;

      this.logInfo('Student removed from waitlist', {
        entryId,
        studentId: entry.studentId,
        removedBy,
        reason,
      });

      // Emit event for audit logging
      this.eventEmitter.emit('waitlist.entry.removed', {
        entry,
        removedBy,
        reason,
        timestamp: new Date(),
      });

      return true;
    } catch (error) {
      this.logError('Error removing from waitlist', {
        error,
        entryId,
        removedBy,
      });
      throw error;
    }
  }

  /**
   * Get waitlist statistics
   */
  async getWaitlistStatistics(): Promise<{
    totalEntries: number;
    waitingCount: number;
    scheduledCount: number;
    cancelledCount: number;
    averageWaitTime: number;
    priorityBreakdown: { urgent: number; routine: number };
  }> {
    try {
      const stats = {
        totalEntries: this.waitlist.length,
        waitingCount: this.waitlist.filter(e => e.status === WaitlistStatus.WAITING).length,
        scheduledCount: this.waitlist.filter(e => e.status === WaitlistStatus.SCHEDULED).length,
        cancelledCount: this.waitlist.filter(e => e.status === WaitlistStatus.CANCELLED).length,
        averageWaitTime: this.calculateAverageWaitTime(),
        priorityBreakdown: {
          urgent: this.waitlist.filter(e => e.priority === WaitlistPriority.URGENT).length,
          routine: this.waitlist.filter(e => e.priority === WaitlistPriority.ROUTINE).length,
        },
      };

      this.logInfo('Retrieved waitlist statistics', stats);
      return stats;
    } catch (error) {
      this.logError('Error getting waitlist statistics', error);
      throw error;
    }
  }

  /**
   * Clean up expired waitlist entries
   */
  async cleanupExpiredEntries(): Promise<number> {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() - WAITLIST_CONSTANTS.WAITLIST_EXPIRY_DAYS);

      const expiredEntries = this.waitlist.filter(entry =>
        entry.addedAt < expiryDate &&
        entry.status === WaitlistStatus.WAITING
      );

      expiredEntries.forEach(entry => {
        entry.status = WaitlistStatus.CANCELLED;
      });

      this.logInfo('Cleaned up expired waitlist entries', {
        expiredCount: expiredEntries.length,
        expiryDays: WAITLIST_CONSTANTS.WAITLIST_EXPIRY_DAYS,
      });

      return expiredEntries.length;
    } catch (error) {
      this.logError('Error cleaning up expired entries', error);
      throw error;
    }
  }

  /**
   * Calculate average wait time for scheduled entries
   */
  private calculateAverageWaitTime(): number {
    const scheduledEntries = this.waitlist.filter(entry =>
      entry.status === WaitlistStatus.SCHEDULED
    );

    if (scheduledEntries.length === 0) {
      return 0;
    }

    const totalWaitTime = scheduledEntries.reduce((sum, entry) => {
      // In production, calculate based on scheduled time vs added time
      return sum + (24 * 60 * 60 * 1000); // Placeholder: 1 day in milliseconds
    }, 0);

    return totalWaitTime / scheduledEntries.length;
  }
}