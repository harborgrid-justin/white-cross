/**
 * LOC: EDU-LIB-KIT-001
 * File: /reuse/education/library-integration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - rxjs (v7.x) for reactive state management
 *
 * DOWNSTREAM (imported by):
 *   - Library management modules
 *   - Student services integration
 *   - Course reserve systems
 */

/**
 * File: /reuse/education/library-integration-kit.ts
 * Locator: WC-EDU-LIB-KIT-001
 * Purpose: Library Integration Kit - Comprehensive library management, circulation, reserves, and digital resources
 *
 * Upstream: sequelize v6.x, rxjs v7.x, validator v13.x
 * Downstream: ../backend/education/*, library modules, student portals, course management
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x, RxJS 7.x
 * Exports: 45 functions for library accounts, checkouts, reserves, fines, holds, ILL, digital resources, state management
 *
 * LLM Context: Production-grade library integration toolkit for education SIS. Provides comprehensive tools for
 * library account management, circulation (checkout/checkin), course reserves, fine calculation and payment,
 * hold management, inter-library loan (ILL) processing, digital resource access control, and reactive state
 * management with observable patterns. Supports FERPA compliance and integration with library management systems.
 */

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  FindOptions,
  WhereOptions,
  Op,
  Transaction,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
} from 'sequelize';
import { BehaviorSubject, Observable, Subject, merge, combineLatest } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, shareReplay } from 'rxjs/operators';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Library account status enumeration
 */
export enum LibraryAccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BLOCKED = 'BLOCKED',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
}

/**
 * Checkout status enumeration
 */
export enum CheckoutStatus {
  ACTIVE = 'ACTIVE',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
  RENEWED = 'RENEWED',
  LOST = 'LOST',
  DAMAGED = 'DAMAGED',
}

/**
 * Reserve status enumeration
 */
export enum ReserveStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

/**
 * Fine status enumeration
 */
export enum FineStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  WAIVED = 'WAIVED',
  PARTIAL = 'PARTIAL',
  WRITTEN_OFF = 'WRITTEN_OFF',
}

/**
 * Hold status enumeration
 */
