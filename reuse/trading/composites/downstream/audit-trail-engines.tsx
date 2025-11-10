/**
 * LOC: WC-DOWN-TRADING-AUDIT-006
 * File: /reuse/trading/composites/downstream/audit-trail-engines.tsx
 */

import { Injectable, Controller, Post, Get, Body, Param, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Sequelize, Model, DataTypes, Transaction } from 'sequelize';

export enum AuditEventType {
  TRADE_EXECUTION = 'trade_execution',
  ORDER_MODIFICATION = 'order_modification',
  POSITION_UPDATE = 'position_update',
  RISK_BREACH = 'risk_breach',
  COMPLIANCE_CHECK = 'compliance_check',
}

class AuditTrailModel extends Model<any, any> {
  declare auditId: string;
  declare eventType: AuditEventType;
  declare userId: string;
  declare timestamp: Date;
  declare entityType: string;
  declare entityId: string;
  declare action: string;
  declare beforeState: Record<string, any>;
  declare afterState: Record<string, any>;
  declare metadata: Record<string, any>;
  declare createdAt: Date;
}

@Injectable()
export class AuditTrailEngineService {
  private readonly logger = new Logger(AuditTrailEngineService.name);
  constructor(private readonly sequelize: Sequelize) {}

  async createAuditEntry(
    eventType: AuditEventType,
    userId: string,
    entityType: string,
    entityId: string,
    action: string,
    beforeState: Record<string, any>,
    afterState: Record<string, any>,
    transaction?: Transaction
  ): Promise<any> {
    return await AuditTrailModel.create({ eventType, userId, timestamp: new Date(), entityType, entityId, action, beforeState, afterState, metadata: {} }, { transaction });
  }

  async getAuditHistory(entityId: string, limit: number = 100, transaction?: Transaction): Promise<any[]> {
    return await AuditTrailModel.findAll({ where: { entityId }, order: [['timestamp', 'DESC']], limit, transaction });
  }
}

@ApiTags('Audit Trail Engines')
@Controller('api/v1/audit-trail')
export class AuditTrailEngineController {
  private readonly logger = new Logger(AuditTrailEngineController.name);
  constructor(private readonly auditService: AuditTrailEngineService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create audit trail entry' })
  async createEntry(@Body() body: any): Promise<any> {
    return await this.auditService.createAuditEntry(body.eventType, body.userId, body.entityType, body.entityId, body.action, body.beforeState, body.afterState);
  }

  @Get(':entityId/history')
  @ApiOperation({ summary: 'Get audit history' })
  @ApiParam({ name: 'entityId' })
  async getHistory(@Param('entityId') entityId: string, @Query('limit') limit?: number): Promise<any> {
    return await this.auditService.getAuditHistory(entityId, limit);
  }
}


// ============================================================================
// ADDITIONAL MODEL INITIALIZATION FUNCTIONS
// ============================================================================

class ExtendedMetricsModel extends Model<any, any> {
  declare metricId: string;
  declare entityId: string;
  declare metricType: string;
  declare value: number;
  declare timestamp: Date;
  declare metadata: Record<string, any>;
  declare createdAt: Date;
}

export function initExtendedMetricsModel(sequelize: Sequelize): typeof ExtendedMetricsModel {
  ExtendedMetricsModel.init(
    {
      metricId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'metric_id',
      },
      entityId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'entity_id',
      },
      metricType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'metric_type',
      },
      value: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false,
        field: 'value',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'timestamp',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        field: 'metadata',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
    },
    {
      sequelize,
      tableName: 'extended_metrics',
      modelName: 'ExtendedMetrics',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['entity_id'] },
        { fields: ['metric_type'] },
        { fields: ['timestamp'] },
      ],
    }
  );

  return ExtendedMetricsModel;
}

class AuditLogModel extends Model<any, any> {
  declare logId: string;
  declare action: string;
  declare userId: string;
  declare entityType: string;
  declare entityId: string;
  declare changes: Record<string, any>;
  declare timestamp: Date;
  declare metadata: Record<string, any>;
  declare createdAt: Date;
}

export function initAuditLogModel(sequelize: Sequelize): typeof AuditLogModel {
  AuditLogModel.init(
    {
      logId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'log_id',
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'action',
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
      },
      entityType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'entity_type',
      },
      entityId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'entity_id',
      },
      changes: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        field: 'changes',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'timestamp',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        field: 'metadata',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
    },
    {
      sequelize,
      tableName: 'audit_logs',
      modelName: 'AuditLog',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['entity_type', 'entity_id'] },
        { fields: ['timestamp'] },
      ],
    }
  );

  return AuditLogModel;
}

