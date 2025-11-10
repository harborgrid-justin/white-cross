/**
 * Query Utilities - Advanced Query Optimization & Caching
 *
 * Re-exports all query optimization patterns from reference composite libraries
 * and adds threat intelligence-specific optimized queries with automatic caching,
 * N+1 prevention, and query plan analysis.
 *
 * @module shared-utilities/query-utils
 * @version 1.0.0
 * @requires reuse/data/composites/query-optimization-cache (1,512 lines)
 * @requires reuse/data/composites/streaming-query-operations (1,496 lines)
 * @requires reuse/data/composites/complex-join-operations (1,493 lines)
 */

import { Sequelize, Model, ModelStatic, Op, literal, fn, col } from 'sequelize';
import { Redis } from 'ioredis';

// ============================================================================
// RE-EXPORT REFERENCE QUERY PATTERNS (4500+ lines of query optimization)
// ============================================================================

export * from '../../../../../data/composites/query-optimization-cache';
export * from '../../../../../data/composites/streaming-query-operations';
export * from '../../../../../data/composites/complex-join-operations';

// Import specific utilities for threat intelligence extensions
import {
  executeWithCache,
  CacheOptions,
  invalidateCache,
  invalidateCacheByPattern,
  getCacheStats,
} from '../../../../../data/composites/query-optimization-cache';

import {
  streamQueryResults,
  batchProcess,
  StreamOptions,
} from '../../../../../data/composites/streaming-query-operations';

import {
  buildComplexJoinQuery,
  eagerLoadAssociations,
  preventNPlusOne,
} from '../../../../../data/composites/complex-join-operations';

// ============================================================================
// THREAT INTELLIGENCE QUERY INTERFACES
// ============================================================================

export interface IThreatIntelligence extends Model {
  id: string;
  type: string;
  severity: string;
  status: string;
  title: string;
  description: string;
  confidence: number;
  tlp: string;
  indicators?: IIndicator[];
  affectedSystems?: IAffectedSystem[];
  relatedThreats?: IThreatIntelligence[];
  history?: IThreatHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IIndicator extends Model {
  id: string;
  type: string;
  value: string;
  threatId: string;
}

export interface IAffectedSystem extends Model {
  id: string;
  systemName: string;
  threatId: string;
}

export interface IThreatHistory extends Model {
  id: string;
  threatId: string;
  action: string;
  timestamp: Date;
}

export interface ThreatQueryFilters {
  severity?: string | string[];
  status?: string | string[];
  type?: string | string[];
  tlp?: string | string[];
  minConfidence?: number;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

export interface ThreatWithHistory extends IThreatIntelligence {
  indicators: IIndicator[];
  affectedSystems: IAffectedSystem[];
  relatedThreats: IThreatIntelligence[];
  history: IThreatHistory[];
}

// ============================================================================
// THREAT-SPECIFIC OPTIMIZED QUERIES
// ============================================================================

/**
 * Threat intelligence query utilities with automatic caching and optimization
 */
export class ThreatQueryUtils {
  private sequelize: Sequelize;
  private redis?: Redis;
  private ThreatModel: ModelStatic<any>;
  private IndicatorModel: ModelStatic<any>;
  private AffectedSystemModel: ModelStatic<any>;
  private ThreatHistoryModel: ModelStatic<any>;

  constructor(
    sequelize: Sequelize,
    redis: Redis | undefined,
    models: {
      Threat: ModelStatic<any>;
      Indicator: ModelStatic<any>;
      AffectedSystem: ModelStatic<any>;
      ThreatHistory: ModelStatic<any>;
    }
  ) {
    this.sequelize = sequelize;
    this.redis = redis;
    this.ThreatModel = models.Threat;
    this.IndicatorModel = models.Indicator;
    this.AffectedSystemModel = models.AffectedSystem;
    this.ThreatHistoryModel = models.ThreatHistory;
  }

