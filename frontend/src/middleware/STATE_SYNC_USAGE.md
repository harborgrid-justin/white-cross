# State Synchronization Middleware - Usage Guide

## Overview

The State Synchronization Middleware provides enterprise-grade state persistence and cross-tab synchronization for the White Cross healthcare platform. It automatically synchronizes Redux state across multiple browser tabs and persists state to localStorage/sessionStorage with full HIPAA compliance.

## Key Features

- **Cross-Tab Synchronization**: Real-time state sync across multiple browser tabs using BroadcastChannel API
- **Persistent State**: Automatic state persistence to localStorage/sessionStorage
- **HIPAA Compliance**: Excludes sensitive PHI and authentication data from persistence
- **Multiple Sync Strategies**: Immediate, debounced, throttled, on-change, scheduled, and manual
- **State Versioning**: Built-in versioning and migration support
- **Conflict Resolution**: Configurable strategies for handling cross-tab conflicts
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Error Handling**: Robust error handling with callbacks for monitoring
- **Storage Management**: Size limits, compression, and cleanup utilities

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Redux Store                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────┐  ┌───────────────────┐  ┌──────────────────┐   │
│  │ Auth      │  │ Incident Reports  │  │ Other Slices     │   │
│  │ Slice     │  │ Slice             │  │ ...              │   │
│  └─────┬─────┘  └──────────┬────────┘  └─────────┬────────┘   │
│        │                   │                      │             │
│        └───────────────────┴──────────────────────┘             │
│                            │                                    │
│                    ┌───────▼────────┐                           │
│                    │ State Sync     │                           │
│                    │ Middleware     │                           │
│                    └───────┬────────┘                           │
│                            │                                    │
│        ┌───────────────────┼───────────────────┐                │
│        │                   │                   │                │
│  ┌─────▼─────┐      ┌──────▼──────┐    ┌──────▼──────┐        │
│  │localStorage│      │sessionStorage│    │BroadcastCh  │        │
│  │(UI Prefs) │      │(Auth Data)   │    │(Cross-Tab)  │        │
│  └───────────┘      └─────────────┘    └─────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

## Configuration

### Basic Setup

The middleware is already integrated in `F:\temp\white-cross\frontend\src\stores\reduxStore.ts`:

```typescript
import {
  createStateSyncMiddleware,
  loadInitialState,
  SyncStrategy,
  ConflictStrategy,
  type StateSyncConfig,
} from '../middleware/stateSyncMiddleware';

const stateSyncConfig: StateSyncConfig = {
  slices: [
    {
      sliceName: 'auth',
      storage: 'sessionStorage',
      strategy: SyncStrategy.DEBOUNCED,
      debounceDelay: 500,
      excludePaths: ['token', 'refreshToken', 'password'],
      enableCrossTab: false,
    },
    {
      sliceName: 'incidentReports',
      storage: 'localStorage',
      strategy: SyncStrategy.DEBOUNCED,
      debounceDelay: 1000,
      excludePaths: ['reports', 'selectedReport'],
      enableCrossTab: true,
    },
  ],
  conflictStrategy: ConflictStrategy.LAST_WRITE_WINS,
  channelName: 'whitecross-state-sync',
  debug: import.meta.env.DEV,
  storagePrefix: 'whitecross',
};

const preloadedState = loadInitialState(stateSyncConfig);
const stateSyncMiddleware = createStateSyncMiddleware(stateSyncConfig);

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stateSyncMiddleware),
});
```

### Slice Configuration Options

```typescript
interface SliceSyncConfig {
  // Required
  sliceName: keyof RootState;           // Name of the Redux slice
  storage: StorageType;                 // 'localStorage' | 'sessionStorage' | 'url' | 'none'
  strategy: SyncStrategy;               // Sync timing strategy

  // Optional
  debounceDelay?: number;               // Delay for DEBOUNCED strategy (ms)
  throttleDelay?: number;               // Delay for THROTTLED strategy (ms)
  scheduleInterval?: number;            // Interval for SCHEDULED strategy (ms)
  excludePaths?: string[];              // Paths to exclude from sync
  enableCrossTab?: boolean;             // Enable BroadcastChannel sync
  compress?: boolean;                   // Compress before storage
  maxAge?: number;                      // Max age before state is stale (ms)
  version?: number;                     // Version for migration
  migrate?: (old: any, ver: number) => any; // Migration function
  serializer?: StateSerializer;         // Custom serializer
  conflictResolver?: ConflictResolver;  // Custom conflict resolver
}
```

