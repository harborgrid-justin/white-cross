import { QueryInterface, DataTypes } from 'sequelize';

/**
 * Migration: Encryption Key Management Tables
 * Feature 32: End-to-End Encryption UI & Key Management
 *
 * Creates tables for encryption key lifecycle management:
 * - encryption_keys: Master key records
 * - key_rotation_history: Key rotation audit trail
 * - encrypted_field_metadata: Track which fields are encrypted
 */

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Create ENUM types
      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE key_type AS ENUM (
            'MASTER',
            'DATA_ENCRYPTION',
            'BACKUP',
            'ARCHIVE'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE key_status AS ENUM (
            'ACTIVE',
            'ROTATING',
            'EXPIRED',
            'REVOKED',
            'ARCHIVED'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE encryption_algorithm AS ENUM (
            'AES_256_GCM',
            'AES_256_CBC',
            'RSA_4096',
            'CHACHA20_POLY1305'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      // Create encryption keys table
      await queryInterface.createTable('encryption_keys', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        keyIdentifier: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
          comment: 'Public identifier for the key (not the actual key)',
          field: 'key_identifier',
        },
        keyType: {
          type: 'key_type',
          allowNull: false,
          field: 'key_type',
        },
        algorithm: {
          type: 'encryption_algorithm',
          allowNull: false,
        },
        status: {
          type: 'key_status',
          allowNull: false,
          defaultValue: 'ACTIVE',
        },
        keyHash: {
          type: DataTypes.STRING(64),
          allowNull: false,
          comment: 'SHA-256 hash of the key for verification (not the key itself)',
          field: 'key_hash',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
        activatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'activated_at',
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
          comment: 'Key rotation required after this date (quarterly)',
          field: 'expires_at',
        },
        rotatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'rotated_at',
        },
        revokedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'revoked_at',
        },
        revokedBy: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          field: 'revoked_by',
        },
        revocationReason: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'revocation_reason',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
          comment: 'Additional metadata (e.g., key generation parameters)',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'updated_at',
        },
      }, { transaction });

      // Create indexes
      await queryInterface.addIndex('encryption_keys', ['key_identifier'], {
        name: 'idx_encryption_keys_identifier',
        unique: true,
        transaction,
      });

      await queryInterface.addIndex('encryption_keys', ['status'], {
        name: 'idx_encryption_keys_status',
        transaction,
      });

      await queryInterface.addIndex('encryption_keys', ['expires_at'], {
        name: 'idx_encryption_keys_expiry',
        transaction,
      });

      await queryInterface.addIndex('encryption_keys', ['key_type', 'status'], {
        name: 'idx_encryption_keys_type_status',
        transaction,
      });

      // Create key rotation history table
      await queryInterface.createTable('key_rotation_history', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        oldKeyId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'encryption_keys',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
          field: 'old_key_id',
        },
        newKeyId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'encryption_keys',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
          field: 'new_key_id',
        },
        rotationType: {
          type: DataTypes.ENUM('SCHEDULED', 'EMERGENCY', 'COMPROMISED'),
          allowNull: false,
          field: 'rotation_type',
        },
        reason: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        recordsReencrypted: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'records_reencrypted',
        },
        rotatedBy: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
          field: 'rotated_by',
        },
        startedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'started_at',
        },
        completedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'completed_at',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
      }, { transaction });

      // Create indexes for rotation history
      await queryInterface.addIndex('key_rotation_history', ['old_key_id'], {
        name: 'idx_rotation_history_old_key',
        transaction,
      });

      await queryInterface.addIndex('key_rotation_history', ['new_key_id'], {
        name: 'idx_rotation_history_new_key',
        transaction,
      });

      await queryInterface.addIndex('key_rotation_history', ['started_at'], {
        name: 'idx_rotation_history_date',
        transaction,
      });

      // Create encrypted field metadata table
      await queryInterface.createTable('encrypted_field_metadata', {
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
        fieldName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'field_name',
        },
        recordId: {
          type: DataTypes.UUID,
          allowNull: false,
          comment: 'ID of the record containing the encrypted field',
          field: 'record_id',
        },
        encryptionKeyId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'encryption_keys',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
          field: 'encryption_key_id',
        },
        algorithm: {
          type: 'encryption_algorithm',
          allowNull: false,
        },
        initializationVector: {
          type: DataTypes.STRING(255),
          allowNull: false,
          comment: 'IV used for encryption (stored separately)',
          field: 'initialization_vector',
        },
        encryptedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'encrypted_at',
        },
        lastAccessedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'last_accessed_at',
        },
        accessCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'access_count',
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

      // Create indexes for encrypted fields
      await queryInterface.addIndex('encrypted_field_metadata', ['table_name', 'record_id'], {
        name: 'idx_encrypted_fields_record',
        transaction,
      });

      await queryInterface.addIndex('encrypted_field_metadata', ['encryption_key_id'], {
        name: 'idx_encrypted_fields_key',
        transaction,
      });

      await queryInterface.addIndex('encrypted_field_metadata', ['encrypted_at'], {
        name: 'idx_encrypted_fields_date',
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
      await queryInterface.dropTable('encrypted_field_metadata', { transaction });
      await queryInterface.dropTable('key_rotation_history', { transaction });
      await queryInterface.dropTable('encryption_keys', { transaction });

      // Drop ENUM types
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS encryption_algorithm;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS key_status;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS key_type;', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
