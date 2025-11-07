import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Scopes,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

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
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] GrowthTracking ${instance.id} modified at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
