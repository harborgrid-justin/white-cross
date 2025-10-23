# Services Quick Start Guide

**Version**: 1.0.0
**Last Updated**: October 23, 2025

Welcome to the White Cross Healthcare Platform frontend services layer! This guide will help you quickly understand and use the service APIs effectively.

## Table of Contents
1. [Making API Calls](#making-api-calls)
2. [Using the Cache](#using-the-cache)
3. [Authentication & Tokens](#authentication--tokens)
4. [Error Handling](#error-handling)
5. [Common Patterns](#common-patterns)
6. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

---

## Making API Calls

### Basic GET Request

```typescript
import { apiClient } from '@/services/core/ApiClient';

interface User {
  id: string;
  name: string;
  email: string;
}

// Simple GET request
const response = await apiClient.get<User>('/api/users/123');
console.log(response.data.name);
```

### POST Request with Data

```typescript
interface CreateUserDto {
  name: string;
  email: string;
  role: string;
}

// Create a new user
const response = await apiClient.post<User>('/api/users', {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'teacher'
});

console.log('Created user:', response.data);
```

### PUT Request (Full Update)

```typescript
// Update entire user object
const response = await apiClient.put<User>('/api/users/123', {
  name: 'John Smith',
  email: 'john.smith@example.com',
  role: 'admin'
});
```

### PATCH Request (Partial Update)

```typescript
// Update only specific fields
const response = await apiClient.patch<User>('/api/users/123', {
  role: 'admin' // Only update role
});
```

### DELETE Request

```typescript
// Delete a user
await apiClient.delete('/api/users/123');
console.log('User deleted successfully');
```

### Paginated Requests

```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Get paginated list
const response = await apiClient.get<PaginatedResponse<User>>(
  '/api/users?page=1&limit=10&sort=createdAt&order=desc'
);

console.log('Users:', response.data.data);
console.log('Total pages:', response.data.pagination.totalPages);
```

---

## Using the Cache

### Basic Cache Operations

```typescript
import { getCacheManager } from '@/services/cache/CacheManager';

const cacheManager = getCacheManager();

// Store data in cache
cacheManager.set('user:123', userData, {
  ttl: 300000, // 5 minutes
  tags: ['users']
});

// Retrieve from cache
const cachedUser = cacheManager.get<User>('user:123');
if (cachedUser) {
  console.log('Cache hit:', cachedUser);
} else {
  console.log('Cache miss, fetch from API');
}

// Check if key exists
if (cacheManager.has('user:123')) {
  console.log('Data is cached');
}

// Remove single item
cacheManager.remove('user:123');

// Clear all cache
cacheManager.clearAll();
```

### Tag-Based Invalidation

```typescript
// Cache multiple items with tags
cacheManager.set('student:1', student1, { tags: ['students', 'grade-5'] });
cacheManager.set('student:2', student2, { tags: ['students', 'grade-6'] });
cacheManager.set('teacher:1', teacher1, { tags: ['teachers'] });

// Invalidate all students
cacheManager.clearByTags(['students']);

// Only grade 5 students still cached (if any)
```

### Fetch and Cache Pattern

```typescript
async function getUserData(userId: string): Promise<User> {
  const cacheKey = `user:${userId}`;

  // Try cache first
  const cached = cacheManager.get<User>(cacheKey);
  if (cached) {
    return cached;
  }

  // Cache miss - fetch from API
  const response = await apiClient.get<User>(`/api/users/${userId}`);
  const user = response.data;

  // Store in cache
  cacheManager.set(cacheKey, user, {
    ttl: 300000, // 5 minutes
    tags: ['users']
  });

  return user;
}
```

### Cache with PHI Data (HIPAA Compliance)

```typescript
// Flag data containing Protected Health Information
cacheManager.set('patient:123', patientData, {
  ttl: 300000,
  tags: ['patients', 'phi'],
  containsPHI: true // HIPAA compliance flag
});
```

---

## Authentication & Tokens

### Storing Tokens

```typescript
import { secureTokenManager } from '@/services/security/SecureTokenManager';

// Store authentication tokens
secureTokenManager.setToken(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // access token
  'refresh_token_here', // refresh token (optional)
  3600 // expires in 3600 seconds (optional)
);
```

### Retrieving Tokens

```typescript
// Get access token (returns null if expired)
const token = secureTokenManager.getToken();
if (token) {
  console.log('Valid token:', token);
} else {
  console.log('No valid token, redirect to login');
}

// Get refresh token
const refreshToken = secureTokenManager.getRefreshToken();
```

### Checking Token Validity

```typescript
// Check if token is valid
if (secureTokenManager.isTokenValid()) {
  console.log('Token is valid');
} else {
  console.log('Token expired or invalid');
}

// Get time until expiration
const timeRemaining = secureTokenManager.getTimeUntilExpiration();
console.log(`Token expires in ${timeRemaining}ms`);

// Check inactivity
const timeSinceActivity = secureTokenManager.getTimeSinceActivity();
console.log(`Last activity: ${timeSinceActivity}ms ago`);
```

### Updating Activity

```typescript
// Update last activity timestamp (called automatically on getToken())
secureTokenManager.updateActivity();
```

### Clearing Tokens (Logout)

```typescript
// Clear all tokens on logout
secureTokenManager.clearAllTokens();
```

---

## Error Handling

### Basic Error Handling

```typescript
import { ApiClientError } from '@/services/core/ApiClient';

try {
  const user = await apiClient.get<User>('/api/users/123');
  console.log(user);
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Code:', error.code);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Handling Different Error Types

```typescript
try {
  await apiClient.post('/api/users', userData);
} catch (error) {
  if (error instanceof ApiClientError) {
    if (error.isNetworkError) {
      // No connection to server
      showToast('Network error. Please check your internet connection.');
    } else if (error.isValidationError) {
      // 400 Bad Request with validation errors
      const validationErrors = error.details as Record<string, string[]>;
      displayValidationErrors(validationErrors);
    } else if (error.isServerError) {
      // 5xx Server Error
      showToast('Server error. Please try again later.');
      logToMonitoring(error.traceId);
    } else if (error.status === 404) {
      showToast('Resource not found');
    } else if (error.status === 403) {
      showToast('Permission denied');
    }
  }
}
```

### Validation Error Handling

```typescript
try {
  const student = await studentApi.create(studentData);
} catch (error) {
  if (error instanceof ApiClientError && error.isValidationError) {
    // error.details contains field-specific errors
    const errors = error.details as Record<string, string[]>;

    Object.entries(errors).forEach(([field, messages]) => {
      console.error(`${field}: ${messages.join(', ')}`);
    });
  }
}
```

---

## Common Patterns

### Using BaseApiService

```typescript
import { BaseApiService, BaseEntity } from '@/services/core/BaseApiService';
import { ApiClient } from '@/services/core/ApiClient';

// Define your entity
interface Student extends BaseEntity {
  name: string;
  grade: number;
  email: string;
}

// Define DTOs
interface CreateStudentDto {
  name: string;
  grade: number;
  email: string;
}

// Create service class
class StudentApi extends BaseApiService<Student, CreateStudentDto> {
  constructor(client: ApiClient) {
    super(client, '/api/students');
  }

  // Add custom methods
  async fetchStudentsByGrade(grade: number): Promise<Student[]> {
    return this.get<Student[]>(`${this.baseEndpoint}/by-grade/${grade}`);
  }
}

// Use the service
const studentApi = new StudentApi(apiClient);

// Standard CRUD operations
const students = await studentApi.getAll({ page: 1, limit: 10 });
const student = await studentApi.getById('student-123');
const created = await studentApi.create({
  name: 'John Doe',
  grade: 5,
  email: 'john@example.com'
});

// Bulk operations
const many = await studentApi.bulkCreate([
  { name: 'Alice', grade: 5, email: 'alice@example.com' },
  { name: 'Bob', grade: 6, email: 'bob@example.com' }
]);

// Custom method
const fifthGraders = await studentApi.fetchStudentsByGrade(5);
```

### Optimistic Updates with Cache

```typescript
async function updateStudent(id: string, data: UpdateStudentDto): Promise<Student> {
  const cacheKey = `student:${id}`;

  // Get current cached data
  const current = cacheManager.get<Student>(cacheKey);

  // Optimistically update cache
  if (current) {
    cacheManager.set(cacheKey, { ...current, ...data }, {
      ttl: 300000,
      tags: ['students']
    });
  }

  try {
    // Make API call
    const updated = await studentApi.update(id, data);

    // Update cache with server response
    cacheManager.set(cacheKey, updated, {
      ttl: 300000,
      tags: ['students']
    });

    return updated;
  } catch (error) {
    // Rollback cache on error
    if (current) {
      cacheManager.set(cacheKey, current, {
        ttl: 300000,
        tags: ['students']
      });
    }
    throw error;
  }
}
```

### Resilient API Calls with Circuit Breaker

```typescript
import { ResilientApiClient } from '@/services/core/ResilientApiClient';

// Create resilient client
const resilientClient = new ResilientApiClient(apiClient, {
  circuitBreaker: {
    failureThreshold: 5,
    resetTimeout: 60000
  },
  bulkhead: {
    maxConcurrent: 10,
    maxQueue: 50
  }
});

// Make resilient request
try {
  const student = await resilientClient.get<Student>(
    '/api/students/123',
    'VIEW_STUDENT_DATA' // Operation type for priority
  );
} catch (error) {
  if (error.reason === 'CIRCUIT_OPEN') {
    showToast('Service temporarily unavailable');
  } else if (error.reason === 'BULKHEAD_FULL') {
    showToast('Too many requests, please try again');
  }
}
```

### Search with Debouncing

```typescript
import { debounce } from 'lodash';

// Debounced search function
const debouncedSearch = debounce(async (query: string) => {
  if (!query.trim()) return;

  try {
    const results = await studentApi.search(query, {
      page: 1,
      limit: 10
    });

    displaySearchResults(results.data);
  } catch (error) {
    handleSearchError(error);
  }
}, 300); // 300ms debounce

// Use in input handler
function handleSearchInput(event: Event) {
  const query = (event.target as HTMLInputElement).value;
  debouncedSearch(query);
}
```

### Export Data

```typescript
// Export students as CSV
async function exportStudents() {
  try {
    const csvBlob = await studentApi.export('csv', {
      grade: 5,
      status: 'active'
    });

    // Create download link
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export failed:', error);
  }
}
```

---

## Anti-Patterns to Avoid

### Don't: Ignore Error Types

```typescript
// Bad - Generic error handling
try {
  await apiClient.get('/api/users/123');
} catch (error) {
  console.error('Error:', error); // Too generic
}

// Good - Specific error handling
try {
  await apiClient.get('/api/users/123');
} catch (error) {
  if (error instanceof ApiClientError) {
    if (error.isNetworkError) {
      // Handle network error
    } else if (error.status === 404) {
      // Handle not found
    }
  }
}
```

### Don't: Store Tokens in localStorage

```typescript
// Bad - Security risk
localStorage.setItem('token', token); // XSS vulnerability

// Good - Use SecureTokenManager (sessionStorage)
secureTokenManager.setToken(token, refreshToken);
```

### Don't: Cache Sensitive Data Indefinitely

```typescript
// Bad - PHI data cached too long
cacheManager.set('patient:123', patientData, {
  ttl: 86400000 // 24 hours - too long for PHI
});

// Good - Short TTL for sensitive data
cacheManager.set('patient:123', patientData, {
  ttl: 300000, // 5 minutes
  containsPHI: true
});
```

### Don't: Make Multiple Identical Requests

```typescript
// Bad - Multiple identical requests
const user1 = apiClient.get('/api/users/123');
const user2 = apiClient.get('/api/users/123');
const user3 = apiClient.get('/api/users/123');

// Good - Use cache or request deduplication
const getCachedUser = async (id: string) => {
  const cached = cacheManager.get(`user:${id}`);
  if (cached) return cached;

  const response = await apiClient.get(`/api/users/${id}`);
  cacheManager.set(`user:${id}`, response.data, { ttl: 300000 });
  return response.data;
};
```

### Don't: Forget to Clear Cache on Logout

```typescript
// Bad - Cache persists after logout
function logout() {
  secureTokenManager.clearAllTokens();
  // Forgot to clear cache!
}

// Good - Clear both tokens and cache
function logout() {
  secureTokenManager.clearAllTokens();
  cacheManager.clearAll();
  window.location.href = '/login';
}
```

### Don't: Use Sync-Sounding Names for Async Operations

```typescript
// Bad - Misleading name
async function getData() {
  return await apiClient.get('/api/data');
}

// Good - Clear async operation
async function fetchData() {
  return await apiClient.get('/api/data');
}
```

### Don't: Ignore Pagination

```typescript
// Bad - Fetching all data at once
const response = await studentApi.getAll({ limit: 999999 });

// Good - Use pagination
const response = await studentApi.getAll({
  page: 1,
  limit: 20 // Reasonable page size
});
```

---

## Next Steps

- Review [Naming Conventions](./NAMING_CONVENTIONS.md) for consistency
- Learn about [resilience patterns](../resilience/README.md)
- Understand [caching strategies](../cache/README.md)
- Explore [authentication flows](../security/README.md)

## Need Help?

- Check the inline JSDoc in each service file
- Review test files for usage examples
- Contact the architecture team for questions

---

**Last Updated**: October 23, 2025