## Sync Strategies

### 1. IMMEDIATE
Syncs state immediately on every action.

```typescript
{
  sliceName: 'notifications',
  storage: 'sessionStorage',
  strategy: SyncStrategy.IMMEDIATE,
}
```

**Use Cases:**
- Critical state that must be persisted immediately
- Small state objects with infrequent updates
- Real-time sync requirements

**Trade-offs:**
- ✅ Instant persistence
- ❌ Higher storage write frequency
- ❌ Potential performance impact on rapid updates

### 2. DEBOUNCED (Recommended)
Delays sync until updates stop for specified duration.

```typescript
{
  sliceName: 'incidentReports',
  storage: 'localStorage',
  strategy: SyncStrategy.DEBOUNCED,
  debounceDelay: 1000, // Wait 1s after last update
}
```

**Use Cases:**
- Form inputs and user preferences
- Filter states
- Search queries
- Any rapidly changing state

**Trade-offs:**
- ✅ Reduces write operations
- ✅ Best for rapid sequential updates
- ⚠️ Small delay before persistence

### 3. THROTTLED
Ensures sync happens at most once per time period.

```typescript
{
  sliceName: 'metrics',
  storage: 'localStorage',
  strategy: SyncStrategy.THROTTLED,
  throttleDelay: 5000, // Sync max every 5s
}
```

**Use Cases:**
- High-frequency updates (e.g., scroll position)
- Analytics data
- Real-time metrics

**Trade-offs:**
- ✅ Predictable sync frequency
- ✅ Prevents storage thrashing
- ⚠️ May skip intermediate states

### 4. ON_CHANGE
Syncs only when state actually changes (deep equality check).

```typescript
{
  sliceName: 'settings',
  storage: 'localStorage',
  strategy: SyncStrategy.ON_CHANGE,
}
```

**Use Cases:**
- Infrequently updated state
- Configuration settings
- User preferences

**Trade-offs:**
- ✅ Minimal storage operations
- ✅ Efficient for stable state
- ⚠️ Deep equality check overhead

### 5. SCHEDULED
Syncs at fixed intervals regardless of updates.

```typescript
{
  sliceName: 'cache',
  storage: 'localStorage',
  strategy: SyncStrategy.SCHEDULED,
  scheduleInterval: 60000, // Sync every 60s
}
```

**Use Cases:**
- Background sync requirements
- Periodic snapshots
- Cache updates

**Trade-offs:**
- ✅ Predictable timing
- ⚠️ May sync unchanged state
- ⚠️ Fixed interval overhead

### 6. MANUAL
No automatic sync - must call `manualSync()` explicitly.

```typescript
{
  sliceName: 'temp',
  storage: 'sessionStorage',
  strategy: SyncStrategy.MANUAL,
}
```

**Use Cases:**
- Developer-controlled sync
- Testing scenarios
- Complex sync logic

**Trade-offs:**
- ✅ Complete control
- ✅ No automatic overhead
- ⚠️ Requires manual management

## HIPAA Compliance

### Excluded Data

The middleware automatically excludes sensitive data from persistence:

```typescript
// Global exclusions (built-in)
const SENSITIVE_DATA_PATHS = [
  'auth.token',
  'auth.refreshToken',
  'auth.password',
  'user.ssn',
  'user.medicalRecords',
  'student.healthRecords',
  'medication.prescriptionDetails',
];

// Slice-specific exclusions
{
  sliceName: 'incidentReports',
  excludePaths: [
    'reports',           // Don't persist PHI
    'selectedReport',    // Don't persist selected incident details
    'witnessStatements', // Don't persist witness statements
  ],
}
```

### What Gets Synced

For the incident reports slice:
- ✅ Filters (page, limit, status, severity, date range)
- ✅ Sort preferences (column, order)
- ✅ View mode (list, grid, detail)
- ✅ UI state (pagination, view preferences)
- ❌ Actual incident data (PHI)
- ❌ Student information
- ❌ Medical records

For the auth slice:
- ✅ User role and basic info
- ✅ UI preferences
- ❌ JWT tokens
- ❌ Passwords
- ❌ Session secrets

