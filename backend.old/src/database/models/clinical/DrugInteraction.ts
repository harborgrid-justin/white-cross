import { Model, DataTypes, Sequelize } from 'sequelize';

export enum InteractionSeverity {
  MINOR = 'MINOR',
  MODERATE = 'MODERATE',
  MAJOR = 'MAJOR',
  SEVERE = 'SEVERE',
  CONTRAINDICATED = 'CONTRAINDICATED',
}

export interface DrugInteractionAttributes {
  id: string;
  drug1Id: string;
  drug2Id: string;
  severity: InteractionSeverity;
  description: string;
  clinicalEffects?: string;
  management?: string;
  references?: string[];
  evidenceLevel?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DrugInteractionCreationAttributes extends Omit<DrugInteractionAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

/**
 * DrugInteraction Model
 * Stores drug-drug interaction information
 */
class DrugInteraction extends Model<DrugInteractionAttributes, DrugInteractionCreationAttributes> implements DrugInteractionAttributes {
  public id!: string;
  public drug1Id!: string;
  public drug2Id!: string;
  public severity!: InteractionSeverity;
  public description!: string;
  public clinicalEffects?: string;
  public management?: string;
  public references?: string[];
  public evidenceLevel?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly drug1?: any;
  public readonly drug2?: any;

  public static initialize(sequelize: Sequelize): typeof DrugInteraction {
    DrugInteraction.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        drug1Id: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'drug1_id',
        },
        drug2Id: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'drug2_id',
        },
        severity: {
          type: DataTypes.ENUM(...Object.values(InteractionSeverity)),
          allowNull: false,
          field: 'severity',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: 'description',
        },
        clinicalEffects: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'clinical_effects',
        },
        management: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'management',
        },
        references: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: true,
          field: 'references',
        },
        evidenceLevel: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: 'evidence_level',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'drug_interactions',
        modelName: 'DrugInteraction',
        timestamps: true,
        underscored: true,
      }
    );
    return DrugInteraction;
  }

  public static associate(models: any): void {
    DrugInteraction.belongsTo(models.DrugCatalog, { foreignKey: 'drug1Id', as: 'drug1' });
    DrugInteraction.belongsTo(models.DrugCatalog, { foreignKey: 'drug2Id', as: 'drug2' });
  }
}

export default DrugInteraction;
