/**
 * LOC: EDU-COMP-HOUSING-001
 * File: /reuse/education/composites/housing-residential-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../housing-management-kit
 *   - ../student-records-kit
 *   - ../student-billing-kit
 *   - ../student-communication-kit
 *   - ../compliance-reporting-kit
 *
 * DOWNSTREAM (imported by):
 *   - Housing assignment controllers
 *   - Residential life services
 *   - Facility management modules
 *   - Room selection systems
 *   - Roommate matching services
 */
import { Sequelize } from 'sequelize';
import { HousingAssignmentData, MaintenanceRequestData, MoveInOutData } from '../housing-management-kit';
/**
 * Housing application status
 */
export type ApplicationStatus = 'pending' | 'approved' | 'denied' | 'waitlisted' | 'withdrawn';
/**
 * Roommate compatibility score
 */
export type CompatibilityLevel = 'excellent' | 'good' | 'fair' | 'poor';
/**
 * Inspection status
 */
export type InspectionStatus = 'passed' | 'failed' | 'pending' | 'scheduled';
/**
 * Residence hall type
 */
export type HallType = 'traditional' | 'suite' | 'apartment' | 'special_interest';
/**
 * Housing application with preferences
 */
export interface HousingApplicationData {
    studentId: string;
    academicYear: string;
    term: string;
    applicationType: 'new' | 'returning' | 'transfer';
    housingPreferences: {
        dormitoryPreferences?: string[];
        roomTypePreferences?: string[];
        floorPreferences?: number[];
        genderPreference?: 'male' | 'female' | 'coed' | 'gender_inclusive';
        specialAccommodations?: string[];
        lifestylePreferences?: Record<string, any>;
    };
    requestedRoommates?: string[];
    specialNeeds?: string[];
    applicationDate: Date;
    status: ApplicationStatus;
    priorityPoints?: number;
}
/**
 * Roommate matching profile
 */
export interface RoommateProfileData {
    studentId: string;
    profileData: {
        sleepSchedule: 'early_bird' | 'night_owl' | 'flexible';
        cleanliness: 1 | 2 | 3 | 4 | 5;
        studyHabits: 'quiet' | 'music' | 'group_study';
        socialLevel: 1 | 2 | 3 | 4 | 5;
        guestPolicy: 'frequent' | 'occasional' | 'rare';
        temperature: 'cool' | 'moderate' | 'warm';
        smoking: boolean;
        pets: boolean;
        interests?: string[];
        major?: string;
    };
    matchScore?: number;
    compatibilityLevel?: CompatibilityLevel;
}
/**
 * Room condition inspection
 */
export interface RoomInspectionData {
    assignmentId: string;
    roomId: string;
    inspectionType: 'move_in' | 'move_out' | 'routine' | 'special';
    inspectionDate: Date;
    inspectedBy: string;
    condition: {
        walls: InspectionStatus;
        floors: InspectionStatus;
        ceiling: InspectionStatus;
        windows: InspectionStatus;
        furniture: InspectionStatus;
        fixtures: InspectionStatus;
    };
    damagesFound?: Array<{
        item: string;
        description: string;
        severity: 'minor' | 'moderate' | 'major';
        estimatedCost?: number;
    }>;
    photos?: string[];
    notes?: string;
    overallStatus: InspectionStatus;
}
/**
 * Residential conduct incident
 */
export interface ConductIncidentData {
    studentId: string;
    assignmentId: string;
    incidentDate: Date;
    incidentType: 'noise' | 'guests' | 'cleanliness' | 'damage' | 'policy_violation' | 'other';
    severity: 'minor' | 'moderate' | 'major' | 'critical';
    description: string;
    reportedBy: string;
    witnesses?: string[];
    actionTaken?: string;
    status: 'reported' | 'under_review' | 'resolved' | 'escalated';
    resolutionDate?: Date;
}
/**
 * Community programming event
 */
