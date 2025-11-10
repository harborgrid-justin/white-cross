/**
 * LOC: EDU-HOUSING-001
 * File: /reuse/education/housing-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable education utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend housing services
 *   - Room assignment modules
 *   - Roommate matching systems
 *   - Facility management services
 */
/**
 * File: /reuse/education/housing-management-kit.ts
 * Locator: WC-EDU-HOUSING-001
 * Purpose: Enterprise-grade Housing Management - assignments, room selection, roommate matching, contracts, move-in/out
 *
 * Upstream: Independent utility module for housing operations
 * Downstream: ../backend/education/*, housing controllers, assignment services, facility managers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 40+ functions for housing management competing with StarRez, Adirondack Solutions
 *
 * LLM Context: Comprehensive housing management utilities for production-ready education applications.
 * Provides housing applications, room assignments, roommate matching, facility management,
 * contract processing, payment tracking, maintenance requests, move-in/move-out coordination,
 * occupancy analytics, and compliance reporting.
 */
import { Sequelize, Transaction } from 'sequelize';
interface DormitoryData {
    buildingName: string;
    buildingCode: string;
    address: Record<string, any>;
    buildingType: 'traditional' | 'suite' | 'apartment';
    gender: 'male' | 'female' | 'coed';
    totalFloors: number;
    totalRooms: number;
    totalCapacity: number;
    amenities?: string[];
    isActive?: boolean;
    openedYear?: number;
}
interface RoomData {
    dormitoryId: string;
    roomNumber: string;
    floor: number;
    roomType: 'single' | 'double' | 'triple' | 'quad' | 'suite';
    capacity: number;
    squareFootage?: number;
    hasPrivateBathroom?: boolean;
    isAccessible?: boolean;
    amenities?: string[];
    baseRate?: number;
    isAvailable?: boolean;
}
interface HousingAssignmentData {
    studentId: string;
    dormitoryId: string;
    roomId: string;
    academicYear: string;
    term: 'fall' | 'spring' | 'summer' | 'full_year';
    checkInDate: Date;
    checkOutDate: Date;
    assignmentType: 'assigned' | 'self_selected' | 'lottery';
    status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
    specialAccommodations?: string[];
}
interface RoomSelectionData {
    studentId: string;
    academicYear: string;
    term: string;
    preferences: {
        buildingPreferences?: string[];
        roomTypePreferences?: string[];
        floorPreferences?: number[];
        amenityPreferences?: string[];
    };
    selectionPriority?: number;
    selectionTimeSlot?: Date;
    selectedRoomId?: string;
    selectionStatus: 'pending' | 'time_assigned' | 'completed' | 'expired';
}
interface RoommateMatchData {
    studentId: string;
    academicYear: string;
    matchPreferences: {
        sleepSchedule?: 'early' | 'moderate' | 'late';
        cleanliness?: 'very_clean' | 'clean' | 'moderate';
        studyHabits?: 'quiet' | 'moderate' | 'social';
        guestFrequency?: 'never' | 'occasionally' | 'frequently';
        temperature?: 'cool' | 'moderate' | 'warm';
    };
    requestedRoommates?: string[];
    blockedRoommates?: string[];
    matchScore?: number;
}
interface HousingContractData {
    studentId: string;
    assignmentId: string;
    contractType: 'academic_year' | 'semester' | 'summer';
    contractStartDate: Date;
    contractEndDate: Date;
    totalAmount: number;
    paymentSchedule: 'full' | 'semester' | 'monthly';
    signedAt?: Date;
    signedBy?: string;
    status: 'draft' | 'pending_signature' | 'active' | 'completed' | 'terminated';
    terms?: string;
}
interface MaintenanceRequestData {
    dormitoryId: string;
    roomId?: string;
    requestedBy: string;
    category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'other';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    description: string;
    requestedAt: Date;
    assignedTo?: string;
    status: 'submitted' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
    completedAt?: Date;
}
interface MoveInOutData {
    assignmentId: string;
    eventType: 'move_in' | 'move_out';
    scheduledDate: Date;
    scheduledTimeSlot?: string;
    completedAt?: Date;
    conditionReport?: Record<string, any>;
    inspectedBy?: string;
    damages?: any[];
    keys?: {
        issued?: Date;
        returned?: Date;
    };
    status: 'scheduled' | 'in_progress' | 'completed' | 'missed';
}
interface OccupancyData {
    dormitoryId: string;
    academicYear: string;
    term: string;
    totalRooms: number;
    occupiedRooms: number;
    totalBeds: number;
    occupiedBeds: number;
    occupancyRate: number;
}
/**
 * Sequelize model for Dormitories with capacity and amenities.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     Dormitory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         buildingName:
 *           type: string
 *         buildingCode:
 *           type: string
 *         totalCapacity:
 *           type: number
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Dormitory model
 *
 * @example
 * ```typescript
 * const Dormitory = createDormitoryModel(sequelize);
 * const dorm = await Dormitory.create({
 *   buildingName: 'Smith Hall',
 *   buildingCode: 'SMH',
 *   buildingType: 'traditional',
 *   gender: 'coed',
 *   totalFloors: 5,
 *   totalRooms: 120,
 *   totalCapacity: 240
 * });
 * ```
 */
