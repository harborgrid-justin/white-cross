# V1 Routes Integration Guide

This guide shows how to integrate the new v1 routes into the main server index.ts file.

## Overview

The v1 routes provide a versioned API structure that allows for:
- **Parallel deployment** - Run old and new routes simultaneously
- **Gradual migration** - Migrate frontend endpoints one at a time
- **Safe rollback** - Disable v1 routes without affecting legacy routes

---

## Step 1: Import v1 Routes

In your main `src/index.ts` file, import the v1 routes:

```typescript
import { v1Routes } from './routes/v1';
```

---

## Step 2: Register Routes (Parallel Run)

Register both old and new routes to run simultaneously during the migration period:

```typescript
// Register existing routes (unchanged)
server.route([
  ...authRoutes,           // OLD: /api/auth/*
  ...studentRoutes,         // OLD: /api/students/*
  ...medicationRoutes,      // OLD: /api/medications/*
  // ... all other existing routes
]);

// Register NEW v1 routes
server.route(v1Routes);   // NEW: /api/v1/*
```

### Result: Both APIs Work Simultaneously

**Old routes continue to work:**
- `POST /api/auth/login` ✅ Works
- `GET /api/students` ✅ Works

**New routes also available:**
- `POST /api/v1/auth/login` ✅ Works (new implementation)
- `GET /api/v1/students` ✅ Works (when migrated)

---

## Step 3: Frontend Migration (Gradual)

Update frontend API client calls to use v1 endpoints gradually:

### Before (Old API)
```typescript
const response = await axios.post('/api/auth/login', { email, password });
```

### After (New V1 API)
```typescript
const response = await axios.post('/api/v1/auth/login', { email, password });
```

**Migration Strategy:**
1. Migrate one domain at a time (e.g., auth first, then students, etc.)
2. Test thoroughly after each domain migration
3. Monitor both old and new endpoint usage
4. Track any issues specific to v1 implementation

---

## Step 4: Complete Migration & Cleanup

After 100% of frontend calls are migrated to v1, remove old routes:

### During Migration (Parallel Run)
```typescript
server.route([
  ...authRoutes,           // OLD - remove when v1 complete
  ...studentRoutes,         // OLD - remove when v1 complete
  ...v1Routes               // NEW - keep
]);
```

### After Migration Complete
```typescript
// Only v1 routes remain
server.route(v1Routes);
```

---

## Monitoring & Metrics

Track usage of old vs new routes to monitor migration progress:

```typescript
server.events.on('response', (request) => {
  const isV1 = request.path.includes('/api/v1/');
  const isOld = request.path.includes('/api/') && !isV1;

  if (isOld) {
    console.warn(`Legacy route accessed: ${request.path}`);

    // Optional: Add deprecation warning header
    // request.response.header(
    //   'Warning',
    //   '299 - "API version deprecated. Please migrate to /api/v1/"'
    // );
  }
});
```

### Metrics to Track:
- **Old route usage count** - Should decrease over time
- **V1 route usage count** - Should increase over time
- **Error rates** - Compare old vs v1 routes
- **Response times** - Ensure v1 performs equivalently or better

---

## Rollback Plan

If issues occur with v1 routes, simply comment them out:

```typescript
// server.route(v1Routes);  // Commented = v1 disabled
```

Old routes continue to work unaffected. This provides a safe rollback mechanism during the migration period.

---

## Best Practices

1. **Test v1 Routes Thoroughly** - Ensure parity with old routes before migration
2. **Migrate Incrementally** - Don't switch all endpoints at once
3. **Monitor Closely** - Watch logs and metrics during migration
4. **Document Differences** - Note any behavior changes between old and v1
5. **Keep Old Routes Active** - Until 100% of traffic is on v1
6. **Communicate with Team** - Ensure all developers know about the migration timeline

---

## Route Organization

V1 routes are organized by domain in `/src/routes/v1/`:

```
routes/v1/
├── core/           # Authentication, users, access control
├── healthcare/     # Medications, health records
├── operations/     # Students, contacts, appointments
├── documents/      # Document management
├── compliance/     # Audit logs, compliance reports
├── communications/ # Messages, notifications
├── incidents/      # Incident reporting
├── analytics/      # Health metrics
└── system/         # System admin, integrations
```

All routes are aggregated in `/routes/v1/index.ts` and exported as a single array.

---

## Additional Resources

- **API Documentation**: `http://localhost:3001/docs` (Swagger UI)
- **Route Inventory**: See `docs/API_ROUTES_INVENTORY.md`
- **API Reference**: See `docs/API_QUICK_REFERENCE.md`
- **Database Schema**: See `docs/DATABASE_SCHEMA_MAPPING.md`
