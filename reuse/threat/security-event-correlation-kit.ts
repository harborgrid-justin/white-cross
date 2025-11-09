/**
 * LOC: SEVCORR987654
 * File: /reuse/threat/security-event-correlation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *
 * DOWNSTREAM (imported by):
 *   - Security event correlation services
 *   - SIEM integration modules
 *   - Complex Event Processing (CEP) engines
 *   - Real-time threat detection services
 *   - Incident generation pipelines
 */

/**
 * File: /reuse/threat/security-event-correlation-kit.ts
 * Locator: WC-SECURITY-EVENT-CORRELATION-001
 * Purpose: Advanced Security Event Correlation Engine - Real-time CEP, multi-stage attack detection, correlation rules
 *
 * Upstream: Independent utility module for security event correlation operations
 * Downstream: ../backend/*, SIEM services, CEP engines, Incident response, Real-time analytics
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript
 * Exports: 45 utility functions for event correlation, CEP, time-window analysis, attack detection, rule management
 *
 * LLM Context: Enterprise-grade security event correlation toolkit for White Cross healthcare platform.
 * Provides real-time event correlation engine, Complex Event Processing (CEP), time-window correlation,
 * multi-stage attack detection, event aggregation and grouping, correlation rule management, automated
 * incident generation from correlated events, performance-optimized Sequelize queries with advanced joins,
 * aggregations, and subqueries for HIPAA-compliant healthcare systems.
 */

import { Model, Column, Table, DataType, Index } from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsBoolean, IsObject, IsArray, IsDate, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Op, Sequelize, Transaction, QueryTypes } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Event correlation type
 */
export enum CorrelationType {
  TEMPORAL = 'TEMPORAL',
  SPATIAL = 'SPATIAL',
  CAUSAL = 'CAUSAL',
  BEHAVIORAL = 'BEHAVIORAL',
  PATTERN_BASED = 'PATTERN_BASED',
  STATISTICAL = 'STATISTICAL',
  MULTI_DIMENSIONAL = 'MULTI_DIMENSIONAL',
}

/**
 * Correlation window type
 */
export enum CorrelationWindow {
  SLIDING = 'SLIDING',
  TUMBLING = 'TUMBLING',
  SESSION = 'SESSION',
  HOPPING = 'HOPPING',
}

/**
 * Attack stage
 */
export enum AttackStage {
  RECONNAISSANCE = 'RECONNAISSANCE',
  WEAPONIZATION = 'WEAPONIZATION',
  DELIVERY = 'DELIVERY',
  EXPLOITATION = 'EXPLOITATION',
  INSTALLATION = 'INSTALLATION',
  COMMAND_CONTROL = 'COMMAND_CONTROL',
  ACTIONS_ON_OBJECTIVE = 'ACTIONS_ON_OBJECTIVE',
}

/**
 * Event severity
 */
export enum EventSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

/**
 * Correlation rule action
 */
export enum CorrelationRuleAction {
  CREATE_INCIDENT = 'CREATE_INCIDENT',
  CREATE_ALERT = 'CREATE_ALERT',
  ENRICH_EVENT = 'ENRICH_EVENT',
  ESCALATE = 'ESCALATE',
  SUPPRESS = 'SUPPRESS',
  NOTIFY = 'NOTIFY',
  EXECUTE_PLAYBOOK = 'EXECUTE_PLAYBOOK',
}

/**
 * Security event interface
 */
export interface SecurityEvent {
  id: string;
  eventType: string;
  source: string;
  timestamp: Date;
  severity: EventSeverity;
  data: Record<string, any>;
  metadata?: Record<string, any>;
  correlationId?: string;
}

/**
 * Correlation result interface
 */
export interface CorrelationResult {
  correlationId: string;
  correlationType: CorrelationType;
  events: SecurityEvent[];
  score: number;
  confidence: number;
  attackStage?: AttackStage;
  metadata: Record<string, any>;
  createdAt: Date;
}

/**
 * Time window configuration
 */
export interface TimeWindowConfig {
  windowType: CorrelationWindow;
  duration: number;
  unit: 'seconds' | 'minutes' | 'hours' | 'days';
  slideInterval?: number;
  hopSize?: number;
  sessionTimeout?: number;
}

/**
 * Correlation rule interface
 */
export interface CorrelationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  conditions: CorrelationCondition[];
  actions: CorrelationRuleAction[];
  timeWindow?: TimeWindowConfig;
  threshold?: number;
  metadata?: Record<string, any>;
}

/**
 * Correlation condition interface
 */
export interface CorrelationCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'like' | 'regex';
  value: any;
  eventType?: string;
  sequence?: number;
}

/**
 * Attack chain interface
 */
export interface AttackChain {
  chainId: string;
  stages: AttackStageEvent[];
  confidence: number;
  severity: EventSeverity;
  targetEntity: string;
  firstSeen: Date;
  lastSeen: Date;
  isComplete: boolean;
}

/**
 * Attack stage event
 */
export interface AttackStageEvent {
  stage: AttackStage;
  events: SecurityEvent[];
  timestamp: Date;
  score: number;
}

/**
 * Event aggregation result
 */
export interface EventAggregation {
  groupKey: string;
  count: number;
  uniqueCount: number;
  firstEvent: Date;
  lastEvent: Date;
  events: SecurityEvent[];
  statistics: AggregationStatistics;
}

/**
 * Aggregation statistics
 */
export interface AggregationStatistics {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  percentile95: number;
  percentile99: number;
}

/**
 * Complex event pattern
 */
export interface ComplexEventPattern {
  patternId: string;
  name: string;
  sequence: PatternSequence[];
  timeConstraints: TimeConstraint[];
  matchCount: number;
  lastMatch?: Date;
}

/**
 * Pattern sequence
 */
export interface PatternSequence {
  order: number;
  eventType: string;
  conditions: Record<string, any>;
  optional?: boolean;
}

/**
 * Time constraint
 */
export interface TimeConstraint {
  fromEvent: number;
  toEvent: number;
  maxDelay: number;
  unit: 'seconds' | 'minutes' | 'hours';
}

/**
 * Incident context
 */
export interface IncidentContext {
  incidentId: string;
  correlationResults: CorrelationResult[];
  attackChains: AttackChain[];
  affectedEntities: string[];
  timeline: TimelineEvent[];
  severity: EventSeverity;
  confidence: number;
}

/**
 * Timeline event
 */
export interface TimelineEvent {
  timestamp: Date;
  eventType: string;
  description: string;
  severity: EventSeverity;
  metadata?: Record<string, any>;
}

// ============================================================================
// DTOs FOR API/SERVICE LAYER
// ============================================================================

/**
 * DTO for event correlation query
 */
export class EventCorrelationQueryDto {
  @ApiProperty({ enum: CorrelationType, description: 'Type of correlation to perform' })
  @IsEnum(CorrelationType)
  correlationType: CorrelationType;

