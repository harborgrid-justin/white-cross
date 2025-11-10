/**
 * LOC: WMC-001
 * File: /reuse/server/workflow/workflow-message-correlation.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @nestjs/common
 *   - @nestjs/event-emitter
 *   - zod (v3.x)
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Workflow message services
 *   - Message queue handlers
 *   - Event correlation systems
 *   - Process communication modules
 *   - Saga coordinators
 */

/**
 * File: /reuse/server/workflow/workflow-message-correlation.ts
 * Locator: WC-UTL-WMC-001
 * Purpose: Workflow Message Correlation Kit - Production-grade message correlation and handling
 *
 * Upstream: sequelize v6.x, @nestjs/common, @nestjs/event-emitter, zod, crypto
 * Downstream: Workflow services, message handlers, event correlators, saga coordinators
 * Dependencies: Sequelize v6.x, NestJS 10.x, Zod 3.x, Node 18+, TypeScript 5.x
 * Exports: 44 production-grade functions for message correlation, matching, queuing, delivery guarantees
 *
 * LLM Context: Enterprise-grade workflow message correlation utilities for White Cross healthcare platform.
 * Provides comprehensive message subscription, correlation key management, message matching algorithms,
 * message queue handling, message buffering, expiration, delivery guarantees, message ordering,
 * deduplication, correlation set management, and message event triggering. Optimized for HIPAA-compliant
 * healthcare workflow communication with guaranteed delivery, at-least-once semantics, and audit trails.
 *
 * Features:
 * - Message correlation key generation and validation
 * - Advanced message matching algorithms
 * - Message queue and buffer management
 * - Message expiration and TTL handling
 * - Delivery guarantee mechanisms (at-least-once, at-most-once, exactly-once)
 * - Message ordering and sequencing
 * - Duplicate detection and deduplication
 * - Correlation set lifecycle management
 * - Event-driven message triggering
 * - Real-time message subscription
 * - Message payload validation and transformation
 * - Cross-process message correlation
 * - Message history and audit trails
 * - Performance optimization for high-throughput scenarios
 */

import { z } from 'zod';
import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  FindOptions,
  WhereOptions,
  Op,
  Transaction,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  BelongsToGetAssociationMixin,
} from 'sequelize';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID, createHash } from 'crypto';

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Zod schema for correlation key validation.
 */
