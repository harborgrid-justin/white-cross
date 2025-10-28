import { QueryInterface, DataTypes } from 'sequelize';

/**
 * Migration: Real-Time Alerts System
 * Feature 26: Real-Time Emergency Alert Infrastructure
 *
 * Creates tables for WebSocket-based real-time alerting:
 * - alert_definitions: Alert rules and configuration
 * - alert_instances: Active and historical alerts
 * - alert_subscriptions: User notification preferences
 * - alert_delivery_log: Delivery tracking and confirmation
 */

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Create ENUM types
      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE alert_severity AS ENUM (
            'INFO',
            'LOW',
            'MEDIUM',
            'HIGH',
            'CRITICAL',
            'EMERGENCY'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE alert_category AS ENUM (
            'MEDICATION',
            'ALLERGY',
            'CHRONIC_CONDITION',
            'EMERGENCY_ACTION',
            'OUTBREAK',
            'DRUG_INTERACTION',
            'COMPLIANCE',
            'SECURITY',
            'SYSTEM'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE alert_status AS ENUM (
            'PENDING',
            'ACTIVE',
            'ACKNOWLEDGED',
            'RESOLVED',
            'ESCALATED',
            'CANCELLED',
            'EXPIRED'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE delivery_channel AS ENUM (
            'WEBSOCKET',
            'EMAIL',
            'SMS',
            'PUSH',
            'IN_APP',
            'PHONE_CALL'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      // Create alert definitions table
      await queryInterface.createTable('alert_definitions', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        category: {
          type: 'alert_category',
          allowNull: false,
        },
        defaultSeverity: {
          type: 'alert_severity',
          allowNull: false,
          field: 'default_severity',
        },
        triggerConditions: {
          type: DataTypes.JSONB,
          allowNull: false,
          comment: 'JSON definition of trigger conditions',
          field: 'trigger_conditions',
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
        },
        requiresAcknowledgment: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'requires_acknowledgment',
        },
        autoEscalateAfterMinutes: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment: 'Auto-escalate if not acknowledged within X minutes',
          field: 'auto_escalate_after_minutes',
        },
        notificationChannels: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: ['WEBSOCKET', 'IN_APP'],
          field: 'notification_channels',
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
          field: 'created_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'updated_at',
        },
      }, { transaction });

      // Create indexes for alert definitions
      await queryInterface.addIndex('alert_definitions', ['category'], {
        name: 'idx_alert_definitions_category',
        transaction,
      });

      await queryInterface.addIndex('alert_definitions', ['is_active'], {
        name: 'idx_alert_definitions_active',
        transaction,
      });

      // Create alert instances table
      await queryInterface.createTable('alert_instances', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        definitionId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'alert_definitions',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          field: 'definition_id',
        },
        title: {
          type: DataTypes.STRING(500),
          allowNull: false,
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        severity: {
          type: 'alert_severity',
          allowNull: false,
        },
        category: {
          type: 'alert_category',
          allowNull: false,
        },
        status: {
          type: 'alert_status',
          allowNull: false,
          defaultValue: 'ACTIVE',
        },
        studentId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'students',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          field: 'student_id',
        },
        relatedEntityType: {
          type: DataTypes.STRING(100),
          allowNull: true,
          comment: 'Type of related entity (e.g., Medication, Incident)',
          field: 'related_entity_type',
        },
        relatedEntityId: {
          type: DataTypes.UUID,
          allowNull: true,
          comment: 'ID of related entity',
          field: 'related_entity_id',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
          comment: 'Additional alert data',
        },
        actionRequired: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'action_required',
        },
        actionUrl: {
          type: DataTypes.STRING(500),
          allowNull: true,
          field: 'action_url',
        },
        triggeredAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'triggered_at',
        },
        acknowledgedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'acknowledged_at',
        },
        acknowledgedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          field: 'acknowledged_by',
        },
        resolvedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'resolved_at',
        },
        resolvedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          field: 'resolved_by',
        },
        resolutionNotes: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'resolution_notes',
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'expires_at',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'updated_at',
        },
      }, { transaction });

      // Create indexes for alert instances
      await queryInterface.addIndex('alert_instances', ['status'], {
        name: 'idx_alert_instances_status',
        transaction,
      });

      await queryInterface.addIndex('alert_instances', ['severity'], {
        name: 'idx_alert_instances_severity',
        transaction,
      });

      await queryInterface.addIndex('alert_instances', ['student_id'], {
        name: 'idx_alert_instances_student',
        transaction,
      });

      await queryInterface.addIndex('alert_instances', ['category', 'status'], {
        name: 'idx_alert_instances_category_status',
        transaction,
      });

      await queryInterface.addIndex('alert_instances', ['triggered_at'], {
        name: 'idx_alert_instances_triggered',
        transaction,
      });

      // Partial index for active alerts
      await queryInterface.addIndex('alert_instances', ['status', 'severity'], {
        name: 'idx_alert_instances_active_severity',
        where: { status: 'ACTIVE' },
        transaction,
      });

      // Create alert subscriptions table
      await queryInterface.createTable('alert_subscriptions', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          field: 'user_id',
        },
        category: {
          type: 'alert_category',
          allowNull: true,
          comment: 'Null means all categories',
        },
        minSeverity: {
          type: 'alert_severity',
          allowNull: false,
          defaultValue: 'LOW',
          field: 'min_severity',
        },
        channels: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: ['WEBSOCKET', 'IN_APP'],
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
        },
        studentFilter: {
          type: DataTypes.ARRAY(DataTypes.UUID),
          allowNull: true,
          comment: 'Array of student IDs to filter by (null = all students)',
          field: 'student_filter',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'updated_at',
        },
      }, { transaction });

      // Create indexes for subscriptions
      await queryInterface.addIndex('alert_subscriptions', ['user_id'], {
        name: 'idx_alert_subscriptions_user',
        transaction,
      });

      await queryInterface.addIndex('alert_subscriptions', ['category'], {
        name: 'idx_alert_subscriptions_category',
        transaction,
      });

      await queryInterface.addIndex('alert_subscriptions', ['is_active'], {
        name: 'idx_alert_subscriptions_active',
        transaction,
      });

      // Create alert delivery log table
      await queryInterface.createTable('alert_delivery_log', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        alertId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'alert_instances',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          field: 'alert_id',
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          field: 'user_id',
        },
        channel: {
          type: 'delivery_channel',
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM('QUEUED', 'SENT', 'DELIVERED', 'FAILED', 'BOUNCED'),
          allowNull: false,
          defaultValue: 'QUEUED',
        },
        attemptCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          field: 'attempt_count',
        },
        errorMessage: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'error_message',
        },
        sentAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'sent_at',
        },
        deliveredAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'delivered_at',
        },
        readAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'read_at',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
      }, { transaction });

      // Create indexes for delivery log
      await queryInterface.addIndex('alert_delivery_log', ['alert_id'], {
        name: 'idx_alert_delivery_alert',
        transaction,
      });

      await queryInterface.addIndex('alert_delivery_log', ['user_id'], {
        name: 'idx_alert_delivery_user',
        transaction,
      });

      await queryInterface.addIndex('alert_delivery_log', ['status'], {
        name: 'idx_alert_delivery_status',
        transaction,
      });

      await queryInterface.addIndex('alert_delivery_log', ['sent_at'], {
        name: 'idx_alert_delivery_sent',
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Drop tables
      await queryInterface.dropTable('alert_delivery_log', { transaction });
      await queryInterface.dropTable('alert_subscriptions', { transaction });
      await queryInterface.dropTable('alert_instances', { transaction });
      await queryInterface.dropTable('alert_definitions', { transaction });

      // Drop ENUM types
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS delivery_channel;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS alert_status;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS alert_category;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS alert_severity;', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
