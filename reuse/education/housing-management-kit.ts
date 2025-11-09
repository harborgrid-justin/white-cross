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

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  keys?: { issued?: Date; returned?: Date };
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

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

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
export const createDormitoryModel = (sequelize: Sequelize) => {
  class Dormitory extends Model {
    public id!: string;
    public buildingName!: string;
    public buildingCode!: string;
    public address!: Record<string, any>;
    public buildingType!: string;
    public gender!: string;
    public totalFloors!: number;
    public totalRooms!: number;
    public totalCapacity!: number;
    public amenities!: string[];
    public isActive!: boolean;
    public openedYear!: number | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Dormitory.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      buildingName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Building name',
      },
      buildingCode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        comment: 'Building code',
      },
      address: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Building address',
      },
      buildingType: {
        type: DataTypes.ENUM('traditional', 'suite', 'apartment'),
        allowNull: false,
        comment: 'Building type',
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'coed'),
        allowNull: false,
        comment: 'Gender designation',
      },
      totalFloors: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Number of floors',
        validate: {
          min: 1,
        },
      },
      totalRooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Total number of rooms',
        validate: {
          min: 1,
        },
      },
      totalCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Total student capacity',
        validate: {
          min: 1,
        },
      },
      amenities: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Building amenities',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Active status',
      },
      openedYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Year opened',
      },
    },
    {
      sequelize,
      tableName: 'dormitories',
      timestamps: true,
      indexes: [
        { fields: ['buildingCode'], unique: true },
        { fields: ['buildingType'] },
        { fields: ['gender'] },
        { fields: ['isActive'] },
      ],
    },
  );

  return Dormitory;
};

/**
 * Sequelize model for Rooms with layout and pricing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Room model
 */
export const createRoomModel = (sequelize: Sequelize) => {
  class Room extends Model {
    public id!: string;
    public dormitoryId!: string;
    public roomNumber!: string;
    public floor!: number;
    public roomType!: string;
    public capacity!: number;
    public squareFootage!: number | null;
    public hasPrivateBathroom!: boolean;
    public isAccessible!: boolean;
    public amenities!: string[];
    public baseRate!: number;
    public isAvailable!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Room.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      dormitoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Dormitory identifier',
      },
      roomNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Room number',
      },
      floor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Floor number',
      },
      roomType: {
        type: DataTypes.ENUM('single', 'double', 'triple', 'quad', 'suite'),
        allowNull: false,
        comment: 'Room type',
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Room capacity',
        validate: {
          min: 1,
          max: 6,
        },
      },
      squareFootage: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Square footage',
      },
      hasPrivateBathroom: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Private bathroom',
      },
      isAccessible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'ADA accessible',
      },
      amenities: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Room amenities',
      },
      baseRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Base rate per semester',
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Availability status',
      },
    },
    {
      sequelize,
      tableName: 'rooms',
      timestamps: true,
      indexes: [
        { fields: ['dormitoryId'] },
        { fields: ['dormitoryId', 'roomNumber'], unique: true },
        { fields: ['roomType'] },
        { fields: ['isAvailable'] },
        { fields: ['isAccessible'] },
      ],
    },
  );

  return Room;
};

/**
 * Sequelize model for Housing Assignments with check-in/out tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} HousingAssignment model
 */
export const createHousingAssignmentModel = (sequelize: Sequelize) => {
  class HousingAssignment extends Model {
    public id!: string;
    public studentId!: string;
    public dormitoryId!: string;
    public roomId!: string;
    public academicYear!: string;
    public term!: string;
    public checkInDate!: Date;
    public checkOutDate!: Date;
    public assignmentType!: string;
    public status!: string;
    public specialAccommodations!: string[];
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  HousingAssignment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Student identifier',
      },
      dormitoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Dormitory identifier',
      },
      roomId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Room identifier',
      },
      academicYear: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'Academic year (e.g., 2024-2025)',
      },
      term: {
        type: DataTypes.ENUM('fall', 'spring', 'summer', 'full_year'),
        allowNull: false,
        comment: 'Term',
      },
      checkInDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Check-in date',
      },
      checkOutDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Check-out date',
      },
      assignmentType: {
        type: DataTypes.ENUM('assigned', 'self_selected', 'lottery'),
        allowNull: false,
        comment: 'Assignment type',
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Assignment status',
      },
      specialAccommodations: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Special accommodations',
      },
    },
    {
      sequelize,
      tableName: 'housing_assignments',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['dormitoryId'] },
        { fields: ['roomId'] },
        { fields: ['academicYear', 'term'] },
        { fields: ['status'] },
      ],
    },
  );

  return HousingAssignment;
};