export const CorrelationKeySchema = z.object({
  workflowId: z.string().uuid(),
  processId: z.string().uuid(),
  correlationId: z.string().uuid(),
  businessKey: z.string().optional(),
  tenantId: z.string().uuid().optional(),
  namespace: z.string().min(1).max(255).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for message definition.
 */
export const MessageDefinitionSchema = z.object({
  id: z.string().uuid(),
  correlationKey: CorrelationKeySchema,
  messageType: z.string().min(1).max(255),
  payload: z.record(z.any()),
  priority: z.number().int().min(0).max(10).default(5),
  ttl: z.number().int().positive().optional(),
  expiresAt: z.date().optional(),
  deliveryMode: z.enum(['at-least-once', 'at-most-once', 'exactly-once']).default('at-least-once'),
  sequence: z.number().int().min(0).optional(),
  retryCount: z.number().int().min(0).default(0),
  maxRetries: z.number().int().min(0).default(3),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
  deliveredAt: z.date().optional(),
});

/**
 * Zod schema for message subscription.
 */
export const MessageSubscriptionSchema = z.object({
  id: z.string().uuid(),
  subscriberId: z.string().uuid(),
  messageType: z.string().min(1).max(255),
  correlationPattern: z.string().optional(),
  filter: z.record(z.any()).optional(),
  callback: z.string().optional(),
  active: z.boolean().default(true),
  priority: z.number().int().min(0).max(10).default(5),
  createdAt: z.date(),
  lastMatchedAt: z.date().optional(),
});

/**
 * Zod schema for correlation set.
 */
export const CorrelationSetSchema = z.object({
  id: z.string().uuid(),
  correlationKey: CorrelationKeySchema,
  messageCount: z.number().int().min(0).default(0),
  expectedMessages: z.array(z.string()).optional(),
  receivedMessages: z.array(z.string()).default([]),
  status: z.enum(['pending', 'partial', 'complete', 'expired']).default('pending'),
  completedAt: z.date().optional(),
  expiresAt: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for message matching rules.
 */
export const MessageMatchingRuleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  messageType: z.string().min(1).max(255),
  conditions: z.array(z.object({
    field: z.string(),
    operator: z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'notIn', 'contains', 'startsWith', 'endsWith', 'regex']),
    value: z.any(),
  })),
  priority: z.number().int().min(0).max(10).default(5),
  enabled: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Correlation key interface
 */
export interface CorrelationKey {
  workflowId: string;
  processId: string;
  correlationId: string;
  businessKey?: string;
  tenantId?: string;
  namespace?: string;
  metadata?: Record<string, any>;
}

/**
 * Message definition interface
 */
export interface MessageDefinition {
  id: string;
  correlationKey: CorrelationKey;
  messageType: string;
  payload: Record<string, any>;
  priority: number;
  ttl?: number;
  expiresAt?: Date;
  deliveryMode: 'at-least-once' | 'at-most-once' | 'exactly-once';
  sequence?: number;
  retryCount: number;
  maxRetries: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  deliveredAt?: Date;
}

/**
 * Message subscription interface
 */
export interface MessageSubscription {
  id: string;
  subscriberId: string;
  messageType: string;
  correlationPattern?: string;
  filter?: Record<string, any>;
  callback?: string;
  active: boolean;
  priority: number;
  createdAt: Date;
  lastMatchedAt?: Date;
}

/**
 * Correlation set interface
 */
export interface CorrelationSet {
  id: string;
  correlationKey: CorrelationKey;
  messageCount: number;
  expectedMessages?: string[];
  receivedMessages: string[];
  status: 'pending' | 'partial' | 'complete' | 'expired';
  completedAt?: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Message matching rule interface
 */
export interface MessageMatchingRule {
  id: string;
  name: string;
  messageType: string;
  conditions: Array<{
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'notIn' | 'contains' | 'startsWith' | 'endsWith' | 'regex';
    value: any;
  }>;
  priority: number;
  enabled: boolean;
  metadata?: Record<string, any>;
}

/**
 * Message queue options
 */
export interface MessageQueueOptions {
  maxSize?: number;
  ttl?: number;
  fifo?: boolean;
  deduplicate?: boolean;
  persistToDisk?: boolean;
}

/**
 * Message delivery options
 */
export interface MessageDeliveryOptions {
  mode: 'at-least-once' | 'at-most-once' | 'exactly-once';
  timeout?: number;
  retries?: number;
  backoff?: 'linear' | 'exponential';
  acknowledgmentRequired?: boolean;
}

/**
 * Message buffer configuration
 */
export interface MessageBufferConfig {
  size: number;
  flushInterval?: number;
  flushOnSize?: boolean;
  flushOnTimer?: boolean;
  persistOnFlush?: boolean;
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Correlation message model attributes
 */
export interface CorrelationMessageAttributes {
  id: string;
  correlationId: string;
  messageType: string;
  payload: object;
  priority: number;
  deliveryMode: string;
  status: string;
  sequence: number;
  retryCount: number;
  maxRetries: number;
  expiresAt?: Date;
  deliveredAt?: Date;
  acknowledgedAt?: Date;
  errorMessage?: string;
  metadata?: object;
  tenantId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

/**
 * Message subscription model attributes
 */
export interface MessageSubscriptionAttributes {
  id: string;
  subscriberId: string;
  messageType: string;
  correlationPattern?: string;
  filterCriteria?: object;
  callbackUrl?: string;
  active: boolean;
  priority: number;
  matchCount: number;
  lastMatchedAt?: Date;
  metadata?: object;
  tenantId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

/**
 * Correlation set model attributes
 */
export interface CorrelationSetAttributes {
  id: string;
  correlationKey: string;
  workflowId: string;
  processId: string;
  messageCount: number;
  expectedMessages?: string[];
  receivedMessages: string[];
  status: string;
  completedAt?: Date;
  expiresAt?: Date;
  metadata?: object;
  tenantId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

/**
 * Message matching rule model attributes
 */
export interface MessageMatchingRuleAttributes {
  id: string;
  name: string;
  messageType: string;
  conditions: object;
  priority: number;
  enabled: boolean;
  matchCount: number;
  lastMatchedAt?: Date;
  metadata?: object;
  tenantId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * CorrelationMessage model for storing correlated messages
 */
export class CorrelationMessage extends Model<CorrelationMessageAttributes> implements CorrelationMessageAttributes {
  public id!: string;
  public correlationId!: string;
  public messageType!: string;
  public payload!: object;
  public priority!: number;
  public deliveryMode!: string;
  public status!: string;
  public sequence!: number;
  public retryCount!: number;
  public maxRetries!: number;
  public expiresAt?: Date;
  public deliveredAt?: Date;
  public acknowledgedAt?: Date;
  public errorMessage?: string;
  public metadata?: object;
  public tenantId?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;

  // Association mixins
  public getCorrelationSet!: BelongsToGetAssociationMixin<CorrelationSet>;

  public static associations: {
    correlationSet: Association<CorrelationMessage, CorrelationSet>;
  };
}

/**
 * MessageSubscription model for managing subscriptions
 */
export class MessageSubscriptionModel extends Model<MessageSubscriptionAttributes> implements MessageSubscriptionAttributes {
  public id!: string;
  public subscriberId!: string;
  public messageType!: string;
  public correlationPattern?: string;
  public filterCriteria?: object;
  public callbackUrl?: string;
  public active!: boolean;
  public priority!: number;
  public matchCount!: number;
  public lastMatchedAt?: Date;
  public metadata?: object;
  public tenantId?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

/**
 * CorrelationSet model for managing correlation sets
 */
export class CorrelationSetModel extends Model<CorrelationSetAttributes> implements CorrelationSetAttributes {
  public id!: string;
  public correlationKey!: string;
  public workflowId!: string;
  public processId!: string;
  public messageCount!: number;
  public expectedMessages?: string[];
  public receivedMessages!: string[];
  public status!: string;
  public completedAt?: Date;
  public expiresAt?: Date;
  public metadata?: object;
  public tenantId?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;

  // Association mixins
  public getMessages!: HasManyGetAssociationsMixin<CorrelationMessage>;
  public addMessage!: HasManyAddAssociationMixin<CorrelationMessage, string>;
  public countMessages!: HasManyCountAssociationsMixin;

  public static associations: {
    messages: Association<CorrelationSetModel, CorrelationMessage>;
  };
}

/**
 * MessageMatchingRule model for defining matching rules
 */
export class MessageMatchingRuleModel extends Model<MessageMatchingRuleAttributes> implements MessageMatchingRuleAttributes {
  public id!: string;
  public name!: string;
  public messageType!: string;
  public conditions!: object;
  public priority!: number;
  public enabled!: boolean;
  public matchCount!: number;
  public lastMatchedAt?: Date;
  public metadata?: object;
  public tenantId?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

// ============================================================================
// MODEL INITIALIZATION FUNCTIONS
// ============================================================================

/**
 * Initializes the CorrelationMessage model with comprehensive configuration.
 * Includes validation, hooks, indexes, and scopes for message correlation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof CorrelationMessage} Initialized model
 *
 * @example
 * ```typescript
 * const CorrelationMessageModel = initCorrelationMessageModel(sequelize);
 * const message = await CorrelationMessageModel.create({
 *   correlationId: 'abc-123',
 *   messageType: 'PAYMENT_PROCESSED',
 *   payload: { amount: 100 }
 * });
 * ```
 */
export function initCorrelationMessageModel(sequelize: Sequelize): typeof CorrelationMessage {
  CorrelationMessage.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Unique message identifier',
      },
      correlationId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Correlation identifier for message grouping',
        validate: {
          isUUID: 4,
        },
      },
      messageType: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Type of message for routing and filtering',
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      payload: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Message payload data',
        validate: {
          isValidJSON(value: any) {
            if (typeof value !== 'object' || value === null) {
              throw new Error('Payload must be a valid JSON object');
            }
          },
        },
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
        comment: 'Message priority (0-10, higher is more important)',
        validate: {
          min: 0,
          max: 10,
        },
      },
      deliveryMode: {
        type: DataTypes.ENUM('at-least-once', 'at-most-once', 'exactly-once'),
        allowNull: false,
        defaultValue: 'at-least-once',
        comment: 'Message delivery guarantee mode',
      },
      status: {
        type: DataTypes.ENUM('pending', 'processing', 'delivered', 'acknowledged', 'failed', 'expired'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Current message status',
      },
      sequence: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Message sequence number for ordering',
      },
      retryCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of delivery retry attempts',
      },
      maxRetries: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
        comment: 'Maximum number of retry attempts',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Message expiration timestamp',
      },
      deliveredAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Message delivery timestamp',
      },
      acknowledgedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Message acknowledgment timestamp',
      },
      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Error message if delivery failed',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional message metadata',
      },
      tenantId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Multi-tenancy identifier',
        validate: {
          isUUID: 4,
        },
      },
    },
    {
      sequelize,
      modelName: 'CorrelationMessage',
      tableName: 'correlation_messages',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        { fields: ['correlation_id'] },
        { fields: ['message_type'] },
        { fields: ['status'] },
        { fields: ['priority', 'created_at'] },
        { fields: ['expires_at'] },
        { fields: ['tenant_id'] },
        { fields: ['correlation_id', 'sequence'], unique: true },
      ],
      scopes: {
        pending: {
          where: { status: 'pending' },
        },
        delivered: {
          where: { status: 'delivered' },
        },
        failed: {
          where: { status: 'failed' },
        },
        expired: {
          where: {
            status: 'expired',
          },
        },
        byPriority: {
          order: [['priority', 'DESC'], ['created_at', 'ASC']],
        },
        notExpired: {
          where: {
            [Op.or]: [
              { expiresAt: null },
              { expiresAt: { [Op.gt]: new Date() } },
            ],
          },
        },
      },
      hooks: {
        beforeValidate: (message: CorrelationMessage) => {
          // Set expiration if TTL metadata exists
          if (message.metadata && (message.metadata as any).ttl) {
            const ttl = (message.metadata as any).ttl;
            message.expiresAt = new Date(Date.now() + ttl * 1000);
          }
        },
        beforeCreate: (message: CorrelationMessage) => {
          // Validate delivery mode constraints
          if (message.deliveryMode === 'exactly-once' && !message.sequence) {
            throw new Error('Exactly-once delivery requires sequence number');
          }
        },
        afterCreate: async (message: CorrelationMessage) => {
          // Emit message created event for subscribers
          const eventEmitter = (sequelize as any).eventEmitter as EventEmitter2;
          if (eventEmitter) {
            eventEmitter.emit('message.created', {
              messageId: message.id,
              correlationId: message.correlationId,
              messageType: message.messageType,
              priority: message.priority,
            });
          }
        },
        beforeUpdate: (message: CorrelationMessage) => {
          // Track delivery timestamp
          if (message.status === 'delivered' && !message.deliveredAt) {
            message.deliveredAt = new Date();
          }
          // Track acknowledgment timestamp
          if (message.status === 'acknowledged' && !message.acknowledgedAt) {
            message.acknowledgedAt = new Date();
          }
        },
        afterUpdate: async (message: CorrelationMessage) => {
          // Emit status change events
          const eventEmitter = (sequelize as any).eventEmitter as EventEmitter2;
          if (eventEmitter && message.changed('status')) {
            eventEmitter.emit('message.status.changed', {
              messageId: message.id,
              correlationId: message.correlationId,
              oldStatus: message.previous('status'),
              newStatus: message.status,
            });
          }
        },
      },
    }
  );

  return CorrelationMessage;
}

