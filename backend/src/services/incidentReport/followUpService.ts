/**
 * LOC: A077468A25
 * WC-GEN-263 | followUpService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - types.ts (services/incidentReport/types.ts)
 *   - validationService.ts (services/incidentReport/validationService.ts)
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-263 | followUpService.ts - General utility functions and operations
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
import { IncidentReport, FollowUpAction } from '../../database/models';
import { CreateFollowUpActionData } from './types';
import { IncidentValidationService } from './validationService';
import { ActionStatus } from '../../database/types/enums';

export class FollowUpService {
  /**
   * Add follow-up action to incident report with validation
   */
  static async addFollowUpAction(incidentReportId: string, data: CreateFollowUpActionData) {
    try {
      const report = await IncidentReport.findByPk(incidentReportId);

      if (!report) {
        throw new Error('Incident report not found');
      }

      // Validate follow-up action data
      IncidentValidationService.validateFollowUpActionData(data);

      const followUpAction = await FollowUpAction.create({
        incidentReportId,
        ...data,
        status: ActionStatus.PENDING
      });

      logger.info(`Follow-up action added to incident ${incidentReportId}`);
      return followUpAction;
    } catch (error) {
      logger.error('Error adding follow-up action:', error);
      throw error;
    }
  }

  /**
   * Update follow-up action status with validation
   */
  static async updateFollowUpAction(
    actionId: string,
    status: ActionStatus,
    completedBy?: string,
    notes?: string
  ) {
    try {
      const action = await FollowUpAction.findByPk(actionId);

      if (!action) {
        throw new Error('Follow-up action not found');
      }

      // Validate status update
      IncidentValidationService.validateFollowUpActionStatusUpdate(status, completedBy, notes);

      const updateData: any = { status };

      if (status === 'COMPLETED') {
        updateData.completedAt = new Date();
        if (completedBy) updateData.completedBy = completedBy;
      }

      if (notes) {
        updateData.notes = notes;
      }

      await action.update(updateData);

      logger.info(`Follow-up action ${actionId} status updated to ${status}`);
      return action;
    } catch (error) {
      logger.error('Error updating follow-up action:', error);
      throw error;
    }
  }

  /**
   * Get follow-up actions for an incident
   */
  static async getFollowUpActions(incidentReportId: string) {
    try {
      const actions = await FollowUpAction.findAll({
        where: { incidentReportId },
        order: [['dueDate', 'ASC']]
      });

      return actions;
    } catch (error) {
      logger.error('Error fetching follow-up actions:', error);
      throw error;
    }
  }

  /**
   * Get overdue follow-up actions
   */
  static async getOverdueActions() {
    try {
      const now = new Date();
      const actions = await FollowUpAction.findAll({
        where: {
          status: ActionStatus.PENDING,
          dueDate: { $lt: now }
        },
        include: [
          {
            model: IncidentReport,
            as: 'incidentReport',
            attributes: ['id', 'type', 'severity', 'studentId']
          }
        ],
        order: [['dueDate', 'ASC']]
      });

      return actions;
    } catch (error) {
      logger.error('Error fetching overdue actions:', error);
      throw error;
    }
  }

  /**
   * Get pending follow-up actions assigned to a user
   */
  static async getUserPendingActions(assignedTo: string) {
    try {
      const actions = await FollowUpAction.findAll({
        where: {
          assignedTo,
          status: ActionStatus.PENDING
        },
        include: [
          {
            model: IncidentReport,
            as: 'incidentReport',
            attributes: ['id', 'type', 'severity', 'studentId', 'occurredAt']
          }
        ],
        order: [['dueDate', 'ASC']]
      });

      return actions;
    } catch (error) {
      logger.error('Error fetching user pending actions:', error);
      throw error;
    }
  }

  /**
   * Get urgent follow-up actions (due within 24 hours)
   */
  static async getUrgentActions() {
    try {
      const tomorrow = new Date();
      tomorrow.setHours(tomorrow.getHours() + 24);

      const actions = await FollowUpAction.findAll({
        where: {
          status: ActionStatus.PENDING,
          dueDate: { $lte: tomorrow },
          priority: 'URGENT'
        },
        include: [
          {
            model: IncidentReport,
            as: 'incidentReport',
            attributes: ['id', 'type', 'severity', 'studentId']
          }
        ],
        order: [['dueDate', 'ASC']]
      });

      return actions;
    } catch (error) {
      logger.error('Error fetching urgent actions:', error);
      throw error;
    }
  }

  /**
   * Update follow-up action details
   */
  static async updateFollowUpActionDetails(
    actionId: string,
    data: Partial<CreateFollowUpActionData>
  ) {
    try {
      const action = await FollowUpAction.findByPk(actionId);

      if (!action) {
        throw new Error('Follow-up action not found');
      }

      // Don't allow updating completed actions
      if (action.status === ActionStatus.COMPLETED) {
        throw new Error('Cannot update completed follow-up actions');
      }

      // Validate if data contains required fields for validation
      if (data.action || data.dueDate || data.priority) {
        const validationData = {
          action: data.action || action.action,
          dueDate: data.dueDate || action.dueDate,
          priority: data.priority || action.priority,
          assignedTo: data.assignedTo || action.assignedTo
        };
        IncidentValidationService.validateFollowUpActionData(validationData);
      }

      await action.update(data);

      logger.info(`Follow-up action ${actionId} details updated`);
      return action;
    } catch (error) {
      logger.error('Error updating follow-up action details:', error);
      throw error;
    }
  }

  /**
   * Delete follow-up action
   */
  static async deleteFollowUpAction(actionId: string) {
    try {
      const action = await FollowUpAction.findByPk(actionId);

      if (!action) {
        throw new Error('Follow-up action not found');
      }

      // Don't allow deleting completed actions
      if (action.status === ActionStatus.COMPLETED) {
        throw new Error('Cannot delete completed follow-up actions');
      }

      await action.destroy();

      logger.info(`Follow-up action ${actionId} deleted`);
      return true;
    } catch (error) {
      logger.error('Error deleting follow-up action:', error);
      throw error;
    }
  }

  /**
   * Get follow-up action statistics
   */
  static async getFollowUpStatistics(dateFrom?: Date, dateTo?: Date) {
    try {
      const whereClause: any = {};

      if (dateFrom || dateTo) {
        whereClause.createdAt = {};
        if (dateFrom) {
          whereClause.createdAt.$gte = dateFrom;
        }
        if (dateTo) {
          whereClause.createdAt.$lte = dateTo;
        }
      }

      const [total, pending, completed, overdue] = await Promise.all([
        FollowUpAction.count({ where: whereClause }),
        FollowUpAction.count({
          where: { ...whereClause, status: ActionStatus.PENDING }
        }),
        FollowUpAction.count({
          where: { ...whereClause, status: ActionStatus.COMPLETED }
        }),
        FollowUpAction.count({
          where: {
            ...whereClause,
            status: ActionStatus.PENDING,
            dueDate: { $lt: new Date() }
          }
        })
      ]);

      return {
        total,
        pending,
        completed,
        overdue,
        completionRate: total > 0 ? (completed / total) * 100 : 0
      };
    } catch (error) {
      logger.error('Error fetching follow-up statistics:', error);
      throw error;
    }
  }
}
