# Association Fixes Validation Checklist

## Pre-Deployment Validation

Use this checklist to ensure all association fixes are working correctly before deploying to production.

## Phase 1: Code Review ✅

- [x] All @ForeignKey decorators added to foreign key columns
- [x] All BelongsTo associations have proper aliases
- [x] All HasMany associations added to parent models
- [x] Cascade rules properly configured (CASCADE, RESTRICT, SET NULL)
- [x] TypeScript compilation successful with no new errors
- [x] No circular dependency issues

## Phase 2: Unit Tests

### Student Model Tests

- [ ] **Test eager loading all associations**
  ```typescript
  const student = await Student.findByPk(testStudentId, {
    include: ['appointments', 'prescriptions', 'clinicVisits', 'allergies',
              'chronicConditions', 'vaccinations', 'vitalSigns', 'clinicalNotes']
  });
  expect(student.appointments).toBeDefined();
  ```

- [ ] **Test CASCADE on student deletion**
  ```typescript
  const studentId = testStudent.id;
  await HealthRecord.create({ studentId, ... });
  await testStudent.destroy();
  const orphaned = await HealthRecord.findAll({ where: { studentId } });
  expect(orphaned.length).toBe(0);
  ```

- [ ] **Test bidirectional navigation**
  ```typescript
  const appointment = await Appointment.findOne({ include: ['student'] });
  expect(appointment.student).toBeDefined();
  expect(appointment.student.id).toBe(appointment.studentId);
  ```

### User Model Tests

- [ ] **Test nurse workload queries**
  ```typescript
  const nurse = await User.findByPk(nurseId, {
    include: ['appointments', 'clinicVisits', 'prescriptions']
  });
  expect(nurse.appointments).toBeDefined();
  ```

- [ ] **Test RESTRICT on user deletion**
  ```typescript
  await Prescription.create({ prescribedBy: nurseId, ... });
  await expect(nurse.destroy()).rejects.toThrow();
  ```

- [ ] **Test alert associations**
  ```typescript
  const user = await User.findByPk(userId, {
    include: ['createdAlerts', 'acknowledgedAlerts', 'resolvedAlerts']
  });
  expect(user.createdAlerts).toBeDefined();
  ```

### School Model Tests

- [ ] **Test school-wide queries**
  ```typescript
  const school = await School.findByPk(schoolId, {
    include: ['students', 'users', 'alerts']
  });
  expect(school.students).toBeDefined();
  expect(Array.isArray(school.students)).toBe(true);
  ```

- [ ] **Test aggregation queries**
  ```typescript
  const activeStudents = school.students.filter(s => s.isActive);
  expect(activeStudents.length).toBeGreaterThan(0);
  ```

### Conversation Model Tests

- [ ] **Test message history loading**
  ```typescript
  const conversation = await Conversation.findByPk(conversationId, {
    include: ['messages', 'participants']
  });
  expect(conversation.messages).toBeDefined();
  ```

### Prescription Model Tests

- [ ] **Test prescriber association**
  ```typescript
  const prescription = await Prescription.findOne({
    include: ['student', 'prescriber']
  });
  expect(prescription.prescriber).toBeDefined();
  expect(prescription.prescriber.role).toBe('NURSE');
  ```

### ClinicVisit Model Tests

- [ ] **Test attendingNurse association**
  ```typescript
  const visit = await ClinicVisit.findOne({
    include: ['student', 'attendingNurse']
  });
  expect(visit.attendingNurse).toBeDefined();
  ```

### IncidentReport Model Tests

- [ ] **Test reporter association**
  ```typescript
  const incident = await IncidentReport.findOne({
    include: ['student', 'reporter']
  });
  expect(incident.reporter).toBeDefined();
  ```

- [ ] **Test RESTRICT on reporter deletion**
  ```typescript
  const reporter = await User.findByPk(incident.reportedById);
  await expect(reporter.destroy()).rejects.toThrow();
  ```

### ClinicalNote Model Tests

- [ ] **Test author association**
  ```typescript
  const note = await ClinicalNote.findOne({
    include: ['student', 'author', 'visit']
  });
  expect(note.author).toBeDefined();
  ```

### VitalSigns Model Tests

- [ ] **Test student association**
  ```typescript
  const vitals = await VitalSigns.findOne({
    include: ['student']
  });
  expect(vitals.student).toBeDefined();
  ```

## Phase 3: Integration Tests

### Student Dashboard Workflow

- [ ] **Load complete student dashboard**
  ```typescript
  const dashboard = await Student.findByPk(studentId, {
    include: [
      { association: 'appointments', where: { status: 'SCHEDULED' }, required: false },
      { association: 'prescriptions', where: { status: 'FILLED' }, required: false },
      { association: 'allergies', where: { active: true }, required: false },
      'chronicConditions', 'healthRecords'
    ]
  });
  expect(dashboard).toBeDefined();
  ```

### Nurse Workload Workflow

- [ ] **Calculate daily nurse workload**
  ```typescript
  const workload = await User.findByPk(nurseId, {
    include: [
      { association: 'appointments', where: { scheduledAt: today } },
      { association: 'clinicVisits', where: { checkInTime: today } }
    ]
  });
  const totalTasks = workload.appointments.length + workload.clinicVisits.length;
  expect(totalTasks).toBeGreaterThanOrEqual(0);
  ```

