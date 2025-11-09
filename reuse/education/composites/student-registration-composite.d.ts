/**
 * LOC: EDU-COMP-REGIS-001
 * File: /reuse/education/composites/student-registration-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../course-registration-kit
 *   - ../course-catalog-kit
 *   - ../class-scheduling-kit
 *   - ../student-enrollment-kit
 *   - ../academic-planning-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend registration services
 *   - Schedule building modules
 *   - Enrollment management controllers
 *   - Academic planning services
 */
import { Sequelize } from 'sequelize';
export type RegistrationAction = 'add' | 'drop' | 'swap' | 'withdraw';
export type RegistrationStatus = 'cart' | 'registered' | 'waitlisted' | 'dropped' | 'withdrawn';
export type HoldType = 'financial' | 'academic' | 'administrative' | 'advising';
export interface RegistrationAttempt {
    attemptId: string;
    studentId: string;
    courseId: string;
    sectionId: string;
    termId: string;
    action: RegistrationAction;
    attemptDate: Date;
    successful: boolean;
    errors: Array<{
        code: string;
        message: string;
    }>;
    warnings: string[];
}
export interface ShoppingCartItem {
    itemId: string;
    studentId: string;
    courseId: string;
    sectionId: string;
    termId: string;
    credits: number;
    addedDate: Date;
    priority: number;
}
export interface ScheduleConflict {
    conflictType: 'time' | 'prerequisite' | 'corequisite' | 'duplicate';
    severity: 'error' | 'warning';
    section1Id: string;
    section2Id?: string;
    message: string;
    resolution?: string;
}
export interface TimeTicket {
    studentId: string;
    termId: string;
    openDate: Date;
    closeDate: Date;
    priorityGroup: string;
    maxCredits: number;
}
export interface SchedulePreferences {
    preferredDays?: string[];
    avoidDays?: string[];
    preferredTimeStart?: string;
    preferredTimeEnd?: string;
    maxGapMinutes?: number;
    preferOnline?: boolean;
    preferredInstructors?: string[];
}
export interface CourseSection {
    sectionId: string;
    courseId: string;
    sectionNumber: string;
    instructor: string;
    meetingTimes: string;
    location: string;
    capacity: number;
    enrolled: number;
    waitlisted: number;
    credits: number;
}
/**
 * Student Registration Composite Service
 *
 * Provides comprehensive course registration and schedule building functionality.
 */
