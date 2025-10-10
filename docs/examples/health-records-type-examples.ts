/**
 * Health Records Module - Type System Implementation Examples
 *
 * This file provides concrete examples of implementing the type system
 * defined in the service contracts documentation.
 *
 * @see docs/health-records-service-contracts.md
 */

// ============================================================================
// EXAMPLE 1: Branded Type Implementation with Smart Constructors
// ============================================================================

/**
 * Branded types provide compile-time type safety while maintaining
 * runtime compatibility with primitive types.
 */

// Define branded type
type HealthRecordId = string & { readonly __brand: 'HealthRecordId' };
type StudentId = string & { readonly __brand: 'StudentId' };

// Smart constructor with validation
function createHealthRecordId(id: string): HealthRecordId {
  if (!id || id.length === 0) {
    throw new Error('Health record ID cannot be empty');
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    throw new Error('Health record ID contains invalid characters');
  }
  return id as HealthRecordId;
}

function createStudentId(id: string): StudentId {
  if (!id || id.length === 0) {
    throw new Error('Student ID cannot be empty');
  }
  return id as StudentId;
}

// Usage - compiler prevents mixing ID types
function getHealthRecord(studentId: StudentId, recordId: HealthRecordId) {
  console.log(`Fetching record ${recordId} for student ${studentId}`);
}

// This works
const validStudentId = createStudentId('STU-12345');
const validRecordId = createHealthRecordId('HR-67890');
getHealthRecord(validStudentId, validRecordId);

// These would cause compile errors:
// getHealthRecord(validRecordId, validStudentId); // ❌ Types are swapped
// getHealthRecord('STU-12345', 'HR-67890');       // ❌ Raw strings not allowed

// ============================================================================
// EXAMPLE 2: Value Objects with Validation
// ============================================================================

/**
 * Value objects encapsulate validation logic and ensure data integrity
 */

interface VitalSignsMeasurement {
  readonly value: number;
  readonly unit: string;
}

class Temperature implements VitalSignsMeasurement {
  private constructor(
    readonly value: number,
    readonly unit: 'celsius' | 'fahrenheit'
  ) {}

  static celsius(value: number): Temperature {
    if (value < 0 || value > 50) {
      throw new Error('Temperature in Celsius must be between 0 and 50');
    }
    return new Temperature(value, 'celsius');
  }

  static fahrenheit(value: number): Temperature {
    if (value < 32 || value > 122) {
      throw new Error('Temperature in Fahrenheit must be between 32 and 122');
    }
    return new Temperature(value, 'fahrenheit');
  }

  toCelsius(): number {
    return this.unit === 'celsius'
      ? this.value
      : (this.value - 32) * 5 / 9;
  }

  toFahrenheit(): number {
    return this.unit === 'fahrenheit'
      ? this.value
      : (this.value * 9 / 5) + 32;
  }

  isNormal(): boolean {
    const celsius = this.toCelsius();
    return celsius >= 36.1 && celsius <= 37.2;
  }
}

// Usage
const temp = Temperature.celsius(37.5);
console.log(`Temperature: ${temp.value}°${temp.unit}`);
console.log(`Is normal: ${temp.isNormal()}`);

// ============================================================================
// EXAMPLE 3: Discriminated Unions for Type-Safe Results
// ============================================================================

/**
 * Result type pattern eliminates need for throwing exceptions
 * and provides exhaustive error handling
 */

type ServiceResult<T, E = ServiceError> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

interface ServiceError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

// Example service method
async function getHealthRecordById(
  id: HealthRecordId
): Promise<ServiceResult<HealthRecordDomain>> {
  // Simulate database lookup
  const record = await findRecordInDatabase(id);

  if (!record) {
    return {
      success: false,
      error: {
        code: 'RECORD_NOT_FOUND',
        message: `Health record with ID ${id} not found`,
        details: { requestedId: id }
      }
    };
  }

  return {
    success: true,
    data: record
  };
}

// Type-safe usage with exhaustive checking
async function handleGetRecord(id: HealthRecordId) {
  const result = await getHealthRecordById(id);

  if (result.success) {
    // TypeScript knows result.data exists here
    console.log('Record found:', result.data);
    return result.data;
  } else {
    // TypeScript knows result.error exists here
    console.error('Error:', result.error.message);
    throw new Error(result.error.message);
  }
}

// ============================================================================
// EXAMPLE 4: DTO to Domain Mapping with Type Safety
// ============================================================================

/**
 * Demonstrates proper separation between DTOs and domain models
 * with type-safe transformations
 */

