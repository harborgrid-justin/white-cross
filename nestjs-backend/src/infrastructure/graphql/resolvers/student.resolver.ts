/**
 * Student GraphQL Resolver
 *
 * Implements all GraphQL queries for Student entity.
 * Integrates with StudentService for business logic and enforces
 * authentication and authorization via guards.
 */
import { Resolver, Query, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import {
  StudentDto,
  StudentListResponseDto,
  StudentFilterInputDto,
  Gender
} from '../dto';
import { StudentService } from '../../../student/student.service';

/**
 * Student Resolver
 * Handles all GraphQL operations for students
 */
@Resolver(() => StudentDto)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  /**
   * Query: Get paginated list of students with optional filtering
   */
  @Query(() => StudentListResponseDto, { name: 'students' })
  @UseGuards(GqlAuthGuard)
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
   */
  @Query(() => StudentDto, { name: 'student', nullable: true })
  @UseGuards(GqlAuthGuard)
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
      fullName: `${student.firstName} ${student.lastName}`
    };
  }
}