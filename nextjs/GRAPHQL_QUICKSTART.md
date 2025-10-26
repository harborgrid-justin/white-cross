# GraphQL Quick Start Guide

## Prerequisites

1. Backend GraphQL server running on `http://localhost:3001/graphql`
2. Node.js >= 20.0.0
3. npm >= 8.0.0

## Setup (One-time)

### 1. Install Dependencies (Already Done)

Dependencies are already installed. If needed:

```bash
npm install
```

### 2. Add Apollo Provider to App Layout

Edit `src/app/layout.tsx`:

```tsx
import { ApolloProvider } from '@/graphql/client/ApolloProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider>
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
}
```

### 3. Configure Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Generate TypeScript Types (Optional but Recommended)

Ensure backend is running, then:

```bash
npm run graphql:codegen
```

This generates TypeScript types in `src/graphql/types/generated.ts`.

## Usage Examples

### Example 1: Display Student List

```tsx
'use client';

import { useStudents } from '@/graphql/hooks';

export default function StudentsPage() {
  const { students, loading, error, pagination } = useStudents(
    { isActive: true },
    { page: 1, limit: 20 }
  );

  if (loading) return <div>Loading students...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Students ({pagination.total})</h1>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.fullName} - Grade {student.grade}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Example 2: Create Student Form

```tsx
'use client';

import { useCreateStudent } from '@/graphql/hooks';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CreateStudentForm() {
  const { createStudent, loading } = useCreateStudent();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    grade: '',
    dateOfBirth: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await createStudent({
      ...formData,
      studentNumber: `STU-${Date.now()}`,
      gender: 'PREFER_NOT_TO_SAY',
      isActive: true,
      enrollmentDate: new Date().toISOString(),
    });

    if (error) {
      toast.error(`Failed to create student: ${error.message}`);
      return;
    }

    toast.success(`Student ${data.fullName} created successfully!`);
    setFormData({ firstName: '', lastName: '', grade: '', dateOfBirth: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        required
      />
      <input
        placeholder="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        required
      />
      <input
        placeholder="Grade"
        value={formData.grade}
        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
        required
      />
      <input
        type="date"
        value={formData.dateOfBirth}
        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Student'}
      </button>
    </form>
  );
}
```

### Example 3: Real-Time Notifications

```tsx
'use client';

import { useNotifications } from '@/graphql/hooks';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function NotificationProvider({ children }) {
  const { user } = useAuth();

  useNotifications(
    user?.id,
    (notification) => {
      // Show toast notification
      toast(notification.title, {
        description: notification.message,
        action: notification.actionUrl ? {
          label: 'View',
          onClick: () => window.location.href = notification.actionUrl,
        } : undefined,
      });
    }
  );

  return <>{children}</>;
}
```

### Example 4: Medication Due List

```tsx
'use client';

import { useDueMedications } from '@/graphql/hooks';

export default function DueMedicationsWidget() {
  const { dueMedications, loading, error, refetch } = useDueMedications(new Date());

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading medications</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">
        Medications Due Today ({dueMedications.length})
      </h2>
      <ul className="space-y-2">
        {dueMedications.map((med) => (
          <li key={med.id} className="border-b pb-2">
            <div className="font-medium">{med.student.fullName}</div>
            <div className="text-sm text-gray-600">
              {med.medication.medicationName} - {med.medication.dosage}
            </div>
            <div className="text-xs text-gray-500">
              Scheduled: {med.scheduledTime}
            </div>
          </li>
        ))}
      </ul>
      <button onClick={() => refetch()} className="mt-4 btn-primary">
        Refresh
      </button>
    </div>
  );
}
```

### Example 5: Search Students

```tsx
'use client';

