import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

export enum KeyType { MASTER = 'MASTER', DATA_ENCRYPTION = 'DATA_ENCRYPTION', BACKUP = 'BACKUP', ARCHIVE = 'ARCHIVE' }
export enum KeyStatus { ACTIVE = 'ACTIVE', ROTATING = 'ROTATING', EXPIRED = 'EXPIRED', REVOKED = 'REVOKED', ARCHIVED = 'ARCHIVED' }
export enum EncryptionAlgorithm { AES_256_GCM = 'AES_256_GCM', AES_256_CBC = 'AES_256_CBC', RSA_4096 = 'RSA_4096', CHACHA20_POLY1305 = 'CHACHA20_POLY1305' }

export interface EncryptionKeyAttributes {
  id: string;
  keyIdentifier: string;
  keyType: KeyType;
  algorithm: EncryptionAlgorithm;
  status: KeyStatus;
  keyHash: string;
  createdAt: Date;
  activatedAt?: Date;
  expiresAt: Date;
  rotatedAt?: Date;
  revokedAt?: Date;
  revokedBy?: string;
  revocationReason?: string;
  metadata?: Record<string, any>;
  updatedAt: Date;
}

export interface EncryptionKeyCreationAttributes extends Optional<EncryptionKeyAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

class EncryptionKey extends Model<EncryptionKeyAttributes, EncryptionKeyCreationAttributes> implements EncryptionKeyAttributes {
  public id!: string;
  public keyIdentifier!: string;
  public keyType!: KeyType;
  public algorithm!: EncryptionAlgorithm;
  public status!: KeyStatus;
  public keyHash!: string;
  public createdAt!: Date;
  public activatedAt?: Date;
  public expiresAt!: Date;
  public rotatedAt?: Date;
  public revokedAt?: Date;
  public revokedBy?: string;
  public revocationReason?: string;
  public metadata?: Record<string, any>;
  public updatedAt!: Date;

  public isExpired(): boolean { return new Date() > this.expiresAt; }
  public needsRotation(): boolean { return this.status === KeyStatus.ACTIVE && new Date() > this.expiresAt; }

  public static initialize(sequelize: Sequelize): typeof EncryptionKey {
    EncryptionKey.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        keyIdentifier: { type: DataTypes.STRING(100), allowNull: false, unique: true, field: 'key_identifier' },
        keyType: { type: DataTypes.ENUM(...Object.values(KeyType)), allowNull: false, field: 'key_type' },
        algorithm: { type: DataTypes.ENUM(...Object.values(EncryptionAlgorithm)), allowNull: false },
        status: { type: DataTypes.ENUM(...Object.values(KeyStatus)), allowNull: false, defaultValue: KeyStatus.ACTIVE },
        keyHash: { type: DataTypes.STRING(64), allowNull: false, field: 'key_hash' },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        activatedAt: { type: DataTypes.DATE, allowNull: true, field: 'activated_at' },
        expiresAt: { type: DataTypes.DATE, allowNull: false, field: 'expires_at' },
        rotatedAt: { type: DataTypes.DATE, allowNull: true, field: 'rotated_at' },
        revokedAt: { type: DataTypes.DATE, allowNull: true, field: 'revoked_at' },
        revokedBy: { type: DataTypes.UUID, allowNull: true, field: 'revoked_by' },
        revocationReason: { type: DataTypes.TEXT, allowNull: true, field: 'revocation_reason' },
        metadata: { type: DataTypes.JSONB, allowNull: true },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
      },
      { sequelize, tableName: 'encryption_keys', modelName: 'EncryptionKey', timestamps: true, underscored: true }
    );
    return EncryptionKey;
  }

  public static associate(models: any): void {
    EncryptionKey.belongsTo(models.User, { foreignKey: 'revokedBy', as: 'revoker' });
  }

  public static async findActiveKeys(): Promise<EncryptionKey[]> {
    return this.findAll({ where: { status: KeyStatus.ACTIVE }, order: [['createdAt', 'DESC']] });
  }

  public static async findKeysNeedingRotation(): Promise<EncryptionKey[]> {
    return this.findAll({ where: { status: KeyStatus.ACTIVE, expiresAt: { [sequelize.Op.lte]: new Date() } } });
  }
}

export default EncryptionKey;
