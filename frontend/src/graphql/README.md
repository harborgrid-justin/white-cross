# GraphQL Integration for White Cross Next.js

Comprehensive GraphQL integration for the White Cross healthcare platform built with Apollo Client, Next.js 15, and TypeScript.

## Overview

This GraphQL implementation provides:
- **Type-safe** queries, mutations, and subscriptions
- **Real-time** updates via WebSocket subscriptions
- **Optimistic updates** for better UX
- **Error handling** with user-friendly messages
- **Cache management** with HIPAA compliance
- **Code generation** for TypeScript types

## Directory Structure

```
src/graphql/
├── client/               # Apollo Client configuration
│   ├── apolloClient.ts  # Client setup with auth, retry, error handling
│   └── ApolloProvider.tsx # Next.js App Router provider
├── fragments/           # Reusable GraphQL fragments
│   ├── student.fragments.ts
│   ├── medication.fragments.ts
│   ├── healthRecord.fragments.ts
│   ├── appointment.fragments.ts
│   ├── contact.fragments.ts
│   ├── user.fragments.ts
│   └── common.fragments.ts
├── queries/            # GraphQL queries
│   ├── student.queries.ts
│   ├── medication.queries.ts
│   ├── healthRecord.queries.ts
│   ├── appointment.queries.ts
│   ├── contact.queries.ts
│   └── user.queries.ts
├── mutations/          # GraphQL mutations
│   ├── student.mutations.ts
│   ├── medication.mutations.ts
│   ├── healthRecord.mutations.ts
│   ├── appointment.mutations.ts
│   ├── contact.mutations.ts
│   └── user.mutations.ts
├── subscriptions/      # GraphQL subscriptions
│   ├── notification.subscriptions.ts
│   ├── medication.subscriptions.ts
│   └── appointment.subscriptions.ts
├── hooks/              # Custom React hooks
│   ├── useStudents.ts
│   ├── useMedications.ts
│   ├── useContacts.ts
│   └── useNotifications.ts
├── utils/              # Utility functions
│   ├── cacheManager.ts
│   ├── errorHandler.ts
│   └── queryBuilder.ts
└── types/              # TypeScript types
    └── index.ts
```

## Getting Started

### 1. Setup Apollo Provider

Add the Apollo Provider to your root layout:

```tsx
// app/layout.tsx
import { ApolloProvider } from '@/graphql/client/ApolloProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ApolloProvider>
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
}
```

### 2. Using GraphQL Hooks

#### Fetch Students

```tsx
import { useStudents } from '@/graphql/hooks';

function StudentList() {
  const { students, loading, error, pagination, loadMore } = useStudents(
    { isActive: true }, // filters
    { page: 1, limit: 20 } // pagination
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {students.map(student => (
        <div key={student.id}>{student.fullName}</div>
      ))}
      {pagination.hasNextPage && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
}
```

#### Create Student

```tsx
import { useCreateStudent } from '@/graphql/hooks';

function CreateStudentForm() {
  const { createStudent, loading, error } = useCreateStudent();

  const handleSubmit = async (data) => {
    const { data: student, error } = await createStudent(data);

    if (error) {
      console.error('Failed to create student:', error.message);
      return;
    }

    console.log('Student created:', student);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

#### Subscribe to Notifications

```tsx
import { useNotifications } from '@/graphql/hooks';
import { toast } from 'sonner';

function NotificationProvider({ userId, children }) {
  const { notifications, latestNotification } = useNotifications(
    userId,
    (notification) => {
      toast.info(notification.title, {
        description: notification.message,
      });
    }
  );

  return <>{children}</>;
}
```

### 3. Direct Apollo Client Usage

For more control, use Apollo Client directly:

```tsx
import { useQuery, useMutation } from '@apollo/client';
import { GET_STUDENT, UPDATE_STUDENT } from '@/graphql/queries';

