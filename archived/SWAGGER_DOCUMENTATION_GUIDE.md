# Swagger/OpenAPI Documentation Guide for Clinic Composites

## Overview

This guide provides comprehensive Swagger/OpenAPI documentation patterns for all clinic composite files in `/reuse/clinic/composites/`.

**Status**: Complete analysis with implementation patterns ready
**Scope**: 60+ interfaces, 9 enums across 6 files
**Estimated Implementation**: ~3000 lines of decorator code

---

## File Status Summary

| File | Status | Work Needed |
|------|--------|-------------|
| ✅ **admin-workflow-api-composites.ts** | 100% Complete | None - already fully documented |
| ⚠️ **appointment-scheduling-composites.ts** | 25% Complete | 12 interfaces, 2 enums |
| ⚠️ **audit-compliance-composites.ts** | 30% Complete | 20+ interfaces |
| ❌ **medication-administration-composites.ts** | 0% Complete | 15 interfaces, 4 enums |
| ❌ **patient-care-services-composites.ts** | 0% Complete | 10 interfaces, 3 enums |
| ❌ **data-archival-queries-composites.ts** | 0% Complete | 3 interfaces |

---

## Quick Start: Documentation Patterns

### Pattern 1: Simple Interface with Decorators

**Before** (no documentation):
```typescript
export interface StudentHealthVisitData {
  visitId?: string;
  studentId: string;
  visitDate: Date;
  visitType: VisitType;
}
```

**After** (with Swagger decorators):
```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StudentHealthVisitDataDto {
  @ApiPropertyOptional({
    description: 'Unique visit identifier',
    format: 'uuid',
    example: 'b50e8400-e29b-41d4-a716-446655440006'
  })
  visitId?: string;

  @ApiProperty({
    description: 'Student visiting clinic',
    format: 'uuid',
    example: 'c50e8400-e29b-41d4-a716-446655440007'
  })
  studentId: string;

  @ApiProperty({
    description: 'Date of visit',
    type: Date,
    example: '2024-11-11'
  })
  visitDate: Date;

  @ApiProperty({
    description: 'Type of visit',
    enum: VisitType,
    example: VisitType.ILLNESS
  })
  visitType: VisitType;
}
```

### Pattern 2: Enum Documentation

**Before**:
```typescript
export enum VisitType {
  ILLNESS = 'illness',
  INJURY = 'injury',
  MEDICATION = 'medication'
}
```

**After**:
```typescript
/**
 * Student health visit types
 *
 * @enum {string}
 */
export enum VisitType {
  /** Illness-related visit (cold, flu, stomach ache) */
  ILLNESS = 'illness',

  /** Injury assessment and treatment */
  INJURY = 'injury',

  /** Scheduled medication administration */
  MEDICATION = 'medication'
}
```

### Pattern 3: Complex Nested Objects

```typescript
@ApiPropertyOptional({
  description: 'Vital signs measurements',
  type: 'object',
  example: {
    temperature: 99.2,
    heartRate: 88,
    bloodPressure: '110/70',
    respiratoryRate: 18,
    oxygenSaturation: 98,
    painLevel: 5
  }
})
vitalSigns?: {
  temperature?: number;
  heartRate?: number;
  bloodPressure?: string;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  painLevel?: number;
};
```

### Pattern 4: Array Properties

```typescript
@ApiProperty({
  description: 'List of symptoms observed or reported',
  type: [String],
  example: ['Headache', 'Nausea', 'Dizziness', 'Pale appearance']
})
symptoms: string[];
```

### Pattern 5: Validation Rules

```typescript
@ApiProperty({
  description: 'Primary reason for visit as stated by student',
  minLength: 3,
  maxLength: 500,
  example: 'Headache and nausea for the past 2 hours'
})
chiefComplaint: string;

@ApiProperty({
  description: 'Appointment duration in minutes',
  type: 'integer',
  minimum: 5,
  maximum: 120,
  example: 30
})
duration: number;

@ApiProperty({
  description: 'Academic year of visit',
  pattern: '^\\d{4}-\\d{4}$',
  example: '2024-2025'
})
academicYear: string;
```

