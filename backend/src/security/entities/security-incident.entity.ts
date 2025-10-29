import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
} from 'sequelize-typescript';
import {
  SecurityIncidentType,
  IncidentSeverity,
  IncidentStatus,
} from '../enums';

/**
 * Security Incident Entity
 * Tracks security incidents, threats, and their investigation/resolution
 */
@Table({
  tableName: 'security_incidents',
  timestamps: true,
  indexes: [
    { fields: ['type', 'severity', 'status'] },
    { fields: ['userId'] },
    { fields: ['ipAddress'] },
    { fields: ['detectedAt'] },
  ],
})
export class SecurityIncidentEntity extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  declare id: string;

  @Column({
    type: DataType.ENUM(...Object.values(SecurityIncidentType)),
    allowNull: false,
  })
  type: SecurityIncidentType;

  @Column({
    type: DataType.ENUM(...Object.values(IncidentSeverity)),
    allowNull: false,
  })
  severity: IncidentSeverity;

  @Default(IncidentStatus.DETECTED)
  @Column({
    type: DataType.ENUM(...Object.values(IncidentStatus)),
    allowNull: false,
  })
  status: IncidentStatus;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  userId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ipAddress?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  userAgent?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  resourceAccessed?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare detectedAt: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  detectionMethod: string; // 'automated', 'manual', 'pattern_matching', etc.

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  indicators: string[]; // List of indicators that triggered detection

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  impact?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  assignedTo?: string; // User ID of security team member

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  resolvedAt?: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  resolution?: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  preventiveMeasures?: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  metadata?: Record<string, any>; // Additional context-specific data

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt: Date;
}
