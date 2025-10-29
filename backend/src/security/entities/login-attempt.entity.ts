import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
} from 'sequelize-typescript';

/**
 * Login Attempt Entity
 * Tracks successful and failed login attempts for brute force detection
 */
@Table({
  tableName: 'login_attempts',
  timestamps: true,
  indexes: [
    { fields: ['userId', 'createdAt'] },
    { fields: ['ipAddress', 'createdAt'] },
    { fields: ['success', 'createdAt'] },
  ],
})
export class LoginAttemptEntity extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  userId?: string; // May be null if login attempt failed before user identification

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  username?: string; // Attempted username/email

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ipAddress: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  userAgent?: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  success: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  failureReason?: string; // e.g., 'invalid_password', 'user_not_found', 'account_locked'

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  metadata?: Record<string, any>; // Additional context (e.g., 2FA status, device info)
}