### School Reporting Workflow

- [ ] **Generate school health report**
  ```typescript
  const report = await School.findByPk(schoolId, {
    include: [
      { association: 'students', where: { isActive: true } },
      { association: 'alerts', where: { status: 'ACTIVE' } },
      { association: 'incidentReports', where: { occurredAt: thisMonth } }
    ]
  });
  expect(report.students.length).toBeGreaterThan(0);
  ```

### Messaging Workflow

- [ ] **Load conversation thread**
  ```typescript
  const thread = await Conversation.findByPk(conversationId, {
    include: [
      { association: 'messages', order: [['createdAt', 'DESC']], limit: 50 },
      'participants'
    ]
  });
  expect(thread.messages.length).toBeLessThanOrEqual(50);
  ```

## Phase 4: Performance Tests

### N+1 Query Prevention

- [ ] **Verify no N+1 queries in student list**
  ```typescript
  // Enable query logging
  const students = await Student.findAll({
    include: ['appointments'],
    limit: 10
  });
  // Verify only 1-2 queries executed (not 11)
  ```

- [ ] **Verify no N+1 queries in appointment list**
  ```typescript
  const appointments = await Appointment.findAll({
    include: ['student', 'nurse'],
    limit: 20
  });
  // Verify only 1-2 queries executed
  ```

### Query Performance Benchmarks

- [ ] **Student dashboard query < 500ms**
  ```typescript
  const start = Date.now();
  await Student.findByPk(studentId, {
    include: ['appointments', 'prescriptions', 'allergies', 'chronicConditions']
  });
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(500);
  ```

- [ ] **School report query < 1000ms**
  ```typescript
  const start = Date.now();
  await School.findByPk(schoolId, {
    include: ['students', 'alerts']
  });
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(1000);
  ```

## Phase 5: Edge Cases

### Null Handling

- [ ] **Test SET NULL behavior**
  ```typescript
  const appointment = await Appointment.create({ nurseId, ... });
  await User.destroy({ where: { id: nurseId } });
  await appointment.reload();
  expect(appointment.nurseId).toBeNull();
  expect(appointment.studentId).toBeDefined(); // Should still exist
  ```

### Optional Associations

- [ ] **Test students without appointments**
  ```typescript
  const students = await Student.findAll({
    include: [{ association: 'appointments', required: false }]
  });
  const withoutAppointments = students.filter(s => s.appointments.length === 0);
  expect(withoutAppointments.length).toBeGreaterThanOrEqual(0);
  ```

### Soft Delete Behavior

- [ ] **Test paranoid deletion cascade**
  ```typescript
  const student = await Student.findByPk(studentId);
  await student.destroy(); // Soft delete
  const healthRecords = await HealthRecord.findAll({
    where: { studentId },
    paranoid: false
  });
  expect(healthRecords.every(r => r.deletedAt !== null)).toBe(true);
  ```

## Phase 6: Data Integrity

### Foreign Key Constraints

- [ ] **Verify FK constraints in database**
  ```sql
  SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.update_rule,
    rc.delete_rule
  FROM information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
  JOIN information_schema.referential_constraints AS rc
    ON rc.constraint_name = tc.constraint_name
  WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND tc.table_name IN ('students', 'appointments', 'prescriptions', 'clinic_visits');
  ```

### Referential Integrity

- [ ] **Test cannot create orphaned records**
  ```typescript
  await expect(
    Appointment.create({
      studentId: 'non-existent-id',
      nurseId,
      ...
    })
  ).rejects.toThrow();
  ```

## Phase 7: Documentation

- [ ] Code comments updated for new associations
- [ ] API documentation updated with new query patterns
- [ ] Example queries documented in codebase
- [ ] Migration guide created for database updates

## Phase 8: Deployment Readiness

### Pre-Deployment

- [ ] All tests passing in CI/CD pipeline
- [ ] Code review approved by senior developer
- [ ] Database migration created and reviewed
- [ ] Rollback plan documented

### Staging Deployment

- [ ] Deploy to staging environment
- [ ] Run smoke tests on staging
- [ ] Performance tests on staging with production-like data
- [ ] Monitor logs for association-related errors

### Production Deployment

- [ ] Schedule deployment during low-traffic window
- [ ] Deploy database migration first (if needed)
- [ ] Deploy application code
- [ ] Monitor performance metrics
- [ ] Verify no increase in error rates
- [ ] Check query performance dashboard

## Success Criteria

✅ All unit tests passing
✅ All integration tests passing
✅ No N+1 queries detected
✅ Query performance within acceptable ranges
✅ No referential integrity violations
✅ Cascade behavior working as expected
✅ RESTRICT rules preventing invalid deletions
✅ No production errors after 48 hours

## Rollback Triggers

Initiate rollback if:
- Error rate increases by > 10%
- Query performance degrades by > 50%
- Any data integrity violations detected
- CASCADE deletions behaving unexpectedly
- RESTRICT rules blocking critical operations

## Post-Deployment

- [ ] Monitor error logs for 48 hours
- [ ] Review query performance metrics
- [ ] Gather feedback from development team
- [ ] Update documentation based on learnings
- [ ] Create follow-up tasks for optimizations

---

**Validation Owner**: _____________
**Validation Date**: _____________
**Production Deployment Date**: _____________
**Sign-off**: _____________
