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

export interface HealthScreeningAttributes {
  id?: string;
  studentId: string;
  screeningType: string;
  screeningDate: Date;
  results: any;
  passed: boolean;
  notes?: string;
  conductedBy: string;
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
  tableName: 'health_screenings',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    {
      fields: ['studentId'],
    },
    {
      fields: ['screeningType'],
    },
    {
      fields: ['screeningDate'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_health_screening_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_health_screening_updated_at',
    },
  ],
})
export class HealthScreening
  extends Model<HealthScreeningAttributes>
  implements HealthScreeningAttributes
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
    type: DataType.STRING(100),
    allowNull: false,
  })
  screeningType: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  screeningDate: Date;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  results: any;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  passed: boolean;

  @Column(DataType.TEXT)
  notes?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  conductedBy: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: HealthScreening) {
    await createModelAuditHook('HealthScreening', instance);
  }
}

// Default export for Sequelize-TypeScript
export default HealthScreening;