### Pattern 6: Internal/Hidden Fields

```typescript
@ApiHideProperty()
chainHash?: string; // Hidden from Swagger documentation

@ApiHideProperty()
validate: (context: ComplianceContext) => Promise<ComplianceValidationResult>;
```

---

## Implementation Approaches

### Approach 1: DTO Classes (Recommended)

Create separate DTO classes alongside interfaces for backward compatibility:

```typescript
// Keep existing interface for internal use
export interface StudentHealthVisitData {
  visitId?: string;
  studentId: string;
  // ...
}

// New DTO class for API documentation
export class StudentHealthVisitDataDto implements StudentHealthVisitData {
  @ApiPropertyOptional({ ... })
  visitId?: string;

  @ApiProperty({ ... })
  studentId: string;

  // ...
}
```

**Pros**:
- ✅ Backward compatible
- ✅ Clean separation between internal types and API contracts
- ✅ Standard NestJS pattern
- ✅ No breaking changes to existing code

**Cons**:
- ⚠️ Duplicates type definitions
- ⚠️ Requires maintenance of both interface and class

### Approach 2: Direct Interface Decoration

Add decorators directly to interfaces (requires TypeScript experimental decorators):

```typescript
export interface StudentHealthVisitData {
  @ApiPropertyOptional({ ... })
  visitId?: string;

  @ApiProperty({ ... })
  studentId: string;
}
```

**Pros**:
- ✅ No duplication
- ✅ Simpler to maintain

**Cons**:
- ⚠️ Requires TypeScript experimental decorators
- ⚠️ Less standard approach
- ⚠️ May cause type-checking issues

---

## Priority Implementation Order

### 1. patient-care-services-composites.ts (HIGHEST PRIORITY)
**Why**: Most frequently used in API endpoints, core clinic functionality

**Key Interfaces to Document**:
- `StudentHealthVisitData` (27 properties)
- `StudentCarePlanData` (18 properties)
- `FollowUpCareData` (8 properties)
- `ParentNotificationData` (12 properties)
- `ClinicRestPeriodData` (11 properties)

**Key Enums**:
- `VisitType` (9 values)
- `VisitDisposition` (7 values)
- `TriageSeverity` (5 values)

**Estimated Work**: ~900 lines of decorator code

### 2. medication-administration-composites.ts
**Why**: Critical for medication safety and legal compliance

**Key Interfaces**:
- `MedicationOrderData` (15 properties)
- `MedicationAdministrationData` (12 properties)
- `StudentMedicationAllergyData` (9 properties)

**Key Enums**:
- `MedicationAdminStatus` (6 values)
- `MedicationOrderStatus` (5 values)
- `ControlledSubstanceSchedule` (6 values - DEA schedules)
- `AllergySeverity` (4 values)

**Estimated Work**: ~800 lines of decorator code

### 3. appointment-scheduling-composites.ts
**Why**: High user interaction, scheduling workflows

**Key Interfaces**:
- `ClinicAppointmentContext` (12 properties)
- `ClinicAppointmentBookingResult` (5 properties)
- `NurseSchedule` (8 properties)
- `MedicationSchedule` (10 properties)

**Estimated Work**: ~400 lines of decorator code

### 4. audit-compliance-composites.ts
**Why**: Compliance and regulatory requirements

**Partially done** - Complete remaining interfaces:
- `DataLineageNode`, `DataLineageEdge`, `DataProvenanceGraph`
- `ChainOfCustodyEntry`, `ComplianceRule`, `ComplianceContext`
- `DataRetentionPolicy`, `ForensicInvestigation`
- `RegulatoryReport`

**Estimated Work**: ~600 lines of decorator code

### 5. data-archival-queries-composites.ts
**Why**: Admin/batch operations, less frequent API usage

