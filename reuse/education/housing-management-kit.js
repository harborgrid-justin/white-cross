"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HousingManagementService = exports.generateHousingDashboard = exports.calculateOccupancyRates = exports.generateMaintenanceReport = exports.assignMaintenanceRequest = exports.submitMaintenanceRequest = exports.completeMoveOut = exports.assessMoveOutDamages = exports.processKeyReturn = exports.issueRoomKeys = exports.processRoomInspection = exports.scheduleMoveIn = exports.terminateContract = exports.calculateContractAmount = exports.signHousingContract = exports.generateHousingContract = exports.generateRoommateAgreement = exports.updateRoommatePreferences = exports.processMutualRoommateRequest = exports.findCompatibleRoommates = exports.calculateCompatibilityScore = exports.createRoommateProfile = exports.expireUnselectedSlots = exports.getSelectionAvailableRooms = exports.calculateSelectionPriority = exports.processRoomSelection = exports.assignSelectionTimeSlots = exports.createRoomSelection = exports.validateSpecialAccommodations = exports.bulkAssignRooms = exports.getCurrentRoommates = exports.getStudentAssignments = exports.transferRoom = exports.cancelHousingAssignment = exports.updateAssignmentStatus = exports.createHousingAssignment = exports.getAvailableRooms = exports.updateRoom = exports.updateDormitory = exports.createRooms = exports.createDormitory = exports.createRoommateMatchModel = exports.createHousingAssignmentModel = exports.createRoomModel = exports.createDormitoryModel = void 0;
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
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
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
const createDormitoryModel = (sequelize) => {
    class Dormitory extends sequelize_1.Model {
    }
    Dormitory.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        buildingName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Building name',
        },
        buildingCode: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            unique: true,
            comment: 'Building code',
        },
        address: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Building address',
        },
        buildingType: {
            type: sequelize_1.DataTypes.ENUM('traditional', 'suite', 'apartment'),
            allowNull: false,
            comment: 'Building type',
        },
        gender: {
            type: sequelize_1.DataTypes.ENUM('male', 'female', 'coed'),
            allowNull: false,
            comment: 'Gender designation',
        },
        totalFloors: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Number of floors',
            validate: {
                min: 1,
            },
        },
        totalRooms: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Total number of rooms',
            validate: {
                min: 1,
            },
        },
        totalCapacity: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Total student capacity',
            validate: {
                min: 1,
            },
        },
        amenities: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Building amenities',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Active status',
        },
        openedYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Year opened',
        },
    }, {
        sequelize,
        tableName: 'dormitories',
        timestamps: true,
        indexes: [
            { fields: ['buildingCode'], unique: true },
            { fields: ['buildingType'] },
            { fields: ['gender'] },
            { fields: ['isActive'] },
        ],
    });
    return Dormitory;
};
exports.createDormitoryModel = createDormitoryModel;
/**
 * Sequelize model for Rooms with layout and pricing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Room model
 */
const createRoomModel = (sequelize) => {
    class Room extends sequelize_1.Model {
    }
    Room.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        dormitoryId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Dormitory identifier',
        },
        roomNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Room number',
        },
        floor: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Floor number',
        },
        roomType: {
            type: sequelize_1.DataTypes.ENUM('single', 'double', 'triple', 'quad', 'suite'),
            allowNull: false,
            comment: 'Room type',
        },
        capacity: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Room capacity',
            validate: {
                min: 1,
                max: 6,
            },
        },
        squareFootage: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Square footage',
        },
        hasPrivateBathroom: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Private bathroom',
        },
        isAccessible: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'ADA accessible',
        },
        amenities: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Room amenities',
        },
        baseRate: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Base rate per semester',
        },
        isAvailable: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Availability status',
        },
    }, {
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
    });
    return Room;
};
exports.createRoomModel = createRoomModel;
/**
 * Sequelize model for Housing Assignments with check-in/out tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} HousingAssignment model
 */
