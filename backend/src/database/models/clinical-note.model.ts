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
  BelongsTo
  } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
;
import { NoteType } from '../../clinical/enums/note-type.enum';

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
  visit?: any;
}

@Table({
  tableName: 'clinical_notes',
  timestamps: true,
  indexes: [
    {
      fields: ['studentId', 'type']
  },
    {
      fields: ['visitId']
  },
    {
      fields: ['createdBy']
  },
  ]
  })
export class ClinicalNote extends Model<ClinicalNoteAttributes> implements ClinicalNoteAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  @Index
  studentId: string;

  @AllowNull
  @ForeignKey(() => require('./clinic-visit.model').ClinicVisit)
  @Column({
    type: DataType.UUID
  })
  visitId?: string;

  @BelongsTo(() => require('./clinic-visit.model').ClinicVisit, { foreignKey: 'visitId', as: 'visit' })
  declare visit?: any;

  @Column({
    type: DataType.ENUM(...(Object.values(NoteType) as string[])),
    allowNull: false,
    defaultValue: NoteType.GENERAL
  })
  type: NoteType;

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  @Index
  createdBy: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  content: string;

  // SOAP note components (optional, used when type is SOAP)
  @AllowNull
  @Column({
    type: DataType.TEXT
  })
  subjective?: string;

  @AllowNull
  @Column({
    type: DataType.TEXT
  })
  objective?: string;

  @AllowNull
  @Column({
    type: DataType.TEXT
  })
  assessment?: string;

  @AllowNull
  @Column({
    type: DataType.TEXT
  })
  plan?: string;

  @AllowNull
  @Column({
    type: DataType.JSON
  })
  tags?: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  isConfidential: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  isSigned: boolean;

  @AllowNull
  @Column({
    type: DataType.DATE
  })
  signedAt?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  amended: boolean;

  @AllowNull
  @Column({
    type: DataType.TEXT
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
