# Validation and Error Handling Implementation Guide

## Overview

This guide provides comprehensive documentation for the validation and error handling infrastructure implemented in the NestJS backend.

## Table of Contents

1. [Architecture](#architecture)
2. [Exception Handling](#exception-handling)
3. [Custom Validators](#custom-validators)
4. [DTO Validation](#dto-validation)
5. [Business Logic Validation](#business-logic-validation)
6. [Interceptors](#interceptors)
7. [Best Practices](#best-practices)
8. [Examples](#examples)

## Architecture

### Exception Hierarchy

```
Error
└── HttpException (NestJS)
    ├── BusinessException
    │   └── Custom business logic errors
    ├── ValidationException
    │   └── Input validation errors
    ├── HealthcareException
    │   └── Healthcare domain errors
    └── System exceptions (handled by AllExceptionsFilter)
```

### Key Components

- **Exception Filters**: Global error handling (`HttpExceptionFilter`, `AllExceptionsFilter`)
- **Custom Exceptions**: Domain-specific exceptions with factory methods
- **Validators**: Custom class-validator decorators for healthcare domain
- **Interceptors**: Logging, sanitization, timeout handling
- **Error Codes**: Standardized error codes for client handling

## Exception Handling

### Global Exception Filters

#### HttpExceptionFilter

Handles all NestJS HTTP exceptions with HIPAA-compliant error responses.

```typescript
import { HttpExceptionFilter } from '@/common/exceptions';

app.useGlobalFilters(new HttpExceptionFilter());
```

**Features:**
- Standardized error response format
- PHI redaction in error messages
- Automatic audit logging for security events
- Development vs production error details
- Request ID tracking

#### AllExceptionsFilter

Catches all unhandled exceptions as a safety net.

```typescript
import { AllExceptionsFilter } from '@/common/exceptions';

app.useGlobalFilters(
  new AllExceptionsFilter(),
  new HttpExceptionFilter()
);
```

### Custom Exceptions

#### BusinessException

```typescript
import { BusinessException, ErrorCodes } from '@/common/exceptions';

// Factory methods
throw BusinessException.notFound('Student', studentId);
throw BusinessException.alreadyExists('Student', studentNumber);
throw BusinessException.dependencyExists('Student', 'appointments', 3);

// Custom
throw new BusinessException(
  'Cannot delete student with active appointments',
  ErrorCodes.DEPENDENCY_EXISTS,
  { studentId, count: 3 }
);
```

#### ValidationException

```typescript
import { ValidationException, ValidationErrorCodes } from '@/common/exceptions';

// Factory methods
throw ValidationException.requiredFieldMissing('email');
throw ValidationException.invalidFormat('phone', '(555) 123-4567');
throw ValidationException.outOfRange('age', 3, 22, 25);

// From class-validator errors
throw ValidationException.fromClassValidator(errors);
```

#### HealthcareException

```typescript
import { HealthcareException, HealthcareErrorCodes } from '@/common/exceptions';

// Drug interaction
throw HealthcareException.drugInteraction(
  ['Aspirin', 'Warfarin'],
  'critical',
  'Increased bleeding risk'
);

// Allergy conflict
throw HealthcareException.allergyConflict(
  'Penicillin',
  'Beta-lactam',
  'Severe reaction'
);

// Consent required
throw HealthcareException.consentRequired('medication administration', studentId);

// Dosage validation
throw HealthcareException.dosageOutOfRange(
  'Aspirin',
  '1500 mg',
  '325 mg',
  '650 mg'
);
```

## Custom Validators

### Phone Number Validation

```typescript
import { IsPhone } from '@/common/validators';

class ContactDto {
  @IsPhone()
  phone: string;

  @IsPhone({ allowExtension: true })
  workPhone: string;

  @IsPhone({ allowInternational: true })
  emergencyPhone: string;
}
```

**Supports:**
- US formats: (555) 123-4567, 555-123-4567, 555.123.4567
- Extensions: ext 123, x 456
- International format: +1XXXXXXXXXX

### SSN Validation

```typescript
import { IsSSN } from '@/common/validators';

class StudentDto {
  @IsSSN({ allowDashes: true, strictValidation: true })
  ssn: string;
}
```

**Features:**
- Format validation (XXX-XX-XXXX or XXXXXXXXX)
- Invalid pattern detection
- Area/group/serial validation

**Security Note:** Always encrypt SSN in database!

### Medical Record Number

```typescript
import { IsMRN } from '@/common/validators';

class HealthRecordDto {
  @IsMRN()
  medicalRecordNumber: string;

  @IsMRN({ minLength: 8, maxLength: 10 })
  alternateMRN: string;
}
```

### NPI Validation

```typescript
import { IsNPI } from '@/common/validators';

class ProviderDto {
  @IsNPI()
  npi: string;

  @IsNPI({ validateChecksum: false })
  backupNPI: string;
}
```

**Features:**
- 10-digit format validation
- Luhn algorithm checksum validation
- Prevents invalid NPIs

### ICD-10 Code Validation

```typescript
import { IsICD10 } from '@/common/validators';

class DiagnosisDto {
  @IsICD10()
  diagnosisCode: string;

  @IsICD10({ strictFormat: true })
  primaryDiagnosis: string;
}
```

**Formats:**
- Category: A00
- Subcategory: A00.0
- Full code: A00.01

### Medication Dosage

```typescript
import { IsDosage } from '@/common/validators';

class PrescriptionDto {
  @IsDosage()
  dosage: string; // e.g., "10 mg", "2.5 ml"

  @IsDosage({ allowedUnits: ['mg', 'mcg'], minValue: 0.1, maxValue: 1000 })
  maxDosage: string;
}
```

### HTML Sanitization

```typescript
import { SanitizeHtml, SanitizeText } from '@/common/validators';

class NoteDto {
  @SanitizeText()
  @IsString()
  plainNote: string;

  @SanitizeHtml({ allowBasicFormatting: true })
  @IsString()
  formattedNote: string;
}
```

## DTO Validation

### Complete DTO Example

```typescript
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhone, SanitizeText } from '@/common/validators';

export class CreateContactDto {
  @ApiProperty({ example: 'John Doe', description: 'Contact name' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(1, { message: 'Name is required' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  @SanitizeText()
  name: string;

  @ApiProperty({ example: 'parent@email.com', description: 'Email address' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({ example: '(555) 123-4567', description: 'Phone number' })
  @IsPhone({ allowExtension: true })
  phone: string;

  @ApiProperty({ example: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @SanitizeText()
  notes?: string;
}
```

### Controller Usage

```typescript
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { HealthcareValidationPipe } from '@/middleware/core/pipes/validation.pipe';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contacts')
export class ContactController {
  @Post()
  @UsePipes(HealthcareValidationPipe)
  async create(@Body() dto: CreateContactDto) {
    return this.service.create(dto);
  }
}
```

## Business Logic Validation

### Service-Level Validation

```typescript
import { Injectable } from '@nestjs/common';
import { BusinessException, HealthcareException } from '@/common/exceptions';

@Injectable()
export class PrescriptionService {
  async create(dto: CreatePrescriptionDto): Promise<Prescription> {
    // Validate student exists
    const student = await this.studentRepo.findById(dto.studentId);
    if (!student) {
      throw BusinessException.notFound('Student', dto.studentId);
    }

    // Validate consent
    if (!student.hasActiveConsent('medication')) {
      throw HealthcareException.consentRequired(
        'medication administration',
        student.id
      );
    }

    // Validate drug interactions
    const interactions = await this.drugService.checkInteractions(
      dto.medicationId,
      student.currentMedications
    );

    if (interactions.hasCritical) {
      throw HealthcareException.drugInteraction(
        [dto.medicationName, ...interactions.conflictingMeds],
        'critical',
        interactions.description
      );
    }

    // Validate allergies
    const allergyConflict = await this.allergyService.checkConflict(
      dto.medicationId,
      student.allergies
    );

    if (allergyConflict) {
      throw HealthcareException.allergyConflict(
        dto.medicationName,
        allergyConflict.allergen,
        allergyConflict.reactionType
      );
    }

    // Create prescription
    return this.prescriptionRepo.create(dto);
  }
}
```

## Interceptors

### Global Interceptor Setup

```typescript
import {
  LoggingInterceptor,
  SanitizationInterceptor,
  TimeoutInterceptor,
} from '@/common/interceptors';

app.useGlobalInterceptors(
  new LoggingInterceptor(),
  new SanitizationInterceptor(),
  new TimeoutInterceptor()
);
```

### Logging Interceptor

Automatically logs all requests/responses with PHI redaction.

**Features:**
- Request ID generation/tracking
- Sensitive field redaction
- Request/response timing
- Error logging

### Sanitization Interceptor

Prevents XSS and injection attacks.

**Features:**
- XSS pattern detection and removal
- SQL injection pattern blocking
- Path traversal prevention
- Automatic input sanitization

### Timeout Interceptor

Prevents long-running requests.

```typescript
@Controller('reports')
export class ReportController {
  @Get('complex')
  @SetMetadata('timeout', 60000) // 60 second timeout
  async generateComplexReport() {
    // Long-running operation
  }
}
```

## Best Practices

### 1. Always Use DTOs

```typescript
// Good
@Post()
async create(@Body() dto: CreateStudentDto) { }

// Bad
@Post()
async create(@Body() data: any) { }
```

### 2. Use Specific Exception Types

```typescript
// Good
throw BusinessException.notFound('Student', id);

// Bad
throw new NotFoundException('Student not found');
```

### 3. Validate in Services, Not Controllers

```typescript
// Good
@Injectable()
class StudentService {
  async create(dto: CreateStudentDto) {
    // Business logic validation here
    if (await this.exists(dto.studentNumber)) {
      throw BusinessException.alreadyExists('Student', dto.studentNumber);
    }
  }
}

// Bad
@Controller()
class StudentController {
  @Post()
  async create(@Body() dto: CreateStudentDto) {
    // Don't put business logic here
  }
}
```

### 4. Use Healthcare Validators for PHI

```typescript
// Good
class StudentDto {
  @IsSSN({ strictValidation: true })
  @Transform(({ value }) => encryptSSN(value))
  ssn: string;
}

// Bad
class StudentDto {
  @IsString()
  ssn: string; // No validation or encryption!
}
```

### 5. Sanitize User Input

```typescript
class NoteDto {
  @SanitizeHtml()
  @MaxLength(5000)
  content: string;
}
```

### 6. Provide Meaningful Error Messages

```typescript
// Good
@MinLength(8, { message: 'Password must be at least 8 characters' })

// Bad
@MinLength(8)
```

## Complete Examples

### Example 1: Creating a Medication DTO

```typescript
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { IsDosage, IsNPI, SanitizeText } from '@/common/validators';

enum MedicationRoute {
  ORAL = 'oral',
  TOPICAL = 'topical',
  INJECTION = 'injection',
  INHALATION = 'inhalation',
}

export class CreatePrescriptionDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @SanitizeText()
  medicationName: string;

  @ApiProperty({ example: '10 mg' })
  @IsDosage({ allowedUnits: ['mg', 'mcg', 'ml'] })
  dosage: string;

  @ApiProperty({ enum: MedicationRoute })
  @IsEnum(MedicationRoute)
  route: MedicationRoute;

  @ApiProperty()
  @IsNPI()
  prescriberId: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(1000)
  @SanitizeText()
  instructions?: string;
}
```

### Example 2: Service with Comprehensive Validation

```typescript
@Injectable()
export class VitalSignsService {
  async recordVitals(dto: RecordVitalsDto): Promise<VitalSign> {
    // Validate student exists
    const student = await this.studentRepo.findById(dto.studentId);
    if (!student) {
      throw BusinessException.notFound('Student', dto.studentId);
    }

    // Validate temperature range
    if (dto.temperature < 95 || dto.temperature > 105) {
      throw HealthcareException.vitalSignsOutOfRange(
        'Temperature',
        dto.temperature,
        96.8,
        100.4
      );
    }

    // Validate heart rate for age
    const age = this.calculateAge(student.dateOfBirth);
    if (!this.isValidHeartRate(dto.heartRate, age)) {
      throw HealthcareException.vitalSignsOutOfRange(
        'Heart Rate',
        dto.heartRate,
        ...this.getHeartRateRange(age)
      );
    }

    // Record vital signs
    return this.vitalsRepo.create({
      ...dto,
      recordedBy: dto.nurseId,
      recordedAt: new Date(),
    });
  }
}
```

## Summary

This validation and error handling infrastructure provides:

1. **Type Safety**: Full TypeScript support with custom decorators
2. **HIPAA Compliance**: PHI redaction in logs and errors
3. **Developer Experience**: Clear, actionable error messages
4. **Client Integration**: Standardized error codes for easy handling
5. **Security**: Input sanitization and injection prevention
6. **Monitoring**: Comprehensive logging and audit trails
7. **Healthcare Domain**: Specialized validators for medical data

For additional information, see:
- [Error Codes Reference](./ERROR_CODES.md)
- [Healthcare Validators Guide](./HEALTHCARE_VALIDATORS.md)
