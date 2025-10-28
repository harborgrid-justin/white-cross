# Type Guards & Utilities Documentation

## Overview

Runtime type checking and validation utilities inspired by Berty's type system. Provides type-safe runtime validation for API requests, database models, and external data.

## Features

- ✅ **Basic Type Guards** - String, number, boolean, object, array
- ✅ **Advanced Guards** - UUID, email, phone, ISO dates
- ✅ **Object Shape Guards** - Validate object properties
- ✅ **Healthcare-Specific Guards** - Student, Medication, Contact, HealthRecord
- ✅ **API Guards** - Paginated responses, error responses
- ✅ **Assertions** - Throw on invalid types
- ✅ **Branded Types** - Stronger type safety for IDs
- ✅ **Utility Guards** - Ranges, lengths, patterns

## Usage

### Basic Type Guards

```typescript
import { isString, isNumber, isUUID, isEmail } from '../shared/types/guards';

// Check types
if (isString(value)) {
  console.log(value.toUpperCase()); // TypeScript knows value is string
}

// Validate UUIDs
if (isUUID(studentId)) {
  await Student.findByPk(studentId);
}

// Validate emails
if (isEmail(email)) {
  await sendEmail(email);
}
```

### Healthcare-Specific Guards

```typescript
import { isStudent, isMedication, isContact } from '../shared/types/guards';

// Validate student data
function processStudent(data: unknown) {
  if (isStudent(data)) {
    // TypeScript knows data is Student
    console.log(`${data.firstName} ${data.lastName}`);
  } else {
    throw new Error('Invalid student data');
  }
}

// Validate medication
if (isMedication(data)) {
  await prescribeMedication(data);
}

// Validate contact
if (isContact(data)) {
  await saveContact(data);
}
```

### Assertions (Throw on Invalid)

```typescript
import { assertString, assertUUID, assertNonNull } from '../shared/types/guards';

function findStudent(id: unknown) {
  // Throws TypeError if invalid
  assertUUID(id, 'studentId');
  
  // TypeScript knows id is string (UUID)
  return Student.findByPk(id);
}

function processName(name: unknown) {
  assertString(name, 'name');
  assertNonNull(name, 'name');
  
  // TypeScript knows name is non-null string
  return name.trim().toUpperCase();
}
```

### Branded Types (Stronger ID Safety)

```typescript
import {
  StudentId,
  MedicationId,
  brandStudentId,
  brand MedicationId
} from '../shared/types/guards';

// Brand an ID
const studentId: StudentId = brandStudentId('123e4567-e89b-12d3-a456-426614174000');

// Function that only accepts StudentId
function getStudent(id: StudentId): Promise<Student> {
  return Student.findByPk(id);
}

// This works
getStudent(studentId);

// This causes TypeScript error (prevents mixing ID types)
const medicationId: MedicationId = brandMedicationId('...');
// getStudent(medicationId); // Error: Type 'MedicationId' is not assignable to 'StudentId'
```

### Object Shape Guards

```typescript
import {  hasProperty, hasStringProperty, hasProperties } from '../shared/types/guards';

// Check if object has property
if (hasProperty(obj, 'id')) {
  console.log(obj.id); // TypeScript knows obj has id property
}

// Check specific type
if (hasStringProperty(obj, 'email')) {
  console.log(obj.email.toLowerCase()); // TypeScript knows email is string
}

// Check multiple properties
if (hasProperties(obj, ['id', 'name', 'email'])) {
  // TypeScript knows obj has all three properties
}
```

### Paginated Response Validation

```typescript
import { isPaginatedResponse, isStudent } from '../shared/types/guards';

async function getStudents() {
  const response = await fetch('/api/students');
  const data = await response.json();
  
  if (isPaginatedResponse(data, isStudent)) {
    // TypeScript knows data is PaginatedResponse<Student>
    data.data.forEach(student => {
      console.log(student.firstName); // Type-safe
    });
  }
}
```

### Utility Guards

```typescript
import {
  isOneOf,
  isInRange,
  isMinLength,
  isMaxLength,
  matches
} from '../shared/types/guards';

// Check if value is one of options
const role = 'nurse';
if (isOneOf(role, ['nurse', 'admin', 'staff'])) {
  // Valid role
}

// Check number range
const age = 10;
if (isInRange(age, 5, 18)) {
  // Age is between 5 and 18
}

// Check string length
if (isMinLength(password, 8)) {
  // Password is at least 8 characters
}

if (isMaxLength(name, 50)) {
  // Name is at most 50 characters
}

// Pattern matching
const zipCode = '12345';
if (matches(zipCode, /^\d{5}$/)) {
  // Valid 5-digit zip code
}
```

## Integration with Error Codes

```typescript
import { isStudent } from '../shared/types/guards';
import { ErrorFactory } from '../shared/errors';

async function createStudent(data: unknown) {
  // Validate input
  if (!isStudent(data)) {
    throw ErrorFactory.validationFailed('student', 'Invalid student data format');
  }
  
  // TypeScript knows data is Student
  return await Student.create(data);
}
```

## API Request Validation

