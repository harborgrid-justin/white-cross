/**
 * Student GraphQL Resolver
 *
 * Implements all GraphQL queries for Student entity.
 * Integrates with StudentService for business logic and enforces
 * authentication and authorization via guards.
 *
 * Features:
 * - Role-based access control with GqlRolesGuard
 * - DataLoader integration for efficient relationship loading
 * - Field-level resolvers for nested data
 */
import { Resolver, Query, Args, ID, Context, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, GqlRolesGuard } from '../guards';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { UserRole } from '../../../database/models/user.model';
import {
  StudentDto,
  StudentListResponseDto,
  StudentFilterInputDto,
  ContactDto,
  Gender
} from '../dto';
import { StudentService } from '../../../student/student.service';
import { DataLoaderFactory } from '../dataloaders/dataloader.factory';

/**
 * Student Resolver
 * Handles all GraphQL operations for students
 */
@Resolver(() => StudentDto)
export class StudentResolver {
  constructor(
    private readonly studentService: StudentService,
    private readonly dataLoaderFactory: DataLoaderFactory,
  ) {}

  /**
   * Query: Get paginated list of students with optional filtering
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE, COUNSELOR
   */
  @Query(() => StudentListResponseDto, { name: 'students' })
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCHOOL_ADMIN, UserRole.DISTRICT_ADMIN, UserRole.NURSE, UserRole.COUNSELOR)
  async getStudents(
    @Args('page', { type: () => Number, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Number, defaultValue: 20 }) limit: number,
    @Args('orderBy', { type: () => String, defaultValue: 'lastName' }) orderBy: string,
    @Args('orderDirection', { type: () => String, defaultValue: 'ASC' }) orderDirection: string,
    @Args('filters', { type: () => StudentFilterInputDto, nullable: true }) filters?: StudentFilterInputDto,
    @Context() context?: any
  ): Promise<StudentListResponseDto> {
    // Build filters for student service
    const studentFilters: any = {};
    if (filters) {
      if (filters.isActive !== undefined) studentFilters.isActive = filters.isActive;
      if (filters.grade) studentFilters.grade = filters.grade;
      if (filters.nurseId) studentFilters.nurseId = filters.nurseId;
      if (filters.search) studentFilters.search = filters.search;
    }

    const result = await this.studentService.findAll({
      page,
      limit,
      orderBy,
      orderDirection,
      ...studentFilters
    });

    // Handle different response formats from StudentService
    const students = result.data || [];
    const paginationData = result.meta || {};

    return {
      students: students.map((student: any) => ({
        ...student,
        fullName: `${student.firstName} ${student.lastName}`
      })),
      pagination: {
        page: paginationData.page || page,
        limit: paginationData.limit || limit,
        total: paginationData.total || 0,
        totalPages: paginationData.pages || 0
      }
    };
  }

  /**
   * Query: Get single student by ID
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE, COUNSELOR
   */
  @Query(() => StudentDto, { name: 'student', nullable: true })
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SCHOOL_ADMIN, UserRole.DISTRICT_ADMIN, UserRole.NURSE, UserRole.COUNSELOR)
  async getStudent(
    @Args('id', { type: () => ID }) id: string,
    @Context() context?: any
  ): Promise<StudentDto | null> {
    const student = await this.studentService.findOne(id);
    if (!student) {
      return null;
    }

    return {
      ...student,
      gender: student.gender as Gender,
      photo: student.photo || undefined,
      medicalRecordNum: student.medicalRecordNum || undefined,
      nurseId: student.nurseId || undefined,
      createdAt: student.createdAt!,
      updatedAt: student.updatedAt!,
      fullName: `${student.firstName} ${student.lastName}`
    };
  }

  /**
   * Field Resolver: Load contacts (guardians) for a student
   *
   * Uses DataLoader to batch and cache contact queries, preventing N+1 issues.
   *
   * @param student - Parent student object
   * @returns Array of contacts associated with the student
   */
  @ResolveField(() => [ContactDto], { name: 'contacts', nullable: 'items' })
  async contacts(@Parent() student: StudentDto): Promise<ContactDto[]> {
    try {
      const loader = this.dataLoaderFactory.createContactsByStudentLoader();
      const contacts = await loader.load(student.id);
      return contacts || [];
    } catch (error) {
      console.error(`Error loading contacts for student ${student.id}:`, error);
      return [];
    }
  }

  /**
   * Field Resolver: Load medications for a student
   *
   * Uses DataLoader to batch and cache medication queries.
   *
   * @param student - Parent student object
   * @returns Array of medications for the student
   */
  @ResolveField(() => [Object], { name: 'medications', nullable: 'items' })
  async medications(@Parent() student: StudentDto): Promise<any[]> {
    try {
      const loader = this.dataLoaderFactory.createMedicationsByStudentLoader();
      const medications = await loader.load(student.id);
      return medications || [];
    } catch (error) {
      console.error(`Error loading medications for student ${student.id}:`, error);
      return [];
    }
  }

  /**
   * Field Resolver: Load health record for a student
   *
   * Uses DataLoader to batch and cache health record queries.
   *
   * @param student - Parent student object
   * @returns Health record for the student or null
   */
  @ResolveField(() => Object, { name: 'healthRecord', nullable: true })
  async healthRecord(@Parent() student: StudentDto): Promise<any | null> {
    try {
      const loader = this.dataLoaderFactory.createHealthRecordsByStudentLoader();
      const healthRecord = await loader.load(student.id);
      return healthRecord;
    } catch (error) {
      console.error(`Error loading health record for student ${student.id}:`, error);
      return null;
    }
  }

  /**
   * Field Resolver: Count of contacts for a student
   *
   * Efficiently uses the contacts field resolver result.
   *
   * @param student - Parent student object
   * @returns Number of contacts
   */
  @ResolveField(() => Number, { name: 'contactCount' })
  async contactCount(@Parent() student: StudentDto): Promise<number> {
    const contacts = await this.contacts(student);
    return contacts.length;
  }
}