// DTO - API boundary type
interface CreateHealthRecordRequestDto {
  readonly studentId: string;
  readonly type: string;
  readonly date: string; // ISO 8601 string
  readonly description: string;
  readonly vital?: {
    readonly temperature?: number;
    readonly heartRate?: number;
  };
}

// Domain model - internal representation
interface HealthRecordDomain {
  readonly id: HealthRecordId;
  readonly studentId: StudentId;
  readonly type: HealthRecordType;
  readonly date: Date;
  readonly description: string;
  readonly vital?: {
    readonly temperature?: Temperature;
    readonly heartRate?: number;
  };
  readonly metadata: {
    readonly createdAt: Date;
    readonly createdBy: string;
  };
}

enum HealthRecordType {
  CHECKUP = 'CHECKUP',
  VACCINATION = 'VACCINATION',
  ILLNESS = 'ILLNESS',
}

// Type guard for runtime validation
function isHealthRecordType(value: unknown): value is HealthRecordType {
  return typeof value === 'string' &&
    Object.values(HealthRecordType).includes(value as HealthRecordType);
}

// Mapper class with validation
class HealthRecordMapper {
  static toCreateDomain(
    dto: CreateHealthRecordRequestDto,
    createdBy: string
  ): Omit<HealthRecordDomain, 'id'> {
    // Validate and transform type
    if (!isHealthRecordType(dto.type)) {
      throw new Error(`Invalid health record type: ${dto.type}`);
    }

    // Validate and parse date
    const date = new Date(dto.date);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date format: ${dto.date}`);
    }

    // Transform vital signs if present
    const vital = dto.vital ? {
      temperature: dto.vital.temperature
        ? Temperature.celsius(dto.vital.temperature)
        : undefined,
      heartRate: dto.vital.heartRate
    } : undefined;

    return {
      studentId: createStudentId(dto.studentId),
      type: dto.type,
      date,
      description: dto.description,
      vital,
      metadata: {
        createdAt: new Date(),
        createdBy
      }
    };
  }

  static toResponseDto(domain: HealthRecordDomain): HealthRecordResponseDto {
    return {
      id: domain.id,
      studentId: domain.studentId,
      type: domain.type,
      date: domain.date.toISOString(),
      description: domain.description,
      vital: domain.vital ? {
        temperature: domain.vital.temperature?.value,
        heartRate: domain.vital.heartRate
      } : undefined,
      createdAt: domain.metadata.createdAt.toISOString()
    };
  }
}

interface HealthRecordResponseDto {
  readonly id: string;
  readonly studentId: string;
  readonly type: HealthRecordType;
  readonly date: string;
  readonly description: string;
  readonly vital?: {
    readonly temperature?: number;
    readonly heartRate?: number;
  };
  readonly createdAt: string;
}

// ============================================================================
// EXAMPLE 5: Repository Pattern with Interface Abstraction
// ============================================================================

/**
 * Repository interface provides abstraction over data access
 * Implementation can be swapped without affecting business logic
 */

interface IHealthRecordRepository {
  findById(id: HealthRecordId): Promise<HealthRecordDomain | null>;
  findByStudentId(studentId: StudentId): Promise<readonly HealthRecordDomain[]>;
  create(data: Omit<HealthRecordDomain, 'id'>): Promise<HealthRecordDomain>;
  update(id: HealthRecordId, data: Partial<HealthRecordDomain>): Promise<HealthRecordDomain>;
  delete(id: HealthRecordId): Promise<boolean>;
}

// Prisma implementation
class PrismaHealthRecordRepository implements IHealthRecordRepository {
  constructor(private prisma: any) {} // Replace 'any' with actual PrismaClient type

  async findById(id: HealthRecordId): Promise<HealthRecordDomain | null> {
    const record = await this.prisma.healthRecord.findUnique({
      where: { id: id as string }
    });

    return record ? this.toDomain(record) : null;
  }

  async findByStudentId(studentId: StudentId): Promise<readonly HealthRecordDomain[]> {
    const records = await this.prisma.healthRecord.findMany({
      where: { studentId: studentId as string },
      orderBy: { date: 'desc' }
    });

    return records.map(r => this.toDomain(r));
  }

  async create(data: Omit<HealthRecordDomain, 'id'>): Promise<HealthRecordDomain> {
    const record = await this.prisma.healthRecord.create({
      data: this.toPrisma(data)
    });

    return this.toDomain(record);
  }

  async update(
    id: HealthRecordId,
    data: Partial<HealthRecordDomain>
  ): Promise<HealthRecordDomain> {
    const record = await this.prisma.healthRecord.update({
      where: { id: id as string },
      data: this.toPrisma(data)
    });

    return this.toDomain(record);
  }

  async delete(id: HealthRecordId): Promise<boolean> {
    try {
      await this.prisma.healthRecord.delete({
        where: { id: id as string }
      });
      return true;
    } catch {
      return false;
    }
  }

  private toDomain(prismaRecord: any): HealthRecordDomain {
    // Transform Prisma object to domain model
    return {
      id: createHealthRecordId(prismaRecord.id),
      studentId: createStudentId(prismaRecord.studentId),
      type: prismaRecord.type as HealthRecordType,
      date: new Date(prismaRecord.date),
      description: prismaRecord.description,
      vital: prismaRecord.vital as any, // Parse JSON vital signs
      metadata: {
        createdAt: new Date(prismaRecord.createdAt),
        createdBy: prismaRecord.createdBy || 'system'
      }
    };
  }

  private toPrisma(domainData: Partial<HealthRecordDomain>): any {
    // Transform domain model to Prisma object
    return {
      studentId: domainData.studentId as string | undefined,
      type: domainData.type,
      date: domainData.date,
      description: domainData.description,
      vital: domainData.vital as any, // Serialize to JSON
    };
  }
}

// In-memory implementation for testing
class InMemoryHealthRecordRepository implements IHealthRecordRepository {
  private records: Map<string, HealthRecordDomain> = new Map();

  async findById(id: HealthRecordId): Promise<HealthRecordDomain | null> {
    return this.records.get(id) || null;
  }

  async findByStudentId(studentId: StudentId): Promise<readonly HealthRecordDomain[]> {
    return Array.from(this.records.values())
      .filter(r => r.studentId === studentId);
  }

  async create(data: Omit<HealthRecordDomain, 'id'>): Promise<HealthRecordDomain> {
    const id = createHealthRecordId(`HR-${Date.now()}`);
    const record: HealthRecordDomain = { id, ...data };
    this.records.set(id, record);
    return record;
  }

  async update(
    id: HealthRecordId,
    data: Partial<HealthRecordDomain>
  ): Promise<HealthRecordDomain> {
    const existing = this.records.get(id);
    if (!existing) {
      throw new Error('Record not found');
    }
    const updated = { ...existing, ...data };
    this.records.set(id, updated);
    return updated;
  }

  async delete(id: HealthRecordId): Promise<boolean> {
    return this.records.delete(id);
  }
}

// ============================================================================
// EXAMPLE 6: Service Layer with Dependency Injection
// ============================================================================

/**
 * Service implementation with injected dependencies
 * Follows SOLID principles and enables easy testing
 */

interface IHealthRecordService {
  getRecord(id: HealthRecordId): Promise<ServiceResult<HealthRecordDomain>>;
  createRecord(dto: CreateHealthRecordRequestDto): Promise<ServiceResult<HealthRecordDomain>>;
}

interface IAuditService {
  log(action: string, details: Record<string, unknown>): Promise<void>;
}

class HealthRecordService implements IHealthRecordService {
  constructor(
    private readonly repository: IHealthRecordRepository,
    private readonly auditService: IAuditService,
    private readonly currentUserId: string
  ) {}

  async getRecord(id: HealthRecordId): Promise<ServiceResult<HealthRecordDomain>> {
    try {
      // Audit access
      await this.auditService.log('READ_HEALTH_RECORD', {
        recordId: id,
        userId: this.currentUserId
      });

      // Fetch from repository
      const record = await this.repository.findById(id);

      if (!record) {
        return {
          success: false,
          error: {
            code: 'RECORD_NOT_FOUND',
            message: `Health record ${id} not found`
          }
        };
      }

      return {
        success: true,
        data: record
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  async createRecord(
    dto: CreateHealthRecordRequestDto
  ): Promise<ServiceResult<HealthRecordDomain>> {
    try {
      // Map DTO to domain
      const domainData = HealthRecordMapper.toCreateDomain(dto, this.currentUserId);

      // Create in repository
      const record = await this.repository.create(domainData);

      // Audit creation
      await this.auditService.log('CREATE_HEALTH_RECORD', {
        recordId: record.id,
        studentId: record.studentId,
        userId: this.currentUserId
      });

      return {
        success: true,
        data: record
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATION_FAILED',
          message: error instanceof Error ? error.message : 'Failed to create record'
        }
      };
    }
  }
}

// ============================================================================
// EXAMPLE 7: Type-Safe Error Handling Hierarchy
// ============================================================================

/**
 * Custom error hierarchy provides type-safe exception handling
 */

abstract class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly validationErrors: Array<{
      field: string;
      message: string;
    }>
  ) {
    super(message, 'VALIDATION_ERROR', 400, { validationErrors });
  }
}

class NotFoundError extends DomainError {
  constructor(resourceType: string, resourceId: string) {
    super(
      `${resourceType} with ID ${resourceId} not found`,
      'NOT_FOUND',
      404,
      { resourceType, resourceId }
    );
  }
}

class UnauthorizedError extends DomainError {
  constructor(action: string) {
    super(
      `Unauthorized to perform action: ${action}`,
      'UNAUTHORIZED',
      403,
      { action }
    );
  }
}

// Type-safe error handling
async function handleRequest() {
  try {
    // Some operation
    throw new ValidationError('Invalid data', [
      { field: 'date', message: 'Date is required' }
    ]);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log('Validation errors:', error.validationErrors);
      return { status: 400, errors: error.validationErrors };
    } else if (error instanceof NotFoundError) {
      console.log('Resource not found:', error.details);
      return { status: 404, message: error.message };
    } else if (error instanceof UnauthorizedError) {
      console.log('Unauthorized:', error.details);
      return { status: 403, message: error.message };
    } else {
      console.error('Unknown error:', error);
      return { status: 500, message: 'Internal server error' };
    }
  }
}

// ============================================================================
// EXAMPLE 8: Frontend Type-Safe API Client
// ============================================================================

/**
 * Type-safe API client using the same DTOs as backend
 */

interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: {
    readonly code: string;
    readonly message: string;
  };
}

class HealthRecordsApiClient {
  constructor(private baseUrl: string) {}

  async getRecord(id: HealthRecordId): Promise<ApiResponse<HealthRecordResponseDto>> {
    const response = await fetch(`${this.baseUrl}/health-records/${id}`);
    return response.json();
  }

  async createRecord(
    dto: CreateHealthRecordRequestDto
  ): Promise<ApiResponse<HealthRecordResponseDto>> {
    const response = await fetch(`${this.baseUrl}/health-records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    });
    return response.json();
  }

  async getStudentRecords(
    studentId: StudentId
  ): Promise<ApiResponse<readonly HealthRecordResponseDto[]>> {
    const response = await fetch(
      `${this.baseUrl}/health-records/student/${studentId}`
    );
    return response.json();
  }
}