export enum HoldStatus {
  PLACED = 'PLACED',
  AVAILABLE = 'AVAILABLE',
  PICKED_UP = 'PICKED_UP',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

/**
 * Inter-library loan status
 */
export enum ILLStatus {
  REQUESTED = 'REQUESTED',
  PROCESSING = 'PROCESSING',
  IN_TRANSIT = 'IN_TRANSIT',
  AVAILABLE = 'AVAILABLE',
  CHECKED_OUT = 'CHECKED_OUT',
  RETURNED = 'RETURNED',
  CANCELLED = 'CANCELLED',
}

/**
 * Digital resource access level
 */
export enum DigitalAccessLevel {
  FULL = 'FULL',
  LIMITED = 'LIMITED',
  TRIAL = 'TRIAL',
  EXPIRED = 'EXPIRED',
  RESTRICTED = 'RESTRICTED',
}

/**
 * Library account attributes
 */
export interface LibraryAccountAttributes {
  id: string;
  userId: string;
  accountNumber: string;
  status: LibraryAccountStatus;
  accountType: string;
  patronGroup: string;
  checkoutLimit: number;
  currentCheckouts: number;
  holdLimit: number;
  currentHolds: number;
  totalFines: number;
  expirationDate: Date;
  barcode?: string;
  pin?: string;
  notes?: string;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

/**
 * Checkout attributes
 */
export interface CheckoutAttributes {
  id: string;
  accountId: string;
  itemId: string;
  itemBarcode: string;
  itemTitle: string;
  checkoutDate: Date;
  dueDate: Date;
  returnDate?: Date;
  renewalCount: number;
  maxRenewals: number;
  status: CheckoutStatus;
  isOverdue: boolean;
  overdueNotificationSent: boolean;
  libraryId: string;
  checkoutLibrarian?: string;
  returnLibrarian?: string;
  notes?: string;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Reserve attributes
 */
export interface ReserveAttributes {
  id: string;
  accountId: string;
  itemId: string;
  itemBarcode?: string;
  itemTitle: string;
  reserveType: 'COURSE' | 'PERSONAL' | 'FACULTY';
  courseId?: string;
  instructorId?: string;
  status: ReserveStatus;
  requestDate: Date;
  availableDate?: Date;
  expirationDate: Date;
  pickupLocation?: string;
  notificationSent: boolean;
  priority: number;
  notes?: string;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Library fine attributes
 */
export interface LibraryFineAttributes {
  id: string;
  accountId: string;
  checkoutId?: string;
  fineType: 'OVERDUE' | 'LOST' | 'DAMAGED' | 'PROCESSING' | 'OTHER';
  amount: number;
  amountPaid: number;
  balance: number;
  status: FineStatus;
  description: string;
  assessedDate: Date;
  dueDate?: Date;
  paidDate?: Date;
  waivedDate?: Date;
  waivedBy?: string;
  waiverReason?: string;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Hold attributes
 */
export interface HoldAttributes {
  id: string;
  accountId: string;
  itemId: string;
  itemBarcode?: string;
  itemTitle: string;
  status: HoldStatus;
  placedDate: Date;
  availableDate?: Date;
  expirationDate: Date;
  pickupDate?: Date;
  pickupLocation: string;
  queuePosition: number;
  notificationPreference: 'EMAIL' | 'SMS' | 'PHONE' | 'NONE';
  notificationSent: boolean;
  isActive: boolean;
  notes?: string;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Inter-library loan attributes
 */
export interface ILLAttributes {
  id: string;
  accountId: string;
  requestType: 'BOOK' | 'ARTICLE' | 'CHAPTER' | 'OTHER';
  status: ILLStatus;
  requestDate: Date;
  itemTitle: string;
  itemAuthor?: string;
  itemISBN?: string;
  itemISSN?: string;
  itemDOI?: string;
  sourceLibrary?: string;
  estimatedArrival?: Date;
  actualArrival?: Date;
  loanPeriod?: number;
  dueDate?: Date;
  cost?: number;
  trackingNumber?: string;
  notes?: string;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Digital resource access attributes
 */
export interface DigitalResourceAccessAttributes {
  id: string;
  accountId: string;
  resourceId: string;
  resourceType: 'EBOOK' | 'DATABASE' | 'JOURNAL' | 'VIDEO' | 'AUDIO' | 'OTHER';
  resourceName: string;
  accessLevel: DigitalAccessLevel;
  accessStartDate: Date;
  accessEndDate?: Date;
  simultaneousUsers?: number;
  currentUsers: number;
  accessCount: number;
  lastAccessDate?: Date;
  downloadLimit?: number;
  downloadCount: number;
  printLimit?: number;
  printCount: number;
  url?: string;
  notes?: string;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * State container for library data
 */
export interface LibraryState {
  accounts: Map<string, LibraryAccountAttributes>;
  checkouts: Map<string, CheckoutAttributes>;
  reserves: Map<string, ReserveAttributes>;
  fines: Map<string, LibraryFineAttributes>;
  holds: Map<string, HoldAttributes>;
  illRequests: Map<string, ILLAttributes>;
  digitalAccess: Map<string, DigitalResourceAccessAttributes>;
}

/**
 * Library event types
 */
export enum LibraryEventType {
  ACCOUNT_CREATED = 'ACCOUNT_CREATED',
  ACCOUNT_UPDATED = 'ACCOUNT_UPDATED',
  CHECKOUT_CREATED = 'CHECKOUT_CREATED',
  CHECKOUT_RENEWED = 'CHECKOUT_RENEWED',
  CHECKOUT_RETURNED = 'CHECKOUT_RETURNED',
  FINE_ASSESSED = 'FINE_ASSESSED',
  FINE_PAID = 'FINE_PAID',
  HOLD_PLACED = 'HOLD_PLACED',
  HOLD_AVAILABLE = 'HOLD_AVAILABLE',
  RESERVE_CREATED = 'RESERVE_CREATED',
  ILL_REQUESTED = 'ILL_REQUESTED',
  DIGITAL_ACCESS_GRANTED = 'DIGITAL_ACCESS_GRANTED',
}

/**
 * Library event
 */
export interface LibraryEvent {
  type: LibraryEventType;
  accountId: string;
  itemId?: string;
  timestamp: Date;
  data: any;
  userId?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * LibraryAccount model class
 */
export class LibraryAccount extends Model<LibraryAccountAttributes> implements LibraryAccountAttributes {
  public id!: string;
  public userId!: string;
  public accountNumber!: string;
  public status!: LibraryAccountStatus;
  public accountType!: string;
  public patronGroup!: string;
  public checkoutLimit!: number;
  public currentCheckouts!: number;
  public holdLimit!: number;
  public currentHolds!: number;
  public totalFines!: number;
  public expirationDate!: Date;
  public barcode?: string;
  public pin?: string;
  public notes?: string;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

/**
 * Checkout model class
 */
export class Checkout extends Model<CheckoutAttributes> implements CheckoutAttributes {
  public id!: string;
  public accountId!: string;
  public itemId!: string;
  public itemBarcode!: string;
  public itemTitle!: string;
  public checkoutDate!: Date;
  public dueDate!: Date;
  public returnDate?: Date;
  public renewalCount!: number;
  public maxRenewals!: number;
  public status!: CheckoutStatus;
  public isOverdue!: boolean;
  public overdueNotificationSent!: boolean;
  public libraryId!: string;
  public checkoutLibrarian?: string;
  public returnLibrarian?: string;
  public notes?: string;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * Reserve model class
 */
export class Reserve extends Model<ReserveAttributes> implements ReserveAttributes {
  public id!: string;
  public accountId!: string;
  public itemId!: string;
  public itemBarcode?: string;
  public itemTitle!: string;
  public reserveType!: 'COURSE' | 'PERSONAL' | 'FACULTY';
  public courseId?: string;
  public instructorId?: string;
  public status!: ReserveStatus;
  public requestDate!: Date;
  public availableDate?: Date;
  public expirationDate!: Date;
  public pickupLocation?: string;
  public notificationSent!: boolean;
  public priority!: number;
  public notes?: string;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * LibraryFine model class
 */
export class LibraryFine extends Model<LibraryFineAttributes> implements LibraryFineAttributes {
  public id!: string;
  public accountId!: string;
  public checkoutId?: string;
  public fineType!: 'OVERDUE' | 'LOST' | 'DAMAGED' | 'PROCESSING' | 'OTHER';
  public amount!: number;
  public amountPaid!: number;
  public balance!: number;
  public status!: FineStatus;
  public description!: string;
  public assessedDate!: Date;
  public dueDate?: Date;
  public paidDate?: Date;
  public waivedDate?: Date;
  public waivedBy?: string;
  public waiverReason?: string;
  public paymentMethod?: string;
  public transactionId?: string;
  public notes?: string;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * Hold model class
 */
export class Hold extends Model<HoldAttributes> implements HoldAttributes {
  public id!: string;
  public accountId!: string;
  public itemId!: string;
  public itemBarcode?: string;
  public itemTitle!: string;
  public status!: HoldStatus;
  public placedDate!: Date;
  public availableDate?: Date;
  public expirationDate!: Date;
  public pickupDate?: Date;
  public pickupLocation!: string;
  public queuePosition!: number;
  public notificationPreference!: 'EMAIL' | 'SMS' | 'PHONE' | 'NONE';
  public notificationSent!: boolean;
  public isActive!: boolean;
  public notes?: string;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * InterLibraryLoan model class
 */
export class InterLibraryLoan extends Model<ILLAttributes> implements ILLAttributes {
  public id!: string;
  public accountId!: string;
  public requestType!: 'BOOK' | 'ARTICLE' | 'CHAPTER' | 'OTHER';
  public status!: ILLStatus;
  public requestDate!: Date;
  public itemTitle!: string;
  public itemAuthor?: string;
  public itemISBN?: string;
  public itemISSN?: string;
  public itemDOI?: string;
  public sourceLibrary?: string;
  public estimatedArrival?: Date;
  public actualArrival?: Date;
  public loanPeriod?: number;
  public dueDate?: Date;
  public cost?: number;
  public trackingNumber?: string;
  public notes?: string;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * DigitalResourceAccess model class
 */
export class DigitalResourceAccess extends Model<DigitalResourceAccessAttributes> implements DigitalResourceAccessAttributes {
  public id!: string;
  public accountId!: string;
  public resourceId!: string;
  public resourceType!: 'EBOOK' | 'DATABASE' | 'JOURNAL' | 'VIDEO' | 'AUDIO' | 'OTHER';
  public resourceName!: string;
  public accessLevel!: DigitalAccessLevel;
  public accessStartDate!: Date;
  public accessEndDate?: Date;
  public simultaneousUsers?: number;
  public currentUsers!: number;
  public accessCount!: number;
  public lastAccessDate?: Date;
  public downloadLimit?: number;
  public downloadCount!: number;
  public printLimit?: number;
  public printCount!: number;
  public url?: string;
  public notes?: string;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// ============================================================================
// MODEL INITIALIZATION
// ============================================================================

/**
 * Initialize LibraryAccount model
 */
export function initLibraryAccountModel(sequelize: Sequelize): typeof LibraryAccount {
  LibraryAccount.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      accountNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(LibraryAccountStatus)),
        allowNull: false,
        defaultValue: LibraryAccountStatus.ACTIVE,
      },
      accountType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'STUDENT',
      },
      patronGroup: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'UNDERGRADUATE',
      },
      checkoutLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
      },
      currentCheckouts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      holdLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
      },
      currentHolds: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      totalFines: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      barcode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
      },
      pin: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'library_accounts',
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['userId'] },
        { fields: ['accountNumber'] },
        { fields: ['status'] },
        { fields: ['barcode'] },
      ],
    }
  );

