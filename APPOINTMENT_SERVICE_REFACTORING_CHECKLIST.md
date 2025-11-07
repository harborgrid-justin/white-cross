# AppointmentService Refactoring Checklist

**Status:** 🟡 PENDING (Phase 2)
**Priority:** HIGH
**Estimated Effort:** 2-4 hours
**File:** `/workspaces/white-cross/backend/src/appointment/appointment.service.ts`

---

## ✅ Phase 1 Complete

- ✅ Event classes created (`appointment.events.ts`)
- ✅ WebSocket listener created
- ✅ Email listener created
- ✅ Modules updated
- ✅ Integration tests created
- ✅ Documentation written

---

## 🔧 Phase 2: Service Refactoring

### Step 1: Update Imports (Lines 7-20)

**Current:**
```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  Inject,
  forwardRef,
  OnModuleDestroy,
} from '@nestjs/common';
import { WebSocketService } from '../infrastructure/websocket/websocket.service';
```

**Replace With:**
```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  AppointmentCreatedEvent,
  AppointmentUpdatedEvent,
  AppointmentCancelledEvent,
  AppointmentRescheduledEvent,
  AppointmentStartedEvent,
  AppointmentCompletedEvent,
  AppointmentNoShowEvent,
  AppointmentReminderEvent,
  WaitlistEntryAddedEvent,
  WaitlistSlotAvailableEvent,
  RequestContext,
  AppointmentEventData,
} from './events';
```

**Changes:**
- ❌ Remove `Inject` and `forwardRef` imports
- ❌ Remove `OnModuleDestroy` if only used for WebSocket cleanup
- ❌ Remove `WebSocketService` import
- ✅ Add `EventEmitter2` import
- ✅ Add event class imports

---

### Step 2: Update Constructor (Lines 89-102)

**Current:**
```typescript
constructor(
  @InjectModel(Appointment)
  private readonly appointmentModel: typeof Appointment,
  @InjectModel(AppointmentReminder)
  private readonly reminderModel: typeof AppointmentReminder,
  @InjectModel(AppointmentWaitlist)
  private readonly waitlistModel: typeof AppointmentWaitlist,
  @InjectModel(User)
  private readonly userModel: typeof User,
  @InjectConnection()
  private readonly sequelize: Sequelize,
  @Inject(forwardRef(() => WebSocketService))
  private readonly websocketService: WebSocketService,
) {}
```

**Replace With:**
```typescript
constructor(
  @InjectModel(Appointment)
  private readonly appointmentModel: typeof Appointment,
  @InjectModel(AppointmentReminder)
  private readonly reminderModel: typeof AppointmentReminder,
  @InjectModel(AppointmentWaitlist)
  private readonly waitlistModel: typeof AppointmentWaitlist,
  @InjectModel(User)
  private readonly userModel: typeof User,
  @InjectConnection()
  private readonly sequelize: Sequelize,
  private readonly eventEmitter: EventEmitter2,
) {}
```

**Changes:**
- ❌ Remove `@Inject(forwardRef(() => WebSocketService))` and `websocketService` parameter
- ✅ Add `eventEmitter: EventEmitter2` parameter

---

### Step 3: Add Helper Methods (Before line 104)

**Add These Methods:**

```typescript
/**
 * Get request context for HIPAA-compliant event logging
 * Extracts user, role, request ID, IP address from current request
 */
private getRequestContext(): RequestContext {
  // TODO: Integrate with RequestContextService from shared module
  // For now, return placeholder context
  return {
    userId: 'system', // Replace with actual user ID from request context
    userRole: 'SYSTEM', // Replace with actual user role
    requestId: uuidv4(), // Generate or extract from request
    ipAddress: undefined, // Extract from request
    organizationId: undefined, // Extract from tenant context
    timestamp: new Date(),
  };
}

/**
 * Map AppointmentEntity to AppointmentEventData
 * Filters out full PHI, includes only essential fields
 */
private mapToEventData(appointment: AppointmentEntity): AppointmentEventData {
  return {
    id: appointment.id,
    studentId: appointment.studentId,
    nurseId: appointment.nurseId,
    type: appointment.type,
    scheduledAt: appointment.scheduledAt,
    duration: appointment.duration,
    status: appointment.status,
    reason: appointment.reason,
  };
}
```

---

### Step 4: Update createAppointment Method (Lines 249-360)

**Current (Lines 339-350):**
```typescript
// Send real-time notification about new appointment
try {
  await this.sendAppointmentNotification(
    appointment,
    'appointment:created',
  );
} catch (error) {
  this.logger.error(
    `Failed to send WebSocket notification: ${error.message}`,
  );
  // Don't fail the operation if notification fails
}
```

