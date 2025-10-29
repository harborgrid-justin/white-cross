# Sequelize Repositories Documentation

## Overview

This directory contains repository implementations following the Repository Pattern. Repositories provide a clean abstraction layer for data access, separating business logic from database operations. All repositories extend the `BaseRepository` class which provides enterprise-grade features including caching, audit logging, transactions, and error handling.

## Table of Contents

- [Architecture](#architecture)
- [Creating a Repository](#creating-a-repository)
- [BaseRepository Features](#baserepository-features)
- [Custom Queries](#custom-queries)
- [Transaction Handling](#transaction-handling)
- [Cache Management](#cache-management)
- [Audit Logging](#audit-logging)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Architecture

### Repository Pattern Benefits

1. **Separation of Concerns**: Business logic separated from data access
2. **Testability**: Easy to mock repositories for unit tests
3. **Consistency**: Uniform data access patterns across the application
4. **Maintainability**: Centralized data access logic
5. **Enterprise Features**: Built-in caching, auditing, and transactions

### Directory Structure

```
repositories/
├── base/
│   └── base.repository.ts        # Abstract base repository
├── interfaces/
│   ├── repository.interface.ts   # Repository contract
│   └── ... other interfaces
├── impl/
│   ├── user.repository.ts        # User repository implementation
│   ├── appointment.repository.ts  # Appointment repository implementation
│   └── ... other repositories
└── README.md                      # This file
```

## Creating a Repository

### Step 1: Define Interfaces

```typescript
// DTOs for your repository
export interface UserAttributes {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: string;
}

export interface UpdateUserDTO {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
}
```

### Step 2: Create Repository Class

```typescript
/**
 * User Repository Implementation
 *
 * Provides data access operations for User entities with:
 * - CRUD operations via BaseRepository
 * - Custom user-specific queries
 * - Email uniqueness validation
 * - Password management support
 *
 * @extends BaseRepository<User, UserAttributes, CreateUserDTO>
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class UserService {
 *   constructor(private readonly userRepository: UserRepository) {}
 *
 *   async createUser(dto: CreateUserDTO) {
 *     return await this.userRepository.create(dto, executionContext);
 *   }
 * }
 * ```
 */
@Injectable()
export class UserRepository extends BaseRepository<
  User,
  UserAttributes,
  CreateUserDTO
> {
  /**
   * Creates repository instance with dependency injection
   *
   * @param {ModelStatic<User>} model - Sequelize User model
   * @param {IAuditLogger} auditLogger - Audit logging service
   * @param {ICacheManager} cacheManager - Cache management service
   */
  constructor(
    @InjectModel(User) model: ModelStatic<User>,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'User');
  }

  /**
   * Validate user data before creation
   *
   * Checks for:
   * - Email uniqueness
   * - Valid email format
   * - Required fields present
   */
  protected async validateCreate(data: CreateUserDTO): Promise<void> {
    // Check email uniqueness
    const emailExists = await this.exists({ email: data.email });
    if (emailExists) {
      throw new RepositoryError(
        'Email already in use',
        'VALIDATION_ERROR',
        400,
        { email: data.email }
      );
    }

    // Additional validation logic here
  }

  /**
   * Validate user data before update
   */
  protected async validateUpdate(
    id: string,
    data: UpdateUserDTO
  ): Promise<void> {
    // Email uniqueness check if changing email
    if (data.email) {
      const existing = await this.model.findOne({
        where: {
          email: data.email,
          id: { [Op.ne]: id } // Exclude current user
        }
      });

      if (existing) {
        throw new RepositoryError(
          'Email already in use',
          'VALIDATION_ERROR',
          400,
          { email: data.email }
        );
      }
    }
  }

  /**
   * Invalidate user-related caches
   *
   * Clears:
   * - Entity-specific cache
   * - User list queries
   * - Related caches (by school, district, etc.)
   */
  protected async invalidateCaches(entity: User): Promise<void> {
    try {
      const userData = entity.get();

      // Invalidate specific user cache
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, userData.id)
      );

      // Invalidate user list caches
      await this.cacheManager.deletePattern('white-cross:user:*');

      // Invalidate school/district user lists if applicable
      if (userData.schoolId) {
        await this.cacheManager.delete(
          this.cacheKeyBuilder.list('User', { schoolId: userData.schoolId })
        );
      }
    } catch (error) {
      this.logger.warn('Error invalidating user caches:', error);
    }
  }

  /**
   * Sanitize user data for audit logging
   *
   * Removes sensitive fields that should not be logged:
   * - password
   * - passwordResetToken
   * - twoFactorSecret
   * - emailVerificationToken
   */
  protected sanitizeForAudit(data: any): any {
    const {
      password,
      passwordResetToken,
      emailVerificationToken,
      twoFactorSecret,
      ...safeData
    } = data;
    return safeData;
  }

  // ========== Custom Query Methods ==========

  /**
   * Find user by email address
   *
   * @param {string} email - User email to search for
   * @returns {Promise<UserAttributes | null>} User or null if not found
   *
   * @example
   * ```typescript
   * const user = await userRepository.findByEmail('nurse@school.edu');
   * ```
   */
  async findByEmail(email: string): Promise<UserAttributes | null> {
    try {
      const user = await this.model.findOne({
        where: { email: email.toLowerCase().trim() }
      });

      return user ? this.mapToEntity(user) : null;
    } catch (error) {
      this.logger.error('Error finding user by email:', error);
      throw new RepositoryError(
        'Failed to find user by email',
        'FIND_ERROR',
        500,
        { email, error: (error as Error).message }
      );
    }
  }

  /**
   * Find all users by role
   *
   * @param {UserRole} role - User role to filter by
   * @param {QueryOptions} [options] - Query options
   * @returns {Promise<UserAttributes[]>} Array of users with role
   */
  async findByRole(
    role: UserRole,
    options?: QueryOptions
  ): Promise<UserAttributes[]> {
    const users = await this.model.findAll({
      where: { role, isActive: true },
      ...this.buildFindOptions(options)
    });

    return users.map(user => this.mapToEntity(user));
  }

  /**
   * Find all users in a school
   *
   * @param {string} schoolId - School UUID
   * @returns {Promise<UserAttributes[]>} Array of school users
   */
  async findBySchool(schoolId: string): Promise<UserAttributes[]> {
    const users = await this.model.findAll({
      where: { schoolId, isActive: true },
      order: [['lastName', 'ASC'], ['firstName', 'ASC']]
    });

    return users.map(user => this.mapToEntity(user));
  }
}
```

## BaseRepository Features

The `BaseRepository` provides the following out-of-the-box functionality:

### CRUD Operations

```typescript
// Create
const user = await userRepository.create(
  { email, password, firstName, lastName, role },
  executionContext
);

// Read
const user = await userRepository.findById(userId);
const users = await userRepository.findMany({
  where: { isActive: true },
  pagination: { page: 1, limit: 20 }
});

// Update
const updated = await userRepository.update(
  userId,
  { isActive: false },
  executionContext
);

// Delete
await userRepository.delete(userId, executionContext);

// Bulk operations
const users = await userRepository.bulkCreate(
  [user1Data, user2Data, user3Data],
  executionContext
);

// Utility methods
const exists = await userRepository.exists({ email: 'test@example.com' });
const count = await userRepository.count({ role: UserRole.NURSE });
```

### Execution Context

All mutating operations require an execution context for audit logging:

```typescript
interface ExecutionContext {
  userId: string;      // ID of user performing action
  ipAddress?: string;  // IP address of request
  userAgent?: string;  // Browser/client user agent
  requestId?: string;  // Request correlation ID
}

// Example
const context: ExecutionContext = {
  userId: currentUser.id,
  ipAddress: req.ip,
  userAgent: req.headers['user-agent']
};

await repository.create(data, context);
```

## Custom Queries

### Complex Filtering

```typescript
/**
 * Find users with complex criteria
 */
async findActiveNursesBySchool(schoolId: string): Promise<UserAttributes[]> {
  const users = await this.model.findAll({
    where: {
      schoolId,
      role: UserRole.NURSE,
      isActive: true,
      emailVerified: true,
      lockoutUntil: {
        [Op.or]: [
          { [Op.eq]: null },
          { [Op.lt]: new Date() }
        ]
      }
    },
    order: [
      ['lastName', 'ASC'],
      ['firstName', 'ASC']
    ]
  });

  return users.map(u => this.mapToEntity(u));
}
```

### Aggregations

```typescript
/**
 * Get user statistics by school
 */
async getUserStatsBySchool(schoolId: string): Promise<UserStats> {
  const stats = await this.model.findAll({
    where: { schoolId },
    attributes: [
      'role',
      [fn('COUNT', col('id')), 'count'],
      [fn('COUNT', literal('CASE WHEN is_active = true THEN 1 END')), 'activeCount']
    ],
    group: ['role'],
    raw: true
  });

  return stats as any;
}
```

### Raw Queries (Use Sparingly)

```typescript
/**
 * Execute raw SQL query for complex operations
 */
async getLoginStatistics(): Promise<LoginStats[]> {
  const [results] = await this.model.sequelize!.query(`
    SELECT
      DATE_TRUNC('day', last_login) as date,
      COUNT(DISTINCT id) as unique_logins,
      role
    FROM users
    WHERE last_login IS NOT NULL
      AND last_login >= NOW() - INTERVAL '30 days'
    GROUP BY DATE_TRUNC('day', last_login), role
    ORDER BY date DESC
  `);

  return results as LoginStats[];
}
```

## Transaction Handling

### Automatic Transactions

BaseRepository automatically wraps create, update, and delete in transactions:

```typescript
// Transaction created automatically
const user = await userRepository.create(data, context);
// Transaction committed if successful, rolled back on error
```

### Manual Transaction Control

For multi-repository operations:

```typescript
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly sequelize: Sequelize
  ) {}

  async createUserWithProfile(
    userData: CreateUserDTO,
    profileData: CreateProfileDTO,
    context: ExecutionContext
  ): Promise<UserAttributes> {
    const transaction = await this.sequelize.transaction();

    try {
      // Create user
      const user = await this.userRepository.create(
        userData,
        context,
        transaction // Pass transaction to repository
      );

      // Create profile
      await this.profileRepository.create(
        { ...profileData, userId: user.id },
        context,
        transaction
      );

      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
```

## Cache Management

### Automatic Caching

BaseRepository automatically caches `findById` results:

```typescript
// First call - cache miss, queries database
const user1 = await userRepository.findById(userId);

// Second call - cache hit, returns cached result
const user2 = await userRepository.findById(userId);
```

### Cache Configuration

```typescript
/**
 * Disable caching for high-write entities
 */
protected shouldCache(): boolean {
  return false; // Disable caching for this repository
}

/**
 * Custom cache TTL per repository
 */
async findById(id: string): Promise<UserAttributes | null> {
  return super.findById(id, {
    cacheTTL: 300 // Cache for 5 minutes
  });
}
```

### Manual Cache Operations

```typescript
// Invalidate specific cache
await cacheManager.delete(`white-cross:user:${userId}`);

// Invalidate pattern
await cacheManager.deletePattern('white-cross:user:*');

// Get cached value
const cached = await cacheManager.get<UserAttributes>('white-cross:user:123');

// Set cache value
await cacheManager.set('white-cross:user:123', user, 300);
```

## Audit Logging

### Automatic Audit Logs

All mutating operations are automatically logged:

```typescript
// Create
await repository.create(data, context);
// Logs: CREATE action with sanitized entity data

// Update
await repository.update(id, changes, context);
// Logs: UPDATE action with before/after values for changed fields

// Delete
await repository.delete(id, context);
// Logs: DELETE action with sanitized entity data
```

### Custom Audit Logging

```typescript
/**
 * Log custom business operation
 */
async promoteToAdmin(userId: string, context: ExecutionContext): Promise<void> {
  const user = await this.findById(userId);

  if (!user) {
    throw new RepositoryError('User not found', 'NOT_FOUND', 404);
  }

  // Log promotion
  await this.auditLogger.logCustomAction(
    'PROMOTE_TO_ADMIN',
    'User',
    userId,
    context,
    { previousRole: user.role, newRole: UserRole.ADMIN }
  );

  await this.update(userId, { role: UserRole.ADMIN }, context);
}
```

## Error Handling

### Repository Errors

```typescript
throw new RepositoryError(
  'User-friendly error message',
  'ERROR_CODE',          // Machine-readable error code
  404,                   // HTTP status code
  { additional: 'data' } // Optional metadata
);
```

### Error Codes

Common error codes:
- `FIND_ERROR` - Query execution failed
- `CREATE_ERROR` - Creation failed
- `UPDATE_ERROR` - Update failed
- `DELETE_ERROR` - Deletion failed
- `VALIDATION_ERROR` - Validation failed
- `NOT_FOUND` - Entity not found
- `DUPLICATE_ERROR` - Unique constraint violation

### Global Error Handling

```typescript
@Catch(RepositoryError)
export class RepositoryErrorFilter implements ExceptionFilter {
  catch(exception: RepositoryError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(exception.statusCode).json({
      statusCode: exception.statusCode,
      errorCode: exception.code,
      message: exception.message,
      details: exception.details,
      timestamp: new Date().toISOString()
    });
  }
}
```

## Best Practices

### 1. Repository Responsibilities

**DO:**
- Data access and persistence
- Basic validation (uniqueness, constraints)
- Query construction and execution
- Transaction management
- Cache management
- Audit logging

**DON'T:**
- Business logic (belongs in services)
- API response formatting (belongs in controllers)
- Authentication/authorization (belongs in guards)
- Complex calculations (belongs in services)

### 2. Validation Strategy

```typescript
// Validation in Repository
protected async validateCreate(data: CreateUserDTO): Promise<void> {
  // Database-level validation only
  const emailExists = await this.exists({ email: data.email });
  if (emailExists) {
    throw new RepositoryError('Email already in use', 'VALIDATION_ERROR', 400);
  }
}

// Business logic in Service
async createUser(dto: CreateUserDTO, context: ExecutionContext) {
  // Business validation
  if (!this.isValidRole(dto.role)) {
    throw new BusinessRuleException('Invalid role for this operation');
  }

  if (dto.role === UserRole.NURSE && !dto.schoolId) {
    throw new BusinessRuleException('Nurses must be assigned to a school');
  }

  // Delegate to repository
  return await this.userRepository.create(dto, context);
}
```

### 3. Testing Repositories

```typescript
describe('UserRepository', () => {
  let repository: UserRepository;
  let model: typeof User;
  let auditLogger: IAuditLogger;
  let cacheManager: ICacheManager;

  beforeEach(() => {
    model = mockModel<User>();
    auditLogger = mockAuditLogger();
    cacheManager = mockCacheManager();
    repository = new UserRepository(model, auditLogger, cacheManager);
  });

  it('should find user by email', async () => {
    const mockUser = createMockUser({ email: 'test@example.com' });
    model.findOne = jest.fn().mockResolvedValue(mockUser);

    const result = await repository.findByEmail('test@example.com');

    expect(result).toEqual(mockUser.get({ plain: true }));
    expect(model.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' }
    });
  });

  it('should throw error when email exists', async () => {
    repository.exists = jest.fn().mockResolvedValue(true);

    await expect(
      repository.create(
        { email: 'existing@example.com', /* ... */ },
        mockContext()
      )
    ).rejects.toThrow('Email already in use');
  });
});
```

### 4. Performance Optimization

```typescript
// Use select to limit returned fields
const users = await repository.findMany(
  { where: { isActive: true } },
  { select: { id: true, email: true, fullName: true } }
);

// Use pagination for large result sets
const result = await repository.findMany({
  where: { role: UserRole.NURSE },
  pagination: { page: 1, limit: 50 }
});

// Eager load associations when needed
const appointments = await appointmentRepository.findMany(
  { where: { status: 'SCHEDULED' } },
  { include: { nurse: true, student: true } }
);

// Use indexes for frequently queried fields
@Index
@Column(DataType.STRING)
email: string;
```

## Examples

### Complete Repository Example

See [base.repository.ts](./base/base.repository.ts) for the full base implementation.

### User Repository

See [impl/user.repository.ts](./impl/user.repository.ts) for a complete example with:
- Custom validation
- Email uniqueness checks
- Role-based queries
- Cache invalidation
- Audit sanitization

### Appointment Repository

See [impl/appointment.repository.ts](./impl/appointment.repository.ts) for:
- Association handling
- Complex queries
- Custom business methods

## Migration from TypeORM

Key differences when migrating from TypeORM repositories:

| TypeORM | Sequelize |
|---------|-----------|
| `findOne({ where })` | `findOne({ where })` (same) |
| `find({ where })` | `findAll({ where })` |
| `save(entity)` | `entity.save()` or `update()` |
| `remove(entity)` | `entity.destroy()` or `delete()` |
| `createQueryBuilder()` | `this.model.findAll()` or raw SQL |
| `@OneToMany()` | `@HasMany()` |
| `@ManyToOne()` | `@BelongsTo()` |

See the main [database README](../README.md) for comprehensive migration guide.

## Additional Resources

- [BaseRepository Source](./base/base.repository.ts)
- [Repository Interface](./interfaces/repository.interface.ts)
- [Sequelize Querying](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/)
- [Transaction Guide](https://sequelize.org/docs/v6/other-topics/transactions/)

## Support

For questions or issues:
1. Check this README
2. Review existing repository implementations
3. Consult the database migration guide
4. Ask the development team
