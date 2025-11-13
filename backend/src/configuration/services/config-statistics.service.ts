/**
 * @fileoverview Configuration Statistics Service
 * @module configuration/services/config-statistics.service
 * @description Handles statistics and reporting for configuration data
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes, Sequelize } from 'sequelize';
import { SystemConfig } from '../../database/models/system-config.model';

import { BaseService } from '../../common/base';
@Injectable()
export class ConfigStatisticsService extends BaseService {
  constructor(
    @InjectModel(SystemConfig)
    private readonly configModel: typeof SystemConfig,
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Get configuration statistics
   */
  async getConfigurationStatistics(): Promise<{
    totalCount: number;
    publicCount: number;
    privateCount: number;
    editableCount: number;
    lockedCount: number;
    categoryBreakdown: Record<string, number>;
    scopeBreakdown: Record<string, number>;
  }> {
    try {
      const [
        totalCount,
        categoryBreakdown,
        scopeBreakdown,
        publicCount,
        editableCount,
      ] = await Promise.all([
        this.configModel.count(),
        this.sequelize.query(
          'SELECT category, COUNT(*) as count FROM system_configurations GROUP BY category',
          { type: QueryTypes.SELECT },
        ),
        this.sequelize.query(
          'SELECT scope, COUNT(*) as count FROM system_configurations GROUP BY scope',
          { type: QueryTypes.SELECT },
        ),
        this.configModel.count({ where: { isPublic: true } }),
        this.configModel.count({ where: { isEditable: true } }),
      ]);

      const statistics = {
        totalCount,
        publicCount,
        privateCount: totalCount - publicCount,
        editableCount,
        lockedCount: totalCount - editableCount,
        categoryBreakdown: (categoryBreakdown as any[]).reduce(
          (acc: Record<string, number>, curr: any) => {
            acc[curr.category] = parseInt(curr.count, 10);
            return acc;
          },
          {} as Record<string, number>,
        ),
        scopeBreakdown: (scopeBreakdown as any[]).reduce(
          (acc: Record<string, number>, curr: any) => {
            acc[curr.scope] = parseInt(curr.count, 10);
            return acc;
          },
          {} as Record<string, number>,
        ),
      };

      this.logInfo('Retrieved configuration statistics');
      return statistics;
    } catch (error) {
      this.logError('Error getting configuration statistics:', error);
      throw error;
    }
  }

  /**
   * Get configurations by value type breakdown
   */
  async getValueTypeBreakdown(): Promise<Record<string, number>> {
    try {
      const breakdown = await this.sequelize.query(
        'SELECT "valueType", COUNT(*) as count FROM system_configurations GROUP BY "valueType"',
        { type: QueryTypes.SELECT },
      );

      return (breakdown as any[]).reduce(
        (acc: Record<string, number>, curr: any) => {
          acc[curr.valueType] = parseInt(curr.count, 10);
          return acc;
        },
        {} as Record<string, number>,
      );
    } catch (error) {
      this.logError('Error getting value type breakdown:', error);
      throw error;
    }
  }

  /**
   * Get configurations requiring restart
   */
  async getRestartRequiredCount(): Promise<number> {
    try {
      return this.configModel.count({ where: { requiresRestart: true } });
    } catch (error) {
      this.logError('Error getting restart required count:', error);
      throw error;
    }
  }

  /**
   * Get configuration health metrics
   */
  async getHealthMetrics(): Promise<{
    totalConfigs: number;
    configsWithDefaults: number;
    configsWithValidation: number;
    publicConfigs: number;
    editableConfigs: number;
    healthScore: number;
  }> {
    try {
      const [
        totalConfigs,
        configsWithDefaults,
        configsWithValidation,
        publicConfigs,
        editableConfigs,
      ] = await Promise.all([
        this.configModel.count(),
        this.configModel.count({
          where: {
            defaultValue: { $ne: null },
          },
        }),
        this.configModel.count({
          where: {
            $or: [
              { validValues: { $ne: null } },
              { minValue: { $ne: null } },
              { maxValue: { $ne: null } },
            ],
          },
        }),
        this.configModel.count({ where: { isPublic: true } }),
        this.configModel.count({ where: { isEditable: true } }),
      ]);

      // Calculate health score (0-100)
      const defaultsScore = totalConfigs > 0 ? (configsWithDefaults / totalConfigs) * 25 : 0;
      const validationScore = totalConfigs > 0 ? (configsWithValidation / totalConfigs) * 25 : 0;
      const publicScore = totalConfigs > 0 ? (publicConfigs / totalConfigs) * 25 : 0;
      const editableScore = totalConfigs > 0 ? (editableConfigs / totalConfigs) * 25 : 0;

      const healthScore = Math.round(defaultsScore + validationScore + publicScore + editableScore);

      return {
        totalConfigs,
        configsWithDefaults,
        configsWithValidation,
        publicConfigs,
        editableConfigs,
        healthScore,
      };
    } catch (error) {
      this.logError('Error getting health metrics:', error);
      throw error;
    }
  }

  /**
   * Get configuration trends over time
   */
  async getConfigurationTrends(days: number = 30): Promise<Array<{
    date: string;
    created: number;
    updated: number;
  }>> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const trends = await this.sequelize.query(
        `
        WITH date_series AS (
          SELECT generate_series(
            date_trunc('day', :cutoffDate::timestamp),
            date_trunc('day', NOW()),
            '1 day'::interval
          )::date as date
        ),
        created_stats AS (
          SELECT 
            DATE("createdAt") as date,
            COUNT(*) as created
          FROM system_configurations
          WHERE "createdAt" >= :cutoffDate
          GROUP BY DATE("createdAt")
        ),
        updated_stats AS (
          SELECT 
            DATE("updatedAt") as date,
            COUNT(*) as updated
          FROM system_configurations
          WHERE "updatedAt" >= :cutoffDate
          GROUP BY DATE("updatedAt")
        )
        SELECT 
          ds.date::text,
          COALESCE(cs.created, 0) as created,
          COALESCE(us.updated, 0) as updated
        FROM date_series ds
        LEFT JOIN created_stats cs ON ds.date = cs.date
        LEFT JOIN updated_stats us ON ds.date = us.date
        ORDER BY ds.date ASC
        `,
        {
          replacements: { cutoffDate },
          type: QueryTypes.SELECT,
        },
      );

      return trends as Array<{ date: string; created: number; updated: number }>;
    } catch (error) {
      this.logError('Error getting configuration trends:', error);
      throw error;
    }
  }

  /**
   * Get most frequently changed configurations
   */
  async getMostChangedConfigurations(limit: number = 10): Promise<Array<{
    key: string;
    category: string;
    changeCount: number;
    lastChanged: Date;
  }>> {
    try {
      const results = await this.sequelize.query(
        `
        SELECT 
          sc."key",
          sc."category",
          COUNT(ch.id) as "changeCount",
          MAX(ch."createdAt") as "lastChanged"
        FROM system_configurations sc
        LEFT JOIN configuration_history ch ON sc.id = ch."configurationId"
        GROUP BY sc.id, sc."key", sc."category"
        HAVING COUNT(ch.id) > 0
        ORDER BY "changeCount" DESC, "lastChanged" DESC
        LIMIT :limit
        `,
        {
          replacements: { limit },
          type: QueryTypes.SELECT,
        },
      );

      return results as Array<{
        key: string;
        category: string;
        changeCount: number;
        lastChanged: Date;
      }>;
    } catch (error) {
      this.logError('Error getting most changed configurations:', error);
      throw error;
    }
  }

  /**
   * Get configuration coverage by category
   */
  async getCategoryStats(): Promise<Array<{
    category: string;
    totalConfigs: number;
    publicConfigs: number;
    editableConfigs: number;
    configsWithDefaults: number;
  }>> {
    try {
      const results = await this.sequelize.query(
        `
        SELECT 
          category,
          COUNT(*) as "totalConfigs",
          SUM(CASE WHEN "isPublic" = true THEN 1 ELSE 0 END) as "publicConfigs",
          SUM(CASE WHEN "isEditable" = true THEN 1 ELSE 0 END) as "editableConfigs",
          SUM(CASE WHEN "defaultValue" IS NOT NULL THEN 1 ELSE 0 END) as "configsWithDefaults"
        FROM system_configurations
        GROUP BY category
        ORDER BY category ASC
        `,
        { type: QueryTypes.SELECT },
      );

      return results as Array<{
        category: string;
        totalConfigs: number;
        publicConfigs: number;
        editableConfigs: number;
        configsWithDefaults: number;
      }>;
    } catch (error) {
      this.logError('Error getting category stats:', error);
      throw error;
    }
  }

  /**
   * Generate configuration summary report
   */
  async generateSummaryReport(): Promise<{
    overview: any;
    healthMetrics: any;
    categoryStats: any[];
    mostChanged: any[];
    valueTypeBreakdown: Record<string, number>;
    generatedAt: Date;
  }> {
    try {
      const [
        overview,
        healthMetrics,
        categoryStats,
        mostChanged,
        valueTypeBreakdown,
      ] = await Promise.all([
        this.getConfigurationStatistics(),
        this.getHealthMetrics(),
        this.getCategoryStats(),
        this.getMostChangedConfigurations(5),
        this.getValueTypeBreakdown(),
      ]);

      return {
        overview,
        healthMetrics,
        categoryStats,
        mostChanged,
        valueTypeBreakdown,
        generatedAt: new Date(),
      };
    } catch (error) {
      this.logError('Error generating summary report:', error);
      throw error;
    }
  }
}
