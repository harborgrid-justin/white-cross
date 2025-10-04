# API Services - Refactored Architecture

This directory contains the refactored API services for the White Cross application. The API has been broken down into smaller, more manageable modules with improved type safety, error handling, and maintainability.

## 📁 Directory Structure

```
frontend/src/services/
├── config/
│   └── apiConfig.ts          # Base API configuration and axios instance
├── modules/
│   ├── authApi.ts           # Authentication API
│   ├── studentsApi.ts       # Students management API
│   ├── healthRecordsApi.ts  # Health records API
│   └── medicationsApi.ts    # Medications API
├── types/
│   └── index.ts             # Shared TypeScript types and interfaces
├── utils/
│   └── apiUtils.ts          # Utility functions for API operations
├── index.ts                 # Main exports and backward compatibility
└── README.md               # This documentation
```

## 🚀 Key Features

### Modular Architecture
- **Separation of Concerns**: Each API module handles a specific domain
- **Type Safety**: Full TypeScript support with comprehensive interfaces
- **Error Handling**: Consistent error handling across all modules
- **Utilities**: Shared utilities for common operations

### Backward Compatibility
- **Legacy Support**: Existing code continues to work without changes
- **Gradual Migration**: Teams can migrate to new APIs incrementally
- **Compatible Exports**: Old import patterns still work

### Enhanced Features
- **Caching**: Built-in API response caching
- **Retry Logic**: Automatic retry for failed requests
- **Request Cancellation**: Support for aborting requests
- **Validation**: Request/response validation
- **Logging**: Comprehensive audit logging

## 📖 Usage Examples

### New Modular API (Recommended)

```typescript
import { authApi, studentsApi, healthRecordsApi } from '../services';

// Authentication
const { token, user } = await authApi.login({
  email: 'user@example.com',
  password: 'password123'
});

// Students with pagination and filters
const { students, pagination } = await studentsApi.getAll(
  { page: 1, limit: 20 },
  { grade: '9', isActive: true }
);

// Health records with type safety
const { records } = await healthRecordsApi.getStudentHealthRecords(
  'student-id',
  { type: 'VITAL_SIGNS', dateFrom: '2024-01-01' }
);
```

### Legacy API (Backward Compatible)

```typescript
import { legacyApi } from '../services';
// or
import { authApi_compat, studentsApi_compat } from '../services';

// Old patterns still work
const result = await legacyApi.authApi.login('email', 'password');
const students = await legacyApi.studentsApi.getAll(1, 10);
```

## 🔧 Configuration

### Environment Variables

```env
VITE_API_URL=http://localhost:3001
```

### API Configuration

```typescript
import { API_CONFIG, API_ENDPOINTS } from '../services';

// Access configuration
console.log(API_CONFIG.BASE_URL);
console.log(API_ENDPOINTS.AUTH);
```

## 🛠️ API Modules

### Authentication API (`authApi`)

**Methods:**
- `login(credentials)` - User login
- `register(userData)` - User registration  
- `verifyToken()` - Token verification
- `logout()` - User logout
- `changePassword(old, new)` - Password change
- `requestPasswordReset(email)` - Password reset request
- `resetPassword(token, password)` - Password reset

### Students API (`studentsApi`)

**Methods:**
- `getAll(pagination?, filters?)` - Get all students with pagination
- `getById(id)` - Get student by ID
- `create(studentData)` - Create new student
- `update(id, studentData)` - Update student
- `delete(id)` - Delete student
- `search(query, limit?)` - Search students
- `getByGrade(grade)` - Get students by grade
- `exportStudents(filters?)` - Export student data
- `importStudents(file)` - Import student data

### Health Records API (`healthRecordsApi`)

**Methods:**
- `getStudentHealthRecords(studentId, filters?)` - Get health records
- `createHealthRecord(data)` - Create health record
- `updateHealthRecord(id, data)` - Update health record
- `getStudentAllergies(studentId)` - Get student allergies
- `addAllergy(data)` - Add allergy
- `getStudentChronicConditions(studentId)` - Get chronic conditions
- `getVaccinationRecords(studentId)` - Get vaccination records
- `getHealthSummary(studentId)` - Get health summary
- `exportHealthHistory(studentId, format?)` - Export health history

### Medications API (`medicationsApi`)

**Methods:**
- `getAll(filters?)` - Get all medications
- `create(medicationData)` - Create medication
- `assignToStudent(data)` - Assign medication to student
- `logAdministration(data)` - Log medication administration
- `getSchedule(filters?)` - Get medication schedule
- `getInventory()` - Get medication inventory
- `reportAdverseReaction(data)` - Report adverse reaction
- `getComplianceReport(dateRange?)` - Get compliance report

## 🎯 Type Safety

All APIs include comprehensive TypeScript types:

```typescript
import type { 
  Student, 
  HealthRecord, 
  Medication,
  ApiResponse,
  PaginationParams 
} from '../services';

// Type-safe API calls
const student: Student = await studentsApi.getById('id');
const response: ApiResponse<Student[]> = await api.get('/students');
```

## 🚨 Error Handling

The refactored API includes robust error handling:

```typescript
import { ApiError } from '../services';

try {
  const student = await studentsApi.getById('invalid-id');
} catch (error) {
  if (error instanceof ApiError) {
    console.log('Status:', error.status);
    console.log('Code:', error.code);
    console.log('Details:', error.details);
  }
}
```

## 🔄 Migration Guide

### Step 1: Update Imports
```typescript
// Old
import { authApi, studentsApi } from '../services/api';

// New (gradual migration)
import { authApi, studentsApi } from '../services';
```

### Step 2: Update Method Calls
```typescript
// Old
const students = await studentsApi.getAll(1, 10);

// New
const { students, pagination } = await studentsApi.getAll({ page: 1, limit: 10 });
```

### Step 3: Add Type Annotations
```typescript
// Add types for better development experience
import type { Student, StudentsListResponse } from '../services';

const response: StudentsListResponse = await studentsApi.getAll();
```

## 🧪 Testing

Test individual modules in isolation:

```typescript
import { authApi } from '../services/modules/authApi';

// Test authentication
const result = await authApi.login({
  email: 'test@example.com',
  password: 'test123'
});
```

## 📋 Best Practices

1. **Use the new modular APIs** for new development
2. **Leverage TypeScript types** for better development experience
3. **Handle errors appropriately** using try-catch blocks
4. **Use pagination parameters** for list endpoints
5. **Implement caching** for frequently accessed data
6. **Log API access** for audit trails

## 🔮 Future Improvements

- **GraphQL Integration**: Add GraphQL support alongside REST
- **Offline Support**: Add offline caching and sync capabilities
- **Real-time Updates**: WebSocket integration for live data
- **Advanced Caching**: Implement more sophisticated caching strategies
- **Metrics**: Add performance monitoring and analytics

## 🤝 Contributing

When adding new API modules:

1. Create a new file in `modules/` directory
2. Follow the established patterns and interfaces
3. Add comprehensive TypeScript types
4. Include error handling
5. Add backward compatibility if needed
6. Update the main `index.ts` file
7. Document the new API in this README

## 📞 Support

For questions or issues with the API services:

1. Check the TypeScript types for method signatures
2. Review error messages for debugging information
3. Use the browser dev tools to inspect network requests
4. Refer to the backend API documentation for endpoint details
