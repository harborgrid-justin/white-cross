import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
  BeforeCreate,
  BeforeUpdate,
  Scopes,
  HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

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

@Scopes(() => ({
  active: {
    where: {
      isActive: true,
      deletedAt: null,
    },
    order: [['name', 'ASC']],
  },
  controlled: {
    where: {
      isControlled: true,
      isActive: true,
    },
    order: [
      ['deaSchedule', 'ASC'],
      ['name', 'ASC'],
    ],
  },
  byDEASchedule: (schedule: 'I' | 'II' | 'III' | 'IV' | 'V') => ({
    where: {
      deaSchedule: schedule,
      isActive: true,
    },
    order: [['name', 'ASC']],
  }),
  byDosageForm: (form: string) => ({
    where: {
      dosageForm: form,
      isActive: true,
    },
    order: [['name', 'ASC']],
  }),
  requiresWitness: {
    where: {
      requiresWitness: true,
      isActive: true,
    },
    order: [['name', 'ASC']],
  },
  byManufacturer: (manufacturer: string) => ({
    where: {
      manufacturer,
      isActive: true,
    },
    order: [['name', 'ASC']],
  }),
}))
@Table({
  tableName: 'medications',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    {
      fields: ['name'],
      name: 'idx_medications_name',
    },
    {
      fields: ['genericName'],
      name: 'idx_medications_generic_name',
    },
    {
      fields: ['ndc'],
      unique: true,
      name: 'idx_medications_ndc_unique',
    },
    {
      fields: ['isControlled'],
      name: 'idx_medications_controlled',
    },
    {
      fields: ['isActive'],
      name: 'idx_medications_active',
    },
    // Additional composite indexes
    {
      fields: ['isActive', 'name'],
      name: 'idx_medications_active_name',
    },
    {
      fields: ['isControlled', 'deaSchedule'],
      name: 'idx_medications_controlled_schedule',
    },
    {
      fields: ['dosageForm', 'isActive'],
      name: 'idx_medications_form_active',
    },
    {
      fields: ['createdAt'],
      name: 'idx_medications_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_medications_updated_at',
    },
    // Performance index for recall queries by manufacturer
    {
      fields: ['manufacturer'],
      name: 'idx_medications_manufacturer',
    },
  ],
})
export class Medication
  extends Model<MedicationAttributes>
  implements MedicationAttributes
{
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

  @Index({ name: 'idx_medications_manufacturer' })
  @Column(DataType.STRING(255))
  manufacturer?: string;

  @Column({
    type: DataType.STRING(255),
    unique: true,
    validate: {
      is: {
        args: /^(\d{4}-\d{4}-\d{2}|\d{5}-\d{3}-\d{2}|\d{5}-\d{4}-\d{1}|\d{10}|\d{11})$/,
        msg: 'NDC must be in valid format: 4-4-2 (1234-5678-90), 5-3-2 (12345-678-90), 5-4-1 (12345-6789-0), 10 digits (1234567890), or 11 digits (12345678901)',
      },
      len: {
        args: [10, 14],
        msg: 'NDC must be 10-14 characters (including hyphens)',
      },
    },
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

  // Relationships
  @HasMany(() => require('./student-medication.model').StudentMedication, {
    foreignKey: 'medicationId',
    as: 'studentMedications',
  })
  declare studentMedications?: any[];

  @HasMany(() => require('./medication-log.model').MedicationLog, {
    foreignKey: 'medicationId',
    as: 'medicationLogs',
  })
  declare medicationLogs?: any[];

  // Hooks for HIPAA compliance and validation
  @BeforeCreate
  @BeforeUpdate
  static async auditAccess(instance: Medication, options: any) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      const { logModelPHIAccess } = await import(
        '../services/model-audit-helper.service.js'
      );
      const action = instance.isNewRecord ? 'CREATE' : 'UPDATE';
      await logModelPHIAccess(
        'Medication',
        instance.id,
        action,
        changedFields,
        options?.transaction,
      );
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async validateControlledSchedule(instance: Medication) {
    if (instance.isControlled && !instance.deaSchedule) {
      throw new Error('Controlled medications must have a DEA schedule');
    }
    if (!instance.isControlled && instance.deaSchedule) {
      throw new Error('Non-controlled medications cannot have a DEA schedule');
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async setWitnessRequirement(instance: Medication) {
    // Schedule II and III controlled substances typically require witness
    if (
      instance.isControlled &&
      ['II', 'III'].includes(instance.deaSchedule || '')
    ) {
      instance.requiresWitness = true;
    }
  }
}
