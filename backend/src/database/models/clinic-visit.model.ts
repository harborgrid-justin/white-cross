import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { VisitDisposition } from '../../services/clinical/enums/visit-disposition.enum';

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

@Scopes(() => ({
  active: {
    where: {
      checkOutTime: null,
      deletedAt: null,
    },
    order: [['checkInTime', 'ASC']],
  },
  byStudent: (studentId: string) => ({
    where: { studentId },
    order: [['checkInTime', 'DESC']],
  }),
  byNurse: (attendedBy: string) => ({
    where: { attendedBy },
    order: [['checkInTime', 'DESC']],
  }),
  byDisposition: (disposition: VisitDisposition) => ({
    where: { disposition },
    order: [['checkInTime', 'DESC']],
  }),
  today: {
    where: {
      checkInTime: {
        [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
    order: [['checkInTime', 'DESC']],
  },
  thisWeek: {
    where: {
      checkInTime: {
        [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    order: [['checkInTime', 'DESC']],
  },
  completed: {
    where: {
      checkOutTime: {
        [Op.ne]: null,
      },
    },
    order: [['checkOutTime', 'DESC']],
  },
  inProgress: {
    where: {
      checkOutTime: null,
    },
    order: [['checkInTime', 'ASC']],
  },
  sentHome: {
    where: {
      disposition: VisitDisposition.SENT_HOME,
    },
    order: [['checkInTime', 'DESC']],
  },
  returnedToClass: {
    where: {
      disposition: VisitDisposition.RETURN_TO_CLASS,
    },
    order: [['checkInTime', 'DESC']],
  },
}))
@Table({
  tableName: 'clinic_visits',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    {
      fields: ['studentId'],
    },
    {
      fields: ['checkInTime'],
    },
    {
      fields: ['checkOutTime'],
    },
    {
      fields: ['disposition'],
    },
    {
      fields: ['attendedBy'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_clinic_visit_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_clinic_visit_updated_at',
    },
  ],
})
export class ClinicVisit
  extends Model<ClinicVisitAttributes>
  implements ClinicVisitAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./student.model').Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @Index
  studentId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  checkInTime: Date;

  @AllowNull
  @Column({
    type: DataType.DATE,
  })
  @Index
  checkOutTime?: Date;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  reasonForVisit: string[];

  @AllowNull
  @Column({
    type: DataType.JSON,
  })
  symptoms?: string[];

  @AllowNull
  @Column({
    type: DataType.TEXT,
  })
  treatment?: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(VisitDisposition)],
    },
    allowNull: false,
  })
  @Index
  disposition: VisitDisposition;

  @AllowNull
  @Column({
    type: DataType.JSON,
  })
  classesMissed?: string[];

  @AllowNull
  @Column({
    type: DataType.INTEGER,
  })
  minutesMissed?: number;

  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @Index
  attendedBy: string;

  @AllowNull
  @Column({
    type: DataType.TEXT,
  })
  notes?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Associations
  @BelongsTo(() => require('./student.model').Student, {
    foreignKey: 'studentId',
    as: 'student',
  })
  declare student?: any;

  @BelongsTo(() => require('./user.model').User, {
    foreignKey: 'attendedBy',
    as: 'attendingNurse',
  })
  declare attendingNurse?: any;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: ClinicVisit) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] ClinicVisit ${instance.id} modified for student ${instance.studentId} at ${new Date().toISOString()}`,
      );
      console.log(
        `[AUDIT] Changed fields: ${changedFields.join(', ')}, Nurse: ${instance.attendedBy}`,
      );
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async validateTimes(instance: ClinicVisit) {
    if (instance.checkOutTime && instance.checkOutTime < instance.checkInTime) {
      throw new Error('Check-out time cannot be before check-in time');
    }

    if (instance.checkInTime > new Date()) {
      throw new Error('Check-in time cannot be in the future');
    }
  }

  @BeforeUpdate
  static async calculateMinutesMissed(instance: ClinicVisit) {
    if (instance.changed('checkOutTime') && instance.checkOutTime) {
      const duration = Math.floor(
        (instance.checkOutTime.getTime() - instance.checkInTime.getTime()) /
          60000,
      );
      if (!instance.minutesMissed) {
        instance.minutesMissed = duration;
      }
    }
  }

  /**
   * Calculate visit duration in minutes
   * @returns duration in minutes or null if not checked out
   */
  getDuration(): number | null {
    if (!this.checkOutTime) return null;
    return Math.floor(
      (this.checkOutTime.getTime() - this.checkInTime.getTime()) / 60000,
    );
  }

  /**
   * Check if student is still in clinic
   * @returns true if visit is active (not checked out)
   */
  isStillInClinic(): boolean {
    return !this.checkOutTime;
  }

  /**
   * Check if visit is long (over 30 minutes)
   * @returns true if duration exceeds 30 minutes
   */
  isLongVisit(): boolean {
    const duration = this.getDuration();
    return duration !== null && duration > 30;
  }
}
