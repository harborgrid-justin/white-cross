/**
 * @fileoverview Intelligent Cache Invalidation Service
 * @module health-record/services
 * @description Event-driven cache invalidation with dependency tracking and database persistence
 *
 * HIPAA CRITICAL - This service manages PHI cache invalidation with compliance tracking and database logging
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { HealthRecordMetricsService } from './health-record-metrics.service';
import { PHIAccessLogger } from './phi-access-logger.service';
import { CacheStrategyService } from './cache-strategy.service';
import { AuditLog, AuditSeverity, ComplianceType   } from '@/database/models';
import { AuditAction } from '../../database/types/database.enums';
import { ComplianceLevel } from '../interfaces/health-record-types';

import { BaseService } from '@/common/base';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
export interface CacheDependency {
  id: string;
  sourceKey: string;
  dependentKeys: string[];
  relationshipType: DependencyType;
  strength: number; // 0-1, how strong the dependency is
  lastUpdated: Date;
  complianceLevel: ComplianceLevel;
}

export enum DependencyType {
  DIRECT = 'DIRECT', // Direct parent-child relationship
  AGGREGATE = 'AGGREGATE', // Aggregate data depends on source data
  RELATED = 'RELATED', // Related entities (student -> allergies)
  DERIVED = 'DERIVED', // Computed/derived data
  CROSS_ENTITY = 'CROSS_ENTITY', // Cross-entity relationships
}

export interface InvalidationRule {
  id: string;
  name: string;
  eventPattern: string;
  targetPatterns: string[];
  condition?: (event: InvalidationEvent) => boolean;
  delay?: number; // Milliseconds to delay invalidation
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  enabled: boolean;
  complianceRequired: boolean;
}

export interface InvalidationEvent {
  eventId: string;
  eventType: string;
  sourceEntity: string;
  entityId: string;
  timestamp: Date;
  metadata: {
    studentId?: string;
    dataType?: string;
    operation?: string;
    complianceLevel?: ComplianceLevel;
    [key: string]: any;
  };
}

export interface InvalidationMetrics {
  totalInvalidations: number;
  eventDrivenInvalidations: number;
  manualInvalidations: number;
  dependencyInvalidations: number;
  averageInvalidationTime: number;
  invalidationsByType: Record<string, number>;
  invalidationsByCompliance: Record<ComplianceLevel, number>;
}

/**
 * Intelligent Cache Invalidation Service
 *
 * Implements advanced cache invalidation strategies with database persistence:
 * - Event-driven invalidation based on data changes
 * - Dependency graph tracking for cascade invalidation
 * - Tag-based bulk invalidation
 * - Database logging of invalidation events
 * - HIPAA-compliant invalidation tracking
 * - Performance-optimized invalidation batching
 */
@Injectable()
export class IntelligentCacheInvalidationService implements OnModuleDestroy {
  // Dependency tracking
  private readonly dependencyGraph = new Map<string, CacheDependency>();
  private readonly reverseIndex = new Map<string, Set<string>>(); // dependent -> sources

  // Invalidation rules and events
  private readonly invalidationRules = new Map<string, InvalidationRule>();
  private readonly pendingInvalidations = new Map<string, NodeJS.Timeout>();

  // Tag-based invalidation
  private readonly tagIndex = new Map<string, Set<string>>(); // tag -> cache keys
  private readonly keyTags = new Map<string, Set<string>>(); // cache key -> tags

  // Performance optimization
  private readonly batchInvalidations = new Map<string, Set<string>>();
  private batchTimeout: NodeJS.Timeout | null = null;
  private readonly batchDelayMs = 100; // Batch invalidations within 100ms

  // Metrics tracking
  private invalidationMetrics: InvalidationMetrics = {
    totalInvalidations: 0,
    eventDrivenInvalidations: 0,
    manualInvalidations: 0,
    dependencyInvalidations: 0,
    averageInvalidationTime: 0,
    invalidationsByType: {},
    invalidationsByCompliance: {
      PUBLIC: 0,
      INTERNAL: 0,
      PHI: 0,
      SENSITIVE_PHI: 0,
    },
  };

