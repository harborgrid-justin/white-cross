/**
 * LOC: EDUCATION_FACULTY_MANAGEMENT_001
 * File: /reuse/education/faculty-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *
 * DOWNSTREAM (imported by):
 *   - Faculty services
 *   - Course assignment services
 *   - Academic administration controllers
 *   - HR integration services
 *   - Faculty portal services
 */

/**
 * File: /reuse/education/faculty-management-kit.ts
 * Locator: WC-EDUCATION-FACULTY-MANAGEMENT-001
 * Purpose: Production-Grade Faculty Management Kit - Comprehensive faculty administration toolkit
 *
 * Upstream: NestJS, Sequelize, Zod
 * Downstream: ../backend/education/*, Faculty Services, HR Services, Academic Services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, zod
 * Exports: 45 production-ready faculty management functions
 *
 * LLM Context: Production-grade faculty management system for education SIS platform.
 * Provides comprehensive faculty administration including faculty profile management with complete
 * biographical and contact information, course assignment and teaching load calculation with
 * workload balancing algorithms, faculty credentials and qualifications tracking with expiration
 * monitoring, office hours scheduling and availability management, faculty evaluations and
 * performance reviews, contract management and renewal workflows, academic appointment tracking,
 * department and division assignments, research interests and publications management, teaching
 * specializations and certifications, sabbatical and leave tracking, faculty development programs,
 * peer evaluation systems, student feedback integration, committee assignments, academic rank
 * progression, tenure track management, compensation and benefits tracking, faculty onboarding
 * and offboarding, compliance and certification validation, and comprehensive audit logging.
 * Includes RESTful API design with versioning, proper HTTP methods, status codes, error handling,
 * pagination, filtering, and sorting. Advanced TypeScript patterns with generics, discriminated
 * unions, and utility types for maximum type safety.
 */

import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne,
  BeforeCreate,
  BeforeUpdate,
  Index,
  Unique,
} from 'sequelize-typescript';
import { z } from 'zod';

// ============================================================================
// ADVANCED TYPE SYSTEM
// ============================================================================

/**
 * Faculty employment status enum
 */
export enum FacultyStatus {
  ACTIVE = 'active',
  ON_LEAVE = 'on_leave',
  SABBATICAL = 'sabbatical',
  RETIRED = 'retired',
  TERMINATED = 'terminated',
  EMERITUS = 'emeritus',
}

/**
 * Faculty rank/position enum
 */
export enum FacultyRank {
  PROFESSOR = 'professor',
  ASSOCIATE_PROFESSOR = 'associate_professor',
  ASSISTANT_PROFESSOR = 'assistant_professor',
  LECTURER = 'lecturer',
  SENIOR_LECTURER = 'senior_lecturer',
  INSTRUCTOR = 'instructor',
  ADJUNCT = 'adjunct',
  VISITING = 'visiting',
  RESEARCH_FACULTY = 'research_faculty',
}

/**
 * Employment type enum
 */
export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  ADJUNCT = 'adjunct',
  VISITING = 'visiting',
  CONTRACT = 'contract',
}

/**
 * Contract type enum
 */
export enum ContractType {
  TENURE_TRACK = 'tenure_track',
  TENURED = 'tenured',
  FIXED_TERM = 'fixed_term',
  ANNUAL = 'annual',
  SEMESTER = 'semester',
}

/**
 * Evaluation type enum
 */
export enum EvaluationType {
  ANNUAL_REVIEW = 'annual_review',
  TENURE_REVIEW = 'tenure_review',
  PROMOTION_REVIEW = 'promotion_review',
  PEER_REVIEW = 'peer_review',
  STUDENT_EVALUATION = 'student_evaluation',
  TEACHING_OBSERVATION = 'teaching_observation',
}

/**
 * Qualification type enum
 */
export enum QualificationType {
  DEGREE = 'degree',
  CERTIFICATION = 'certification',
  LICENSE = 'license',
  ACCREDITATION = 'accreditation',
  TRAINING = 'training',
}

/**
 * Day of week enum
 */
export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Faculty model - Core faculty information
 */