export interface CommunityEventData {
    dormitoryId: string;
    eventName: string;
    eventType: 'social' | 'educational' | 'wellness' | 'diversity' | 'community_service';
    eventDate: Date;
    location: string;
    capacity?: number;
    registeredCount?: number;
    coordinatorId: string;
    description?: string;
    isRequired: boolean;
}
/**
 * Facility amenity reservation
 */
export interface AmenityReservationData {
    dormitoryId: string;
    amenityType: 'study_room' | 'lounge' | 'kitchen' | 'laundry' | 'gym' | 'other';
    reservedBy: string;
    reservationDate: Date;
    startTime: string;
    endTime: string;
    purpose?: string;
    status: 'reserved' | 'confirmed' | 'cancelled' | 'completed';
}
/**
 * Housing payment schedule
 */
export interface HousingPaymentData {
    contractId: string;
    studentId: string;
    totalAmount: number;
    paymentSchedule: Array<{
        installmentNumber: number;
        dueDate: Date;
        amount: number;
        status: 'pending' | 'paid' | 'overdue' | 'waived';
        paidDate?: Date;
        paymentMethod?: string;
    }>;
}
/**
 * Occupancy analytics
 */
export interface OccupancyAnalytics {
    dormitoryId?: string;
    academicYear: string;
    term: string;
    totalCapacity: number;
    occupied: number;
    available: number;
    occupancyRate: number;
    waitlistCount: number;
    byRoomType: Record<string, number>;
    byGender: Record<string, number>;
    byClassYear: Record<string, number>;
}
/**
 * Room swap request
 */
export interface RoomSwapData {
    requestingStudentId: string;
    currentAssignmentId: string;
    targetStudentId?: string;
    targetRoomId?: string;
    reason: string;
    requestDate: Date;
    status: 'pending' | 'approved' | 'denied' | 'completed';
    approvedBy?: string;
    approvalDate?: Date;
}
/**
 * Sequelize model for Housing Applications with preferences.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     HousingApplication:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         studentId:
 *           type: string
 *         academicYear:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, approved, denied, waitlisted, withdrawn]
 */
export declare const createHousingApplicationModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        academicYear: string;
        term: string;
        applicationType: string;
        housingPreferences: Record<string, any>;
        requestedRoommates: string[];
        specialNeeds: string[];
        applicationDate: Date;
        status: ApplicationStatus;
        priorityPoints: number;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Room Inspections with damage tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     RoomInspection:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         roomId:
 *           type: string
 *         inspectionType:
 *           type: string
 *         overallStatus:
 *           type: string
 */
export declare const createRoomInspectionModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        assignmentId: string;
        roomId: string;
        inspectionType: string;
        inspectionDate: Date;
        inspectedBy: string;
        condition: Record<string, InspectionStatus>;
        damagesFound: any[];
        photos: string[];
        notes: string | null;
        overallStatus: InspectionStatus;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Housing & Residential Life Composite Service
 *
 * Provides comprehensive housing operations, residential life programming,
 * and facility management for higher education institutions.
 */
