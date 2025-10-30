import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany
  } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import type { School } from './school.model';
import type { District } from './district.model';

export enum UserRole {
  ADMIN = 'ADMIN',
  NURSE = 'NURSE',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  DISTRICT_ADMIN = 'DISTRICT_ADMIN',
  VIEWER = 'VIEWER',
  COUNSELOR = 'COUNSELOR'
  }

export interface UserAttributes {
  id?: string;
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
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['schoolId'] },
    { fields: ['districtId'] },
    { fields: ['role'] },
    { fields: ['isActive'] },
    { fields: ['emailVerificationToken'] },
    { fields: ['passwordResetToken'] }
  ]
  })
export class User extends Model<UserAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
    comment: 'User email address (unique, used for login)'
  })
  declare email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Hashed password (bcrypt)'
  })
  declare password: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  declare firstName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  declare lastName: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: UserRole.NURSE,
    validate: {
      isIn: [Object.values(UserRole)]
    },
    comment: 'User role for authorization'
  })
  declare role: UserRole;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  declare isActive: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  declare lastLogin?: Date;

  @ForeignKey(() => require('./school.model').School)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    references: {
      model: 'schools',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    comment: 'ID of the school this user is associated with'
  })
  declare schoolId?: string;

  @ForeignKey(() => require('./district.model').District)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    references: {
      model: 'districts',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    comment: 'ID of the district this user is associated with'
  })
  declare districtId?: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true
  })
  declare phone?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  declare emailVerified: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true
  })
  declare emailVerificationToken?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  declare emailVerificationExpires?: Date;

  @Column({
    type: DataType.STRING(255),
    allowNull: true
  })
  declare passwordResetToken?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  declare passwordResetExpires?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Timestamp when password was last changed (for token invalidation)'
  })
  declare passwordChangedAt?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  declare twoFactorEnabled: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true
  })
  declare twoFactorSecret?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  declare failedLoginAttempts: number;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  declare lockoutUntil?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Timestamp when password was last changed (for password rotation policy)'
  })
  declare lastPasswordChange?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  declare mustChangePassword: boolean;

  // Associations
  @BelongsTo(() => require('./school.model').School, {
    foreignKey: 'schoolId',
    as: 'school',
  })
  declare school?: School;

  @BelongsTo(() => require('./district.model').District, {
    foreignKey: 'districtId',
    as: 'district',
  })
  declare district?: District;

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