export declare class StudentRegistrationCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Adds course to student shopping cart.
     *
     * @param {string} studentId - Student ID
     * @param {string} courseId - Course ID
     * @param {string} sectionId - Section ID
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Cart item
     *
     * @example
     * ```typescript
     * const item = await service.addCourseToShoppingCart('STU-001', 'CS101', 'SEC-001', 'FALL-2024');
     * ```
     */
    addCourseToShoppingCart(studentId: string, courseId: string, sectionId: string, termId: string): Promise<any>;
    /**
     * 2. Removes course from shopping cart.
     *
     * @param {string} studentId - Student ID
     * @param {string} itemId - Cart item ID
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.removeCourseFromShoppingCart('STU-001', 'CART-123');
     * ```
     */
    removeCourseFromShoppingCart(studentId: string, itemId: string): Promise<void>;
    /**
     * 3. Registers all courses from shopping cart.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Registration results
     *
     * @example
     * ```typescript
     * const results = await service.registerFromShoppingCart('STU-001', 'FALL-2024');
     * console.log(`Registered for ${results.registeredCount} courses`);
     * ```
     */
    registerFromShoppingCart(studentId: string, termId: string): Promise<any>;
    /**
     * 4. Validates student registration eligibility.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Eligibility status
     *
     * @example
     * ```typescript
     * const eligibility = await service.validateRegistrationEligibility('STU-001', 'FALL-2024');
     * if (!eligibility.eligible) console.log('Holds:', eligibility.holds);
     * ```
     */
    validateRegistrationEligibility(studentId: string, termId: string): Promise<any>;
    /**
     * 5. Checks course prerequisites for student.
     *
     * @param {string} studentId - Student ID
     * @param {string} courseId - Course ID
     * @returns {Promise<any>} Prerequisite validation
     *
     * @example
     * ```typescript
     * const prereqs = await service.checkPrerequisites('STU-001', 'CS201');
     * ```
     */
    checkPrerequisites(studentId: string, courseId: string): Promise<any>;
    /**
     * 6. Validates student time ticket window.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Time ticket validation
     *
     * @example
     * ```typescript
     * const ticket = await service.validateTimeTicket('STU-001', 'FALL-2024');
     * console.log(`Registration open: ${ticket.openDate}`);
     * ```
     */
    validateTimeTicket(studentId: string, termId: string): Promise<any>;
    /**
     * 7. Checks real-time seat availability.
     *
     * @param {string} sectionId - Section ID
     * @returns {Promise<any>} Seat availability
     *
     * @example
     * ```typescript
     * const availability = await service.checkSeatAvailability('SEC-001');
     * console.log(`${availability.seatsRemaining} seats remaining`);
     * ```
     */
    checkSeatAvailability(sectionId: string): Promise<any>;
    /**
     * 8. Detects schedule time conflicts.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @param {string} newSectionId - New section to check
     * @returns {Promise<ScheduleConflict[]>} Detected conflicts
     *
     * @example
     * ```typescript
     * const conflicts = await service.detectScheduleConflicts('STU-001', 'FALL-2024', 'SEC-002');
     * ```
     */
    detectScheduleConflicts(studentId: string, termId: string, newSectionId: string): Promise<ScheduleConflict[]>;
    /**
     * 9. Processes course add registration.
     *
     * @param {string} studentId - Student ID
     * @param {string} sectionId - Section ID
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Add result
     *
     * @example
     * ```typescript
     * const result = await service.processCourseAdd('STU-001', 'SEC-001', 'FALL-2024');
     * ```
     */
    processCourseAdd(studentId: string, sectionId: string, termId: string): Promise<any>;
    /**
     * 10. Processes course drop registration.
     *
     * @param {string} studentId - Student ID
     * @param {string} sectionId - Section ID
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Drop result
     *
     * @example
     * ```typescript
     * const result = await service.processCourseDrop('STU-001', 'SEC-001', 'FALL-2024');
     * console.log(`Refund: $${result.refundAmount}`);
     * ```
     */
    processCourseDrop(studentId: string, sectionId: string, termId: string): Promise<any>;
    /**
     * 11. Builds optimal schedule from required courses.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @param {string[]} requiredCourses - Required course IDs
     * @returns {Promise<any>} Schedule options
     *
     * @example
     * ```typescript
     * const schedules = await service.buildOptimalSchedule('STU-001', 'FALL-2024', ['CS101', 'MATH201']);
     * ```
     */
    buildOptimalSchedule(studentId: string, termId: string, requiredCourses: string[]): Promise<any>;
    /**
     * 12. Suggests alternative sections for course.
     *
     * @param {string} studentId - Student ID
     * @param {string} courseId - Course ID
     * @param {string} termId - Term ID
     * @returns {Promise<any[]>} Alternative sections
     *
     * @example
     * ```typescript
     * const alternatives = await service.suggestAlternativeSections('STU-001', 'CS101', 'FALL-2024');
     * ```
     */
    suggestAlternativeSections(studentId: string, courseId: string, termId: string): Promise<any[]>;
    /**
     * 13. Optimizes schedule based on student preferences.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @param {SchedulePreferences} preferences - Schedule preferences
     * @returns {Promise<any>} Optimized schedule
     *
     * @example
     * ```typescript
     * const optimized = await service.optimizeScheduleByPreferences('STU-001', 'FALL-2024', {
     *   preferredDays: ['MWF'],
     *   preferredTimeStart: '10:00',
     *   maxGapMinutes: 60
     * });
     * ```
     */
    optimizeScheduleByPreferences(studentId: string, termId: string, preferences: SchedulePreferences): Promise<any>;
    /**
     * 14. Validates credit load limits.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @param {number} proposedCredits - Proposed total credits
     * @returns {Promise<any>} Credit validation
     *
     * @example
     * ```typescript
     * const validation = await service.validateCreditLoad('STU-001', 'FALL-2024', 18);
     * ```
     */
    validateCreditLoad(studentId: string, termId: string, proposedCredits: number): Promise<any>;
    /**
     * 15. Calculates schedule quality rating.
     *
     * @param {any} schedule - Schedule object
     * @returns {Promise<number>} Quality rating 0-10
     *
     * @example
     * ```typescript
     * const rating = await service.calculateScheduleRating(schedule);
     * console.log(`Schedule rating: ${rating}/10`);
     * ```
     */
    calculateScheduleRating(schedule: any): Promise<number>;
    /**
     * 16. Identifies gaps in schedule.
     *
     * @param {any} schedule - Schedule object
     * @returns {Promise<any[]>} Schedule gaps
     *
     * @example
     * ```typescript
     * const gaps = await service.identifyScheduleGaps(schedule);
     * ```
     */
    identifyScheduleGaps(schedule: any): Promise<any[]>;
    /**
     * 17. Suggests courses to fill schedule gaps.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @param {any[]} gapTimes - Gap time slots
     * @returns {Promise<any[]>} Filler course suggestions
     *
     * @example
     * ```typescript
     * const fillers = await service.suggestFillerCourses('STU-001', 'FALL-2024', gaps);
     * ```
     */
    suggestFillerCourses(studentId: string, termId: string, gapTimes: any[]): Promise<any[]>;
    /**
     * 18. Balances schedule workload.
     *
     * @param {any} schedule - Schedule object
     * @returns {Promise<any>} Workload analysis
     *
     * @example
     * ```typescript
     * const balance = await service.balanceScheduleWorkload(schedule);
     * console.log(`Estimated weekly hours: ${balance.estimatedWeeklyHours}`);
     * ```
     */
    balanceScheduleWorkload(schedule: any): Promise<any>;
    /**
     * 19. Generates comparison of schedule options.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @param {any[]} schedules - Schedule options
     * @returns {Promise<any>} Comparison matrix
     *
     * @example
     * ```typescript
     * const comparison = await service.generateScheduleComparisons('STU-001', 'FALL-2024', schedules);
     * ```
     */
    generateScheduleComparisons(studentId: string, termId: string, schedules: any[]): Promise<any>;
    /**
     * 20. Exports schedule to calendar format.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @param {string} format - Calendar format (ics, google, outlook)
     * @returns {Promise<any>} Calendar export
     *
     * @example
     * ```typescript
     * const cal = await service.exportScheduleToCalendar('STU-001', 'FALL-2024', 'ics');
     * ```
     */
    exportScheduleToCalendar(studentId: string, termId: string, format: string): Promise<any>;
    /**
     * 21. Adds student to course waitlist.
     *
     * @param {string} studentId - Student ID
     * @param {string} sectionId - Section ID
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Waitlist entry
     *
     * @example
     * ```typescript
     * const entry = await service.addToWaitlist('STU-001', 'SEC-001', 'FALL-2024');
     * console.log(`Waitlist position: ${entry.position}`);
     * ```
     */
    addToWaitlist(studentId: string, sectionId: string, termId: string): Promise<any>;
    /**
     * 22. Removes student from waitlist.
     *
     * @param {string} studentId - Student ID
     * @param {string} waitlistId - Waitlist ID
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.removeFromWaitlist('STU-001', 'WL-123');
     * ```
     */
    removeFromWaitlist(studentId: string, waitlistId: string): Promise<void>;
    /**
     * 23. Checks current waitlist position.
     *
     * @param {string} waitlistId - Waitlist ID
     * @returns {Promise<any>} Position status
     *
     * @example
     * ```typescript
     * const status = await service.checkWaitlistPosition('WL-123');
     * ```
     */
    checkWaitlistPosition(waitlistId: string): Promise<any>;
    /**
     * 24. Processes waitlist seat availability notification.
     *
     * @param {string} waitlistId - Waitlist ID
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.processWaitlistNotification('WL-123');
     * ```
     */
    processWaitlistNotification(waitlistId: string): Promise<void>;
    /**
     * 25. Auto-registers eligible students from waitlist.
     *
     * @param {string} sectionId - Section ID
     * @returns {Promise<number>} Number of students registered
     *
     * @example
     * ```typescript
     * const registered = await service.autoRegisterFromWaitlist('SEC-001');
     * console.log(`Auto-registered ${registered} students from waitlist`);
     * ```
     */
    autoRegisterFromWaitlist(sectionId: string): Promise<number>;
    /**
     * 26. Estimates probability of getting off waitlist.
     *
     * @param {string} waitlistId - Waitlist ID
     * @returns {Promise<any>} Probability estimate
     *
     * @example
     * ```typescript
     * const estimate = await service.estimateWaitlistChance('WL-123');
     * console.log(`${estimate.probability * 100}% chance in ${estimate.estimatedDays} days`);
     * ```
     */
    estimateWaitlistChance(waitlistId: string): Promise<any>;
    /**
     * 27. Tracks waitlist activity metrics.
     *
     * @param {string} sectionId - Section ID
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Waitlist metrics
     *
     * @example
     * ```typescript
     * const metrics = await service.trackWaitlistActivity('SEC-001', 'FALL-2024');
     * ```
     */
    trackWaitlistActivity(sectionId: string, termId: string): Promise<any>;
    /**
     * 28. Sends waitlist position updates.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<number>} Number of updates sent
     *
     * @example
     * ```typescript
     * const sent = await service.sendWaitlistUpdates('STU-001');
     * ```
     */
    sendWaitlistUpdates(studentId: string): Promise<number>;
    /**
     * 29. Sets waitlist notification preferences.
     *
     * @param {string} studentId - Student ID
     * @param {any} preferences - Notification preferences
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.setWaitlistPreferences('STU-001', { method: 'sms', autoRegister: true });
     * ```
     */
    setWaitlistPreferences(studentId: string, preferences: any): Promise<void>;
    /**
     * 30. Generates waitlist analytics report.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Waitlist report
     *
     * @example
     * ```typescript
     * const report = await service.generateWaitlistReport('FALL-2024');
     * console.log(`${report.conversionRate}% conversion rate`);
     * ```
     */
    generateWaitlistReport(termId: string): Promise<any>;
    /**
     * 31. Processes course swap (drop one, add another).
     *
     * @param {string} studentId - Student ID
     * @param {string} dropSectionId - Section to drop
     * @param {string} addSectionId - Section to add
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Swap result
     *
     * @example
     * ```typescript
     * const result = await service.processCourseSwap('STU-001', 'SEC-001', 'SEC-002', 'FALL-2024');
     * ```
     */
    processCourseSwap(studentId: string, dropSectionId: string, addSectionId: string, termId: string): Promise<any>;
    /**
     * 32. Validates concurrent enrollment at another institution.
     *
     * @param {string} studentId - Student ID
     * @param {string} externalInstitution - External institution
     * @param {string} courseId - Course ID
     * @returns {Promise<any>} Validation result
     *
     * @example
     * ```typescript
     * const approval = await service.validateConcurrentEnrollment('STU-001', 'State University', 'MATH301');
     * ```
     */
    validateConcurrentEnrollment(studentId: string, externalInstitution: string, courseId: string): Promise<any>;
    /**
     * 33. Calculates student registration priority.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Priority calculation
     *
     * @example
     * ```typescript
     * const priority = await service.calculateRegistrationPriority('STU-001', 'FALL-2024');
     * console.log(`Priority group: ${priority.priorityGroup}, Score: ${priority.priorityScore}`);
     * ```
     */
    calculateRegistrationPriority(studentId: string, termId: string): Promise<any>;
    /**
     * 34. Tracks registration metrics for term.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Registration metrics
     *
     * @example
     * ```typescript
     * const metrics = await service.trackRegistrationMetrics('FALL-2024');
     * console.log(`${metrics.registrationRate}% of students registered`);
     * ```
     */
    trackRegistrationMetrics(termId: string): Promise<any>;
    /**
     * 35. Identifies high-demand courses.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any[]>} Bottleneck courses
     *
     * @example
     * ```typescript
     * const bottlenecks = await service.identifyRegistrationBottlenecks('FALL-2024');
     * ```
     */
    identifyRegistrationBottlenecks(termId: string): Promise<any[]>;
    /**
     * 36. Generates registration activity heatmap.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Activity heatmap
     *
     * @example
     * ```typescript
     * const heatmap = await service.generateRegistrationHeatmap('FALL-2024');
     * ```
     */
    generateRegistrationHeatmap(termId: string): Promise<any>;
    /**
     * 37. Enforces registration holds.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<any[]>} Active holds
     *
     * @example
     * ```typescript
     * const holds = await service.enforceRegistrationHolds('STU-001');
     * if (holds.length > 0) console.log('Cannot register - holds present');
     * ```
     */
    enforceRegistrationHolds(studentId: string): Promise<any[]>;
    /**
     * 38. Releases registration hold.
     *
     * @param {string} studentId - Student ID
     * @param {string} holdId - Hold ID
     * @param {string} releasedBy - User releasing hold
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.releaseRegistrationHold('STU-001', 'HOLD-123', 'registrar-456');
     * ```
     */
    releaseRegistrationHold(studentId: string, holdId: string, releasedBy: string): Promise<void>;
    /**
     * 39. Calculates add/drop/withdraw deadlines.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Deadline schedule
     *
     * @example
     * ```typescript
     * const deadlines = await service.calculateDropDeadlines('FALL-2024');
     * ```
     */
    calculateDropDeadlines(termId: string): Promise<any>;
    /**
     * 40. Processes late registration with approval.
     *
     * @param {string} studentId - Student ID
     * @param {string} sectionId - Section ID
     * @param {string} termId - Term ID
     * @param {string} approvalCode - Approval code
     * @returns {Promise<any>} Late registration result
     *
     * @example
     * ```typescript
     * const result = await service.processLateRegistration('STU-001', 'SEC-001', 'FALL-2024', 'APPR-123');
     * ```
     */
    processLateRegistration(studentId: string, sectionId: string, termId: string, approvalCode: string): Promise<any>;
    /**
     * 41. Generates student schedule display.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Schedule display
     *
     * @example
     * ```typescript
     * const schedule = await service.generateStudentSchedule('STU-001', 'FALL-2024');
     * ```
     */
    generateStudentSchedule(studentId: string, termId: string): Promise<any>;
    /**
     * 42. Sends registration reminder notifications.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<number>} Number of reminders sent
     *
     * @example
     * ```typescript
     * const sent = await service.sendRegistrationReminders('FALL-2024');
     * console.log(`Sent ${sent} registration reminders`);
     * ```
     */
    sendRegistrationReminders(termId: string): Promise<number>;
    /**
     * 43. Exports registration data for reporting.
     *
     * @param {string} termId - Term ID
     * @param {string} format - Export format (csv, xlsx, json)
     * @returns {Promise<any>} Export data
     *
     * @example
     * ```typescript
     * const data = await service.exportRegistrationData('FALL-2024', 'csv');
     * ```
     */
    exportRegistrationData(termId: string, format: string): Promise<any>;
}
export default StudentRegistrationCompositeService;
//# sourceMappingURL=student-registration-composite.d.ts.map