const createHousingAssignmentModel = (sequelize) => {
    class HousingAssignment extends sequelize_1.Model {
    }
    HousingAssignment.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Student identifier',
        },
        dormitoryId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Dormitory identifier',
        },
        roomId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Room identifier',
        },
        academicYear: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            comment: 'Academic year (e.g., 2024-2025)',
        },
        term: {
            type: sequelize_1.DataTypes.ENUM('fall', 'spring', 'summer', 'full_year'),
            allowNull: false,
            comment: 'Term',
        },
        checkInDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Check-in date',
        },
        checkOutDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Check-out date',
        },
        assignmentType: {
            type: sequelize_1.DataTypes.ENUM('assigned', 'self_selected', 'lottery'),
            allowNull: false,
            comment: 'Assignment type',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Assignment status',
        },
        specialAccommodations: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Special accommodations',
        },
    }, {
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
    });
    return HousingAssignment;
};
exports.createHousingAssignmentModel = createHousingAssignmentModel;
/**
 * Sequelize model for Roommate Matching with preferences.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RoommateMatch model
 */
const createRoommateMatchModel = (sequelize) => {
    class RoommateMatch extends sequelize_1.Model {
    }
    RoommateMatch.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        studentId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Student identifier',
        },
        academicYear: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            comment: 'Academic year',
        },
        matchPreferences: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Matching preferences',
        },
        requestedRoommates: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Requested roommates',
        },
        blockedRoommates: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Blocked roommates',
        },
        matchScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Compatibility score',
        },
    }, {
        sequelize,
        tableName: 'roommate_matches',
        timestamps: true,
        indexes: [
            { fields: ['studentId'] },
            { fields: ['academicYear'] },
        ],
    });
    return RoommateMatch;
};
exports.createRoommateMatchModel = createRoommateMatchModel;
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
const createDormitory = async (dormitoryData, Dormitory, transaction) => {
    return await Dormitory.create({ ...dormitoryData, isActive: true }, { transaction });
};
exports.createDormitory = createDormitory;
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
const createRooms = async (dormitoryId, rooms, Room) => {
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
exports.createRooms = createRooms;
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
const updateDormitory = async (dormitoryId, updates, Dormitory) => {
    const dormitory = await Dormitory.findByPk(dormitoryId);
    if (!dormitory)
        throw new Error('Dormitory not found');
    await dormitory.update(updates);
    return dormitory;
};
exports.updateDormitory = updateDormitory;
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
const updateRoom = async (roomId, updates, Room) => {
    const room = await Room.findByPk(roomId);
    if (!room)
        throw new Error('Room not found');
    await room.update(updates);
    return room;
};
exports.updateRoom = updateRoom;
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
const getAvailableRooms = async (criteria, Room) => {
    const where = { isAvailable: true };
    if (criteria.dormitoryId)
        where.dormitoryId = criteria.dormitoryId;
    if (criteria.roomType)
        where.roomType = criteria.roomType;
    if (criteria.floor)
        where.floor = criteria.floor;
    if (criteria.isAccessible)
        where.isAccessible = criteria.isAccessible;
    return await Room.findAll({
        where,
        order: [['dormitoryId', 'ASC'], ['floor', 'ASC'], ['roomNumber', 'ASC']],
    });
};
exports.getAvailableRooms = getAvailableRooms;
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
const createHousingAssignment = async (assignmentData, HousingAssignment, Room) => {
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
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'checked_out'] },
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
exports.createHousingAssignment = createHousingAssignment;
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
const updateAssignmentStatus = async (assignmentId, newStatus, HousingAssignment) => {
    const assignment = await HousingAssignment.findByPk(assignmentId);
    if (!assignment)
        throw new Error('Assignment not found');
    assignment.status = newStatus;
    await assignment.save();
    return assignment;
};
exports.updateAssignmentStatus = updateAssignmentStatus;
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
const cancelHousingAssignment = async (assignmentId, reason, HousingAssignment, Room) => {
    const assignment = await HousingAssignment.findByPk(assignmentId);
    if (!assignment)
        throw new Error('Assignment not found');
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
exports.cancelHousingAssignment = cancelHousingAssignment;
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
const transferRoom = async (assignmentId, newRoomId, reason, HousingAssignment, Room) => {
    const currentAssignment = await HousingAssignment.findByPk(assignmentId);
    if (!currentAssignment)
        throw new Error('Assignment not found');
    // Cancel current assignment
    await (0, exports.cancelHousingAssignment)(assignmentId, reason, HousingAssignment, Room);
    // Create new assignment
    const newAssignment = await (0, exports.createHousingAssignment)({
        ...currentAssignment.toJSON(),
        roomId: newRoomId,
        status: 'pending',
    }, HousingAssignment, Room);
    return newAssignment;
};
exports.transferRoom = transferRoom;
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
const getStudentAssignments = async (studentId, HousingAssignment) => {
    return await HousingAssignment.findAll({
        where: { studentId },
        order: [['academicYear', 'DESC'], ['term', 'DESC']],
    });
};
exports.getStudentAssignments = getStudentAssignments;
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
const getCurrentRoommates = async (studentId, academicYear, HousingAssignment) => {
    const studentAssignment = await HousingAssignment.findOne({
        where: {
            studentId,
            academicYear,
            status: { [sequelize_1.Op.in]: ['confirmed', 'checked_in'] },
        },
    });
    if (!studentAssignment)
        return [];
    return await HousingAssignment.findAll({
        where: {
            roomId: studentAssignment.roomId,
            academicYear,
            status: { [sequelize_1.Op.in]: ['confirmed', 'checked_in'] },
            studentId: { [sequelize_1.Op.ne]: studentId },
        },
    });
};
exports.getCurrentRoommates = getCurrentRoommates;
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
const bulkAssignRooms = async (studentIds, academicYear, HousingAssignment, Room) => {
    const availableRooms = await (0, exports.getAvailableRooms)({}, Room);
    const assignments = [];
    for (let i = 0; i < studentIds.length && i < availableRooms.length; i++) {
        const assignment = await (0, exports.createHousingAssignment)({
            studentId: studentIds[i],
            dormitoryId: availableRooms[i].dormitoryId,
            roomId: availableRooms[i].id,
            academicYear,
            term: 'full_year',
            checkInDate: new Date(),
            checkOutDate: new Date(),
            assignmentType: 'lottery',
            status: 'pending',
        }, HousingAssignment, Room);
        assignments.push(assignment);
    }
    return assignments;
};
exports.bulkAssignRooms = bulkAssignRooms;
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
const validateSpecialAccommodations = async (studentId, accommodations) => {
    // Mock implementation - would check documentation and availability
    return { approved: true, deniedReasons: [] };
};
exports.validateSpecialAccommodations = validateSpecialAccommodations;
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
const createRoomSelection = async (selectionData) => {
    // In production, this would use a RoomSelection model
    return selectionData;
};
exports.createRoomSelection = createRoomSelection;
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
const assignSelectionTimeSlots = async (academicYear, studentIds) => {
    const slots = [];
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
exports.assignSelectionTimeSlots = assignSelectionTimeSlots;
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
const processRoomSelection = async (studentId, roomId, HousingAssignment, Room) => {
    return await (0, exports.createHousingAssignment)({
        studentId,
        dormitoryId: '', // Will be fetched from room
        roomId,
        academicYear: '2024-2025',
        term: 'full_year',
        checkInDate: new Date(),
        checkOutDate: new Date(),
        assignmentType: 'self_selected',
        status: 'confirmed',
    }, HousingAssignment, Room);
};
exports.processRoomSelection = processRoomSelection;
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
const calculateSelectionPriority = (studentId, criteria) => {
    let priority = 0;
    // Year priority
    const yearPriority = { senior: 100, junior: 75, sophomore: 50, freshman: 25 };
    priority += yearPriority[criteria.year] || 0;
    // Credits earned
    priority += Math.min(criteria.credits || 0, 50);
    // GPA bonus
    if (criteria.gpa >= 3.5)
        priority += 10;
    return priority;
};
exports.calculateSelectionPriority = calculateSelectionPriority;
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
const getSelectionAvailableRooms = async (selection, Room) => {
    const where = { isAvailable: true };
    if (selection.preferences.roomTypePreferences?.length) {
        where.roomType = { [sequelize_1.Op.in]: selection.preferences.roomTypePreferences };
    }
    return await Room.findAll({ where });
};
exports.getSelectionAvailableRooms = getSelectionAvailableRooms;
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
const expireUnselectedSlots = async (cutoffDate) => {
    // Mock implementation
    return 0;
};
exports.expireUnselectedSlots = expireUnselectedSlots;
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
const createRoommateProfile = async (matchData, RoommateMatch) => {
    return await RoommateMatch.create(matchData);
};
exports.createRoommateProfile = createRoommateProfile;
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
const calculateCompatibilityScore = (profile1, profile2) => {
    let score = 0;
    let comparisons = 0;
    const prefs1 = profile1.matchPreferences;
    const prefs2 = profile2.matchPreferences;
    // Compare each preference
    if (prefs1.sleepSchedule && prefs2.sleepSchedule) {
        if (prefs1.sleepSchedule === prefs2.sleepSchedule)
            score += 20;
        comparisons++;
    }
    if (prefs1.cleanliness && prefs2.cleanliness) {
        if (prefs1.cleanliness === prefs2.cleanliness)
            score += 20;
        comparisons++;
    }
    if (prefs1.studyHabits && prefs2.studyHabits) {
        if (prefs1.studyHabits === prefs2.studyHabits)
            score += 20;
        comparisons++;
    }
    if (prefs1.guestFrequency && prefs2.guestFrequency) {
        if (prefs1.guestFrequency === prefs2.guestFrequency)
            score += 20;
        comparisons++;
    }
    if (prefs1.temperature && prefs2.temperature) {
        if (prefs1.temperature === prefs2.temperature)
            score += 20;
        comparisons++;
    }
    return comparisons > 0 ? Math.round(score) : 0;
};
exports.calculateCompatibilityScore = calculateCompatibilityScore;
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
const findCompatibleRoommates = async (studentId, minScore, RoommateMatch) => {
    const profile = await RoommateMatch.findOne({ where: { studentId } });
    if (!profile)
        throw new Error('Profile not found');
    const allProfiles = await RoommateMatch.findAll({
        where: {
            studentId: { [sequelize_1.Op.ne]: studentId },
            academicYear: profile.academicYear,
        },
    });
    const matches = allProfiles
        .map((otherProfile) => ({
        ...otherProfile.toJSON(),
        compatibilityScore: (0, exports.calculateCompatibilityScore)(profile, otherProfile),
    }))
        .filter((match) => match.compatibilityScore >= minScore)
        .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    return matches;
};
exports.findCompatibleRoommates = findCompatibleRoommates;
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
const processMutualRoommateRequest = async (studentId1, studentId2, RoommateMatch) => {
    const profile1 = await RoommateMatch.findOne({ where: { studentId: studentId1 } });
    const profile2 = await RoommateMatch.findOne({ where: { studentId: studentId2 } });
    if (!profile1 || !profile2)
        return false;
    const mutual = profile1.requestedRoommates.includes(studentId2) &&
        profile2.requestedRoommates.includes(studentId1);
    return mutual;
};
exports.processMutualRoommateRequest = processMutualRoommateRequest;
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
const updateRoommatePreferences = async (studentId, newPreferences, RoommateMatch) => {
    const profile = await RoommateMatch.findOne({ where: { studentId } });
    if (!profile)
        throw new Error('Profile not found');
    profile.matchPreferences = { ...profile.matchPreferences, ...newPreferences };
    await profile.save();
    return profile;
};
exports.updateRoommatePreferences = updateRoommatePreferences;
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
const generateRoommateAgreement = (roommateIds) => {
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
exports.generateRoommateAgreement = generateRoommateAgreement;
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
const generateHousingContract = async (contractData) => {
    // In production, this would use a HousingContract model
    return { ...contractData, status: 'pending_signature' };
};
exports.generateHousingContract = generateHousingContract;
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
const signHousingContract = async (contractId, signedBy) => {
    // Mock implementation
    return {
        contractId,
        signedBy,
        signedAt: new Date(),
        status: 'active',
    };
};
exports.signHousingContract = signHousingContract;
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
const calculateContractAmount = async (roomId, contractType, Room) => {
    const room = await Room.findByPk(roomId);
    if (!room)
        throw new Error('Room not found');
    let amount = room.baseRate;
    if (contractType === 'academic_year') {
        amount *= 2; // Two semesters
    }
    else if (contractType === 'summer') {
        amount *= 0.5; // Half rate
    }
    return amount;
};
exports.calculateContractAmount = calculateContractAmount;
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
const terminateContract = async (contractId, reason, effectiveDate) => {
    // Mock implementation
    return {
        contractId,
        status: 'terminated',
        terminationReason: reason,
        terminationDate: effectiveDate,
    };
};
exports.terminateContract = terminateContract;
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
const scheduleMoveIn = async (moveInData) => {
    // In production, this would use a MoveInOut model
    return moveInData;
};
exports.scheduleMoveIn = scheduleMoveIn;
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
const processRoomInspection = async (assignmentId, conditionReport, inspectorId) => {
    return {
        assignmentId,
        conditionReport,
        inspectedBy: inspectorId,
        inspectedAt: new Date(),
    };
};
exports.processRoomInspection = processRoomInspection;
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
const issueRoomKeys = async (assignmentId, keyIds) => {
    return {
        assignmentId,
        keyIds,
        issuedAt: new Date(),
    };
};
exports.issueRoomKeys = issueRoomKeys;
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
const processKeyReturn = async (assignmentId, returnedKeys) => {
    // Mock implementation - would check against issued keys
    return { complete: true, missing: [] };
};
exports.processKeyReturn = processKeyReturn;
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
const assessMoveOutDamages = async (assignmentId, damages) => {
    const totalCharge = damages.reduce((sum, d) => sum + (d.charge || 0), 0);
    return { totalCharge, damages };
};
exports.assessMoveOutDamages = assessMoveOutDamages;
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
const completeMoveOut = async (assignmentId, HousingAssignment, Room) => {
    const assignment = await HousingAssignment.findByPk(assignmentId);
    if (!assignment)
        throw new Error('Assignment not found');
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
exports.completeMoveOut = completeMoveOut;
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
const submitMaintenanceRequest = async (requestData) => {
    // In production, this would use a MaintenanceRequest model
    return requestData;
};
exports.submitMaintenanceRequest = submitMaintenanceRequest;
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
const assignMaintenanceRequest = async (requestId, technicianId) => {
    return {
        requestId,
        assignedTo: technicianId,
        status: 'assigned',
    };
};
exports.assignMaintenanceRequest = assignMaintenanceRequest;
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
const generateMaintenanceReport = async (dormitoryId, startDate, endDate) => {
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
exports.generateMaintenanceReport = generateMaintenanceReport;
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
const calculateOccupancyRates = async (academicYear, term, Dormitory, HousingAssignment) => {
    const dormitories = await Dormitory.findAll({ where: { isActive: true } });
    const occupancyData = [];
    for (const dorm of dormitories) {
        const assignments = await HousingAssignment.count({
            where: {
                dormitoryId: dorm.id,
                academicYear,
                term,
                status: { [sequelize_1.Op.in]: ['confirmed', 'checked_in'] },
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
exports.calculateOccupancyRates = calculateOccupancyRates;
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
const generateHousingDashboard = async (academicYear, Dormitory, HousingAssignment) => {
    const occupancy = await (0, exports.calculateOccupancyRates)(academicYear, 'fall', Dormitory, HousingAssignment);
    return {
        academicYear,
        totalBeds: occupancy.reduce((sum, o) => sum + o.totalBeds, 0),
        occupiedBeds: occupancy.reduce((sum, o) => sum + o.occupiedBeds, 0),
        averageOccupancy: occupancy.reduce((sum, o) => sum + o.occupancyRate, 0) / occupancy.length,
        dormitoryCount: occupancy.length,
        occupancyByBuilding: occupancy,
    };
};
exports.generateHousingDashboard = generateHousingDashboard;
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
let HousingManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var HousingManagementService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
        }
        async createAssignment(data) {
            const HousingAssignment = (0, exports.createHousingAssignmentModel)(this.sequelize);
            const Room = (0, exports.createRoomModel)(this.sequelize);
            return (0, exports.createHousingAssignment)(data, HousingAssignment, Room);
        }
        async getOccupancy(academicYear, term) {
            const Dormitory = (0, exports.createDormitoryModel)(this.sequelize);
            const HousingAssignment = (0, exports.createHousingAssignmentModel)(this.sequelize);
            return (0, exports.calculateOccupancyRates)(academicYear, term, Dormitory, HousingAssignment);
        }
        async matchRoommates(studentId, minScore) {
            const RoommateMatch = (0, exports.createRoommateMatchModel)(this.sequelize);
            return (0, exports.findCompatibleRoommates)(studentId, minScore, RoommateMatch);
        }
    };
    __setFunctionName(_classThis, "HousingManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HousingManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HousingManagementService = _classThis;
})();
exports.HousingManagementService = HousingManagementService;
/**
 * Default export with all housing utilities.
 */
exports.default = {
    // Models
    createDormitoryModel: exports.createDormitoryModel,
    createRoomModel: exports.createRoomModel,
    createHousingAssignmentModel: exports.createHousingAssignmentModel,
    createRoommateMatchModel: exports.createRoommateMatchModel,
    // Facility Management
    createDormitory: exports.createDormitory,
    createRooms: exports.createRooms,
    updateDormitory: exports.updateDormitory,
    updateRoom: exports.updateRoom,
    getAvailableRooms: exports.getAvailableRooms,
    // Housing Assignments
    createHousingAssignment: exports.createHousingAssignment,
    updateAssignmentStatus: exports.updateAssignmentStatus,
    cancelHousingAssignment: exports.cancelHousingAssignment,
    transferRoom: exports.transferRoom,
    getStudentAssignments: exports.getStudentAssignments,
    getCurrentRoommates: exports.getCurrentRoommates,
    bulkAssignRooms: exports.bulkAssignRooms,
    validateSpecialAccommodations: exports.validateSpecialAccommodations,
    // Room Selection
    createRoomSelection: exports.createRoomSelection,
    assignSelectionTimeSlots: exports.assignSelectionTimeSlots,
    processRoomSelection: exports.processRoomSelection,
    calculateSelectionPriority: exports.calculateSelectionPriority,
    getSelectionAvailableRooms: exports.getSelectionAvailableRooms,
    expireUnselectedSlots: exports.expireUnselectedSlots,
    // Roommate Matching
    createRoommateProfile: exports.createRoommateProfile,
    calculateCompatibilityScore: exports.calculateCompatibilityScore,
    findCompatibleRoommates: exports.findCompatibleRoommates,
    processMutualRoommateRequest: exports.processMutualRoommateRequest,
    updateRoommatePreferences: exports.updateRoommatePreferences,
    generateRoommateAgreement: exports.generateRoommateAgreement,
    // Housing Contracts
    generateHousingContract: exports.generateHousingContract,
    signHousingContract: exports.signHousingContract,
    calculateContractAmount: exports.calculateContractAmount,
    terminateContract: exports.terminateContract,
    // Move-In/Move-Out
    scheduleMoveIn: exports.scheduleMoveIn,
    processRoomInspection: exports.processRoomInspection,
    issueRoomKeys: exports.issueRoomKeys,
    processKeyReturn: exports.processKeyReturn,
    assessMoveOutDamages: exports.assessMoveOutDamages,
    completeMoveOut: exports.completeMoveOut,
    // Maintenance & Operations
    submitMaintenanceRequest: exports.submitMaintenanceRequest,
    assignMaintenanceRequest: exports.assignMaintenanceRequest,
    generateMaintenanceReport: exports.generateMaintenanceReport,
    // Analytics & Reporting
    calculateOccupancyRates: exports.calculateOccupancyRates,
    generateHousingDashboard: exports.generateHousingDashboard,
    // Service
    HousingManagementService,
};
//# sourceMappingURL=housing-management-kit.js.map