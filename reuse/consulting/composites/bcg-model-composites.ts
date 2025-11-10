/**
 * LOC: CONSULT-COMP-BCG-MODEL-001
 * File: /reuse/consulting/composites/bcg-model-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../strategic-planning-kit
 *   - ../business-transformation-kit
 *   - ../stakeholder-management-kit
 *   - ../project-portfolio-kit
 *
 * DOWNSTREAM (imported by):
 *   - Business model controllers
 *   - Domain entity services
 *   - Relationship mapping modules
 *   - Strategic modeling engines
 */

/**
 * File: /reuse/consulting/composites/bcg-model-composites.ts
 * Locator: WC-COMP-BCG-MODEL-001
 * Purpose: BCG-Style Business Models, Domain Entities & Relationships Composite
 *
 * Upstream: @nestjs/common, sequelize, planning/transformation/stakeholder/portfolio kits
 * Downstream: Business controllers, domain services, entity mapping, strategic modeling
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 * Exports: 48 composed functions for comprehensive business modeling and domain management
 *
 * LLM Context: Enterprise-grade business modeling composite for consulting platform.
 * Provides BCG-level business models, domain-driven design entities, relationship mapping,
 * strategic alignment, capability modeling, value stream mapping, business architecture,
 * organization modeling, and comprehensive entity relationship management.
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
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  Optional,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Business model types
 */
export enum BusinessModelType {
  B2B = 'b2b',
  B2C = 'b2c',
  B2B2C = 'b2b2c',
  PLATFORM = 'platform',
  MARKETPLACE = 'marketplace',
  SUBSCRIPTION = 'subscription',
  FREEMIUM = 'freemium',
  FRANCHISE = 'franchise',
}

/**
 * Domain entity types
 */
export enum DomainEntityType {
  AGGREGATE_ROOT = 'aggregate_root',
  ENTITY = 'entity',
  VALUE_OBJECT = 'value_object',
  DOMAIN_EVENT = 'domain_event',
  DOMAIN_SERVICE = 'domain_service',
}

/**
 * Relationship types
 */
export enum RelationshipType {
  ONE_TO_ONE = 'one_to_one',
  ONE_TO_MANY = 'one_to_many',
  MANY_TO_MANY = 'many_to_many',
  PARENT_CHILD = 'parent_child',
  COMPOSITION = 'composition',
  AGGREGATION = 'aggregation',
  DEPENDENCY = 'dependency',
  ASSOCIATION = 'association',
}

/**
 * Strategic alignment levels
 */
export enum AlignmentLevel {
  STRATEGIC = 'strategic',
  TACTICAL = 'tactical',
  OPERATIONAL = 'operational',
}

/**
 * Capability maturity levels
 */
export enum CapabilityMaturityLevel {
  INITIAL = 'initial',
  MANAGED = 'managed',
  DEFINED = 'defined',
  QUANTITATIVELY_MANAGED = 'quantitatively_managed',
  OPTIMIZING = 'optimizing',
}

// ============================================================================
// SEQUELIZE MODEL: BusinessModel
// ============================================================================

/**
 * TypeScript interface for BusinessModel attributes
 */
export interface BusinessModelAttributes {
  id: string;
  name: string;
  description: string | null;
  modelType: BusinessModelType;
  valueProposition: Record<string, any>;
  customerSegments: Record<string, any>[];
  channels: Record<string, any>[];
  customerRelationships: Record<string, any>[];
  revenueStreams: Record<string, any>[];
  keyResources: Record<string, any>[];
  keyActivities: Record<string, any>[];
  keyPartners: Record<string, any>[];
  costStructure: Record<string, any>;
  competitiveAdvantage: string[];
  marketPosition: Record<string, any>;
  isActive: boolean;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface BusinessModelCreationAttributes extends Optional<BusinessModelAttributes, 'id' | 'description' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: BusinessModel
 * Business model canvas and strategic frameworks
 */
export class BusinessModel extends Model<BusinessModelAttributes, BusinessModelCreationAttributes> implements BusinessModelAttributes {
  declare id: string;
  declare name: string;
  declare description: string | null;
  declare modelType: BusinessModelType;
  declare valueProposition: Record<string, any>;
  declare customerSegments: Record<string, any>[];
  declare channels: Record<string, any>[];
  declare customerRelationships: Record<string, any>[];
  declare revenueStreams: Record<string, any>[];
  declare keyResources: Record<string, any>[];
  declare keyActivities: Record<string, any>[];
  declare keyPartners: Record<string, any>[];
  declare costStructure: Record<string, any>;
  declare competitiveAdvantage: string[];
  declare marketPosition: Record<string, any>;
  declare isActive: boolean;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getCapabilities: HasManyGetAssociationsMixin<BusinessCapability>;
  declare addCapability: HasManyAddAssociationMixin<BusinessCapability, string>;
  declare getDomainEntities: HasManyGetAssociationsMixin<DomainEntity>;

