# Type Safety Quick Start Guide

This guide helps you quickly start using the new type utilities and patterns in the White Cross backend.

## Quick Links

- **Full Documentation:** `.temp/TYPE_SAFETY_JSDOC_SUMMARY_W7N2T5.md`
- **Completion Summary:** `.temp/COMPLETION_SUMMARY_W7N2T5.md`
- **Type Utilities:** `src/common/types/utility-types.ts`
- **Custom Exceptions:** `src/common/exceptions/`

---

## Using Type Utilities

### 1. Paginated Responses

```typescript
import { PaginatedResponse } from '@/common/types';

async findAll(filterDto: StudentFilterDto): Promise<PaginatedResponse<Student>> {
  const { rows: data, count: total } = await this.model.findAndCountAll({...});

  return {
    data,
    meta: {
      page: filterDto.page || 1,
      limit: filterDto.limit || 20,
      total,
      pages: Math.ceil(total / (filterDto.limit || 20))
    }
  };
}
```

### 2. API Responses

```typescript
import { ApiResponse, ApiError } from '@/common/types';

async processData(): Promise<ApiResponse<Student>> {
  try {
    const student = await this.create(data);
    return {
      success: true,
      data: student,
      metadata: { processingTime: Date.now() - start }
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'PROCESSING_ERROR',
        message: error.message,
        timestamp: new Date()
      }
    };
  }
}
```

### 3. Result Types

```typescript
import { Result, isSuccess } from '@/common/types';

function validateInput(data: unknown): Result<ValidatedData, ValidationError> {
  if (!isValid(data)) {
    return { success: false, error: new ValidationError('Invalid data') };
  }
  return { success: true, value: validated };
}

const result = validateInput(rawData);
if (isSuccess(result)) {
  // TypeScript knows result.value exists
  console.log(result.value);
} else {
  // TypeScript knows result.error exists
  console.error(result.error);
}
```

---

## Using Custom Exceptions

### Student Operations

```typescript
import {
  StudentNotFoundException,
  StudentNumberConflictException,
  InvalidNurseAssignmentException
} from '@/common/exceptions';

async findOne(id: string): Promise<Student> {
  const student = await this.model.findByPk(id);
  if (!student) {
    throw new StudentNotFoundException(id, {
      operation: 'findOne'
    });
  }
  return student;
}

async create(dto: CreateStudentDto): Promise<Student> {
  const exists = await this.model.findOne({
    where: { studentNumber: dto.studentNumber }
  });

  if (exists) {
    throw new StudentNumberConflictException(dto.studentNumber, {
      operation: 'create'
    });
  }

  // ... create student
}
```

### User Operations

```typescript
import {
  UserNotFoundException,
  EmailConflictException,
  InvalidPasswordException
} from '@/common/exceptions';

async createUser(dto: CreateUserDto): Promise<User> {
  const exists = await this.model.findOne({
    where: { email: dto.email }
  });

  if (exists) {
    throw new EmailConflictException(dto.email, {
      operation: 'createUser'
    });
  }

  // ... create user
}
```

---

## JSDoc Templates

### Basic Method Documentation

```typescript
/**
 * [Brief description]
 *
 * @param {Type} paramName - Parameter description
 * @returns {Promise<Type>} Return description
 *
 * @throws {ExceptionType} When this exception is thrown
 *
 * @example
 * ```typescript
 * const result = await service.method(param);
 * ```
 */
async method(paramName: Type): Promise<Type> {
  // Implementation
}
```

### Complex Method with HIPAA

```typescript
/**
 * Retrieves student health records with PHI data.
 *
 * @param {string} studentId - Student UUID
 * @param {number} [page=1] - Page number
 * @param {number} [limit=20] - Records per page
 * @returns {Promise<PaginatedResponse<HealthRecord>>} Paginated records
 *
 * @throws {NotFoundException} If student does not exist
 * @throws {BadRequestException} If parameters are invalid
 *
 * @example
 * ```typescript
 * const records = await service.getHealthRecords('uuid-123', 1, 20);
 * console.log(records.meta.total); // Total count
 * ```
 *
 * @remarks
 * - This method accesses Protected Health Information (PHI)
 * - All accesses are logged for HIPAA compliance
 * - Requires appropriate authorization
 *
 * @since 1.0.0
 * @category Health Records
 * @hipaaCompliant Accesses PHI - requires authorization
 */
async getHealthRecords(
  studentId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<HealthRecord>> {
  // Implementation
}
```

