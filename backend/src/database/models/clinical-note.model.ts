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
  BeforeCreate,
  BeforeUpdate,
  Scopes
  } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

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

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  },
  byStudent: (studentId: string) => ({
    where: { studentId },
    order: [['createdAt', 'DESC']]
  }),
  byType: (type: NoteType) => ({
    where: { type },
    order: [['createdAt', 'DESC']]
  }),
  byAuthor: (createdBy: string) => ({
    where: { createdBy },
    order: [['createdAt', 'DESC']]
  }),
  confidential: {
    where: {
      isConfidential: true
    },
    order: [['createdAt', 'DESC']]
  },
  unsigned: {
    where: {
      isSigned: false
    },
    order: [['createdAt', 'ASC']]
  },
  signed: {
    where: {
      isSigned: true
    },
    order: [['signedAt', 'DESC']]
  },
  amended: {
    where: {
      amended: true
    },
    order: [['updatedAt', 'DESC']]
  },
  recent: {
    where: {
      createdAt: {
        [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    },
    order: [['createdAt', 'DESC']]
  },
  soapNotes: {
    where: {
      type: NoteType.SOAP
    },
    order: [['createdAt', 'DESC']]
  }
}))
@Table({
  tableName: 'clinical_notes',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    {
      fields: ['studentId', 'type']
  },
    {
      fields: ['visitId']
  },
    {
      fields: ['createdBy']
  },,
    {
      fields: ['createdAt'],
      name: 'idx_clinical_note_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_clinical_note_updated_at'
    }
  ]
  })
export class ClinicalNote extends Model<ClinicalNoteAttributes> implements ClinicalNoteAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

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

  @BelongsTo(() => require('./student.model').Student, { foreignKey: 'studentId', as: 'student' })
  declare student?: any;

  @BelongsTo(() => require('./user.model').User, { foreignKey: 'createdBy', as: 'author' })
  declare author?: any;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(NoteType)]
    },
    allowNull: false,
    defaultValue: NoteType.GENERAL
  })
  type: NoteType;

  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
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

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: ClinicalNote) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] ClinicalNote ${instance.id} modified for student ${instance.studentId} at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}, Author: ${instance.createdBy}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async validateSOAPNote(instance: ClinicalNote) {
    if (instance.type === NoteType.SOAP) {
      if (instance.isSigned && (!instance.subjective || !instance.objective || !instance.assessment || !instance.plan)) {
        throw new Error('SOAP note must have all four components (S.O.A.P) before signing');
      }
    }
  }

  @BeforeUpdate
  static async validateAmendment(instance: ClinicalNote) {
    if (instance.changed('amended') && instance.amended && !instance.amendmentReason) {
      throw new Error('amendmentReason is required when marking note as amended');
    }
  }

  @BeforeUpdate
  static async validateSignature(instance: ClinicalNote) {
    if (instance.changed('isSigned') && instance.isSigned) {
      instance.signedAt = new Date();
    }
  }

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
