"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryStateStore = exports.DigitalResourceAccess = exports.InterLibraryLoan = exports.Hold = exports.LibraryFine = exports.Reserve = exports.Checkout = exports.LibraryAccount = exports.LibraryEventType = exports.DigitalAccessLevel = exports.ILLStatus = exports.HoldStatus = exports.FineStatus = exports.ReserveStatus = exports.CheckoutStatus = exports.LibraryAccountStatus = void 0;
exports.initLibraryAccountModel = initLibraryAccountModel;
exports.initCheckoutModel = initCheckoutModel;
exports.initReserveModel = initReserveModel;
exports.initLibraryFineModel = initLibraryFineModel;
exports.initHoldModel = initHoldModel;
exports.initInterLibraryLoanModel = initInterLibraryLoanModel;
exports.initDigitalResourceAccessModel = initDigitalResourceAccessModel;
exports.createLibraryAccount = createLibraryAccount;
exports.generateAccountNumber = generateAccountNumber;
exports.updateAccountStatus = updateAccountStatus;
exports.getLibraryAccountByUserId = getLibraryAccountByUserId;
exports.canCheckout = canCheckout;
exports.createCheckout = createCheckout;
exports.renewCheckout = renewCheckout;
exports.returnCheckout = returnCheckout;
exports.markCheckoutOverdue = markCheckoutOverdue;
exports.getActiveCheckouts = getActiveCheckouts;
exports.processOverdueCheckouts = processOverdueCheckouts;
exports.createReserve = createReserve;
exports.createCourseReserve = createCourseReserve;
exports.fulfillReserve = fulfillReserve;
exports.cancelReserve = cancelReserve;
exports.getCourseReserves = getCourseReserves;
exports.assessFine = assessFine;
exports.calculateOverdueFine = calculateOverdueFine;
exports.payFine = payFine;
exports.waiveFine = waiveFine;
exports.getOutstandingFines = getOutstandingFines;
exports.placeHold = placeHold;
exports.markHoldAvailable = markHoldAvailable;
exports.cancelHold = cancelHold;
exports.getActiveHolds = getActiveHolds;
exports.createILLRequest = createILLRequest;
exports.updateILLStatus = updateILLStatus;
exports.getILLRequestsByAccount = getILLRequestsByAccount;
exports.grantDigitalAccess = grantDigitalAccess;
exports.trackDigitalAccess = trackDigitalAccess;
exports.checkDigitalResourceAvailability = checkDigitalResourceAvailability;
exports.getDigitalResourcesByAccount = getDigitalResourcesByAccount;
exports.createLibraryEventStream = createLibraryEventStream;
exports.createAccountStatusObservable = createAccountStatusObservable;
exports.createOverdueNotificationStream = createOverdueNotificationStream;
exports.initAllLibraryModels = initAllLibraryModels;
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
const sequelize_1 = require("sequelize");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Library account status enumeration
 */
var LibraryAccountStatus;
(function (LibraryAccountStatus) {
    LibraryAccountStatus["ACTIVE"] = "ACTIVE";
    LibraryAccountStatus["SUSPENDED"] = "SUSPENDED";
    LibraryAccountStatus["BLOCKED"] = "BLOCKED";
    LibraryAccountStatus["EXPIRED"] = "EXPIRED";
    LibraryAccountStatus["PENDING"] = "PENDING";
})(LibraryAccountStatus || (exports.LibraryAccountStatus = LibraryAccountStatus = {}));
/**
 * Checkout status enumeration
 */
var CheckoutStatus;
(function (CheckoutStatus) {
    CheckoutStatus["ACTIVE"] = "ACTIVE";
    CheckoutStatus["RETURNED"] = "RETURNED";
    CheckoutStatus["OVERDUE"] = "OVERDUE";
    CheckoutStatus["RENEWED"] = "RENEWED";
    CheckoutStatus["LOST"] = "LOST";
    CheckoutStatus["DAMAGED"] = "DAMAGED";
})(CheckoutStatus || (exports.CheckoutStatus = CheckoutStatus = {}));
/**
 * Reserve status enumeration
 */
