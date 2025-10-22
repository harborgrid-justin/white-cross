/**
 * Communication Slice
 * 
 * Redux slice for managing communication messages using the slice factory.
 * Handles CRUD operations for messages, notifications, and templates.
 */

import { createEntitySlice, EntityApiService } from '../../../stores/sliceFactory';
import { communicationApi } from '../../../services';
import type {
  Message,
  CreateMessageData,
  MessageFilters
} from '../../../types/communication';

// Message update data (local interface for partial updates)
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

// Export custom selectors
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

export const selectScheduledMessages = (state: any): Message[] => {
  const allMessages = communicationSelectors.selectAll(state) as Message[];
  return allMessages.filter(message => message.scheduledAt && new Date(message.scheduledAt) > new Date());
};

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
