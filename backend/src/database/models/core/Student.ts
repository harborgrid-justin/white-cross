import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { Gender } from '../../types/enums';
import { AuditableModel } from '../base/AuditableModel';

interface StudentAttributes {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade: string;
  gender: Gender;
  photo?: string;
  medicalRecordNum?: string;
  isActive: boolean;
  enrollmentDate: Date;
  nurseId?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface StudentCreationAttributes
  extends Optional<
    StudentAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'enrollmentDate' | 'photo' | 'medicalRecordNum' | 'nurseId' | 'createdBy' | 'updatedBy'
  > {}

export class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
  public id!: string;
  public studentNumber!: string;
  public firstName!: string;
  public lastName!: string;
  public dateOfBirth!: Date;
  public grade!: string;
  public gender!: Gender;
  public photo?: string;
  public medicalRecordNum?: string;
  public isActive!: boolean;
  public enrollmentDate!: Date;
  public nurseId?: string;
  public createdBy?: string;
  public updatedBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get age(): number {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}

Student.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM(...Object.values(Gender)),
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    medicalRecordNum: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    enrollmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    nurseId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ...AuditableModel.getAuditableFields(),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'students',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['studentNumber'] },
      { fields: ['nurseId'] },
      { fields: ['isActive'] },
      { fields: ['grade'] },
      { fields: ['lastName', 'firstName'] },
      { fields: ['createdBy'] },
    ],
  }
);

AuditableModel.setupAuditHooks(Student, 'Student');
