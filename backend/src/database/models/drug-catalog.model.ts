import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  HasMany,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

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

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'drug_catalog',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['rxnormId'],
      unique: true,
      where: {
        rxnormId: {
          [Op.ne]: null,
        },
      },
    },
    {
      fields: ['rxnormCode'],
      unique: true,
      where: {
        rxnormCode: {
          [Op.ne]: null,
        },
      },
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
    {
      fields: ['createdAt'],
      name: 'idx_drug_catalog_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_drug_catalog_updated_at',
    },
  ],
})
export class DrugCatalog
  extends Model<DrugCatalogAttributes>
  implements DrugCatalogAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull
  @Column({
    type: DataType.STRING(50),
    unique: true,
  })
  @Index
  rxnormId?: string;

  @AllowNull
  @Column({
    type: DataType.STRING(50),
    unique: true,
  })
  @Index
  rxnormCode?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  @Index
  genericName: string;

  @AllowNull
  @Column({
    type: DataType.JSON,
  })
  brandNames?: string[];

  @AllowNull
  @Column({
    type: DataType.STRING(100),
  })
  @Index
  drugClass?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  fdaApproved: boolean;

  @AllowNull
  @Column({
    type: DataType.JSONB,
  })
  commonDoses?: Record<string, any>;

  @AllowNull
  @Column({
    type: DataType.JSON,
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
  })
  @Index
  isActive: boolean;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Relationships
  @HasMany(() => require('./drug-interaction.model').DrugInteraction, {
    foreignKey: 'drug1Id',
    as: 'interactionsAsDrug1',
  })
  interactionsAsDrug1?: any[];

  @HasMany(() => require('./drug-interaction.model').DrugInteraction, {
    foreignKey: 'drug2Id',
    as: 'interactionsAsDrug2',
  })
  interactionsAsDrug2?: any[];

  @HasMany(() => require('./student-drug-allergy.model').StudentDrugAllergy, {
    foreignKey: 'drugId',
    as: 'allergies',
  })
  allergies?: any[];

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: DrugCatalog) {
    await createModelAuditHook('DrugCatalog', instance);
  }
}

// Default export for Sequelize-TypeScript
export default DrugCatalog;
