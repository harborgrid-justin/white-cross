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
  HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { DrugInteraction } from './drug-interaction.model';
import { StudentDrugAllergy } from './student-drug-allergy.model';

export interface DrugCatalogAttributes {
  id: string;
  rxnormId?: string;
  rxnormCode?: string;
  genericName: string;
  brandNames?: string[];
  drugClass?: string;
  fdaApproved: boolean;
  commonDoses?: Record<string, any>;
  sideEffects?: string[];
  contraindications?: string[];
  warnings?: string[];
  isActive: boolean;
}

@Table({
  tableName: 'drug_catalog',
  timestamps: true,
  indexes: [
    {
      fields: ['rxnormId'],
      unique: true,
    },
    {
      fields: ['rxnormCode'],
      unique: true,
    },
    {
      fields: ['genericName'],
    },
    {
      fields: ['drugClass'],
    },
    {
      fields: ['isActive'],
    },
  ],
})
export class DrugCatalog extends Model<DrugCatalogAttributes> implements DrugCatalogAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(50),
    unique: true,
  })
  rxnormId?: string;

  @Column({
    type: DataType.STRING(50),
    unique: true,
  })
  rxnormCode?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  genericName: string;

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  brandNames?: string[];

  @Column(DataType.STRING(100))
  drugClass?: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  fdaApproved: boolean;

  @Column(DataType.JSONB)
  commonDoses?: Record<string, any>;

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  sideEffects?: string[];

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  contraindications?: string[];

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  warnings?: string[];

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

  // Relationships
  @HasMany(() => DrugInteraction, 'drug1Id')
  interactionsAsDrug1?: DrugInteraction[];

  @HasMany(() => DrugInteraction, 'drug2Id')
  interactionsAsDrug2?: DrugInteraction[];

  @HasMany(() => StudentDrugAllergy)
  allergies?: StudentDrugAllergy[];
}
