import { QueryInterface, DataTypes } from 'sequelize';

/**
 * Migration: Tamper Alert System
 * Feature 33: Security tamper detection and alerting
 */

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Create tamper alerts table
      await queryInterface.createTable('tamper_alerts', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        tableName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'table_name',
        },
        recordId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'record_id',
        },
        fieldName: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'field_name',
        },
        severity: {
          type: DataTypes.ENUM('INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
          allowNull: false,
          defaultValue: 'MEDIUM',
        },
        detectedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'detected_at',
        },
        expectedChecksum: {
          type: DataTypes.STRING(64),
          allowNull: false,
          field: 'expected_checksum',
        },
        actualChecksum: {
          type: DataTypes.STRING(64),
          allowNull: false,
          field: 'actual_checksum',
        },
        alertMessage: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: 'alert_message',
        },
        acknowledgedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'acknowledged_at',
        },
        acknowledgedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          field: 'acknowledged_by',
        },
        resolvedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'resolved_at',
        },
        resolutionNotes: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'resolution_notes',
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

      // Create data integrity checksums table
      await queryInterface.createTable('data_integrity_checksums', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        tableName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'table_name',
        },
        recordId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'record_id',
        },
        checksum: {
          type: DataTypes.STRING(64),
          allowNull: false,
        },
        algorithm: {
          type: DataTypes.STRING(20),
          allowNull: false,
          defaultValue: 'SHA-256',
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

      // Create indexes
      await queryInterface.addIndex('tamper_alerts', ['table_name', 'record_id'], {
        name: 'idx_tamper_alerts_record',
        transaction,
      });

      await queryInterface.addIndex('data_integrity_checksums', ['table_name', 'record_id'], {
        name: 'idx_checksums_record',
        unique: true,
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
      await queryInterface.dropTable('data_integrity_checksums', { transaction });
      await queryInterface.dropTable('tamper_alerts', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