---

## Migration Patterns

### Replacing `any` Types

**Before:**
```typescript
async create(data: any): Promise<any> {
  const result = await this.model.create(data);
  return result;
}
```

**After:**
```typescript
import { CreateStudentDto } from './dto';

async create(data: CreateStudentDto): Promise<Student> {
  const result = await this.model.create(data);
  return result;
}
```

### Typing Where Clauses

**Before:**
```typescript
const where: any = {};
if (search) {
  where[Op.or] = [...];
}
```

**After:**
```typescript
interface StudentWhereClause {
  id?: string;
  studentNumber?: string | { [Op.iLike]: string };
  [Op.or]?: Array<{
    firstName?: { [Op.iLike]: string };
    lastName?: { [Op.iLike]: string };
  }>;
}

const where: StudentWhereClause = {};
if (search) {
  where[Op.or] = [
    { firstName: { [Op.iLike]: `%${search}%` } },
    { lastName: { [Op.iLike]: `%${search}%` } }
  ];
}
```

---

## Common Patterns

### Pagination

```typescript
import { PaginatedResponse } from '@/common/types';

async list(page: number = 1, limit: number = 20): Promise<PaginatedResponse<T>> {
  const offset = (page - 1) * limit;
  const { rows, count } = await this.model.findAndCountAll({
    offset,
    limit,
    order: [['createdAt', 'DESC']]
  });

  return {
    data: rows,
    meta: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit)
    }
  };
}
```

### Error Handling

```typescript
import { StudentNotFoundException } from '@/common/exceptions';

async findOrFail(id: string): Promise<Student> {
  const student = await this.model.findByPk(id);
  if (!student) {
    throw new StudentNotFoundException(id, {
      operation: 'findOrFail',
      additionalInfo: { requestTime: new Date() }
    });
  }
  return student;
}
```

### Type Guards

```typescript
import { hasValue, Optional } from '@/common/types';

function findStudent(id: string): Optional<Student> {
  const student = cache.get(id);
  return student
    ? { hasValue: true, value: student }
    : { hasValue: false };
}

const result = findStudent('uuid-123');
if (hasValue(result)) {
  // TypeScript knows result.value is Student
  console.log(result.value.firstName);
}
```

---

## Best Practices

### 1. Always Type Function Signatures
```typescript
// ❌ Bad
async create(data: any): Promise<any>

// ✅ Good
async create(data: CreateStudentDto): Promise<Student>
```

### 2. Use Custom Exceptions
```typescript
// ❌ Bad
throw new NotFoundException('Not found');

// ✅ Good
throw new StudentNotFoundException(id, { operation: 'delete' });
```

### 3. Document HIPAA Compliance
```typescript
/**
 * @hipaaCompliant PHI: firstName, lastName, dateOfBirth
 */
async getStudentData(id: string): Promise<StudentData>
```

### 4. Provide Examples
```typescript
/**
 * @example
 * ```typescript
 * const students = await service.findAll({ page: 1, limit: 20 });
 * ```
 */
```

### 5. Use Result Types for Validation
```typescript
import { Result } from '@/common/types';

function validate(data: unknown): Result<ValidData, Error> {
  // Return success or error without throwing
}
```

---

## Next Steps

1. **Read full documentation:** `.temp/TYPE_SAFETY_JSDOC_SUMMARY_W7N2T5.md`
2. **Start using utilities** in new code
3. **Apply templates** when writing JSDoc
4. **Replace `any` types** incrementally
5. **Use custom exceptions** for better error handling

---

## Getting Help

- **Full Analysis:** See `.temp/TYPE_SAFETY_JSDOC_SUMMARY_W7N2T5.md`
- **Examples:** Check `src/common/types/utility-types.ts` for comprehensive examples
- **Templates:** Use JSDoc templates from summary document

---

**Created:** 2025-11-07
**Last Updated:** 2025-11-07
**Status:** Ready to use ✅