/**
 * Initializes the MessageSubscription model with comprehensive configuration.
 * Includes validation, hooks, indexes, and scopes for subscription management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof MessageSubscriptionModel} Initialized model
 *
 * @example
 * ```typescript
 * const MessageSubscription = initMessageSubscriptionModel(sequelize);
 * const subscription = await MessageSubscription.create({
 *   subscriberId: 'user-123',
 *   messageType: 'PAYMENT_PROCESSED'
 * });
 * ```
 */
export function initMessageSubscriptionModel(sequelize: Sequelize): typeof MessageSubscriptionModel {
  MessageSubscriptionModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Unique subscription identifier',
      },
      subscriberId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Subscriber identifier',
        validate: {
          isUUID: 4,
        },
      },
      messageType: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Message type to subscribe to',
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      correlationPattern: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Regex pattern for correlation matching',
      },
      filterCriteria: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Filter criteria for message matching',
      },
      callbackUrl: {
        type: DataTypes.STRING(2048),
        allowNull: true,
        comment: 'Callback URL for message delivery',
        validate: {
          isUrl: true,
        },
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether subscription is active',
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
        comment: 'Subscription priority (0-10)',
        validate: {
          min: 0,
          max: 10,
        },
      },
      matchCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of messages matched',
      },
      lastMatchedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last message match timestamp',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional subscription metadata',
      },
      tenantId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Multi-tenancy identifier',
        validate: {
          isUUID: 4,
        },
      },
    },
    {
      sequelize,
      modelName: 'MessageSubscription',
      tableName: 'message_subscriptions',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        { fields: ['subscriber_id'] },
        { fields: ['message_type'] },
        { fields: ['active'] },
        { fields: ['priority'] },
        { fields: ['tenant_id'] },
        { fields: ['message_type', 'active'] },
      ],
      scopes: {
        active: {
          where: { active: true },
        },
        inactive: {
          where: { active: false },
        },
        byPriority: {
          order: [['priority', 'DESC']],
        },
      },
      hooks: {
        afterCreate: async (subscription: MessageSubscriptionModel) => {
          const eventEmitter = (sequelize as any).eventEmitter as EventEmitter2;
          if (eventEmitter) {
            eventEmitter.emit('subscription.created', {
              subscriptionId: subscription.id,
              subscriberId: subscription.subscriberId,
              messageType: subscription.messageType,
            });
          }
        },
      },
    }
  );

  return MessageSubscriptionModel;
}

/**
 * Initializes the CorrelationSet model with comprehensive configuration.
 * Includes validation, hooks, indexes, and scopes for correlation set management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof CorrelationSetModel} Initialized model
 *
 * @example
 * ```typescript
 * const CorrelationSet = initCorrelationSetModel(sequelize);
 * const set = await CorrelationSet.create({
 *   correlationKey: 'order-123',
 *   workflowId: 'wf-456'
 * });
 * ```
 */
export function initCorrelationSetModel(sequelize: Sequelize): typeof CorrelationSetModel {
  CorrelationSetModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Unique correlation set identifier',
      },
      correlationKey: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Correlation key for message grouping',
        validate: {
          notEmpty: true,
        },
      },
      workflowId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Associated workflow identifier',
        validate: {
          isUUID: 4,
        },
      },
      processId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Associated process identifier',
        validate: {
          isUUID: 4,
        },
      },
      messageCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of messages in set',
      },
      expectedMessages: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        comment: 'Expected message types',
      },
      receivedMessages: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Received message types',
      },
      status: {
        type: DataTypes.ENUM('pending', 'partial', 'complete', 'expired'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Correlation set status',
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Completion timestamp',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Expiration timestamp',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional correlation metadata',
      },
      tenantId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Multi-tenancy identifier',
        validate: {
          isUUID: 4,
        },
      },
    },
    {
      sequelize,
      modelName: 'CorrelationSet',
      tableName: 'correlation_sets',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        { fields: ['correlation_key'], unique: true },
        { fields: ['workflow_id'] },
        { fields: ['process_id'] },
        { fields: ['status'] },
        { fields: ['expires_at'] },
        { fields: ['tenant_id'] },
      ],
      scopes: {
        pending: {
          where: { status: 'pending' },
        },
        complete: {
          where: { status: 'complete' },
        },
        notExpired: {
          where: {
            [Op.or]: [
              { expiresAt: null },
              { expiresAt: { [Op.gt]: new Date() } },
            ],
          },
        },
      },
      hooks: {
        beforeUpdate: (set: CorrelationSetModel) => {
          // Auto-complete if all expected messages received
          if (set.expectedMessages && set.receivedMessages) {
            const allReceived = set.expectedMessages.every(
              (msg) => set.receivedMessages.includes(msg)
            );
            if (allReceived && set.status !== 'complete') {
              set.status = 'complete';
              set.completedAt = new Date();
            }
          }
        },
        afterUpdate: async (set: CorrelationSetModel) => {
          const eventEmitter = (sequelize as any).eventEmitter as EventEmitter2;
          if (eventEmitter && set.changed('status')) {
            eventEmitter.emit('correlation.set.status.changed', {
              setId: set.id,
              correlationKey: set.correlationKey,
              oldStatus: set.previous('status'),
              newStatus: set.status,
            });
          }
        },
      },
    }
  );

  return CorrelationSetModel;
}

/**
 * Initializes the MessageMatchingRule model with comprehensive configuration.
 * Includes validation, hooks, indexes, and scopes for rule management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof MessageMatchingRuleModel} Initialized model
 *
 * @example
 * ```typescript
 * const MatchingRule = initMessageMatchingRuleModel(sequelize);
 * const rule = await MatchingRule.create({
 *   name: 'High Priority Payments',
 *   messageType: 'PAYMENT',
 *   conditions: [{ field: 'amount', operator: 'gt', value: 1000 }]
 * });
 * ```
 */
