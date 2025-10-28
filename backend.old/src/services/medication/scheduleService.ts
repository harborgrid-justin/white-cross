/**
 * LOC: 7359200817-SCH
 * WC-SVC-MED-SCH | Medication Schedule and Reminder Service
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/medication/index.ts)
 */

/**
 * WC-SVC-MED-SCH | Medication Schedule and Reminder Service
 * Purpose: Medication scheduling, reminders, and dosage time management
 * Upstream: database/models/StudentMedication | Dependencies: Sequelize
 * Downstream: MedicationService | Called by: Medication service index
 * Related: MedicationLog, Student models
 * Exports: ScheduleService class | Key Services: Scheduling, reminders
 * Last Updated: 2025-10-18 | Dependencies: sequelize
 * Critical Path: Schedule parsing → Reminder generation → Status tracking
 * LLM Context: Healthcare medication scheduling with compliance tracking
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { StudentMedication, Medication, Student, MedicationLog, User } from '../../database/models';
import { MedicationReminder } from './types';

export class ScheduleService {
  /**
   * Get medication schedule for a date range
   */
  static async getMedicationSchedule(startDate: Date, endDate: Date, nurseId?: string) {
    try {
      const whereClause: any = {
        isActive: true,
        startDate: { [Op.lte]: endDate },
        [Op.or]: [
          { endDate: { [Op.is]: null } },
          { endDate: { [Op.gte]: startDate } }
        ]
      };

      const includeStudent: any = {
        model: Student,
        as: 'student',
        attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
      };

      if (nurseId) {
        includeStudent.where = { nurseId };
      }

      const medications = await StudentMedication.findAll({
        where: whereClause,
        include: [
          {
            model: Medication,
            as: 'medication'
          },
          includeStudent,
          {
            model: MedicationLog,
            as: 'logs',
            where: {
              timeGiven: {
                [Op.gte]: startDate,
                [Op.lte]: endDate
              }
            },
            required: false,
            include: [
              {
                model: User,
                as: 'nurse',
                attributes: ['firstName', 'lastName']
              }
            ]
          }
        ],
        order: [
          [{ model: Student, as: 'student' }, 'lastName', 'ASC'],
          [{ model: Student, as: 'student' }, 'firstName', 'ASC']
        ]
      });

      return medications;
    } catch (error) {
      logger.error('Error fetching medication schedule:', error);
      throw error;
    }
  }

  /**
   * Get medication reminders for today and upcoming doses
   */
  static async getMedicationReminders(date: Date = new Date()): Promise<MedicationReminder[]> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Get active student medications
      const activeMedications = await StudentMedication.findAll({
        where: {
          isActive: true,
          startDate: { [Op.lte]: endOfDay },
          [Op.or]: [
            { endDate: { [Op.is]: null } },
            { endDate: { [Op.gte]: startOfDay } }
          ]
        },
        include: [
          {
            model: Medication,
            as: 'medication'
          },
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: MedicationLog,
            as: 'logs',
            where: {
              timeGiven: {
                [Op.gte]: startOfDay,
                [Op.lte]: endOfDay
              }
            },
            required: false
          }
        ]
      });

      // Parse frequency and generate reminders
      const reminders: MedicationReminder[] = [];

      for (const med of activeMedications) {
        // Parse frequency (e.g., "2x daily", "3 times daily", "every 8 hours")
        const scheduledTimes = this.parseFrequencyToTimes(med.frequency);

        for (const time of scheduledTimes) {
          const scheduledDateTime = new Date(date);
          scheduledDateTime.setHours(time.hour, time.minute, 0, 0);

          // Check if already administered
          const wasAdministered = med.logs!.some((log) => {
            const logTime = new Date(log.timeGiven);
            const timeDiff = Math.abs(logTime.getTime() - scheduledDateTime.getTime());
            return timeDiff < 3600000; // Within 1 hour
          });

          let status: 'PENDING' | 'COMPLETED' | 'MISSED' = 'PENDING';
          if (wasAdministered) {
            status = 'COMPLETED';
          } else if (scheduledDateTime < new Date()) {
            status = 'MISSED';
          }

          reminders.push({
            id: `${med.id}_${scheduledDateTime.toISOString()}`,
            studentMedicationId: med.id,
            studentName: `${med.student!.firstName} ${med.student!.lastName}`,
            medicationName: med.medication!.name,
            dosage: med.dosage,
            scheduledTime: scheduledDateTime,
            status
          });
        }
      }

      const sortedReminders = reminders.sort((a, b) =>
        a.scheduledTime.getTime() - b.scheduledTime.getTime()
      );

      logger.info(`Generated ${sortedReminders.length} medication reminders for ${date.toDateString()}`);

      return sortedReminders;
    } catch (error) {
      logger.error('Error fetching medication reminders:', error);
      throw error;
    }
  }

  /**
   * Parse medication frequency to scheduled times
   * Supports common medical abbreviations and natural language
   */
  static parseFrequencyToTimes(frequency: string): Array<{ hour: number; minute: number }> {
    const freq = frequency.toLowerCase();

    // Common medication schedules
    if (freq.includes('once') || freq.includes('1x') || freq === 'daily') {
      return [{ hour: 9, minute: 0 }]; // 9 AM
    }

    if (freq.includes('twice') || freq.includes('2x') || freq.includes('bid')) {
      return [
        { hour: 9, minute: 0 },  // 9 AM
        { hour: 21, minute: 0 }  // 9 PM
      ];
    }

    if (freq.includes('3') || freq.includes('three') || freq.includes('tid')) {
      return [
        { hour: 8, minute: 0 },  // 8 AM
        { hour: 14, minute: 0 }, // 2 PM
        { hour: 20, minute: 0 }  // 8 PM
      ];
    }

    if (freq.includes('4') || freq.includes('four') || freq.includes('qid')) {
      return [
        { hour: 8, minute: 0 },  // 8 AM
        { hour: 12, minute: 0 }, // 12 PM
        { hour: 16, minute: 0 }, // 4 PM
        { hour: 20, minute: 0 }  // 8 PM
      ];
    }

    if (freq.includes('every 6 hours') || freq.includes('q6h')) {
      return [
        { hour: 6, minute: 0 },
        { hour: 12, minute: 0 },
        { hour: 18, minute: 0 },
        { hour: 0, minute: 0 }
      ];
    }

    if (freq.includes('every 8 hours') || freq.includes('q8h')) {
      return [
        { hour: 8, minute: 0 },
        { hour: 16, minute: 0 },
        { hour: 0, minute: 0 }
      ];
    }

    // Default to once daily if can't parse
    return [{ hour: 9, minute: 0 }];
  }
}
