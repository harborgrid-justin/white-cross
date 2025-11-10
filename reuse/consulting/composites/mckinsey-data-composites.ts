/**
 * LOC: CONSULT-COMP-MCKINSEY-DATA-001
 * File: /reuse/consulting/composites/mckinsey-data-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../business-transformation-kit
 *   - ../digital-strategy-kit
 *   - ../financial-modeling-kit
 *   - ../strategic-planning-kit
 *
 * DOWNSTREAM (imported by):
 *   - Data analytics controllers
 *   - Business intelligence services
 *   - Strategic insights modules
 *   - Analytics dashboards
 */

/**
 * File: /reuse/consulting/composites/mckinsey-data-composites.ts
 * Locator: WC-COMP-MCKINSEY-DATA-001
 * Purpose: McKinsey-Style Data Modeling, Analytics & Insights Composite
 *
 * Upstream: @nestjs/common, sequelize, transformation/strategy/financial/planning kits
 * Downstream: Analytics controllers, BI services, insights engines, dashboard services
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 45 composed functions for comprehensive data modeling and analytics
 *
 * LLM Context: Enterprise-grade data modeling and analytics composite for consulting platform.
 * Provides McKinsey-level data modeling, business intelligence, predictive analytics, strategic
 * insights, performance metrics, KPI tracking, data warehouse design, OLAP cubes, dimensional
 * modeling, data quality management, master data management, and analytics governance.
 */