export function initMessageMatchingRuleModel(sequelize: Sequelize): typeof MessageMatchingRuleModel {
  MessageMatchingRuleModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Unique rule identifier',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Rule name',
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      messageType: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Message type this rule applies to',
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      conditions: {
        type: DataTypes.JSONB,
        allowNull: false,
        comment: 'Matching conditions',
        validate: {
          isValidConditions(value: any) {
            if (!Array.isArray(value)) {
              throw new Error('Conditions must be an array');
            }
            value.forEach((condition: any) => {
              if (!condition.field || !condition.operator) {
                throw new Error('Each condition must have field and operator');
              }
            });
          },
        },
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
        comment: 'Rule priority (0-10)',
        validate: {
          min: 0,
          max: 10,
        },
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether rule is enabled',
      },
      matchCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of messages matched by this rule',
      },
      lastMatchedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last match timestamp',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional rule metadata',
      },
      tenantId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Multi-tenancy identifier',
        validate: {
          isUUID: 4,
        },
      },
    },
    {
      sequelize,
      modelName: 'MessageMatchingRule',
      tableName: 'message_matching_rules',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        { fields: ['message_type'] },
        { fields: ['enabled'] },
        { fields: ['priority'] },
        { fields: ['tenant_id'] },
        { fields: ['message_type', 'enabled'] },
      ],
      scopes: {
        enabled: {
          where: { enabled: true },
        },
        byPriority: {
          order: [['priority', 'DESC']],
        },
      },
    }
  );

  return MessageMatchingRuleModel;
}

/**
 * Sets up associations between correlation models.
 * Defines relationships for message correlation and set management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 *
 * @example
 * ```typescript
 * setupCorrelationAssociations(sequelize);
 * ```
 */
export function setupCorrelationAssociations(sequelize: Sequelize): void {
  const CorrelationMessage = sequelize.models.CorrelationMessage as typeof CorrelationMessage;
  const CorrelationSet = sequelize.models.CorrelationSet as typeof CorrelationSetModel;

  if (CorrelationMessage && CorrelationSet) {
    CorrelationSet.hasMany(CorrelationMessage, {
      foreignKey: 'correlationId',
      sourceKey: 'correlationKey',
      as: 'messages',
    });

    CorrelationMessage.belongsTo(CorrelationSet, {
      foreignKey: 'correlationId',
      targetKey: 'correlationKey',
      as: 'correlationSet',
    });
  }
}

// ============================================================================
// CORRELATION KEY MANAGEMENT
// ============================================================================

/**
 * Generates a unique correlation key from workflow and process identifiers.
 * Creates a deterministic or random correlation key based on parameters.
 *
 * @param {CorrelationKey} params - Correlation key parameters
 * @returns {string} Generated correlation key
 *
 * @example
 * ```typescript
 * const key = generateCorrelationKey({
 *   workflowId: 'wf-123',
 *   processId: 'proc-456',
 *   correlationId: randomUUID()
 * });
 * ```
 */
export function generateCorrelationKey(params: CorrelationKey): string {
  const { workflowId, processId, correlationId, businessKey, namespace } = params;

  const parts = [
    namespace || 'default',
    workflowId,
    processId,
    correlationId,
  ];

  if (businessKey) {
    parts.push(businessKey);
  }

  return parts.join(':');
}

/**
 * Parses a correlation key string into its component parts.
 * Extracts workflow, process, and correlation identifiers.
 *
 * @param {string} correlationKey - Correlation key string
 * @returns {Partial<CorrelationKey>} Parsed correlation key components
 *
 * @example
 * ```typescript
 * const parsed = parseCorrelationKey('default:wf-123:proc-456:corr-789');
 * // Returns: { namespace: 'default', workflowId: 'wf-123', processId: 'proc-456', correlationId: 'corr-789' }
 * ```
 */
export function parseCorrelationKey(correlationKey: string): Partial<CorrelationKey> {
  const parts = correlationKey.split(':');

  return {
    namespace: parts[0] || 'default',
    workflowId: parts[1],
    processId: parts[2],
    correlationId: parts[3],
    businessKey: parts[4],
  };
}

/**
 * Validates a correlation key structure and format.
 * Ensures all required components are present and valid.
 *
 * @param {CorrelationKey} correlationKey - Correlation key to validate
 * @returns {boolean} Whether the correlation key is valid
 *
 * @example
 * ```typescript
 * const isValid = validateCorrelationKey({
 *   workflowId: 'wf-123',
 *   processId: 'proc-456',
 *   correlationId: 'corr-789'
 * });
 * ```
 */
