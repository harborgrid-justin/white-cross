/**
 * LOC: EDU-COMP-LIB-001
 * File: /reuse/education/composites/library-resource-integration-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - rxjs (v7.x)
 *   - ../library-integration-kit
 *   - ../student-records-kit
 *   - ../course-catalog-kit
 *   - ../student-portal-kit
 *
 * DOWNSTREAM (imported by):
 *   - Library management controllers
 *   - Student portal services
 *   - Course reserve systems
 *   - ILL processing services
 *   - Digital resource access
 */
import { Sequelize } from 'sequelize';
import { Observable } from 'rxjs';
export type LibraryAccountStatus = 'active' | 'suspended' | 'blocked' | 'expired';
export type CirculationStatus = 'available' | 'checked_out' | 'on_hold' | 'in_transit' | 'lost' | 'damaged';
export type ResourceType = 'book' | 'journal' | 'dvd' | 'ebook' | 'database' | 'article' | 'media';
export type HoldStatus = 'pending' | 'available' | 'fulfilled' | 'cancelled' | 'expired';
export type ILLStatus = 'requested' | 'processing' | 'shipped' | 'received' | 'returned' | 'cancelled';
export interface LibraryAccount {
    accountId: string;
    studentId: string;
    accountStatus: LibraryAccountStatus;
    booksCheckedOut: number;
    maxCheckoutLimit: number;
    finesOwed: number;
    holdsActive: number;
    accountCreated: Date;
    expirationDate: Date;
    emailNotifications: boolean;
    smsNotifications: boolean;
}
export interface CirculationRecord {
    circulationId: string;
    resourceId: string;
    resourceTitle: string;
    resourceType: ResourceType;
    accountId: string;
    studentId: string;
    checkoutDate: Date;
    dueDate: Date;
    returnDate?: Date;
    renewalCount: number;
    status: CirculationStatus;
    overdueNoticeSent: boolean;
    fineAmount: number;
}
export interface CourseReserve {
    reserveId: string;
    courseId: string;
    courseCode: string;
    instructorId: string;
    resourceId: string;
    resourceTitle: string;
    reserveType: 'physical' | 'electronic';
    loanPeriod: number;
    activationDate: Date;
    expirationDate: Date;
    accessCount: number;
    active: boolean;
}
export interface LibraryFine {
    fineId: string;
    accountId: string;
    studentId: string;
    fineType: 'overdue' | 'lost' | 'damaged' | 'processing';
    amount: number;
    dateLevied: Date;
    datePaid?: Date;
    status: 'pending' | 'paid' | 'waived' | 'written_off';
    resourceId?: string;
    notes?: string;
}
export interface HoldRequest {
    holdId: string;
    accountId: string;
    studentId: string;
    resourceId: string;
    resourceTitle: string;
    requestDate: Date;
    availableDate?: Date;
    expirationDate: Date;
    pickupLocation: string;
    status: HoldStatus;
    notificationSent: boolean;
    priority: number;
}
export interface ILLRequest {
    illId: string;
    requesterId: string;
    requesterEmail: string;
    resourceType: 'book' | 'article' | 'chapter' | 'media';
    title: string;
    author?: string;
    isbn?: string;
    doi?: string;
    requestDate: Date;
    neededBy?: Date;
    status: ILLStatus;
    lendingLibrary?: string;
    shippingTrackingNumber?: string;
    costToRequester: number;
    dueDate?: Date;
}
export interface DigitalResource {
    resourceId: string;
    title: string;
    resourceType: 'ebook' | 'journal' | 'database' | 'video' | 'audio';
    provider: string;
    accessUrl: string;
    simultaneousUsers: number;
    currentUsers: number;
    subscriptionStart: Date;
    subscriptionEnd: Date;
    accessRestrictions: string[];
    requiresAuthentication: boolean;
    requiresProxy: boolean;
}
export interface ResearchSupport {
    sessionId: string;
    studentId: string;
    librarianId: string;
    sessionType: 'in_person' | 'virtual' | 'chat' | 'email';
    researchTopic: string;
    scheduledTime?: Date;
    duration: number;
    status: 'scheduled' | 'completed' | 'cancelled';
    resourcesProvided: string[];
    followUpRequired: boolean;
}
/**
 * Library Resource Integration Composite Service
 *
 * Provides comprehensive library management, circulation, reserves, and resource access.
 */
