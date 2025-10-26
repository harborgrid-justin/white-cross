import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

export enum DrugInteractionSeverity { NONE = 'NONE', MINOR = 'MINOR', MODERATE = 'MODERATE', MAJOR = 'MAJOR', SEVERE = 'SEVERE', UNKNOWN = 'UNKNOWN' }

export interface DrugCatalogAttributes {
  id: string;
  rxnormId?: string;
  genericName: string;
  brandNames?: string[];
  drugClass?: string;
  fdaApproved: boolean;
  commonDoses?: Record<string, any>;
  sideEffects?: string[];
  contraindications?: string[];
  warnings?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DrugCatalogCreationAttributes extends Optional<DrugCatalogAttributes, 'id' | 'fdaApproved' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class DrugCatalog extends Model<DrugCatalogAttributes, DrugCatalogCreationAttributes> implements DrugCatalogAttributes {
  public id!: string;
  public rxnormId?: string;
  public genericName!: string;
  public brandNames?: string[];
  public drugClass?: string;
  public fdaApproved!: boolean;
  public commonDoses?: Record<string, any>;
  public sideEffects?: string[];
  public contraindications?: string[];
  public warnings?: string[];
  public isActive!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static initialize(sequelize: Sequelize): typeof DrugCatalog {
    DrugCatalog.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        rxnormId: { type: DataTypes.STRING(50), allowNull: true, unique: true, field: 'rxnorm_id' },
        genericName: { type: DataTypes.STRING(255), allowNull: false, field: 'generic_name' },
        brandNames: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true, field: 'brand_names' },
        drugClass: { type: DataTypes.STRING(100), allowNull: true, field: 'drug_class' },
        fdaApproved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'fda_approved' },
        commonDoses: { type: DataTypes.JSONB, allowNull: true, field: 'common_doses' },
        sideEffects: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: true, field: 'side_effects' },
        contraindications: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: true },
        warnings: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: true },
        isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
      },
      { sequelize, tableName: 'drug_catalog', modelName: 'DrugCatalog', timestamps: true, underscored: true }
    );
    return DrugCatalog;
  }

  public static async searchByName(query: string): Promise<DrugCatalog[]> {
    const { Op } = sequelize;
    return this.findAll({
      where: {
        [Op.or]: [
          { genericName: { [Op.iLike]: `%${query}%` } },
          { brandNames: { [Op.contains]: [query] } },
        ],
        isActive: true,
      },
      limit: 20,
    });
  }
}

export default DrugCatalog;