function StudentProfile({ studentId }) {
  // Query
  const { data, loading, error } = useQuery(GET_STUDENT, {
    variables: { id: studentId },
  });

  // Mutation
  const [updateStudent] = useMutation(UPDATE_STUDENT, {
    onCompleted: (data) => {
      console.log('Updated:', data.updateStudent);
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });

  const handleUpdate = async (updates) => {
    await updateStudent({
      variables: { id: studentId, input: updates },
    });
  };

  return (/* ... */);
}
```

### 4. Optimistic Updates

```tsx
import { useUpdateStudent } from '@/graphql/hooks';

function StudentEditor({ student }) {
  const { updateStudent } = useUpdateStudent();

  const handleSave = async (updates) => {
    const { data, error } = await updateStudent(student.id, updates);

    if (error) {
      // Optimistic update will be rolled back automatically
      toast.error('Update failed');
      return;
    }

    toast.success('Student updated');
  };

  return (/* ... */);
}
```

## GraphQL Code Generation

### Generate TypeScript Types

Ensure the backend is running, then generate types:

```bash
# One-time generation
npm run graphql:codegen

# Watch mode (auto-regenerate on changes)
npm run graphql:watch
```

Generated types will be in `src/graphql/types/generated.ts`.

### Using Generated Types

```tsx
import type { Student, GetStudentsQuery } from '@/graphql/types';

function StudentCard({ student }: { student: Student }) {
  return <div>{student.fullName}</div>;
}
```

## Cache Management

### Clear Cache on Logout

```tsx
import { resetApolloClient } from '@/graphql/client';

async function handleLogout() {
  await resetApolloClient();
  // Redirect to login
}
```

### Invalidate Specific Queries

```tsx
import { invalidateQuery } from '@/graphql/utils';

async function refreshStudents() {
  await invalidateQuery('GetStudents');
}
```

### Update Cache After Mutation

```tsx
import { updateCacheAfterCreate } from '@/graphql/utils';

const [createStudent] = useMutation(CREATE_STUDENT, {
  update: (cache, { data }) => {
    if (data?.createStudent) {
      updateCacheAfterCreate(
        cache,
        'students',
        data.createStudent,
        'Student'
      );
    }
  },
});
```

## Error Handling

### Centralized Error Handling

```tsx
import { handleGraphQLError, isAuthenticationError } from '@/graphql/utils';

function MyComponent() {
  const { error } = useQuery(GET_STUDENTS);

  if (error) {
    const errorResponse = handleGraphQLError(error);

    if (isAuthenticationError(error)) {
      // Redirect to login
      router.push('/auth/login');
      return;
    }

    return <div>Error: {errorResponse.message}</div>;
  }

  return (/* ... */);
}
```

### Field-Level Validation Errors

```tsx
import { getFieldErrors } from '@/graphql/utils';

function StudentForm() {
  const [createStudent, { error }] = useMutation(CREATE_STUDENT);

  const fieldErrors = error ? getFieldErrors(error) : {};

  return (
    <form>
      <input name="firstName" />
      {fieldErrors.firstName && <span>{fieldErrors.firstName}</span>}
    </form>
  );
}
```

## Real-Time Subscriptions

### Medication Reminders

```tsx
import { useMedicationReminders } from '@/graphql/hooks';

function MedicationAlerts({ nurseId }) {
  const { reminder } = useMedicationReminders(nurseId, (reminder) => {
    // Show notification
    showNotification({
      title: 'Medication Due',
      message: `${reminder.medication.medicationName} for ${reminder.student.fullName}`,
    });
  });

  return (/* ... */);
}
```

### Emergency Alerts

```tsx
import { useEmergencyAlerts } from '@/graphql/hooks';

function EmergencyMonitor() {
  const { alerts, latestAlert } = useEmergencyAlerts((alert) => {
    // Show emergency notification
    showEmergencyAlert(alert);
  });

  return (
    <div>
      {alerts.map(alert => (
        <EmergencyCard key={alert.id} alert={alert} />
      ))}
    </div>
  );
}
```

## Query Builder Utilities

### Build Complex Queries

```tsx
import { buildQueryVariables, buildFilterVariables } from '@/graphql/utils';

function FilteredStudentList() {
  const filters = {
    isActive: true,
    grade: '10',
    nurseId: currentUser.id,
  };

  const pagination = {
    page: 1,
    limit: 50,
    orderBy: 'lastName',
    orderDirection: 'ASC',
  };

  const variables = buildQueryVariables(filters, pagination);

  const { data } = useQuery(GET_STUDENTS, { variables });

  return (/* ... */);
}
```

## HIPAA Compliance

### No PHI in Persisted Cache

The Apollo Client is configured to NOT persist PHI data to localStorage:

```typescript
// apolloClient.ts
const cache = new InMemoryCache({
  // No persistence to storage
  // Cache is in-memory only for PHI compliance
});
```

### Clear Cache on Session End

Always clear cache when user logs out or session expires:

```tsx
import { resetApolloClient } from '@/graphql/client';

useEffect(() => {
  const handleSessionExpired = async () => {
    await resetApolloClient();
    router.push('/auth/login');
  };

  // Listen for session expiration
  window.addEventListener('session-expired', handleSessionExpired);

  return () => {
    window.removeEventListener('session-expired', handleSessionExpired);
  };
}, []);
```

## Best Practices

1. **Use Custom Hooks**: Prefer custom hooks (`useStudents`, `useMedications`) over raw Apollo hooks for consistent error handling

2. **Fragments**: Use fragments to avoid over-fetching and maintain consistency:
   ```tsx
   import { STUDENT_BASIC_FRAGMENT } from '@/graphql/fragments';
   ```

3. **Optimistic Updates**: Enable optimistic updates for better UX on mutations

4. **Error Handling**: Always handle errors and display user-friendly messages

5. **Cache Invalidation**: Properly invalidate cache after mutations

6. **Subscriptions**: Use subscriptions for real-time features (notifications, alerts, reminders)

7. **Type Safety**: Run `npm run graphql:codegen` after schema changes to regenerate types

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Testing

### Mock GraphQL Queries

```tsx
import { MockedProvider } from '@apollo/client/testing';
import { GET_STUDENTS } from '@/graphql/queries';

const mocks = [
  {
    request: {
      query: GET_STUDENTS,
      variables: { page: 1, limit: 20 },
    },
    result: {
      data: {
        students: {
          students: [/* mock data */],
          pagination: { page: 1, total: 100 },
        },
      },
    },
  },
];

function TestWrapper({ children }) {
  return (
    <MockedProvider mocks={mocks}>
      {children}
    </MockedProvider>
  );
}
```

## Troubleshooting

### Connection Issues

- Ensure backend GraphQL server is running on `http://localhost:3001/graphql`
- Check CORS configuration on backend
- Verify JWT token is present in localStorage/sessionStorage

### Subscription Not Working

- Ensure WebSocket connection is established
- Check backend WebSocket support
- Verify authentication token is sent with subscription

### Cache Not Updating

- Check if mutation has proper `refetchQueries` or `update` function
- Use Apollo DevTools to inspect cache state
- Consider using `invalidateQuery` utility

## Resources

- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [GraphQL Codegen](https://the-guild.dev/graphql/codegen)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