var ReserveStatus;
(function (ReserveStatus) {
    ReserveStatus["PENDING"] = "PENDING";
    ReserveStatus["ACTIVE"] = "ACTIVE";
    ReserveStatus["FULFILLED"] = "FULFILLED";
    ReserveStatus["CANCELLED"] = "CANCELLED";
    ReserveStatus["EXPIRED"] = "EXPIRED";
})(ReserveStatus || (exports.ReserveStatus = ReserveStatus = {}));
/**
 * Fine status enumeration
 */
var FineStatus;
(function (FineStatus) {
    FineStatus["PENDING"] = "PENDING";
    FineStatus["PAID"] = "PAID";
    FineStatus["WAIVED"] = "WAIVED";
    FineStatus["PARTIAL"] = "PARTIAL";
    FineStatus["WRITTEN_OFF"] = "WRITTEN_OFF";
})(FineStatus || (exports.FineStatus = FineStatus = {}));
/**
 * Hold status enumeration
 */
var HoldStatus;
(function (HoldStatus) {
    HoldStatus["PLACED"] = "PLACED";
    HoldStatus["AVAILABLE"] = "AVAILABLE";
    HoldStatus["PICKED_UP"] = "PICKED_UP";
    HoldStatus["CANCELLED"] = "CANCELLED";
    HoldStatus["EXPIRED"] = "EXPIRED";
})(HoldStatus || (exports.HoldStatus = HoldStatus = {}));
/**
 * Inter-library loan status
 */
var ILLStatus;
(function (ILLStatus) {
    ILLStatus["REQUESTED"] = "REQUESTED";
    ILLStatus["PROCESSING"] = "PROCESSING";
    ILLStatus["IN_TRANSIT"] = "IN_TRANSIT";
    ILLStatus["AVAILABLE"] = "AVAILABLE";
    ILLStatus["CHECKED_OUT"] = "CHECKED_OUT";
    ILLStatus["RETURNED"] = "RETURNED";
    ILLStatus["CANCELLED"] = "CANCELLED";
})(ILLStatus || (exports.ILLStatus = ILLStatus = {}));
/**
 * Digital resource access level
 */
var DigitalAccessLevel;
(function (DigitalAccessLevel) {
    DigitalAccessLevel["FULL"] = "FULL";
    DigitalAccessLevel["LIMITED"] = "LIMITED";
    DigitalAccessLevel["TRIAL"] = "TRIAL";
    DigitalAccessLevel["EXPIRED"] = "EXPIRED";
    DigitalAccessLevel["RESTRICTED"] = "RESTRICTED";
})(DigitalAccessLevel || (exports.DigitalAccessLevel = DigitalAccessLevel = {}));
/**
 * Library event types
 */