// Usage with React Query
import { useQuery, useMutation } from '@tanstack/react-query';

function useHealthRecord(id: HealthRecordId) {
  return useQuery({
    queryKey: ['healthRecord', id],
    queryFn: async () => {
      const client = new HealthRecordsApiClient('/api');
      const response = await client.getRecord(id);

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to fetch record');
      }

      return response.data;
    }
  });
}

function useCreateHealthRecord() {
  return useMutation({
    mutationFn: async (dto: CreateHealthRecordRequestDto) => {
      const client = new HealthRecordsApiClient('/api');
      const response = await client.createRecord(dto);

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to create record');
      }

      return response.data;
    }
  });
}

// React component usage
function HealthRecordDetail({ recordId }: { recordId: string }) {
  const id = createHealthRecordId(recordId);
  const { data, isLoading, error } = useHealthRecord(id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <h2>{data.type}</h2>
      <p>{data.description}</p>
      <p>Date: {data.date}</p>
    </div>
  );
}

// ============================================================================
// EXAMPLE 9: Zod Schema Validation (Alternative to Joi)
// ============================================================================

/**
 * Runtime validation with Zod that matches TypeScript types
 */

import { z } from 'zod';

// Define Zod schema
const CreateHealthRecordSchema = z.object({
  studentId: z.string().min(1),
  type: z.enum([
    'CHECKUP',
    'VACCINATION',
    'ILLNESS',
    'INJURY',
    'SCREENING',
    'PHYSICAL_EXAM',
    'MENTAL_HEALTH',
    'DENTAL',
    'VISION',
    'HEARING'
  ]),
  date: z.string().datetime(),
  description: z.string().min(1).max(1000),
  vital: z.object({
    temperature: z.number().min(0).max(50).optional(),
    heartRate: z.number().min(0).max(300).optional(),
  }).optional()
});

// Infer TypeScript type from schema
type CreateHealthRecordInput = z.infer<typeof CreateHealthRecordSchema>;

// Validation function
function validateCreateRequest(
  data: unknown
): ServiceResult<CreateHealthRecordInput> {
  const result = CreateHealthRecordSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: { errors: result.error.errors }
      }
    };
  }

  return {
    success: true,
    data: result.data
  };
}

// ============================================================================
// Helper function stubs (for compilation)
// ============================================================================

async function findRecordInDatabase(id: HealthRecordId): Promise<HealthRecordDomain | null> {
  return null;
}

export {};
