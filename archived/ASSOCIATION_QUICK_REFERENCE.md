# Sequelize Associations Quick Reference Guide

## Updated Association Patterns

### Student Model Associations

```typescript
// Access all student health data with eager loading
const student = await Student.findByPk(studentId, {
  include: [
    'appointments',      // All appointments
    'prescriptions',     // All prescriptions
    'clinicVisits',      // All clinic visits
    'allergies',         // All allergies
    'chronicConditions', // All chronic conditions
    'vaccinations',      // All vaccinations
    'vitalSigns',        // All vital signs
    'clinicalNotes',     // All clinical notes
    'incidentReports',   // All incident reports
    'healthRecords'      // All health records
  ]
});

// Access nested data
console.log(student.appointments);     // Array of Appointment objects
console.log(student.allergies);        // Array of Allergy objects
```

### User (Nurse) Model Associations

```typescript
// Access nurse activity and workload
const nurse = await User.findByPk(nurseId, {
  include: [
    'appointments',        // Appointments assigned to nurse
    'clinicalNotes',       // Clinical notes created by nurse
    'sentMessages',        // Messages sent by nurse
    'createdAlerts',       // Alerts created by nurse
    'acknowledgedAlerts',  // Alerts acknowledged by nurse
    'resolvedAlerts',      // Alerts resolved by nurse
    'reportedIncidents',   // Incidents reported by nurse
    'prescriptions',       // Prescriptions written by nurse
    'clinicVisits'         // Clinic visits attended by nurse
  ]
});

// Calculate workload
const workload = {
  totalAppointments: nurse.appointments.length,
  pendingAlerts: nurse.createdAlerts.filter(a => a.status === 'ACTIVE').length,
  clinicVisitsToday: nurse.clinicVisits.filter(v => isToday(v.checkInTime)).length
};
```

### School Model Associations

```typescript
// Access school-wide data
const school = await School.findByPk(schoolId, {
  include: [
    'users',            // All staff/nurses at school
    'students',         // All students enrolled
    'alerts',           // All alerts for school
    'incidentReports'   // All incident reports
  ]
});

// School-wide reporting
const report = {
  totalStudents: school.students.length,
  activeStudents: school.students.filter(s => s.isActive).length,
  totalStaff: school.users.length,
  activeAlerts: school.alerts.filter(a => a.status === 'ACTIVE').length
};
```

### Conversation Model Associations

```typescript
// Load conversation with message history
const conversation = await Conversation.findByPk(conversationId, {
  include: [{
    association: 'messages',
    order: [['createdAt', 'ASC']],
    limit: 50
  }, {
    association: 'participants'
  }]
});

// Access messages
console.log(conversation.messages); // Array of Message objects
```

## Reverse Association Lookups

### From Appointment to Student/Nurse

```typescript
const appointment = await Appointment.findByPk(appointmentId, {
  include: [
    'student',  // Student details
    'nurse'     // Nurse details
  ]
});

console.log(appointment.student.fullName);
console.log(appointment.nurse.fullName);
```

### From Prescription to Student/Prescriber

```typescript
const prescription = await Prescription.findByPk(prescriptionId, {
  include: [
    'student',    // Student receiving prescription
    'prescriber'  // Nurse who prescribed
  ]
});
```

### From ClinicVisit to Student/Nurse

```typescript
const visit = await ClinicVisit.findByPk(visitId, {
  include: [
    'student',         // Student who visited
    'attendingNurse'   // Nurse who attended
  ]
});
```

### From IncidentReport to Student/Reporter

```typescript
const incident = await IncidentReport.findByPk(incidentId, {
  include: [
    'student',   // Student involved
    'reporter'   // User who reported
  ]
});
```

### From ClinicalNote to Student/Author

```typescript
const note = await ClinicalNote.findByPk(noteId, {
  include: [
    'student',  // Student note is about
    'author',   // Nurse who authored
    'visit'     // Related clinic visit (if any)
  ]
});
```

## Complex Queries

### Student Dashboard Query

```typescript
const studentDashboard = await Student.findByPk(studentId, {
  include: [
    {
      association: 'appointments',
      where: {
        scheduledAt: { [Op.gte]: new Date() },
        status: { [Op.in]: ['SCHEDULED', 'IN_PROGRESS'] }
      },
      required: false,
      order: [['scheduledAt', 'ASC']]
    },
    {
      association: 'prescriptions',
      where: {
        status: { [Op.in]: ['FILLED', 'PICKED_UP'] },
        endDate: { [Op.or]: [null, { [Op.gte]: new Date() }] }
      },
      required: false
    },
    {
      association: 'allergies',
      where: { active: true },
      required: false
    },
    {
      association: 'chronicConditions',
      where: { isActive: true },
      required: false
    }
  ]
});
```