### Compliance Verification

```typescript
// Check what's being stored (development only)
if (import.meta.env.DEV) {
  const stored = localStorage.getItem('whitecross_incidentReports');
  const parsed = JSON.parse(stored);

  // Verify no PHI is present
  console.assert(!parsed.state.reports, 'Reports should not be persisted');
  console.assert(!parsed.state.selectedReport, 'Selected report should not be persisted');
}
```

## Cross-Tab Synchronization

### How It Works

1. **State Update**: Action dispatched in Tab A
2. **Middleware Processing**: State sync middleware intercepts action
3. **Storage Persistence**: State saved to localStorage/sessionStorage
4. **BroadcastChannel**: Message sent to other tabs
5. **Tab B Receives**: Message triggers state update in Tab B
6. **Conflict Resolution**: If conflicting updates, resolution strategy applied

### Enabling Cross-Tab Sync

```typescript
{
  sliceName: 'incidentReports',
  enableCrossTab: true,  // Enable for this slice
  conflictResolver: {
    resolve: (local, remote, metadata) => {
      // Custom merge logic
      return { ...local, ...remote };
    },
  },
}
```

### Conflict Resolution Strategies

```typescript
enum ConflictStrategy {
  LAST_WRITE_WINS = 'lastWriteWins',    // Use most recent
  FIRST_WRITE_WINS = 'firstWriteWins',  // Use oldest
  PREFER_LOCAL = 'preferLocal',         // Always prefer local
  PREFER_REMOTE = 'preferRemote',       // Always prefer remote
  CUSTOM_MERGE = 'customMerge',         // Use custom resolver
}
```

### Example: Custom Conflict Resolution

```typescript
const customResolver: ConflictResolver = {
  resolve: (local, remote, metadata) => {
    // Merge filters intelligently
    return {
      ...local,
      filters: {
        ...local.filters,
        ...remote.filters,
        // Prefer more restrictive filters
        limit: Math.min(local.filters.limit, remote.filters.limit),
      },
      // Prefer latest sort config
      sortConfig: metadata.localTimestamp > metadata.remoteTimestamp
        ? local.sortConfig
        : remote.sortConfig,
    };
  },
  hasConflict: (local, remote) => {
    return JSON.stringify(local) !== JSON.stringify(remote);
  },
};
```

## State Hydration

### On App Load

State is automatically loaded from storage when the app initializes:

```typescript
const preloadedState = loadInitialState(stateSyncConfig);

const store = configureStore({
  reducer: rootReducer,
  preloadedState, // 👈 Hydrates store with persisted state
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stateSyncMiddleware),
});
```

### Hydration Process

1. **Read Storage**: Load data from localStorage/sessionStorage
2. **Validate**: Check checksums and versions
3. **Migrate**: Run migration if version changed
4. **Merge**: Merge with default initial state
5. **Return**: Provide preloaded state to store

### Example: State Migration

```typescript
{
  sliceName: 'incidentReports',
  version: 2, // Increment version
  migrate: (oldState, oldVersion) => {
    if (oldVersion === 1) {
      // Migrate from v1 to v2
      return {
        ...oldState,
        filters: {
          ...oldState.filters,
          // Add new filter field
          priority: undefined,
        },
      };
    }
    return oldState;
  },
}
```

## Custom Serializers

### Handling Complex Types

```typescript
const dateSerializer: StateSerializer = {
  serialize: (state) => {
    return JSON.stringify(state, (key, value) => {
      if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() };
      }
      if (value instanceof Map) {
        return { __type: 'Map', value: Array.from(value.entries()) };
      }
      if (value instanceof Set) {
        return { __type: 'Set', value: Array.from(value) };
      }
      return value;
    });
  },

  deserialize: (data) => {
    return JSON.parse(data, (key, value) => {
      if (value && typeof value === 'object') {
        if (value.__type === 'Date') {
          return new Date(value.value);
        }
        if (value.__type === 'Map') {
          return new Map(value.value);
        }
        if (value.__type === 'Set') {
          return new Set(value.value);
        }
      }
      return value;
    });
  },

  validate: (state) => {
    return state !== null && typeof state === 'object';
  },
};
```

## Utility Functions

### Clear Persisted State

