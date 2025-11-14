import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export interface StudentDrugAllergyAttributes {
  id: string;
  studentId: string;
  drugId: string;
  allergyType: string;
  reaction: string;
  severity: string;
  notes?: string;
  diagnosedDate?: Date;
  diagnosedBy?: string;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'student_drug_allergies',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['studentId', 'drugId'],
      unique: true,
    },
    {
      fields: ['studentId'],
    },
    {
      fields: ['drugId'],
    },
    {
      fields: ['severity'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_student_drug_allergy_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_student_drug_allergy_updated_at',
    },
  ],
})
export class StudentDrugAllergy
  extends Model<StudentDrugAllergyAttributes>
  implements StudentDrugAllergyAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentId: string;

  @ForeignKey(() => require('./drug-catalog.model').DrugCatalog)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  drugId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  allergyType: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  reaction: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  severity: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.DATE)
  diagnosedDate?: Date;

  @Column(DataType.STRING(255))
  diagnosedBy?: string;

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

  // Relationships
  @BelongsTo(() => require('./drug-catalog.model').DrugCatalog)
  declare drug?: any;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: StudentDrugAllergy) {
    await createModelAuditHook('StudentDrugAllergy', instance);
  }
}
