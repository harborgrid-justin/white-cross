import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
  BeforeUpdate,
  Scopes
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

export interface VitalSignsAttributes {
  id?: string;
  studentId: string;
  measurementDate: Date;
  temperature?: number;
  temperatureUnit?: string; // F or C
  heartRate?: number;
  respiratoryRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  oxygenSaturation?: number;
  weight?: number;
  weightUnit?: string; // lbs or kg
  height?: number;
  heightUnit?: string; // inches or cm
  bmi?: number;
  pain?: number; // 0-10 scale
  isAbnormal: boolean;
  abnormalFlags?: string[]; // Array of abnormal vital types
  measuredBy?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null
    },
    order: [['measurementDate', 'DESC']]
  },
  byStudent: (studentId: string) => ({
    where: { studentId },
    order: [['measurementDate', 'DESC']]
  }),
  abnormal: {
    where: {
      isAbnormal: true
    },
    order: [['measurementDate', 'DESC']]
  },
  recent: {
    where: {
      measurementDate: {
        [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    },
    order: [['measurementDate', 'DESC']]
  },
  withFlag: (flag: string) => ({
    where: {
      abnormalFlags: {
        [Op.contains]: [flag]
      }
    },
    order: [['measurementDate', 'DESC']]
  })
}))
@Table({
  tableName: 'vital_signs',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    {
      fields: ['studentId']
    },
    {
      fields: ['measurementDate']
    },
    {
      fields: ['isAbnormal']
    },
    {
      fields: ['createdAt'],
      name: 'idx_vital_signs_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_vital_signs_updated_at'
    }
  ]
})
export class VitalSigns extends Model<VitalSignsAttributes> implements VitalSignsAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @ForeignKey(() => require('./student.model').Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  studentId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  measurementDate: Date;

  @Column(DataType.FLOAT)
  temperature?: number;

  @Default('F')
  @Column(DataType.ENUM('F', 'C'))
  temperatureUnit?: string;

  @Column(DataType.INTEGER)
  heartRate?: number;

  @Column(DataType.INTEGER)
  respiratoryRate?: number;

  @Column(DataType.INTEGER)
  bloodPressureSystolic?: number;

  @Column(DataType.INTEGER)
  bloodPressureDiastolic?: number;

  @Column(DataType.FLOAT)
  oxygenSaturation?: number;

  @Column(DataType.FLOAT)
  weight?: number;

  @Default('lbs')
  @Column(DataType.ENUM('lbs', 'kg'))
  weightUnit?: string;

  @Column(DataType.FLOAT)
  height?: number;

  @Default('inches')
  @Column(DataType.ENUM('inches', 'cm'))
  heightUnit?: string;

  @Column(DataType.FLOAT)
  bmi?: number;

  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 0,
      max: 10
    }
  })
  pain?: number;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isAbnormal: boolean;

  @Column(DataType.JSON)
  abnormalFlags?: string[];

  @Column(DataType.STRING(255))
  measuredBy?: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Associations
  @BelongsTo(() => require('./student.model').Student, { foreignKey: 'studentId', as: 'student' })
  declare student?: any;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: VitalSigns) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] VitalSigns ${instance.id} modified for student ${instance.studentId} at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }

  @BeforeCreate
  static async calculateBMI(instance: VitalSigns) {
    if (instance.height && instance.weight && instance.heightUnit && instance.weightUnit) {
      // Convert to metric for BMI calculation
      let heightM = instance.height;
      let weightKg = instance.weight;

      if (instance.heightUnit === 'inches') {
        heightM = instance.height * 0.0254; // inches to meters
      }

      if (instance.weightUnit === 'lbs') {
        weightKg = instance.weight * 0.453592; // lbs to kg
      }

      instance.bmi = weightKg / (heightM * heightM);
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async checkAbnormalVitals(instance: VitalSigns) {
    const abnormalFlags: string[] = [];

    // Temperature checks (assuming Fahrenheit)
    if (instance.temperature) {
      if (instance.temperature < 95 || instance.temperature > 100.4) {
        abnormalFlags.push('temperature');
      }
    }

    // Heart rate checks (assuming bpm)
    if (instance.heartRate) {
      if (instance.heartRate < 60 || instance.heartRate > 100) {
        abnormalFlags.push('heartRate');
      }
    }

    // Respiratory rate checks (assuming breaths per minute)
    if (instance.respiratoryRate) {
      if (instance.respiratoryRate < 12 || instance.respiratoryRate > 20) {
        abnormalFlags.push('respiratoryRate');
      }
    }

    // Blood pressure checks
    if (instance.bloodPressureSystolic && instance.bloodPressureDiastolic) {
      if (instance.bloodPressureSystolic < 90 || instance.bloodPressureSystolic > 140) {
        abnormalFlags.push('bloodPressure');
      }
      if (instance.bloodPressureDiastolic < 60 || instance.bloodPressureDiastolic > 90) {
        abnormalFlags.push('bloodPressure');
      }
    }

    // Oxygen saturation checks
    if (instance.oxygenSaturation) {
      if (instance.oxygenSaturation < 95) {
        abnormalFlags.push('oxygenSaturation');
      }
    }

    instance.abnormalFlags = abnormalFlags;
    instance.isAbnormal = abnormalFlags.length > 0;
  }
}
