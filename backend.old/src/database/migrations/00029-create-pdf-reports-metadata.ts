import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('report_definitions', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING(255), allowNull: false },
        templateType: { type: DataTypes.ENUM('HEALTH_SUMMARY', 'MEDICATION_LOG', 'IMMUNIZATION_REPORT', 'INCIDENT_REPORT', 'CUSTOM'), allowNull: false, field: 'template_type' },
        parameters: { type: DataTypes.JSONB, allowNull: true },
        isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
        createdBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' }, field: 'created_by' },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
      }, { transaction });

      await queryInterface.createTable('report_instances', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        definitionId: { type: DataTypes.UUID, allowNull: true, references: { model: 'report_definitions', key: 'id' }, field: 'definition_id' },
        title: { type: DataTypes.STRING(500), allowNull: false },
        status: { type: DataTypes.ENUM('GENERATING', 'COMPLETED', 'FAILED'), allowNull: false, defaultValue: 'GENERATING' },
        filePath: { type: DataTypes.STRING(500), allowNull: true, field: 'file_path' },
        fileSize: { type: DataTypes.INTEGER, allowNull: true, field: 'file_size' },
        generatedBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' }, field: 'generated_by' },
        generatedAt: { type: DataTypes.DATE, allowNull: true, field: 'generated_at' },
        expiresAt: { type: DataTypes.DATE, allowNull: true, field: 'expires_at' },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
      }, { transaction });

      await queryInterface.addIndex('report_instances', ['generated_by'], { name: 'idx_reports_user', transaction });
      await queryInterface.addIndex('report_instances', ['status'], { name: 'idx_reports_status', transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('report_instances', { transaction });
      await queryInterface.dropTable('report_definitions', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
