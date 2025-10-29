/**
 * Allergy Model
 *
 * Patient safety critical model managing life-threatening allergy information.
 * Supports medication-allergy cross-checking, emergency response protocols,
 * and HIPAA-compliant audit logging.
 *
 * @model Allergy
 * @compliance HIPAA, Healthcare Allergy Documentation Standards
 */
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { Student } from '../../student/models/student.model';
import { AllergySeverity } from '../../common/enums';

/**
 * Allergen type categories for classification
 */
export enum AllergenType {
  MEDICATION = 'MEDICATION',
  FOOD = 'FOOD',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  OTHER = 'OTHER',
}

@Table({
  tableName: 'allergies',
  timestamps: true,
  paranoid: true, // Enables soft deletes
  indexes: [
    { fields: ['studentId', 'allergen'] },
    { fields: ['studentId', 'severity'] },
    { fields: ['severity'] },
    { fields: ['studentId'] },
  ],
})
export class Allergy extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  declare id: string;

  /**
   * Student who has the allergy
   */
  @ForeignKey(() => Student)
  @Index
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  studentId: string;

  @BelongsTo(() => Student)
  student?: Student;

  /**
   * Name of the allergen (medication, food, environmental substance)
   */
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  allergen: string;

  /**
   * Category of allergen for classification
   */
  @Column({
    type: DataType.ENUM(...Object.values(AllergenType)),
    allowNull: true,
  })
  allergenType?: AllergenType;

  /**
   * Clinical severity classification
   * Guides medication cross-checking priority and emergency response
   */
  @Column({
    type: DataType.ENUM(...Object.values(AllergySeverity)),
    allowNull: false,
  })
  severity: AllergySeverity;

  /**
   * Description of allergic reaction symptoms
   */
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  reaction?: string;

  /**
   * Emergency treatment protocol and intervention
   */
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  treatment?: string;

  /**
   * Whether allergy has been clinically verified by healthcare professional
   */
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  verified: boolean;

  /**
   * User ID of healthcare professional who verified the allergy
   */
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  verifiedBy?: string;

  /**
   * Verification timestamp
   */
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  verifiedAt?: Date;

  /**
   * Additional clinical notes and observations
   */
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;

  /**
   * Link to comprehensive health record if applicable
   */
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  healthRecordId?: string;

  /**
   * Active status - false for resolved allergies (soft delete)
   */
  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isActive: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt: Date;

  /**
   * Soft delete timestamp
   * Allows preserving clinical history while removing from active records
   */
  @DeletedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deletedAt?: Date;
}