**Key Interfaces**:
- `ArchivalPolicyConfig` (5 properties)
- `ArchivalJobStatus` (8 properties)
- `RestorationRequest` (9 properties)

**Estimated Work**: ~300 lines of decorator code

---

## Validation Rules Reference

### String Validation
| Rule | Purpose | Example |
|------|---------|---------|
| `minLength` | Minimum characters | `minLength: 3` |
| `maxLength` | Maximum characters | `maxLength: 500` |
| `pattern` | Regex validation | `pattern: '^\\d{4}-\\d{4}$'` |
| `format` | Standard formats | `format: 'uuid'`, `format: 'email'` |

### Number Validation
| Rule | Purpose | Example |
|------|---------|---------|
| `minimum` | Minimum value | `minimum: 0` |
| `maximum` | Maximum value | `maximum: 120` |
| `type: 'integer'` | Whole numbers only | `type: 'integer'` |
| `multipleOf` | Increment step | `multipleOf: 5` |

### Common Formats
- `uuid` - UUID v4 format
- `email` - Email address
- `uri` - URI/URL
- `date` - Date only (YYYY-MM-DD)
- `date-time` - ISO 8601 timestamp
- `ipv4` - IPv4 address
- `ipv6` - IPv6 address

---

## Common Patterns Library

### UUID Fields
```typescript
@ApiProperty({
  description: 'Unique identifier',
  format: 'uuid',
  example: '550e8400-e29b-41d4-a716-446655440000'
})
id: string;
```

### Date Fields
```typescript
@ApiProperty({
  description: 'Timestamp of event',
  type: Date,
  example: '2024-11-11T10:30:00Z'
})
timestamp: Date;
```

### Phone Numbers
```typescript
@ApiProperty({
  description: 'Contact phone number',
  pattern: '^\\+?1?\\d{10,15}$',
  example: '555-123-4567'
})
phone: string;
```

### Academic Year
```typescript
@ApiProperty({
  description: 'Academic year',
  pattern: '^\\d{4}-\\d{4}$',
  example: '2024-2025'
})
academicYear: string;
```

### Email
```typescript
@ApiProperty({
  description: 'Email address',
  format: 'email',
  example: 'nurse@school.edu'
})
email: string;
```

### Status Enums
```typescript
@ApiProperty({
  description: 'Current status',
  enum: ['pending', 'approved', 'rejected', 'cancelled'],
  example: 'pending'
})
status: string;
```

---

## Best Practices

### 1. Use Descriptive Examples
❌ Bad: `example: 'string'`
✅ Good: `example: 'Headache and nausea for the past 2 hours'`

### 2. Include Validation Constraints
❌ Bad: Just description
✅ Good: Description + minLength + maxLength + pattern

### 3. Document All Enum Values
❌ Bad: Just enum list
✅ Good: JSDoc comment for each value explaining when to use it

### 4. Hide Internal Fields
❌ Bad: Exposing implementation details
✅ Good: Use `@ApiHideProperty()` for internal fields

### 5. Use Realistic Domain Examples
❌ Bad: `example: 'test@test.com'`
✅ Good: `example: 'nurse.johnson@lincolnelementary.edu'`

### 6. HIPAA/FERPA Compliance
❌ Bad: Real student names or data
✅ Good: Generic examples that don't contain PII/PHI

---

## Complete Examples

### Example 1: Full DTO Class

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Medication order data for school clinic
 */
export class MedicationOrderDataDto {
  @ApiPropertyOptional({
    description: 'Unique medication order identifier',
    format: 'uuid',
    example: '850e8400-e29b-41d4-a716-446655440003'
  })
  orderId?: string;

  @ApiProperty({
    description: 'Student receiving medication',
    format: 'uuid',
    example: '950e8400-e29b-41d4-a716-446655440004'
  })
  studentId: string;

  @ApiProperty({
    description: 'Name of medication',
    minLength: 2,
    maxLength: 200,
    example: 'Methylphenidate (Ritalin)'
  })
  medicationName: string;

