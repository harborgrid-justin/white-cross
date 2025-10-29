import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { ClinicVisit } from './clinic-visit.model';

export enum NoteType {
  /** General clinical note */
  GENERAL = 'general',

  /** SOAP note (Subjective, Objective, Assessment, Plan) */
  SOAP = 'soap',

  /** Progress note during treatment */
  PROGRESS = 'progress',

  /** Discharge summary */
  DISCHARGE = 'discharge',

  /** Follow-up note */
  FOLLOW_UP = 'follow_up',

  /** Telephone consultation note */
  TELEPHONE = 'telephone',

  /** Nurse's note */
  NURSING = 'nursing',

  /** Medication note */
  MEDICATION = 'medication',

  /** Incident report */
  INCIDENT = 'incident',
}

export interface ClinicalNoteAttributes {
  id: string;
  studentId: string;
  visitId?: string;
  type: NoteType;
  createdBy: string;
  title: string;
  content: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  tags?: string[];
  isConfidential: boolean;
  isSigned: boolean;
  signedAt?: Date;
  amended: boolean;
  amendmentReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
  visit?: ClinicVisit;
}

@Table({
  tableName: 'clinical_notes',
  timestamps: true,
  indexes: [
    {
      fields: ['student_id', 'type'],
    },
    {
      fields: ['visit_id'],
    },
    {
      fields: ['created_by'],
    },
  ],
})
export class ClinicalNote extends Model<ClinicalNoteAttributes> implements ClinicalNoteAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'student_id',
  })
  @Index
  studentId: string;

  @AllowNull
  @ForeignKey(() => ClinicVisit)
  @Column({
    type: DataType.UUID,
    field: 'visit_id',
  })
  visitId?: string;

  @BelongsTo(() => ClinicVisit, { foreignKey: 'visitId', as: 'visit' })
  visit?: ClinicVisit;

  @Column({
    type: DataType.ENUM(...Object.values(NoteType)),
    allowNull: false,
    defaultValue: NoteType.GENERAL,
  })
  type: NoteType;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'created_by',
  })
  @Index
  createdBy: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  // SOAP note components (optional, used when type is SOAP)
  @AllowNull
  @Column({
    type: DataType.TEXT,
    field: 'subjective',
  })
  subjective?: string;

  @AllowNull
  @Column({
    type: DataType.TEXT,
    field: 'objective',
  })
  objective?: string;

  @AllowNull
  @Column({
    type: DataType.TEXT,
    field: 'assessment',
  })
  assessment?: string;

  @AllowNull
  @Column({
    type: DataType.TEXT,
    field: 'plan',
  })
  plan?: string;

  @AllowNull
  @Column({
    type: DataType.JSON,
    field: 'tags',
  })
  tags?: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_confidential',
  })
  isConfidential: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_signed',
  })
  isSigned: boolean;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'signed_at',
  })
  signedAt?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  amended: boolean;

  @AllowNull
  @Column({
    type: DataType.TEXT,
    field: 'amendment_reason',
  })
  amendmentReason?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  /**
   * Check if note is a SOAP note
   */
  isSOAPNote(): boolean {
    return this.type === NoteType.SOAP;
  }

  /**
   * Check if SOAP note is complete
   */
  isSOAPComplete(): boolean {
    if (!this.isSOAPNote()) return false;
    return !!(this.subjective && this.objective && this.assessment && this.plan);
  }

  /**
   * Sign the note
   */
  sign(): void {
    this.isSigned = true;
    this.signedAt = new Date();
  }

  /**
   * Mark note as amended
   */
  markAsAmended(reason: string): void {
    this.amended = true;
    this.amendmentReason = reason;
  }
}
