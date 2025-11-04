import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Scopes,
  BeforeCreate,
  BeforeUpdate
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

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
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
@Table({
  tableName: 'threat_detections',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['threatType']
    },
    {
      fields: ['severity']
    },
    {
      fields: ['isResolved']
    },
    {
      fields: ['createdAt'],
      name: 'idx_threat_detection_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_threat_detection_updated_at'
    }
  ]
})
export class ThreatDetection extends Model<ThreatDetectionAttributes> implements ThreatDetectionAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  threatType: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false
  })
  severity: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  source: string;

  @Column({
    type: DataType.JSON,
    allowNull: false
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
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] ThreatDetection ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