var LibraryEventType;
(function (LibraryEventType) {
    LibraryEventType["ACCOUNT_CREATED"] = "ACCOUNT_CREATED";
    LibraryEventType["ACCOUNT_UPDATED"] = "ACCOUNT_UPDATED";
    LibraryEventType["CHECKOUT_CREATED"] = "CHECKOUT_CREATED";
    LibraryEventType["CHECKOUT_RENEWED"] = "CHECKOUT_RENEWED";
    LibraryEventType["CHECKOUT_RETURNED"] = "CHECKOUT_RETURNED";
    LibraryEventType["FINE_ASSESSED"] = "FINE_ASSESSED";
    LibraryEventType["FINE_PAID"] = "FINE_PAID";
    LibraryEventType["HOLD_PLACED"] = "HOLD_PLACED";
    LibraryEventType["HOLD_AVAILABLE"] = "HOLD_AVAILABLE";
    LibraryEventType["RESERVE_CREATED"] = "RESERVE_CREATED";
    LibraryEventType["ILL_REQUESTED"] = "ILL_REQUESTED";
    LibraryEventType["DIGITAL_ACCESS_GRANTED"] = "DIGITAL_ACCESS_GRANTED";
})(LibraryEventType || (exports.LibraryEventType = LibraryEventType = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * LibraryAccount model class
 */
class LibraryAccount extends sequelize_1.Model {
}
exports.LibraryAccount = LibraryAccount;
/**
 * Checkout model class
 */
class Checkout extends sequelize_1.Model {
}
exports.Checkout = Checkout;
/**
 * Reserve model class
 */
class Reserve extends sequelize_1.Model {
}
exports.Reserve = Reserve;
/**
 * LibraryFine model class
 */
class LibraryFine extends sequelize_1.Model {
}
exports.LibraryFine = LibraryFine;
/**
 * Hold model class
 */
class Hold extends sequelize_1.Model {
}
exports.Hold = Hold;
/**
 * InterLibraryLoan model class
 */
class InterLibraryLoan extends sequelize_1.Model {
}
exports.InterLibraryLoan = InterLibraryLoan;
/**
 * DigitalResourceAccess model class
 */
class DigitalResourceAccess extends sequelize_1.Model {
}
exports.DigitalResourceAccess = DigitalResourceAccess;
// ============================================================================
// MODEL INITIALIZATION
// ============================================================================
/**
 * Initialize LibraryAccount model
 */
function initLibraryAccountModel(sequelize) {
    LibraryAccount.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            unique: true,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        accountNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(LibraryAccountStatus)),
            allowNull: false,
            defaultValue: LibraryAccountStatus.ACTIVE,
        },
        accountType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'STUDENT',
        },
        patronGroup: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'UNDERGRADUATE',
        },
        checkoutLimit: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10,
        },
        currentCheckouts: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        holdLimit: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
        },
        currentHolds: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        totalFines: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        barcode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            unique: true,
        },
        pin: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    }, {
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
    });
    return LibraryAccount;
}
/**
 * Initialize Checkout model
 */
function initCheckoutModel(sequelize) {
    Checkout.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        accountId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'library_accounts',
                key: 'id',
            },
        },
        itemId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        itemBarcode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        itemTitle: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        checkoutDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        dueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        returnDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        renewalCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        maxRenewals: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(CheckoutStatus)),
            allowNull: false,
            defaultValue: CheckoutStatus.ACTIVE,
        },
        isOverdue: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        overdueNotificationSent: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        libraryId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        checkoutLibrarian: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        returnLibrarian: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    }, {
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
    });
    return Checkout;
}
/**
 * Initialize Reserve model
 */
function initReserveModel(sequelize) {
    Reserve.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        accountId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'library_accounts',
                key: 'id',
            },
        },
        itemId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        itemBarcode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        itemTitle: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        reserveType: {
            type: sequelize_1.DataTypes.ENUM('COURSE', 'PERSONAL', 'FACULTY'),
            allowNull: false,
        },
        courseId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        instructorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ReserveStatus)),
            allowNull: false,
            defaultValue: ReserveStatus.PENDING,
        },
        requestDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        availableDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        pickupLocation: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        notificationSent: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    }, {
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
    });
    return Reserve;
}
/**
 * Initialize LibraryFine model
 */
function initLibraryFineModel(sequelize) {
    LibraryFine.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        accountId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'library_accounts',
                key: 'id',
            },
        },
        checkoutId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'library_checkouts',
                key: 'id',
            },
        },
        fineType: {
            type: sequelize_1.DataTypes.ENUM('OVERDUE', 'LOST', 'DAMAGED', 'PROCESSING', 'OTHER'),
            allowNull: false,
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        amountPaid: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        balance: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(FineStatus)),
            allowNull: false,
            defaultValue: FineStatus.PENDING,
        },
        description: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        assessedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        dueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        paidDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        waivedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        waivedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        waiverReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        paymentMethod: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        transactionId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    }, {
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
    });
    return LibraryFine;
}
/**
 * Initialize Hold model
 */
