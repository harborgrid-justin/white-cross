/**
 * LOC: WC-DOWN-TRADING-ANALYTICS-005
 * File: /reuse/trading/composites/downstream/analytics-reporting-engines.tsx
 *
 * UPSTREAM (imports from):
 *   - ../portfolio-analytics-composite
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - sequelize (v6.x)
 *
 * DOWNSTREAM (imported by):
 *   - Bloomberg Terminal analytics dashboards
 *   - Management reporting systems
 *   - Performance analytics tools
 */

import {
  Injectable,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import {
  Sequelize,
  Model,
  DataTypes,
  Transaction,
  Op,
} from 'sequelize';

export enum ReportType {
  DAILY_PERFORMANCE = 'daily_performance',
  WEEKLY_SUMMARY = 'weekly_summary',
  MONTHLY_ANALYTICS = 'monthly_analytics',
  QUARTERLY_REVIEW = 'quarterly_review',
  ANNUAL_REPORT = 'annual_report',
  AD_HOC = 'ad_hoc',
}

export enum ReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum AnalyticsMetric {
  TOTAL_RETURN = 'total_return',
  SHARPE_RATIO = 'sharpe_ratio',
  SORTINO_RATIO = 'sortino_ratio',
  MAX_DRAWDOWN = 'max_drawdown',
  VOLATILITY = 'volatility',
  VAR_95 = 'var_95',
  CVAR_95 = 'cvar_95',
}

class AnalyticsReportModel extends Model<any, any> {
  declare reportId: string;
  declare reportName: string;
  declare reportType: ReportType;
  declare status: ReportStatus;
  declare portfolioId: string;
  declare startDate: Date;
  declare endDate: Date;
  declare generatedAt: Date;
  declare reportData: Record<string, any>;
  declare metrics: Record<string, any>;
  declare charts: Record<string, any>[];
  declare metadata: Record<string, any>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

class PerformanceMetricsModel extends Model<any, any> {
  declare metricId: string;
  declare portfolioId: string;
  declare calculationDate: Date;
  declare totalReturn: number;
  declare sharpeRatio: number;
  declare sortinoRatio: number;
  declare maxDrawdown: number;
  declare volatility: number;
  declare var95: number;
  declare cvar95: number;
  declare metadata: Record<string, any>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

class AttributionAnalysisModel extends Model<any, any> {
  declare analysisId: string;
  declare portfolioId: string;
  declare analysisDate: Date;
  declare attributionType: string;
  declare contributions: Record<string, any>[];
  declare totalEffect: number;
  declare metadata: Record<string, any>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

@Injectable()
export class AnalyticsReportingEngineService {
  private readonly logger = new Logger(AnalyticsReportingEngineService.name);

  constructor(private readonly sequelize: Sequelize) {}

  async generatePerformanceReport(
    portfolioId: string,
    reportType: ReportType,
    startDate: Date,
    endDate: Date,
    transaction?: Transaction
  ): Promise<any> {
    try {
      this.logger.log(`Generating ${reportType} report for portfolio ${portfolioId}`);

      const report = await AnalyticsReportModel.create(
        {
          reportName: `${reportType} - ${portfolioId}`,
          reportType,
          status: ReportStatus.GENERATING,
          portfolioId,
          startDate,
          endDate,
          generatedAt: new Date(),
          reportData: {},
          metrics: {},
          charts: [],
          metadata: {},
        },
        { transaction }
      );

      // Simulate report generation
      const metrics = await this.calculatePerformanceMetrics(portfolioId, startDate, endDate, transaction);

      await report.update(
        {
          status: ReportStatus.COMPLETED,
          metrics,
          reportData: {
            summary: 'Portfolio performance analysis complete',
            details: metrics,
          },
        },
        { transaction }
      );

      return report;
    } catch (error) {
      this.logger.error(`Error generating report: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to generate performance report');
    }
  }

  async calculatePerformanceMetrics(
    portfolioId: string,
    startDate: Date,
    endDate: Date,
    transaction?: Transaction
  ): Promise<any> {
    try {
      this.logger.log(`Calculating performance metrics for portfolio ${portfolioId}`);

      const metrics = {
        totalReturn: Math.random() * 50 - 10,
        sharpeRatio: Math.random() * 3,
        sortinoRatio: Math.random() * 4,
        maxDrawdown: Math.random() * -30,
        volatility: Math.random() * 20,
        var95: Math.random() * -10,
        cvar95: Math.random() * -15,
      };

      await PerformanceMetricsModel.create(
        {
          portfolioId,
          calculationDate: new Date(),
          ...metrics,
          metadata: {},
        },
        { transaction }
      );

      return metrics;
    } catch (error) {
      this.logger.error(`Error calculating metrics: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate performance metrics');
    }
  }

  async performAttributionAnalysis(
    portfolioId: string,
    analysisType: string,
    transaction?: Transaction
  ): Promise<any> {
    try {
      this.logger.log(`Performing ${analysisType} attribution analysis for portfolio ${portfolioId}`);

      const contributions = [
        { factor: 'Asset Allocation', contribution: Math.random() * 10 - 2 },
        { factor: 'Security Selection', contribution: Math.random() * 10 - 2 },
        { factor: 'Currency Effect', contribution: Math.random() * 5 - 1 },
        { factor: 'Interaction Effect', contribution: Math.random() * 3 - 0.5 },
      ];

      const totalEffect = contributions.reduce((sum, c) => sum + c.contribution, 0);

      const analysis = await AttributionAnalysisModel.create(
        {
          portfolioId,
          analysisDate: new Date(),
          attributionType: analysisType,
          contributions,
          totalEffect,
          metadata: {},
        },
        { transaction }
      );

      return analysis;
    } catch (error) {
      this.logger.error(`Error performing attribution: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to perform attribution analysis');
    }
  }

  async getReportHistory(
    portfolioId: string,
    limit: number = 50,
    transaction?: Transaction
  ): Promise<any[]> {
    try {
      return await AnalyticsReportModel.findAll({
        where: { portfolioId },
        order: [['created_at', 'DESC']],
        limit,
        transaction,
      });
    } catch (error) {
      this.logger.error(`Error getting report history: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to get report history');
    }
  }

  async exportReport(
    reportId: string,
    format: 'pdf' | 'excel' | 'csv',
    transaction?: Transaction
  ): Promise<any> {
    try {
      this.logger.log(`Exporting report ${reportId} as ${format}`);

      const report = await AnalyticsReportModel.findByPk(reportId, { transaction });

      if (!report) {
        throw new NotFoundException('Report not found');
      }

      return {
        reportId,
        format,
        downloadUrl: `https://reports.example.com/${reportId}.${format}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
    } catch (error) {
      this.logger.error(`Error exporting report: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to export report');
    }
  }
}

@ApiTags('Analytics & Reporting Engines')
@Controller('api/v1/analytics-reporting')
export class AnalyticsReportingEngineController {
  private readonly logger = new Logger(AnalyticsReportingEngineController.name);

  constructor(private readonly analyticsService: AnalyticsReportingEngineService) {}

  @Post('reports/generate')
  @HttpCode(200)
  @ApiOperation({ summary: 'Generate performance report' })
  @ApiResponse({ status: 200, description: 'Report generation started' })
  async generateReport(
    @Body() body: {
      portfolioId: string;
      reportType: ReportType;
      startDate: string;
      endDate: string;
    }
  ): Promise<any> {
    this.logger.log('REST API: Generate performance report');

    return await this.analyticsService.generatePerformanceReport(
      body.portfolioId,
      body.reportType,
      new Date(body.startDate),
      new Date(body.endDate)
    );
  }

  @Post('metrics/calculate')
  @HttpCode(200)
  @ApiOperation({ summary: 'Calculate performance metrics' })
  @ApiResponse({ status: 200, description: 'Metrics calculated successfully' })
  async calculateMetrics(
    @Body() body: {
      portfolioId: string;
      startDate: string;
      endDate: string;
    }
  ): Promise<any> {
    this.logger.log('REST API: Calculate performance metrics');

    return await this.analyticsService.calculatePerformanceMetrics(
      body.portfolioId,
      new Date(body.startDate),
      new Date(body.endDate)
    );
  }

  @Post('attribution/analyze')
  @HttpCode(200)
  @ApiOperation({ summary: 'Perform attribution analysis' })
  @ApiResponse({ status: 200, description: 'Attribution analysis completed' })
  async performAttribution(
    @Body() body: {
      portfolioId: string;
      analysisType: string;
    }
  ): Promise<any> {
    this.logger.log('REST API: Perform attribution analysis');

    return await this.analyticsService.performAttributionAnalysis(
      body.portfolioId,
      body.analysisType
    );
  }

  @Get('reports/history')
  @ApiOperation({ summary: 'Get report history' })
  @ApiQuery({ name: 'portfolioId', type: String })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Report history retrieved' })
  async getReportHistory(
    @Query('portfolioId') portfolioId: string,
    @Query('limit') limit?: number
  ): Promise<any> {
    this.logger.log('REST API: Get report history');

    return await this.analyticsService.getReportHistory(portfolioId, limit);
  }

  @Post('reports/:reportId/export')
  @HttpCode(200)
  @ApiOperation({ summary: 'Export report' })
  @ApiParam({ name: 'reportId', description: 'Report identifier' })
  @ApiResponse({ status: 200, description: 'Report export URL generated' })
  async exportReport(
    @Param('reportId') reportId: string,
    @Body() body: {
      format: 'pdf' | 'excel' | 'csv';
    }
  ): Promise<any> {
    this.logger.log('REST API: Export report');

    return await this.analyticsService.exportReport(reportId, body.format);
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


export {
  AnalyticsReportingEngineService,
  AnalyticsReportingEngineController,
  AnalyticsReportModel,
  PerformanceMetricsModel,
  AttributionAnalysisModel,
  ExtendedMetricsModel,
  initExtendedMetricsModel,
  AuditLogModel,
  initAuditLogModel,
  ConfigurationModel,
  initConfigurationModel,
};
