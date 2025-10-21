# Witness Statement Context Integration Guide

This guide walks you through integrating the WitnessStatementContext into your incident report detail pages.

## Quick Start (5 Minutes)

### Step 1: Import the Provider and Hook

```tsx
// In your incident detail page
import { WitnessStatementProvider, useWitnessStatements } from '@/contexts/WitnessStatementContext';
```

### Step 2: Wrap Your Page Component

```tsx
// pages/IncidentDetailPage.tsx
import { useParams } from 'react-router-dom';
import { WitnessStatementProvider } from '@/contexts/WitnessStatementContext';

export default function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <WitnessStatementProvider incidentId={id}>
      <IncidentDetailContent />
    </WitnessStatementProvider>
  );
}
```

### Step 3: Use the Hook in Child Components

```tsx
// components/WitnessStatementSection.tsx
import { useWitnessStatements } from '@/contexts/WitnessStatementContext';

export default function WitnessStatementSection() {
  const { statements, isLoading, createWitnessStatement } = useWitnessStatements();

  return (
    <section>
      <h2>Witness Statements</h2>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {statements.map(statement => (
            <StatementCard key={statement.id} statement={statement} />
          ))}
        </div>
      )}
    </section>
  );
}
```

You're done! The context is now integrated and ready to use.

## Common Integration Patterns

### Pattern 1: Incident Detail Page with Tabs

```tsx
import { Tab } from '@headlessui/react';
import { WitnessStatementProvider } from '@/contexts/WitnessStatementContext';

export default function IncidentDetailPage({ incidentId }: { incidentId: string }) {
  return (
    <WitnessStatementProvider incidentId={incidentId}>
      <div className="container mx-auto p-6">
        <IncidentHeader incidentId={incidentId} />

        <Tab.Group>
          <Tab.List>
            <Tab>Details</Tab>
            <Tab>Witness Statements</Tab>
            <Tab>Follow-up Actions</Tab>
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              <IncidentDetailsPanel />
            </Tab.Panel>
            <Tab.Panel>
              <WitnessStatementsPanel />
            </Tab.Panel>
            <Tab.Panel>
              <FollowUpActionsPanel />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </WitnessStatementProvider>
  );
}
```

### Pattern 2: List Page with Quick Actions

```tsx
// pages/IncidentListPage.tsx
import { useState } from 'react';
import { WitnessStatementProvider } from '@/contexts/WitnessStatementContext';

export default function IncidentListPage() {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  return (
    <div>
      <IncidentList onSelectIncident={setSelectedIncidentId} />

      {selectedIncidentId && (
        <WitnessStatementProvider incidentId={selectedIncidentId}>
          <QuickWitnessStatementModal />
        </WitnessStatementProvider>
      )}
    </div>
  );
}
```

### Pattern 3: Nested Provider with Other Contexts

```tsx
export default function IncidentDetailPage({ incidentId }: { incidentId: string }) {
  return (
    <IncidentProvider incidentId={incidentId}>
      <WitnessStatementProvider incidentId={incidentId}>
        <FollowUpActionsProvider incidentId={incidentId}>
          <IncidentDetailContent />
        </FollowUpActionsProvider>
      </WitnessStatementProvider>
    </IncidentProvider>
  );
}
```

## Component Examples

### Complete Witness Statement Section

```tsx
// components/incident/WitnessStatementSection.tsx
import { useState } from 'react';
import { useWitnessStatements } from '@/contexts/WitnessStatementContext';
import { WitnessType } from '@/types/incidents';

export default function WitnessStatementSection() {
  const {
    statements,
    isLoading,
    error,
    createWitnessStatement,
    updateWitnessStatement,
    deleteWitnessStatement,
    verifyStatement,
    selectedStatement,
    setSelectedStatement,
    clearSelectedStatement,
    operationLoading,
    currentIncidentId,
  } = useWitnessStatements();

  const [showCreateForm, setShowCreateForm] = useState(false);

  // Loading state
  if (isLoading) {
    return (
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Witness Statements</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-3">Loading statements...</span>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Witness Statements</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          Witness Statements ({statements.length})
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Statement
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <CreateStatementForm
          incidentId={currentIncidentId!}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {/* Statements List */}
      {statements.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No witness statements recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {statements.map((statement) => (
            <StatementCard
              key={statement.id}
              statement={statement}
              onEdit={() => setSelectedStatement(statement)}
              onDelete={() => deleteWitnessStatement(statement.id)}
              onVerify={() => verifyStatement(statement.id)}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {selectedStatement && (
        <EditStatementModal
          statement={selectedStatement}
          onClose={clearSelectedStatement}
        />
      )}
    </section>
  );
}
```

### Statement Card Component

```tsx
// components/incident/StatementCard.tsx
import { WitnessStatement } from '@/types/incidents';

interface StatementCardProps {
  statement: WitnessStatement;
  onEdit: () => void;
  onDelete: () => void;
  onVerify: () => void;
}

export default function StatementCard({
  statement,
  onEdit,
  onDelete,
  onVerify,
}: StatementCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{statement.witnessName}</h3>
          <p className="text-sm text-gray-600">
            {statement.witnessType}
            {statement.witnessContact && ` • ${statement.witnessContact}`}
          </p>
        </div>
        {statement.verified ? (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Verified
          </span>
        ) : (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            Pending
          </span>
        )}
      </div>

      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{statement.statement}</p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          Added {new Date(statement.createdAt).toLocaleDateString()}
        </span>
        <div className="flex space-x-2">
          {!statement.verified && (
            <button
              onClick={onVerify}
              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Verify
            </button>
          )}
          <button
            onClick={onEdit}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Create Statement Form

```tsx
// components/incident/CreateStatementForm.tsx
import { useForm } from 'react-hook-form';
import { useWitnessStatements } from '@/contexts/WitnessStatementContext';
import { WitnessStatementFormData, WitnessType } from '@/types/incidents';

