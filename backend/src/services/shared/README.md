# Shared Services Directory

This directory contains common functionality extracted from service files to reduce code duplication and improve maintainability.

## Directory Structure

```
shared/
├── base/                   # Base classes and interfaces
│   ├── BaseService.ts      # Common service functionality
│   ├── BaseCrudService.ts  # CRUD operations base
│   └── interfaces.ts       # Common interfaces
├── validation/             # Shared validation utilities
│   ├── commonValidators.ts # Reusable validation functions
│   ├── dateValidators.ts   # Date-specific validations
│   └── healthValidators.ts # Health-specific validations
├── database/              # Database utilities
│   ├── queryHelpers.ts    # Common query builders
│   ├── pagination.ts      # Pagination utilities
│   └── associations.ts    # Model association helpers
├── types/                 # Shared TypeScript types
│   ├── common.ts          # Common interfaces and types
│   ├── pagination.ts      # Pagination-related types
│   └── filters.ts         # Filter interfaces
├── utils/                 # Utility functions
│   ├── dateUtils.ts       # Date manipulation utilities
│   ├── normalization.ts   # Data normalization functions
│   ├── errorHandling.ts   # Error handling utilities
│   └── logging.ts         # Logging helpers
└── constants/             # Shared constants
    ├── validation.ts      # Validation constants
    ├── database.ts        # Database constants
    └── business.ts        # Business rule constants
```

## Common Patterns Identified

1. **CRUD Operations**: All services implement similar create, read, update, delete patterns
2. **Pagination**: Consistent pagination with page, limit, offset calculations
3. **Filtering**: Similar WHERE clause building for database queries
4. **Validation**: Common validation patterns for dates, IDs, required fields
5. **Error Handling**: Consistent error logging and user-friendly error messages
6. **Database Queries**: Similar patterns for includes, associations, and ordering
7. **Normalization**: Text normalization (trim, uppercase) patterns
8. **Logging**: Consistent info/error logging patterns

## Usage

Import shared functionality in your services:

```typescript
import { BaseService } from '../shared/base/BaseService';
import { validateUUID, validateRequiredFields } from '../shared/validation/commonValidators';
import { buildPaginationQuery } from '../shared/database/pagination';