export declare const createDormitoryModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        buildingName: string;
        buildingCode: string;
        address: Record<string, any>;
        buildingType: string;
        gender: string;
        totalFloors: number;
        totalRooms: number;
        totalCapacity: number;
        amenities: string[];
        isActive: boolean;
        openedYear: number | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Rooms with layout and pricing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Room model
 */
export declare const createRoomModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        dormitoryId: string;
        roomNumber: string;
        floor: number;
        roomType: string;
        capacity: number;
        squareFootage: number | null;
        hasPrivateBathroom: boolean;
        isAccessible: boolean;
        amenities: string[];
        baseRate: number;
        isAvailable: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Housing Assignments with check-in/out tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} HousingAssignment model
 */
export declare const createHousingAssignmentModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        dormitoryId: string;
        roomId: string;
        academicYear: string;
        term: string;
        checkInDate: Date;
        checkOutDate: Date;
        assignmentType: string;
        status: string;
        specialAccommodations: string[];
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Roommate Matching with preferences.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RoommateMatch model
 */
export declare const createRoommateMatchModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        academicYear: string;
        matchPreferences: Record<string, any>;
        requestedRoommates: string[];
        blockedRoommates: string[];
        matchScore: number | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new dormitory building.
 *
 * @param {DormitoryData} dormitoryData - Dormitory data
 * @param {Model} Dormitory - Dormitory model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created dormitory
 *
 * @example
 * ```typescript
 * const dorm = await createDormitory({
 *   buildingName: 'Smith Hall',
 *   buildingCode: 'SMH',
 *   buildingType: 'traditional',
 *   gender: 'coed',
 *   totalFloors: 5,
 *   totalRooms: 120,
 *   totalCapacity: 240
 * }, Dormitory);
 * ```
 */
export declare const createDormitory: (dormitoryData: DormitoryData, Dormitory: any, transaction?: Transaction) => Promise<any>;
/**
 * Creates rooms in a dormitory.
 *
 * @param {string} dormitoryId - Dormitory ID
 * @param {RoomData[]} rooms - Room data array
 * @param {Model} Room - Room model
 * @returns {Promise<any[]>} Created rooms
 *
 * @example
 * ```typescript
 * const rooms = await createRooms('dorm123', [
 *   { roomNumber: '101', floor: 1, roomType: 'double', capacity: 2 },
 *   { roomNumber: '102', floor: 1, roomType: 'single', capacity: 1 }
 * ], Room);
 * ```
 */
export declare const createRooms: (dormitoryId: string, rooms: Partial<RoomData>[], Room: any) => Promise<any[]>;
/**
 * Updates dormitory information.
 *
 * @param {string} dormitoryId - Dormitory ID
 * @param {Partial<DormitoryData>} updates - Updates
 * @param {Model} Dormitory - Dormitory model
 * @returns {Promise<any>} Updated dormitory
 *
 * @example
 * ```typescript
 * await updateDormitory('dorm123', { amenities: ['wifi', 'laundry', 'lounge'] }, Dormitory);
 * ```
 */
export declare const updateDormitory: (dormitoryId: string, updates: Partial<DormitoryData>, Dormitory: any) => Promise<any>;
/**
 * Updates room availability and pricing.
 *
 * @param {string} roomId - Room ID
 * @param {Partial<RoomData>} updates - Updates
 * @param {Model} Room - Room model
 * @returns {Promise<any>} Updated room
 *
 * @example
 * ```typescript
 * await updateRoom('room456', { baseRate: 5500, isAvailable: false }, Room);
 * ```
 */
