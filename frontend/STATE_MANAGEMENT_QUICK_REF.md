# State Management Quick Reference

**Version**: 2.0 | **Updated**: 2025-11-02 | **Status**: Production Ready

---

## Quick Import Guide

### Providers

```typescript
// ✅ Recommended - Use consolidated providers
import { QueryProvider, ReduxProvider, ApolloProvider } from '@/providers';

// ✅ Best - Use main app providers
import { Providers } from '@/app/providers';

// ❌ Deprecated - Don't use
import { QueryProvider } from '@/config/QueryProvider';
import { QueryProvider } from '@/lib/react-query/QueryProvider';
```

### Contexts

```typescript
// ✅ Recommended - Single import
import { useAuth, useNavigation } from '@/contexts';

// ✅ Domain-specific
import { useFollowUpActions, useWitnessStatements } from '@/contexts/incidents';

// ❌ Deprecated - Don't use
import { useWitnessStatements } from '@/hooks/domains/incidents/WitnessStatementContext';
```

### Redux Store

```typescript
// ✅ Recommended - Type-safe hooks
import { store, useAppDispatch, useAppSelector } from '@/stores';

// ❌ Avoid - Untyped hooks
import { useDispatch, useSelector } from 'react-redux';
```

---

## Directory Structure

```
src/
├── providers/              # Consolidated providers
│   ├── QueryProvider.tsx
│   ├── ReduxProvider.tsx
│   ├── ApolloProvider.tsx
│   └── index.tsx
├── contexts/               # React contexts
│   ├── AuthContext.tsx
│   ├── NavigationContext.tsx
│   ├── incidents/
│   │   ├── FollowUpActionContext.tsx
│   │   ├── WitnessStatementContext.tsx
│   │   └── index.ts
│   └── index.tsx
├── stores/                 # Redux store
│   ├── store.ts
│   ├── slices/
│   ├── hooks.ts
│   └── index.ts
└── hooks/                  # Custom hooks
    ├── core/
    ├── domains/
    └── index.ts
```

---

## Common Patterns

### Setup App Providers

```typescript
// app/layout.tsx
import { Providers } from '@/app/providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

### Use Auth Context

```typescript
import { useAuth } from '@/contexts';

function MyComponent() {
  const { user, isAuthenticated, hasRole } = useAuth();
  
  if (!isAuthenticated) return <LoginPrompt />;
  if (!hasRole('NURSE')) return <AccessDenied />;
  
  return <div>Welcome {user.name}</div>;
}
```

### Use Redux Store

```typescript
import { useAppDispatch, useAppSelector } from '@/stores';
import { loginUser } from '@/stores';

function LoginForm() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.auth.isLoading);
  
  const handleLogin = (email, password) => {
    dispatch(loginUser({ email, password }));
  };
  
  return <form onSubmit={handleLogin}>...</form>;
}
```

### Use Domain Context

```typescript
import { useFollowUpActions, FollowUpActionProvider } from '@/contexts/incidents';

function IncidentPage({ incidentId }) {
  return (
    <FollowUpActionProvider initialIncidentId={incidentId}>
      <IncidentDetails />
    </FollowUpActionProvider>
  );
}

function IncidentDetails() {
  const { actions, createFollowUpAction, stats } = useFollowUpActions();
  
  return (
    <div>
      <h2>Follow-up Actions ({stats.total})</h2>
      {actions.map(action => <ActionCard key={action.id} action={action} />)}
    </div>
  );
}
```

---

## Cheat Sheet

| What You Need | Import From | Example |
|---------------|-------------|---------|
| Main App Setup | `@/app/providers` | `<Providers>{children}</Providers>` |
| Auth State | `@/contexts` | `useAuth()` |
| Navigation | `@/contexts` | `useNavigation()` |
| Redux Actions | `@/stores` | `useAppDispatch()` |
| Redux State | `@/stores` | `useAppSelector()` |
| Domain Context | `@/contexts/{domain}` | `useFollowUpActions()` |
| Query Provider | `@/providers` | `<QueryProvider>` |
| Redux Provider | `@/providers` | `<ReduxProvider>` |

---

## Migration Checklist

- [ ] Replace old QueryProvider imports with `@/providers`
- [ ] Replace untyped Redux hooks with `useAppDispatch/useAppSelector`
- [ ] Update context imports to use barrel exports
- [ ] Update provider composition in custom providers
- [ ] Remove direct provider prop passing (store, client)

---

## Key Files

| File | Purpose |
|------|---------|
| `src/providers/index.tsx` | All provider exports |
| `src/contexts/index.tsx` | All context exports |
| `src/stores/index.ts` | Redux exports |
| `src/app/providers.tsx` | Main app providers |
| `STATE_MANAGEMENT_ORGANIZATION.md` | Full documentation |

---

## Type Exports

```typescript
// Navigation types
import type {
  BreadcrumbItem,
  NavigationState,
  NavigationContextType
} from '@/contexts';

// Redux types
import type {
  RootState,
  AppDispatch,
  AppStore
} from '@/stores';

// Incident context types
import type {
  FollowUpActionContextType,
  WitnessStatementContextValue
} from '@/contexts/incidents';
```

---

## Troubleshooting

### "Cannot find module @/providers"

**Fix**: Import from `@/providers`, not old locations
```typescript
// ✅ Correct
import { QueryProvider } from '@/providers';

// ❌ Wrong
import { QueryProvider } from '@/config/QueryProvider';
```

### "Provider requires store prop"

**Fix**: Don't pass store prop to new providers
```typescript
// ✅ Correct
<ReduxProvider>
  {children}
</ReduxProvider>

// ❌ Wrong
<ReduxProvider store={store}>
  {children}
</ReduxProvider>
```

### "Hook must be used within Provider"

**Fix**: Ensure component is wrapped with Providers
```typescript
// In app/layout.tsx
<Providers>
  <YourComponent /> {/* Can now use hooks */}
</Providers>
```

---

## Performance Tips

1. **Use barrel exports** - Better tree-shaking
2. **Import from @/providers** - Consistent instances
3. **Use typed hooks** - Better type inference
4. **Compose contexts properly** - Avoid re-renders

---

**Need more details?** See `STATE_MANAGEMENT_ORGANIZATION.md`

**Quick summary?** See `STATE_MANAGEMENT_SUMMARY.md`

**Full report?** See `STATE_MANAGEMENT_REPORT.md`