### Nurse Workload Query

```typescript
const nurseWorkload = await User.findByPk(nurseId, {
  include: [
    {
      association: 'appointments',
      where: {
        scheduledAt: {
          [Op.between]: [startOfDay, endOfDay]
        },
        status: { [Op.ne]: 'CANCELLED' }
      },
      required: false
    },
    {
      association: 'clinicVisits',
      where: {
        checkInTime: {
          [Op.between]: [startOfWeek, endOfWeek]
        }
      },
      required: false
    },
    {
      association: 'createdAlerts',
      where: {
        status: 'ACTIVE',
        requiresAcknowledgment: true
      },
      required: false
    }
  ]
});
```

### School Statistics Query

```typescript
const schoolStats = await School.findByPk(schoolId, {
  include: [
    {
      association: 'students',
      attributes: ['id', 'isActive'],
      where: { isActive: true },
      required: false
    },
    {
      association: 'alerts',
      where: {
        severity: { [Op.in]: ['HIGH', 'CRITICAL', 'EMERGENCY'] },
        status: 'ACTIVE'
      },
      required: false
    },
    {
      association: 'incidentReports',
      where: {
        occurredAt: {
          [Op.gte]: startOfMonth
        }
      },
      required: false
    }
  ]
});
```

## Cascade Behavior Reference

### CASCADE (onDelete)
Data is automatically deleted when parent is deleted:
- Student → HealthRecords
- Student → Appointments
- Student → Prescriptions
- Student → ClinicVisits
- Student → ClinicalNotes
- Student → VitalSigns
- Conversation → Messages

### RESTRICT (onDelete)
Prevents deletion if related records exist (audit trail protection):
- User (as prescriber) → Prescriptions
- User (as attendedBy) → ClinicVisits
- User (as reportedBy) → IncidentReports
- User (as createdBy) → ClinicalNotes

### SET NULL (onDelete)
Foreign key is set to NULL when parent is deleted:
- User (as nurseId) → Appointments (appointments remain valid)

## Best Practices

### 1. Always Use Aliases
```typescript
// Good
include: ['student', 'nurse', 'prescriber']

// Avoid
include: [Student, User]
```

### 2. Prevent N+1 Queries
```typescript
// Bad: N+1 queries
const students = await Student.findAll();
for (const student of students) {
  const appointments = await student.getAppointments(); // N queries
}

// Good: Single query with eager loading
const students = await Student.findAll({
  include: ['appointments']
});
students.forEach(student => {
  console.log(student.appointments); // Already loaded
});
```

### 3. Use Required: False for Optional Includes
```typescript
// Include only if exists, don't filter out students without appointments
const students = await Student.findAll({
  include: [{
    association: 'appointments',
    required: false  // LEFT JOIN instead of INNER JOIN
  }]
});
```

### 4. Selective Attribute Loading
```typescript
// Only load needed fields
const student = await Student.findByPk(studentId, {
  include: [{
    association: 'appointments',
    attributes: ['id', 'scheduledAt', 'status', 'type']
  }]
});
```

### 5. Pagination with Associations
```typescript
const results = await Student.findAndCountAll({
  include: ['appointments'],
  limit: 20,
  offset: page * 20,
  distinct: true // Prevents count issues with joins
});
```

## Migration Required

Before using these associations in production, ensure database foreign key constraints match:

```bash
# Generate migration
npm run migration:generate -- AddForeignKeyConstraints

# Review generated migration
# Apply to development
npm run migration:run

# Test thoroughly
# Apply to staging/production
```

## Testing Recommendations

```typescript
describe('Student Associations', () => {
  it('should load all appointments', async () => {
    const student = await Student.findByPk(studentId, {
      include: ['appointments']
    });
    expect(student.appointments).toBeDefined();
    expect(Array.isArray(student.appointments)).toBe(true);
  });

  it('should cascade delete health records', async () => {
    const studentId = testStudent.id;
    await testStudent.destroy();

    const orphanedRecords = await HealthRecord.findAll({
      where: { studentId }
    });
    expect(orphanedRecords.length).toBe(0);
  });
});
```

## Support

For questions or issues:
1. Review this guide
2. Check `/workspaces/white-cross/ASSOCIATION_FIXES_SUMMARY.md`
3. Consult Sequelize v6 documentation: https://sequelize.org/api/v6/
4. Contact development team

---

**Last Updated**: 2025-11-03
**Version**: 1.0.0
