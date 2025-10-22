# JSDoc Implementation Guide - Backend Services

## Quick Start

### Step 1: Run the JSDoc Generator
```bash
# Dry run to see what would be documented
node backend/scripts/generate-jsdoc.js --dry-run

# Generate JSDoc templates
node backend/scripts/generate-jsdoc.js
```

### Step 2: Review Generated Templates
Templates are created with `.jsdoc.template` extension next to source files.

### Step 3: Merge Templates
Manually review and merge templates into source files, customizing descriptions.

### Step 4: Generate Documentation
```bash
# Install TypeDoc
npm install --save-dev typedoc

# Generate HTML documentation
npx typedoc --out docs/api backend/src/services
```

## JSDoc Standards by Service Type

### 1. CRUD Services

```typescript
/**
 * @fileoverview Student CRUD Service
 * @module services/student/studentService
 * @description Handles create, read, update, and delete operations for student records
 *
 * @requires ../database/models/Student - Student database model
 * @requires ../utils/logger - Logging utility
 *
 * @exports StudentService - Student CRUD operations
 * @exports CreateStudentData - Student creation interface
 * @exports UpdateStudentData - Student update interface
 */

/**
 * @class StudentService
 * @description Service class for student CRUD operations with HIPAA compliance
 */
export class StudentService {
  /**
   * @method create
   * @description Creates a new student record with validation
   * @async
   * @static
   *
   * @param {CreateStudentData} data - Student creation data
   * @param {string} data.studentNumber - Unique student identifier
   * @param {string} data.firstName - Student's first name
   * @param {string} data.lastName - Student's last name
   * @param {Date} data.dateOfBirth - Date of birth
   * @param {string} data.grade - Grade level
   *
   * @returns {Promise<Student>} Created student record
   * @returns {string} returns.id - Student UUID
   * @returns {string} returns.studentNumber - Student number
   * @returns {string} returns.fullName - Concatenated full name
   *
   * @throws {ValidationError} When required fields are missing
   * @throws {DuplicateError} When student number already exists
   * @throws {DatabaseError} When database operation fails
   *
   * @example
   * const student = await StudentService.create({
   *   studentNumber: 'STU001',
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   dateOfBirth: new Date('2010-05-15'),
   *   grade: '5'
   * });
   * console.log(student.id); // UUID
   *
   * @security HIPAA - Student data is PHI
   * @audit All operations are logged
   */
  static async create(data: CreateStudentData): Promise<Student> {
    // Implementation
  }
}
```

### 2. Query/Search Services

```typescript
/**
 * @method search
 * @description Searches students with advanced filtering and pagination
 * @async
 * @static
 *
 * @param {Object} params - Search parameters
 * @param {string} [params.query] - Search query string
 * @param {string} [params.grade] - Filter by grade
 * @param {boolean} [params.isActive=true] - Filter by active status
 * @param {number} [params.page=1] - Page number (1-indexed)
 * @param {number} [params.limit=20] - Items per page (max 100)
 * @param {string} [params.sortBy='lastName'] - Sort field
 * @param {string} [params.sortOrder='ASC'] - Sort direction (ASC|DESC)
 *
 * @returns {Promise<SearchResult>} Search results with pagination
 * @returns {Array<Student>} returns.data - Array of student records
 * @returns {Object} returns.pagination - Pagination metadata
 * @returns {number} returns.pagination.page - Current page
 * @returns {number} returns.pagination.limit - Items per page
 * @returns {number} returns.pagination.total - Total items
 * @returns {number} returns.pagination.pages - Total pages
 * @returns {Object} returns.filters - Applied filters
 *
 * @throws {ValidationError} When page or limit is invalid
 * @throws {DatabaseError} When query fails
 *
 * @example
 * // Basic search
 * const results = await StudentService.search({
 *   query: 'john',
 *   page: 1,
 *   limit: 20
 * });
 *
 * @example
 * // Advanced filtering
 * const filtered = await StudentService.search({
 *   query: 'doe',
 *   grade: '5',
 *   isActive: true,
 *   sortBy: 'lastName',
 *   sortOrder: 'ASC'
 * });
 */
```

### 3. Business Logic Services

