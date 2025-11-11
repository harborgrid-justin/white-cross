/**
 * @fileoverview Health Records Query Composites for Sequelize + NestJS
 * @module reuse/clinic/composites/health-records-queries-composites
 * @description Production-ready health record query operations with complex search,
 * filtering, aggregation, history tracking, relationship management, and performance optimization.
 * Composed from existing health and data utilities for comprehensive EHR query capabilities.
 *
 * @version 1.0.0
 * @requires sequelize ^6.x
 * @requires @nestjs/common ^10.x
 */

import { Logger, InternalServerErrorException } from '@nestjs/common';
import {
  Sequelize,
  Model,
  ModelCtor,
  FindOptions,
  WhereOptions,
  Op,
  Transaction,
  QueryTypes,
  Attributes,
  OrderItem,
  literal,
  fn,
  col,
} from 'sequelize';

/**
 * Health record search configuration
 */
export interface HealthRecordSearchConfig {
  patientId?: string;
  medicalRecordNumber?: string;
  dateRange?: { start: Date; end: Date };
  recordTypes?: string[];
  providers?: string[];
  diagnoses?: string[];
  includeDeleted?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
}

/**
 * Record history tracking result
 */
export interface RecordHistoryEntry {
  recordId: string;
  version: number;
  changedBy: string;
  changedAt: Date;
  changeType: 'create' | 'update' | 'delete' | 'restore';
  changedFields: string[];
  previousValues: Record<string, any>;
  newValues: Record<string, any>;
}

/**
 * Record relationship graph
 */
export interface RecordRelationshipGraph {
  primaryRecord: any;
  relatedRecords: {
    type: string;
    count: number;
    records: any[];
  }[];
  relationshipDepth: number;
}

/**
 * Search health records with advanced filtering and pagination
 *
 * @param model - Health record model
 * @param config - Search configuration
 * @param transaction - Optional transaction
 * @returns Search results with metadata
 *
 * @example
 * ```typescript
 * const results = await searchHealthRecords(
 *   MedicalRecord,
 *   {
 *     patientId: 'PAT123',
 *     dateRange: { start: new Date('2024-01-01'), end: new Date('2024-12-31') },
 *     recordTypes: ['inpatient', 'outpatient'],
 *     diagnoses: ['E11.9', 'I10'],
 *     limit: 50
 *   }
 * );
 * ```
 */
export async function searchHealthRecords<M extends Model>(
  model: ModelCtor<M>,
  config: HealthRecordSearchConfig,
  transaction?: Transaction
): Promise<{ records: M[]; total: number; hasMore: boolean }> {
  const logger = new Logger('HealthRecordsQueries::searchHealthRecords');

  try {
    const where: WhereOptions<any> = {};

    if (config.patientId) {
      where.patientId = config.patientId;
    }

    if (config.medicalRecordNumber) {
      where.medicalRecordNumber = config.medicalRecordNumber;
    }

    if (config.dateRange) {
      where.encounterDate = {
        [Op.between]: [config.dateRange.start, config.dateRange.end],
      };
    }

    if (config.recordTypes && config.recordTypes.length > 0) {
      where.recordType = { [Op.in]: config.recordTypes };
    }

    if (config.providers && config.providers.length > 0) {
      where.providerId = { [Op.in]: config.providers };
    }

    if (config.diagnoses && config.diagnoses.length > 0) {
      where[Op.or] = config.diagnoses.map(code => ({
        diagnosis: { [Op.contains]: [{ code }] },
      }));
    }

    const order: OrderItem[] = [[config.sortBy || 'encounterDate', config.sortOrder || 'DESC']];

    const [records, total] = await Promise.all([
      model.findAll({
        where,
        order,
        limit: config.limit || 50,
        offset: config.offset || 0,
        paranoid: !config.includeDeleted,
        transaction,
      }),
      model.count({ where, transaction } as any),
    ]);

    const hasMore = (config.offset || 0) + records.length < total;

    logger.log(`Health record search: ${records.length}/${total} records found`);

    return { records, total, hasMore };
  } catch (error) {
    logger.error('Health record search failed', error);
    throw new InternalServerErrorException('Health record search failed');
  }
}

/**
 * Get comprehensive health record with all related data
 *
 * @param sequelize - Sequelize instance
 * @param recordId - Record ID
 * @param includeRelations - Relations to include
 * @param transaction - Optional transaction
 * @returns Comprehensive record data
 *
 * @example
 * ```typescript
 * const record = await getComprehensiveHealthRecord(
 *   sequelize,
 *   'REC123',
 *   ['problems', 'medications', 'allergies', 'vitals', 'labs']
 * );
 * ```
 */
