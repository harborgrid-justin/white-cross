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
import { Model, Sequelize, FindOptions, Transaction, CreateOptions } from 'sequelize';
import { Observable } from 'rxjs';
/**
 * Library account status enumeration
 */
export declare enum LibraryAccountStatus {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    BLOCKED = "BLOCKED",
    EXPIRED = "EXPIRED",
    PENDING = "PENDING"
}
/**
 * Checkout status enumeration
 */
export declare enum CheckoutStatus {
    ACTIVE = "ACTIVE",
    RETURNED = "RETURNED",
    OVERDUE = "OVERDUE",
    RENEWED = "RENEWED",
    LOST = "LOST",
    DAMAGED = "DAMAGED"
}
/**
 * Reserve status enumeration
 */
export declare enum ReserveStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    FULFILLED = "FULFILLED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED"
}
/**
 * Fine status enumeration
 */
export declare enum FineStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    WAIVED = "WAIVED",
    PARTIAL = "PARTIAL",
    WRITTEN_OFF = "WRITTEN_OFF"
}
/**
 * Hold status enumeration
 */
export declare enum HoldStatus {
    PLACED = "PLACED",
    AVAILABLE = "AVAILABLE",
    PICKED_UP = "PICKED_UP",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED"
}
/**
 * Inter-library loan status
 */
export declare enum ILLStatus {
    REQUESTED = "REQUESTED",
    PROCESSING = "PROCESSING",
    IN_TRANSIT = "IN_TRANSIT",
    AVAILABLE = "AVAILABLE",
    CHECKED_OUT = "CHECKED_OUT",
    RETURNED = "RETURNED",
    CANCELLED = "CANCELLED"
}
/**
 * Digital resource access level
 */
