import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('scheduled_exports', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING(255), allowNull: false },
        exportType: { type: DataTypes.ENUM('STUDENT_DATA', 'HEALTH_RECORDS', 'MEDICATIONS', 'INCIDENTS', 'CUSTOM'), allowNull: false, field: 'export_type' },
        format: { type: DataTypes.ENUM('CSV', 'XLSX', 'JSON', 'PDF'), allowNull: false },
        schedule: { type: DataTypes.STRING(100), allowNull: false, comment: 'Cron expression' },
        filters: { type: DataTypes.JSONB, allowNull: true },
        destination: { type: DataTypes.JSONB, allowNull: false, comment: 'Export destination config' },
        isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
        lastRunAt: { type: DataTypes.DATE, allowNull: true, field: 'last_run_at' },
        nextRunAt: { type: DataTypes.DATE, allowNull: true, field: 'next_run_at' },
        createdBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' }, field: 'created_by' },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
      }, { transaction });

      await queryInterface.createTable('export_jobs', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        scheduledExportId: { type: DataTypes.UUID, allowNull: true, references: { model: 'scheduled_exports', key: 'id' }, field: 'scheduled_export_id' },
        status: { type: DataTypes.ENUM('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED'), allowNull: false, defaultValue: 'QUEUED' },
        recordsProcessed: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'records_processed' },
        filePath: { type: DataTypes.STRING(500), allowNull: true, field: 'file_path' },
        fileSize: { type: DataTypes.INTEGER, allowNull: true, field: 'file_size' },
        errorMessage: { type: DataTypes.TEXT, allowNull: true, field: 'error_message' },
        startedAt: { type: DataTypes.DATE, allowNull: true, field: 'started_at' },
        completedAt: { type: DataTypes.DATE, allowNull: true, field: 'completed_at' },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
      }, { transaction });

      await queryInterface.addIndex('scheduled_exports', ['is_active'], { name: 'idx_exports_active', transaction });
      await queryInterface.addIndex('export_jobs', ['status'], { name: 'idx_export_jobs_status', transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('export_jobs', { transaction });
      await queryInterface.dropTable('scheduled_exports', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
