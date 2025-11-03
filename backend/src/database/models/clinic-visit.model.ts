import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  ForeignKey,
  BelongsTo
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
  underscored: false,
  paranoid: true,
  indexes: [
    {
      fields: ['studentId']
  },
    {
      fields: ['checkInTime']
  },
    {
      fields: ['checkOutTime']
  },
    {
      fields: ['disposition']
  },
    {
      fields: ['attendedBy']
  },
  ]
  })
export class ClinicVisit extends Model<ClinicVisitAttributes> implements ClinicVisitAttributes {
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
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  @Index
  studentId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  @Index
  checkInTime: Date;

  @AllowNull
  @Column({
    type: DataType.DATE
  })
  @Index
  checkOutTime?: Date;

  @Column({
    type: DataType.JSON,
    allowNull: false
  })
  reasonForVisit: string[];

  @AllowNull
  @Column({
    type: DataType.JSON
  })
  symptoms?: string[];

  @AllowNull
  @Column({
    type: DataType.TEXT
  })
  treatment?: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(VisitDisposition)]
    },
    allowNull: false
  })
  @Index
  disposition: VisitDisposition;

  @AllowNull
  @Column({
    type: DataType.JSON
  })
  classesMissed?: string[];

  @AllowNull
  @Column({
    type: DataType.INTEGER
  })
  minutesMissed?: number;

  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  })
  @Index
  attendedBy: string;

  @AllowNull
  @Column({
    type: DataType.TEXT
  })
  notes?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Associations
  @BelongsTo(() => require('./student.model').Student, { foreignKey: 'studentId', as: 'student' })
  declare student?: any;

  @BelongsTo(() => require('./user.model').User, { foreignKey: 'attendedBy', as: 'attendingNurse' })
  declare attendingNurse?: any;

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