  constructor(
    private readonly metricsService: HealthRecordMetricsService,
    private readonly phiLogger: PHIAccessLogger,
    private readonly cacheService: CacheStrategyService,
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(AuditLog) private readonly auditLogModel: typeof AuditLog,
  ) {
    this.initializeService();
    this.setupDefaultRules();
  }

  /**
   * Initialize the invalidation service
   */
  private initializeService(): void {
    this.logInfo(
      'Initializing Intelligent Cache Invalidation Service with database persistence',
    );

    // Setup event listeners
    this.setupEventListeners();

    this.logInfo(
      'Intelligent Cache Invalidation Service initialized successfully',
    );
  }

  /**
   * Register cache dependency relationship with database logging
   */
  async registerDependency(
    sourceKey: string,
    dependentKeys: string[],
    relationshipType: DependencyType,
    strength: number = 1.0,
    complianceLevel: ComplianceLevel = 'INTERNAL',
  ): Promise<string> {
    const dependencyId = this.generateDependencyId(sourceKey, dependentKeys);

    const dependency: CacheDependency = {
      id: dependencyId,
      sourceKey,
      dependentKeys,
      relationshipType,
      strength,
      lastUpdated: new Date(),
      complianceLevel,
    };

    this.dependencyGraph.set(dependencyId, dependency);

    // Update reverse index
    dependentKeys.forEach((depKey) => {
      if (!this.reverseIndex.has(depKey)) {
        this.reverseIndex.set(depKey, new Set());
      }
      this.reverseIndex.get(depKey)!.add(sourceKey);
    });

    // Log dependency registration to database
    await this.logInvalidationEvent({
      eventId: dependencyId,
      eventType: 'DEPENDENCY_REGISTERED',
      sourceEntity: 'CACHE_DEPENDENCY',
      entityId: dependencyId,
      timestamp: new Date(),
      metadata: {
        sourceKey,
        dependentKeys,
        relationshipType,
        strength,
        complianceLevel,
      },
    });

    this.logDebug(
      `Registered cache dependency: ${sourceKey} -> [${dependentKeys.join(', ')}]`,
    );
    return dependencyId;
  }

  /**
   * Invalidate cache by key with database logging
   */
  async invalidateKey(
    cacheKey: string,
    reason: string = 'manual',
    complianceLevel: ComplianceLevel = 'INTERNAL',
  ): Promise<void> {
    const startTime = Date.now();

    try {
      await this.cacheService.invalidate(cacheKey);
      this.invalidationMetrics.totalInvalidations++;
      this.invalidationMetrics.manualInvalidations++;

      if (
        !this.invalidationMetrics.invalidationsByCompliance[complianceLevel]
      ) {
        this.invalidationMetrics.invalidationsByCompliance[complianceLevel] = 0;
      }
      this.invalidationMetrics.invalidationsByCompliance[complianceLevel]++;

      // Log invalidation event to database
      await this.logInvalidationEvent({
        eventId: this.generateEventId(),
        eventType: 'CACHE_INVALIDATION',
        sourceEntity: 'CACHE_KEY',
        entityId: cacheKey,
        timestamp: new Date(),
        metadata: {
          reason,
          complianceLevel,
          invalidationType: 'single',
        },
      });

      // Log PHI access if applicable
      if (complianceLevel === 'PHI' || complianceLevel === 'SENSITIVE_PHI') {
        this.phiLogger.logPHIAccess({
          correlationId: this.generateEventId(),
          timestamp: new Date(),
          operation: 'CACHE_INVALIDATE',
          dataTypes: ['cache'],
          recordCount: 1,
          sensitivityLevel: complianceLevel,
          ipAddress: 'internal',
          userAgent: 'cache-invalidation-service',
          success: true,
        });
      }

      const invalidationTime = Date.now() - startTime;
      this.updateAverageInvalidationTime(invalidationTime);

      this.logDebug(
        `Invalidated cache key: ${cacheKey}, reason: ${reason}, time: ${invalidationTime}ms`,
      );
    } catch (error) {
      this.logError(`Failed to invalidate cache key ${cacheKey}:`, error);
    }
  }

