# State Synchronization Middleware

Enterprise-grade Redux middleware for synchronizing application state across multiple storage mechanisms (localStorage, sessionStorage, URL params) and browser tabs using the BroadcastChannel API.

## Features

### Core Capabilities
- **Multi-Storage Sync**: Synchronize state to localStorage, sessionStorage, or URL parameters
- **Cross-Tab Synchronization**: Real-time state sync across browser tabs via BroadcastChannel
- **Flexible Sync Strategies**: Choose from immediate, debounced, throttled, onChange, scheduled, or manual sync
- **HIPAA Compliance**: Built-in sensitive data exclusion for healthcare applications
- **State Versioning**: Automatic state migration with version tracking
- **Conflict Resolution**: Multiple strategies for handling concurrent state changes
- **Custom Serialization**: Handle complex types (Date, Map, Set, BigInt, circular references)
- **State Validation**: Verify state integrity with checksums and custom validators
- **Performance Optimized**: Debouncing, throttling, and intelligent change detection

### Security Features
- Automatic exclusion of sensitive data paths (tokens, passwords, PHI)
- Configurable data retention policies
- Storage size limits to prevent quota overflow
- State age validation to prevent stale data usage
- Audit logging hooks for compliance tracking

## Installation

The middleware is already included in the project at `F:\temp\white-cross\frontend\src\middleware\stateSyncMiddleware.ts`.

Required dependencies (already installed):
```json
{
  "@reduxjs/toolkit": "^2.9.0",
  "react-redux": "^9.2.0"
}
```

## Quick Start

### Basic Setup

```typescript
import { configureStore } from '@reduxjs/toolkit';
import {
  createStateSyncMiddleware,
  loadInitialState,
  SyncStrategy
} from '@/middleware/stateSyncMiddleware';
import rootReducer from './reducers';

// Define sync configuration
const syncConfig = {
  slices: [
    {
      sliceName: 'auth',
      storage: 'sessionStorage',
      strategy: SyncStrategy.DEBOUNCED,
      debounceDelay: 500,
      excludePaths: ['token', 'refreshToken', 'password'],
    },
    {
      sliceName: 'ui',
      storage: 'localStorage',
      strategy: SyncStrategy.IMMEDIATE,
    },
  ],
  debug: true,
};

// Load persisted state
const preloadedState = loadInitialState(syncConfig);

// Create middleware
const syncMiddleware = createStateSyncMiddleware(syncConfig);

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(syncMiddleware),
});
```

## Configuration

### StateSyncConfig

```typescript
interface StateSyncConfig {
  /** Array of slice configurations */
  slices: SliceSyncConfig[];

  /** Global conflict strategy */
  conflictStrategy?: ConflictStrategy;

  /** BroadcastChannel name for cross-tab sync */
  channelName?: string;

  /** Enable debug logging */
  debug?: boolean;

  /** Storage key prefix */
  storagePrefix?: string;

  /** Global serializer */
  serializer?: StateSerializer;

  /** Error callback */
  onError?: (error: Error, context: string) => void;

  /** Conflict callback */
  onConflict?: (conflict: ConflictMetadata) => void;

  /** Maximum storage size in bytes */
  maxStorageSize?: number;
}
```

### SliceSyncConfig

```typescript
interface SliceSyncConfig {
  /** Name of the state slice */
  sliceName: keyof RootState;

  /** Storage type: 'localStorage' | 'sessionStorage' | 'url' | 'none' */
  storage: StorageType;

  /** Sync strategy */
  strategy: SyncStrategy;

  /** Debounce delay in ms */
  debounceDelay?: number;

  /** Throttle delay in ms */
  throttleDelay?: number;

  /** Schedule interval in ms */
  scheduleInterval?: number;

  /** Custom serializer */
  serializer?: StateSerializer<T>;

  /** Custom conflict resolver */
  conflictResolver?: ConflictResolver<T>;

  /** Paths to exclude from sync */
  excludePaths?: string[];

  /** Enable cross-tab sync */
  enableCrossTab?: boolean;

  /** Compress state before storage */
  compress?: boolean;

  /** Maximum age in ms */
  maxAge?: number;

  /** State version */
  version?: number;

  /** Migration function */
  migrate?: (oldState: any, oldVersion: number) => T;
}
```

