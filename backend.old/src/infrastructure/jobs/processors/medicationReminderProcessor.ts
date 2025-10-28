/**
 * Medication Reminder Job Processor
 *
 * Processes medication reminder jobs using BullMQ
 * Replaces cron-based medication reminder job
 *
 * @module infrastructure/jobs/processors/medicationReminderProcessor
 */

import { Job } from 'bullmq';
import { logger } from '../../../utils/logger';
import { getWebSocketPlugin } from '../../websocket/socketPlugin';
import Medication from '../../../database/models/healthcare/Medication';
import { Op } from 'sequelize';

export interface MedicationReminderData {
  organizationId?: string;
  medicationId?: string;
  studentId?: string;
}

/**
 * Process medication reminder job
 */
export async function processMedicationReminder(job: Job<MedicationReminderData>): Promise<any> {
  const { organizationId, medicationId, studentId } = job.data;

  logger.info('Processing medication reminder job', {
    jobId: job.id,
    organizationId,
    medicationId,
    studentId
  });

  try {
    // Build query
    const whereClause: any = {
      status: 'ACTIVE'
    };

    if (organizationId) {
      whereClause.organizationId = organizationId;
    }

    if (medicationId) {
      whereClause.id = medicationId;
    }

    if (studentId) {
      whereClause.studentId = studentId;
    }

    // Find medications due for administration
    const currentTime = new Date();
    const medications = await Medication.findAll({
      where: {
        ...whereClause,
        nextDoseTime: {
          [Op.lte]: currentTime
        }
      },
      include: [
        { association: 'student', attributes: ['id', 'firstName', 'lastName'] },
        { association: 'administrations', limit: 1, order: [['administeredAt', 'DESC']] }
      ]
    });

    logger.info(`Found ${medications.length} medications due for administration`);

    // Send reminders via WebSocket
    const webSocket = getWebSocketPlugin();
    const reminders = [];

    for (const medication of medications) {
      const reminder = {
        id: medication.id,
        studentId: medication.studentId,
        studentName: medication.student ? `${medication.student.firstName} ${medication.student.lastName}` : 'Unknown',
        medicationName: medication.name,
        dosage: medication.dosage,
        route: medication.route,
        scheduledTime: medication.nextDoseTime,
        instructions: medication.instructions
      };

      // Broadcast to organization
      if (medication.organizationId) {
        webSocket.broadcastMedicationReminder(medication.organizationId, reminder);
      }

      reminders.push(reminder);
    }

    logger.info(`Sent ${reminders.length} medication reminders`);

    return {
      processed: medications.length,
      reminders
    };
  } catch (error) {
    logger.error('Error processing medication reminder job', error);
    throw error;
  }
}