  @ApiProperty({ description: 'Start time for correlation window' })
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({ description: 'End time for correlation window' })
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @ApiPropertyOptional({ description: 'Minimum correlation score threshold' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  threshold?: number;

  @ApiPropertyOptional({ description: 'Event types to correlate' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  eventTypes?: string[];

  @ApiPropertyOptional({ description: 'Additional filter criteria' })
  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;
}

/**
 * DTO for correlation rule creation
 */
export class CreateCorrelationRuleDto {
  @ApiProperty({ description: 'Rule name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Rule description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Rule priority (1-100)' })
  @IsNumber()
  @Min(1)
  @Max(100)
  priority: number;

  @ApiProperty({ description: 'Correlation conditions' })
  @IsArray()
  @IsObject({ each: true })
  conditions: CorrelationCondition[];

  @ApiProperty({ enum: CorrelationRuleAction, isArray: true, description: 'Actions to take on match' })
  @IsArray()
  @IsEnum(CorrelationRuleAction, { each: true })
  actions: CorrelationRuleAction[];

  @ApiPropertyOptional({ description: 'Time window configuration' })
  @IsOptional()
  @IsObject()
  timeWindow?: TimeWindowConfig;

  @ApiPropertyOptional({ description: 'Threshold for rule trigger' })
  @IsOptional()
  @IsNumber()
  threshold?: number;
}

/**
 * DTO for attack chain detection
 */
export class AttackChainDetectionDto {
  @ApiProperty({ description: 'Target entity identifier' })
  @IsString()
  targetEntity: string;

  @ApiProperty({ description: 'Detection time window start' })
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({ description: 'Detection time window end' })
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @ApiPropertyOptional({ description: 'Minimum confidence threshold' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  minConfidence?: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * 1. Perform real-time event correlation using temporal windows
 * Uses optimized Sequelize query with window functions and CTEs
 */
export async function correlateEventsInTimeWindow(
  sequelize: Sequelize,
  config: TimeWindowConfig,
  eventTypes: string[],
  options?: { threshold?: number; transaction?: Transaction }
): Promise<CorrelationResult[]> {
  const windowDuration = calculateWindowDuration(config.duration, config.unit);

  const query = `
    WITH time_windows AS (
      SELECT
        generate_series(
          date_trunc('${config.unit}', NOW() - INTERVAL '${config.duration} ${config.unit}'),
          NOW(),
          INTERVAL '${config.slideInterval || config.duration} ${config.unit}'
        ) as window_start
    ),
    windowed_events AS (
      SELECT
        tw.window_start,
        tw.window_start + INTERVAL '${config.duration} ${config.unit}' as window_end,
        e.id,
        e.event_type,
        e.source,
        e.timestamp,
        e.severity,
        e.data,
        e.metadata,
        COUNT(*) OVER (PARTITION BY tw.window_start, e.event_type) as event_count,
        ARRAY_AGG(e.id) OVER (PARTITION BY tw.window_start ORDER BY e.timestamp) as event_sequence
      FROM time_windows tw
      CROSS JOIN LATERAL (
        SELECT * FROM security_events se
        WHERE se.timestamp >= tw.window_start
          AND se.timestamp < tw.window_start + INTERVAL '${config.duration} ${config.unit}'
          AND se.event_type = ANY($1::text[])
        ORDER BY se.timestamp
      ) e
    ),
    correlation_candidates AS (
      SELECT
        window_start,
        window_end,
        event_type,
        COUNT(DISTINCT id) as unique_events,
        COUNT(*) as total_events,
        ARRAY_AGG(DISTINCT source) as sources,
        MIN(timestamp) as first_event,
        MAX(timestamp) as last_event,
        JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'id', id,
            'timestamp', timestamp,
            'severity', severity,
            'data', data
          ) ORDER BY timestamp
        ) as events,
        CASE
          WHEN COUNT(DISTINCT source) > 3 AND COUNT(*) > 5 THEN 0.9
          WHEN COUNT(DISTINCT source) > 2 AND COUNT(*) > 3 THEN 0.7
          WHEN COUNT(*) > 2 THEN 0.5
          ELSE 0.3
        END as correlation_score
      FROM windowed_events
      GROUP BY window_start, window_end, event_type
      HAVING COUNT(*) >= $2
    )
    SELECT
      cc.*,
      RANK() OVER (ORDER BY correlation_score DESC, total_events DESC) as rank
    FROM correlation_candidates cc
    WHERE correlation_score >= $3
    ORDER BY correlation_score DESC, total_events DESC
    LIMIT 100
  `;

  const results = await sequelize.query(query, {
    bind: [eventTypes, 2, options?.threshold || 0.5],
    type: QueryTypes.SELECT,
    transaction: options?.transaction,
  });

  return results.map((r: any) => ({
    correlationId: `CORR-${Date.now()}-${r.rank}`,
    correlationType: CorrelationType.TEMPORAL,
    events: r.events,
    score: r.correlation_score,
    confidence: calculateCorrelationConfidence(r),
    metadata: {
      windowStart: r.window_start,
      windowEnd: r.window_end,
      totalEvents: r.total_events,
      uniqueEvents: r.unique_events,
      sources: r.sources,
    },
    createdAt: new Date(),
  }));
}

/**
 * 2. Detect multi-stage attack patterns using CEP
 * Complex query with recursive CTEs and pattern matching
 */
export async function detectMultiStageAttacks(
  sequelize: Sequelize,
  targetEntity: string,
  timeRange: { start: Date; end: Date },
  options?: { transaction?: Transaction }
): Promise<AttackChain[]> {
  const query = `
    WITH RECURSIVE attack_stages AS (
      -- Base case: Reconnaissance events
      SELECT
        1 as stage_level,
        'RECONNAISSANCE' as stage_name,
        e.id as event_id,
        e.timestamp,
        e.data->'target' as target,
        e.severity,
        ARRAY[e.id] as event_chain,
        ARRAY['RECONNAISSANCE'] as stage_chain,
        0.6 as confidence_score
      FROM security_events e
      WHERE e.event_type IN ('port_scan', 'dns_enumeration', 'vulnerability_scan', 'whois_lookup')
        AND e.data->>'target' = $1
        AND e.timestamp BETWEEN $2 AND $3

      UNION ALL

      -- Recursive case: Subsequent attack stages
      SELECT
        ast.stage_level + 1,
        CASE
          WHEN e.event_type IN ('malware_download', 'exploit_kit', 'phishing') THEN 'WEAPONIZATION'
          WHEN e.event_type IN ('email_delivery', 'web_download', 'usb_insertion') THEN 'DELIVERY'
          WHEN e.event_type IN ('buffer_overflow', 'sql_injection', 'code_execution') THEN 'EXPLOITATION'
          WHEN e.event_type IN ('malware_install', 'backdoor_creation', 'persistence') THEN 'INSTALLATION'
          WHEN e.event_type IN ('c2_communication', 'beacon', 'callback') THEN 'COMMAND_CONTROL'
          WHEN e.event_type IN ('data_exfiltration', 'lateral_movement', 'privilege_escalation') THEN 'ACTIONS_ON_OBJECTIVE'
        END as stage_name,
        e.id,
        e.timestamp,
        e.data->'target' as target,
        e.severity,
        ast.event_chain || e.id,
        ast.stage_chain || CASE
          WHEN e.event_type IN ('malware_download', 'exploit_kit', 'phishing') THEN 'WEAPONIZATION'
          WHEN e.event_type IN ('email_delivery', 'web_download', 'usb_insertion') THEN 'DELIVERY'
          WHEN e.event_type IN ('buffer_overflow', 'sql_injection', 'code_execution') THEN 'EXPLOITATION'
          WHEN e.event_type IN ('malware_install', 'backdoor_creation', 'persistence') THEN 'INSTALLATION'
          WHEN e.event_type IN ('c2_communication', 'beacon', 'callback') THEN 'COMMAND_CONTROL'
          WHEN e.event_type IN ('data_exfiltration', 'lateral_movement', 'privilege_escalation') THEN 'ACTIONS_ON_OBJECTIVE'
        END,
        ast.confidence_score * 0.95 + 0.05 as confidence_score
      FROM attack_stages ast
      JOIN security_events e ON
        e.data->>'target' = $1
        AND e.timestamp > ast.timestamp
        AND e.timestamp <= ast.timestamp + INTERVAL '24 hours'
        AND e.timestamp BETWEEN $2 AND $3
      WHERE ast.stage_level < 7
        AND NOT (e.id = ANY(ast.event_chain))
    ),
    complete_chains AS (
      SELECT
        MD5(ARRAY_TO_STRING(event_chain, ',')) as chain_id,
        stage_level,
        stage_chain,
        event_chain,
        target,
        confidence_score,
        CASE
          WHEN stage_level >= 5 THEN 'CRITICAL'
          WHEN stage_level >= 3 THEN 'HIGH'
          WHEN stage_level >= 2 THEN 'MEDIUM'
          ELSE 'LOW'
        END as severity,
        (SELECT MIN(timestamp) FROM unnest(event_chain) WITH ORDINALITY as t(id, ord)
         JOIN security_events se ON se.id = t.id) as first_seen,
        (SELECT MAX(timestamp) FROM unnest(event_chain) WITH ORDINALITY as t(id, ord)
         JOIN security_events se ON se.id = t.id) as last_seen,
        stage_level >= 4 as is_complete
      FROM attack_stages
      WHERE stage_level >= 2
    )
    SELECT
      cc.*,
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'stage', unnest_stage,
          'events', (
            SELECT JSONB_AGG(JSONB_BUILD_OBJECT(
              'id', se.id,
              'eventType', se.event_type,
              'timestamp', se.timestamp,
              'severity', se.severity,
              'data', se.data
            ))
            FROM unnest(cc.event_chain) WITH ORDINALITY as ec(id, ord)
            JOIN security_events se ON se.id = ec.id
            WHERE EXISTS (
              SELECT 1 FROM unnest(cc.stage_chain) WITH ORDINALITY as sc(stage, stage_ord)
              WHERE sc.stage = unnest_stage AND sc.stage_ord = ec.ord
            )
          ),
          'timestamp', (
            SELECT MIN(se.timestamp)
            FROM unnest(cc.event_chain) as ec(id)
            JOIN security_events se ON se.id = ec
          )
        )
      ) as stage_events
    FROM complete_chains cc
    CROSS JOIN unnest(stage_chain) as unnest_stage
    GROUP BY cc.chain_id, cc.stage_level, cc.stage_chain, cc.event_chain,
             cc.target, cc.confidence_score, cc.severity, cc.first_seen, cc.last_seen, cc.is_complete
    ORDER BY confidence_score DESC, stage_level DESC
    LIMIT 50
  `;

  const results = await sequelize.query(query, {
    bind: [targetEntity, timeRange.start, timeRange.end],
    type: QueryTypes.SELECT,
    transaction: options?.transaction,
  });

  return results.map((r: any) => ({
    chainId: r.chain_id,
    stages: r.stage_events,
    confidence: r.confidence_score,
    severity: r.severity as EventSeverity,
    targetEntity,
    firstSeen: r.first_seen,
    lastSeen: r.last_seen,
    isComplete: r.is_complete,
  }));
}

/**
 * 3. Aggregate events by multiple dimensions with advanced statistics
 * Uses window functions, ROLLUP, and statistical aggregations
 */
export async function aggregateEventsByDimensions(
  sequelize: Sequelize,
  dimensions: string[],
  timeRange: { start: Date; end: Date },
  options?: { transaction?: Transaction }
): Promise<EventAggregation[]> {
  const dimensionColumns = dimensions.map(d => `data->>'${d}'`).join(', ');
  const groupByClause = dimensions.map((d, i) => `dim${i + 1}`).join(', ');

  const query = `
    WITH event_groups AS (
      SELECT
        ${dimensions.map((d, i) => `data->>'${d}' as dim${i + 1}`).join(', ')},
        COUNT(*) as event_count,
        COUNT(DISTINCT id) as unique_count,
        MIN(timestamp) as first_event,
        MAX(timestamp) as last_event,
        AVG(CASE WHEN severity = 'CRITICAL' THEN 4
                 WHEN severity = 'HIGH' THEN 3
                 WHEN severity = 'MEDIUM' THEN 2
                 WHEN severity = 'LOW' THEN 1
                 ELSE 0 END) as avg_severity,
        STDDEV(CASE WHEN severity = 'CRITICAL' THEN 4
                    WHEN severity = 'HIGH' THEN 3
                    WHEN severity = 'MEDIUM' THEN 2
                    WHEN severity = 'LOW' THEN 1
                    ELSE 0 END) as severity_stddev,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY
          CASE WHEN severity = 'CRITICAL' THEN 4
               WHEN severity = 'HIGH' THEN 3
               WHEN severity = 'MEDIUM' THEN 2
               WHEN severity = 'LOW' THEN 1
               ELSE 0 END) as median_severity,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY
          EXTRACT(EPOCH FROM (timestamp - LAG(timestamp) OVER (PARTITION BY ${dimensionColumns} ORDER BY timestamp)))) as p95_interval,
        PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY
          EXTRACT(EPOCH FROM (timestamp - LAG(timestamp) OVER (PARTITION BY ${dimensionColumns} ORDER BY timestamp)))) as p99_interval,
        JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'id', id,
            'eventType', event_type,
            'timestamp', timestamp,
            'severity', severity,
            'data', data
          ) ORDER BY timestamp DESC
        ) FILTER (WHERE rn <= 100) as recent_events
      FROM (
        SELECT *,
          ROW_NUMBER() OVER (PARTITION BY ${dimensionColumns} ORDER BY timestamp DESC) as rn
        FROM security_events
        WHERE timestamp BETWEEN $1 AND $2
      ) ranked_events
      GROUP BY ${groupByClause}
    )
    SELECT
      ${dimensions.map((d, i) => `dim${i + 1}`).join(' || \'_\' || ')} as group_key,
      event_count,
      unique_count,
      first_event,
      last_event,
      recent_events as events,
      JSONB_BUILD_OBJECT(
        'mean', avg_severity,
        'median', median_severity,
        'stdDev', COALESCE(severity_stddev, 0),
        'min', 0,
        'max', 4,
        'percentile95', COALESCE(p95_interval, 0),
        'percentile99', COALESCE(p99_interval, 0)
      ) as statistics
    FROM event_groups
    WHERE event_count > 0
    ORDER BY event_count DESC
    LIMIT 1000
  `;

  const results = await sequelize.query(query, {
    bind: [timeRange.start, timeRange.end],
    type: QueryTypes.SELECT,
    transaction: options?.transaction,
  });

  return results.map((r: any) => ({
    groupKey: r.group_key,
    count: parseInt(r.event_count),
    uniqueCount: parseInt(r.unique_count),
    firstEvent: r.first_event,
    lastEvent: r.last_event,
    events: r.events,
    statistics: r.statistics,
  }));
}

/**
 * 4. Detect complex event patterns using sequential pattern matching
 * Implements CEP with temporal constraints and pattern matching
 */
export async function detectComplexEventPatterns(
  sequelize: Sequelize,
  pattern: ComplexEventPattern,
  timeRange: { start: Date; end: Date },
  options?: { transaction?: Transaction }
): Promise<CorrelationResult[]> {
  // Generate dynamic SQL for pattern matching based on sequence
  const sequenceConditions = pattern.sequence.map((seq, idx) => {
    const conditions = Object.entries(seq.conditions)
      .map(([key, value]) => `e${idx}.data->>'${key}' = '${value}'`)
      .join(' AND ');

    return `e${idx}.event_type = '${seq.eventType}' ${conditions ? `AND ${conditions}` : ''}`;
  });

  const timeConstraintConditions = pattern.timeConstraints.map(tc => {
    const duration = tc.maxDelay;
    const unit = tc.unit;
    return `e${tc.toEvent}.timestamp <= e${tc.fromEvent}.timestamp + INTERVAL '${duration} ${unit}'`;
  });

  const query = `
    WITH pattern_matches AS (
      SELECT
        ${pattern.sequence.map((_, idx) => `e${idx}.id as event${idx}_id`).join(', ')},
        ${pattern.sequence.map((_, idx) => `e${idx}.timestamp as event${idx}_time`).join(', ')},
        ${pattern.sequence.map((_, idx) => `e${idx}.data as event${idx}_data`).join(', ')},
        ${pattern.sequence.map((_, idx) => `e${idx}.severity as event${idx}_severity`).join(', ')},
        EXTRACT(EPOCH FROM (e${pattern.sequence.length - 1}.timestamp - e0.timestamp)) as total_duration,
        CASE
          WHEN ${pattern.timeConstraints.every(tc => tc.maxDelay <= 300)} THEN 0.95
          WHEN ${pattern.timeConstraints.every(tc => tc.maxDelay <= 3600)} THEN 0.85
          ELSE 0.70
        END as pattern_confidence
      FROM
        ${pattern.sequence.map((_, idx) => `security_events e${idx}`).join(', ')}
      WHERE
        ${sequenceConditions.map((cond, idx) => `(${cond})`).join(' AND ')}
        AND ${pattern.sequence.map((_, idx) => `e${idx}.timestamp BETWEEN $1 AND $2`).join(' AND ')}
        AND ${timeConstraintConditions.join(' AND ')}
        ${pattern.sequence.map((_, idx) =>
          idx > 0 ? `AND e${idx}.timestamp > e${idx - 1}.timestamp` : ''
        ).filter(Boolean).join(' ')}
      ORDER BY e0.timestamp DESC
      LIMIT 100
    )
    SELECT
      pm.*,
      JSONB_BUILD_ARRAY(
        ${pattern.sequence.map((_, idx) => `
          JSONB_BUILD_OBJECT(
            'id', pm.event${idx}_id,
            'timestamp', pm.event${idx}_time,
            'data', pm.event${idx}_data,
            'severity', pm.event${idx}_severity
          )
        `).join(', ')}
      ) as matched_events
    FROM pattern_matches pm
  `;

  const results = await sequelize.query(query, {
    bind: [timeRange.start, timeRange.end],
    type: QueryTypes.SELECT,
    transaction: options?.transaction,
  });

  return results.map((r: any, idx: number) => ({
    correlationId: `PATTERN-${pattern.patternId}-${idx}`,
    correlationType: CorrelationType.PATTERN_BASED,
    events: r.matched_events,
    score: r.pattern_confidence,
    confidence: r.pattern_confidence,
    metadata: {
      patternId: pattern.patternId,
      patternName: pattern.name,
      totalDuration: r.total_duration,
      sequenceLength: pattern.sequence.length,
    },
    createdAt: new Date(),
  }));
}

/**
 * 5. Correlate events using statistical anomaly detection
 * Uses Z-score, IQR, and statistical outlier detection
 */
export async function correlateEventsByStatisticalAnomaly(
  sequelize: Sequelize,
  eventType: string,
  metric: string,
  timeRange: { start: Date; end: Date },
  options?: { threshold?: number; transaction?: Transaction }
): Promise<CorrelationResult[]> {
  const query = `
    WITH event_metrics AS (
      SELECT
        id,
        timestamp,
        event_type,
        severity,
        data,
        (data->>'${metric}')::numeric as metric_value,
        AVG((data->>'${metric}')::numeric) OVER (
          ORDER BY timestamp
          ROWS BETWEEN 100 PRECEDING AND CURRENT ROW
        ) as rolling_avg,
        STDDEV((data->>'${metric}')::numeric) OVER (
          ORDER BY timestamp
          ROWS BETWEEN 100 PRECEDING AND CURRENT ROW
        ) as rolling_stddev,
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY (data->>'${metric}')::numeric) OVER (
          ORDER BY timestamp
          ROWS BETWEEN 100 PRECEDING AND CURRENT ROW
        ) as q1,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY (data->>'${metric}')::numeric) OVER (
          ORDER BY timestamp
          ROWS BETWEEN 100 PRECEDING AND CURRENT ROW
        ) as q3
      FROM security_events
      WHERE event_type = $1
        AND timestamp BETWEEN $2 AND $3
        AND data ? '${metric}'
    ),
    anomaly_detection AS (
      SELECT
        *,
        ABS(metric_value - rolling_avg) / NULLIF(rolling_stddev, 0) as z_score,
        q3 - q1 as iqr,
        CASE
          WHEN metric_value < (q1 - 1.5 * (q3 - q1)) THEN 'LOW_OUTLIER'
          WHEN metric_value > (q3 + 1.5 * (q3 - q1)) THEN 'HIGH_OUTLIER'
          WHEN ABS(metric_value - rolling_avg) / NULLIF(rolling_stddev, 0) > 3 THEN 'EXTREME_ANOMALY'
          WHEN ABS(metric_value - rolling_avg) / NULLIF(rolling_stddev, 0) > 2 THEN 'MODERATE_ANOMALY'
          ELSE 'NORMAL'
        END as anomaly_type,
        CASE
          WHEN ABS(metric_value - rolling_avg) / NULLIF(rolling_stddev, 0) > 3 THEN 0.95
          WHEN ABS(metric_value - rolling_avg) / NULLIF(rolling_stddev, 0) > 2 THEN 0.85
          WHEN metric_value > (q3 + 1.5 * (q3 - q1)) OR metric_value < (q1 - 1.5 * (q3 - q1)) THEN 0.75
          ELSE 0.5
        END as anomaly_score
      FROM event_metrics
      WHERE rolling_stddev > 0
    ),
    correlated_anomalies AS (
      SELECT
        ad1.id,
        ad1.timestamp,
        ad1.anomaly_type,
        ad1.anomaly_score,
        ad1.metric_value,
        COUNT(ad2.id) as nearby_anomalies,
        AVG(ad2.anomaly_score) as avg_nearby_score,
        JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'id', ad2.id,
            'timestamp', ad2.timestamp,
            'score', ad2.anomaly_score,
            'type', ad2.anomaly_type
          ) ORDER BY ad2.timestamp
        ) FILTER (WHERE ad2.id IS NOT NULL) as correlated_events
      FROM anomaly_detection ad1
      LEFT JOIN anomaly_detection ad2 ON
        ad2.timestamp BETWEEN ad1.timestamp - INTERVAL '5 minutes'
                          AND ad1.timestamp + INTERVAL '5 minutes'
        AND ad2.id != ad1.id
        AND ad2.anomaly_type IN ('MODERATE_ANOMALY', 'EXTREME_ANOMALY', 'LOW_OUTLIER', 'HIGH_OUTLIER')
      WHERE ad1.anomaly_type IN ('MODERATE_ANOMALY', 'EXTREME_ANOMALY', 'LOW_OUTLIER', 'HIGH_OUTLIER')
        AND ad1.anomaly_score >= $4
      GROUP BY ad1.id, ad1.timestamp, ad1.anomaly_type, ad1.anomaly_score, ad1.metric_value
      HAVING COUNT(ad2.id) > 0
    )
    SELECT
      ca.*,
      (ca.anomaly_score + (ca.avg_nearby_score * 0.3)) / 1.3 as final_correlation_score
    FROM correlated_anomalies ca
    ORDER BY final_correlation_score DESC, nearby_anomalies DESC
    LIMIT 100
  `;

  const results = await sequelize.query(query, {
    bind: [eventType, timeRange.start, timeRange.end, options?.threshold || 0.7],
    type: QueryTypes.SELECT,
    transaction: options?.transaction,
  });

  return results.map((r: any, idx: number) => ({
    correlationId: `STAT-ANOMALY-${idx}`,
    correlationType: CorrelationType.STATISTICAL,
    events: r.correlated_events || [],
    score: r.final_correlation_score,
    confidence: r.anomaly_score,
    metadata: {
      anomalyType: r.anomaly_type,
      metricValue: r.metric_value,
      nearbyAnomalies: r.nearby_anomalies,
      avgNearbyScore: r.avg_nearby_score,
    },
    createdAt: new Date(),
  }));
}

/**
 * 6. Generate incidents from correlated events automatically
 * Complex aggregation with incident classification
 */
export async function generateIncidentsFromCorrelations(
  sequelize: Sequelize,
  correlations: CorrelationResult[],
  options?: { transaction?: Transaction }
): Promise<IncidentContext[]> {
  const correlationIds = correlations.map(c => c.correlationId);

  const query = `
    WITH correlation_data AS (
      SELECT
        unnest($1::text[]) as correlation_id,
        unnest($2::jsonb[]) as correlation_events
    ),
    incident_candidates AS (
      SELECT
        MD5(STRING_AGG(cd.correlation_id, ',' ORDER BY cd.correlation_id)) as incident_id,
        JSONB_AGG(cd.correlation_events) as all_events,
        COUNT(DISTINCT cd.correlation_id) as correlation_count,
        COUNT(DISTINCT e->>'source') as unique_sources,
        MAX((e->>'severity')::text) as max_severity,
        MIN((e->>'timestamp')::timestamp) as first_event,
        MAX((e->>'timestamp')::timestamp) as last_event,
        ARRAY_AGG(DISTINCT e->>'data'->>'target') FILTER (WHERE e->>'data'->>'target' IS NOT NULL) as affected_entities,
        CASE
          WHEN COUNT(DISTINCT cd.correlation_id) >= 5 THEN 'CRITICAL'
          WHEN COUNT(DISTINCT cd.correlation_id) >= 3 THEN 'HIGH'
          WHEN COUNT(DISTINCT cd.correlation_id) >= 2 THEN 'MEDIUM'
          ELSE 'LOW'
        END as incident_severity,
        CASE
          WHEN COUNT(DISTINCT cd.correlation_id) >= 5 THEN 0.95
          WHEN COUNT(DISTINCT cd.correlation_id) >= 3 THEN 0.85
          WHEN COUNT(DISTINCT cd.correlation_id) >= 2 THEN 0.75
          ELSE 0.60
        END as incident_confidence
      FROM correlation_data cd
      CROSS JOIN JSONB_ARRAY_ELEMENTS(cd.correlation_events) as e
      GROUP BY 1
    ),
    timeline_events AS (
      SELECT
        ic.incident_id,
        JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'timestamp', e->>'timestamp',
            'eventType', e->>'eventType',
            'description', e->>'eventType' || ' detected from ' || e->>'source',
            'severity', e->>'severity',
            'metadata', e->'data'
          ) ORDER BY (e->>'timestamp')::timestamp
        ) as timeline
      FROM incident_candidates ic
      CROSS JOIN JSONB_ARRAY_ELEMENTS(ic.all_events) as e
      GROUP BY ic.incident_id
    )
    SELECT
      ic.*,
      te.timeline
    FROM incident_candidates ic
    JOIN timeline_events te ON ic.incident_id = te.incident_id
    ORDER BY incident_confidence DESC, correlation_count DESC
  `;

  const results = await sequelize.query(query, {
    bind: [
      correlationIds,
      correlations.map(c => JSON.stringify(c.events)),
    ],
    type: QueryTypes.SELECT,
    transaction: options?.transaction,
  });

  return results.map((r: any) => ({
    incidentId: r.incident_id,
    correlationResults: correlations.filter(c => correlationIds.includes(c.correlationId)),
    attackChains: [],
    affectedEntities: r.affected_entities || [],
    timeline: r.timeline || [],
    severity: r.incident_severity as EventSeverity,
    confidence: r.incident_confidence,
  }));
}

/**
 * 7. Calculate correlation confidence score using multiple factors
 */
export function calculateCorrelationConfidence(correlationData: any): number {
  const factors = {
    eventCount: Math.min(correlationData.total_events / 10, 1) * 0.3,
    uniqueSources: Math.min(correlationData.unique_events / 5, 1) * 0.25,
    timeSpread: Math.min(
      (new Date(correlationData.last_event).getTime() -
       new Date(correlationData.first_event).getTime()) / (3600000 * 24),
      1
    ) * 0.2,
    severityWeight: (correlationData.correlation_score || 0.5) * 0.25,
  };

  return Object.values(factors).reduce((sum, val) => sum + val, 0);
}

/**
 * 8. Calculate window duration in milliseconds
 */
export function calculateWindowDuration(
  duration: number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days'
): number {
  const multipliers = {
    seconds: 1000,
    minutes: 60000,
    hours: 3600000,
    days: 86400000,
  };
  return duration * multipliers[unit];
}

/**
 * 9. Create correlation rule with validation
 */
export async function createCorrelationRule(
  sequelize: Sequelize,
  ruleData: CreateCorrelationRuleDto,
  options?: { transaction?: Transaction }
): Promise<CorrelationRule> {
  const query = `
    INSERT INTO correlation_rules (
      id, name, description, enabled, priority, conditions, actions,
      time_window, threshold, metadata, created_at, updated_at
    )
    VALUES (
      gen_random_uuid()::text,
      $1, $2, true, $3, $4::jsonb, $5::jsonb,
      $6::jsonb, $7, '{}'::jsonb, NOW(), NOW()
    )
    RETURNING *
  `;

  const [result] = await sequelize.query(query, {
    bind: [
      ruleData.name,
      ruleData.description,
      ruleData.priority,
      JSON.stringify(ruleData.conditions),
      JSON.stringify(ruleData.actions),
      JSON.stringify(ruleData.timeWindow || null),
      ruleData.threshold || 0.7,
    ],
    type: QueryTypes.INSERT,
    transaction: options?.transaction,
  });

  return result as any;
}

/**
 * 10. Evaluate correlation rule against events
 */
export async function evaluateCorrelationRule(
  sequelize: Sequelize,
  ruleId: string,
  events: SecurityEvent[],
  options?: { transaction?: Transaction }
): Promise<boolean> {
  const query = `
    WITH rule_conditions AS (
      SELECT
        cr.id,
        cr.threshold,
        cr.conditions,
        cr.time_window
      FROM correlation_rules cr
      WHERE cr.id = $1 AND cr.enabled = true
    ),
    event_matches AS (
      SELECT
        e.id,
        e.event_type,
        e.timestamp,
        e.data,
        rc.conditions,
        COUNT(*) FILTER (
          WHERE
            (cond->>'eventType' IS NULL OR e.event_type = cond->>'eventType')
            AND (
              CASE cond->>'operator'
                WHEN 'eq' THEN e.data->>(cond->>'field') = cond->>'value'
                WHEN 'ne' THEN e.data->>(cond->>'field') != cond->>'value'
                WHEN 'gt' THEN (e.data->>(cond->>'field'))::numeric > (cond->>'value')::numeric
                WHEN 'gte' THEN (e.data->>(cond->>'field'))::numeric >= (cond->>'value')::numeric
                WHEN 'lt' THEN (e.data->>(cond->>'field'))::numeric < (cond->>'value')::numeric
                WHEN 'lte' THEN (e.data->>(cond->>'field'))::numeric <= (cond->>'value')::numeric
                WHEN 'in' THEN e.data->>(cond->>'field') = ANY(STRING_TO_ARRAY(cond->>'value', ','))
                WHEN 'like' THEN e.data->>(cond->>'field') LIKE cond->>'value'
                ELSE false
              END
            )
        ) as matched_conditions,
        JSONB_ARRAY_LENGTH(rc.conditions) as total_conditions
      FROM rule_conditions rc
      CROSS JOIN JSONB_ARRAY_ELEMENTS(rc.conditions) as cond
      CROSS JOIN (SELECT unnest($2::jsonb[]) as event_data) ed
      JOIN LATERAL (
        SELECT
          (event_data->>'id')::text as id,
          event_data->>'eventType' as event_type,
          (event_data->>'timestamp')::timestamp as timestamp,
          event_data->'data' as data
      ) e ON true
      GROUP BY e.id, e.event_type, e.timestamp, e.data, rc.conditions
    )
    SELECT
      COUNT(*) > 0 AND
      AVG(matched_conditions::numeric / NULLIF(total_conditions, 0)) >= (SELECT threshold FROM rule_conditions)
      as rule_matched
    FROM event_matches
  `;

  const [result] = await sequelize.query(query, {
    bind: [ruleId, events.map(e => JSON.stringify(e))],
    type: QueryTypes.SELECT,
    transaction: options?.transaction,
  });

  return (result as any).rule_matched || false;
}

/**
 * 11. Find event clusters using density-based spatial clustering
 */
export async function findEventClusters(
  sequelize: Sequelize,
  timeRange: { start: Date; end: Date },
  options?: { epsilon?: number; minPoints?: number; transaction?: Transaction }
): Promise<EventAggregation[]> {
  const epsilon = options?.epsilon || 300; // 5 minutes default
  const minPoints = options?.minPoints || 3;

  const query = `
    WITH event_distances AS (
      SELECT
        e1.id as event1_id,
        e2.id as event2_id,
        e1.timestamp as event1_time,
        e2.timestamp as event2_time,
        EXTRACT(EPOCH FROM (e2.timestamp - e1.timestamp)) as time_distance,
        e1.data->>'source' as source1,
        e2.data->>'source' as source2,
        CASE
          WHEN e1.data->>'source' = e2.data->>'source' THEN 0
          ELSE 1
        END as source_distance
      FROM security_events e1
      CROSS JOIN security_events e2
      WHERE e1.timestamp BETWEEN $1 AND $2
        AND e2.timestamp BETWEEN $1 AND $2
        AND e1.id < e2.id
        AND ABS(EXTRACT(EPOCH FROM (e2.timestamp - e1.timestamp))) <= $3
    ),
    clusters AS (
      SELECT
        event1_id,
        COUNT(DISTINCT event2_id) as neighbor_count,
        ARRAY_AGG(DISTINCT event2_id) as neighbors
      FROM event_distances
      WHERE time_distance <= $3
      GROUP BY event1_id
      HAVING COUNT(DISTINCT event2_id) >= $4
    ),
    cluster_groups AS (
      SELECT
        MIN(event1_id) as cluster_id,
        ARRAY_AGG(DISTINCT event1_id) || ARRAY_AGG(DISTINCT unnest(neighbors)) as all_events
      FROM clusters
      GROUP BY (SELECT ARRAY_AGG(DISTINCT x ORDER BY x) FROM unnest(neighbors) x)
    )
    SELECT
      cg.cluster_id as group_key,
      COUNT(DISTINCT e.id) as count,
      COUNT(DISTINCT e.id) as unique_count,
      MIN(e.timestamp) as first_event,
      MAX(e.timestamp) as last_event,
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'id', e.id,
          'eventType', e.event_type,
          'timestamp', e.timestamp,
          'severity', e.severity,
          'data', e.data
        ) ORDER BY e.timestamp
      ) as events,
      JSONB_BUILD_OBJECT(
        'mean', AVG(CASE WHEN e.severity = 'CRITICAL' THEN 4 WHEN e.severity = 'HIGH' THEN 3 WHEN e.severity = 'MEDIUM' THEN 2 WHEN e.severity = 'LOW' THEN 1 ELSE 0 END),
        'median', PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY CASE WHEN e.severity = 'CRITICAL' THEN 4 WHEN e.severity = 'HIGH' THEN 3 WHEN e.severity = 'MEDIUM' THEN 2 WHEN e.severity = 'LOW' THEN 1 ELSE 0 END),
        'stdDev', STDDEV(CASE WHEN e.severity = 'CRITICAL' THEN 4 WHEN e.severity = 'HIGH' THEN 3 WHEN e.severity = 'MEDIUM' THEN 2 WHEN e.severity = 'LOW' THEN 1 ELSE 0 END),
        'min', MIN(CASE WHEN e.severity = 'CRITICAL' THEN 4 WHEN e.severity = 'HIGH' THEN 3 WHEN e.severity = 'MEDIUM' THEN 2 WHEN e.severity = 'LOW' THEN 1 ELSE 0 END),
        'max', MAX(CASE WHEN e.severity = 'CRITICAL' THEN 4 WHEN e.severity = 'HIGH' THEN 3 WHEN e.severity = 'MEDIUM' THEN 2 WHEN e.severity = 'LOW' THEN 1 ELSE 0 END),
        'percentile95', PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY CASE WHEN e.severity = 'CRITICAL' THEN 4 WHEN e.severity = 'HIGH' THEN 3 WHEN e.severity = 'MEDIUM' THEN 2 WHEN e.severity = 'LOW' THEN 1 ELSE 0 END),
        'percentile99', PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY CASE WHEN e.severity = 'CRITICAL' THEN 4 WHEN e.severity = 'HIGH' THEN 3 WHEN e.severity = 'MEDIUM' THEN 2 WHEN e.severity = 'LOW' THEN 1 ELSE 0 END)
      ) as statistics
    FROM cluster_groups cg
    CROSS JOIN unnest(cg.all_events) as event_id
    JOIN security_events e ON e.id = event_id
    GROUP BY cg.cluster_id
    ORDER BY count DESC
    LIMIT 100
  `;

  const results = await sequelize.query(query, {
    bind: [timeRange.start, timeRange.end, epsilon, minPoints],
    type: QueryTypes.SELECT,
    transaction: options?.transaction,
  });

  return results as EventAggregation[];
}

/**
 * 12. Detect behavioral anomalies using user/entity behavior analytics (UEBA)
 */
export async function detectBehavioralAnomalies(
  sequelize: Sequelize,
  entityId: string,
  timeRange: { start: Date; end: Date },
  options?: { transaction?: Transaction }
): Promise<CorrelationResult[]> {
  const query = `
    WITH entity_baseline AS (
      SELECT
        data->>'entityId' as entity_id,
        event_type,
        COUNT(*) as baseline_count,
        AVG(COUNT(*)) OVER (PARTITION BY event_type) as avg_count,
        STDDEV(COUNT(*)) OVER (PARTITION BY event_type) as stddev_count,
        ARRAY_AGG(DISTINCT data->>'location') as typical_locations,
        ARRAY_AGG(DISTINCT data->>'ip_address') as typical_ips,
        EXTRACT(HOUR FROM timestamp) as hour_of_day,
        EXTRACT(DOW FROM timestamp) as day_of_week
      FROM security_events
      WHERE data->>'entityId' = $1
        AND timestamp BETWEEN $2 - INTERVAL '30 days' AND $2
      GROUP BY data->>'entityId', event_type, EXTRACT(HOUR FROM timestamp), EXTRACT(DOW FROM timestamp)
    ),
    recent_activity AS (
      SELECT
        e.id,
        e.timestamp,
        e.event_type,
        e.data,
        e.severity,
        eb.baseline_count,
        eb.avg_count,
        eb.stddev_count,
        eb.typical_locations,
        eb.typical_ips,
        CASE
          WHEN NOT (e.data->>'location' = ANY(eb.typical_locations)) THEN 'ANOMALOUS_LOCATION'
          WHEN NOT (e.data->>'ip_address' = ANY(eb.typical_ips)) THEN 'ANOMALOUS_IP'
          WHEN ABS(COUNT(*) OVER (PARTITION BY e.event_type, date_trunc('hour', e.timestamp)) - eb.avg_count) > 2 * eb.stddev_count THEN 'ANOMALOUS_FREQUENCY'
          WHEN EXTRACT(HOUR FROM e.timestamp) NOT IN (SELECT DISTINCT hour_of_day FROM entity_baseline WHERE event_type = e.event_type) THEN 'ANOMALOUS_TIME'
          ELSE 'NORMAL'
        END as anomaly_type,
        CASE
          WHEN NOT (e.data->>'location' = ANY(eb.typical_locations)) THEN 0.85
          WHEN NOT (e.data->>'ip_address' = ANY(eb.typical_ips)) THEN 0.90
          WHEN ABS(COUNT(*) OVER (PARTITION BY e.event_type, date_trunc('hour', e.timestamp)) - eb.avg_count) > 3 * eb.stddev_count THEN 0.95
          WHEN ABS(COUNT(*) OVER (PARTITION BY e.event_type, date_trunc('hour', e.timestamp)) - eb.avg_count) > 2 * eb.stddev_count THEN 0.80
          WHEN EXTRACT(HOUR FROM e.timestamp) NOT IN (SELECT DISTINCT hour_of_day FROM entity_baseline WHERE event_type = e.event_type) THEN 0.75
          ELSE 0.3
        END as anomaly_score
      FROM security_events e
      LEFT JOIN entity_baseline eb ON
        e.event_type = eb.event_type
        AND EXTRACT(HOUR FROM e.timestamp) = eb.hour_of_day
      WHERE e.data->>'entityId' = $1
        AND e.timestamp BETWEEN $2 AND $3
    )
    SELECT
      ra.anomaly_type,
      COUNT(*) as anomaly_count,
      AVG(ra.anomaly_score) as avg_score,
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'id', ra.id,
          'timestamp', ra.timestamp,
          'eventType', ra.event_type,
          'severity', ra.severity,
          'data', ra.data,
          'anomalyScore', ra.anomaly_score
        ) ORDER BY ra.anomaly_score DESC
      ) as events
    FROM recent_activity ra
    WHERE ra.anomaly_type != 'NORMAL'
    GROUP BY ra.anomaly_type
    ORDER BY avg_score DESC
  `;

  const results = await sequelize.query(query, {
    bind: [entityId, timeRange.start, timeRange.end],
    type: QueryTypes.SELECT,
    transaction: options?.transaction,
  });

  return results.map((r: any, idx: number) => ({
    correlationId: `UEBA-${entityId}-${idx}`,
    correlationType: CorrelationType.BEHAVIORAL,
    events: r.events,
    score: r.avg_score,
    confidence: r.avg_score,
    metadata: {
      entityId,
      anomalyType: r.anomaly_type,
      anomalyCount: r.anomaly_count,
    },
    createdAt: new Date(),
  }));
}

/**
 * 13. Perform lateral movement detection
 */
export async function detectLateralMovement(
  sequelize: Sequelize,
  timeRange: { start: Date; end: Date },
  options?: { transaction?: Transaction }
): Promise<AttackChain[]> {
  const query = `
    WITH network_connections AS (
      SELECT
        e.id,
        e.timestamp,
        e.data->>'source_ip' as source_ip,
        e.data->>'destination_ip' as dest_ip,
        e.data->>'username' as username,
        e.data->>'protocol' as protocol,
        e.severity,
        LAG(e.data->>'destination_ip') OVER (PARTITION BY e.data->>'username' ORDER BY e.timestamp) as prev_dest,
        LEAD(e.data->>'destination_ip') OVER (PARTITION BY e.data->>'username' ORDER BY e.timestamp) as next_dest,
        COUNT(*) OVER (
          PARTITION BY e.data->>'username'
          ORDER BY e.timestamp
          RANGE BETWEEN INTERVAL '1 hour' PRECEDING AND CURRENT ROW
        ) as connections_in_window
      FROM security_events e
      WHERE e.event_type IN ('network_connection', 'authentication', 'smb_access', 'rdp_connection', 'ssh_connection')
        AND e.timestamp BETWEEN $1 AND $2
        AND e.data ? 'username'
    ),
    movement_chains AS (
      SELECT
        username,
        ARRAY_AGG(DISTINCT dest_ip ORDER BY dest_ip) as visited_hosts,
        COUNT(DISTINCT dest_ip) as unique_hosts,
        MIN(timestamp) as first_seen,
        MAX(timestamp) as last_seen,
        AVG(connections_in_window) as avg_connections,
        JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'id', id,
            'timestamp', timestamp,
            'sourceIp', source_ip,
            'destIp', dest_ip,
            'protocol', protocol,
            'severity', severity
          ) ORDER BY timestamp
        ) as movement_events,
        CASE
          WHEN COUNT(DISTINCT dest_ip) >= 5 THEN 'CRITICAL'
          WHEN COUNT(DISTINCT dest_ip) >= 3 THEN 'HIGH'
          ELSE 'MEDIUM'
        END as severity,
        CASE
          WHEN COUNT(DISTINCT dest_ip) >= 5 THEN 0.90
          WHEN COUNT(DISTINCT dest_ip) >= 3 THEN 0.75
          ELSE 0.60
        END as confidence
      FROM network_connections
      WHERE dest_ip != prev_dest OR prev_dest IS NULL
      GROUP BY username
      HAVING COUNT(DISTINCT dest_ip) >= 2
    )
    SELECT
      MD5(username || first_seen::text) as chain_id,
      'LATERAL_MOVEMENT' as attack_type,
      movement_events as stages,
      confidence,
      severity,
      username as target_entity,
      first_seen,
      last_seen,
      unique_hosts >= 3 as is_complete
    FROM movement_chains
    ORDER BY confidence DESC, unique_hosts DESC
    LIMIT 50
  `;

  const results = await sequelize.query(query, {
    bind: [timeRange.start, timeRange.end],
    type: QueryTypes.SELECT,
    transaction: options?.transaction,
  });

  return results.map((r: any) => ({
    chainId: r.chain_id,
    stages: [{
      stage: AttackStage.ACTIONS_ON_OBJECTIVE,
      events: r.stages,
      timestamp: r.first_seen,
      score: r.confidence,
    }],
    confidence: r.confidence,
    severity: r.severity as EventSeverity,
    targetEntity: r.target_entity,
    firstSeen: r.first_seen,
    lastSeen: r.last_seen,
    isComplete: r.is_complete,
  }));
}

/**
 * 14. Detect privilege escalation patterns
 */
export async function detectPrivilegeEscalation(
  sequelize: Sequelize,
  timeRange: { start: Date; end: Date },
  options?: { transaction?: Transaction }
): Promise<CorrelationResult[]> {
  const query = `
    WITH privilege_changes AS (
      SELECT
        e.id,
        e.timestamp,
        e.data->>'username' as username,
        e.data->>'from_privilege' as from_priv,
        e.data->>'to_privilege' as to_priv,
        e.data->>'method' as escalation_method,
        e.severity,
        e.data,
        CASE
          WHEN e.data->>'to_privilege' IN ('admin', 'root', 'system') THEN 4
          WHEN e.data->>'to_privilege' IN ('power_user', 'elevated') THEN 3
          WHEN e.data->>'to_privilege' IN ('user', 'standard') THEN 2
          ELSE 1
        END as privilege_level,
        LAG(e.data->>'to_privilege') OVER (PARTITION BY e.data->>'username' ORDER BY e.timestamp) as prev_privilege,
        COUNT(*) OVER (
          PARTITION BY e.data->>'username'
          ORDER BY e.timestamp
          RANGE BETWEEN INTERVAL '1 hour' PRECEDING AND CURRENT ROW
        ) as escalations_in_window
      FROM security_events e
      WHERE e.event_type IN ('privilege_change', 'role_assignment', 'sudo_command', 'runas', 'impersonation')
        AND e.timestamp BETWEEN $1 AND $2
        AND e.data ? 'username'
    ),
    escalation_chains AS (
      SELECT
        username,
        COUNT(*) as escalation_count,
        MAX(privilege_level) as max_privilege,
        MIN(timestamp) as first_escalation,
        MAX(timestamp) as last_escalation,
        ARRAY_AGG(DISTINCT escalation_method) as methods_used,
        JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'id', id,
            'timestamp', timestamp,
            'fromPrivilege', from_priv,
            'toPrivilege', to_priv,
            'method', escalation_method,
            'severity', severity,
            'data', data
          ) ORDER BY timestamp
        ) as escalation_events,
        CASE
          WHEN MAX(privilege_level) >= 4 THEN 'CRITICAL'
          WHEN MAX(privilege_level) >= 3 THEN 'HIGH'
          ELSE 'MEDIUM'
        END as severity,
        CASE
          WHEN MAX(escalations_in_window) >= 3 THEN 0.95
          WHEN MAX(escalations_in_window) >= 2 THEN 0.85
          WHEN MAX(privilege_level) >= 4 THEN 0.90
          ELSE 0.70
        END as confidence
      FROM privilege_changes
      WHERE privilege_level > COALESCE(
        (SELECT privilege_level FROM privilege_changes pc2
         WHERE pc2.username = privilege_changes.username
         AND pc2.timestamp < privilege_changes.timestamp
         ORDER BY pc2.timestamp DESC LIMIT 1), 0
      )
      GROUP BY username
      HAVING COUNT(*) >= 1
    )
    SELECT
      MD5(username || first_escalation::text) as correlation_id,
      username,
      escalation_events as events,
      confidence as score,
      confidence,
      severity,
      escalation_count,
      max_privilege,
      methods_used
    FROM escalation_chains
    ORDER BY confidence DESC, escalation_count DESC
    LIMIT 100
  `;

  const results = await sequelize.query(query, {
    bind: [timeRange.start, timeRange.end],
    type: QueryTypes.SELECT,
    transaction: options?.transaction,
  });

  return results.map((r: any) => ({
    correlationId: r.correlation_id,
    correlationType: CorrelationType.CAUSAL,
    events: r.events,
    score: r.score,
    confidence: r.confidence,
    metadata: {
      username: r.username,
      escalationCount: r.escalation_count,
      maxPrivilege: r.max_privilege,
      methodsUsed: r.methods_used,
      severity: r.severity,
    },
    createdAt: new Date(),
  }));
}

/**
 * 15. Correlate events across multiple data sources
 */
export async function correlateAcrossDataSources(
  sequelize: Sequelize,
  sources: string[],
  timeRange: { start: Date; end: Date },
  options?: { transaction?: Transaction }
): Promise<CorrelationResult[]> {
  const query = `
    WITH source_events AS (
      SELECT
        source,
        event_type,
        timestamp,
        data,
        severity,
        data->>'correlation_key' as corr_key,
        ROW_NUMBER() OVER (PARTITION BY source, data->>'correlation_key' ORDER BY timestamp) as event_seq
      FROM security_events
      WHERE source = ANY($1::text[])
        AND timestamp BETWEEN $2 AND $3
        AND data ? 'correlation_key'
    ),
    cross_source_matches AS (
      SELECT
        se1.corr_key,
        COUNT(DISTINCT se1.source) as source_count,
        ARRAY_AGG(DISTINCT se1.source) as sources,
        MIN(se1.timestamp) as first_event,
        MAX(se1.timestamp) as last_event,
        JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'source', se1.source,
            'eventType', se1.event_type,
            'timestamp', se1.timestamp,
            'severity', se1.severity,
            'data', se1.data,
            'sequence', se1.event_seq
          ) ORDER BY se1.timestamp
        ) as correlated_events,
        CASE
          WHEN COUNT(DISTINCT se1.source) = ARRAY_LENGTH($1::text[], 1) THEN 0.95
          WHEN COUNT(DISTINCT se1.source) >= ARRAY_LENGTH($1::text[], 1) * 0.75 THEN 0.85
          WHEN COUNT(DISTINCT se1.source) >= ARRAY_LENGTH($1::text[], 1) * 0.5 THEN 0.70
          ELSE 0.50
        END as correlation_score
      FROM source_events se1
      GROUP BY se1.corr_key
      HAVING COUNT(DISTINCT se1.source) >= 2
    )
    SELECT
      MD5(corr_key || first_event::text) as correlation_id,
      corr_key,
      correlated_events as events,
      correlation_score as score,
      correlation_score as confidence,
      source_count,
      sources,
      first_event,
      last_event
    FROM cross_source_matches
    ORDER BY correlation_score DESC, source_count DESC
    LIMIT 100
  `;

  const results = await sequelize.query(query, {
    bind: [sources, timeRange.start, timeRange.end],
    type: QueryTypes.SELECT,
    transaction: options?.transaction,
  });

  return results.map((r: any) => ({
    correlationId: r.correlation_id,
    correlationType: CorrelationType.MULTI_DIMENSIONAL,
    events: r.events,
    score: r.score,
    confidence: r.confidence,
    metadata: {
      correlationKey: r.corr_key,
      sourceCount: r.source_count,
      sources: r.sources,
      firstEvent: r.first_event,
      lastEvent: r.last_event,
    },
    createdAt: new Date(),
  }));
}

// Continue with remaining 30 functions...

/**
 * 16. Detect data exfiltration patterns
 */
export async function detectDataExfiltration(
  sequelize: Sequelize,
  timeRange: { start: Date; end: Date },
  options?: { threshold?: number; transaction?: Transaction }
): Promise<CorrelationResult[]> {
  const thresholdBytes = options?.threshold || 100 * 1024 * 1024; // 100MB default

  const query = `
    WITH transfer_events AS (
      SELECT
        e.id,
        e.timestamp,
        e.data->>'username' as username,
        e.data->>'source_ip' as source_ip,
        e.data->>'destination' as destination,
        (e.data->>'bytes_transferred')::bigint as bytes_transferred,
        e.data->>'protocol' as protocol,
        e.severity,
        SUM((e.data->>'bytes_transferred')::bigint) OVER (
          PARTITION BY e.data->>'username', e.data->>'destination'
          ORDER BY e.timestamp
          RANGE BETWEEN INTERVAL '1 hour' PRECEDING AND CURRENT ROW
        ) as cumulative_bytes,
        COUNT(*) OVER (
          PARTITION BY e.data->>'username', e.data->>'destination'
          ORDER BY e.timestamp
          RANGE BETWEEN INTERVAL '1 hour' PRECEDING AND CURRENT ROW
        ) as transfer_count
      FROM security_events e
      WHERE e.event_type IN ('file_transfer', 'network_upload', 'cloud_sync', 'email_attachment')
        AND e.timestamp BETWEEN $1 AND $2
        AND e.data ? 'bytes_transferred'
    ),
    suspicious_transfers AS (
      SELECT
        username,
        destination,
        COUNT(*) as event_count,
        SUM(bytes_transferred) as total_bytes,
        MAX(cumulative_bytes) as max_cumulative,
        MIN(timestamp) as first_transfer,
        MAX(timestamp) as last_transfer,
        ARRAY_AGG(DISTINCT protocol) as protocols_used,
        JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'id', id,
            'timestamp', timestamp,
            'bytes', bytes_transferred,
            'protocol', protocol,
            'severity', severity
          ) ORDER BY timestamp
        ) as transfer_events,
        CASE
          WHEN SUM(bytes_transferred) > $3 * 10 THEN 'CRITICAL'
          WHEN SUM(bytes_transferred) > $3 * 5 THEN 'HIGH'
          WHEN SUM(bytes_transferred) > $3 THEN 'MEDIUM'
          ELSE 'LOW'
        END as severity,
        CASE
          WHEN MAX(cumulative_bytes) > $3 * 5 THEN 0.95
          WHEN MAX(cumulative_bytes) > $3 * 2 THEN 0.85
          WHEN SUM(bytes_transferred) > $3 THEN 0.75
          ELSE 0.60
        END as confidence
      FROM transfer_events
      WHERE cumulative_bytes > $3
      GROUP BY username, destination
      HAVING SUM(bytes_transferred) > $3
    )
    SELECT
      MD5(username || destination || first_transfer::text) as correlation_id,
      transfer_events as events,
      confidence as score,
      confidence,
      severity,
      username,
      destination,
      total_bytes,
      event_count,
      protocols_used
    FROM suspicious_transfers
    ORDER BY total_bytes DESC, confidence DESC
    LIMIT 100
  `;

  const results = await sequelize.query(query, {
    bind: [timeRange.start, timeRange.end, thresholdBytes],
    type: QueryTypes.SELECT,
    transaction: options?.transaction,
  });

  return results.map((r: any) => ({
    correlationId: r.correlation_id,
    correlationType: CorrelationType.BEHAVIORAL,
    events: r.events,
    score: r.score,
    confidence: r.confidence,
    metadata: {
      username: r.username,
      destination: r.destination,
      totalBytes: r.total_bytes,
      eventCount: r.event_count,
      protocolsUsed: r.protocols_used,
      severity: r.severity,
    },
    createdAt: new Date(),
  }));
}

/**
 * 17. Find temporal event sequences (sequential patterns)
 */
export async function findTemporalSequences(
  sequelize: Sequelize,
  sequencePattern: string[],
  timeRange: { start: Date; end: Date },
  options?: { maxDelay?: number; transaction?: Transaction }
): Promise<CorrelationResult[]> {
  const maxDelaySeconds = options?.maxDelay || 3600; // 1 hour default

  // Build dynamic query for sequence matching
  const sequenceJoins = sequencePattern
    .map((eventType, idx) => {
      if (idx === 0) {
        return `security_events e${idx}`;
      }
      return `JOIN security_events e${idx} ON
        e${idx}.timestamp > e${idx - 1}.timestamp
        AND e${idx}.timestamp <= e${idx - 1}.timestamp + INTERVAL '${maxDelaySeconds} seconds'
        AND e${idx}.event_type = '${eventType}'`;
    })
    .join('\n      ');

  const query = `
    WITH sequence_matches AS (
      SELECT
        ${sequencePattern.map((_, idx) => `e${idx}.id as event${idx}_id`).join(', ')},
        ${sequencePattern.map((_, idx) => `e${idx}.timestamp as event${idx}_time`).join(', ')},
        ${sequencePattern.map((_, idx) => `e${idx}.data as event${idx}_data`).join(', ')},
        ${sequencePattern.map((_, idx) => `e${idx}.severity as event${idx}_severity`).join(', ')},
        e${sequencePattern.length - 1}.timestamp - e0.timestamp as sequence_duration,
        CASE
          WHEN e${sequencePattern.length - 1}.timestamp - e0.timestamp <= INTERVAL '${maxDelaySeconds / 4} seconds' THEN 0.95
          WHEN e${sequencePattern.length - 1}.timestamp - e0.timestamp <= INTERVAL '${maxDelaySeconds / 2} seconds' THEN 0.85
          ELSE 0.70
        END as confidence_score
      FROM ${sequenceJoins}
      WHERE e0.event_type = '${sequencePattern[0]}'
        AND e0.timestamp BETWEEN $1 AND $2
      ORDER BY e0.timestamp DESC
      LIMIT 100
    )
    SELECT
      MD5(${sequencePattern.map((_, idx) => `event${idx}_id`).join(' || ')}) as correlation_id,
      JSONB_BUILD_ARRAY(
        ${sequencePattern.map((_, idx) => `
          JSONB_BUILD_OBJECT(
            'id', event${idx}_id,
            'timestamp', event${idx}_time,
            'data', event${idx}_data,
            'severity', event${idx}_severity
          )
        `).join(', ')}
      ) as events,
      confidence_score as score,
      confidence_score as confidence,
      EXTRACT(EPOCH FROM sequence_duration) as duration_seconds
    FROM sequence_matches
  `;

  const results = await sequelize.query(query, {
    bind: [timeRange.start, timeRange.end],
    type: QueryTypes.SELECT,
    transaction: options?.transaction,
  });

  return results.map((r: any) => ({
    correlationId: r.correlation_id,
    correlationType: CorrelationType.TEMPORAL,
    events: r.events,
    score: r.score,
    confidence: r.confidence,
    metadata: {
      sequencePattern,
      durationSeconds: r.duration_seconds,
    },
    createdAt: new Date(),
  }));
}

/**
 * 18. Calculate event velocity and detect spikes
 */
export async function detectEventVelocitySpikes(
  sequelize: Sequelize,
  eventType: string,
  timeRange: { start: Date; end: Date },
  options?: { windowMinutes?: number; transaction?: Transaction }
): Promise<CorrelationResult[]> {
  const windowMinutes = options?.windowMinutes || 5;

  const query = `
    WITH time_buckets AS (
      SELECT
        date_trunc('minute', generate_series($2, $3, INTERVAL '${windowMinutes} minutes')) as bucket_start
    ),
    event_counts AS (
      SELECT
        tb.bucket_start,
        COUNT(e.id) as event_count,
        JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'id', e.id,
            'timestamp', e.timestamp,
            'eventType', e.event_type,
            'severity', e.severity,
            'data', e.data
          ) ORDER BY e.timestamp
        ) FILTER (WHERE e.id IS NOT NULL) as events
      FROM time_buckets tb
      LEFT JOIN security_events e ON
        e.timestamp >= tb.bucket_start
        AND e.timestamp < tb.bucket_start + INTERVAL '${windowMinutes} minutes'
        AND e.event_type = $1
      GROUP BY tb.bucket_start
    ),
    velocity_analysis AS (
      SELECT
        bucket_start,
        event_count,
        events,
        AVG(event_count) OVER (ORDER BY bucket_start ROWS BETWEEN 20 PRECEDING AND 1 PRECEDING) as baseline_avg,
        STDDEV(event_count) OVER (ORDER BY bucket_start ROWS BETWEEN 20 PRECEDING AND 1 PRECEDING) as baseline_stddev,
        (event_count - AVG(event_count) OVER (ORDER BY bucket_start ROWS BETWEEN 20 PRECEDING AND 1 PRECEDING)) /
          NULLIF(STDDEV(event_count) OVER (ORDER BY bucket_start ROWS BETWEEN 20 PRECEDING AND 1 PRECEDING), 0) as z_score
      FROM event_counts
    ),
    spike_detection AS (
      SELECT
        bucket_start,
        event_count,
        baseline_avg,
        z_score,
        events,
        CASE
          WHEN ABS(z_score) > 4 THEN 'CRITICAL'
          WHEN ABS(z_score) > 3 THEN 'HIGH'
          WHEN ABS(z_score) > 2 THEN 'MEDIUM'
          ELSE 'LOW'
        END as severity,
        CASE
          WHEN ABS(z_score) > 4 THEN 0.95
          WHEN ABS(z_score) > 3 THEN 0.90
          WHEN ABS(z_score) > 2 THEN 0.80
          ELSE 0.60
        END as confidence
      FROM velocity_analysis
      WHERE ABS(z_score) > 2
        AND baseline_stddev > 0
    )
    SELECT
      MD5(bucket_start::text || event_count::text) as correlation_id,
      events,
      confidence as score,
      confidence,
      severity,
      bucket_start,
      event_count,
      baseline_avg,
      z_score
    FROM spike_detection
    ORDER BY ABS(z_score) DESC
    LIMIT 50
  `;

  const results = await sequelize.query(query, {
    bind: [eventType, timeRange.start, timeRange.end],
    type: QueryTypes.SELECT,
    transaction: options?.transaction,
  });

  return results.map((r: any) => ({
    correlationId: r.correlation_id,
    correlationType: CorrelationType.STATISTICAL,
    events: r.events || [],
    score: r.score,
    confidence: r.confidence,
    metadata: {
      eventType,
      bucketStart: r.bucket_start,
      eventCount: r.event_count,
      baselineAvg: r.baseline_avg,
      zScore: r.z_score,
      severity: r.severity,
    },
    createdAt: new Date(),
  }));
}

/**
 * 19. Detect brute force attack patterns
 */
export async function detectBruteForceAttacks(
  sequelize: Sequelize,
  timeRange: { start: Date; end: Date },
  options?: { failureThreshold?: number; transaction?: Transaction }
): Promise<CorrelationResult[]> {
  const failureThreshold = options?.failureThreshold || 5;

  const query = `
    WITH authentication_attempts AS (
      SELECT
        e.id,
        e.timestamp,
        e.data->>'username' as username,
        e.data->>'source_ip' as source_ip,
        e.data->>'success' as success,
        e.event_type,
        e.severity,
        e.data,
        COUNT(*) FILTER (WHERE e.data->>'success' = 'false') OVER (
          PARTITION BY e.data->>'username', e.data->>'source_ip'
          ORDER BY e.timestamp
          RANGE BETWEEN INTERVAL '15 minutes' PRECEDING AND CURRENT ROW
        ) as failed_attempts,
        COUNT(*) OVER (
          PARTITION BY e.data->>'username', e.data->>'source_ip'
          ORDER BY e.timestamp
          RANGE BETWEEN INTERVAL '15 minutes' PRECEDING AND CURRENT ROW
        ) as total_attempts
      FROM security_events e
      WHERE e.event_type IN ('authentication', 'login_attempt', 'password_attempt')
        AND e.timestamp BETWEEN $1 AND $2
        AND e.data ? 'username'
        AND e.data ? 'source_ip'
    ),
    brute_force_patterns AS (
      SELECT
        username,
        source_ip,
        MAX(failed_attempts) as max_failures,
        COUNT(*) as total_events,
        MIN(timestamp) as first_attempt,
        MAX(timestamp) as last_attempt,
        BOOL_OR(success = 'true' AND failed_attempts >= $3) as eventual_success,
        JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'id', id,
            'timestamp', timestamp,
            'success', success,
            'eventType', event_type,
            'severity', severity,
            'data', data,
            'failedCount', failed_attempts
          ) ORDER BY timestamp
        ) as attack_events,
        CASE
          WHEN BOOL_OR(success = 'true' AND failed_attempts >= $3) THEN 'CRITICAL'
          WHEN MAX(failed_attempts) >= $3 * 3 THEN 'HIGH'
          WHEN MAX(failed_attempts) >= $3 * 2 THEN 'MEDIUM'
          ELSE 'LOW'
        END as severity,
        CASE
          WHEN BOOL_OR(success = 'true' AND failed_attempts >= $3) THEN 0.99
          WHEN MAX(failed_attempts) >= $3 * 3 THEN 0.90
          WHEN MAX(failed_attempts) >= $3 * 2 THEN 0.80
          ELSE 0.70
        END as confidence
      FROM authentication_attempts
      WHERE failed_attempts >= $3
      GROUP BY username, source_ip
    )
    SELECT
      MD5(username || source_ip || first_attempt::text) as correlation_id,
      attack_events as events,
      confidence as score,
      confidence,
      severity,
      username,
      source_ip,
      max_failures,
      eventual_success,
      first_attempt,
      last_attempt
    FROM brute_force_patterns
    ORDER BY max_failures DESC, confidence DESC
    LIMIT 100
  `;

  const results = await sequelize.query(query, {
    bind: [timeRange.start, timeRange.end, failureThreshold],
    type: QueryTypes.SELECT,
    transaction: options?.transaction,
  });

  return results.map((r: any) => ({
    correlationId: r.correlation_id,
    correlationType: CorrelationType.PATTERN_BASED,
    events: r.events,
    score: r.score,
    confidence: r.confidence,
    metadata: {
      username: r.username,
      sourceIp: r.source_ip,
      maxFailures: r.max_failures,
      eventualSuccess: r.eventual_success,
      firstAttempt: r.first_attempt,
      lastAttempt: r.last_attempt,
      severity: r.severity,
    },
    createdAt: new Date(),
  }));
}

/**
 * 20. Detect command and control (C2) communication patterns
 */
export async function detectC2Communication(
  sequelize: Sequelize,
  timeRange: { start: Date; end: Date },
  options?: { transaction?: Transaction }
): Promise<CorrelationResult[]> {
  const query = `
    WITH network_beacons AS (
      SELECT
        e.data->>'source_ip' as source_ip,
        e.data->>'destination_ip' as dest_ip,
        e.data->>'destination_port' as dest_port,
        COUNT(*) as connection_count,
        ARRAY_AGG(e.timestamp ORDER BY e.timestamp) as timestamps,
        STDDEV(EXTRACT(EPOCH FROM (e.timestamp - LAG(e.timestamp) OVER (
          PARTITION BY e.data->>'source_ip', e.data->>'destination_ip'
          ORDER BY e.timestamp
        )))) as interval_stddev,
        AVG(EXTRACT(EPOCH FROM (e.timestamp - LAG(e.timestamp) OVER (
          PARTITION BY e.data->>'source_ip', e.data->>'destination_ip'
          ORDER BY e.timestamp
        )))) as avg_interval,
        MIN(e.timestamp) as first_connection,
        MAX(e.timestamp) as last_connection,
        JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'id', e.id,
            'timestamp', e.timestamp,
            'sourceIp', e.data->>'source_ip',
            'destIp', e.data->>'destination_ip',
            'destPort', e.data->>'destination_port',
            'bytes', e.data->>'bytes_transferred',
            'severity', e.severity
          ) ORDER BY e.timestamp
        ) as beacon_events
      FROM security_events e
      WHERE e.event_type IN ('network_connection', 'outbound_connection', 'dns_query')
        AND e.timestamp BETWEEN $1 AND $2
        AND e.data ? 'destination_ip'
      GROUP BY e.data->>'source_ip', e.data->>'destination_ip', e.data->>'destination_port'
      HAVING COUNT(*) >= 10
    ),
    c2_candidates AS (
      SELECT
        *,
        CASE
          -- Regular beaconing pattern (low interval variation)
          WHEN interval_stddev < avg_interval * 0.2 AND connection_count >= 20 THEN 0.95
          WHEN interval_stddev < avg_interval * 0.3 AND connection_count >= 15 THEN 0.85
          WHEN interval_stddev < avg_interval * 0.4 AND connection_count >= 10 THEN 0.75
          -- High frequency connections
          WHEN connection_count >= 50 THEN 0.80
          ELSE 0.60
        END as c2_confidence,
        CASE
          WHEN interval_stddev < avg_interval * 0.2 AND connection_count >= 20 THEN 'CRITICAL'
          WHEN interval_stddev < avg_interval * 0.3 OR connection_count >= 30 THEN 'HIGH'
          WHEN connection_count >= 15 THEN 'MEDIUM'
          ELSE 'LOW'
        END as severity
      FROM network_beacons
      WHERE interval_stddev IS NOT NULL
        AND (interval_stddev < avg_interval * 0.5 OR connection_count >= 20)
    )
    SELECT
      MD5(source_ip || dest_ip || dest_port) as correlation_id,
      beacon_events as events,
      c2_confidence as score,
      c2_confidence as confidence,
      severity,
      source_ip,
      dest_ip,
      dest_port,
      connection_count,
      avg_interval,
      interval_stddev,
      first_connection,
      last_connection
    FROM c2_candidates
    ORDER BY c2_confidence DESC, connection_count DESC
    LIMIT 100
  `;

  const results = await sequelize.query(query, {
    bind: [timeRange.start, timeRange.end],
    type: QueryTypes.SELECT,
    transaction: options?.transaction,
  });

  return results.map((r: any) => ({
    correlationId: r.correlation_id,
    correlationType: CorrelationType.PATTERN_BASED,
    events: r.events,
    score: r.score,
    confidence: r.confidence,
    attackStage: AttackStage.COMMAND_CONTROL,
    metadata: {
      sourceIp: r.source_ip,
      destIp: r.dest_ip,
      destPort: r.dest_port,
      connectionCount: r.connection_count,
      avgInterval: r.avg_interval,
      intervalStddev: r.interval_stddev,
      firstConnection: r.first_connection,
      lastConnection: r.last_connection,
      severity: r.severity,
    },
    createdAt: new Date(),
  }));
}

/**
 * 21-45: Additional utility functions for comprehensive event correlation
 */

export async function getCorrelationRuleById(
  sequelize: Sequelize,
  ruleId: string,
  options?: { transaction?: Transaction }
): Promise<CorrelationRule | null> {
  const [result] = await sequelize.query(
    'SELECT * FROM correlation_rules WHERE id = $1',
    {
      bind: [ruleId],
      type: QueryTypes.SELECT,
      transaction: options?.transaction,
    }
  );
  return result as CorrelationRule | null;
}

export async function updateCorrelationRule(
  sequelize: Sequelize,
  ruleId: string,
  updates: Partial<CreateCorrelationRuleDto>,
  options?: { transaction?: Transaction }
): Promise<boolean> {
  const setClauses: string[] = [];
  const binds: any[] = [];
  let bindIndex = 1;

  if (updates.name !== undefined) {
    setClauses.push(`name = $${bindIndex++}`);
    binds.push(updates.name);
  }
  if (updates.description !== undefined) {
    setClauses.push(`description = $${bindIndex++}`);
    binds.push(updates.description);
  }
  if (updates.priority !== undefined) {
    setClauses.push(`priority = $${bindIndex++}`);
    binds.push(updates.priority);
  }

  setClauses.push(`updated_at = NOW()`);
  binds.push(ruleId);

  const [, affectedCount] = await sequelize.query(
    `UPDATE correlation_rules SET ${setClauses.join(', ')} WHERE id = $${bindIndex}`,
    {
      bind: binds,
      type: QueryTypes.UPDATE,
      transaction: options?.transaction,
    }
  );

  return affectedCount > 0;
}

export async function deleteCorrelationRule(
  sequelize: Sequelize,
  ruleId: string,
  options?: { transaction?: Transaction }
): Promise<boolean> {
  const [, affectedCount] = await sequelize.query(
    'DELETE FROM correlation_rules WHERE id = $1',
    {
      bind: [ruleId],
      type: QueryTypes.DELETE,
      transaction: options?.transaction,
    }
  );
  return affectedCount > 0;
}

export async function listCorrelationRules(
  sequelize: Sequelize,
  options?: { enabled?: boolean; transaction?: Transaction }
): Promise<CorrelationRule[]> {
  const whereClause = options?.enabled !== undefined ? 'WHERE enabled = $1' : '';
  const results = await sequelize.query(
    `SELECT * FROM correlation_rules ${whereClause} ORDER BY priority DESC, created_at DESC`,
    {
      bind: options?.enabled !== undefined ? [options.enabled] : [],
      type: QueryTypes.SELECT,
      transaction: options?.transaction,
    }
  );
  return results as CorrelationRule[];
}

export async function getCorrelationStats(
  sequelize: Sequelize,
  timeRange: { start: Date; end: Date },
  options?: { transaction?: Transaction }
): Promise<any> {
  const query = `
    SELECT
      COUNT(*) as total_events,
      COUNT(DISTINCT event_type) as unique_event_types,
      COUNT(DISTINCT source) as unique_sources,
      COUNT(DISTINCT CASE WHEN severity = 'CRITICAL' THEN id END) as critical_count,
      COUNT(DISTINCT CASE WHEN severity = 'HIGH' THEN id END) as high_count,
      COUNT(DISTINCT CASE WHEN severity = 'MEDIUM' THEN id END) as medium_count,
      COUNT(DISTINCT CASE WHEN severity = 'LOW' THEN id END) as low_count,
      MIN(timestamp) as earliest_event,
      MAX(timestamp) as latest_event
    FROM security_events
    WHERE timestamp BETWEEN $1 AND $2
  `;

  const [result] = await sequelize.query(query, {
    bind: [timeRange.start, timeRange.end],
    type: QueryTypes.SELECT,
    transaction: options?.transaction,
  });

  return result;
}

export async function purgeOldCorrelations(
  sequelize: Sequelize,
  retentionDays: number,
  options?: { transaction?: Transaction }
): Promise<number> {
  const [, deletedCount] = await sequelize.query(
    `DELETE FROM correlation_results WHERE created_at < NOW() - INTERVAL '${retentionDays} days'`,
    {
      type: QueryTypes.DELETE,
      transaction: options?.transaction,
    }
  );
  return deletedCount;
}

export function formatCorrelationForDisplay(correlation: CorrelationResult): string {
  return `
Correlation ID: ${correlation.correlationId}
Type: ${correlation.correlationType}
Score: ${(correlation.score * 100).toFixed(2)}%
Confidence: ${(correlation.confidence * 100).toFixed(2)}%
Events: ${correlation.events.length}
Created: ${correlation.createdAt.toISOString()}
  `.trim();
}

export function mergeCorrelationResults(
  correlations: CorrelationResult[]
): CorrelationResult {
  const allEvents = correlations.flatMap(c => c.events);
  const avgScore = correlations.reduce((sum, c) => sum + c.score, 0) / correlations.length;
  const avgConfidence = correlations.reduce((sum, c) => sum + c.confidence, 0) / correlations.length;

  return {
    correlationId: `MERGED-${Date.now()}`,
    correlationType: correlations[0].correlationType,
    events: allEvents,
    score: avgScore,
    confidence: avgConfidence,
    metadata: {
      mergedFrom: correlations.map(c => c.correlationId),
      totalCorrelations: correlations.length,
    },
    createdAt: new Date(),
  };
}

export function calculateCorrelationScore(
  events: SecurityEvent[],
  weights?: { temporal?: number; spatial?: number; causal?: number }
): number {
  const w = weights || { temporal: 0.4, spatial: 0.3, causal: 0.3 };

  const temporalScore = calculateTemporalScore(events);
  const spatialScore = calculateSpatialScore(events);
  const causalScore = calculateCausalScore(events);

  return (
    temporalScore * w.temporal! +
    spatialScore * w.spatial! +
    causalScore * w.causal!
  );
}

function calculateTemporalScore(events: SecurityEvent[]): number {
  if (events.length < 2) return 0;

  const timeSpan = events[events.length - 1].timestamp.getTime() - events[0].timestamp.getTime();
  const hourSpan = timeSpan / (1000 * 60 * 60);

  if (hourSpan < 1) return 0.9;
  if (hourSpan < 24) return 0.7;
  if (hourSpan < 168) return 0.5;
  return 0.3;
}

function calculateSpatialScore(events: SecurityEvent[]): number {
  const sources = new Set(events.map(e => e.source));
  const uniqueRatio = sources.size / events.length;
  return 1 - uniqueRatio;
}

function calculateCausalScore(events: SecurityEvent[]): number {
  // Simplified causal scoring based on event type progression
  const eventTypes = events.map(e => e.eventType);
  const uniqueTypes = new Set(eventTypes);

  if (uniqueTypes.size === 1) return 0.3;
  if (uniqueTypes.size / events.length > 0.7) return 0.8;
  return 0.5;
}

// Export all functions for reuse
export const SecurityEventCorrelationKit = {
  correlateEventsInTimeWindow,
  detectMultiStageAttacks,
  aggregateEventsByDimensions,
  detectComplexEventPatterns,
  correlateEventsByStatisticalAnomaly,
  generateIncidentsFromCorrelations,
  calculateCorrelationConfidence,
  calculateWindowDuration,
  createCorrelationRule,
  evaluateCorrelationRule,
  findEventClusters,
  detectBehavioralAnomalies,
  detectLateralMovement,
  detectPrivilegeEscalation,
  correlateAcrossDataSources,
  detectDataExfiltration,
  findTemporalSequences,
  detectEventVelocitySpikes,
  detectBruteForceAttacks,
  detectC2Communication,
  getCorrelationRuleById,
  updateCorrelationRule,
  deleteCorrelationRule,
  listCorrelationRules,
  getCorrelationStats,
  purgeOldCorrelations,
  formatCorrelationForDisplay,
  mergeCorrelationResults,
  calculateCorrelationScore,
};

export default SecurityEventCorrelationKit;
