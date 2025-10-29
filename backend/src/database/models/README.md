# Sequelize Models Documentation

## Overview

This directory contains all Sequelize model definitions for the White Cross Health Management System. Models define the structure of database tables and provide type-safe data access with comprehensive validation, associations, and business logic.

## Table of Contents

- [Creating a New Model](#creating-a-new-model)
- [Model Structure](#model-structure)
- [Associations](#associations)
- [Validation Patterns](#validation-patterns)
- [Hooks and Lifecycle](#hooks-and-lifecycle)
- [Enum Definitions](#enum-definitions)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Creating a New Model

### Basic Model Template

```typescript
/**
 * [ModelName] Model - [Brief Description]
 *
 * [Detailed description of purpose, business logic, and usage]
 *
 * @module database/models/[model-name]
 */

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  BeforeCreate,
  BeforeUpdate
} from 'sequelize-typescript';

/**
 * [ModelName] Attributes Interface
 *
 * @interface [ModelName]Attributes
 */
export interface ModelNameAttributes {
  /** Field description */
  id: string;
  /** Field description */
  fieldName: string;
  // ... other fields with JSDoc
}

/**
 * [ModelName] Sequelize Model
 *
 * [Detailed model documentation]
 *
 * @extends Model<ModelNameAttributes>
 *
 * @example
 * ```typescript
 * const item = await ModelName.create({
 *   fieldName: 'value'
 * });
 * ```
 */
@Table({
  tableName: 'table_name',
  timestamps: true,
  underscored: true,
})
export class ModelName extends Model<ModelNameAttributes> {
  /**
   * Primary key UUID
   * @type {string}
   */
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  /**
   * Field description with constraints and validation details
   * @type {string}
   * @required
   */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fieldName: string;

  // Timestamps (automatically managed by Sequelize)
  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'created_at',
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'updated_at',
  })
  declare updatedAt?: Date;
}
```

### Step-by-Step Guide

1. **Create the file**: `[model-name].model.ts` in this directory
2. **Define attributes interface**: Type-safe interface for model attributes
3. **Add enum definitions**: If the model uses enumerations
4. **Define the model class**: Extend `Model<AttributesInterface>`
5. **Add decorators**: Use Sequelize decorators for columns and relationships
6. **Implement hooks**: Add lifecycle hooks if needed
7. **Add instance methods**: Custom business logic methods
8. **Write comprehensive JSDoc**: Document all public APIs

## Model Structure

### Required Components

#### 1. Attributes Interface

```typescript
export interface UserAttributes {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  // ... other fields
}
```

#### 2. Table Decorator

```typescript
@Table({
  tableName: 'users',        // Database table name (snake_case)
  timestamps: true,           // Enable createdAt/updatedAt
  underscored: true,          // Use snake_case for column names
  paranoid: false,            // Set to true for soft deletes
  indexes: [                  // Optional: define indexes
    {
      name: 'idx_user_email',
      fields: ['email']
    }
  ]
})
```

#### 3. Column Decorators

```typescript
@Column({
  type: DataType.STRING,      // Data type
  allowNull: false,           // NOT NULL constraint
  unique: true,               // UNIQUE constraint
  defaultValue: 'value',      // Default value
  validate: {                 // Validation rules
    isEmail: true,
    len: [3, 100],
    notEmpty: true
  },
  comment: 'Column description'  // Database comment
})
fieldName: string;
```

### Common Data Types

```typescript
DataType.STRING                // VARCHAR(255)
DataType.STRING(100)          // VARCHAR(100)
DataType.TEXT                 // TEXT
DataType.INTEGER              // INTEGER
DataType.FLOAT                // FLOAT
DataType.DECIMAL(10, 2)      // DECIMAL(10, 2)
DataType.BOOLEAN              // BOOLEAN
DataType.DATE                 // TIMESTAMP
DataType.DATEONLY             // DATE
DataType.UUID                 // UUID
DataType.UUIDV4              // UUID V4
DataType.JSON                 // JSON
DataType.JSONB               // JSONB (PostgreSQL)
DataType.ENUM('A', 'B')      // ENUM type
```

## Associations

### One-to-Many (HasMany / BelongsTo)

```typescript
// Parent Model (School)
@Table({ tableName: 'schools' })
export class School extends Model {
  @HasMany(() => Student)
  students: Student[];
}

// Child Model (Student)
@Table({ tableName: 'students' })
export class Student extends Model {
  @ForeignKey(() => School)
  @Column(DataType.UUID)
  schoolId: string;

  @BelongsTo(() => School)
  school: School;
}
```

### Many-to-Many (BelongsToMany)

```typescript
// Using junction table
@Table({ tableName: 'students' })
export class Student extends Model {
  @BelongsToMany(() => Course, () => StudentCourse)
  courses: Course[];
}

@Table({ tableName: 'courses' })
export class Course extends Model {
  @BelongsToMany(() => Student, () => StudentCourse)
  students: Student[];
}

// Junction table
@Table({ tableName: 'student_courses' })
export class StudentCourse extends Model {
  @ForeignKey(() => Student)
  @Column(DataType.UUID)
  studentId: string;

  @ForeignKey(() => Course)
  @Column(DataType.UUID)
  courseId: string;
}
```

### One-to-One (HasOne / BelongsTo)

```typescript
@Table({ tableName: 'users' })
export class User extends Model {
  @HasOne(() => Profile)
  profile: Profile;
}

@Table({ tableName: 'profiles' })
export class Profile extends Model {
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
```

## Validation Patterns

### Built-in Validators

```typescript
@Column({
  type: DataType.STRING,
  validate: {
    // String validators
    is: /^[a-z]+$/i,           // Regex pattern
    not: /^[a-z]+$/i,          // Not matching pattern
    isEmail: true,             // Email format
    isUrl: true,               // URL format
    isIP: true,                // IP address
    isAlpha: true,             // Alphabetic only
    isAlphanumeric: true,      // Alphanumeric only
    isNumeric: true,           // Numeric only
    isLowercase: true,         // Lowercase only
    isUppercase: true,         // Uppercase only

    // Length validators
    len: [2, 10],              // Length between 2-10
    notEmpty: true,            // Not empty string

    // Number validators
    min: 0,                    // Minimum value
    max: 100,                  // Maximum value

    // Array validators
    isIn: [['active', 'inactive']],  // Value in array
    notIn: [['banned']],       // Value not in array

    // Date validators
    isDate: true,              // Valid date
    isAfter: '2024-01-01',    // After date
    isBefore: '2025-01-01',   // Before date

    // Other validators
    isUUID: 4,                 // UUID v4
    isCreditCard: true,        // Credit card format
  }
})
```

### Custom Validators

```typescript
@Column({
  type: DataType.STRING,
  validate: {
    // Custom validator function
    isValidPhone(value: string) {
      if (!/^\+?[\d\s-()]+$/.test(value)) {
        throw new Error('Invalid phone number format');
      }
    },

    // Async validator
    async isUnique(value: string) {
      const existing = await User.findOne({ where: { email: value } });
      if (existing) {
        throw new Error('Email already exists');
      }
    }
  }
})
email: string;
```

## Hooks and Lifecycle

### Available Hooks

```typescript
// Before hooks
@BeforeValidate
@BeforeCreate
@BeforeUpdate
@BeforeDestroy
@BeforeSave         // Runs before create and update
@BeforeBulkCreate
@BeforeBulkUpdate
@BeforeBulkDestroy

// After hooks
@AfterValidate
@AfterCreate
@AfterUpdate
@AfterDestroy
@AfterSave          // Runs after create and update
@AfterBulkCreate
@AfterBulkUpdate
@AfterBulkDestroy
```

### Hook Examples

```typescript
/**
 * Hash password before creating user
 */
@BeforeCreate
static async hashPassword(user: User) {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
}

/**
 * Update timestamp before saving
 */
@BeforeUpdate
static updateTimestamp(instance: Model) {
  instance.set('updatedAt', new Date());
}

/**
 * Log creation to audit trail
 */
@AfterCreate
static async logCreation(instance: Model) {
  await AuditLog.create({
    action: 'CREATE',
    entityType: instance.constructor.name,
    entityId: instance.id
  });
}

/**
 * Validate complex business rules
 */
@BeforeValidate
static async validateBusinessRules(appointment: Appointment) {
  if (appointment.scheduledAt < new Date()) {
    throw new Error('Cannot schedule appointment in the past');
  }
}
```

## Enum Definitions

### TypeScript Enum Pattern

```typescript
/**
 * Appointment Status Enumeration
 *
 * @enum {string}
 * @property {string} SCHEDULED - Appointment is scheduled
 * @property {string} IN_PROGRESS - Appointment is currently happening
 * @property {string} COMPLETED - Appointment finished successfully
 * @property {string} CANCELLED - Appointment was cancelled
 * @property {string} NO_SHOW - Student did not show up
 */
export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

// Use in model
@Column({
  type: DataType.ENUM(...Object.values(AppointmentStatus)),
  allowNull: false,
  defaultValue: AppointmentStatus.SCHEDULED,
})
status: AppointmentStatus;
```

## Best Practices

### 1. Documentation

- Add comprehensive JSDoc to all models, enums, and methods
- Document validation rules and constraints
- Include usage examples in JSDoc
- Explain business logic in comments

### 2. Naming Conventions

- **Models**: PascalCase (e.g., `User`, `HealthRecord`)
- **Table names**: snake_case (e.g., `users`, `health_records`)
- **Column names**: snake_case (e.g., `first_name`, `created_at`)
- **Files**: kebab-case (e.g., `user.model.ts`, `health-record.model.ts`)

### 3. Type Safety

- Always define attributes interface
- Use TypeScript enums for enumerated types
- Declare optional fields with `?` in interface
- Use `declare` for Sequelize-managed fields

### 4. Validation

- Use database constraints (allowNull, unique) when possible
- Add Sequelize validators for complex rules
- Implement custom validators for business logic
- Validate at model level, not just application level

### 5. Indexes

- Add indexes for foreign keys
- Index fields used in WHERE clauses
- Create composite indexes for common query patterns
- Document why each index exists

### 6. Sensitive Data

- Never log sensitive data (passwords, tokens, PHI)
- Implement `toSafeObject()` methods for API responses
- Hash passwords and secrets before storing
- Use hooks to sanitize data automatically

### 7. Timestamps

- Always enable timestamps (`timestamps: true`)
- Use `underscored: true` for snake_case column names
- Explicitly map timestamps if needed:

```typescript
@Column({
  type: DataType.DATE,
  allowNull: false,
  field: 'created_at',
})
declare createdAt?: Date;
```

### 8. HIPAA Compliance

For models containing Protected Health Information (PHI):

- Add HIPAA compliance notes in JSDoc
- Implement audit logging for all access
- Encrypt sensitive fields if required
- Document data retention policies
- Use soft deletes for compliance

## Examples

### Complete Model Example

See [user.model.ts](./user.model.ts) for a comprehensive example including:
- Full JSDoc documentation
- Password hashing hooks
- Account lockout logic
- Two-factor authentication
- Safe object serialization
- Business logic methods

### Health Record Example

See [health-record.model.ts](./health-record.model.ts) for:
- HIPAA compliance patterns
- Association with Student model
- JSON metadata fields
- Audit logging

### Appointment Model Example

See [appointment.model.ts](./appointment.model.ts) for:
- Multiple associations (BelongsTo)
- Enum usage
- Validation rules
- Computed properties

## Migration from TypeORM

If you're migrating from TypeORM, see the main [database README](../README.md) for:
- Decorator mapping guide
- Query builder comparisons
- Common migration patterns
- Troubleshooting tips

## Testing Models

```typescript
import { User, UserRole } from './user.model';

describe('User Model', () => {
  it('should hash password before creation', async () => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'plaintext',
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.NURSE
    });

    expect(user.password).not.toBe('plaintext');
    expect(await user.comparePassword('plaintext')).toBe(true);
  });

  it('should validate email format', async () => {
    await expect(
      User.create({
        email: 'invalid-email',
        password: 'password',
        // ...
      })
    ).rejects.toThrow();
  });
});
```

## Additional Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [Sequelize-TypeScript](https://github.com/sequelize/sequelize-typescript)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Database README](../README.md) - Migration guide and patterns

## Support

For questions or issues:
1. Check this README
2. Review existing models for patterns
3. Consult the migration guide
4. Ask the development team