export declare enum DigitalAccessLevel {
    FULL = "FULL",
    LIMITED = "LIMITED",
    TRIAL = "TRIAL",
    EXPIRED = "EXPIRED",
    RESTRICTED = "RESTRICTED"
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
export declare enum LibraryEventType {
    ACCOUNT_CREATED = "ACCOUNT_CREATED",
    ACCOUNT_UPDATED = "ACCOUNT_UPDATED",
    CHECKOUT_CREATED = "CHECKOUT_CREATED",
    CHECKOUT_RENEWED = "CHECKOUT_RENEWED",
    CHECKOUT_RETURNED = "CHECKOUT_RETURNED",
    FINE_ASSESSED = "FINE_ASSESSED",
    FINE_PAID = "FINE_PAID",
    HOLD_PLACED = "HOLD_PLACED",
    HOLD_AVAILABLE = "HOLD_AVAILABLE",
    RESERVE_CREATED = "RESERVE_CREATED",
    ILL_REQUESTED = "ILL_REQUESTED",
    DIGITAL_ACCESS_GRANTED = "DIGITAL_ACCESS_GRANTED"
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
/**
 * LibraryAccount model class
 */
export declare class LibraryAccount extends Model<LibraryAccountAttributes> implements LibraryAccountAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt?: Date;
}
/**
 * Checkout model class
 */
export declare class Checkout extends Model<CheckoutAttributes> implements CheckoutAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Reserve model class
 */
export declare class Reserve extends Model<ReserveAttributes> implements ReserveAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * LibraryFine model class
 */
export declare class LibraryFine extends Model<LibraryFineAttributes> implements LibraryFineAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Hold model class
 */
export declare class Hold extends Model<HoldAttributes> implements HoldAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * InterLibraryLoan model class
 */
export declare class InterLibraryLoan extends Model<ILLAttributes> implements ILLAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * DigitalResourceAccess model class
 */
export declare class DigitalResourceAccess extends Model<DigitalResourceAccessAttributes> implements DigitalResourceAccessAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
/**
 * Initialize LibraryAccount model
 */
export declare function initLibraryAccountModel(sequelize: Sequelize): typeof LibraryAccount;
/**
 * Initialize Checkout model
 */
export declare function initCheckoutModel(sequelize: Sequelize): typeof Checkout;
/**
 * Initialize Reserve model
 */
export declare function initReserveModel(sequelize: Sequelize): typeof Reserve;
/**
 * Initialize LibraryFine model
 */
export declare function initLibraryFineModel(sequelize: Sequelize): typeof LibraryFine;
/**
 * Initialize Hold model
 */
export declare function initHoldModel(sequelize: Sequelize): typeof Hold;
/**
 * Initialize InterLibraryLoan model
 */
export declare function initInterLibraryLoanModel(sequelize: Sequelize): typeof InterLibraryLoan;
/**
 * Initialize DigitalResourceAccess model
 */
export declare function initDigitalResourceAccessModel(sequelize: Sequelize): typeof DigitalResourceAccess;
/**
 * Library state store with reactive observables
 */
export declare class LibraryStateStore {
    private state;
    private events;
    constructor();
    /**
     * Get observable of current state
     */
    getState$(): Observable<LibraryState>;
    /**
     * Get observable of events
     */
    getEvents$(): Observable<LibraryEvent>;
    /**
     * Update account in state
     */
    updateAccount(account: LibraryAccountAttributes): void;
    /**
     * Update checkout in state
     */
    updateCheckout(checkout: CheckoutAttributes): void;
    /**
     * Emit library event
     */
    emitEvent(event: LibraryEvent): void;
    /**
     * Get account observable by ID
     */
    getAccount$(accountId: string): Observable<LibraryAccountAttributes | undefined>;
    /**
     * Get checkouts observable by account ID
     */
    getCheckoutsByAccount$(accountId: string): Observable<CheckoutAttributes[]>;
    /**
     * Get overdue checkouts observable
     */
    getOverdueCheckouts$(): Observable<CheckoutAttributes[]>;
}
/**
 * Create library account
 */
export declare function createLibraryAccount(data: Partial<LibraryAccountAttributes>, options?: CreateOptions): Promise<LibraryAccount>;
/**
 * Generate unique account number
 */
export declare function generateAccountNumber(): string;
/**
 * Update library account status
 */
export declare function updateAccountStatus(accountId: string, status: LibraryAccountStatus, notes?: string, transaction?: Transaction): Promise<LibraryAccount>;
/**
 * Get library account by user ID
 */
export declare function getLibraryAccountByUserId(userId: string, options?: FindOptions): Promise<LibraryAccount | null>;
/**
 * Check if account can checkout
 */
export declare function canCheckout(accountId: string): Promise<{
    allowed: boolean;
    reason?: string;
}>;
/**
 * Create checkout
 */
export declare function createCheckout(data: Partial<CheckoutAttributes>, transaction?: Transaction): Promise<Checkout>;
/**
 * Renew checkout
 */
export declare function renewCheckout(checkoutId: string, transaction?: Transaction): Promise<Checkout>;
/**
 * Return checkout
 */
export declare function returnCheckout(checkoutId: string, returnLibrarian?: string, transaction?: Transaction): Promise<Checkout>;
/**
 * Mark checkout as overdue
 */
export declare function markCheckoutOverdue(checkoutId: string, transaction?: Transaction): Promise<Checkout>;
/**
 * Get active checkouts for account
 */
export declare function getActiveCheckouts(accountId: string, options?: FindOptions): Promise<Checkout[]>;
/**
 * Process overdue checkouts (batch job)
 */
export declare function processOverdueCheckouts(): Promise<{
    processed: number;
    overdueCount: number;
}>;
/**
 * Create reserve
 */
export declare function createReserve(data: Partial<ReserveAttributes>, transaction?: Transaction): Promise<Reserve>;
/**
 * Create course reserve
 */
export declare function createCourseReserve(accountId: string, itemId: string, itemTitle: string, courseId: string, instructorId: string, expirationDate: Date, transaction?: Transaction): Promise<Reserve>;
/**
 * Fulfill reserve
 */
export declare function fulfillReserve(reserveId: string, transaction?: Transaction): Promise<Reserve>;
/**
 * Cancel reserve
 */
export declare function cancelReserve(reserveId: string, transaction?: Transaction): Promise<Reserve>;
/**
 * Get course reserves by course ID
 */
export declare function getCourseReserves(courseId: string, options?: FindOptions): Promise<Reserve[]>;
/**
 * Assess fine
 */
export declare function assessFine(accountId: string, fineType: 'OVERDUE' | 'LOST' | 'DAMAGED' | 'PROCESSING' | 'OTHER', amount: number, description: string, checkoutId?: string, transaction?: Transaction): Promise<LibraryFine>;
/**
 * Calculate overdue fine
 */
export declare function calculateOverdueFine(daysOverdue: number, finePerDay?: number): number;
/**
 * Pay fine
 */
export declare function payFine(fineId: string, amount: number, paymentMethod: string, transactionId: string, transaction?: Transaction): Promise<LibraryFine>;
/**
 * Waive fine
 */
export declare function waiveFine(fineId: string, waivedBy: string, reason: string, transaction?: Transaction): Promise<LibraryFine>;
/**
 * Get outstanding fines for account
 */
export declare function getOutstandingFines(accountId: string, options?: FindOptions): Promise<LibraryFine[]>;
/**
 * Place hold
 */
export declare function placeHold(accountId: string, itemId: string, itemTitle: string, pickupLocation: string, expirationDate: Date, notificationPreference?: 'EMAIL' | 'SMS' | 'PHONE' | 'NONE', transaction?: Transaction): Promise<Hold>;
/**
 * Mark hold as available
 */
export declare function markHoldAvailable(holdId: string, transaction?: Transaction): Promise<Hold>;
/**
 * Cancel hold
 */
export declare function cancelHold(holdId: string, transaction?: Transaction): Promise<Hold>;
/**
 * Get active holds for account
 */
export declare function getActiveHolds(accountId: string, options?: FindOptions): Promise<Hold[]>;
/**
 * Create ILL request
 */
export declare function createILLRequest(data: Partial<ILLAttributes>, transaction?: Transaction): Promise<InterLibraryLoan>;
/**
 * Update ILL status
 */
export declare function updateILLStatus(illId: string, status: ILLStatus, transaction?: Transaction): Promise<InterLibraryLoan>;
/**
 * Get ILL requests by account
 */
export declare function getILLRequestsByAccount(accountId: string, options?: FindOptions): Promise<InterLibraryLoan[]>;
/**
 * Grant digital resource access
 */
export declare function grantDigitalAccess(accountId: string, resourceId: string, resourceType: 'EBOOK' | 'DATABASE' | 'JOURNAL' | 'VIDEO' | 'AUDIO' | 'OTHER', resourceName: string, accessLevel?: DigitalAccessLevel, accessEndDate?: Date, transaction?: Transaction): Promise<DigitalResourceAccess>;
/**
 * Track digital resource access
 */
export declare function trackDigitalAccess(accessId: string, transaction?: Transaction): Promise<DigitalResourceAccess>;
/**
 * Check digital resource availability
 */
export declare function checkDigitalResourceAvailability(accessId: string): Promise<{
    available: boolean;
    reason?: string;
}>;
/**
 * Get digital resources by account
 */
export declare function getDigitalResourcesByAccount(accountId: string, options?: FindOptions): Promise<DigitalResourceAccess[]>;
/**
 * Create observable for library events
 */
export declare function createLibraryEventStream(store: LibraryStateStore, eventTypes?: LibraryEventType[]): Observable<LibraryEvent>;
/**
 * Create observable for account status changes
 */
export declare function createAccountStatusObservable(store: LibraryStateStore, accountId: string): Observable<LibraryAccountStatus | undefined>;
/**
 * Create observable for overdue notifications
 */
export declare function createOverdueNotificationStream(store: LibraryStateStore): Observable<CheckoutAttributes[]>;
/**
 * Initialize all library models
 */
export declare function initAllLibraryModels(sequelize: Sequelize): {
    LibraryAccount: typeof LibraryAccount;
    Checkout: typeof Checkout;
    Reserve: typeof Reserve;
    LibraryFine: typeof LibraryFine;
    Hold: typeof Hold;
    InterLibraryLoan: typeof InterLibraryLoan;
    DigitalResourceAccess: typeof DigitalResourceAccess;
};
//# sourceMappingURL=library-integration-kit.d.ts.map