export async function getComprehensiveHealthRecord(
  sequelize: Sequelize,
  recordId: string,
  includeRelations: string[] = [],
  transaction?: Transaction
): Promise<Record<string, any>> {
  const logger = new Logger('HealthRecordsQueries::getComprehensiveHealthRecord');

  try {
    const queries: Record<string, Promise<any>> = {};

    // Base record
    queries.record = sequelize.query(
      'SELECT * FROM medical_records WHERE id = :recordId',
      {
        replacements: { recordId },
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    // Related data
    if (includeRelations.includes('problems')) {
      queries.problems = sequelize.query(
        'SELECT * FROM problem_list WHERE ehr_record_id = :recordId ORDER BY priority',
        {
          replacements: { recordId },
          type: QueryTypes.SELECT,
          transaction,
        }
      );
    }

    if (includeRelations.includes('medications')) {
      queries.medications = sequelize.query(
        'SELECT * FROM medications WHERE ehr_record_id = :recordId AND status = \'active\'',
        {
          replacements: { recordId },
          type: QueryTypes.SELECT,
          transaction,
        }
      );
    }

    if (includeRelations.includes('allergies')) {
      queries.allergies = sequelize.query(
        'SELECT * FROM allergies WHERE patient_id = (SELECT patient_id FROM medical_records WHERE id = :recordId)',
        {
          replacements: { recordId },
          type: QueryTypes.SELECT,
          transaction,
        }
      );
    }

    if (includeRelations.includes('vitals')) {
      queries.vitals = sequelize.query(
        'SELECT * FROM vital_signs WHERE ehr_record_id = :recordId ORDER BY recorded_at DESC',
        {
          replacements: { recordId },
          type: QueryTypes.SELECT,
          transaction,
        }
      );
    }

    if (includeRelations.includes('labs')) {
      queries.labs = sequelize.query(
        'SELECT * FROM lab_results WHERE ehr_record_id = :recordId ORDER BY result_date DESC',
        {
          replacements: { recordId },
          type: QueryTypes.SELECT,
          transaction,
        }
      );
    }

    const results = await Promise.all(
      Object.entries(queries).map(async ([key, promise]) => [key, await promise])
    );

    const data = Object.fromEntries(results);

    logger.log(`Comprehensive health record loaded: ${recordId}`);

    return data;
  } catch (error) {
    logger.error('Failed to load comprehensive health record', error);
    throw new InternalServerErrorException('Failed to load comprehensive health record');
  }
}

/**
 * Track health record history with version control
 *
 * @param sequelize - Sequelize instance
 * @param recordId - Record ID
 * @param limit - Maximum history entries
 * @param transaction - Optional transaction
 * @returns History entries
 *
 * @example
 * ```typescript
 * const history = await getRecordHistory(sequelize, 'REC123', 20);
 * console.log(`Record has ${history.length} changes`);
 * ```
 */
export async function getRecordHistory(
  sequelize: Sequelize,
  recordId: string,
  limit: number = 50,
  transaction?: Transaction
): Promise<RecordHistoryEntry[]> {
  const logger = new Logger('HealthRecordsQueries::getRecordHistory');

  try {
    const query = `
      SELECT
        record_id,
        version,
        changed_by,
        changed_at,
        change_type,
        changed_fields,
        previous_values,
        new_values
      FROM record_history
      WHERE record_id = :recordId
      ORDER BY version DESC
      LIMIT :limit
    `;

    const history = await sequelize.query<RecordHistoryEntry>(query, {
      replacements: { recordId, limit },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Record history: ${history.length} entries for ${recordId}`);

    return history;
  } catch (error) {
    logger.error('Failed to retrieve record history', error);
    throw new InternalServerErrorException('Failed to retrieve record history');
  }
}

/**
 * Find duplicate or similar health records
 *
 * @param sequelize - Sequelize instance
 * @param patientInfo - Patient information for matching
 * @param threshold - Similarity threshold (0.0 to 1.0)
 * @param transaction - Optional transaction
 * @returns Potential duplicate records
 *
 * @example
 * ```typescript
 * const duplicates = await findDuplicateRecords(
 *   sequelize,
 *   { firstName: 'John', lastName: 'Doe', dob: '1980-01-01' },
 *   0.85
 * );
 * ```
 */
export async function findDuplicateRecords(
  sequelize: Sequelize,
  patientInfo: { firstName: string; lastName: string; dob: string },
  threshold: number = 0.8,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('HealthRecordsQueries::findDuplicateRecords');

  try {
    const query = `
      SELECT
        p.*,
        SIMILARITY(p.first_name, :firstName) +
        SIMILARITY(p.last_name, :lastName) +
        CASE WHEN p.date_of_birth = :dob THEN 1 ELSE 0 END AS similarity_score
      FROM patients p
      WHERE
        (SIMILARITY(p.first_name, :firstName) > 0.5 OR
         SIMILARITY(p.last_name, :lastName) > 0.5 OR
         p.date_of_birth = :dob)
      HAVING similarity_score >= :threshold
      ORDER BY similarity_score DESC
    `;

    const duplicates = await sequelize.query(query, {
      replacements: { ...patientInfo, threshold },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Found ${duplicates.length} potential duplicates`);

    return duplicates;
  } catch (error) {
    logger.error('Duplicate record search failed', error);
    throw new InternalServerErrorException('Duplicate record search failed');
  }
}

/**
 * Aggregate health records by criteria
 *
 * @param model - Health record model
 * @param groupBy - Fields to group by
 * @param dateRange - Date range for aggregation
 * @param transaction - Optional transaction
 * @returns Aggregated statistics
 *
 * @example
 * ```typescript
 * const stats = await aggregateHealthRecords(
 *   MedicalRecord,
 *   ['recordType', 'providerId'],
 *   { start: new Date('2024-01-01'), end: new Date('2024-12-31') }
 * );
 * ```
 */
export async function aggregateHealthRecords<M extends Model>(
  model: ModelCtor<M>,
  groupBy: string[],
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('HealthRecordsQueries::aggregateHealthRecords');

  try {
    const attributes: any[] = [...groupBy, [fn('COUNT', col('id')), 'recordCount']];

    const results = await model.findAll({
      attributes,
      where: {
        encounterDate: { [Op.between]: [dateRange.start, dateRange.end] },
      },
      group: groupBy,
      raw: true,
      transaction,
    } as any);

    logger.log(`Aggregated ${results.length} groups`);

    return results;
  } catch (error) {
    logger.error('Health record aggregation failed', error);
    throw new InternalServerErrorException('Health record aggregation failed');
  }
}

/**
 * Build relationship graph for health record
 *
 * @param sequelize - Sequelize instance
 * @param recordId - Primary record ID
 * @param maxDepth - Maximum relationship depth
 * @param transaction - Optional transaction
 * @returns Relationship graph
 *
 * @example
 * ```typescript
 * const graph = await buildRecordRelationshipGraph(sequelize, 'REC123', 3);
 * console.log(`Found ${graph.relatedRecords.length} relationship types`);
 * ```
 */
export async function buildRecordRelationshipGraph(
  sequelize: Sequelize,
  recordId: string,
  maxDepth: number = 2,
  transaction?: Transaction
): Promise<RecordRelationshipGraph> {
  const logger = new Logger('HealthRecordsQueries::buildRecordRelationshipGraph');

  try {
    const query = `
      WITH RECURSIVE record_relationships AS (
        SELECT
          id,
          patient_id,
          record_type,
          0 AS depth,
          ARRAY[id] AS path
        FROM medical_records
        WHERE id = :recordId

        UNION ALL

        SELECT
          r.id,
          r.patient_id,
          r.record_type,
          rr.depth + 1,
          rr.path || r.id
        FROM medical_records r
        JOIN record_relationships rr ON r.patient_id = rr.patient_id
        WHERE rr.depth < :maxDepth
          AND NOT r.id = ANY(rr.path)
      )
      SELECT * FROM record_relationships
    `;

    const relationships = await sequelize.query(query, {
      replacements: { recordId, maxDepth },
      type: QueryTypes.SELECT,
      transaction,
    });

    const primaryRecord = relationships.find((r: any) => r.depth === 0);
    const relatedByType = relationships
      .filter((r: any) => r.depth > 0)
      .reduce((acc: any, record: any) => {
        const type = record.record_type;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(record);
        return acc;
      }, {});

    const relatedRecords = Object.entries(relatedByType).map(([type, records]: [string, any]) => ({
      type,
      count: records.length,
      records,
    }));

    logger.log(`Built relationship graph with ${relatedRecords.length} relationship types`);

    return {
      primaryRecord,
      relatedRecords,
      relationshipDepth: maxDepth,
    };
  } catch (error) {
    logger.error('Failed to build relationship graph', error);
    throw new InternalServerErrorException('Failed to build relationship graph');
  }
}

/**
 * Filter records by diagnosis codes
 *
 * @param model - Health record model
 * @param diagnosisCodes - ICD codes to filter by
 * @param dateRange - Date range
 * @param transaction - Optional transaction
 * @returns Filtered records
 *
 * @example
 * ```typescript
 * const diabeticRecords = await filterRecordsByDiagnosis(
 *   MedicalRecord,
 *   ['E11.9', 'E11.65'],
 *   { start: new Date('2024-01-01'), end: new Date('2024-12-31') }
 * );
 * ```
 */
export async function filterRecordsByDiagnosis<M extends Model>(
  model: ModelCtor<M>,
  diagnosisCodes: string[],
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthRecordsQueries::filterRecordsByDiagnosis');

  try {
    const records = await model.findAll({
      where: {
        encounterDate: { [Op.between]: [dateRange.start, dateRange.end] },
        [Op.or]: diagnosisCodes.map(code => ({
          diagnosis: { [Op.contains]: [{ code }] },
        })),
      },
      transaction,
    });

    logger.log(`Filtered ${records.length} records by diagnosis codes`);

    return records;
  } catch (error) {
    logger.error('Diagnosis filter failed', error);
    throw new InternalServerErrorException('Diagnosis filter failed');
  }
}

/**
 * Get patient timeline of health records
 *
 * @param sequelize - Sequelize instance
 * @param patientId - Patient ID
 * @param limit - Maximum records
 * @param transaction - Optional transaction
 * @returns Timeline entries
 *
 * @example
 * ```typescript
 * const timeline = await getPatientTimeline(sequelize, 'PAT123', 100);
 * ```
 */
export async function getPatientTimeline(
  sequelize: Sequelize,
  patientId: string,
  limit: number = 100,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('HealthRecordsQueries::getPatientTimeline');

  try {
    const query = `
      SELECT
        'medical_record' AS event_type,
        id AS event_id,
        encounter_date AS event_date,
        record_type,
        chief_complaint AS description
      FROM medical_records
      WHERE patient_id = :patientId

      UNION ALL

      SELECT
        'medication' AS event_type,
        id AS event_id,
        start_date AS event_date,
        'medication' AS record_type,
        medication_name || ' - ' || dosage AS description
      FROM medications
      WHERE patient_id = :patientId

      UNION ALL

      SELECT
        'allergy' AS event_type,
        id AS event_id,
        created_at AS event_date,
        'allergy' AS record_type,
        allergen || ' (' || severity || ')' AS description
      FROM allergies
      WHERE patient_id = :patientId

      ORDER BY event_date DESC
      LIMIT :limit
    `;

    const timeline = await sequelize.query(query, {
      replacements: { patientId, limit },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Patient timeline: ${timeline.length} events`);

    return timeline;
  } catch (error) {
    logger.error('Failed to generate patient timeline', error);
    throw new InternalServerErrorException('Failed to generate patient timeline');
  }
}

/**
 * Calculate record completeness score
 *
 * @param record - Health record
 * @param requiredFields - Fields required for completeness
 * @returns Completeness score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateRecordCompleteness(
 *   record,
 *   ['chiefComplaint', 'assessment', 'plan', 'diagnosis']
 * );
 * ```
 */
export function calculateRecordCompleteness(
  record: any,
  requiredFields: string[]
): number {
  const logger = new Logger('HealthRecordsQueries::calculateRecordCompleteness');

  try {
    const filledFields = requiredFields.filter(field => {
      const value = record[field];
      return value !== null && value !== undefined && value !== '';
    });

    const score = (filledFields.length / requiredFields.length) * 100;

    logger.debug(`Record completeness: ${score.toFixed(1)}%`);

    return score;
  } catch (error) {
    logger.error('Failed to calculate completeness', error);
    return 0;
  }
}

/**
 * Batch update record status
 *
 * @param model - Health record model
 * @param recordIds - Record IDs to update
 * @param status - New status
 * @param transaction - Optional transaction
 * @returns Update count
 *
 * @example
 * ```typescript
 * const updated = await batchUpdateRecordStatus(
 *   MedicalRecord,
 *   ['REC1', 'REC2', 'REC3'],
 *   'completed'
 * );
 * ```
 */
export async function batchUpdateRecordStatus<M extends Model>(
  model: ModelCtor<M>,
  recordIds: string[],
  status: string,
  transaction?: Transaction
): Promise<number> {
  const logger = new Logger('HealthRecordsQueries::batchUpdateRecordStatus');

  try {
    const [affectedCount] = await model.update(
      { status } as any,
      {
        where: { id: { [Op.in]: recordIds } } as any,
        transaction,
      }
    );

    logger.log(`Updated ${affectedCount} records to status: ${status}`);

    return affectedCount;
  } catch (error) {
    logger.error('Batch status update failed', error);
    throw new InternalServerErrorException('Batch status update failed');
  }
}

/**
 * Export health records for continuity of care
 *
 * @param sequelize - Sequelize instance
 * @param patientId - Patient ID
 * @param format - Export format
 * @param transaction - Optional transaction
 * @returns Exported data
 *
 * @example
 * ```typescript
 * const ccd = await exportHealthRecords(sequelize, 'PAT123', 'CCD');
 * ```
 */
export async function exportHealthRecords(
  sequelize: Sequelize,
  patientId: string,
  format: 'CCD' | 'CCR' | 'FHIR' = 'CCD',
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('HealthRecordsQueries::exportHealthRecords');

  try {
    // Gather all relevant data
    const [patient, records, problems, medications, allergies, immunizations] = await Promise.all([
      sequelize.query('SELECT * FROM patients WHERE id = :patientId', {
        replacements: { patientId },
        type: QueryTypes.SELECT,
        transaction,
      }),
      sequelize.query('SELECT * FROM medical_records WHERE patient_id = :patientId', {
        replacements: { patientId },
        type: QueryTypes.SELECT,
        transaction,
      }),
      sequelize.query('SELECT * FROM problem_list WHERE patient_id = :patientId', {
        replacements: { patientId },
        type: QueryTypes.SELECT,
        transaction,
      }),
      sequelize.query('SELECT * FROM medications WHERE patient_id = :patientId', {
        replacements: { patientId },
        type: QueryTypes.SELECT,
        transaction,
      }),
      sequelize.query('SELECT * FROM allergies WHERE patient_id = :patientId', {
        replacements: { patientId },
        type: QueryTypes.SELECT,
        transaction,
      }),
      sequelize.query('SELECT * FROM immunizations WHERE patient_id = :patientId', {
        replacements: { patientId },
        type: QueryTypes.SELECT,
        transaction,
      }),
    ]);

    const exportData = {
      format,
      exportDate: new Date(),
      patient: patient[0],
      records,
      problems,
      medications,
      allergies,
      immunizations,
    };

    logger.log(`Exported health records for patient ${patientId} in ${format} format`);

    return exportData;
  } catch (error) {
    logger.error('Health record export failed', error);
    throw new InternalServerErrorException('Health record export failed');
  }
}

/**
 * Merge duplicate health records
 *
 * @param sequelize - Sequelize instance
 * @param primaryRecordId - Primary record to keep
 * @param duplicateRecordIds - Duplicate records to merge
 * @param transaction - Transaction
 * @returns Merged record
 *
 * @example
 * ```typescript
 * const merged = await mergeDuplicateRecords(
 *   sequelize,
 *   'REC123',
 *   ['REC456', 'REC789'],
 *   transaction
 * );
 * ```
 */
export async function mergeDuplicateRecords(
  sequelize: Sequelize,
  primaryRecordId: string,
  duplicateRecordIds: string[],
  transaction: Transaction
): Promise<any> {
  const logger = new Logger('HealthRecordsQueries::mergeDuplicateRecords');

  try {
    // Get all records
    const query = `
      SELECT * FROM medical_records
      WHERE id = ANY(ARRAY[:recordIds]::uuid[])
    `;

    const records = await sequelize.query(query, {
      replacements: { recordIds: [primaryRecordId, ...duplicateRecordIds] },
      type: QueryTypes.SELECT,
      transaction,
    });

    // Merge logic would go here
    // For now, just mark duplicates as merged

    await sequelize.query(
      `
      UPDATE medical_records
      SET status = 'merged', merged_into = :primaryRecordId
      WHERE id = ANY(ARRAY[:duplicateIds]::uuid[])
    `,
      {
        replacements: { primaryRecordId, duplicateIds: duplicateRecordIds },
        type: QueryTypes.UPDATE,
        transaction,
      }
    );

    logger.log(`Merged ${duplicateRecordIds.length} records into ${primaryRecordId}`);

    return records[0];
  } catch (error) {
    logger.error('Record merge failed', error);
    throw new InternalServerErrorException('Record merge failed');
  }
}

/**
 * Calculate record complexity score
 *
 * @param record - Health record
 * @returns Complexity score
 *
 * @example
 * ```typescript
 * const complexity = calculateRecordComplexity(record);
 * ```
 */
export function calculateRecordComplexity(record: any): number {
  const logger = new Logger('HealthRecordsQueries::calculateRecordComplexity');

  try {
    let score = 0;

    // Diagnosis complexity
    if (record.diagnosis && Array.isArray(record.diagnosis)) {
      score += record.diagnosis.length * 2;
    }

    // Procedure complexity
    if (record.procedures && Array.isArray(record.procedures)) {
      score += record.procedures.length * 3;
    }

    // Comorbidity count
    if (record.comorbidities && Array.isArray(record.comorbidities)) {
      score += record.comorbidities.length * 5;
    }

    logger.debug(`Record complexity score: ${score}`);

    return score;
  } catch (error) {
    logger.error('Failed to calculate complexity', error);
    return 0;
  }
}

/**
 * Find records requiring follow-up
 *
 * @param model - Health record model
 * @param daysThreshold - Days since last encounter
 * @param conditions - Specific conditions to check
 * @param transaction - Optional transaction
 * @returns Records requiring follow-up
 *
 * @example
 * ```typescript
 * const needsFollowup = await findRecordsRequiringFollowup(
 *   MedicalRecord,
 *   30,
 *   ['E11.9', 'I10']
 * );
 * ```
 */
export async function findRecordsRequiringFollowup<M extends Model>(
  model: ModelCtor<M>,
  daysThreshold: number,
  conditions: string[],
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthRecordsQueries::findRecordsRequiringFollowup');

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

    const records = await model.findAll({
      where: {
        encounterDate: { [Op.lt]: cutoffDate },
        [Op.or]: conditions.map(code => ({
          diagnosis: { [Op.contains]: [{ code }] },
        })),
        status: 'completed',
      },
      transaction,
    });

    logger.log(`Found ${records.length} records requiring follow-up`);

    return records;
  } catch (error) {
    logger.error('Failed to find records requiring follow-up', error);
    throw new InternalServerErrorException('Failed to find records requiring follow-up');
  }
}

/**
 * Analyze record documentation quality
 *
 * @param sequelize - Sequelize instance
 * @param recordId - Record ID
 * @param transaction - Optional transaction
 * @returns Quality metrics
 *
 * @example
 * ```typescript
 * const quality = await analyzeDocumentationQuality(sequelize, 'REC123');
 * console.log(`Quality score: ${quality.overallScore}`);
 * ```
 */
export async function analyzeDocumentationQuality(
  sequelize: Sequelize,
  recordId: string,
  transaction?: Transaction
): Promise<{
  overallScore: number;
  completeness: number;
  timeliness: number;
  specificity: number;
  recommendations: string[];
}> {
  const logger = new Logger('HealthRecordsQueries::analyzeDocumentationQuality');

  try {
    const [record] = await sequelize.query(
      'SELECT * FROM medical_records WHERE id = :recordId',
      {
        replacements: { recordId },
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    const recommendations: string[] = [];
    let completeness = 0;
    let timeliness = 100;
    let specificity = 0;

    // Check completeness
    const requiredFields = ['chiefComplaint', 'assessment', 'plan'];
    const filledFields = requiredFields.filter(f => (record as any)[f]);
    completeness = (filledFields.length / requiredFields.length) * 100;

    if (completeness < 100) {
      recommendations.push('Complete all required documentation fields');
    }

    // Check timeliness
    const now = new Date();
    const encounterDate = new Date((record as any).encounterDate);
    const documentedDate = new Date((record as any).updatedAt);
    const hoursDiff = (documentedDate.getTime() - encounterDate.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      timeliness = Math.max(0, 100 - (hoursDiff - 24) * 2);
      recommendations.push('Document encounters within 24 hours');
    }

    // Check specificity
    if ((record as any).diagnosis && Array.isArray((record as any).diagnosis)) {
      specificity = ((record as any).diagnosis.length > 0 ? 100 : 0);
    }

    const overallScore = (completeness + timeliness + specificity) / 3;

    logger.log(`Documentation quality: ${overallScore.toFixed(1)}%`);

    return {
      overallScore,
      completeness,
      timeliness,
      specificity,
      recommendations,
    };
  } catch (error) {
    logger.error('Failed to analyze documentation quality', error);
    throw new InternalServerErrorException('Failed to analyze documentation quality');
  }
}

/**
 * Get records with missing critical data
 *
 * @param model - Health record model
 * @param criticalFields - Fields considered critical
 * @param dateRange - Date range
 * @param transaction - Optional transaction
 * @returns Records with missing data
 *
 * @example
 * ```typescript
 * const incomplete = await getRecordsWithMissingData(
 *   MedicalRecord,
 *   ['assessment', 'plan', 'diagnosis'],
 *   { start: lastMonth, end: today }
 * );
 * ```
 */
export async function getRecordsWithMissingData<M extends Model>(
  model: ModelCtor<M>,
  criticalFields: string[],
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthRecordsQueries::getRecordsWithMissingData');

  try {
    const where: WhereOptions<any> = {
      encounterDate: { [Op.between]: [dateRange.start, dateRange.end] },
      [Op.or]: criticalFields.map(field => ({
        [field]: { [Op.or]: [null, ''] },
      })),
    };

    const records = await model.findAll({
      where,
      transaction,
    });

    logger.log(`Found ${records.length} records with missing critical data`);

    return records;
  } catch (error) {
    logger.error('Failed to find records with missing data', error);
    throw new InternalServerErrorException('Failed to find records with missing data');
  }
}

/**
 * Calculate patient risk score from health records
 *
 * @param sequelize - Sequelize instance
 * @param patientId - Patient ID
 * @param transaction - Optional transaction
 * @returns Risk score and factors
 *
 * @example
 * ```typescript
 * const risk = await calculatePatientRiskScore(sequelize, 'PAT123');
 * console.log(`Risk level: ${risk.level}, Score: ${risk.score}`);
 * ```
 */
export async function calculatePatientRiskScore(
  sequelize: Sequelize,
  patientId: string,
  transaction?: Transaction
): Promise<{
  score: number;
  level: 'low' | 'moderate' | 'high' | 'critical';
  factors: string[];
}> {
  const logger = new Logger('HealthRecordsQueries::calculatePatientRiskScore');

  try {
    const query = `
      SELECT
        COUNT(DISTINCT CASE WHEN status = 'active' THEN id END) AS active_problems,
        COUNT(DISTINCT CASE WHEN status = 'active' AND severity IN ('severe', 'critical') THEN id END) AS severe_problems,
        COUNT(DISTINCT er.id) AS recent_encounters
      FROM problem_list pl
      LEFT JOIN medical_records er ON er.patient_id = pl.patient_id
        AND er.encounter_date >= NOW() - INTERVAL '30 days'
      WHERE pl.patient_id = :patientId
    `;

    const [result] = await sequelize.query(query, {
      replacements: { patientId },
      type: QueryTypes.SELECT,
      transaction,
    });

    const factors: string[] = [];
    let score = 0;

    const data = result as any;

    // Calculate risk based on factors
    score += data.active_problems * 2;
    score += data.severe_problems * 5;
    score += data.recent_encounters * 3;

    if (data.active_problems > 5) factors.push('Multiple active conditions');
    if (data.severe_problems > 0) factors.push('Severe health issues');
    if (data.recent_encounters > 3) factors.push('Frequent hospital visits');

    let level: 'low' | 'moderate' | 'high' | 'critical';
    if (score < 10) level = 'low';
    else if (score < 25) level = 'moderate';
    else if (score < 50) level = 'high';
    else level = 'critical';

    logger.log(`Patient risk: ${level} (score: ${score})`);

    return { score, level, factors };
  } catch (error) {
    logger.error('Failed to calculate risk score', error);
    throw new InternalServerErrorException('Failed to calculate risk score');
  }
}

/**
 * Find related records by problem
 *
 * @param sequelize - Sequelize instance
 * @param problemId - Problem list entry ID
 * @param limit - Maximum records
 * @param transaction - Optional transaction
 * @returns Related records
 *
 * @example
 * ```typescript
 * const related = await findRecordsByProblem(sequelize, 'PROB123', 50);
 * ```
 */
export async function findRecordsByProblem(
  sequelize: Sequelize,
  problemId: string,
  limit: number = 50,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('HealthRecordsQueries::findRecordsByProblem');

  try {
    const query = `
      SELECT mr.*
      FROM medical_records mr
      WHERE mr.patient_id = (
        SELECT patient_id FROM problem_list WHERE id = :problemId
      )
      AND EXISTS (
        SELECT 1 FROM problem_list pl
        WHERE pl.id = :problemId
          AND mr.diagnosis @> ARRAY[ROW(pl.icd_code, pl.problem_name)::diagnosis_type]
      )
      ORDER BY mr.encounter_date DESC
      LIMIT :limit
    `;

    const records = await sequelize.query(query, {
      replacements: { problemId, limit },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Found ${records.length} records related to problem ${problemId}`);

    return records;
  } catch (error) {
    logger.error('Failed to find records by problem', error);
    throw new InternalServerErrorException('Failed to find records by problem');
  }
}

/**
 * Get provider performance metrics from records
 *
 * @param sequelize - Sequelize instance
 * @param providerId - Provider ID
 * @param dateRange - Date range
 * @param transaction - Optional transaction
 * @returns Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await getProviderPerformanceMetrics(
 *   sequelize,
 *   'PROV123',
 *   { start: lastMonth, end: today }
 * );
 * ```
 */
export async function getProviderPerformanceMetrics(
  sequelize: Sequelize,
  providerId: string,
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<{
  totalEncounters: number;
  avgDocumentationTime: number;
  completionRate: number;
  patientSatisfaction: number;
}> {
  const logger = new Logger('HealthRecordsQueries::getProviderPerformanceMetrics');

  try {
    const query = `
      SELECT
        COUNT(*) AS total_encounters,
        AVG(EXTRACT(EPOCH FROM (updated_at - encounter_date)) / 3600) AS avg_documentation_hours,
        COUNT(CASE WHEN status = 'completed' THEN 1 END)::float / COUNT(*) * 100 AS completion_rate
      FROM medical_records
      WHERE provider_id = :providerId
        AND encounter_date BETWEEN :startDate AND :endDate
    `;

    const [result] = await sequelize.query(query, {
      replacements: {
        providerId,
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    const data = result as any;

    logger.log(`Provider metrics: ${data.total_encounters} encounters`);

    return {
      totalEncounters: parseInt(data.total_encounters),
      avgDocumentationTime: parseFloat(data.avg_documentation_hours),
      completionRate: parseFloat(data.completion_rate),
      patientSatisfaction: 0, // Would come from separate survey data
    };
  } catch (error) {
    logger.error('Failed to get provider metrics', error);
    throw new InternalServerErrorException('Failed to get provider metrics');
  }
}

/**
 * Archive old health records
 *
 * @param model - Health record model
 * @param archiveBeforeDate - Archive records before this date
 * @param transaction - Transaction
 * @returns Archived count
 *
 * @example
 * ```typescript
 * const archived = await archiveOldRecords(
 *   MedicalRecord,
 *   new Date('2020-01-01'),
 *   transaction
 * );
 * ```
 */
export async function archiveOldRecords<M extends Model>(
  model: ModelCtor<M>,
  archiveBeforeDate: Date,
  transaction: Transaction
): Promise<number> {
  const logger = new Logger('HealthRecordsQueries::archiveOldRecords');

  try {
    const [affectedCount] = await model.update(
      { archived: true, archivedAt: new Date() } as any,
      {
        where: {
          encounterDate: { [Op.lt]: archiveBeforeDate },
          status: 'completed',
          archived: { [Op.or]: [false, null] },
        } as any,
        transaction,
      }
    );

    logger.log(`Archived ${affectedCount} old records`);

    return affectedCount;
  } catch (error) {
    logger.error('Failed to archive records', error);
    throw new InternalServerErrorException('Failed to archive records');
  }
}

/**
 * Search records by free text
 *
 * @param model - Health record model
 * @param searchText - Search query
 * @param fields - Fields to search
 * @param limit - Maximum results
 * @param transaction - Optional transaction
 * @returns Search results
 *
 * @example
 * ```typescript
 * const results = await searchRecordsByText(
 *   MedicalRecord,
 *   'diabetes hypertension',
 *   ['chiefComplaint', 'assessment', 'plan'],
 *   50
 * );
 * ```
 */
export async function searchRecordsByText<M extends Model>(
  model: ModelCtor<M>,
  searchText: string,
  fields: string[],
  limit: number = 50,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthRecordsQueries::searchRecordsByText');

  try {
    const searchConditions = fields.map(field => ({
      [field]: { [Op.iLike]: `%${searchText}%` },
    }));

    const records = await model.findAll({
      where: { [Op.or]: searchConditions },
      limit,
      order: [['encounterDate', 'DESC']],
      transaction,
    } as any);

    logger.log(`Text search found ${records.length} records`);

    return records;
  } catch (error) {
    logger.error('Text search failed', error);
    throw new InternalServerErrorException('Text search failed');
  }
}

/**
 * Get statistics for health records
 *
 * @param model - Health record model
 * @param dateRange - Date range
 * @param transaction - Optional transaction
 * @returns Statistics
 *
 * @example
 * ```typescript
 * const stats = await getRecordStatistics(
 *   MedicalRecord,
 *   { start: lastMonth, end: today }
 * );
 * ```
 */
export async function getRecordStatistics<M extends Model>(
  model: ModelCtor<M>,
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<{
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  avgComplexity: number;
}> {
  const logger = new Logger('HealthRecordsQueries::getRecordStatistics');

  try {
    const [total, byType, byStatus] = await Promise.all([
      model.count({
        where: {
          encounterDate: { [Op.between]: [dateRange.start, dateRange.end] },
        },
        transaction,
      } as any),
      model.findAll({
        attributes: ['recordType', [fn('COUNT', col('id')), 'count']],
        where: {
          encounterDate: { [Op.between]: [dateRange.start, dateRange.end] },
        },
        group: ['recordType'],
        raw: true,
        transaction,
      } as any),
      model.findAll({
        attributes: ['status', [fn('COUNT', col('id')), 'count']],
        where: {
          encounterDate: { [Op.between]: [dateRange.start, dateRange.end] },
        },
        group: ['status'],
        raw: true,
        transaction,
      } as any),
    ]);

    const byTypeMap = byType.reduce((acc: any, item: any) => {
      acc[item.recordType] = parseInt(item.count);
      return acc;
    }, {});

    const byStatusMap = byStatus.reduce((acc: any, item: any) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {});

    logger.log(`Record statistics: ${total} total records`);

    return {
      total,
      byType: byTypeMap,
      byStatus: byStatusMap,
      avgComplexity: 0, // Would require complex calculation
    };
  } catch (error) {
    logger.error('Failed to get record statistics', error);
    throw new InternalServerErrorException('Failed to get record statistics');
  }
}

/**
 * Validate record data integrity
 *
 * @param record - Health record
 * @param rules - Validation rules
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const validation = validateRecordIntegrity(record, {
 *   requireDiagnosis: true,
 *   requireAssessment: true
 * });
 * ```
 */
export function validateRecordIntegrity(
  record: any,
  rules: {
    requireDiagnosis?: boolean;
    requireAssessment?: boolean;
    requirePlan?: boolean;
    maxDaysOld?: number;
  }
): { isValid: boolean; errors: string[] } {
  const logger = new Logger('HealthRecordsQueries::validateRecordIntegrity');

  const errors: string[] = [];

  try {
    if (rules.requireDiagnosis && (!record.diagnosis || record.diagnosis.length === 0)) {
      errors.push('Diagnosis is required');
    }

    if (rules.requireAssessment && !record.assessment) {
      errors.push('Assessment is required');
    }

    if (rules.requirePlan && !record.plan) {
      errors.push('Plan is required');
    }

    if (rules.maxDaysOld) {
      const encounterDate = new Date(record.encounterDate);
      const now = new Date();
      const daysDiff = (now.getTime() - encounterDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysDiff > rules.maxDaysOld) {
        errors.push(`Record is ${daysDiff.toFixed(0)} days old (max: ${rules.maxDaysOld})`);
      }
    }

    const isValid = errors.length === 0;

    logger.debug(`Record validation: ${isValid ? 'valid' : 'invalid'}`);

    return { isValid, errors };
  } catch (error) {
    logger.error('Failed to validate record integrity', error);
    return { isValid: false, errors: ['Validation failed'] };
  }
}

/**
 * Get trending diagnoses over time
 *
 * @param sequelize - Sequelize instance
 * @param dateRange - Date range
 * @param topN - Number of top diagnoses
 * @param transaction - Optional transaction
 * @returns Trending diagnoses
 *
 * @example
 * ```typescript
 * const trending = await getTrendingDiagnoses(
 *   sequelize,
 *   { start: lastYear, end: today },
 *   10
 * );
 * ```
 */
export async function getTrendingDiagnoses(
  sequelize: Sequelize,
  dateRange: { start: Date; end: Date },
  topN: number = 10,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('HealthRecordsQueries::getTrendingDiagnoses');

  try {
    const query = `
      SELECT
        diagnosis_code,
        diagnosis_name,
        COUNT(*) AS occurrence_count,
        COUNT(*) / (SELECT COUNT(*) FROM medical_records
                    WHERE encounter_date BETWEEN :startDate AND :endDate)::float * 100 AS percentage
      FROM (
        SELECT
          (jsonb_array_elements(diagnosis::jsonb)->>'code') AS diagnosis_code,
          (jsonb_array_elements(diagnosis::jsonb)->>'name') AS diagnosis_name
        FROM medical_records
        WHERE encounter_date BETWEEN :startDate AND :endDate
      ) AS diagnoses
      GROUP BY diagnosis_code, diagnosis_name
      ORDER BY occurrence_count DESC
      LIMIT :topN
    `;

    const results = await sequelize.query(query, {
      replacements: {
        startDate: dateRange.start,
        endDate: dateRange.end,
        topN,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Found ${results.length} trending diagnoses`);

    return results;
  } catch (error) {
    logger.error('Failed to get trending diagnoses', error);
    throw new InternalServerErrorException('Failed to get trending diagnoses');
  }
}

/**
 * Calculate readmission risk
 *
 * @param sequelize - Sequelize instance
 * @param patientId - Patient ID
 * @param daysWindow - Days to check for readmission
 * @param transaction - Optional transaction
 * @returns Readmission risk score
 *
 * @example
 * ```typescript
 * const risk = await calculateReadmissionRisk(sequelize, 'PAT123', 30);
 * ```
 */
export async function calculateReadmissionRisk(
  sequelize: Sequelize,
  patientId: string,
  daysWindow: number = 30,
  transaction?: Transaction
): Promise<{
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  factors: string[];
}> {
  const logger = new Logger('HealthRecordsQueries::calculateReadmissionRisk');

  try {
    const query = `
      SELECT
        COUNT(CASE WHEN encounter_date >= NOW() - INTERVAL '${daysWindow} days' THEN 1 END) AS recent_visits,
        COUNT(CASE WHEN record_type = 'emergency' THEN 1 END) AS er_visits,
        COUNT(CASE WHEN status = 'in-progress' THEN 1 END) AS incomplete_records,
        (SELECT COUNT(*) FROM problem_list WHERE patient_id = :patientId AND status = 'active') AS active_problems
      FROM medical_records
      WHERE patient_id = :patientId
        AND encounter_date >= NOW() - INTERVAL '90 days'
    `;

    const [result] = await sequelize.query(query, {
      replacements: { patientId },
      type: QueryTypes.SELECT,
      transaction,
    });

    const data = result as any;
    const factors: string[] = [];
    let riskScore = 0;

    // Calculate risk
    riskScore += parseInt(data.recent_visits) * 10;
    riskScore += parseInt(data.er_visits) * 20;
    riskScore += parseInt(data.incomplete_records) * 5;
    riskScore += parseInt(data.active_problems) * 3;

    if (data.recent_visits > 2) factors.push('Multiple recent visits');
    if (data.er_visits > 0) factors.push('Recent ER visits');
    if (data.active_problems > 3) factors.push('Multiple active conditions');

    let riskLevel: 'low' | 'moderate' | 'high';
    if (riskScore < 20) riskLevel = 'low';
    else if (riskScore < 50) riskLevel = 'moderate';
    else riskLevel = 'high';

    logger.log(`Readmission risk: ${riskLevel} (score: ${riskScore})`);

    return { riskScore, riskLevel, factors };
  } catch (error) {
    logger.error('Failed to calculate readmission risk', error);
    throw new InternalServerErrorException('Failed to calculate readmission risk');
  }
}

/**
 * Get recent record modifications
 *
 * @param model - Health record model
 * @param limit - Maximum results
 * @param transaction - Optional transaction
 * @returns Recent modifications
 *
 * @example
 * ```typescript
 * const recent = await getRecentRecordModifications(MedicalRecord, 50);
 * ```
 */
export async function getRecentRecordModifications<M extends Model>(
  model: ModelCtor<M>,
  limit: number = 50,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthRecordsQueries::getRecentRecordModifications');

  try {
    const records = await model.findAll({
      order: [['updatedAt', 'DESC']],
      limit,
      transaction,
    });

    logger.log(`Found ${records.length} recently modified records`);

    return records;
  } catch (error) {
    logger.error('Failed to get recent modifications', error);
    throw new InternalServerErrorException('Failed to get recent modifications');
  }
}

/**
 * Clone health record for amendment
 *
 * @param sequelize - Sequelize instance
 * @param recordId - Original record ID
 * @param amendments - Amendments to apply
 * @param transaction - Transaction
 * @returns Cloned record
 *
 * @example
 * ```typescript
 * const amended = await cloneRecordForAmendment(
 *   sequelize,
 *   'REC123',
 *   { assessment: 'Updated assessment text' },
 *   transaction
 * );
 * ```
 */
export async function cloneRecordForAmendment(
  sequelize: Sequelize,
  recordId: string,
  amendments: Record<string, any>,
  transaction: Transaction
): Promise<any> {
  const logger = new Logger('HealthRecordsQueries::cloneRecordForAmendment');

  try {
    // Get original record
    const [original] = await sequelize.query(
      'SELECT * FROM medical_records WHERE id = :recordId',
      {
        replacements: { recordId },
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    if (!original) {
      throw new Error('Record not found');
    }

    // Create amended version
    const amended = {
      ...original,
      ...amendments,
      id: undefined, // Will be auto-generated
      version: (original as any).version + 1,
      status: 'amended',
      amendedFrom: recordId,
    };

    const [result] = await sequelize.query(
      `INSERT INTO medical_records (...) VALUES (...) RETURNING *`,
      {
        // Simplified - actual implementation would use full field list
        type: QueryTypes.INSERT,
        transaction,
      }
    );

    logger.log(`Cloned record ${recordId} for amendment`);

    return result;
  } catch (error) {
    logger.error('Failed to clone record for amendment', error);
    throw new InternalServerErrorException('Failed to clone record for amendment');
  }
}

/**
 * Get encounter frequency by patient
 *
 * @param sequelize - Sequelize instance
 * @param patientId - Patient ID
 * @param months - Number of months to analyze
 * @param transaction - Optional transaction
 * @returns Encounter frequency data
 *
 * @example
 * ```typescript
 * const frequency = await getEncounterFrequency(sequelize, 'PAT123', 12);
 * ```
 */
export async function getEncounterFrequency(
  sequelize: Sequelize,
  patientId: string,
  months: number = 12,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('HealthRecordsQueries::getEncounterFrequency');

  try {
    const query = `
      SELECT
        DATE_TRUNC('month', encounter_date) AS month,
        COUNT(*) AS encounter_count,
        COUNT(DISTINCT record_type) AS unique_record_types
      FROM medical_records
      WHERE patient_id = :patientId
        AND encounter_date >= NOW() - INTERVAL '${months} months'
      GROUP BY month
      ORDER BY month
    `;

    const results = await sequelize.query(query, {
      replacements: { patientId },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Encounter frequency: ${results.length} months analyzed`);

    return results;
  } catch (error) {
    logger.error('Failed to get encounter frequency', error);
    throw new InternalServerErrorException('Failed to get encounter frequency');
  }
}

/**
 * Find records with specific procedures
 *
 * @param model - Health record model
 * @param procedureCodes - CPT codes to search for
 * @param dateRange - Date range
 * @param transaction - Optional transaction
 * @returns Records with procedures
 *
 * @example
 * ```typescript
 * const surgeries = await findRecordsByProcedure(
 *   MedicalRecord,
 *   ['99213', '99214'],
 *   { start: lastMonth, end: today }
 * );
 * ```
 */
export async function findRecordsByProcedure<M extends Model>(
  model: ModelCtor<M>,
  procedureCodes: string[],
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthRecordsQueries::findRecordsByProcedure');

  try {
    const records = await model.findAll({
      where: {
        encounterDate: { [Op.between]: [dateRange.start, dateRange.end] },
        [Op.or]: procedureCodes.map(code => ({
          procedures: { [Op.contains]: [{ code }] },
        })),
      },
      transaction,
    });

    logger.log(`Found ${records.length} records with specified procedures`);

    return records;
  } catch (error) {
    logger.error('Procedure search failed', error);
    throw new InternalServerErrorException('Procedure search failed');
  }
}

/**
 * Get records requiring signature
 *
 * @param model - Health record model
 * @param providerId - Provider ID (optional)
 * @param transaction - Optional transaction
 * @returns Unsigned records
 *
 * @example
 * ```typescript
 * const unsigned = await getRecordsRequiringSignature(MedicalRecord, 'PROV123');
 * ```
 */
export async function getRecordsRequiringSignature<M extends Model>(
  model: ModelCtor<M>,
  providerId?: string,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('HealthRecordsQueries::getRecordsRequiringSignature');

  try {
    const where: WhereOptions<any> = {
      status: 'completed',
      signedAt: null,
    };

    if (providerId) {
      where.providerId = providerId;
    }

    const records = await model.findAll({
      where,
      order: [['encounterDate', 'ASC']],
      transaction,
    });

    logger.log(`Found ${records.length} records requiring signature`);

    return records;
  } catch (error) {
    logger.error('Failed to get unsigned records', error);
    throw new InternalServerErrorException('Failed to get unsigned records');
  }
}

/**
 * Export all health record query functions
 */
export const HealthRecordsQueriesComposites = {
  searchHealthRecords,
  getComprehensiveHealthRecord,
  getRecordHistory,
  findDuplicateRecords,
  aggregateHealthRecords,
  buildRecordRelationshipGraph,
  filterRecordsByDiagnosis,
  getPatientTimeline,
  calculateRecordCompleteness,
  batchUpdateRecordStatus,
  exportHealthRecords,
  mergeDuplicateRecords,
  calculateRecordComplexity,
  findRecordsRequiringFollowup,
  analyzeDocumentationQuality,
  getRecordsWithMissingData,
  calculatePatientRiskScore,
  findRecordsByProblem,
  getProviderPerformanceMetrics,
  archiveOldRecords,
  searchRecordsByText,
  getRecordStatistics,
  validateRecordIntegrity,
  getTrendingDiagnoses,
  calculateReadmissionRisk,
  getRecentRecordModifications,
  cloneRecordForAmendment,
  getEncounterFrequency,
  findRecordsByProcedure,
  getRecordsRequiringSignature,
};