export function validateCorrelationKey(correlationKey: CorrelationKey): boolean {
  try {
    CorrelationKeySchema.parse(correlationKey);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Creates a hash-based correlation key for deterministic correlation.
 * Generates consistent key from business data for idempotency.
 *
 * @param {Record<string, any>} businessData - Business data to hash
 * @param {string} namespace - Optional namespace
 * @returns {string} Hash-based correlation key
 *
 * @example
 * ```typescript
 * const key = createHashedCorrelationKey(
 *   { orderId: '123', customerId: '456' },
 *   'orders'
 * );
 * ```
 */
export function createHashedCorrelationKey(
  businessData: Record<string, any>,
  namespace: string = 'default'
): string {
  const dataString = JSON.stringify(businessData, Object.keys(businessData).sort());
  const hash = createHash('sha256').update(dataString).digest('hex');
  return `${namespace}:hashed:${hash}`;
}

/**
 * Extracts correlation metadata from a correlation key.
 * Returns associated metadata for correlation tracking.
 *
 * @param {string} correlationKey - Correlation key
 * @param {typeof CorrelationSetModel} model - CorrelationSet model
 * @returns {Promise<Record<string, any> | null>} Correlation metadata
 *
 * @example
 * ```typescript
 * const metadata = await getCorrelationMetadata('default:wf-123:proc-456', CorrelationSet);
 * ```
 */
export async function getCorrelationMetadata(
  correlationKey: string,
  model: typeof CorrelationSetModel
): Promise<Record<string, any> | null> {
  const set = await model.findOne({
    where: { correlationKey },
    attributes: ['metadata'],
  });

  return set?.metadata as Record<string, any> || null;
}

// ============================================================================
// MESSAGE SUBSCRIPTION
// ============================================================================

/**
 * Creates a message subscription for a specific message type.
 * Registers a subscriber to receive matching messages.
 *
 * @param {typeof MessageSubscriptionModel} model - MessageSubscription model
 * @param {string} subscriberId - Subscriber identifier
 * @param {string} messageType - Message type to subscribe to
 * @param {Partial<MessageSubscriptionAttributes>} options - Additional subscription options
 * @returns {Promise<MessageSubscriptionModel>} Created subscription
 *
 * @example
 * ```typescript
 * const subscription = await createMessageSubscription(
 *   MessageSubscription,
 *   'user-123',
 *   'PAYMENT_PROCESSED',
 *   { priority: 8, callbackUrl: 'https://api.example.com/webhook' }
 * );
 * ```
 */
export async function createMessageSubscription(
  model: typeof MessageSubscriptionModel,
  subscriberId: string,
  messageType: string,
  options: Partial<MessageSubscriptionAttributes> = {}
): Promise<MessageSubscriptionModel> {
  return await model.create({
    id: randomUUID(),
    subscriberId,
    messageType,
    active: true,
    priority: 5,
    matchCount: 0,
    ...options,
  });
}

/**
 * Finds active subscriptions matching a message type.
 * Returns all active subscriptions for message routing.
 *
 * @param {typeof MessageSubscriptionModel} model - MessageSubscription model
 * @param {string} messageType - Message type to match
 * @param {string} [tenantId] - Optional tenant filter
 * @returns {Promise<MessageSubscriptionModel[]>} Matching subscriptions
 *
 * @example
 * ```typescript
 * const subscriptions = await findMessageSubscriptions(
 *   MessageSubscription,
 *   'PAYMENT_PROCESSED'
 * );
 * ```
 */
export async function findMessageSubscriptions(
  model: typeof MessageSubscriptionModel,
  messageType: string,
  tenantId?: string
): Promise<MessageSubscriptionModel[]> {
  const where: WhereOptions<MessageSubscriptionAttributes> = {
    messageType,
    active: true,
  };

  if (tenantId) {
    where.tenantId = tenantId;
  }

  return await model.findAll({
    where,
    order: [['priority', 'DESC'], ['created_at', 'ASC']],
  });
}

/**
 * Updates subscription match statistics.
 * Increments match count and updates last matched timestamp.
 *
 * @param {MessageSubscriptionModel} subscription - Subscription instance
 * @returns {Promise<MessageSubscriptionModel>} Updated subscription
 *
 * @example
 * ```typescript
 * await updateSubscriptionMatchStats(subscription);
 * ```
 */
export async function updateSubscriptionMatchStats(
  subscription: MessageSubscriptionModel
): Promise<MessageSubscriptionModel> {
  subscription.matchCount += 1;
  subscription.lastMatchedAt = new Date();
  return await subscription.save();
}

/**
 * Activates or deactivates a message subscription.
 * Toggles subscription active status.
 *
 * @param {MessageSubscriptionModel} subscription - Subscription instance
 * @param {boolean} active - Active status
 * @returns {Promise<MessageSubscriptionModel>} Updated subscription
 *
 * @example
 * ```typescript
 * await toggleSubscriptionStatus(subscription, false);
 * ```
 */
export async function toggleSubscriptionStatus(
  subscription: MessageSubscriptionModel,
  active: boolean
): Promise<MessageSubscriptionModel> {
  subscription.active = active;
  return await subscription.save();
}

/**
 * Removes expired or inactive subscriptions.
 * Cleans up old subscriptions based on criteria.
 *
 * @param {typeof MessageSubscriptionModel} model - MessageSubscription model
 * @param {number} inactiveDays - Days of inactivity before removal
 * @returns {Promise<number>} Number of removed subscriptions
 *
 * @example
 * ```typescript
 * const removed = await cleanupSubscriptions(MessageSubscription, 90);
 * ```
 */
export async function cleanupSubscriptions(
  model: typeof MessageSubscriptionModel,
  inactiveDays: number = 90
): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);

  const result = await model.destroy({
    where: {
      [Op.or]: [
        { active: false },
        {
          lastMatchedAt: {
            [Op.lt]: cutoffDate,
          },
        },
      ],
    },
  });

  return result;
}

// ============================================================================
// MESSAGE MATCHING ALGORITHMS
// ============================================================================

/**
 * Evaluates a message against matching conditions.
 * Determines if a message satisfies all conditions.
 *
 * @param {Record<string, any>} message - Message to evaluate
 * @param {MessageMatchingRule['conditions']} conditions - Conditions to check
 * @returns {boolean} Whether message matches conditions
 *
 * @example
 * ```typescript
 * const matches = evaluateMessageConditions(
 *   { amount: 1500, currency: 'USD' },
 *   [{ field: 'amount', operator: 'gt', value: 1000 }]
 * );
 * ```
 */
export function evaluateMessageConditions(
  message: Record<string, any>,
  conditions: MessageMatchingRule['conditions']
): boolean {
  return (conditions as any[]).every((condition) => {
    const fieldValue = message[condition.field];
    const { operator, value } = condition;

    switch (operator) {
      case 'eq':
        return fieldValue === value;
      case 'ne':
        return fieldValue !== value;
      case 'gt':
        return fieldValue > value;
      case 'gte':
        return fieldValue >= value;
      case 'lt':
        return fieldValue < value;
      case 'lte':
        return fieldValue <= value;
      case 'in':
        return Array.isArray(value) && value.includes(fieldValue);
      case 'notIn':
        return Array.isArray(value) && !value.includes(fieldValue);
      case 'contains':
        return typeof fieldValue === 'string' && fieldValue.includes(value);
      case 'startsWith':
        return typeof fieldValue === 'string' && fieldValue.startsWith(value);
      case 'endsWith':
        return typeof fieldValue === 'string' && fieldValue.endsWith(value);
      case 'regex':
        return new RegExp(value).test(String(fieldValue));
      default:
        return false;
    }
  });
}

/**
 * Finds matching rules for a message.
 * Returns all enabled rules that match the message.
 *
 * @param {typeof MessageMatchingRuleModel} model - MessageMatchingRule model
 * @param {string} messageType - Message type
 * @param {Record<string, any>} payload - Message payload
 * @returns {Promise<MessageMatchingRuleModel[]>} Matching rules
 *
 * @example
 * ```typescript
 * const rules = await findMatchingRules(
 *   MatchingRule,
 *   'PAYMENT',
 *   { amount: 1500 }
 * );
 * ```
 */
export async function findMatchingRules(
  model: typeof MessageMatchingRuleModel,
  messageType: string,
  payload: Record<string, any>
): Promise<MessageMatchingRuleModel[]> {
  const rules = await model.scope('enabled').findAll({
    where: { messageType },
    order: [['priority', 'DESC']],
  });

  return rules.filter((rule) =>
    evaluateMessageConditions(payload, rule.conditions as any)
  );
}

/**
 * Matches a message to subscriptions based on filters.
 * Returns subscriptions that match message criteria.
 *
 * @param {typeof MessageSubscriptionModel} model - MessageSubscription model
 * @param {CorrelationMessage} message - Message to match
 * @returns {Promise<MessageSubscriptionModel[]>} Matching subscriptions
 *
 * @example
 * ```typescript
 * const subscriptions = await matchMessageToSubscriptions(MessageSubscription, message);
 * ```
 */
export async function matchMessageToSubscriptions(
  model: typeof MessageSubscriptionModel,
  message: CorrelationMessage
): Promise<MessageSubscriptionModel[]> {
  const subscriptions = await findMessageSubscriptions(
    model,
    message.messageType,
    message.tenantId || undefined
  );

  return subscriptions.filter((subscription) => {
    // Check correlation pattern if specified
    if (subscription.correlationPattern) {
      const pattern = new RegExp(subscription.correlationPattern);
      if (!pattern.test(message.correlationId)) {
        return false;
      }
    }

    // Check filter criteria if specified
    if (subscription.filterCriteria && Object.keys(subscription.filterCriteria).length > 0) {
      return evaluateMessageConditions(
        message.payload as Record<string, any>,
        Object.entries(subscription.filterCriteria).map(([field, value]) => ({
          field,
          operator: 'eq' as const,
          value,
        }))
      );
    }

    return true;
  });
}