  return LibraryAccount;
}

/**
 * Initialize Checkout model
 */
export function initCheckoutModel(sequelize: Sequelize): typeof Checkout {
  Checkout.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'library_accounts',
          key: 'id',
        },
      },
      itemId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      itemBarcode: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      itemTitle: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      checkoutDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      returnDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      renewalCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      maxRenewals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(CheckoutStatus)),
        allowNull: false,
        defaultValue: CheckoutStatus.ACTIVE,
      },
      isOverdue: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      overdueNotificationSent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      libraryId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      checkoutLibrarian: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      returnLibrarian: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'library_checkouts',
      timestamps: true,
      indexes: [
        { fields: ['accountId'] },
        { fields: ['itemId'] },
        { fields: ['status'] },
        { fields: ['dueDate'] },
        { fields: ['isOverdue'] },
      ],
    }
  );

  return Checkout;
}

/**
 * Initialize Reserve model
 */
export function initReserveModel(sequelize: Sequelize): typeof Reserve {
  Reserve.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'library_accounts',
          key: 'id',
        },
      },
      itemId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      itemBarcode: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      itemTitle: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      reserveType: {
        type: DataTypes.ENUM('COURSE', 'PERSONAL', 'FACULTY'),
        allowNull: false,
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      instructorId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ReserveStatus)),
        allowNull: false,
        defaultValue: ReserveStatus.PENDING,
      },
      requestDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      availableDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      pickupLocation: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      notificationSent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'library_reserves',
      timestamps: true,
      indexes: [
        { fields: ['accountId'] },
        { fields: ['itemId'] },
        { fields: ['courseId'] },
        { fields: ['status'] },
        { fields: ['reserveType'] },
      ],
    }
  );

  return Reserve;
}

/**
 * Initialize LibraryFine model
 */