```typescript
import { clearPersistedState } from '@/stores/reduxStore';

// On logout
const handleLogout = async () => {
  await authApi.logout();
  clearPersistedState(); // 👈 Clear all persisted state
  navigate('/login');
};
```

### Get Storage Statistics

```typescript
import { getStorageStats } from '@/stores/reduxStore';

const stats = getStorageStats();

console.log(`LocalStorage: ${stats.localStorage.percentage.toFixed(2)}% used`);
console.log(`SessionStorage: ${stats.sessionStorage.percentage.toFixed(2)}% used`);

// Warn if approaching limit
if (stats.localStorage.percentage > 80) {
  toast.warning('Storage is running low. Consider clearing old data.');
}
```

### Manual Sync

```typescript
import { manualSync } from '@/middleware/stateSyncMiddleware';

// Manually sync a slice
const state = store.getState();
manualSync('incidentReports', state.incidentReports, stateSyncConfig);
```

## Best Practices

### 1. Choose Appropriate Storage Type

```typescript
// ✅ SessionStorage for authentication
{
  sliceName: 'auth',
  storage: 'sessionStorage', // Cleared on tab close
}

// ✅ LocalStorage for user preferences
{
  sliceName: 'settings',
  storage: 'localStorage', // Persists across sessions
}

// ✅ URL for shareable state
{
  sliceName: 'filters',
  storage: 'url', // Shareable via URL
}
```

### 2. Use Debouncing for UI State

```typescript
// ✅ Good: Debounced sync for rapidly changing state
{
  sliceName: 'incidentReports',
  strategy: SyncStrategy.DEBOUNCED,
  debounceDelay: 1000,
}

// ❌ Avoid: Immediate sync for rapid updates
{
  sliceName: 'incidentReports',
  strategy: SyncStrategy.IMMEDIATE, // Too many writes
}
```

### 3. Exclude Sensitive Data

```typescript
// ✅ Good: Explicit exclusions
{
  sliceName: 'auth',
  excludePaths: [
    'token',
    'refreshToken',
    'password',
    'user.ssn',
  ],
}

// ❌ Avoid: Storing sensitive data
{
  sliceName: 'auth',
  excludePaths: [], // Missing exclusions
}
```

### 4. Enable Cross-Tab Selectively

```typescript
// ✅ Good: Enable for UI preferences
{
  sliceName: 'incidentReports',
  enableCrossTab: true, // Sync filters across tabs
}

// ✅ Good: Disable for auth
{
  sliceName: 'auth',
  enableCrossTab: false, // Security: don't sync auth
}
```

### 5. Monitor Storage Usage

```typescript
// ✅ Good: Regular monitoring
useEffect(() => {
  const interval = setInterval(() => {
    const stats = getStorageStats();
    if (stats.localStorage.percentage > 90) {
      console.warn('Storage nearly full');
      // Trigger cleanup
    }
  }, 60000); // Check every minute

  return () => clearInterval(interval);
}, []);
```

### 6. Handle Errors Gracefully

```typescript
const stateSyncConfig: StateSyncConfig = {
  slices: [...],
  onError: (error, context) => {
    // ✅ Good: Log and report errors
    console.error(`[StateSyncMiddleware] ${context}:`, error);

    // Send to error tracking
    if (import.meta.env.PROD) {
      window.Sentry?.captureException(error, {
        tags: { context, module: 'state-sync' },
      });
    }
  },
};
```

## Troubleshooting

### State Not Persisting

**Check:**
1. Is the slice configured in `stateSyncConfig`?
2. Is the storage type supported in the environment?
3. Are there quota errors in the console?
4. Is the debounce delay being waited?

**Solution:**
```typescript
// Verify configuration
const config = stateSyncConfig.slices.find(s => s.sliceName === 'mySlice');
console.log('Slice config:', config);

// Check storage availability
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('LocalStorage available');
} catch (error) {
  console.error('LocalStorage not available:', error);
}
```

### Cross-Tab Sync Not Working

**Check:**
1. Is `enableCrossTab: true` set for the slice?
2. Is BroadcastChannel supported in the browser?
3. Are both tabs on the same origin?

**Solution:**
```typescript
// Check BroadcastChannel support
if (typeof BroadcastChannel === 'undefined') {
  console.warn('BroadcastChannel not supported');
} else {
  console.log('BroadcastChannel supported');
}

// Enable debug logging
const stateSyncConfig: StateSyncConfig = {
  debug: true, // 👈 Enable debug logs
  ...
};
```