export declare class LibraryResourceIntegrationCompositeService {
    private readonly sequelize;
    private readonly logger;
    private accountStateSubject;
    accountState$: Observable<LibraryAccount | null>;
    constructor(sequelize: Sequelize);
    /**
     * 1. Creates library account for student.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<LibraryAccount>} Library account
     *
     * @example
     * ```typescript
     * const account = await service.createLibraryAccount('STU123456');
     * console.log(`Account created: ${account.accountId}`);
     * ```
     */
    createLibraryAccount(studentId: string): Promise<LibraryAccount>;
    /**
     * 2. Retrieves library account information.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<LibraryAccount>} Library account
     *
     * @example
     * ```typescript
     * const account = await service.getLibraryAccount('STU123456');
     * console.log(`Books checked out: ${account.booksCheckedOut}`);
     * ```
     */
    getLibraryAccount(studentId: string): Promise<LibraryAccount>;
    /**
     * 3. Updates account notification preferences.
     *
     * @param {string} accountId - Account identifier
     * @param {object} preferences - Notification preferences
     * @returns {Promise<LibraryAccount>} Updated account
     *
     * @example
     * ```typescript
     * await service.updateNotificationPreferences('LIB-001', {
     *   email: true,
     *   sms: true
     * });
     * ```
     */
    updateNotificationPreferences(accountId: string, preferences: {
        email: boolean;
        sms: boolean;
    }): Promise<LibraryAccount>;
    /**
     * 4. Checks account eligibility for services.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<{eligible: boolean; restrictions: string[]}>} Eligibility status
     *
     * @example
     * ```typescript
     * const eligibility = await service.checkAccountEligibility('STU123456');
     * if (!eligibility.eligible) {
     *   console.log('Restrictions:', eligibility.restrictions);
     * }
     * ```
     */
    checkAccountEligibility(studentId: string): Promise<{
        eligible: boolean;
        restrictions: string[];
    }>;
    /**
     * 5. Suspends library account.
     *
     * @param {string} accountId - Account identifier
     * @param {string} reason - Suspension reason
     * @returns {Promise<LibraryAccount>} Suspended account
     *
     * @example
     * ```typescript
     * await service.suspendLibraryAccount('LIB-001', 'Excessive overdue items');
     * ```
     */
    suspendLibraryAccount(accountId: string, reason: string): Promise<LibraryAccount>;
    /**
     * 6. Reactivates suspended account.
     *
     * @param {string} accountId - Account identifier
     * @returns {Promise<LibraryAccount>} Reactivated account
     *
     * @example
     * ```typescript
     * await service.reactivateLibraryAccount('LIB-001');
     * ```
     */
    reactivateLibraryAccount(accountId: string): Promise<LibraryAccount>;
    /**
     * 7. Checks out library resource.
     *
     * @param {string} studentId - Student identifier
     * @param {string} resourceId - Resource identifier
     * @param {number} loanPeriodDays - Loan period in days
     * @returns {Promise<CirculationRecord>} Circulation record
     *
     * @example
     * ```typescript
     * const checkout = await service.checkoutResource('STU123456', 'BOOK-001', 14);
     * console.log(`Due date: ${checkout.dueDate}`);
     * ```
     */
    checkoutResource(studentId: string, resourceId: string, loanPeriodDays: number): Promise<CirculationRecord>;
    /**
     * 8. Returns checked out resource.
     *
     * @param {string} circulationId - Circulation identifier
     * @returns {Promise<CirculationRecord>} Updated circulation record
     *
     * @example
     * ```typescript
     * await service.returnResource('CIRC-001');
     * ```
     */
    returnResource(circulationId: string): Promise<CirculationRecord>;
    /**
     * 9. Renews checked out resource.
     *
     * @param {string} circulationId - Circulation identifier
     * @returns {Promise<CirculationRecord>} Renewed circulation record
     *
     * @example
     * ```typescript
     * const renewed = await service.renewResource('CIRC-001');
     * console.log(`New due date: ${renewed.dueDate}`);
     * ```
     */
    renewResource(circulationId: string): Promise<CirculationRecord>;
    /**
     * 10. Retrieves active checkouts for student.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<CirculationRecord[]>} Active checkouts
     *
     * @example
     * ```typescript
     * const checkouts = await service.getActiveCheckouts('STU123456');
     * console.log(`Total checked out: ${checkouts.length}`);
     * ```
     */
    getActiveCheckouts(studentId: string): Promise<CirculationRecord[]>;
    /**
     * 11. Calculates overdue fines.
     *
     * @param {string} circulationId - Circulation identifier
     * @returns {Promise<{amount: number; daysOverdue: number}>} Fine calculation
     *
     * @example
     * ```typescript
     * const fine = await service.calculateOverdueFines('CIRC-001');
     * console.log(`Fine: $${fine.amount} for ${fine.daysOverdue} days`);
     * ```
     */
    calculateOverdueFines(circulationId: string): Promise<{
        amount: number;
        daysOverdue: number;
    }>;
    /**
     * 12. Sends overdue notices.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<{sent: boolean; noticeCount: number}>} Notice result
     *
     * @example
     * ```typescript
     * await service.sendOverdueNotices('STU123456');
     * ```
     */
    sendOverdueNotices(studentId: string): Promise<{
        sent: boolean;
        noticeCount: number;
    }>;
    /**
     * 13. Reports lost or damaged resource.
     *
     * @param {string} circulationId - Circulation identifier
     * @param {string} condition - Resource condition
     * @returns {Promise<LibraryFine>} Fine record
     *
     * @example
     * ```typescript
     * await service.reportLostOrDamaged('CIRC-001', 'lost');
     * ```
     */
    reportLostOrDamaged(circulationId: string, condition: 'lost' | 'damaged'): Promise<LibraryFine>;
    /**
     * 14. Checks resource availability.
     *
     * @param {string} resourceId - Resource identifier
     * @returns {Promise<{available: boolean; dueDate?: Date; holdCount: number}>} Availability
     *
     * @example
     * ```typescript
     * const availability = await service.checkResourceAvailability('BOOK-001');
     * ```
     */
    checkResourceAvailability(resourceId: string): Promise<{
        available: boolean;
        dueDate?: Date;
        holdCount: number;
    }>;
    /**
     * 15. Creates course reserve.
     *
     * @param {CourseReserve} reserveData - Reserve data
     * @returns {Promise<CourseReserve>} Course reserve
     *
     * @example
     * ```typescript
     * const reserve = await service.createCourseReserve({
     *   reserveId: 'RES-001',
     *   courseId: 'COURSE-CS101',
     *   courseCode: 'CS101',
     *   instructorId: 'INST-001',
     *   resourceId: 'BOOK-001',
     *   resourceTitle: 'Introduction to Programming',
     *   reserveType: 'physical',
     *   loanPeriod: 2,
     *   activationDate: new Date(),
     *   expirationDate: new Date(Date.now() + 120 * 86400000),
     *   accessCount: 0,
     *   active: true
     * });
     * ```
     */
    createCourseReserve(reserveData: CourseReserve): Promise<CourseReserve>;
    /**
     * 16. Retrieves reserves for course.
     *
     * @param {string} courseId - Course identifier
     * @returns {Promise<CourseReserve[]>} Course reserves
     *
     * @example
     * ```typescript
     * const reserves = await service.getCourseReserves('COURSE-CS101');
     * ```
     */
    getCourseReserves(courseId: string): Promise<CourseReserve[]>;
    /**
     * 17. Accesses electronic reserve.
     *
     * @param {string} reserveId - Reserve identifier
     * @param {string} studentId - Student identifier
     * @returns {Promise<{accessUrl: string; expiresIn: number}>} Access info
     *
     * @example
     * ```typescript
     * const access = await service.accessElectronicReserve('RES-001', 'STU123456');
     * ```
     */
    accessElectronicReserve(reserveId: string, studentId: string): Promise<{
        accessUrl: string;
        expiresIn: number;
    }>;
    /**
     * 18. Tracks reserve usage statistics.
     *
     * @param {string} courseId - Course identifier
     * @returns {Promise<any>} Usage statistics
     *
     * @example
     * ```typescript
     * const stats = await service.trackReserveUsage('COURSE-CS101');
     * ```
     */
    trackReserveUsage(courseId: string): Promise<any>;
    /**
     * 19. Removes expired course reserves.
     *
     * @param {string} courseId - Course identifier
     * @returns {Promise<number>} Number of reserves removed
     *
     * @example
     * ```typescript
     * const removed = await service.removeExpiredReserves('COURSE-CS101');
     * ```
     */
    removeExpiredReserves(courseId: string): Promise<number>;
    /**
     * 20. Notifies students of new reserves.
     *
     * @param {string} courseId - Course identifier
     * @param {string} reserveId - Reserve identifier
     * @returns {Promise<boolean>} Success status
     *
     * @example
     * ```typescript
     * await service.notifyStudentsOfNewReserve('COURSE-CS101', 'RES-001');
     * ```
     */
    notifyStudentsOfNewReserve(courseId: string, reserveId: string): Promise<boolean>;
    /**
     * 21. Retrieves outstanding fines.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<LibraryFine[]>} Outstanding fines
     *
     * @example
     * ```typescript
     * const fines = await service.getOutstandingFines('STU123456');
     * const total = fines.reduce((sum, f) => sum + f.amount, 0);
     * ```
     */
    getOutstandingFines(studentId: string): Promise<LibraryFine[]>;
    /**
     * 22. Pays library fine.
     *
     * @param {string} fineId - Fine identifier
     * @param {number} amount - Payment amount
     * @returns {Promise<LibraryFine>} Updated fine
     *
     * @example
     * ```typescript
     * await service.payLibraryFine('FINE-001', 5.00);
     * ```
     */
    payLibraryFine(fineId: string, amount: number): Promise<LibraryFine>;
    /**
     * 23. Waives library fine.
     *
     * @param {string} fineId - Fine identifier
     * @param {string} reason - Waiver reason
     * @returns {Promise<LibraryFine>} Waived fine
     *
     * @example
     * ```typescript
     * await service.waiveLibraryFine('FINE-001', 'System error');
     * ```
     */
    waiveLibraryFine(fineId: string, reason: string): Promise<LibraryFine>;
    /**
     * 24. Places hold on resource.
     *
     * @param {string} studentId - Student identifier
     * @param {string} resourceId - Resource identifier
     * @param {string} pickupLocation - Pickup location
     * @returns {Promise<HoldRequest>} Hold request
     *
     * @example
     * ```typescript
     * const hold = await service.placeHoldOnResource('STU123456', 'BOOK-001', 'Main Library');
     * ```
     */
    placeHoldOnResource(studentId: string, resourceId: string, pickupLocation: string): Promise<HoldRequest>;
    /**
     * 25. Retrieves active holds for student.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<HoldRequest[]>} Active holds
     *
     * @example
     * ```typescript
     * const holds = await service.getActiveHolds('STU123456');
     * ```
     */
    getActiveHolds(studentId: string): Promise<HoldRequest[]>;
    /**
     * 26. Cancels hold request.
     *
     * @param {string} holdId - Hold identifier
     * @returns {Promise<HoldRequest>} Cancelled hold
     *
     * @example
     * ```typescript
     * await service.cancelHoldRequest('HOLD-001');
     * ```
     */
    cancelHoldRequest(holdId: string): Promise<HoldRequest>;
    /**
     * 27. Submits inter-library loan request.
     *
     * @param {ILLRequest} illData - ILL request data
     * @returns {Promise<ILLRequest>} ILL request
     *
     * @example
     * ```typescript
     * const ill = await service.submitILLRequest({
     *   illId: 'ILL-001',
     *   requesterId: 'STU123456',
     *   requesterEmail: 'student@university.edu',
     *   resourceType: 'book',
     *   title: 'Advanced Topics in Computer Science',
     *   author: 'John Smith',
     *   requestDate: new Date(),
     *   status: 'requested',
     *   costToRequester: 0
     * });
     * ```
     */
    submitILLRequest(illData: ILLRequest): Promise<ILLRequest>;
    /**
     * 28. Tracks ILL request status.
     *
     * @param {string} illId - ILL identifier
     * @returns {Promise<ILLRequest>} ILL request
     *
     * @example
     * ```typescript
     * const status = await service.trackILLRequest('ILL-001');
     * console.log(`Status: ${status.status}`);
     * ```
     */
    trackILLRequest(illId: string): Promise<ILLRequest>;
    /**
     * 29. Returns ILL borrowed item.
     *
     * @param {string} illId - ILL identifier
     * @returns {Promise<ILLRequest>} Updated ILL request
     *
     * @example
     * ```typescript
     * await service.returnILLItem('ILL-001');
     * ```
     */
    returnILLItem(illId: string): Promise<ILLRequest>;
    /**
     * 30. Accesses digital resource.
     *
     * @param {string} resourceId - Resource identifier
     * @param {string} studentId - Student identifier
     * @returns {Promise<{accessUrl: string; proxyRequired: boolean}>} Access info
     *
     * @example
     * ```typescript
     * const access = await service.accessDigitalResource('EBOOK-001', 'STU123456');
     * window.open(access.accessUrl);
     * ```
     */
    accessDigitalResource(resourceId: string, studentId: string): Promise<{
        accessUrl: string;
        proxyRequired: boolean;
    }>;
    /**
     * 31. Searches digital resources catalog.
     *
     * @param {string} query - Search query
     * @param {object} filters - Search filters
     * @returns {Promise<DigitalResource[]>} Search results
     *
     * @example
     * ```typescript
     * const results = await service.searchDigitalResources('machine learning', {
     *   type: 'ebook',
     *   subject: 'Computer Science'
     * });
     * ```
     */
    searchDigitalResources(query: string, filters: {
        type?: string;
        subject?: string;
    }): Promise<DigitalResource[]>;
    /**
     * 32. Checks digital resource licensing.
     *
     * @param {string} resourceId - Resource identifier
     * @returns {Promise<{available: boolean; simultaneousUsers: number; currentUsers: number}>} License info
     *
     * @example
     * ```typescript
     * const license = await service.checkDigitalResourceLicense('EBOOK-001');
     * if (license.currentUsers >= license.simultaneousUsers) {
     *   console.log('Resource currently unavailable - at user limit');
     * }
     * ```
     */
    checkDigitalResourceLicense(resourceId: string): Promise<{
        available: boolean;
        simultaneousUsers: number;
        currentUsers: number;
    }>;
    /**
     * 33. Schedules research consultation.
     *
     * @param {string} studentId - Student identifier
     * @param {string} topic - Research topic
     * @param {Date} preferredTime - Preferred time
     * @returns {Promise<ResearchSupport>} Consultation session
     *
     * @example
     * ```typescript
     * const session = await service.scheduleResearchConsultation(
     *   'STU123456',
     *   'Literature review for thesis',
     *   new Date('2024-03-15T14:00:00')
     * );
     * ```
     */
    scheduleResearchConsultation(studentId: string, topic: string, preferredTime: Date): Promise<ResearchSupport>;
    /**
     * 34. Generates library usage statistics.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<any>} Usage statistics
     *
     * @example
     * ```typescript
     * const stats = await service.generateLibraryUsageStats('STU123456');
     * ```
     */
    generateLibraryUsageStats(studentId: string): Promise<any>;
    /**
     * 35. Integrates with learning management system.
     *
     * @param {string} courseId - Course identifier
     * @param {string} lmsType - LMS type
     * @returns {Promise<{integrated: boolean; resourcesLinked: number}>} Integration result
     *
     * @example
     * ```typescript
     * const integration = await service.integrateLMS('COURSE-CS101', 'canvas');
     * console.log(`Linked ${integration.resourcesLinked} resources to Canvas`);
     * ```
     */
    integrateLMS(courseId: string, lmsType: 'canvas' | 'blackboard' | 'moodle'): Promise<{
        integrated: boolean;
        resourcesLinked: number;
    }>;
}
export default LibraryResourceIntegrationCompositeService;
//# sourceMappingURL=library-resource-integration-composite.d.ts.map