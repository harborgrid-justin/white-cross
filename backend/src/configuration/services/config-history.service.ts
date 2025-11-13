/**
 * @fileoverview Configuration History Service
 * @module configuration/services/config-history.service
 * @description Handles audit trail and history tracking for configuration changes
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { SystemConfig } from '@/database/models';
import { ConfigurationHistory } from '@/database/models';
import { UpdateConfigurationDto } from '../dto';

import { BaseService } from '@/common/base';
@Injectable()
export class ConfigHistoryService extends BaseService {
  constructor(
    @InjectModel(SystemConfig)
    private readonly configModel: typeof SystemConfig,
    @InjectModel(ConfigurationHistory)
    private readonly historyModel: typeof ConfigurationHistory,
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Create history record for configuration change
   */
  async createHistoryRecord(
    config: SystemConfig,
    oldValue: string,
    newValue: string,
    updateData: UpdateConfigurationDto,
    transaction?: any,
  ): Promise<ConfigurationHistory> {
    return this.historyModel.create(
      {
        configurationId: config.id,
        configKey: config.key,
        oldValue,
        newValue,
        changedBy: updateData.changedBy,
        changedByName: updateData.changedByName,
        changeReason: updateData.changeReason,
        ipAddress: updateData.ipAddress,
        userAgent: updateData.userAgent,
      } as any,
      { transaction },
    );
  }

  /**
   * Get configuration change history
   */
  async getConfigHistory(
    key: string,
    limit: number = 50,
  ): Promise<ConfigurationHistory[]> {
    try {
      const history = await this.historyModel.findAll({
        where: { configKey: key },
        include: [
          {
            model: this.configModel,
            as: 'configuration',
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
      });

      return history;
    } catch (error) {
      this.logError(`Error fetching history for ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get all configuration changes by a user
   */
  async getConfigChangesByUser(
    userId: string,
    limit: number = 50,
  ): Promise<ConfigurationHistory[]> {
    try {
      const history = await this.historyModel.findAll({
        where: { changedBy: userId },
        include: [
          {
            model: this.configModel,
            as: 'configuration',
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
      });

      return history;
    } catch (error) {
      this.logError(`Error fetching user changes for ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get recent configuration changes across all configurations
   */
  async getRecentChanges(limit: number = 100): Promise<ConfigurationHistory[]> {
    try {
      const history = await this.historyModel.findAll({
        include: [
          {
            model: this.configModel,
            as: 'configuration',
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
      });

      return history;
    } catch (error) {
      this.logError('Error fetching recent changes:', error);
      throw error;
    }
  }

  /**
   * Get configuration changes within a date range
   */
  async getConfigChangesByDateRange(
    startDate: Date,
    endDate: Date,
    limit: number = 100,
  ): Promise<ConfigurationHistory[]> {
    try {
      const history = await this.historyModel.findAll({
        where: {
          createdAt: {
            $between: [startDate, endDate],
          },
        },
        include: [
          {
            model: this.configModel,
            as: 'configuration',
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
      });

      return history;
    } catch (error) {
      this.logError('Error fetching changes by date range:', error);
      throw error;
    }
  }

  /**
   * Get configuration change statistics
   */
  async getChangeStatistics(days: number = 30): Promise<{
    totalChanges: number;
    changesByUser: Array<{ userId: string; count: number }>;
    changesByConfig: Array<{ configKey: string; count: number }>;
    changesOverTime: Array<{ date: string; count: number }>;
  }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const [totalChanges, changesByUser, changesByConfig, changesOverTime] = await Promise.all([
        this.historyModel.count({
          where: {
            createdAt: { $gte: cutoffDate },
          },
        }),
        this.sequelize.query(
          `
          SELECT "changedBy" as "userId", COUNT(*) as count
          FROM configuration_history
          WHERE "createdAt" >= :cutoffDate
          GROUP BY "changedBy"
          ORDER BY count DESC
          LIMIT 10
          `,
          {
            replacements: { cutoffDate },
            type: this.sequelize.QueryTypes.SELECT,
          },
        ),
        this.sequelize.query(
          `
          SELECT "configKey", COUNT(*) as count
          FROM configuration_history
          WHERE "createdAt" >= :cutoffDate
          GROUP BY "configKey"
          ORDER BY count DESC
          LIMIT 10
          `,
          {
            replacements: { cutoffDate },
            type: this.sequelize.QueryTypes.SELECT,
          },
        ),
        this.sequelize.query(
          `
          SELECT DATE("createdAt") as date, COUNT(*) as count
          FROM configuration_history
          WHERE "createdAt" >= :cutoffDate
          GROUP BY DATE("createdAt")
          ORDER BY date ASC
          `,
          {
            replacements: { cutoffDate },
            type: this.sequelize.QueryTypes.SELECT,
          },
        ),
      ]);

      return {
        totalChanges,
        changesByUser: changesByUser as Array<{ userId: string; count: number }>,
        changesByConfig: changesByConfig as Array<{ configKey: string; count: number }>,
        changesOverTime: changesOverTime as Array<{ date: string; count: number }>,
      };
    } catch (error) {
      this.logError('Error getting change statistics:', error);
      throw error;
    }
  }

  /**
   * Create database transaction for atomic operations
   */
  async createTransaction() {
    return this.sequelize.transaction();
  }

  /**
   * Rollback a transaction
   */
  async rollbackTransaction(transaction: any) {
    return transaction.rollback();
  }

  /**
   * Commit a transaction
   */
  async commitTransaction(transaction: any) {
    return transaction.commit();
  }
}
