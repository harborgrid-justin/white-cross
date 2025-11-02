# State Management Organization Guide

**Last Updated**: 2025-11-02
**Version**: 2.0
**Status**: Production

## Overview

This document describes the state management architecture and organization patterns in the White Cross Healthcare Platform frontend application. The state management system is designed following enterprise best practices with clear separation of concerns, HIPAA compliance, and optimal developer experience.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [Provider Organization](#provider-organization)
4. [Context Organization](#context-organization)
5. [Redux Store Organization](#redux-store-organization)
6. [Hook Organization](#hook-organization)
7. [Import Patterns](#import-patterns)
8. [Migration Guide](#migration-guide)

## Architecture Overview

The application uses a **three-layer state management architecture**:

### 1. Server State (TanStack Query / React Query)
- **Purpose**: Fetch, cache, and synchronize server data
- **Location**: `src/hooks/domains/*/queries/`
- **Use Cases**: Students, medications, health records, appointments
- **Features**: Automatic caching, background refetching, optimistic updates

### 2. Client State (Redux Toolkit)
- **Purpose**: Global UI state and offline support
- **Location**: `src/stores/`
- **Use Cases**: Auth state, UI preferences, non-PHI persistent data
- **Features**: State persistence (non-PHI), DevTools integration

### 3. Local State (React Context + useState)
- **Purpose**: Component and feature-scoped state
- **Location**: `src/contexts/` for contexts, local for useState
- **Use Cases**: Form state, UI components, domain-specific workflows
- **Features**: Type-safe contexts, composable providers

## Directory Structure

```
src/
├── providers/                    # Consolidated provider components
│   ├── QueryProvider.tsx        # TanStack Query provider (consolidated)
│   ├── ReduxProvider.tsx        # Redux store provider (consolidated)
│   ├── ApolloProvider.tsx       # Apollo GraphQL provider (consolidated)
│   └── index.tsx                # Barrel export for all providers
│
├── contexts/                     # React Context providers
│   ├── AuthContext.tsx          # Authentication & authorization
│   ├── NavigationContext.tsx    # Navigation & UI state
│   ├── incidents/               # Domain-specific contexts
│   │   ├── FollowUpActionContext.tsx
│   │   ├── WitnessStatementContext.tsx
│   │   └── index.ts
│   └── index.tsx                # Barrel export for all contexts
│
├── stores/                       # Redux store configuration
│   ├── store.ts                 # Main store configuration
│   ├── reduxStore.ts            # Alternative store configuration
│   ├── hooks.ts                 # Typed Redux hooks
│   ├── StoreProvider.tsx        # Redux provider component
│   ├── slices/                  # Redux slices
│   │   ├── authSlice.ts
│   │   └── ...
│   ├── sliceFactory.ts          # Standardized slice creation
│   └── index.ts                 # Barrel export for store
│
├── hooks/                        # Custom React hooks
│   ├── core/                    # Core application hooks
│   │   ├── useAuth.ts           # Permission & role hooks
│   │   ├── useWebSocket.ts      # WebSocket connection
│   │   ├── useOfflineQueue.ts   # Offline support
│   │   └── ...
│   ├── domains/                 # Domain-specific hooks
│   │   ├── students/
│   │   ├── medications/
│   │   ├── incidents/
│   │   └── ...
│   ├── shared/                  # Shared utility hooks
│   └── index.ts                 # Barrel export for hooks
│
└── app/
    └── providers.tsx             # Main app providers composition
```

## Provider Organization

### Consolidated Providers (`src/providers/`)

All provider components have been consolidated into `src/providers/` for consistency:

#### QueryProvider
```typescript
import { QueryProvider } from '@/providers/QueryProvider';

<QueryProvider>
  <App />
</QueryProvider>
```

**Features**:
- SSR-compatible query client
- Automatic hydration
- DevTools in development
- HIPAA-compliant caching

#### ReduxProvider
```typescript
import { ReduxProvider } from '@/providers/ReduxProvider';

<ReduxProvider>
  <App />
</ReduxProvider>
```

**Features**:
- Per-client store instances
- State persistence (non-PHI only)
- DevTools integration

#### ApolloProvider
```typescript
import { ApolloProvider } from '@/providers/ApolloProvider';

<ApolloProvider>
  <App />
</ApolloProvider>
```

**Features**:
- GraphQL client integration
- Automatic cache management
- Type-safe queries

### Main App Providers (`src/app/providers.tsx`)

The main providers file composes all providers in the correct order:

```typescript
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

**Provider Order** (outer to inner):
1. ReduxProvider - Global state
2. QueryClientProvider - Server state caching
3. ApolloProvider - GraphQL
4. AuthProvider - Authentication
5. NavigationProvider - Navigation state

### Legacy Provider Files

The following files are deprecated and should not be used in new code:
- ❌ `src/config/QueryProvider.tsx` - Use `src/providers/QueryProvider.tsx`
- ❌ `src/lib/react-query/QueryProvider.tsx` - Use `src/providers/QueryProvider.tsx`
- ❌ `src/stores/StoreProvider.tsx` - Use `src/providers/ReduxProvider.tsx`
- ❌ `src/graphql/client/ApolloProvider.tsx` - Use `src/providers/ApolloProvider.tsx`

## Context Organization

### Core Contexts (`src/contexts/`)

#### AuthContext
```typescript
import { useAuth, AuthProvider } from '@/contexts/AuthContext';

const { user, isAuthenticated, login, logout, hasRole, hasPermission } = useAuth();
```

**Responsibilities**:
- User authentication state
- JWT token management
- Session timeout (HIPAA 15-min idle)
- Multi-tab synchronization
- Role-based access control

#### NavigationContext
```typescript
import { useNavigation, NavigationProvider } from '@/contexts/NavigationContext';

const {
  isSidebarOpen,
  toggleSidebar,
  breadcrumbs,
  setBreadcrumbs
} = useNavigation();
```

**Responsibilities**:
- Sidebar state (desktop/mobile)
- Breadcrumb management
- Navigation history
- Route tracking

### Domain Contexts (`src/contexts/incidents/`)

Domain-specific contexts are organized by domain:

```typescript
import {
  useFollowUpActions,
  FollowUpActionProvider,
  useWitnessStatements,
  WitnessStatementProvider
} from '@/contexts/incidents';
```

**Pattern**:
- Each domain has its own subdirectory
- Contains related context providers
- Exported through barrel file (`index.ts`)

## Redux Store Organization

### Store Configuration

```typescript
import { store, useAppDispatch, useAppSelector } from '@/stores';

// In components
const dispatch = useAppDispatch();
const user = useAppSelector(state => state.auth.user);
```

### Slices

Redux slices are organized by domain:

```typescript
import { loginUser, logoutUser, refreshAuthToken } from '@/stores/slices/authSlice';

// Dispatch actions
dispatch(loginUser({ email, password }));
```

### State Persistence

**IMPORTANT**: Only non-PHI data is persisted to localStorage.

```typescript
// ✅ Safe to persist
- UI preferences
- User session tokens (HTTP-only cookies)
- Non-sensitive settings

// ❌ Never persist
- Health records (PHI)
- Medication data (PHI)
- Student health info (PHI)
```

## Hook Organization

### Core Hooks (`src/hooks/core/`)

System-level hooks for core functionality:

```typescript
import {
  useHasPermission,
  useHasRole,
  useWebSocket
} from '@/hooks/core';
```

### Domain Hooks (`src/hooks/domains/`)

Business logic hooks organized by domain:

```typescript
import { useStudents } from '@/hooks/domains/students';
import { useMedications } from '@/hooks/domains/medications';
import { useIncidents } from '@/hooks/domains/incidents';
```

**Structure** within each domain:
```
domains/students/
├── queries/          # Data fetching hooks
├── mutations/        # Data modification hooks
├── composites/       # Complex workflows
└── index.ts          # Barrel export
```

### Shared Hooks (`src/hooks/shared/`)

Utility hooks used across multiple domains:

```typescript
import {
  useApiError,
  useAuditLog,
  useCacheManager
} from '@/hooks/shared';
```

## Import Patterns

### ✅ Recommended Patterns

```typescript
// Use barrel exports from organized directories
import { QueryProvider, ReduxProvider, ApolloProvider } from '@/providers';
import { useAuth, useNavigation } from '@/contexts';
import { useStudents, useMedications } from '@/hooks/domains/students';

// Import main app providers
import { Providers } from '@/app/providers';
```

### ⚠️ Acceptable Patterns

```typescript
// Direct imports when you need specific items
import { AuthProvider } from '@/contexts/AuthContext';
import { useHasPermission } from '@/hooks/core/useAuth';
```

### ❌ Deprecated Patterns

```typescript
// Don't use legacy provider locations
import { QueryProvider } from '@/config/QueryProvider'; // ❌
import { QueryProvider } from '@/lib/react-query/QueryProvider'; // ❌

// Don't use deprecated provider props
<ReduxProvider store={store}> // ❌ No longer accepts store prop
```

## Migration Guide

### Migrating from Legacy Providers

If you're using old provider imports, update them as follows:

#### 1. Update QueryProvider imports

```typescript
// Before
import { QueryProvider } from '@/config/QueryProvider';
import { QueryProvider } from '@/lib/react-query/QueryProvider';

// After
import { QueryProvider } from '@/providers/QueryProvider';
// or
import { QueryProvider } from '@/providers';
```

#### 2. Update ReduxProvider usage

```typescript
// Before
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/stores/store';

<ReduxProvider store={store}>
  {children}
</ReduxProvider>

// After
import { ReduxProvider } from '@/providers/ReduxProvider';
// or
import { ReduxProvider } from '@/providers';

<ReduxProvider>
  {children}
</ReduxProvider>
```

#### 3. Update ApolloProvider imports

```typescript
// Before
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from '@/config/apolloClient';

<ApolloProvider client={apolloClient}>
  {children}
</ApolloProvider>

// After
import { ApolloProvider } from '@/providers/ApolloProvider';
// or
import { ApolloProvider } from '@/providers';

<ApolloProvider>
  {children}
</ApolloProvider>
```

### Migrating Context Imports

#### 1. Update incident context imports

```typescript
// Before
import { useWitnessStatements } from '@/hooks/domains/incidents/WitnessStatementContext';
import { useFollowUpActions } from '@/contexts/incidents/FollowUpActionContext';

// After
import { useWitnessStatements, useFollowUpActions } from '@/contexts/incidents';
// or
import { useWitnessStatements, useFollowUpActions } from '@/contexts';
```

## Best Practices

### 1. Provider Composition

Always wrap your app with the main `Providers` component:

```typescript
// ✅ Good
import { Providers } from '@/app/providers';

<Providers>
  <YourApp />
</Providers>

// ❌ Avoid manual composition unless necessary
<ReduxProvider>
  <QueryClientProvider client={queryClient}>
    ...
  </QueryClientProvider>
</ReduxProvider>
```

### 2. Context Usage

Use contexts for feature-scoped state:

```typescript
// ✅ Good - Feature-specific provider
<FollowUpActionProvider incidentId={id}>
  <IncidentDetails />
</FollowUpActionProvider>

// ❌ Avoid - Using Redux for feature-scoped state
// Use contexts instead
```

### 3. Hook Organization

Keep hooks close to their domain:

```typescript
// ✅ Good - Domain-organized
import { useStudents } from '@/hooks/domains/students';

// ❌ Avoid - Mixing concerns
import { useStudents } from '@/hooks/useStudents';
```

### 4. Type Safety

Always use typed hooks:

```typescript
// ✅ Good
import { useAppDispatch, useAppSelector } from '@/stores';

const dispatch = useAppDispatch();
const user = useAppSelector(state => state.auth.user);

// ❌ Avoid - Untyped hooks
import { useDispatch, useSelector } from 'react-redux';
```

## Troubleshooting

### Provider not found errors

If you see "must be used within a Provider" errors:

1. Check that you're using the main `Providers` component
2. Verify the provider is imported from the correct location
3. Ensure the provider wraps the component using the hook

### Import errors

If you see "Cannot find module" errors:

1. Check you're using `@/providers` not old locations
2. Verify the barrel export includes the item
3. Check for circular dependencies

### State not persisting

If Redux state isn't persisting:

1. Verify you're using `ReduxProvider` from `@/providers`
2. Check the data isn't marked as PHI (PHI never persists)
3. Verify localStorage is available

## Related Documentation

- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) - Comprehensive state management guide
- [CLAUDE.md](./CLAUDE.md) - Project overview and conventions
- [README.md](./README.md) - Getting started guide

## Changelog

### Version 2.0 (2025-11-02)
- Consolidated providers into `src/providers/`
- Reorganized contexts with barrel exports
- Moved domain contexts to proper locations
- Updated import patterns
- Added migration guide

### Version 1.0 (2025-10-17)
- Initial state management architecture
- Separate provider files
- Basic context organization
