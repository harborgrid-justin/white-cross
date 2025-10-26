import { QueryInterface, DataTypes } from 'sequelize';

/**
 * Migration: Outbreak Detection System
 * Feature 37: Trend analysis and outbreak spike detection
 */

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Create symptom tracking table
      await queryInterface.createTable('symptom_tracking', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        studentId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'students', key: 'id' },
          field: 'student_id',
        },
        symptoms: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
        },
        severity: {
          type: DataTypes.ENUM('MILD', 'MODERATE', 'SEVERE'),
          allowNull: false,
          defaultValue: 'MILD',
        },
        onsetDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'onset_date',
        },
        diagnosisCode: {
          type: DataTypes.STRING(20),
          allowNull: true,
          field: 'diagnosis_code',
        },
        reportedBy: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          field: 'reported_by',
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
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

      // Create outbreak alerts table
      await queryInterface.createTable('outbreak_alerts', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        condition: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        severity: {
          type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
          allowNull: false,
          defaultValue: 'MEDIUM',
        },
        affectedCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'affected_count',
        },
        expectedCount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          field: 'expected_count',
        },
        statisticalSignificance: {
          type: DataTypes.DECIMAL(5, 4),
          allowNull: false,
          comment: 'P-value for statistical significance',
          field: 'statistical_significance',
        },
        detectedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'detected_at',
        },
        status: {
          type: DataTypes.ENUM('ACTIVE', 'MONITORING', 'RESOLVED', 'FALSE_POSITIVE'),
          allowNull: false,
          defaultValue: 'ACTIVE',
        },
        reportedToHealthDept: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'reported_to_health_dept',
        },
        reportedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'reported_at',
        },
        resolvedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'resolved_at',
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
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

      // Create outbreak case clusters table
      await queryInterface.createTable('outbreak_case_clusters', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        outbreakAlertId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'outbreak_alerts', key: 'id' },
          field: 'outbreak_alert_id',
        },
        symptomTrackingId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'symptom_tracking', key: 'id' },
          field: 'symptom_tracking_id',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
      }, { transaction });

      // Create indexes
      await queryInterface.addIndex('symptom_tracking', ['student_id'], {
        name: 'idx_symptom_tracking_student',
        transaction,
      });

      await queryInterface.addIndex('symptom_tracking', ['onset_date'], {
        name: 'idx_symptom_tracking_date',
        transaction,
      });

      await queryInterface.addIndex('symptom_tracking', ['symptoms'], {
        name: 'idx_symptom_tracking_symptoms',
        using: 'GIN',
        transaction,
      });

      await queryInterface.addIndex('outbreak_alerts', ['condition', 'status'], {
        name: 'idx_outbreak_alerts_condition_status',
        transaction,
      });

      await queryInterface.addIndex('outbreak_alerts', ['detected_at'], {
        name: 'idx_outbreak_alerts_date',
        transaction,
      });

      await queryInterface.addIndex('outbreak_case_clusters', ['outbreak_alert_id'], {
        name: 'idx_clusters_outbreak',
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
      await queryInterface.dropTable('outbreak_case_clusters', { transaction });
      await queryInterface.dropTable('outbreak_alerts', { transaction });
      await queryInterface.dropTable('symptom_tracking', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