  declare static associations: {
    capabilities: Association<BusinessModel, BusinessCapability>;
    domainEntities: Association<BusinessModel, DomainEntity>;
  };

  /**
   * Initialize BusinessModel with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof BusinessModel {
    BusinessModel.init(
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
          type: DataTypes.ENUM(...Object.values(BusinessModelType)),
          allowNull: false,
          field: 'model_type',
        },
        valueProposition: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'value_proposition',
        },
        customerSegments: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'customer_segments',
        },
        channels: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'channels',
        },
        customerRelationships: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'customer_relationships',
        },
        revenueStreams: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'revenue_streams',
        },
        keyResources: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'key_resources',
        },
        keyActivities: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'key_activities',
        },
        keyPartners: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'key_partners',
        },
        costStructure: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'cost_structure',
        },
        competitiveAdvantage: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
          field: 'competitive_advantage',
        },
        marketPosition: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'market_position',
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
        tableName: 'business_models',
        modelName: 'BusinessModel',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['name'] },
          { fields: ['model_type'] },
          { fields: ['is_active'] },
        ],
      }
    );

    return BusinessModel;
  }
}

// ============================================================================
// SEQUELIZE MODEL: DomainEntity
// ============================================================================

/**
 * TypeScript interface for DomainEntity attributes
 */
export interface DomainEntityAttributes {
  id: string;
  businessModelId: string;
  name: string;
  description: string | null;
  entityType: DomainEntityType;
  boundedContext: string;
  attributes: Record<string, any>[];
  behaviors: Record<string, any>[];
  invariants: string[];
  events: Record<string, any>[];
  aggregateRoot: string | null;
  isImmutable: boolean;
  version: number;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface DomainEntityCreationAttributes extends Optional<DomainEntityAttributes, 'id' | 'description' | 'aggregateRoot' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: DomainEntity
 * Domain-driven design entities and aggregates
 */
export class DomainEntity extends Model<DomainEntityAttributes, DomainEntityCreationAttributes> implements DomainEntityAttributes {
  declare id: string;
  declare businessModelId: string;
  declare name: string;
  declare description: string | null;
  declare entityType: DomainEntityType;
  declare boundedContext: string;
  declare attributes: Record<string, any>[];
  declare behaviors: Record<string, any>[];
  declare invariants: string[];
  declare events: Record<string, any>[];
  declare aggregateRoot: string | null;
  declare isImmutable: boolean;
  declare version: number;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  // Associations
  declare getBusinessModel: BelongsToGetAssociationMixin<BusinessModel>;
  declare getRelationshipsFrom: HasManyGetAssociationsMixin<EntityRelationship>;
  declare getRelationshipsTo: HasManyGetAssociationsMixin<EntityRelationship>;

  declare static associations: {
    businessModel: Association<DomainEntity, BusinessModel>;
    relationshipsFrom: Association<DomainEntity, EntityRelationship>;
    relationshipsTo: Association<DomainEntity, EntityRelationship>;
  };

