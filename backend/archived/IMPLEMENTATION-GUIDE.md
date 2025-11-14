# NestJS Swagger & Sequelize Alignment - Implementation Guide

**Status:** Phase 1 (Critical Security) - COMPLETE ✅
**Remaining:** Phases 2-6 (~350 hours)

This guide provides step-by-step instructions for addressing all 385+ hours of identified gaps in NestJS Swagger and Sequelize alignment.

---

## What Has Been Completed ✅

### Phase 1: Critical Security (16 hours) - **COMPLETE**

1. ✅ **Production Swagger Security Configured**
   - Added environment check in `/backend/src/main.ts`
   - Swagger now disabled in production by default
   - Added 12 Swagger environment variables to `/backend/.env.example`
   - Security risk mitigated

2. ✅ **Swagger CLI Plugin Configured**
   - Added plugin to `/backend/nest-cli.json`
   - Enables automatic type inference from TypeScript metadata
   - Reduces manual @ApiProperty decorators needed by 60-70%
   - classValidatorShim and introspectComments enabled

3. ✅ **Error Response DTO Classes Created**
   - `/backend/src/common/dto/error-response.dto.ts` (6 DTOs)
   - ErrorResponseDto (base)
   - ValidationErrorResponseDto
   - BusinessErrorResponseDto
   - HealthcareErrorResponseDto
   - SecurityErrorResponseDto
   - SystemErrorResponseDto
   - DatabaseErrorResponseDto

4. ✅ **Standardized PaginatedResponseDto Created**
   - `/backend/src/common/dto/paginated-response.dto.ts`
   - PaginatedResponseDto<T> (generic)
   - PaginationMetaDto
   - PaginationQueryDto
   - Replaces 4 different pagination formats

5. ✅ **Common DTOs Index Created**
   - `/backend/src/common/dto/index.ts`
   - Centralized exports for all common DTOs

---

## Remaining Work Breakdown

### Total Estimated Effort: ~350 hours
### Recommended Team Size: 2-3 developers
### Timeline: 9-11 weeks

---

## Phase 2: Foundation (Weeks 2-3) - 40 hours

### Priority Tasks:

#### 1. Fix User Model Duplication (2 hours)

**Issue:** Two User model definitions with inconsistent security features

**Files:**
- `/backend/src/database/models/user.model.ts` (Complete)
- `/backend/src/services/user/entities/user.entity.ts` (Incomplete)

**Action:**
1. Compare both files line-by-line
2. Migrate missing fields from database model to entity:
   - `mfaEnabled`, `mfaSecret`, `mfaBackupCodes`, `mfaEnabledAt`
   - `oauthProvider`, `oauthProviderId`, `profilePictureUrl`
   - `isEmailVerified`, `emailVerifiedAt`
3. Standardize bcrypt salt rounds to 12
4. Ensure PHI audit logging in both
5. Consider consolidating into single model

#### 2. Update swagger.config.ts Global Schemas (2 hours)

**File:** `/backend/src/common/config/swagger.config.ts`

**Action:**
1. Update ErrorResponse schema (lines 171-212) to match new ErrorResponseDto
2. Add ValidationErrorResponse schema
3. Add HealthcareErrorResponse schema
4. Add BusinessErrorResponse schema
5. Register with `@ApiExtraModels` in controllers

**Code:**
```typescript
import {
  ErrorResponseDto,
  ValidationErrorResponseDto,
  BusinessErrorResponseDto,
  HealthcareErrorResponseDto,
} from '../dto';

// In createSwaggerConfig():
.addGlobalParameters({
  name: 'X-Request-ID',
  in: 'header',
  required: false,
  schema: { type: 'string', format: 'uuid' },
})
// Add after existing code:
.addGlobalParameters({
  name: 'page',
  in: 'query',
  required: false,
  schema: { type: 'number', default: 1, minimum: 1 },
})
.addGlobalParameters({
  name: 'limit',
  in: 'query',
  required: false,
  schema: { type: 'number', default: 20, minimum: 1, maximum: 100 },
})
```

#### 3. Create 20 Core Response DTOs (30 hours)

**Domains:** Student, HealthRecord, Appointment, Prescription, Clinical

**Student Domain (6 hours):**

Create `/backend/src/services/student/dto/student-response.dto.ts`:

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

export class UserSummaryDto {
  @ApiProperty({ description: 'User ID', example: 'uuid-here' })
  id: string;

  @ApiProperty({ description: 'First name', example: 'Jane' })
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Smith' })
  lastName: string;

  @ApiProperty({ description: 'Email address', example: 'jane.smith@school.edu' })
  email: string;