  /**
   * Find all CRITICAL threats with automatic caching
   * Cache TTL: 5 minutes
   */
  async findCriticalThreats(): Promise<IThreatIntelligence[]> {
    if (!this.redis) {
      return this.ThreatModel.findAll({
        where: { severity: 'CRITICAL', status: { [Op.notIn]: ['RESOLVED', 'ARCHIVED'] } },
        include: [
          { model: this.IndicatorModel, as: 'indicators' },
          { model: this.AffectedSystemModel, as: 'affectedSystems' },
        ],
        order: [['createdAt', 'DESC']],
      });
    }

    return executeWithCache(
      this.ThreatModel,
      {
        where: { severity: 'CRITICAL', status: { [Op.notIn]: ['RESOLVED', 'ARCHIVED'] } },
        include: [
          { model: this.IndicatorModel, as: 'indicators' },
          { model: this.AffectedSystemModel, as: 'affectedSystems' },
        ],
        order: [['createdAt', 'DESC']],
      },
      {
        ttl: 300, // 5 minutes
        key: 'threats:critical:active',
        tags: ['threats', 'critical'],
        redis: this.redis,
      }
    );
  }

  /**
   * Find threats from the last N days with caching
   * Cache TTL: 10 minutes
   */
  async findRecentThreats(days: number = 7): Promise<IThreatIntelligence[]> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    if (!this.redis) {
      return this.ThreatModel.findAll({
        where: { createdAt: { [Op.gte]: cutoffDate } },
        include: [
          { model: this.IndicatorModel, as: 'indicators' },
        ],
        order: [['createdAt', 'DESC']],
      });
    }

    return executeWithCache(
      this.ThreatModel,
      {
        where: { createdAt: { [Op.gte]: cutoffDate } },
        include: [
          { model: this.IndicatorModel, as: 'indicators' },
        ],
        order: [['createdAt', 'DESC']],
      },
      {
        ttl: 600, // 10 minutes
        key: `threats:recent:${days}days`,
        tags: ['threats', 'recent'],
        redis: this.redis,
      }
    );
  }

  /**
   * Analyze threat with complete history and relationships
   * Uses eager loading to prevent N+1 queries
   * Cache TTL: 15 minutes
   */
  async analyzeWithHistory(threatId: string): Promise<ThreatWithHistory | null> {
    if (!this.redis) {
      return this.ThreatModel.findByPk(threatId, {
        include: [
          { model: this.IndicatorModel, as: 'indicators' },
          { model: this.AffectedSystemModel, as: 'affectedSystems' },
          {
            model: this.ThreatModel,
            as: 'relatedThreats',
            where: { type: literal('ThreatIntelligence.type') },
            required: false,
            limit: 10,
          },
          {
            model: this.ThreatHistoryModel,
            as: 'history',
            order: [['timestamp', 'DESC']],
            limit: 50,
          },
        ],
      }) as Promise<ThreatWithHistory | null>;
    }

    return executeWithCache(
      this.ThreatModel,
      {
        where: { id: threatId },
        include: [
          { model: this.IndicatorModel, as: 'indicators' },
          { model: this.AffectedSystemModel, as: 'affectedSystems' },
          {
            model: this.ThreatModel,
            as: 'relatedThreats',
            where: { type: literal('ThreatIntelligence.type') },
            required: false,
            limit: 10,
          },
          {
            model: this.ThreatHistoryModel,
            as: 'history',
            order: [['timestamp', 'DESC']],
            limit: 50,
          },
        ],
      },
      {
        ttl: 900, // 15 minutes
        key: `threat:analysis:${threatId}`,
        tags: ['threat', 'analysis', threatId],
        redis: this.redis,
      }
    ) as Promise<ThreatWithHistory | null>;
  }