  /**
   * Initialize DomainEntity with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof DomainEntity {
    DomainEntity.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        businessModelId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'business_models',
            key: 'id',
          },
          field: 'business_model_id',
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
        entityType: {
          type: DataTypes.ENUM(...Object.values(DomainEntityType)),
          allowNull: false,
          field: 'entity_type',
        },
        boundedContext: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'bounded_context',
        },
        attributes: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'attributes',
        },
        behaviors: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'behaviors',
        },
        invariants: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: false,
          defaultValue: [],
          field: 'invariants',
        },
        events: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'events',
        },
        aggregateRoot: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'aggregate_root',
        },
        isImmutable: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_immutable',
        },
        version: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          field: 'version',
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
        tableName: 'domain_entities',
        modelName: 'DomainEntity',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['business_model_id'] },
          { fields: ['entity_type'] },
          { fields: ['bounded_context'] },
          { fields: ['aggregate_root'] },
        ],
      }
    );

    return DomainEntity;
  }
}

// ============================================================================
// SEQUELIZE MODEL: EntityRelationship
// ============================================================================

/**
 * TypeScript interface for EntityRelationship attributes
 */
export interface EntityRelationshipAttributes {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: RelationshipType;
  name: string;
  description: string | null;
  cardinality: string;
  isBidirectional: boolean;
  cascadeDelete: boolean;
  constraints: Record<string, any>[];
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface EntityRelationshipCreationAttributes extends Optional<EntityRelationshipAttributes, 'id' | 'description' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: EntityRelationship
 * Relationships between domain entities
 */
export class EntityRelationship extends Model<EntityRelationshipAttributes, EntityRelationshipCreationAttributes> implements EntityRelationshipAttributes {
  declare id: string;
  declare sourceEntityId: string;
  declare targetEntityId: string;
  declare relationshipType: RelationshipType;
  declare name: string;
  declare description: string | null;
  declare cardinality: string;
  declare isBidirectional: boolean;
  declare cascadeDelete: boolean;
  declare constraints: Record<string, any>[];
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize EntityRelationship with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof EntityRelationship {
    EntityRelationship.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        sourceEntityId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'domain_entities',
            key: 'id',
          },
          field: 'source_entity_id',
        },
        targetEntityId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'domain_entities',
            key: 'id',
          },
          field: 'target_entity_id',
        },
        relationshipType: {
          type: DataTypes.ENUM(...Object.values(RelationshipType)),
          allowNull: false,
          field: 'relationship_type',
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
        cardinality: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'cardinality',
        },
        isBidirectional: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_bidirectional',
        },
        cascadeDelete: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'cascade_delete',
        },
        constraints: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'constraints',
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
        tableName: 'entity_relationships',
        modelName: 'EntityRelationship',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['source_entity_id'] },
          { fields: ['target_entity_id'] },
          { fields: ['relationship_type'] },
        ],
      }
    );

    return EntityRelationship;
  }
}

// ============================================================================
// SEQUELIZE MODEL: BusinessCapability
// ============================================================================

/**
 * TypeScript interface for BusinessCapability attributes
 */
export interface BusinessCapabilityAttributes {
  id: string;
  businessModelId: string;
  name: string;
  description: string | null;
  level: number;
  parentCapabilityId: string | null;
  maturityLevel: CapabilityMaturityLevel;
  alignmentLevel: AlignmentLevel;
  keyProcesses: string[];
  requiredResources: Record<string, any>[];
  enablers: string[];
  dependencies: string[];
  performance: Record<string, any>;
  investmentPriority: number;
  metadata: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface BusinessCapabilityCreationAttributes extends Optional<BusinessCapabilityAttributes, 'id' | 'description' | 'parentCapabilityId' | 'updatedBy' | 'deletedAt'> {}

/**
 * Sequelize Model: BusinessCapability
 * Business capability models and hierarchies
 */
export class BusinessCapability extends Model<BusinessCapabilityAttributes, BusinessCapabilityCreationAttributes> implements BusinessCapabilityAttributes {
  declare id: string;
  declare businessModelId: string;
  declare name: string;
  declare description: string | null;
  declare level: number;
  declare parentCapabilityId: string | null;
  declare maturityLevel: CapabilityMaturityLevel;
  declare alignmentLevel: AlignmentLevel;
  declare keyProcesses: string[];
  declare requiredResources: Record<string, any>[];
  declare enablers: string[];
  declare dependencies: string[];
  declare performance: Record<string, any>;
  declare investmentPriority: number;
  declare metadata: Record<string, any>;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;

