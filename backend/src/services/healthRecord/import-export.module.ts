/**
 * @fileoverview Health Record Import/Export Module - HIPAA-Compliant Data Portability
 * @module services/healthRecord/import-export.module
 * @description Secure bulk import/export operations for health records with comprehensive PHI protection
 *
 * Key Features:
 * - Complete health history export in JSON format
 * - Bulk student health record export operations
 * - Health record import with validation and error handling
 * - Import data structure validation
 * - Record type summary generation for metadata
 * - Comprehensive error tracking for failed imports
 * - Student demographic data inclusion in exports
 *
 * Export Capabilities:
 * - Health records (all types)
 * - Allergy information
 * - Chronic conditions with care plans
 * - Vaccination history
 * - Growth chart data
 * - Export metadata and statistics
 *
 * @compliance HIPAA Privacy Rule §164.308 - Administrative Safeguards
 * @compliance HIPAA Security Rule §164.312 - Technical Safeguards
 * @compliance HIPAA Right of Access §164.524 - Patient access to PHI
 * @compliance 45 CFR §164.524 - Electronic health information in requested format
 * @security PHI Export - Data must be encrypted during transit and at rest
 * @security Export operations require elevated 'health:export' permission
 * @security Exported data contains comprehensive PHI requiring secure handling
 * @audit All export operations logged with student ID and record counts
 * @audit Import operations logged with success/failure statistics
 * @audit Minimum 6-year retention for HIPAA compliance
 * @encryption Exported PHI should be encrypted before transmission or storage
 * @portability Supports patient right to access and data portability under HIPAA
 *
 * Security Considerations:
 * - Exports contain complete PHI and must be handled as sensitive data
 * - Consider encryption at application level before transmission
 * - Log all export operations for security audit trail
 * - Implement access controls for export functionality
 * - Rate limit export operations to prevent data exfiltration
 *
 * @requires ../../utils/logger
 * @requires ../../database/models
 * @requires ./types
 * @requires ./healthRecord.module
 *
 * LOC: 1D8E9B5F34
 * WC-SVC-HLT-IEX | import-export.module.ts
 * Last Updated: 2025-10-18 | File Type: .ts
 */

import { logger } from '../../utils/logger';
import { Student } from '../../database/models';
import { ImportResults } from './types';

/**
 * @class ImportExportModule
 * @description HIPAA-compliant import/export operations for health records with comprehensive PHI protection
 * @security All methods require elevated permissions for bulk PHI operations
 * @audit All operations logged for compliance and security tracking
 * @encryption Exported data must be encrypted before transmission
 */
