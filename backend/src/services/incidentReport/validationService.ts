/**
 * LOC: DEDA6DB5A8
 * WC-GEN-269 | validationService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - types.ts (services/incidentReport/types.ts)
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - coreService.ts (services/incidentReport/coreService.ts)
 *   - followUpService.ts (services/incidentReport/followUpService.ts)
 *   - witnessService.ts (services/incidentReport/witnessService.ts)
 */

/**
 * WC-GEN-269 | validationService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ./types | Dependencies: ../../utils/logger, ../../database/models, ./types
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { logger } from '../../utils/logger';
import { Student, User, EmergencyContact } from '../../database/models';
import { CreateIncidentReportData, CreateWitnessStatementData, CreateFollowUpActionData } from './types';
import { ActionStatus } from '../../database/types/enums';

export class IncidentValidationService {
  /**
   * Validate incident report data before creation
   */
  static async validateIncidentReportData(data: CreateIncidentReportData): Promise<{ student: any; reporter: any }> {
    // Verify student exists
    const student = await Student.findByPk(data.studentId, {
      include: [
        {
          model: EmergencyContact,
          as: 'emergencyContacts',
          where: { isActive: true },
          required: false,
          order: [['priority', 'ASC']]
        }
      ]
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Verify reporter exists
    const reporter = await User.findByPk(data.reportedById);

    if (!reporter) {
      throw new Error('Reporter not found');
    }

    // Business Logic Validations

    // 1. Validate incident time is not in the future
    if (new Date(data.occurredAt) > new Date()) {
      throw new Error('Incident time cannot be in the future');
    }

    // 2. Validate description minimum length
    if (data.description.length < 20) {
      throw new Error('Description must be at least 20 characters for proper documentation');
    }

    // 3. Validate location is provided for safety incidents
    if (!data.location || data.location.trim().length < 3) {
      throw new Error('Location is required for safety documentation (minimum 3 characters)');
    }

    // 4. Validate actions taken is documented
    if (!data.actionsTaken || data.actionsTaken.trim().length < 10) {
      throw new Error('Actions taken must be documented for all incidents (minimum 10 characters)');
    }

    // 5. Auto-set follow-up required for INJURY type
    if (data.type === 'INJURY' && !data.followUpRequired) {
      data.followUpRequired = true;
      logger.info('Auto-setting followUpRequired=true for INJURY incident');
    }

    // 6. Validate medication errors have detailed description
    if (data.type === 'MEDICATION_ERROR' && data.description.length < 50) {
      throw new Error('Medication error incidents require detailed description (minimum 50 characters)');
    }

    // 7. High/Critical severity requires parent notification acknowledgment
    if (['HIGH', 'CRITICAL'].includes(data.severity)) {
      if (!student.emergencyContacts || student.emergencyContacts.length === 0) {
        logger.warn(`High/Critical incident created for student ${student.id} with no emergency contacts`);
      }
    }

    return { student, reporter };
  }

  /**
   * Validate witness statement data
   */
  static validateWitnessStatementData(data: CreateWitnessStatementData): void {
    // Validate witness statement minimum length
    if (!data.statement || data.statement.trim().length < 20) {
      throw new Error('Witness statement must be at least 20 characters for proper documentation');
    }

    // Validate witness name minimum length
    if (!data.witnessName || data.witnessName.trim().length < 2) {
      throw new Error('Witness name must be at least 2 characters');
    }
  }

  /**
   * Validate follow-up action data
   */
  static validateFollowUpActionData(data: CreateFollowUpActionData): void {
    // Validate action description minimum length
    if (!data.action || data.action.trim().length < 5) {
      throw new Error('Follow-up action must be at least 5 characters');
    }

    // Validate due date is in the future
    if (new Date(data.dueDate) <= new Date()) {
      throw new Error('Due date must be in the future');
    }

    // Validate priority is set
    if (!data.priority) {
      throw new Error('Priority is required for follow-up actions');
    }

    // Warn if URGENT priority but due date is more than 24 hours away
    if (data.priority === 'URGENT') {
      const dueDate = new Date(data.dueDate);
      const now = new Date();
      const hoursDiff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        logger.warn(`URGENT priority action with due date more than 24 hours away`);
      }
    }
  }

  /**
   * Validate follow-up action status update
   */
  static validateFollowUpActionStatusUpdate(
    status: ActionStatus,
    completedBy?: string,
    notes?: string
  ): void {
    // Validate COMPLETED status requires completedBy
    if (status === 'COMPLETED') {
      if (!completedBy) {
        throw new Error('Completed actions must have a completedBy user');
      }
      if (!notes || notes.trim().length === 0) {
        logger.warn('Follow-up action completed without notes');
      }
    }
  }
}