export declare const updateRoom: (roomId: string, updates: Partial<RoomData>, Room: any) => Promise<any>;
/**
 * Retrieves available rooms by criteria.
 *
 * @param {any} criteria - Search criteria
 * @param {Model} Room - Room model
 * @returns {Promise<any[]>} Available rooms
 *
 * @example
 * ```typescript
 * const rooms = await getAvailableRooms({ roomType: 'double', floor: 2 }, Room);
 * ```
 */
export declare const getAvailableRooms: (criteria: any, Room: any) => Promise<any[]>;
/**
 * Creates a housing assignment.
 *
 * @param {HousingAssignmentData} assignmentData - Assignment data
 * @param {Model} HousingAssignment - HousingAssignment model
 * @param {Model} Room - Room model
 * @returns {Promise<any>} Created assignment
 *
 * @example
 * ```typescript
 * const assignment = await createHousingAssignment({
 *   studentId: 'STU12345',
 *   dormitoryId: 'dorm123',
 *   roomId: 'room456',
 *   academicYear: '2024-2025',
 *   term: 'fall',
 *   checkInDate: new Date('2024-08-15'),
 *   checkOutDate: new Date('2024-12-15'),
 *   assignmentType: 'self_selected',
 *   status: 'pending'
 * }, HousingAssignment, Room);
 * ```
 */
export declare const createHousingAssignment: (assignmentData: HousingAssignmentData, HousingAssignment: any, Room: any) => Promise<any>;
/**
 * Updates housing assignment status.
 *
 * @param {string} assignmentId - Assignment ID
 * @param {string} newStatus - New status
 * @param {Model} HousingAssignment - HousingAssignment model
 * @returns {Promise<any>} Updated assignment
 *
 * @example
 * ```typescript
 * await updateAssignmentStatus('assign123', 'confirmed', HousingAssignment);
 * ```
 */
export declare const updateAssignmentStatus: (assignmentId: string, newStatus: string, HousingAssignment: any) => Promise<any>;
/**
 * Cancels housing assignment.
 *
 * @param {string} assignmentId - Assignment ID
 * @param {string} reason - Cancellation reason
 * @param {Model} HousingAssignment - HousingAssignment model
 * @param {Model} Room - Room model
 * @returns {Promise<any>} Cancelled assignment
 *
 * @example
 * ```typescript
 * await cancelHousingAssignment('assign123', 'Study abroad', HousingAssignment, Room);
 * ```
 */
export declare const cancelHousingAssignment: (assignmentId: string, reason: string, HousingAssignment: any, Room: any) => Promise<any>;
/**
 * Transfers student to different room.
 *
 * @param {string} assignmentId - Current assignment ID
 * @param {string} newRoomId - New room ID
 * @param {string} reason - Transfer reason
 * @param {Model} HousingAssignment - HousingAssignment model
 * @param {Model} Room - Room model
 * @returns {Promise<any>} New assignment
 *
 * @example
 * ```typescript
 * await transferRoom('assign123', 'room789', 'Roommate conflict', HousingAssignment, Room);
 * ```
 */
export declare const transferRoom: (assignmentId: string, newRoomId: string, reason: string, HousingAssignment: any, Room: any) => Promise<any>;
/**
 * Retrieves housing assignments for student.
 *
 * @param {string} studentId - Student ID
 * @param {Model} HousingAssignment - HousingAssignment model
 * @returns {Promise<any[]>} Student assignments
 *
 * @example
 * ```typescript
 * const assignments = await getStudentAssignments('STU12345', HousingAssignment);
 * ```
 */
export declare const getStudentAssignments: (studentId: string, HousingAssignment: any) => Promise<any[]>;
/**
 * Retrieves current roommates for student.
 *
 * @param {string} studentId - Student ID
 * @param {string} academicYear - Academic year
 * @param {Model} HousingAssignment - HousingAssignment model
 * @returns {Promise<any[]>} Roommate assignments
 *
 * @example
 * ```typescript
 * const roommates = await getCurrentRoommates('STU12345', '2024-2025', HousingAssignment);
 * ```
 */
