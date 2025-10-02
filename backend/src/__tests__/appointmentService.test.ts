import { AppointmentService } from '../services/appointmentService';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    appointment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    nurseAvailability: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    appointmentWaitlist: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    appointmentReminder: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    student: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  })),
}));

describe('AppointmentService', () => {
  describe('Core Appointment Methods', () => {
    test('should have getAppointments method', () => {
      expect(typeof AppointmentService.getAppointments).toBe('function');
    });

    test('should have createAppointment method', () => {
      expect(typeof AppointmentService.createAppointment).toBe('function');
    });

    test('should have updateAppointment method', () => {
      expect(typeof AppointmentService.updateAppointment).toBe('function');
    });

    test('should have cancelAppointment method', () => {
      expect(typeof AppointmentService.cancelAppointment).toBe('function');
    });

    test('should have markNoShow method', () => {
      expect(typeof AppointmentService.markNoShow).toBe('function');
    });

    test('should have checkAvailability method', () => {
      expect(typeof AppointmentService.checkAvailability).toBe('function');
    });
  });

  describe('Nurse Availability Management', () => {
    test('should have setNurseAvailability method', () => {
      expect(typeof AppointmentService.setNurseAvailability).toBe('function');
    });

    test('should have getNurseAvailability method', () => {
      expect(typeof AppointmentService.getNurseAvailability).toBe('function');
    });

    test('should have updateNurseAvailability method', () => {
      expect(typeof AppointmentService.updateNurseAvailability).toBe('function');
    });

    test('should have deleteNurseAvailability method', () => {
      expect(typeof AppointmentService.deleteNurseAvailability).toBe('function');
    });
  });

  describe('Waitlist Management', () => {
    test('should have addToWaitlist method', () => {
      expect(typeof AppointmentService.addToWaitlist).toBe('function');
    });

    test('should have getWaitlist method', () => {
      expect(typeof AppointmentService.getWaitlist).toBe('function');
    });

    test('should have removeFromWaitlist method', () => {
      expect(typeof AppointmentService.removeFromWaitlist).toBe('function');
    });

    test('should have fillSlotFromWaitlist method', () => {
      expect(typeof AppointmentService.fillSlotFromWaitlist).toBe('function');
    });
  });

  describe('Reminder System', () => {
    test('should have scheduleReminders method', () => {
      expect(typeof AppointmentService.scheduleReminders).toBe('function');
    });

    test('should have sendReminder method', () => {
      expect(typeof AppointmentService.sendReminder).toBe('function');
    });

    test('should have processPendingReminders method', () => {
      expect(typeof AppointmentService.processPendingReminders).toBe('function');
    });
  });

  describe('Recurring Appointments', () => {
    test('should have createRecurringAppointments method', () => {
      expect(typeof AppointmentService.createRecurringAppointments).toBe('function');
    });
  });

  describe('Calendar Integration', () => {
    test('should have generateCalendarExport method', () => {
      expect(typeof AppointmentService.generateCalendarExport).toBe('function');
    });
  });

  describe('Statistics and Analytics', () => {
    test('should have getAppointmentStatistics method', () => {
      expect(typeof AppointmentService.getAppointmentStatistics).toBe('function');
    });

    test('should have getAvailableSlots method', () => {
      expect(typeof AppointmentService.getAvailableSlots).toBe('function');
    });

    test('should have getUpcomingAppointments method', () => {
      expect(typeof AppointmentService.getUpcomingAppointments).toBe('function');
    });
  });
});