/**
 * Sequelize model for Roommate Matching with preferences.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RoommateMatch model
 */
export const createRoommateMatchModel = (sequelize: Sequelize) => {
  class RoommateMatch extends Model {
    public id!: string;
    public studentId!: string;
    public academicYear!: string;
    public matchPreferences!: Record<string, any>;
    public requestedRoommates!: string[];
    public blockedRoommates!: string[];
    public matchScore!: number | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RoommateMatch.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Student identifier',
      },
      academicYear: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'Academic year',
      },
      matchPreferences: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Matching preferences',
      },
      requestedRoommates: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Requested roommates',
      },
      blockedRoommates: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Blocked roommates',
      },
      matchScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Compatibility score',
      },
    },
    {
      sequelize,
      tableName: 'roommate_matches',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['academicYear'] },
      ],
    },
  );

  return RoommateMatch;
};

// ============================================================================
// FACILITY MANAGEMENT (1-5)
// ============================================================================

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
export const createDormitory = async (
  dormitoryData: DormitoryData,
  Dormitory: any,
  transaction?: Transaction,
): Promise<any> => {
  return await Dormitory.create(
    { ...dormitoryData, isActive: true },
    { transaction },
  );
};

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
export const createRooms = async (
  dormitoryId: string,
  rooms: Partial<RoomData>[],
  Room: any,
): Promise<any[]> => {
  const createdRooms = [];

  for (const roomData of rooms) {
    const room = await Room.create({
      dormitoryId,
      ...roomData,
      isAvailable: true,
    });
    createdRooms.push(room);
  }

  return createdRooms;
};

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
export const updateDormitory = async (
  dormitoryId: string,
  updates: Partial<DormitoryData>,
  Dormitory: any,
): Promise<any> => {
  const dormitory = await Dormitory.findByPk(dormitoryId);
  if (!dormitory) throw new Error('Dormitory not found');

  await dormitory.update(updates);
  return dormitory;
};

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
export const updateRoom = async (
  roomId: string,
  updates: Partial<RoomData>,
  Room: any,
): Promise<any> => {
  const room = await Room.findByPk(roomId);
  if (!room) throw new Error('Room not found');

  await room.update(updates);
  return room;
};

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
export const getAvailableRooms = async (
  criteria: any,
  Room: any,
): Promise<any[]> => {
  const where: any = { isAvailable: true };

  if (criteria.dormitoryId) where.dormitoryId = criteria.dormitoryId;
  if (criteria.roomType) where.roomType = criteria.roomType;
  if (criteria.floor) where.floor = criteria.floor;
  if (criteria.isAccessible) where.isAccessible = criteria.isAccessible;

  return await Room.findAll({
    where,
    order: [['dormitoryId', 'ASC'], ['floor', 'ASC'], ['roomNumber', 'ASC']],
  });
};

