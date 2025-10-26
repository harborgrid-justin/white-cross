/**
 * Communications Module Integration Tests
 * Tests complete messaging and notification workflows
 */

import { test, expect } from '../helpers/test-client';
import { TEST_MESSAGES, getPastDate } from '../helpers/test-data';
import { createTestStudent } from '../helpers/test-client';

test.describe('Communications Module Integration', () => {
  test.describe('Message CRUD Operations', () => {
    test('should create broadcast message', async ({ authenticatedContext }) => {
      const messageData = {
        ...TEST_MESSAGES.broadcast,
        recipients: 'all_nurses',
        scheduledDate: new Date().toISOString(),
      };

      const response = await authenticatedContext.post('/api/v1/messages', {
        data: messageData,
      });

      expect(response.ok()).toBeTruthy();
      const message = await response.json();

      expect(message.id).toBeDefined();
      expect(message.messageType).toBe('broadcast');
      expect(message.subject).toBe('Health Alert');
      expect(message.status).toBe('sent');
    });

    test('should create urgent alert', async ({ authenticatedContext }) => {
      const messageData = {
        ...TEST_MESSAGES.urgent,
        recipients: 'all_staff',
        scheduledDate: new Date().toISOString(),
      };

      const response = await authenticatedContext.post('/api/v1/messages', {
        data: messageData,
      });

      expect(response.ok()).toBeTruthy();
      const message = await response.json();

      expect(message.priority).toBe('urgent');
      expect(message.messageType).toBe('alert');
    });

    test('should create appointment reminder', async ({ authenticatedContext }) => {
      const student = await createTestStudent(authenticatedContext);

      const messageData = {
        ...TEST_MESSAGES.reminder,
        recipientId: student.id,
        recipientType: 'student',
        scheduledDate: new Date().toISOString(),
      };

      const response = await authenticatedContext.post('/api/v1/messages', {
        data: messageData,
      });

      expect(response.ok()).toBeTruthy();
      const message = await response.json();

      expect(message.messageType).toBe('reminder');
      expect(message.recipientId).toBe(student.id);
    });

    test('should retrieve message by ID', async ({ authenticatedContext }) => {
      // Create message
      const createResponse = await authenticatedContext.post('/api/v1/messages', {
        data: {
          ...TEST_MESSAGES.broadcast,
          recipients: 'all_nurses',
          scheduledDate: new Date().toISOString(),
        },
      });
      const created = await createResponse.json();

      // Retrieve message
      const response = await authenticatedContext.get(`/api/v1/messages/${created.id}`);

      expect(response.ok()).toBeTruthy();
      const message = await response.json();

      expect(message.id).toBe(created.id);
    });

    test('should update message', async ({ authenticatedContext }) => {
      // Create draft message
      const createResponse = await authenticatedContext.post('/api/v1/messages', {
        data: {
          subject: 'Draft Message',
          messageBody: 'This is a draft',
          messageType: 'broadcast',
          status: 'draft',
        },
      });
      const created = await createResponse.json();

      // Update message
      const updateData = {
        messageBody: 'Updated message content',
        status: 'ready',
      };

      const response = await authenticatedContext.put(`/api/v1/messages/${created.id}`, {
        data: updateData,
      });

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.messageBody).toContain('Updated');
      expect(updated.status).toBe('ready');
    });

    test('should delete draft message', async ({ authenticatedContext }) => {
      // Create draft
      const createResponse = await authenticatedContext.post('/api/v1/messages', {
        data: {
          subject: 'Draft to Delete',
          messageBody: 'Will be deleted',
          messageType: 'broadcast',
          status: 'draft',
        },
      });
      const created = await createResponse.json();

      // Delete
      const response = await authenticatedContext.delete(`/api/v1/messages/${created.id}`);

      expect(response.ok()).toBeTruthy();

      // Verify deleted
      const getResponse = await authenticatedContext.get(`/api/v1/messages/${created.id}`);
      expect(getResponse.status()).toBe(404);
    });
  });

  test.describe('Inbox and Sent Messages', () => {
    test('should list inbox messages', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/messages/inbox', {
        params: {
          page: 1,
          limit: 20,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.messages).toBeDefined();
      expect(Array.isArray(data.messages)).toBeTruthy();
      expect(data.pagination).toBeDefined();
    });

    test('should list sent messages', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/messages/sent', {
        params: {
          page: 1,
          limit: 20,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.messages).toBeDefined();
      expect(Array.isArray(data.messages)).toBeTruthy();
    });

    test('should mark message as read', async ({ authenticatedContext }) => {
      // Create message
      const createResponse = await authenticatedContext.post('/api/v1/messages', {
        data: {
          ...TEST_MESSAGES.broadcast,
          recipients: 'all_nurses',
          scheduledDate: new Date().toISOString(),
        },
      });
      const message = await createResponse.json();

      // Mark as read
      const response = await authenticatedContext.put(
        `/api/v1/messages/${message.id}/read`,
        {}
      );

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.isRead).toBe(true);
      expect(updated.readAt).toBeDefined();
    });

    test('should get unread message count', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/messages/unread-count');

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.count).toBeDefined();
      expect(typeof data.count).toBe('number');
    });
  });

  test.describe('Message Filtering', () => {
    test('should filter by message type', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/messages', {
        params: {
          messageType: 'alert',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      data.messages.forEach((message: any) => {
        expect(message.messageType).toBe('alert');
      });
    });

    test('should filter by priority', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/messages', {
        params: {
          priority: 'urgent',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      data.messages.forEach((message: any) => {
        expect(message.priority).toBe('urgent');
      });
    });

    test('should filter by date range', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/messages', {
        params: {
          startDate: getPastDate(7),
          endDate: new Date().toISOString(),
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      data.messages.forEach((message: any) => {
        const messageDate = new Date(message.createdAt);
        const sevenDaysAgo = new Date(getPastDate(7));
        expect(messageDate.getTime()).toBeGreaterThanOrEqual(sevenDaysAgo.getTime());
      });
    });

    test('should search messages', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/messages/search', {
        params: {
          query: 'health',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.messages)).toBeTruthy();
    });
  });

  test.describe('Scheduled Messages', () => {
    test('should schedule message for future delivery', async ({ authenticatedContext }) => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 24);

      const messageData = {
        ...TEST_MESSAGES.broadcast,
        recipients: 'all_nurses',
        scheduledDate: futureDate.toISOString(),
        status: 'scheduled',
      };

      const response = await authenticatedContext.post('/api/v1/messages', {
        data: messageData,
      });

      expect(response.ok()).toBeTruthy();
      const message = await response.json();

      expect(message.status).toBe('scheduled');
      expect(message.scheduledDate).toBeDefined();
    });

    test('should list scheduled messages', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/messages/scheduled');

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.messages)).toBeTruthy();
      data.messages.forEach((message: any) => {
        expect(message.status).toBe('scheduled');
      });
    });

    test('should cancel scheduled message', async ({ authenticatedContext }) => {
      // Create scheduled message
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 24);

      const createResponse = await authenticatedContext.post('/api/v1/messages', {
        data: {
          ...TEST_MESSAGES.broadcast,
          recipients: 'all_nurses',
          scheduledDate: futureDate.toISOString(),
          status: 'scheduled',
        },
      });
      const message = await createResponse.json();

      // Cancel
      const response = await authenticatedContext.put(
        `/api/v1/messages/${message.id}/cancel`,
        {}
      );

      expect(response.ok()).toBeTruthy();
      const updated = await response.json();

      expect(updated.status).toBe('cancelled');
    });
  });

  test.describe('Templates', () => {
    test('should create message template', async ({ authenticatedContext }) => {
      const templateData = {
        templateName: 'Medication Reminder',
        subject: 'Medication Due: {{medicationName}}',
        messageBody: 'Please administer {{medicationName}} to {{studentName}}',
        category: 'medication',
      };

      const response = await authenticatedContext.post('/api/v1/message-templates', {
        data: templateData,
      });

      expect(response.ok()).toBeTruthy();
      const template = await response.json();

      expect(template.id).toBeDefined();
      expect(template.templateName).toBe('Medication Reminder');
    });

    test('should list all templates', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get('/api/v1/message-templates');

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.templates)).toBeTruthy();
    });

    test('should use template to create message', async ({ authenticatedContext }) => {
      // Create template
      const templateResponse = await authenticatedContext.post('/api/v1/message-templates', {
        data: {
          templateName: 'Test Template',
          subject: 'Subject {{variable}}',
          messageBody: 'Body {{variable}}',
          category: 'general',
        },
      });
      const template = await templateResponse.json();

      // Use template
      const response = await authenticatedContext.post('/api/v1/messages/from-template', {
        data: {
          templateId: template.id,
          variables: {
            variable: 'Test Value',
          },
          recipients: 'all_nurses',
        },
      });

      expect(response.ok()).toBeTruthy();
      const message = await response.json();

      expect(message.subject).toContain('Test Value');
      expect(message.messageBody).toContain('Test Value');
    });
  });

  test.describe('Delivery Tracking', () => {
    test('should track message delivery status', async ({ authenticatedContext }) => {
      // Create message
      const createResponse = await authenticatedContext.post('/api/v1/messages', {
        data: {
          ...TEST_MESSAGES.broadcast,
          recipients: 'all_nurses',
          scheduledDate: new Date().toISOString(),
        },
      });
      const message = await createResponse.json();

      // Get delivery status
      const response = await authenticatedContext.get(
        `/api/v1/messages/${message.id}/delivery-status`
      );

      expect(response.ok()).toBeTruthy();
      const status = await response.json();

      expect(status.messageId).toBe(message.id);
      expect(status.totalRecipients).toBeDefined();
      expect(status.delivered).toBeDefined();
    });

    test('should track message opens', async ({ authenticatedContext }) => {
      // Create message
      const createResponse = await authenticatedContext.post('/api/v1/messages', {
        data: {
          ...TEST_MESSAGES.broadcast,
          recipients: 'all_nurses',
          scheduledDate: new Date().toISOString(),
        },
      });
      const message = await createResponse.json();

      // Record open
      const response = await authenticatedContext.post(
        `/api/v1/messages/${message.id}/track-open`,
        {}
      );

      expect(response.ok()).toBeTruthy();
    });
  });

  test.describe('Validation and Error Handling', () => {
    test('should reject message with missing required fields', async ({
      authenticatedContext,
    }) => {
      const invalidData = {
        subject: 'Test',
        // Missing messageBody, messageType, etc.
      };

      const response = await authenticatedContext.post('/api/v1/messages', {
        data: invalidData,
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should reject invalid message type', async ({ authenticatedContext }) => {
      const invalidData = {
        subject: 'Test',
        messageBody: 'Test message',
        messageType: 'invalid_type',
        recipients: 'all_nurses',
      };

      const response = await authenticatedContext.post('/api/v1/messages', {
        data: invalidData,
      });

      expect(response.ok()).toBeFalsy();
      expect(response.status()).toBe(400);
    });

    test('should return 404 for non-existent message', async ({ authenticatedContext }) => {
      const response = await authenticatedContext.get(
        '/api/v1/messages/00000000-0000-0000-0000-000000000000'
      );

      expect(response.status()).toBe(404);
    });
  });
});
