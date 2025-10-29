import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
  BeforeCreate,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
;

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

@Table({
  tableName: 'student_drug_allergies',
  timestamps: true,
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
  ],
})
export class StudentDrugAllergy extends Model<StudentDrugAllergyAttributes> implements StudentDrugAllergyAttributes {
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
}