interface CreateStatementFormProps {
  incidentId: string;
  onClose: () => void;
}

export default function CreateStatementForm({
  incidentId,
  onClose,
}: CreateStatementFormProps) {
  const { createWitnessStatement, operationLoading } = useWitnessStatements();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WitnessStatementFormData>();

  const onSubmit = async (data: WitnessStatementFormData) => {
    try {
      await createWitnessStatement({
        incidentReportId: incidentId,
        ...data,
      });
      onClose();
    } catch (error) {
      // Error handled by context with toast
    }
  };

  return (
    <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold mb-4">Add Witness Statement</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Witness Name *</label>
          <input
            {...register('witnessName', { required: 'Name is required' })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter witness name"
          />
          {errors.witnessName && (
            <p className="text-red-600 text-sm mt-1">{errors.witnessName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Witness Type *</label>
          <select
            {...register('witnessType', { required: 'Type is required' })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select type</option>
            <option value={WitnessType.STUDENT}>Student</option>
            <option value={WitnessType.STAFF}>Staff</option>
            <option value={WitnessType.PARENT}>Parent</option>
            <option value={WitnessType.OTHER}>Other</option>
          </select>
          {errors.witnessType && (
            <p className="text-red-600 text-sm mt-1">{errors.witnessType.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact (Optional)</label>
          <input
            {...register('witnessContact')}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Email or phone"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Statement *</label>
          <textarea
            {...register('statement', { required: 'Statement is required' })}
            rows={5}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter witness statement..."
          />
          {errors.statement && (
            <p className="text-red-600 text-sm mt-1">{errors.statement.message}</p>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={operationLoading.create}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {operationLoading.create ? 'Adding...' : 'Add Statement'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
```

## Routing Integration

### React Router v6

```tsx
// routes/incidentRoutes.tsx
import { Route } from 'react-router-dom';
import IncidentDetailPage from '@/pages/IncidentDetailPage';

export const incidentRoutes = (
  <>
    <Route path="/incidents/:id" element={<IncidentDetailPage />} />
  </>
);

// pages/IncidentDetailPage.tsx
import { useParams } from 'react-router-dom';
import { WitnessStatementProvider } from '@/contexts/WitnessStatementContext';

export default function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Invalid incident ID</div>;
  }

  return (
    <WitnessStatementProvider incidentId={id}>
      <IncidentDetailContent />
    </WitnessStatementProvider>
  );
}
```

## Error Boundary Integration

```tsx
// components/WitnessStatementErrorBoundary.tsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-red-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-red-700 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}

export default function WitnessStatementErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}

// Usage
<WitnessStatementErrorBoundary>
  <WitnessStatementProvider incidentId={incidentId}>
    <WitnessStatementSection />
  </WitnessStatementProvider>
</WitnessStatementErrorBoundary>
```

## Troubleshooting

### Issue: Hook throws "must be used within a provider" error

**Solution:** Ensure the component using `useWitnessStatements()` is a child of `WitnessStatementProvider`:

```tsx
// Wrong
function MyPage() {
  const { statements } = useWitnessStatements(); // Error!
  return <div>...</div>;
}

// Correct
function MyPage() {
  return (
    <WitnessStatementProvider incidentId="123">
      <MyComponent />
    </WitnessStatementProvider>
  );
}

function MyComponent() {
  const { statements } = useWitnessStatements(); // Works!
  return <div>...</div>;
}
```

### Issue: Statements not loading

**Solution:** Make sure to call `loadWitnessStatements` with the incident ID:

```tsx
const { loadWitnessStatements } = useWitnessStatements();

useEffect(() => {
  loadWitnessStatements('incident-123');
}, []);
```

Or provide the `incidentId` prop to the provider:

```tsx
<WitnessStatementProvider incidentId="incident-123">
  {children}
</WitnessStatementProvider>
```

### Issue: Optimistic updates not working

**Solution:** The context handles this automatically. Make sure you're not preventing the default behavior:

```tsx
// Wrong - Don't manually update state
const handleDelete = async (id: string) => {
  setStatements(statements.filter(s => s.id !== id)); // Don't do this
  await deleteWitnessStatement(id);
};

// Correct - Let the context handle it
const handleDelete = async (id: string) => {
  await deleteWitnessStatement(id); // Context handles optimistic update
};
```

## Next Steps

1. Review the example file: `WitnessStatementContext.example.tsx`
2. Check the comprehensive documentation: `WitnessStatementContext.README.md`
3. Look at the test file for usage patterns: `WitnessStatementContext.test.tsx`
4. Start integrating into your incident detail pages!

## Support

If you encounter issues:
1. Check this integration guide
2. Review the examples in `WitnessStatementContext.example.tsx`
3. Ensure all required types are imported
4. Verify the provider is correctly placed in the component tree
