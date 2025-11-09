/**
 * LOC: EDU-COMP-SCHEDULING-001
 * File: /reuse/education/composites/course-scheduling-management-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../class-scheduling-kit
 *   - ../course-catalog-kit
 *   - ../faculty-management-kit
 *   - ../student-enrollment-kit
 *   - ../compliance-reporting-kit
 *
 * DOWNSTREAM (imported by):
 *   - Scheduling controllers
 *   - Room assignment services
 *   - Section management modules
 *   - Conflict resolution services
 *   - Enrollment capacity systems
 */
import { Sequelize } from 'sequelize';
/**
 * Section status types
 */
export type SectionStatus = 'planned' | 'open' | 'closed' | 'cancelled' | 'full' | 'waitlist';
/**
 * Meeting pattern types
 */
export type MeetingPattern = 'MWF' | 'TR' | 'MW' | 'WF' | 'M' | 'T' | 'W' | 'R' | 'F' | 'S' | 'U';
/**
 * Delivery method types
 */
export type DeliveryMethod = 'in_person' | 'online' | 'hybrid' | 'hyflex' | 'blended';
/**
 * Room type categories
 */
export type RoomType = 'classroom' | 'lab' | 'lecture_hall' | 'seminar' | 'studio' | 'online';
/**
 * Course section data
 */
export interface CourseSectionData {
    courseId: string;
    sectionNumber: string;
    term: string;
    academicYear: number;
    instructorId: string;
    roomId?: string;
    meetingPattern: MeetingPattern;
    startTime: string;
    endTime: string;
    startDate: Date;
    endDate: Date;
    maxEnrollment: number;
    currentEnrollment: number;
    waitlistCapacity: number;
    deliveryMethod: DeliveryMethod;
    status: SectionStatus;
    credits: number;
    instructionalMethod?: string;
}
/**
 * Room data
 */
export interface RoomData {
    buildingId: string;
    roomNumber: string;
    roomName: string;
    roomType: RoomType;
    capacity: number;
    features: string[];
    accessible: boolean;
    technologyEquipped: boolean;
    status: 'available' | 'unavailable' | 'maintenance';
}
/**
 * Time slot data
 */
export interface TimeSlotData {
    term: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    slotType: 'standard' | 'evening' | 'weekend' | 'custom';
}
/**
 * Scheduling conflict data
 */
export interface SchedulingConflict {
    conflictType: 'room' | 'instructor' | 'student' | 'time';
    section1Id: string;
    section2Id: string;
    description: string;
    severity: 'critical' | 'warning' | 'info';
    resolutionSuggestions: string[];
}
/**
 * Schedule optimization preferences
 */
export interface ScheduleOptimizationPreferences {
    preferredTimeSlots?: string[];
    avoidTimeSlots?: string[];
    maximizeRoomUtilization?: boolean;
    minimizeInstructorTravelTime?: boolean;
    balanceEnrollmentDistribution?: boolean;
    priorityLevel?: 'high' | 'medium' | 'low';
}
/**
 * Sequelize model for Course Sections with full scheduling details.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     CourseSection:
 *       type: object
 *       required:
 *         - courseId
 *         - sectionNumber
 *         - term
 *         - academicYear
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         courseId:
 *           type: string
 *         sectionNumber:
 *           type: string
 *           example: "001"
 *         term:
 *           type: string
 *           enum: [fall, spring, summer, winter]
 *         maxEnrollment:
 *           type: number
 *           example: 30
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CourseSection model
 *
 * @example
 * ```typescript
 * const CourseSection = createCourseSectionModel(sequelize);
 * const section = await CourseSection.create({
 *   courseId: 'cs-101',
 *   sectionNumber: '001',
 *   term: 'fall',
 *   academicYear: 2025,
 *   instructorId: 'faculty-123',
 *   roomId: 'room-456',
 *   meetingPattern: 'MWF',
 *   startTime: '09:00',
 *   endTime: '09:50',
 *   maxEnrollment: 30,
 *   deliveryMethod: 'in_person'
 * });
 * ```
 */
export declare const createCourseSectionModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        courseId: string;
        sectionNumber: string;
        term: string;
        academicYear: number;
        instructorId: string;
        roomId: string | null;
        meetingPattern: MeetingPattern;
        startTime: string;
        endTime: string;
        startDate: Date;
        endDate: Date;
        maxEnrollment: number;
        currentEnrollment: number;
        waitlistCapacity: number;
        deliveryMethod: DeliveryMethod;
        status: SectionStatus;
        credits: number;
        instructionalMethod: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Room Inventory.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Room model
 */
