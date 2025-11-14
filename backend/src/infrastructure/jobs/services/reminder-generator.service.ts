/**
 * @fileoverview Medication Reminder Generator Service
 * @module infrastructure/jobs/services
 * @description Service for generating medication reminders with optimized SQL queries
 */

import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize, QueryTypes } from 'sequelize';

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

interface MedicationReminderQueryResult {
  student_medication_id: string;
  student_id: string;
  student_name: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  scheduled_hour: number;
  scheduled_minute: number;
  was_administered: boolean;
}

/**
 * Service for generating medication reminders
 */
@Injectable()
export class ReminderGeneratorService extends BaseService {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {
    super("ReminderGeneratorService");
  }

  /**
   * Generate reminders for specific student (used for on-demand requests)
   */
  async generateForStudent(studentId: string, date: Date): Promise<MedicationReminder[]> {
    return this.generateRemindersOptimized(date, undefined, studentId);
  }

  /**
   * OPTIMIZED: Generate reminders using efficient SQL query
   *
   * Instead of:
   * 1. Load all active medications
   * 2. Parse frequency in Node.js
   * 3. Check logs in nested loop
   *
   * We:
   * 1. Use single SQL query to generate all reminders
   * 2. Parse frequency in SQL (faster)
   * 3. Check logs using JOIN (much faster)
   */
  async generateRemindersOptimized(
    date: Date,
    organizationId?: string,
    studentId?: string,
    medicationId?: string,
  ): Promise<MedicationReminder[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Build WHERE clause based on filters
    let whereConditions = `sm.is_active = true
          AND sm.start_date <= :endOfDay
          AND (sm.end_date IS NULL OR sm.end_date >= :startOfDay)`;

    const replacements: Record<string, unknown> = { startOfDay, endOfDay };

    if (organizationId) {
      whereConditions += ` AND s.organization_id = :organizationId`;
      replacements.organizationId = organizationId;
    }

    if (studentId) {
      whereConditions += ` AND s.id = :studentId`;
      replacements.studentId = studentId;
    }

    if (medicationId) {
      whereConditions += ` AND m.id = :medicationId`;
      replacements.medicationId = medicationId;
    }

    // Use raw SQL for maximum performance
    const reminders = await this.sequelize.query<MedicationReminderQueryResult>(
      `
      WITH scheduled_times AS (
        SELECT
          sm.id as student_medication_id,
          s.id as student_id,
          s.first_name || ' ' || s.last_name as student_name,
          m.name as medication_name,
          sm.dosage,
          sm.frequency,
          -- Parse frequency and generate times (using SQL CASE)
          CASE
            WHEN sm.frequency ILIKE '%once%' OR sm.frequency ILIKE '%1x%' OR sm.frequency ILIKE 'daily' THEN ARRAY[9]
            WHEN sm.frequency ILIKE '%twice%' OR sm.frequency ILIKE '%2x%' OR sm.frequency ILIKE '%bid%' THEN ARRAY[9, 21]
            WHEN sm.frequency ILIKE '%three%' OR sm.frequency ILIKE '%3%' OR sm.frequency ILIKE '%tid%' THEN ARRAY[8, 14, 20]
            WHEN sm.frequency ILIKE '%four%' OR sm.frequency ILIKE '%4%' OR sm.frequency ILIKE '%qid%' THEN ARRAY[8, 12, 16, 20]
            WHEN sm.frequency ILIKE '%every 6 hours%' OR sm.frequency ILIKE '%q6h%' THEN ARRAY[6, 12, 18, 0]
            WHEN sm.frequency ILIKE '%every 8 hours%' OR sm.frequency ILIKE '%q8h%' THEN ARRAY[8, 16, 0]
            WHEN sm.frequency ILIKE '%every 12 hours%' OR sm.frequency ILIKE '%q12h%' THEN ARRAY[8, 20]
            ELSE ARRAY[9] -- Default to once daily at 9am
          END as hours
        FROM student_medications sm
        JOIN students s ON sm.student_id = s.id
        JOIN medications m ON sm.medication_id = m.id
        WHERE ${whereConditions}
      ),
      expanded_times AS (
        SELECT
          student_medication_id,
          student_id,
          student_name,
          medication_name,
          dosage,
          frequency,
          unnest(hours) as scheduled_hour,
          0 as scheduled_minute
        FROM scheduled_times
      )
      SELECT
        et.*,
        EXISTS(
          SELECT 1 FROM medication_logs ml
          WHERE ml.student_medication_id = et.student_medication_id
            AND ml.time_given >= :startOfDay
            AND ml.time_given <= :endOfDay
            AND EXTRACT(HOUR FROM ml.time_given) BETWEEN et.scheduled_hour - 1 AND et.scheduled_hour + 1
        ) as was_administered
      FROM expanded_times et
      ORDER BY scheduled_hour, student_name
    `,
      {
        replacements,
        type: QueryTypes.SELECT,
      },
    );

    // Transform to reminder objects
    const now = new Date();

    return reminders.map((r: MedicationReminderQueryResult) => {
      const scheduledTime = new Date(date);
      scheduledTime.setHours(r.scheduled_hour, r.scheduled_minute, 0, 0);

      let status: 'PENDING' | 'COMPLETED' | 'MISSED' = 'PENDING';
      if (r.was_administered) {
        status = 'COMPLETED';
      } else if (scheduledTime < now) {
        status = 'MISSED';
      }

      return {
        id: `${r.student_medication_id}_${date.toISOString().split('T')[0]}_${r.scheduled_hour}`,
        studentMedicationId: r.student_medication_id,
        studentId: r.student_id,
        studentName: r.student_name,
        medicationName: r.medication_name,
        dosage: r.dosage,
        frequency: r.frequency,
        scheduledTime,
        status,
      };
    });
  }
}