export class ImportExportModule {
  /**
   * @method exportHealthHistory
   * @description Export complete health history for a student in structured JSON format
   * @async
   *
   * @param {string} studentId - Student UUID whose health history to export
   *
   * @returns {Promise<Object>} Complete health history export package
   * @returns {string} result.exportDate - ISO timestamp of export
   * @returns {string} result.exportVersion - Export format version for compatibility
   * @returns {Object} result.student - Student demographic information
   * @returns {Array} result.healthRecords - All health records
   * @returns {Array} result.allergies - All allergy information
   * @returns {Array} result.chronicConditions - All chronic conditions with care plans
   * @returns {Array} result.vaccinations - Vaccination history
   * @returns {Array} result.growthData - Growth chart data points
   * @returns {Object} result.metadata - Export metadata and statistics
   *
   * @throws {Error} When student not found
   * @throws {Error} When database query fails
   *
   * @security PHI Export - Requires 'health:export' permission
   * @security Exported data contains complete PHI requiring encryption
   * @audit Export logged with student ID and record count
   * @compliance HIPAA Right of Access - Patient/guardian can request complete records
   * @portability Supports data portability requirements under HIPAA
   * @encryption Result must be encrypted before transmission or storage
   * @privacy Ensure export is delivered only to authorized requestor
   *
   * @example
   * // Export student health history for parent request
   * const healthHistory = await ImportExportModule.exportHealthHistory('student-123');
   * // Encrypt and transmit securely to authorized parent/guardian
   * // Log: "Health history exported for John Doe - 156 records"
   *
   * @example
   * // Export for student transferring to new school
   * const exportData = await ImportExportModule.exportHealthHistory('student-456');
   * const encrypted = encryptPHI(exportData);
   * await sendSecureEmail(encrypted, newSchoolNurse@example.com);
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
   * @method importHealthRecords
   * @description Import health records from JSON format with validation and error handling
   * @async
   *
   * @param {string} studentId - Target student UUID for imported records
   * @param {Object} importData - Import data package (must match export format)
   * @param {Array} [importData.healthRecords] - Array of health records to import
   *
   * @returns {Promise<ImportResults>} Import operation results
   * @returns {number} result.imported - Count of successfully imported records
   * @returns {number} result.skipped - Count of skipped records (validation failures)
   * @returns {string[]} result.errors - Array of error messages for skipped records
   *
   * @throws {Error} When student not found
   * @throws {Error} When database operations fail
   *
   * @security PHI Import - Requires 'health:create' permission
   * @audit Import logged with success/failure statistics
   * @validation Each record validated before import (see ValidationModule)
   * @errorHandling Failed records skipped with detailed error tracking
   * @idempotency Duplicate records may be rejected by validation
   *
   * @example
   * // Import health records from previous school
   * const importData = {
   *   healthRecords: [
   *     { type: 'CHECKUP', date: '2024-01-15', description: 'Annual physical', ... },
   *     { type: 'VACCINATION', date: '2024-02-01', description: 'COVID-19 booster', ... }
   *   ]
   * };
   * const results = await ImportExportModule.importHealthRecords('student-123', importData);
   * console.log(`Imported: ${results.imported}, Skipped: ${results.skipped}`);
   * if (results.errors.length > 0) {
   *   console.error('Import errors:', results.errors);
   * }
   *
   * @example
   * // Import with error handling
   * const results = await ImportExportModule.importHealthRecords('student-456', data);
   * results.errors.forEach(error => logger.warn(`Import issue: ${error}`));
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
   * @method validateImportData
   * @description Validate import data structure and required fields before processing
   * @static
   *
   * @param {any} data - Import data to validate
   *
   * @returns {Object} Validation result with detailed error messages
   * @returns {boolean} result.isValid - Whether data structure is valid
   * @returns {string[]} result.errors - Array of specific validation error messages
   *
   * @validation Checks data is object (not null/undefined/primitive)
   * @validation Validates healthRecords is array if present
   * @validation Validates each record has required fields (type, date, description)
   * @errorHandling Returns detailed errors for each validation failure
   *
   * @example
   * const validation = ImportExportModule.validateImportData(importData);
   * if (!validation.isValid) {
   *   throw new Error(`Invalid import data: ${validation.errors.join(', ')}`);
   * }
   * // Proceed with import
   *
   * @example
   * // Validate before processing
   * const { isValid, errors } = ImportExportModule.validateImportData(data);
   * if (!isValid) {
   *   return { success: false, message: 'Validation failed', errors };
   * }
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
   * @method getRecordTypeSummary
   * @description Generate summary statistics of record types for export metadata
   * @private
   * @static
   *
   * @param {Array} records - Array of health records to summarize
   *
   * @returns {Record<string, number>} Object mapping record types to counts
   *
   * @example
   * // Internal use in exportHealthHistory
   * const summary = this.getRecordTypeSummary(healthRecords);
   * // Returns: { CHECKUP: 45, VACCINATION: 23, ILLNESS: 12, ... }
   */
  private static getRecordTypeSummary(records: any[]): Record<string, number> {
    return records.reduce((acc: Record<string, number>, record: any) => {
      const type = record.type || 'UNKNOWN';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * @method bulkExportHealthRecords
   * @description Export health records for multiple students in a single operation
   * @async
   *
   * @param {string[]} studentIds - Array of student UUIDs to export
   *
   * @returns {Promise<Object>} Bulk export results package
   * @returns {Array} result.exports - Array of successful export objects
   * @returns {Array} result.errors - Array of error objects for failed exports
   * @returns {Object} result.summary - Operation summary statistics
   * @returns {number} result.summary.total - Total students requested
   * @returns {number} result.summary.successful - Successfully exported count
   * @returns {number} result.summary.failed - Failed export count
   *
   * @throws {Error} When no student IDs provided
   *
   * @security PHI Bulk Export - Requires 'health:export:bulk' permission
   * @security Exports contain PHI for multiple students - highest security required
   * @audit Bulk export logged with student count and success/failure statistics
   * @performance Large bulk exports may take significant time
   * @errorHandling Individual student failures don't block other exports
   * @encryption Result must be encrypted before transmission
   * @rateLimit Consider rate limiting to prevent data exfiltration
   *
   * @example
   * // Export health records for all graduating seniors
   * const seniorIds = await getGraduatingSeniorIds();
   * const bulkExport = await ImportExportModule.bulkExportHealthRecords(seniorIds);
   * console.log(`Exported ${bulkExport.summary.successful}/${bulkExport.summary.total} records`);
   * if (bulkExport.errors.length > 0) {
   *   console.error('Export failures:', bulkExport.errors);
   * }
   *
   * @example
   * // Export for grade-level health screening report
   * const studentIds = ['student-1', 'student-2', 'student-3'];
   * const exports = await ImportExportModule.bulkExportHealthRecords(studentIds);
   * // Process successful exports, log failures
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
