import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { VisitDisposition } from '../../clinical/enums/visit-disposition.enum';

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
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'clinic_visits',
  timestamps: true,
  indexes: [
    {
      fields: ['student_id'],
    },
    {
      fields: ['check_in_time'],
    },
    {
      fields: ['check_out_time'],
    },
    {
      fields: ['disposition'],
    },
    {
      fields: ['attended_by'],
    },
  ],
})
export class ClinicVisit extends Model<ClinicVisitAttributes> implements ClinicVisitAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'student_id',
  })
  @Index
  studentId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'check_in_time',
  })
  @Index
  checkInTime: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
    field: 'check_out_time',
  })
  @Index
  checkOutTime?: Date;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    field: 'reason_for_visit',
  })
  reasonForVisit: string[];

  @AllowNull
  @Column({
    type: DataType.JSON,
    field: 'symptoms',
  })
  symptoms?: string[];

  @AllowNull
  @Column({
    type: DataType.TEXT,
    field: 'treatment',
  })
  treatment?: string;

  @Column({
    type: DataType.ENUM(...Object.values(VisitDisposition)),
    allowNull: false,
  })
  @Index
  disposition: VisitDisposition;

  @AllowNull
  @Column({
    type: DataType.JSON,
    field: 'classes_missed',
  })
  classesMissed?: string[];

  @AllowNull
  @Column({
    type: DataType.INTEGER,
    field: 'minutes_missed',
  })
  minutesMissed?: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'attended_by',
  })
  @Index
  attendedBy: string;

  @AllowNull
  @Column({
    type: DataType.TEXT,
    field: 'notes',
  })
  notes?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  /**
   * Calculate visit duration in minutes
   * @returns duration in minutes or null if not checked out
   */
  getDuration(): number | null {
    if (!this.checkOutTime) return null;
    return Math.floor((this.checkOutTime.getTime() - this.checkInTime.getTime()) / 60000);
  }

  /**
   * Check if student is still in clinic
   * @returns true if visit is active (not checked out)
   */
  isStillInClinic(): boolean {
    return !this.checkOutTime;
  }
}