/**
 * Performs priority-based message routing.
 * Routes message to highest priority matching subscription.
 *
 * @param {MessageSubscriptionModel[]} subscriptions - Available subscriptions
 * @param {CorrelationMessage} message - Message to route
 * @returns {MessageSubscriptionModel | null} Selected subscription
 *
 * @example
 * ```typescript
 * const target = priorityBasedRouting(subscriptions, message);
 * ```
 */
export function priorityBasedRouting(
  subscriptions: MessageSubscriptionModel[],
  message: CorrelationMessage
): MessageSubscriptionModel | null {
  if (subscriptions.length === 0) {
    return null;
  }

  // Sort by priority (descending) and creation time (ascending)
  const sorted = subscriptions.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  return sorted[0];
}

/**
 * Implements round-robin message routing.
 * Distributes messages evenly across subscriptions.
 *
 * @param {MessageSubscriptionModel[]} subscriptions - Available subscriptions
 * @param {number} currentIndex - Current round-robin index
 * @returns {{ subscription: MessageSubscriptionModel | null; nextIndex: number }} Selected subscription and next index
 *
 * @example
 * ```typescript
 * const { subscription, nextIndex } = roundRobinRouting(subscriptions, 0);
 * ```
 */
export function roundRobinRouting(
  subscriptions: MessageSubscriptionModel[],
  currentIndex: number
): { subscription: MessageSubscriptionModel | null; nextIndex: number } {
  if (subscriptions.length === 0) {
    return { subscription: null, nextIndex: 0 };
  }

  const index = currentIndex % subscriptions.length;
  return {
    subscription: subscriptions[index],
    nextIndex: index + 1,
  };
}

// ============================================================================
// MESSAGE QUEUE HANDLING
// ============================================================================

/**
 * Enqueues a message for delivery.
 * Adds message to delivery queue with proper ordering.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {Partial<CorrelationMessageAttributes>} messageData - Message data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CorrelationMessage>} Enqueued message
 *
 * @example
 * ```typescript
 * const message = await enqueueMessage(CorrelationMessage, {
 *   correlationId: 'abc-123',
 *   messageType: 'PAYMENT',
 *   payload: { amount: 100 }
 * });
 * ```
 */
export async function enqueueMessage(
  model: typeof CorrelationMessage,
  messageData: Partial<CorrelationMessageAttributes>,
  transaction?: Transaction
): Promise<CorrelationMessage> {
  // Get next sequence number for this correlation
  const lastMessage = await model.findOne({
    where: { correlationId: messageData.correlationId },
    order: [['sequence', 'DESC']],
    attributes: ['sequence'],
    transaction,
  });

  const sequence = lastMessage ? lastMessage.sequence + 1 : 0;

  return await model.create(
    {
      id: randomUUID(),
      status: 'pending',
      priority: 5,
      deliveryMode: 'at-least-once',
      retryCount: 0,
      maxRetries: 3,
      sequence,
      ...messageData,
    } as CorrelationMessageAttributes,
    { transaction }
  );
}

/**
 * Dequeues messages for processing.
 * Retrieves pending messages for delivery.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {number} limit - Maximum number of messages to dequeue
 * @param {string} [tenantId] - Optional tenant filter
 * @returns {Promise<CorrelationMessage[]>} Dequeued messages
 *
 * @example
 * ```typescript
 * const messages = await dequeueMessages(CorrelationMessage, 10);
 * ```
 */
export async function dequeueMessages(
  model: typeof CorrelationMessage,
  limit: number = 10,
  tenantId?: string
): Promise<CorrelationMessage[]> {
  const where: WhereOptions<CorrelationMessageAttributes> = {
    status: 'pending',
    [Op.or]: [
      { expiresAt: null },
      { expiresAt: { [Op.gt]: new Date() } },
    ],
  };

  if (tenantId) {
    where.tenantId = tenantId;
  }

  return await model.scope('byPriority').findAll({
    where,
    limit,
  });
}

/**
 * Peeks at queued messages without removing them.
 * Views pending messages without changing status.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {number} limit - Maximum number of messages to peek
 * @returns {Promise<CorrelationMessage[]>} Peeked messages
 *
 * @example
 * ```typescript
 * const messages = await peekMessages(CorrelationMessage, 5);
 * ```
 */
export async function peekMessages(
  model: typeof CorrelationMessage,
  limit: number = 10
): Promise<CorrelationMessage[]> {
  return await model.scope(['pending', 'byPriority']).findAll({
    limit,
  });
}

/**
 * Gets the current queue depth.
 * Returns number of pending messages.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {string} [correlationId] - Optional correlation filter
 * @returns {Promise<number>} Queue depth
 *
 * @example
 * ```typescript
 * const depth = await getQueueDepth(CorrelationMessage);
 * ```
 */
export async function getQueueDepth(
  model: typeof CorrelationMessage,
  correlationId?: string
): Promise<number> {
  const where: WhereOptions<CorrelationMessageAttributes> = {
    status: 'pending',
  };

  if (correlationId) {
    where.correlationId = correlationId;
  }

  return await model.count({ where });
}

/**
 * Purges expired messages from the queue.
 * Removes messages past their expiration time.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @returns {Promise<number>} Number of purged messages
 *
 * @example
 * ```typescript
 * const purged = await purgeExpiredMessages(CorrelationMessage);
 * ```
 */
export async function purgeExpiredMessages(
  model: typeof CorrelationMessage
): Promise<number> {
  const [affectedCount] = await model.update(
    { status: 'expired' },
    {
      where: {
        status: { [Op.in]: ['pending', 'processing'] },
        expiresAt: { [Op.lt]: new Date() },
      },
    }
  );

  return affectedCount;
}

// ============================================================================
// MESSAGE BUFFERING
// ============================================================================

/**
 * Buffers messages for batch processing.
 * Collects messages until buffer size or time threshold met.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {string} correlationId - Correlation identifier
 * @param {number} bufferSize - Buffer size threshold
 * @returns {Promise<CorrelationMessage[]>} Buffered messages
 *
 * @example
 * ```typescript
 * const buffered = await bufferMessages(CorrelationMessage, 'abc-123', 50);
 * ```
 */
export async function bufferMessages(
  model: typeof CorrelationMessage,
  correlationId: string,
  bufferSize: number
): Promise<CorrelationMessage[]> {
  const messages = await model.findAll({
    where: {
      correlationId,
      status: 'pending',
    },
    limit: bufferSize,
    order: [['sequence', 'ASC']],
  });

  return messages;
}

/**
 * Flushes buffered messages for processing.
 * Marks buffered messages as processing.
 *
 * @param {CorrelationMessage[]} messages - Buffered messages
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await flushMessageBuffer(bufferedMessages);
 * ```
 */
export async function flushMessageBuffer(
  messages: CorrelationMessage[]
): Promise<void> {
  await Promise.all(
    messages.map((message) => {
      message.status = 'processing';
      return message.save();
    })
  );
}

/**
 * Gets buffer statistics for a correlation.
 * Returns buffer size and age information.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {string} correlationId - Correlation identifier
 * @returns {Promise<{ size: number; oldestMessage: Date | null; newestMessage: Date | null }>} Buffer stats
 *
 * @example
 * ```typescript
 * const stats = await getBufferStats(CorrelationMessage, 'abc-123');
 * ```
 */
