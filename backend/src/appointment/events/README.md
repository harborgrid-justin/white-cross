# Appointment Events - Developer Guide

## Quick Start

### Emitting Events

```typescript
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppointmentCreatedEvent } from './events';

@Injectable()
export class AppointmentService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async createAppointment(dto: CreateAppointmentDto) {
    const appointment = await this.create(dto);

    // Emit event
    this.eventEmitter.emit(
      'appointment.created',
      new AppointmentCreatedEvent(
        {
          id: appointment.id,
          studentId: appointment.studentId,
          nurseId: appointment.nurseId,
          type: appointment.type,
          scheduledAt: appointment.scheduledAt,
          duration: appointment.duration,
          status: appointment.status,
          reason: appointment.reason,
        },
        {
          userId: currentUser.id,
          userRole: currentUser.role,
          requestId: request.id,
          ipAddress: request.ip,
          organizationId: organization.id,
          timestamp: new Date(),
        },
      ),
    );

    return appointment;
  }
}
```

### Listening to Events

```typescript
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppointmentCreatedEvent } from './events';

@Injectable()
export class MyAppointmentListener {
  @OnEvent('appointment.created')
  async handleAppointmentCreated(event: AppointmentCreatedEvent) {
    console.log('Appointment created:', event.appointment.id);

    // Your custom logic here
    await this.doSomething(event);
  }
}
```

## Available Events

### Appointment Lifecycle
- `appointment.created` - New appointment scheduled
- `appointment.updated` - Appointment modified
- `appointment.cancelled` - Appointment cancelled
- `appointment.rescheduled` - Appointment time changed
- `appointment.started` - Appointment in progress
- `appointment.completed` - Appointment finished
- `appointment.no-show` - Patient no-show

### Notifications
- `appointment.reminder` - Reminder notification (24h, 1h before)

### Waitlist
- `appointment.waitlist.added` - Student added to waitlist
- `appointment.waitlist.slot-available` - Cancelled slot available

## Event Structure

### AppointmentCreatedEvent

```typescript
{
  eventName: 'appointment.created',
  occurredAt: Date,
  appointment: {
    id: string,
    studentId: string,
    nurseId: string,
    type: string,
    scheduledAt: Date,
    duration: number,
    status: string,
    reason?: string
  },
  context: {
    userId: string,
    userRole: string,
    requestId?: string,
    ipAddress?: string,
    organizationId?: string,
    timestamp: Date
  }
}
```

## Audit Logging

All events support audit logging:

```typescript
const event = new AppointmentCreatedEvent(...);
const auditLog = event.toAuditLog();

// Save to audit database
await this.auditService.log(auditLog);
```

## Best Practices

1. **Always Include Request Context**: Ensures HIPAA compliance and audit trail
2. **Use Minimal PHI**: Events should contain IDs only, not full patient data
3. **Don't Block on Events**: Listeners execute asynchronously
4. **Handle Errors Gracefully**: Listeners should not throw exceptions
5. **Log Event Emission**: Use structured logging for debugging

## Testing

```typescript
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';

describe('AppointmentService', () => {
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [AppointmentService],
    }).compile();

    eventEmitter = module.get(EventEmitter2);
  });

  it('should emit appointment.created event', (done) => {
    eventEmitter.on('appointment.created', (event) => {
      expect(event.appointment.id).toBeDefined();
      done();
    });

    service.createAppointment(dto);
  });
});
```

## Migration from Direct Service Calls

### Before
```typescript
constructor(
  @Inject(forwardRef(() => WebSocketService))
  private readonly websocketService: WebSocketService,
) {}

async createAppointment(dto) {
  const appointment = await this.create(dto);
  await this.websocketService.broadcast(...); // Direct call
  return appointment;
}
```

### After
```typescript
constructor(
  private readonly eventEmitter: EventEmitter2,
) {}

async createAppointment(dto) {
  const appointment = await this.create(dto);
  this.eventEmitter.emit('appointment.created', ...); // Event-driven
  return appointment;
}
```

## Performance

- Event emission: < 1ms overhead
- Listeners execute asynchronously
- Main operation completes immediately
- No blocking on listener execution

## Troubleshooting

### Events Not Being Handled

1. Check listener is registered in module providers
2. Verify event name matches exactly (case-sensitive)
3. Check EventEmitterModule is imported
4. Enable debug logging: `EventEmitterModule.forRoot({ verboseMemoryLeak: true })`

### Circular Dependencies

If you still see circular dependencies:
1. Ensure you're using EventEmitter2, not direct service injection
2. Check listeners are in separate modules from emitters
3. Use `@Global()` on modules providing listeners

## See Also

- [Event-Driven Architecture Summary](/EVENT_DRIVEN_ARCHITECTURE_SUMMARY.md)
- [NestJS Event Emitter Docs](https://docs.nestjs.com/techniques/events)
- [NESTJS_SERVICES_REVIEW.md](../../../NESTJS_SERVICES_REVIEW.md) Section 9.1