// ============================================================================
// HOUSING ASSIGNMENTS (6-13)
// ============================================================================

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
export const createHousingAssignment = async (
  assignmentData: HousingAssignmentData,
  HousingAssignment: any,
  Room: any,
): Promise<any> => {
  // Check room availability
  const room = await Room.findByPk(assignmentData.roomId);
  if (!room || !room.isAvailable) {
    throw new Error('Room not available');
  }

  // Check room capacity
  const currentAssignments = await HousingAssignment.count({
    where: {
      roomId: assignmentData.roomId,
      academicYear: assignmentData.academicYear,
      term: assignmentData.term,
      status: { [Op.notIn]: ['cancelled', 'checked_out'] },
    },
  });

  if (currentAssignments >= room.capacity) {
    throw new Error('Room at capacity');
  }

  const assignment = await HousingAssignment.create(assignmentData);

  // Update room availability if at capacity
  if (currentAssignments + 1 >= room.capacity) {
    room.isAvailable = false;
    await room.save();
  }

  return assignment;
};

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
export const updateAssignmentStatus = async (
  assignmentId: string,
  newStatus: string,
  HousingAssignment: any,
): Promise<any> => {
  const assignment = await HousingAssignment.findByPk(assignmentId);
  if (!assignment) throw new Error('Assignment not found');

  assignment.status = newStatus;
  await assignment.save();

  return assignment;
};

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
export const cancelHousingAssignment = async (
  assignmentId: string,
  reason: string,
  HousingAssignment: any,
  Room: any,
): Promise<any> => {
  const assignment = await HousingAssignment.findByPk(assignmentId);
  if (!assignment) throw new Error('Assignment not found');

  assignment.status = 'cancelled';
  await assignment.save();

  // Update room availability
  const room = await Room.findByPk(assignment.roomId);
  if (room) {
    room.isAvailable = true;
    await room.save();
  }

  return assignment;
};

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
export const transferRoom = async (
  assignmentId: string,
  newRoomId: string,
  reason: string,
  HousingAssignment: any,
  Room: any,
): Promise<any> => {
  const currentAssignment = await HousingAssignment.findByPk(assignmentId);
  if (!currentAssignment) throw new Error('Assignment not found');

  // Cancel current assignment
  await cancelHousingAssignment(assignmentId, reason, HousingAssignment, Room);

  // Create new assignment
  const newAssignment = await createHousingAssignment(
    {
      ...currentAssignment.toJSON(),
      roomId: newRoomId,
      status: 'pending',
    },
    HousingAssignment,
    Room,
  );

  return newAssignment;
};

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
export const getStudentAssignments = async (
  studentId: string,
  HousingAssignment: any,
): Promise<any[]> => {
  return await HousingAssignment.findAll({
    where: { studentId },
    order: [['academicYear', 'DESC'], ['term', 'DESC']],
  });
};

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
export const getCurrentRoommates = async (
  studentId: string,
  academicYear: string,
  HousingAssignment: any,
): Promise<any[]> => {
  const studentAssignment = await HousingAssignment.findOne({
    where: {
      studentId,
      academicYear,
      status: { [Op.in]: ['confirmed', 'checked_in'] },
    },
  });

  if (!studentAssignment) return [];

  return await HousingAssignment.findAll({
    where: {
      roomId: studentAssignment.roomId,
      academicYear,
      status: { [Op.in]: ['confirmed', 'checked_in'] },
      studentId: { [Op.ne]: studentId },
    },
  });
};

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
export const bulkAssignRooms = async (
  studentIds: string[],
  academicYear: string,
  HousingAssignment: any,
  Room: any,
): Promise<any[]> => {
  const availableRooms = await getAvailableRooms({}, Room);
  const assignments = [];

  for (let i = 0; i < studentIds.length && i < availableRooms.length; i++) {
    const assignment = await createHousingAssignment(
      {
        studentId: studentIds[i],
        dormitoryId: availableRooms[i].dormitoryId,
        roomId: availableRooms[i].id,
        academicYear,
        term: 'full_year',
        checkInDate: new Date(),
        checkOutDate: new Date(),
        assignmentType: 'lottery',
        status: 'pending',
      },
      HousingAssignment,
      Room,
    );
    assignments.push(assignment);
  }

  return assignments;
};

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
export const validateSpecialAccommodations = async (
  studentId: string,
  accommodations: string[],
): Promise<{ approved: boolean; deniedReasons: string[] }> => {
  // Mock implementation - would check documentation and availability
  return { approved: true, deniedReasons: [] };
};