**Replace With:**
```typescript
// Emit appointment created event
this.eventEmitter.emit(
  'appointment.created',
  new AppointmentCreatedEvent(
    this.mapToEventData(appointment),
    this.getRequestContext(),
  ),
);

this.logger.log(`Emitted appointment.created event for: ${appointment.id}`);
```

---

### Step 5: Update updateAppointment Method (Lines 371-482)

**Current (Lines 461-472):**
```typescript
// Send real-time notification about appointment update
try {
  await this.sendAppointmentNotification(
    appointment,
    'appointment:updated',
  );
} catch (error) {
  this.logger.error(
    `Failed to send WebSocket notification: ${error.message}`,
  );
  // Don't fail the operation if notification fails
}
```

**Replace With:**
```typescript
// Determine if this is a reschedule
const isReschedule = updateDto.scheduledDate && updateDto.scheduledDate !== existingAppointment.scheduledAt;

if (isReschedule) {
  // Emit rescheduled event
  this.eventEmitter.emit(
    'appointment.rescheduled',
    new AppointmentRescheduledEvent(
      this.mapToEventData(appointment),
      existingAppointment.scheduledAt,
      updateDto.scheduledDate!,
      this.getRequestContext(),
    ),
  );
  this.logger.log(`Emitted appointment.rescheduled event for: ${appointment.id}`);
} else {
  // Emit updated event
  this.eventEmitter.emit(
    'appointment.updated',
    new AppointmentUpdatedEvent(
      this.mapToEventData(appointment),
      {
        status: updateDto.status !== existingAppointment.status ? existingAppointment.status as any : undefined,
        reason: updateDto.reason !== existingAppointment.reason ? existingAppointment.reason : undefined,
      },
      this.getRequestContext(),
    ),
  );
  this.logger.log(`Emitted appointment.updated event for: ${appointment.id}`);
}
```

---

### Step 6: Update cancelAppointment Method (Lines 492-551)

**After line 541, Add:**
```typescript
// Emit appointment cancelled event
this.eventEmitter.emit(
  'appointment.cancelled',
  new AppointmentCancelledEvent(
    id,
    this.mapToEventData(await this.getAppointmentById(id)),
    reason || 'No reason provided',
    this.getRequestContext(),
  ),
);

this.logger.log(`Emitted appointment.cancelled event for: ${id}`);
```

---

### Step 7: Update startAppointment Method (Lines 556-575)

**After updating status, Add:**
```typescript
const appointment = await this.getAppointmentById(id);

// Emit appointment started event
this.eventEmitter.emit(
  'appointment.started',
  new AppointmentStartedEvent(
    this.mapToEventData(appointment),
    this.getRequestContext(),
  ),
);

this.logger.log(`Emitted appointment.started event for: ${id}`);

return appointment;
```

---

### Step 8: Update completeAppointment Method (Lines 582-620)

**After updating status, Add:**
```typescript
const appointment = await this.getAppointmentById(id);

// Emit appointment completed event
this.eventEmitter.emit(
  'appointment.completed',
  new AppointmentCompletedEvent(
    this.mapToEventData(appointment),
    completionData?.notes,
    completionData?.outcomes,
    completionData?.followUpRequired,
    this.getRequestContext(),
  ),
);

this.logger.log(`Emitted appointment.completed event for: ${id}`);

return appointment;
```

---

### Step 9: Update markNoShow Method (Lines 625-654)

**After updating status, Add:**
```typescript
const appointment = await this.getAppointmentById(id);

// Emit appointment no-show event
this.eventEmitter.emit(
  'appointment.no-show',
  new AppointmentNoShowEvent(
    this.mapToEventData(appointment),
    this.getRequestContext(),
  ),
);

this.logger.log(`Emitted appointment.no-show event for: ${id}`);
```

---

### Step 10: Update addToWaitlist Method (Lines 960-1001)

**After creating waitlist entry, Add:**
```typescript
// Emit waitlist entry added event
this.eventEmitter.emit(
  'appointment.waitlist.added',
  new WaitlistEntryAddedEvent(
    waitlistEntry.id,
    data.studentId,
    data.preferredDate,
    data.priority,
    this.getRequestContext(),
  ),
);

this.logger.log(`Emitted appointment.waitlist.added event for: ${waitlistEntry.id}`);
```

---

### Step 11: Update processWaitlistForSlot Method (Lines 1108-1153)

**After notifying waitlist entry, Add:**
```typescript
// Emit waitlist slot available event
const notifiedEntries = waitlistEntries.map(e => e.id!);
this.eventEmitter.emit(
  'appointment.waitlist.slot-available',
  new WaitlistSlotAvailableEvent(
    nurseId,
    scheduledDate,
    duration,
    notifiedEntries,
  ),
);

this.logger.log(`Emitted appointment.waitlist.slot-available event, notified ${notifiedEntries.length} entries`);
```

