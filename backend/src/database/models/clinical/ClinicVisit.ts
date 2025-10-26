import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

export enum VisitDisposition { RETURN_TO_CLASS = 'RETURN_TO_CLASS', SENT_HOME = 'SENT_HOME', EMERGENCY_TRANSPORT = 'EMERGENCY_TRANSPORT', OTHER = 'OTHER' }

export interface ClinicVisitAttributes {
  id: string;
  studentId: string;
  checkInTime: Date;
  checkOutTime?: Date;
  reasonForVisit: string[];
  symptoms?: string[];
  treatment?: string;
  disposition: VisitDisposition;
  classesMissed?: string[];
  minutesMissed?: number;
  attendedBy: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClinicVisitCreationAttributes extends Optional<ClinicVisitAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class ClinicVisit extends Model<ClinicVisitAttributes, ClinicVisitCreationAttributes> implements ClinicVisitAttributes {
  public id!: string;
  public studentId!: string;
  public checkInTime!: Date;
  public checkOutTime?: Date;
  public reasonForVisit!: string[];
  public symptoms?: string[];
  public treatment?: string;
  public disposition!: VisitDisposition;
  public classesMissed?: string[];
  public minutesMissed?: number;
  public attendedBy!: string;
  public notes?: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public getDuration(): number | null {
    if (!this.checkOutTime) return null;
    return Math.floor((this.checkOutTime.getTime() - this.checkInTime.getTime()) / 60000);
  }

  public isStillInClinic(): boolean {
    return !this.checkOutTime;
  }

  public static initialize(sequelize: Sequelize): typeof ClinicVisit {
    ClinicVisit.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        studentId: { type: DataTypes.UUID, allowNull: false, field: 'student_id' },
        checkInTime: { type: DataTypes.DATE, allowNull: false, field: 'check_in_time' },
        checkOutTime: { type: DataTypes.DATE, allowNull: true, field: 'check_out_time' },
        reasonForVisit: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, field: 'reason_for_visit' },
        symptoms: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
        treatment: { type: DataTypes.TEXT, allowNull: true },
        disposition: { type: DataTypes.ENUM(...Object.values(VisitDisposition)), allowNull: false },
        classesMissed: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true, field: 'classes_missed' },
        minutesMissed: { type: DataTypes.INTEGER, allowNull: true, field: 'minutes_missed' },
        attendedBy: { type: DataTypes.UUID, allowNull: false, field: 'attended_by' },
        notes: { type: DataTypes.TEXT, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' },
      },
      { sequelize, tableName: 'clinic_visits', modelName: 'ClinicVisit', timestamps: true, underscored: true }
    );
    return ClinicVisit;
  }

  public static associate(models: any): void {
    ClinicVisit.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    ClinicVisit.belongsTo(models.User, { foreignKey: 'attendedBy', as: 'nurse' });
  }

  public static async findActiveVisits(): Promise<ClinicVisit[]> {
    return this.findAll({ where: { checkOutTime: null }, order: [['checkInTime', 'ASC']], include: ['student', 'nurse'] });
  }

  public static async findByStudentId(studentId: string, limit: number = 10): Promise<ClinicVisit[]> {
    return this.findAll({ where: { studentId }, order: [['checkInTime', 'DESC']], limit, include: ['nurse'] });
  }
}

export default ClinicVisit;
