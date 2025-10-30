import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  BeforeCreate,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export interface MedicationAttributes {
  id: string;
  name: string;
  genericName?: string;
  dosageForm: string;
  strength: string;
  manufacturer?: string;
  ndc?: string;
  isControlled: boolean;
  deaSchedule?: 'I' | 'II' | 'III' | 'IV' | 'V';
  requiresWitness: boolean;
  isActive: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

@Table({
  tableName: 'medications',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    {
      fields: ['name'],
    },
    {
      fields: ['genericName'],
    },
    {
      fields: ['ndc'],
      unique: true,
    },
    {
      fields: ['isControlled'],
    },
    {
      fields: ['isActive'],
    },
  ],
})
export class Medication extends Model<MedicationAttributes> implements MedicationAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column(DataType.STRING(255))
  genericName?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  dosageForm: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  strength: string;

  @Column(DataType.STRING(255))
  manufacturer?: string;

  @Column({
    type: DataType.STRING(255),
    unique: true,
  })
  ndc?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isControlled: boolean;

  @Column({
    type: DataType.ENUM('I', 'II', 'III', 'IV', 'V'),
  })
  deaSchedule?: 'I' | 'II' | 'III' | 'IV' | 'V';

  @Default(false)
  @Column(DataType.BOOLEAN)
  requiresWitness: boolean;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @Column(DataType.DATE)
  declare deletedAt?: Date;

  @Column(DataType.UUID)
  deletedBy?: string;

  @Column(DataType.DATE)
  declare createdAt: Date;

  @Column(DataType.DATE)
  declare updatedAt: Date;
}
