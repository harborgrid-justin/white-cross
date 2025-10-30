import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  HasMany
  } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
;
;

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
  interactionsAsDrug1?: any[];
  interactionsAsDrug2?: any[];
  allergies?: any[];
}

@Table({
  tableName: 'drug_catalog',
  timestamps: true,
  indexes: [
    {
      fields: ['rxnormId'],
      unique: true,
      where: {
        rxnorm_id: {
          [Op.ne]: null
  }
  }
  },
    {
      fields: ['rxnormCode'],
      unique: true,
      where: {
        rxnorm_code: {
          [Op.ne]: null
  }
  }
  },
    {
      fields: ['genericName']
  },
    {
      fields: ['drugClass']
  },
    {
      fields: ['isActive']
  },
  ]
  })
export class DrugCatalog extends Model<DrugCatalogAttributes> implements DrugCatalogAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull
  @Column({
    type: DataType.STRING(50),
    unique: true
  })
  @Index
  rxnormId?: string;

  @AllowNull
  @Column({
    type: DataType.STRING(50),
    unique: true
  })
  @Index
  rxnormCode?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  @Index
  genericName: string;

  @AllowNull
  @Column({
    type: DataType.JSON
  })
  brandNames?: string[];

  @AllowNull
  @Column({
    type: DataType.STRING(100)
  })
  @Index
  drugClass?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  fdaApproved: boolean;

  @AllowNull
  @Column({
    type: DataType.JSONB
  })
  commonDoses?: Record<string, any>;

  @AllowNull
  @Column({
    type: DataType.JSON
  })
  sideEffects?: string[];

  @AllowNull
  @Column({
    type: DataType.JSON
  })
  contraindications?: string[];

  @AllowNull
  @Column({
    type: DataType.JSON
  })
  warnings?: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  @Index
  isActive: boolean;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Relationships
  @HasMany(() => require('./drug-interaction.model').DrugInteraction, { foreignKey: 'drug1Id', as: 'interactionsAsDrug1' })
  interactionsAsDrug1?: any[];

  @HasMany(() => require('./drug-interaction.model').DrugInteraction, { foreignKey: 'drug2Id', as: 'interactionsAsDrug2' })
  interactionsAsDrug2?: any[];

  @HasMany(() => require('./student-drug-allergy.model').StudentDrugAllergy, { foreignKey: 'drugId', as: 'allergies' })
  allergies?: any[];
}
