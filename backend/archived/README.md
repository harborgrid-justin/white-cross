# Backend Type Definitions

This directory contains centralized TypeScript type definitions for the White Cross backend application.

## Structure

### Core Types
- **`common.ts`** - Common utility types used throughout the application (UUID, Email, etc.)
- **`database.ts`** - Database configuration and model types
- **`migrations.d.ts`** - Sequelize migration type definitions
- **`api.ts`** - API response and error types
- **`pagination.ts`** - Pagination types for offset and cursor-based pagination

### Advanced Types
- **`utility.ts`** - Advanced TypeScript utility types for type transformations
- **`guards.ts`** - Type guard functions for runtime type checking
- **`environment.ts`** - Environment variable type definitions
- **`config.ts`** - Application configuration types

### Usage

```typescript
// Import specific types
import { UUID, PaginatedResult, ApiResponse } from '@/types';

// Import from specific modules
import { DatabaseConfig } from '@/types/database';
import { Migration } from '@/types/migrations';
import { isEmail, isDefined } from '@/types/guards';
```

## Type Categories

### 1. Database Types
Type definitions for database operations, Sequelize models, and migrations.

### 2. API Types
Standardized API response formats, error structures, and pagination.

### 3. Utility Types
Advanced TypeScript type helpers for type transformations and constraints.

### 4. Type Guards
Runtime type checking functions with TypeScript type narrowing.

### 5. Configuration Types
Type-safe configuration objects for all application settings.

### 6. Environment Types
Type definitions for environment variables with validation helpers.

## Best Practices

1. **Import from Index**: Always import types from `@/types` for consistency
2. **Type-Only Imports**: Use `import type` when importing only types
3. **Avoid `any`**: Use `unknown` with type guards instead of `any`
4. **Document Types**: Add JSDoc comments for all exported types
5. **Type Narrowing**: Use type guards for runtime validation

## Adding New Types

1. Create types in the appropriate module file
2. Export from the module file
3. Re-export from `index.ts`
4. Document in this README
5. Add examples in JSDoc comments

## Migration Type Definitions

For JavaScript migration files, TypeScript definitions are automatically provided through `migrations.d.ts`. Use them as follows:

```javascript
/**
 * @type {import('../../types/migrations').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Migration code
  },
  async down(queryInterface, Sequelize) {
    // Rollback code
  }
};
```