export declare const createRoomModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        buildingId: string;
        roomNumber: string;
        roomName: string;
        roomType: RoomType;
        capacity: number;
        features: string[];
        accessible: boolean;
        technologyEquipped: boolean;
        status: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Course Scheduling Management Composite Service
 *
 * Provides comprehensive class scheduling, room allocation, section management,
 * and enrollment capacity planning for higher education institutions.
 */
export declare class CourseSchedulingManagementService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Creates a new course section.
     *
     * @param {CourseSectionData} sectionData - Section data
     * @returns {Promise<any>} Created section
     *
     * @example
     * ```typescript
     * const section = await service.createCourseSection({
     *   courseId: 'cs-101',
     *   sectionNumber: '001',
     *   term: 'fall',
     *   academicYear: 2025,
     *   instructorId: 'faculty-123',
     *   roomId: 'room-456',
     *   meetingPattern: 'MWF',
     *   startTime: '09:00',
     *   endTime: '09:50',
     *   startDate: new Date('2025-09-02'),
     *   endDate: new Date('2025-12-15'),
     *   maxEnrollment: 30,
     *   currentEnrollment: 0,
     *   waitlistCapacity: 5,
     *   deliveryMethod: 'in_person',
     *   status: 'planned',
     *   credits: 3
     * });
     * ```
     */
    createCourseSection(sectionData: CourseSectionData): Promise<any>;
    /**
     * 2. Updates course section details.
     *
     * @param {string} sectionId - Section ID
     * @param {Partial<CourseSectionData>} updates - Update data
     * @returns {Promise<any>} Updated section
     *
     * @example
     * ```typescript
     * await service.updateCourseSection('section-123', {
     *   maxEnrollment: 35,
     *   roomId: 'room-789'
     * });
     * ```
     */
    updateCourseSection(sectionId: string, updates: Partial<CourseSectionData>): Promise<any>;
    /**
     * 3. Cancels a course section.
     *
     * @param {string} sectionId - Section ID
     * @param {string} reason - Cancellation reason
     * @returns {Promise<any>} Cancelled section
     *
     * @example
     * ```typescript
     * await service.cancelCourseSection('section-123', 'Low enrollment');
     * ```
     */
    cancelCourseSection(sectionId: string, reason: string): Promise<any>;
    /**
     * 4. Opens section for enrollment.
     *
     * @param {string} sectionId - Section ID
     * @returns {Promise<any>} Opened section
     *
     * @example
     * ```typescript
     * await service.openSectionForEnrollment('section-123');
     * ```
     */
    openSectionForEnrollment(sectionId: string): Promise<any>;
    /**
     * 5. Closes section to new enrollment.
     *
     * @param {string} sectionId - Section ID
     * @returns {Promise<any>} Closed section
     *
     * @example
     * ```typescript
     * await service.closeSectionToEnrollment('section-123');
     * ```
     */
    closeSectionToEnrollment(sectionId: string): Promise<any>;
    /**
     * 6. Lists all sections for a term.
     *
     * @param {string} term - Academic term
     * @param {number} academicYear - Academic year
     * @returns {Promise<any[]>} Sections
     *
     * @example
     * ```typescript
     * const sections = await service.getSectionsByTerm('fall', 2025);
     * ```
     */
    getSectionsByTerm(term: string, academicYear: number): Promise<any[]>;
    /**
     * 7. Gets sections by instructor.
     *
     * @param {string} instructorId - Instructor ID
     * @param {string} term - Academic term
     * @returns {Promise<any[]>} Instructor's sections
     *
     * @example
     * ```typescript
     * const sections = await service.getSectionsByInstructor('faculty-123', 'fall');
     * ```
     */
    getSectionsByInstructor(instructorId: string, term: string): Promise<any[]>;
    /**
     * 8. Clones section to another term.
     *
     * @param {string} sectionId - Section ID to clone
     * @param {string} targetTerm - Target term
     * @param {number} targetYear - Target year
     * @returns {Promise<any>} Cloned section
     *
     * @example
     * ```typescript
     * const cloned = await service.cloneSectionToTerm('section-123', 'spring', 2026);
     * ```
     */
    cloneSectionToTerm(sectionId: string, targetTerm: string, targetYear: number): Promise<any>;
    /**
     * 9. Creates a new room in inventory.
     *
     * @param {RoomData} roomData - Room data
     * @returns {Promise<any>} Created room
     *
     * @example
     * ```typescript
     * const room = await service.createRoom({
     *   buildingId: 'building-a',
     *   roomNumber: '201',
     *   roomName: 'Computer Lab A',
     *   roomType: 'lab',
     *   capacity: 30,
     *   features: ['projector', 'whiteboard', 'computers'],
     *   accessible: true,
     *   technologyEquipped: true,
     *   status: 'available'
     * });
     * ```
     */
    createRoom(roomData: RoomData): Promise<any>;
    /**
     * 10. Assigns room to section.
     *
     * @param {string} sectionId - Section ID
     * @param {string} roomId - Room ID
     * @returns {Promise<any>} Updated section
     *
     * @example
     * ```typescript
     * await service.assignRoomToSection('section-123', 'room-456');
     * ```
     */
    assignRoomToSection(sectionId: string, roomId: string): Promise<any>;
    /**
     * 11. Finds available rooms for time slot.
     *
     * @param {string} term - Academic term
     * @param {string} meetingPattern - Meeting pattern
     * @param {string} startTime - Start time
     * @param {string} endTime - End time
     * @param {number} minCapacity - Minimum capacity
     * @returns {Promise<any[]>} Available rooms
     *
     * @example
     * ```typescript
     * const rooms = await service.findAvailableRooms('fall', 'MWF', '09:00', '09:50', 30);
     * ```
     */
    findAvailableRooms(term: string, meetingPattern: MeetingPattern, startTime: string, endTime: string, minCapacity: number): Promise<any[]>;
    /**
     * 12. Calculates room utilization rate.
     *
     * @param {string} roomId - Room ID
     * @param {string} term - Academic term
     * @returns {Promise<number>} Utilization percentage
     *
     * @example
     * ```typescript
     * const utilization = await service.calculateRoomUtilization('room-456', 'fall');
     * console.log(`Room is ${utilization}% utilized`);
     * ```
     */
    calculateRoomUtilization(roomId: string, term: string): Promise<number>;
    /**
     * 13. Generates room usage report.
     *
     * @param {string} buildingId - Building ID
     * @param {string} term - Academic term
     * @returns {Promise<any>} Usage report
     *
     * @example
     * ```typescript
     * const report = await service.generateRoomUsageReport('building-a', 'fall');
     * ```
     */
    generateRoomUsageReport(buildingId: string, term: string): Promise<any>;
    /**
     * 14. Marks room for maintenance.
     *
     * @param {string} roomId - Room ID
     * @param {Date} startDate - Maintenance start
     * @param {Date} endDate - Maintenance end
     * @returns {Promise<any>} Updated room
     *
     * @example
     * ```typescript
     * await service.markRoomForMaintenance('room-456', new Date(), new Date('2025-12-31'));
     * ```
     */
    markRoomForMaintenance(roomId: string, startDate: Date, endDate: Date): Promise<any>;
    /**
     * 15. Searches rooms by features.
     *
     * @param {string[]} requiredFeatures - Required features
     * @param {number} minCapacity - Minimum capacity
     * @returns {Promise<any[]>} Matching rooms
     *
     * @example
     * ```typescript
     * const rooms = await service.searchRoomsByFeatures(['projector', 'whiteboard'], 25);
     * ```
     */
    searchRoomsByFeatures(requiredFeatures: string[], minCapacity: number): Promise<any[]>;
    /**
     * 16. Generates room inventory report.
     *
     * @returns {Promise<any>} Inventory report
     *
     * @example
     * ```typescript
     * const inventory = await service.generateRoomInventoryReport();
     * ```
     */
    generateRoomInventoryReport(): Promise<any>;
    /**
     * 17. Increases section enrollment capacity.
     *
     * @param {string} sectionId - Section ID
     * @param {number} newCapacity - New capacity
     * @returns {Promise<any>} Updated section
     *
     * @example
     * ```typescript
     * await service.increaseSectionCapacity('section-123', 40);
     * ```
     */
    increaseSectionCapacity(sectionId: string, newCapacity: number): Promise<any>;
    /**
     * 18. Enables waitlist for section.
     *
     * @param {string} sectionId - Section ID
     * @param {number} waitlistCapacity - Waitlist capacity
     * @returns {Promise<any>} Updated section
     *
     * @example
     * ```typescript
     * await service.enableSectionWaitlist('section-123', 10);
     * ```
     */
    enableSectionWaitlist(sectionId: string, waitlistCapacity: number): Promise<any>;
    /**
     * 19. Checks section enrollment status.
     *
     * @param {string} sectionId - Section ID
     * @returns {Promise<any>} Enrollment status
     *
     * @example
     * ```typescript
     * const status = await service.checkSectionEnrollmentStatus('section-123');
     * console.log(`${status.seatsAvailable} seats available`);
     * ```
     */
    checkSectionEnrollmentStatus(sectionId: string): Promise<any>;
    /**
     * 20. Projects enrollment demand for course.
     *
     * @param {string} courseId - Course ID
     * @param {string} term - Target term
     * @returns {Promise<any>} Enrollment projection
     *
     * @example
     * ```typescript
     * const projection = await service.projectEnrollmentDemand('cs-101', 'fall');
     * ```
     */
    projectEnrollmentDemand(courseId: string, term: string): Promise<any>;
    /**
     * 21. Balances enrollment across sections.
     *
     * @param {string} courseId - Course ID
     * @param {string} term - Academic term
     * @returns {Promise<any>} Balancing report
     *
     * @example
     * ```typescript
     * const report = await service.balanceEnrollmentAcrossSections('cs-101', 'fall');
     * ```
     */
    balanceEnrollmentAcrossSections(courseId: string, term: string): Promise<any>;
    /**
     * 22. Identifies under-enrolled sections.
     *
     * @param {string} term - Academic term
     * @param {number} threshold - Minimum enrollment threshold
     * @returns {Promise<any[]>} Under-enrolled sections
     *
     * @example
     * ```typescript
     * const sections = await service.identifyUnderEnrolledSections('fall', 10);
     * ```
     */
    identifyUnderEnrolledSections(term: string, threshold: number): Promise<any[]>;
    /**
     * 23. Generates enrollment capacity report.
     *
     * @param {string} term - Academic term
     * @returns {Promise<any>} Capacity report
     *
     * @example
     * ```typescript
     * const report = await service.generateEnrollmentCapacityReport('fall');
     * ```
     */
    generateEnrollmentCapacityReport(term: string): Promise<any>;
    /**
     * 24. Recommends capacity adjustments.
     *
     * @param {string} courseId - Course ID
     * @param {string} term - Academic term
     * @returns {Promise<any>} Capacity recommendations
     *
     * @example
     * ```typescript
     * const recommendations = await service.recommendCapacityAdjustments('cs-101', 'fall');
     * ```
     */
    recommendCapacityAdjustments(courseId: string, term: string): Promise<any>;
    /**
     * 25. Detects scheduling conflicts for new section.
     *
     * @param {CourseSectionData} sectionData - Section data
     * @returns {Promise<SchedulingConflict[]>} Detected conflicts
     *
     * @example
     * ```typescript
     * const conflicts = await service.detectSchedulingConflicts(sectionData);
     * ```
     */
    detectSchedulingConflicts(sectionData: CourseSectionData): Promise<SchedulingConflict[]>;
    /**
     * 26. Validates instructor availability.
     *
     * @param {string} instructorId - Instructor ID
     * @param {string} term - Academic term
     * @param {string} timeSlot - Time slot
     * @returns {Promise<boolean>} True if available
     *
     * @example
     * ```typescript
     * const available = await service.validateInstructorAvailability('faculty-123', 'fall', 'MWF 09:00-09:50');
     * ```
     */
    validateInstructorAvailability(instructorId: string, term: string, timeSlot: string): Promise<boolean>;
    /**
     * 27. Resolves scheduling conflict automatically.
     *
     * @param {string} conflictId - Conflict ID
     * @param {string} resolutionStrategy - Resolution strategy
     * @returns {Promise<any>} Resolution result
     *
     * @example
     * ```typescript
     * await service.resolveSchedulingConflict('conflict-123', 'reassign_room');
     * ```
     */
    resolveSchedulingConflict(conflictId: string, resolutionStrategy: string): Promise<any>;
    /**
     * 28. Generates conflict report for term.
     *
     * @param {string} term - Academic term
     * @returns {Promise<any>} Conflict report
     *
     * @example
     * ```typescript
     * const report = await service.generateConflictReport('fall');
     * ```
     */
    generateConflictReport(term: string): Promise<any>;
    /**
     * 29. Validates complete schedule integrity.
     *
     * @param {string} term - Academic term
     * @returns {Promise<{valid: boolean; issues: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateScheduleIntegrity('fall');
     * ```
     */
    validateScheduleIntegrity(term: string): Promise<{
        valid: boolean;
        issues: string[];
    }>;
    /**
     * 30. Identifies time slot conflicts.
     *
     * @param {string} term - Academic term
     * @returns {Promise<any[]>} Time conflicts
     *
     * @example
     * ```typescript
     * const conflicts = await service.identifyTimeSlotConflicts('fall');
     * ```
     */
    identifyTimeSlotConflicts(term: string): Promise<any[]>;
    /**
     * 31. Suggests alternative time slots.
     *
     * @param {string} sectionId - Section ID
     * @returns {Promise<string[]>} Alternative slots
     *
     * @example
     * ```typescript
     * const alternatives = await service.suggestAlternativeTimeSlots('section-123');
     * ```
     */
    suggestAlternativeTimeSlots(sectionId: string): Promise<string[]>;
    /**
     * 32. Generates scheduling recommendations.
     *
     * @param {string} term - Academic term
     * @returns {Promise<any[]>} Recommendations
     *
     * @example
     * ```typescript
     * const recommendations = await service.generateSchedulingRecommendations('fall');
     * ```
     */
    generateSchedulingRecommendations(term: string): Promise<any[]>;
    /**
     * 33. Optimizes schedule for student preferences.
     *
     * @param {string} term - Academic term
     * @param {ScheduleOptimizationPreferences} preferences - Preferences
     * @returns {Promise<any>} Optimization result
     *
     * @example
     * ```typescript
     * const result = await service.optimizeScheduleForStudents('fall', {
     *   preferredTimeSlots: ['09:00-12:00'],
     *   maximizeRoomUtilization: true
     * });
     * ```
     */
    optimizeScheduleForStudents(term: string, preferences: ScheduleOptimizationPreferences): Promise<any>;
    /**
     * 34. Analyzes schedule efficiency.
     *
     * @param {string} term - Academic term
     * @returns {Promise<any>} Efficiency analysis
     *
     * @example
     * ```typescript
     * const analysis = await service.analyzeScheduleEfficiency('fall');
     * ```
     */
    analyzeScheduleEfficiency(term: string): Promise<any>;
    /**
     * 35. Generates teaching load report for faculty.
     *
     * @param {string} instructorId - Instructor ID
     * @param {string} term - Academic term
     * @returns {Promise<any>} Teaching load report
     *
     * @example
     * ```typescript
     * const load = await service.generateTeachingLoadReport('faculty-123', 'fall');
     * ```
     */
    generateTeachingLoadReport(instructorId: string, term: string): Promise<any>;
    /**
     * 36. Identifies prime time scheduling opportunities.
     *
     * @param {string} term - Academic term
     * @returns {Promise<any[]>} Prime time slots
     *
     * @example
     * ```typescript
     * const primeSlots = await service.identifyPrimeTimeSlots('fall');
     * ```
     */
    identifyPrimeTimeSlots(term: string): Promise<any[]>;
    /**
     * 37. Generates schedule visualization data.
     *
     * @param {string} term - Academic term
     * @returns {Promise<any>} Visualization data
     *
     * @example
     * ```typescript
     * const vizData = await service.generateScheduleVisualization('fall');
     * ```
     */
    generateScheduleVisualization(term: string): Promise<any>;
    /**
     * 38. Compares schedule efficiency across terms.
     *
     * @param {string[]} terms - Terms to compare
     * @returns {Promise<any>} Comparison report
     *
     * @example
     * ```typescript
     * const comparison = await service.compareScheduleEfficiency(['fall', 'spring']);
     * ```
     */
    compareScheduleEfficiency(terms: string[]): Promise<any>;
    /**
     * 39. Generates section performance metrics.
     *
     * @param {string} sectionId - Section ID
     * @returns {Promise<any>} Performance metrics
     *
     * @example
     * ```typescript
     * const metrics = await service.generateSectionPerformanceMetrics('section-123');
     * ```
     */
    generateSectionPerformanceMetrics(sectionId: string): Promise<any>;
    /**
     * 40. Exports complete schedule to calendar format.
     *
     * @param {string} term - Academic term
     * @param {string} format - Export format (ics, csv, json)
     * @returns {Promise<any>} Exported schedule
     *
     * @example
     * ```typescript
     * const icsFile = await service.exportScheduleToCalendar('fall', 'ics');
     * ```
     */
    exportScheduleToCalendar(term: string, format: 'ics' | 'csv' | 'json'): Promise<any>;
    /**
     * Retrieves section by ID.
     *
     * @private
     */
    private getSectionById;
    /**
     * Retrieves room by ID.
     *
     * @private
     */
    private getRoomById;
}
export default CourseSchedulingManagementService;
//# sourceMappingURL=course-scheduling-management-composite.d.ts.map