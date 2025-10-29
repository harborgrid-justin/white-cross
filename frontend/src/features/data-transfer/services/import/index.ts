/**
 * Import Service - Main Entry Point
 *
 * Coordinates import operations with validation, transformation,
 * and error handling for healthcare data.
 */

import { CSVParser, StreamingCSVParser } from './csv-parser';
import { DataValidator, DuplicateDetector } from '../../validation/validator';
import type {
  ImportConfig,
  ImportResult,
  ImportProgress,
  ImportError,
  ImportCheckpoint,
  EntityType,
} from '../../types';

// ============================================================================
// Import Service
// ============================================================================

export class ImportService {
  private importId: string;
  private config: ImportConfig;
  private validator: DataValidator;
  private duplicateDetector: DuplicateDetector;
  private checkpoints: ImportCheckpoint[] = [];
  private progressCallback?: (progress: ImportProgress) => void;

  constructor(
    config: ImportConfig,
    progressCallback?: (progress: ImportProgress) => void
  ) {
    this.importId = crypto.randomUUID();
    this.config = config;
    this.progressCallback = progressCallback;

    // Initialize validator
    this.validator = new DataValidator({
      entityType: config.entityType,
      rules: this.getValidationRules(config.entityType),
    });

    // Initialize duplicate detector
    this.duplicateDetector = new DuplicateDetector({
      uniqueFields: this.getUniqueFields(config.entityType),
    });
  }

  /**
   * Main import method
   */
  async import(file: File): Promise<ImportResult> {
    const startTime = Date.now();
    const result: ImportResult = {
      importId: this.importId,
      status: 'validating',
      entityType: this.config.entityType,
      startedAt: new Date(),
      totalRows: 0,
      processedRows: 0,
      successfulRows: 0,
      failedRows: 0,
      skippedRows: 0,
      errors: [],
      warnings: [],
      checkpoints: [],
      metadata: {},
    };

    try {
      // Update progress
      this.reportProgress({
        importId: this.importId,
        status: 'validating',
        currentRow: 0,
        totalRows: 0,
        percentage: 0,
        throughput: 0,
        errors: 0,
        warnings: 0,
      });

      // Parse file based on format
      const parseResult = await this.parseFile(file);
      result.totalRows = parseResult.totalRows;

      // Add parse errors
      result.errors.push(
        ...parseResult.errors.map((e) => ({
          row: e.row,
          code: 'PARSE_ERROR',
          message: e.message,
          severity: 'error' as const,
        }))
      );

      // Update progress
      this.reportProgress({
        importId: this.importId,
        status: 'processing',
        currentRow: 0,
        totalRows: result.totalRows,
        percentage: 0,
        throughput: 0,
        errors: result.errors.length,
        warnings: 0,
      });

      // Process data in batches
      const batchSize = this.config.options.batchSize;
      const data = parseResult.data;

      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, Math.min(i + batchSize, data.length));

        // Process batch
        const batchResult = await this.processBatch(batch, i + 1);

        result.processedRows += batch.length;
        result.successfulRows += batchResult.successful;
        result.failedRows += batchResult.failed;
        result.skippedRows += batchResult.skipped;
        result.errors.push(...batchResult.errors);
        result.warnings.push(...batchResult.warnings);

        // Create checkpoint
        if (this.config.options.createCheckpoints && i % (batchSize * 5) === 0) {
          const checkpoint: ImportCheckpoint = {
            id: crypto.randomUUID(),
            rowNumber: i + batch.length,
            timestamp: new Date(),
            state: { processedRows: result.processedRows },
          };
          this.checkpoints.push(checkpoint);
        }

        // Check error threshold
        if (
          !this.config.options.skipErrors &&
          result.failedRows >= this.config.options.errorThreshold
        ) {
          result.status = 'failed';
          throw new Error(
            `Error threshold exceeded: ${result.failedRows} errors (threshold: ${this.config.options.errorThreshold})`
          );
        }

        // Report progress
        const elapsed = Date.now() - startTime;
        const throughput = result.processedRows / (elapsed / 1000);
        const estimatedRemaining =
          ((result.totalRows - result.processedRows) / throughput) * 1000;

        this.reportProgress({
          importId: this.importId,
          status: 'processing',
          currentRow: result.processedRows,
          totalRows: result.totalRows,
          percentage: (result.processedRows / result.totalRows) * 100,
          throughput,
          estimatedTimeRemaining: estimatedRemaining,
          errors: result.errors.length,
          warnings: result.warnings.length,
        });
      }

      result.status = 'completed';
      result.completedAt = new Date();
      result.checkpoints = this.checkpoints;

      // Report final progress
      this.reportProgress({
        importId: this.importId,
        status: 'completed',
        currentRow: result.totalRows,
        totalRows: result.totalRows,
        percentage: 100,
        throughput: result.processedRows / ((Date.now() - startTime) / 1000),
        errors: result.errors.length,
        warnings: result.warnings.length,
      });