export function initLibraryFineModel(sequelize: Sequelize): typeof LibraryFine {
  LibraryFine.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'library_accounts',
          key: 'id',
        },
      },
      checkoutId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'library_checkouts',
          key: 'id',
        },
      },
      fineType: {
        type: DataTypes.ENUM('OVERDUE', 'LOST', 'DAMAGED', 'PROCESSING', 'OTHER'),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      amountPaid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(FineStatus)),
        allowNull: false,
        defaultValue: FineStatus.PENDING,
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      assessedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      paidDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      waivedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      waivedBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      waiverReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      paymentMethod: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      transactionId: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'library_fines',
      timestamps: true,
      indexes: [
        { fields: ['accountId'] },
        { fields: ['checkoutId'] },
        { fields: ['status'] },
        { fields: ['fineType'] },
        { fields: ['assessedDate'] },
      ],
    }
  );

  return LibraryFine;
}

/**
 * Initialize Hold model
 */
export function initHoldModel(sequelize: Sequelize): typeof Hold {
  Hold.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'library_accounts',
          key: 'id',
        },
      },
      itemId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      itemBarcode: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      itemTitle: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(HoldStatus)),
        allowNull: false,
        defaultValue: HoldStatus.PLACED,
      },
      placedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      availableDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      pickupDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      pickupLocation: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      queuePosition: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      notificationPreference: {
        type: DataTypes.ENUM('EMAIL', 'SMS', 'PHONE', 'NONE'),
        allowNull: false,
        defaultValue: 'EMAIL',
      },
      notificationSent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'library_holds',
      timestamps: true,
      indexes: [
        { fields: ['accountId'] },
        { fields: ['itemId'] },
        { fields: ['status'] },
        { fields: ['isActive'] },
        { fields: ['queuePosition'] },
      ],
    }
  );

  return Hold;
}

/**
 * Initialize InterLibraryLoan model
 */
export function initInterLibraryLoanModel(sequelize: Sequelize): typeof InterLibraryLoan {
  InterLibraryLoan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'library_accounts',
          key: 'id',
        },
      },
      requestType: {
        type: DataTypes.ENUM('BOOK', 'ARTICLE', 'CHAPTER', 'OTHER'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ILLStatus)),
        allowNull: false,
        defaultValue: ILLStatus.REQUESTED,
      },
      requestDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      itemTitle: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      itemAuthor: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      itemISBN: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      itemISSN: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      itemDOI: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      sourceLibrary: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      estimatedArrival: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      actualArrival: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      loanPeriod: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      trackingNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'library_ill_requests',
      timestamps: true,
      indexes: [
        { fields: ['accountId'] },
        { fields: ['status'] },
        { fields: ['requestType'] },
        { fields: ['requestDate'] },
      ],
    }
  );

  return InterLibraryLoan;
}

/**
 * Initialize DigitalResourceAccess model
 */
export function initDigitalResourceAccessModel(sequelize: Sequelize): typeof DigitalResourceAccess {
  DigitalResourceAccess.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'library_accounts',
          key: 'id',
        },
      },
      resourceId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      resourceType: {
        type: DataTypes.ENUM('EBOOK', 'DATABASE', 'JOURNAL', 'VIDEO', 'AUDIO', 'OTHER'),
        allowNull: false,
      },
      resourceName: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      accessLevel: {
        type: DataTypes.ENUM(...Object.values(DigitalAccessLevel)),
        allowNull: false,
        defaultValue: DigitalAccessLevel.FULL,
      },
      accessStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      accessEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      simultaneousUsers: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      currentUsers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      accessCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lastAccessDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      downloadLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      downloadCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      printLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      printCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      url: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'library_digital_access',
      timestamps: true,
      indexes: [
        { fields: ['accountId'] },
        { fields: ['resourceId'] },
        { fields: ['resourceType'] },
        { fields: ['accessLevel'] },
      ],
    }
  );

  return DigitalResourceAccess;
}

// ============================================================================
// STATE MANAGEMENT - REACTIVE STORE
// ============================================================================

/**
 * Library state store with reactive observables
 */
export class LibraryStateStore {
  private state: BehaviorSubject<LibraryState>;
  private events: Subject<LibraryEvent>;

  constructor() {
    this.state = new BehaviorSubject<LibraryState>({
      accounts: new Map(),
      checkouts: new Map(),
      reserves: new Map(),
      fines: new Map(),
      holds: new Map(),
      illRequests: new Map(),
      digitalAccess: new Map(),
    });
    this.events = new Subject<LibraryEvent>();
  }

  /**
   * Get observable of current state
   */
  public getState$(): Observable<LibraryState> {
    return this.state.asObservable();
  }

  /**
   * Get observable of events
   */
  public getEvents$(): Observable<LibraryEvent> {
    return this.events.asObservable();
  }

  /**
   * Update account in state
   */
  public updateAccount(account: LibraryAccountAttributes): void {
    const currentState = this.state.value;
    currentState.accounts.set(account.id, account);
    this.state.next({ ...currentState });
  }

  /**
   * Update checkout in state
   */
  public updateCheckout(checkout: CheckoutAttributes): void {
    const currentState = this.state.value;
    currentState.checkouts.set(checkout.id, checkout);
    this.state.next({ ...currentState });
  }

  /**
   * Emit library event
   */
  public emitEvent(event: LibraryEvent): void {
    this.events.next(event);
  }

  /**
   * Get account observable by ID
   */
  public getAccount$(accountId: string): Observable<LibraryAccountAttributes | undefined> {
    return this.state.pipe(
      map(state => state.accounts.get(accountId)),
      distinctUntilChanged()
    );
  }

  /**
   * Get checkouts observable by account ID
   */
  public getCheckoutsByAccount$(accountId: string): Observable<CheckoutAttributes[]> {
    return this.state.pipe(
      map(state =>
        Array.from(state.checkouts.values()).filter(c => c.accountId === accountId)
      ),
      shareReplay(1)
    );
  }