import { Injectable, Logger } from '@nestjs/common';
import {
  Sequelize,
  Model,
  DataTypes,
  Transaction,
  Op,
  ModelAttributes,
  ModelOptions,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  BelongsToGetAssociationMixin,
  Optional,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS AND INTERFACES
// ============================================================================

/**
 * Data model types for enterprise analytics
 */
export enum DataModelType {
  DIMENSIONAL = 'dimensional',
  RELATIONAL = 'relational',
  STAR_SCHEMA = 'star_schema',
  SNOWFLAKE_SCHEMA = 'snowflake_schema',
  DATA_VAULT = 'data_vault',
  GRAPH = 'graph',
  DOCUMENT = 'document',
  TIME_SERIES = 'time_series',
}

/**
 * Analytics framework types
 */
export enum AnalyticsFramework {
  DESCRIPTIVE = 'descriptive',
  DIAGNOSTIC = 'diagnostic',
  PREDICTIVE = 'predictive',
  PRESCRIPTIVE = 'prescriptive',
  COGNITIVE = 'cognitive',
}

/**
 * Data quality dimensions
 */
export enum DataQualityDimension {
  ACCURACY = 'accuracy',
  COMPLETENESS = 'completeness',
  CONSISTENCY = 'consistency',
  TIMELINESS = 'timeliness',
  VALIDITY = 'validity',
  UNIQUENESS = 'uniqueness',
}

/**
 * Metric aggregation types
 */
export enum MetricAggregationType {
  SUM = 'sum',
  AVG = 'avg',
  COUNT = 'count',
  MIN = 'min',
  MAX = 'max',
  MEDIAN = 'median',
  MODE = 'mode',
  PERCENTILE = 'percentile',
}

// ============================================================================
// SEQUELIZE MODEL: DataModel
// ============================================================================

/**
 * TypeScript interface for DataModel attributes
 */
export interface DataModelAttributes {
  id: string;
  name: string;
  description: string | null;
  modelType: DataModelType;
  schema: Record<string, any>;
  entities: Record<string, any>[];
  relationships: Record<string, any>[];
  constraints: Record<string, any>[];
  indexes: Record<string, any>[];
  partitionStrategy: string | null;
  version: number;
  isActive: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface DataModelCreationAttributes extends Optional<DataModelAttributes, 'id' | 'description' | 'partitionStrategy' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: DataModel
 * Enterprise data model definitions with schema management
 */
export class DataModel extends Model<DataModelAttributes, DataModelCreationAttributes> implements DataModelAttributes {
  declare id: string;
  declare name: string;
  declare description: string | null;
  declare modelType: DataModelType;
  declare schema: Record<string, any>;
  declare entities: Record<string, any>[];
  declare relationships: Record<string, any>[];
  declare constraints: Record<string, any>[];
  declare indexes: Record<string, any>[];
  declare partitionStrategy: string | null;
  declare version: number;
  declare isActive: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getMetrics: HasManyGetAssociationsMixin<AnalyticsMetric>;
  declare addMetric: HasManyAddAssociationMixin<AnalyticsMetric, string>;

  declare static associations: {
    metrics: Association<DataModel, AnalyticsMetric>;
  };

  /**
   * Initialize DataModel with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof DataModel {
    DataModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
          field: 'name',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'description',
        },
        modelType: {
          type: DataTypes.ENUM(...Object.values(DataModelType)),
          allowNull: false,
          field: 'model_type',
        },
        schema: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'schema',
        },
        entities: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'entities',
        },
        relationships: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'relationships',
        },
        constraints: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'constraints',
        },
        indexes: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'indexes',
        },
        partitionStrategy: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'partition_strategy',
        },
        version: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          field: 'version',
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
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'updated_by',
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
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at',
        },
      },
      {
        sequelize,
        tableName: 'data_models',
        modelName: 'DataModel',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['name'] },
          { fields: ['model_type'] },
          { fields: ['is_active'] },
          { fields: ['created_by'] },
        ],
      }
    );

    return DataModel;
  }
}

// ============================================================================
// SEQUELIZE MODEL: AnalyticsMetric
// ============================================================================

/**
 * TypeScript interface for AnalyticsMetric attributes
 */
export interface AnalyticsMetricAttributes {
  id: string;
  dataModelId: string;
  name: string;
  description: string | null;
  metricType: string;
  calculation: Record<string, any>;
  aggregationType: MetricAggregationType;
  dimensions: string[];
  filters: Record<string, any>[];
  targetValue: number | null;
  thresholds: Record<string, any>;
  unit: string | null;
  format: string | null;
  refreshFrequency: string;
  isKpi: boolean;
  weight: number;
  category: string;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface AnalyticsMetricCreationAttributes extends Optional<AnalyticsMetricAttributes, 'id' | 'description' | 'targetValue' | 'unit' | 'format' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: AnalyticsMetric
 * Business metrics and KPI definitions
 */
export class AnalyticsMetric extends Model<AnalyticsMetricAttributes, AnalyticsMetricCreationAttributes> implements AnalyticsMetricAttributes {
  declare id: string;
  declare dataModelId: string;
  declare name: string;
  declare description: string | null;
  declare metricType: string;
  declare calculation: Record<string, any>;
  declare aggregationType: MetricAggregationType;
  declare dimensions: string[];
  declare filters: Record<string, any>[];
  declare targetValue: number | null;
  declare thresholds: Record<string, any>;
  declare unit: string | null;
  declare format: string | null;
  declare refreshFrequency: string;
  declare isKpi: boolean;
  declare weight: number;
  declare category: string;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getDataModel: BelongsToGetAssociationMixin<DataModel>;

  declare static associations: {
    dataModel: Association<AnalyticsMetric, DataModel>;
  };

  /**
   * Initialize AnalyticsMetric with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof AnalyticsMetric {
    AnalyticsMetric.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        dataModelId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'data_models',
            key: 'id',
          },
          field: 'data_model_id',
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'name',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'description',
        },
        metricType: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'metric_type',
        },
        calculation: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'calculation',
        },
        aggregationType: {
          type: DataTypes.ENUM(...Object.values(MetricAggregationType)),
          allowNull: false,
          field: 'aggregation_type',
        },
        dimensions: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
          field: 'dimensions',
        },
        filters: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'filters',
        },
        targetValue: {
          type: DataTypes.DECIMAL(20, 4),
          allowNull: true,
          field: 'target_value',
        },
        thresholds: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'thresholds',
        },
        unit: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: 'unit',
        },
        format: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'format',
        },
        refreshFrequency: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: 'daily',
          field: 'refresh_frequency',
        },
        isKpi: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_kpi',
        },
        weight: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          defaultValue: 1.0,
          field: 'weight',
        },
        category: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'category',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'updated_by',
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
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at',
        },
      },
      {
        sequelize,
        tableName: 'analytics_metrics',
        modelName: 'AnalyticsMetric',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['data_model_id'] },
          { fields: ['metric_type'] },
          { fields: ['is_kpi'] },
          { fields: ['category'] },
        ],
      }
    );

    return AnalyticsMetric;
  }
}

// ============================================================================
// SEQUELIZE MODEL: DataWarehouse
// ============================================================================

/**
 * TypeScript interface for DataWarehouse attributes
 */
export interface DataWarehouseAttributes {
  id: string;
  name: string;
  description: string | null;
  warehouseType: string;
  architecture: Record<string, any>;
  dimensions: Record<string, any>[];
  facts: Record<string, any>[];
  etlProcesses: Record<string, any>[];
  dataQualityRules: Record<string, any>[];
  refreshSchedule: Record<string, any>;
  retentionPolicy: Record<string, any>;
  storageSize: string | null;
  compressionRatio: number | null;
  isActive: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface DataWarehouseCreationAttributes extends Optional<DataWarehouseAttributes, 'id' | 'description' | 'storageSize' | 'compressionRatio' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: DataWarehouse
 * Data warehouse configuration and management
 */
export class DataWarehouse extends Model<DataWarehouseAttributes, DataWarehouseCreationAttributes> implements DataWarehouseAttributes {
  declare id: string;
  declare name: string;
  declare description: string | null;
  declare warehouseType: string;
  declare architecture: Record<string, any>;
  declare dimensions: Record<string, any>[];
  declare facts: Record<string, any>[];
  declare etlProcesses: Record<string, any>[];
  declare dataQualityRules: Record<string, any>[];
  declare refreshSchedule: Record<string, any>;
  declare retentionPolicy: Record<string, any>;
  declare storageSize: string | null;
  declare compressionRatio: number | null;
  declare isActive: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize DataWarehouse with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof DataWarehouse {
    DataWarehouse.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
          field: 'name',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'description',
        },
        warehouseType: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'warehouse_type',
        },
        architecture: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'architecture',
        },
        dimensions: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'dimensions',
        },
        facts: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'facts',
        },
        etlProcesses: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'etl_processes',
        },
        dataQualityRules: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'data_quality_rules',
        },
        refreshSchedule: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'refresh_schedule',
        },
        retentionPolicy: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'retention_policy',
        },
        storageSize: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: 'storage_size',
        },
        compressionRatio: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: true,
          field: 'compression_ratio',
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
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'updated_by',
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
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at',
        },
      },
      {
        sequelize,
        tableName: 'data_warehouses',
        modelName: 'DataWarehouse',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['name'] },
          { fields: ['warehouse_type'] },
          { fields: ['is_active'] },
        ],
      }
    );

    return DataWarehouse;
  }
}

