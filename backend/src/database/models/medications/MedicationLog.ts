import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { AuditableModel } from '../base/AuditableModel';

/**
 * MedicationLog Model
 * Records each instance of medication administration to students.
 * Provides complete audit trail for medication dispensing with timestamps,
 * dosage information, and nurse documentation.
 * Critical for HIPAA compliance and medication error prevention.
 */

interface MedicationLogAttributes {
  id: string;
  dosageGiven: string;
  timeGiven: Date;
  administeredBy: string;
  notes?: string;
  sideEffects?: string;
  deviceId?: string;
  witnessId?: string;
  witnessName?: string;
  patientVerified: boolean;
  allergyChecked: boolean;
  createdAt: Date;

  // Foreign Keys
  studentMedicationId: string;
  nurseId: string;

  // Audit Fields
  createdBy?: string;
  updatedBy?: string;
}

interface MedicationLogCreationAttributes
  extends Optional<MedicationLogAttributes, 'id' | 'createdAt' | 'notes' | 'sideEffects' | 'deviceId' | 'witnessId' | 'witnessName' | 'patientVerified' | 'allergyChecked' | 'createdBy' | 'updatedBy'> {}

export class MedicationLog extends Model<MedicationLogAttributes, MedicationLogCreationAttributes> implements MedicationLogAttributes {
  public id!: string;
  public dosageGiven!: string;
  public timeGiven!: Date;
  public administeredBy!: string;
  public notes?: string;
  public sideEffects?: string;
  public deviceId?: string;
  public witnessId?: string;
  public witnessName?: string;
  public patientVerified!: boolean;
  public allergyChecked!: boolean;
  public readonly createdAt!: Date;

  // Foreign Keys
  public studentMedicationId!: string;
  public nurseId!: string;

  // Audit Fields
  public createdBy?: string;
  public updatedBy?: string;

  /**
   * Check if this log entry was created recently (within last hour)
   */
  get isRecent(): boolean {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return this.createdAt > oneHourAgo;
  }

  /**
   * Check if side effects were reported
   */
  get hasSideEffects(): boolean {
    return !!this.sideEffects && this.sideEffects.trim().length > 0;
  }

  /**
   * Get time elapsed since administration (in minutes)
   */
  get minutesSinceAdministration(): number {
    const now = new Date();
    const diff = now.getTime() - this.timeGiven.getTime();
    return Math.floor(diff / (1000 * 60));
  }
}

MedicationLog.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    dosageGiven: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Actual dosage administered (may differ from prescribed)',
    },
    timeGiven: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Exact date and time medication was administered',
    },
    administeredBy: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Name of person who administered the medication',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Additional notes about administration',
    },
    sideEffects: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Any observed side effects or adverse reactions',
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Device ID used for administration (for idempotency)',
    },
    witnessId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'User ID of witness (required for controlled substances Schedule I-II)',
    },
    witnessName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Name of witness who verified administration',
    },
    patientVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether patient identity was verified (Right Patient)',
    },
    allergyChecked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether allergies were checked before administration',
    },
    studentMedicationId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'student_medications',
        key: 'id',
      },
    },
    nurseId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'User ID of the nurse who administered the medication',
    },
    ...AuditableModel.getAuditableFields(),
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'medication_logs',
    timestamps: false,
    createdAt: true,
    updatedAt: false,
    indexes: [
      { fields: ['studentMedicationId'] },
      { fields: ['nurseId'] },
      { fields: ['timeGiven'] },
      { fields: ['studentMedicationId', 'timeGiven'] },
      { fields: ['createdAt'] },
      { fields: ['createdBy'] },
    ],
  }
);

AuditableModel.setupAuditHooks(MedicationLog, 'MedicationLog');