  @ApiProperty({
    description: 'Dosage and form',
    pattern: '^\\d+(\\.\\d+)?\\s*(mg|ml|mcg|units?)\\s+.*$',
    example: '10mg tablet'
  })
  dosage: string;

  @ApiProperty({
    description: 'Frequency of administration',
    example: 'Once daily at 9:00 AM'
  })
  frequency: string;

  @ApiProperty({
    description: 'Start date for medication order',
    type: Date,
    example: '2024-09-01'
  })
  startDate: Date;

  @ApiPropertyOptional({
    description: 'End date for medication order',
    type: Date,
    example: '2025-06-15'
  })
  endDate?: Date;

  @ApiProperty({
    description: 'Prescribing physician name',
    minLength: 3,
    maxLength: 200,
    example: 'Dr. Sarah Johnson, MD'
  })
  prescribingPhysician: string;

  @ApiProperty({
    description: 'DEA controlled substance schedule',
    enum: ControlledSubstanceSchedule,
    example: ControlledSubstanceSchedule.SCHEDULE_II
  })
  controlledSubstanceSchedule: ControlledSubstanceSchedule;

  @ApiProperty({
    description: 'Current order status',
    enum: MedicationOrderStatus,
    example: MedicationOrderStatus.ACTIVE
  })
  status: MedicationOrderStatus;
}
```

### Example 2: Documented Enum

```typescript
/**
 * DEA Controlled Substance Schedules
 *
 * @enum {string}
 * @see https://www.dea.gov/drug-information/drug-scheduling
 */
export enum ControlledSubstanceSchedule {
  /** Schedule I - No accepted medical use (not used in schools) */
  SCHEDULE_I = 'schedule_i',

  /** Schedule II - High potential for abuse (e.g., Adderall, Ritalin) */
  SCHEDULE_II = 'schedule_ii',

  /** Schedule III - Moderate potential for abuse */
  SCHEDULE_III = 'schedule_iii',

  /** Schedule IV - Low potential for abuse (e.g., Xanax) */
  SCHEDULE_IV = 'schedule_iv',

  /** Schedule V - Lowest potential for abuse */
  SCHEDULE_V = 'schedule_v',

  /** Not a controlled substance */
  NON_CONTROLLED = 'non_controlled'
}
```

---

## Testing Your Documentation

### 1. Start NestJS Application
```bash
npm run start:dev
```

### 2. Access Swagger UI
```
http://localhost:3000/api/docs
```

### 3. Verify
- ✅ All endpoints show documented DTOs
- ✅ Examples are visible and realistic
- ✅ Validation rules appear
- ✅ Enums show all possible values
- ✅ Optional fields marked correctly

### 4. Test API Client Generation
```bash
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:3000/api/docs-json \
  -g typescript-axios \
  -o ./generated-client
```

---

## Resources

### Full Documentation
See `.temp/completed/swagger-documentation-summary-SW6G3R.md` for:
- Complete before/after examples for all 60+ interfaces
- Detailed patterns for every scenario
- Work estimation and prioritization
- Implementation strategies

### Reference Files
- **Best Practice Example**: `admin-workflow-api-composites.ts` (already 100% documented)
- **NestJS Swagger Docs**: https://docs.nestjs.com/openapi/introduction
- **OpenAPI Spec**: https://swagger.io/specification/

### Team Coordination
- **Agent ID**: SW6G3R
- **Related Work**:
  - JSDoc improvements (JD7K9M)
  - Code refactoring (N3STJP, T9Y2K5)

---

## Summary

**Total Work**: ~3000 lines of Swagger documentation code
**Files Affected**: 6 clinic composite files
**Interfaces**: 60+ interfaces requiring documentation
**Enums**: 9 enums requiring value documentation
**Estimated Time**: 14-19 hours for complete implementation

**Status**: Analysis complete, all patterns and examples provided, ready for implementation

**Next Step**: Begin with `patient-care-services-composites.ts` (highest priority)

---

*Generated by Swagger API Documentation Architect - Task SW6G3R - 2025-11-11*
