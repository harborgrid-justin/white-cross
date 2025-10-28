import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('sis_sync_configs', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        sisProvider: { type: DataTypes.ENUM('POWERSCHOOL', 'INFINITE_CAMPUS', 'SKYWARD', 'CUSTOM'), allowNull: false, field: 'sis_provider' },
        syncDirection: { type: DataTypes.ENUM('IMPORT', 'EXPORT', 'BIDIRECTIONAL'), allowNull: false, field: 'sync_direction' },
        entityType: { type: DataTypes.ENUM('STUDENTS', 'ENROLLMENT', 'ATTENDANCE', 'DEMOGRAPHICS'), allowNull: false, field: 'entity_type' },
        schedule: { type: DataTypes.STRING(100), allowNull: false, comment: 'Cron expression' },
        fieldMappings: { type: DataTypes.JSONB, allowNull: false, field: 'field_mappings' },
        isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
        lastSyncAt: { type: DataTypes.DATE, allowNull: true, field: 'last_sync_at' },
        nextSyncAt: { type: DataTypes.DATE, allowNull: true, field: 'next_sync_at' },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
      }, { transaction });

      await queryInterface.createTable('sis_sync_jobs', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        configId: { type: DataTypes.UUID, allowNull: false, references: { model: 'sis_sync_configs', key: 'id' }, field: 'config_id' },
        status: { type: DataTypes.ENUM('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'PARTIAL'), allowNull: false, defaultValue: 'QUEUED' },
        recordsProcessed: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'records_processed' },
        recordsSucceeded: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'records_succeeded' },
        recordsFailed: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'records_failed' },
        errorSummary: { type: DataTypes.JSONB, allowNull: true, field: 'error_summary' },
        startedAt: { type: DataTypes.DATE, allowNull: true, field: 'started_at' },
        completedAt: { type: DataTypes.DATE, allowNull: true, field: 'completed_at' },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
      }, { transaction });

      await queryInterface.createTable('sis_sync_errors', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        jobId: { type: DataTypes.UUID, allowNull: false, references: { model: 'sis_sync_jobs', key: 'id' }, field: 'job_id' },
        recordIdentifier: { type: DataTypes.STRING(255), allowNull: false, field: 'record_identifier' },
        errorType: { type: DataTypes.STRING(100), allowNull: false, field: 'error_type' },
        errorMessage: { type: DataTypes.TEXT, allowNull: false, field: 'error_message' },
        recordData: { type: DataTypes.JSONB, allowNull: true, field: 'record_data' },
        resolvedAt: { type: DataTypes.DATE, allowNull: true, field: 'resolved_at' },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
      }, { transaction });

      await queryInterface.addIndex('sis_sync_configs', ['is_active'], { name: 'idx_sis_config_active', transaction });
      await queryInterface.addIndex('sis_sync_jobs', ['status'], { name: 'idx_sis_jobs_status', transaction });
      await queryInterface.addIndex('sis_sync_errors', ['job_id'], { name: 'idx_sis_errors_job', transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('sis_sync_errors', { transaction });
      await queryInterface.dropTable('sis_sync_jobs', { transaction });
      await queryInterface.dropTable('sis_sync_configs', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
