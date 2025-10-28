import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

export enum MedicationStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DISCONTINUED = 'DISCONTINUED',
  ON_HOLD = 'ON_HOLD',
}

export enum MedicationRoute {
  ORAL = 'ORAL',
  TOPICAL = 'TOPICAL',
  INHALATION = 'INHALATION',
  INJECTION = 'INJECTION',
  SUBLINGUAL = 'SUBLINGUAL',
  RECTAL = 'RECTAL',
  OPHTHALMIC = 'OPHTHALMIC',
  OTIC = 'OTIC',
  NASAL = 'NASAL',
  OTHER = 'OTHER',
}

export interface MedicationAttributes {
  id: string;
  studentId: string;
  organizationId: string;
  name: string;
  dosage: string;
  route: MedicationRoute;
  frequency: string;
  instructions?: string;
  prescribedBy?: string;
  prescriptionDate?: Date;
  startDate: Date;
  endDate?: Date;
  status: MedicationStatus;
  nextDoseTime?: Date;
  lastAdministeredAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicationCreationAttributes
  extends Optional<MedicationAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

/**
 * Medication Model
 * Tracks student medications and administration schedules
 */
class Medication extends Model<MedicationAttributes, MedicationCreationAttributes> implements MedicationAttributes {
  public id!: string;
  public studentId!: string;
  public organizationId!: string;
  public name!: string;
  public dosage!: string;
  public route!: MedicationRoute;
  public frequency!: string;
  public instructions?: string;
  public prescribedBy?: string;
  public prescriptionDate?: Date;
  public startDate!: Date;
  public endDate?: Date;
  public status!: MedicationStatus;
  public nextDoseTime?: Date;
  public lastAdministeredAt?: Date;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly student?: any;
  public readonly administrations?: any[];

  /**
   * Initialize the Medication model
   */
  public static initialize(sequelize: Sequelize): typeof Medication {
    Medication.init(
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
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'organization_id',
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        dosage: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        route: {
          type: DataTypes.ENUM(...Object.values(MedicationRoute)),
          allowNull: false,
        },
        frequency: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        instructions: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        prescribedBy: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'prescribed_by',
        },
        prescriptionDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'prescription_date',
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'start_date',
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'end_date',
        },
        status: {
          type: DataTypes.ENUM(...Object.values(MedicationStatus)),
          allowNull: false,
          defaultValue: MedicationStatus.ACTIVE,
        },
        nextDoseTime: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'next_dose_time',
        },
        lastAdministeredAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'last_administered_at',
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
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
        tableName: 'medications',
        modelName: 'Medication',
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['student_id'] },
          { fields: ['organization_id'] },
          { fields: ['status'] },
          { fields: ['next_dose_time'] },
          {
            fields: ['status', 'next_dose_time'],
            where: { status: 'ACTIVE' },
          },
        ],
      }
    );

    return Medication;
  }

  /**
   * Define associations
   */
  public static associate(models: any): void {
    Medication.belongsTo(models.Student, {
      foreignKey: 'studentId',
      as: 'student',
    });

    Medication.belongsTo(models.Organization, {
      foreignKey: 'organizationId',
      as: 'organization',
    });

    Medication.hasMany(models.MedicationAdministration, {
      foreignKey: 'medicationId',
      as: 'administrations',
    });
  }

  /**
   * Find active medications for a student
   */
  public static async findActiveByStudent(studentId: string): Promise<Medication[]> {
    return this.findAll({
      where: {
        studentId,
        status: MedicationStatus.ACTIVE,
      },
      order: [['nextDoseTime', 'ASC']],
    });
  }

  /**
   * Find medications due for administration
   */
  public static async findDueForAdministration(organizationId?: string): Promise<Medication[]> {
    const where: any = {
      status: MedicationStatus.ACTIVE,
      nextDoseTime: {
        $lte: new Date(),
      },
    };

    if (organizationId) {
      where.organizationId = organizationId;
    }

    return this.findAll({
      where,
      include: ['student'],
      order: [['nextDoseTime', 'ASC']],
    });
  }
}

export default Medication;