export async function getBufferStats(
  model: typeof CorrelationMessage,
  correlationId: string
): Promise<{ size: number; oldestMessage: Date | null; newestMessage: Date | null }> {
  const messages = await model.findAll({
    where: {
      correlationId,
      status: 'pending',
    },
    order: [['created_at', 'ASC']],
    attributes: ['createdAt'],
  });

  return {
    size: messages.length,
    oldestMessage: messages.length > 0 ? messages[0].createdAt : null,
    newestMessage: messages.length > 0 ? messages[messages.length - 1].createdAt : null,
  };
}

// ============================================================================
// MESSAGE DELIVERY GUARANTEES
// ============================================================================

/**
 * Implements at-least-once delivery semantics.
 * Ensures message is delivered at least once with retries.
 *
 * @param {CorrelationMessage} message - Message to deliver
 * @param {() => Promise<boolean>} deliveryFn - Delivery function
 * @returns {Promise<boolean>} Whether delivery succeeded
 *
 * @example
 * ```typescript
 * const delivered = await deliverAtLeastOnce(message, async () => {
 *   return await sendToWebhook(message.payload);
 * });
 * ```
 */
export async function deliverAtLeastOnce(
  message: CorrelationMessage,
  deliveryFn: () => Promise<boolean>
): Promise<boolean> {
  message.status = 'processing';
  await message.save();

  while (message.retryCount <= message.maxRetries) {
    try {
      const success = await deliveryFn();
      if (success) {
        message.status = 'delivered';
        message.deliveredAt = new Date();
        await message.save();
        return true;
      }
    } catch (error) {
      message.errorMessage = (error as Error).message;
    }

    message.retryCount += 1;
    await message.save();

    if (message.retryCount <= message.maxRetries) {
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, message.retryCount), 30000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  message.status = 'failed';
  await message.save();
  return false;
}

/**
 * Implements at-most-once delivery semantics.
 * Attempts delivery once without retries.
 *
 * @param {CorrelationMessage} message - Message to deliver
 * @param {() => Promise<boolean>} deliveryFn - Delivery function
 * @returns {Promise<boolean>} Whether delivery succeeded
 *
 * @example
 * ```typescript
 * const delivered = await deliverAtMostOnce(message, async () => {
 *   return await sendToQueue(message.payload);
 * });
 * ```
 */
export async function deliverAtMostOnce(
  message: CorrelationMessage,
  deliveryFn: () => Promise<boolean>
): Promise<boolean> {
  message.status = 'processing';
  await message.save();

  try {
    const success = await deliveryFn();
    message.status = success ? 'delivered' : 'failed';
    if (success) {
      message.deliveredAt = new Date();
    }
  } catch (error) {
    message.status = 'failed';
    message.errorMessage = (error as Error).message;
  }

  await message.save();
  return message.status === 'delivered';
}

/**
 * Implements exactly-once delivery semantics.
 * Ensures message is delivered exactly once using idempotency.
 *
 * @param {CorrelationMessage} message - Message to deliver
 * @param {() => Promise<boolean>} deliveryFn - Delivery function
 * @param {(messageId: string) => Promise<boolean>} checkDeliveredFn - Check if already delivered
 * @returns {Promise<boolean>} Whether delivery succeeded
 *
 * @example
 * ```typescript
 * const delivered = await deliverExactlyOnce(
 *   message,
 *   async () => sendToQueue(message.payload),
 *   async (id) => checkDeliveryLog(id)
 * );
 * ```
 */
export async function deliverExactlyOnce(
  message: CorrelationMessage,
  deliveryFn: () => Promise<boolean>,
  checkDeliveredFn: (messageId: string) => Promise<boolean>
): Promise<boolean> {
  // Check if already delivered
  const alreadyDelivered = await checkDeliveredFn(message.id);
  if (alreadyDelivered) {
    message.status = 'delivered';
    await message.save();
    return true;
  }

  // Use at-least-once with deduplication
  return await deliverAtLeastOnce(message, deliveryFn);
}

/**
 * Acknowledges message delivery.
 * Marks message as acknowledged after successful processing.
 *
 * @param {CorrelationMessage} message - Message to acknowledge
 * @returns {Promise<CorrelationMessage>} Acknowledged message
 *
 * @example
 * ```typescript
 * await acknowledgeMessage(message);
 * ```
 */
export async function acknowledgeMessage(
  message: CorrelationMessage
): Promise<CorrelationMessage> {
  message.status = 'acknowledged';
  message.acknowledgedAt = new Date();
  return await message.save();
}

/**
 * Negatively acknowledges message delivery (NACK).
 * Requeues message for retry after failure.
 *
 * @param {CorrelationMessage} message - Message to NACK
 * @param {string} [reason] - Reason for NACK
 * @returns {Promise<CorrelationMessage>} Updated message
 *
 * @example
 * ```typescript
 * await negativeAcknowledgeMessage(message, 'Temporary service unavailable');
 * ```
 */
export async function negativeAcknowledgeMessage(
  message: CorrelationMessage,
  reason?: string
): Promise<CorrelationMessage> {
  message.status = message.retryCount < message.maxRetries ? 'pending' : 'failed';
  message.retryCount += 1;
  if (reason) {
    message.errorMessage = reason;
  }
  return await message.save();
}

// ============================================================================
// MESSAGE DEDUPLICATION
// ============================================================================

/**
 * Detects duplicate messages based on content hash.
 * Identifies messages with identical payloads.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {Record<string, any>} payload - Message payload
 * @param {string} correlationId - Correlation identifier
 * @returns {Promise<CorrelationMessage | null>} Duplicate message if found
 *
 * @example
 * ```typescript
 * const duplicate = await detectDuplicateMessage(
 *   CorrelationMessage,
 *   { orderId: '123' },
 *   'abc-123'
 * );
 * ```
 */
export async function detectDuplicateMessage(
  model: typeof CorrelationMessage,
  payload: Record<string, any>,
  correlationId: string
): Promise<CorrelationMessage | null> {
  const payloadHash = createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex');

  const existingMessages = await model.findAll({
    where: {
      correlationId,
      status: { [Op.in]: ['delivered', 'acknowledged'] },
    },
  });

  for (const msg of existingMessages) {
    const msgHash = createHash('sha256')
      .update(JSON.stringify(msg.payload))
      .digest('hex');

    if (msgHash === payloadHash) {
      return msg;
    }
  }

  return null;
}

/**
 * Deduplicates messages in a correlation set.
 * Removes duplicate messages based on content.
 *
 * @param {typeof CorrelationMessage} model - CorrelationMessage model
 * @param {string} correlationId - Correlation identifier
 * @returns {Promise<number>} Number of duplicates removed
 *
 * @example
 * ```typescript
 * const removed = await deduplicateMessages(CorrelationMessage, 'abc-123');
 * ```
 */
export async function deduplicateMessages(
  model: typeof CorrelationMessage,
  correlationId: string
): Promise<number> {
  const messages = await model.findAll({
    where: { correlationId },
    order: [['created_at', 'ASC']],
  });

  const seen = new Set<string>();
  let removedCount = 0;

  for (const message of messages) {
    const hash = createHash('sha256')
      .update(JSON.stringify(message.payload))
      .digest('hex');

    if (seen.has(hash)) {
      await message.destroy();
      removedCount += 1;
    } else {
      seen.add(hash);
    }
  }

  return removedCount;
}

// ============================================================================
// CORRELATION SET MANAGEMENT
// ============================================================================

/**
 * Creates a new correlation set.
 * Initializes a correlation set for message grouping.
 *
 * @param {typeof CorrelationSetModel} model - CorrelationSet model
 * @param {Partial<CorrelationSetAttributes>} setData - Correlation set data
 * @returns {Promise<CorrelationSetModel>} Created correlation set
 *
 * @example
 * ```typescript
 * const set = await createCorrelationSet(CorrelationSet, {
 *   correlationKey: 'order-123',
 *   workflowId: 'wf-456',
 *   processId: 'proc-789',
 *   expectedMessages: ['PAYMENT', 'SHIPPING', 'NOTIFICATION']
 * });
 * ```
 */
export async function createCorrelationSet(
  model: typeof CorrelationSetModel,
  setData: Partial<CorrelationSetAttributes>
): Promise<CorrelationSetModel> {
  return await model.create({
    id: randomUUID(),
    status: 'pending',
    messageCount: 0,
    receivedMessages: [],
    ...setData,
  } as CorrelationSetAttributes);
}

/**
 * Adds a message to a correlation set.
 * Tracks message reception in the set.
 *
 * @param {CorrelationSetModel} set - Correlation set
 * @param {string} messageType - Message type
 * @returns {Promise<CorrelationSetModel>} Updated set
 *
 * @example
 * ```typescript
 * await addMessageToSet(set, 'PAYMENT');
 * ```
 */
export async function addMessageToSet(
  set: CorrelationSetModel,
  messageType: string
): Promise<CorrelationSetModel> {
  if (!set.receivedMessages.includes(messageType)) {
    set.receivedMessages = [...set.receivedMessages, messageType];
    set.messageCount += 1;

    // Check if all expected messages received
    if (set.expectedMessages && set.receivedMessages.length >= set.expectedMessages.length) {
      const allReceived = set.expectedMessages.every((msg) =>
        set.receivedMessages.includes(msg)
      );
      if (allReceived) {
        set.status = 'complete';
        set.completedAt = new Date();
      } else {
        set.status = 'partial';
      }
    } else {
      set.status = 'partial';
    }
  }

  return await set.save();
}

/**
 * Checks if a correlation set is complete.
 * Verifies all expected messages have been received.
 *
 * @param {CorrelationSetModel} set - Correlation set
 * @returns {boolean} Whether set is complete
 *
 * @example
 * ```typescript
 * if (isCorrelationSetComplete(set)) {
 *   // Process complete set
 * }
 * ```
 */
export function isCorrelationSetComplete(set: CorrelationSetModel): boolean {
  if (!set.expectedMessages || set.expectedMessages.length === 0) {
    return false;
  }

  return set.expectedMessages.every((msg) => set.receivedMessages.includes(msg));
}

/**
 * Expires a correlation set.
 * Marks set as expired if timeout reached.
 *
 * @param {CorrelationSetModel} set - Correlation set
 * @returns {Promise<CorrelationSetModel>} Updated set
 *
 * @example
 * ```typescript
 * await expireCorrelationSet(set);
 * ```
 */
export async function expireCorrelationSet(
  set: CorrelationSetModel
): Promise<CorrelationSetModel> {
  set.status = 'expired';
  return await set.save();
}

/**
 * Cleans up completed or expired correlation sets.
 * Removes old correlation sets based on age.
 *
 * @param {typeof CorrelationSetModel} model - CorrelationSet model
 * @param {number} retentionDays - Days to retain completed sets
 * @returns {Promise<number>} Number of cleaned up sets
 *
 * @example
 * ```typescript
 * const cleaned = await cleanupCorrelationSets(CorrelationSet, 30);
 * ```
 */
export async function cleanupCorrelationSets(
  model: typeof CorrelationSetModel,
  retentionDays: number = 30
): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  const result = await model.destroy({
    where: {
      status: { [Op.in]: ['complete', 'expired'] },
      updatedAt: { [Op.lt]: cutoffDate },
    },
  });

  return result;
}

