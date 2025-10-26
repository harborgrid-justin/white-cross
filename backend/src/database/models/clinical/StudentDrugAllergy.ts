import { Model, DataTypes, Sequelize } from 'sequelize';

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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StudentDrugAllergyCreationAttributes extends Omit<StudentDrugAllergyAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

/**
 * StudentDrugAllergy Model
 * Tracks student allergies to specific drugs
 */
class StudentDrugAllergy extends Model<StudentDrugAllergyAttributes, StudentDrugAllergyCreationAttributes> implements StudentDrugAllergyAttributes {
  public id!: string;
  public studentId!: string;
  public drugId!: string;
  public allergyType!: string;
  public reaction!: string;
  public severity!: string;
  public notes?: string;
  public diagnosedDate?: Date;
  public diagnosedBy?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly student?: any;
  public readonly drug?: any;

  public static initialize(sequelize: Sequelize): typeof StudentDrugAllergy {
    StudentDrugAllergy.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        studentId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'student_id',
        },
        drugId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'drug_id',
        },
        allergyType: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'allergy_type',
        },
        reaction: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: 'reaction',
        },
        severity: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'severity',
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'notes',
        },
        diagnosedDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'diagnosed_date',
        },
        diagnosedBy: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'diagnosed_by',
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
        tableName: 'student_drug_allergies',
        modelName: 'StudentDrugAllergy',
        timestamps: true,
        underscored: true,
      }
    );
    return StudentDrugAllergy;
  }

  public static associate(models: any): void {
    StudentDrugAllergy.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    StudentDrugAllergy.belongsTo(models.DrugCatalog, { foreignKey: 'drugId', as: 'drug' });
  }
}

export default StudentDrugAllergy;
