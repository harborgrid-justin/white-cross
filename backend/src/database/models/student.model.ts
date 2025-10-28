import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  BeforeCreate,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export interface StudentAttributes {
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade: string;
  gender: string;
  photo?: string;
  medicalRecordNum?: string;
  isActive: boolean;
  enrollmentDate: Date;
  nurseId?: string;
  schoolId?: string;
  districtId?: string;
  createdBy?: string;
  updatedBy?: string;
}

@Table({
  tableName: 'students',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['studentNumber'],
    },
    {
      unique: true,
      fields: ['medicalRecordNum'],
      where: {
        medicalRecordNum: { $ne: null },
      },
    },
    {
      fields: ['nurseId'],
    },
    {
      fields: ['isActive'],
    },
    {
      fields: ['grade'],
    },
  ],
})
export class Student extends Model<StudentAttributes> implements StudentAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  studentNumber: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dateOfBirth: Date;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  grade: string;

  @Column({
    type: DataType.ENUM('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'),
    allowNull: false,
  })
  gender: string;

  @Column(DataType.STRING(500))
  photo?: string;

  @Column({
    type: DataType.STRING(50),
    unique: true,
  })
  medicalRecordNum?: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @Default(() => new Date())
  @Column(DataType.DATE)
  enrollmentDate: Date;

  @Column(DataType.UUID)
  nurseId?: string;

  @Column(DataType.UUID)
  schoolId?: string;

  @Column(DataType.UUID)
  districtId?: string;

  @Column(DataType.UUID)
  createdBy?: string;

  @Column(DataType.UUID)
  updatedBy?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;
}
