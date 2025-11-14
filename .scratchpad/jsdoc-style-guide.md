# JSDoc Documentation Style Guide
**Created**: 2025-11-14
**Agent**: JSDoc TypeScript Architect (JS2D0C)
**Purpose**: Standard guidelines for comprehensive JSDoc documentation across the codebase

---

## Table of Contents
1. [General Principles](#general-principles)
2. [Controller Documentation](#controller-documentation)
3. [Service Documentation](#service-documentation)
4. [DTO Documentation](#dto-documentation)
5. [Utility Function Documentation](#utility-function-documentation)
6. [Interface and Type Documentation](#interface-and-type-documentation)
7. [Common JSDoc Tags](#common-jsdoc-tags)
8. [Examples](#examples)

---

## General Principles

### Why JSDoc Matters
- **IDE Intelligence**: Provides autocomplete and IntelliSense
- **Type Safety**: Complements TypeScript's type system
- **Documentation**: Serves as inline documentation
- **Maintainability**: Makes code easier to understand and maintain
- **Onboarding**: Helps new developers understand the codebase

### Documentation Standards
✅ **DO:**
- Document all public APIs (exports from modules)
- Include `@description` for all classes and methods
- Document all `@param` parameters with types and descriptions
- Document `@returns` with structure details
- Include `@throws` for all exceptions
- Add `@example` for complex or non-obvious code
- Note side effects (database writes, API calls, caching)
- Include HIPAA compliance notes where relevant
- Use `@see` for cross-references
- Be concise but comprehensive

❌ **DON'T:**
- Skip documentation for public methods
- Use vague descriptions like "does something"
- Forget to update JSDoc when code changes
- Copy-paste descriptions without customizing
- Document private/internal methods excessively (brief notes are fine)
- Use emojis unless explicitly requested
- Make assumptions about parameter types without verifying

---

## Controller Documentation

### Controller Class Template

```typescript
/**
 * @fileoverview [Feature] Controller
 * @module [module-path]/[controller-name].controller
 * @description HTTP endpoints for [feature description]
 */

/**
 * [Feature] Controller
 *
 * @description
 * Handles HTTP requests for [feature]. Provides endpoints for:
 * - [Endpoint 1 description]
 * - [Endpoint 2 description]
 * - [Endpoint 3 description]
 *
 * All endpoints require authentication via Bearer token.
 * HIPAA: All operations log PHI access for audit compliance.
 *
 * @see {@link [ServiceName]} for business logic implementation
 * @since 1.0.0
 */
@Controller('[route]')
export class [FeatureName]Controller extends BaseController {
  // ...
}
```

### Controller Method Template

```typescript
/**
 * [Brief description of what the endpoint does]
 *
 * @description
 * [Detailed explanation including]:
 * - What the endpoint does
 * - Important business rules
 * - Data validation performed
 * - Side effects (database changes, API calls, etc.)
 * - HIPAA/security considerations
 *
 * Performance: [Typical response time if known]
 *
 * @param {[DtoType]} [paramName] - [Description of DTO]
 * @param {string} [paramName].[property] - [Description of important properties]
 *
 * @returns {Promise<[ReturnType]>} [Description of return value]
 * @returns {[type]} [property] - [Description of return property]
 *
 * @throws {[ExceptionType]} [When this exception is thrown]
 * @throws {[ExceptionType]} [When this exception is thrown]
 *
 * @example
 * ```typescript
 * POST /[route]/[endpoint]
 * {
 *   "[field]": "[value]"
 * }
 *
 * // Response
 * {
 *   "[field]": "[value]"
 * }
 * ```
 *
 * @see {@link [DtoName]} for request structure
 * @see {@link [ServiceName].[methodName]} for implementation
 * @since 1.0.0
 */
@Post('[route]')
async [methodName](@Body() dto: [DtoType]): Promise<[ReturnType]> {
  // implementation
}
```

### Real Example

```typescript
/**
 * Create a new student record
 *
 * @description
 * Creates a new student in the system with comprehensive validation.
 * Validates required fields, email format, and checks for duplicates.
 * Automatically enrolls student in default programs based on school settings.
 *
 * Side effects:
 * - Creates student record in database
 * - Logs PHI access for HIPAA audit trail
 * - Sends welcome email to guardian (if configured)
 * - Creates default health profile
 *
 * HIPAA: All student data is considered PHI and logged accordingly.
 * Performance: Typical response time 100-200ms
 *
 * @param {CreateStudentDto} createStudentDto - Student creation data
 * @param {string} createStudentDto.firstName - Student's first name (2-50 chars)
 * @param {string} createStudentDto.lastName - Student's last name (2-50 chars)
 * @param {string} createStudentDto.email - Unique email address
 * @param {Date} createStudentDto.dateOfBirth - Birth date (must be past)
 * @param {string} createStudentDto.schoolId - School UUID
 *
 * @returns {Promise<Student>} Created student record with generated ID
 * @returns {string} id - Generated UUID for student
 * @returns {Date} createdAt - Timestamp of creation
 * @returns {Date} updatedAt - Timestamp of last update
 *
 * @throws {BusinessException} If student with email already exists
 * @throws {ValidationException} If required fields are missing or invalid
 * @throws {ForbiddenException} If user lacks permission to create students
 * @throws {UnauthorizedException} If user is not authenticated
 *
 * @example
 * ```typescript
 * POST /students
 * {
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "email": "john.doe@example.com",
 *   "dateOfBirth": "2010-05-15",
 *   "schoolId": "school-uuid-123"
 * }
 *
 * // Response
 * {
 *   "id": "student-uuid-456",
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "email": "john.doe@example.com",
 *   "createdAt": "2024-01-15T10:30:00Z",
 *   "updatedAt": "2024-01-15T10:30:00Z"
 * }
 * ```
 *
 * @see {@link CreateStudentDto} for request structure
 * @see {@link StudentService.create} for business logic
 * @since 1.0.0
 */
@Post()
async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
  return this.studentService.create(createStudentDto);
}
```

---

## Service Documentation

### Service Class Template

```typescript
/**
 * @fileoverview [Feature] Service
 * @module [module-path]/[service-name].service
 * @description Business logic for [feature description]
 *
 * Responsibilities:
 * - [Responsibility 1]
 * - [Responsibility 2]
 * - [Responsibility 3]
 *
 * Dependencies:
 * - [Dependency 1]: [Why it's used]
 * - [Dependency 2]: [Why it's used]
 */

/**
 * [Feature] Service
 *
 * @description
 * Implements business logic for [feature]. Handles:
 * - [Business operation 1]
 * - [Business operation 2]
 * - [Business operation 3]
 *
 * HIPAA Compliance:
 * - Logs all PHI access operations
 * - Enforces role-based access control
 * - Sanitizes sensitive data in error messages
 *
 * @extends BaseService
 * @see {@link BaseService} for common service functionality
 * @since 1.0.0
 */
@Injectable()
export class [FeatureName]Service extends BaseService {
  // ...
}
```

### Service Method Template

```typescript
/**
 * [Brief description of what the method does]
 *
 * @description
 * [Detailed explanation including]:
 * - Business logic performed
 * - Validation rules applied
 * - Data transformations
 * - Important edge cases
 *
 * Side effects:
 * - [Database operations performed]
 * - [External API calls made]
 * - [Cache updates]
 * - [Event emissions]
 * - [Audit log entries]
 *
 * HIPAA: [Specific compliance considerations]
 * Performance: [Typical execution time or complexity]
 *
 * @param {[Type]} [paramName] - [Parameter description]
 * @param {[Type]} [paramName] - [Parameter description]
 *
 * @returns {Promise<[ReturnType]>} [Description of return value]
 * @returns {[type]} [property] - [Description of return property]
 *
 * @throws {[ExceptionType]} [When this exception is thrown]
 * @throws {[ExceptionType]} [When this exception is thrown]
 *
 * @example
 * ```typescript
 * const result = await service.[methodName](
 *   'param-value-1',
 *   'param-value-2'
 * );
 * console.log(result.[property]);
 * ```
 *
 * @see {@link [RelatedMethod]} for related functionality
 * @since 1.0.0
 */
async [methodName](
  [param1]: [Type],
  [param2]: [Type]
): Promise<[ReturnType]> {
  // implementation
}
```

### Real Example

```typescript
/**
 * Retrieve student health records with pagination and filtering
 *
 * @description
 * Fetches paginated health records for a specific student with optional filtering.
 * Enforces authorization checks ensuring user has permission to view records.
 * Results are cached for 5 minutes to improve performance.
 *
 * Filtering capabilities:
 * - Record type (immunization, medication, visit, screening)
 * - Date range
 * - Provider
 * - Status
 *
 * Side effects:
 * - Logs PHI access to audit trail with user ID and timestamp
 * - Updates cache with retrieved records (5 min TTL)
 * - Increments read counter metric for analytics
 *
 * HIPAA: All health records are PHI. Access is logged and requires
 * appropriate role (nurse, admin) or guardian relationship.
 *
 * Performance: ~50-100ms for cache hit, ~200-400ms for database query
 *
 * @param {string} studentId - UUID of the student
 * @param {number} [page=1] - Page number (1-indexed)
 * @param {number} [limit=20] - Records per page (max 100)
 * @param {object} [filters] - Optional filters
 * @param {string[]} [filters.types] - Filter by record types
 * @param {Date} [filters.startDate] - Filter by start date
 * @param {Date} [filters.endDate] - Filter by end date
 *
 * @returns {Promise<PaginatedResponse<HealthRecord>>} Paginated health records
 * @returns {HealthRecord[]} items - Array of health record objects
 * @returns {number} total - Total count of records matching filters
 * @returns {number} page - Current page number
 * @returns {number} limit - Records per page
 * @returns {number} totalPages - Total number of pages
 * @returns {boolean} hasNext - Whether there are more pages
 * @returns {boolean} hasPrevious - Whether there are previous pages
 *
 * @throws {BusinessException} If student not found
 * @throws {ForbiddenException} If user lacks permission to view records
 * @throws {ValidationException} If studentId is not a valid UUID
 * @throws {ValidationException} If page or limit is negative or exceeds maximum
 *
 * @example
 * ```typescript
 * // Get first page with default limit
 * const result = await service.getStudentHealthRecords('student-uuid-123');
 *
 * // Get filtered results
 * const filtered = await service.getStudentHealthRecords(
 *   'student-uuid-123',
 *   1,
 *   20,
 *   {
 *     types: ['immunization', 'medication'],
 *     startDate: new Date('2024-01-01'),
 *     endDate: new Date('2024-12-31')
 *   }
 * );
 *
 * console.log(`Found ${filtered.total} records, showing page ${filtered.page}`);
 * console.log(`Has more pages: ${filtered.hasNext}`);
 * ```
 *
 * @see {@link HealthRecord} for record structure
 * @see {@link PaginatedResponse} for pagination details
 * @since 1.0.0
 */
async getStudentHealthRecords(
  studentId: string,
  page: number = 1,
  limit: number = 20,
  filters?: HealthRecordFilters
): Promise<PaginatedResponse<HealthRecord>> {
  // implementation
}
```

---

## DTO Documentation

### DTO Class Template

```typescript
/**
 * Data Transfer Object for [operation description]
 *
 * @description
 * Encapsulates [purpose of DTO]. Used for [where it's used].
 * All fields are validated using class-validator decorators.
 *
 * Validation rules:
 * - [field1]: [validation rules]
 * - [field2]: [validation rules]
 * - [field3]: [validation rules]
 *
 * @example
 * ```typescript
 * const dto = new [DtoName]();
 * dto.[field] = '[value]';
 * dto.[field] = '[value]';
 * ```
 *
 * @see {@link [RelatedController].[method]} for usage
 * @since 1.0.0
 */
export class [DtoName] {
  // properties...
}
```

### DTO Property Template

```typescript
/**
 * [Property description]
 *
 * @type {[TypeScript type]}
 * @required or @optional
 * [Validation constraints like @minLength, @maxLength, @min, @max, @pattern]
 *
 * @description
 * [Detailed description including]:
 * - What the property represents
 * - Business rules or constraints
 * - Valid values or ranges
 * - Relationship to other fields
 *
 * @example '[example value]'
 * @example '[alternative example value]'
 *
 * @default [default value if applicable]
 */
@[Validators]
[propertyName]: [Type];
```

### Real Example

```typescript
/**
 * Data Transfer Object for creating a new student
 *
 * @description
 * Encapsulates all required and optional fields for student creation.
 * All fields are validated using class-validator decorators before
 * reaching the service layer. Used in POST /students endpoint.
 *
 * Validation rules:
 * - firstName, lastName: Required, 2-50 characters, letters and spaces only
 * - email: Required, valid email format, must be unique in system
 * - dateOfBirth: Required, must be past date, student must be under 21
 * - schoolId: Required, must be valid UUID and existing school
 * - grade: Optional, K-12 or Pre-K
 * - guardianEmail: Optional, valid email format
 *
 * @example
 * ```typescript
 * const dto = new CreateStudentDto();
 * dto.firstName = 'John';
 * dto.lastName = 'Doe';
 * dto.email = 'john.doe@example.com';
 * dto.dateOfBirth = new Date('2010-05-15');
 * dto.schoolId = 'school-uuid-123';
 * dto.grade = '5';
 * dto.guardianEmail = 'parent@example.com';
 * ```
 *
 * @see {@link StudentsController.create} for usage
 * @see {@link Student} for the entity this creates
 * @since 1.0.0
 */
export class CreateStudentDto {
  /**
   * Student's first name
   *
   * @type {string}
   * @required
   * @minLength 2
   * @maxLength 50
   *
   * @description
   * Student's legal first name. Must contain only letters, spaces,
   * hyphens, and apostrophes. Used for official records and identification.
   *
   * @example 'John'
   * @example 'Mary-Jane'
   * @example "O'Connor"
   */
  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  @Matches(/^[a-zA-Z\s\-']+$/, {
    message: 'First name can only contain letters, spaces, hyphens, and apostrophes'
  })
  firstName: string;

  /**
   * Student's email address (must be unique)
   *
   * @type {string}
   * @required
   * @format email
   *
   * @description
   * Primary email address for the student. Must be unique across the entire
   * system. Used for login credentials and communications. Validated for
   * proper email format (RFC 5322 compliant).
   *
   * Note: For elementary students, this may be a parent/guardian-managed email.
   *
   * @example 'john.doe@example.com'
   * @example 'student.name+school@domain.com'
   */
  @IsEmail({}, { message: 'Must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  /**
   * Student's date of birth
   *
   * @type {Date}
   * @required
   *
   * @description
   * Student's birth date. Must be a past date and student must be under 21
   * years old to comply with school health program requirements.
   * Used for age calculations, grade eligibility, and health record correlation.
   *
   * @example new Date('2010-05-15')
   * @example new Date('2015-08-20')
   */
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: 'Date of birth is required' })
  dateOfBirth: Date;

  /**
   * School identifier (UUID)
   *
   * @type {string}
   * @required
   * @format uuid
   *
   * @description
   * UUID of the school the student is enrolling in. Must reference an
   * existing, active school in the system. Determines which health
   * programs and services are available to the student.
   *
   * @example 'a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6'
   */
  @IsUUID('4', { message: 'School ID must be a valid UUID' })
  @IsNotEmpty({ message: 'School ID is required' })
  schoolId: string;

  /**
   * Student's current grade level
   *
   * @type {string}
   * @optional
   *
   * @description
   * Student's current grade level in school. Valid values are:
   * - Pre-K: Preschool
   * - K: Kindergarten
   * - 1-12: Elementary through High School
   *
   * Used for age-appropriate health screening schedules and educational materials.
   *
   * @example 'K'
   * @example '5'
   * @example '12'
   *
   * @default null (grade not specified)
   */
  @IsOptional()
  @IsString()
  @Matches(/^(Pre-K|K|[1-9]|1[0-2])$/, {
    message: 'Grade must be Pre-K, K, or 1-12'
  })
  grade?: string;
}
```

---

## Utility Function Documentation

### Utility Function Template

```typescript
/**
 * [Brief description of what the function does]
 *
 * @description
 * [Detailed explanation including]:
 * - Purpose and use cases
 * - Algorithm or approach used
 * - Performance characteristics
 * - Important edge cases
 *
 * @template [T] - [Description of generic type parameter]
 *
 * @param {[Type]} [paramName] - [Parameter description]
 * @param {[Type]} [paramName] - [Parameter description]
 *
 * @returns {[ReturnType]} [Description of return value]
 *
 * @throws {[ErrorType]} [When this error is thrown]
 *
 * @example
 * ```typescript
 * const result = [functionName]([arg1], [arg2]);
 * console.log(result); // [Expected output]
 * ```
 *
 * @see {@link [RelatedFunction]} for related functionality
 * @since 1.0.0
 */
export function [functionName]<T>(
  [param1]: [Type],
  [param2]: [Type]
): [ReturnType] {
  // implementation
}
```

### Real Example

```typescript
/**
 * Deeply clones an object, handling circular references safely
 *
 * @description
 * Creates a deep copy of the provided object, including nested objects and arrays.
 * Handles circular references by maintaining a WeakMap of already-cloned objects.
 * Preserves Date, RegExp, Map, and Set instances correctly.
 *
 * Performance: O(n) where n is the number of properties in the object tree.
 * Memory: Uses WeakMap for cycle detection, minimal overhead.
 *
 * Limitations:
 * - Does not clone functions or symbols
 * - Does not preserve prototype chain beyond Object.prototype
 * - Does not clone non-enumerable properties
 *
 * @template T - Type of the object to clone
 *
 * @param {T} obj - Object to clone
 * @param {WeakMap<object, object>} [cloned=new WeakMap()] - Internal cycle detection map
 *
 * @returns {T} Deep clone of the object
 *
 * @throws {TypeError} If obj is null or undefined
 *
 * @example
 * ```typescript
 * const original = {
 *   name: 'John',
 *   address: {
 *     city: 'New York',
 *     zip: '10001'
 *   },
 *   tags: ['student', 'active']
 * };
 *
 * const copy = deepClone(original);
 * copy.address.city = 'Boston'; // Original unchanged
 * console.log(original.address.city); // 'New York'
 * console.log(copy.address.city); // 'Boston'
 *
 * // Handles circular references
 * const circular: any = { name: 'Test' };
 * circular.self = circular;
 * const cloned = deepClone(circular); // Works without stack overflow
 * ```
 *
 * @see {@link shallowClone} for shallow copying
 * @see {@link structuredClone} for native implementation (Node 17+)
 * @since 1.0.0
 */
export function deepClone<T>(
  obj: T,
  cloned: WeakMap<object, object> = new WeakMap()
): T {
  // implementation
}
```

---

## Interface and Type Documentation

### Interface Template

```typescript
/**
 * [Description of what the interface represents]
 *
 * @description
 * [Detailed explanation including]:
 * - Purpose and use cases
 * - Required vs optional properties
 * - Relationships to other types
 * - Common patterns for usage
 *
 * @property {[Type]} [propertyName] - [Property description]
 * @property {[Type]} [propertyName] - [Property description]
 *
 * @example
 * ```typescript
 * const example: [InterfaceName] = {
 *   [property]: [value],
 *   [property]: [value]
 * };
 * ```
 *
 * @see {@link [RelatedType]} for related type
 * @since 1.0.0
 */
export interface [InterfaceName] {
  /** [Brief property description] */
  [property]: [Type];

  /** [Brief property description] */
  [property]?: [Type];
}
```

### Type Alias Template

```typescript
/**
 * [Description of what the type represents]
 *
 * @description
 * [Detailed explanation including]:
 * - What the type models
 * - Valid values or structure
 * - Common use cases
 * - Type constraints
 *
 * @example
 * ```typescript
 * const example: [TypeName] = [example value];
 * ```
 *
 * @see {@link [RelatedType]} for related type
 * @since 1.0.0
 */
export type [TypeName] = [TypeDefinition];
```

---

## Common JSDoc Tags

### Essential Tags

| Tag | Purpose | Usage |
|-----|---------|-------|
| `@description` | Detailed description | All classes, methods, functions |
| `@param` | Parameter documentation | All function/method parameters |
| `@returns` | Return value documentation | All non-void functions/methods |
| `@throws` | Exception documentation | When exceptions can be thrown |
| `@example` | Usage example | Complex APIs, non-obvious code |
| `@see` | Cross-reference | Link to related code |
| `@since` | Version introduced | All public APIs |

### Type-Related Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `@template` | Generic type parameter | `@template T - Type of array elements` |
| `@type` | Property type | `@type {string}` |
| `@typedef` | Type definition | `@typedef {Object} CustomType` |
| `@property` | Object property | `@property {string} name - User name` |

### Organizational Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `@fileoverview` | File description | `@fileoverview User authentication service` |
| `@module` | Module path | `@module auth/user.service` |
| `@namespace` | Namespace | `@namespace Utils` |
| `@memberof` | Parent reference | `@memberof UserService` |

### Status Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `@deprecated` | Mark as deprecated | `@deprecated Use newMethod() instead` |
| `@experimental` | Experimental API | `@experimental Subject to change` |
| `@beta` | Beta feature | `@beta May have breaking changes` |
| `@internal` | Internal use only | `@internal Not part of public API` |

### Access Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `@public` | Public API | `@public` |
| `@private` | Private method | `@private` |
| `@protected` | Protected method | `@protected` |
| `@readonly` | Read-only property | `@readonly` |

---

## Examples

### Complete Controller Example

```typescript
/**
 * @fileoverview Student Controller
 * @module students/students.controller
 * @description HTTP endpoints for student management operations
 */

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

/**
 * Student Management Controller
 *
 * @description
 * Handles HTTP requests for student CRUD operations and related functionality.
 * All endpoints require authentication and appropriate role-based permissions.
 *
 * HIPAA: All student data is PHI and access is logged for audit compliance.
 *
 * @see {@link StudentsService} for business logic
 * @since 1.0.0
 */
@ApiTags('Students')
@ApiBearerAuth()
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  /**
   * Create a new student record
   *
   * @description
   * Creates a new student in the system with validation and duplicate checking.
   * Automatically creates associated health profile and audit log entries.
   *
   * Side effects:
   * - Creates student record in database
   * - Creates default health profile
   * - Logs PHI access
   * - May send welcome email
   *
   * @param {CreateStudentDto} createStudentDto - Student creation data
   *
   * @returns {Promise<Student>} Created student with generated ID
   *
   * @throws {BusinessException} If email already exists
   * @throws {ValidationException} If required fields invalid
   *
   * @example
   * ```typescript
   * POST /students
   * {
   *   "firstName": "John",
   *   "lastName": "Doe",
   *   "email": "john@example.com",
   *   "dateOfBirth": "2010-05-15",
   *   "schoolId": "uuid-123"
   * }
   * ```
   *
   * @since 1.0.0
   */
  @Post()
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentsService.create(createStudentDto);
  }

  // ... other methods
}
```

---

## Checklist for Documentation Review

When reviewing JSDoc documentation, verify:

- [ ] File has `@fileoverview` and `@module` tags
- [ ] All public classes have comprehensive `@description`
- [ ] All public methods documented with `@description`
- [ ] All `@param` tags present with types and descriptions
- [ ] `@returns` tag present with structure details
- [ ] All exceptions documented with `@throws`
- [ ] Complex methods have `@example` usage
- [ ] Side effects explicitly documented
- [ ] HIPAA considerations noted where relevant
- [ ] Cross-references use `@see` tags
- [ ] Version information with `@since` tag
- [ ] Deprecated code marked with `@deprecated` and migration path
- [ ] Type information matches TypeScript types
- [ ] Examples are accurate and compile
- [ ] No typos or grammatical errors
- [ ] Consistent terminology throughout
- [ ] IDE intelligence works correctly

---

## Maintenance

### Updating Documentation
- Update JSDoc whenever code changes
- Increment `@since` version for new features
- Add `@deprecated` before removing features
- Keep examples up-to-date with current API

### Quality Assurance
- Run JSDoc validation tools
- Test IDE intelligence (autocomplete, hover info)
- Review during code review process
- Include documentation in test coverage goals

---

**Last Updated**: 2025-11-14
**Maintained By**: Development Team
**Questions**: Contact Tech Lead or refer to [CONTRIBUTING.md]
