/**
 * Reminder Generator Service
 *
 * Handles the generation of medication reminders using optimized SQL queries.
 * Extracted from medication-reminder.processor.ts for better separation of concerns.
 *
 * Performance Benefits:
 * - Single SQL query generates all reminders
 * - Frequency parsing done in SQL (faster than Node.js)
 * - Administration checks via JOIN (much faster than nested loops)
 */
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize, QueryTypes } from 'sequelize';
import {
  MedicationReminder,
  MedicationReminderQueryResult,
  ReminderQueryReplacements,
} from '../interfaces/medication-reminder.interface';

@Injectable()
export class ReminderGeneratorService {
  private readonly logger = new Logger(ReminderGeneratorService.name);

  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  /**
   * Generate medication reminders using optimized SQL query
   *
   * @param date - Date to generate reminders for
   * @param organizationId - Optional organization filter
   * @param studentId - Optional student filter
   * @param medicationId - Optional medication filter
   * @returns Array of medication reminders with status
   */
  async generateReminders(
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
    const whereConditions = this.buildWhereConditions(
      organizationId,
      studentId,
      medicationId,
    );

    const replacements: ReminderQueryReplacements = {
      startOfDay,
      endOfDay,
      organizationId,
      studentId,
      medicationId,
    };

    // Execute optimized SQL query
    const queryResults = await this.executeReminderQuery(whereConditions, replacements);

    // Transform query results to reminder objects
    return this.transformQueryResults(queryResults, date);
  }

  /**
   * Generate reminders for a specific student
   * Convenience method for on-demand student-specific requests
   *
   * @param studentId - Student ID
   * @param date - Date to generate reminders for
   * @returns Array of medication reminders for the student
   */
  async generateForStudent(studentId: string, date: Date): Promise<MedicationReminder[]> {
    return this.generateReminders(date, undefined, studentId);
  }

  /**
   * Build WHERE clause conditions based on provided filters
   *
   * @param organizationId - Optional organization filter
   * @param studentId - Optional student filter
   * @param medicationId - Optional medication filter
   * @returns SQL WHERE clause string
   * @private
   */
  private buildWhereConditions(
    organizationId?: string,
    studentId?: string,
    medicationId?: string,
  ): string {
    let conditions = `sm.is_active = true
          AND sm.start_date <= :endOfDay
          AND (sm.end_date IS NULL OR sm.end_date >= :startOfDay)`;

    if (organizationId) {
      conditions += ` AND s.organization_id = :organizationId`;
    }

    if (studentId) {
      conditions += ` AND s.id = :studentId`;
    }

    if (medicationId) {
      conditions += ` AND m.id = :medicationId`;
    }

    return conditions;
  }

  /**
   * Execute the optimized SQL query to fetch reminder data
   *
   * Query Strategy:
   * 1. Parse medication frequency in SQL (CASE statement)
   * 2. Generate scheduled times as array
   * 3. Unnest to create one row per scheduled time
   * 4. Join with medication logs to check if administered
   *
   * @param whereConditions - WHERE clause conditions
   * @param replacements - Query parameter replacements
   * @returns Array of query results
   * @private
   */
  private async executeReminderQuery(
    whereConditions: string,
    replacements: ReminderQueryReplacements,
  ): Promise<MedicationReminderQueryResult[]> {
    return this.sequelize.query<MedicationReminderQueryResult>(
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
  }

  /**
   * Transform raw query results into MedicationReminder objects
   *
   * @param queryResults - Raw database query results
   * @param date - Date for the reminders
   * @returns Array of typed MedicationReminder objects
   * @private
   */
  private transformQueryResults(
    queryResults: MedicationReminderQueryResult[],
    date: Date,
  ): MedicationReminder[] {
    const now = new Date();

    return queryResults.map((result) => {
      const scheduledTime = new Date(date);
      scheduledTime.setHours(result.scheduled_hour, result.scheduled_minute, 0, 0);

      const status = this.determineReminderStatus(result.was_administered, scheduledTime, now);

      return {
        id: this.generateReminderId(
          result.student_medication_id,
          date,
          result.scheduled_hour,
        ),
        studentMedicationId: result.student_medication_id,
        studentId: result.student_id,
        studentName: result.student_name,
        medicationName: result.medication_name,
        dosage: result.dosage,
        frequency: result.frequency,
        scheduledTime,
        status,
      };
    });
  }

  /**
   * Determine the status of a reminder based on administration and time
   *
   * @param wasAdministered - Whether medication was administered
   * @param scheduledTime - Scheduled time for reminder
   * @param currentTime - Current time
   * @returns Reminder status
   * @private
   */
  private determineReminderStatus(
    wasAdministered: boolean,
    scheduledTime: Date,
    currentTime: Date,
  ): 'PENDING' | 'COMPLETED' | 'MISSED' {
    if (wasAdministered) {
      return 'COMPLETED';
    }

    if (scheduledTime < currentTime) {
      return 'MISSED';
    }

    return 'PENDING';
  }

  /**
   * Generate a unique reminder ID
   *
   * @param studentMedicationId - Student medication ID
   * @param date - Date of reminder
   * @param scheduledHour - Scheduled hour
   * @returns Unique reminder ID
   * @private
   */
  private generateReminderId(
    studentMedicationId: string,
    date: Date,
    scheduledHour: number,
  ): string {
    const dateKey = date.toISOString().split('T')[0];
    return `${studentMedicationId}_${dateKey}_${scheduledHour}`;
  }
}