export declare const getCurrentRoommates: (studentId: string, academicYear: string, HousingAssignment: any) => Promise<any[]>;
/**
 * Bulk assigns students to rooms (lottery).
 *
 * @param {string[]} studentIds - Student IDs
 * @param {string} academicYear - Academic year
 * @param {Model} HousingAssignment - HousingAssignment model
 * @param {Model} Room - Room model
 * @returns {Promise<any[]>} Created assignments
 *
 * @example
 * ```typescript
 * const assignments = await bulkAssignRooms(studentIds, '2024-2025', HousingAssignment, Room);
 * ```
 */
export declare const bulkAssignRooms: (studentIds: string[], academicYear: string, HousingAssignment: any, Room: any) => Promise<any[]>;
/**
 * Validates special accommodation requests.
 *
 * @param {string} studentId - Student ID
 * @param {string[]} accommodations - Requested accommodations
 * @returns {Promise<{ approved: boolean; deniedReasons: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateSpecialAccommodations('STU12345', ['wheelchair_accessible', 'service_animal']);
 * ```
 */
export declare const validateSpecialAccommodations: (studentId: string, accommodations: string[]) => Promise<{
    approved: boolean;
    deniedReasons: string[];
}>;
/**
 * Creates room selection record for student.
 *
 * @param {RoomSelectionData} selectionData - Selection data
 * @returns {Promise<RoomSelectionData>} Created selection
 *
 * @example
 * ```typescript
 * const selection = await createRoomSelection({
 *   studentId: 'STU12345',
 *   academicYear: '2024-2025',
 *   term: 'fall',
 *   preferences: {
 *     buildingPreferences: ['SMH', 'JNH'],
 *     roomTypePreferences: ['double', 'single']
 *   },
 *   selectionStatus: 'pending'
 * });
 * ```
 */
export declare const createRoomSelection: (selectionData: RoomSelectionData) => Promise<RoomSelectionData>;
/**
 * Assigns room selection time slots.
 *
 * @param {string} academicYear - Academic year
 * @param {string[]} studentIds - Student IDs (priority ordered)
 * @returns {Promise<RoomSelectionData[]>} Assigned time slots
 *
 * @example
 * ```typescript
 * const slots = await assignSelectionTimeSlots('2024-2025', studentIds);
 * ```
 */
export declare const assignSelectionTimeSlots: (academicYear: string, studentIds: string[]) => Promise<RoomSelectionData[]>;
/**
 * Processes room selection by student.
 *
 * @param {string} studentId - Student ID
 * @param {string} roomId - Selected room ID
 * @param {Model} HousingAssignment - HousingAssignment model
 * @param {Model} Room - Room model
 * @returns {Promise<any>} Created assignment
 *
 * @example
 * ```typescript
 * const assignment = await processRoomSelection('STU12345', 'room456', HousingAssignment, Room);
 * ```
 */
export declare const processRoomSelection: (studentId: string, roomId: string, HousingAssignment: any, Room: any) => Promise<any>;
/**
 * Calculates room selection priority.
 *
 * @param {string} studentId - Student ID
 * @param {any} criteria - Priority criteria (credits, year, etc.)
 * @returns {number} Priority score
 *
 * @example
 * ```typescript
 * const priority = calculateSelectionPriority('STU12345', { year: 'senior', credits: 90 });
 * ```
 */
export declare const calculateSelectionPriority: (studentId: string, criteria: any) => number;
/**
 * Retrieves available rooms during selection window.
 *
 * @param {RoomSelectionData} selection - Selection preferences
 * @param {Model} Room - Room model
 * @returns {Promise<any[]>} Filtered available rooms
 *
 * @example
 * ```typescript
 * const rooms = await getSelectionAvailableRooms(selection, Room);
 * ```
 */
export declare const getSelectionAvailableRooms: (selection: RoomSelectionData, Room: any) => Promise<any[]>;
/**
 * Expires unselected time slots.
 *
 * @param {Date} cutoffDate - Cutoff date
 * @returns {Promise<number>} Number of expired selections
 *
 * @example
 * ```typescript
 * const expired = await expireUnselectedSlots(new Date());
 * ```
 */
