# Witness Statement Context

Production-grade React Context for managing witness statements within incident reports. This context provides comprehensive CRUD operations, TanStack Query integration, optimistic updates, and type-safe state management.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [API Reference](#api-reference)
- [Advanced Usage](#advanced-usage)
- [TypeScript Support](#typescript-support)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Best Practices](#best-practices)

## Features

- **Full CRUD Operations**: Create, Read, Update, Delete witness statements
- **TanStack Query Integration**: Automatic caching, background refetching, and query invalidation
- **Optimistic Updates**: Instant UI feedback with automatic rollback on errors
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Error Handling**: Toast notifications and proper error states
- **Verification Tracking**: Mark statements as verified/unverified
- **Form State Management**: Built-in form state for create/edit operations
- **Loading States**: Granular loading states for each operation
- **Query Invalidation**: Automatic cache updates across related queries

## Installation

The context is already included in the project. To use it, simply import:

```typescript
import { WitnessStatementProvider, useWitnessStatements } from '@/contexts/WitnessStatementContext';
```

## Basic Usage

### 1. Wrap Your Component Tree

```tsx
import { WitnessStatementProvider } from '@/contexts/WitnessStatementContext';

function IncidentDetailPage({ incidentId }: { incidentId: string }) {
  return (
    <WitnessStatementProvider incidentId={incidentId}>
      <IncidentDetails />
      <WitnessStatementSection />
    </WitnessStatementProvider>
  );
}
```

### 2. Use the Hook in Components

```tsx
import { useWitnessStatements } from '@/contexts/WitnessStatementContext';

function WitnessStatementList() {
  const { statements, isLoading, error } = useWitnessStatements();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {statements.map(statement => (
        <WitnessStatementCard key={statement.id} statement={statement} />
      ))}
    </div>
  );
}
```

### 3. Create a New Statement

```tsx
function CreateStatementForm({ incidentId }: { incidentId: string }) {
  const { createWitnessStatement, operationLoading } = useWitnessStatements();

  const handleSubmit = async (data: WitnessStatementFormData) => {
    try {
      const newStatement = await createWitnessStatement({
        incidentReportId: incidentId,
        witnessName: data.witnessName,
        witnessType: data.witnessType,
        statement: data.statement,
      });
      console.log('Statement created:', newStatement);
    } catch (error) {
      console.error('Failed to create statement:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={operationLoading.create}>
        {operationLoading.create ? 'Creating...' : 'Create Statement'}
      </button>
    </form>
  );
}
```

## API Reference

### Context Provider

#### `WitnessStatementProvider`

**Props:**
- `children: React.ReactNode` - Child components
- `incidentId?: string` - Optional initial incident ID

**Example:**
```tsx
<WitnessStatementProvider incidentId="incident-123">
  {children}
</WitnessStatementProvider>
```

### Hook: `useWitnessStatements()`

Returns the context value with the following properties and methods:

#### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `statements` | `WitnessStatement[]` | Array of witness statements |
| `isLoading` | `boolean` | Loading state for query |
| `error` | `Error \| null` | Error state for query |
| `selectedStatement` | `WitnessStatement \| null` | Currently selected statement |
| `currentIncidentId` | `string \| null` | Current incident ID |
| `formState` | `Partial<WitnessStatementFormData> \| null` | Current form state |
| `operationLoading` | `object` | Loading states for operations |

#### Methods

##### `loadWitnessStatements(incidentId: string): void`

Load witness statements for a specific incident.

```tsx
const { loadWitnessStatements } = useWitnessStatements();
loadWitnessStatements('incident-123');
```

##### `createWitnessStatement(data: CreateWitnessStatementRequest): Promise<WitnessStatement>`

Create a new witness statement.

```tsx
const { createWitnessStatement } = useWitnessStatements();

const statement = await createWitnessStatement({
  incidentReportId: 'incident-123',
  witnessName: 'John Doe',
  witnessType: WitnessType.STAFF,
  witnessContact: 'john.doe@school.edu',
  statement: 'I witnessed the incident in the hallway.',
});
```

##### `updateWitnessStatement(id: string, data: UpdateWitnessStatementRequest): Promise<WitnessStatement>`

Update an existing witness statement.

```tsx
const { updateWitnessStatement } = useWitnessStatements();

await updateWitnessStatement('statement-123', {
  statement: 'Updated statement text',
});
```

##### `deleteWitnessStatement(id: string): Promise<void>`

Delete a witness statement.

```tsx
const { deleteWitnessStatement } = useWitnessStatements();

await deleteWitnessStatement('statement-123');
```

##### `verifyStatement(id: string): Promise<WitnessStatement>`

Mark a statement as verified.

```tsx
const { verifyStatement } = useWitnessStatements();

const verifiedStatement = await verifyStatement('statement-123');
```

##### `unverifyStatement(id: string): Promise<WitnessStatement>`

Mark a statement as unverified.

```tsx
const { unverifyStatement } = useWitnessStatements();

await unverifyStatement('statement-123');
```

##### `setSelectedStatement(statement: WitnessStatement | null): void`

Set the currently selected statement for editing.

```tsx
const { setSelectedStatement } = useWitnessStatements();

setSelectedStatement(statement);
```

##### `clearSelectedStatement(): void`

Clear the selected statement.

```tsx
const { clearSelectedStatement } = useWitnessStatements();

clearSelectedStatement();
```

##### `setFormState(data: Partial<WitnessStatementFormData> | null): void`

Set form state for create/edit operations.

```tsx
const { setFormState } = useWitnessStatements();

setFormState({
  witnessName: 'Jane Smith',
  witnessType: WitnessType.PARENT,
});
```

##### `clearFormState(): void`

Clear form state.

```tsx
const { clearFormState } = useWitnessStatements();

clearFormState();
```

##### `refetch(): void`

Manually refetch witness statements from the server.

```tsx
const { refetch } = useWitnessStatements();

refetch();
```

## Advanced Usage

### Optimistic Updates

The context automatically implements optimistic updates for all mutations. When you create, update, or delete a statement, the UI updates immediately while the request is in flight. If the request fails, the changes are automatically rolled back.

```tsx
function QuickDeleteButton({ statementId }: { statementId: string }) {
  const { deleteWitnessStatement, operationLoading } = useWitnessStatements();

  const handleDelete = async () => {
    // UI updates immediately (optimistic)
    // If this fails, changes are rolled back automatically
    await deleteWitnessStatement(statementId);
  };

  return (
    <button onClick={handleDelete} disabled={operationLoading.delete}>
      Delete
    </button>
  );
}
```

### Verification Workflow

Implement a complete verification workflow:

```tsx
function VerificationPanel() {
  const { statements, verifyStatement, unverifyStatement } = useWitnessStatements();

  const unverifiedStatements = statements.filter(s => !s.verified);
  const verifiedStatements = statements.filter(s => s.verified);

  return (
    <div>
      <h3>Pending Verification ({unverifiedStatements.length})</h3>
      {unverifiedStatements.map(statement => (
        <div key={statement.id}>
          <p>{statement.witnessName}: {statement.statement}</p>
          <button onClick={() => verifyStatement(statement.id)}>
            Verify
          </button>
        </div>
      ))}

      <h3>Verified ({verifiedStatements.length})</h3>
      {verifiedStatements.map(statement => (
        <div key={statement.id}>
          <p>{statement.witnessName}: {statement.statement}</p>
          <button onClick={() => unverifyStatement(statement.id)}>
            Unverify
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Edit Modal Pattern

Implement an edit modal using selected statement:

```tsx
function EditStatementModal() {
  const {
    selectedStatement,
    updateWitnessStatement,
    clearSelectedStatement,
    operationLoading
  } = useWitnessStatements();

  if (!selectedStatement) return null;

  const handleSubmit = async (data: WitnessStatementFormData) => {
    await updateWitnessStatement(selectedStatement.id, data);
    // Modal automatically closes via clearSelectedStatement in context
  };

  return (
    <Modal isOpen={!!selectedStatement} onClose={clearSelectedStatement}>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <button type="submit" disabled={operationLoading.update}>
          Save
        </button>
      </form>
    </Modal>
  );
}
```

### Loading States

Use granular loading states for better UX:

```tsx
function StatementActions({ statementId }: { statementId: string }) {
  const {
    verifyStatement,
    deleteWitnessStatement,
    operationLoading
  } = useWitnessStatements();

  return (
    <div>
      <button
        onClick={() => verifyStatement(statementId)}
        disabled={operationLoading.verify}
      >
        {operationLoading.verify ? 'Verifying...' : 'Verify'}
      </button>
      <button
        onClick={() => deleteWitnessStatement(statementId)}
        disabled={operationLoading.delete}
      >
        {operationLoading.delete ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
```

## TypeScript Support

The context is fully typed with TypeScript. All types are exported for use in your components:

```typescript
import type {
  WitnessStatement,
  WitnessStatementFormData,
  CreateWitnessStatementRequest,
  UpdateWitnessStatementRequest,
  WitnessType,
} from '@/types/incidents';

import type {
  WitnessStatementContextValue,
  WitnessStatementState,
} from '@/contexts/WitnessStatementContext';
```

### Type Definitions

```typescript
interface WitnessStatement {
  id: string;
  incidentReportId: string;
  witnessName: string;
  witnessType: WitnessType;
  witnessContact?: string;
  statement: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

enum WitnessType {
  STUDENT = 'STUDENT',
  STAFF = 'STAFF',
  PARENT = 'PARENT',
  OTHER = 'OTHER',
}
```

## Error Handling

The context handles errors automatically with toast notifications:

```tsx
function CreateStatement() {
  const { createWitnessStatement } = useWitnessStatements();

  const handleSubmit = async (data: WitnessStatementFormData) => {
    try {
      await createWitnessStatement(data);
      // Success toast shown automatically
    } catch (error) {
      // Error toast shown automatically
      // Handle additional error logic if needed
      console.error('Creation failed:', error);
    }
  };
}
```

### Custom Error Handling

You can add custom error handling on top of automatic toasts:

```tsx
function CreateStatementWithCustomError() {
  const { createWitnessStatement } = useWitnessStatements();
  const [customError, setCustomError] = useState<string | null>(null);

  const handleSubmit = async (data: WitnessStatementFormData) => {
    setCustomError(null);
    try {
      await createWitnessStatement(data);
    } catch (error: any) {
      // Custom error handling
      if (error.status === 403) {
        setCustomError('You do not have permission to add statements');
      }
    }
  };

  return (
    <div>
      {customError && <Alert type="error">{customError}</Alert>}
      {/* Form */}
    </div>
  );
}
```

## Testing

The context includes comprehensive tests. Run tests with:

```bash
npm run test:frontend
```

### Testing Your Components

Mock the context in your component tests:

```typescript
import { vi } from 'vitest';
import { useWitnessStatements } from '@/contexts/WitnessStatementContext';

vi.mock('@/contexts/WitnessStatementContext', () => ({
  useWitnessStatements: vi.fn(),
}));

describe('MyComponent', () => {
  it('should display statements', () => {
    vi.mocked(useWitnessStatements).mockReturnValue({
      statements: [mockStatement],
      isLoading: false,
      error: null,
      // ... other properties
    });

    // Test your component
  });
});
```

## Best Practices

### 1. Provider Placement

Place the provider at the incident detail page level, not at the app root:

```tsx
// Good
function IncidentDetailPage({ incidentId }) {
  return (
    <WitnessStatementProvider incidentId={incidentId}>
      <IncidentContent />
    </WitnessStatementProvider>
  );
}

// Avoid
function App() {
  return (
    <WitnessStatementProvider>
      <Routes />
    </WitnessStatementProvider>
  );
}
```

### 2. Load Data on Mount

Load statements when the incident ID is available:

```tsx
function WitnessSection({ incidentId }) {
  const { loadWitnessStatements } = useWitnessStatements();

  useEffect(() => {
    if (incidentId) {
      loadWitnessStatements(incidentId);
    }
  }, [incidentId, loadWitnessStatements]);

  // Rest of component
}
```

### 3. Handle Loading States

Always handle loading states for better UX:

```tsx
function StatementList() {
  const { statements, isLoading, error } = useWitnessStatements();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;
  if (statements.length === 0) return <EmptyState />;

  return <div>{/* Render statements */}</div>;
}
```

### 4. Use Optimistic Updates

Trust the optimistic updates - they make the UI feel instant:

```tsx
// The UI updates immediately, no need to wait
const handleDelete = async (id: string) => {
  await deleteWitnessStatement(id);
  // Statement is already removed from UI
};
```

### 5. Clear State Appropriately

Clear selected statement and form state after operations:

```tsx
const handleUpdate = async (data) => {
  await updateWitnessStatement(selectedStatement.id, data);
  // Context automatically clears selected statement on success
};
```

### 6. Use TypeScript

Always use TypeScript types for better development experience:

```tsx
import type { WitnessStatementFormData } from '@/types/incidents';

const handleSubmit = (data: WitnessStatementFormData) => {
  // TypeScript ensures data has correct shape
};
```

### 7. Error Boundaries

Wrap the provider in an error boundary:

```tsx
<ErrorBoundary>
  <WitnessStatementProvider incidentId={incidentId}>
    <Content />
  </WitnessStatementProvider>
</ErrorBoundary>
```

## Query Keys

The context uses the following query keys for TanStack Query:

- `['witness-statements', incidentId]` - Witness statements for an incident
- `['incident-reports', incidentId]` - Related incident report (invalidated on mutations)

## Cache Behavior

- **Stale Time**: 2 minutes - Statements are considered fresh for 2 minutes
- **GC Time**: 5 minutes - Cached data is kept for 5 minutes after becoming unused
- **Refetch on Window Focus**: Disabled - No automatic refetch on window focus
- **Retry**: 2 attempts - Failed requests are retried twice

## Performance Considerations

1. **Automatic Caching**: Statements are cached automatically, reducing API calls
2. **Optimistic Updates**: UI updates instantly without waiting for server
3. **Query Invalidation**: Only related queries are invalidated, not the entire cache
4. **Background Refetching**: Data is refetched in the background when stale

## Support

For issues or questions:
1. Check the example file: `WitnessStatementContext.example.tsx`
2. Review the test file: `WitnessStatementContext.test.tsx`
3. Consult the main documentation in `CLAUDE.md`

## License

This code is part of the White Cross healthcare platform and is proprietary.
