/**
 * LOC: 555040BDA5
 * WC-GEN-256 | importExportService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - healthRecordRepository.ts (services/health/healthRecordRepository.ts)
 *   - allergiesService.ts (services/health/allergiesService.ts)
 *   - immunizationsService.ts (services/health/immunizationsService.ts)
 *   - chronicConditionsService.ts (services/health/chronicConditionsService.ts)
 *
 * DOWNSTREAM (imported by):
 *   - healthRecordService.ts (services/health/healthRecordService.ts)
 */

/**
 * WC-GEN-256 | importExportService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../models, ./types, ./healthRecordRepository | Dependencies: sequelize, ../../models, ./types
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: constants | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Transaction } from 'sequelize';
import { HealthRecord, Allergy, Vaccination, ChronicCondition } from '../../database/models';
import { 
  HealthDataExport,
  HealthDataImport,
  DetailedImportResult,
  ExportOptions,
  ImportOptions
} from './types';
import { HealthRecordRepository } from './healthRecordRepository';
import { AllergiesService } from './allergiesService';
import { ImmunizationsService } from './immunizationsService';
import { ChronicConditionsService } from './chronicConditionsService';

class ImportExportService {
  /**
   * Export all health data for a patient
   */
  async exportPatientData(
    patientId: string, 
    options: ExportOptions = {}
  ): Promise<HealthDataExport> {
    try {
      const { 
        includeHealthRecords = true,
        includeAllergies = true,
        includeVaccinations = true,
        includeChronicConditions = true,
        dateRange
      } = options;

      const exportData: HealthDataExport = {
        patientId,
        exportDate: new Date(),
        version: '1.0',
        data: {}
      };

      // Build where clause for date filtering
      const whereClause: any = { studentId: patientId };
      if (dateRange) {
        whereClause.createdAt = {
          $gte: dateRange.startDate,
          $lte: dateRange.endDate
        };
      }

      // Export health records
      if (includeHealthRecords) {
        const healthRecords = await HealthRecord.findAll({
          where: whereClause,
          order: [['createdAt', 'DESC']]
        });
        exportData.data.healthRecords = healthRecords.map(record => record.toJSON());
      }

      // Export allergies
      if (includeAllergies) {
        const allergies = await Allergy.findAll({
          where: whereClause,
          order: [['createdAt', 'DESC']]
        });
        exportData.data.allergies = allergies.map(allergy => allergy.toJSON());
      }

      // Export vaccinations
      if (includeVaccinations) {
        const vaccinations = await Vaccination.findAll({
          where: whereClause,
          order: [['administrationDate', 'DESC']]
        });
        exportData.data.vaccinations = vaccinations.map(vaccination => vaccination.toJSON());
      }

      // Export chronic conditions
      if (includeChronicConditions) {
        const chronicConditions = await ChronicCondition.findAll({
          where: whereClause,
          order: [['diagnosedDate', 'DESC']]
        });
        exportData.data.chronicConditions = chronicConditions.map(condition => condition.toJSON());
      }

      return exportData;
    } catch (error) {
      console.error('Error exporting patient data:', error);
      throw new Error(`Failed to export patient data: ${error.message}`);
    }
  }

  /**
   * Export health data in various formats
   */
  async exportToFormat(
    patientId: string, 
    format: 'json' | 'csv' | 'pdf' | 'hl7',
    options: ExportOptions = {}
  ): Promise<string | Buffer> {
    const exportData = await this.exportPatientData(patientId, options);

    switch (format) {
      case 'json':
        return JSON.stringify(exportData, null, 2);
      
      case 'csv':
        return this.convertToCSV(exportData);
      
      case 'pdf':
        return this.generatePDF(exportData);
      
      case 'hl7':
        return this.convertToHL7(exportData);
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Import health data for a patient
   */
  async importPatientData(
    importData: HealthDataImport,
    options: ImportOptions = {}
  ): Promise<DetailedImportResult> {
    const transaction = await HealthRecord.sequelize!.transaction();
    
    try {
      const {
        validateData = true,
        skipDuplicates = true,
        overwriteExisting = false
      } = options;

      const result: DetailedImportResult = {
        success: true,
        imported: {
          healthRecords: 0,
          allergies: 0,
          vaccinations: 0,
          chronicConditions: 0
        },
        errors: [],
        warnings: []
      };

      // Validate import data structure
      if (validateData) {
        const validationErrors = await this.validateImportData(importData);
        if (validationErrors.length > 0) {
          result.success = false;
          result.errors = validationErrors;
          await transaction.rollback();
          return result;
        }
      }

      // Import health records
      if (importData.data.healthRecords) {
        try {
          const imported = await this.importHealthRecords(
            importData.data.healthRecords,
            importData.patientId,
            { skipDuplicates, overwriteExisting },
            transaction
          );
          result.imported.healthRecords = imported;
        } catch (error) {
          result.errors.push(`Health records import failed: ${error.message}`);
        }
      }

      // Import allergies
      if (importData.data.allergies) {
        try {
          const imported = await this.importAllergies(
            importData.data.allergies,
            importData.patientId,
            { skipDuplicates, overwriteExisting },
            transaction
          );
          result.imported.allergies = imported;
        } catch (error) {
          result.errors.push(`Allergies import failed: ${error.message}`);
        }
      }

      // Import vaccinations
      if (importData.data.vaccinations) {
        try {
          const imported = await this.importVaccinations(
            importData.data.vaccinations,
            importData.patientId,
            { skipDuplicates, overwriteExisting },
            transaction
          );
          result.imported.vaccinations = imported;
        } catch (error) {
          result.errors.push(`Vaccinations import failed: ${error.message}`);
        }
      }

      // Import chronic conditions
      if (importData.data.chronicConditions) {
        try {
          const imported = await this.importChronicConditions(
            importData.data.chronicConditions,
            importData.patientId,
            { skipDuplicates, overwriteExisting },
            transaction
          );
          result.imported.chronicConditions = imported;
        } catch (error) {
          result.errors.push(`Chronic conditions import failed: ${error.message}`);
        }
      }

      if (result.errors.length > 0) {
        result.success = false;
        await transaction.rollback();
      } else {
        await transaction.commit();
      }

      return result;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Import failed: ${error.message}`);
    }
  }

  /**
   * Bulk export for multiple patients
   */
  async bulkExport(
    patientIds: string[],
    options: ExportOptions = {}
  ): Promise<{ [patientId: string]: HealthDataExport }> {
    const results: { [patientId: string]: HealthDataExport } = {};
    
    for (const patientId of patientIds) {
      try {
        results[patientId] = await this.exportPatientData(patientId, options);
      } catch (error) {
        console.error(`Failed to export data for patient ${patientId}:`, error);
        // Continue with other patients
      }
    }
    
    return results;
  }

  /**
   * Validate import data structure and content
   */
  private async validateImportData(importData: HealthDataImport): Promise<string[]> {
    const errors: string[] = [];

    // Validate required fields
    if (!importData.patientId) {
      errors.push('Patient ID is required');
    }

    if (!importData.data) {
      errors.push('Import data is required');
    }

    // Validate data structure
    if (importData.data.healthRecords) {
      importData.data.healthRecords.forEach((record, index) => {
        if (!record.type) {
          errors.push(`Health record ${index}: type is required`);
        }
        if (!record.date) {
          errors.push(`Health record ${index}: date is required`);
        }
      });
    }

    if (importData.data.allergies) {
      importData.data.allergies.forEach((allergy, index) => {
        if (!allergy.allergen) {
          errors.push(`Allergy ${index}: allergen is required`);
        }
        if (!allergy.severity) {
          errors.push(`Allergy ${index}: severity is required`);
        }
      });
    }

    return errors;
  }

  /**
   * Import health records
   */
  private async importHealthRecords(
    records: any[],
    patientId: string,
    options: { skipDuplicates: boolean; overwriteExisting: boolean },
    transaction: Transaction
  ): Promise<number> {
    let importedCount = 0;

    for (const recordData of records) {
      try {
        // Check for duplicates
        if (options.skipDuplicates) {
          const existing = await HealthRecord.findOne({
            where: {
              studentId: patientId,
              recordType: recordData.type,
              createdAt: recordData.date
            },
            transaction
          });

          if (existing && !options.overwriteExisting) {
            continue;
          }

          if (existing && options.overwriteExisting) {
            await existing.update(recordData, { transaction });
            importedCount++;
            continue;
          }
        }

        await HealthRecord.create({
          ...recordData,
          studentId: patientId
        }, { transaction });
        
        importedCount++;
      } catch (error) {
        console.error('Error importing health record:', error);
        // Continue with next record
      }
    }

    return importedCount;
  }

  /**
   * Import allergies
   */
  private async importAllergies(
    allergies: any[],
    patientId: string,
    options: { skipDuplicates: boolean; overwriteExisting: boolean },
    transaction: Transaction
  ): Promise<number> {
    let importedCount = 0;

    for (const allergyData of allergies) {
      try {
        if (options.skipDuplicates) {
          const existing = await Allergy.findOne({
            where: {
              studentId: patientId,
              allergen: allergyData.allergen
            },
            transaction
          });

          if (existing && !options.overwriteExisting) {
            continue;
          }

          if (existing && options.overwriteExisting) {
            await existing.update(allergyData, { transaction });
            importedCount++;
            continue;
          }
        }

        await Allergy.create({
          ...allergyData,
          studentId: patientId
        }, { transaction });
        
        importedCount++;
      } catch (error) {
        console.error('Error importing allergy:', error);
      }
    }

    return importedCount;
  }

  /**
   * Import vaccinations
   */
  private async importVaccinations(
    vaccinations: any[],
    patientId: string,
    options: { skipDuplicates: boolean; overwriteExisting: boolean },
    transaction: Transaction
  ): Promise<number> {
    let importedCount = 0;

    for (const vaccinationData of vaccinations) {
      try {
        if (options.skipDuplicates) {
          const existing = await Vaccination.findOne({
            where: {
              studentId: patientId,
              vaccineName: vaccinationData.vaccineName,
              administrationDate: vaccinationData.administrationDate
            },
            transaction
          });

          if (existing && !options.overwriteExisting) {
            continue;
          }

          if (existing && options.overwriteExisting) {
            await existing.update(vaccinationData, { transaction });
            importedCount++;
            continue;
          }
        }

        await Vaccination.create({
          ...vaccinationData,
          studentId: patientId
        }, { transaction });
        
        importedCount++;
      } catch (error) {
        console.error('Error importing vaccination:', error);
      }
    }

    return importedCount;
  }

  /**
   * Import chronic conditions
   */
  private async importChronicConditions(
    conditions: any[],
    patientId: string,
    options: { skipDuplicates: boolean; overwriteExisting: boolean },
    transaction: Transaction
  ): Promise<number> {
    let importedCount = 0;

    for (const conditionData of conditions) {
      try {
        if (options.skipDuplicates) {
          const existing = await ChronicCondition.findOne({
            where: {
              studentId: patientId,
              condition: conditionData.condition,
              icdCode: conditionData.icdCode
            },
            transaction
          });

          if (existing && !options.overwriteExisting) {
            continue;
          }

          if (existing && options.overwriteExisting) {
            await existing.update(conditionData, { transaction });
            importedCount++;
            continue;
          }
        }

        await ChronicCondition.create({
          ...conditionData,
          studentId: patientId
        }, { transaction });
        
        importedCount++;
      } catch (error) {
        console.error('Error importing chronic condition:', error);
      }
    }

    return importedCount;
  }

  /**
   * Convert export data to CSV format
   */
  private convertToCSV(exportData: HealthDataExport): string {
    const csvRows: string[] = [];
    
    // Add header
    csvRows.push('Type,Date,Description,Value,Notes');
    
    // Add health records
    if (exportData.data.healthRecords) {
      exportData.data.healthRecords.forEach(record => {
        csvRows.push([
          'Health Record',
          record.date,
          record.type,
          record.value || '',
          record.notes || ''
        ].map(field => `"${field}"`).join(','));
      });
    }
    
    // Add allergies
    if (exportData.data.allergies) {
      exportData.data.allergies.forEach(allergy => {
        csvRows.push([
          'Allergy',
          allergy.diagnosedDate || '',
          allergy.allergen,
          allergy.severity,
          allergy.notes || ''
        ].map(field => `"${field}"`).join(','));
      });
    }
    
    return csvRows.join('\n');
  }

  /**
   * Generate PDF report (placeholder - would need PDF library)
   */
  private generatePDF(exportData: HealthDataExport): Buffer {
    // This would require a PDF generation library like puppeteer or jsPDF
    throw new Error('PDF export not implemented - requires PDF generation library');
  }

  /**
   * Convert to HL7 format (placeholder - would need HL7 library)
   */
  private convertToHL7(exportData: HealthDataExport): string {
    // This would require an HL7 library for proper formatting
    throw new Error('HL7 export not implemented - requires HL7 formatting library');
  }
}

export const importExportService = new ImportExportService();
export { ImportExportService };
