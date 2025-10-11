import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { ConsciousnessLevel } from '../../types/enums';
import { AuditableModel } from '../base/AuditableModel';

/**
 * VitalSigns Model
 * Manages student vital signs including temperature, blood pressure, heart rate, oxygen saturation, and glucose levels.
 * This model contains Protected Health Information (PHI) and is subject to HIPAA compliance.
 */

interface VitalSignsAttributes {
  id: string;
  studentId: string;
  healthRecordId?: string;
  appointmentId?: string;
  measurementDate: Date;
  measuredBy: string;
  measuredByRole?: string;
  temperature?: number;
  temperatureUnit: string;
  temperatureSite?: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodPressurePosition?: string;
  heartRate?: number;
  heartRhythm?: string;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  oxygenSupplemental: boolean;
  painLevel?: number;
  painLocation?: string;
  consciousness?: ConsciousnessLevel;
  glucoseLevel?: number;
  peakFlow?: number;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface VitalSignsCreationAttributes
  extends Optional<
    VitalSignsAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'healthRecordId'
    | 'appointmentId'
    | 'measuredByRole'
    | 'temperature'
    | 'temperatureUnit'
    | 'temperatureSite'
    | 'bloodPressureSystolic'
    | 'bloodPressureDiastolic'
    | 'bloodPressurePosition'
    | 'heartRate'
    | 'heartRhythm'
    | 'respiratoryRate'
    | 'oxygenSaturation'
    | 'oxygenSupplemental'
    | 'painLevel'
    | 'painLocation'
    | 'consciousness'
    | 'glucoseLevel'
    | 'peakFlow'
    | 'notes'
    | 'createdBy'
    | 'updatedBy'
  > {}

export class VitalSigns extends Model<VitalSignsAttributes, VitalSignsCreationAttributes> implements VitalSignsAttributes {
  public id!: string;
  public studentId!: string;
  public healthRecordId?: string;
  public appointmentId?: string;
  public measurementDate!: Date;
  public measuredBy!: string;
  public measuredByRole?: string;
  public temperature?: number;
  public temperatureUnit!: string;
  public temperatureSite?: string;
  public bloodPressureSystolic?: number;
  public bloodPressureDiastolic?: number;
  public bloodPressurePosition?: string;
  public heartRate?: number;
  public heartRhythm?: string;
  public respiratoryRate?: number;
  public oxygenSaturation?: number;
  public oxygenSupplemental!: boolean;
  public painLevel?: number;
  public painLocation?: string;
  public consciousness?: ConsciousnessLevel;
  public glucoseLevel?: number;
  public peakFlow?: number;
  public notes?: string;
  public createdBy?: string;
  public updatedBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

VitalSigns.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    healthRecordId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    appointmentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    measurementDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    measuredBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    measuredByRole: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    temperature: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    temperatureUnit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'F',
    },
    temperatureSite: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bloodPressureSystolic: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bloodPressureDiastolic: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bloodPressurePosition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    heartRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    heartRhythm: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    respiratoryRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    oxygenSaturation: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    oxygenSupplemental: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    painLevel: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    painLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    consciousness: {
      type: DataTypes.ENUM(...Object.values(ConsciousnessLevel)),
      allowNull: true,
    },
    glucoseLevel: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
    },
    peakFlow: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ...AuditableModel.getAuditableFields(),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'vital_signs',
    timestamps: true,
    indexes: [
      { fields: ['studentId', 'measurementDate'] },
      { fields: ['measurementDate'] },
      { fields: ['appointmentId'] },
    ],
  }
);

AuditableModel.setupAuditHooks(VitalSigns, 'VitalSigns');
