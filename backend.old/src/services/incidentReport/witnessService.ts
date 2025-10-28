/**
 * LOC: CB1041810C
 * WC-GEN-270 | witnessService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - types.ts (services/incidentReport/types.ts)
 *   - validationService.ts (services/incidentReport/validationService.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/incidentReport/index.ts)
 */

/**
 * WC-GEN-270 | witnessService.ts - General utility functions and operations
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
import { IncidentReport, WitnessStatement } from '../../database/models';
import { CreateWitnessStatementData } from './types';
import { IncidentValidationService } from './validationService';

export class WitnessService {
  /**
   * Add witness statement to incident report with validation
   */
  static async addWitnessStatement(incidentReportId: string, data: CreateWitnessStatementData) {
    try {
      const report = await IncidentReport.findByPk(incidentReportId);

      if (!report) {
        throw new Error('Incident report not found');
      }

      // Validate witness statement data
      IncidentValidationService.validateWitnessStatementData(data);

      const witnessStatement = await WitnessStatement.create({
        incidentReportId,
        ...data
      });

      logger.info(`Witness statement added to incident ${incidentReportId}`);
      return witnessStatement;
    } catch (error) {
      logger.error('Error adding witness statement:', error);
      throw error;
    }
  }

  /**
   * Verify witness statement
   */
  static async verifyWitnessStatement(statementId: string, verifiedBy: string) {
    try {
      const statement = await WitnessStatement.findByPk(statementId);

      if (!statement) {
        throw new Error('Witness statement not found');
      }

      await statement.update({
        verified: true,
        verifiedBy,
        verifiedAt: new Date()
      });

      logger.info(`Witness statement ${statementId} verified by ${verifiedBy}`);
      return statement;
    } catch (error) {
      logger.error('Error verifying witness statement:', error);
      throw error;
    }
  }

  /**
   * Get witness statements for an incident
   */
  static async getWitnessStatements(incidentReportId: string) {
    try {
      const statements = await WitnessStatement.findAll({
        where: { incidentReportId },
        order: [['createdAt', 'ASC']]
      });

      return statements;
    } catch (error) {
      logger.error('Error fetching witness statements:', error);
      throw error;
    }
  }

  /**
   * Update witness statement
   */
  static async updateWitnessStatement(
    statementId: string,
    data: Partial<CreateWitnessStatementData>
  ) {
    try {
      const statement = await WitnessStatement.findByPk(statementId);

      if (!statement) {
        throw new Error('Witness statement not found');
      }

      // Validate if statement is being updated
      if (data.statement) {
        IncidentValidationService.validateWitnessStatementData({
          witnessName: data.witnessName || statement.witnessName,
          witnessType: data.witnessType || statement.witnessType,
          witnessContact: data.witnessContact || statement.witnessContact,
          statement: data.statement
        });
      }

      await statement.update(data);

      logger.info(`Witness statement ${statementId} updated`);
      return statement;
    } catch (error) {
      logger.error('Error updating witness statement:', error);
      throw error;
    }
  }

  /**
   * Delete witness statement
   */
  static async deleteWitnessStatement(statementId: string) {
    try {
      const statement = await WitnessStatement.findByPk(statementId);

      if (!statement) {
        throw new Error('Witness statement not found');
      }

      await statement.destroy();

      logger.info(`Witness statement ${statementId} deleted`);
      return true;
    } catch (error) {
      logger.error('Error deleting witness statement:', error);
      throw error;
    }
  }

  /**
   * Get unverified witness statements
   */
  static async getUnverifiedStatements() {
    try {
      const statements = await WitnessStatement.findAll({
        where: { verified: false },
        include: [
          {
            model: IncidentReport,
            as: 'incidentReport',
            attributes: ['id', 'type', 'severity', 'occurredAt']
          }
        ],
        order: [['createdAt', 'ASC']]
      });

      return statements;
    } catch (error) {
      logger.error('Error fetching unverified witness statements:', error);
      throw error;
    }
  }
}