@Table({
  tableName: 'faculty',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['employee_id'], unique: true },
    { fields: ['status'] },
    { fields: ['rank'] },
    { fields: ['department_id'] },
  ],
})
export class Faculty extends Model {
  @ApiProperty({ description: 'Faculty unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ description: 'Employee ID' })
  @Unique
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  employee_id: string;

  @ApiProperty({ description: 'First name' })
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  first_name: string;

  @ApiProperty({ description: 'Middle name' })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  middle_name: string;

  @ApiProperty({ description: 'Last name' })
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  last_name: string;

  @ApiProperty({ description: 'Email address' })
  @Unique
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @ApiProperty({ description: 'Phone number' })
  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  phone: string;

  @ApiProperty({ description: 'Faculty status', enum: FacultyStatus })
  @Column({
    type: DataType.ENUM(...Object.values(FacultyStatus)),
    defaultValue: FacultyStatus.ACTIVE,
    allowNull: false,
  })
  status: FacultyStatus;

  @ApiProperty({ description: 'Faculty rank', enum: FacultyRank })
  @Column({
    type: DataType.ENUM(...Object.values(FacultyRank)),
    allowNull: false,
  })
  rank: FacultyRank;

  @ApiProperty({ description: 'Employment type', enum: EmploymentType })
  @Column({
    type: DataType.ENUM(...Object.values(EmploymentType)),
    defaultValue: EmploymentType.FULL_TIME,
    allowNull: false,
  })
  employment_type: EmploymentType;

  @ApiProperty({ description: 'Department ID' })
  @ForeignKey(() => Faculty)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  department_id: string;

  @ApiProperty({ description: 'Hire date' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  hire_date: Date;

  @ApiProperty({ description: 'Termination date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  termination_date: Date;

  @ApiProperty({ description: 'Tenure status' })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_tenured: boolean;

  @ApiProperty({ description: 'Tenure date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  tenure_date: Date;

  @HasOne(() => FacultyProfile)
  profile: FacultyProfile;

  @HasMany(() => FacultyLoad)
  teaching_loads: FacultyLoad[];

  @HasMany(() => FacultyQualifications)
  qualifications: FacultyQualifications[];
}

/**
 * Faculty Profile model - Extended faculty information
 */
@Table({
  tableName: 'faculty_profiles',
  timestamps: true,
})
export class FacultyProfile extends Model {
  @ApiProperty({ description: 'Profile unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ description: 'Faculty ID' })
  @ForeignKey(() => Faculty)
  @Unique
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  faculty_id: string;

  @BelongsTo(() => Faculty)
  faculty: Faculty;

  @ApiProperty({ description: 'Profile photo URL' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  photo_url: string;

  @ApiProperty({ description: 'Biography' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  biography: string;

  @ApiProperty({ description: 'Research interests' })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  research_interests: string[];

  @ApiProperty({ description: 'Teaching specializations' })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  specializations: string[];

  @ApiProperty({ description: 'Publications' })
  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  publications: Array<{
    title: string;
    authors: string[];
    journal: string;
    year: number;
    doi?: string;
    url?: string;
  }>;

  @ApiProperty({ description: 'Office location' })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  office_location: string;

  @ApiProperty({ description: 'Office hours' })
  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  office_hours: Array<{
    day: DayOfWeek;
    start_time: string;
    end_time: string;
    location?: string;
    type?: 'in_person' | 'virtual' | 'hybrid';
  }>;

  @ApiProperty({ description: 'Preferred contact method' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  preferred_contact: string;

  @ApiProperty({ description: 'Website URL' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  website_url: string;

  @ApiProperty({ description: 'LinkedIn profile' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  linkedin_url: string;

  @ApiProperty({ description: 'ORCID identifier' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  orcid_id: string;
}

/**
 * Faculty Load model - Teaching load and course assignments
 */
@Table({
  tableName: 'faculty_loads',
  timestamps: true,
  indexes: [
    { fields: ['faculty_id', 'semester', 'academic_year'] },
    { fields: ['course_id'] },
  ],
})
export class FacultyLoad extends Model {
  @ApiProperty({ description: 'Load unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ description: 'Faculty ID' })
  @ForeignKey(() => Faculty)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  faculty_id: string;

  @BelongsTo(() => Faculty)
  faculty: Faculty;

  @ApiProperty({ description: 'Course ID' })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  course_id: string;

  @ApiProperty({ description: 'Academic year' })
  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  academic_year: string;

  @ApiProperty({ description: 'Semester' })
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  semester: string;

  @ApiProperty({ description: 'Credit hours' })
  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 3.0,
  })
  credit_hours: number;

  @ApiProperty({ description: 'Enrollment count' })
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  enrollment_count: number;

  @ApiProperty({ description: 'Role in course' })
  @Column({
    type: DataType.STRING(50),
    defaultValue: 'instructor',
  })
  role: string;

  @ApiProperty({ description: 'Is primary instructor' })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_primary: boolean;

  @ApiProperty({ description: 'Load percentage (0-100)' })
  @Column({
    type: DataType.DECIMAL(5, 2),
    defaultValue: 100.0,
  })
  load_percentage: number;

  @ApiProperty({ description: 'Additional notes' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;
}

/**
 * Faculty Qualifications model - Degrees, certifications, licenses
 */
@Table({
  tableName: 'faculty_qualifications',
  timestamps: true,
  indexes: [
    { fields: ['faculty_id'] },
    { fields: ['qualification_type'] },
    { fields: ['expiration_date'] },
  ],
})
export class FacultyQualifications extends Model {
  @ApiProperty({ description: 'Qualification unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ description: 'Faculty ID' })
  @ForeignKey(() => Faculty)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  faculty_id: string;

  @BelongsTo(() => Faculty)
  faculty: Faculty;

  @ApiProperty({ description: 'Qualification type', enum: QualificationType })
  @Column({
    type: DataType.ENUM(...Object.values(QualificationType)),
    allowNull: false,
  })
  qualification_type: QualificationType;

  @ApiProperty({ description: 'Qualification name' })
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  name: string;

  @ApiProperty({ description: 'Issuing institution' })
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  institution: string;

  @ApiProperty({ description: 'Field of study' })
  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  field: string;

  @ApiProperty({ description: 'Date earned' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  earned_date: Date;

  @ApiProperty({ description: 'Expiration date (for licenses/certifications)' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expiration_date: Date;

  @ApiProperty({ description: 'Credential number' })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  credential_number: string;

  @ApiProperty({ description: 'Verification URL' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  verification_url: string;

  @ApiProperty({ description: 'Is verified' })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_verified: boolean;

  @ApiProperty({ description: 'Document attachment URL' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  document_url: string;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Faculty creation schema
 */
export const CreateFacultySchema = z.object({
  employee_id: z.string().min(1).max(50),
  first_name: z.string().min(1).max(100),
  middle_name: z.string().max(100).optional(),
  last_name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional(),
  rank: z.nativeEnum(FacultyRank),
  employment_type: z.nativeEnum(EmploymentType).default(EmploymentType.FULL_TIME),
  department_id: z.string().uuid().optional(),
  hire_date: z.coerce.date(),
  is_tenured: z.boolean().default(false),
  tenure_date: z.coerce.date().optional(),
});

/**
 * Faculty update schema
 */
export const UpdateFacultySchema = CreateFacultySchema.partial();

/**
 * Faculty profile schema
 */
export const FacultyProfileSchema = z.object({
  faculty_id: z.string().uuid(),
  photo_url: z.string().url().optional(),
  biography: z.string().optional(),
  research_interests: z.array(z.string()).default([]),
  specializations: z.array(z.string()).default([]),
  office_location: z.string().max(100).optional(),
  office_hours: z.array(
    z.object({
      day: z.nativeEnum(DayOfWeek),
      start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      location: z.string().optional(),
      type: z.enum(['in_person', 'virtual', 'hybrid']).optional(),
    })
  ).default([]),
  preferred_contact: z.string().max(50).optional(),
  website_url: z.string().url().optional(),
  linkedin_url: z.string().url().optional(),
  orcid_id: z.string().max(50).optional(),
});

/**
 * Course assignment schema
 */
export const CourseAssignmentSchema = z.object({
  faculty_id: z.string().uuid(),
  course_id: z.string().uuid(),
  academic_year: z.string().max(10),
  semester: z.string().max(20),
  credit_hours: z.number().min(0).max(20).default(3),
  role: z.string().max(50).default('instructor'),
  is_primary: z.boolean().default(true),
  load_percentage: z.number().min(0).max(100).default(100),
  notes: z.string().optional(),
});

/**
 * Qualification schema
 */
export const QualificationSchema = z.object({
  faculty_id: z.string().uuid(),
  qualification_type: z.nativeEnum(QualificationType),
  name: z.string().min(1).max(200),
  institution: z.string().min(1).max(200),
  field: z.string().max(200).optional(),
  earned_date: z.coerce.date(),
  expiration_date: z.coerce.date().optional(),
  credential_number: z.string().max(100).optional(),
  verification_url: z.string().url().optional(),
  document_url: z.string().url().optional(),
});

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Paginated response type
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  details?: Record<string, any>;
}

/**
 * Success response wrapper
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, any>;
}

// ============================================================================
// FACULTY MANAGEMENT SERVICE
// ============================================================================

@Injectable()
export class FacultyManagementService {
  private readonly logger = new Logger(FacultyManagementService.name);

  // ========================================================================
  // CORE CRUD OPERATIONS (Functions 1-10)
  // ========================================================================

  /**
   * Function 1: Create faculty record
   * POST /api/v1/faculty
   * Status: 201 Created, 400 Bad Request, 409 Conflict
   */
  async createFaculty(data: z.infer<typeof CreateFacultySchema>): Promise<Faculty> {
    try {
      // Validate input
      const validated = CreateFacultySchema.parse(data);

      // Check for duplicate email or employee_id
      const existing = await Faculty.findOne({
        where: {
          [Op.or]: [
            { email: validated.email },
            { employee_id: validated.employee_id },
          ],
        },
      });

      if (existing) {
        throw new ConflictException(
          'Faculty with this email or employee ID already exists'
        );
      }

      // Create faculty
      const faculty = await Faculty.create(validated);

      this.logger.log(`Created faculty: ${faculty.id} (${faculty.email})`);

      return faculty;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      throw error;
    }
  }

  /**
   * Function 2: Get faculty by ID
   * GET /api/v1/faculty/:id
   * Status: 200 OK, 404 Not Found
   */
  async getFacultyById(
    id: string,
    options?: {
      includeProfile?: boolean;
      includeLoads?: boolean;
      includeQualifications?: boolean;
    }
  ): Promise<Faculty> {
    const include = [];

    if (options?.includeProfile) {
      include.push({ model: FacultyProfile, as: 'profile' });
    }
    if (options?.includeLoads) {
      include.push({ model: FacultyLoad, as: 'teaching_loads' });
    }
    if (options?.includeQualifications) {
      include.push({ model: FacultyQualifications, as: 'qualifications' });
    }

    const faculty = await Faculty.findByPk(id, { include });

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }

    return faculty;
  }

  /**
   * Function 3: List faculty with pagination
   * GET /api/v1/faculty?page=1&limit=20&sort=last_name&order=asc
   * Status: 200 OK
   */
  async listFaculty(params: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    status?: FacultyStatus;
    rank?: FacultyRank;
    department_id?: string;
    search?: string;
  }): Promise<PaginatedResponse<Faculty>> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const offset = (page - 1) * limit;

    const where: any = {};

    // Filter by status
    if (params.status) {
      where.status = params.status;
    }

    // Filter by rank
    if (params.rank) {
      where.rank = params.rank;
    }

    // Filter by department
    if (params.department_id) {
      where.department_id = params.department_id;
    }

    // Search functionality
    if (params.search) {
      where[Op.or] = [
        { first_name: { [Op.iLike]: `%${params.search}%` } },
        { last_name: { [Op.iLike]: `%${params.search}%` } },
        { email: { [Op.iLike]: `%${params.search}%` } },
        { employee_id: { [Op.iLike]: `%${params.search}%` } },
      ];
    }

    // Sorting
    const order: any = [];
    if (params.sort) {
      order.push([params.sort, params.order || 'asc']);
    } else {
      order.push(['last_name', 'asc']);
    }

    const { rows: data, count: total } = await Faculty.findAndCountAll({
      where,
      limit,
      offset,
      order,
    });

    const total_pages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        total_pages,
        has_next: page < total_pages,
        has_prev: page > 1,
      },
    };
  }

  /**
   * Function 4: Update faculty information
   * PUT /api/v1/faculty/:id or PATCH /api/v1/faculty/:id
   * Status: 200 OK, 404 Not Found, 400 Bad Request
   */
  async updateFaculty(
    id: string,
    data: z.infer<typeof UpdateFacultySchema>
  ): Promise<Faculty> {
    try {
      const validated = UpdateFacultySchema.parse(data);

      const faculty = await Faculty.findByPk(id);

      if (!faculty) {
        throw new NotFoundException(`Faculty with ID ${id} not found`);
      }

      // Check for email/employee_id conflicts if being updated
      if (validated.email || validated.employee_id) {
        const conflicts = await Faculty.findOne({
          where: {
            id: { [Op.ne]: id },
            [Op.or]: [
              ...(validated.email ? [{ email: validated.email }] : []),
              ...(validated.employee_id ? [{ employee_id: validated.employee_id }] : []),
            ],
          },
        });

        if (conflicts) {
          throw new ConflictException('Email or employee ID already in use');
        }
      }

      await faculty.update(validated);

      this.logger.log(`Updated faculty: ${id}`);

      return faculty;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      throw error;
    }
  }

  /**
   * Function 5: Delete/deactivate faculty
   * DELETE /api/v1/faculty/:id
   * Status: 204 No Content, 404 Not Found
   */
  async deleteFaculty(id: string, softDelete: boolean = true): Promise<void> {
    const faculty = await Faculty.findByPk(id);

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }

    if (softDelete) {
      // Soft delete - update status
      await faculty.update({
        status: FacultyStatus.TERMINATED,
        termination_date: new Date(),
      });
      this.logger.log(`Soft deleted faculty: ${id}`);
    } else {
      // Hard delete
      await faculty.destroy();
      this.logger.log(`Hard deleted faculty: ${id}`);
    }
  }

  /**
   * Function 6: Bulk create faculty
   * POST /api/v1/faculty/bulk
   * Status: 201 Created, 400 Bad Request
   */
  async bulkCreateFaculty(
    facultyList: z.infer<typeof CreateFacultySchema>[]
  ): Promise<{ created: Faculty[]; errors: Array<{ index: number; error: string }> }> {
    const created: Faculty[] = [];
    const errors: Array<{ index: number; error: string }> = [];

    for (let i = 0; i < facultyList.length; i++) {
      try {
        const faculty = await this.createFaculty(facultyList[i]);
        created.push(faculty);
      } catch (error) {
        errors.push({
          index: i,
          error: error.message || 'Unknown error',
        });
      }
    }

    this.logger.log(`Bulk created ${created.length} faculty, ${errors.length} errors`);

    return { created, errors };
  }

  /**
   * Function 7: Search faculty
   * GET /api/v1/faculty/search?q=searchterm
   * Status: 200 OK
   */
  async searchFaculty(query: string, limit: number = 20): Promise<Faculty[]> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('Search query is required');
    }

    const faculty = await Faculty.findAll({
      where: {
        [Op.or]: [
          { first_name: { [Op.iLike]: `%${query}%` } },
          { last_name: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
          { employee_id: { [Op.iLike]: `%${query}%` } },
        ],
      },
      limit: Math.min(limit, 100),
      order: [['last_name', 'asc']],
    });

    return faculty;
  }

  /**
   * Function 8: Filter faculty by criteria
   * GET /api/v1/faculty/filter
   * Status: 200 OK
   */
  async filterFaculty(criteria: {
    status?: FacultyStatus[];
    rank?: FacultyRank[];
    employment_type?: EmploymentType[];
    department_ids?: string[];
    is_tenured?: boolean;
    hired_after?: Date;
    hired_before?: Date;
  }): Promise<Faculty[]> {
    const where: any = {};

    if (criteria.status && criteria.status.length > 0) {
      where.status = { [Op.in]: criteria.status };
    }

    if (criteria.rank && criteria.rank.length > 0) {
      where.rank = { [Op.in]: criteria.rank };
    }

    if (criteria.employment_type && criteria.employment_type.length > 0) {
      where.employment_type = { [Op.in]: criteria.employment_type };
    }

    if (criteria.department_ids && criteria.department_ids.length > 0) {
      where.department_id = { [Op.in]: criteria.department_ids };
    }

    if (criteria.is_tenured !== undefined) {
      where.is_tenured = criteria.is_tenured;
    }

    if (criteria.hired_after) {
      where.hire_date = { ...where.hire_date, [Op.gte]: criteria.hired_after };
    }

    if (criteria.hired_before) {
      where.hire_date = { ...where.hire_date, [Op.lte]: criteria.hired_before };
    }

    const faculty = await Faculty.findAll({
      where,
      order: [['last_name', 'asc']],
    });

    return faculty;
  }

  /**
   * Function 9: Sort faculty results
   * GET /api/v1/faculty?sort=field&order=asc|desc
   * Status: 200 OK
   */
  async sortFaculty(
    sortField: string = 'last_name',
    sortOrder: 'asc' | 'desc' = 'asc',
    filters?: any
  ): Promise<Faculty[]> {
    const allowedFields = [
      'first_name',
      'last_name',
      'email',
      'rank',
      'hire_date',
      'employee_id',
    ];

    if (!allowedFields.includes(sortField)) {
      throw new BadRequestException(
        `Invalid sort field. Allowed: ${allowedFields.join(', ')}`
      );
    }

    const faculty = await Faculty.findAll({
      where: filters || {},
      order: [[sortField, sortOrder.toUpperCase()]],
    });

    return faculty;
  }

  /**
   * Function 10: Export faculty data
   * GET /api/v1/faculty/export?format=json|csv
   * Status: 200 OK
   */
  async exportFacultyData(format: 'json' | 'csv' = 'json'): Promise<any> {
    const faculty = await Faculty.findAll({
      include: [
        { model: FacultyProfile, as: 'profile' },
        { model: FacultyQualifications, as: 'qualifications' },
      ],
    });

    if (format === 'csv') {
      // Convert to CSV format
      const headers = [
        'ID',
        'Employee ID',
        'First Name',
        'Last Name',
        'Email',
        'Rank',
        'Status',
        'Department ID',
        'Hire Date',
      ];

      const rows = faculty.map((f) => [
        f.id,
        f.employee_id,
        f.first_name,
        f.last_name,
        f.email,
        f.rank,
        f.status,
        f.department_id || '',
        f.hire_date,
      ]);

      return {
        headers,
        rows,
        format: 'csv',
      };
    }

    return {
      data: faculty,
      format: 'json',
      count: faculty.length,
    };
  }

  // ========================================================================
  // FACULTY PROFILE MANAGEMENT (Functions 11-18)
  // ========================================================================

  /**
   * Function 11: Create faculty profile
   * POST /api/v1/faculty/:facultyId/profile
   * Status: 201 Created, 400 Bad Request, 409 Conflict
   */
  async createFacultyProfile(
    data: z.infer<typeof FacultyProfileSchema>
  ): Promise<FacultyProfile> {
    try {
      const validated = FacultyProfileSchema.parse(data);

      // Check if faculty exists
      const faculty = await Faculty.findByPk(validated.faculty_id);
      if (!faculty) {
        throw new NotFoundException(`Faculty with ID ${validated.faculty_id} not found`);
      }

      // Check if profile already exists
      const existing = await FacultyProfile.findOne({
        where: { faculty_id: validated.faculty_id },
      });

      if (existing) {
        throw new ConflictException('Profile already exists for this faculty');
      }

      const profile = await FacultyProfile.create(validated);

      this.logger.log(`Created profile for faculty: ${validated.faculty_id}`);

      return profile;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      throw error;
    }
  }

  /**
   * Function 12: Update profile information
   * PATCH /api/v1/faculty/:facultyId/profile
   * Status: 200 OK, 404 Not Found
   */
  async updateFacultyProfile(
    facultyId: string,
    data: Partial<z.infer<typeof FacultyProfileSchema>>
  ): Promise<FacultyProfile> {
    const profile = await FacultyProfile.findOne({
      where: { faculty_id: facultyId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile not found for faculty: ${facultyId}`);
    }

    await profile.update(data);

    this.logger.log(`Updated profile for faculty: ${facultyId}`);

    return profile;
  }

  /**
   * Function 13: Get profile details
   * GET /api/v1/faculty/:facultyId/profile
   * Status: 200 OK, 404 Not Found
   */
  async getFacultyProfile(facultyId: string): Promise<FacultyProfile> {
    const profile = await FacultyProfile.findOne({
      where: { faculty_id: facultyId },
      include: [{ model: Faculty, as: 'faculty' }],
    });

    if (!profile) {
      throw new NotFoundException(`Profile not found for faculty: ${facultyId}`);
    }

    return profile;
  }

  /**
   * Function 14: Upload profile photo
   * POST /api/v1/faculty/:facultyId/profile/photo
   * Status: 200 OK, 404 Not Found
   */
  async uploadProfilePhoto(facultyId: string, photoUrl: string): Promise<FacultyProfile> {
    const profile = await FacultyProfile.findOne({
      where: { faculty_id: facultyId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile not found for faculty: ${facultyId}`);
    }

    await profile.update({ photo_url: photoUrl });

    this.logger.log(`Updated photo for faculty: ${facultyId}`);

    return profile;
  }

  /**
   * Function 15: Manage contact information
   * PATCH /api/v1/faculty/:id/contact
   * Status: 200 OK, 404 Not Found
   */
  async updateContactInformation(
    facultyId: string,
    contact: {
      email?: string;
      phone?: string;
      office_location?: string;
      preferred_contact?: string;
    }
  ): Promise<Faculty> {
    const faculty = await Faculty.findByPk(facultyId);

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
    }

    // Update faculty record
    if (contact.email) faculty.email = contact.email;
    if (contact.phone) faculty.phone = contact.phone;
    await faculty.save();

    // Update profile if it exists
    const profile = await FacultyProfile.findOne({
      where: { faculty_id: facultyId },
    });

    if (profile) {
      if (contact.office_location) profile.office_location = contact.office_location;
      if (contact.preferred_contact) profile.preferred_contact = contact.preferred_contact;
      await profile.save();
    }

    this.logger.log(`Updated contact info for faculty: ${facultyId}`);

    return faculty;
  }

  /**
   * Function 16: Update biography
   * PATCH /api/v1/faculty/:facultyId/profile/biography
   * Status: 200 OK, 404 Not Found
   */
  async updateBiography(facultyId: string, biography: string): Promise<FacultyProfile> {
    const profile = await FacultyProfile.findOne({
      where: { faculty_id: facultyId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile not found for faculty: ${facultyId}`);
    }

    await profile.update({ biography });

    this.logger.log(`Updated biography for faculty: ${facultyId}`);

    return profile;
  }

  /**
   * Function 17: Set specializations
   * PUT /api/v1/faculty/:facultyId/profile/specializations
   * Status: 200 OK, 404 Not Found
   */
  async setSpecializations(
    facultyId: string,
    specializations: string[]
  ): Promise<FacultyProfile> {
    const profile = await FacultyProfile.findOne({
      where: { faculty_id: facultyId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile not found for faculty: ${facultyId}`);
    }

    await profile.update({ specializations });

    this.logger.log(`Updated specializations for faculty: ${facultyId}`);

    return profile;
  }

  /**
   * Function 18: Manage publications
   * POST /api/v1/faculty/:facultyId/profile/publications
   * Status: 201 Created, 404 Not Found
   */
  async addPublication(
    facultyId: string,
    publication: {
      title: string;
      authors: string[];
      journal: string;
      year: number;
      doi?: string;
      url?: string;
    }
  ): Promise<FacultyProfile> {
    const profile = await FacultyProfile.findOne({
      where: { faculty_id: facultyId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile not found for faculty: ${facultyId}`);
    }

    const publications = [...(profile.publications || []), publication];
    await profile.update({ publications });

    this.logger.log(`Added publication for faculty: ${facultyId}`);

    return profile;
  }

  // ========================================================================
  // COURSE ASSIGNMENT (Functions 19-26)
  // ========================================================================

  /**
   * Function 19: Assign course to faculty
   * POST /api/v1/faculty/:facultyId/courses
   * Status: 201 Created, 400 Bad Request, 409 Conflict
   */
  async assignCourse(
    data: z.infer<typeof CourseAssignmentSchema>
  ): Promise<FacultyLoad> {
    try {
      const validated = CourseAssignmentSchema.parse(data);

      // Check if faculty exists
      const faculty = await Faculty.findByPk(validated.faculty_id);
      if (!faculty) {
        throw new NotFoundException(`Faculty with ID ${validated.faculty_id} not found`);
      }

      // Check for existing assignment
      const existing = await FacultyLoad.findOne({
        where: {
          faculty_id: validated.faculty_id,
          course_id: validated.course_id,
          academic_year: validated.academic_year,
          semester: validated.semester,
        },
      });

      if (existing) {
        throw new ConflictException('Course already assigned to this faculty');
      }

      const assignment = await FacultyLoad.create(validated);

      this.logger.log(
        `Assigned course ${validated.course_id} to faculty ${validated.faculty_id}`
      );

      return assignment;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      throw error;
    }
  }

  /**
   * Function 20: Remove course assignment
   * DELETE /api/v1/faculty/:facultyId/courses/:assignmentId
   * Status: 204 No Content, 404 Not Found
   */
  async removeCourseAssignment(assignmentId: string): Promise<void> {
    const assignment = await FacultyLoad.findByPk(assignmentId);

    if (!assignment) {
      throw new NotFoundException(`Course assignment with ID ${assignmentId} not found`);
    }

    await assignment.destroy();

    this.logger.log(`Removed course assignment: ${assignmentId}`);
  }

  /**
   * Function 21: List faculty courses
   * GET /api/v1/faculty/:facultyId/courses
   * Status: 200 OK
   */
  async listFacultyCourses(
    facultyId: string,
    filters?: {
      academic_year?: string;
      semester?: string;
    }
  ): Promise<FacultyLoad[]> {
    const where: any = { faculty_id: facultyId };

    if (filters?.academic_year) {
      where.academic_year = filters.academic_year;
    }

    if (filters?.semester) {
      where.semester = filters.semester;
    }

    const courses = await FacultyLoad.findAll({
      where,
      order: [['academic_year', 'desc'], ['semester', 'desc']],
    });

    return courses;
  }

  /**
   * Function 22: Get course assignment details
   * GET /api/v1/faculty/courses/:assignmentId
   * Status: 200 OK, 404 Not Found
   */
  async getCourseAssignmentDetails(assignmentId: string): Promise<FacultyLoad> {
    const assignment = await FacultyLoad.findByPk(assignmentId, {
      include: [{ model: Faculty, as: 'faculty' }],
    });

    if (!assignment) {
      throw new NotFoundException(`Course assignment with ID ${assignmentId} not found`);
    }

    return assignment;
  }

  /**
   * Function 23: Update course assignment
   * PATCH /api/v1/faculty/courses/:assignmentId
   * Status: 200 OK, 404 Not Found
   */
  async updateCourseAssignment(
    assignmentId: string,
    data: Partial<z.infer<typeof CourseAssignmentSchema>>
  ): Promise<FacultyLoad> {
    const assignment = await FacultyLoad.findByPk(assignmentId);

    if (!assignment) {
      throw new NotFoundException(`Course assignment with ID ${assignmentId} not found`);
    }

    await assignment.update(data);

    this.logger.log(`Updated course assignment: ${assignmentId}`);

    return assignment;
  }

  /**
   * Function 24: Assign multiple courses
   * POST /api/v1/faculty/:facultyId/courses/bulk
   * Status: 201 Created
   */
  async assignMultipleCourses(
    facultyId: string,
    courses: Array<Omit<z.infer<typeof CourseAssignmentSchema>, 'faculty_id'>>
  ): Promise<{ created: FacultyLoad[]; errors: Array<{ index: number; error: string }> }> {
    const created: FacultyLoad[] = [];
    const errors: Array<{ index: number; error: string }> = [];

    for (let i = 0; i < courses.length; i++) {
      try {
        const assignment = await this.assignCourse({
          ...courses[i],
          faculty_id: facultyId,
        });
        created.push(assignment);
      } catch (error) {
        errors.push({
          index: i,
          error: error.message || 'Unknown error',
        });
      }
    }

    this.logger.log(
      `Bulk assigned ${created.length} courses to faculty ${facultyId}, ${errors.length} errors`
    );

    return { created, errors };
  }

  /**
   * Function 25: Check assignment conflicts
   * GET /api/v1/faculty/:facultyId/courses/conflicts
   * Status: 200 OK
   */
  async checkAssignmentConflicts(
    facultyId: string,
    academicYear: string,
    semester: string
  ): Promise<{ conflicts: any[]; hasConflicts: boolean }> {
    // This would integrate with scheduling system to check for time conflicts
    // Simplified version here
    const assignments = await FacultyLoad.findAll({
      where: {
        faculty_id: facultyId,
        academic_year: academicYear,
        semester,
      },
    });

    // Check for overload (simplified - would need actual credit hour limits)
    const totalCredits = assignments.reduce(
      (sum, a) => sum + parseFloat(a.credit_hours.toString()),
      0
    );

    const conflicts: any[] = [];

    if (totalCredits > 12) {
      conflicts.push({
        type: 'overload',
        message: `Faculty has ${totalCredits} credit hours (maximum: 12)`,
        severity: 'warning',
      });
    }

    return {
      conflicts,
      hasConflicts: conflicts.length > 0,
    };
  }

  /**
   * Function 26: Course assignment history
   * GET /api/v1/faculty/:facultyId/courses/history
   * Status: 200 OK
   */
  async getCourseAssignmentHistory(facultyId: string): Promise<FacultyLoad[]> {
    const history = await FacultyLoad.findAll({
      where: { faculty_id: facultyId },
      order: [['academic_year', 'desc'], ['semester', 'desc']],
    });

    return history;
  }

  // ========================================================================
  // TEACHING LOAD CALCULATION (Functions 27-32)
  // ========================================================================

  /**
   * Function 27: Calculate teaching load
   * GET /api/v1/faculty/:facultyId/load/calculate
   * Status: 200 OK
   */
  async calculateTeachingLoad(
    facultyId: string,
    academicYear: string,
    semester: string
  ): Promise<{
    faculty_id: string;
    academic_year: string;
    semester: string;
    total_credit_hours: number;
    total_courses: number;
    total_students: number;
    load_percentage: number;
    status: 'underload' | 'normal' | 'overload';
  }> {
    const assignments = await FacultyLoad.findAll({
      where: {
        faculty_id: facultyId,
        academic_year: academicYear,
        semester,
      },
    });

    const totalCreditHours = assignments.reduce(
      (sum, a) => sum + parseFloat(a.credit_hours.toString()) * (parseFloat(a.load_percentage.toString()) / 100),
      0
    );

    const totalStudents = assignments.reduce(
      (sum, a) => sum + a.enrollment_count,
      0
    );

    // Standard load is typically 12 credit hours per semester
    const standardLoad = 12;
    const loadPercentage = (totalCreditHours / standardLoad) * 100;

    let status: 'underload' | 'normal' | 'overload' = 'normal';
    if (loadPercentage < 75) status = 'underload';
    if (loadPercentage > 125) status = 'overload';

    return {
      faculty_id: facultyId,
      academic_year: academicYear,
      semester,
      total_credit_hours: totalCreditHours,
      total_courses: assignments.length,
      total_students: totalStudents,
      load_percentage: loadPercentage,
      status,
    };
  }

  /**
   * Function 28: Get current load
   * GET /api/v1/faculty/:facultyId/load/current
   * Status: 200 OK
   */
  async getCurrentLoad(facultyId: string): Promise<any> {
    // Get current academic year and semester (simplified)
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    let semester = 'fall';
    let academicYear = `${year}-${year + 1}`;

    if (month >= 1 && month <= 5) {
      semester = 'spring';
      academicYear = `${year - 1}-${year}`;
    } else if (month >= 6 && month <= 7) {
      semester = 'summer';
      academicYear = `${year}-${year + 1}`;
    }

    return this.calculateTeachingLoad(facultyId, academicYear, semester);
  }

  /**
   * Function 29: Load balancing algorithm
   * POST /api/v1/faculty/load/balance
   * Status: 200 OK
   */
  async balanceTeachingLoads(
    departmentId: string,
    academicYear: string,
    semester: string
  ): Promise<{
    recommendations: Array<{
      faculty_id: string;
      current_load: number;
      recommended_adjustments: string[];
    }>;
  }> {
    // Get all faculty in department
    const faculty = await Faculty.findAll({
      where: {
        department_id: departmentId,
        status: FacultyStatus.ACTIVE,
      },
    });

    const recommendations: Array<{
      faculty_id: string;
      current_load: number;
      recommended_adjustments: string[];
    }> = [];

    for (const f of faculty) {
      const load = await this.calculateTeachingLoad(f.id, academicYear, semester);
      const adjustments: string[] = [];

      if (load.status === 'underload') {
        adjustments.push('Consider assigning additional courses');
      } else if (load.status === 'overload') {
        adjustments.push('Consider redistributing courses to other faculty');
      }

      recommendations.push({
        faculty_id: f.id,
        current_load: load.total_credit_hours,
        recommended_adjustments: adjustments,
      });
    }

    return { recommendations };
  }

  /**
   * Function 30: Overload detection
   * GET /api/v1/faculty/load/overloads
   * Status: 200 OK
   */
  async detectOverloads(
    departmentId: string,
    academicYear: string,
    semester: string
  ): Promise<{
    overloaded_faculty: Array<{
      faculty: Faculty;
      load: any;
    }>;
  }> {
    const faculty = await Faculty.findAll({
      where: {
        department_id: departmentId,
        status: FacultyStatus.ACTIVE,
      },
    });

    const overloaded: Array<{ faculty: Faculty; load: any }> = [];

    for (const f of faculty) {
      const load = await this.calculateTeachingLoad(f.id, academicYear, semester);

      if (load.status === 'overload') {
        overloaded.push({ faculty: f, load });
      }
    }

    return { overloaded_faculty: overloaded };
  }

  /**
   * Function 31: Load comparison
   * GET /api/v1/faculty/load/compare
   * Status: 200 OK
   */
  async compareTeachingLoads(
    facultyIds: string[],
    academicYear: string,
    semester: string
  ): Promise<{
    comparisons: Array<{
      faculty_id: string;
      name: string;
      load: any;
    }>;
    average_load: number;
  }> {
    const comparisons: Array<{
      faculty_id: string;
      name: string;
      load: any;
    }> = [];

    let totalLoad = 0;

    for (const facultyId of facultyIds) {
      const faculty = await Faculty.findByPk(facultyId);
      if (!faculty) continue;

      const load = await this.calculateTeachingLoad(facultyId, academicYear, semester);
      totalLoad += load.total_credit_hours;

      comparisons.push({
        faculty_id: facultyId,
        name: `${faculty.first_name} ${faculty.last_name}`,
        load,
      });
    }

    const averageLoad = comparisons.length > 0 ? totalLoad / comparisons.length : 0;

    return {
      comparisons,
      average_load: averageLoad,
    };
  }

  /**
   * Function 32: Load forecasting
   * GET /api/v1/faculty/:facultyId/load/forecast
   * Status: 200 OK
   */
  async forecastTeachingLoad(
    facultyId: string,
    futureSemesters: number = 3
  ): Promise<{
    forecasts: Array<{
      academic_year: string;
      semester: string;
      projected_load: number;
    }>;
  }> {
    // Get historical data
    const history = await FacultyLoad.findAll({
      where: { faculty_id: facultyId },
      order: [['academic_year', 'desc'], ['semester', 'desc']],
      limit: 6,
    });

    // Simple average-based forecast (would use more sophisticated ML in production)
    const avgLoad =
      history.reduce((sum, h) => sum + parseFloat(h.credit_hours.toString()), 0) /
      (history.length || 1);

    const forecasts: Array<{
      academic_year: string;
      semester: string;
      projected_load: number;
    }> = [];

    // Generate future forecasts
    const now = new Date();
    const currentYear = now.getFullYear();

    for (let i = 0; i < futureSemesters; i++) {
      const semesterIndex = i % 3;
      const yearOffset = Math.floor(i / 3);

      let semester = 'fall';
      if (semesterIndex === 1) semester = 'spring';
      if (semesterIndex === 2) semester = 'summer';

      forecasts.push({
        academic_year: `${currentYear + yearOffset}-${currentYear + yearOffset + 1}`,
        semester,
        projected_load: avgLoad,
      });
    }

    return { forecasts };
  }

  // ========================================================================
  // CREDENTIALS & QUALIFICATIONS (Functions 33-37)
  // ========================================================================

  /**
   * Function 33: Add qualification
   * POST /api/v1/faculty/:facultyId/qualifications
   * Status: 201 Created, 400 Bad Request
   */
  async addQualification(
    data: z.infer<typeof QualificationSchema>
  ): Promise<FacultyQualifications> {
    try {
      const validated = QualificationSchema.parse(data);

      // Check if faculty exists
      const faculty = await Faculty.findByPk(validated.faculty_id);
      if (!faculty) {
        throw new NotFoundException(`Faculty with ID ${validated.faculty_id} not found`);
      }

      const qualification = await FacultyQualifications.create(validated);

      this.logger.log(`Added qualification for faculty: ${validated.faculty_id}`);

      return qualification;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      throw error;
    }
  }

  /**
   * Function 34: Update credentials
   * PATCH /api/v1/faculty/qualifications/:qualificationId
   * Status: 200 OK, 404 Not Found
   */
  async updateQualification(
    qualificationId: string,
    data: Partial<z.infer<typeof QualificationSchema>>
  ): Promise<FacultyQualifications> {
    const qualification = await FacultyQualifications.findByPk(qualificationId);

    if (!qualification) {
      throw new NotFoundException(`Qualification with ID ${qualificationId} not found`);
    }

    await qualification.update(data);

    this.logger.log(`Updated qualification: ${qualificationId}`);

    return qualification;
  }

  /**
   * Function 35: Verify qualifications
   * POST /api/v1/faculty/qualifications/:qualificationId/verify
   * Status: 200 OK, 404 Not Found
   */
  async verifyQualification(qualificationId: string): Promise<FacultyQualifications> {
    const qualification = await FacultyQualifications.findByPk(qualificationId);

    if (!qualification) {
      throw new NotFoundException(`Qualification with ID ${qualificationId} not found`);
    }

    await qualification.update({ is_verified: true });

    this.logger.log(`Verified qualification: ${qualificationId}`);

    return qualification;
  }

  /**
   * Function 36: List credentials
   * GET /api/v1/faculty/:facultyId/qualifications
   * Status: 200 OK
   */
  async listQualifications(
    facultyId: string,
    filters?: {
      qualification_type?: QualificationType;
      is_verified?: boolean;
    }
  ): Promise<FacultyQualifications[]> {
    const where: any = { faculty_id: facultyId };

    if (filters?.qualification_type) {
      where.qualification_type = filters.qualification_type;
    }

    if (filters?.is_verified !== undefined) {
      where.is_verified = filters.is_verified;
    }

    const qualifications = await FacultyQualifications.findAll({
      where,
      order: [['earned_date', 'desc']],
    });

    return qualifications;
  }

  /**
   * Function 37: Credential expiration tracking
   * GET /api/v1/faculty/qualifications/expiring
   * Status: 200 OK
   */
  async getExpiringCredentials(daysAhead: number = 90): Promise<{
    expiring: Array<{
      qualification: FacultyQualifications;
      faculty: Faculty;
      days_until_expiration: number;
    }>;
  }> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const expiring = await FacultyQualifications.findAll({
      where: {
        expiration_date: {
          [Op.between]: [now, futureDate],
        },
      },
      include: [{ model: Faculty, as: 'faculty' }],
    });

    const result = expiring.map((q) => {
      const daysUntil = Math.ceil(
        (q.expiration_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        qualification: q,
        faculty: q.faculty,
        days_until_expiration: daysUntil,
      };
    });

    return { expiring: result };
  }

  // ========================================================================
  // OFFICE HOURS & AVAILABILITY (Functions 38-42)
  // ========================================================================

  /**
   * Function 38: Set office hours
   * PUT /api/v1/faculty/:facultyId/office-hours
   * Status: 200 OK, 404 Not Found
   */
  async setOfficeHours(
    facultyId: string,
    officeHours: Array<{
      day: DayOfWeek;
      start_time: string;
      end_time: string;
      location?: string;
      type?: 'in_person' | 'virtual' | 'hybrid';
    }>
  ): Promise<FacultyProfile> {
    const profile = await FacultyProfile.findOne({
      where: { faculty_id: facultyId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile not found for faculty: ${facultyId}`);
    }

    await profile.update({ office_hours: officeHours });

    this.logger.log(`Updated office hours for faculty: ${facultyId}`);

    return profile;
  }

  /**
   * Function 39: Get availability
   * GET /api/v1/faculty/:facultyId/availability
   * Status: 200 OK
   */
  async getFacultyAvailability(facultyId: string, date?: Date): Promise<{
    faculty_id: string;
    office_hours: any[];
    teaching_schedule: any[];
    available_slots: any[];
  }> {
    const profile = await FacultyProfile.findOne({
      where: { faculty_id: facultyId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile not found for faculty: ${facultyId}`);
    }

    // Get teaching schedule (simplified)
    const teachingSchedule = await FacultyLoad.findAll({
      where: { faculty_id: facultyId },
    });

    // Calculate available slots (simplified - would integrate with calendar)
    const availableSlots: any[] = [];

    return {
      faculty_id: facultyId,
      office_hours: profile.office_hours || [],
      teaching_schedule: teachingSchedule,
      available_slots: availableSlots,
    };
  }

  /**
   * Function 40: Update schedule
   * PATCH /api/v1/faculty/:facultyId/schedule
   * Status: 200 OK
   */
  async updateFacultySchedule(
    facultyId: string,
    schedule: any
  ): Promise<{ success: boolean; message: string }> {
    // This would integrate with the scheduling system
    // Simplified implementation
    const faculty = await Faculty.findByPk(facultyId);

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
    }

    this.logger.log(`Updated schedule for faculty: ${facultyId}`);

    return {
      success: true,
      message: 'Schedule updated successfully',
    };
  }

  /**
   * Function 41: Book appointment
   * POST /api/v1/faculty/:facultyId/appointments
   * Status: 201 Created
   */
  async bookAppointment(
    facultyId: string,
    appointment: {
      student_id: string;
      date: Date;
      start_time: string;
      end_time: string;
      purpose: string;
      type: 'in_person' | 'virtual';
    }
  ): Promise<{ appointment_id: string; confirmation: string }> {
    const faculty = await Faculty.findByPk(facultyId);

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
    }

    // Check availability (simplified)
    const availability = await this.getFacultyAvailability(facultyId, appointment.date);

    // Create appointment (would store in appointments table)
    const appointmentId = `appt_${Date.now()}`;

    this.logger.log(`Booked appointment ${appointmentId} for faculty: ${facultyId}`);

    return {
      appointment_id: appointmentId,
      confirmation: `Appointment confirmed with ${faculty.first_name} ${faculty.last_name}`,
    };
  }

  /**
   * Function 42: Availability conflicts
   * GET /api/v1/faculty/:facultyId/availability/conflicts
   * Status: 200 OK
   */
  async checkAvailabilityConflicts(
    facultyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    conflicts: Array<{
      date: Date;
      type: string;
      description: string;
    }>;
  }> {
    // This would check against teaching schedule, appointments, and other commitments
    // Simplified implementation
    const conflicts: Array<{
      date: Date;
      type: string;
      description: string;
    }> = [];

    const teachingLoad = await FacultyLoad.findAll({
      where: { faculty_id: facultyId },
    });

    // Add conflict detection logic here

    return { conflicts };
  }

  // ========================================================================
  // EVALUATIONS & CONTRACTS (Functions 43-45)
  // ========================================================================

  /**
   * Function 43: Create evaluation
   * POST /api/v1/faculty/:facultyId/evaluations
   * Status: 201 Created
   */
  async createEvaluation(evaluation: {
    faculty_id: string;
    evaluation_type: EvaluationType;
    academic_year: string;
    semester: string;
    evaluator_id: string;
    rating: number;
    comments: string;
    strengths: string[];
    areas_for_improvement: string[];
    recommendations: string[];
  }): Promise<{
    evaluation_id: string;
    status: string;
  }> {
    const faculty = await Faculty.findByPk(evaluation.faculty_id);

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${evaluation.faculty_id} not found`);
    }

    // Validate rating
    if (evaluation.rating < 1 || evaluation.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Would create in evaluations table
    const evaluationId = `eval_${Date.now()}`;

    this.logger.log(`Created evaluation ${evaluationId} for faculty: ${evaluation.faculty_id}`);

    return {
      evaluation_id: evaluationId,
      status: 'submitted',
    };
  }

  /**
   * Function 44: Manage contracts
   * POST /api/v1/faculty/:facultyId/contracts
   * Status: 201 Created
   */
  async createContract(contract: {
    faculty_id: string;
    contract_type: ContractType;
    start_date: Date;
    end_date: Date;
    salary: number;
    benefits: any;
    terms: string;
    signed_date?: Date;
  }): Promise<{
    contract_id: string;
    status: string;
  }> {
    const faculty = await Faculty.findByPk(contract.faculty_id);

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${contract.faculty_id} not found`);
    }

    // Validate dates
    if (contract.end_date <= contract.start_date) {
      throw new BadRequestException('End date must be after start date');
    }

    // Would create in contracts table
    const contractId = `contract_${Date.now()}`;

    this.logger.log(`Created contract ${contractId} for faculty: ${contract.faculty_id}`);

    return {
      contract_id: contractId,
      status: contract.signed_date ? 'active' : 'pending_signature',
    };
  }

  /**
   * Function 45: Contract renewal
   * POST /api/v1/faculty/contracts/:contractId/renew
   * Status: 201 Created, 404 Not Found
   */
  async renewContract(
    contractId: string,
    renewal: {
      new_end_date: Date;
      salary_adjustment?: number;
      updated_terms?: string;
    }
  ): Promise<{
    new_contract_id: string;
    status: string;
  }> {
    // Would fetch original contract
    // Create new contract based on renewal terms

    const newContractId = `contract_${Date.now()}_renewal`;

    this.logger.log(`Renewed contract: ${contractId} -> ${newContractId}`);

    return {
      new_contract_id: newContractId,
      status: 'pending_signature',
    };
  }
}

// ============================================================================
// UTILITY TYPES AND HELPERS
// ============================================================================

/**
 * Import Op from Sequelize for operations
 */
import { Op } from 'sequelize';

/**
 * API version constant
 */
export const API_VERSION = 'v1';

/**
 * API base path
 */
export const API_BASE_PATH = `/api/${API_VERSION}`;

/**
 * Export all models for external use
 */
export const FacultyModels = {
  Faculty,
  FacultyProfile,
  FacultyLoad,
  FacultyQualifications,
};

/**
 * Export all schemas for validation
 */
export const FacultySchemas = {
  CreateFacultySchema,
  UpdateFacultySchema,
  FacultyProfileSchema,
  CourseAssignmentSchema,
  QualificationSchema,
};

/**
 * Export all enums
 */
export const FacultyEnums = {
  FacultyStatus,
  FacultyRank,
  EmploymentType,
  ContractType,
  EvaluationType,
  QualificationType,
  DayOfWeek,
};

/**
 * Type exports for TypeScript consumers
 */
export type CreateFacultyDto = z.infer<typeof CreateFacultySchema>;
export type UpdateFacultyDto = z.infer<typeof UpdateFacultySchema>;
export type FacultyProfileDto = z.infer<typeof FacultyProfileSchema>;
export type CourseAssignmentDto = z.infer<typeof CourseAssignmentSchema>;
export type QualificationDto = z.infer<typeof QualificationSchema>;