## Sync Strategies

### SyncStrategy.IMMEDIATE
Synchronizes state on every Redux action. Best for critical state that must be persisted immediately.

```typescript
{
  sliceName: 'auth',
  storage: 'sessionStorage',
  strategy: SyncStrategy.IMMEDIATE,
}
```

### SyncStrategy.DEBOUNCED
Waits for a pause in actions before syncing. Best for frequently changing state.

```typescript
{
  sliceName: 'ui',
  storage: 'localStorage',
  strategy: SyncStrategy.DEBOUNCED,
  debounceDelay: 500, // Wait 500ms after last change
}
```

### SyncStrategy.THROTTLED
Syncs at most once per interval. Best for high-frequency updates.

```typescript
{
  sliceName: 'notifications',
  storage: 'localStorage',
  strategy: SyncStrategy.THROTTLED,
  throttleDelay: 2000, // Max once every 2 seconds
}
```

### SyncStrategy.ON_CHANGE
Only syncs if state actually changed. Avoids unnecessary writes.

```typescript
{
  sliceName: 'settings',
  storage: 'localStorage',
  strategy: SyncStrategy.ON_CHANGE,
}
```

### SyncStrategy.SCHEDULED
Syncs at fixed intervals. Best for periodic backups.

```typescript
{
  sliceName: 'drafts',
  storage: 'localStorage',
  strategy: SyncStrategy.SCHEDULED,
  scheduleInterval: 30000, // Every 30 seconds
}
```

### SyncStrategy.MANUAL
Only syncs when explicitly called. Best for sensitive operations.

```typescript
{
  sliceName: 'reports',
  storage: 'sessionStorage',
  strategy: SyncStrategy.MANUAL,
}

// Manually trigger sync
import { manualSync } from '@/middleware/stateSyncMiddleware';
manualSync('reports', reportsState, syncConfig);
```

## Storage Types

### localStorage
Persists across browser sessions. Best for long-term preferences.

```typescript
{
  sliceName: 'ui',
  storage: 'localStorage',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
}
```

### sessionStorage
Persists only during browser session. Best for sensitive data.

```typescript
{
  sliceName: 'auth',
  storage: 'sessionStorage',
  maxAge: 30 * 60 * 1000, // 30 minutes
}
```

### URL Parameters
Syncs state to URL query parameters. Best for shareable states.

```typescript
{
  sliceName: 'filters',
  storage: 'url',
  strategy: SyncStrategy.DEBOUNCED,
}
```

## HIPAA-Compliant Configuration

For healthcare applications, use the provided HIPAA-compliant configuration:

```typescript
import { hipaaCompliantConfig } from '@/middleware/stateSyncMiddleware.examples';

const syncMiddleware = createStateSyncMiddleware(hipaaCompliantConfig);
```

This configuration:
- Stores auth in sessionStorage only (no cross-tab sync)
- Excludes all PHI data paths
- Implements audit logging hooks
- Uses short max age for sensitive data
- Prefers local state in conflicts

### Sensitive Data Exclusion

Automatically excluded paths (HIPAA compliance):
```typescript
const SENSITIVE_DATA_PATHS = [
  'auth.token',
  'auth.refreshToken',
  'auth.password',
  'user.ssn',
  'user.medicalRecords',
  'student.healthRecords',
  'medication.prescriptionDetails',
];
```

Add custom exclusions:
```typescript
{
  sliceName: 'patient',
  excludePaths: [
    'ssn',
    'insuranceNumber',
    'medicalHistory',
  ],
}
```

## Cross-Tab Synchronization

Enable real-time state sync across browser tabs:

```typescript
const config = {
  slices: [
    {
      sliceName: 'notifications',
      storage: 'localStorage',
      strategy: SyncStrategy.IMMEDIATE,
      enableCrossTab: true, // Enable cross-tab sync
    },
  ],
  channelName: 'whitecross-sync', // Custom channel name
  conflictStrategy: ConflictStrategy.LAST_WRITE_WINS,
};
```

### How It Works
1. State changes are broadcast via BroadcastChannel
2. Other tabs receive updates in real-time
3. Conflicts are resolved using specified strategy
4. Infinite loops are prevented by sender ID tracking

