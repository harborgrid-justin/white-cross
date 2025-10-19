/**
 * LOC: 1D8E9B5F34
 * WC-SVC-HLT-IEX | import-export.module.ts - Health Record Import/Export Module
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *   - types.ts (./types.ts)
 *   - healthRecord.module.ts (./healthRecord.module.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (./index.ts)
 *
 * Purpose: Data import/export functionality for health records in JSON format
 * Exports: ImportExportModule class for bulk data operations
 * HIPAA: Contains PHI export - requires encryption and secure handling
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Data validation → Bulk processing → Error handling → Audit logging
 */

import { logger } from '../../utils/logger';
import { Student } from '../../database/models';
import { ImportResults } from './types';

/**
 * Import/Export Module
 * Handles bulk import and export operations for health records
 */
export class ImportExportModule {
  /**
   * Export complete health history for a student (JSON format)
   */
  static async exportHealthHistory(studentId: string): Promise<any> {
    try {
      // Import modules dynamically to avoid circular dependencies
      const { HealthRecordModule } = await import('./healthRecord.module');
      const { AllergyModule } = await import('./allergy.module');
      const { ChronicConditionModule } = await import('./chronicCondition.module');
      const { VitalsModule } = await import('./vitals.module');

      const [
        student,
        healthRecords,
        allergies,
        chronicConditions,
        vaccinations,
        growthData
      ] = await Promise.all([
        Student.findByPk(studentId, {
          attributes: [
            'id',
            'studentNumber',
            'firstName',
            'lastName',
            'dateOfBirth',
            'gender',
            'grade'
          ]
        }),
        HealthRecordModule.getStudentHealthRecords(studentId, 1, 1000),
        AllergyModule.getStudentAllergies(studentId),
        ChronicConditionModule.getStudentChronicConditions(studentId),
        HealthRecordModule.getVaccinationRecords(studentId),
        VitalsModule.getGrowthChartData(studentId)
      ]);

      if (!student) {
        throw new Error('Student not found');
      }

      const exportData = {
        exportDate: new Date().toISOString(),
        exportVersion: '1.0',
        student,
        healthRecords: healthRecords.records,
        allergies,
        chronicConditions,
        vaccinations,
        growthData,
        metadata: {
          totalRecords: healthRecords.pagination.total,
          recordTypes: this.getRecordTypeSummary(healthRecords.records)
        }
      };

      logger.info(
        `Health history exported for ${student.firstName} ${student.lastName} - ${healthRecords.pagination.total} records`
      );

      return exportData;
    } catch (error) {
      logger.error('Error exporting health history:', error);
      throw error;
    }
  }

  /**
   * Import health records from JSON (basic import functionality)
   */
  static async importHealthRecords(
    studentId: string,
    importData: any
  ): Promise<ImportResults> {
    try {
      // Verify student exists
      const student = await Student.findByPk(studentId);

      if (!student) {
        throw new Error('Student not found');
      }

      const results: ImportResults = {
        imported: 0,
        skipped: 0,
        errors: []
      };

      // Import health records
      if (importData && typeof importData === 'object' && importData !== null) {
        const data = importData as any;

        if (data.healthRecords && Array.isArray(data.healthRecords)) {
          const { HealthRecordModule } = await import('./healthRecord.module');

          for (const record of data.healthRecords) {
            try {
              await HealthRecordModule.createHealthRecord({
                studentId,
                type: record.type,
                date: new Date(record.date),
                description: record.description,
                vital: record.vital,
                provider: record.provider,
                notes: record.notes,
                attachments: record.attachments
              });
              results.imported++;
            } catch (error) {
              results.skipped++;
              results.errors.push(
                `Record ${record.description}: ${(error as Error).message}`
              );
              logger.warn(
                `Skipped importing record ${record.description}: ${(error as Error).message}`
              );
            }
          }
        }
      }

      logger.info(
        `Health records imported for ${student.firstName} ${student.lastName}: ` +
          `${results.imported} imported, ${results.skipped} skipped`
      );

      return results;
    } catch (error) {
      logger.error('Error importing health records:', error);
      throw error;
    }
  }

  /**
   * Validate import data structure
   */
  static validateImportData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
      errors.push('Import data must be an object');
      return { isValid: false, errors };
    }

    if (data.healthRecords) {
      if (!Array.isArray(data.healthRecords)) {
        errors.push('healthRecords must be an array');
      } else {
        data.healthRecords.forEach((record: any, index: number) => {
          if (!record.type) {
            errors.push(`Record ${index}: missing type`);
          }
          if (!record.date) {
            errors.push(`Record ${index}: missing date`);
          }
          if (!record.description) {
            errors.push(`Record ${index}: missing description`);
          }
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get record type summary for export metadata
   */
  private static getRecordTypeSummary(records: any[]): Record<string, number> {
    return records.reduce((acc: Record<string, number>, record: any) => {
      const type = record.type || 'UNKNOWN';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Export multiple students' health records (bulk export)
   */
  static async bulkExportHealthRecords(studentIds: string[]): Promise<any> {
    try {
      if (!studentIds || studentIds.length === 0) {
        throw new Error('No student IDs provided');
      }

      const exports = [];
      const errors = [];

      for (const studentId of studentIds) {
        try {
          const exportData = await this.exportHealthHistory(studentId);
          exports.push(exportData);
        } catch (error) {
          errors.push({
            studentId,
            error: (error as Error).message
          });
          logger.error(`Failed to export health records for student ${studentId}:`, error);
        }
      }

      logger.info(
        `Bulk export completed: ${exports.length} successful, ${errors.length} failed`
      );

      return {
        exports,
        errors,
        summary: {
          total: studentIds.length,
          successful: exports.length,
          failed: errors.length
        }
      };
    } catch (error) {
      logger.error('Error in bulk export operation:', error);
      throw error;
    }
  }
}
