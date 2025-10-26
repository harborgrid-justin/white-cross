/**
 * Appointment Scheduling Workflow Integration Test
 * Tests complete end-to-end appointment scheduling workflow
 */

import { test, expect } from '../helpers/test-client';
import { createTestStudent, createTestAppointment } from '../helpers/test-client';
import { TEST_APPOINTMENTS, getScheduledDateTime, getFutureDate } from '../helpers/test-data';

test.describe('Appointment Scheduling Workflow', () => {
  test('should complete full appointment lifecycle', async ({ authenticatedContext }) => {
    // 1. Create student
    const student = await createTestStudent(authenticatedContext);
    expect(student.id).toBeDefined();

    // 2. Check available appointment slots
    const slotsResponse = await authenticatedContext.get('/api/v1/appointments/available-slots', {
      params: {
        date: getFutureDate(1).split('T')[0],
        duration: 30,
      },
    });
    expect(slotsResponse.ok()).toBeTruthy();
    const slots = await slotsResponse.json();
    expect(Array.isArray(slots)).toBeTruthy();

    // 3. Schedule appointment
    const appointmentData = {
      ...TEST_APPOINTMENTS.routine,
      studentId: student.id,
      scheduledDateTime: getScheduledDateTime(24), // 24 hours from now
    };

    const createResponse = await authenticatedContext.post('/api/v1/appointments', {
      data: appointmentData,
    });
    expect(createResponse.ok()).toBeTruthy();
    const appointment = await createResponse.json();
    expect(appointment.id).toBeDefined();
    expect(appointment.status).toBe('scheduled');

    // 4. Retrieve appointment details
    const getResponse = await authenticatedContext.get(`/api/v1/appointments/${appointment.id}`);
    expect(getResponse.ok()).toBeTruthy();
    const retrieved = await getResponse.json();
    expect(retrieved.studentId).toBe(student.id);

    // 5. Send appointment reminder (manual trigger)
    const reminderResponse = await authenticatedContext.post(
      `/api/v1/appointments/${appointment.id}/send-reminder`,
      {}
    );
    expect(reminderResponse.ok()).toBeTruthy();

    // 6. Check in student for appointment
    const checkinResponse = await authenticatedContext.put(
      `/api/v1/appointments/${appointment.id}/check-in`,
      {
        data: {
          checkedInAt: new Date().toISOString(),
        },
      }
    );
    expect(checkinResponse.ok()).toBeTruthy();
    const checkedIn = await checkinResponse.json();
    expect(checkedIn.status).toBe('checked_in');

    // 7. Start appointment
    const startResponse = await authenticatedContext.put(
      `/api/v1/appointments/${appointment.id}/start`,
      {
        data: {
          startedAt: new Date().toISOString(),
        },
      }
    );
    expect(startResponse.ok()).toBeTruthy();
    const started = await startResponse.json();
    expect(started.status).toBe('in_progress');

    // 8. Add appointment notes
    const notesResponse = await authenticatedContext.put(
      `/api/v1/appointments/${appointment.id}`,
      {
        data: {
          notes: 'Student appears healthy. No concerns noted. Advised on nutrition.',
        },
      }
    );
    expect(notesResponse.ok()).toBeTruthy();

    // 9. Complete appointment
    const completeResponse = await authenticatedContext.put(
      `/api/v1/appointments/${appointment.id}/complete`,
      {
        data: {
          completedAt: new Date().toISOString(),
          outcome: 'completed_successfully',
        },
      }
    );
    expect(completeResponse.ok()).toBeTruthy();
    const completed = await completeResponse.json();
    expect(completed.status).toBe('completed');

    // 10. Schedule follow-up if needed
    const followUpData = {
      studentId: student.id,
      appointmentType: 'follow_up',
      scheduledDateTime: getScheduledDateTime(24 * 7), // 1 week later
      duration: 15,
      notes: 'Follow-up from previous checkup',
      relatedAppointmentId: appointment.id,
    };

    const followUpResponse = await authenticatedContext.post('/api/v1/appointments', {
      data: followUpData,
    });
    expect(followUpResponse.ok()).toBeTruthy();
    const followUp = await followUpResponse.json();
    expect(followUp.relatedAppointmentId).toBe(appointment.id);

    // 11. Verify appointments appear in student's appointment history
    const historyResponse = await authenticatedContext.get(
      `/api/v1/students/${student.id}/appointments`
    );
    expect(historyResponse.ok()).toBeTruthy();
    const history = await historyResponse.json();
    expect(Array.isArray(history)).toBeTruthy();
    expect(history.length).toBeGreaterThanOrEqual(2);
  });

  test('should handle appointment cancellation workflow', async ({ authenticatedContext }) => {
    // 1. Create student and schedule appointment
    const student = await createTestStudent(authenticatedContext);
    const appointment = await createTestAppointment(authenticatedContext, student.id);

    // 2. Cancel appointment
    const cancelResponse = await authenticatedContext.put(
      `/api/v1/appointments/${appointment.id}/cancel`,
      {
        data: {
          cancelledAt: new Date().toISOString(),
          cancellationReason: 'Student absent today',
          cancelledBy: 'School Nurse',
        },
      }
    );
    expect(cancelResponse.ok()).toBeTruthy();
    const cancelled = await cancelResponse.json();
    expect(cancelled.status).toBe('cancelled');
    expect(cancelled.cancellationReason).toBeDefined();

    // 3. Notify parent of cancellation
    const notifyResponse = await authenticatedContext.post(
      `/api/v1/appointments/${appointment.id}/notify-cancellation`,
      {}
    );
    expect(notifyResponse.ok()).toBeTruthy();

    // 4. Reschedule appointment
    const rescheduleData = {
      studentId: student.id,
      appointmentType: appointment.appointmentType,
      scheduledDateTime: getScheduledDateTime(48), // 2 days later
      duration: appointment.duration,
      notes: `Rescheduled from cancelled appointment ${appointment.id}`,
    };

    const rescheduleResponse = await authenticatedContext.post('/api/v1/appointments', {
      data: rescheduleData,
    });
    expect(rescheduleResponse.ok()).toBeTruthy();
    const rescheduled = await rescheduleResponse.json();
    expect(rescheduled.status).toBe('scheduled');
  });

  test('should handle appointment no-show workflow', async ({ authenticatedContext }) => {
    // 1. Create student and schedule appointment
    const student = await createTestStudent(authenticatedContext);
    const appointment = await createTestAppointment(authenticatedContext, student.id);

    // 2. Mark as no-show
    const noShowResponse = await authenticatedContext.put(
      `/api/v1/appointments/${appointment.id}/no-show`,
      {
        data: {
          markedAt: new Date().toISOString(),
        },
      }
    );
    expect(noShowResponse.ok()).toBeTruthy();
    const noShow = await noShowResponse.json();
    expect(noShow.status).toBe('no_show');

    // 3. Log no-show incident
    const incidentResponse = await authenticatedContext.post('/api/v1/incidents', {
      data: {
        studentId: student.id,
        incidentType: 'appointment_no_show',
        incidentDate: new Date().toISOString(),
        description: `Student did not show for scheduled ${appointment.appointmentType} appointment`,
        location: 'Health Office',
        severity: 'minor',
      },
    });
    expect(incidentResponse.ok()).toBeTruthy();

    // 4. Contact parent
    const contactResponse = await authenticatedContext.post('/api/v1/messages', {
      data: {
        recipientId: student.id,
        recipientType: 'student_parent',
        subject: 'Missed Appointment Notification',
        messageBody: `Your student missed their scheduled appointment. Please contact the health office to reschedule.`,
        messageType: 'alert',
        priority: 'normal',
      },
    });
    expect(contactResponse.ok()).toBeTruthy();
  });

  test('should handle emergency appointment workflow', async ({ authenticatedContext }) => {
    // 1. Create student
    const student = await createTestStudent(authenticatedContext);

    // 2. Create emergency appointment (immediate)
    const emergencyData = {
      studentId: student.id,
      appointmentType: 'emergency',
      scheduledDateTime: new Date().toISOString(),
      duration: 30,
      priority: 'urgent',
      notes: 'Student injured on playground - needs immediate attention',
    };

    const createResponse = await authenticatedContext.post('/api/v1/appointments', {
      data: emergencyData,
    });
    expect(createResponse.ok()).toBeTruthy();
    const appointment = await createResponse.json();
    expect(appointment.priority).toBe('urgent');

    // 3. Immediate check-in and start
    const startResponse = await authenticatedContext.put(
      `/api/v1/appointments/${appointment.id}/start`,
      {
        data: {
          startedAt: new Date().toISOString(),
          checkedInAt: new Date().toISOString(),
        },
      }
    );
    expect(startResponse.ok()).toBeTruthy();

    // 4. Create injury health record
    const healthRecordResponse = await authenticatedContext.post('/api/v1/health-records', {
      data: {
        studentId: student.id,
        recordType: 'injury',
        recordDate: new Date().toISOString(),
        injuryData: {
          type: 'laceration',
          bodyPart: 'knee',
          severity: 'moderate',
          treatment: 'Cleaned wound, applied antiseptic and bandage',
        },
        notes: 'Injury from playground fall - emergency appointment',
      },
    });
    expect(healthRecordResponse.ok()).toBeTruthy();

    // 5. Notify parent immediately
    const notifyResponse = await authenticatedContext.post('/api/v1/messages', {
      data: {
        recipientId: student.id,
        recipientType: 'student_parent',
        subject: 'URGENT: Student Injury Notification',
        messageBody: 'Your student was injured. They are being treated in the health office.',
        messageType: 'alert',
        priority: 'urgent',
      },
    });
    expect(notifyResponse.ok()).toBeTruthy();

    // 6. Complete emergency appointment
    const completeResponse = await authenticatedContext.put(
      `/api/v1/appointments/${appointment.id}/complete`,
      {
        data: {
          completedAt: new Date().toISOString(),
          outcome: 'completed_successfully',
          notes: 'Wound treated. Student stable. Follow-up recommended.',
        },
      }
    );
    expect(completeResponse.ok()).toBeTruthy();
  });

  test('should handle recurring appointment workflow', async ({ authenticatedContext }) => {
    // 1. Create student with chronic condition
    const createStudentResponse = await authenticatedContext.post('/api/v1/students', {
      data: {
        firstName: 'Recurring',
        lastName: 'Patient',
        dateOfBirth: '2010-01-01',
        grade: '8',
        schoolId: `REC${Date.now()}`,
        status: 'active',
        medicalConditions: ['Type 1 Diabetes'],
      },
    });
    const student = await createStudentResponse.json();

    // 2. Schedule recurring appointments (weekly blood sugar check)
    const recurringData = {
      studentId: student.id,
      appointmentType: 'medical_monitoring',
      scheduledDateTime: getScheduledDateTime(24),
      duration: 15,
      recurrence: 'weekly',
      recurrenceCount: 4,
      notes: 'Weekly blood sugar monitoring',
    };

    const recurringResponse = await authenticatedContext.post('/api/v1/appointments/recurring', {
      data: recurringData,
    });
    expect(recurringResponse.ok()).toBeTruthy();
    const recurringAppointments = await recurringResponse.json();
    expect(Array.isArray(recurringAppointments)).toBeTruthy();
    expect(recurringAppointments.length).toBe(4);

    // 3. Verify all recurring appointments were created
    const historyResponse = await authenticatedContext.get(
      `/api/v1/students/${student.id}/appointments`
    );
    const history = await historyResponse.json();
    expect(history.length).toBeGreaterThanOrEqual(4);

    // 4. Complete first recurring appointment
    const firstAppointment = recurringAppointments[0];
    const completeResponse = await authenticatedContext.put(
      `/api/v1/appointments/${firstAppointment.id}/complete`,
      {
        data: {
          completedAt: new Date().toISOString(),
          outcome: 'completed_successfully',
        },
      }
    );
    expect(completeResponse.ok()).toBeTruthy();
  });

  test('should generate appointment statistics and reports', async ({ authenticatedContext }) => {
    // 1. Get today's appointments
    const todayResponse = await authenticatedContext.get('/api/v1/appointments/today');
    expect(todayResponse.ok()).toBeTruthy();
    const today = await todayResponse.json();
    expect(Array.isArray(today)).toBeTruthy();

    // 2. Get upcoming appointments
    const upcomingResponse = await authenticatedContext.get('/api/v1/appointments/upcoming', {
      params: {
        days: 7,
      },
    });
    expect(upcomingResponse.ok()).toBeTruthy();
    const upcoming = await upcomingResponse.json();
    expect(Array.isArray(upcoming)).toBeTruthy();

    // 3. Get appointment statistics
    const statsResponse = await authenticatedContext.get('/api/v1/appointments/statistics', {
      params: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
      },
    });
    expect(statsResponse.ok()).toBeTruthy();
    const stats = await statsResponse.json();
    expect(stats.totalAppointments).toBeDefined();
    expect(stats.appointmentsByType).toBeDefined();
    expect(stats.appointmentsByStatus).toBeDefined();
    expect(stats.averageDuration).toBeDefined();

    // 4. Generate appointment report
    const reportResponse = await authenticatedContext.post('/api/v1/appointments/reports', {
      data: {
        reportType: 'summary',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
        format: 'json',
      },
    });
    expect(reportResponse.ok()).toBeTruthy();
    const report = await reportResponse.json();
    expect(report).toBeDefined();
  });
});