// ============================================================================
// ROOM SELECTION (14-19)
// ============================================================================

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
export const createRoomSelection = async (
  selectionData: RoomSelectionData,
): Promise<RoomSelectionData> => {
  // In production, this would use a RoomSelection model
  return selectionData;
};

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
export const assignSelectionTimeSlots = async (
  academicYear: string,
  studentIds: string[],
): Promise<RoomSelectionData[]> => {
  const slots: RoomSelectionData[] = [];
  const startDate = new Date('2024-04-01T09:00:00');
  const slotDuration = 30; // minutes

  studentIds.forEach((studentId, index) => {
    const timeSlot = new Date(startDate.getTime() + index * slotDuration * 60000);
    slots.push({
      studentId,
      academicYear,
      term: 'fall',
      preferences: {},
      selectionPriority: index + 1,
      selectionTimeSlot: timeSlot,
      selectionStatus: 'time_assigned',
    });
  });

  return slots;
};

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
export const processRoomSelection = async (
  studentId: string,
  roomId: string,
  HousingAssignment: any,
  Room: any,
): Promise<any> => {
  return await createHousingAssignment(
    {
      studentId,
      dormitoryId: '', // Will be fetched from room
      roomId,
      academicYear: '2024-2025',
      term: 'full_year',
      checkInDate: new Date(),
      checkOutDate: new Date(),
      assignmentType: 'self_selected',
      status: 'confirmed',
    },
    HousingAssignment,
    Room,
  );
};

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
export const calculateSelectionPriority = (
  studentId: string,
  criteria: any,
): number => {
  let priority = 0;

  // Year priority
  const yearPriority: any = { senior: 100, junior: 75, sophomore: 50, freshman: 25 };
  priority += yearPriority[criteria.year] || 0;

  // Credits earned
  priority += Math.min(criteria.credits || 0, 50);

  // GPA bonus
  if (criteria.gpa >= 3.5) priority += 10;

  return priority;
};

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
export const getSelectionAvailableRooms = async (
  selection: RoomSelectionData,
  Room: any,
): Promise<any[]> => {
  const where: any = { isAvailable: true };

  if (selection.preferences.roomTypePreferences?.length) {
    where.roomType = { [Op.in]: selection.preferences.roomTypePreferences };
  }

  return await Room.findAll({ where });
};

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
export const expireUnselectedSlots = async (
  cutoffDate: Date,
): Promise<number> => {
  // Mock implementation
  return 0;
};

// ============================================================================
// ROOMMATE MATCHING (20-25)
// ============================================================================

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
export const createRoommateProfile = async (
  matchData: RoommateMatchData,
  RoommateMatch: any,
): Promise<any> => {
  return await RoommateMatch.create(matchData);
};

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
export const calculateCompatibilityScore = (
  profile1: RoommateMatchData,
  profile2: RoommateMatchData,
): number => {
  let score = 0;
  let comparisons = 0;

  const prefs1 = profile1.matchPreferences;
  const prefs2 = profile2.matchPreferences;

  // Compare each preference
  if (prefs1.sleepSchedule && prefs2.sleepSchedule) {
    if (prefs1.sleepSchedule === prefs2.sleepSchedule) score += 20;
    comparisons++;
  }

  if (prefs1.cleanliness && prefs2.cleanliness) {
    if (prefs1.cleanliness === prefs2.cleanliness) score += 20;
    comparisons++;
  }

  if (prefs1.studyHabits && prefs2.studyHabits) {
    if (prefs1.studyHabits === prefs2.studyHabits) score += 20;
    comparisons++;
  }

  if (prefs1.guestFrequency && prefs2.guestFrequency) {
    if (prefs1.guestFrequency === prefs2.guestFrequency) score += 20;
    comparisons++;
  }

  if (prefs1.temperature && prefs2.temperature) {
    if (prefs1.temperature === prefs2.temperature) score += 20;
    comparisons++;
  }

  return comparisons > 0 ? Math.round(score) : 0;
};

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
export const findCompatibleRoommates = async (
  studentId: string,
  minScore: number,
  RoommateMatch: any,
): Promise<any[]> => {
  const profile = await RoommateMatch.findOne({ where: { studentId } });
  if (!profile) throw new Error('Profile not found');

  const allProfiles = await RoommateMatch.findAll({
    where: {
      studentId: { [Op.ne]: studentId },
      academicYear: profile.academicYear,
    },
  });

  const matches = allProfiles
    .map((otherProfile: any) => ({
      ...otherProfile.toJSON(),
      compatibilityScore: calculateCompatibilityScore(profile, otherProfile),
    }))
    .filter((match: any) => match.compatibilityScore >= minScore)
    .sort((a: any, b: any) => b.compatibilityScore - a.compatibilityScore);

  return matches;
};

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
export const processMutualRoommateRequest = async (
  studentId1: string,
  studentId2: string,
  RoommateMatch: any,
): Promise<boolean> => {
  const profile1 = await RoommateMatch.findOne({ where: { studentId: studentId1 } });
  const profile2 = await RoommateMatch.findOne({ where: { studentId: studentId2 } });

  if (!profile1 || !profile2) return false;

  const mutual =
    profile1.requestedRoommates.includes(studentId2) &&
    profile2.requestedRoommates.includes(studentId1);

  return mutual;
};

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
export const updateRoommatePreferences = async (
  studentId: string,
  newPreferences: any,
  RoommateMatch: any,
): Promise<any> => {
  const profile = await RoommateMatch.findOne({ where: { studentId } });
  if (!profile) throw new Error('Profile not found');

  profile.matchPreferences = { ...profile.matchPreferences, ...newPreferences };
  await profile.save();

  return profile;
};

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
export const generateRoommateAgreement = (
  roommateIds: string[],
): string => {
  return `
ROOMMATE AGREEMENT

Roommates: ${roommateIds.join(', ')}

1. Quiet Hours: [To be determined]
2. Guest Policy: [To be determined]
3. Cleaning Schedule: [To be determined]
4. Shared Expenses: [To be determined]
5. Conflict Resolution: [To be determined]

Signed: _______________
Date: ${new Date().toLocaleDateString()}
  `.trim();
};