  /**
   * Get overdue checkouts observable
   */
  public getOverdueCheckouts$(): Observable<CheckoutAttributes[]> {
    return this.state.pipe(
      map(state =>
        Array.from(state.checkouts.values()).filter(c => c.isOverdue)
      ),
      shareReplay(1)
    );
  }
}

// ============================================================================
// LIBRARY ACCOUNT FUNCTIONS
// ============================================================================

/**
 * Create library account
 */
export async function createLibraryAccount(
  data: Partial<LibraryAccountAttributes>,
  options?: CreateOptions
): Promise<LibraryAccount> {
  const accountNumber = data.accountNumber || generateAccountNumber();

  const account = await LibraryAccount.create(
    {
      ...data,
      accountNumber,
      status: data.status || LibraryAccountStatus.ACTIVE,
      metadata: data.metadata || {},
    } as LibraryAccountAttributes,
    options
  );

  return account;
}

/**
 * Generate unique account number
 */
export function generateAccountNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `LIB${timestamp}${random}`.toUpperCase();
}

/**
 * Update library account status
 */
export async function updateAccountStatus(
  accountId: string,
  status: LibraryAccountStatus,
  notes?: string,
  transaction?: Transaction
): Promise<LibraryAccount> {
  const account = await LibraryAccount.findByPk(accountId, { transaction });
  if (!account) {
    throw new Error(`Library account not found: ${accountId}`);
  }

  account.status = status;
  if (notes) {
    account.notes = notes;
  }

  await account.save({ transaction });
  return account;
}

/**
 * Get library account by user ID
 */
export async function getLibraryAccountByUserId(
  userId: string,
  options?: FindOptions
): Promise<LibraryAccount | null> {
  return LibraryAccount.findOne({
    where: { userId },
    ...options,
  });
}

/**
 * Check if account can checkout
 */
export async function canCheckout(accountId: string): Promise<{ allowed: boolean; reason?: string }> {
  const account = await LibraryAccount.findByPk(accountId);
  if (!account) {
    return { allowed: false, reason: 'Account not found' };
  }

  if (account.status !== LibraryAccountStatus.ACTIVE) {
    return { allowed: false, reason: `Account status: ${account.status}` };
  }

  if (account.currentCheckouts >= account.checkoutLimit) {
    return { allowed: false, reason: 'Checkout limit reached' };
  }

  if (account.totalFines > 10.0) {
    return { allowed: false, reason: 'Outstanding fines exceed limit' };
  }

  if (account.expirationDate < new Date()) {
    return { allowed: false, reason: 'Account expired' };
  }

  return { allowed: true };
}

// ============================================================================
// CHECKOUT FUNCTIONS
// ============================================================================

/**
 * Create checkout
 */
export async function createCheckout(
  data: Partial<CheckoutAttributes>,
  transaction?: Transaction
): Promise<Checkout> {
  // Check if account can checkout
  const canCheckoutResult = await canCheckout(data.accountId!);
  if (!canCheckoutResult.allowed) {
    throw new Error(`Checkout not allowed: ${canCheckoutResult.reason}`);
  }

  // Calculate due date (default 14 days)
  const dueDate = data.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const checkout = await Checkout.create(
    {
      ...data,
      dueDate,
      status: CheckoutStatus.ACTIVE,
      renewalCount: 0,
      isOverdue: false,
      metadata: data.metadata || {},
    } as CheckoutAttributes,
    { transaction }
  );

  // Update account checkout count
  await LibraryAccount.increment('currentCheckouts', {
    where: { id: data.accountId },
    transaction,
  });

  return checkout;
}

/**
 * Renew checkout
 */
export async function renewCheckout(
  checkoutId: string,
  transaction?: Transaction
): Promise<Checkout> {
  const checkout = await Checkout.findByPk(checkoutId, { transaction });
  if (!checkout) {
    throw new Error(`Checkout not found: ${checkoutId}`);
  }

  if (checkout.status !== CheckoutStatus.ACTIVE) {
    throw new Error(`Cannot renew checkout with status: ${checkout.status}`);
  }

  if (checkout.renewalCount >= checkout.maxRenewals) {
    throw new Error('Maximum renewals reached');
  }

  // Extend due date by 14 days
  const newDueDate = new Date(checkout.dueDate.getTime() + 14 * 24 * 60 * 60 * 1000);

  checkout.dueDate = newDueDate;
  checkout.renewalCount += 1;
  checkout.status = CheckoutStatus.RENEWED;

  await checkout.save({ transaction });
  return checkout;
}

/**
 * Return checkout
 */
export async function returnCheckout(
  checkoutId: string,
  returnLibrarian?: string,
  transaction?: Transaction
): Promise<Checkout> {
  const checkout = await Checkout.findByPk(checkoutId, { transaction });
  if (!checkout) {
    throw new Error(`Checkout not found: ${checkoutId}`);
  }

  checkout.returnDate = new Date();
  checkout.status = CheckoutStatus.RETURNED;
  checkout.returnLibrarian = returnLibrarian;

  await checkout.save({ transaction });

  // Decrement account checkout count
  await LibraryAccount.decrement('currentCheckouts', {
    where: { id: checkout.accountId },
    transaction,
  });

  return checkout;
}

/**
 * Mark checkout as overdue
 */
