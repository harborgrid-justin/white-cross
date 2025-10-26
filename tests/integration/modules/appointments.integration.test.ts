/**
 * Appointments Module Integration Tests
 * Tests appointment scheduling, management, and calendar operations
 */

import {
  test,
  expect,
  createTestStudent,
  createTestAppointment,
} from '../helpers/test-client';
import { TEST_APPOINTMENTS, getScheduledDateTime, getFutureDate } from '../helpers/test-data';

test.describe('Appointments Module Integration', () => {
  test.describe('Appointment CRUD Operations', () => {
    test('should create a new appointment', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      const appointmentData = {
        ...TEST_APPOINTMENTS.routine,
        studentId: student.id,
        scheduledDateTime: getScheduledDateTime(2),
      };

      const response = await authenticatedContext.post('/api/v1/appointments', {
        data: appointmentData,
      });

      expect(response.ok()).toBeTruthy();
      const appointment = await response.json();

      expect(appointment.id).toBeDefined();
      expect(appointment.studentId).toBe(student.id);
      expect(appointment.appointmentType).toBe(appointmentData.appointmentType);
      expect(appointment.status).toBe('scheduled');
    });

    test('should retrieve appointment by ID', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const created = await createTestAppointment(authenticatedContext, student.id);

      const response = await authenticatedContext.get(`/api/v1/appointments/${created.id}`);

      expect(response.ok()).toBeTruthy();
      const appointment = await response.json();

      expect(appointment.id).toBe(created.id);
      expect(appointment.studentId).toBe(student.id);
    });

    test('should update appointment details', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const created = await createTestAppointment(authenticatedContext, student.id);

      const updateData = {
        notes: 'Updated appointment notes',
        duration: 45,
      };

      const response = await authenticatedContext.put(`/api/v1/appointments/${created.id}`, {
        data: updateData,
      });

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.notes).toBe(updateData.notes);
      expect(updated.duration).toBe(updateData.duration);
    });

    test('should reschedule appointment', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const created = await createTestAppointment(authenticatedContext, student.id);

      const newDateTime = getScheduledDateTime(48); // 2 days from now

      const response = await authenticatedContext.put(
        `/api/v1/appointments/${created.id}/reschedule`,
        {
          data: {
            scheduledDateTime: newDateTime,
            reason: 'Student conflict',
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const rescheduled = await response.json();

      expect(rescheduled.scheduledDateTime).toBe(newDateTime);
    });

    test('should cancel appointment', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const created = await createTestAppointment(authenticatedContext, student.id);

      const response = await authenticatedContext.put(
        `/api/v1/appointments/${created.id}/cancel`,
        {
          data: {
            reason: 'Student absent',
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const cancelled = await response.json();

      expect(cancelled.status).toBe('cancelled');
    });

    test('should complete appointment', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const created = await createTestAppointment(authenticatedContext, student.id);

      const response = await authenticatedContext.put(
        `/api/v1/appointments/${created.id}/complete`,
        {
          data: {
            completionNotes: 'Appointment completed successfully',
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const completed = await response.json();

      expect(completed.status).toBe('completed');
    });

    test('should mark appointment as no-show', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const created = await createTestAppointment(authenticatedContext, student.id);

      const response = await authenticatedContext.put(
        `/api/v1/appointments/${created.id}/no-show`,
        {}
      );

      expect(response.ok()).toBeTruthy();
      const noShow = await response.json();

      expect(noShow.status).toBe('no_show');
    });
  });

  test.describe('Appointment Calendar and Scheduling', () => {
    test('should retrieve daily appointment calendar', async ({ authenticatedContext }) => {
      const today = new Date().toISOString().split('T')[0];

      const response = await authenticatedContext.get('/api/v1/appointments/calendar', {
        params: {
          date: today,
        },
      });

      expect(response.ok()).toBeTruthy();
      const appointments = await response.json();

      expect(Array.isArray(appointments)).toBeTruthy();
    });

    test('should retrieve weekly appointment calendar', async ({ authenticatedContext }) => {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const response = await authenticatedContext.get('/api/v1/appointments/calendar/week', {
        params: {
          startDate: startOfWeek.toISOString().split('T')[0],
        },
      });

      expect(response.ok()).toBeTruthy();
      const calendar = await response.json();

      expect(calendar.days).toBeDefined();
      expect(Array.isArray(calendar.days)).toBeTruthy();
      expect(calendar.days.length).toBe(7);
    });

    test('should retrieve monthly appointment calendar', async ({ authenticatedContext }) => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;

      const response = await authenticatedContext.get('/api/v1/appointments/calendar/month', {
        params: {
          year,
          month,
        },
      });

      expect(response.ok()).toBeTruthy();
      const calendar = await response.json();

      expect(calendar.year).toBe(year);
      expect(calendar.month).toBe(month);
      expect(calendar.appointments).toBeDefined();
    });

    test('should check availability for time slot', async ({ authenticatedContext }) => {
      const slotTime = getScheduledDateTime(24);

      const response = await authenticatedContext.get('/api/v1/appointments/availability', {
        params: {
          dateTime: slotTime,
          duration: 30,
        },
      });

      expect(response.ok()).toBeTruthy();
      const availability = await response.json();

      expect(availability.isAvailable).toBeDefined();
      expect(typeof availability.isAvailable).toBe('boolean');
    });

    test('should find next available slot', async ({ authenticatedContext }) => {
      const startDate = new Date().toISOString();

      const response = await authenticatedContext.get('/api/v1/appointments/next-available', {
        params: {
          startDate,
          duration: 30,
        },
      });

      expect(response.ok()).toBeTruthy();
      const slot = await response.json();

      expect(slot.dateTime).toBeDefined();
      expect(slot.isAvailable).toBe(true);
    });
  });

  test.describe('Appointment Filtering and Search', () => {
    test('should filter appointments by status', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/appointments', {
        params: {
          status: 'scheduled',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.appointments).toBeDefined();
      data.appointments.forEach((apt: any) => {
        expect(apt.status).toBe('scheduled');
      });
    });

    test('should filter appointments by type', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/appointments', {
        params: {
          appointmentType: 'routine_checkup',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.appointments).toBeDefined();
      data.appointments.forEach((apt: any) => {
        expect(apt.appointmentType).toBe('routine_checkup');
      });
    });

    test('should get upcoming appointments', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/appointments/upcoming', {
        params: {
          days: 7,
        },
      });

      expect(response.ok()).toBeTruthy();
      const appointments = await response.json();

      expect(Array.isArray(appointments)).toBeTruthy();

      // Verify all are in the future
      const now = new Date();
      appointments.forEach((apt: any) => {
        const aptDate = new Date(apt.scheduledDateTime);
        expect(aptDate.getTime()).toBeGreaterThan(now.getTime());
      });
    });

    test('should get student appointment history', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      // Create multiple appointments
      await createTestAppointment(authenticatedContext, student.id);
      await createTestAppointment(authenticatedContext, student.id);

      const response = await authenticatedContext.get(
        `/api/v1/students/${student.id}/appointments`
      );

      expect(response.ok()).toBeTruthy();
      const appointments = await response.json();

      expect(Array.isArray(appointments)).toBeTruthy();
      expect(appointments.length).toBeGreaterThanOrEqual(2);
    });
  });

  test.describe('Appointment Reminders', () => {
    test('should send appointment reminder', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const appointment = await createTestAppointment(authenticatedContext, student.id);

      const response = await authenticatedContext.post(
        `/api/v1/appointments/${appointment.id}/send-reminder`,
        {}
      );

      expect(response.ok()).toBeTruthy();
      const result = await response.json();

      expect(result.reminderSent).toBe(true);
    });

    test('should retrieve appointments needing reminders', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/appointments/reminders/pending', {
        params: {
          hoursBeforeAppointment: 24,
        },
      });

      expect(response.ok()).toBeTruthy();
      const appointments = await response.json();

      expect(Array.isArray(appointments)).toBeTruthy();
    });
  });

  test.describe('Appointment Conflicts', () => {
    test('should detect time slot conflict', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const scheduledTime = getScheduledDateTime(24);

      // Create first appointment
      await authenticatedContext.post('/api/v1/appointments', {
        data: {
          ...TEST_APPOINTMENTS.routine,
          studentId: student.id,
          scheduledDateTime: scheduledTime,
          duration: 30,
        },
      });

      // Try to create conflicting appointment (same time)
      const conflictResponse = await authenticatedContext.post('/api/v1/appointments', {
        data: {
          ...TEST_APPOINTMENTS.followUp,
          studentId: student.id,
          scheduledDateTime: scheduledTime,
          duration: 30,
        },
      });

      // Should either fail or warn about conflict
      if (conflictResponse.ok()) {
        const conflict = await conflictResponse.json();
        expect(conflict.warning).toBeDefined();
      } else {
        expect(conflictResponse.status()).toBe(409); // Conflict
      }
    });

    test('should check for conflicts before scheduling', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);
      const scheduledTime = getScheduledDateTime(24);

      const response = await authenticatedContext.post('/api/v1/appointments/check-conflicts', {
        data: {
          studentId: student.id,
          scheduledDateTime: scheduledTime,
          duration: 30,
        },
      });

      expect(response.ok()).toBeTruthy();
      const result = await response.json();

      expect(result.hasConflicts).toBeDefined();
      expect(typeof result.hasConflicts).toBe('boolean');
    });
  });

  test.describe('Validation and Error Handling', () => {
    test('should reject appointment in the past', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const response = await authenticatedContext.post('/api/v1/appointments', {
        data: {
          ...TEST_APPOINTMENTS.routine,
          studentId: student.id,
          scheduledDateTime: pastDate.toISOString(),
        },
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should reject invalid appointment type', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      const response = await authenticatedContext.post('/api/v1/appointments', {
        data: {
          studentId: student.id,
          appointmentType: 'invalid_type',
          scheduledDateTime: getScheduledDateTime(24),
        },
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should return 404 for non-existent appointment', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get(
        '/api/v1/appointments/00000000-0000-0000-0000-000000000000'
      );

      expect(response.status()).toBe(404);
    });
  });
});