      return result;
    } catch (error) {
      result.status = 'failed';
      result.completedAt = new Date();

      result.errors.push({
        row: 0,
        code: 'IMPORT_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
        severity: 'critical',
      });

      return result;
    }
  }

  /**
   * Parses file based on format configuration
   */
  private async parseFile(file: File) {
    const { format, mapping } = this.config;

    switch (format.type) {
      case 'csv': {
        const parser = new CSVParser({
          delimiter: format.delimiter,
          hasHeader: format.hasHeader,
          encoding: format.encoding,
          batchSize: this.config.options.batchSize,
        });

        return await parser.parseFile(file, mapping, (progress) => {
          this.reportProgress({
            importId: this.importId,
            status: 'validating',
            currentRow: progress.currentRow ?? 0,
            totalRows: progress.totalRows ?? 0,
            percentage: progress.percentage ?? 0,
            throughput: 0,
            errors: 0,
            warnings: 0,
          });
        });
      }

      case 'excel':
        // TODO: Implement Excel parser
        throw new Error('Excel format not yet implemented');

      case 'json':
        // TODO: Implement JSON parser
        throw new Error('JSON format not yet implemented');

      default:
        throw new Error(`Unsupported format: ${(format as { type: string }).type}`);
    }
  }

  /**
   * Processes a batch of records
   */
  private async processBatch(
    batch: Array<Record<string, unknown>>,
    startRow: number
  ): Promise<{
    successful: number;
    failed: number;
    skipped: number;
    errors: ImportError[];
    warnings: typeof this.config extends ImportConfig ? ImportResult['warnings'] : never[];
  }> {
    let successful = 0;
    let failed = 0;
    let skipped = 0;
    const errors: ImportError[] = [];
    const warnings: ImportResult['warnings'] = [];

    for (let i = 0; i < batch.length; i++) {
      const record = batch[i];
      const rowNumber = startRow + i;

      try {
        // Validate record
        const validationResult = this.validator.validate(record, rowNumber);

        if (!validationResult.valid) {
          errors.push(
            ...validationResult.errors.map((e) => ({
              row: rowNumber,
              field: e.field,
              code: e.code,
              message: e.message,
              severity: 'error' as const,
              data: e.value,
            }))
          );

          failed++;

          if (!this.config.options.skipErrors) {
            continue;
          }
        }

        warnings.push(...validationResult.warnings);

        // Check for duplicates
        if (this.duplicateDetector.isDuplicate(record, rowNumber)) {
          const originalRow = this.duplicateDetector.getOriginalRow(record);

          switch (this.config.options.duplicateStrategy) {
            case 'skip':
              skipped++;
              warnings.push({
                row: rowNumber,
                message: `Duplicate record (original at row ${originalRow})`,
              });
              continue;

            case 'error':
              errors.push({
                row: rowNumber,
                code: 'DUPLICATE_RECORD',
                message: `Duplicate record (original at row ${originalRow})`,
                severity: 'error',
              });
              failed++;
              continue;

            case 'update':
              // TODO: Implement update logic
              break;

            case 'prompt':
              // TODO: Implement prompt logic
              break;
          }
        }

        // If validate-only mode, don't insert
        if (this.config.options.validateOnly) {
          successful++;
          continue;
        }

        // TODO: Insert record into database
        // await this.insertRecord(record);

        successful++;
      } catch (error) {
        errors.push({
          row: rowNumber,
          code: 'PROCESSING_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          severity: 'error',
        });
        failed++;
      }
    }

    return { successful, failed, skipped, errors, warnings };
  }

  /**
   * Reports progress to callback
   */
  private reportProgress(progress: ImportProgress): void {
    if (this.progressCallback) {
      this.progressCallback(progress);
    }
  }

  /**
   * Gets validation rules for entity type
   */
  private getValidationRules(entityType: EntityType) {
    // TODO: Define validation rules for each entity type
    return [];
  }

  /**
   * Gets unique fields for entity type
   */
  private getUniqueFields(entityType: EntityType): string[] {
    const uniqueFieldsMap: Record<EntityType, string[]> = {
      students: ['studentId', 'email'],
      medications: ['medicationId', 'name'],
      'health-records': ['recordId'],
      immunizations: ['immunizationId', 'studentId', 'vaccineName', 'date'],
      allergies: ['allergyId', 'studentId', 'allergen'],
      appointments: ['appointmentId'],
      'emergency-contacts': ['contactId', 'studentId', 'email'],
      incidents: ['incidentId'],
      documents: ['documentId', 'fileName'],
    };

    return uniqueFieldsMap[entityType] || [];
  }
}

// Export parsers
export { CSVParser, StreamingCSVParser };
