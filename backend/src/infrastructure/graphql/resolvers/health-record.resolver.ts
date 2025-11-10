/**
 * HealthRecord GraphQL Resolver
 *
 * Implements all GraphQL queries and mutations for HealthRecord entity.
 * Enforces strict authentication and authorization for PHI access.
 *
 * HIPAA Compliance:
 * - All operations require authentication
 * - Role-based access control for PHI
 * - Audit logging for all PHI access
 * - Special handling for confidential records
 *
 * Features:
 * - Role-based access control with GqlRolesGuard
 * - PHI access auditing
 * - Input validation
 */
import { Args, Context, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, GqlRolesGuard } from '../guards';
import { Roles } from '@/auth';
import { UserRole } from '@/database';
import {
  ChronicConditionDto,
  DeleteResponseDto,
  HealthRecordDto,
  HealthRecordFilterInputDto,
  HealthRecordInputDto,
  HealthRecordListResponseDto,
  HealthRecordUpdateInputDto,
  StudentDto,
} from '../dto';
import { HealthRecordService } from '@/health-record';
import type { GraphQLContext } from '../types/context.interface';
import { PHIField } from '@/infrastructure/graphql/guards';


/**
 * GraphQL context structure
 */
interface GraphQLContext {
  req?: {
    user?: {
      userId: string;
      organizationId: string;
      role: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Health record model type
 */
interface HealthRecordModel {
  id?: string;
  studentId?: string;
  recordType?: string;
  date?: Date;
  notes?: string;
  providerId?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * HealthRecord Resolver
 * Handles all GraphQL operations for health records (PHI)
 */
@Resolver(() => HealthRecordDto)
export class HealthRecordResolver {
  constructor(private readonly healthRecordService: HealthRecordService) {}

  /**
   * Map HealthRecord model to DTO
   */
  private mapHealthRecordToDto(record: HealthRecordModel): HealthRecordDto {
    return {
      id: record.id,
      studentId: record.studentId,
      recordType: record.recordType,
      title: record.title,
      description: record.description,
      recordDate: record.recordDate,
      provider: record.provider || undefined,
      providerNpi: record.providerNpi || undefined,
      facility: record.facility || undefined,
      facilityNpi: record.facilityNpi || undefined,
      diagnosis: record.diagnosis || undefined,
      diagnosisCode: record.diagnosisCode || undefined,
      treatment: record.treatment || undefined,
      followUpRequired: record.followUpRequired,
      followUpDate: record.followUpDate || undefined,
      followUpCompleted: record.followUpCompleted,
      attachments: record.attachments || [],
      metadata: record.metadata || undefined,
      isConfidential: record.isConfidential,
      notes: record.notes || undefined,
      createdBy: record.createdBy || undefined,
      updatedBy: record.updatedBy || undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  /**
   * Query: Get paginated list of health records with optional filtering
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE only
   * PHI ACCESS - Audit logged
   */
  @Query(() => HealthRecordListResponseDto, { name: 'healthRecords' })
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
  )
  async getHealthRecords(
    @Args('page', { type: () => Number, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Number, defaultValue: 20 }) limit: number,
    @Args('orderBy', { type: () => String, defaultValue: 'recordDate' })
    orderBy: string,
    @Args('orderDirection', { type: () => String, defaultValue: 'DESC' })
    orderDirection: string,
    @Args('filters', { type: () => HealthRecordFilterInputDto, nullable: true })
    filters?: HealthRecordFilterInputDto,
    @Context() context?: GraphQLContext,
  ): Promise<HealthRecordListResponseDto> {
    const userId = context.req?.user?.id;

    // Log PHI access for HIPAA compliance
    console.log('PHI ACCESS: Health records queried', {
      userId,
      timestamp: new Date().toISOString(),
      filters: {
        studentId: filters?.studentId,
        recordType: filters?.recordType,
      },
    });

    // Build filters for health record service
    const serviceFilters: Record<string, unknown> = {
      page,
      limit,
      orderBy,
      orderDirection,
    };

    if (filters) {
      if (filters.studentId) serviceFilters.studentId = filters.studentId;
      if (filters.recordType) serviceFilters.recordType = filters.recordType;
      if (filters.isConfidential !== undefined)
        serviceFilters.isConfidential = filters.isConfidential;
      if (filters.followUpRequired !== undefined)
        serviceFilters.followUpRequired = filters.followUpRequired;
      if (filters.followUpCompleted !== undefined)
        serviceFilters.followUpCompleted = filters.followUpCompleted;
      if (filters.fromDate) serviceFilters.fromDate = filters.fromDate;
      if (filters.toDate) serviceFilters.toDate = filters.toDate;
      if (filters.search) serviceFilters.search = filters.search;
    }

    const result = await this.healthRecordService.findAll(serviceFilters);

    // Handle different response formats from HealthRecordService
    const healthRecords = result.data || [];
    const paginationData = result.meta || {};

    return {
      healthRecords: healthRecords.map((record: HealthRecordModel) =>
        this.mapHealthRecordToDto(record),
      ),
      pagination: {
        page: paginationData.page || page,
        limit: paginationData.limit || limit,
        total: paginationData.total || 0,
        totalPages: paginationData.pages || 0,
      },
    };
  }

  /**
   * Query: Get single health record by ID
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE only
   * PHI ACCESS - Audit logged
   */
  @Query(() => HealthRecordDto, { name: 'healthRecord', nullable: true })
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
  )
  async getHealthRecord(
    @Args('id', { type: () => ID }) id: string,
    @Context() context?: GraphQLContext,
  ): Promise<HealthRecordDto | null> {
    const userId = context.req?.user?.id;

    // Log PHI access for HIPAA compliance
    console.log('PHI ACCESS: Health record retrieved', {
      userId,
      healthRecordId: id,
      timestamp: new Date().toISOString(),
    });

    const record = await this.healthRecordService.findOne(id);
    if (!record) {
      return null;
    }

    return this.mapHealthRecordToDto(record);
  }

  /**
   * Query: Get health records for a specific student
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE only
   * PHI ACCESS - Audit logged
   */
  @Query(() => [HealthRecordDto], { name: 'healthRecordsByStudent' })
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
  )
  async getHealthRecordsByStudent(
    @Args('studentId', { type: () => ID }) studentId: string,
    @Context() context?: GraphQLContext,
  ): Promise<HealthRecordDto[]> {
    const userId = context.req?.user?.id;

    // Log PHI access for HIPAA compliance
    console.log('PHI ACCESS: Student health records retrieved', {
      userId,
      studentId,
      timestamp: new Date().toISOString(),
    });

    const records = await this.healthRecordService.findByStudent(studentId);
    return records.map((record: HealthRecordModel) => this.mapHealthRecordToDto(record));
  }

  /**
   * Mutation: Create new health record
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE only
   * PHI MODIFICATION - Audit logged
   */
  @Mutation(() => HealthRecordDto)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
  )
  async createHealthRecord(
    @Args('input') input: HealthRecordInputDto,
    @Context() context: GraphQLContext,
  ): Promise<HealthRecordDto> {
    const userId = context.req?.user?.id;

    // Log PHI creation for HIPAA compliance
    console.log('PHI MODIFICATION: Health record created', {
      userId,
      studentId: input.studentId,
      recordType: input.recordType,
      timestamp: new Date().toISOString(),
    });

    const record = await this.healthRecordService.create({
      ...input,
      createdBy: userId,
    } as any);

    return this.mapHealthRecordToDto(record);
  }

  /**
   * Mutation: Update existing health record
   *
   * Access: ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, NURSE only
   * PHI MODIFICATION - Audit logged
   */
  @Mutation(() => HealthRecordDto)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
  )
  async updateHealthRecord(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: HealthRecordUpdateInputDto,
    @Context() context: GraphQLContext,
  ): Promise<HealthRecordDto> {
    const userId = context.req?.user?.id;

    // Log PHI update for HIPAA compliance
    console.log('PHI MODIFICATION: Health record updated', {
      userId,
      healthRecordId: id,
      timestamp: new Date().toISOString(),
    });

    const record = await this.healthRecordService.update(id, {
      ...input,
      updatedBy: userId,
    } as any);

    return this.mapHealthRecordToDto(record);
  }

  /**
   * Mutation: Delete health record (soft delete)
   *
   * Access: ADMIN only (restricted operation)
   * PHI MODIFICATION - Audit logged
   */
  @Mutation(() => DeleteResponseDto)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteHealthRecord(
    @Args('id', { type: () => ID }) id: string,
    @Context() context?: GraphQLContext,
  ): Promise<DeleteResponseDto> {
    const userId = context.req?.user?.id;

    // Log PHI deletion for HIPAA compliance
    console.warn('PHI MODIFICATION: Health record deleted', {
      userId,
      healthRecordId: id,
      timestamp: new Date().toISOString(),
    });

    await this.healthRecordService.remove(id);

    return {
      success: true,
      message: 'Health record deleted successfully',
    };
  }

  /**
   * Field Resolver: Load student for a health record
   *
   * Uses DataLoader from context to batch and cache student queries.
   * The DataLoader is shared across all field resolvers in this request for optimal batching.
   *
   * @param healthRecord - Parent health record object
   * @param context - GraphQL context containing DataLoaders
   * @returns Student associated with the health record
   */
  @ResolveField(() => StudentDto, { name: 'student', nullable: true })
  async student(
    @Parent() healthRecord: HealthRecordDto,
    @Context() context: GraphQLContext,
  ): Promise<StudentDto | null> {
    try {
      // Use the shared DataLoader from context for optimal batching
      return await context.loaders.studentLoader.load(
        healthRecord.studentId,
      );
    } catch (error) {
      console.error(
        `Error loading student for health record ${healthRecord.id}:`,
        error,
      );
      return null;
    }
  }

  /**
   * Field Resolver: Load allergies for a health record's student
   *
   * Uses DataLoader from context to batch and cache allergy queries.
   * The DataLoader is shared across all field resolvers in this request for optimal batching.
   *
   * PHI PROTECTED: Only ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, and NURSE can access allergy data
   *
   * @param healthRecord - Parent health record object
   * @param context - GraphQL context containing DataLoaders
   * @returns Array of allergies for the student
   */
  /*
  @ResolveField(() => [Object], { name: 'allergies', nullable: 'items' })
  @PHIField() // Field-level authorization for PHI
  async allergies(
    @Parent() healthRecord: HealthRecordDto,
    @Context() context: GraphQLContext,
  ): Promise<any[]> {
    try {
      // Use the shared DataLoader from context for optimal batching
      const allergies = await context.loaders.allergiesByStudentLoader.load(
        healthRecord.studentId,
      );

      return allergies || [];
    } catch (error) {
      console.error(
        `Error loading allergies for health record ${healthRecord.id}:`,
        error,
      );
      return [];
    }
  }
  */

  /**
   * Field Resolver: Load chronic conditions for a health record's student
   *
   * Uses DataLoader from context to batch and cache chronic condition queries.
   * The DataLoader is shared across all field resolvers in this request for optimal batching.
   *
   * PHI PROTECTED: Only ADMIN, SCHOOL_ADMIN, DISTRICT_ADMIN, and NURSE can access chronic condition data
   *
   * @param healthRecord - Parent health record object
   * @param context - GraphQL context containing DataLoaders
   * @returns Array of chronic conditions for the student
   */
  @ResolveField(() => [ChronicConditionDto], {
    name: 'chronicConditions',
    nullable: 'items',
  })
  @PHIField() // Field-level authorization for PHI
  async chronicConditions(
    @Parent() healthRecord: HealthRecordDto,
    @Context() context: GraphQLContext,
  ): Promise<ChronicConditionDto[]> {
    try {
      // Use the shared DataLoader from context for optimal batching
      const chronicConditions =
        await context.loaders.chronicConditionsByStudentLoader.load(
          healthRecord.studentId,
        );

      return chronicConditions || [];
    } catch (error) {
      console.error(
        `Error loading chronic conditions for health record ${healthRecord.id}:`,
        error,
      );
      return [];
    }
  }
}