---

### Step 12: Remove sendAppointmentNotification Method (Lines 2343-2400)

**DELETE ENTIRE METHOD:**
```typescript
/**
 * Send real-time WebSocket notification for appointment events
 * ...
 */
private async sendAppointmentNotification(...) {
  // DELETE THIS ENTIRE METHOD
}
```

**Reason:** This functionality is now handled by `AppointmentWebSocketListener`

---

## 🧪 Testing Checklist

After refactoring, verify:

- [ ] All existing unit tests still pass
- [ ] Integration tests pass
- [ ] No `forwardRef()` imports remain
- [ ] No direct `WebSocketService` injection
- [ ] Events are emitted in all CRUD operations
- [ ] Audit logs are generated correctly
- [ ] WebSocket notifications still work (via listeners)
- [ ] Email notifications still work (via listeners)
- [ ] Error handling is graceful
- [ ] Performance is acceptable (< 1ms event overhead)

---

## 🔍 Validation Steps

1. **Run TypeScript Compiler:**
   ```bash
   npm run build
   ```

2. **Run Unit Tests:**
   ```bash
   npm test -- appointment.service.spec.ts
   ```

3. **Run Integration Tests:**
   ```bash
   npm test -- event-driven-integration.spec.ts
   ```

4. **Check for Circular Dependencies:**
   ```bash
   npx madge --circular backend/src
   ```

5. **Manual Testing:**
   - Create appointment → Verify WebSocket notification received
   - Cancel appointment → Verify email sent
   - Update appointment → Verify audit log created

---

## 📝 Code Review Checklist

Before submitting PR:

- [ ] All `forwardRef()` removed
- [ ] `EventEmitter2` injected correctly
- [ ] Helper methods added (`getRequestContext`, `mapToEventData`)
- [ ] All CRUD methods emit events
- [ ] Event names match listener decorators (e.g., `'appointment.created'`)
- [ ] Audit logging works correctly
- [ ] No breaking changes to API contracts
- [ ] Documentation updated
- [ ] Tests updated and passing
- [ ] ESLint/Prettier checks pass

---

## 🚨 Common Pitfalls

1. **Event Name Mismatch:**
   - ✅ Correct: `this.eventEmitter.emit('appointment.created', ...)`
   - ❌ Wrong: `this.eventEmitter.emit('appointmentCreated', ...)`

2. **Missing Request Context:**
   - ✅ Always call `this.getRequestContext()` when creating events
   - ❌ Never pass empty/undefined context

3. **Full Entity in Event:**
   - ✅ Use `this.mapToEventData(appointment)` to filter PHI
   - ❌ Never pass full `AppointmentEntity` object in events

4. **Forgetting to Emit:**
   - ✅ Emit event for EVERY state change
   - ❌ Missing event emission = no WebSocket/email notification

5. **Blocking on Listeners:**
   - ✅ Events emit asynchronously, don't await
   - ✅ Listeners execute in background

---

## 📊 Expected Results

| Metric | Before | After |
|--------|--------|-------|
| Circular Dependencies | 1+ | 0 |
| Direct WebSocket Calls | 8+ | 0 |
| Event Emissions | 0 | 10+ |
| Lines of Code | ~2,400 | ~2,350 |
| Test Coverage | 75% | 85%+ |

---

## 🎯 Next PR Requirements

**PR Title:** `refactor(appointment): Implement event-driven architecture to eliminate circular dependencies`

**PR Description:**
```markdown
## Summary
Refactored AppointmentService to use event-driven architecture, eliminating circular dependency with WebSocketService.

## Changes
- ❌ Removed `forwardRef()` injection
- ✅ Added `EventEmitter2` injection
- ✅ Replaced direct WebSocket calls with event emissions
- ✅ Added helper methods for request context and event mapping
- ✅ Updated 10+ methods to emit domain events
- ❌ Removed `sendAppointmentNotification()` method

## Testing
- ✅ All existing unit tests pass
- ✅ Integration tests added and passing
- ✅ No circular dependencies detected
- ✅ WebSocket notifications still work via listeners
- ✅ Email notifications still work via listeners

## Breaking Changes
None - backward compatible

## References
- Phase 1 PR: [Link to event classes PR]
- Architecture docs: EVENT_DRIVEN_ARCHITECTURE_SUMMARY.md
- NESTJS_SERVICES_REVIEW.md Section 9.1
```

---

**Last Updated:** 2025-11-07
**Status:** 🟡 Ready for Implementation
**Assignee:** [Your Name]