export declare const expireUnselectedSlots: (cutoffDate: Date) => Promise<number>;
/**
 * Creates roommate matching profile.
 *
 * @param {RoommateMatchData} matchData - Match data
 * @param {Model} RoommateMatch - RoommateMatch model
 * @returns {Promise<any>} Created profile
 *
 * @example
 * ```typescript
 * const profile = await createRoommateProfile({
 *   studentId: 'STU12345',
 *   academicYear: '2024-2025',
 *   matchPreferences: {
 *     sleepSchedule: 'moderate',
 *     cleanliness: 'clean',
 *     studyHabits: 'quiet'
 *   }
 * }, RoommateMatch);
 * ```
 */
export declare const createRoommateProfile: (matchData: RoommateMatchData, RoommateMatch: any) => Promise<any>;
/**
 * Calculates compatibility score between students.
 *
 * @param {RoommateMatchData} profile1 - First student profile
 * @param {RoommateMatchData} profile2 - Second student profile
 * @returns {number} Compatibility score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateCompatibilityScore(profile1, profile2);
 * console.log(`Compatibility: ${score}%`);
 * ```
 */
export declare const calculateCompatibilityScore: (profile1: RoommateMatchData, profile2: RoommateMatchData) => number;
/**
 * Finds compatible roommate matches.
 *
 * @param {string} studentId - Student ID
 * @param {number} minScore - Minimum compatibility score
 * @param {Model} RoommateMatch - RoommateMatch model
 * @returns {Promise<any[]>} Compatible matches
 *
 * @example
 * ```typescript
 * const matches = await findCompatibleRoommates('STU12345', 70, RoommateMatch);
 * ```
 */
export declare const findCompatibleRoommates: (studentId: string, minScore: number, RoommateMatch: any) => Promise<any[]>;
/**
 * Processes mutual roommate requests.
 *
 * @param {string} studentId1 - First student ID
 * @param {string} studentId2 - Second student ID
 * @param {Model} RoommateMatch - RoommateMatch model
 * @returns {Promise<boolean>} Mutual request exists
 *
 * @example
 * ```typescript
 * const mutual = await processMutualRoommateRequest('STU123', 'STU456', RoommateMatch);
 * ```
 */
export declare const processMutualRoommateRequest: (studentId1: string, studentId2: string, RoommateMatch: any) => Promise<boolean>;
/**
 * Updates roommate preferences.
 *
 * @param {string} studentId - Student ID
 * @param {any} newPreferences - Updated preferences
 * @param {Model} RoommateMatch - RoommateMatch model
 * @returns {Promise<any>} Updated profile
 *
 * @example
 * ```typescript
 * await updateRoommatePreferences('STU12345', { sleepSchedule: 'late' }, RoommateMatch);
 * ```
 */
export declare const updateRoommatePreferences: (studentId: string, newPreferences: any, RoommateMatch: any) => Promise<any>;
/**
 * Generates roommate agreement template.
 *
 * @param {string[]} roommateIds - Roommate student IDs
 * @returns {string} Agreement template
 *
 * @example
 * ```typescript
 * const agreement = generateRoommateAgreement(['STU123', 'STU456']);
 * ```
 */
export declare const generateRoommateAgreement: (roommateIds: string[]) => string;
/**
 * Generates housing contract.
 *
 * @param {HousingContractData} contractData - Contract data
 * @returns {Promise<HousingContractData>} Created contract
 *
 * @example
 * ```typescript
 * const contract = await generateHousingContract({
 *   studentId: 'STU12345',
 *   assignmentId: 'assign789',
 *   contractType: 'academic_year',
 *   contractStartDate: new Date('2024-08-15'),
 *   contractEndDate: new Date('2025-05-15'),
 *   totalAmount: 11000,
 *   paymentSchedule: 'semester',
 *   status: 'draft'
 * });
 * ```
 */
export declare const generateHousingContract: (contractData: HousingContractData) => Promise<HousingContractData>;
/**
 * Processes contract signature.
 *
 * @param {string} contractId - Contract ID
 * @param {string} signedBy - Signer identifier
 * @returns {Promise<any>} Signed contract
 *
 * @example
 * ```typescript
 * await signHousingContract('contract123', 'STU12345');
 * ```
 */
export declare const signHousingContract: (contractId: string, signedBy: string) => Promise<any>;
/**
 * Calculates contract amount with fees.
 *
 * @param {string} roomId - Room ID
 * @param {string} contractType - Contract type
 * @param {Model} Room - Room model
 * @returns {Promise<number>} Total amount
 *
 * @example
 * ```typescript
 * const total = await calculateContractAmount('room456', 'academic_year', Room);
 * ```
 */
