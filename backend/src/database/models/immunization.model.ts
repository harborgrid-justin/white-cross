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

export interface ImmunizationAttributes {
  id?: string;
  studentId: string;
  vaccineName: string;
  vaccineCode?: string;
  administeredDate: Date;
  expirationDate?: Date;
  dosage?: string;
  site?: string;
  route?: string;
  manufacturer?: string;
  lotNumber?: string;
  administeredBy: string;
  notes?: string;
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
  tableName: 'immunizations',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    {
      fields: ['studentId'],
    },
    {
      fields: ['vaccineName'],
    },
    {
      fields: ['administeredDate'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_immunization_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_immunization_updated_at',
    },
  ],
})
export class Immunization
  extends Model<ImmunizationAttributes>
  implements ImmunizationAttributes
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
    type: DataType.STRING(255),
    allowNull: false,
  })
  vaccineName: string;

  @Column(DataType.STRING(50))
  vaccineCode?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  administeredDate: Date;

  @Column(DataType.DATE)
  expirationDate?: Date;

  @Column(DataType.STRING(50))
  dosage?: string;

  @Column(DataType.STRING(50))
  site?: string;

  @Column(DataType.STRING(50))
  route?: string;

  @Column(DataType.STRING(255))
  manufacturer?: string;

  @Column(DataType.STRING(100))
  lotNumber?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  administeredBy: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: Immunization) {
    await createModelAuditHook('Immunization', instance);
  }
}
