import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { AuditableModel } from '../base/AuditableModel';

/**
 * StudentMedication Model
 * Manages medication prescriptions assigned to individual students.
 * Links students with specific medications and tracks prescription details.
 * HIPAA-compliant with audit trail for all prescription changes.
 */

interface StudentMedicationAttributes {
  id: string;
  dosage: string;
  frequency: string;
  route: string;
  instructions?: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  prescribedBy: string;
  createdAt: Date;
  updatedAt: Date;

  // Foreign Keys
  studentId: string;
  medicationId: string;

  // Audit Fields
  createdBy?: string;
  updatedBy?: string;
}

interface StudentMedicationCreationAttributes
  extends Optional<StudentMedicationAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'instructions' | 'endDate' | 'createdBy' | 'updatedBy'> {}

export class StudentMedication extends Model<StudentMedicationAttributes, StudentMedicationCreationAttributes> implements StudentMedicationAttributes {
  public id!: string;
  public dosage!: string;
  public frequency!: string;
  public route!: string;
  public instructions?: string;
  public startDate!: Date;
  public endDate?: Date;
  public isActive!: boolean;
  public prescribedBy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Foreign Keys
  public studentId!: string;
  public medicationId!: string;

  // Audit Fields
  public createdBy?: string;
  public updatedBy?: string;

  /**
   * Check if medication is currently active based on dates
   */
  get isCurrentlyActive(): boolean {
    const now = new Date();
    const isAfterStart = now >= this.startDate;
    const isBeforeEnd = !this.endDate || now <= this.endDate;
    return this.isActive && isAfterStart && isBeforeEnd;
  }

  /**
   * Get the number of days remaining in the medication schedule
   */
  get daysRemaining(): number | null {
    if (!this.endDate) return null;
    const now = new Date();
    const diff = this.endDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}

StudentMedication.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    dosage: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Medication dosage (e.g., "10mg", "2 tablets")',
    },
    frequency: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Administration frequency (e.g., "Once daily", "Twice daily", "As needed")',
    },
    route: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Administration route (e.g., "Oral", "Topical", "Injection")',
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Special instructions for medication administration',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Date when medication regimen begins',
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date when medication regimen ends (null for ongoing)',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether this medication prescription is currently active',
    },
    prescribedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Name of prescribing healthcare provider',
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    medicationId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'medications',
        key: 'id',
      },
    },
    ...AuditableModel.getAuditableFields(),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'student_medications',
    timestamps: true,
    indexes: [
      { fields: ['studentId'] },
      { fields: ['medicationId'] },
      { fields: ['isActive'] },
      { fields: ['startDate'] },
      { fields: ['endDate'] },
      { fields: ['studentId', 'isActive'] },
      { fields: ['createdBy'] },
    ],
  }
);

AuditableModel.setupAuditHooks(StudentMedication, 'StudentMedication');