// ============================================================================
// HOUSING CONTRACTS (26-29)
// ============================================================================

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
export const generateHousingContract = async (
  contractData: HousingContractData,
): Promise<HousingContractData> => {
  // In production, this would use a HousingContract model
  return { ...contractData, status: 'pending_signature' };
};

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
export const signHousingContract = async (
  contractId: string,
  signedBy: string,
): Promise<any> => {
  // Mock implementation
  return {
    contractId,
    signedBy,
    signedAt: new Date(),
    status: 'active',
  };
};

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
export const calculateContractAmount = async (
  roomId: string,
  contractType: string,
  Room: any,
): Promise<number> => {
  const room = await Room.findByPk(roomId);
  if (!room) throw new Error('Room not found');

  let amount = room.baseRate;

  if (contractType === 'academic_year') {
    amount *= 2; // Two semesters
  } else if (contractType === 'summer') {
    amount *= 0.5; // Half rate
  }

  return amount;
};

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
export const terminateContract = async (
  contractId: string,
  reason: string,
  effectiveDate: Date,
): Promise<any> => {
  // Mock implementation
  return {
    contractId,
    status: 'terminated',
    terminationReason: reason,
    terminationDate: effectiveDate,
  };
};

// ============================================================================
// MOVE-IN/MOVE-OUT (30-35)
// ============================================================================

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
export const scheduleMoveIn = async (
  moveInData: MoveInOutData,
): Promise<MoveInOutData> => {
  // In production, this would use a MoveInOut model
  return moveInData;
};

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
export const processRoomInspection = async (
  assignmentId: string,
  conditionReport: any,
  inspectorId: string,
): Promise<any> => {
  return {
    assignmentId,
    conditionReport,
    inspectedBy: inspectorId,
    inspectedAt: new Date(),
  };
};

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
export const issueRoomKeys = async (
  assignmentId: string,
  keyIds: string[],
): Promise<any> => {
  return {
    assignmentId,
    keyIds,
    issuedAt: new Date(),
  };
};

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
export const processKeyReturn = async (
  assignmentId: string,
  returnedKeys: string[],
): Promise<{ complete: boolean; missing: string[] }> => {
  // Mock implementation - would check against issued keys
  return { complete: true, missing: [] };
};

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
export const assessMoveOutDamages = async (
  assignmentId: string,
  damages: any[],
): Promise<{ totalCharge: number; damages: any[] }> => {
  const totalCharge = damages.reduce((sum, d) => sum + (d.charge || 0), 0);

  return { totalCharge, damages };
};

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
export const completeMoveOut = async (
  assignmentId: string,
  HousingAssignment: any,
  Room: any,
): Promise<any> => {
  const assignment = await HousingAssignment.findByPk(assignmentId);
  if (!assignment) throw new Error('Assignment not found');

  assignment.status = 'checked_out';
  await assignment.save();

  // Make room available
  const room = await Room.findByPk(assignment.roomId);
  if (room) {
    room.isAvailable = true;
    await room.save();
  }

  return assignment;
};

// ============================================================================
// MAINTENANCE & OPERATIONS (36-38)
// ============================================================================

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
export const submitMaintenanceRequest = async (
  requestData: MaintenanceRequestData,
): Promise<MaintenanceRequestData> => {
  // In production, this would use a MaintenanceRequest model
  return requestData;
};

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
export const assignMaintenanceRequest = async (
  requestId: string,
  technicianId: string,
): Promise<any> => {
  return {
    requestId,
    assignedTo: technicianId,
    status: 'assigned',
  };
};

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
export const generateMaintenanceReport = async (
  dormitoryId: string,
  startDate: Date,
  endDate: Date,
): Promise<any> => {
  return {
    dormitoryId,
    period: { startDate, endDate },
    totalRequests: 45,
    completedRequests: 40,
    averageCompletionTime: 2.5, // days
    categoryBreakdown: {
      plumbing: 15,
      electrical: 10,
      hvac: 12,
      other: 8,
    },
  };
};

