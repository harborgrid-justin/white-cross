/**
 * Communication Redux Slice
 *
 * Redux slice for managing communication messages, notifications, and templates
 * using the entity slice factory pattern.
 *
 * @module pages/communication/store/communicationSlice
 *
 * @remarks
 * - Supports email, SMS, and in-app messaging
 * - Handles scheduled and emergency messages
 * - Provides filtering by category, sender, priority
 * - Manages message delivery status and tracking
 * - Integrates with communicationApi service layer
 *
 * State Structure:
 * - Normalized message entities using EntityAdapter
 * - Loading and error states for async operations
 * - Filter and pagination metadata
 *
 * @example
 * ```typescript
 * // Fetch messages
 * dispatch(communicationThunks.fetchAll({ category: 'ANNOUNCEMENT' }));
 *
 * // Send a message
 * dispatch(communicationThunks.create({
 *   recipients: ['parent123'],
 *   subject: 'School Update',
 *   content: 'Important information...',
 *   category: 'ANNOUNCEMENT'
 * }));
 *
 * // Select messages
 * const messages = communicationSelectors.selectAll(state);
 * const emergencyMessages = selectEmergencyMessages(state);
 * ```
 */

import { createEntitySlice, EntityApiService } from '../../../stores/sliceFactory';
import { communicationApi } from '../../../services';
import type {
  Message,
  CreateMessageData,
  MessageFilters
} from '../../../types/communication';

/**
 * Message update payload.
 *
 * Partial update data for modifying existing messages.
 *
 * @property subject - Updated message subject
 * @property content - Updated message body
 * @property status - Updated delivery status
 * @property priority - Updated priority level
 */
interface UpdateMessageData {
  subject?: string;
  content?: string;
  status?: string;
  priority?: string;
}

// Create API service adapter for communication
const communicationApiService: EntityApiService<Message, CreateMessageData, UpdateMessageData> = {
  async getAll(params?: MessageFilters) {
    const response = await communicationApi.getMessages(params);
    return {
      data: response.messages || [],
      total: response.pagination?.total,
      pagination: response.pagination,
    };
  },

  async getById(id: string) {
    const response = await communicationApi.getMessageById(id);
    return { data: response.message };
  },

  async create(data: CreateMessageData) {
    const response = await communicationApi.sendMessage(data);
    return { data: response.message };
  },

  async update(id: string, data: UpdateMessageData) {
    // Note: Update functionality may need to be implemented in the API
    // For now, return the original message structure
    throw new Error('Message update not implemented in API');
  },

  async delete(id: string) {
    // Note: Delete functionality may need to be implemented in the API
    // For now, return success
    throw new Error('Message delete not implemented in API');
  },
};

// Create the communication slice using the entity factory
const communicationSliceFactory = createEntitySlice<Message, CreateMessageData, UpdateMessageData>(
  'communication',
  communicationApiService,
  {
    enableBulkOperations: true,
  }
);

// Export the slice and its components
export const communicationSlice = communicationSliceFactory.slice;
export const communicationReducer = communicationSlice.reducer;
export const communicationActions = communicationSliceFactory.actions;
export const communicationSelectors = communicationSliceFactory.adapter.getSelectors((state: any) => state.communication);
export const communicationThunks = communicationSliceFactory.thunks;

/**
 * Custom selector: Filter messages by category.
 *
 * @param state - Redux root state
 * @param category - Message category (ANNOUNCEMENT, EMERGENCY, GENERAL, etc.)
 * @returns Filtered array of messages
 *
 * @example
 * ```typescript
 * const announcements = selectMessagesByCategory(state, 'ANNOUNCEMENT');
 * ```
 */
export const selectMessagesByCategory = (state: any, category: string): Message[] => {
  const allMessages = communicationSelectors.selectAll(state) as Message[];
  return allMessages.filter(message => message.category === category);
};

export const selectMessagesBySender = (state: any, senderId: string): Message[] => {
  const allMessages = communicationSelectors.selectAll(state) as Message[];
  return allMessages.filter(message => message.senderId === senderId);
};

export const selectMessagesByPriority = (state: any, priority: string): Message[] => {
  const allMessages = communicationSelectors.selectAll(state) as Message[];
  return allMessages.filter(message => message.priority === priority);
};

/**
 * Custom selector: Get all scheduled (future) messages.
 *
 * Returns messages with scheduledAt timestamp in the future.
 *
 * @param state - Redux root state
 * @returns Array of scheduled messages not yet sent
 */
export const selectScheduledMessages = (state: any): Message[] => {
  const allMessages = communicationSelectors.selectAll(state) as Message[];
  return allMessages.filter(message => message.scheduledAt && new Date(message.scheduledAt) > new Date());
};

/**
 * Custom selector: Get all emergency messages.
 *
 * Filters messages with EMERGENCY category for quick access to critical communications.
 *
 * @param state - Redux root state
 * @returns Array of emergency messages
 */
export const selectEmergencyMessages = (state: any): Message[] => {
  const allMessages = communicationSelectors.selectAll(state) as Message[];
  return allMessages.filter(message => message.category === 'EMERGENCY');
};

export const selectRecentMessages = (state: any, days: number = 7): Message[] => {
  const allMessages = communicationSelectors.selectAll(state) as Message[];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return allMessages.filter(message => {
    const messageDate = new Date(message.createdAt);
    return messageDate >= cutoffDate;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