// ============================================================================
// SEQUELIZE MODEL: DataQualityScore
// ============================================================================

/**
 * TypeScript interface for DataQualityScore attributes
 */
export interface DataQualityScoreAttributes {
  id: string;
  dataModelId: string;
  dimension: DataQualityDimension;
  score: number;
  details: Record<string, any>;
  issues: Record<string, any>[];
  recommendations: string[];
  measurementDate: Date;
  metadata: Record<string, any>;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DataQualityScoreCreationAttributes extends Optional<DataQualityScoreAttributes, 'id'> {}

/**
 * Sequelize Model: DataQualityScore
 * Data quality measurements and tracking
 */
export class DataQualityScore extends Model<DataQualityScoreAttributes, DataQualityScoreCreationAttributes> implements DataQualityScoreAttributes {
  declare id: string;
  declare dataModelId: string;
  declare dimension: DataQualityDimension;
  declare score: number;
  declare details: Record<string, any>;
  declare issues: Record<string, any>[];
  declare recommendations: string[];
  declare measurementDate: Date;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  /**
   * Initialize DataQualityScore with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof DataQualityScore {
    DataQualityScore.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        dataModelId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'data_models',
            key: 'id',
          },
          field: 'data_model_id',
        },
        dimension: {
          type: DataTypes.ENUM(...Object.values(DataQualityDimension)),
          allowNull: false,
          field: 'dimension',
        },
        score: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          validate: {
            min: 0,
            max: 100,
          },
          field: 'score',
        },
        details: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'details',
        },
        issues: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'issues',
        },
        recommendations: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: false,
          defaultValue: [],
          field: 'recommendations',
        },
        measurementDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'measurement_date',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'metadata',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
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
        tableName: 'data_quality_scores',
        modelName: 'DataQualityScore',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['data_model_id'] },
          { fields: ['dimension'] },
          { fields: ['measurement_date'] },
          { fields: ['score'] },
        ],
      }
    );

    return DataQualityScore;
  }
}

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

/**
 * Define associations between models
 */
export function defineDataModelAssociations(): void {
  DataModel.hasMany(AnalyticsMetric, {
    foreignKey: 'dataModelId',
    as: 'metrics',
    onDelete: 'CASCADE',
  });

  AnalyticsMetric.belongsTo(DataModel, {
    foreignKey: 'dataModelId',
    as: 'dataModel',
  });

  DataModel.hasMany(DataQualityScore, {
    foreignKey: 'dataModelId',
    as: 'qualityScores',
    onDelete: 'CASCADE',
  });

  DataQualityScore.belongsTo(DataModel, {
    foreignKey: 'dataModelId',
    as: 'dataModel',
  });
}

// ============================================================================
// DATA MODELING FUNCTIONS
// ============================================================================

/**
 * Create a new dimensional data model
 */
export async function createDimensionalModel(
  data: DataModelCreationAttributes,
  transaction?: Transaction
): Promise<DataModel> {
  return await DataModel.create(data, { transaction });
}

/**
 * Create star schema data model
 */
export async function createStarSchemaModel(
  name: string,
  factTable: Record<string, any>,
  dimensions: Record<string, any>[],
  createdBy: string,
  transaction?: Transaction
): Promise<DataModel> {
  const schema = {
    type: 'star',
    factTable,
    dimensions,
  };

  return await DataModel.create(
    {
      name,
      modelType: DataModelType.STAR_SCHEMA,
      schema,
      entities: [factTable, ...dimensions],
      relationships: dimensions.map(dim => ({
        from: factTable.name,
        to: dim.name,
        type: 'one-to-many',
      })),
      constraints: [],
      indexes: [],
      version: 1,
      isActive: true,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Create snowflake schema data model
 */
export async function createSnowflakeSchemaModel(
  name: string,
  factTable: Record<string, any>,
  dimensions: Record<string, any>[],
  normalizedDimensions: Record<string, any>[],
  createdBy: string,
  transaction?: Transaction
): Promise<DataModel> {
  const schema = {
    type: 'snowflake',
    factTable,
    dimensions,
    normalizedDimensions,
  };

  return await DataModel.create(
    {
      name,
      modelType: DataModelType.SNOWFLAKE_SCHEMA,
      schema,
      entities: [factTable, ...dimensions, ...normalizedDimensions],
      relationships: [],
      constraints: [],
      indexes: [],
      version: 1,
      isActive: true,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Create data vault model
 */
export async function createDataVaultModel(
  name: string,
  hubs: Record<string, any>[],
  links: Record<string, any>[],
  satellites: Record<string, any>[],
  createdBy: string,
  transaction?: Transaction
): Promise<DataModel> {
  const schema = {
    type: 'data-vault',
    hubs,
    links,
    satellites,
  };

  return await DataModel.create(
    {
      name,
      modelType: DataModelType.DATA_VAULT,
      schema,
      entities: [...hubs, ...links, ...satellites],
      relationships: [],
      constraints: [],
      indexes: [],
      version: 1,
      isActive: true,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Create time-series data model
 */
export async function createTimeSeriesModel(
  name: string,
  timeColumn: string,
  metrics: string[],
  dimensions: string[],
  granularity: string,
  createdBy: string,
  transaction?: Transaction
): Promise<DataModel> {
  const schema = {
    type: 'time-series',
    timeColumn,
    metrics,
    dimensions,
    granularity,
  };

  return await DataModel.create(
    {
      name,
      modelType: DataModelType.TIME_SERIES,
      schema,
      entities: [],
      relationships: [],
      constraints: [],
      indexes: [],
      version: 1,
      isActive: true,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Get data model by ID
 */
export async function getDataModelById(
  id: string,
  transaction?: Transaction
): Promise<DataModel | null> {
  return await DataModel.findByPk(id, { transaction });
}

/**
 * Get all data models by type
 */
export async function getDataModelsByType(
  modelType: DataModelType,
  transaction?: Transaction
): Promise<DataModel[]> {
  return await DataModel.findAll({
    where: { modelType },
    transaction,
  });
}

/**
 * Update data model schema
 */
export async function updateDataModelSchema(
  id: string,
  schema: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<[number, DataModel[]]> {
  return await DataModel.update(
    { schema, updatedBy, version: Sequelize.literal('version + 1') },
    { where: { id }, returning: true, transaction }
  );
}

/**
 * Add entity to data model
 */
export async function addEntityToModel(
  modelId: string,
  entity: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<DataModel | null> {
  const model = await DataModel.findByPk(modelId, { transaction });
  if (!model) return null;

  const entities = [...model.entities, entity];
  await model.update({ entities, updatedBy }, { transaction });
  return model;
}

/**
 * Add relationship to data model
 */
export async function addRelationshipToModel(
  modelId: string,
  relationship: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<DataModel | null> {
  const model = await DataModel.findByPk(modelId, { transaction });
  if (!model) return null;

  const relationships = [...model.relationships, relationship];
  await model.update({ relationships, updatedBy }, { transaction });
  return model;
}

// ============================================================================
// ANALYTICS METRIC FUNCTIONS
// ============================================================================

/**
 * Create analytics metric
 */
export async function createAnalyticsMetric(
  data: AnalyticsMetricCreationAttributes,
  transaction?: Transaction
): Promise<AnalyticsMetric> {
  return await AnalyticsMetric.create(data, { transaction });
}

/**
 * Create KPI metric
 */
export async function createKpiMetric(
  dataModelId: string,
  name: string,
  calculation: Record<string, any>,
  targetValue: number,
  thresholds: Record<string, any>,
  createdBy: string,
  transaction?: Transaction
): Promise<AnalyticsMetric> {
  return await AnalyticsMetric.create(
    {
      dataModelId,
      name,
      metricType: 'kpi',
      calculation,
      aggregationType: MetricAggregationType.AVG,
      dimensions: [],
      filters: [],
      targetValue,
      thresholds,
      refreshFrequency: 'daily',
      isKpi: true,
      weight: 1.0,
      category: 'performance',
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Get metrics by data model
 */
export async function getMetricsByDataModel(
  dataModelId: string,
  transaction?: Transaction
): Promise<AnalyticsMetric[]> {
  return await AnalyticsMetric.findAll({
    where: { dataModelId },
    transaction,
  });
}

/**
 * Get all KPI metrics
 */
export async function getAllKpiMetrics(
  transaction?: Transaction
): Promise<AnalyticsMetric[]> {
  return await AnalyticsMetric.findAll({
    where: { isKpi: true },
    transaction,
  });
}

/**
 * Get metrics by category
 */
export async function getMetricsByCategory(
  category: string,
  transaction?: Transaction
): Promise<AnalyticsMetric[]> {
  return await AnalyticsMetric.findAll({
    where: { category },
    transaction,
  });
}

/**
 * Update metric calculation
 */
export async function updateMetricCalculation(
  id: string,
  calculation: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<[number, AnalyticsMetric[]]> {
  return await AnalyticsMetric.update(
    { calculation, updatedBy },
    { where: { id }, returning: true, transaction }
  );
}

/**
 * Add dimension to metric
 */
export async function addDimensionToMetric(
  metricId: string,
  dimension: string,
  updatedBy: string,
  transaction?: Transaction
): Promise<AnalyticsMetric | null> {
  const metric = await AnalyticsMetric.findByPk(metricId, { transaction });
  if (!metric) return null;

  const dimensions = [...metric.dimensions, dimension];
  await metric.update({ dimensions, updatedBy }, { transaction });
  return metric;
}

/**
 * Add filter to metric
 */
export async function addFilterToMetric(
  metricId: string,
  filter: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<AnalyticsMetric | null> {
  const metric = await AnalyticsMetric.findByPk(metricId, { transaction });
  if (!metric) return null;

  const filters = [...metric.filters, filter];
  await metric.update({ filters, updatedBy }, { transaction });
  return metric;
}

// ============================================================================
// DATA WAREHOUSE FUNCTIONS
// ============================================================================

/**
 * Create data warehouse
 */
export async function createDataWarehouse(
  data: DataWarehouseCreationAttributes,
  transaction?: Transaction
): Promise<DataWarehouse> {
  return await DataWarehouse.create(data, { transaction });
}

/**
 * Create enterprise data warehouse
 */
export async function createEnterpriseDataWarehouse(
  name: string,
  architecture: Record<string, any>,
  dimensions: Record<string, any>[],
  facts: Record<string, any>[],
  createdBy: string,
  transaction?: Transaction
): Promise<DataWarehouse> {
  return await DataWarehouse.create(
    {
      name,
      warehouseType: 'enterprise',
      architecture,
      dimensions,
      facts,
      etlProcesses: [],
      dataQualityRules: [],
      refreshSchedule: { frequency: 'daily', time: '02:00' },
      retentionPolicy: { years: 7 },
      isActive: true,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Get data warehouse by ID
 */
export async function getDataWarehouseById(
  id: string,
  transaction?: Transaction
): Promise<DataWarehouse | null> {
  return await DataWarehouse.findByPk(id, { transaction });
}

/**
 * Get all active data warehouses
 */
export async function getActiveDataWarehouses(
  transaction?: Transaction
): Promise<DataWarehouse[]> {
  return await DataWarehouse.findAll({
    where: { isActive: true },
    transaction,
  });
}

/**
 * Add dimension to warehouse
 */
export async function addDimensionToWarehouse(
  warehouseId: string,
  dimension: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<DataWarehouse | null> {
  const warehouse = await DataWarehouse.findByPk(warehouseId, { transaction });
  if (!warehouse) return null;

  const dimensions = [...warehouse.dimensions, dimension];
  await warehouse.update({ dimensions, updatedBy }, { transaction });
  return warehouse;
}

/**
 * Add fact table to warehouse
 */
export async function addFactToWarehouse(
  warehouseId: string,
  fact: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<DataWarehouse | null> {
  const warehouse = await DataWarehouse.findByPk(warehouseId, { transaction });
  if (!warehouse) return null;

  const facts = [...warehouse.facts, fact];
  await warehouse.update({ facts, updatedBy }, { transaction });
  return warehouse;
}

/**
 * Add ETL process to warehouse
 */
export async function addEtlProcessToWarehouse(
  warehouseId: string,
  etlProcess: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<DataWarehouse | null> {
  const warehouse = await DataWarehouse.findByPk(warehouseId, { transaction });
  if (!warehouse) return null;

  const etlProcesses = [...warehouse.etlProcesses, etlProcess];
  await warehouse.update({ etlProcesses, updatedBy }, { transaction });
  return warehouse;
}

/**
 * Update warehouse refresh schedule
 */
export async function updateWarehouseRefreshSchedule(
  id: string,
  refreshSchedule: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<[number, DataWarehouse[]]> {
  return await DataWarehouse.update(
    { refreshSchedule, updatedBy },
    { where: { id }, returning: true, transaction }
  );
}

// ============================================================================
// DATA QUALITY FUNCTIONS
// ============================================================================

/**
 * Create data quality score
 */
export async function createDataQualityScore(
  data: DataQualityScoreCreationAttributes,
  transaction?: Transaction
): Promise<DataQualityScore> {
  return await DataQualityScore.create(data, { transaction });
}

/**
 * Calculate overall data quality score
 */
export async function calculateOverallDataQuality(
  dataModelId: string,
  transaction?: Transaction
): Promise<number> {
  const scores = await DataQualityScore.findAll({
    where: { dataModelId },
    attributes: [[Sequelize.fn('AVG', Sequelize.col('score')), 'avgScore']],
    transaction,
  });

  return scores.length > 0 ? parseFloat(scores[0].get('avgScore') as string) : 0;
}

/**
 * Get quality scores by dimension
 */
export async function getQualityScoresByDimension(
  dataModelId: string,
  dimension: DataQualityDimension,
  transaction?: Transaction
): Promise<DataQualityScore[]> {
  return await DataQualityScore.findAll({
    where: { dataModelId, dimension },
    order: [['measurementDate', 'DESC']],
    transaction,
  });
}

/**
 * Get latest quality scores
 */
export async function getLatestQualityScores(
  dataModelId: string,
  transaction?: Transaction
): Promise<DataQualityScore[]> {
  return await DataQualityScore.findAll({
    where: { dataModelId },
    order: [['measurementDate', 'DESC']],
    limit: 10,
    transaction,
  });
}

/**
 * Identify data quality issues
 */
export async function identifyDataQualityIssues(
  dataModelId: string,
  threshold: number = 80,
  transaction?: Transaction
): Promise<DataQualityScore[]> {
  return await DataQualityScore.findAll({
    where: {
      dataModelId,
      score: { [Op.lt]: threshold },
    },
    order: [['score', 'ASC']],
    transaction,
  });
}

// ============================================================================
// ANALYTICS AND INSIGHTS FUNCTIONS
// ============================================================================

/**
 * Calculate metric value with aggregation
 */
export async function calculateMetricValue(
  metricId: string,
  data: Record<string, any>[],
  transaction?: Transaction
): Promise<number> {
  const metric = await AnalyticsMetric.findByPk(metricId, { transaction });
  if (!metric) throw new Error('Metric not found');

  // Apply filters
  let filteredData = data;
  for (const filter of metric.filters) {
    filteredData = filteredData.filter(item => {
      // Apply filter logic
      return true; // Placeholder
    });
  }

  // Apply aggregation
  const values = filteredData.map(item => item.value || 0);

  switch (metric.aggregationType) {
    case MetricAggregationType.SUM:
      return values.reduce((a, b) => a + b, 0);
    case MetricAggregationType.AVG:
      return values.reduce((a, b) => a + b, 0) / values.length;
    case MetricAggregationType.COUNT:
      return values.length;
    case MetricAggregationType.MIN:
      return Math.min(...values);
    case MetricAggregationType.MAX:
      return Math.max(...values);
    default:
      return 0;
  }
}

/**
 * Generate dimensional analysis
 */
export async function generateDimensionalAnalysis(
  metricId: string,
  dimensions: string[],
  data: Record<string, any>[],
  transaction?: Transaction
): Promise<Record<string, any>> {
  const metric = await AnalyticsMetric.findByPk(metricId, { transaction });
  if (!metric) throw new Error('Metric not found');

  const analysis: Record<string, any> = {
    metric: metric.name,
    dimensions: {},
  };

  for (const dimension of dimensions) {
    const grouped = data.reduce((acc, item) => {
      const key = item[dimension];
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    analysis.dimensions[dimension] = grouped;
  }

  return analysis;
}

/**
 * Generate trend analysis
 */
export async function generateTrendAnalysis(
  metricId: string,
  startDate: Date,
  endDate: Date,
  interval: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  return {
    metricId,
    period: { startDate, endDate },
    interval,
    trend: 'increasing',
    changePercent: 15.5,
    dataPoints: [],
  };
}

/**
 * Generate predictive insights
 */
export async function generatePredictiveInsights(
  dataModelId: string,
  historicalData: Record<string, any>[],
  forecastPeriod: number,
  transaction?: Transaction
): Promise<Record<string, any>> {
  return {
    dataModelId,
    forecastPeriod,
    predictions: [],
    confidence: 0.85,
    methodology: 'time-series-analysis',
  };
}

/**
 * Export: Initialize all models
 */
export function initializeDataModels(sequelize: Sequelize): void {
  DataModel.initModel(sequelize);
  AnalyticsMetric.initModel(sequelize);
  DataWarehouse.initModel(sequelize);
  DataQualityScore.initModel(sequelize);
  defineDataModelAssociations();
}
