import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
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
  createdAt?: Date;
  updatedAt?: Date;
  interactionsAsDrug1?: DrugInteraction[];
  interactionsAsDrug2?: DrugInteraction[];
  allergies?: StudentDrugAllergy[];
}

@Table({
  tableName: 'drug_catalog',
  timestamps: true,
  indexes: [
    {
      fields: ['rxnorm_id'],
      unique: true,
      where: {
        rxnorm_id: {
          [require('sequelize').Op.ne]: null,
        },
      },
    },
    {
      fields: ['rxnorm_code'],
      unique: true,
      where: {
        rxnorm_code: {
          [require('sequelize').Op.ne]: null,
        },
      },
    },
    {
      fields: ['generic_name'],
    },
    {
      fields: ['drug_class'],
    },
    {
      fields: ['is_active'],
    },
  ],
})
export class DrugCatalog extends Model<DrugCatalogAttributes> implements DrugCatalogAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull
  @Column({
    type: DataType.STRING(50),
    unique: true,
    field: 'rxnorm_id',
  })
  @Index
  rxnormId?: string;

  @AllowNull
  @Column({
    type: DataType.STRING(50),
    unique: true,
    field: 'rxnorm_code',
  })
  @Index
  rxnormCode?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'generic_name',
  })
  @Index
  genericName: string;

  @AllowNull
  @Column({
    type: DataType.JSON,
    field: 'brand_names',
  })
  brandNames?: string[];

  @AllowNull
  @Column({
    type: DataType.STRING(100),
    field: 'drug_class',
  })
  @Index
  drugClass?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'fda_approved',
  })
  fdaApproved: boolean;

  @AllowNull
  @Column({
    type: DataType.JSONB,
    field: 'common_doses',
  })
  commonDoses?: Record<string, any>;

  @AllowNull
  @Column({
    type: DataType.JSON,
    field: 'side_effects',
  })
  sideEffects?: string[];

  @AllowNull
  @Column({
    type: DataType.JSON,
  })
  contraindications?: string[];

  @AllowNull
  @Column({
    type: DataType.JSON,
  })
  warnings?: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  @Index
  isActive: boolean;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Relationships
  @HasMany(() => DrugInteraction, { foreignKey: 'drug1Id', as: 'interactionsAsDrug1' })
  interactionsAsDrug1?: DrugInteraction[];

  @HasMany(() => DrugInteraction, { foreignKey: 'drug2Id', as: 'interactionsAsDrug2' })
  interactionsAsDrug2?: DrugInteraction[];

  @HasMany(() => StudentDrugAllergy, { foreignKey: 'drugId', as: 'allergies' })
  allergies?: StudentDrugAllergy[];
}
