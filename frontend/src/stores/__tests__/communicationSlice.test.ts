/**
 * Communication Slice Unit Tests
 *
 * Tests for the Redux communication slice including:
 * - State management
 * - Async thunks
 * - Selectors
 * - Entity normalization
 */

import { configureStore } from '@reduxjs/toolkit';
import {
  communicationReducer,
  communicationActions,
  communicationSelectors,
  communicationThunks,
  selectMessagesByCategory,
  selectMessagesBySender,
  selectMessagesByPriority,
  selectScheduledMessages,
  selectEmergencyMessages,
  selectRecentMessages,
} from '../slices/communicationSlice';
import { communicationApi } from '@/services/api';
import type { Message } from '@/types/communication';

// Mock the communication API
jest.mock('@/services/api', () => ({
  communicationApi: {
    getMessages: jest.fn(),
    getMessageById: jest.fn(),
    sendMessage: jest.fn(),
  },
}));

describe('Communication Slice', () => {
  let store: ReturnType<typeof configureStore>;

  const mockMessage: Message = {
    id: 'msg-123',
    subject: 'Test Message',
    content: 'This is a test message',
    category: 'GENERAL',
    priority: 'MEDIUM',
    senderId: 'user-123',
    recipientCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockEmergencyMessage: Message = {
    id: 'msg-emergency-123',
    subject: 'Emergency Alert',
    content: 'This is an emergency',
    category: 'EMERGENCY',
    priority: 'URGENT',
    senderId: 'user-123',
    recipientCount: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockScheduledMessage: Message = {
    id: 'msg-scheduled-123',
    subject: 'Scheduled Message',
    content: 'This will be sent later',
    category: 'GENERAL',
    priority: 'MEDIUM',
    senderId: 'user-123',
    recipientCount: 1,
    scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        communication: communicationReducer,
      },
    });

    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = store.getState();

      expect(state.communication).toEqual({
        ids: [],
        entities: {},
        loading: {
          fetchAll: false,
          fetchOne: false,
          create: false,
          update: false,
          delete: false,
        },
        error: {
          fetchAll: null,
          fetchOne: null,
          create: null,
          update: null,
          delete: null,
        },
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
        },
      });
    });
  });

  describe('Thunks', () => {
    describe('fetchAll', () => {
      it('should fetch all messages successfully', async () => {
        const mockResponse = {
          messages: [mockMessage],
          pagination: {
            page: 1,
            limit: 20,
            total: 1,
            pages: 1,
          },
        };

        (communicationApi.getMessages as jest.Mock).mockResolvedValue(mockResponse);

        await store.dispatch(communicationThunks.fetchAll({}));

        const state = store.getState();
        const messages = communicationSelectors.selectAll(state);

        expect(messages).toHaveLength(1);
        expect(messages[0].id).toBe(mockMessage.id);
        expect(state.communication.loading.fetchAll).toBe(false);
        expect(state.communication.error.fetchAll).toBeNull();
      });

      it('should handle fetch error', async () => {
        const errorMessage = 'Failed to fetch messages';
        (communicationApi.getMessages as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await store.dispatch(communicationThunks.fetchAll({}));

        const state = store.getState();

        expect(state.communication.loading.fetchAll).toBe(false);
        expect(state.communication.error.fetchAll).toContain(errorMessage);
      });

      it('should set loading state during fetch', async () => {
        const mockResponse = {
          messages: [mockMessage],
          pagination: { page: 1, limit: 20, total: 1, pages: 1 },
        };

        (communicationApi.getMessages as jest.Mock).mockImplementation(() => {
          const state = store.getState();
          expect(state.communication.loading.fetchAll).toBe(true);
          return Promise.resolve(mockResponse);
        });

        await store.dispatch(communicationThunks.fetchAll({}));
      });

      it('should filter messages by category', async () => {
        const mockResponse = {
          messages: [mockEmergencyMessage],
          pagination: { page: 1, limit: 20, total: 1, pages: 1 },
        };

        (communicationApi.getMessages as jest.Mock).mockResolvedValue(mockResponse);

        await store.dispatch(communicationThunks.fetchAll({ category: 'EMERGENCY' }));

        expect(communicationApi.getMessages).toHaveBeenCalledWith(
          expect.objectContaining({ category: 'EMERGENCY' })
        );
      });
    });

    describe('fetchOne', () => {
      it('should fetch single message successfully', async () => {
        const mockResponse = {
          message: mockMessage,
        };

        (communicationApi.getMessageById as jest.Mock).mockResolvedValue(mockResponse);

        await store.dispatch(communicationThunks.fetchOne('msg-123'));

        const state = store.getState();
        const message = communicationSelectors.selectById(state, 'msg-123');

        expect(message).toBeDefined();
        expect(message?.id).toBe('msg-123');
        expect(state.communication.loading.fetchOne).toBe(false);
      });

      it('should handle fetch one error', async () => {
        const errorMessage = 'Message not found';
        (communicationApi.getMessageById as jest.Mock).mockRejectedValue(
          new Error(errorMessage)
        );

        await store.dispatch(communicationThunks.fetchOne('nonexistent-id'));

        const state = store.getState();

        expect(state.communication.loading.fetchOne).toBe(false);
        expect(state.communication.error.fetchOne).toContain(errorMessage);
      });
    });

    describe('create', () => {
      it('should create message successfully', async () => {
        const createData = {
          recipients: [{ type: 'PARENT' as const, id: 'parent-123', email: 'parent@example.com' }],
          content: 'New message',
          category: 'GENERAL' as const,
        };

        const mockResponse = {
          message: { ...mockMessage, ...createData },
        };

        (communicationApi.sendMessage as jest.Mock).mockResolvedValue(mockResponse);

        await store.dispatch(communicationThunks.create(createData));

        const state = store.getState();
        const messages = communicationSelectors.selectAll(state);

        expect(messages).toHaveLength(1);
        expect(state.communication.loading.create).toBe(false);
        expect(state.communication.error.create).toBeNull();
      });

      it('should handle create error', async () => {
        const errorMessage = 'Failed to send message';
        (communicationApi.sendMessage as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await store.dispatch(
          communicationThunks.create({
            recipients: [{ type: 'PARENT' as const, id: 'parent-123' }],
            content: 'Test',
            category: 'GENERAL' as const,
          })
        );

        const state = store.getState();

        expect(state.communication.loading.create).toBe(false);
        expect(state.communication.error.create).toContain(errorMessage);
      });
    });
  });

  describe('Selectors', () => {
    beforeEach(() => {
      // Add test messages to store
      store.dispatch(
        communicationActions.setAll([
          mockMessage,
          mockEmergencyMessage,
          mockScheduledMessage,
        ])
      );
    });

    describe('selectAll', () => {
      it('should select all messages', () => {
        const state = store.getState();
        const messages = communicationSelectors.selectAll(state);

        expect(messages).toHaveLength(3);
      });
    });

    describe('selectById', () => {
      it('should select message by id', () => {
        const state = store.getState();
        const message = communicationSelectors.selectById(state, 'msg-123');

        expect(message).toBeDefined();
        expect(message?.id).toBe('msg-123');
      });

      it('should return undefined for non-existent id', () => {
        const state = store.getState();
        const message = communicationSelectors.selectById(state, 'nonexistent-id');

        expect(message).toBeUndefined();
      });
    });

    describe('selectMessagesByCategory', () => {
      it('should filter messages by category', () => {
        const state = store.getState();
        const emergencyMessages = selectMessagesByCategory(state, 'EMERGENCY');

        expect(emergencyMessages).toHaveLength(1);
        expect(emergencyMessages[0].id).toBe('msg-emergency-123');
      });

      it('should return empty array for non-existent category', () => {
        const state = store.getState();
        const messages = selectMessagesByCategory(state, 'NONEXISTENT');

        expect(messages).toHaveLength(0);
      });
    });

    describe('selectMessagesBySender', () => {
      it('should filter messages by sender', () => {
        const state = store.getState();
        const messages = selectMessagesBySender(state, 'user-123');

        expect(messages).toHaveLength(3); // All mock messages have same sender
      });

      it('should return empty array for non-existent sender', () => {
        const state = store.getState();
        const messages = selectMessagesBySender(state, 'nonexistent-user');

        expect(messages).toHaveLength(0);
      });
    });

    describe('selectMessagesByPriority', () => {
      it('should filter messages by priority', () => {
        const state = store.getState();
        const urgentMessages = selectMessagesByPriority(state, 'URGENT');

        expect(urgentMessages).toHaveLength(1);
        expect(urgentMessages[0].id).toBe('msg-emergency-123');
      });

      it('should filter medium priority messages', () => {
        const state = store.getState();
        const mediumMessages = selectMessagesByPriority(state, 'MEDIUM');

        expect(mediumMessages).toHaveLength(2);
      });
    });

    describe('selectScheduledMessages', () => {
      it('should select only future scheduled messages', () => {
        const state = store.getState();
        const scheduledMessages = selectScheduledMessages(state);

        expect(scheduledMessages).toHaveLength(1);
        expect(scheduledMessages[0].id).toBe('msg-scheduled-123');
      });

      it('should not include past scheduled messages', () => {
        const pastScheduledMessage: Message = {
          ...mockMessage,
          id: 'msg-past-scheduled',
          scheduledAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        };

        store.dispatch(communicationActions.addOne(pastScheduledMessage));

        const state = store.getState();
        const scheduledMessages = selectScheduledMessages(state);

        expect(scheduledMessages).not.toContainEqual(
          expect.objectContaining({ id: 'msg-past-scheduled' })
        );
      });
    });

    describe('selectEmergencyMessages', () => {
      it('should select only emergency messages', () => {
        const state = store.getState();
        const emergencyMessages = selectEmergencyMessages(state);

        expect(emergencyMessages).toHaveLength(1);
        expect(emergencyMessages[0].category).toBe('EMERGENCY');
      });
    });

    describe('selectRecentMessages', () => {
      it('should select messages from last 7 days by default', () => {
        const state = store.getState();
        const recentMessages = selectRecentMessages(state);

        expect(recentMessages.length).toBeGreaterThan(0);
      });

      it('should select messages from custom time window', () => {
        const oldMessage: Message = {
          ...mockMessage,
          id: 'msg-old',
          createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), // 10 days ago
        };

        store.dispatch(communicationActions.addOne(oldMessage));

        const state = store.getState();
        const last7Days = selectRecentMessages(state, 7);
        const last14Days = selectRecentMessages(state, 14);

        expect(last7Days).not.toContainEqual(expect.objectContaining({ id: 'msg-old' }));
        expect(last14Days).toContainEqual(expect.objectContaining({ id: 'msg-old' }));
      });

      it('should sort messages by creation date descending', () => {
        const state = store.getState();
        const recentMessages = selectRecentMessages(state);

        if (recentMessages.length > 1) {
          for (let i = 0; i < recentMessages.length - 1; i++) {
            const current = new Date(recentMessages[i].createdAt).getTime();
            const next = new Date(recentMessages[i + 1].createdAt).getTime();
            expect(current).toBeGreaterThanOrEqual(next);
          }
        }
      });
    });
  });

  describe('Entity Normalization', () => {
    it('should normalize messages by id', () => {
      store.dispatch(communicationActions.addOne(mockMessage));

      const state = store.getState();

      expect(state.communication.ids).toContain('msg-123');
      expect(state.communication.entities['msg-123']).toEqual(mockMessage);
    });

    it('should handle duplicate additions', () => {
      store.dispatch(communicationActions.addOne(mockMessage));
      store.dispatch(communicationActions.addOne(mockMessage));

      const state = store.getState();
      const messages = communicationSelectors.selectAll(state);

      expect(messages).toHaveLength(1);
    });

    it('should update existing message', () => {
      store.dispatch(communicationActions.addOne(mockMessage));

      const updatedMessage = { ...mockMessage, subject: 'Updated Subject' };
      store.dispatch(communicationActions.updateOne({ id: 'msg-123', changes: updatedMessage }));

      const state = store.getState();
      const message = communicationSelectors.selectById(state, 'msg-123');

      expect(message?.subject).toBe('Updated Subject');
    });

    it('should remove message', () => {
      store.dispatch(communicationActions.addOne(mockMessage));
      store.dispatch(communicationActions.removeOne('msg-123'));

      const state = store.getState();
      const message = communicationSelectors.selectById(state, 'msg-123');

      expect(message).toBeUndefined();
    });

    it('should add many messages', () => {
      const messages = [mockMessage, mockEmergencyMessage, mockScheduledMessage];

      store.dispatch(communicationActions.addMany(messages));

      const state = store.getState();
      const allMessages = communicationSelectors.selectAll(state);

      expect(allMessages).toHaveLength(3);
    });

    it('should set all messages (replace)', () => {
      store.dispatch(communicationActions.addOne(mockMessage));

      const newMessages = [mockEmergencyMessage, mockScheduledMessage];
      store.dispatch(communicationActions.setAll(newMessages));

      const state = store.getState();
      const allMessages = communicationSelectors.selectAll(state);

      expect(allMessages).toHaveLength(2);
      expect(allMessages).not.toContainEqual(expect.objectContaining({ id: 'msg-123' }));
    });

    it('should remove many messages', () => {
      store.dispatch(
        communicationActions.addMany([mockMessage, mockEmergencyMessage, mockScheduledMessage])
      );

      store.dispatch(communicationActions.removeMany(['msg-123', 'msg-emergency-123']));

      const state = store.getState();
      const allMessages = communicationSelectors.selectAll(state);

      expect(allMessages).toHaveLength(1);
      expect(allMessages[0].id).toBe('msg-scheduled-123');
    });

    it('should remove all messages', () => {
      store.dispatch(
        communicationActions.addMany([mockMessage, mockEmergencyMessage, mockScheduledMessage])
      );

      store.dispatch(communicationActions.removeAll());

      const state = store.getState();
      const allMessages = communicationSelectors.selectAll(state);

      expect(allMessages).toHaveLength(0);
    });
  });

  describe('Pagination', () => {
    it('should update pagination state', async () => {
      const mockResponse = {
        messages: [mockMessage],
        pagination: {
          page: 2,
          limit: 10,
          total: 50,
          pages: 5,
        },
      };

      (communicationApi.getMessages as jest.Mock).mockResolvedValue(mockResponse);

      await store.dispatch(communicationThunks.fetchAll({ page: 2, limit: 10 }));

      const state = store.getState();

      expect(state.communication.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 50,
        pages: 5,
      });
    });
  });

  describe('Error Handling', () => {
    it('should clear error on successful fetch', async () => {
      // Set initial error
      (communicationApi.getMessages as jest.Mock).mockRejectedValue(new Error('Initial error'));
      await store.dispatch(communicationThunks.fetchAll({}));

      let state = store.getState();
      expect(state.communication.error.fetchAll).toBeTruthy();

      // Clear error with successful fetch
      const mockResponse = {
        messages: [mockMessage],
        pagination: { page: 1, limit: 20, total: 1, pages: 1 },
      };
      (communicationApi.getMessages as jest.Mock).mockResolvedValue(mockResponse);
      await store.dispatch(communicationThunks.fetchAll({}));

      state = store.getState();
      expect(state.communication.error.fetchAll).toBeNull();
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent fetches', async () => {
      const mockResponse = {
        messages: [mockMessage],
        pagination: { page: 1, limit: 20, total: 1, pages: 1 },
      };

      (communicationApi.getMessages as jest.Mock).mockResolvedValue(mockResponse);

      await Promise.all([
        store.dispatch(communicationThunks.fetchAll({})),
        store.dispatch(communicationThunks.fetchAll({})),
        store.dispatch(communicationThunks.fetchAll({})),
      ]);

      const state = store.getState();
      expect(state.communication.loading.fetchAll).toBe(false);
    });
  });
});