function initHoldModel(sequelize) {
    Hold.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        accountId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'library_accounts',
                key: 'id',
            },
        },
        itemId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        itemBarcode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        itemTitle: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(HoldStatus)),
            allowNull: false,
            defaultValue: HoldStatus.PLACED,
        },
        placedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        availableDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        pickupDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        pickupLocation: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        queuePosition: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        notificationPreference: {
            type: sequelize_1.DataTypes.ENUM('EMAIL', 'SMS', 'PHONE', 'NONE'),
            allowNull: false,
            defaultValue: 'EMAIL',
        },
        notificationSent: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    }, {
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
    });
    return Hold;
}
/**
 * Initialize InterLibraryLoan model
 */
function initInterLibraryLoanModel(sequelize) {
    InterLibraryLoan.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        accountId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'library_accounts',
                key: 'id',
            },
        },
        requestType: {
            type: sequelize_1.DataTypes.ENUM('BOOK', 'ARTICLE', 'CHAPTER', 'OTHER'),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ILLStatus)),
            allowNull: false,
            defaultValue: ILLStatus.REQUESTED,
        },
        requestDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        itemTitle: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        itemAuthor: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        itemISBN: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        itemISSN: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        itemDOI: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        sourceLibrary: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        estimatedArrival: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        actualArrival: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        loanPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        dueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        cost: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        trackingNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'library_ill_requests',
        timestamps: true,
        indexes: [
            { fields: ['accountId'] },
            { fields: ['status'] },
            { fields: ['requestType'] },
            { fields: ['requestDate'] },
        ],
    });
    return InterLibraryLoan;
}
/**
 * Initialize DigitalResourceAccess model
 */
function initDigitalResourceAccessModel(sequelize) {
    DigitalResourceAccess.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        accountId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'library_accounts',
                key: 'id',
            },
        },
        resourceId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        resourceType: {
            type: sequelize_1.DataTypes.ENUM('EBOOK', 'DATABASE', 'JOURNAL', 'VIDEO', 'AUDIO', 'OTHER'),
            allowNull: false,
        },
        resourceName: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        accessLevel: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(DigitalAccessLevel)),
            allowNull: false,
            defaultValue: DigitalAccessLevel.FULL,
        },
        accessStartDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        accessEndDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        simultaneousUsers: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        currentUsers: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        accessCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        lastAccessDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        downloadLimit: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        downloadCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        printLimit: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        printCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        url: {
            type: sequelize_1.DataTypes.STRING(1000),
            allowNull: true,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'library_digital_access',
        timestamps: true,
        indexes: [
            { fields: ['accountId'] },
            { fields: ['resourceId'] },
            { fields: ['resourceType'] },
            { fields: ['accessLevel'] },
        ],
    });
    return DigitalResourceAccess;
}
// ============================================================================
// STATE MANAGEMENT - REACTIVE STORE
// ============================================================================
/**
 * Library state store with reactive observables
 */
class LibraryStateStore {
    constructor() {
        this.state = new rxjs_1.BehaviorSubject({
            accounts: new Map(),
            checkouts: new Map(),
            reserves: new Map(),
            fines: new Map(),
            holds: new Map(),
            illRequests: new Map(),
            digitalAccess: new Map(),
        });
        this.events = new rxjs_1.Subject();
    }
    /**
     * Get observable of current state
     */
    getState$() {
        return this.state.asObservable();
    }
    /**
     * Get observable of events
     */
    getEvents$() {
        return this.events.asObservable();
    }
    /**
     * Update account in state
     */
    updateAccount(account) {
        const currentState = this.state.value;
        currentState.accounts.set(account.id, account);
        this.state.next({ ...currentState });
    }
    /**
     * Update checkout in state
     */
    updateCheckout(checkout) {
        const currentState = this.state.value;
        currentState.checkouts.set(checkout.id, checkout);
        this.state.next({ ...currentState });
    }
    /**
     * Emit library event
     */
    emitEvent(event) {
        this.events.next(event);
    }
    /**
     * Get account observable by ID
     */
    getAccount$(accountId) {
        return this.state.pipe((0, operators_1.map)(state => state.accounts.get(accountId)), (0, operators_1.distinctUntilChanged)());
    }
    /**
     * Get checkouts observable by account ID
     */
    getCheckoutsByAccount$(accountId) {
        return this.state.pipe((0, operators_1.map)(state => Array.from(state.checkouts.values()).filter(c => c.accountId === accountId)), (0, operators_1.shareReplay)(1));
    }
    /**
     * Get overdue checkouts observable
     */
    getOverdueCheckouts$() {
        return this.state.pipe((0, operators_1.map)(state => Array.from(state.checkouts.values()).filter(c => c.isOverdue)), (0, operators_1.shareReplay)(1));
    }
}
exports.LibraryStateStore = LibraryStateStore;
// ============================================================================
// LIBRARY ACCOUNT FUNCTIONS
// ============================================================================
/**
 * Create library account
 */