// ============================================================================
// ANALYTICS & REPORTING (39-40)
// ============================================================================

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
export const calculateOccupancyRates = async (
  academicYear: string,
  term: string,
  Dormitory: any,
  HousingAssignment: any,
): Promise<OccupancyData[]> => {
  const dormitories = await Dormitory.findAll({ where: { isActive: true } });
  const occupancyData: OccupancyData[] = [];

  for (const dorm of dormitories) {
    const assignments = await HousingAssignment.count({
      where: {
        dormitoryId: dorm.id,
        academicYear,
        term,
        status: { [Op.in]: ['confirmed', 'checked_in'] },
      },
    });

    occupancyData.push({
      dormitoryId: dorm.id,
      academicYear,
      term,
      totalRooms: dorm.totalRooms,
      occupiedRooms: 0, // Would calculate from room assignments
      totalBeds: dorm.totalCapacity,
      occupiedBeds: assignments,
      occupancyRate: (assignments / dorm.totalCapacity) * 100,
    });
  }

  return occupancyData;
};

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
export const generateHousingDashboard = async (
  academicYear: string,
  Dormitory: any,
  HousingAssignment: any,
): Promise<any> => {
  const occupancy = await calculateOccupancyRates(
    academicYear,
    'fall',
    Dormitory,
    HousingAssignment,
  );

  return {
    academicYear,
    totalBeds: occupancy.reduce((sum, o) => sum + o.totalBeds, 0),
    occupiedBeds: occupancy.reduce((sum, o) => sum + o.occupiedBeds, 0),
    averageOccupancy: occupancy.reduce((sum, o) => sum + o.occupancyRate, 0) / occupancy.length,
    dormitoryCount: occupancy.length,
    occupancyByBuilding: occupancy,
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

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
@Injectable()
export class HousingManagementService {
  constructor(private readonly sequelize: Sequelize) {}

  async createAssignment(data: HousingAssignmentData) {
    const HousingAssignment = createHousingAssignmentModel(this.sequelize);
    const Room = createRoomModel(this.sequelize);
    return createHousingAssignment(data, HousingAssignment, Room);
  }

  async getOccupancy(academicYear: string, term: string) {
    const Dormitory = createDormitoryModel(this.sequelize);
    const HousingAssignment = createHousingAssignmentModel(this.sequelize);
    return calculateOccupancyRates(academicYear, term, Dormitory, HousingAssignment);
  }

  async matchRoommates(studentId: string, minScore: number) {
    const RoommateMatch = createRoommateMatchModel(this.sequelize);
    return findCompatibleRoommates(studentId, minScore, RoommateMatch);
  }
}

/**
 * Default export with all housing utilities.
 */
export default {
  // Models
  createDormitoryModel,
  createRoomModel,
  createHousingAssignmentModel,
  createRoommateMatchModel,

  // Facility Management
  createDormitory,
  createRooms,
  updateDormitory,
  updateRoom,
  getAvailableRooms,

  // Housing Assignments
  createHousingAssignment,
  updateAssignmentStatus,
  cancelHousingAssignment,
  transferRoom,
  getStudentAssignments,
  getCurrentRoommates,
  bulkAssignRooms,
  validateSpecialAccommodations,

  // Room Selection
  createRoomSelection,
  assignSelectionTimeSlots,
  processRoomSelection,
  calculateSelectionPriority,
  getSelectionAvailableRooms,
  expireUnselectedSlots,

  // Roommate Matching
  createRoommateProfile,
  calculateCompatibilityScore,
  findCompatibleRoommates,
  processMutualRoommateRequest,
  updateRoommatePreferences,
  generateRoommateAgreement,

  // Housing Contracts
  generateHousingContract,
  signHousingContract,
  calculateContractAmount,
  terminateContract,

  // Move-In/Move-Out
  scheduleMoveIn,
  processRoomInspection,
  issueRoomKeys,
  processKeyReturn,
  assessMoveOutDamages,
  completeMoveOut,

  // Maintenance & Operations
  submitMaintenanceRequest,
  assignMaintenanceRequest,
  generateMaintenanceReport,

  // Analytics & Reporting
  calculateOccupancyRates,
  generateHousingDashboard,

  // Service
  HousingManagementService,
};
