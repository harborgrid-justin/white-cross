import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'ADMIN',
  NURSE = 'NURSE',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  DISTRICT_ADMIN = 'DISTRICT_ADMIN',
  VIEWER = 'VIEWER',
  COUNSELOR = 'COUNSELOR',
}

export interface UserAttributes {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  schoolId?: string;
  districtId?: string;
  phone?: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordChangedAt?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  failedLoginAttempts: number;
  lockoutUntil?: Date;
  lastPasswordChange?: Date;
  mustChangePassword: boolean;
}

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: false,
})
export class User extends Model<UserAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'firstName',
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'lastName',
  })
  lastName: string;

  @Column({
    type: DataType.ENUM(...(Object.values(UserRole) as string[])),
    allowNull: false,
    defaultValue: UserRole.NURSE,
  })
  role: UserRole;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'isActive',
  })
  isActive: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'lastLogin',
  })
  lastLogin?: Date;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'schoolId',
  })
  schoolId?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'districtId',
  })
  districtId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'phone',
  })
  phone?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'emailVerified',
  })
  emailVerified: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'emailVerificationToken',
  })
  emailVerificationToken?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'emailVerificationExpires',
  })
  emailVerificationExpires?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'passwordResetToken',
  })
  passwordResetToken?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'passwordResetExpires',
  })
  passwordResetExpires?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'passwordChangedAt',
  })
  passwordChangedAt?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'twoFactorEnabled',
  })
  twoFactorEnabled: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'twoFactorSecret',
  })
  twoFactorSecret?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'failedLoginAttempts',
  })
  failedLoginAttempts: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'lockoutUntil',
  })
  lockoutUntil?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'lastPasswordChange',
  })
  lastPasswordChange?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'mustChangePassword',
  })
  mustChangePassword: boolean;

  @BeforeCreate
  static async hashPasswordBeforeCreate(user: User) {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
      user.lastPasswordChange = new Date();
    }
  }

  @BeforeUpdate
  static async hashPasswordBeforeUpdate(user: User) {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
      user.passwordChangedAt = new Date();
      user.lastPasswordChange = new Date();
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  toSafeObject() {
    const {
      password,
      passwordResetToken,
      passwordResetExpires,
      emailVerificationToken,
      emailVerificationExpires,
      twoFactorSecret,
      ...safeData
    } = this.get({ plain: true });
    return {
      ...safeData,
      id: this.id!, // Ensure id is always included
    };
  }

  isAccountLocked(): boolean {
    return this.lockoutUntil ? this.lockoutUntil > new Date() : false;
  }

  passwordChangedAfter(timestamp: number): boolean {
    if (this.passwordChangedAt) {
      const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
      return changedTimestamp > timestamp;
    }
    return false;
  }

  async incrementFailedLoginAttempts(): Promise<void> {
    this.failedLoginAttempts += 1;

    if (this.failedLoginAttempts >= 5) {
      this.lockoutUntil = new Date(Date.now() + 30 * 60 * 1000);
    }

    await this.save();
  }

  async resetFailedLoginAttempts(): Promise<void> {
    this.failedLoginAttempts = 0;
    this.lockoutUntil = undefined;
    this.lastLogin = new Date();
    await this.save();
  }

  requiresPasswordChange(): boolean {
    if (this.mustChangePassword) {
      return true;
    }

    if (this.lastPasswordChange) {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      return this.lastPasswordChange < ninetyDaysAgo;
    }

    return false;
  }
}