### Conflict Resolution Strategies

```typescript
enum ConflictStrategy {
  LAST_WRITE_WINS = 'lastWriteWins',      // Most recent wins
  FIRST_WRITE_WINS = 'firstWriteWins',    // Oldest wins
  CUSTOM_MERGE = 'customMerge',            // Use custom function
  PREFER_LOCAL = 'preferLocal',            // Always prefer local
  PREFER_REMOTE = 'preferRemote',          // Always prefer remote
}
```

## Custom Serializers

Handle complex data types with custom serializers:

```typescript
const customSerializer: StateSerializer = {
  serialize: (state: any): string => {
    return JSON.stringify(state, (key, value) => {
      // Handle Date objects
      if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() };
      }

      // Handle BigInt
      if (typeof value === 'bigint') {
        return { __type: 'BigInt', value: value.toString() };
      }

      // Handle Map
      if (value instanceof Map) {
        return { __type: 'Map', value: Array.from(value.entries()) };
      }

      return value;
    });
  },

  deserialize: (data: string): any => {
    return JSON.parse(data, (key, value) => {
      if (!value || typeof value !== 'object') return value;

      // Restore Date objects
      if (value.__type === 'Date') {
        return new Date(value.value);
      }

      // Restore BigInt
      if (value.__type === 'BigInt') {
        return BigInt(value.value);
      }

      // Restore Map
      if (value.__type === 'Map') {
        return new Map(value.value);
      }

      return value;
    });
  },

  validate: (state: any): boolean => {
    return state !== null && typeof state === 'object';
  },
};

const config = {
  slices: [
    {
      sliceName: 'appointments',
      serializer: customSerializer,
    },
  ],
};
```

## State Versioning & Migration

Automatically migrate state when structure changes:

```typescript
interface OldState {
  user: string;
}

interface NewState {
  user: {
    id: string;
    name: string;
  };
}

const config = {
  slices: [
    {
      sliceName: 'auth',
      version: 2, // Current version

      migrate: (oldState: any, oldVersion: number): NewState => {
        if (oldVersion === 1) {
          return {
            user: {
              id: '',
              name: oldState.user,
            },
          };
        }

        // Return default for unknown versions
        return { user: { id: '', name: '' } };
      },
    },
  ],
};
```

## API Reference

### createStateSyncMiddleware(config)
Creates the sync middleware instance.

```typescript
const syncMiddleware = createStateSyncMiddleware(config);
```

### loadInitialState(config)
Loads persisted state from storage. Call before creating store.

```typescript
const preloadedState = loadInitialState(config);
```

### manualSync(sliceName, state, config)
Manually trigger sync for a specific slice.

```typescript
manualSync('reports', reportsState, config);
```

### clearSyncedState(config)
Clear all synced state from storage (useful on logout).

```typescript
clearSyncedState(config);
```

## Usage Examples

### Example 1: Multi-Storage Strategy

```typescript
const config: StateSyncConfig = {
  slices: [
    // Critical auth: sessionStorage, immediate
    {
      sliceName: 'auth',
      storage: 'sessionStorage',
      strategy: SyncStrategy.IMMEDIATE,
      excludePaths: ['token', 'refreshToken'],
    },

    // UI preferences: localStorage, debounced
    {
      sliceName: 'ui',
      storage: 'localStorage',
      strategy: SyncStrategy.DEBOUNCED,
      debounceDelay: 500,
    },

    // Filters: URL params for shareability
    {
      sliceName: 'filters',
      storage: 'url',
      strategy: SyncStrategy.DEBOUNCED,
      debounceDelay: 300,
    },

    // Drafts: localStorage, scheduled backup
    {
      sliceName: 'drafts',
      storage: 'localStorage',
      strategy: SyncStrategy.SCHEDULED,
      scheduleInterval: 60000, // Every minute
    },
  ],
};
```

### Example 2: React Component Integration

```typescript
import { useAppSelector } from '@/stores/hooks/reduxHooks';
import { manualSync, clearSyncedState } from '@/middleware/stateSyncMiddleware';
import { syncConfig } from './syncConfig';

function MyComponent() {
  const authState = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    // Clear all synced state on logout
    clearSyncedState(syncConfig);

    // Dispatch logout action
    dispatch(logout());
  };

  const handleSaveReport = async () => {
    // Manually sync before critical operation
    manualSync('reports', reportsState, syncConfig);

    // Perform save
    await saveReport();
  };

  return <div>Component content</div>;
}
```

