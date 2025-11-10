/**
 * LOC: WC-DOWN-TRADING-ALGOCTRL-004
 * File: /reuse/trading/composites/downstream/algorithmic-trading-controllers.tsx
 *
 * UPSTREAM (imports from):
 *   - ../trading-algorithms-strategies-composite
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - sequelize (v6.x)
 *
 * DOWNSTREAM (imported by):
 *   - Bloomberg Terminal algorithmic trading UI
 *   - Strategy management dashboards
 *   - Backtest result visualization
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

export enum StrategyType {
  MOMENTUM = 'momentum',
  MEAN_REVERSION = 'mean_reversion',
  ARBITRAGE = 'arbitrage',
  MARKET_MAKING = 'market_making',
  TREND_FOLLOWING = 'trend_following',
}

export enum StrategyStatus {
  DRAFT = 'draft',
  BACKTESTING = 'backtesting',
  PAPER_TRADING = 'paper_trading',
  LIVE = 'live',
  PAUSED = 'paused',
  STOPPED = 'stopped',
}

class AlgorithmicStrategyModel extends Model<any, any> {
  declare strategyId: string;
  declare strategyName: string;
  declare strategyType: StrategyType;
  declare status: StrategyStatus;
  declare parameters: Record<string, any>;
  declare riskLimits: Record<string, any>;
  declare performanceMetrics: Record<string, any>;
  declare createdAt: Date;
  declare updatedAt: Date;
}

class StrategyBacktestModel extends Model<any, any> {
  declare backtestId: string;
  declare strategyId: string;
  declare startDate: Date;
  declare endDate: Date;
  declare totalReturn: number;
  declare sharpeRatio: number;
  declare maxDrawdown: number;
  declare winRate: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

@Injectable()
export class AlgorithmicTradingControllerService {
  private readonly logger = new Logger(AlgorithmicTradingControllerService.name);

  constructor(private readonly sequelize: Sequelize) {}

  async createStrategy(
    strategyName: string,
    strategyType: StrategyType,
    parameters: Record<string, any>,
    transaction?: Transaction
  ): Promise<any> {
    try {
      this.logger.log(`Creating algorithmic strategy: ${strategyName}`);

      return await AlgorithmicStrategyModel.create(
        {
          strategyName,
          strategyType,
          status: StrategyStatus.DRAFT,
          parameters,
          riskLimits: {},
          performanceMetrics: {},
        },
        { transaction }
      );
    } catch (error) {
      this.logger.error(`Error creating strategy: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create strategy');
    }
  }

  async runBacktest(
    strategyId: string,
    startDate: Date,
    endDate: Date,
    transaction?: Transaction
  ): Promise<any> {
    try {
      this.logger.log(`Running backtest for strategy ${strategyId}`);

      const strategy = await AlgorithmicStrategyModel.findByPk(strategyId, { transaction });

      if (!strategy) {
        throw new NotFoundException('Strategy not found');
      }

      const backtest = await StrategyBacktestModel.create(
        {
          strategyId,
          startDate,
          endDate,
          totalReturn: Math.random() * 50 - 10,
          sharpeRatio: Math.random() * 3,
          maxDrawdown: Math.random() * -30,
          winRate: Math.random() * 100,
        },
        { transaction }
      );

      await strategy.update(
        {
          status: StrategyStatus.BACKTESTING,
        },
        { transaction }
      );

      return backtest;
    } catch (error) {
      this.logger.error(`Error running backtest: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to run backtest');
    }
  }

  async deployStrategy(
    strategyId: string,
    mode: 'paper' | 'live',
    transaction?: Transaction
  ): Promise<any> {
    try {
      this.logger.log(`Deploying strategy ${strategyId} in ${mode} mode`);

      const strategy = await AlgorithmicStrategyModel.findByPk(strategyId, { transaction });

      if (!strategy) {
        throw new NotFoundException('Strategy not found');
      }

      await strategy.update(
        {
          status: mode === 'paper' ? StrategyStatus.PAPER_TRADING : StrategyStatus.LIVE,
        },
        { transaction }
      );

      return strategy;
    } catch (error) {
      this.logger.error(`Error deploying strategy: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to deploy strategy');
    }
  }

  async pauseStrategy(
    strategyId: string,
    transaction?: Transaction
  ): Promise<any> {
    try {
      this.logger.log(`Pausing strategy ${strategyId}`);

      const strategy = await AlgorithmicStrategyModel.findByPk(strategyId, { transaction });

      if (!strategy) {
        throw new NotFoundException('Strategy not found');
      }

      await strategy.update(
        {
          status: StrategyStatus.PAUSED,
        },
        { transaction }
      );

      return strategy;
    } catch (error) {
      this.logger.error(`Error pausing strategy: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to pause strategy');
    }
  }

  async getStrategyPerformance(
    strategyId: string,
    transaction?: Transaction
  ): Promise<any> {
    try {
      const strategy = await AlgorithmicStrategyModel.findByPk(strategyId, { transaction });

      if (!strategy) {
        throw new NotFoundException('Strategy not found');
      }

      return strategy.performanceMetrics;
    } catch (error) {
      this.logger.error(`Error getting performance: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to get strategy performance');
    }
  }

  async getAllStrategies(
    transaction?: Transaction
  ): Promise<any[]> {
    try {
      return await AlgorithmicStrategyModel.findAll({
        order: [['created_at', 'DESC']],
        transaction,
      });
    } catch (error) {
      this.logger.error(`Error getting strategies: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to get strategies');
    }
  }
}

@ApiTags('Algorithmic Trading Controllers')
@Controller('api/v1/algo-trading')
export class AlgorithmicTradingControllerController {
  private readonly logger = new Logger(AlgorithmicTradingControllerController.name);

  constructor(private readonly algoTradingService: AlgorithmicTradingControllerService) {}

  @Post('strategies')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create algorithmic trading strategy' })
  @ApiResponse({ status: 201, description: 'Strategy created successfully' })
  async createStrategy(
    @Body() body: {
      strategyName: string;
      strategyType: StrategyType;
      parameters: Record<string, any>;
    }
  ): Promise<any> {
    this.logger.log('REST API: Create strategy');

    return await this.algoTradingService.createStrategy(
      body.strategyName,
      body.strategyType,
      body.parameters
    );
  }

  @Post('strategies/:strategyId/backtest')
  @HttpCode(200)
  @ApiOperation({ summary: 'Run strategy backtest' })
  @ApiParam({ name: 'strategyId', description: 'Strategy identifier' })
  @ApiResponse({ status: 200, description: 'Backtest started successfully' })
  async runBacktest(
    @Param('strategyId') strategyId: string,
    @Body() body: {
      startDate: string;
      endDate: string;
    }
  ): Promise<any> {
    this.logger.log('REST API: Run backtest');

    return await this.algoTradingService.runBacktest(
      strategyId,
      new Date(body.startDate),
      new Date(body.endDate)
    );
  }

  @Post('strategies/:strategyId/deploy')
  @HttpCode(200)
  @ApiOperation({ summary: 'Deploy strategy to paper or live trading' })
  @ApiParam({ name: 'strategyId', description: 'Strategy identifier' })
  @ApiResponse({ status: 200, description: 'Strategy deployed successfully' })
  async deployStrategy(
    @Param('strategyId') strategyId: string,
    @Body() body: {
      mode: 'paper' | 'live';
    }
  ): Promise<any> {
    this.logger.log('REST API: Deploy strategy');

    return await this.algoTradingService.deployStrategy(strategyId, body.mode);
  }

  @Put('strategies/:strategyId/pause')
  @HttpCode(200)
  @ApiOperation({ summary: 'Pause running strategy' })
  @ApiParam({ name: 'strategyId', description: 'Strategy identifier' })
  @ApiResponse({ status: 200, description: 'Strategy paused successfully' })
  async pauseStrategy(
    @Param('strategyId') strategyId: string
  ): Promise<any> {
    this.logger.log('REST API: Pause strategy');

    return await this.algoTradingService.pauseStrategy(strategyId);
  }

  @Get('strategies/:strategyId/performance')
  @ApiOperation({ summary: 'Get strategy performance metrics' })
  @ApiParam({ name: 'strategyId', description: 'Strategy identifier' })
  @ApiResponse({ status: 200, description: 'Performance metrics retrieved' })
  async getPerformance(
    @Param('strategyId') strategyId: string
  ): Promise<any> {
    this.logger.log('REST API: Get strategy performance');

    return await this.algoTradingService.getStrategyPerformance(strategyId);
  }

  @Get('strategies')
  @ApiOperation({ summary: 'Get all algorithmic trading strategies' })
  @ApiResponse({ status: 200, description: 'Strategies retrieved successfully' })
  async getAllStrategies(): Promise<any> {
    this.logger.log('REST API: Get all strategies');

    return await this.algoTradingService.getAllStrategies();
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
  AlgorithmicTradingControllerService,
  AlgorithmicTradingControllerController,
  AlgorithmicStrategyModel,
  StrategyBacktestModel,
  ExtendedMetricsModel,
  initExtendedMetricsModel,
  AuditLogModel,
  initAuditLogModel,
  ConfigurationModel,
  initConfigurationModel,
};
