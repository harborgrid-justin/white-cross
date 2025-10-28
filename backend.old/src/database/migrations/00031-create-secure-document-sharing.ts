import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('shared_documents', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        documentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'documents', key: 'id' }, field: 'document_id' },
        sharedBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' }, field: 'shared_by' },
        sharedWith: { type: DataTypes.ARRAY(DataTypes.UUID), allowNull: false, field: 'shared_with' },
        accessLevel: { type: DataTypes.ENUM('VIEW', 'DOWNLOAD', 'EDIT'), allowNull: false, defaultValue: 'VIEW', field: 'access_level' },
        expiresAt: { type: DataTypes.DATE, allowNull: true, field: 'expires_at' },
        isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
        requiresPassword: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'requires_password' },
        passwordHash: { type: DataTypes.STRING(255), allowNull: true, field: 'password_hash' },
        maxDownloads: { type: DataTypes.INTEGER, allowNull: true, field: 'max_downloads' },
        downloadCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'download_count' },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
      }, { transaction });

      await queryInterface.createTable('document_access_log', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        sharedDocumentId: { type: DataTypes.UUID, allowNull: false, references: { model: 'shared_documents', key: 'id' }, field: 'shared_document_id' },
        accessedBy: { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' }, field: 'accessed_by' },
        action: { type: DataTypes.ENUM('VIEWED', 'DOWNLOADED', 'EDITED'), allowNull: false },
        ipAddress: { type: DataTypes.INET, allowNull: true, field: 'ip_address' },
        accessedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'accessed_at' },
      }, { transaction });

      await queryInterface.addIndex('shared_documents', ['document_id'], { name: 'idx_shared_docs_document', transaction });
      await queryInterface.addIndex('shared_documents', ['shared_by'], { name: 'idx_shared_docs_sharer', transaction });
      await queryInterface.addIndex('document_access_log', ['shared_document_id'], { name: 'idx_doc_access_shared_doc', transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('document_access_log', { transaction });
      await queryInterface.dropTable('shared_documents', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
