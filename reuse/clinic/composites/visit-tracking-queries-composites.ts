/**
 * @fileoverview Visit Tracking Query Composites for Sequelize + NestJS
 * @module reuse/clinic/composites/visit-tracking-queries-composites
 * @description Production-ready visit tracking operations with pattern analysis,
 * frequency metrics, outcomes tracking, batch operations, and appointment analytics.
 * Composed from existing health and data utilities for comprehensive visit management.
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
 * Visit pattern configuration
 */
export interface VisitPatternConfig {
  patientId?: string;
  providerId?: string;
  dateRange: { start: Date; end: Date };
  visitTypes?: string[];
  includeNoShows?: boolean;
  groupBy?: 'day' | 'week' | 'month' | 'quarter';
}

/**
 * Visit outcome metrics
 */
export interface VisitOutcomeMetrics {
  visitId: string;
  patientSatisfaction?: number;
  treatmentCompliance: number;
  followupRequired: boolean;
  followupScheduled: boolean;
  complications: string[];
  readmissionRisk: 'low' | 'moderate' | 'high';
}

/**
 * Visit frequency analysis result
 */
export interface VisitFrequencyAnalysis {
  period: string;
  visitCount: number;
  uniquePatients: number;
  avgVisitsPerPatient: number;
  noShowRate: number;
  cancelRate: number;
  avgWaitTime: number;
}

/**
 * Track patient visit history with comprehensive details
 *
 * @param sequelize - Sequelize instance
 * @param patientId - Patient ID
 * @param limit - Maximum visits to return
 * @param transaction - Optional transaction
 * @returns Visit history
 *
 * @example
 * ```typescript
 * const history = await trackPatientVisitHistory(sequelize, 'PAT123', 50);
 * console.log(`Patient has ${history.length} visits on record`);
 * ```
 */