  /**
   * Invalidate cache by tags with database logging
   */
  async invalidateByTags(
    tags: string[],
    reason: string = 'tag_based',
    complianceLevel: ComplianceLevel = 'INTERNAL',
  ): Promise<void> {
    const startTime = Date.now();
    const keysToInvalidate = new Set<string>();

    // Collect all keys with matching tags
    tags.forEach((tag) => {
      const taggedKeys = this.tagIndex.get(tag);
      if (taggedKeys) {
        taggedKeys.forEach((key) => keysToInvalidate.add(key));
      }
    });

    if (keysToInvalidate.size === 0) {
      return;
    }

    try {
      // Invalidate all collected keys
      const invalidationPromises = Array.from(keysToInvalidate).map((key) =>
        this.cacheService.invalidate(key),
      );
      await Promise.all(invalidationPromises);

      this.invalidationMetrics.totalInvalidations += keysToInvalidate.size;
      this.invalidationMetrics.manualInvalidations += keysToInvalidate.size;

      if (
        !this.invalidationMetrics.invalidationsByCompliance[complianceLevel]
      ) {
        this.invalidationMetrics.invalidationsByCompliance[complianceLevel] = 0;
      }
      this.invalidationMetrics.invalidationsByCompliance[complianceLevel] +=
        keysToInvalidate.size;

      // Log bulk invalidation event to database
      await this.logInvalidationEvent({
        eventId: this.generateEventId(),
        eventType: 'BULK_CACHE_INVALIDATION',
        sourceEntity: 'CACHE_TAGS',
        entityId: tags.join(','),
        timestamp: new Date(),
        metadata: {
          tags,
          reason,
          complianceLevel,
          keysInvalidated: keysToInvalidate.size,
          invalidationType: 'bulk',
        },
      });

      // Log PHI access if applicable
      if (complianceLevel === 'PHI' || complianceLevel === 'SENSITIVE_PHI') {
        this.phiLogger.logPHIAccess({
          correlationId: this.generateEventId(),
          timestamp: new Date(),
          operation: 'BULK_CACHE_INVALIDATE',
          dataTypes: ['cache'],
          recordCount: keysToInvalidate.size,
          sensitivityLevel: complianceLevel,
          ipAddress: 'internal',
          userAgent: 'cache-invalidation-service',
          success: true,
        });
      }

      const invalidationTime = Date.now() - startTime;
      this.updateAverageInvalidationTime(
        invalidationTime / keysToInvalidate.size,
      );

      this.logDebug(
        `Invalidated ${keysToInvalidate.size} cache keys by tags [${tags.join(', ')}], time: ${invalidationTime}ms`,
      );
    } catch (error) {
      this.logError(
        `Failed to invalidate cache by tags [${tags.join(', ')}]:`,
        error,
      );
    }
  }

  /**
   * Handle data change events for automatic invalidation
   */
  @OnEvent('health-record.*.changed', { async: true })
  async handleDataChangeEvent(event: InvalidationEvent): Promise<void> {
    try {
      this.invalidationMetrics.eventDrivenInvalidations++;

      // Log the change event to database
      await this.logInvalidationEvent(event);

      // Find applicable invalidation rules
      const applicableRules = this.findApplicableRules(event);

      for (const rule of applicableRules) {
        if (rule.condition && !rule.condition(event)) {
          continue; // Rule condition not met
        }

        // Apply rule with optional delay
        if (rule.delay && rule.delay > 0) {
          this.scheduleDelayedInvalidation(rule, event);
        } else {
          await this.applyInvalidationRule(rule, event);
        }
      }

      // Check for dependency-based invalidation
      await this.handleDependencyInvalidation(event);
    } catch (error) {
      this.logError(`Failed to handle data change event:`, error);
    }
  }

  /**
   * Get invalidation metrics
   */
  getInvalidationMetrics(): InvalidationMetrics {
    return { ...this.invalidationMetrics };
  }