export async function markCheckoutOverdue(
  checkoutId: string,
  transaction?: Transaction
): Promise<Checkout> {
  const checkout = await Checkout.findByPk(checkoutId, { transaction });
  if (!checkout) {
    throw new Error(`Checkout not found: ${checkoutId}`);
  }

  checkout.isOverdue = true;
  checkout.status = CheckoutStatus.OVERDUE;
  await checkout.save({ transaction });

  return checkout;
}

/**
 * Get active checkouts for account
 */
export async function getActiveCheckouts(
  accountId: string,
  options?: FindOptions
): Promise<Checkout[]> {
  return Checkout.findAll({
    where: {
      accountId,
      status: { [Op.in]: [CheckoutStatus.ACTIVE, CheckoutStatus.RENEWED, CheckoutStatus.OVERDUE] },
    },
    ...options,
  });
}

/**
 * Process overdue checkouts (batch job)
 */
export async function processOverdueCheckouts(): Promise<{ processed: number; overdueCount: number }> {
  const now = new Date();

  const overdueCheckouts = await Checkout.findAll({
    where: {
      dueDate: { [Op.lt]: now },
      status: { [Op.in]: [CheckoutStatus.ACTIVE, CheckoutStatus.RENEWED] },
      isOverdue: false,
    },
  });

  let processed = 0;
  for (const checkout of overdueCheckouts) {
    await markCheckoutOverdue(checkout.id);
    processed++;
  }

  return { processed, overdueCount: overdueCheckouts.length };
}

// ============================================================================
// RESERVE FUNCTIONS
// ============================================================================

/**
 * Create reserve
 */
export async function createReserve(
  data: Partial<ReserveAttributes>,
  transaction?: Transaction
): Promise<Reserve> {
  const reserve = await Reserve.create(
    {
      ...data,
      status: ReserveStatus.PENDING,
      requestDate: new Date(),
      priority: data.priority || 1,
      notificationSent: false,
      metadata: data.metadata || {},
    } as ReserveAttributes,
    { transaction }
  );

  return reserve;
}

/**
 * Create course reserve
 */
export async function createCourseReserve(
  accountId: string,
  itemId: string,
  itemTitle: string,
  courseId: string,
  instructorId: string,
  expirationDate: Date,
  transaction?: Transaction
): Promise<Reserve> {
  return createReserve(
    {
      accountId,
      itemId,
      itemTitle,
      reserveType: 'COURSE',
      courseId,
      instructorId,
      expirationDate,
      priority: 5, // Course reserves have higher priority
    },
    transaction
  );
}

/**
 * Fulfill reserve
 */
export async function fulfillReserve(
  reserveId: string,
  transaction?: Transaction
): Promise<Reserve> {
  const reserve = await Reserve.findByPk(reserveId, { transaction });
  if (!reserve) {
    throw new Error(`Reserve not found: ${reserveId}`);
  }

  reserve.status = ReserveStatus.FULFILLED;
  reserve.availableDate = new Date();
  await reserve.save({ transaction });

  return reserve;
}

/**
 * Cancel reserve
 */
export async function cancelReserve(
  reserveId: string,
  transaction?: Transaction
): Promise<Reserve> {
  const reserve = await Reserve.findByPk(reserveId, { transaction });
  if (!reserve) {
    throw new Error(`Reserve not found: ${reserveId}`);
  }

  reserve.status = ReserveStatus.CANCELLED;
  await reserve.save({ transaction });

  return reserve;
}

/**
 * Get course reserves by course ID
 */
export async function getCourseReserves(
  courseId: string,
  options?: FindOptions
): Promise<Reserve[]> {
  return Reserve.findAll({
    where: {
      courseId,
      reserveType: 'COURSE',
      status: { [Op.ne]: ReserveStatus.CANCELLED },
    },
    ...options,
  });
}

// ============================================================================
// FINE FUNCTIONS
// ============================================================================

/**
 * Assess fine
 */
export async function assessFine(
  accountId: string,
  fineType: 'OVERDUE' | 'LOST' | 'DAMAGED' | 'PROCESSING' | 'OTHER',
  amount: number,
  description: string,
  checkoutId?: string,
  transaction?: Transaction
): Promise<LibraryFine> {
  const fine = await LibraryFine.create(
    {
      accountId,
      checkoutId,
      fineType,
      amount,
      amountPaid: 0,
      balance: amount,
      status: FineStatus.PENDING,
      description,
      assessedDate: new Date(),
      metadata: {},
    } as LibraryFineAttributes,
    { transaction }
  );

  // Update account total fines
  await LibraryAccount.increment('totalFines', {
    by: amount,
    where: { id: accountId },
    transaction,
  });

  return fine;
}

/**
 * Calculate overdue fine
 */
export function calculateOverdueFine(daysOverdue: number, finePerDay: number = 0.25): number {
  return daysOverdue * finePerDay;
}

/**
 * Pay fine
 */
export async function payFine(
  fineId: string,
  amount: number,
  paymentMethod: string,
  transactionId: string,
  transaction?: Transaction
): Promise<LibraryFine> {
  const fine = await LibraryFine.findByPk(fineId, { transaction });
  if (!fine) {
    throw new Error(`Fine not found: ${fineId}`);
  }

  const newAmountPaid = fine.amountPaid + amount;
  const newBalance = fine.amount - newAmountPaid;

  fine.amountPaid = newAmountPaid;
  fine.balance = newBalance;
  fine.paymentMethod = paymentMethod;
  fine.transactionId = transactionId;

  if (newBalance <= 0) {
    fine.status = FineStatus.PAID;
    fine.paidDate = new Date();
  } else {
    fine.status = FineStatus.PARTIAL;
  }

  await fine.save({ transaction });

  // Update account total fines
  await LibraryAccount.decrement('totalFines', {
    by: amount,
    where: { id: fine.accountId },
    transaction,
  });

  return fine;
}

