/**
 * @fileoverview Event-Driven Architecture Integration Tests
 * @module appointment/__tests__
 * @description Integration tests for appointment event-driven architecture
 * Tests the complete event flow from AppointmentService through EventEmitter to listeners
 *
 * Test Coverage:
 * - Event emission from AppointmentService
 * - Event handling by WebSocketListener
 * - Event handling by EmailListener
 * - End-to-end event flow for all appointment lifecycle events
 * - Event replay capability for audit
 * - HIPAA-compliant event logging
 *
 * @see NESTJS_SERVICES_REVIEW.md Section 9.1 - Event-Driven Architecture
 */

import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { AppointmentWebSocketListener } from '../../infrastructure/websocket/listeners/appointment.listener';
import { AppointmentEmailListener } from '../../infrastructure/email/listeners/appointment.listener';
import {
  AppointmentCancelledEvent,
  AppointmentCreatedEvent,
  AppointmentRescheduledEvent,
} from '../events/appointment.events';

/**
 * Mock implementations
 */
class MockWebSocketService {
  broadcastToRoom = jest.fn().mockResolvedValue(undefined);
  isInitialized = jest.fn().mockReturnValue(true);
}

class MockEmailService {
  sendTemplatedEmail = jest.fn().mockResolvedValue(undefined);
}

