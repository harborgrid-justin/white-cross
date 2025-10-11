import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

interface SchoolAttributes {
  id: string;
  districtId: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  principal?: string;
  totalEnrollment?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SchoolCreationAttributes
  extends Optional<
    SchoolAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'isActive'
    | 'address'
    | 'city'
    | 'state'
    | 'zipCode'
    | 'phone'
    | 'email'
    | 'principal'
    | 'totalEnrollment'
  > {}

export class School extends Model<SchoolAttributes, SchoolCreationAttributes> implements SchoolAttributes {
  public id!: string;
  public districtId!: string;
  public name!: string;
  public code!: string;
  public address?: string;
  public city?: string;
  public state?: string;
  public zipCode?: string;
  public phone?: string;
  public email?: string;
  public principal?: string;
  public totalEnrollment?: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

School.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    districtId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'District ID is required for school'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'School name cannot be empty'
        },
        len: {
          args: [2, 200],
          msg: 'School name must be between 2 and 200 characters'
        }
      }
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'School code cannot be empty'
        },
        len: {
          args: [2, 50],
          msg: 'School code must be between 2 and 50 characters'
        },
        isUppercase: {
          msg: 'School code must be uppercase'
        },
        is: {
          args: /^[A-Z0-9_-]+$/,
          msg: 'School code can only contain uppercase letters, numbers, hyphens, and underscores'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'Address cannot exceed 500 characters'
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'City cannot exceed 100 characters'
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 2],
          msg: 'State must be a 2-letter abbreviation'
        },
        isUppercase: {
          msg: 'State abbreviation must be uppercase'
        }
      }
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: /^[0-9]{5}(-[0-9]{4})?$/,
          msg: 'ZIP code must be in format 12345 or 12345-6789'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: /^[\d\s\-\(\)\+\.]+$/,
          msg: 'Phone number contains invalid characters'
        },
        len: {
          args: [10, 20],
          msg: 'Phone number must be between 10 and 20 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Invalid email address format'
        },
        len: {
          args: [0, 255],
          msg: 'Email cannot exceed 255 characters'
        }
      }
    },
    principal: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 200],
          msg: 'Principal name cannot exceed 200 characters'
        }
      }
    },
    totalEnrollment: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'Total enrollment cannot be negative'
        },
        max: {
          args: [50000],
          msg: 'Total enrollment cannot exceed 50,000'
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'schools',
    timestamps: true,
    indexes: [{ fields: ['districtId'] }, { fields: ['code'] }, { fields: ['isActive'] }],
    validate: {
      // Custom validation to ensure at least contact information is provided
      hasContactInfo() {
        if (!this.phone && !this.email && !this.address) {
          throw new Error('School must have at least one form of contact information (phone, email, or address)');
        }
      }
    }
  }
);