  /**
   * Find threats by complex filters with caching
   */
  async findByFilters(filters: ThreatQueryFilters): Promise<IThreatIntelligence[]> {
    const where: any = {};

    if (filters.severity) {
      where.severity = Array.isArray(filters.severity)
        ? { [Op.in]: filters.severity }
        : filters.severity;
    }

    if (filters.status) {
      where.status = Array.isArray(filters.status)
        ? { [Op.in]: filters.status }
        : filters.status;
    }

    if (filters.type) {
      where.type = Array.isArray(filters.type)
        ? { [Op.in]: filters.type }
        : filters.type;
    }

    if (filters.tlp) {
      where.tlp = Array.isArray(filters.tlp)
        ? { [Op.in]: filters.tlp }
        : filters.tlp;
    }

    if (filters.minConfidence !== undefined) {
      where.confidence = { [Op.gte]: filters.minConfidence };
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        where.createdAt[Op.gte] = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.createdAt[Op.lte] = filters.dateTo;
      }
    }

    if (filters.searchTerm) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${filters.searchTerm}%` } },
        { description: { [Op.iLike]: `%${filters.searchTerm}%` } },
      ];
    }

    const cacheKey = `threats:filter:${JSON.stringify(filters)}`;

    if (!this.redis) {
      return this.ThreatModel.findAll({
        where,
        include: [
          { model: this.IndicatorModel, as: 'indicators' },
        ],
        order: [['createdAt', 'DESC']],
      });
    }

    return executeWithCache(
      this.ThreatModel,
      {
        where,
        include: [
          { model: this.IndicatorModel, as: 'indicators' },
        ],
        order: [['createdAt', 'DESC']],
      },
      {
        ttl: 600,
        key: cacheKey,
        tags: ['threats', 'filter'],
        redis: this.redis,
      }
    );
  }

  /**
   * Get threat statistics with caching
   */
  async getThreatStatistics(): Promise<{
    total: number;
    bySeverity: Record<string, number>;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
  }> {
    const cacheKey = 'threats:statistics';

    if (!this.redis) {
      return this.calculateStatistics();
    }

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const stats = await this.calculateStatistics();
    await this.redis.setex(cacheKey, 300, JSON.stringify(stats)); // 5 min cache

    return stats;
  }

  private async calculateStatistics() {
    const [total, bySeverity, byStatus, byType] = await Promise.all([
      this.ThreatModel.count(),
      this.ThreatModel.findAll({
        attributes: ['severity', [fn('COUNT', col('id')), 'count']],
        group: ['severity'],
        raw: true,
      }),
      this.ThreatModel.findAll({
        attributes: ['status', [fn('COUNT', col('id')), 'count']],
        group: ['status'],
        raw: true,
      }),
      this.ThreatModel.findAll({
        attributes: ['type', [fn('COUNT', col('id')), 'count']],
        group: ['type'],
        raw: true,
      }),
    ]);

    return {
      total,
      bySeverity: this.arrayToRecord(bySeverity),
      byStatus: this.arrayToRecord(byStatus),
      byType: this.arrayToRecord(byType),
    };
  }

  private arrayToRecord(arr: any[]): Record<string, number> {
    return arr.reduce((acc, item) => {
      acc[item.severity || item.status || item.type] = parseInt(item.count, 10);
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Invalidate threat-related caches
   */
  async invalidateThreatCaches(threatId?: string): Promise<void> {
    if (!this.redis) return;

    if (threatId) {
      await invalidateCache(this.redis, `threat:analysis:${threatId}`);
      await invalidateCache(this.redis, threatId);
    }

    await invalidateCacheByPattern(this.redis, 'threats:*');
  }
}

// ============================================================================
// HEALTHCARE QUERY UTILITIES
// ============================================================================

/**
 * HIPAA-compliant patient query utilities
 */
export class PatientQueryUtils {
  private sequelize: Sequelize;
  private redis?: Redis;
  private PatientModel: ModelStatic<any>;
  private MedicalRecordModel: ModelStatic<any>;

  constructor(
    sequelize: Sequelize,
    redis: Redis | undefined,
    models: {
      Patient: ModelStatic<any>;
      MedicalRecord: ModelStatic<any>;
    }
  ) {
    this.sequelize = sequelize;
    this.redis = redis;
    this.PatientModel = models.Patient;
    this.MedicalRecordModel = models.MedicalRecord;
  }

  /**
   * Find patient with medical records (HIPAA compliant - no caching of PHI)
   */
  async findPatientWithRecords(patientId: string): Promise<any> {
    return this.PatientModel.findByPk(patientId, {
      include: [
        {
          model: this.MedicalRecordModel,
          as: 'medicalRecords',
          order: [['createdAt', 'DESC']],
        },
      ],
    });
  }

  /**
   * Search patients by non-PHI fields (can be cached)
   */
  async searchPatientsByStatus(status: string): Promise<any[]> {
    const cacheKey = `patients:status:${status}`;

    if (!this.redis) {
      return this.PatientModel.findAll({
        where: { status },
        attributes: ['id', 'status', 'lastVisit'], // Exclude PHI
        order: [['lastVisit', 'DESC']],
      });
    }

    return executeWithCache(
      this.PatientModel,
      {
        where: { status },
        attributes: ['id', 'status', 'lastVisit'], // Exclude PHI
        order: [['lastVisit', 'DESC']],
      },
      {
        ttl: 600,
        key: cacheKey,
        tags: ['patients', 'status'],
        redis: this.redis,
      }
    );
  }
}

// ============================================================================
// WORKFLOW QUERY UTILITIES
// ============================================================================

/**
 * Workflow state query utilities
 */
export class WorkflowQueryUtils {
  private sequelize: Sequelize;
  private redis?: Redis;
  private WorkflowModel: ModelStatic<any>;
  private StateSnapshotModel: ModelStatic<any>;

  constructor(
    sequelize: Sequelize,
    redis: Redis | undefined,
    models: {
      Workflow: ModelStatic<any>;
      StateSnapshot: ModelStatic<any>;
    }
  ) {
    this.sequelize = sequelize;
    this.redis = redis;
    this.WorkflowModel = models.Workflow;
    this.StateSnapshotModel = models.StateSnapshot;
  }

  /**
   * Find active workflows with state snapshots
   */
  async findActiveWorkflows(): Promise<any[]> {
    const cacheKey = 'workflows:active';

    if (!this.redis) {
      return this.WorkflowModel.findAll({
        where: { status: 'ACTIVE' },
        include: [
          {
            model: this.StateSnapshotModel,
            as: 'snapshots',
            order: [['createdAt', 'DESC']],
            limit: 5,
          },
        ],
        order: [['updatedAt', 'DESC']],
      });
    }

    return executeWithCache(
      this.WorkflowModel,
      {
        where: { status: 'ACTIVE' },
        include: [
          {
            model: this.StateSnapshotModel,
            as: 'snapshots',
            order: [['createdAt', 'DESC']],
            limit: 5,
          },
        ],
        order: [['updatedAt', 'DESC']],
      },
      {
        ttl: 300,
        key: cacheKey,
        tags: ['workflows', 'active'],
        redis: this.redis,
      }
    );
  }
}

// ============================================================================
// EXPORT FACTORY FUNCTION
// ============================================================================

/**
 * Create all query utilities with proper dependencies
 */
export function createQueryUtils(
  sequelize: Sequelize,
  redis: Redis | undefined,
  models: any
) {
  return {
    threats: new ThreatQueryUtils(sequelize, redis, {
      Threat: models.ThreatIntelligence,
      Indicator: models.Indicator,
      AffectedSystem: models.AffectedSystem,
      ThreatHistory: models.ThreatHistory,
    }),
    patients: new PatientQueryUtils(sequelize, redis, {
      Patient: models.Patient,
      MedicalRecord: models.MedicalRecord,
    }),
    workflows: new WorkflowQueryUtils(sequelize, redis, {
      Workflow: models.Workflow,
      StateSnapshot: models.StateSnapshot,
    }),
  };
}
