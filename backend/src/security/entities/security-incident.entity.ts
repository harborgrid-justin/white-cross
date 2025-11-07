import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import { SecurityIncidentType, IncidentSeverity, IncidentStatus } from '../enums';

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
    type: DataType.ENUM(...(Object.values(SecurityIncidentType) as string[])),
    allowNull: false,
  })
  type!: SecurityIncidentType;

  @Column({
    type: DataType.ENUM(...(Object.values(IncidentSeverity) as string[])),
    allowNull: false,
  })
  severity!: IncidentSeverity;

  @Default(IncidentStatus.DETECTED)
  @Column({
    type: DataType.ENUM(...(Object.values(IncidentStatus) as string[])),
    allowNull: false,
  })
  status!: IncidentStatus;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'userId',
  })
  userId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'ipAddress',
  })
  ipAddress?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'userAgent',
  })
  userAgent?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'resourceAccessed',
  })
  resourceAccessed?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'detectedAt',
  })
  declare detectedAt: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'detectionMethod',
  })
  detectionMethod!: string; // 'automated', 'manual', 'pattern_matching', etc.

  @Column({
    type: DataType.JSON,
    allowNull: false,
    field: 'indicators',
  })
  indicators!: string[]; // List of indicators that triggered detection

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'impact',
  })
  impact?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'assignedTo',
  })
  assignedTo?: string; // User ID of security team member

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'resolvedAt',
  })
  resolvedAt?: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'resolution',
  })
  resolution?: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'preventiveMeasures',
  })
  preventiveMeasures?: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'metadata',
  })
  metadata?: Record<string, any>; // Additional context-specific data

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'updatedAt',
  })
  declare updatedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'createdAt',
  })
  declare createdAt: Date;
}