export declare const calculateContractAmount: (roomId: string, contractType: string, Room: any) => Promise<number>;
/**
 * Terminates housing contract early.
 *
 * @param {string} contractId - Contract ID
 * @param {string} reason - Termination reason
 * @param {Date} effectiveDate - Effective date
 * @returns {Promise<any>} Terminated contract
 *
 * @example
 * ```typescript
 * await terminateContract('contract123', 'Study abroad', new Date());
 * ```
 */
export declare const terminateContract: (contractId: string, reason: string, effectiveDate: Date) => Promise<any>;
/**
 * Schedules move-in appointment.
 *
 * @param {MoveInOutData} moveInData - Move-in data
 * @returns {Promise<MoveInOutData>} Scheduled move-in
 *
 * @example
 * ```typescript
 * const moveIn = await scheduleMoveIn({
 *   assignmentId: 'assign123',
 *   eventType: 'move_in',
 *   scheduledDate: new Date('2024-08-15'),
 *   scheduledTimeSlot: '09:00-11:00',
 *   status: 'scheduled'
 * });
 * ```
 */
export declare const scheduleMoveIn: (moveInData: MoveInOutData) => Promise<MoveInOutData>;
/**
 * Processes room condition inspection.
 *
 * @param {string} assignmentId - Assignment ID
 * @param {any} conditionReport - Condition report
 * @param {string} inspectorId - Inspector ID
 * @returns {Promise<any>} Inspection record
 *
 * @example
 * ```typescript
 * await processRoomInspection('assign123', {
 *   walls: 'good',
 *   floor: 'good',
 *   furniture: 'minor_scratches'
 * }, 'staff789');
 * ```
 */
export declare const processRoomInspection: (assignmentId: string, conditionReport: any, inspectorId: string) => Promise<any>;
/**
 * Issues room keys to student.
 *
 * @param {string} assignmentId - Assignment ID
 * @param {string[]} keyIds - Key identifiers
 * @returns {Promise<any>} Key issuance record
 *
 * @example
 * ```typescript
 * await issueRoomKeys('assign123', ['KEY-101A', 'KEY-MAILBOX']);
 * ```
 */
export declare const issueRoomKeys: (assignmentId: string, keyIds: string[]) => Promise<any>;
/**
 * Processes key return during move-out.
 *
 * @param {string} assignmentId - Assignment ID
 * @param {string[]} returnedKeys - Returned key IDs
 * @returns {Promise<{ complete: boolean; missing: string[] }>} Return result
 *
 * @example
 * ```typescript
 * const result = await processKeyReturn('assign123', ['KEY-101A']);
 * ```
 */
export declare const processKeyReturn: (assignmentId: string, returnedKeys: string[]) => Promise<{
    complete: boolean;
    missing: string[];
}>;
/**
 * Assesses move-out damages.
 *
 * @param {string} assignmentId - Assignment ID
 * @param {any[]} damages - Damage assessments
 * @returns {Promise<{ totalCharge: number; damages: any[] }>} Damage assessment
 *
 * @example
 * ```typescript
 * const assessment = await assessMoveOutDamages('assign123', [
 *   { type: 'wall_hole', severity: 'minor', charge: 50 }
 * ]);
 * ```
 */
export declare const assessMoveOutDamages: (assignmentId: string, damages: any[]) => Promise<{
    totalCharge: number;
    damages: any[];
}>;
/**
 * Completes move-out process.
 *
 * @param {string} assignmentId - Assignment ID
 * @param {Model} HousingAssignment - HousingAssignment model
 * @param {Model} Room - Room model
 * @returns {Promise<any>} Completed move-out
 *
 * @example
 * ```typescript
 * await completeMoveOut('assign123', HousingAssignment, Room);
 * ```
 */
export declare const completeMoveOut: (assignmentId: string, HousingAssignment: any, Room: any) => Promise<any>;
/**
 * Submits maintenance request.
 *
 * @param {MaintenanceRequestData} requestData - Request data
 * @returns {Promise<MaintenanceRequestData>} Created request
 *
 * @example
 * ```typescript
 * const request = await submitMaintenanceRequest({
 *   dormitoryId: 'dorm123',
 *   roomId: 'room456',
 *   requestedBy: 'STU12345',
 *   category: 'plumbing',
 *   priority: 'high',
 *   description: 'Leaking faucet',
 *   requestedAt: new Date(),
 *   status: 'submitted'
 * });
 * ```
 */
