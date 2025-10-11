# Witness Statement Context - Quick Reference

> Fast reference guide for developers using the WitnessStatementContext

## Setup (2 steps)

```tsx
// 1. Wrap your page
import { WitnessStatementProvider } from '@/contexts/WitnessStatementContext';

<WitnessStatementProvider incidentId={incidentId}>
  <YourComponents />
</WitnessStatementProvider>

// 2. Use the hook
import { useWitnessStatements } from '@/contexts/WitnessStatementContext';

const { statements, createWitnessStatement } = useWitnessStatements();
```

## Common Operations

### Display List
```tsx
const { statements, isLoading, error } = useWitnessStatements();

{isLoading ? <Spinner /> : statements.map(s => <Card key={s.id} {...s} />)}
```

### Create Statement
```tsx
const { createWitnessStatement, operationLoading } = useWitnessStatements();

await createWitnessStatement({
  incidentReportId: 'incident-123',
  witnessName: 'John Doe',
  witnessType: WitnessType.STAFF,
  statement: 'I witnessed...',
});
```

### Update Statement
```tsx
const { updateWitnessStatement } = useWitnessStatements();

await updateWitnessStatement('statement-id', {
  statement: 'Updated text...',
});
```

### Delete Statement
```tsx
const { deleteWitnessStatement } = useWitnessStatements();

await deleteWitnessStatement('statement-id');
```

### Verify Statement
```tsx
const { verifyStatement } = useWitnessStatements();

await verifyStatement('statement-id');
```

### Edit Modal Pattern
```tsx
const { selectedStatement, setSelectedStatement, clearSelectedStatement } = useWitnessStatements();

// Open modal
setSelectedStatement(statement);

// In modal
if (!selectedStatement) return null;

// Close modal
clearSelectedStatement();
```

## Available Properties

| Property | Type | Description |
|----------|------|-------------|
| `statements` | `WitnessStatement[]` | All statements |
| `isLoading` | `boolean` | Loading state |
| `error` | `Error \| null` | Error state |
| `selectedStatement` | `WitnessStatement \| null` | Selected for editing |
| `currentIncidentId` | `string \| null` | Current incident |
| `operationLoading` | `object` | Loading states |

## Available Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `loadWitnessStatements(id)` | `void` | Load statements |
| `createWitnessStatement(data)` | `Promise<WitnessStatement>` | Create new |
| `updateWitnessStatement(id, data)` | `Promise<WitnessStatement>` | Update existing |
| `deleteWitnessStatement(id)` | `Promise<void>` | Delete statement |
| `verifyStatement(id)` | `Promise<WitnessStatement>` | Mark verified |
| `unverifyStatement(id)` | `Promise<WitnessStatement>` | Mark unverified |
| `setSelectedStatement(statement)` | `void` | Select for edit |
| `clearSelectedStatement()` | `void` | Clear selection |
| `refetch()` | `void` | Refresh data |

## Operation Loading States

```tsx
const { operationLoading } = useWitnessStatements();

operationLoading.create  // Creating
operationLoading.update  // Updating
operationLoading.delete  // Deleting
operationLoading.verify  // Verifying/Unverifying
```

## Types

```typescript
import {
  WitnessStatement,
  WitnessStatementFormData,
  CreateWitnessStatementRequest,
  UpdateWitnessStatementRequest,
  WitnessType,
} from '@/types/incidents';
```

## Witness Types

```typescript
WitnessType.STUDENT
WitnessType.STAFF
WitnessType.PARENT
WitnessType.OTHER
```

## Complete Example

```tsx
import { WitnessStatementProvider, useWitnessStatements } from '@/contexts/WitnessStatementContext';
import { WitnessType } from '@/types/incidents';

function IncidentPage({ incidentId }) {
  return (
    <WitnessStatementProvider incidentId={incidentId}>
      <WitnessSection />
    </WitnessStatementProvider>
  );
}

function WitnessSection() {
  const {
    statements,
    isLoading,
    createWitnessStatement,
    deleteWitnessStatement,
    verifyStatement,
  } = useWitnessStatements();

  const handleCreate = async () => {
    await createWitnessStatement({
      incidentReportId: 'incident-123',
      witnessName: 'Jane Doe',
      witnessType: WitnessType.STAFF,
      statement: 'I witnessed the incident...',
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={handleCreate}>Add Statement</button>
      {statements.map(statement => (
        <div key={statement.id}>
          <h3>{statement.witnessName}</h3>
          <p>{statement.statement}</p>
          <button onClick={() => verifyStatement(statement.id)}>Verify</button>
          <button onClick={() => deleteWitnessStatement(statement.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

```tsx
try {
  await createWitnessStatement(data);
  // Success toast shown automatically
} catch (error) {
  // Error toast shown automatically
  // Add custom handling if needed
  console.error(error);
}
```

## Common Patterns

### Filter Verified
```tsx
const verified = statements.filter(s => s.verified);
const unverified = statements.filter(s => !s.verified);
```

### Count Statements
```tsx
<h2>Statements ({statements.length})</h2>
```

### Empty State
```tsx
{statements.length === 0 && <EmptyState />}
```

### Loading Button
```tsx
<button disabled={operationLoading.create}>
  {operationLoading.create ? 'Adding...' : 'Add Statement'}
</button>
```

## Tips

1. Always wrap with provider at page level
2. Trust optimistic updates (UI updates instantly)
3. Don't manually update state (context handles it)
4. Use TypeScript for better DX
5. Handle loading and error states
6. Toast notifications are automatic

## Files

- **Context**: `frontend/src/contexts/WitnessStatementContext.tsx`
- **Types**: `frontend/src/types/incidents.ts`
- **Docs**: `frontend/src/contexts/WitnessStatementContext.README.md`
- **Examples**: `frontend/src/contexts/WitnessStatementContext.example.tsx`
- **Tests**: `frontend/src/contexts/WitnessStatementContext.test.tsx`

## Need Help?

1. Check full docs: `WitnessStatementContext.README.md`
2. See examples: `WitnessStatementContext.example.tsx`
3. Integration guide: `WitnessStatementContext.INTEGRATION.md`