class ConfigurationModel extends Model<any, any> {
  declare configId: string;
  declare configKey: string;
  declare configValue: string;
  declare description: string;
  declare isActive: boolean;
  declare metadata: Record<string, any>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initConfigurationModel(sequelize: Sequelize): typeof ConfigurationModel {
  ConfigurationModel.init(
    {
      configId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'config_id',
      },
      configKey: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        field: 'config_key',
      },
      configValue: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'config_value',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'description',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        field: 'metadata',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'configurations',
      modelName: 'Configuration',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['config_key'] },
        { fields: ['is_active'] },
      ],
    }
  );

  return ConfigurationModel;
}



// ============================================================================
// ADDITIONAL AUDIT TRAIL SERVICE METHODS
// ============================================================================

  async searchAuditTrail(
    filters: {
      eventType?: AuditEventType;
      userId?: string;
      entityType?: string;
      startDate?: Date;
      endDate?: Date;
    },
    limit: number = 100,
    offset: number = 0,
    transaction?: Transaction
  ): Promise<{ records: any[]; total: number }> {
    try {
      const where: any = {};

      if (filters.eventType) where.eventType = filters.eventType;
      if (filters.userId) where.userId = filters.userId;
      if (filters.entityType) where.entityType = filters.entityType;
      if (filters.startDate || filters.endDate) {
        where.timestamp = {};
        if (filters.startDate) where.timestamp[Op.gte] = filters.startDate;
        if (filters.endDate) where.timestamp[Op.lte] = filters.endDate;
      }

      const { rows, count } = await AuditTrailModel.findAndCountAll({
        where,
        order: [['timestamp', 'DESC']],
        limit,
        offset,
        transaction,
      });

      return { records: rows, total: count };
    } catch (error) {
      this.logger.error(`Error searching audit trail: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to search audit trail');
    }
  }

  async generateAuditReport(
    startDate: Date,
    endDate: Date,
    transaction?: Transaction
  ): Promise<{
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsByUser: Record<string, number>;
    eventsByEntity: Record<string, number>;
    timeline: Array<{ hour: number; count: number }>;
  }> {
    try {
      this.logger.log(`Generating audit report from ${startDate} to ${endDate}`);

      const records = await AuditTrailModel.findAll({
        where: {
          timestamp: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
        transaction,
      });

      const totalEvents = records.length;
      const eventsByType: Record<string, number> = {};
      const eventsByUser: Record<string, number> = {};
      const eventsByEntity: Record<string, number> = {};
      const timeline: Array<{ hour: number; count: number }> = Array(24).fill(0).map((_, i) => ({ hour: i, count: 0 }));

      for (const record of records) {
        // Count by type
        eventsByType[record.eventType] = (eventsByType[record.eventType] || 0) + 1;

        // Count by user
        eventsByUser[record.userId] = (eventsByUser[record.userId] || 0) + 1;

        // Count by entity
        eventsByEntity[record.entityType] = (eventsByEntity[record.entityType] || 0) + 1;

        // Count by hour
        const hour = record.timestamp.getHours();
        timeline[hour].count += 1;
      }

      return {
        totalEvents,
        eventsByType,
        eventsByUser,
        eventsByEntity,
        timeline,
      };
    } catch (error) {
      this.logger.error(`Error generating audit report: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to generate audit report');
    }
  }

  async compareStates(
    beforeState: Record<string, any>,
    afterState: Record<string, any>
  ): Promise<{
    added: string[];
    removed: string[];
    modified: Array<{ field: string; before: any; after: any }>;
  }> {
    try {
      const added: string[] = [];
      const removed: string[] = [];
      const modified: Array<{ field: string; before: any; after: any }> = [];

      const beforeKeys = new Set(Object.keys(beforeState));
      const afterKeys = new Set(Object.keys(afterState));

      // Find added fields
      for (const key of afterKeys) {
        if (!beforeKeys.has(key)) {
          added.push(key);
        }
      }

      // Find removed fields
      for (const key of beforeKeys) {
        if (!afterKeys.has(key)) {
          removed.push(key);
        }
      }

      // Find modified fields
      for (const key of beforeKeys) {
        if (afterKeys.has(key)) {
          if (JSON.stringify(beforeState[key]) !== JSON.stringify(afterState[key])) {
            modified.push({
              field: key,
              before: beforeState[key],
              after: afterState[key],
            });
          }
        }
      }

      return { added, removed, modified };
    } catch (error) {
      this.logger.error(`Error comparing states: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to compare states');
    }
  }

  async getAuditTrailByTimeRange(
    startDate: Date,
    endDate: Date,
    transaction?: Transaction
  ): Promise<any[]> {
    try {
      return await AuditTrailModel.findAll({
        where: {
          timestamp: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
        order: [['timestamp', 'DESC']],
        transaction,
      });
    } catch (error) {
      this.logger.error(`Error getting audit trail by time range: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to get audit trail by time range');
    }
  }

  async getAuditTrailByUser(
    userId: string,
    limit: number = 100,
    transaction?: Transaction
  ): Promise<any[]> {
    try {
      return await AuditTrailModel.findAll({
        where: { userId },
        order: [['timestamp', 'DESC']],
        limit,
        transaction,
      });
    } catch (error) {
      this.logger.error(`Error getting audit trail by user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to get audit trail by user');
    }
  }

  async getAuditTrailStatistics(
    transaction?: Transaction
  ): Promise<{
    totalAuditRecords: number;
    recordsByEventType: Record<string, number>;
    recordsByAction: Record<string, number>;
    topUsers: Array<{ userId: string; count: number }>;
    topEntities: Array<{ entityType: string; count: number }>;
  }> {
    try {
      this.logger.log('Calculating audit trail statistics');

      const allRecords = await AuditTrailModel.findAll({ transaction });

      const totalAuditRecords = allRecords.length;
      const recordsByEventType: Record<string, number> = {};
      const recordsByAction: Record<string, number> = {};
      const userCounts: Record<string, number> = {};
      const entityCounts: Record<string, number> = {};

      for (const record of allRecords) {
        recordsByEventType[record.eventType] = (recordsByEventType[record.eventType] || 0) + 1;
        recordsByAction[record.action] = (recordsByAction[record.action] || 0) + 1;
        userCounts[record.userId] = (userCounts[record.userId] || 0) + 1;
        entityCounts[record.entityType] = (entityCounts[record.entityType] || 0) + 1;
      }

      const topUsers = Object.entries(userCounts)
        .map(([userId, count]) => ({ userId, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const topEntities = Object.entries(entityCounts)
        .map(([entityType, count]) => ({ entityType, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        totalAuditRecords,
        recordsByEventType,
        recordsByAction,
        topUsers,
        topEntities,
      };
    } catch (error) {
      this.logger.error(`Error calculating statistics: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate audit trail statistics');
    }
  }
}

// ============================================================================
// ADDITIONAL CONTROLLER ENDPOINTS
// ============================================================================

  @Post('search')
  @HttpCode(200)
  @ApiOperation({ summary: 'Search audit trail' })
  @ApiResponse({ status: 200, description: 'Search results returned' })
  async searchAuditTrail(
    @Body() body: {
      eventType?: AuditEventType;
      userId?: string;
      entityType?: string;
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<any> {
    return await this.auditService.searchAuditTrail(
      {
        eventType: body.eventType,
        userId: body.userId,
        entityType: body.entityType,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
      },
      body.limit,
      body.offset
    );
  }

  @Post('reports/generate')
  @HttpCode(200)
  @ApiOperation({ summary: 'Generate audit report' })
  @ApiResponse({ status: 200, description: 'Audit report generated' })
  async generateReport(
    @Body() body: {
      startDate: string;
      endDate: string;
    }
  ): Promise<any> {
    return await this.auditService.generateAuditReport(
      new Date(body.startDate),
      new Date(body.endDate)
    );
  }

  @Post('compare-states')
  @HttpCode(200)
  @ApiOperation({ summary: 'Compare before and after states' })
  @ApiResponse({ status: 200, description: 'States compared successfully' })
  async compareStates(
    @Body() body: {
      beforeState: Record<string, any>;
      afterState: Record<string, any>;
    }
  ): Promise<any> {
    return await this.auditService.compareStates(body.beforeState, body.afterState);
  }

  @Get('time-range')
  @ApiOperation({ summary: 'Get audit trail by time range' })
  @ApiQuery({ name: 'startDate', type: String })
  @ApiQuery({ name: 'endDate', type: String })
  @ApiResponse({ status: 200, description: 'Audit trail retrieved' })
  async getByTimeRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ): Promise<any> {
    return await this.auditService.getAuditTrailByTimeRange(
      new Date(startDate),
      new Date(endDate)
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get audit trail by user' })
  @ApiParam({ name: 'userId', description: 'User identifier' })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'User audit trail retrieved' })
  async getByUser(
    @Param('userId') userId: string,
    @Query('limit') limit?: number
  ): Promise<any> {
    return await this.auditService.getAuditTrailByUser(userId, limit);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get audit trail statistics' }}
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStatistics(): Promise<any> {
    return await this.auditService.getAuditTrailStatistics();
  }
}


export { AuditTrailEngineService, AuditTrailEngineController, AuditTrailModel   ExtendedMetricsModel,
  initExtendedMetricsModel,
  AuditLogModel,
  initAuditLogModel,
  ConfigurationModel,
  initConfigurationModel,
};
