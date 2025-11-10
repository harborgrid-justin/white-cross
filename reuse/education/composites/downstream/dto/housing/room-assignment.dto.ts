/**
 * Room Assignment DTOs for managing student room assignments
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';

export enum RoomType {
  SINGLE = 'single',
  DOUBLE = 'double',
  TRIPLE = 'triple',
  QUAD = 'quad',
  SUITE = 'suite',
}

export enum RoomStatus {
  AVAILABLE = 'available',
  ASSIGNED = 'assigned',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance',
  CLOSED = 'closed',
}

export enum AssignmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  OCCUPIED = 'occupied',
  VACATED = 'vacated',
  CANCELLED = 'cancelled',
}

export class RoomAssignmentRequestDto {
  @ApiProperty({
    description: 'Housing application identifier',
    example: 'HOUSE-APP-2024001',
  })
  @IsString()
  @IsNotEmpty()
  applicationId: string;

  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Residence hall identifier',
    example: 'HALL-101',
  })
  @IsString()
  @IsNotEmpty()
  residenceHallId: string;

  @ApiProperty({
    description: 'Residence hall name',
    example: 'Thompson Hall',
  })
  @IsString()
  @IsNotEmpty()
  residenceHallName: string;

  @ApiProperty({
    description: 'Floor number',
    example: 3,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  floor: number;

  @ApiProperty({
    description: 'Room number',
    example: '301A',
  })
  @IsString()
  @IsNotEmpty()
  roomNumber: string;

  @ApiProperty({
    description: 'Room type',
    enum: RoomType,
  })
  @IsEnum(RoomType)
  roomType: RoomType;

  @ApiProperty({
    description: 'Bed capacity',
    example: 2,
    minimum: 1,
    maximum: 4,
  })
  @IsNumber()
  @Min(1)
  @Max(4)
  capacity: number;

  @ApiPropertyOptional({
    description: 'Roommate identifiers',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roommateIds?: string[];

  @ApiPropertyOptional({
    description: 'Special features',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialFeatures?: string[];

  @ApiProperty({
    description: 'Move-in date',
    example: '2025-08-20T00:00:00Z',
  })
  @Type(() => Date)
  moveInDate: Date;

  @ApiProperty({
    description: 'Move-out date',
    example: '2025-12-15T23:59:00Z',
  })
  @Type(() => Date)
  moveOutDate: Date;

  @ApiPropertyOptional({
    description: 'Assignment notes',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class RoomAssignmentResponseDto {
  @ApiProperty({
    description: 'Room assignment identifier',
    example: 'ROOM-ASSIGN-2024001',
  })
  assignmentId: string;

  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Student name',
    example: 'John Doe',
  })
  studentName: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiProperty({
    description: 'Assignment status',
    enum: AssignmentStatus,
  })
  status: AssignmentStatus;

  @ApiProperty({
    description: 'Residence hall',
    example: 'Thompson Hall',
  })
  residenceHall: string;

  @ApiProperty({
    description: 'Floor number',
    example: 3,
    minimum: 1,
  })
  floor: number;

  @ApiProperty({
    description: 'Room number',
    example: '301A',
  })
  roomNumber: string;

  @ApiProperty({
    description: 'Room type',
    enum: RoomType,
  })
  roomType: RoomType;

  @ApiProperty({
    description: 'Room capacity',
    example: 2,
    minimum: 1,
  })
  capacity: number;

  @ApiPropertyOptional({
    description: 'Assigned roommates',
    type: [String],
  })
  @IsOptional()
  roommates?: Array<{
    studentId: string;
    name: string;
  }>;

  @ApiProperty({
    description: 'Assignment date',
    example: '2025-07-15T10:00:00Z',
  })
  @Type(() => Date)
  assignmentDate: Date;

  @ApiProperty({
    description: 'Move-in date',
    example: '2025-08-20T00:00:00Z',
  })
  @Type(() => Date)
  moveInDate: Date;

  @ApiProperty({
    description: 'Move-out date',
    example: '2025-12-15T23:59:00Z',
  })
  @Type(() => Date)
  moveOutDate: Date;

  @ApiPropertyOptional({
    description: 'Confirmed date',
    example: '2025-07-20T14:30:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  confirmedDate?: Date;

  @ApiPropertyOptional({
    description: 'Occupancy date',
    example: '2025-08-20T14:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  occupancyDate?: Date;

  @ApiPropertyOptional({
    description: 'Vacancy date',
    example: '2025-12-15T17:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  vacancyDate?: Date;

  @ApiPropertyOptional({
    description: 'Assignment modifications',
    type: 'array',
  })
  @IsOptional()
  modifications?: Array<{
    date: Date;
    change: string;
    reason: string;
  }>;
}

export class RoomDto {
  @ApiProperty({
    description: 'Room identifier',
    example: 'ROOM-2024001',
  })
  roomId: string;

  @ApiProperty({
    description: 'Residence hall identifier',
    example: 'HALL-101',
  })
  residenceHallId: string;

  @ApiProperty({
    description: 'Residence hall name',
    example: 'Thompson Hall',
  })
  residenceHallName: string;

  @ApiProperty({
    description: 'Floor number',
    example: 3,
    minimum: 1,
  })
  floor: number;

  @ApiProperty({
    description: 'Room number',
    example: '301A',
  })
  roomNumber: string;

  @ApiProperty({
    description: 'Room type',
    enum: RoomType,
  })
  roomType: RoomType;

  @ApiProperty({
    description: 'Room capacity',
    example: 2,
    minimum: 1,
  })
  capacity: number;

  @ApiProperty({
    description: 'Current occupancy',
    example: 2,
    minimum: 0,
  })
  currentOccupancy: number;

  @ApiProperty({
    description: 'Room status',
    enum: RoomStatus,
  })
  status: RoomStatus;

  @ApiProperty({
    description: 'Square footage',
    example: 220.5,
    minimum: 0,
  })
  squareFootage: number;

  @ApiPropertyOptional({
    description: 'Special features',
    type: [String],
  })
  @IsOptional()
  specialFeatures?: string[];

  @ApiProperty({
    description: 'Assigned students',
    type: [String],
  })
  assignedStudents: string[];

  @ApiPropertyOptional({
    description: 'Room notes',
    maxLength: 500,
  })
  @IsOptional()
  notes?: string;
}

export class BulkRoomAssignmentDto {
  @ApiProperty({
    description: 'Room assignments',
    type: 'array',
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoomAssignmentRequestDto)
  assignments: RoomAssignmentRequestDto[];

  @ApiPropertyOptional({
    description: 'Process in parallel',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  parallel?: boolean;

  @ApiPropertyOptional({
    description: 'Notify students of assignments',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  notifyStudents?: boolean;
}

export class BulkAssignmentResultDto {
  @ApiProperty({
    description: 'Total assignments',
    example: 500,
    minimum: 0,
  })
  total: number;

  @ApiProperty({
    description: 'Successful assignments',
    example: 485,
    minimum: 0,
  })
  successful: number;

  @ApiProperty({
    description: 'Failed assignments',
    example: 15,
    minimum: 0,
  })
  failed: number;

  @ApiPropertyOptional({
    description: 'Errors encountered',
    type: 'array',
  })
  @IsOptional()
  errors?: Array<{
    studentId: string;
    reason: string;
  }>;

  @ApiProperty({
    description: 'Processing timestamp',
    example: '2025-07-15T10:00:00Z',
  })
  @Type(() => Date)
  processedAt: Date;
}

export class RoomAssignmentQueryDto {
  @ApiPropertyOptional({
    description: 'Student identifier filter',
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Residence hall filter',
  })
  @IsOptional()
  @IsString()
  residenceHall?: string;

  @ApiPropertyOptional({
    description: 'Assignment status filter',
    enum: AssignmentStatus,
  })
  @IsOptional()
  @IsEnum(AssignmentStatus)
  status?: AssignmentStatus;

  @ApiPropertyOptional({
    description: 'Room type filter',
    enum: RoomType,
  })
  @IsOptional()
  @IsEnum(RoomType)
  roomType?: RoomType;

  @ApiPropertyOptional({
    description: 'Academic term filter',
  })
  @IsOptional()
  @IsString()
  term?: string;

  @ApiPropertyOptional({
    description: 'Page number',
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page',
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class ResidenceHallOccupancyDto {
  @ApiProperty({
    description: 'Residence hall identifier',
    example: 'HALL-101',
  })
  hallId: string;

  @ApiProperty({
    description: 'Residence hall name',
    example: 'Thompson Hall',
  })
  hallName: string;

  @ApiProperty({
    description: 'Total rooms',
    example: 150,
    minimum: 0,
  })
  totalRooms: number;

  @ApiProperty({
    description: 'Total capacity',
    example: 300,
    minimum: 0,
  })
  totalCapacity: number;

  @ApiProperty({
    description: 'Currently occupied beds',
    example: 285,
    minimum: 0,
  })
  occupiedBeds: number;

  @ApiProperty({
    description: 'Available beds',
    example: 15,
    minimum: 0,
  })
  availableBeds: number;

  @ApiProperty({
    description: 'Occupancy rate percentage',
    example: 95,
    minimum: 0,
    maximum: 100,
  })
  occupancyRate: number;

  @ApiProperty({
    description: 'Room distribution by type',
    type: 'object',
  })
  roomDistribution: Record<RoomType, number>;

  @ApiProperty({
    description: 'Rooms by status',
    type: 'object',
  })
  byStatus: Record<RoomStatus, number>;
}

export class StudentRoomHistoryDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Room assignment history',
    type: 'array',
  })
  history: Array<{
    term: string;
    residenceHall: string;
    roomNumber: string;
    floor: number;
    moveInDate: Date;
    moveOutDate: Date;
    status: AssignmentStatus;
  }>;

  @ApiProperty({
    description: 'Current room assignment',
    type: 'object',
  })
  currentAssignment: {
    term: string;
    residenceHall: string;
    roomNumber: string;
    floor: number;
    roommates: string[];
  };

  @ApiProperty({
    description: 'Housing years completed',
    example: 2,
    minimum: 0,
  })
  yearsInHousing: number;
}