export async function trackPatientVisitHistory(
  sequelize: Sequelize,
  patientId: string,
  limit: number = 100,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('VisitTrackingQueries::trackPatientVisitHistory');

  try {
    const query = `
      SELECT
        v.*,
        p.first_name || ' ' || p.last_name AS provider_name,
        EXTRACT(EPOCH FROM (v.check_out_time - v.check_in_time)) / 60 AS duration_minutes
      FROM visits v
      LEFT JOIN providers p ON v.provider_id = p.id
      WHERE v.patient_id = :patientId
      ORDER BY v.visit_date DESC
      LIMIT :limit
    `;

    const visits = await sequelize.query(query, {
      replacements: { patientId, limit },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Tracked ${visits.length} visits for patient ${patientId}`);

    return visits;
  } catch (error) {
    logger.error('Failed to track visit history', error);
    throw new InternalServerErrorException('Failed to track visit history');
  }
}

/**
 * Analyze visit patterns for insights
 *
 * @param sequelize - Sequelize instance
 * @param config - Pattern analysis configuration
 * @param transaction - Optional transaction
 * @returns Pattern analysis results
 *
 * @example
 * ```typescript
 * const patterns = await analyzeVisitPatterns(sequelize, {
 *   patientId: 'PAT123',
 *   dateRange: { start: lastYear, end: today },
 *   groupBy: 'month'
 * });
 * ```
 */
export async function analyzeVisitPatterns(
  sequelize: Sequelize,
  config: VisitPatternConfig,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('VisitTrackingQueries::analyzeVisitPatterns');

  try {
    const groupByClause = {
      day: "DATE_TRUNC('day', visit_date)",
      week: "DATE_TRUNC('week', visit_date)",
      month: "DATE_TRUNC('month', visit_date)",
      quarter: "DATE_TRUNC('quarter', visit_date)",
    }[config.groupBy || 'month'];

    let whereConditions = `visit_date BETWEEN :startDate AND :endDate`;

    if (config.patientId) {
      whereConditions += ` AND patient_id = :patientId`;
    }

    if (config.providerId) {
      whereConditions += ` AND provider_id = :providerId`;
    }

    if (config.visitTypes && config.visitTypes.length > 0) {
      whereConditions += ` AND visit_type = ANY(:visitTypes)`;
    }

    if (!config.includeNoShows) {
      whereConditions += ` AND status != 'no-show'`;
    }

    const query = `
      SELECT
        ${groupByClause} AS period,
        COUNT(*) AS visit_count,
        COUNT(DISTINCT patient_id) AS unique_patients,
        AVG(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completion_rate,
        AVG(EXTRACT(EPOCH FROM (check_out_time - check_in_time)) / 60) AS avg_duration_minutes,
        COUNT(CASE WHEN status = 'no-show' THEN 1 END) AS no_show_count
      FROM visits
      WHERE ${whereConditions}
      GROUP BY period
      ORDER BY period
    `;

    const patterns = await sequelize.query(query, {
      replacements: {
        startDate: config.dateRange.start,
        endDate: config.dateRange.end,
        patientId: config.patientId,
        providerId: config.providerId,
        visitTypes: config.visitTypes,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Analyzed ${patterns.length} visit patterns`);

    return patterns;
  } catch (error) {
    logger.error('Failed to analyze visit patterns', error);
    throw new InternalServerErrorException('Failed to analyze visit patterns');
  }
}

/**
 * Calculate visit frequency metrics
 *
 * @param sequelize - Sequelize instance
 * @param dateRange - Date range for analysis
 * @param groupBy - Grouping period
 * @param transaction - Optional transaction
 * @returns Frequency analysis
 *
 * @example
 * ```typescript
 * const frequency = await calculateVisitFrequency(
 *   sequelize,
 *   { start: lastMonth, end: today },
 *   'week'
 * );
 * ```
 */
export async function calculateVisitFrequency(
  sequelize: Sequelize,
  dateRange: { start: Date; end: Date },
  groupBy: 'day' | 'week' | 'month' = 'week',
  transaction?: Transaction
): Promise<VisitFrequencyAnalysis[]> {
  const logger = new Logger('VisitTrackingQueries::calculateVisitFrequency');

  try {
    const truncFunction = {
      day: 'day',
      week: 'week',
      month: 'month',
    }[groupBy];

    const query = `
      SELECT
        DATE_TRUNC('${truncFunction}', visit_date)::date AS period,
        COUNT(*) AS visit_count,
        COUNT(DISTINCT patient_id) AS unique_patients,
        (COUNT(*)::float / COUNT(DISTINCT patient_id)) AS avg_visits_per_patient,
        (COUNT(CASE WHEN status = 'no-show' THEN 1 END)::float / COUNT(*) * 100) AS no_show_rate,
        (COUNT(CASE WHEN status = 'cancelled' THEN 1 END)::float / COUNT(*) * 100) AS cancel_rate,
        AVG(EXTRACT(EPOCH FROM (check_in_time - scheduled_time)) / 60) AS avg_wait_time
      FROM visits
      WHERE visit_date BETWEEN :startDate AND :endDate
      GROUP BY period
      ORDER BY period
    `;

    const results = await sequelize.query<VisitFrequencyAnalysis>(query, {
      replacements: {
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Calculated frequency for ${results.length} periods`);

    return results;
  } catch (error) {
    logger.error('Failed to calculate visit frequency', error);
    throw new InternalServerErrorException('Failed to calculate visit frequency');
  }
}

/**
 * Track visit outcomes and follow-ups
 *
 * @param sequelize - Sequelize instance
 * @param visitId - Visit ID
 * @param transaction - Optional transaction
 * @returns Outcome metrics
 *
 * @example
 * ```typescript
 * const outcome = await trackVisitOutcome(sequelize, 'VISIT123');
 * console.log(`Follow-up required: ${outcome.followupRequired}`);
 * ```
 */
export async function trackVisitOutcome(
  sequelize: Sequelize,
  visitId: string,
  transaction?: Transaction
): Promise<VisitOutcomeMetrics> {
  const logger = new Logger('VisitTrackingQueries::trackVisitOutcome');

  try {
    const query = `
      SELECT
        v.id AS visit_id,
        v.patient_satisfaction,
        CASE
          WHEN EXISTS (
            SELECT 1 FROM prescriptions p
            WHERE p.visit_id = v.id AND p.status = 'active'
          ) THEN 100
          ELSE 0
        END AS treatment_compliance,
        v.follow_up_required,
        EXISTS (
          SELECT 1 FROM visits fv
          WHERE fv.patient_id = v.patient_id
            AND fv.visit_date > v.visit_date
            AND fv.visit_date <= v.visit_date + INTERVAL '30 days'
        ) AS followup_scheduled,
        COALESCE(
          (SELECT array_agg(complication) FROM visit_complications WHERE visit_id = v.id),
          ARRAY[]::text[]
        ) AS complications
      FROM visits v
      WHERE v.id = :visitId
    `;

    const [result] = await sequelize.query(query, {
      replacements: { visitId },
      type: QueryTypes.SELECT,
      transaction,
    });

    const outcome = result as any;

    // Calculate readmission risk
    let readmissionRisk: 'low' | 'moderate' | 'high' = 'low';
    if (outcome.complications.length > 0) readmissionRisk = 'moderate';
    if (outcome.complications.length > 2) readmissionRisk = 'high';

    logger.log(`Tracked outcome for visit ${visitId}`);

    return {
      visitId,
      patientSatisfaction: outcome.patient_satisfaction,
      treatmentCompliance: outcome.treatment_compliance,
      followupRequired: outcome.follow_up_required,
      followupScheduled: outcome.followup_scheduled,
      complications: outcome.complications,
      readmissionRisk,
    };
  } catch (error) {
    logger.error('Failed to track visit outcome', error);
    throw new InternalServerErrorException('Failed to track visit outcome');
  }
}

/**
 * Batch update visit statuses
 *
 * @param model - Visit model
 * @param visitIds - Visit IDs to update
 * @param status - New status
 * @param transaction - Transaction
 * @returns Updated count
 *
 * @example
 * ```typescript
 * const updated = await batchUpdateVisitStatus(
 *   Visit,
 *   ['V1', 'V2', 'V3'],
 *   'completed',
 *   transaction
 * );
 * ```
 */
export async function batchUpdateVisitStatus<M extends Model>(
  model: ModelCtor<M>,
  visitIds: string[],
  status: string,
  transaction: Transaction
): Promise<number> {
  const logger = new Logger('VisitTrackingQueries::batchUpdateVisitStatus');

  try {
    const [affectedCount] = await model.update(
      { status, updatedAt: new Date() } as any,
      {
        where: { id: { [Op.in]: visitIds } } as any,
        transaction,
      }
    );

    logger.log(`Batch updated ${affectedCount} visits to status: ${status}`);

    return affectedCount;
  } catch (error) {
    logger.error('Batch status update failed', error);
    throw new InternalServerErrorException('Batch status update failed');
  }
}

/**
 * Get no-show patterns by patient
 *
 * @param sequelize - Sequelize instance
 * @param patientId - Patient ID
 * @param monthsBack - Months to analyze
 * @param transaction - Optional transaction
 * @returns No-show analysis
 *
 * @example
 * ```typescript
 * const noShows = await getNoShowPatterns(sequelize, 'PAT123', 6);
 * ```
 */
export async function getNoShowPatterns(
  sequelize: Sequelize,
  patientId: string,
  monthsBack: number = 12,
  transaction?: Transaction
): Promise<{
  totalVisits: number;
  noShowCount: number;
  noShowRate: number;
  lastNoShowDate: Date | null;
  patterns: any[];
}> {
  const logger = new Logger('VisitTrackingQueries::getNoShowPatterns');

  try {
    const query = `
      SELECT
        COUNT(*) AS total_visits,
        COUNT(CASE WHEN status = 'no-show' THEN 1 END) AS no_show_count,
        (COUNT(CASE WHEN status = 'no-show' THEN 1 END)::float / COUNT(*) * 100) AS no_show_rate,
        MAX(CASE WHEN status = 'no-show' THEN visit_date END) AS last_no_show_date
      FROM visits
      WHERE patient_id = :patientId
        AND visit_date >= NOW() - INTERVAL '${monthsBack} months'
    `;

    const [result] = await sequelize.query(query, {
      replacements: { patientId },
      type: QueryTypes.SELECT,
      transaction,
    });

    const patternQuery = `
      SELECT
        DATE_TRUNC('month', visit_date) AS month,
        COUNT(CASE WHEN status = 'no-show' THEN 1 END) AS no_shows,
        EXTRACT(DOW FROM visit_date) AS day_of_week,
        EXTRACT(HOUR FROM scheduled_time) AS time_of_day
      FROM visits
      WHERE patient_id = :patientId
        AND visit_date >= NOW() - INTERVAL '${monthsBack} months'
        AND status = 'no-show'
      GROUP BY month, day_of_week, time_of_day
      ORDER BY month DESC
    `;

    const patterns = await sequelize.query(patternQuery, {
      replacements: { patientId },
      type: QueryTypes.SELECT,
      transaction,
    });

    const data = result as any;

    logger.log(`No-show analysis: ${data.no_show_count} no-shows out of ${data.total_visits} visits`);

    return {
      totalVisits: parseInt(data.total_visits),
      noShowCount: parseInt(data.no_show_count),
      noShowRate: parseFloat(data.no_show_rate),
      lastNoShowDate: data.last_no_show_date,
      patterns,
    };
  } catch (error) {
    logger.error('Failed to analyze no-show patterns', error);
    throw new InternalServerErrorException('Failed to analyze no-show patterns');
  }
}

/**
 * Calculate provider visit load
 *
 * @param sequelize - Sequelize instance
 * @param providerId - Provider ID
 * @param dateRange - Date range
 * @param transaction - Optional transaction
 * @returns Provider load metrics
 *
 * @example
 * ```typescript
 * const load = await calculateProviderVisitLoad(
 *   sequelize,
 *   'PROV123',
 *   { start: today, end: nextWeek }
 * );
 * ```
 */
export async function calculateProviderVisitLoad(
  sequelize: Sequelize,
  providerId: string,
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<{
  totalVisits: number;
  averagePerDay: number;
  peakDay: string;
  peakDayVisits: number;
  utilizationRate: number;
}> {
  const logger = new Logger('VisitTrackingQueries::calculateProviderVisitLoad');

  try {
    const query = `
      WITH daily_visits AS (
        SELECT
          visit_date::date AS day,
          COUNT(*) AS visit_count
        FROM visits
        WHERE provider_id = :providerId
          AND visit_date BETWEEN :startDate AND :endDate
          AND status IN ('scheduled', 'completed')
        GROUP BY day
      )
      SELECT
        SUM(visit_count) AS total_visits,
        AVG(visit_count) AS average_per_day,
        (SELECT day FROM daily_visits ORDER BY visit_count DESC LIMIT 1) AS peak_day,
        (SELECT visit_count FROM daily_visits ORDER BY visit_count DESC LIMIT 1) AS peak_day_visits
      FROM daily_visits
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

    // Calculate utilization rate (assuming 8 hour days, 4 patients per hour max)
    const days = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const maxCapacity = days * 8 * 4; // 32 patients per day max
    const utilizationRate = (parseInt(data.total_visits) / maxCapacity) * 100;

    logger.log(`Provider load: ${data.total_visits} visits, ${data.average_per_day.toFixed(1)} avg/day`);

    return {
      totalVisits: parseInt(data.total_visits || 0),
      averagePerDay: parseFloat(data.average_per_day || 0),
      peakDay: data.peak_day,
      peakDayVisits: parseInt(data.peak_day_visits || 0),
      utilizationRate,
    };
  } catch (error) {
    logger.error('Failed to calculate provider visit load', error);
    throw new InternalServerErrorException('Failed to calculate provider visit load');
  }
}

/**
 * Find visits requiring follow-up
 *
 * @param model - Visit model
 * @param daysOverdue - Days past follow-up date
 * @param transaction - Optional transaction
 * @returns Visits needing follow-up
 *
 * @example
 * ```typescript
 * const overdue = await findVisitsRequiringFollowup(Visit, 7);
 * ```
 */
export async function findVisitsRequiringFollowup<M extends Model>(
  model: ModelCtor<M>,
  daysOverdue: number = 0,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('VisitTrackingQueries::findVisitsRequiringFollowup');

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOverdue);

    const visits = await model.findAll({
      where: {
        followUpRequired: true,
        followUpScheduled: false,
        followUpDate: { [Op.lte]: cutoffDate },
        status: 'completed',
      } as any,
      order: [['followUpDate', 'ASC']],
      transaction,
    });

    logger.log(`Found ${visits.length} visits requiring follow-up`);

    return visits;
  } catch (error) {
    logger.error('Failed to find visits requiring follow-up', error);
    throw new InternalServerErrorException('Failed to find visits requiring follow-up');
  }
}

/**
 * Analyze wait times by time of day
 *
 * @param sequelize - Sequelize instance
 * @param dateRange - Date range
 * @param transaction - Optional transaction
 * @returns Wait time analysis
 *
 * @example
 * ```typescript
 * const waitTimes = await analyzeWaitTimesByHour(
 *   sequelize,
 *   { start: lastMonth, end: today }
 * );
 * ```
 */
export async function analyzeWaitTimesByHour(
  sequelize: Sequelize,
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('VisitTrackingQueries::analyzeWaitTimesByHour');

  try {
    const query = `
      SELECT
        EXTRACT(HOUR FROM scheduled_time) AS hour_of_day,
        COUNT(*) AS visit_count,
        AVG(EXTRACT(EPOCH FROM (check_in_time - scheduled_time)) / 60) AS avg_wait_minutes,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (check_in_time - scheduled_time)) / 60) AS median_wait_minutes,
        MAX(EXTRACT(EPOCH FROM (check_in_time - scheduled_time)) / 60) AS max_wait_minutes
      FROM visits
      WHERE visit_date BETWEEN :startDate AND :endDate
        AND check_in_time IS NOT NULL
        AND status != 'no-show'
      GROUP BY hour_of_day
      ORDER BY hour_of_day
    `;

    const results = await sequelize.query(query, {
      replacements: {
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Analyzed wait times for ${results.length} hours`);

    return results;
  } catch (error) {
    logger.error('Failed to analyze wait times', error);
    throw new InternalServerErrorException('Failed to analyze wait times');
  }
}

/**
 * Get visit duration statistics
 *
 * @param sequelize - Sequelize instance
 * @param visitType - Type of visit
 * @param dateRange - Date range
 * @param transaction - Optional transaction
 * @returns Duration statistics
 *
 * @example
 * ```typescript
 * const stats = await getVisitDurationStats(
 *   sequelize,
 *   'routine',
 *   { start: lastMonth, end: today }
 * );
 * ```
 */
export async function getVisitDurationStats(
  sequelize: Sequelize,
  visitType: string,
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<{
  avgDuration: number;
  medianDuration: number;
  minDuration: number;
  maxDuration: number;
  sampleSize: number;
}> {
  const logger = new Logger('VisitTrackingQueries::getVisitDurationStats');

  try {
    const query = `
      SELECT
        AVG(EXTRACT(EPOCH FROM (check_out_time - check_in_time)) / 60) AS avg_duration,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (check_out_time - check_in_time)) / 60) AS median_duration,
        MIN(EXTRACT(EPOCH FROM (check_out_time - check_in_time)) / 60) AS min_duration,
        MAX(EXTRACT(EPOCH FROM (check_out_time - check_in_time)) / 60) AS max_duration,
        COUNT(*) AS sample_size
      FROM visits
      WHERE visit_type = :visitType
        AND visit_date BETWEEN :startDate AND :endDate
        AND check_in_time IS NOT NULL
        AND check_out_time IS NOT NULL
    `;

    const [result] = await sequelize.query(query, {
      replacements: {
        visitType,
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    const data = result as any;

    logger.log(`Visit duration stats: avg ${data.avg_duration.toFixed(1)} min`);

    return {
      avgDuration: parseFloat(data.avg_duration),
      medianDuration: parseFloat(data.median_duration),
      minDuration: parseFloat(data.min_duration),
      maxDuration: parseFloat(data.max_duration),
      sampleSize: parseInt(data.sample_size),
    };
  } catch (error) {
    logger.error('Failed to get duration statistics', error);
    throw new InternalServerErrorException('Failed to get duration statistics');
  }
}

/**
 * Track same-day appointment requests
 *
 * @param sequelize - Sequelize instance
 * @param date - Target date
 * @param transaction - Optional transaction
 * @returns Same-day appointments
 *
 * @example
 * ```typescript
 * const sameDayAppts = await trackSameDayAppointments(sequelize, new Date());
 * ```
 */
export async function trackSameDayAppointments(
  sequelize: Sequelize,
  date: Date,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('VisitTrackingQueries::trackSameDayAppointments');

  try {
    const query = `
      SELECT
        v.*,
        EXTRACT(EPOCH FROM (v.scheduled_time - v.created_at)) / 3600 AS hours_advance_notice
      FROM visits v
      WHERE v.visit_date::date = :targetDate::date
        AND v.created_at::date = :targetDate::date
        AND v.status != 'cancelled'
      ORDER BY v.scheduled_time
    `;

    const appointments = await sequelize.query(query, {
      replacements: { targetDate: date },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Found ${appointments.length} same-day appointments`);

    return appointments;
  } catch (error) {
    logger.error('Failed to track same-day appointments', error);
    throw new InternalServerErrorException('Failed to track same-day appointments');
  }
}

/**
 * Calculate cancellation patterns
 *
 * @param sequelize - Sequelize instance
 * @param dateRange - Date range
 * @param transaction - Optional transaction
 * @returns Cancellation analysis
 *
 * @example
 * ```typescript
 * const cancellations = await calculateCancellationPatterns(
 *   sequelize,
 *   { start: lastMonth, end: today }
 * );
 * ```
 */
export async function calculateCancellationPatterns(
  sequelize: Sequelize,
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<{
  totalCancellations: number;
  cancellationRate: number;
  avgNoticeHours: number;
  byReason: Record<string, number>;
  byDayOfWeek: Record<string, number>;
}> {
  const logger = new Logger('VisitTrackingQueries::calculateCancellationPatterns');

  try {
    const query = `
      WITH cancellations AS (
        SELECT
          *,
          EXTRACT(EPOCH FROM (cancelled_at - scheduled_time)) / 3600 AS notice_hours,
          EXTRACT(DOW FROM visit_date) AS day_of_week
        FROM visits
        WHERE visit_date BETWEEN :startDate AND :endDate
          AND status = 'cancelled'
      ),
      totals AS (
        SELECT COUNT(*) AS total_visits
        FROM visits
        WHERE visit_date BETWEEN :startDate AND :endDate
      )
      SELECT
        COUNT(c.*) AS total_cancellations,
        (COUNT(c.*)::float / t.total_visits * 100) AS cancellation_rate,
        AVG(c.notice_hours) AS avg_notice_hours
      FROM cancellations c, totals t
    `;

    const [result] = await sequelize.query(query, {
      replacements: {
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    // Get by reason
    const reasonQuery = `
      SELECT
        cancellation_reason,
        COUNT(*) AS count
      FROM visits
      WHERE visit_date BETWEEN :startDate AND :endDate
        AND status = 'cancelled'
      GROUP BY cancellation_reason
    `;

    const byReasonResults = await sequelize.query(reasonQuery, {
      replacements: {
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    const byReason = byReasonResults.reduce((acc: any, row: any) => {
      acc[row.cancellation_reason] = parseInt(row.count);
      return acc;
    }, {});

    const data = result as any;

    logger.log(`Cancellation patterns: ${data.total_cancellations} cancellations, ${data.cancellation_rate.toFixed(1)}% rate`);

    return {
      totalCancellations: parseInt(data.total_cancellations),
      cancellationRate: parseFloat(data.cancellation_rate),
      avgNoticeHours: parseFloat(data.avg_notice_hours),
      byReason,
      byDayOfWeek: {},
    };
  } catch (error) {
    logger.error('Failed to calculate cancellation patterns', error);
    throw new InternalServerErrorException('Failed to calculate cancellation patterns');
  }
}

/**
 * Find concurrent visits for capacity planning
 *
 * @param sequelize - Sequelize instance
 * @param date - Target date
 * @param transaction - Optional transaction
 * @returns Concurrent visit analysis
 *
 * @example
 * ```typescript
 * const concurrent = await findConcurrentVisits(sequelize, new Date());
 * ```
 */
export async function findConcurrentVisits(
  sequelize: Sequelize,
  date: Date,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('VisitTrackingQueries::findConcurrentVisits');

  try {
    const query = `
      SELECT
        EXTRACT(HOUR FROM scheduled_time) AS hour,
        COUNT(*) AS concurrent_visits,
        array_agg(id) AS visit_ids
      FROM visits
      WHERE visit_date::date = :targetDate::date
        AND status IN ('scheduled', 'in-progress')
      GROUP BY hour
      ORDER BY concurrent_visits DESC
    `;

    const results = await sequelize.query(query, {
      replacements: { targetDate: date },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Found ${results.length} time slots with concurrent visits`);

    return results;
  } catch (error) {
    logger.error('Failed to find concurrent visits', error);
    throw new InternalServerErrorException('Failed to find concurrent visits');
  }
}

/**
 * Get visit completion rates by provider
 *
 * @param sequelize - Sequelize instance
 * @param dateRange - Date range
 * @param transaction - Optional transaction
 * @returns Completion rates
 *
 * @example
 * ```typescript
 * const rates = await getVisitCompletionRates(
 *   sequelize,
 *   { start: lastMonth, end: today }
 * );
 * ```
 */
export async function getVisitCompletionRates(
  sequelize: Sequelize,
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('VisitTrackingQueries::getVisitCompletionRates');

  try {
    const query = `
      SELECT
        p.id AS provider_id,
        p.first_name || ' ' || p.last_name AS provider_name,
        COUNT(*) AS total_visits,
        COUNT(CASE WHEN v.status = 'completed' THEN 1 END) AS completed_visits,
        (COUNT(CASE WHEN v.status = 'completed' THEN 1 END)::float / COUNT(*) * 100) AS completion_rate,
        AVG(EXTRACT(EPOCH FROM (v.check_out_time - v.check_in_time)) / 60) AS avg_visit_duration
      FROM visits v
      JOIN providers p ON v.provider_id = p.id
      WHERE v.visit_date BETWEEN :startDate AND :endDate
      GROUP BY p.id, provider_name
      ORDER BY completion_rate DESC
    `;

    const results = await sequelize.query(query, {
      replacements: {
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Completion rates for ${results.length} providers`);

    return results;
  } catch (error) {
    logger.error('Failed to get completion rates', error);
    throw new InternalServerErrorException('Failed to get completion rates');
  }
}

/**
 * Calculate patient retention from visits
 *
 * @param sequelize - Sequelize instance
 * @param monthsBack - Months to analyze
 * @param transaction - Optional transaction
 * @returns Retention metrics
 *
 * @example
 * ```typescript
 * const retention = await calculatePatientRetention(sequelize, 12);
 * ```
 */
export async function calculatePatientRetention(
  sequelize: Sequelize,
  monthsBack: number = 12,
  transaction?: Transaction
): Promise<{
  newPatients: number;
  returningPatients: number;
  retentionRate: number;
  avgVisitsPerPatient: number;
}> {
  const logger = new Logger('VisitTrackingQueries::calculatePatientRetention');

  try {
    const query = `
      WITH patient_visits AS (
        SELECT
          patient_id,
          COUNT(*) AS visit_count,
          MIN(visit_date) AS first_visit,
          MAX(visit_date) AS last_visit
        FROM visits
        WHERE visit_date >= NOW() - INTERVAL '${monthsBack} months'
        GROUP BY patient_id
      )
      SELECT
        COUNT(CASE WHEN visit_count = 1 THEN 1 END) AS new_patients,
        COUNT(CASE WHEN visit_count > 1 THEN 1 END) AS returning_patients,
        (COUNT(CASE WHEN visit_count > 1 THEN 1 END)::float / COUNT(*) * 100) AS retention_rate,
        AVG(visit_count) AS avg_visits_per_patient
      FROM patient_visits
    `;

    const [result] = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    const data = result as any;

    logger.log(`Patient retention: ${data.retention_rate.toFixed(1)}%`);

    return {
      newPatients: parseInt(data.new_patients),
      returningPatients: parseInt(data.returning_patients),
      retentionRate: parseFloat(data.retention_rate),
      avgVisitsPerPatient: parseFloat(data.avg_visits_per_patient),
    };
  } catch (error) {
    logger.error('Failed to calculate patient retention', error);
    throw new InternalServerErrorException('Failed to calculate patient retention');
  }
}

/**
 * Get peak visit times for scheduling optimization
 *
 * @param sequelize - Sequelize instance
 * @param dateRange - Date range
 * @param transaction - Optional transaction
 * @returns Peak time analysis
 *
 * @example
 * ```typescript
 * const peakTimes = await getPeakVisitTimes(
 *   sequelize,
 *   { start: lastMonth, end: today }
 * );
 * ```
 */
export async function getPeakVisitTimes(
  sequelize: Sequelize,
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('VisitTrackingQueries::getPeakVisitTimes');

  try {
    const query = `
      SELECT
        EXTRACT(DOW FROM visit_date) AS day_of_week,
        EXTRACT(HOUR FROM scheduled_time) AS hour_of_day,
        COUNT(*) AS visit_count,
        AVG(EXTRACT(EPOCH FROM (check_out_time - check_in_time)) / 60) AS avg_duration
      FROM visits
      WHERE visit_date BETWEEN :startDate AND :endDate
        AND status IN ('completed', 'in-progress')
      GROUP BY day_of_week, hour_of_day
      ORDER BY visit_count DESC
      LIMIT 20
    `;

    const results = await sequelize.query(query, {
      replacements: {
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Found ${results.length} peak time slots`);

    return results;
  } catch (error) {
    logger.error('Failed to get peak visit times', error);
    throw new InternalServerErrorException('Failed to get peak visit times');
  }
}

/**
 * Batch create visit records
 *
 * @param model - Visit model
 * @param visits - Visit data array
 * @param transaction - Transaction
 * @returns Created visits
 *
 * @example
 * ```typescript
 * const created = await batchCreateVisits(Visit, visitData, transaction);
 * ```
 */
export async function batchCreateVisits<M extends Model>(
  model: ModelCtor<M>,
  visits: any[],
  transaction: Transaction
): Promise<M[]> {
  const logger = new Logger('VisitTrackingQueries::batchCreateVisits');

  try {
    const created = await model.bulkCreate(visits, {
      validate: true,
      transaction,
      returning: true,
    });

    logger.log(`Batch created ${created.length} visits`);

    return created;
  } catch (error) {
    logger.error('Batch create visits failed', error);
    throw new InternalServerErrorException('Batch create visits failed');
  }
}

/**
 * Find visits with missing documentation
 *
 * @param model - Visit model
 * @param daysOld - Days since visit
 * @param transaction - Optional transaction
 * @returns Visits with missing docs
 *
 * @example
 * ```typescript
 * const missingDocs = await findVisitsWithMissingDocumentation(Visit, 3);
 * ```
 */
export async function findVisitsWithMissingDocumentation<M extends Model>(
  model: ModelCtor<M>,
  daysOld: number = 1,
  transaction?: Transaction
): Promise<M[]> {
  const logger = new Logger('VisitTrackingQueries::findVisitsWithMissingDocumentation');

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const visits = await model.findAll({
      where: {
        visitDate: { [Op.lte]: cutoffDate },
        status: 'completed',
        documentationComplete: false,
      } as any,
      order: [['visitDate', 'ASC']],
      transaction,
    });

    logger.log(`Found ${visits.length} visits with missing documentation`);

    return visits;
  } catch (error) {
    logger.error('Failed to find visits with missing documentation', error);
    throw new InternalServerErrorException('Failed to find visits with missing documentation');
  }
}

/**
 * Calculate visit satisfaction scores
 *
 * @param sequelize - Sequelize instance
 * @param dateRange - Date range
 * @param transaction - Optional transaction
 * @returns Satisfaction metrics
 *
 * @example
 * ```typescript
 * const satisfaction = await calculateVisitSatisfactionScores(
 *   sequelize,
 *   { start: lastMonth, end: today }
 * );
 * ```
 */
export async function calculateVisitSatisfactionScores(
  sequelize: Sequelize,
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<{
  avgScore: number;
  responseRate: number;
  distribution: Record<number, number>;
  topProviders: any[];
}> {
  const logger = new Logger('VisitTrackingQueries::calculateVisitSatisfactionScores');

  try {
    const query = `
      SELECT
        AVG(patient_satisfaction) AS avg_score,
        (COUNT(CASE WHEN patient_satisfaction IS NOT NULL THEN 1 END)::float / COUNT(*) * 100) AS response_rate
      FROM visits
      WHERE visit_date BETWEEN :startDate AND :endDate
        AND status = 'completed'
    `;

    const [result] = await sequelize.query(query, {
      replacements: {
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    // Get distribution
    const distQuery = `
      SELECT
        patient_satisfaction AS score,
        COUNT(*) AS count
      FROM visits
      WHERE visit_date BETWEEN :startDate AND :endDate
        AND patient_satisfaction IS NOT NULL
      GROUP BY score
      ORDER BY score
    `;

    const distribution = await sequelize.query(distQuery, {
      replacements: {
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    const data = result as any;

    logger.log(`Satisfaction: avg ${data.avg_score.toFixed(1)}, ${data.response_rate.toFixed(1)}% response`);

    return {
      avgScore: parseFloat(data.avg_score),
      responseRate: parseFloat(data.response_rate),
      distribution: distribution.reduce((acc: any, row: any) => {
        acc[row.score] = parseInt(row.count);
        return acc;
      }, {}),
      topProviders: [],
    };
  } catch (error) {
    logger.error('Failed to calculate satisfaction scores', error);
    throw new InternalServerErrorException('Failed to calculate satisfaction scores');
  }
}

/**
 * Get visit trends over time
 *
 * @param sequelize - Sequelize instance
 * @param months - Number of months
 * @param transaction - Optional transaction
 * @returns Trend data
 *
 * @example
 * ```typescript
 * const trends = await getVisitTrends(sequelize, 12);
 * ```
 */
export async function getVisitTrends(
  sequelize: Sequelize,
  months: number = 12,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('VisitTrackingQueries::getVisitTrends');

  try {
    const query = `
      SELECT
        DATE_TRUNC('month', visit_date) AS month,
        COUNT(*) AS visit_count,
        COUNT(DISTINCT patient_id) AS unique_patients,
        AVG(EXTRACT(EPOCH FROM (check_out_time - check_in_time)) / 60) AS avg_duration,
        (COUNT(CASE WHEN status = 'completed' THEN 1 END)::float / COUNT(*) * 100) AS completion_rate
      FROM visits
      WHERE visit_date >= NOW() - INTERVAL '${months} months'
      GROUP BY month
      ORDER BY month
    `;

    const trends = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Visit trends: ${trends.length} months`);

    return trends;
  } catch (error) {
    logger.error('Failed to get visit trends', error);
    throw new InternalServerErrorException('Failed to get visit trends');
  }
}

/**
 * Calculate visit revenue by type
 *
 * @param sequelize - Sequelize instance
 * @param dateRange - Date range
 * @param transaction - Optional transaction
 * @returns Revenue by visit type
 *
 * @example
 * ```typescript
 * const revenue = await calculateVisitRevenueByType(
 *   sequelize,
 *   { start: lastMonth, end: today }
 * );
 * ```
 */
export async function calculateVisitRevenueByType(
  sequelize: Sequelize,
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('VisitTrackingQueries::calculateVisitRevenueByType');

  try {
    const query = `
      SELECT
        visit_type,
        COUNT(*) AS visit_count,
        SUM(charged_amount) AS total_revenue,
        AVG(charged_amount) AS avg_revenue_per_visit,
        SUM(CASE WHEN payment_status = 'paid' THEN charged_amount ELSE 0 END) AS collected_revenue
      FROM visits
      WHERE visit_date BETWEEN :startDate AND :endDate
        AND status = 'completed'
      GROUP BY visit_type
      ORDER BY total_revenue DESC
    `;

    const results = await sequelize.query(query, {
      replacements: {
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Revenue analysis for ${results.length} visit types`);

    return results;
  } catch (error) {
    logger.error('Failed to calculate visit revenue', error);
    throw new InternalServerErrorException('Failed to calculate visit revenue');
  }
}

/**
 * Find high-frequency patients
 *
 * @param sequelize - Sequelize instance
 * @param threshold - Minimum visit count
 * @param dateRange - Date range
 * @param transaction - Optional transaction
 * @returns High-frequency patients
 *
 * @example
 * ```typescript
 * const frequent = await findHighFrequencyPatients(sequelize, 10, { start, end });
 * ```
 */
export async function findHighFrequencyPatients(
  sequelize: Sequelize,
  threshold: number,
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('VisitTrackingQueries::findHighFrequencyPatients');

  try {
    const query = `
      SELECT
        p.id,
        p.first_name || ' ' || p.last_name AS patient_name,
        COUNT(v.id) AS visit_count,
        array_agg(DISTINCT v.visit_type) AS visit_types,
        MIN(v.visit_date) AS first_visit,
        MAX(v.visit_date) AS last_visit,
        AVG(EXTRACT(DAY FROM v.visit_date - LAG(v.visit_date) OVER (PARTITION BY p.id ORDER BY v.visit_date))) AS avg_days_between_visits
      FROM patients p
      JOIN visits v ON p.id = v.patient_id
      WHERE v.visit_date BETWEEN :startDate AND :endDate
      GROUP BY p.id, patient_name
      HAVING COUNT(v.id) >= :threshold
      ORDER BY visit_count DESC
    `;

    const results = await sequelize.query(query, {
      replacements: {
        threshold,
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Found ${results.length} high-frequency patients`);

    return results;
  } catch (error) {
    logger.error('Failed to find high-frequency patients', error);
    throw new InternalServerErrorException('Failed to find high-frequency patients');
  }
}

/**
 * Get visit statistics summary
 *
 * @param sequelize - Sequelize instance
 * @param dateRange - Date range
 * @param transaction - Optional transaction
 * @returns Statistics summary
 *
 * @example
 * ```typescript
 * const stats = await getVisitStatisticsSummary(
 *   sequelize,
 *   { start: lastMonth, end: today }
 * );
 * ```
 */
export async function getVisitStatisticsSummary(
  sequelize: Sequelize,
  dateRange: { start: Date; end: Date },
  transaction?: Transaction
): Promise<{
  totalVisits: number;
  completedVisits: number;
  noShows: number;
  cancellations: number;
  avgDuration: number;
  avgWaitTime: number;
}> {
  const logger = new Logger('VisitTrackingQueries::getVisitStatisticsSummary');

  try {
    const query = `
      SELECT
        COUNT(*) AS total_visits,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_visits,
        COUNT(CASE WHEN status = 'no-show' THEN 1 END) AS no_shows,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancellations,
        AVG(EXTRACT(EPOCH FROM (check_out_time - check_in_time)) / 60) AS avg_duration,
        AVG(EXTRACT(EPOCH FROM (check_in_time - scheduled_time)) / 60) AS avg_wait_time
      FROM visits
      WHERE visit_date BETWEEN :startDate AND :endDate
    `;

    const [result] = await sequelize.query(query, {
      replacements: {
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    const data = result as any;

    logger.log(`Visit statistics: ${data.total_visits} total visits`);

    return {
      totalVisits: parseInt(data.total_visits),
      completedVisits: parseInt(data.completed_visits),
      noShows: parseInt(data.no_shows),
      cancellations: parseInt(data.cancellations),
      avgDuration: parseFloat(data.avg_duration),
      avgWaitTime: parseFloat(data.avg_wait_time),
    };
  } catch (error) {
    logger.error('Failed to get visit statistics summary', error);
    throw new InternalServerErrorException('Failed to get visit statistics summary');
  }
}

/**
 * Export all visit tracking query functions
 */
export const VisitTrackingQueriesComposites = {
  trackPatientVisitHistory,
  analyzeVisitPatterns,
  calculateVisitFrequency,
  trackVisitOutcome,
  batchUpdateVisitStatus,
  getNoShowPatterns,
  calculateProviderVisitLoad,
  findVisitsRequiringFollowup,
  analyzeWaitTimesByHour,
  getVisitDurationStats,
  trackSameDayAppointments,
  calculateCancellationPatterns,
  findConcurrentVisits,
  getVisitCompletionRates,
  calculatePatientRetention,
  getPeakVisitTimes,
  batchCreateVisits,
  findVisitsWithMissingDocumentation,
  calculateVisitSatisfactionScores,
  getVisitTrends,
  calculateVisitRevenueByType,
  findHighFrequencyPatients,
  getVisitStatisticsSummary,
};
