import { Table, Column, Model, DataType, PrimaryKey, Default, Index } from 'sequelize-typescript';

/**
 * Session Entity
 * Manages active user sessions for security tracking and concurrent session limits
 */
@Table({
  tableName: 'sessions',
  timestamps: true,
  indexes: [
    { fields: ['userId', 'isActive'] },
    { fields: ['sessionToken'] },
    { fields: ['expiresAt'] },
  ],
})
export class SessionEntity extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  declare id: string;

  @Index({ unique: true })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  sessionToken!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ipAddress!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  userAgent?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastAccessedAt?: Date;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isActive!: boolean;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  metadata?: Record<string, any>; // Device info, location, etc.

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt: Date;
}