/**
 * Waive fine
 */
export async function waiveFine(
  fineId: string,
  waivedBy: string,
  reason: string,
  transaction?: Transaction
): Promise<LibraryFine> {
  const fine = await LibraryFine.findByPk(fineId, { transaction });
  if (!fine) {
    throw new Error(`Fine not found: ${fineId}`);
  }

  const waivedAmount = fine.balance;

  fine.status = FineStatus.WAIVED;
  fine.waivedDate = new Date();
  fine.waivedBy = waivedBy;
  fine.waiverReason = reason;
  fine.balance = 0;

  await fine.save({ transaction });

  // Update account total fines
  await LibraryAccount.decrement('totalFines', {
    by: waivedAmount,
    where: { id: fine.accountId },
    transaction,
  });

  return fine;
}

/**
 * Get outstanding fines for account
 */
export async function getOutstandingFines(
  accountId: string,
  options?: FindOptions
): Promise<LibraryFine[]> {
  return LibraryFine.findAll({
    where: {
      accountId,
      status: { [Op.in]: [FineStatus.PENDING, FineStatus.PARTIAL] },
    },
    ...options,
  });
}

// ============================================================================
// HOLD FUNCTIONS
// ============================================================================

/**
 * Place hold
 */
export async function placeHold(
  accountId: string,
  itemId: string,
  itemTitle: string,
  pickupLocation: string,
  expirationDate: Date,
  notificationPreference: 'EMAIL' | 'SMS' | 'PHONE' | 'NONE' = 'EMAIL',
  transaction?: Transaction
): Promise<Hold> {
  // Calculate queue position
  const existingHolds = await Hold.count({
    where: {
      itemId,
      status: { [Op.in]: [HoldStatus.PLACED, HoldStatus.AVAILABLE] },
    },
    transaction,
  });

  const hold = await Hold.create(
    {
      accountId,
      itemId,
      itemTitle,
      status: HoldStatus.PLACED,
      placedDate: new Date(),
      expirationDate,
      pickupLocation,
      queuePosition: existingHolds + 1,
      notificationPreference,
      notificationSent: false,
      isActive: true,
      metadata: {},
    } as HoldAttributes,
    { transaction }
  );

  // Update account hold count
  await LibraryAccount.increment('currentHolds', {
    where: { id: accountId },
    transaction,
  });

  return hold;
}

/**
 * Mark hold as available
 */
export async function markHoldAvailable(
  holdId: string,
  transaction?: Transaction
): Promise<Hold> {
  const hold = await Hold.findByPk(holdId, { transaction });
  if (!hold) {
    throw new Error(`Hold not found: ${holdId}`);
  }

  hold.status = HoldStatus.AVAILABLE;
  hold.availableDate = new Date();
  await hold.save({ transaction });

  return hold;
}

/**
 * Cancel hold
 */
export async function cancelHold(
  holdId: string,
  transaction?: Transaction
): Promise<Hold> {
  const hold = await Hold.findByPk(holdId, { transaction });
  if (!hold) {
    throw new Error(`Hold not found: ${holdId}`);
  }

  hold.status = HoldStatus.CANCELLED;
  hold.isActive = false;
  await hold.save({ transaction });

  // Decrement account hold count
  await LibraryAccount.decrement('currentHolds', {
    where: { id: hold.accountId },
    transaction,
  });

  // Update queue positions for remaining holds
  await updateHoldQueuePositions(hold.itemId, transaction);

  return hold;
}

/**
 * Update hold queue positions
 */
async function updateHoldQueuePositions(itemId: string, transaction?: Transaction): Promise<void> {
  const holds = await Hold.findAll({
    where: {
      itemId,
      status: { [Op.in]: [HoldStatus.PLACED, HoldStatus.AVAILABLE] },
    },
    order: [['placedDate', 'ASC']],
    transaction,
  });

  for (let i = 0; i < holds.length; i++) {
    holds[i].queuePosition = i + 1;
    await holds[i].save({ transaction });
  }
}

/**
 * Get active holds for account
 */
export async function getActiveHolds(
  accountId: string,
  options?: FindOptions
): Promise<Hold[]> {
  return Hold.findAll({
    where: {
      accountId,
      isActive: true,
      status: { [Op.ne]: HoldStatus.CANCELLED },
    },
    ...options,
  });
}

// ============================================================================
// INTER-LIBRARY LOAN FUNCTIONS
// ============================================================================

/**
 * Create ILL request
 */
export async function createILLRequest(
  data: Partial<ILLAttributes>,
  transaction?: Transaction
): Promise<InterLibraryLoan> {
  const illRequest = await InterLibraryLoan.create(
    {
      ...data,
      status: ILLStatus.REQUESTED,
      requestDate: new Date(),
      metadata: data.metadata || {},
    } as ILLAttributes,
    { transaction }
  );

  return illRequest;
}

/**
 * Update ILL status
 */