describe('Event-Driven Architecture Integration Tests', () => {
  let eventEmitter: EventEmitter2;
  let websocketListener: AppointmentWebSocketListener;
  let emailListener: AppointmentEmailListener;
  let mockWebSocketService: MockWebSocketService;
  let mockEmailService: MockEmailService;

  beforeEach(async () => {
    mockWebSocketService = new MockWebSocketService();
    mockEmailService = new MockEmailService();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EventEmitterModule.forRoot({
          wildcard: false,
          delimiter: '.',
          maxListeners: 20,
        }),
      ],
      providers: [
        {
          provide: AppointmentWebSocketListener,
          useFactory: () =>
            new AppointmentWebSocketListener(
              mockWebSocketService as any,
            ),
        },
        {
          provide: AppointmentEmailListener,
          useFactory: () =>
            new AppointmentEmailListener(mockEmailService as any),
        },
      ],
    }).compile();

    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    websocketListener = module.get<AppointmentWebSocketListener>(
      AppointmentWebSocketListener,
    );
    emailListener = module.get<AppointmentEmailListener>(
      AppointmentEmailListener,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Appointment Created Event Flow', () => {
    it('should emit event and trigger both WebSocket and Email listeners', async () => {
      // Arrange
      const event = new AppointmentCreatedEvent(
        {
          id: 'apt-123',
          studentId: 'student-456',
          nurseId: 'nurse-789',
          type: 'ROUTINE',
          scheduledAt: new Date('2025-01-15T10:00:00Z'),
          duration: 30,
          status: 'SCHEDULED',
          reason: 'Annual checkup',
        },
        {
          userId: 'admin-001',
          userRole: 'ADMIN',
          requestId: 'req-123',
          organizationId: 'org-001',
          timestamp: new Date(),
        },
      );

      // Act
      eventEmitter.emit('appointment.created', event);

      // Allow async listeners to execute
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Assert - WebSocket broadcasts
      expect(mockWebSocketService.broadcastToRoom).toHaveBeenCalledTimes(3);

      // Check nurse room broadcast
      expect(mockWebSocketService.broadcastToRoom).toHaveBeenCalledWith(
        'user:nurse-789',
        'appointment:created',
        expect.objectContaining({
          appointmentId: 'apt-123',
          studentId: 'student-456',
          nurseId: 'nurse-789',
          eventType: 'appointment:created',
        }),
      );

      // Check student room broadcast
      expect(mockWebSocketService.broadcastToRoom).toHaveBeenCalledWith(
        'student:student-456',
        'appointment:created',
        expect.any(Object),
      );

      // Check organization room broadcast
      expect(mockWebSocketService.broadcastToRoom).toHaveBeenCalledWith(
        'organization:org-001',
        'appointment:created',
        expect.any(Object),
      );

      // Assert - Email sent
      expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalledTimes(1);
      expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Appointment Confirmation - White Cross Health',
        }),
      );
    });

    it('should create audit log with HIPAA-compliant data', () => {
      const event = new AppointmentCreatedEvent(
        {
          id: 'apt-123',
          studentId: 'student-456',
          nurseId: 'nurse-789',
          type: 'ROUTINE',
          scheduledAt: new Date('2025-01-15T10:00:00Z'),
          duration: 30,
          status: 'SCHEDULED',
        },
        {
          userId: 'admin-001',
          userRole: 'ADMIN',
          requestId: 'req-123',
          timestamp: new Date(),
        },
      );

      const auditLog = event.toAuditLog();

      expect(auditLog).toMatchObject({
        eventName: 'appointment.created',
        appointmentId: 'apt-123',
        studentId: 'student-456',
        nurseId: 'nurse-789',
        userId: 'admin-001',
        userRole: 'ADMIN',
        requestId: 'req-123',
      });

      expect(auditLog.eventTime).toBeDefined();
      expect(auditLog.scheduledAt).toBeDefined();
    });
  });

  describe('Appointment Cancelled Event Flow', () => {
    it('should emit event and trigger notifications', async () => {
      const event = new AppointmentCancelledEvent(
        'apt-123',
        {
          id: 'apt-123',
          studentId: 'student-456',
          nurseId: 'nurse-789',
          type: 'ROUTINE',
          scheduledAt: new Date('2025-01-15T10:00:00Z'),
          duration: 30,
          status: 'CANCELLED',
        },
        'Patient requested cancellation',
        {
          userId: 'nurse-789',
          userRole: 'NURSE',
          timestamp: new Date(),
        },
      );

      eventEmitter.emit('appointment.cancelled', event);

      await new Promise((resolve) => setTimeout(resolve, 100));

      // WebSocket broadcasts to nurse and student
      expect(mockWebSocketService.broadcastToRoom).toHaveBeenCalledTimes(2);

      // Email notification sent
      expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Appointment Cancelled - White Cross Health',
        }),
      );
    });
  });

  describe('Appointment Rescheduled Event Flow', () => {
    it('should emit event with old and new dates', async () => {
      const oldDate = new Date('2025-01-15T10:00:00Z');
      const newDate = new Date('2025-01-16T14:00:00Z');

      const event = new AppointmentRescheduledEvent(
        {
          id: 'apt-123',
          studentId: 'student-456',
          nurseId: 'nurse-789',
          type: 'ROUTINE',
          scheduledAt: newDate,
          duration: 30,
          status: 'SCHEDULED',
        },
        oldDate,
        newDate,
        {
          userId: 'nurse-789',
          userRole: 'NURSE',
          timestamp: new Date(),
        },
      );

      eventEmitter.emit('appointment.rescheduled', event);

      await new Promise((resolve) => setTimeout(resolve, 100));

      // WebSocket broadcasts with both dates
      expect(mockWebSocketService.broadcastToRoom).toHaveBeenCalledWith(
        expect.any(String),
        'appointment:rescheduled',
        expect.objectContaining({
          oldScheduledAt: oldDate.toISOString(),
          newScheduledAt: newDate.toISOString(),
          eventType: 'appointment:rescheduled',
        }),
      );

      // Rescheduling email sent
      expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Appointment Rescheduled - White Cross Health',
        }),
      );
    });
  });

  describe('Event Listener Error Handling', () => {
    it('should not fail when WebSocket service is unavailable', async () => {
      mockWebSocketService.isInitialized.mockReturnValue(false);

      const event = new AppointmentCreatedEvent(
        {
          id: 'apt-123',
          studentId: 'student-456',
          nurseId: 'nurse-789',
          type: 'ROUTINE',
          scheduledAt: new Date(),
          duration: 30,
          status: 'SCHEDULED',
        },
        {
          userId: 'admin-001',
          userRole: 'ADMIN',
          timestamp: new Date(),
        },
      );

      // Should not throw
      await expect(async () => {
        eventEmitter.emit('appointment.created', event);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }).not.toThrow();

      // Email should still be sent even if WebSocket fails
      expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalled();
    });

    it('should continue processing when email service fails', async () => {
      mockEmailService.sendTemplatedEmail.mockRejectedValue(
        new Error('SMTP server unavailable'),
      );

      const event = new AppointmentCreatedEvent(
        {
          id: 'apt-123',
          studentId: 'student-456',
          nurseId: 'nurse-789',
          type: 'ROUTINE',
          scheduledAt: new Date(),
          duration: 30,
          status: 'SCHEDULED',
        },
        {
          userId: 'admin-001',
          userRole: 'ADMIN',
          timestamp: new Date(),
        },
      );

      // Should not throw
      await expect(async () => {
        eventEmitter.emit('appointment.created', event);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }).not.toThrow();

      // WebSocket should still work even if email fails
      expect(mockWebSocketService.broadcastToRoom).toHaveBeenCalled();
    });
  });

  describe('Event Replay for Audit', () => {
    it('should capture all events for audit replay', async () => {
      const capturedEvents: any[] = [];

      // Subscribe to all appointment events
      eventEmitter.on('appointment.*', (event) => {
        capturedEvents.push({
          timestamp: new Date(),
          eventName: event.eventName,
          auditLog: event.toAuditLog(),
        });
      });

      // Emit multiple events
      const events = [
        new AppointmentCreatedEvent(
          {
            id: 'apt-1',
            studentId: 'student-1',
            nurseId: 'nurse-1',
            type: 'ROUTINE',
            scheduledAt: new Date(),
            duration: 30,
            status: 'SCHEDULED',
          },
          {
            userId: 'admin-001',
            userRole: 'ADMIN',
            timestamp: new Date(),
          },
        ),
        new AppointmentCancelledEvent(
          'apt-2',
          {
            id: 'apt-2',
            studentId: 'student-2',
            nurseId: 'nurse-2',
            type: 'URGENT',
            scheduledAt: new Date(),
            duration: 15,
            status: 'CANCELLED',
          },
          'Emergency',
          {
            userId: 'nurse-2',
            userRole: 'NURSE',
            timestamp: new Date(),
          },
        ),
      ];

      events.forEach((event) => {
        eventEmitter.emit(`appointment.${event.eventName.split('.')[1]}`, event);
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should have captured all events
      expect(capturedEvents.length).toBeGreaterThanOrEqual(2);

      // Each event should have audit log
      capturedEvents.forEach((captured) => {
        expect(captured.auditLog).toBeDefined();
        expect(captured.auditLog.eventName).toBeDefined();
        expect(captured.auditLog.eventTime).toBeDefined();
      });
    });
  });
});