### Storage Quota Exceeded

**Check:**
1. How much storage is being used?
2. Are there old keys that should be cleaned up?
3. Is compression enabled?

**Solution:**
```typescript
// Check storage usage
const stats = getStorageStats();
console.log('Storage usage:', stats);

// Clear old data
clearPersistedState();

// Enable compression
{
  sliceName: 'mySlice',
  compress: true, // 👈 Enable compression
}
```

### State Not Loading on Refresh

**Check:**
1. Is `preloadedState` passed to `configureStore`?
2. Are there errors during deserialization?
3. Is the state version current?

**Solution:**
```typescript
// Verify preloaded state
const preloadedState = loadInitialState(stateSyncConfig);
console.log('Preloaded state:', preloadedState);

// Check for errors
const stateSyncConfig: StateSyncConfig = {
  debug: true,
  onError: (error, context) => {
    console.error('State sync error:', error, context);
  },
};
```

## Performance Considerations

### Memory Usage

- State is kept in memory in Redux store
- Synced state is stored in browser storage
- BroadcastChannel messages are lightweight

### Write Frequency

```typescript
// Low frequency: Good
Strategy: DEBOUNCED (1000ms)
Writes: ~1-2 per second maximum

// High frequency: Consider optimization
Strategy: IMMEDIATE
Writes: On every action (potentially 100s/second)
```

### Storage Size

```typescript
// Monitor storage size
const stats = getStorageStats();

// Typical sizes:
// - Auth state: ~1-5 KB
// - UI preferences: ~5-20 KB
// - Total limit: ~5 MB per origin
```

## Security Considerations

### 1. Never Store Tokens

```typescript
// ✅ Good: Exclude tokens
excludePaths: ['token', 'refreshToken']

// ❌ Bad: Storing tokens in localStorage
excludePaths: []
```

### 2. Use SessionStorage for Auth

```typescript
// ✅ Good: Session-only auth data
{
  sliceName: 'auth',
  storage: 'sessionStorage', // Cleared on tab close
}
```

### 3. Validate Deserialized Data

```typescript
const serializer: StateSerializer = {
  deserialize: (data) => {
    const state = JSON.parse(data);
    // ✅ Validate structure
    if (!isValidState(state)) {
      throw new Error('Invalid state structure');
    }
    return state;
  },
};
```

### 4. Use HTTPS in Production

All storage is origin-bound and requires HTTPS in production for security.

## Examples

### Complete Example: Adding a New Slice

```typescript
// 1. Create the slice
// F:\temp\white-cross\frontend\src\stores\slices\settingsSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  notificationsEnabled: boolean;
}

const initialState: SettingsState = {
  theme: 'light',
  sidebarCollapsed: false,
  notificationsEnabled: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
});

export const { setTheme, toggleSidebar } = settingsSlice.actions;
export default settingsSlice.reducer;

// 2. Add to store
// F:\temp\white-cross\frontend\src\stores\reduxStore.ts
import settingsSlice from './slices/settingsSlice';

const rootReducer = {
  auth: authSlice,
  incidentReports: incidentReportsSlice,
  settings: settingsSlice, // 👈 Add new slice
};

// 3. Configure sync
const stateSyncConfig: StateSyncConfig = {
  slices: [
    // ... existing slices
    {
      sliceName: 'settings',
      storage: 'localStorage',
      strategy: SyncStrategy.DEBOUNCED,
      debounceDelay: 500,
      excludePaths: [], // Nothing sensitive
      enableCrossTab: true, // Sync across tabs
      version: 1,
    },
  ],
};

// 4. Use in component
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '@/stores/slices/settingsSlice';
import type { RootState } from '@/stores/reduxStore';

function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.settings.theme);

  const handleToggle = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
    // ✅ Automatically synced to localStorage
    // ✅ Automatically broadcasted to other tabs
  };

  return (
    <button onClick={handleToggle}>
      Current theme: {theme}
    </button>
  );
}
```

## Testing

See `F:\temp\white-cross\frontend\src\stores\reduxStore.test.ts` for comprehensive test examples.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the test file for examples
3. Enable debug logging: `debug: true`
4. Check browser console for error messages

## License

Proprietary - White Cross Healthcare Platform