export async function updateILLStatus(
  illId: string,
  status: ILLStatus,
  transaction?: Transaction
): Promise<InterLibraryLoan> {
  const illRequest = await InterLibraryLoan.findByPk(illId, { transaction });
  if (!illRequest) {
    throw new Error(`ILL request not found: ${illId}`);
  }

  illRequest.status = status;

  if (status === ILLStatus.AVAILABLE && !illRequest.actualArrival) {
    illRequest.actualArrival = new Date();
  }

  await illRequest.save({ transaction });
  return illRequest;
}

/**
 * Get ILL requests by account
 */
export async function getILLRequestsByAccount(
  accountId: string,
  options?: FindOptions
): Promise<InterLibraryLoan[]> {
  return InterLibraryLoan.findAll({
    where: { accountId },
    order: [['requestDate', 'DESC']],
    ...options,
  });
}

// ============================================================================
// DIGITAL RESOURCE FUNCTIONS
// ============================================================================

/**
 * Grant digital resource access
 */
export async function grantDigitalAccess(
  accountId: string,
  resourceId: string,
  resourceType: 'EBOOK' | 'DATABASE' | 'JOURNAL' | 'VIDEO' | 'AUDIO' | 'OTHER',
  resourceName: string,
  accessLevel: DigitalAccessLevel = DigitalAccessLevel.FULL,
  accessEndDate?: Date,
  transaction?: Transaction
): Promise<DigitalResourceAccess> {
  const access = await DigitalResourceAccess.create(
    {
      accountId,
      resourceId,
      resourceType,
      resourceName,
      accessLevel,
      accessStartDate: new Date(),
      accessEndDate,
      currentUsers: 0,
      accessCount: 0,
      downloadCount: 0,
      printCount: 0,
      metadata: {},
    } as DigitalResourceAccessAttributes,
    { transaction }
  );

  return access;
}

/**
 * Track digital resource access
 */
export async function trackDigitalAccess(
  accessId: string,
  transaction?: Transaction
): Promise<DigitalResourceAccess> {
  const access = await DigitalResourceAccess.findByPk(accessId, { transaction });
  if (!access) {
    throw new Error(`Digital resource access not found: ${accessId}`);
  }

  access.accessCount += 1;
  access.lastAccessDate = new Date();
  await access.save({ transaction });

  return access;
}

/**
 * Check digital resource availability
 */
export async function checkDigitalResourceAvailability(
  accessId: string
): Promise<{ available: boolean; reason?: string }> {
  const access = await DigitalResourceAccess.findByPk(accessId);
  if (!access) {
    return { available: false, reason: 'Access record not found' };
  }

  if (access.accessLevel === DigitalAccessLevel.EXPIRED) {
    return { available: false, reason: 'Access expired' };
  }

  if (access.accessEndDate && access.accessEndDate < new Date()) {
    return { available: false, reason: 'Access period ended' };
  }

  if (access.simultaneousUsers && access.currentUsers >= access.simultaneousUsers) {
    return { available: false, reason: 'Maximum concurrent users reached' };
  }

  return { available: true };
}

/**
 * Get digital resources by account
 */
export async function getDigitalResourcesByAccount(
  accountId: string,
  options?: FindOptions
): Promise<DigitalResourceAccess[]> {
  return DigitalResourceAccess.findAll({
    where: {
      accountId,
      accessLevel: { [Op.ne]: DigitalAccessLevel.EXPIRED },
    },
    ...options,
  });
}

// ============================================================================
// OBSERVABLE PATTERNS - REACTIVE STATE
// ============================================================================

/**
 * Create observable for library events
 */
export function createLibraryEventStream(
  store: LibraryStateStore,
  eventTypes?: LibraryEventType[]
): Observable<LibraryEvent> {
  const events$ = store.getEvents$();

  if (eventTypes && eventTypes.length > 0) {
    return events$.pipe(
      filter(event => eventTypes.includes(event.type))
    );
  }

  return events$;
}

/**
 * Create observable for account status changes
 */
export function createAccountStatusObservable(
  store: LibraryStateStore,
  accountId: string
): Observable<LibraryAccountStatus | undefined> {
  return store.getAccount$(accountId).pipe(
    map(account => account?.status),
    distinctUntilChanged()
  );
}

/**
 * Create observable for overdue notifications
 */
export function createOverdueNotificationStream(
  store: LibraryStateStore
): Observable<CheckoutAttributes[]> {
  return store.getOverdueCheckouts$().pipe(
    debounceTime(1000),
    filter(checkouts => checkouts.length > 0)
  );
}

/**
 * Initialize all library models
 */
export function initAllLibraryModels(sequelize: Sequelize): {
  LibraryAccount: typeof LibraryAccount;
  Checkout: typeof Checkout;
  Reserve: typeof Reserve;
  LibraryFine: typeof LibraryFine;
  Hold: typeof Hold;
  InterLibraryLoan: typeof InterLibraryLoan;
  DigitalResourceAccess: typeof DigitalResourceAccess;
} {
  return {
    LibraryAccount: initLibraryAccountModel(sequelize),
    Checkout: initCheckoutModel(sequelize),
    Reserve: initReserveModel(sequelize),
    LibraryFine: initLibraryFineModel(sequelize),
    Hold: initHoldModel(sequelize),
    InterLibraryLoan: initInterLibraryLoanModel(sequelize),
    DigitalResourceAccess: initDigitalResourceAccessModel(sequelize),
  };
}