import { useSearchStudents } from '@/graphql/hooks';
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export function StudentSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { searchStudents, results, loading } = useSearchStudents();

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      searchStudents(debouncedQuery, 10);
    }
  }, [debouncedQuery, searchStudents]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search students..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border rounded"
      />
      {loading && <div className="absolute top-full">Loading...</div>}
      {results.length > 0 && (
        <div className="absolute top-full w-full bg-white shadow-lg rounded mt-1">
          {results.map((student) => (
            <div key={student.id} className="p-2 hover:bg-gray-100 cursor-pointer">
              {student.fullName} - Grade {student.grade}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Common Operations

### Fetch Single Student

```tsx
const { student, loading, error } = useStudent(studentId);
```

### Update Student

```tsx
const { updateStudent, loading } = useUpdateStudent();
const { data, error } = await updateStudent(studentId, { grade: '11' });
```

### Delete Student

```tsx
const { deleteStudent, loading } = useDeleteStudent();
const { success, error } = await deleteStudent(studentId);
```

### Get Student Contacts

```tsx
const { contacts, loading } = useContactsByRelation(studentId, 'guardian');
```

### Administer Medication

```tsx
const { administerMedication } = useAdministerMedication();
await administerMedication({
  medicationId,
  studentId,
  dosageGiven: '10mg',
  administeredBy: userId,
  notes: 'Patient took medication without issues',
});
```

## Error Handling

All hooks return error objects with user-friendly messages:

```tsx
const { students, error } = useStudents();

if (error) {
  console.log(error.message);  // User-friendly message
  console.log(error.code);     // Error code (e.g., 'UNAUTHENTICATED')
  console.log(error.field);    // Field that caused error (for validation)
}
```

## Cache Management

### Clear Cache on Logout

```tsx
import { resetApolloClient } from '@/graphql';

const handleLogout = async () => {
  await resetApolloClient();
  router.push('/auth/login');
};
```

### Refresh Specific Query

```tsx
import { invalidateQuery } from '@/graphql';

const refreshStudents = async () => {
  await invalidateQuery('GetStudents');
};
```

## Real-Time Features

### Medication Reminders

```tsx
const { reminder } = useMedicationReminders(nurseId, (reminder) => {
  toast.warning(`Medication due: ${reminder.medication.medicationName}`);
});
```

### Emergency Alerts

```tsx
const { alerts } = useEmergencyAlerts((alert) => {
  // Show urgent notification
  showEmergencyModal(alert);
});
```

## Development Tools

### Apollo DevTools

Install the Apollo Client DevTools browser extension:
- Chrome: https://chrome.google.com/webstore/detail/apollo-client-devtools/
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/apollo-developer-tools/

### GraphQL Playground

Access GraphQL Playground at:
```
http://localhost:3001/graphql
```

Or use Apollo Sandbox:
```
https://studio.apollographql.com/sandbox/explorer
```

Point it to: `http://localhost:3001/graphql`

## NPM Scripts

```bash
# Development
npm run dev                    # Start Next.js dev server
npm run graphql:codegen       # Generate TypeScript types
npm run graphql:watch         # Auto-generate types on changes

# Build
npm run build                 # Build for production

# Testing
npm test                      # Run tests
npm run test:e2e             # Run E2E tests
```

## Troubleshooting

### Backend Not Running

**Error**: `Failed to fetch` or network errors

**Solution**: Ensure backend is running on `http://localhost:3001`

```bash
cd backend
npm run dev
```

### Authentication Errors

**Error**: `UNAUTHENTICATED` errors

**Solution**: Ensure you're logged in and JWT token exists in localStorage

```tsx
// Check token
const token = localStorage.getItem('auth_token');
console.log('Token:', token);
```

### Subscription Not Working

**Error**: WebSocket connection failed

**Solution**:
1. Check backend WebSocket support
2. Verify token is sent with subscription
3. Check firewall/proxy settings

### Cache Issues

**Solution**: Clear Apollo cache

```tsx
import { resetApolloClient } from '@/graphql';
await resetApolloClient();
```

## Next Steps

1. Read full documentation: `src/graphql/README.md`
2. Review implementation summary: `GRAPHQL_IMPLEMENTATION_SUMMARY.md`
3. Explore backend schema at: `http://localhost:3001/graphql`
4. Check example queries: `backend/src/api/graphql/example-queries.graphql`
5. Write your first custom hook
6. Set up tests

## Resources

- **Documentation**: `src/graphql/README.md`
- **Apollo Client**: https://www.apollographql.com/docs/react/
- **GraphQL**: https://graphql.org/learn/
- **Backend Schema**: http://localhost:3001/graphql

## Support

For issues or questions:
1. Check README.md
2. Review backend GraphQL schema
3. Use Apollo DevTools for debugging
4. Check browser console for errors