```typescript
/**
 * @method calculateBMI
 * @description Calculates Body Mass Index from height and weight with age-appropriate validation
 * @static
 *
 * @param {number} heightCm - Height in centimeters
 * @param {number} weightKg - Weight in kilograms
 * @param {Date} [dateOfBirth] - Optional DOB for age-based validation
 *
 * @returns {Object} BMI calculation result
 * @returns {number} returns.bmi - Calculated BMI value
 * @returns {string} returns.category - BMI category (underweight, normal, overweight, obese)
 * @returns {string} returns.percentile - Age-based percentile if DOB provided
 * @returns {Object} returns.recommendations - Health recommendations
 *
 * @throws {ValidationError} When height or weight is invalid
 * @throws {RangeError} When values are outside acceptable ranges
 *
 * @example
 * const result = calculateBMI(150, 45);
 * console.log(result.bmi); // 20.0
 * console.log(result.category); // 'normal'
 *
 * @medical Uses CDC growth charts for children
 * @reference https://www.cdc.gov/healthyweight/assessing/bmi/
 */
```

### 4. Integration Services

```typescript
/**
 * @method syncWithSIS
 * @description Synchronizes student data with Student Information System
 * @async
 * @static
 *
 * @param {string} districtId - District identifier
 * @param {Object} [options] - Sync options
 * @param {boolean} [options.fullSync=false] - Perform full sync vs delta
 * @param {Date} [options.since] - Sync changes since this date
 * @param {boolean} [options.dryRun=false] - Preview changes without committing
 *
 * @returns {Promise<SyncResult>} Synchronization results
 * @returns {number} returns.created - Number of records created
 * @returns {number} returns.updated - Number of records updated
 * @returns {number} returns.deleted - Number of records deleted
 * @returns {number} returns.errors - Number of errors encountered
 * @returns {Array<Object>} returns.errorDetails - Detailed error information
 * @returns {Date} returns.startTime - Sync start timestamp
 * @returns {Date} returns.endTime - Sync completion timestamp
 * @returns {number} returns.duration - Duration in milliseconds
 *
 * @throws {ConnectionError} When SIS connection fails
 * @throws {AuthenticationError} When SIS credentials are invalid
 * @throws {SyncError} When synchronization fails
 *
 * @example
 * // Delta sync since last week
 * const result = await syncWithSIS('district-123', {
 *   since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
 * });
 * console.log(`Created: ${result.created}, Updated: ${result.updated}`);
 *
 * @integration Connects to external SIS via REST API
 * @security Uses encrypted credentials from config
 */
```

### 5. Analytics Services

```typescript
/**
 * @method generateHealthTrends
 * @description Generates health trend analytics for a time period
 * @async
 * @static
 *
 * @param {Object} params - Analytics parameters
 * @param {Date} params.startDate - Analysis start date
 * @param {Date} params.endDate - Analysis end date
 * @param {string} [params.districtId] - Optional district filter
 * @param {string} [params.schoolId] - Optional school filter
 * @param {Array<string>} [params.metrics] - Specific metrics to analyze
 *
 * @returns {Promise<AnalyticsResult>} Analytics results
 * @returns {Object} returns.summary - Summary statistics
 * @returns {number} returns.summary.totalVisits - Total clinic visits
 * @returns {number} returns.summary.avgVisitsPerDay - Average daily visits
 * @returns {Array<Object>} returns.trends - Trend data points
 * @returns {Array<Object>} returns.topConditions - Most common conditions
 * @returns {Array<Object>} returns.topMedications - Most prescribed medications
 * @returns {Object} returns.demographics - Demographic breakdown
 *
 * @throws {ValidationError} When date range is invalid
 * @throws {DatabaseError} When query fails
 *
 * @example
 * const analytics = await generateHealthTrends({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   metrics: ['visits', 'medications', 'incidents']
 * });
 *
 * @performance Uses indexed database queries
 * @caching Results cached for 1 hour
 */
```

### 6. Validation Services

```typescript
/**
 * @method validateStudentData
 * @description Validates student data against business rules
 * @static
 *
 * @param {Object} data - Data to validate
 * @param {string} data.studentNumber - Student number
 * @param {string} data.firstName - First name
 * @param {string} data.lastName - Last name
 * @param {Date} data.dateOfBirth - Date of birth
 *
 * @returns {ValidationResult} Validation result
 * @returns {boolean} returns.isValid - Overall validation status
 * @returns {Array<string>} returns.errors - Critical validation errors
 * @returns {Array<string>} returns.warnings - Non-critical warnings
 * @returns {Object} returns.details - Field-level validation details
 *
 * @throws {TypeError} When data structure is invalid
 *
 * @example
 * const result = validateStudentData({
 *   studentNumber: 'STU001',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   dateOfBirth: new Date('2010-05-15')
 * });
 *
 * if (!result.isValid) {
 *   console.error('Validation failed:', result.errors);
 * }
 *
 * @validation Uses Joi schemas
 * @compliance FERPA and HIPAA compliant
 */
```

## Common Patterns

### Error Documentation
Always document all possible errors:

