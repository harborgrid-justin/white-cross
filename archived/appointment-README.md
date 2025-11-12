# Appointment Module - NestJS Implementation

## Overview
Comprehensive appointment management system for healthcare scheduling with conflict detection, business rules validation, and complete appointment lifecycle management.

## Features

### Core Functionality
- **CRUD Operations**: Create, read, update, and delete appointments
- **Status Lifecycle**: Finite state machine (SCHEDULED → IN_PROGRESS → COMPLETED)
- **Conflict Detection**: Automatic checking for scheduling conflicts with buffer time
- **Availability Management**: Real-time slot availability calculation
- **Business Rules**: Comprehensive validation (hours, duration, weekends, etc.)
- **Pagination & Filtering**: Advanced query capabilities for appointments

### Scheduling Features
- **Business Hours**: 8:00 AM - 5:00 PM, Monday-Friday
- **Time Slots**: 30-minute default slots (configurable)
- **Duration Range**: 15-120 minutes in 15-minute increments
- **Buffer Time**: 15-minute buffer between appointments
- **Conflict Detection**: Multi-appointment conflict checking
- **Maximum Load**: 16 appointments per nurse per day

### Business Rules
- Appointments must be scheduled in the future
- Must fall within business hours (8 AM - 5 PM)
- Cannot be scheduled on weekends
- Minimum 2-hour cancellation notice
- Cannot start more than 1 hour early
- Final states (completed, cancelled, no-show) cannot be modified

## API Endpoints

### List Appointments
```
GET /appointments
Query Parameters:
  - nurseId: string (UUID)
  - studentId: string (UUID)
  - status: SCHEDULED | IN_PROGRESS | COMPLETED | CANCELLED | NO_SHOW
  - appointmentType: ROUTINE_CHECKUP | MEDICATION_ADMINISTRATION | ...
  - dateFrom: Date
  - dateTo: Date
  - page: number (default: 1)
  - limit: number (default: 20, max: 100)

Response: {
  data: Appointment[],
  pagination: { page, limit, total, pages }
}
```

### Get Single Appointment
```
GET /appointments/:id
Response: Appointment
```

### Create Appointment
```
POST /appointments
Body: {
  studentId: string (UUID, required)
  nurseId: string (UUID, required)
  appointmentType: string (enum, required)
  scheduledDate: Date (required)
  duration: number (optional, 15-120, default: 30)
  reason: string (optional)
  notes: string (optional)
}
Response: Appointment
```

### Update Appointment
```
PATCH /appointments/:id
Body: Partial<CreateAppointmentDto> & {
  status?: AppointmentStatus
}
Response: Appointment
```

### Cancel Appointment
```
DELETE /appointments/:id?reason=string
Response: Appointment (with CANCELLED status)
```

### Start Appointment
```
POST /appointments/:id/start
Response: Appointment (with IN_PROGRESS status)
```

### Complete Appointment
```
POST /appointments/:id/complete
Body (optional): {
  notes?: string
  outcomes?: string
  followUpRequired?: boolean
  followUpDate?: Date
}
Response: Appointment (with COMPLETED status)
```

### Mark No-Show
```
POST /appointments/:id/no-show
Response: Appointment (with NO_SHOW status)
```

### Get Upcoming Appointments
```
GET /appointments/nurse/:nurseId/upcoming?limit=10
Response: Appointment[]
```

### Check Availability
```
GET /appointments/availability/:nurseId?date=YYYY-MM-DD&duration=30
Response: AvailabilitySlot[] {
  start: Date,
  end: Date,
  available: boolean,
  conflictingAppointment?: { id, student, reason }
}
```

## Architecture

### Directory Structure
```
src/appointment/
├── dto/                                    # Data Transfer Objects
│   ├── create-appointment.dto.ts           # Creation validation
│   ├── update-appointment.dto.ts           # Update validation
│   ├── appointment-filters.dto.ts          # Query filtering
│   └── index.ts
├── entities/                               # Entity interfaces
│   ├── appointment.entity.ts               # Appointment entity
│   └── index.ts
├── services/                               # Business logic
│   ├── appointment.service.ts              # Main service
│   └── index.ts
├── validators/                             # Business rules
│   ├── appointment-validation.ts           # Validation logic
│   ├── status-transitions.ts               # State machine
│   └── index.ts
├── appointment.controller.ts               # REST endpoints
├── appointment.module.ts                   # Module definition
├── appointment.service.ts                  # Service re-export
└── README.md                               # This file
```

### State Machine (Status Transitions)
```
┌─────────────┐
│  SCHEDULED  │ (Initial state)
└──────┬──────┘
       │
       ├─────→ [IN_PROGRESS] ─────→ [COMPLETED] (Final)
       │
       ├─────→ [CANCELLED] (Final)
       │
       └─────→ [NO_SHOW] (Final)
```

**Transition Rules**:
- SCHEDULED: Can transition to IN_PROGRESS, COMPLETED, CANCELLED, or NO_SHOW
- IN_PROGRESS: Can transition to COMPLETED or CANCELLED
- COMPLETED, CANCELLED, NO_SHOW: Final states, no transitions allowed

## DTOs

### CreateAppointmentDto
```typescript
{
  studentId: string;          // UUID, required
  nurseId: string;            // UUID, required
  appointmentType: AppointmentType;  // Enum, required
  scheduledDate: Date;        // Required
  duration?: number;          // 15-120 minutes, default: 30
  reason?: string;
  notes?: string;
}
```

