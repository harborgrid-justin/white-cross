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
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export interface VitalSignsAttributes {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}

@Table({
  tableName: 'vital_signs',
  timestamps: true,
  indexes: [
    {
      fields: ['studentId'],
    },
    {
      fields: ['measurementDate'],
    },
    {
      fields: ['isAbnormal'],
    },
  ],
})
export class VitalSigns extends Model<VitalSignsAttributes> implements VitalSignsAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  id: string;

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
      max: 10,
    },
  })
  pain?: number;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isAbnormal: boolean;

  @Column(DataType.JSON)
  abnormalFlags?: string[];

  @Column(DataType.STRING)
  measuredBy?: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;

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