```typescript
import { isNonEmptyString, isUUID, isEmail } from '../shared/types/guards';
import { ErrorFactory } from '../shared/errors';

export async function createContactHandler(request: Request) {
  const { firstName, lastName, email, studentId } = request.payload as any;
  
  // Validate required fields
  if (!isNonEmptyString(firstName)) {
    throw ErrorFactory.missingField('firstName');
  }
  
  if (!isNonEmptyString(lastName)) {
    throw ErrorFactory.missingField('lastName');
  }
  
  // Validate email if provided
  if (email && !isEmail(email)) {
    throw ErrorFactory.validationFailed('email', 'Invalid email format');
  }
  
  // Validate student ID
  if (!isUUID(studentId)) {
    throw ErrorFactory.validationFailed('studentId', 'Invalid UUID format');
  }
  
  // Create contact
  return await ContactService.create({
    firstName,
    lastName,
    email,
    studentId
  });
}
```

## Testing

```typescript
import {
  isStudent,
  isUUID,
  isEmail,
  isPaginatedResponse
} from '../shared/types/guards';

describe('Type Guards', () => {
  describe('isStudent', () => {
    it('should validate student object', () => {
      const validStudent = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        firstName: 'John',
        lastName: 'Doe',
        active: true
      };
      
      expect(isStudent(validStudent)).toBe(true);
    });
    
    it('should reject invalid student', () => {
      const invalidStudent = {
        id: '123',
        firstName: 'John'
        // Missing required fields
      };
      
      expect(isStudent(invalidStudent)).toBe(false);
    });
  });
  
  describe('isUUID', () => {
    it('should validate UUID', () => {
      expect(isUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    });
    
    it('should reject invalid UUID', () => {
      expect(isUUID('not-a-uuid')).toBe(false);
    });
  });
  
  describe('isEmail', () => {
    it('should validate email', () => {
      expect(isEmail('test@example.com')).toBe(true);
    });
    
    it('should reject invalid email', () => {
      expect(isEmail('not-an-email')).toBe(false);
    });
  });
});
```

## Best Practices

### 1. Use Type Guards at API Boundaries

```typescript
// ✅ Good - Validate at entry point
export async function createStudentHandler(request: Request) {
  const data = request.payload;
  
  if (!isStudent(data)) {
    throw ErrorFactory.validationFailed('student', 'Invalid format');
  }
  
  return await StudentService.create(data);
}

// ❌ Avoid - Assume data is valid
export async function createStudentHandler(request: Request) {
  const data = request.payload as Student;
  return await StudentService.create(data); // No validation
}
```

### 2. Use Assertions for Internal Functions

```typescript
// ✅ Good - Assert expectations
function processStudentId(id: unknown) {
  assertUUID(id, 'studentId');
  // Continue with confidence that id is valid UUID
}

// ❌ Avoid - No validation
function processStudentId(id: string) {
  // Assumes id is valid UUID
}
```

### 3. Use Branded Types for ID Safety

```typescript
// ✅ Good - Prevents ID mix-ups
function getStudent(id: StudentId): Promise<Student> {
  return Student.findByPk(id);
}

function getMedication(id: MedicationId): Promise<Medication> {
  return Medication.findByPk(id);
}

// ❌ Avoid - Easy to mix up IDs
function getStudent(id: string): Promise<Student> {
  return Student.findByPk(id);
}

function getMedication(id: string): Promise<Medication> {
  return Medication.findByPk(id);
}
```

### 4. Combine with Error Codes

```typescript
// ✅ Good - Clear error with code
if (!isUUID(studentId)) {
  throw ErrorFactory.validationFailed('studentId', 'Must be valid UUID');
}

// ❌ Avoid - Generic error
if (!isUUID(studentId)) {
  throw new Error('Invalid student ID');
}
```

## Migration Guide

### From Existing Code

**Before:**
```typescript
function processStudent(data: any) {
  if (typeof data.id !== 'string' || typeof data.firstName !== 'string') {
    throw new Error('Invalid student data');
  }
  // Process student
}
```

**After:**
```typescript
import { isStudent } from '../shared/types/guards';
import { ErrorFactory } from '../shared/errors';

function processStudent(data: unknown) {
  if (!isStudent(data)) {
    throw ErrorFactory.validationFailed('student', 'Invalid student data format');
  }
  // TypeScript knows data is Student
}
```

## Available Guards

### Basic Types
- `isString`, `isNumber`, `isBoolean`
- `isNull`, `isUndefined`, `isNullOrUndefined`
- `isObject`, `isArray`, `isFunction`
- `isDate`, `isError`

### Advanced Types
- `isStringArray`, `isNumberArray`
- `isNonEmptyString`, `isNonEmptyArray`
- `isUUID`, `isEmail`, `isPhoneNumber`
- `isISO8601`, `isValidDate`

### Object Shape
- `hasProperty`, `hasProperties`
- `hasStringProperty`, `hasNumberProperty`

### Healthcare-Specific
- `isStudent`, `isMedication`, `isMedicationLog`
- `isContact`, `isHealthRecord`

### API
- `isPaginatedResponse`, `isApiError`

### Assertions
- `assertString`, `assertNumber`, `assertBoolean`
- `assertObject`, `assertArray`, `assertNonNull`
- `assertUUID`, `assertEmail`

### Utility
- `isDefined`, `isOneOf`, `isInRange`
- `isMinLength`, `isMaxLength`, `matches`

### Branded Types
- `StudentId`, `MedicationId`, `UserId`, `ContactId`, `HealthRecordId`
- `brandStudentId`, `brandMedicationId`, etc.
- `isStudentId`, `isMedicationId`, etc.

## See Also

- [Error Code System](../errors/README.md)
- [Implementation Plan](../../../../IMPLEMENTATION_PLAN.md)
- [Berty Type Utilities](https://github.com/berty/berty/tree/master/js/packages/utils/type)
