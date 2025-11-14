import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export interface ThreatDetectionAttributes {
  id?: string;
  threatType: string;
  severity: string;
  source: string;
  details: any;
  isResolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'threat_detections',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['threatType'],
    },
    {
      fields: ['severity'],
    },
    {
      fields: ['isResolved'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_threat_detection_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_threat_detection_updated_at',
    },
  ],
})
export class ThreatDetection
  extends Model<ThreatDetectionAttributes>
  implements ThreatDetectionAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  threatType: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  severity: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  source: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  details: any;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isResolved: boolean;

  @Column(DataType.DATE)
  resolvedAt?: Date;

  @Column(DataType.UUID)
  resolvedBy?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: ThreatDetection) {
    await createModelAuditHook('ThreatDetection', instance);
  }
}