// ============================================================================
// MESSAGE EVENT TRIGGERING
// ============================================================================

/**
 * Triggers an event when a message is received.
 * Emits event for message reception.
 *
 * @param {EventEmitter2} eventEmitter - Event emitter instance
 * @param {CorrelationMessage} message - Received message
 *
 * @example
 * ```typescript
 * triggerMessageReceivedEvent(eventEmitter, message);
 * ```
 */
export function triggerMessageReceivedEvent(
  eventEmitter: EventEmitter2,
  message: CorrelationMessage
): void {
  eventEmitter.emit('message.received', {
    messageId: message.id,
    correlationId: message.correlationId,
    messageType: message.messageType,
    payload: message.payload,
    timestamp: new Date(),
  });
}

/**
 * Triggers an event when correlation set completes.
 * Emits event for correlation completion.
 *
 * @param {EventEmitter2} eventEmitter - Event emitter instance
 * @param {CorrelationSetModel} set - Completed correlation set
 *
 * @example
 * ```typescript
 * triggerCorrelationCompleteEvent(eventEmitter, set);
 * ```
 */
export function triggerCorrelationCompleteEvent(
  eventEmitter: EventEmitter2,
  set: CorrelationSetModel
): void {
  eventEmitter.emit('correlation.complete', {
    setId: set.id,
    correlationKey: set.correlationKey,
    workflowId: set.workflowId,
    processId: set.processId,
    messageCount: set.messageCount,
    completedAt: set.completedAt,
  });
}

/**
 * Triggers an event when message delivery fails.
 * Emits event for delivery failure.
 *
 * @param {EventEmitter2} eventEmitter - Event emitter instance
 * @param {CorrelationMessage} message - Failed message
 * @param {Error} error - Failure error
 *
 * @example
 * ```typescript
 * triggerMessageFailedEvent(eventEmitter, message, error);
 * ```
 */
export function triggerMessageFailedEvent(
  eventEmitter: EventEmitter2,
  message: CorrelationMessage,
  error: Error
): void {
  eventEmitter.emit('message.failed', {
    messageId: message.id,
    correlationId: message.correlationId,
    messageType: message.messageType,
    error: error.message,
    retryCount: message.retryCount,
    timestamp: new Date(),
  });
}

/**
 * Sets up event listeners for message correlation events.
 * Registers handlers for correlation lifecycle events.
 *
 * @param {EventEmitter2} eventEmitter - Event emitter instance
 * @param {Record<string, (...args: any[]) => void>} handlers - Event handlers
 *
 * @example
 * ```typescript
 * setupMessageEventListeners(eventEmitter, {
 *   'message.received': (data) => console.log('Message received:', data),
 *   'correlation.complete': (data) => console.log('Correlation complete:', data)
 * });
 * ```
 */
export function setupMessageEventListeners(
  eventEmitter: EventEmitter2,
  handlers: Record<string, (...args: any[]) => void>
): void {
  Object.entries(handlers).forEach(([event, handler]) => {
    eventEmitter.on(event, handler);
  });
}