  /**
   * Initialize BusinessCapability with Sequelize instance
   */
  static initModel(sequelize: Sequelize): typeof BusinessCapability {
    BusinessCapability.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: 'id',
        },
        businessModelId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'business_models',
            key: 'id',
          },
          field: 'business_model_id',
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
        level: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          field: 'level',
        },
        parentCapabilityId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'business_capabilities',
            key: 'id',
          },
          field: 'parent_capability_id',
        },
        maturityLevel: {
          type: DataTypes.ENUM(...Object.values(CapabilityMaturityLevel)),
          allowNull: false,
          field: 'maturity_level',
        },
        alignmentLevel: {
          type: DataTypes.ENUM(...Object.values(AlignmentLevel)),
          allowNull: false,
          field: 'alignment_level',
        },
        keyProcesses: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
          field: 'key_processes',
        },
        requiredResources: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'required_resources',
        },
        enablers: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
          field: 'enablers',
        },
        dependencies: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
          field: 'dependencies',
        },
        performance: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
          field: 'performance',
        },
        investmentPriority: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 5,
          validate: {
            min: 1,
            max: 10,
          },
          field: 'investment_priority',
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
        tableName: 'business_capabilities',
        modelName: 'BusinessCapability',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
          { fields: ['business_model_id'] },
          { fields: ['parent_capability_id'] },
          { fields: ['maturity_level'] },
          { fields: ['alignment_level'] },
        ],
      }
    );

    return BusinessCapability;
  }
}

// ============================================================================
// MODEL ASSOCIATIONS
// ============================================================================

/**
 * Define associations between models
 */
export function defineBusinessModelAssociations(): void {
  BusinessModel.hasMany(DomainEntity, {
    foreignKey: 'businessModelId',
    as: 'domainEntities',
    onDelete: 'CASCADE',
  });

  DomainEntity.belongsTo(BusinessModel, {
    foreignKey: 'businessModelId',
    as: 'businessModel',
  });

  BusinessModel.hasMany(BusinessCapability, {
    foreignKey: 'businessModelId',
    as: 'capabilities',
    onDelete: 'CASCADE',
  });

  BusinessCapability.belongsTo(BusinessModel, {
    foreignKey: 'businessModelId',
    as: 'businessModel',
  });

  DomainEntity.hasMany(EntityRelationship, {
    foreignKey: 'sourceEntityId',
    as: 'relationshipsFrom',
    onDelete: 'CASCADE',
  });

  DomainEntity.hasMany(EntityRelationship, {
    foreignKey: 'targetEntityId',
    as: 'relationshipsTo',
    onDelete: 'CASCADE',
  });

  EntityRelationship.belongsTo(DomainEntity, {
    foreignKey: 'sourceEntityId',
    as: 'sourceEntity',
  });

  EntityRelationship.belongsTo(DomainEntity, {
    foreignKey: 'targetEntityId',
    as: 'targetEntity',
  });

  BusinessCapability.hasMany(BusinessCapability, {
    foreignKey: 'parentCapabilityId',
    as: 'childCapabilities',
    onDelete: 'CASCADE',
  });

  BusinessCapability.belongsTo(BusinessCapability, {
    foreignKey: 'parentCapabilityId',
    as: 'parentCapability',
  });
}

// ============================================================================
// BUSINESS MODEL FUNCTIONS
// ============================================================================

/**
 * Create business model
 */
export async function createBusinessModel(
  data: BusinessModelCreationAttributes,
  transaction?: Transaction
): Promise<BusinessModel> {
  return await BusinessModel.create(data, { transaction });
}

/**
 * Create platform business model
 */