### Example 3: Error Handling & Audit Logging

```typescript
const config: StateSyncConfig = {
  slices: [
    {
      sliceName: 'patient',
      storage: 'sessionStorage',
      strategy: SyncStrategy.DEBOUNCED,
    },
  ],

  // Error handling for production
  onError: (error, context) => {
    console.error(`[Sync Error] ${context}:`, error);

    // Send to error tracking service
    errorTracker.captureException(error, {
      context,
      timestamp: Date.now(),
    });

    // Log to audit service for HIPAA compliance
    auditLog.recordError({
      type: 'STATE_SYNC_ERROR',
      error: error.message,
      context,
      timestamp: new Date().toISOString(),
    });
  },

  // Conflict logging for review
  onConflict: (conflict) => {
    console.warn('[Sync Conflict]', conflict);

    // Log conflicts for compliance review
    auditLog.recordConflict({
      type: 'STATE_SYNC_CONFLICT',
      sliceName: conflict.sliceName,
      localTimestamp: conflict.localTimestamp,
      remoteTimestamp: conflict.remoteTimestamp,
      timestamp: new Date().toISOString(),
    });
  },
};
```

## Testing

The middleware includes comprehensive unit tests:

```bash
npm run test -- stateSyncMiddleware.test.ts
```

Test coverage includes:
- Basic sync functionality
- All sync strategies
- State hydration
- Custom serializers
- Conflict resolution
- Error handling
- Storage type handling
- Manual sync
- State clearing

## Performance Considerations

### Optimization Tips

1. **Use Appropriate Strategies**
   - IMMEDIATE: Only for critical state
   - DEBOUNCED: For frequently changing state
   - THROTTLED: For high-frequency updates
   - ON_CHANGE: To avoid unnecessary writes

2. **Exclude Large Data**
   ```typescript
   {
     sliceName: 'documents',
     excludePaths: ['largeFileData', 'imageBlobs'],
   }
   ```

3. **Set Storage Limits**
   ```typescript
   {
     maxStorageSize: 5 * 1024 * 1024, // 5MB
   }
   ```

4. **Use Compression for Large State**
   ```typescript
   {
     sliceName: 'reports',
     compress: true,
   }
   ```

5. **Set Appropriate Max Age**
   ```typescript
   {
     maxAge: 24 * 60 * 60 * 1000, // 24 hours
   }
   ```

## Browser Compatibility

- **localStorage/sessionStorage**: All modern browsers
- **BroadcastChannel**: Chrome 54+, Firefox 38+, Safari 15.4+, Edge 79+
- **Fallback**: Gracefully degrades if BroadcastChannel unavailable

## Security Best Practices

1. **Never persist sensitive data**
   - Use `excludePaths` for tokens, passwords, PHI
   - Use sessionStorage for auth data

2. **Implement audit logging**
   - Use `onError` and `onConflict` callbacks
   - Log all sync operations for compliance

3. **Set appropriate retention**
   - Use `maxAge` for data expiration
   - Clear state on logout with `clearSyncedState`

4. **Limit storage size**
   - Set `maxStorageSize` to prevent quota issues
   - Monitor storage usage

5. **Validate state integrity**
   - Use checksums (automatically included)
   - Implement custom validators

## Troubleshooting

### State not persisting
- Check storage quota (may be full)
- Verify `maxStorageSize` limit
- Check browser privacy settings
- Enable `debug: true` for logging

### State not loading
- Check `maxAge` setting (may be stale)
- Verify storage key prefix
- Check for corrupted data
- Clear storage manually

### Cross-tab sync not working
- Verify `enableCrossTab: true`
- Check BroadcastChannel support
- Verify same origin policy
- Check channel name matches

### Performance issues
- Use DEBOUNCED or THROTTLED strategies
- Increase debounce/throttle delays
- Exclude large data from sync
- Enable compression for large state

## License

Part of the White Cross Healthcare Platform.

## Support

For issues or questions, refer to the main project documentation or contact the development team.