async function createLibraryAccount(data, options) {
    const accountNumber = data.accountNumber || generateAccountNumber();
    const account = await LibraryAccount.create({
        ...data,
        accountNumber,
        status: data.status || LibraryAccountStatus.ACTIVE,
        metadata: data.metadata || {},
    }, options);
    return account;
}
/**
 * Generate unique account number
 */
function generateAccountNumber() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `LIB${timestamp}${random}`.toUpperCase();
}
/**
 * Update library account status
 */
async function updateAccountStatus(accountId, status, notes, transaction) {
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
async function getLibraryAccountByUserId(userId, options) {
    return LibraryAccount.findOne({
        where: { userId },
        ...options,
    });
}
/**
 * Check if account can checkout
 */
async function canCheckout(accountId) {
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
async function createCheckout(data, transaction) {
    // Check if account can checkout
    const canCheckoutResult = await canCheckout(data.accountId);
    if (!canCheckoutResult.allowed) {
        throw new Error(`Checkout not allowed: ${canCheckoutResult.reason}`);
    }
    // Calculate due date (default 14 days)
    const dueDate = data.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const checkout = await Checkout.create({
        ...data,
        dueDate,
        status: CheckoutStatus.ACTIVE,
        renewalCount: 0,
        isOverdue: false,
        metadata: data.metadata || {},
    }, { transaction });
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
async function renewCheckout(checkoutId, transaction) {
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
async function returnCheckout(checkoutId, returnLibrarian, transaction) {
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
async function markCheckoutOverdue(checkoutId, transaction) {
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
async function getActiveCheckouts(accountId, options) {
    return Checkout.findAll({
        where: {
            accountId,
            status: { [sequelize_1.Op.in]: [CheckoutStatus.ACTIVE, CheckoutStatus.RENEWED, CheckoutStatus.OVERDUE] },
        },
        ...options,
    });
}
/**
 * Process overdue checkouts (batch job)
 */
async function processOverdueCheckouts() {
    const now = new Date();
    const overdueCheckouts = await Checkout.findAll({
        where: {
            dueDate: { [sequelize_1.Op.lt]: now },
            status: { [sequelize_1.Op.in]: [CheckoutStatus.ACTIVE, CheckoutStatus.RENEWED] },
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
async function createReserve(data, transaction) {
    const reserve = await Reserve.create({
        ...data,
        status: ReserveStatus.PENDING,
        requestDate: new Date(),
        priority: data.priority || 1,
        notificationSent: false,
        metadata: data.metadata || {},
    }, { transaction });
    return reserve;
}
/**
 * Create course reserve
 */
async function createCourseReserve(accountId, itemId, itemTitle, courseId, instructorId, expirationDate, transaction) {
    return createReserve({
        accountId,
        itemId,
        itemTitle,
        reserveType: 'COURSE',
        courseId,
        instructorId,
        expirationDate,
        priority: 5, // Course reserves have higher priority
    }, transaction);
}
/**
 * Fulfill reserve
 */
async function fulfillReserve(reserveId, transaction) {
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
async function cancelReserve(reserveId, transaction) {
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
async function getCourseReserves(courseId, options) {
    return Reserve.findAll({
        where: {
            courseId,
            reserveType: 'COURSE',
            status: { [sequelize_1.Op.ne]: ReserveStatus.CANCELLED },
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
async function assessFine(accountId, fineType, amount, description, checkoutId, transaction) {
    const fine = await LibraryFine.create({
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
    }, { transaction });
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
function calculateOverdueFine(daysOverdue, finePerDay = 0.25) {
    return daysOverdue * finePerDay;
}
/**
 * Pay fine
 */
async function payFine(fineId, amount, paymentMethod, transactionId, transaction) {
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
    }
    else {
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
async function waiveFine(fineId, waivedBy, reason, transaction) {
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
async function getOutstandingFines(accountId, options) {
    return LibraryFine.findAll({
        where: {
            accountId,
            status: { [sequelize_1.Op.in]: [FineStatus.PENDING, FineStatus.PARTIAL] },
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
async function placeHold(accountId, itemId, itemTitle, pickupLocation, expirationDate, notificationPreference = 'EMAIL', transaction) {
    // Calculate queue position
    const existingHolds = await Hold.count({
        where: {
            itemId,
            status: { [sequelize_1.Op.in]: [HoldStatus.PLACED, HoldStatus.AVAILABLE] },
        },
        transaction,
    });
    const hold = await Hold.create({
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
    }, { transaction });
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
async function markHoldAvailable(holdId, transaction) {
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
async function cancelHold(holdId, transaction) {
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
async function updateHoldQueuePositions(itemId, transaction) {
    const holds = await Hold.findAll({
        where: {
            itemId,
            status: { [sequelize_1.Op.in]: [HoldStatus.PLACED, HoldStatus.AVAILABLE] },
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
async function getActiveHolds(accountId, options) {
    return Hold.findAll({
        where: {
            accountId,
            isActive: true,
            status: { [sequelize_1.Op.ne]: HoldStatus.CANCELLED },
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
async function createILLRequest(data, transaction) {
    const illRequest = await InterLibraryLoan.create({
        ...data,
        status: ILLStatus.REQUESTED,
        requestDate: new Date(),
        metadata: data.metadata || {},
    }, { transaction });
    return illRequest;
}
/**
 * Update ILL status
 */
async function updateILLStatus(illId, status, transaction) {
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
async function getILLRequestsByAccount(accountId, options) {
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
async function grantDigitalAccess(accountId, resourceId, resourceType, resourceName, accessLevel = DigitalAccessLevel.FULL, accessEndDate, transaction) {
    const access = await DigitalResourceAccess.create({
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
    }, { transaction });
    return access;
}
/**
 * Track digital resource access
 */
async function trackDigitalAccess(accessId, transaction) {
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
async function checkDigitalResourceAvailability(accessId) {
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
async function getDigitalResourcesByAccount(accountId, options) {
    return DigitalResourceAccess.findAll({
        where: {
            accountId,
            accessLevel: { [sequelize_1.Op.ne]: DigitalAccessLevel.EXPIRED },
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
function createLibraryEventStream(store, eventTypes) {
    const events$ = store.getEvents$();
    if (eventTypes && eventTypes.length > 0) {
        return events$.pipe((0, operators_1.filter)(event => eventTypes.includes(event.type)));
    }
    return events$;
}
/**
 * Create observable for account status changes
 */
function createAccountStatusObservable(store, accountId) {
    return store.getAccount$(accountId).pipe((0, operators_1.map)(account => account?.status), (0, operators_1.distinctUntilChanged)());
}
/**
 * Create observable for overdue notifications
 */
function createOverdueNotificationStream(store) {
    return store.getOverdueCheckouts$().pipe((0, operators_1.debounceTime)(1000), (0, operators_1.filter)(checkouts => checkouts.length > 0));
}
/**
 * Initialize all library models
 */
function initAllLibraryModels(sequelize) {
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
//# sourceMappingURL=library-integration-kit.js.map