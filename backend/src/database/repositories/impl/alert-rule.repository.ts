/**
 * Alert Rule Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';
import {
  AlertRule,
  AlertSeverity,
  AlertCategory,
  TriggerCondition,
  NotificationChannel
} from '../../models/alert-rule.model';

export interface AlertRuleAttributes {
  id: string;
  name: string;
  description?: string;
  category: AlertCategory;
  severity: AlertSeverity;
  isActive: boolean;
  priority: number;
  triggerConditions: TriggerCondition[];
  notificationChannels: NotificationChannel[];
  targetRoles?: string[];
  targetUsers?: string[];
  schoolId?: string;
  districtId?: string;
  autoEscalateAfter?: number;
  cooldownPeriod?: number;
  requiresAcknowledgment: boolean;
  expiresAfter?: number;
  metadata?: Record<string, any>;
  createdBy?: string;
  updatedBy?: string;
  lastTriggered?: Date;
  triggerCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAlertRuleDTO {
  name: string;
  description?: string;
  category: AlertCategory;
  severity: AlertSeverity;
  isActive?: boolean;
  priority?: number;
  triggerConditions: TriggerCondition[];
  notificationChannels: NotificationChannel[];
  targetRoles?: string[];
  targetUsers?: string[];
  schoolId?: string;
  districtId?: string;
  autoEscalateAfter?: number;
  cooldownPeriod?: number;
  requiresAcknowledgment?: boolean;
  expiresAfter?: number;
  metadata?: Record<string, any>;
  createdBy?: string;
}

export interface UpdateAlertRuleDTO {
  name?: string;
  description?: string;
  category?: AlertCategory;
  severity?: AlertSeverity;
  isActive?: boolean;
  priority?: number;
  triggerConditions?: TriggerCondition[];
  notificationChannels?: NotificationChannel[];
  targetRoles?: string[];
  targetUsers?: string[];
  schoolId?: string;
  districtId?: string;
  autoEscalateAfter?: number;
  cooldownPeriod?: number;
  requiresAcknowledgment?: boolean;
  expiresAfter?: number;
  metadata?: Record<string, any>;
  updatedBy?: string;
}

@Injectable()
export class AlertRuleRepository extends BaseRepository<AlertRule, AlertRuleAttributes, CreateAlertRuleDTO> {
  constructor(
    @InjectModel(AlertRule)
    private readonly alertRuleModel: typeof AlertRule,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(alertRuleModel, auditLogger, cacheManager, 'AlertRule');
  }

  /**
   * Validate alert rule creation
   */
  protected async validateCreate(data: CreateAlertRuleDTO): Promise<void> {
    // Validate required fields
    if (!data.name) {
      throw new RepositoryError('Alert rule name is required', 'VALIDATION_ERROR');
    }

    if (!data.category) {
      throw new RepositoryError('Alert category is required', 'VALIDATION_ERROR');
    }

    if (!data.severity) {
      throw new RepositoryError('Alert severity is required', 'VALIDATION_ERROR');
    }

    // Validate trigger conditions
    if (!Array.isArray(data.triggerConditions) || data.triggerConditions.length === 0) {
      throw new RepositoryError('At least one trigger condition is required', 'VALIDATION_ERROR');
    }

    // Validate each trigger condition
    for (const condition of data.triggerConditions) {
      if (!condition.field || !condition.operator) {
        throw new RepositoryError('Trigger condition must have field and operator', 'VALIDATION_ERROR');
      }
    }

    // Validate notification channels
    if (!Array.isArray(data.notificationChannels) || data.notificationChannels.length === 0) {
      throw new RepositoryError('At least one notification channel is required', 'VALIDATION_ERROR');
    }

    // Validate priority range
    if (data.priority !== undefined && (data.priority < 0 || data.priority > 100)) {
      throw new RepositoryError('Priority must be between 0 and 100', 'VALIDATION_ERROR');
    }

    // Check for duplicate name
    const existing = await this.alertRuleModel.findOne({
      where: { name: data.name },
    });

    if (existing) {
      throw new RepositoryError(
        `Alert rule with name '${data.name}' already exists`,
        'DUPLICATE_RECORD'
      );
    }
  }

  /**
   * Validate alert rule update
   */
  protected async validateUpdate(id: string, data: UpdateAlertRuleDTO): Promise<void> {
    // Validate priority range if being updated
    if (data.priority !== undefined && (data.priority < 0 || data.priority > 100)) {
      throw new RepositoryError('Priority must be between 0 and 100', 'VALIDATION_ERROR');
    }

    // Validate trigger conditions if being updated
    if (data.triggerConditions !== undefined) {
      if (!Array.isArray(data.triggerConditions) || data.triggerConditions.length === 0) {
        throw new RepositoryError('At least one trigger condition is required', 'VALIDATION_ERROR');
      }

      for (const condition of data.triggerConditions) {
        if (!condition.field || !condition.operator) {
          throw new RepositoryError('Trigger condition must have field and operator', 'VALIDATION_ERROR');
        }
      }
    }

    // Validate notification channels if being updated
    if (data.notificationChannels !== undefined) {
      if (!Array.isArray(data.notificationChannels) || data.notificationChannels.length === 0) {
        throw new RepositoryError('At least one notification channel is required', 'VALIDATION_ERROR');
      }
    }

    // Check for duplicate name if being updated
    if (data.name) {
      const existing = await this.alertRuleModel.findOne({
        where: { name: data.name },
      });

      if (existing && existing.id !== id) {
        throw new RepositoryError(
          `Alert rule with name '${data.name}' already exists`,
          'DUPLICATE_RECORD'
        );
      }
    }
  }

  /**
   * Invalidate caches for alert rule
   */
  protected async invalidateCaches(entity: any): Promise<void> {
    try {
      const entityData = entity.get ? entity.get() : entity;

      // Invalidate specific rule cache
      await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, entityData.id));

      // Invalidate category cache
      await this.cacheManager.delete(`white-cross:alert-rules:category:${entityData.category}`);

      // Invalidate severity cache
      await this.cacheManager.delete(`white-cross:alert-rules:severity:${entityData.severity}`);

      // Invalidate active rules cache
      await this.cacheManager.delete(`white-cross:alert-rules:active`);

      // Invalidate school/district caches
      if (entityData.schoolId) {
        await this.cacheManager.delete(`white-cross:alert-rules:school:${entityData.schoolId}`);
      }

      if (entityData.districtId) {
        await this.cacheManager.delete(`white-cross:alert-rules:district:${entityData.districtId}`);
      }

      // Invalidate all alert rules pattern
      await this.cacheManager.deletePattern(`white-cross:${this.entityName.toLowerCase()}:*`);
    } catch (error) {
      this.logger.warn(`Error invalidating ${this.entityName} caches:`, error);
    }
  }

  /**
   * Sanitize alert rule data for audit logs
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({ ...data });
  }

  /**
   * Find active alert rules by category
   */
  async findActiveByCategory(category: AlertCategory): Promise<AlertRule[]> {
    const cacheKey = `white-cross:alert-rules:category:${category}:active`;

    // Try cache first
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as AlertRule[];
    }

    // Query database
    const rules = await this.alertRuleModel.findAll({
      where: {
        category,
        isActive: true
      },
      order: [['priority', 'DESC']],
    });

    // Cache results
    await this.cacheManager.set(cacheKey, rules, 1800); // Cache for 30 minutes

    return rules;
  }

  /**
   * Find active alert rules by severity
   */
  async findActiveBySeverity(severity: AlertSeverity): Promise<AlertRule[]> {
    const cacheKey = `white-cross:alert-rules:severity:${severity}:active`;

    // Try cache first
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as AlertRule[];
    }

    // Query database
    const rules = await this.alertRuleModel.findAll({
      where: {
        severity,
        isActive: true
      },
      order: [['priority', 'DESC']],
    });

    // Cache results
    await this.cacheManager.set(cacheKey, rules, 1800); // Cache for 30 minutes

    return rules;
  }

  /**
   * Find all active alert rules
   */
  async findAllActive(): Promise<AlertRule[]> {
    const cacheKey = `white-cross:alert-rules:active`;

    // Try cache first
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as AlertRule[];
    }

    // Query database
    const rules = await this.alertRuleModel.findAll({
      where: { isActive: true },
      order: [['priority', 'DESC'], ['category', 'ASC']],
    });

    // Cache results
    await this.cacheManager.set(cacheKey, rules, 1800); // Cache for 30 minutes

    return rules;
  }
}

