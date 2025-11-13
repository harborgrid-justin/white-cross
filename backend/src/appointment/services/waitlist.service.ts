/**
 * @fileoverview Waitlist Service
 * @module appointment/services/waitlist.service
 * @description Business logic for appointment waitlist management
 */

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { BaseService } from '@/common/base';
import {
  AppointmentWaitlist,
  WaitlistPriority,
  WaitlistStatus,
} from '@/database/models';

/**
 * Waitlist Service
 *
 * Handles waitlist management operations:
 * - Add to waitlist
 * - Get waitlist
 * - Update priority
 * - Get position
 * - Notify entry
 * - Remove from waitlist
 */
@Injectable()
export class WaitlistService extends BaseService {
  constructor(
    @InjectModel(AppointmentWaitlist)
    private readonly waitlistModel: typeof AppointmentWaitlist,
  ) {}

  /**
   * Add student to waitlist
   */
  async addToWaitlist(data: {
    studentId: string;
    nurseId?: string;
    appointmentType: any;
    preferredDate?: Date;
    duration?: number;
    priority?: WaitlistPriority;
    reason: string;
    notes?: string;
  }) {
    this.logInfo(`Adding student ${data.studentId} to waitlist`);

    try {
      // Set expiration to 48 hours from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48);

      return await this.waitlistModel.create({
        id: uuidv4(),
        studentId: data.studentId,
        nurseId: data.nurseId,
        appointmentType: data.appointmentType,
        preferredDate: data.preferredDate,
        duration: data.duration || 30,
        priority: data.priority || WaitlistPriority.NORMAL,
        reason: data.reason,
        notes: data.notes,
        status: WaitlistStatus.WAITING,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      this.logError(`Error adding to waitlist: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to add to waitlist');
    }
  }

  /**
   * Get waitlist with filtering
   */
  async getWaitlist(filters: any = {}) {
    this.logInfo('Fetching waitlist');

    try {
      const whereClause: any = {};

      if (filters.nurseId) {
        whereClause.nurseId = filters.nurseId;
      }

      if (filters.studentId) {
        whereClause.studentId = filters.studentId;
      }

      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.appointmentType) {
        whereClause.appointmentType = filters.appointmentType;
      }

      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const offset = (page - 1) * limit;

      const { rows, count } = await this.waitlistModel.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [
          ['priority', 'DESC'],
          ['createdAt', 'ASC'],
        ],
      });

      return {
        data: rows,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
          hasNext: page < Math.ceil(count / limit),
          hasPrevious: page > 1,
        },
      };
    } catch (error) {
      this.logError(`Error fetching waitlist: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to fetch waitlist');
    }
  }

  /**
   * Update waitlist entry priority
   */
  async updateWaitlistPriority(id: string, priority: WaitlistPriority) {
    this.logInfo(`Updating waitlist priority for entry: ${id}`);

    const entry = await this.waitlistModel.findByPk(id);
    if (!entry) {
      throw new NotFoundException(`Waitlist entry with ID ${id} not found`);
    }

    await entry.update({ priority });
    return entry;
  }

  /**
   * Get waitlist position
   */
  async getWaitlistPosition(id: string) {
    this.logInfo(`Getting waitlist position for entry: ${id}`);

    const entry = await this.waitlistModel.findByPk(id);
    if (!entry) {
      throw new NotFoundException(`Waitlist entry with ID ${id} not found`);
    }

    // Count entries with higher priority or same priority but created earlier
    const position = await this.waitlistModel.count({
      where: {
        nurseId: entry.nurseId,
        status: WaitlistStatus.WAITING,
        [Op.or]: [
          { priority: { [Op.gt]: entry.priority } },
          {
            [Op.and]: [{ priority: entry.priority }, { createdAt: { [Op.lt]: entry.createdAt } }],
          },
        ],
      },
    });

    return { position: position + 1 }; // 1-based position
  }

  /**
   * Notify waitlist entry
   */
  async notifyWaitlistEntry(id: string, message?: string) {
    this.logInfo(`Notifying waitlist entry: ${id}`);

    const entry = await this.waitlistModel.findByPk(id);
    if (!entry) {
      throw new NotFoundException(`Waitlist entry with ID ${id} not found`);
    }

    // In a real implementation, this would send notifications
    // For now, just mark as notified
    await entry.update({
      notes: message
        ? `${entry.notes || ''}\nNotification sent: ${message}`
        : `${entry.notes || ''}\nNotification sent`,
    });

    return { success: true, message: 'Notification sent successfully' };
  }

  /**
   * Remove from waitlist
   */
  async removeFromWaitlist(id: string, reason?: string) {
    this.logInfo(`Removing from waitlist: ${id}`);

    const entry = await this.waitlistModel.findByPk(id);
    if (!entry) {
      throw new NotFoundException(`Waitlist entry with ID ${id} not found`);
    }

    await entry.update({
      status: WaitlistStatus.CANCELLED,
      notes: reason
        ? `${entry.notes || ''}\nRemoved: ${reason}`
        : `${entry.notes || ''}\nRemoved from waitlist`,
    });

    return entry;
  }

  /**
   * Clean up expired waitlist entries
   * Called periodically to mark expired entries
   */
  async cleanupExpiredEntries(): Promise<void> {
    try {
      const now = new Date();
      const result = await this.waitlistModel.update(
        { status: WaitlistStatus.EXPIRED },
        {
          where: {
            expiresAt: { [Op.lt]: now },
            status: WaitlistStatus.WAITING,
          },
        },
      );

      if (result[0] > 0) {
        this.logInfo(`Cleaned up ${result[0]} expired waitlist entries`);
      }
    } catch (error) {
      this.logError(
        `Error cleaning up expired waitlist entries: ${error.message}`,
        error.stack,
      );
    }
  }
}