export declare const submitMaintenanceRequest: (requestData: MaintenanceRequestData) => Promise<MaintenanceRequestData>;
/**
 * Assigns maintenance request to technician.
 *
 * @param {string} requestId - Request ID
 * @param {string} technicianId - Technician ID
 * @returns {Promise<any>} Assigned request
 *
 * @example
 * ```typescript
 * await assignMaintenanceRequest('req789', 'tech456');
 * ```
 */
export declare const assignMaintenanceRequest: (requestId: string, technicianId: string) => Promise<any>;
/**
 * Generates facility maintenance report.
 *
 * @param {string} dormitoryId - Dormitory ID
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<any>} Maintenance report
 *
 * @example
 * ```typescript
 * const report = await generateMaintenanceReport('dorm123', startDate, endDate);
 * ```
 */
export declare const generateMaintenanceReport: (dormitoryId: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Calculates occupancy rates for facilities.
 *
 * @param {string} academicYear - Academic year
 * @param {string} term - Term
 * @param {Model} Dormitory - Dormitory model
 * @param {Model} HousingAssignment - HousingAssignment model
 * @returns {Promise<OccupancyData[]>} Occupancy data
 *
 * @example
 * ```typescript
 * const occupancy = await calculateOccupancyRates('2024-2025', 'fall', Dormitory, HousingAssignment);
 * ```
 */
export declare const calculateOccupancyRates: (academicYear: string, term: string, Dormitory: any, HousingAssignment: any) => Promise<OccupancyData[]>;
/**
 * Generates housing analytics dashboard data.
 *
 * @param {string} academicYear - Academic year
 * @param {Model} Dormitory - Dormitory model
 * @param {Model} HousingAssignment - HousingAssignment model
 * @returns {Promise<any>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateHousingDashboard('2024-2025', Dormitory, HousingAssignment);
 * ```
 */
export declare const generateHousingDashboard: (academicYear: string, Dormitory: any, HousingAssignment: any) => Promise<any>;
/**
 * NestJS Injectable service for Housing Management.
 *
 * @example
 * ```typescript
 * @Controller('housing')
 * export class HousingController {
 *   constructor(private readonly housingService: HousingManagementService) {}
 *
 *   @Post('assignments')
 *   async createAssignment(@Body() data: HousingAssignmentData) {
 *     return this.housingService.createAssignment(data);
 *   }
 * }
 * ```
 */
export declare class HousingManagementService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    createAssignment(data: HousingAssignmentData): Promise<any>;
    getOccupancy(academicYear: string, term: string): Promise<OccupancyData[]>;
    matchRoommates(studentId: string, minScore: number): Promise<any[]>;
}
/**
 * Default export with all housing utilities.
 */