export declare class HousingResidentialCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Submits housing application with preferences.
     *
     * @param {HousingApplicationData} applicationData - Application data
     * @returns {Promise<any>} Created application
     *
     * @example
     * ```typescript
     * const application = await service.submitHousingApplication({
     *   studentId: 'stu-123',
     *   academicYear: '2024-2025',
     *   term: 'Fall',
     *   applicationType: 'new',
     *   housingPreferences: {
     *     dormitoryPreferences: ['Smith Hall', 'Johnson Hall'],
     *     roomTypePreferences: ['double', 'single'],
     *     genderPreference: 'coed'
     *   },
     *   applicationDate: new Date(),
     *   status: 'pending'
     * });
     * ```
     */
    submitHousingApplication(applicationData: HousingApplicationData): Promise<any>;
    /**
     * 2. Processes housing application approval workflow.
     *
     * @param {string} applicationId - Application ID
     * @param {string} approvedBy - Approver ID
     * @returns {Promise<any>} Approved application
     *
     * @example
     * ```typescript
     * const approved = await service.approveHousingApplication('app-123', 'admin-456');
     * ```
     */
    approveHousingApplication(applicationId: string, approvedBy: string): Promise<any>;
    /**
     * 3. Manages housing waitlist by priority.
     *
     * @param {string} academicYear - Academic year
     * @param {string} term - Term
     * @returns {Promise<any[]>} Waitlisted applications by priority
     *
     * @example
     * ```typescript
     * const waitlist = await service.manageHousingWaitlist('2024-2025', 'Fall');
     * console.log(`${waitlist.length} students on waitlist`);
     * ```
     */
    manageHousingWaitlist(academicYear: string, term: string): Promise<any[]>;
    /**
     * 4. Calculates housing priority points.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<number>} Priority points
     *
     * @example
     * ```typescript
     * const points = await service.calculateHousingPriority('stu-123');
     * console.log(`Priority points: ${points}`);
     * ```
     */
    calculateHousingPriority(studentId: string): Promise<number>;
    /**
     * 5. Updates housing preferences.
     *
     * @param {string} applicationId - Application ID
     * @param {any} preferences - Updated preferences
     * @returns {Promise<any>} Updated application
     *
     * @example
     * ```typescript
     * await service.updateHousingPreferences('app-123', {
     *   roomTypePreferences: ['single'],
     *   floorPreferences: [3, 4, 5]
     * });
     * ```
     */
    updateHousingPreferences(applicationId: string, preferences: any): Promise<any>;
    /**
     * 6. Validates special accommodation requests.
     *
     * @param {string} applicationId - Application ID
     * @returns {Promise<any>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateSpecialAccommodations('app-123');
     * if (validation.requiresDocumentation) {
     *   console.log('Documentation required:', validation.requiredDocs);
     * }
     * ```
     */
    validateSpecialAccommodations(applicationId: string): Promise<any>;
    /**
     * 7. Processes application withdrawals.
     *
     * @param {string} applicationId - Application ID
     * @param {string} reason - Withdrawal reason
     * @returns {Promise<any>} Withdrawn application
     *
     * @example
     * ```typescript
     * await service.withdrawHousingApplication('app-123', 'Living off-campus');
     * ```
     */
    withdrawHousingApplication(applicationId: string, reason: string): Promise<any>;
    /**
     * 8. Generates housing application statistics.
     *
     * @param {string} academicYear - Academic year
     * @param {string} term - Term
     * @returns {Promise<any>} Application statistics
     *
     * @example
     * ```typescript
     * const stats = await service.getApplicationStatistics('2024-2025', 'Fall');
     * console.log(`Total applications: ${stats.total}`);
     * ```
     */
    getApplicationStatistics(academicYear: string, term: string): Promise<any>;
    /**
     * 9. Assigns room to student.
     *
     * @param {HousingAssignmentData} assignmentData - Assignment data
     * @returns {Promise<any>} Created assignment
     *
     * @example
     * ```typescript
     * const assignment = await service.assignRoomToStudent({
     *   studentId: 'stu-123',
     *   dormitoryId: 'dorm-abc',
     *   roomId: 'room-305',
     *   academicYear: '2024-2025',
     *   term: 'full_year',
     *   checkInDate: new Date('2024-08-15'),
     *   checkOutDate: new Date('2025-05-15'),
     *   assignmentType: 'assigned',
     *   status: 'confirmed'
     * });
     * ```
     */
    assignRoomToStudent(assignmentData: HousingAssignmentData): Promise<any>;
    /**
     * 10. Manages room selection lottery process.
     *
     * @param {string} academicYear - Academic year
     * @param {string} term - Term
     * @returns {Promise<any>} Lottery results
     *
     * @example
     * ```typescript
     * const lottery = await service.processRoomSelectionLottery('2024-2025', 'Fall');
     * console.log(`${lottery.participants} students participated`);
     * ```
     */
    processRoomSelectionLottery(academicYear: string, term: string): Promise<any>;
    /**
     * 11. Processes room swap requests.
     *
     * @param {RoomSwapData} swapData - Swap request data
     * @returns {Promise<any>} Swap request
     *
     * @example
     * ```typescript
     * const swap = await service.requestRoomSwap({
     *   requestingStudentId: 'stu-123',
     *   currentAssignmentId: 'assign-abc',
     *   targetStudentId: 'stu-456',
     *   reason: 'Closer to classes',
     *   requestDate: new Date(),
     *   status: 'pending'
     * });
     * ```
     */
    requestRoomSwap(swapData: RoomSwapData): Promise<any>;
    /**
     * 12. Checks room availability by criteria.
     *
     * @param {any} criteria - Search criteria
     * @returns {Promise<any[]>} Available rooms
     *
     * @example
     * ```typescript
     * const rooms = await service.checkRoomAvailability({
     *   dormitoryId: 'dorm-abc',
     *   roomType: 'double',
     *   gender: 'coed',
     *   academicYear: '2024-2025'
     * });
     * ```
     */
    checkRoomAvailability(criteria: any): Promise<any[]>;
    /**
     * 13. Assigns roommates based on compatibility.
     *
     * @param {string} roomId - Room ID
     * @param {string[]} studentIds - Student IDs
     * @returns {Promise<any>} Roommate assignments
     *
     * @example
     * ```typescript
     * await service.assignRoommates('room-305', ['stu-123', 'stu-456']);
     * ```
     */
    assignRoommates(roomId: string, studentIds: string[]): Promise<any>;
    /**
     * 14. Validates room assignment eligibility.
     *
     * @param {string} studentId - Student ID
     * @param {string} roomId - Room ID
     * @returns {Promise<any>} Eligibility validation
     *
     * @example
     * ```typescript
     * const eligible = await service.validateRoomAssignmentEligibility('stu-123', 'room-305');
     * if (!eligible.isEligible) {
     *   console.log('Reasons:', eligible.reasons);
     * }
     * ```
     */
    validateRoomAssignmentEligibility(studentId: string, roomId: string): Promise<any>;
    /**
     * 15. Creates roommate preference profile.
     *
     * @param {RoommateProfileData} profileData - Profile data
     * @returns {Promise<any>} Created profile
     *
     * @example
     * ```typescript
     * const profile = await service.createRoommateProfile({
     *   studentId: 'stu-123',
     *   profileData: {
     *     sleepSchedule: 'night_owl',
     *     cleanliness: 4,
     *     studyHabits: 'quiet',
     *     socialLevel: 3,
     *     guestPolicy: 'occasional',
     *     temperature: 'cool',
     *     smoking: false,
     *     pets: false
     *   }
     * });
     * ```
     */
    createRoommateProfile(profileData: RoommateProfileData): Promise<any>;
    /**
     * 16. Calculates roommate compatibility scores.
     *
     * @param {string} studentId1 - First student ID
     * @param {string} studentId2 - Second student ID
     * @returns {Promise<any>} Compatibility analysis
     *
     * @example
     * ```typescript
     * const match = await service.calculateRoommateCompatibility('stu-123', 'stu-456');
     * console.log(`Compatibility: ${match.score}%, Level: ${match.level}`);
     * ```
     */
    calculateRoommateCompatibility(studentId1: string, studentId2: string): Promise<any>;
    /**
     * 17. Searches for compatible roommate matches.
     *
     * @param {string} studentId - Student ID
     * @param {number} minScore - Minimum compatibility score
     * @returns {Promise<any[]>} Compatible matches
     *
     * @example
     * ```typescript
     * const matches = await service.findRoommateMatches('stu-123', 75);
     * console.log(`Found ${matches.length} compatible matches`);
     * ```
     */
    findRoommateMatches(studentId: string, minScore?: number): Promise<any[]>;
    /**
     * 18. Processes mutual roommate requests.
     *
     * @param {string} studentId1 - First student ID
     * @param {string} studentId2 - Second student ID
     * @returns {Promise<any>} Mutual request validation
     *
     * @example
     * ```typescript
     * const mutual = await service.processMutualRoommateRequest('stu-123', 'stu-456');
     * if (mutual.isMutual) {
     *   console.log('Mutual match confirmed!');
     * }
     * ```
     */
    processMutualRoommateRequest(studentId1: string, studentId2: string): Promise<any>;
    /**
     * 19. Manages roommate conflict resolution.
     *
     * @param {string} assignmentId - Assignment ID
     * @param {any} conflictData - Conflict details
     * @returns {Promise<any>} Conflict resolution record
     *
     * @example
     * ```typescript
     * await service.reportRoommateConflict('assign-123', {
     *   reportedBy: 'stu-123',
     *   conflictType: 'noise',
     *   description: 'Excessive noise late at night',
     *   severity: 'moderate'
     * });
     * ```
     */
    reportRoommateConflict(assignmentId: string, conflictData: any): Promise<any>;
    /**
     * 20. Generates roommate matching report.
     *
     * @param {string} academicYear - Academic year
     * @param {string} term - Term
     * @returns {Promise<any>} Matching report
     *
     * @example
     * ```typescript
     * const report = await service.generateRoommateMatchingReport('2024-2025', 'Fall');
     * console.log(`Average compatibility: ${report.averageCompatibility}%`);
     * ```
     */
    generateRoommateMatchingReport(academicYear: string, term: string): Promise<any>;
    /**
     * 21. Submits maintenance request.
     *
     * @param {MaintenanceRequestData} requestData - Request data
     * @returns {Promise<any>} Created maintenance request
     *
     * @example
     * ```typescript
     * const request = await service.submitMaintenanceRequest({
     *   dormitoryId: 'dorm-abc',
     *   roomId: 'room-305',
     *   requestedBy: 'stu-123',
     *   category: 'plumbing',
     *   priority: 'high',
     *   description: 'Leaking faucet in bathroom',
     *   requestedAt: new Date(),
     *   status: 'submitted'
     * });
     * ```
     */
    submitMaintenanceRequest(requestData: MaintenanceRequestData): Promise<any>;
    /**
     * 22. Tracks maintenance request status.
     *
     * @param {string} requestId - Request ID
     * @returns {Promise<any>} Request status
     *
     * @example
     * ```typescript
     * const status = await service.trackMaintenanceStatus('maint-123');
     * console.log(`Status: ${status.current}, Assigned to: ${status.assignedTo}`);
     * ```
     */
    trackMaintenanceStatus(requestId: string): Promise<any>;
    /**
     * 23. Schedules facility inspections.
     *
     * @param {string} dormitoryId - Dormitory ID
     * @param {Date} inspectionDate - Inspection date
     * @returns {Promise<any>} Scheduled inspection
     *
     * @example
     * ```typescript
     * await service.scheduleFacilityInspection('dorm-abc', new Date('2024-10-15'));
     * ```
     */
    scheduleFacilityInspection(dormitoryId: string, inspectionDate: Date): Promise<any>;
    /**
     * 24. Manages amenity reservations.
     *
     * @param {AmenityReservationData} reservationData - Reservation data
     * @returns {Promise<any>} Created reservation
     *
     * @example
     * ```typescript
     * const reservation = await service.reserveAmenity({
     *   dormitoryId: 'dorm-abc',
     *   amenityType: 'study_room',
     *   reservedBy: 'stu-123',
     *   reservationDate: new Date('2024-10-15'),
     *   startTime: '14:00',
     *   endTime: '16:00',
     *   status: 'reserved'
     * });
     * ```
     */
    reserveAmenity(reservationData: AmenityReservationData): Promise<any>;
    /**
     * 25. Tracks facility utilization metrics.
     *
     * @param {string} dormitoryId - Dormitory ID
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<any>} Utilization metrics
     *
     * @example
     * ```typescript
     * const metrics = await service.trackFacilityUtilization(
     *   'dorm-abc',
     *   new Date('2024-09-01'),
     *   new Date('2024-09-30')
     * );
     * ```
     */
    trackFacilityUtilization(dormitoryId: string, startDate: Date, endDate: Date): Promise<any>;
    /**
     * 26. Generates facility condition report.
     *
     * @param {string} dormitoryId - Dormitory ID
     * @returns {Promise<any>} Condition report
     *
     * @example
     * ```typescript
     * const report = await service.generateFacilityConditionReport('dorm-abc');
     * ```
     */
    generateFacilityConditionReport(dormitoryId: string): Promise<any>;
    /**
     * 27. Schedules student move-in appointment.
     *
     * @param {MoveInOutData} moveInData - Move-in data
     * @returns {Promise<any>} Scheduled move-in
     *
     * @example
     * ```typescript
     * const moveIn = await service.scheduleMoveIn({
     *   assignmentId: 'assign-123',
     *   eventType: 'move_in',
     *   scheduledDate: new Date('2024-08-15'),
     *   scheduledTimeSlot: '10:00-12:00',
     *   status: 'scheduled'
     * });
     * ```
     */
    scheduleMoveIn(moveInData: MoveInOutData): Promise<any>;
    /**
     * 28. Conducts room condition inspection.
     *
     * @param {RoomInspectionData} inspectionData - Inspection data
     * @returns {Promise<any>} Inspection record
     *
     * @example
     * ```typescript
     * const inspection = await service.conductRoomInspection({
     *   assignmentId: 'assign-123',
     *   roomId: 'room-305',
     *   inspectionType: 'move_in',
     *   inspectionDate: new Date(),
     *   inspectedBy: 'staff-789',
     *   condition: {
     *     walls: 'passed',
     *     floors: 'passed',
     *     ceiling: 'passed',
     *     windows: 'passed',
     *     furniture: 'passed',
     *     fixtures: 'passed'
     *   },
     *   overallStatus: 'passed'
     * });
     * ```
     */
    conductRoomInspection(inspectionData: RoomInspectionData): Promise<any>;
    /**
     * 29. Processes key distribution.
     *
     * @param {string} assignmentId - Assignment ID
     * @param {any} keyData - Key distribution data
     * @returns {Promise<any>} Key distribution record
     *
     * @example
     * ```typescript
     * await service.distributeRoomKeys('assign-123', {
     *   keyNumber: 'K-305A',
     *   issuedDate: new Date(),
     *   issuedBy: 'staff-789'
     * });
     * ```
     */
    distributeRoomKeys(assignmentId: string, keyData: any): Promise<any>;
    /**
     * 30. Schedules move-out and checkout.
     *
     * @param {MoveInOutData} moveOutData - Move-out data
     * @returns {Promise<any>} Scheduled move-out
     *
     * @example
     * ```typescript
     * const moveOut = await service.scheduleMoveOut({
     *   assignmentId: 'assign-123',
     *   eventType: 'move_out',
     *   scheduledDate: new Date('2025-05-15'),
     *   status: 'scheduled'
     * });
     * ```
     */
    scheduleMoveOut(moveOutData: MoveInOutData): Promise<any>;
    /**
     * 31. Processes damage assessments and charges.
     *
     * @param {string} inspectionId - Inspection ID
     * @returns {Promise<any>} Damage assessment
     *
     * @example
     * ```typescript
     * const assessment = await service.assessRoomDamages('insp-123');
     * console.log(`Total charges: $${assessment.totalCharges}`);
     * ```
     */
    assessRoomDamages(inspectionId: string): Promise<any>;
    /**
     * 32. Completes checkout process.
     *
     * @param {string} assignmentId - Assignment ID
     * @returns {Promise<any>} Checkout completion
     *
     * @example
     * ```typescript
     * await service.completeCheckout('assign-123');
     * ```
     */
    completeCheckout(assignmentId: string): Promise<any>;
    /**
     * 33. Creates community programming event.
     *
     * @param {CommunityEventData} eventData - Event data
     * @returns {Promise<any>} Created event
     *
     * @example
     * ```typescript
     * const event = await service.createCommunityEvent({
     *   dormitoryId: 'dorm-abc',
     *   eventName: 'Fall Welcome BBQ',
     *   eventType: 'social',
     *   eventDate: new Date('2024-09-01'),
     *   location: 'Courtyard',
     *   capacity: 100,
     *   coordinatorId: 'staff-789',
     *   isRequired: false
     * });
     * ```
     */
    createCommunityEvent(eventData: CommunityEventData): Promise<any>;
    /**
     * 34. Tracks residential conduct incidents.
     *
     * @param {ConductIncidentData} incidentData - Incident data
     * @returns {Promise<any>} Incident record
     *
     * @example
     * ```typescript
     * await service.reportConductIncident({
     *   studentId: 'stu-123',
     *   assignmentId: 'assign-123',
     *   incidentDate: new Date(),
     *   incidentType: 'noise',
     *   severity: 'minor',
     *   description: 'Loud music after quiet hours',
     *   reportedBy: 'ra-456',
     *   status: 'reported'
     * });
     * ```
     */
    reportConductIncident(incidentData: ConductIncidentData): Promise<any>;
    /**
     * 35. Generates occupancy analytics.
     *
     * @param {string} academicYear - Academic year
     * @param {string} term - Term
     * @returns {Promise<OccupancyAnalytics>} Occupancy analytics
     *
     * @example
     * ```typescript
     * const analytics = await service.generateOccupancyAnalytics('2024-2025', 'Fall');
     * console.log(`Occupancy rate: ${analytics.occupancyRate}%`);
     * ```
     */
    generateOccupancyAnalytics(academicYear: string, term: string): Promise<OccupancyAnalytics>;
    /**
     * 36. Processes housing payment plans.
     *
     * @param {HousingPaymentData} paymentData - Payment plan data
     * @returns {Promise<any>} Payment plan
     *
     * @example
     * ```typescript
     * const plan = await service.createHousingPaymentPlan({
     *   contractId: 'contract-123',
     *   studentId: 'stu-123',
     *   totalAmount: 8000,
     *   paymentSchedule: [
     *     { installmentNumber: 1, dueDate: new Date('2024-08-01'), amount: 4000, status: 'pending' },
     *     { installmentNumber: 2, dueDate: new Date('2025-01-01'), amount: 4000, status: 'pending' }
     *   ]
     * });
     * ```
     */
    createHousingPaymentPlan(paymentData: HousingPaymentData): Promise<any>;
    /**
     * 37. Tracks housing contract compliance.
     *
     * @param {string} contractId - Contract ID
     * @returns {Promise<any>} Compliance status
     *
     * @example
     * ```typescript
     * const compliance = await service.trackContractCompliance('contract-123');
     * ```
     */
    trackContractCompliance(contractId: string): Promise<any>;
    /**
     * 38. Generates housing utilization report.
     *
     * @param {string} academicYear - Academic year
     * @returns {Promise<any>} Utilization report
     *
     * @example
     * ```typescript
     * const report = await service.generateHousingUtilizationReport('2024-2025');
     * ```
     */
    generateHousingUtilizationReport(academicYear: string): Promise<any>;
    /**
     * 39. Validates housing policy compliance.
     *
     * @param {string} assignmentId - Assignment ID
     * @returns {Promise<any>} Policy compliance validation
     *
     * @example
     * ```typescript
     * const validation = await service.validateHousingPolicyCompliance('assign-123');
     * ```
     */
    validateHousingPolicyCompliance(assignmentId: string): Promise<any>;
    /**
     * 40. Generates comprehensive residential life dashboard.
     *
     * @param {string} dormitoryId - Dormitory ID
     * @returns {Promise<any>} Dashboard data
     *
     * @example
     * ```typescript
     * const dashboard = await service.generateResidentialDashboard('dorm-abc');
     * console.log(`Current occupancy: ${dashboard.currentOccupancy}`);
     * ```
     */
    generateResidentialDashboard(dormitoryId: string): Promise<any>;
}
export default HousingResidentialCompositeService;
//# sourceMappingURL=housing-residential-composite.d.ts.map