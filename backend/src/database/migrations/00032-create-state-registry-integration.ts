import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('registry_connections', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        registryName: { type: DataTypes.STRING(255), allowNull: false, field: 'registry_name' },
        registryType: { type: DataTypes.ENUM('IMMUNIZATION', 'HEALTH_DATA', 'REPORTING'), allowNull: false, field: 'registry_type' },
        state: { type: DataTypes.STRING(2), allowNull: false },
        apiEndpoint: { type: DataTypes.STRING(500), allowNull: false, field: 'api_endpoint' },
        isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
        credentials: { type: DataTypes.JSONB, allowNull: true, comment: 'Encrypted credentials' },
        lastSyncAt: { type: DataTypes.DATE, allowNull: true, field: 'last_sync_at' },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
      }, { transaction });

      await queryInterface.createTable('registry_submissions', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        connectionId: { type: DataTypes.UUID, allowNull: false, references: { model: 'registry_connections', key: 'id' }, field: 'connection_id' },
        recordType: { type: DataTypes.STRING(100), allowNull: false, field: 'record_type' },
        recordId: { type: DataTypes.UUID, allowNull: false, field: 'record_id' },
        submissionData: { type: DataTypes.JSONB, allowNull: false, field: 'submission_data' },
        status: { type: DataTypes.ENUM('PENDING', 'SUBMITTED', 'ACKNOWLEDGED', 'ERROR', 'REJECTED'), allowNull: false, defaultValue: 'PENDING' },
        submittedAt: { type: DataTypes.DATE, allowNull: true, field: 'submitted_at' },
        acknowledgedAt: { type: DataTypes.DATE, allowNull: true, field: 'acknowledged_at' },
        errorMessage: { type: DataTypes.TEXT, allowNull: true, field: 'error_message' },
        retryCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'retry_count' },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
      }, { transaction });

      await queryInterface.addIndex('registry_connections', ['state', 'registry_type'], { name: 'idx_registry_state_type', transaction });
      await queryInterface.addIndex('registry_submissions', ['connection_id'], { name: 'idx_submissions_connection', transaction });
      await queryInterface.addIndex('registry_submissions', ['status'], { name: 'idx_submissions_status', transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('registry_submissions', { transaction });
      await queryInterface.dropTable('registry_connections', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
