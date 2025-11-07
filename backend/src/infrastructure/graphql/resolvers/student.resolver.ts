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
import {
  Resolver,
  Query,
  Args,
  ID,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, GqlRolesGuard } from '../guards';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { UserRole } from '../../../database/models/user.model';
import {
  StudentDto,
  StudentListResponseDto,
  StudentFilterInputDto,
  ContactDto,
  MedicationDto,
  HealthRecordDto,
  Gender,
} from '../dto';
import { StudentService } from '../../../student/student.service';
import type { GraphQLContext } from '../types/context.interface';
import { PHIField } from '../guards/field-authorization.guard';

/**
 * Student Resolver
 * Handles all GraphQL operations for students
 */
@Resolver(() => StudentDto)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  /**
   * Map Contact model to ContactDto
   * Simplified mapper for field resolvers
   */
  private mapContactToDto(contact: any): ContactDto {
    return {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email ?? undefined,
      phone: contact.phone ?? undefined,
      type: contact.type,
      relationTo: contact.relationTo ?? undefined,
      isActive: contact.isActive,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    } as ContactDto;
  }

  /**
   * Query: Get paginated list of students with optional filtering
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE, COUNSELOR
   */
  @Query(() => StudentListResponseDto, { name: 'students' })
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
    UserRole.COUNSELOR,
  )
  async getStudents(
    @Args('page', { type: () => Number, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Number, defaultValue: 20 }) limit: number,
    @Args('orderBy', { type: () => String, defaultValue: 'lastName' })
    orderBy: string,
    @Args('orderDirection', { type: () => String, defaultValue: 'ASC' })
    orderDirection: string,
    @Args('filters', { type: () => StudentFilterInputDto, nullable: true })
    filters?: StudentFilterInputDto,
    @Context() context?: any,
  ): Promise<StudentListResponseDto> {
    // Build filters for student service
    const studentFilters: any = {};
    if (filters) {
      if (filters.isActive !== undefined)
        studentFilters.isActive = filters.isActive;
      if (filters.grade) studentFilters.grade = filters.grade;
      if (filters.nurseId) studentFilters.nurseId = filters.nurseId;
      if (filters.search) studentFilters.search = filters.search;
    }

    const result = await this.studentService.findAll({
      page,
      limit,
      orderBy,
      orderDirection,
      ...studentFilters,
    });

    // Handle different response formats from StudentService
    const students = result.data || [];
    const paginationData = result.meta || {};

    return {
      students: students.map((student: any) => ({
        ...student,
        fullName: `${student.firstName} ${student.lastName}`,
      })),
      pagination: {
        page: paginationData.page || page,
        limit: paginationData.limit || limit,
        total: paginationData.total || 0,
        totalPages: paginationData.pages || 0,
      },
    };
  }

  /**
   * Query: Get single student by ID
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE, COUNSELOR
   */
  @Query(() => StudentDto, { name: 'student', nullable: true })
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
    UserRole.COUNSELOR,
  )
  async getStudent(
    @Args('id', { type: () => ID }) id: string,
    @Context() context?: any,
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
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
      fullName: `${student.firstName} ${student.lastName}`,
    };
  }

  /**
   * Field Resolver: Load contacts (guardians) for a student
   *
   * Uses DataLoader from context to batch and cache contact queries, preventing N+1 issues.
   * The DataLoader is shared across all field resolvers in this request for optimal batching.
   *
   * @param student - Parent student object
   * @param context - GraphQL context containing DataLoaders
   * @returns Array of contacts associated with the student
   */
  @ResolveField(() => [ContactDto], { name: 'contacts', nullable: 'items' })
  async contacts(
    @Parent() student: StudentDto,
    @Context() context: GraphQLContext,
  ): Promise<ContactDto[]> {
    try {
      // Use the shared DataLoader from context for optimal batching
      const contacts = await context.loaders.contactsByStudentLoader.load(
        student.id,
      );
      // Map Contact entities to ContactDto
      return (contacts || []).map((contact) => this.mapContactToDto(contact));
    } catch (error) {
      console.error(`Error loading contacts for student ${student.id}:`, error);
      return [];
    }
  }

  /**
   * Field Resolver: Load medications for a student
   *
   * Uses DataLoader from context to batch and cache medication queries.
   * The DataLoader is shared across all field resolvers in this request for optimal batching.
   *
   * PHI PROTECTED: Only ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, and NURSE can access medication data
   *
   * @param student - Parent student object
   * @param context - GraphQL context containing DataLoaders
   * @returns Array of medications for the student or null if unauthorized
   */
  @ResolveField(() => [MedicationDto], {
    name: 'medications',
    nullable: 'items',
  })
  @PHIField() // Field-level authorization for PHI
  async medications(
    @Parent() student: StudentDto,
    @Context() context: GraphQLContext,
  ): Promise<MedicationDto[]> {
    try {
      // Use the shared DataLoader from context for optimal batching
      const studentMedications =
        await context.loaders.medicationsByStudentLoader.load(student.id);

      // Map StudentMedication to MedicationDto
      return (studentMedications || []).map((sm: any) => ({
        id: sm.id,
        studentId: sm.studentId,
        name: sm.medication?.name || sm.medicationName || 'Unknown',
        dosage: sm.dosage,
        frequency: sm.frequency,
        route: sm.route,
        instructions: sm.instructions,
        prescribedBy: sm.prescribedBy,
        startDate: sm.startDate,
        endDate: sm.endDate,
        isActive: sm.isActive,
        createdAt: sm.createdAt,
        updatedAt: sm.updatedAt,
      }));
    } catch (error) {
      console.error(
        `Error loading medications for student ${student.id}:`,
        error,
      );
      return [];
    }
  }

  /**
   * Field Resolver: Load health record for a student
   *
   * Uses DataLoader from context to batch and cache health record queries.
   * The DataLoader is shared across all field resolvers in this request for optimal batching.
   *
   * PHI PROTECTED: Only ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, and NURSE can access health records
   *
   * @param student - Parent student object
   * @param context - GraphQL context containing DataLoaders
   * @returns Health record for the student or null if unauthorized
   */
  @ResolveField(() => HealthRecordDto, { name: 'healthRecord', nullable: true })
  @PHIField() // Field-level authorization for PHI
  async healthRecord(
    @Parent() student: StudentDto,
    @Context() context: GraphQLContext,
  ): Promise<HealthRecordDto | null> {
    try {
      // Use the shared DataLoader from context for optimal batching
      const healthRecord =
        await context.loaders.healthRecordsByStudentLoader.load(student.id);
      return healthRecord;
    } catch (error) {
      console.error(
        `Error loading health record for student ${student.id}:`,
        error,
      );
      return null;
    }
  }

  /**
   * Field Resolver: Count of contacts for a student
   *
   * Efficiently uses the contacts field resolver result.
   *
   * @param student - Parent student object
   * @param context - GraphQL context containing DataLoaders
   * @returns Number of contacts
   */
  @ResolveField(() => Number, { name: 'contactCount' })
  async contactCount(
    @Parent() student: StudentDto,
    @Context() context: GraphQLContext,
  ): Promise<number> {
    const contacts = await this.contacts(student, context);
    return contacts.length;
  }
}