### AppointmentType Enum
- `ROUTINE_CHECKUP`
- `MEDICATION_ADMINISTRATION`
- `INJURY_ASSESSMENT`
- `ILLNESS_EVALUATION`
- `FOLLOW_UP`
- `SCREENING`
- `EMERGENCY`

### AppointmentStatus Enum
- `SCHEDULED` - Appointment is scheduled
- `IN_PROGRESS` - Appointment is currently happening
- `COMPLETED` - Appointment finished successfully
- `CANCELLED` - Appointment was cancelled
- `NO_SHOW` - Student did not arrive

## Validation Rules

### Timing Validations
- **Future Date**: Appointment must be in the future
- **Business Hours**: 8:00 AM - 5:00 PM
- **No Weekends**: Monday-Friday only
- **Duration**: 15-120 minutes in 15-minute increments
- **Cancellation Notice**: Minimum 2 hours in advance
- **Start Timing**: Cannot start >1 hour before scheduled time

### Operational Validations
- **Max Appointments**: 16 per nurse per day
- **Buffer Time**: 15 minutes between appointments
- **Final States**: Cannot modify completed/cancelled/no-show appointments

## Usage Examples

### Create an Appointment
```typescript
const appointment = await appointmentService.createAppointment({
  studentId: 'student-uuid',
  nurseId: 'nurse-uuid',
  appointmentType: AppointmentType.ROUTINE_CHECKUP,
  scheduledDate: new Date('2025-10-26T10:00:00Z'),
  duration: 30,
  reason: 'Annual health screening'
});
```

### Check Availability
```typescript
const slots = await appointmentService.getAvailableSlots(
  'nurse-uuid',
  new Date('2025-10-26'),
  30 // slot duration
);

// Returns: [
//   { start: Date, end: Date, available: true },
//   { start: Date, end: Date, available: false, conflictingAppointment: {...} },
//   ...
// ]
```

### Update Appointment Status
```typescript
// Start appointment
const started = await appointmentService.startAppointment('appointment-id');

// Complete appointment
const completed = await appointmentService.completeAppointment(
  'appointment-id',
  {
    notes: 'Administered medication successfully',
    outcomes: 'No adverse reactions',
    followUpRequired: true,
    followUpDate: new Date('2025-11-02')
  }
);
```

### Filter Appointments
```typescript
const result = await appointmentService.getAppointments({
  nurseId: 'nurse-uuid',
  status: AppointmentStatus.SCHEDULED,
  dateFrom: new Date('2025-10-26'),
  dateTo: new Date('2025-10-31'),
  page: 1,
  limit: 20
});

console.log(`Found ${result.pagination.total} appointments`);
```

## Dependencies

### Required
- `@nestjs/common` - NestJS core
- `@nestjs/core` - NestJS core
- `class-validator` - DTO validation
- `class-transformer` - DTO transformation
- `@nestjs/mapped-types` - PartialType support

### For Full Implementation
- Database ORM: `@nestjs/sequelize` OR `@nestjs/typeorm`
- Models: Student, User (nurse) entities
- Communication service (for reminders)
- Job scheduler (for batch processing)

## Testing

### Unit Tests
```bash
npm run test -- appointment
```

### E2E Tests
```bash
npm run test:e2e -- appointment
```

## Future Enhancements

### Planned Features
- **Reminder Service**: Automatic email/SMS reminders (24h, 1h before)
- **Waitlist Management**: Priority-based slot filling
- **Recurring Appointments**: Daily/weekly/monthly patterns
- **Statistics**: Completion rates, no-show analytics
- **Calendar Export**: iCalendar format for external calendars
- **Nurse Availability**: Manage nurse schedules and time off
- **Advanced Scheduling**: AI-powered slot suggestions

### Integration Points
- Communication service for notifications
- Student module for student records
- User module for nurse information
- Audit logging for HIPAA compliance

## Configuration

### Environment Variables (future)
```env
APPOINTMENT_BUSINESS_HOURS_START=08:00
APPOINTMENT_BUSINESS_HOURS_END=17:00
APPOINTMENT_DEFAULT_DURATION=30
APPOINTMENT_BUFFER_TIME=15
APPOINTMENT_MAX_PER_DAY=16
APPOINTMENT_MIN_CANCELLATION_HOURS=2
```

## Error Handling

All validation errors throw `BadRequestException` with descriptive messages:
- "Appointment must be scheduled for a future date and time"
- "Appointment duration must be at least 15 minutes"
- "Appointments cannot be scheduled on weekends"
- "Appointments must be cancelled at least 2 hours in advance"
- "Cannot transition from SCHEDULED to CANCELLED. Allowed transitions: ..."

Not found errors throw `NotFoundException`:
- "Appointment with ID {id} not found"

## HIPAA Compliance

### PHI Protection
- All appointment data contains Protected Health Information (PHI)
- Audit logging recommended for all operations
- Access control via authentication guards (to be implemented)
- Role-based authorization (RBAC) required

### Recommended Security Measures
- Implement JWT authentication guards
- Add role-based access control (nurse, admin, student)
- Log all PHI access for audit trails
- Encrypt data at rest and in transit
- Implement session management
- Add IP filtering for sensitive operations

## Support

For issues or questions, please refer to:
- Module documentation: `src/appointment/README.md` (this file)
- Planning document: `.temp/plan-A1B2C3.md`
- Progress report: `.temp/progress-A1B2C3.md`
- Checklist: `.temp/checklist-A1B2C3.md`

## License
UNLICENSED - White Cross Healthcare Platform