  /**
   * Get recent invalidation events from database
   */
  async getRecentInvalidationEvents(
    limit: number = 100,
  ): Promise<InvalidationEvent[]> {
    try {
      const auditLogs = await this.auditLogModel.findAll({
        where: {
          entityType: 'CACHE_INVALIDATION',
        },
        order: [['createdAt', 'DESC']],
        limit,
      });

      return auditLogs.map((log) => ({
        eventId: log.id || '',
        eventType:
          log.action === AuditAction.CACHE_DELETE
            ? 'CACHE_INVALIDATION'
            : 'UNKNOWN',
        sourceEntity: log.entityType,
        entityId: log.entityId || '',
        timestamp: log.createdAt || new Date(),
        metadata: log.metadata || {},
      }));
    } catch (error) {
      this.logError(
        'Failed to retrieve recent invalidation events:',
        error,
      );
      return [];
    }
  }

  /**
   * Log invalidation event to database
   */
  private async logInvalidationEvent(event: InvalidationEvent): Promise<void> {
    try {
      const auditEntry = {
        action: this.mapEventTypeToAuditAction(event.eventType),
        entityType: 'CACHE_INVALIDATION',
        entityId: event.entityId,
        userId: null,
        userName: null,
        changes: event.metadata,
        ipAddress: 'internal',
        userAgent: 'cache-invalidation-service',
        isPHI:
          event.metadata?.complianceLevel === 'PHI' ||
          event.metadata?.complianceLevel === 'SENSITIVE_PHI',
        complianceType: ComplianceType.HIPAA,
        severity: AuditSeverity.LOW,
        success: true,
        tags: ['cache-invalidation', event.eventType.toLowerCase()],
        metadata: event.metadata,
      };

      await this.auditLogModel.create(auditEntry);
    } catch (error) {
      this.logError(
        `Failed to log invalidation event ${event.eventId}:`,
        error,
      );
    }
  }

  /**
   * Map event type to audit action
   */
  private mapEventTypeToAuditAction(eventType: string): AuditAction {
    const actionMap: Record<string, AuditAction> = {
      CACHE_INVALIDATION: AuditAction.CACHE_DELETE,
      BULK_CACHE_INVALIDATION: AuditAction.CACHE_DELETE,
      DEPENDENCY_REGISTERED: AuditAction.UPDATE,
      DATA_CHANGED: AuditAction.UPDATE,
    };

    return actionMap[eventType] || AuditAction.UPDATE;
  }

  /**
   * Find applicable invalidation rules for an event
   */
  private findApplicableRules(event: InvalidationEvent): InvalidationRule[] {
    const applicableRules: InvalidationRule[] = [];

    for (const rule of Array.from(this.invalidationRules.values())) {
      if (!rule.enabled) continue;

      // Check if event pattern matches
      if (this.matchesPattern(event.eventType, rule.eventPattern)) {
        applicableRules.push(rule);
      }
    }

    return applicableRules;
  }

  /**
   * Apply invalidation rule
   */
  private async applyInvalidationRule(
    rule: InvalidationRule,
    event: InvalidationEvent,
  ): Promise<void> {
    const keysToInvalidate: string[] = [];

    // Find matching cache keys
    for (const pattern of rule.targetPatterns) {
      const matchingKeys = this.findKeysMatchingPattern(pattern);
      keysToInvalidate.push(...matchingKeys);
    }

    if (keysToInvalidate.length > 0) {
      await this.invalidateByTags(
        keysToInvalidate,
        `rule_${rule.name}`,
        event.metadata?.complianceLevel || 'INTERNAL',
      );
    }
  }

  /**
   * Handle dependency-based invalidation
   */
  private async handleDependencyInvalidation(
    event: InvalidationEvent,
  ): Promise<void> {
    const sourceKey = this.generateCacheKey(event.sourceEntity, event.entityId);
    const dependentKeys = this.findDependentKeys(sourceKey);

    if (dependentKeys.length > 0) {
      this.invalidationMetrics.dependencyInvalidations += dependentKeys.length;

      for (const depKey of dependentKeys) {
        await this.invalidateKey(
          depKey,
          'dependency_cascade',
          event.metadata?.complianceLevel || 'INTERNAL',
        );
      }
    }
  }

