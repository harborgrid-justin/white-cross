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

export interface GrowthTrackingAttributes {
  id?: string;
  studentId: string;
  measurementDate: Date;
  height?: number;
  heightUnit?: string;
  weight?: number;
  weightUnit?: string;
  bmi?: number;
  percentileHeight?: number;
  percentileWeight?: number;
  percentileBmi?: number;
  notes?: string;
  measuredBy: string;
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
  tableName: 'growth_tracking',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    {
      fields: ['studentId'],
    },
    {
      fields: ['measurementDate'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_growth_tracking_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_growth_tracking_updated_at',
    },
  ],
})
export class GrowthTracking
  extends Model<GrowthTrackingAttributes>
  implements GrowthTrackingAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  measurementDate: Date;

  @Column(DataType.FLOAT)
  height?: number;

  @Default('inches')
  @Column(DataType.ENUM('inches', 'cm'))
  heightUnit?: string;

  @Column(DataType.FLOAT)
  weight?: number;

  @Default('lbs')
  @Column(DataType.ENUM('lbs', 'kg'))
  weightUnit?: string;

  @Column(DataType.FLOAT)
  bmi?: number;

  @Column(DataType.FLOAT)
  percentileHeight?: number;

  @Column(DataType.FLOAT)
  percentileWeight?: number;

  @Column(DataType.FLOAT)
  percentileBmi?: number;

  @Column(DataType.TEXT)
  notes?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  measuredBy: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: GrowthTracking) {
    await createModelAuditHook('GrowthTracking', instance);
  }
}

// Default export for Sequelize-TypeScript
export default GrowthTracking;