  @ApiProperty({ description: 'User role', example: 'nurse', enum: ['nurse', 'admin', 'staff'] })
  role: string;
}

export class SchoolSummaryDto {
  @ApiProperty({ description: 'School ID', example: 'uuid-here' })
  id: string;

  @ApiProperty({ description: 'School name', example: 'Lincoln Elementary' })
  name: string;

  @ApiProperty({ description: 'District ID', example: 'uuid-here' })
  districtId: string;
}

export class StudentResponseDto {
  @ApiProperty({ description: 'Student unique identifier', example: 'uuid-here' })
  id: string;

  @ApiProperty({ description: 'Student number (unique identifier)', example: 'STU-2024-001' })
  studentNumber: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  lastName: string;

  @ApiProperty({ description: 'Date of birth', example: '2010-05-15', format: 'date' })
  dateOfBirth: Date;

  @ApiProperty({ description: 'Grade level', example: '5', enum: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] })
  grade: string;

  @ApiProperty({ description: 'Gender', example: 'male', enum: ['male', 'female', 'other', 'prefer-not-to-say'] })
  gender: string;

  @ApiPropertyOptional({ description: 'Medical record number', example: 'MRN-12345' })
  medicalRecordNum?: string;

  @ApiPropertyOptional({ description: 'Profile photo URL', example: 'https://cdn.whitecross.health/photos/student-123.jpg' })
  photo?: string;

  @ApiProperty({ description: 'Whether student is currently active', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Enrollment date', example: '2024-09-01', format: 'date' })
  enrollmentDate: Date;

  @ApiProperty({ description: 'School ID', example: 'uuid-here' })
  schoolId: string;

  @ApiPropertyOptional({ description: 'Assigned nurse ID', example: 'uuid-here' })
  nurseId?: string;

  @ApiPropertyOptional({ description: 'District ID', example: 'uuid-here' })
  districtId?: string;

  // Virtual/Computed Fields
  @ApiProperty({ description: 'Full name (computed)', example: 'John Doe' })
  fullName: string;

  @ApiProperty({ description: 'Age in years (computed)', example: 14 })
  age: number;

  // Associations (if included in query)
  @ApiPropertyOptional({ description: 'Assigned nurse details', type: () => UserSummaryDto })
  @Type(() => UserSummaryDto)
  nurse?: UserSummaryDto;

  @ApiPropertyOptional({ description: 'School details', type: () => SchoolSummaryDto })
  @Type(() => SchoolSummaryDto)
  school?: SchoolSummaryDto;

  // Timestamps
  @ApiProperty({ description: 'Record creation timestamp', example: '2024-09-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Record last update timestamp', example: '2024-11-14T15:30:00.000Z' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Soft delete timestamp', example: null, nullable: true })
  deletedAt?: Date | null;
}

export class StudentListResponseDto extends PaginatedResponseDto<StudentResponseDto> {
  @ApiProperty({ description: 'Array of students', type: [StudentResponseDto], isArray: true })
  @Type(() => StudentResponseDto)
  data: StudentResponseDto[];
}
```

**Repeat similar pattern for:**
- `HealthRecordResponseDto` (6 hours)
- `AppointmentResponseDto` (5 hours)
- `PrescriptionResponseDto` (5 hours)
- `AllergyResponseDto` (3 hours)
- `VaccinationResponseDto` (3 hours)
- `MedicationResponseDto` (2 hours)

#### 4. Update swagger.config.ts to Include New DTOs (1 hour)

**Add to swagger.config.ts:**
```typescript
import { StudentResponseDto, StudentListResponseDto } from '../services/student/dto/student-response.dto';
import { PaginatedResponseDto } from '../common/dto';

// In createSwaggerConfig(), add:
.addTag('Students', 'Student management and health records', {
  externalDocs: {
    description: 'Student API Documentation',
    url: 'https://docs.whitecross.health/api/students',
  },
})
```

---

## Phase 3: Response Schemas (Weeks 4-6) - 80 hours

### Priority Tasks:

#### 1. Add Response Types to Top 10 Priority Controllers (30 hours)

**Controllers to fix (in priority order):**

1. `/backend/src/services/student/controllers/student-management.controller.ts` (15 issues)
2. `/backend/src/administration/controllers/administration.controller.ts` (14 issues)
3. `/backend/src/health-domain/health-domain.controller.ts` (13 issues)
4. `/backend/src/services/follow-up/follow-up.controller.ts` (12 issues)
5. `/backend/src/budget/controllers/budget.controller.ts` (11 issues)
6. `/backend/src/incident-report/controllers/incident-report.controller.ts` (10 issues)
7. `/backend/src/services/pdf/pdf.controller.ts` (8 issues)
8. `/backend/src/services/audit/audit.controller.ts` (8 issues)
9. `/backend/src/consent-forms/consent-forms.controller.ts` (8 issues)
10. `/backend/src/configuration/configuration.controller.ts` (6 issues)

**For each controller:**
1. Replace string type references with actual DTO classes
2. Add `type:` to all @ApiResponse decorators
3. Add @ApiExtraModels at controller level
4. Replace inline schemas with DTO classes

**Example fix:**

**Before:**
```typescript
@ApiResponse({
  status: 201,
  description: 'Student created successfully',
  type: 'Student',  // ❌ String reference
})
async create(@Body() createDto: CreateStudentDto): Promise<Student> {  // ❌ Raw Sequelize model
  return this.studentService.create(createDto);
}
```

**After:**
```typescript
import { StudentResponseDto } from '../dto/student-response.dto';
import { ErrorResponseDto, ValidationErrorResponseDto } from '../../../common/dto';

@ApiExtraModels(StudentResponseDto, ErrorResponseDto, ValidationErrorResponseDto)
@Controller('students')
export class StudentController {
  // ...

  @ApiCreatedResponse({
    description: 'Student created successfully',
    type: StudentResponseDto,  // ✅ Typed response
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    type: ValidationErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Student with this student number already exists',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async create(@Body() createDto: CreateStudentDto): Promise<StudentResponseDto> {  // ✅ DTO return type
    const student = await this.studentService.create(createDto);
    return this.mapToResponseDto(student);  // ✅ Transform to DTO
  }

  private mapToResponseDto(student: Student): StudentResponseDto {
    return {
      id: student.id,
      studentNumber: student.studentNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth,
      grade: student.grade,
      gender: student.gender,
      medicalRecordNum: student.medicalRecordNum,
      photo: student.photo,
      isActive: student.isActive,
      enrollmentDate: student.enrollmentDate,
      schoolId: student.schoolId,
      nurseId: student.nurseId,
      districtId: student.districtId,
      fullName: student.fullName,  // Virtual getter
      age: student.age,  // Virtual getter
      nurse: student.nurse ? {
        id: student.nurse.id,
        firstName: student.nurse.firstName,
        lastName: student.nurse.lastName,
        email: student.nurse.email,
        role: student.nurse.role,
      } : undefined,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
      deletedAt: student.deletedAt,
    };
  }
}
```

#### 2. Fix Enterprise Features Response DTOs (10 hours)

**Files to fix (10 DTOs missing ALL @ApiProperty decorators):**

1. `/backend/src/enterprise-features/dto/regulations.dto.ts` - RegulationUpdateResponseDto
2. `/backend/src/enterprise-features/dto/bulk-messaging.dto.ts` - BulkMessageResponseDto
3. `/backend/src/enterprise-features/dto/custom-report.dto.ts` - ReportDefinitionResponseDto
4. `/backend/src/enterprise-features/dto/analytics.dto.ts` - DashboardMetricResponseDto
5. `/backend/src/enterprise-features/dto/waitlist.dto.ts` - WaitlistEntryResponseDto
6. `/backend/src/enterprise-features/dto/insurance-claim.dto.ts` - InsuranceClaimResponseDto
7. `/backend/src/enterprise-features/dto/message-template.dto.ts` - MessageTemplateResponseDto
8. `/backend/src/enterprise-features/dto/reminders.dto.ts` - ReminderScheduleResponseDto
9. `/backend/src/enterprise-features/dto/recurring-appointments.dto.ts` - RecurringTemplateResponseDto
10. `/backend/src/enterprise-features/dto/evidence.dto.ts` - EvidenceFileResponseDto

**Example fix for RegulationUpdateResponseDto:**

**Before:**
```typescript
export class RegulationUpdateResponseDto {
  id: string;
  state: string;
  category: string;
  // ... 9 more fields
}
```

**After:**
```typescript
export class RegulationUpdateResponseDto {
  @ApiProperty({ description: 'Regulation update unique identifier', example: 'uuid-here' })
  id: string;

  @ApiProperty({ description: 'US state code', example: 'CA', enum: ['CA', 'NY', 'TX', ...] })
  state: string;

  @ApiProperty({ description: 'Regulation category', example: 'immunization', enum: ['immunization', 'medication', 'emergency'] })
  category: string;

  @ApiProperty({ description: 'Regulation title', example: 'New COVID-19 Vaccine Requirements' })
  title: string;

  @ApiProperty({ description: 'Detailed description', example: 'Updated immunization requirements...' })
  description: string;

  @ApiProperty({ description: 'Effective date', example: '2025-01-01', format: 'date' })
  effectiveDate: Date;

  @ApiProperty({ description: 'Impact level', example: 'high', enum: ['high', 'medium', 'low'] })
  impact: 'high' | 'medium' | 'low';

  @ApiProperty({ description: 'Required actions', example: 'Update student immunization records' })
  actionRequired: string;

  @ApiProperty({ description: 'Implementation status', example: 'implementing', enum: ['pending-review', 'implementing', 'implemented'] })
  status: 'pending-review' | 'implementing' | 'implemented';
}
```

#### 3. Convert Interfaces to DTO Classes (17 interfaces) (15 hours)

**File:** `/backend/src/infrastructure/email/dto/email.dto.ts`

**Interfaces to convert:**
1. AlertEmailData
2. GenericEmailData
3. EmailDeliveryResult
4. EmailTrackingData
5. EmailQueueJobData
6. EmailQueueJobResult
7. RateLimitConfig
8. RateLimitStatus
9. EmailConfig
10. EmailValidationResult
11. EmailStatistics
12-17. (6 more interfaces)

**Example:**

**Before:**
```typescript
export interface AlertEmailData {
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  // ... more fields
}
```

**After:**
```typescript
export class AlertEmailDataDto {
  @ApiProperty({ description: 'Alert title', example: 'Critical System Error' })
  title: string;

  @ApiProperty({ description: 'Alert message', example: 'Database connection failed' })
  message: string;

  @ApiProperty({ description: 'Severity level', example: 'critical', enum: ['critical', 'warning', 'info'] })
  severity: 'critical' | 'warning' | 'info';

  @ApiProperty({ description: 'Alert category', example: 'system', enum: ['system', 'security', 'health', 'compliance'] })
  category: string;

  @ApiProperty({ description: 'Alert ID', example: 'alert-uuid-here' })
  alertId: string;

  @ApiProperty({ description: 'Timestamp', example: '2025-11-14T10:00:00.000Z' })
  timestamp: Date;

  @ApiPropertyOptional({ description: 'Additional context', example: { errorCode: 'DB_001', attempt: 3 } })
  additionalInfo?: Record<string, any>;
}
```

#### 4. Create Remaining 50-80 Response DTOs (25 hours)

**Domains:**
- Communication (MessageResponseDto, DeliveryStatusResponseDto, ConversationResponseDto)
- Inventory (InventoryItemResponseDto, StockAlertResponseDto, SupplierResponseDto)
- Clinical (VitalSignsResponseDto, ClinicalNoteResponseDto, TreatmentPlanResponseDto)
- Incident (IncidentReportResponseDto, IncidentResponseDto)
- Compliance (ConsentFormResponseDto, AuditLogResponseDto)

---

## Phase 4: Controller Documentation (Weeks 7-9) - 60 hours

### Priority Tasks:

#### 1. Fix Controller @ApiBody, @ApiParam, @ApiResponse Gaps (292 issues) (40 hours)

**Systematic approach:**

Create `/backend/scripts/fix-controller-decorators.ts`:

```typescript
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

/**
 * Automation script to add missing Swagger decorators to controllers
 * Run with: ts-node scripts/fix-controller-decorators.ts
 */

interface ControllerIssue {
  file: string;
  issues: {
    missingApiBody: number;
    missingApiParam: number;
    missingApiResponse: number;
  };
}

const TOP_10_CONTROLLERS: ControllerIssue[] = [
  { file: 'services/student/controllers/student-management.controller.ts', issues: { missingApiBody: 6, missingApiParam: 4, missingApiResponse: 5 } },
  { file: 'administration/controllers/administration.controller.ts', issues: { missingApiBody: 5, missingApiParam: 5, missingApiResponse: 4 } },
  // ... add remaining 8 controllers
];

async function fixController(controller: ControllerIssue): Promise<void> {
  const filePath = path.join(__dirname, '..', 'src', controller.file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Add imports if missing
  if (!content.includes('@ApiBody')) {
    content = addImport(content, 'ApiBody');
  }
  if (!content.includes('@ApiParam')) {
    content = addImport(content, 'ApiParam');
  }
  if (!content.includes('@ApiResponse')) {
    content = addImport(content, 'ApiResponse');
  }

  // TODO: Implement pattern matching and decorator insertion
  // This is a template - actual implementation needs AST parsing

  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed ${controller.file}`);
}

function addImport(content: string, decoratorName: string): string {
  const swaggerImportRegex = /import\s+{([^}]+)}\s+from\s+'@nestjs\/swagger';/;
  const match = content.match(swaggerImportRegex);

  if (match) {
    const imports = match[1].split(',').map(s => s.trim());
    if (!imports.includes(decoratorName)) {
      imports.push(decoratorName);
      const newImport = `import { ${imports.join(', ')} } from '@nestjs/swagger';`;
      return content.replace(swaggerImportRegex, newImport);
    }
  } else {
    // Add new import
    const firstImport = content.indexOf('import');
    const newImport = `import { ${decoratorName} } from '@nestjs/swagger';\n`;
    return content.slice(0, firstImport) + newImport + content.slice(firstImport);
  }

  return content;
}

async function main() {
  console.log('🔧 Starting controller decorator fixes...\n');

  for (const controller of TOP_10_CONTROLLERS) {
    await fixController(controller);
  }

  console.log('\n✅ All controllers fixed!');
}

main().catch(console.error);
```

**Manual Pattern (for each controller):**

1. **Add @ApiBody for POST/PUT/PATCH endpoints:**
   ```typescript
   @Post()
   @ApiBody({ type: CreateStudentDto })
   async create(@Body() dto: CreateStudentDto) { ... }
   ```

2. **Add @ApiParam for path parameters:**
   ```typescript
   @Get(':id')
   @ApiParam({ name: 'id', description: 'Student unique identifier', type: 'string', format: 'uuid' })
   async findOne(@Param('id') id: string) { ... }
   ```

3. **Add @ApiResponse for all status codes:**
   ```typescript
   @ApiOkResponse({ description: 'Student retrieved successfully', type: StudentResponseDto })
   @ApiNotFoundResponse({ description: 'Student not found', type: ErrorResponseDto })
   @ApiUnauthorizedResponse({ description: 'Unauthorized', type: SecurityErrorResponseDto })
   @ApiForbiddenResponse({ description: 'Insufficient permissions', type: SecurityErrorResponseDto })
   @ApiInternalServerErrorResponse({ description: 'Internal server error', type: SystemErrorResponseDto })
   ```

#### 2. Add @ApiQuery Decorators for DTO Parameters (15 critical endpoints) (10 hours)

**Endpoints to fix:**

1. `/backend/src/services/student/controllers/student-crud.controller.ts:101` - StudentFilterDto
2. `/backend/src/services/clinical/controllers/prescription.controller.ts:38` - PrescriptionFiltersDto
3. `/backend/src/services/audit/audit.controller.ts:108` - AuditLogFilterDto
4. ... (12 more endpoints)

**Example fix:**

**Before:**
```typescript
@Get()
async findAll(@Query() filterDto: StudentFilterDto) { ... }
```

**After:**
```typescript
@Get()
@ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
@ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 20 })
@ApiQuery({ name: 'search', required: false, type: String, description: 'Search term', example: 'John' })
@ApiQuery({ name: 'grade', required: false, type: String, description: 'Grade level', example: '5' })
@ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status', example: true })
@ApiQuery({ name: 'nurseId', required: false, type: String, description: 'Assigned nurse ID', example: 'uuid-here' })
@ApiQuery({ name: 'gender', required: false, enum: ['male', 'female', 'other', 'prefer-not-to-say'], description: 'Gender' })
@ApiQuery({ name: 'hasAllergies', required: false, type: Boolean, description: 'Filter students with allergies' })
@ApiQuery({ name: 'hasMedications', required: false, type: Boolean, description: 'Filter students with medications' })
async findAll(@Query() filterDto: StudentFilterDto) { ... }
```

#### 3. Add Error Response Documentation (10 hours)

**Use existing error builder decorators:**

**File:** `/backend/src/common/decorators/swagger-decorators.service.ts`

**Available decorators:**
- `@ApiResponseStandardErrors()` - Adds 400, 401, 403, 404, 500
- `@ApiResponseConflict()` - Adds 409
- `@ApiResponseUnprocessableEntity()` - Adds 422

**Example usage:**

**Before:**
```typescript
@Post()
async create(@Body() dto: CreateStudentDto) { ... }
```

**After:**
```typescript
import { ApiResponseStandardErrors, ApiResponseConflict } from '../../../common/decorators/swagger-decorators.service';

@Post()
@ApiResponseStandardErrors()  // Adds 400, 401, 403, 404, 500
@ApiResponseConflict()  // Adds 409
async create(@Body() dto: CreateStudentDto) { ... }
```

---

## Phase 5: Sequelize Alignment (Weeks 10-12) - 100 hours

### Priority Tasks:

#### 1. Document Sequelize Associations (133+ associations) (40 hours)

**Approach:**

For each model with associations, update the Response DTO to include association fields.

**Example - Student Model with 15 associations:**

```typescript
// Student Response DTO with associations documented
export class StudentResponseDto {
  // ... base fields ...

  // BelongsTo Associations
  @ApiPropertyOptional({
    description: 'Assigned nurse details (included when ?include=nurse)',
    type: () => UserSummaryDto,
    nullable: true,
  })
  @Type(() => UserSummaryDto)
  nurse?: UserSummaryDto;

  @ApiPropertyOptional({
    description: 'School details (included when ?include=school)',
    type: () => SchoolSummaryDto,
    nullable: true,
  })
  @Type(() => SchoolSummaryDto)
  school?: SchoolSummaryDto;

  @ApiPropertyOptional({
    description: 'District details (included when ?include=district)',
    type: () => DistrictSummaryDto,
    nullable: true,
  })
  @Type(() => DistrictSummaryDto)
  district?: DistrictSummaryDto;

  // HasMany Associations
  @ApiPropertyOptional({
    description: 'Health records (included when ?include=healthRecords)',
    type: [HealthRecordSummaryDto],
    isArray: true,
  })
  @Type(() => HealthRecordSummaryDto)
  healthRecords?: HealthRecordSummaryDto[];

  @ApiPropertyOptional({
    description: 'Appointments (included when ?include=appointments)',
    type: [AppointmentSummaryDto],
    isArray: true,
  })
  @Type(() => AppointmentSummaryDto)
  appointments?: AppointmentSummaryDto[];

  @ApiPropertyOptional({
    description: 'Allergies (included when ?include=allergies)',
    type: [AllergySummaryDto],
    isArray: true,
  })
  @Type(() => AllergySummaryDto)
  allergies?: AllergySummaryDto[];

  // ... 9 more HasMany associations
}
```

**Create summary DTOs for associations:**

```typescript
export class HealthRecordSummaryDto {
  @ApiProperty({ description: 'Health record ID', example: 'uuid-here' })
  id: string;

  @ApiProperty({ description: 'Record type', example: 'CHECKUP' })
  recordType: string;

  @ApiProperty({ description: 'Record date', example: '2024-11-14' })
  recordDate: Date;

  @ApiProperty({ description: 'Chief complaint', example: 'Routine physical exam' })
  chiefComplaint: string;
}
```

#### 2. Create Service DTO Transformers (475+ services) (40 hours)

**Create base transformer service:**

`/backend/src/common/services/dto-transformer.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class DtoTransformerService {
  /**
   * Transform Sequelize model to Response DTO
   * Handles associations, virtual fields, and excludes sensitive data
   */
  transform<T, D>(model: T, dtoClass: new () => D, options?: {
    include?: string[];
    exclude?: string[];
  }): D {
    const dto = new dtoClass();
    const modelJson = (model as any).toJSON();

    // Copy fields
    Object.keys(modelJson).forEach(key => {
      if (!options?.exclude?.includes(key)) {
        (dto as any)[key] = modelJson[key];
      }
    });

    // Handle associations
    if (options?.include) {
      options.include.forEach(assoc => {
        if (modelJson[assoc]) {
          (dto as any)[assoc] = Array.isArray(modelJson[assoc])
            ? modelJson[assoc].map((item: any) => item.toJSON ? item.toJSON() : item)
            : (modelJson[assoc].toJSON ? modelJson[assoc].toJSON() : modelJson[assoc]);
        }
      });
    }

    return dto;
  }

  transformMany<T, D>(models: T[], dtoClass: new () => D, options?: {
    include?: string[];
    exclude?: string[];
  }): D[] {
    return models.map(model => this.transform(model, dtoClass, options));
  }
}
```

**Update services to use transformer:**

**Before:**
```typescript
async create(dto: CreateStudentDto): Promise<Student> {
  return this.studentModel.create(dto);
}
```

**After:**
```typescript
async create(dto: CreateStudentDto): Promise<StudentResponseDto> {
  const student = await this.studentModel.create(dto);
  return this.dtoTransformer.transform(student, StudentResponseDto);
}
```

#### 3. Align Validation Rules (20 hours)

**Create validation decorators matching Sequelize validators:**

`/backend/src/common/validators/index.ts`:

```typescript
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

/**
 * NDC (National Drug Code) format validator
 * Matches Sequelize validation in Medication model
 */
export function IsNDC(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNDC',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          const ndcPattern = /^(\d{4}-\d{4}-\d{2}|\d{5}-\d{3}-\d{2}|\d{5}-\d{4}-\d{1}|\d{10}|\d{11})$/;
          return ndcPattern.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'NDC must be in valid format (e.g., 1234-5678-90 or 12345-678-90)';
        },
      },
    });
  };
}

/**
 * NPI (National Provider Identifier) format validator
 * Matches Sequelize validation in HealthRecord model
 */
export function IsNPI(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNPI',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          return /^\d{10}$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'NPI must be a 10-digit number';
        },
      },
    });
  };
}

/**
 * ICD-10 diagnosis code validator
 * Matches Sequelize validation in HealthRecord model
 */
export function IsICD10(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isICD10',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          return /^[A-Z]\d{2}(\.\d{1,4})?$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Diagnosis code must be in ICD-10 format (e.g., A00, A00.0, A00.01)';
        },
      },
    });
  };
}

/**
 * E.164 phone number format validator
 * Matches Sequelize validation in User model
 */
export function IsE164Phone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isE164Phone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          return /^\+?[1-9]\d{1,14}$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Phone number must be in E.164 format (e.g., +12125551234)';
        },
      },
    });
  };
}

/**
 * Student age range validator (3-22 years)
 * Matches Sequelize validation in Student model
 */
export function IsValidStudentAge(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidStudentAge',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!(value instanceof Date) && typeof value !== 'string') return false;
          const dob = new Date(value);
          const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
          return age >= 3 && age <= 22;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Student age must be between 3 and 22 years';
        },
      },
    });
  };
}
```

**Use in DTOs:**

```typescript
import { IsNDC, IsNPI, IsICD10, IsE164Phone, IsValidStudentAge } from '../../../common/validators';

export class CreateMedicationDto {
  @ApiProperty({ description: 'NDC code', example: '1234-5678-90' })
  @IsNDC()
  @IsOptional()
  ndc?: string;
}

export class CreateHealthRecordDto {
  @ApiProperty({ description: 'Provider NPI', example: '1234567890' })
  @IsNPI()
  @IsOptional()
  providerNpi?: string;

  @ApiProperty({ description: 'ICD-10 diagnosis code', example: 'A00.1' })
  @IsICD10()
  @IsOptional()
  diagnosisCode?: string;
}

export class CreateStudentDto {
  @ApiProperty({ description: 'Date of birth', example: '2010-05-15' })
  @IsDate()
  @IsValidStudentAge()
  dateOfBirth: Date;
}

export class CreateUserDto {
  @ApiProperty({ description: 'Phone number (E.164 format)', example: '+12125551234' })
  @IsE164Phone()
  @IsOptional()
  phone?: string;
}
```

---

## Phase 6: Polish (Weeks 13-14) - 40 hours

### Priority Tasks:

#### 1. Create Missing DTOs for 30+ Models (20 hours)

**Models without DTOs:**
- Infrastructure: cache-entry, backup-log, configuration-history, sync-state, etc.
- Communication: message-read, message-reaction, conversation, webhook
- Clinical: vital-signs, growth-tracking, lab-results, mental-health-record
- Administrative: academic-transcript, training-module, license
- Mobile: device-token, delivery-log, push-notification
- Inventory: supplier, vendor, purchase-order

#### 2. Add Examples and Descriptions (10 hours)

**Add to all @ApiProperty decorators:**
- `description`: Clear explanation
- `example`: Representative value
- `enum`: For enumerated types
- `format`: For dates, UUIDs, etc.

#### 3. Configure OAuth2 Flows (if needed) (5 hours)

**In swagger.config.ts:**

```typescript
.addOAuth2({
  type: 'oauth2',
  flows: {
    authorizationCode: {
      authorizationUrl: 'https://auth.whitecross.health/authorize',
      tokenUrl: 'https://auth.whitecross.health/token',
      scopes: {
        'students:read': 'Read student information',
        'students:write': 'Create and update students',
        'health-records:read': 'Read health records',
        'health-records:write': 'Create and update health records',
      },
    },
  },
})
```

#### 4. Final Validation (5 hours)

1. **Test OpenAPI Spec:**
   ```bash
   curl http://localhost:3001/api/docs-json > openapi.json
   ```

2. **Validate with Swagger Editor:**
   - Go to https://editor.swagger.io/
   - Upload openapi.json
   - Fix any validation errors

3. **Run Spectral Linting:**
   ```bash
   npm install -g @stoplight/spectral-cli
   spectral lint http://localhost:3001/api/docs-json
   ```

4. **Generate Client SDK:**
   ```bash
   npx @openapitools/openapi-generator-cli generate \
     -i http://localhost:3001/api/docs-json \
     -g typescript-axios \
     -o ./generated-client
   ```

5. **Test Generated Client:**
   - Verify all endpoints compile
   - Check type safety
   - Ensure no `any` types

---

## Automation Opportunities

### Scripts to Create:

1. **`scripts/add-api-property.ts`** - Automatically add @ApiProperty to DTO fields
2. **`scripts/fix-controller-decorators.ts`** - Add missing controller decorators
3. **`scripts/create-response-dto.ts`** - Generate response DTO from Sequelize model
4. **`scripts/validate-swagger.ts`** - Validate OpenAPI spec before commit
5. **`scripts/find-missing-docs.ts`** - Report controllers/endpoints missing documentation

### Git Pre-commit Hook:

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Validate Swagger configuration
npm run validate:swagger

# Check for missing @ApiProperty decorators
npm run lint:swagger
```

---

## Testing Strategy

### Unit Tests:

```typescript
// Test DTO transformation
describe('DtoTransformerService', () => {
  it('should transform Sequelize model to Response DTO', () => {
    const student = { id: '123', firstName: 'John', lastName: 'Doe' };
    const dto = transformer.transform(student, StudentResponseDto);
    expect(dto).toBeInstanceOf(StudentResponseDto);
    expect(dto.id).toBe('123');
  });

  it('should handle associations', () => {
    const student = { id: '123', nurse: { id: 'n1', firstName: 'Jane' } };
    const dto = transformer.transform(student, StudentResponseDto, { include: ['nurse'] });
    expect(dto.nurse).toBeDefined();
    expect(dto.nurse.id).toBe('n1');
  });
});
```

### Integration Tests:

```typescript
// Test Swagger documentation
describe('Swagger Documentation', () => {
  it('should expose OpenAPI spec at /api/docs-json', async () => {
    const response = await request(app.getHttpServer()).get('/api/docs-json');
    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe('3.0.3');
  });

  it('should have error response schemas', () => {
    const spec = getOpenAPISpec();
    expect(spec.components.schemas.ErrorResponseDto).toBeDefined();
    expect(spec.components.schemas.ValidationErrorResponseDto).toBeDefined();
  });
});
```

---

## Commit Strategy

### Commit in Phases:

1. **Phase 1 (DONE):** Security, CLI plugin, error DTOs, pagination DTOs
2. **Phase 2:** User model fix, swagger.config updates, 20 core response DTOs
3. **Phase 3:** Top 10 controllers, enterprise features, interface conversions
4. **Phase 4:** @ApiBody/@ApiParam/@ApiResponse gaps, @ApiQuery, error responses
5. **Phase 5:** Sequelize associations, DTO transformers, validation alignment
6. **Phase 6:** Remaining DTOs, examples, OAuth2, final validation

### Commit Message Format:

```
feat(swagger): [Phase X] Brief description

- Detailed change 1
- Detailed change 2
- Detailed change 3

BREAKING CHANGE: If applicable

Addresses: #issue-number
Part of: NestJS Swagger & Sequelize Alignment Initiative
```

---

## Success Metrics

### Definition of Done:

- ✅ OpenAPI spec validates with 0 errors in Swagger Editor
- ✅ Spectral linting passes with no warnings
- ✅ All controllers have @ApiTags, @ApiOperation, @ApiResponse
- ✅ All endpoints document 200, 400, 401, 403, 404, 500 status codes
- ✅ All DTOs have @ApiProperty decorators with descriptions and examples
- ✅ All Sequelize associations documented in Response DTOs
- ✅ All services return Response DTOs instead of raw models
- ✅ Single pagination format used across all endpoints
- ✅ Error responses use Error Response DTOs
- ✅ Generated TypeScript client compiles with no errors
- ✅ Frontend team approves API documentation
- ✅ Security audit passed (Swagger disabled in production)

---

## Resources

### Documentation:
- [NestJS Swagger](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI 3.0 Specification](https://spec.openapis.org/oas/v3.0.3)
- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [class-validator](https://github.com/typestack/class-validator)
- [class-transformer](https://github.com/typestack/class-transformer)

### Tools:
- [Swagger Editor](https://editor.swagger.io/)
- [Spectral CLI](https://stoplight.io/open-source/spectral)
- [OpenAPI Generator](https://openapi-generator.tech/)

---

## Support

For questions or issues during implementation:
1. Review consolidated analysis report: `/NESTJS-SWAGGER-SEQUELIZE-ALIGNMENT-CONSOLIDATED-REPORT.md`
2. Check agent-specific reports in `/.temp/` and root directory
3. Consult this implementation guide
4. Create issue in project repository

---

**Next Step:** Begin Phase 2 - Foundation (Week 2)
**Start With:** Fix User Model Duplication (2 hours)