declare const _default: {
    createDormitoryModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            buildingName: string;
            buildingCode: string;
            address: Record<string, any>;
            buildingType: string;
            gender: string;
            totalFloors: number;
            totalRooms: number;
            totalCapacity: number;
            amenities: string[];
            isActive: boolean;
            openedYear: number | null;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createRoomModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            dormitoryId: string;
            roomNumber: string;
            floor: number;
            roomType: string;
            capacity: number;
            squareFootage: number | null;
            hasPrivateBathroom: boolean;
            isAccessible: boolean;
            amenities: string[];
            baseRate: number;
            isAvailable: boolean;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createHousingAssignmentModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            studentId: string;
            dormitoryId: string;
            roomId: string;
            academicYear: string;
            term: string;
            checkInDate: Date;
            checkOutDate: Date;
            assignmentType: string;
            status: string;
            specialAccommodations: string[];
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createRoommateMatchModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            studentId: string;
            academicYear: string;
            matchPreferences: Record<string, any>;
            requestedRoommates: string[];
            blockedRoommates: string[];
            matchScore: number | null;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createDormitory: (dormitoryData: DormitoryData, Dormitory: any, transaction?: Transaction) => Promise<any>;
    createRooms: (dormitoryId: string, rooms: Partial<RoomData>[], Room: any) => Promise<any[]>;
    updateDormitory: (dormitoryId: string, updates: Partial<DormitoryData>, Dormitory: any) => Promise<any>;
    updateRoom: (roomId: string, updates: Partial<RoomData>, Room: any) => Promise<any>;
    getAvailableRooms: (criteria: any, Room: any) => Promise<any[]>;
    createHousingAssignment: (assignmentData: HousingAssignmentData, HousingAssignment: any, Room: any) => Promise<any>;
    updateAssignmentStatus: (assignmentId: string, newStatus: string, HousingAssignment: any) => Promise<any>;
    cancelHousingAssignment: (assignmentId: string, reason: string, HousingAssignment: any, Room: any) => Promise<any>;
    transferRoom: (assignmentId: string, newRoomId: string, reason: string, HousingAssignment: any, Room: any) => Promise<any>;
    getStudentAssignments: (studentId: string, HousingAssignment: any) => Promise<any[]>;
    getCurrentRoommates: (studentId: string, academicYear: string, HousingAssignment: any) => Promise<any[]>;
    bulkAssignRooms: (studentIds: string[], academicYear: string, HousingAssignment: any, Room: any) => Promise<any[]>;
    validateSpecialAccommodations: (studentId: string, accommodations: string[]) => Promise<{
        approved: boolean;
        deniedReasons: string[];
    }>;
    createRoomSelection: (selectionData: RoomSelectionData) => Promise<RoomSelectionData>;
    assignSelectionTimeSlots: (academicYear: string, studentIds: string[]) => Promise<RoomSelectionData[]>;
    processRoomSelection: (studentId: string, roomId: string, HousingAssignment: any, Room: any) => Promise<any>;
    calculateSelectionPriority: (studentId: string, criteria: any) => number;
    getSelectionAvailableRooms: (selection: RoomSelectionData, Room: any) => Promise<any[]>;
    expireUnselectedSlots: (cutoffDate: Date) => Promise<number>;
    createRoommateProfile: (matchData: RoommateMatchData, RoommateMatch: any) => Promise<any>;
    calculateCompatibilityScore: (profile1: RoommateMatchData, profile2: RoommateMatchData) => number;
    findCompatibleRoommates: (studentId: string, minScore: number, RoommateMatch: any) => Promise<any[]>;
    processMutualRoommateRequest: (studentId1: string, studentId2: string, RoommateMatch: any) => Promise<boolean>;
    updateRoommatePreferences: (studentId: string, newPreferences: any, RoommateMatch: any) => Promise<any>;
    generateRoommateAgreement: (roommateIds: string[]) => string;
    generateHousingContract: (contractData: HousingContractData) => Promise<HousingContractData>;
    signHousingContract: (contractId: string, signedBy: string) => Promise<any>;
    calculateContractAmount: (roomId: string, contractType: string, Room: any) => Promise<number>;
    terminateContract: (contractId: string, reason: string, effectiveDate: Date) => Promise<any>;
    scheduleMoveIn: (moveInData: MoveInOutData) => Promise<MoveInOutData>;
    processRoomInspection: (assignmentId: string, conditionReport: any, inspectorId: string) => Promise<any>;
    issueRoomKeys: (assignmentId: string, keyIds: string[]) => Promise<any>;
    processKeyReturn: (assignmentId: string, returnedKeys: string[]) => Promise<{
        complete: boolean;
        missing: string[];
    }>;
    assessMoveOutDamages: (assignmentId: string, damages: any[]) => Promise<{
        totalCharge: number;
        damages: any[];
    }>;
    completeMoveOut: (assignmentId: string, HousingAssignment: any, Room: any) => Promise<any>;
    submitMaintenanceRequest: (requestData: MaintenanceRequestData) => Promise<MaintenanceRequestData>;
    assignMaintenanceRequest: (requestId: string, technicianId: string) => Promise<any>;
    generateMaintenanceReport: (dormitoryId: string, startDate: Date, endDate: Date) => Promise<any>;
    calculateOccupancyRates: (academicYear: string, term: string, Dormitory: any, HousingAssignment: any) => Promise<OccupancyData[]>;
    generateHousingDashboard: (academicYear: string, Dormitory: any, HousingAssignment: any) => Promise<any>;
    HousingManagementService: typeof HousingManagementService;
};
export default _default;
//# sourceMappingURL=housing-management-kit.d.ts.map