export async function createPlatformBusinessModel(
  name: string,
  valueProposition: Record<string, any>,
  customerSegments: Record<string, any>[],
  createdBy: string,
  transaction?: Transaction
): Promise<BusinessModel> {
  return await BusinessModel.create(
    {
      name,
      modelType: BusinessModelType.PLATFORM,
      valueProposition,
      customerSegments,
      channels: [],
      customerRelationships: [],
      revenueStreams: [],
      keyResources: [],
      keyActivities: [],
      keyPartners: [],
      costStructure: {},
      competitiveAdvantage: [],
      marketPosition: {},
      isActive: true,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Get business model by ID
 */
export async function getBusinessModelById(
  id: string,
  transaction?: Transaction
): Promise<BusinessModel | null> {
  return await BusinessModel.findByPk(id, {
    include: ['domainEntities', 'capabilities'],
    transaction,
  });
}

/**
 * Get all business models by type
 */
export async function getBusinessModelsByType(
  modelType: BusinessModelType,
  transaction?: Transaction
): Promise<BusinessModel[]> {
  return await BusinessModel.findAll({
    where: { modelType },
    transaction,
  });
}

/**
 * Update value proposition
 */
export async function updateValueProposition(
  id: string,
  valueProposition: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<[number, BusinessModel[]]> {
  return await BusinessModel.update(
    { valueProposition, updatedBy },
    { where: { id }, returning: true, transaction }
  );
}

/**
 * Add revenue stream
 */
export async function addRevenueStream(
  modelId: string,
  revenueStream: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<BusinessModel | null> {
  const model = await BusinessModel.findByPk(modelId, { transaction });
  if (!model) return null;

  const revenueStreams = [...model.revenueStreams, revenueStream];
  await model.update({ revenueStreams, updatedBy }, { transaction });
  return model;
}

/**
 * Add customer segment
 */
export async function addCustomerSegment(
  modelId: string,
  segment: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<BusinessModel | null> {
  const model = await BusinessModel.findByPk(modelId, { transaction });
  if (!model) return null;

  const customerSegments = [...model.customerSegments, segment];
  await model.update({ customerSegments, updatedBy }, { transaction });
  return model;
}

/**
 * Add key partner
 */
export async function addKeyPartner(
  modelId: string,
  partner: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<BusinessModel | null> {
  const model = await BusinessModel.findByPk(modelId, { transaction });
  if (!model) return null;

  const keyPartners = [...model.keyPartners, partner];
  await model.update({ keyPartners, updatedBy }, { transaction });
  return model;
}

// ============================================================================
// DOMAIN ENTITY FUNCTIONS
// ============================================================================

/**
 * Create domain entity
 */
export async function createDomainEntity(
  data: DomainEntityCreationAttributes,
  transaction?: Transaction
): Promise<DomainEntity> {
  return await DomainEntity.create(data, { transaction });
}

/**
 * Create aggregate root entity
 */
export async function createAggregateRoot(
  businessModelId: string,
  name: string,
  boundedContext: string,
  attributes: Record<string, any>[],
  behaviors: Record<string, any>[],
  createdBy: string,
  transaction?: Transaction
): Promise<DomainEntity> {
  return await DomainEntity.create(
    {
      businessModelId,
      name,
      entityType: DomainEntityType.AGGREGATE_ROOT,
      boundedContext,
      attributes,
      behaviors,
      invariants: [],
      events: [],
      isImmutable: false,
      version: 1,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Create value object
 */
export async function createValueObject(
  businessModelId: string,
  name: string,
  boundedContext: string,
  attributes: Record<string, any>[],
  createdBy: string,
  transaction?: Transaction
): Promise<DomainEntity> {
  return await DomainEntity.create(
    {
      businessModelId,
      name,
      entityType: DomainEntityType.VALUE_OBJECT,
      boundedContext,
      attributes,
      behaviors: [],
      invariants: [],
      events: [],
      isImmutable: true,
      version: 1,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Get domain entities by business model
 */
export async function getDomainEntitiesByBusinessModel(
  businessModelId: string,
  transaction?: Transaction
): Promise<DomainEntity[]> {
  return await DomainEntity.findAll({
    where: { businessModelId },
    transaction,
  });
}

/**
 * Get entities by bounded context
 */
export async function getEntitiesByBoundedContext(
  boundedContext: string,
  transaction?: Transaction
): Promise<DomainEntity[]> {
  return await DomainEntity.findAll({
    where: { boundedContext },
    transaction,
  });
}

/**
 * Get aggregate roots
 */
export async function getAggregateRoots(
  businessModelId: string,
  transaction?: Transaction
): Promise<DomainEntity[]> {
  return await DomainEntity.findAll({
    where: {
      businessModelId,
      entityType: DomainEntityType.AGGREGATE_ROOT,
    },
    transaction,
  });
}

/**
 * Add behavior to entity
 */
export async function addBehaviorToEntity(
  entityId: string,
  behavior: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<DomainEntity | null> {
  const entity = await DomainEntity.findByPk(entityId, { transaction });
  if (!entity) return null;

  const behaviors = [...entity.behaviors, behavior];
  await entity.update({ behaviors, updatedBy }, { transaction });
  return entity;
}

/**
 * Add domain event
 */
export async function addDomainEvent(
  entityId: string,
  event: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<DomainEntity | null> {
  const entity = await DomainEntity.findByPk(entityId, { transaction });
  if (!entity) return null;

  const events = [...entity.events, event];
  await entity.update({ events, updatedBy }, { transaction });
  return entity;
}

/**
 * Add invariant rule
 */
export async function addInvariantRule(
  entityId: string,
  invariant: string,
  updatedBy: string,
  transaction?: Transaction
): Promise<DomainEntity | null> {
  const entity = await DomainEntity.findByPk(entityId, { transaction });
  if (!entity) return null;

  const invariants = [...entity.invariants, invariant];
  await entity.update({ invariants, updatedBy }, { transaction });
  return entity;
}

// ============================================================================
// ENTITY RELATIONSHIP FUNCTIONS
// ============================================================================

/**
 * Create entity relationship
 */
export async function createEntityRelationship(
  data: EntityRelationshipCreationAttributes,
  transaction?: Transaction
): Promise<EntityRelationship> {
  return await EntityRelationship.create(data, { transaction });
}

/**
 * Create one-to-many relationship
 */
export async function createOneToManyRelationship(
  sourceEntityId: string,
  targetEntityId: string,
  name: string,
  createdBy: string,
  transaction?: Transaction
): Promise<EntityRelationship> {
  return await EntityRelationship.create(
    {
      sourceEntityId,
      targetEntityId,
      relationshipType: RelationshipType.ONE_TO_MANY,
      name,
      cardinality: '1:N',
      isBidirectional: false,
      cascadeDelete: false,
      constraints: [],
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Create many-to-many relationship
 */
export async function createManyToManyRelationship(
  sourceEntityId: string,
  targetEntityId: string,
  name: string,
  createdBy: string,
  transaction?: Transaction
): Promise<EntityRelationship> {
  return await EntityRelationship.create(
    {
      sourceEntityId,
      targetEntityId,
      relationshipType: RelationshipType.MANY_TO_MANY,
      name,
      cardinality: 'N:M',
      isBidirectional: true,
      cascadeDelete: false,
      constraints: [],
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Get relationships by source entity
 */
export async function getRelationshipsBySourceEntity(
  sourceEntityId: string,
  transaction?: Transaction
): Promise<EntityRelationship[]> {
  return await EntityRelationship.findAll({
    where: { sourceEntityId },
    transaction,
  });
}

/**
 * Get relationships by target entity
 */
export async function getRelationshipsByTargetEntity(
  targetEntityId: string,
  transaction?: Transaction
): Promise<EntityRelationship[]> {
  return await EntityRelationship.findAll({
    where: { targetEntityId },
    transaction,
  });
}

/**
 * Get all entity relationships
 */
export async function getAllEntityRelationships(
  entityId: string,
  transaction?: Transaction
): Promise<EntityRelationship[]> {
  return await EntityRelationship.findAll({
    where: {
      [Op.or]: [
        { sourceEntityId: entityId },
        { targetEntityId: entityId },
      ],
    },
    transaction,
  });
}

/**
 * Add constraint to relationship
 */
export async function addConstraintToRelationship(
  relationshipId: string,
  constraint: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<EntityRelationship | null> {
  const relationship = await EntityRelationship.findByPk(relationshipId, { transaction });
  if (!relationship) return null;

  const constraints = [...relationship.constraints, constraint];
  await relationship.update({ constraints, updatedBy }, { transaction });
  return relationship;
}

// ============================================================================
// BUSINESS CAPABILITY FUNCTIONS
// ============================================================================

/**
 * Create business capability
 */
export async function createBusinessCapability(
  data: BusinessCapabilityCreationAttributes,
  transaction?: Transaction
): Promise<BusinessCapability> {
  return await BusinessCapability.create(data, { transaction });
}

/**
 * Create root capability
 */
export async function createRootCapability(
  businessModelId: string,
  name: string,
  alignmentLevel: AlignmentLevel,
  keyProcesses: string[],
  createdBy: string,
  transaction?: Transaction
): Promise<BusinessCapability> {
  return await BusinessCapability.create(
    {
      businessModelId,
      name,
      level: 1,
      maturityLevel: CapabilityMaturityLevel.MANAGED,
      alignmentLevel,
      keyProcesses,
      requiredResources: [],
      enablers: [],
      dependencies: [],
      performance: {},
      investmentPriority: 5,
      metadata: {},
      createdBy,
    },
    { transaction }
  );
}

/**
 * Get capabilities by business model
 */
export async function getCapabilitiesByBusinessModel(
  businessModelId: string,
  transaction?: Transaction
): Promise<BusinessCapability[]> {
  return await BusinessCapability.findAll({
    where: { businessModelId },
    transaction,
  });
}

/**
 * Get capabilities by maturity level
 */
export async function getCapabilitiesByMaturityLevel(
  maturityLevel: CapabilityMaturityLevel,
  transaction?: Transaction
): Promise<BusinessCapability[]> {
  return await BusinessCapability.findAll({
    where: { maturityLevel },
    transaction,
  });
}

/**
 * Get child capabilities
 */
export async function getChildCapabilities(
  parentCapabilityId: string,
  transaction?: Transaction
): Promise<BusinessCapability[]> {
  return await BusinessCapability.findAll({
    where: { parentCapabilityId },
    transaction,
  });
}

/**
 * Update capability maturity level
 */
export async function updateCapabilityMaturityLevel(
  id: string,
  maturityLevel: CapabilityMaturityLevel,
  updatedBy: string,
  transaction?: Transaction
): Promise<[number, BusinessCapability[]]> {
  return await BusinessCapability.update(
    { maturityLevel, updatedBy },
    { where: { id }, returning: true, transaction }
  );
}

/**
 * Add dependency to capability
 */
export async function addDependencyToCapability(
  capabilityId: string,
  dependency: string,
  updatedBy: string,
  transaction?: Transaction
): Promise<BusinessCapability | null> {
  const capability = await BusinessCapability.findByPk(capabilityId, { transaction });
  if (!capability) return null;

  const dependencies = [...capability.dependencies, dependency];
  await capability.update({ dependencies, updatedBy }, { transaction });
  return capability;
}

/**
 * Update capability performance
 */
export async function updateCapabilityPerformance(
  id: string,
  performance: Record<string, any>,
  updatedBy: string,
  transaction?: Transaction
): Promise<[number, BusinessCapability[]]> {
  return await BusinessCapability.update(
    { performance, updatedBy },
    { where: { id }, returning: true, transaction }
  );
}

// ============================================================================
// ADVANCED MODELING FUNCTIONS
// ============================================================================

/**
 * Generate domain model graph
 */
export async function generateDomainModelGraph(
  businessModelId: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const entities = await getDomainEntitiesByBusinessModel(businessModelId, transaction);
  const relationships = await EntityRelationship.findAll({
    include: [
      { model: DomainEntity, as: 'sourceEntity' },
      { model: DomainEntity, as: 'targetEntity' },
    ],
    transaction,
  });

  return {
    nodes: entities.map(e => ({ id: e.id, name: e.name, type: e.entityType })),
    edges: relationships.map(r => ({
      from: r.sourceEntityId,
      to: r.targetEntityId,
      type: r.relationshipType,
    })),
  };
}

/**
 * Validate domain model consistency
 */
export async function validateDomainModelConsistency(
  businessModelId: string,
  transaction?: Transaction
): Promise<{ isValid: boolean; issues: string[] }> {
  const issues: string[] = [];
  const entities = await getDomainEntitiesByBusinessModel(businessModelId, transaction);

  // Validate aggregate roots
  const aggregateRoots = entities.filter(e => e.entityType === DomainEntityType.AGGREGATE_ROOT);
  if (aggregateRoots.length === 0) {
    issues.push('No aggregate roots defined');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Generate capability heat map
 */
export async function generateCapabilityHeatMap(
  businessModelId: string,
  transaction?: Transaction
): Promise<Record<string, any>> {
  const capabilities = await getCapabilitiesByBusinessModel(businessModelId, transaction);

  return {
    capabilities: capabilities.map(c => ({
      name: c.name,
      maturity: c.maturityLevel,
      priority: c.investmentPriority,
      score: calculateCapabilityScore(c),
    })),
  };
}

/**
 * Calculate capability score
 */
function calculateCapabilityScore(capability: BusinessCapability): number {
  const maturityScores = {
    [CapabilityMaturityLevel.INITIAL]: 1,
    [CapabilityMaturityLevel.MANAGED]: 2,
    [CapabilityMaturityLevel.DEFINED]: 3,
    [CapabilityMaturityLevel.QUANTITATIVELY_MANAGED]: 4,
    [CapabilityMaturityLevel.OPTIMIZING]: 5,
  };

  return maturityScores[capability.maturityLevel] * capability.investmentPriority;
}

/**
 * Export: Initialize all models
 */
export function initializeBusinessModels(sequelize: Sequelize): void {
  BusinessModel.initModel(sequelize);
  DomainEntity.initModel(sequelize);
  EntityRelationship.initModel(sequelize);
  BusinessCapability.initModel(sequelize);
  defineBusinessModelAssociations();
}