  /**
   * Find dependent keys for a source key
   */
  private findDependentKeys(sourceKey: string): string[] {
    const dependentKeys: string[] = [];

    for (const [depKey, sources] of this.reverseIndex.entries()) {
      if (sources.has(sourceKey)) {
        dependentKeys.push(depKey);
      }
    }

    return dependentKeys;
  }

  /**
   * Schedule delayed invalidation
   */
  private scheduleDelayedInvalidation(
    rule: InvalidationRule,
    event: InvalidationEvent,
  ): void {
    const timeoutKey = `${rule.id}_${event.eventId}`;

    if (this.pendingInvalidations.has(timeoutKey)) {
      clearTimeout(this.pendingInvalidations.get(timeoutKey));
    }

    const timeout = setTimeout(async () => {
      await this.applyInvalidationRule(rule, event);
      this.pendingInvalidations.delete(timeoutKey);
    }, rule.delay);

    this.pendingInvalidations.set(timeoutKey, timeout);
  }

  /**
   * Find keys matching a pattern
   */
  private findKeysMatchingPattern(pattern: string): string[] {
    const matchingKeys: string[] = [];

    // Simple wildcard matching
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));

    for (const key of this.keyTags.keys()) {
      if (regex.test(key)) {
        matchingKeys.push(key);
      }
    }

    return matchingKeys;
  }

  /**
   * Check if string matches pattern
   */
  private matchesPattern(str: string, pattern: string): boolean {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(str);
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(entityType: string, entityId: string): string {
    return `${entityType}:${entityId}`;
  }

  /**
   * Generate dependency ID
   */
  private generateDependencyId(
    sourceKey: string,
    dependentKeys: string[],
  ): string {
    return `dep_${sourceKey}_${dependentKeys.join('_')}_${Date.now()}`;
  }

  /**
   * Generate event ID
   */
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update average invalidation time
   */
  private updateAverageInvalidationTime(newTime: number): void {
    const currentAvg = this.invalidationMetrics.averageInvalidationTime;
    const totalInvalidations = this.invalidationMetrics.totalInvalidations;

    this.invalidationMetrics.averageInvalidationTime =
      (currentAvg * (totalInvalidations - 1) + newTime) / totalInvalidations;
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Listen for health record changes
    this.eventEmitter.on('health-record.*.changed', (event) => {
      this.handleDataChangeEvent(event);
    });
  }

  /**
   * Setup default invalidation rules
   */
  private setupDefaultRules(): void {
    // Rule for student data changes
    this.invalidationRules.set('student_data_changed', {
      id: 'student_data_changed',
      name: 'Student Data Changed',
      eventPattern: 'health-record.student.changed',
      targetPatterns: ['student:*', 'health-record:student:*'],
      priority: 'HIGH',
      enabled: true,
      complianceRequired: true,
    });

    // Rule for allergy changes
    this.invalidationRules.set('allergy_changed', {
      id: 'allergy_changed',
      name: 'Allergy Data Changed',
      eventPattern: 'health-record.allergy.changed',
      targetPatterns: ['allergy:*', 'health-record:allergy:*'],
      priority: 'HIGH',
      enabled: true,
      complianceRequired: true,
    });

    // Rule for chronic condition changes
    this.invalidationRules.set('chronic_condition_changed', {
      id: 'chronic_condition_changed',
      name: 'Chronic Condition Changed',
      eventPattern: 'health-record.chronic-condition.changed',
      targetPatterns: [
        'chronic-condition:*',
        'health-record:chronic-condition:*',
      ],
      priority: 'MEDIUM',
      enabled: true,
      complianceRequired: true,
    });
  }

  /**
   * Cleanup resources
   */
  onModuleDestroy(): void {
    // Clear all pending invalidations
    for (const timeout of Array.from(this.pendingInvalidations.values())) {
      clearTimeout(timeout);
    }

    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    this.logInfo('Intelligent Cache Invalidation Service destroyed');
  }
}
