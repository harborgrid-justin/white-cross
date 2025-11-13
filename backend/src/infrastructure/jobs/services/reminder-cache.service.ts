/**
 * @fileoverview Medication Reminder Cache Service
 * @module infrastructure/jobs/services
 * @description Service for caching medication reminders with TTL and invalidation
 */

import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from "../../common/base";
import { LoggerService } from '../../shared/logging/logger.service';
import { CacheService } from '../../../shared/cache/cache.service';

interface MedicationReminder {
  id: string;
  studentMedicationId: string;
  studentId: string;
  studentName: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  scheduledTime: Date;
  status: 'PENDING' | 'COMPLETED' | 'MISSED';
}

/**
 * Cache configuration constants
 */
const CACHE_TTL = 3600000; // 1 hour in milliseconds
const CACHE_TAG_PREFIX = 'reminders';

/**
 * Service for caching medication reminders
 */
@Injectable()
export class ReminderCacheService extends BaseService {
  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly cacheService: CacheService
  ) {
    super({
      serviceName: 'ReminderCacheService',
      logger,
      enableAuditLogging: true,
    });
  }

  /**
   * Cache medication reminders with appropriate TTL and tags
   */
  cacheReminders(
    reminders: MedicationReminder[],
    date: Date,
    organizationId?: string,
    studentId?: string,
  ): void {
    const cacheKey = this.buildCacheKey(date, organizationId, studentId);
    const tags = this.buildCacheTags(organizationId, studentId, reminders);

    this.cacheService.set(cacheKey, reminders, CACHE_TTL, tags);
    this.logDebug(`Cached ${reminders.length} reminders with key: ${cacheKey}`);
  }

  /**
   * Get cached reminders
   */
  getCachedReminders(
    date: Date,
    organizationId?: string,
    studentId?: string,
  ): MedicationReminder[] | undefined {
    const cacheKey = this.buildCacheKey(date, organizationId, studentId);
    const cached = this.cacheService.get<MedicationReminder[]>(cacheKey);
    if (cached) {
      this.logDebug(`Returning cached reminders for ${cacheKey}`);
      return cached;
    }
    return undefined;
  }

  /**
   * Build cache key for reminders
   */
  private buildCacheKey(date: Date, organizationId?: string, studentId?: string): string {
    const dateKey = date.toISOString().split('T')[0];
    const parts = [CACHE_TAG_PREFIX, dateKey];

    if (organizationId) {
      parts.push(`org:${organizationId}`);
    }
    if (studentId) {
      parts.push(`student:${studentId}`);
    }

    return parts.join(':');
  }

  /**
   * Build cache tags for targeted invalidation
   */
  private buildCacheTags(
    organizationId?: string,
    studentId?: string,
    reminders?: MedicationReminder[],
  ): string[] {
    const tags = [CACHE_TAG_PREFIX, 'medication'];

    if (organizationId) {
      tags.push(`org:${organizationId}`);
    }
    if (studentId) {
      tags.push(`student:${studentId}`);
    }

    // Add unique student IDs from reminders for granular invalidation
    if (reminders && reminders.length > 0) {
      const uniqueStudentIds = new Set(reminders.map((r) => `student:${r.studentId}`));
      tags.push(...Array.from(uniqueStudentIds));
    }

    return tags;
  }

  /**
   * Invalidate cached reminders for a student
   * Call this when medications are updated
   */
  async invalidateStudentReminders(studentId: string): Promise<void> {
    const tag = `student:${studentId}`;
    const count = this.cacheService.invalidateByTag(tag);
    this.logDebug(`Invalidated ${count} cached reminder entries for student ${studentId}`);
  }

  /**
   * Invalidate cached reminders for an organization
   * Call this when organization-wide medication changes occur
   */
  async invalidateOrganizationReminders(organizationId: string): Promise<void> {
    const tag = `org:${organizationId}`;
    const count = this.cacheService.invalidateByTag(tag);
    this.logDebug(
      `Invalidated ${count} cached reminder entries for organization ${organizationId}`,
    );
  }
}
