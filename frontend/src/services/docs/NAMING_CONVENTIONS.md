# Service Layer Naming Conventions

**Version**: 1.0.0
**Last Updated**: October 23, 2025
**Status**: Active Standard

This document establishes naming conventions for the White Cross Healthcare Platform frontend services layer. Following these conventions ensures consistency, improves code readability, and reduces cognitive load for developers.

## Table of Contents
1. [Method Naming](#method-naming)
2. [Class Naming](#class-naming)
3. [Interface and Type Naming](#interface-and-type-naming)
4. [Constants and Configuration](#constants-and-configuration)
5. [File Naming](#file-naming)
6. [Examples and Anti-Patterns](#examples-and-anti-patterns)

---

## Method Naming

### General Principles
- All method names MUST start with a verb
- Use camelCase for method names
- Be specific and descriptive (avoid generic names like `data()` or `items()`)
- Prefix clearly indicates the operation type
- Async methods should clearly indicate they perform I/O operations

### Data Retrieval Operations

#### `get*()` - Synchronous Retrieval or Cache Access
Use for fast, synchronous operations or retrieval from cache/memory.

```typescript
// Good
getUserFromCache(id: string): User | null
getToken(): string | null
getMetadata(): TokenMetadata | null
getCachedData<T>(key: string): T | null

// Bad
user(id: string)  // Missing verb
getData()  // Too generic, unclear if sync or async
```

**When to use**:
- Reading from memory/cache
- Synchronous computations
- No network I/O involved

#### `fetch*()` - Asynchronous Network Operations
Use for operations that make network requests (API calls).

```typescript
// Good
async fetchUserProfile(id: string): Promise<User>
async fetchMedications(filters: FilterParams): Promise<Medication[]>
async fetchHealthRecords(studentId: string): Promise<HealthRecord[]>

// Bad
async getUser(id: string)  // Unclear if sync or async
async user(id: string)  // Missing clear verb
async data()  // Too generic
```

**When to use**:
- Making HTTP requests
- Calling external APIs
- Operations that may take significant time

#### `load*()` - Initialization and Bulk Loading
Use for initialization operations or loading multiple resources.

```typescript
// Good
async loadInitialData(): Promise<void>
async loadApplicationConfig(): Promise<Config>
async loadUserPermissions(userId: string): Promise<Permission[]>

// Bad
async initialize()  // Too generic
async getConfig()  // Unclear if sync or async
```

**When to use**:
- Application initialization
- Loading configuration
- Bulk data loading
- Setting up state

#### `search*()` / `query*()` - Search Operations
Use for search and query operations.

```typescript
// Good
async searchMedications(query: string): Promise<Medication[]>
async searchStudents(criteria: SearchCriteria): Promise<Student[]>
async queryHealthRecords(filters: FilterParams): Promise<HealthRecord[]>

// Bad
async find(query: string)  // Too generic
async medications(query: string)  // Missing verb
```

**When to use**:
- User-initiated searches
- Complex queries with filters
- Full-text search operations

### Data Mutation Operations

#### `create*()` - Create New Resources
Use for creating new entities.

```typescript
// Good
async createStudent(data: CreateStudentDto): Promise<Student>
async createMedication(data: CreateMedicationDto): Promise<Medication>

// Bad
async addStudent(data: CreateStudentDto)  // Use 'create' for new resources
async newStudent(data: CreateStudentDto)  // Not a verb
```

#### `update*()` - Update Existing Resources
Use for updating existing entities (full updates).

```typescript
// Good
async updateStudent(id: string, data: UpdateStudentDto): Promise<Student>
async updateMedication(id: string, data: UpdateMedicationDto): Promise<Medication>

// Bad
async modifyStudent(id: string, data: UpdateStudentDto)  // Use 'update'
async changeStudent(id: string, data: UpdateStudentDto)  // Use 'update'
```

#### `patch*()` - Partial Updates
Use for partial updates to existing resources.

```typescript
// Good
async patchStudent(id: string, data: Partial<UpdateStudentDto>): Promise<Student>
patchMetadata(updates: Partial<Metadata>): void

// Bad
async partialUpdate(id: string, data: Partial<UpdateStudentDto>)  // Use 'patch'
```

#### `delete*()` - Delete Resources
Use for deleting resources (HTTP DELETE operations).

```typescript
// Good
async deleteStudent(id: string): Promise<void>
async deleteMedication(id: string): Promise<void>

// Bad
async removeStudent(id: string)  // Reserve 'remove' for in-memory operations
async destroyStudent(id: string)  // Use 'delete' for API operations
```

#### `save*()` - Generic Save (Create or Update)
Use when operation could be either create or update.

```typescript
// Good
async saveStudent(data: StudentDto): Promise<Student>
async saveDraft(data: DraftDto): Promise<Draft>

// Prefer specific methods when possible
async createStudent(data: CreateStudentDto): Promise<Student>  // Better
async updateStudent(id: string, data: UpdateStudentDto): Promise<Student>  // Better
```

**Note**: Prefer specific `create*()` or `update*()` when the operation is known.

### State Check Operations (Boolean Returns)

#### `is*()` - State Checks
Use for boolean checks on state or conditions.

```typescript
// Good
isTokenValid(): boolean
isExpired(): boolean
isAuthenticated(): boolean
isEmpty(): boolean

// Bad
tokenValid()  // Missing 'is' prefix
checkValidity()  // Use 'is' for boolean
```

#### `has*()` - Existence Checks
Use for checking existence or possession.

```typescript
// Good
hasToken(): boolean
hasPermission(permission: string): boolean
hasValidCache(key: string): boolean

// Bad
tokenExists()  // Use 'has' prefix
checkToken()  // Use 'has' for existence
```

#### `can*()` - Capability and Permission Checks
Use for checking capabilities or permissions.

```typescript
// Good
canRefresh(): boolean
canAccessResource(resourceId: string): boolean
canPerformAction(action: string): boolean

// Bad
isAbleToRefresh()  // Use 'can' for capabilities
hasRefreshPermission()  // Use 'can' for permissions
```

### State Change Operations

#### `set*()` - Set Single Values
Use for setting a single value or property.

```typescript
// Good
setToken(token: string): void
setLogging(enabled: boolean): void
setRetry(enabled: boolean): void

// Bad
updateToken(token: string)  // Use 'set' for simple assignments
changeLogging(enabled: boolean)  // Use 'set'
```

#### `clear*()` - Clear All Values of a Type
Use for clearing all values of a particular type.

```typescript
// Good
clearAllTokens(): void  // Removes all tokens
clearCache(): void  // Clears entire cache
clearErrors(): void  // Clears all errors

// Bad
removeTokens()  // Use 'clear' for removing all
deleteAllTokens()  // Use 'clear'
```

#### `remove*()` - Remove Single Item
Use for removing a specific item (in-memory operations).

```typescript
// Good
removeTokenByKey(key: string): void
removeFromCache(key: string): void
removeListener(id: string): void

// Bad
clearToken(key: string)  // Use 'clear' for all, 'remove' for single
deleteToken(key: string)  // Use 'delete' for API, 'remove' for memory
```

#### `reset*()` - Reset to Default State
Use for resetting to initial or default state.

```typescript
// Good
resetToDefaults(): void
resetConfiguration(): void
resetState(): void

// Bad
clearState()  // Use 'reset' when restoring to default
initializeState()  // Use 'reset' when resetting existing state
```

### Bulk Operations

Prefix with `bulk` for operations on multiple items.

```typescript
// Good
async bulkCreate(items: CreateDto[]): Promise<Entity[]>
async bulkUpdate(updates: Array<{ id: string; data: UpdateDto }>): Promise<Entity[]>
async bulkDelete(ids: string[]): Promise<void>

// Bad
async createMany(items: CreateDto[])  // Use 'bulk' prefix
async updateMultiple(updates: Array<{ id: string; data: UpdateDto }>)  // Use 'bulk'
```

---

## Class Naming

### General Principles
- Use PascalCase for class names
- Be descriptive and specific
- Include the type suffix for clarity

### Service Classes
Suffix with `Service` for business logic services.

```typescript
// Good
class StudentManagementService { }
class MedicationService { }
class AuthenticationService { }

// Bad
class Students { }  // Too generic
class MedicationHandler { }  // Use 'Service'
```

### API Client Classes
Suffix with `Api` or `ApiClient` for API interaction classes.

```typescript
// Good
class MedicationFormularyApi { }
class StudentApi { }
class ApiClient { }

// Bad
class MedicationService { }  // Conflicts with business logic
class StudentClient { }  // Use 'Api' suffix
```

### Manager Classes
Suffix with `Manager` for classes that manage resources or state.

```typescript
// Good
class SecureTokenManager { }
class CacheManager { }
class StateManager { }

// Bad
class TokenService { }  // Use 'Manager' for resource management
class Cacher { }  // Use 'Manager'
```

### Utility Classes
Avoid class suffix for utility classes unless necessary for clarity.

```typescript
// Good
class QueryKeyFactory { }
class InvalidationStrategy { }
class CircuitBreaker { }

// Context-specific
class HealthMonitor { }
class ErrorTracker { }
```

---

## Interface and Type Naming

### Interfaces
Use PascalCase without prefix (no `I` prefix).

```typescript
// Good
interface User { }
interface ApiResponse<T> { }
interface TokenMetadata { }
interface PaginationParams { }

// Bad
interface IUser { }  // Don't use 'I' prefix
interface UserInterface { }  // Don't use 'Interface' suffix
```

### Type Aliases
Use PascalCase, be descriptive.

```typescript
// Good
type UserId = string;
type ApiError = Error & { status: number };
type FilterParams = PaginationParams & { [key: string]: unknown };

// Bad
type id = string;  // Use PascalCase
type Params = object;  // Too generic
```

### DTOs (Data Transfer Objects)
Suffix with `Dto` for data transfer objects.

```typescript
// Good
interface CreateStudentDto { }
interface UpdateMedicationDto { }
interface LoginDto { }

// Bad
interface StudentData { }  // Use 'Dto' suffix
interface CreateStudent { }  // Add 'Dto' suffix
```

### Response Types
Suffix with `Response` for API response types.

```typescript
// Good
interface ApiResponse<T> { }
interface PaginatedResponse<T> { }
interface LoginResponse { }

// Bad
interface ApiResult<T> { }  // Use 'Response'
interface PaginatedData<T> { }  // Use 'Response'
```

### Config/Options Types
Suffix with `Config` or `Options` for configuration objects.

```typescript
// Good
interface ApiClientConfig { }
interface RetryOptions { }
interface CacheConfig { }

// Bad
interface ApiClientSettings { }  // Use 'Config' or 'Options'
interface RetryParams { }  // Use 'Options'
```

---

## Constants and Configuration

### Constants
Use SCREAMING_SNAKE_CASE for true constants.

```typescript
// Good
const API_VERSION = 'v1';
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 30000;

// Bad
const apiVersion = 'v1';  // Use SCREAMING_SNAKE_CASE
const maxRetryAttempts = 3;  // Use SCREAMING_SNAKE_CASE
```

### Configuration Objects
Use camelCase for configuration objects and PascalCase for types.

```typescript
// Good
const apiConfig: ApiConfig = {
  baseURL: 'https://api.example.com',
  timeout: 30000,
};

const SECURITY_CONFIG = {
  SESSION_TIMEOUT: 8 * 60 * 60 * 1000,
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000,
} as const;

// Bad
const API_CONFIG = { }  // Use camelCase for config objects
const securityconfig = { }  // Use SCREAMING_SNAKE_CASE for constants
```

### Enums
Use PascalCase for enum names and SCREAMING_SNAKE_CASE for values.

```typescript
// Good
enum HttpStatus {
  OK = 200,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  NURSE = 'nurse',
}

// Bad
enum httpStatus { }  // Use PascalCase
enum UserRole {
  admin = 'admin',  // Use SCREAMING_SNAKE_CASE
}
```

---

## File Naming

### Service Files
Use PascalCase matching the main export.

```
// Good
ApiClient.ts
SecureTokenManager.ts
MedicationFormularyApi.ts

// Bad
api-client.ts  // Use PascalCase
apiClient.ts  // Use PascalCase
```

### Utility Files
Use camelCase for utility files.

```
// Good
apiUtils.ts
dateHelpers.ts
validationUtils.ts

// Bad
ApiUtils.ts  // Use camelCase for utilities
api-utils.ts  // Use camelCase
```

### Type Definition Files
Use camelCase with `.types.ts` suffix.

```
// Good
api.types.ts
user.types.ts
medication.types.ts

// Or use index.ts in types directory
types/index.ts

// Bad
ApiTypes.ts  // Use camelCase
api-types.ts  // Use .types.ts suffix
```

### Configuration Files
Use camelCase with `Config` suffix.

```
// Good
apiConfig.ts
cacheConfig.ts
securityConfig.ts

// Bad
api-config.ts  // Use camelCase
ApiConfig.ts  // Use camelCase
```

---

## Examples and Anti-Patterns

### Good Patterns

#### API Service
```typescript
class StudentApi extends BaseApiService<Student, CreateStudentDto, UpdateStudentDto> {
  // Fetch from API
  async fetchStudentById(id: string): Promise<Student> {
    return this.getById(id);
  }

  // Search operation
  async searchStudents(query: string): Promise<Student[]> {
    return this.search(query);
  }

  // Bulk operations
  async bulkEnrollStudents(students: CreateStudentDto[]): Promise<Student[]> {
    return this.bulkCreate(students);
  }
}
```

#### Manager Class
```typescript
class SecureTokenManager {
  // Get from memory/sessionStorage
  getToken(): string | null { }
  getRefreshToken(): string | null { }

  // Set single value
  setToken(token: string, refreshToken?: string): void { }

  // State checks
  isTokenValid(): boolean { }
  hasValidToken(): boolean { }

  // State changes
  clearAllTokens(): void { }  // Removes all tokens
  removeTokenByKey(key: string): void { }  // Removes specific token

  // Utility
  updateActivity(): void { }
  getTimeUntilExpiration(): number { }
}
```

#### Cache Service
```typescript
class CacheManager<T> {
  // Synchronous cache operations
  get<T>(key: string): T | null { }
  set<T>(key: string, value: T): void { }

  // State checks
  has(key: string): boolean { }
  isExpired(key: string): boolean { }

  // State changes
  remove(key: string): void { }  // Remove single item
  clearAll(): void { }  // Clear entire cache
  clearByTags(tags: string[]): void { }  // Clear by criteria

  // Async operations (if any)
  async fetchAndCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> { }
}
```

### Anti-Patterns to Avoid

#### Too Generic
```typescript
// Bad
async data(id: string): Promise<User>  // What kind of data?
async items(): Promise<Item[]>  // Too vague

// Good
async fetchUserData(id: string): Promise<User>
async fetchInventoryItems(): Promise<Item[]>
```

#### Missing Async Indication
```typescript
// Bad
async getStudents(): Promise<Student[]>  // Sounds synchronous

// Good
async fetchStudents(): Promise<Student[]>  // Clear async operation
```

#### Inconsistent Naming
```typescript
// Bad - Inconsistent within same class
class UserService {
  async getUser(id: string): Promise<User>  // 'get' implies sync
  async createUser(data: CreateUserDto): Promise<User>  // 'create' is good
  async removeUser(id: string): Promise<void>  // Should be 'delete' for API

// Good - Consistent
class UserService {
  async fetchUser(id: string): Promise<User>  // Clear async
  async createUser(data: CreateUserDto): Promise<User>
  async deleteUser(id: string): Promise<void>  // Consistent with REST
}
```

#### Unclear State Operations
```typescript
// Bad
deleteToken(): void  // Sounds like API call, but it's in-memory
clearToken(key: string): void  // Sounds like clearing all, but it's one
removeAllTokens(): void  // Inconsistent with 'clear' pattern

// Good
removeTokenByKey(key: string): void  // Clear it's one token
clearAllTokens(): void  // Clear it's all tokens
resetTokenState(): void  // Clear it's resetting to default
```

---

## Exceptions and Special Cases

### When to Deviate
1. **Third-party library conventions**: When implementing interfaces from external libraries
2. **Domain-specific terminology**: When healthcare domain has established terminology
3. **Legacy compatibility**: When maintaining backwards compatibility (use `@deprecated`)
4. **Performance critical code**: When naming would impact performance (rare)

### How to Document Exceptions
Use JSDoc to explain deviations:

```typescript
/**
 * Retrieves patient data from cache
 *
 * Note: Uses 'get' prefix despite async operation because it primarily
 * reads from local cache with fallback to network.
 *
 * @deprecated Use fetchPatient() for explicit async operation
 */
async getPatient(id: string): Promise<Patient> { }
```

---

## Enforcement

### Code Review Checklist
- [ ] All methods start with appropriate verb
- [ ] Async methods use `fetch`, `load`, `search`, not `get`
- [ ] State checks use `is`, `has`, `can`
- [ ] State changes use `set`, `clear`, `remove`, `reset`
- [ ] Classes have appropriate suffixes
- [ ] Interfaces use PascalCase without prefix
- [ ] Constants use SCREAMING_SNAKE_CASE

### Recommended Tools
- ESLint with custom rules
- TypeScript strict mode
- Pre-commit hooks for naming validation
- Code review guidelines

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-23 | Initial version based on code review findings |

---

## Questions or Suggestions?

Contact the architecture team or submit a PR to update this document.