```typescript
/**
 * @throws {ValidationError} When input fails validation
 *   - Code: VAL_001
 *   - HTTP: 400
 *   - Example: "Student number is required"
 *
 * @throws {NotFoundError} When resource doesn't exist
 *   - Code: NOT_FOUND_001
 *   - HTTP: 404
 *   - Example: "Student with ID xyz not found"
 *
 * @throws {DuplicateError} When unique constraint violated
 *   - Code: DUP_001
 *   - HTTP: 409
 *   - Example: "Student number already exists"
 *
 * @throws {AuthorizationError} When user lacks permissions
 *   - Code: AUTH_001
 *   - HTTP: 403
 *   - Example: "Insufficient permissions to access student data"
 *
 * @throws {DatabaseError} When database operation fails
 *   - Code: DB_001
 *   - HTTP: 500
 *   - Example: "Database connection failed"
 */
```

### HIPAA/PHI Documentation
Mark PHI-containing methods:

```typescript
/**
 * @method getPatientHealthRecord
 * @description Retrieves complete patient health record
 *
 * @security Contains PHI - HIPAA compliant
 * @audit All access logged with user, timestamp, and purpose
 * @encryption Data encrypted at rest and in transit
 * @retention Subject to 7-year retention policy
 *
 * @param {string} studentId - Student identifier (PHI)
 * @returns {Promise<HealthRecord>} Complete health record (Contains PHI)
 */
```

### Async/Promise Documentation
```typescript
/**
 * @method fetchData
 * @description Asynchronously fetches data from database
 * @async
 *
 * @param {string} id - Record ID
 * @returns {Promise<Object>} Resolves with record data
 * @rejects {Error} Rejects when record not found
 *
 * @example
 * try {
 *   const data = await fetchData('123');
 *   console.log(data);
 * } catch (error) {
 *   console.error('Failed to fetch:', error);
 * }
 */
```

### Private/Internal Methods
```typescript
/**
 * @private
 * @method _calculateInternalMetric
 * @description Internal helper for metric calculation
 * @internal Not exposed in public API
 *
 * @param {number} value - Input value
 * @returns {number} Calculated metric
 */
```

### Deprecated Methods
```typescript
/**
 * @method legacyMethod
 * @deprecated Since version 2.0.0 - Use newMethod() instead
 * @description Old implementation maintained for backward compatibility
 *
 * @param {string} param - Parameter
 * @returns {Object} Result
 *
 * @see newMethod
 * @todo Remove in version 3.0.0
 */
```

## File Organization

### Service File Template
```typescript
/**
 * @fileoverview [Service Name]
 * @module services/[path]
 * @description [Description]
 * @requires [dependencies]
 * @exports [exports]
 * @author White Cross Medical Team
 * @version 1.0.0
 * @since [date]
 */

// Imports
import { ... } from '...';

/**
 * @interface DataType
 * @description [Interface description]
 */
export interface DataType {
  // Interface definition
}

/**
 * @class ServiceClass
 * @description [Class description]
 */
export class ServiceClass {
  /**
   * @method methodName
   * @description [Method description]
   * @async
   * @static
   * @param {Type} param - Description
   * @returns {Promise<Type>} Description
   * @throws {Error} Description
   * @example Example usage
   */
  static async methodName(param: Type): Promise<Type> {
    // Implementation
  }
}
```

## Best Practices

### DO:
✅ Document all public methods and classes
✅ Include practical examples
✅ Document all parameters and return values
✅ List all possible exceptions
✅ Mark PHI/HIPAA sensitive operations
✅ Include @async tag for async methods
✅ Document business logic and algorithms
✅ Reference external standards/RFCs
✅ Update docs when code changes

### DON'T:
❌ Document implementation details in public API docs
❌ Duplicate information already in parameter types
❌ Use vague descriptions like "processes data"
❌ Leave TODO comments in JSDoc
❌ Document every single line of code
❌ Use JSDoc for purely internal utilities
❌ Include sensitive information in examples

## IDE Support

### VS Code
Install these extensions:
- Document This
- JSDoc Generator
- TypeScript

### WebStorm/IntelliJ
Built-in JSDoc support with:
- Alt+Enter for quick JSDoc generation
- Ctrl+Q for quick documentation

### Visual Studio
- Built-in IntelliSense support
- XML Documentation Comments

## Continuous Integration

Add to your CI pipeline:

```yaml
# .github/workflows/docs.yml
name: Generate Documentation

on:
  push:
    branches: [ main, develop ]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npx typedoc
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

## Conclusion

Following these JSDoc standards ensures:
- Consistent documentation across the codebase
- Better IDE support and autocomplete
- Easier onboarding for new developers
- Compliance with healthcare data regulations
- Automated API documentation generation
- Improved code maintainability

---

**Remember**: Good documentation is an investment in your codebase's future!
