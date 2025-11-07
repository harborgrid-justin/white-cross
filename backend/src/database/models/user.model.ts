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
  HasMany,
  Scopes,
  DeletedAt,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import type { School } from './school.model';
import type { District } from './district.model';
import type { Appointment } from './appointment.model';
import type { ClinicalNote } from './clinical-note.model';
import type { Message } from './message.model';
import type { Alert } from './alert.model';
import type { IncidentReport } from './incident-report.model';
import type { Prescription } from './prescription.model';
import type { ClinicVisit } from './clinic-visit.model';

// Re-export UserRole from types to maintain backward compatibility
// and prevent circular dependencies
export { UserRole, isUserRole, getUserRoleDisplayName } from '../types/user-role.enum';

export interface UserAttributes {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date | null;
  schoolId?: string | null;
  districtId?: string | null;
  phone?: string | null;
  emailVerified: boolean;
  emailVerificationToken?: string | null;
  emailVerificationExpires?: Date | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  passwordChangedAt?: Date | null;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string | null;
  failedLoginAttempts: number;
  lockoutUntil?: Date | null;
  lastPasswordChange?: Date | null;
  mustChangePassword: boolean;
  mfaEnabled: boolean;
  mfaSecret?: string | null;
  mfaBackupCodes?: string | null;
  mfaEnabledAt?: Date | null;
  oauthProvider?: string | null;
  oauthProviderId?: string | null;
  profilePictureUrl?: string | null;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | 'id'
    | 'isActive'
    | 'lastLogin'
    | 'schoolId'
    | 'districtId'
    | 'phone'
    | 'emailVerified'
    | 'emailVerificationToken'
    | 'emailVerificationExpires'
    | 'passwordResetToken'
    | 'passwordResetExpires'
    | 'passwordChangedAt'
    | 'twoFactorEnabled'
    | 'twoFactorSecret'
    | 'failedLoginAttempts'
    | 'lockoutUntil'
    | 'lastPasswordChange'
    | 'mustChangePassword'
    | 'mfaEnabled'
    | 'mfaSecret'
    | 'mfaBackupCodes'
    | 'mfaEnabledAt'
    | 'oauthProvider'
    | 'oauthProviderId'
    | 'profilePictureUrl'
    | 'isEmailVerified'
    | 'emailVerifiedAt'
    | 'deletedAt'
    | 'createdAt'
    | 'updatedAt'
  > {}

@Scopes(() => ({
  active: {
    where: {
      isActive: true,
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
  byRole: (role: UserRole) => ({
    where: { role, isActive: true },
    order: [
      ['lastName', 'ASC'],
      ['firstName', 'ASC'],
    ],
  }),
  bySchool: (schoolId: string) => ({
    where: { schoolId, isActive: true },
    order: [
      ['lastName', 'ASC'],
      ['firstName', 'ASC'],
    ],
  }),
  byDistrict: (districtId: string) => ({
    where: { districtId, isActive: true },
    order: [
      ['lastName', 'ASC'],
      ['firstName', 'ASC'],
    ],
  }),
  nurses: {
    where: {
      role: UserRole.NURSE,
      isActive: true,
    },
    order: [
      ['lastName', 'ASC'],
      ['firstName', 'ASC'],
    ],
  },
  admins: {
    where: {
      role: {
        [Op.in]: [
          UserRole.ADMIN,
          UserRole.DISTRICT_ADMIN,
          UserRole.SCHOOL_ADMIN,
        ],
      },
      isActive: true,
    },
    order: [
      ['role', 'ASC'],
      ['lastName', 'ASC'],
    ],
  },
  locked: {
    where: {
      lockoutUntil: {
        [Op.gt]: new Date(),
      },
    },
    order: [['lockoutUntil', 'DESC']],
  },
  unverified: {
    where: {
      emailVerified: false,
      isActive: true,
    },
    order: [['createdAt', 'ASC']],
  },
}))
@Table({
  tableName: 'users',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['schoolId'] },
    { fields: ['districtId'] },
    { fields: ['role'] },
    { fields: ['isActive'] },
    { fields: ['emailVerificationToken'] },
    { fields: ['passwordResetToken'] },
    { fields: ['createdAt'], name: 'idx_users_created_at' },
    { fields: ['updatedAt'], name: 'idx_users_updated_at' },
  ],
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
    comment: 'User email address (unique, used for login)',
  })
  declare email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Hashed password (bcrypt)',
  })
  declare password: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare firstName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare lastName: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: UserRole.NURSE,
    validate: {
      isIn: [Object.values(UserRole)],
    },
    comment: 'User role for authorization',
  })
  declare role: UserRole;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare lastLogin?: Date;

  @ForeignKey(() => require('./school.model').School)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    references: {
      model: 'schools',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    comment: 'ID of the school this user is associated with',
  })
  declare schoolId?: string;

  @ForeignKey(() => require('./district.model').District)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    references: {
      model: 'districts',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    comment: 'ID of the district this user is associated with',
  })
  declare districtId?: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    validate: {
      is: {
        args: /^\+?[1-9]\d{1,14}$/,
        msg: 'Phone number must be in E.164 format (e.g., +12125551234)',
      },
    },
  })
  declare phone?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare emailVerified: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare emailVerificationToken?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare emailVerificationExpires?: Date;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare passwordResetToken?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare passwordResetExpires?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment:
      'Timestamp when password was last changed (for token invalidation)',
  })
  declare passwordChangedAt?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare twoFactorEnabled: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare twoFactorSecret?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare failedLoginAttempts: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare lockoutUntil?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment:
      'Timestamp when password was last changed (for password rotation policy)',
  })
  declare lastPasswordChange?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare mustChangePassword: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt: Date;

  // MFA fields
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether multi-factor authentication is enabled',
  })
  declare mfaEnabled: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'TOTP secret for MFA (encrypted)',
  })
  declare mfaSecret?: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'JSON array of hashed backup codes for MFA recovery',
  })
  declare mfaBackupCodes?: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Timestamp when MFA was enabled',
  })
  declare mfaEnabledAt?: Date | null;

  // OAuth fields
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: 'OAuth provider (google, microsoft, etc.)',
  })
  declare oauthProvider?: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'User ID from OAuth provider',
  })
  declare oauthProviderId?: string | null;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    comment: 'URL to user profile picture',
  })
  declare profilePictureUrl?: string | null;

  // Enhanced email verification fields
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether email address has been verified',
  })
  declare isEmailVerified: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Timestamp when email was verified',
  })
  declare emailVerifiedAt?: Date | null;

  // Soft delete timestamp (paranoid mode)
  @DeletedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Soft delete timestamp for paranoid mode',
  })
  declare deletedAt?: Date | null;

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

  // One-to-many relationships
  @HasMany(() => require('./appointment.model').Appointment, {
    foreignKey: 'nurseId',
    as: 'appointments',
  })
  declare appointments?: Appointment[];

  @HasMany(() => require('./clinical-note.model').ClinicalNote, {
    foreignKey: 'createdBy',
    as: 'clinicalNotes',
  })
  declare clinicalNotes?: ClinicalNote[];

  @HasMany(() => require('./message.model').Message, {
    foreignKey: 'senderId',
    as: 'sentMessages',
  })
  declare sentMessages?: Message[];

  @HasMany(() => require('./alert.model').Alert, {
    foreignKey: 'createdBy',
    as: 'createdAlerts',
  })
  declare createdAlerts?: Alert[];

  @HasMany(() => require('./alert.model').Alert, {
    foreignKey: 'acknowledgedBy',
    as: 'acknowledgedAlerts',
  })
  declare acknowledgedAlerts?: Alert[];

  @HasMany(() => require('./alert.model').Alert, {
    foreignKey: 'resolvedBy',
    as: 'resolvedAlerts',
  })
  declare resolvedAlerts?: Alert[];

  @HasMany(() => require('./incident-report.model').IncidentReport, {
    foreignKey: 'reportedById',
    as: 'reportedIncidents',
  })
  declare reportedIncidents?: IncidentReport[];

  @HasMany(() => require('./prescription.model').Prescription, {
    foreignKey: 'prescribedBy',
    as: 'prescriptions',
  })
  declare prescriptions?: Prescription[];

  @HasMany(() => require('./clinic-visit.model').ClinicVisit, {
    foreignKey: 'attendedBy',
    as: 'clinicVisits',
  })
  declare clinicVisits?: ClinicVisit[];

  /**
   * SECURITY FIX: Configurable bcrypt salt rounds
   *
   * Before: Hardcoded 10 rounds (inconsistent with AuthService using 12)
   * After: Reads from BCRYPT_SALT_ROUNDS environment variable (default 12)
   *
   * Salt Rounds Guidance:
   * - 10 rounds: Fast, acceptable for general use
   * - 12 rounds: Balanced, recommended for healthcare (PHI protection)
   * - 14 rounds: Very secure, slower (consider for admin accounts)
   *
   * IMPORTANT: Must match AuthService configuration
   */
  @BeforeCreate
  static async hashPasswordBeforeCreate(user: User) {
    if (user.password) {
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

      // Validate salt rounds
      if (saltRounds < 10 || saltRounds > 14) {
        throw new Error(
          `SECURITY WARNING: bcrypt salt rounds must be between 10 and 14. Current: ${saltRounds}`,
        );
      }

      user.password = await bcrypt.hash(user.password, saltRounds);
      user.lastPasswordChange = new Date();
    }
  }

  @BeforeUpdate
  static async hashPasswordBeforeUpdate(user: User) {
    if (user.changed('password')) {
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

      // Validate salt rounds
      if (saltRounds < 10 || saltRounds > 14) {
        throw new Error(
          `SECURITY WARNING: bcrypt salt rounds must be between 10 and 14. Current: ${saltRounds}`,
        );
      }

      user.password = await bcrypt.hash(user.password, saltRounds);
      user.passwordChangedAt = new Date();
      user.lastPasswordChange = new Date();
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(user: User) {
    if (user.changed()) {
      const changedFields = user.changed() as string[];
      const phiFields = ['email', 'firstName', 'lastName', 'phone'];

      // Import the helper function dynamically to avoid circular dependencies
      const { logModelPHIFieldChanges } = await import(
        '../services/model-audit-helper.service.js'
      );

      // Get the transaction if available
      const transaction = (user as any).sequelize?.transaction || undefined;

      await logModelPHIFieldChanges(
        'User',
        user.id,
        changedFields,
        phiFields,
        transaction,
      );
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
      mfaSecret,
      mfaBackupCodes,
      ...safeData
    } = this.get({ plain: true });
    return {
      ...safeData,
      id: this.id, // Ensure id is always included
    };
  }

  isAccountLocked(): boolean {
    return this.lockoutUntil ? this.lockoutUntil > new Date() : false;
  }

  passwordChangedAfter(timestamp: number): boolean {
    if (this.passwordChangedAt) {
      const changedTimestamp = Math.floor(
        this.passwordChangedAt.getTime() / 1000,
      );
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
