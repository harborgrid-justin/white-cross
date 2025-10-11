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
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Student number cannot be empty'
        },
        len: {
          args: [4, 20],
          msg: 'Student number must be between 4 and 20 characters'
        },
        isAlphanumericWithHyphens(value: string) {
          if (!/^[A-Z0-9-]+$/i.test(value)) {
            throw new Error('Student number must be alphanumeric with optional hyphens');
          }
        }
      }
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'First name is required'
        },
        len: {
          args: [1, 100],
          msg: 'First name must be between 1 and 100 characters'
        },
        isValidName(value: string) {
          if (!/^[a-zA-Z\s'-]+$/.test(value)) {
            throw new Error('First name can only contain letters, spaces, hyphens, and apostrophes');
          }
        }
      }
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Last name is required'
        },
        len: {
          args: [1, 100],
          msg: 'Last name must be between 1 and 100 characters'
        },
        isValidName(value: string) {
          if (!/^[a-zA-Z\s'-]+$/.test(value)) {
            throw new Error('Last name can only contain letters, spaces, hyphens, and apostrophes');
          }
        }
      }
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Date of birth is required'
        },
        isDate: {
          msg: 'Date of birth must be a valid date',
          args: true
        },
        isInPast(value: Date) {
          if (new Date(value) >= new Date()) {
            throw new Error('Date of birth must be in the past');
          }
        },
        isReasonableAge(value: Date) {
          const today = new Date();
          const birthDate = new Date(value);
          const age = today.getFullYear() - birthDate.getFullYear();

          if (age < 3 || age > 100) {
            throw new Error('Student age must be between 3 and 100 years');
          }
        }
      }
    },
    grade: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Grade is required'
        },
        len: {
          args: [1, 10],
          msg: 'Grade must be between 1 and 10 characters'
        }
      }
    },
    gender: {
      type: DataTypes.ENUM(...Object.values(Gender)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(Gender)],
          msg: 'Gender must be MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY'
        }
      }
    },
    photo: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Photo must be a valid URL'
        },
        len: {
          args: [0, 500],
          msg: 'Photo URL cannot exceed 500 characters'
        }
      }
    },
    medicalRecordNum: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      validate: {
        len: {
          args: [5, 20],
          msg: 'Medical record number must be between 5 and 20 characters'
        },
        isAlphanumericWithHyphens(value: string) {
          if (value && !/^[A-Z0-9-]+$/i.test(value)) {
            throw new Error('Medical record number must be alphanumeric with optional hyphens');
          }
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        isBoolean(value: any) {
          if (typeof value !== 'boolean') {
            throw new Error('Active status must be a boolean');
          }
        }
      }
    },
    enrollmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          msg: 'Enrollment date must be a valid date',
          args: true
        },
        isReasonableDate(value: Date) {
          const enrollDate = new Date(value);
          const minDate = new Date(2000, 0, 1);
          const maxDate = new Date();
          maxDate.setFullYear(maxDate.getFullYear() + 1);

          if (enrollDate < minDate || enrollDate > maxDate) {
            throw new Error('Enrollment date must be between 2000 and one year from today');
          }
        }
      }
    },
    nurseId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      validate: {
        isUUID: {
          args: 4,
          msg: 'Nurse ID must be a valid UUID'
        }
      }
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
