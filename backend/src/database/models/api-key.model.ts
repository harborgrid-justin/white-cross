import {
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

/**
 * API Key Model
 *
 * Stores hashed API keys for service-to-service authentication.
 * Keys are hashed using SHA-256 for security.
 */
@Table({
  tableName: 'api_keys',
  timestamps: true,
  underscored: false,
  indexes: [
    { fields: ['keyHash'], unique: true },
    { fields: ['name'] },
    { fields: ['isActive'] },
    { fields: ['expiresAt'] },
  ],
})
export class ApiKey extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Human-readable name for the API key',
  })
  declare name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
    comment: 'SHA-256 hash of the API key',
  })
  declare keyHash: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    comment: 'First 8 characters of the API key for identification',
  })
  declare keyPrefix: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Description of the API key purpose',
  })
  declare description?: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: 'Array of scopes/permissions for this API key',
  })
  declare scopes?: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether the API key is active',
  })
  declare isActive: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Expiration date of the API key',
  })
  declare expiresAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Last time the API key was used',
  })
  declare lastUsedAt?: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of times the API key has been used',
  })
  declare usageCount: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'User who created the API key',
  })
  declare createdBy: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment: 'IP address restriction pattern (CIDR notation)',
  })
  declare ipRestriction?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Rate limit (requests per minute) for this API key',
  })
  declare rateLimit?: number;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;

  /**
   * Check if the API key is expired
   */
  isExpired(): boolean {
    if (!this.expiresAt) return false;
    return this.expiresAt < new Date();
  }

  /**
   * Check if the API key is valid
   */
  isValid(): boolean {
    return this.isActive && !this.isExpired();
  }
}
